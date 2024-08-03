import Joi from 'joi';

//схема валідації для даних, що використовуються під час реєстрації користувача
export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

//схема валідації для даних, що використовуються під час входу користувача
export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
