'use strict';

const {HttpCode} = require(`../../constants`);

const offerKeys = [`category`, `description`, `picture`, `title`, `type`, `sum`];

module.exports = (req, res, next) => {
  const newOffer = req.body;
  const keys = Object.keys(newOffer);
  // const entries = Object.entries(newOffer);
  const keysExists = offerKeys.every((key) => keys.includes(key));

  // for (const entry of entries) {
  //   if (entry[0] === `category` && !entry[1].length || entry[1] === ``) {
  //     return res.status(HttpCode.BAD_REQUEST)
  //     .send(`Bad request`);
  //   }
  // }

  if (!keysExists) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(`Bad request`);
  }

  return next();
};
