import mongoose from "mongoose"; //бібліотека для роботи  з MongoDB
import { env } from '../utils/env'; //отримання значень змінних середовища

export const initMongoConnection = async () => {
  //oтримую значень змінних середовища
const user = env('MONGODB_USER');
const pwd = env('MONGODB_PASSWORD');
const url = env('MONGODB_URL');
const db = env('MONGODB_DB');
  try {
    await mongoose.connect(
      //встановлюю з'єднання з MongoDB
      `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`,
    );
    console.log('Mongo connection successfully established!'); //з'єднання встановлено успішно
  } catch (error) {
    console.log('Error while setting up mongo connection', error); //якщо виникає помилка виводиться повідомлення і викидається
    throw error;
  }
};