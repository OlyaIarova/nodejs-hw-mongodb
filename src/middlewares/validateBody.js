import createHttpError from 'http-errors'; //модуль для створення HTTP-помилок

export const validateBody = (schema) => async (req, res, next) => {//для валідації тіла запиту перед тим, як обробляти його у контролері
  try {
    await schema.validateAsync(req.body, {
      abortEarly: false, //валідація не буде зупинена після першої помилки, а збере всі помилки в об'єкт err
    });
    next(); //валідація успішна, перейти до наступного middleware або контролера
  } catch (err) {//створюється HTTP-помилка з кодом 400, з включеними деталями помилки
    const error = createHttpError(400, 'Bad Request', {
      errors: err.details,
    });
    next(error); //помилка передається далі через
  }
};
