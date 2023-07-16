const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET, NODE_ENV } = require('../utils/constants');
const User = require('../models/user');
// const NotAuthorizedError = require('../errors/not-auth-err');
// const NotUniqueDataError = require('../errors/not-unique-data-err');
// const InvalidDataError = require('../errors/invalid-data-err');
// const NotFoundError = require('../errors/not-found-err');

// очистка Cookie при выходе из системы
module.exports.logout = (req, res) => {
  res.clearCookie('token', {
    maxAge: 3600000 * 24 * 7,
    sameSite: 'none',
    secure: NODE_ENV === 'production',
    httpOnly: true,
  })
    .send({ message: 'Вы вышли из системы' });
};

// аутентификация пользователя по почте и паролю
module.exports.login = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotAuthError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new NotAuthorizedError('Неправильные почта или пароль'));
          }
          const token = jwt.sign(
            { _id: user._id },
            JWT_SECRET,
            { expiresIn: '7d' },
          );
          return res.cookie('token', token, {
            maxAge: 3600000 * 24 * 7,
            sameSite: 'none',
            secure: NODE_ENV === 'production',
            httpOnly: true,
          }).send({ message: 'Авторизация прошла успешно' });
        });
    })
    .catch(next);
};

// создание пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    })
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        if (err.code === 11000) {
          next(new NotUniqueDataError('Пользователь с таким адресом электронной почты уже существует'));
        } else if (err.name === 'ValidationError') {
          next(new InvalidDataError('Переданы некорректные данные при создании пользователя'));
        } else {
          next(err);
        }
      }));
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => next(err));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError(`Пользователь по указанному id:${req.params.userId} не найден`))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidDataError('Некорректный идентификатор пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  req.params.userId = req.user._id;
  module.exports.getUserById(req, res, next);
};

// обновление имени и почты пользователя
module.exports.updateProfile = (req, res, next) => {
  const { _id } = req.user;
  const { name, email } = req.body;

  User.findByIdAndUpdate(_id, { name, email }, {
    new: true,
    runValidators: true,
  })
    .orFail(new NotFoundError(`Пользователь по указанному id:${req.params.userId} не найден`))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidDataError('Переданы некорректные данные при обновлении профиля.'));
      } else {
        next(err);
      }
    });
};

