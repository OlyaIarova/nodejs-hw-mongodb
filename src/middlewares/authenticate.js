import createHttpError from 'http-errors'; //для створення HTTP помилок

import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization'); //Отримання заголовка авторизації

  if (!authHeader) {
    //якщо заголовок відсутній, викликає помилку
    next(createHttpError(401, 'Please provide Authorization header'));
    return;
  }

  //розділення заголовка на тип та токен
  const bearer = authHeader.split(' ')[0];
  const token = authHeader.split(' ')[1];

  if (bearer !== 'Bearer' || !token) {
    //якщо відсутній, викликає помилку 401 і завершує виконання
    next(createHttpError(401, 'Auth header should be of type Bearer'));
    return;
  }

  const session = await SessionsCollection.findOne({ accessToken: token }); //шукає сесію в колекції sessions за токеном доступу

  if (!session) {
    //якщо сесія не знайдена, викликає помилку і завершує виконання
    next(createHttpError(401, 'Session not found'));
    return;
  }

  //перевірка терміну дії токена доступу, якщо закінчився, викликає помилку
  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);

  if (isAccessTokenExpired) {
    next(createHttpError(401, 'Access token expired'));
  }

  //пошук користувача за ID, якщо користувач не знайдений, викликає помилку
  const user = await UsersCollection.findById(session.userId);

  if (!user) {
    next(createHttpError(401));
    return;
  }

  req.user = user; //зберігає знайденого користувача в об'єкті req, щоб інші middleware або контролери могли використовувати інформацію про автентифікованого користувача

  next(); //викликає наступний middleware у ланцюжку
};



//Цей middleware забезпечує автентифікацію користувачів на основі токенів доступу. Він перевіряє наявність та правильність заголовка авторизації, шукає сесію за токеном, перевіряє термін дії токена та знаходить відповідного користувача
