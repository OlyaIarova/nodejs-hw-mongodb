import bcrypt from 'bcrypt';//bcrypt використовується для хешування паролів
import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';//використовується для генерації випадкових токенів

import { UsersCollection } from '../db/models/user.js';
import { FIFTEEN_MINUTES, THIRTY_DAY } from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';


//Реєстрація користувача
export const registerUser = async (payload) => {
  //перевіряється, чи існує користувач з вказаною електронною адресою
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use'); //якщо користувач існує, кидається помилка 409 (конфлікт)

  const encryptedPassword = await bcrypt.hash(payload.password, 10); //якщо користувач не існує, пароль хешується і новий користувач створюється в колекції UsersCollection.

  return await UsersCollection.create({
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

  if (!isEqual) {
    //якщо пароль неправильний, кидається помилка 401 (не авторизовано).
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionsCollection.deleteOne({ userId: user._id });//якщо пароль правильний, видаляється попередня сесія користувача 

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await SessionsCollection.create({
    //створюється нова сесія в SessionsCollection з новими токенами і терміном їх дії
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAY),
  });
};

export const logoutUser = async (sessionId) => {
  //вихід користувача, видаляється сесія користувача з вказаним sessionId
  await SessionsCollection.deleteOne({ _id: sessionId });
};

//створення нової сесії
const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    //повертається об'єкт з новими токенами і терміном їх дії
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAY),
  };
};

//оновлення сесії користувача
export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    //перевіряється наявність сесії з вказаним sessionId і refreshToken
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    //якщо сесія не знайдена, кидається помилка
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    //якщо токен сесії прострочений, кидається помилка
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession(); //якщо токен валідний, створюється нова сесія і стара видаляється

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionsCollection.create({
    //повертається нова сесія з новими токенами
    userId: session.userId,
    ...newSession,
  });
};
