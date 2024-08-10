import nodemailer from 'nodemailer'; //для відправлення електронних листів

import { SMTP } from '../constants/index.js'; //константи з налаштуваннями SMTP сервера
import { env } from '../utils/env.js'; //отримання змінних середовища

const transporter = nodemailer.createTransport({
  host: env(SMTP.SMTP_HOST),
  port: Number(env(SMTP.SMTP_PORT)),
  auth: {
    user: env(SMTP.SMTP_USER),
    pass: env(SMTP.SMTP_PASSWORD),
  },
});

export const sendEmail = async (options) => {
  return await transporter.sendMail(options);
}; //відправляє електронний лист з використанням налаштованого транспортера


//дозволяє налаштувати і використовувати сервіс SMTP для відправлення електронних листів в Node.js додатках