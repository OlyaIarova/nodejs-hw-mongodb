import { model, Schema } from 'mongoose';

const contactSchema = new Schema( //Схема визначає структуру документів у колекції contacts
  {
    name: {//Ім'я контакту, тип String, обов'язкове поле
      type: String,
      required: true,
    },
    phoneNumber: {//Номер телефону контакту, тип String, обов'язкове поле
      type: String,
      required: true,
    },
    email: {//Електронна пошта контакту, тип String, необов'язкове поле
      type: String,
      required: false,
    },
    isFavourite: {//Чи є контакт улюбленим, тип Boolean, за замовчуванням false
      type: Boolean,
      default: false,
    },
    contactType: {//Тип контакту, тип String, обов'язкове поле з можливими значеннями 'work', 'home', 'personal'. Значення за замовчуванням — 'personal'
      type: String,
      required: true,
      default: 'personal',
      enum: ['work', 'home', 'personal'],
    },
  },
  {
    timestamps: true, //автоматично додає поля createdAt та updatedAt
    versionKey: false, // що вимикає автоматичне додавання поля __v до документів.
  },
);

export const ContactsCollection = model('contacts', contactSchema); //створюється на основі схеми contactSchema і зв'язується з колекцією contacts у MongoDB
