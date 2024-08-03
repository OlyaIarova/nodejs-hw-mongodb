import { Router } from 'express';
import contactsRouter from './contacts.js';
import authRouter from './auth.js';

const router = Router();

router.use('/contacts', contactsRouter);//маршрути для контактів, що починаються з /contacts, будуть оброблятися маршрутизатором contactsRouter
router.use('/auth', authRouter);//маршрути для авторизації,що починаються з /auth, будуть оброблятися маршрутизатором authRouter

export default router;




//Цей код об'єднує маршрути для роботи з контактами та авторизації користувачів в один головний маршрутизатор. Завдяки цьому структура додатку стає більш організованою та модульною