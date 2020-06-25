const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../commons/UnauthorizedError');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.checkUser(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные имя или пароль');
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'supa-dupa-key',
        { expiresIn: '7d' },
      );
      return res.send({ token });
    })
    .catch(next);
};
