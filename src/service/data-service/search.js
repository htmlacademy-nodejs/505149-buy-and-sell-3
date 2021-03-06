'use strict';

class SearchService {
  constructor(db, logger) {
    this._models = db.models;
    this._logger = logger;
  }

  async findAll(searchText) {
    const {Offer} = this._models;

    const offers = await Offer.findAll();
    const preparedOffers = [];

    for (const offer of offers) {
      const categories = await offer.getCategories({raw: true});
      offer.dataValues.category = categories;
      preparedOffers.push(offer.dataValues);
    }

    return preparedOffers.filter((offer) => offer.title.toLowerCase().includes(searchText));
  }

}

module.exports = SearchService;
