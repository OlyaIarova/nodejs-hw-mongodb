import bcrypt from 'bcrypt';//bcrypt використовується для хешування паролів
import { randomBytes } from 'crypto';//використовується для генерації випадкових токенів
import jwt from 'jsonwebtoken'; // для роботи з JWT-токенами
import handlebars from 'handlebars';//для шаблонів електронної пошти
import path from 'node:path'; // надає утиліти
import fs from 'node:fs/promises';//надає проміси
import createHttpError from 'http-errors';//для створення HTTP-помилок

import { UsersCollection } from '../db/models/user.js';//колекція користувачів у базі даних
import {
  FIFTEEN_MINUTES,
  THIRTY_DAY,
  SMTP,
  TEMPLATES_DIR,
} from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';//колекція сесій у базі даних
import { env } from '../utils/env.js';// модуль для доступу до змінних середовища
import { sendEmail } from '../utils/sendMail.js';//утиліта для надсилання електронних листів
import {
  getFullNameFromGoogleTokenPayload,
  validateCode,
} from '../utils/googleOAuth2.js';//утиліти для роботи з Google OAuth 2.0


//Реєстрація користувача
export const registerUser = async (payload) => {//перевіряється, чи існує користувач з вказаною електронною адресою
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use'); //якщо користувач існує, кидається помилка 409 (конфлікт)

  const encryptedPassword = await bcrypt.hash(payload.password, 10); //якщо користувач не існує, пароль хешується

  return await UsersCollection.create({ //cтворює нового користувача в базі даних
    ...payload,
    password: encryptedPassword,
  });
};

//вхід користувача
export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email }); //перевіряється наявність користувача з вказаною електронною адресою

  if (!user) {
    throw createHttpError(404, 'User not found'); //якщо користувач не знайдений, кидається помилка 404.
  }
  const isEqual = await bcrypt.compare(payload.password, user.password); //якщо користувач знайдений, перевіряється правильність паролю

  if (!isEqual) {//якщо пароль неправильний, кидається помилка 401 (не авторизовано).
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionsCollection.deleteOne({ userId: user._id }); //якщо пароль правильний, видаляється попередня сесія користувача
  // Генерує нові токени
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await SessionsCollection.create({ //створюється нова сесія 
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAY),
  });
};

 //вихід користувача
export const logoutUser = async (sessionId) => {//видаляється сесія користувача з вказаним sessionId
  await SessionsCollection.deleteOne({ _id: sessionId });
};

//створення нової сесії
const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {//повертається об'єкт з новими токенами і терміном їх дії
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAY),
  };
};

//оновлення сесії користувача
export const refreshUsersSession = async ({ sessionId, refreshToken }) => {//перевіряється наявність сесії
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {//якщо сесія не знайдена, кидається помилка
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired = //Перевіряє, чи не прострочений токен сесії
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {//якщо токен сесії прострочений, кидається помилка
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession(); //якщо токен валідний, створюється нова сесія

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken }); //Видаляє стару сесію

  return await SessionsCollection.create({//повертається нова сесія з новими токенами
    userId: session.userId,
    ...newSession,
  });
};

//запит на скидання пароля
export const requestResetToken = async (email) => {// Перевіряє, чи існує користувач з вказаною електронною адресою
  const user = await UsersCollection.findOne({ email });
  if (!user) {// Якщо користувач не знайдений, кидає помилку 404
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(//Генерує токен для скидання пароля
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );
  // console.log({ resetToken });

  const resetPasswordTemplatePath = path.join(// Створює HTML-лист з допомогою шаблону
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  await sendEmail({//Відправляє лист користувачу
    from: env(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html,
  });
};

//скидання пароля
export const resetPassword = async (payload) => {
  let entries;

  try {//Перевіряє валідність токена для скидання пароля
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }
  // console.log(entries);
  const user = await UsersCollection.findOne({//Перевіряє валідність токена для скидання пароля
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10); //Хешує новий пароль

  await UsersCollection.updateOne(// Оновлює пароль користувача в базі даних
    { _id: user._id },
    { password: encryptedPassword },
  );
};
//вхід або реєстрація через Google
export const loginOrSignupWithGoogle = async (code) => {
  const loginTicket = await validateCode(code); //Валідація коду автентифікації, перевіряє код автентифікації, отриманий від Google після успішного входу користувача через Google OAuth
  const payload = loginTicket.getPayload(); //Отримання інформації з токена, витягує корисне навантаження (payload) з автентифікаційного квитка (loginTicket), що містить інформацію про користувача
  if (payload === 'undefined') throw createHttpError(401);

  let user = await UsersCollection.findOne({ email: payload.email }); //Перевірка наявності користувача в базі даних
  if (!user) {//Реєстрація нового користувача, якщо його не існує
    const password = await bcrypt.hash(randomBytes(10), 10); //для створення випадкового пароля
    user = await UsersCollection.create({
      email: payload.email,
      name: getFullNameFromGoogleTokenPayload(payload),
      password,
      role: 'parent',
    });
  }

  const newSession = createSession(); //Створення нової сесії

  return await SessionsCollection.create({
    userId: user._id, //сесія прив'язується до конкретного користувача через його унікальний ідентифікатор (user._id)
    ...newSession,
  });
};


//код забезпечує функціонал реєстрації, автентифікації, управління сесіями, скидання паролів і входу через Google у веб-додатку