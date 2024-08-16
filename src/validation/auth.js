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

//використовується для валідації запиту на скидання пароля користувача
export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

//використовується для валідації даних при скиданні пароля користувача
export const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});

//для валідації даних при вході через Google OAuth
export const loginWithGoogleOAuthSchema = Joi.object({
  code: Joi.string().required(),
});


//Ці схеми забезпечують правильну структуру та дотримання всіх необхідних правил валідації для даних, що надходять від користувачів у різних сценаріях