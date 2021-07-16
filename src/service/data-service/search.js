'use strict';

const OFFERS_PER_PAGE = 8;

class SearchService {
  constructor(db, logger) {
    this._models = db.models;
    this._logger = logger;
  }

  async findAll(searchText) {
    const {Offer, Comment, Category} = this._models;
    let searchResult;

    try {
      const offers = await Offer.findAll({
        include: [
          {
            model: Comment,
            as: `comments`,
          },
          {
            model: Category,
            as: `categories`,
          }
        ],
        order: [
          [`created_date`, `DESC`],
        ],
      });

      const count = await Offer.count();
      const eightOffers = offers.slice(0, OFFERS_PER_PAGE);
      if (!searchText) {
        searchResult = null;
      } else {
        searchResult = offers.filter((offer) => offer.title.toLowerCase().includes(searchText));
      }

      return {eightOffers, searchResult, count};
    } catch (error) {
      this._logger.error(`Can not find offers. Error: ${error}`);

      return null;
    }
  }

}

module.exports = SearchService;
