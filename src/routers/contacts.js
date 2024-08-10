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
import { upload } from '../middlewares/multer.js';

const router = Router(); // створює новий маршрутизатор

router.use(authenticate);// для аутентифікації

router.get('/', ctrlWrapper(getContactsController)); // маршрут для отримання всіх контактів

router.get(// маршрут для отримання контакту за ідентифікатором
  '/:contactId',
  isValidId, 
  ctrlWrapper(getContactByIdController),
); 

router.post(
  // маршрут для створення нового контакту
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
); 

router.patch(
  // маршрут для оновлення контакту за ідентифікатором
  '/:contactId',
  upload.single('photo'),
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
); 

router.delete(// маршрут для видалення контакту за ідентифікатором
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController),
); 

export default router;


//код визначає маршрути для операцій з контактами, включаючи створення, отримання, оновлення та видалення контактів
