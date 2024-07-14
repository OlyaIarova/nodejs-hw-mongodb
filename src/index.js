import { initMongoConnection } from './db/initMongoConnection';
import { setupServer } from './server';

const bootstrap = async () => {
  await initMongoConnection(); //викликаю initMongoConnection для встановлення з'єднання з MongoDB
  setupServer(); //для налаштування та запуску сервера
};

bootstrap();//для ініціалізації з'єднання з базою даних і налаштування сервера
