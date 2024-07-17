import { ContactsCollection } from '../db/models/contact.js';

// отримання всіх контактів
export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find(); //знаходить всі документи в колекції contacts
  return contacts; //повертає масив об'єктів контактів
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
  const rawResult = await ContactsCollection.findOneAndUpdate( {_id: contactId }, payload,
    { new: true, includeResultMetadata: true,...options,},  );//знаходить і оновлює документ за його ідентифікатором
  if (!rawResult || !rawResult.value) return null; //якщо документ не знайдено або оновлення не відбулося, повертає null
  return {
    contact: rawResult.value, //повертає оновлений об'єкт контакту
    isNew: Boolean(rawResult?.lastErrorObject?.upserted), //повертає інформацію, чи було створено новий документ
  };
};

// видалення контакту за ідентифікатором
export const deleteContact = async (contactId) => {
  const contact = await ContactsCollection.findOneAndDelete({ _id: contactId,}); //знаходить і видаляє документ за його ідентифікатором
  return contact; //повертає видалений об'єкт контакту або null, якщо контакт не знайдено
};

// функція є частиною шару бізнес-логіки застосунку. Вони виконують операції з даними, які зберігаються в MongoDB.