import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

const bootstrap = async () => {
  await initMongoConnection(); // для встановлення з'єднання з MongoDB
  setupServer(); //для налаштування та запуску сервера
};
export const SORT_ORDER = {//об'єкт, який визначає константи для сортування
  ASC: 'asc', //зростання
  DESC: 'desc', //спадання
};

bootstrap();//для ініціалізації з'єднання з базою даних і налаштування сервера
