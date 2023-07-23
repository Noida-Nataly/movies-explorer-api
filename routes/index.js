const router = require('express').Router();

const userController = require('../controllers/users');
const authMiddleware = require('../middlewares/auth');
const movieRouter = require('./movies');
const userRouter = require('./users');
const NotFoundError = require('../errors/not-found-err');

const {
  validationLogin,
  validationCreateUser,
} = require('../middlewares/validation');
// router.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

router.post('/signin', validationLogin, userController.login);
router.post('/signup', validationCreateUser, userController.createUser);
router.get('/signout', userController.logout);

router.use(authMiddleware.auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
