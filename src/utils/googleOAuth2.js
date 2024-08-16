import { OAuth2Client } from 'google-auth-library'; //для роботи з OAuth 2.0
import path from 'node:path';
import { readFile } from 'fs/promises';//асинхронне читання файлів
import createHttpError from 'http-errors';

import { env } from './env.js';

const PATH_JSON = path.join(process.cwd(), 'google-oauth.json');//визначає шлях до файлу google-oauth.json, який зберігається в кореневій директорії проєкту

const oauthConfig = JSON.parse(await readFile(PATH_JSON));//зчитує файл google-oauth.json і перетворює його в об'єкт JavaScript

//iніціалізація OAuth2 клієнта
const googleOAuthClient = new OAuth2Client({
  //створює екземпляр OAuth2 клієнта з конфігурацією
  clientId: env('GOOGLE_AUTH_CLIENT_ID'),
  clientSecret: env('GOOGLE_AUTH_CLIENT_SECRET'),
  redirectUri: oauthConfig.web.redirect_uris[0], //береться з конфігураційного файлу google-oauth.json
});

//для генерації URL авторизації
export const generateAuthUrl = () =>//генерує URL, за яким користувач може авторизуватися через Google
  googleOAuthClient.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });

  //для перевірки коду авторизації
  export const validateCode = async (code) => {
    const response = await googleOAuthClient.getToken(code);
    if (response.tokens.id_token === 'undefined')
      throw createHttpError(401, 'Unauthorized');

    const ticket = await googleOAuthClient.verifyIdToken({
      idToken: response.tokens.id_token,
    });
    return ticket;
  };

  //для отримання повного імені користувача з токену
  export const getFullNameFromGoogleTokenPayload = (payload) => {
    let fullName = 'Guest';
    if (payload.given_name && payload.family_name) {
      fullName = `${payload.given_name} ${payload.family_name}`;
    } else if (payload.given_name) {
      fullName = payload.given_name;
    }

    return fullName;
    
};



//код відповідає за інтеграцію Google OAuth 2.0 для автентифікації користувачів у веб-додатку