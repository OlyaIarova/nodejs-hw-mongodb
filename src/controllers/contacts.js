import createHttpError from 'http-errors'; //бібліотека для створення HTTP помилок з різними статусами
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';// сервіси для роботи з контактами
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

// контролер для отримання всіх контактів
export const getContactsController = async (req, res ) => {
 const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
  }); //викликається для отримання всіх контактів
  res.status(200).json({ //відправляє відповідь з кодом 200
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

// контролер для отримання контакту за ідентифікатором
export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await getContactById(contactId); //для отримання контакту за ідентифікатором
  if (!contact) {
    next(createHttpError(404, 'Contact not found')); // відправляє 404 помилку, якщо контакт не знайдено
    return;
  }

  res.status(200).json({
    //повертає знайдений контакт з кодом 200
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

// контролер для створення нового контакту
export const createContactController = async (req, res, next) => {
  const { name, phoneNumber } = req.body; 

  if (!name || !phoneNumber) {//перевіряє, чи є name і phoneNumber у тілі запиту
    next(createHttpError(400, 'Name and phoneNumber are required')); //відправляє 400 помилку, якщо дані не повні
    return;
  }
  delete req.body._V; // видаляє потенційний зайвий атрибут з тіла запиту
  const contact = await createContact(req.body);

  res.status(201).json({
    //створює новий контакт і повертає його з кодом 201
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

// контролер для оновлення контакту за ідентифікатором
export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body); //для оновлення контакту за ідентифікатором

  if (!result) {
    next(createHttpError(404, 'Contact not found')); //відправляє 404 помилку, якщо контакт не знайдено
    return;
  }

  res.json({
    //повертає оновлений контакт з кодом 200
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};

// контролер для видалення контакту за ідентифікатором
export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await deleteContact(contactId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found')); //відправляє 404 помилку, якщо контакт не знайдено
    return;
  }

  res.status(204).send(); //відправляє відповідь без вмісту
};

