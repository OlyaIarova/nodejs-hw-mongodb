const parseContactType = (contactType) => {
  const isString = typeof contactType === 'string'; // перевіряє, чи є contactType рядком.

  if (!isString) return; //не є рядком, функція повертає undefined
  const isContactType = (contactType) =>
    ['home', 'work', 'personal'].includes(contactType); //перевіряє, чи входить в масив допустимих значень

  if (isContactType(contactType)) return contactType; //допуступне значенням, повертає його
};

const parseIsFavourite = (isFavourite) => {
  typeof isFavourite === 'boolean'; //перевіряє, чи є isFavourite булевим значенням
  if (!isFavourite) return; // не булеве значенням, повертає undefined

  return isFavourite; //повертає значення isFavourite, якщо воно є булевим
};

export const parseFilterParams = (query) => {//парсинг параметрів фільтрації запиту
  const { contactType, isFavourite } = query;

  const parsedContactType = parseContactType(contactType);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    //повертає об'єкт, що містить розпарсені значення contactType та isFavourite.
    contactType: parsedContactType,
    isFavourite: parsedIsFavourite,
  };
};
