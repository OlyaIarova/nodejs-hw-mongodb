import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUserSchema,
  registerUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
  loginWithGoogleOAuthSchema,
} from '../validation/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  registerUserController,
  requestResetEmailController,
  resetPasswordController,
  getGoogleOAuthUrlController,
  loginWithGoogleController,
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


router.post( //Маршрут для відправки електронного листа для скидання пароля
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

router.post(//Маршрут для скидання пароля
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

router.get('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));//Маршрут для отримання URL для Google OAuth

//Маршрут для входу або реєстрації через Google OAuth
router.post(
  '/confirm-oauth',
  validateBody(loginWithGoogleOAuthSchema),
  ctrlWrapper(loginWithGoogleController),
);

export default router;




//Цей маршрутизатор забезпечує організовану структуру для роботи з авторизацією та аутентифікацією в додатку, забезпечуючи обробку запитів для реєстрації, входу, скидання пароля, а також інтеграцію з Google OAuth