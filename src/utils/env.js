import dotenv from 'dotenv'; //Імпорт бібліотеки

dotenv.config(); //завантажує змінні середовища з файлу

export function env(name, defaultValue) {
  const value = process.env[name]; // отримую значення змінної середовища з іменем name.

  if (value) return value; //повертається, якщо значення змінної середовища знайдено
  if (defaultValue) return defaultValue; //повертається значення за замовчуванням, якщо значення змінної не знайдено

 throw new Error(`Missing: process.env['${name}'].`); //викидається помилка, якщо значення змінної не знайдено і за замовчуванням нічого не вказано
}
