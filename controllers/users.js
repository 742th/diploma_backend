const User = require('../models/user');
const NotFoundError = require('../commons/NotFoundError');


module.exports.getUser = (req, res, next) => {
  User.findById(req.user)
    .orFail(() => new NotFoundError('Нет пользователя с таким id'))
    .then((user) => res.send({ email: user.email, name: user.name }))
    .catch(next);
};
