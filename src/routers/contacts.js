import { Router } from 'express'; // імпортує Router з Express
import { ctrlWrapper } from '../utils/ctrlWrapper.js'; // імпортує обгортку контролера для обробки помилок
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  patchContactController,
} from '../controllers/contacts.js'; // імпортує контролери для обробки запитів
import { validateBody } from '../middlewares/validateBody.js'; // імпортує middleware для валідації тіла запиту
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js'; // імпортує схеми валідації для контактів
import { isValidId } from '../middlewares/isValidId.js'; // Імпортує middleware для перевірки валідності ID
import { authenticate } from '../middlewares/authenticate.js';

const router = Router(); // створює новий маршрутизатор

router.use(authenticate);//використання middleware для аутентифікації

router.get('/', ctrlWrapper(getContactsController)); // маршрут для отримання всіх контактів

router.get(
  '/:contactId',
  isValidId, //для перевірки валідності ID
  ctrlWrapper(getContactByIdController), //для обробки контролера
); // маршрут для отримання контакту за ідентифікатором

router.post(
  '/',
  validateBody(createContactSchema), //для валідації тіла запиту
  ctrlWrapper(createContactController),
); // маршрут для створення нового контакту

router.patch(
  '/:contactId',
  isValidId, //для перевірки валідності ID
  validateBody(updateContactSchema), //для валідації тіла запиту
  ctrlWrapper(patchContactController), //для обробки контролера
); // маршрут для оновлення контакту за ідентифікатором

router.delete(
  '/:contactId',
  isValidId, //для перевірки валідності ID
  ctrlWrapper(deleteContactController), //для обробки контролера
); // маршрут для видалення контакту за ідентифікатором

export default router;
