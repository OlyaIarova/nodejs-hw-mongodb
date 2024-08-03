import { model, Schema } from 'mongoose';

const usersSchema = new Schema(
  {
    name: {
      //тип String, обов'язкове для заповнення
      type: String,
      required: true,
    },
    email: {
      //обов'язкове для заповнення та повинно бути унікальним
      type: String,
      required: true,
      unique: true,
    },
    password: {
      //типу String, обов'язкове для заповнення
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, //автоматично додає поля createdAt та updatedAt до документів
    versionKey: false, //вимикає додавання поля __v, яке використовується для контролю версій
  },
);

usersSchema.methods.toJSON = function () {
  //видаляє поле password з об'єкта користувача перед поверненням його як JSON
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UsersCollection = model('users', usersSchema);
