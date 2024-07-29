import { HttpError } from 'http-errors'; //для перевірки типу помилки

export const errorHandler = (error, req, res, next) => {//глобальна обробка помилок
  if (error instanceof HttpError) {
    //перевіряє, чи є помилка екземпляром HttpError
    res.status(error.status).json({
      status: error.status, //містить статус помилки
      message: error.name, //містить назву помилки
      data: error, //містить саму помилки
    });
    return;
  }
  //якщо помилка не є екземпляром, встановлює статус відповіді на 500
  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: error.message,
  });
};
