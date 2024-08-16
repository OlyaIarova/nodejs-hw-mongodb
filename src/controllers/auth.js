import {
  loginUser,
  logoutUser,
  registerUser,
  refreshUsersSession,
  requestResetToken,
  resetPassword,
  loginOrSignupWithGoogle,
} from '../services/auth.js';//для обробки аутентифікації користувачів
import { THIRTY_DAY } from '../constants/index.js';//константа, що визначає тривалість сесії у мілісекундах (30 днів)
import { generateAuthUrl } from '../utils/googleOAuth2.js';

//Контролер реєстрації користувача
export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

//Контролер входу користувача
export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {//встановлює cookies з терміном дії 30 днів.
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAY),
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

//Контролер виходу користувача
export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {//для завершення сесії
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

// налаштування сесії з терміном дії 30 днів
const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAY),
  });
};

//Контролер оновлення сесії користувача
export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session); //для налаштування нових cookies

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

// для запиту скидання паролю
export const requestResetEmailController = async (req, res) => {
  //генерує токен для скидання паролю і надсилає його на електронну пошту користувача
  await requestResetToken(req.body.email);
  res.json({
    status: 200,
    message: 'Reset password email was successfully sent!',
    data: {},
  });
};

//для скидання паролю користувача
export const resetPasswordController = async (req, res) => {
  //змінює пароль користувача у базі даних на новий
  await resetPassword(req.body);
  res.json({
    status: 200,
    message: 'Password was successfully reset!',
    data: {},
  });
};

//надання клієнту URL для авторизації через Google OAuth 2.0
export const getGoogleOAuthUrlController = async (req, res) => {
  const url = generateAuthUrl(); //генерує URL для авторизації користувача через Google OAuth 2.0., URL використовується для перенаправлення користувача на сторінку авторизації Google, де він може дозволити доступ до свого профілю та інших даних
  console.log(url);
  res.json({
    status: 200,
    message: 'Successfully get Google OAuth url!',
    data: {//повертається сам URL для подальшого використання на фронтенді
      url,
    },
  });
};

//вхід користувача за допомогою Google OAuth 2.0 та створює нову сесію для користувача
export const loginWithGoogleController = async (req, res) => {
  const session = await loginOrSignupWithGoogle(req.body.code); //отримує код, який був переданий клієнтом після того, як користувач успішно авторизувався через Google та обробляє його
  setupSession(res, session); //налаштовує сесію для користувача

  res.json({
    status: 200,
    message: 'Successfully logged in via Google OAuth!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

//код відповідає за аутентифікацію користувачів у веб-додатку. Він реалізує кілька контролерів для роботи з користувачами, таких як реєстрація, вхід, вихід, оновлення сесії, а також запити на скидання паролю. 