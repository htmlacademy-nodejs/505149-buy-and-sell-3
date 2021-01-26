'use strict';

const {Router} = require(`express`);

const api = require(`../api`).getAPI();

const OFFERS_PER_PAGE = 8;
const OFFERS_PER_PAGE_COMMENTS = 3;

const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = +page;

  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * OFFERS_PER_PAGE;
  const {count, offers} = await api.getOffers({limit, offset});
  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);

  res.render(`my-offers`, {
    offers,
    title: `Мои объявления`,
    page,
    totalPages,
  });
});

myRouter.get(`/comments`, async (req, res) => {
  let {page = 1} = req.query;
  page = +page;

  const limit = OFFERS_PER_PAGE_COMMENTS;
  const offset = (page - 1) * OFFERS_PER_PAGE_COMMENTS;
  const {count, offers} = await api.getOffers({limit, offset});
  const totalPages = Math.ceil(count / OFFERS_PER_PAGE_COMMENTS);

  const offersId = offers.map((it) => it.id);
  await Promise.all(offersId.map((id) => api.getComments(id)))
      .then((results) => {
        for (const [index, array] of results.entries()) {
          offers[index].comments = array;
        }
      });

  res.render(`comments`, {
    title: `Мои комментарии`,
    offers,
    page,
    totalPages,
  });
});

module.exports = myRouter;
