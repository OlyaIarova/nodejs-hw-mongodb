import { Contact } from '../db/models/contact';

export const getAllContacts = async () => {
  const contacts = await Contact.find(); //знаходить всі документи в колекції contacts.
  return contacts; //повертає масив об'єктів контактів
};

export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId); //який знаходить документ за його ідентифікатором
  return contact; //повертає об'єкт контакту, якщо знайдено, або null, якщо контакт не знайдено
};
