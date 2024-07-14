import express from 'express';
import pino from 'pino-http'; //для логування HTTP-запитів
import cors from 'cors';//для налаштування політики CORS
import { env } from './utils/env.js';//для роботи зі змінними середовища
import { getAllContacts, getContactById } from './services/contacts.js';//для роботи з контактами

const PORT = Number(env('PORT', '3000'));//номер порту зі змінної середовища PORT, або використовується порт 3000 за замовчуванням

export const setupServer = () => {
  const app = express();

  app.use(express.json()); //для обробки JSON-тіл запитів
  app.use(cors()); //для дозволу крос-доменних запитів

  app.use(pino({ transport: { target: 'pino-pretty' } })); //ля логування HTTP-запитів

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await getAllContacts(); //отримання всіх контактів
      res.status(200).json({//запит успішний
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (err) {//виникла помилка
      res.status(500).json({
        status: 500,
        message: 'Failed to fetch contacts',
        error: err.message,
      });
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    try {
      const { contactId } = req.params; //отримання ID контакту з параметрів запиту

      const contact = await getContactById(contactId); //отримання контакту за його ID
      if (!contact) { //якщо контакт не знайдено
        return res.status(404).json({
          status: 404,
          message: `Contact with id ${contactId} not found`,
        });
      }

      res.status(200).json({//запит успішний
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
      });
    } catch (err) {//виникла помилка
      res.status(500).json({
        status: 500,
        message: 'Failed to fetch contact',
        error: err.message,
      });
    }
  });

  app.use('*', (req, res) => {//обробляю всі інші маршрути
    res.status(404).json({// маршрут не знайдено
      message: 'Not found',
    });
  });

  app.use((err, req, res) => {//глобальний обробник помилок
    res.status(500).json({//повідомленням про помилку
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {//запуск сервера на вказаному порту
    console.log(`Server is running on port ${PORT}`);
  });
};