import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUsersSession,
} from '../services/auth.js';//для обробки аутентифікації користувачів
import { THIRTY_DAY } from '../constants/index.js';//константа, що визначає тривалість сесії у мілісекундах (30 днів)

//Контролер реєстрації користувача
export const registerUserController = async (req, res) => {
  //для реєстрації нового користувача з даними з req.body
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

//Контролер входу користувача
export const loginUserController = async (req, res) => {
  //для входу користувача з даними з req.body
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
  if (req.cookies.sessionId) {
    //викликає logoutUser для завершення сесії
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
    //для оновлення сесії з даними з cookies.
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session); //для налаштування нових cookies

  res.status(200).json({//відповідь
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
