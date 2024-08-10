import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';

const bootstrap = async () => {
  await initMongoConnection(); // для встановлення з'єднання з MongoDB
 await createDirIfNotExists(TEMP_UPLOAD_DIR);
 await createDirIfNotExists(UPLOAD_DIR);
  setupServer(); //для налаштування та запуску сервера
};

bootstrap();//для ініціалізації з'єднання з базою даних і налаштування сервера
