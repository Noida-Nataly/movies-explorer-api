const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const userController = require('../controllers/users');
//const { regex } = require('../utils/constants');
const authMiddleware = require('../middlewares/auth');
const filmRouter = require('./movies');
const userRouter = require('./users');
const NotFoundError = require('../errors/not-found-err');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email().min(3),
      password: Joi.string().required().min(3),
    }),
  }),
  userController.login,
);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().min(3),
    password: Joi.string().required().min(3),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regex),
  }),
}), userController.createUser);

router.get('/signout', userController.logout);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email().min(3),
      password: Joi.string().required().min(3),
    }),
  }),
  userController.login,
);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().min(3),
    password: Joi.string().required().min(3),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regex),
  }),
}), userController.createUser);
router.get('/signout', userController.logout);

router.use(authMiddleware.auth);

router.use('/cards', cardRouter);
router.use('/users', userRouter);

router.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
