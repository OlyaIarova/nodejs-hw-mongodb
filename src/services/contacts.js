import { ContactsCollection } from '../db/models/contact.js';//модель для роботи з колекцією контактів у MongoDB
import { SORT_ORDER } from '../index.js';//константа з порядком сортування 
import { calculatePaginationData } from '../utils/calculatePaginationData.js';//для обчислення даних пагінації

export const getAllContacts = async ({
  //приймає об'єкт з параметрами пагінації та сортування
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage; //кількість елементів на сторінку
  const skip = (page - 1) * perPage; //кількість пропущених елементів
  const contactsQuery = ContactsCollection.find(); //запит до колекції контактів

  // Фільтрація по типу контакту
  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }
  // Фільтрація по улюблених контактах
  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  // const contactsCount = await ContactsCollection.find() //загальна кількість документів у колекції
  //   .merge(contactsQuery)
  //   .countDocuments();
  // const contacts = await contactsQuery //виконує запит з пагінацією та сортуванням
  //   .skip(skip)
  //   .limit(limit)
  //   .sort({ [sortBy]: sortOrder })
  //   .exec();
 
  //запити паралельно для отримання кількості контактів та самих контактів
  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page); //обчислює дані для пагінації

  return {
    //повертає об'єкт, що містить контакти та дані пагінації
    data: contacts,
    ...paginationData,
  };
};

// отримання контакту за ідентифікатором
export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId); //знаходить документ за його ідентифікатором
  return contact; //повертає об'єкт контакту, якщо знайдено, або null, якщо контакт не знайдено
};

// створення нового контакту
export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload); //створює новий документ у колекції contacts
  return contact; //повертає створений об'єкт контакту
};

// оновлення контакту за ідентифікатором
export const updateContact = async (contactId, payload, options = {}) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    { new: true, includeResultMetadata: true, ...options },
  ); //знаходить і оновлює документ за його ідентифікатором
  if (!rawResult || !rawResult.value) return null; //якщо документ не знайдено або оновлення не відбулося, повертає null
  return {
    contact: rawResult.value, //повертає оновлений об'єкт контакту
    isNew: Boolean(rawResult?.lastErrorObject?.upserted), //повертає інформацію, чи було створено новий документ
  };
};

// видалення контакту за ідентифікатором
export const deleteContact = async (contactId) => {
  const contact = await ContactsCollection.findOneAndDelete({ _id: contactId }); //знаходить і видаляє документ за його ідентифікатором
  return contact; //повертає видалений об'єкт контакту або null, якщо контакт не знайдено
};

// функція є частиною шару бізнес-логіки застосунку. Вони виконують операції з даними, які зберігаються в MongoDB.
