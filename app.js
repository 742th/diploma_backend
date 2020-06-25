const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors');


const app = express();
require('dotenv').config();


const { PORT = 3000 } = process.env;
const path = require('path');

const { articlesRouter } = require(path.join(__dirname, './routes/articles.js'));
const { routerUsers } = require(path.join(__dirname, './routes/usersRouter.js'));
const auth = require(path.join(__dirname, './middlewares/auth'));
const { login } = require('./routes/login');
const { createUser } = require('./routes/createUser');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const corsOptions = {
  origin: 'https://742th.github.io/ya.diploma',
  credentials: true,
};


// подключаемся к серверу монгус
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(requestLogger);


app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
// аутентификация пользователя
app.use(auth);
// роутер для отдачи карточек
app.use('/articles', articlesRouter);
// роутер для отдачи юзеров и юзера
app.use('/users', routerUsers);
// для запросов на не сущестующий адрес
app.use((req, res) => res.status(404).send({ message: 'Запрашиваемый ресурс не найден' }));
app.use(errorLogger);
// обрабатывает ошибки из celebrate
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
});

// запустили нод сервак на 3000 порту
app.listen(PORT, () => {
});
