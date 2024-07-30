import express from 'express'; //основний модуль для створення сервера
import pino from 'pino-http'; //для логування HTTP-запитів
import cors from 'cors'; //для налаштування політики CORS

import { env } from './utils/env.js'; //для роботи зі змінними середовища
import contactsRouter from './routers/contacts.js'; //для обробки маршрутів, пов'язаних з контактами
import { notFoundHandler } from './middlewares/notFoundHandler.js'; //для обробки неіснуючих маршрутів
import { errorHandler } from './middlewares/errorHandler.js'; //для глобальної обробки помилок

const PORT = Number(env('PORT', '3000')); //номер порту зі змінної середовища PORT, або використовується порт 3000 за замовчуванням

export const setupServer = () => {
  const app = express();

  app.use(express.json()); //для обробки JSON-тіл запитів

  app.use(cors()); //для дозволу крос-доменних запитів

  app.use(pino({ transport: { target: 'pino-pretty' } })); //ля логування HTTP-запитів

  app.use('/contacts', contactsRouter); //реєструє маршрутизатор

  app.use(errorHandler); //для глобальної обробки помилок

  app.use('*', notFoundHandler); //для обробки всіх неіснуючих маршрутів

  app.listen(PORT, () => {
    //запускає сервер на порту та виводить повідомлення про успішний запуск у консоль
    console.log(`Server is running on port ${PORT}`);
  });
};
