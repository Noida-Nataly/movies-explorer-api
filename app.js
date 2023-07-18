require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const rateLimit = require("express-rate-limit");
const helmet = require('helmet');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorsMiddleware = require('./middlewares/errors');
const corsMiddleware = require('./middlewares/cors');


const { PORT, CONNECT_STRING, limitation } = require('./utils/constants');
const router = require('./routes/index');

const app = express();
app.use(rateLimit(limitation));
app.use(helmet());
app.use(express.json());
app.use(cookieParser()); // подключаем автообработку куки
app.use(corsMiddleware); // подключаем кросс-доменную обработку

mongoose.connect(CONNECT_STRING);

app.use(requestLogger); // подключаем логгер запросов

app.use(router); // подключаем роутеры

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());
app.use(errorsMiddleware);

app.listen(PORT);
