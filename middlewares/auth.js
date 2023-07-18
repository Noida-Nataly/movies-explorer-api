const jwt = require('jsonwebtoken');
const NotAuthError = require('../errors/not-auth-err');
const { JWT_SECRET } = require('../utils/constants');

module.exports.auth = (req, res, next) => {
  const { token } = req.cookies;
  let payload;

  try {
    if (!token) {
      return next(new NotAuthError('Необходима авторизация'));
    }
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new NotAuthError('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};