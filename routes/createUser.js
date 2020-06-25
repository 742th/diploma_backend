const bcrypt = require('bcryptjs');
const User = require('../models/user');
const BadRequestError = require('../commons/BadRequestError');

module.exports.createUser = (req, res, next) => {
  const { email, name } = req.body;

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new BadRequestError('Пользователь с таким email уже зарегестрирован');
      }
      bcrypt.hash(req.body.password, 10)
        .then((hash) => User.create({
          name,
          email,
          password: hash,
        }))
        .then((u) => {
          if (!u) {
            throw new BadRequestError('Не удалось создать пользователя');
          }
          return res.send({ name, email });
        });
    })
    .catch(next);
};
