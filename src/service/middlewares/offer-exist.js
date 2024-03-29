'use strict';

const {HttpCode} = require(`../../constants`);
const {getLogger} = require(`../lib/logger`);

const logger = getLogger({
  name: `api-server-mdwr-offer-exist`,
});

module.exports = (service) => async (req, res, next) => {
  const {offerId} = req.params;
  const offer = await service.findOne(offerId);

  if (!offer) {
    logger.error(`Error status - ${HttpCode.NOT_FOUND}, url: ${req.url}`);
    return res.status(HttpCode.NOT_FOUND)
      .send(`Offer with id ${offerId} not found`);
  }

  res.locals.offer = offer;
  return next();
};
