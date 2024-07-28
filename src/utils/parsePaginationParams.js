//щоб параметри пагінації були коректними цілими числами
const parseNumber = (number, defaultValue) => {
  const isString = typeof number === 'string'; //чи є number рядком
  if (!isString) return defaultValue;

  const parsedNumber = parseInt(number); //якщо number є рядком, перетворення на ціле число
  if (Number.isNaN(parsedNumber)) {//якщо  NaN
    return defaultValue;
  }

  return parsedNumber; //повертає перетворене значення
};

//для обробки параметрів запиту, повертає об'єкт з коректними значеннями 
export const parsePaginationParams = (query) => {
  const { page, perPage } = query; //деструкторизація об'єкт query

  const parsedPage = parseNumber(page, 1);
  const parsedPerPage = parseNumber(perPage, 10);

  return {//повертає об'єкт з розібраними параметрами
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
