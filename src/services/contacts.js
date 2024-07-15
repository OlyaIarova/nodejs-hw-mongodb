import { ContactsCollection } from '../db/models/contact.js';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find(); //знаходить всі документи в колекції contacts.
  return contacts; //повертає масив об'єктів контактів
};

export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId); //який знаходить документ за його ідентифікатором
  return contact; //повертає об'єкт контакту, якщо знайдено, або null, якщо контакт не знайдено
};
