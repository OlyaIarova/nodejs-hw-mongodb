import { SORT_ORDER } from '../index.js';

// функція для парсингу порядку сортування
const parseSortOrder = (sortOrder) => {
  const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder); //перевірка, чи є sortOrder одним із відомих значень
 
  if (isKnownOrder) return sortOrder; //якщо так, повертається

  return SORT_ORDER.ASC; //інакше значення за замовчуванням
};

// функція для парсингу поля сортування
const parseSortBy = (sortBy) => {
  const keysOfStudent = ['_id', 'name']; //доступні поля для сортування

  if (keysOfStudent.includes(sortBy)) {
    return sortBy; //є дозволеним полем, повертається
  }

  return '_id'; // якщо sortBy не є доступним полем
};

// функція для парсингу параметрів сортування з запиту. Приймає об'єкт запиту query, передаючи їм відповідні значення з запиту
export const parseSortParams = (query) => {
  const { sortOrder, sortBy } = query;

  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);

  return {//повертає об'єкт із параметрами сортування
    sortOrder: parsedSortOrder,
    sortBy: parsedSortBy,
  };
};