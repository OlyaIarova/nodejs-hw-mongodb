import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerUserSchema, loginUserSchema } from '../validation/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  loginUserController,
  logoutUserController,
  registerUserController,
  refreshUserSessionController,
} from '../controllers/auth.js';

const router = Router(); //Створення маршрутизатора

router.post(
  //створення маршруту для реєстрації користувача
  '/register',
  validateBody(registerUserSchema), //перевіряє тіло запиту за схемою
  ctrlWrapper(registerUserController), //обгортає контролер для обробки запиту
);

router.post(
  //створення маршруту для входу користувача
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post('/logout', ctrlWrapper(logoutUserController));//створення маршруту для виходу користувача

router.post('/refresh', ctrlWrapper(refreshUserSessionController));//створення маршруту для оновлення сесії користувача

export default router;




//Цей код створює маршрути для реєстрації, входу, виходу та оновлення сесій користувачів