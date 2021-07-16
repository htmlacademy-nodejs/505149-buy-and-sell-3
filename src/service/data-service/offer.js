'use strict';

const {getFourSortedByCommentsAmount} = require(`../../utils`);

class OfferService {
  constructor(db, logger) {
    this._db = db;
    this._logger = logger;
  }

  async create(offer) {
    const {sequelize} = this._db;
    const {Category, Offer, User} = this._db.models;
    const allCategories = await Category.findAll({raw: true});
    const categoriesIds = allCategories.reduce((acc, item) => {
      if (offer.category.filter((cat) => cat === item.title).length) {
        acc.push(item.id);
      }
      return acc;
    }, []);

    try {
      const offerCategories = await Category.findAll({
        where: {
          id: {
            [sequelize.Sequelize.Op.or]: categoriesIds,
          },
        }
      });

      const user = await User.findByPk(1);
      const newOffer = await user.createOffer(offer);
      await newOffer.addCategories(offerCategories);

      return await Offer.findByPk(newOffer.id, {raw: true});
    } catch (error) {
      this._logger.error(`Can not create offer. Error: ${error}`);

      return null;
    }
  }

  async delete(id) {
    const {Offer} = this._db.models;

    try {
      const offerForDelete = await Offer.findByPk(id, {raw: true});
      const deletedRows = await Offer.destroy({
        returning: true,
        where: {
          id,
        }
      });

      if (!deletedRows) {
        return null;
      }

      return offerForDelete;
    } catch (error) {
      this._logger.error(`Can not delete offer. Error: ${error}`);

      return null;
    }
  }

  async findAll() {
    const {Offer, Comment, Category} = this._db.models;

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

      return offers;
    } catch (error) {
      this._logger.error(`Can not find offers. Error: ${error}`);

      return [];
    }
  }

  async findPage({limit, offset}) {
    const {Offer, Comment, Category} = this._db.models;

    try {
      const {count, rows} = await Offer.findAndCountAll({
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
        distinct: true,
        limit,
        offset,
        order: [
          [`created_date`, `DESC`],
        ]
      });
      const offers = rows;

      return {count, offers};
    } catch (error) {
      this._logger.error(`Can not find offers. Error: ${error}`);

      return null;
    }
  }

  async findMostDiscussed() {
    const {Offer, Comment, Category} = this._db.models;

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
        ]
      });

      return getFourSortedByCommentsAmount(offers);
    } catch (error) {
      this._logger.error(`Can not find most discussed offers. Error: ${error}`);

      return null;
    }
  }

  async findCommentsPage({limit, offset, page}) {
    const {Offer, Comment, Category} = this._db.models;

    try {
      const count = await Offer.count();
      const rows = await Offer.findAll({
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
      });
      const allComments = rows.reduce((acc, it) => {
        it.dataValues.comments.forEach((item) => acc.push(item.dataValues));
        return acc;
      }, []);
      allComments.sort((a, b) => b[`created_date`] - a[`created_date`]);
      const offersIds = new Set(allComments.reduce((acc, it) => {
        acc.push(it[`offer_id`]);
        return acc;
      }, []));
      let sortedOffers = [];
      for (const id of offersIds) {
        const offer = await Offer.findByPk(id, {
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
        });
        offer.dataValues.comments.sort((a, b) => b.dataValues[`created_date`] - a.dataValues[`created_date`]);
        sortedOffers.push(offer);
      }
      const slicedOffers = sortedOffers.slice(offset, limit * page);

      return {count, slicedOffers};
    } catch (error) {
      this._logger.error(`Can not find offers with comments. Error: ${error}`);

      return null;
    }
  }

  async findOne(id) {
    const {Offer, Comment, Category} = this._db.models;
    const offerId = Number.parseInt(id, 10);

    try {
      const offer = await Offer.findByPk(offerId, {
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
      });

      offer.dataValues.comments.sort((a, b) => b.dataValues[`created_date`] - a.dataValues[`created_date`]);

      return offer;
    } catch (error) {
      this._logger.error(`Can not find offer. Error: ${error}`);

      return null;
    }
  }

  async update(id, offer) {
    const {sequelize} = this._db;
    const {Offer, Category} = this._db.models;
    const allCategories = await Category.findAll({raw: true});
    const categoriesIds = allCategories.reduce((acc, item) => {
      if (offer.category.filter((cat) => +cat === +item.id).length) {
        acc.push(item.id);
      }
      return acc;
    }, []);

    try {
      const [rows] = await Offer.update(offer, {
        where: {
          id,
        }
      });

      if (!rows) {
        return null;
      }

      const updatedOffer = await Offer.findByPk(id);
      const offerCategories = await Category.findAll({
        where: {
          id: {
            [sequelize.Sequelize.Op.or]: categoriesIds,
          },
        }
      });
      await updatedOffer.setCategories(offerCategories);
      return await Offer.findByPk(updatedOffer.id, {
        include: [
          {
            model: Category,
            as: `categories`,
          }
        ],
      });
    } catch (error) {
      this._logger.error(`Can not update offer. Error: ${error}`);

      return null;
    }
  }

}

module.exports = OfferService;
