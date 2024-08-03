import Joi from 'joi';

// схема валідації для створення контакту
export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    // поле name має бути рядком, мінімальна довжина - 3 символи, максимальна - 20, поле є обов'язковим
    // кастомні повідомлення про помилки валідації
    'string.base': 'Username should be a string', //помилка, якщо name не є рядком
    'string.min': 'Username should have at least {#limit} characters', //помилка, якщо name коротше 3 символів
    'string.max': 'Username should have at most {#limit} characters', //помилка, якщо name довше 20 символів
    'any.required': 'Username is required', //помилка, якщо name відсутнє
  }),
  phoneNumber: Joi.string().min(3).max(20).required(), //має бути рядком, мінімальна довжина - 3 символи, максимальна - 20, є обов'язковим
  email: Joi.string().email(), //має бути рядком, значення email-адресою
  isFavourite: Joi.boolean(), //має бути булевим значенням
  contactType: Joi.string().valid('work', 'home', 'personal').required(), //має бути рядком, допустимі значення: 'work', 'home', 'personal', є обов'язковим
  //userId: Joi.string(),
});
// схема валідації для оновлення контакту
export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20), //має бути рядком, мінімальна довжина - 3 символи, максимальна - 20
  phoneNumber: Joi.string().min(3).max(20), //має бути рядком, мінімальна довжина - 3 символи, максимальна - 20
  email: Joi.string().email(), //має бути рядком, значення email-адресою
  isFavourite: Joi.boolean(), //має бути булевим
  contactType: Joi.string().valid('work', 'home', 'personal'), //має бути рядком, допустимі значення: 'work', 'home', 'personal'
});