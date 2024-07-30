import { isValidObjectId } from 'mongoose'; //функція для перевірки, чи є заданий ID дійсним об'єктом ID MongoDB
import createHttpError from 'http-errors'; //модуль для створення HTTP-помилок

export const isValidId = (req, res, next) => {
  const { contactId } = req.params; //отримання параметра contactId з запиту
  if (!isValidObjectId(contactId)) { //перевірка, чи є contactId дійсним об'єктом ID MongoDB
    return next(createHttpError(400, 'Bad Request: Invalid ID')); //якщо ID недійсний, створюється і передається помилка 400
  }
  next(); //якщо ID дійсний, продовжити до наступного middleware або контролера
};
