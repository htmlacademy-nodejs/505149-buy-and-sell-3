'use strict';

const {Router} = require(`express`);

const api = require(`../api`).getAPI();

const OFFERS_PER_PAGE = 8;

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = +page;

  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * OFFERS_PER_PAGE;
  const {count, offers, mostDiscussed} = await api.getOffers({limit, offset});
  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);
  res.render(`main`, {
    offers,
    title: `Главная страница`,
    mostDiscussed,
    page,
    totalPages,
  });
});
mainRouter.get(`/register`, (req, res) => res.render(`register`, {}));
mainRouter.get(`/login`, (req, res) => res.render(`login`, {}));
mainRouter.get(`/search`, async (req, res) => {
  const encodedURI = encodeURI(req.query.query);
  const result = await api.search(encodedURI);
  const {count, searchResult, eightOffers} = result;
  const moreOffersQty = count >= OFFERS_PER_PAGE ? (count) - OFFERS_PER_PAGE : null;

  if (searchResult) {
    res.render(`search-result`, {searchResult, eightOffers, moreOffersQty});
  } else {
    res.render(`search-empty`, {eightOffers, moreOffersQty});
  }
});

module.exports = mainRouter;
