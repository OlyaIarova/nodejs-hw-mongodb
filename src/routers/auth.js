import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUserSchema,
  registerUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  registerUserController,
  requestResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';

const router = Router(); //Створення маршрутизатора

router.post(//створення маршруту для реєстрації користувача
  '/register',
  validateBody(registerUserSchema), //перевіряє тіло запиту за схемою
  ctrlWrapper(registerUserController), //обгортає контролер для обробки запиту
);

router.post(//створення маршруту для входу користувача
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post('/logout', ctrlWrapper(logoutUserController));//створення маршруту для виходу користувача

router.post('/refresh', ctrlWrapper(refreshUserSessionController));//створення маршруту для оновлення сесії користувача


router.post(
  //Маршрут для відправки електронного листа для скидання пароля
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

router.post(//Маршрут для скидання пароля
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);


export default router;




//код створює маршрутизацію для обробки запитів, пов'язаних із процесом аутентифікації користувачів