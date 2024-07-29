import { Router } from 'express'; // імпортує Router з Express
import { ctrlWrapper } from '../utils/ctrlWrapper.js';// імпортує обгортку контролера для обробки помилок
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  patchContactController,
} from '../controllers/contacts.js';// імпортує контролери для обробки запитів
import { validateBody } from '../middlewares/validateBody.js';// імпортує middleware для валідації тіла запиту
import {createContactSchema, updateContactSchema,} from '../validation/contacts.js';// імпортує схеми валідації для контактів
import { isValidId } from '../middlewares/isValidId.js';// Імпортує middleware для перевірки валідності ID

const router = Router();// створює новий маршрутизатор

// визначення маршрутів
router.get('/contacts', ctrlWrapper(getContactsController));// маршрут для отримання всіх контактів

router.get(
  '/contacts/:contactId',
  isValidId, //для перевірки валідності ID
  ctrlWrapper(getContactByIdController), //для обробки контролера
);// маршрут для отримання контакту за ідентифікатором

router.post(
  '/contacts',
  validateBody(createContactSchema), //для валідації тіла запиту
  ctrlWrapper(createContactController),
);// маршрут для створення нового контакту

router.patch(
  '/contacts/:contactId',
  isValidId, //для перевірки валідності ID
  validateBody(updateContactSchema), //для валідації тіла запиту
  ctrlWrapper(patchContactController), //для обробки контролера
);// маршрут для оновлення контакту за ідентифікатором

router.delete(
  '/contacts/:contactId',
  isValidId, //для перевірки валідності ID
  ctrlWrapper(deleteContactController), //для обробки контролера
);// маршрут для видалення контакту за ідентифікатором

export default router;



//визначає всі маршрути для роботи з контактами у застосунку. Він визначає, які контролери будуть обробляти запити до цих маршрутів