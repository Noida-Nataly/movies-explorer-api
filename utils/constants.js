const {
  PORT = 3000,
  CONNECT_STRING = 'mongodb://127.0.0.1:27017/bitfilmsdb',
  JWT_SECRET = '4PgzIvqPt4i08qhHTg8MZCWruulpojs6',
  NODE_ENV = 'dev',
} = process.env;

const limitation = {
  max: 100,
  windowMs: 10 * 60 * 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Слишком много запросов с вашего IP-адреса',
};

const regex = /^(https?:\/\/)+[^\s]*/;

module.exports = {
  PORT,
  CONNECT_STRING,
  JWT_SECRET,
  NODE_ENV,
  limitation,
  regex,
};
