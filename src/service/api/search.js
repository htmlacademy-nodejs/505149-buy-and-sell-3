'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);
const {getLogger} = require(`../lib/logger`);

const route = new Router();
const logger = getLogger({
  name: `api-server`,
});

module.exports = (app, service) => {
  app.use(`/search`, route);

  route.get(`/`, async (req, res) => {
    const {query = ``} = req.query;

    const result = await service.findAll(query.toLowerCase());

    if (!result.searchResult) {
      logger.error(`Empty query...`);
    }

    return res.status(HttpCode.OK)
    .json(result);
  });
};
