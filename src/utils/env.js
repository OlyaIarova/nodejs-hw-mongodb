import dotenv from 'dotenv'; //Імпорт бібліотеки

dotenv.config(); //завантажує змінні середовища з файлу
// const PORT = 3000;
// const MONGODB_USER = domaschukolya;
// const MONGODB_PASSWORD = rQag4TtcH4aLZVvG;
// const MONGODB_URL = cluster0.pw29ele.mongodb.net;
// const MONGODB_DB = contacts;
export function env(name, defaultValue) {
  const value = process.env[name]; // отримую значення змінної середовища з іменем name.

  if (value) return value; //повертається, якщо значення змінної середовища знайдено
  if (defaultValue) return defaultValue; //повертається значення за замовчуванням, якщо значення змінної не знайдено

 throw new Error(`Missing: process.env['${name}'].`); //викидається помилка, якщо значення змінної не знайдено і за замовчуванням нічого не вказано
}
