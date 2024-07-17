import { Router } from 'express'; // імпортує Router з Express
import { ctrlWrapper } from '../utils/ctrlWrapper.js';// імпортує обгортку контролера для обробки помилок
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  patchContactController,
} from '../controllers/contacts.js';// імпортує контролери для обробки запитів

const router = Router();// створює новий маршрутизатор

// визначення маршрутів
router.get('/contacts', ctrlWrapper(getContactsController));// маршрут для отримання всіх контактів

router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));// маршрут для отримання контакту за ідентифікатором

router.post('/contacts', ctrlWrapper(createContactController));// маршрут для створення нового контакту

router.patch('/contacts/:contactId', ctrlWrapper(patchContactController));// маршрут для оновлення контакту за ідентифікатором

router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));// маршрут для видалення контакту за ідентифікатором

export default router;



//визначає всі маршрути для роботи з контактами у застосунку. Він визначає, які контролери будуть обробляти запити до цих маршрутів