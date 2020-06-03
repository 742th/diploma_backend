const articlesRouter = require('express').Router();
const { getAllArticles, createArticle, deleteArticle } = require('../controllers/articles');

articlesRouter.delete('/:_id', deleteArticle);
articlesRouter.post('/', createArticle);
articlesRouter.get('/', getAllArticles);

module.exports = {
  articlesRouter,
};
