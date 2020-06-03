const Articles = require('../models/article');
const NotFoundError = require('../commons/NotFoundError');
const BadRequestError = require('../commons/BadRequestError');
const UnauthorizedError = require('../commons/UnauthorizedError');

module.exports.getAllArticles = (req, res, next) => {
  Articles.find({ owner: req.user })
    .then((el) => {
      if (!el) {
        throw new NotFoundError('Нет записей');
      }
      res.send(el);
    })
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Articles.create({
    keyword, title, text, date, source, link, image, owner: req.user,
  })
    .then((el) => {
      if (!el) {
        throw new BadRequestError('не удалось создать карточку');
      }
      return res.send(el);
    })
    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  Articles.findById(req.params._id).select('+owner')
    .then((el) => {
      if (!el) {
        throw new NotFoundError('Такой статьи нет');
      }

      if (el.owner.toString() === req.user._id) {
        return Articles.findByIdAndRemove(req.params._id)
          .then((article) => {
            if (!article) {
              throw new BadRequestError('Что-то пошло не так');
            }
            return res.send(article);
          })
          .catch(next);
      } throw new UnauthorizedError('Нет прав на удаление');
    })
    .catch(next);
};
