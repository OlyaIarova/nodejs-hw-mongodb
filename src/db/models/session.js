import { model, Schema } from 'mongoose'; //для створення моделі та схеми відповідно

const sessionsSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'users' }, //посилається на колекцію users, вказуючи на користувача, до якого належить сесія
    accessToken: { type: String, required: true }, //обов'язкове для заповнення, містить токен доступу
    refreshToken: { type: String, required: true }, //обов'язкове для заповнення, містить токен для оновлення
    accessTokenValidUntil: { type: Date, required: true }, //вказує на час закінчення дії токена доступу
    refreshTokenValidUntil: { type: Date, required: true }, //вказує на час закінчення дії токена для оновлення
  },
  {
    timestamps: true, //автоматично додає поля
    versionKey: false, //вимикає додавання поля
  },
);

export const SessionsCollection = model('sessions', sessionsSchema);//відповідає за взаємодію з колекцією sessions у MongoDB




//Цей код визначає структуру документів у колекції sessions, які містять інформацію про сесії користувачів, включаючи токени доступу та оновлення, а також час їх дії. Модель SessionsCollection забезпечує взаємодію з базою даних MongoDB, дозволяючи виконувати CRUD операції над документами сесій.