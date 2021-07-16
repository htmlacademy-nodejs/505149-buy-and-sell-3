'use strict';

const fs = require(`fs`).promises;

const {sequelize, models} = require(`../database`);
const {getLogger} = require(`../lib/logger`);
const {getRandomInt, shuffle, OfferType, SumRestrict, PictureRestrict, getPictureFileName, makeMockData} = require(`../../utils`);

const {TXT_FILES_DIR, ExitCode} = require(`../../constants`);
const DEFAULT_COUNT = 5;
const MAX_COMMENTS = 50;

const users = [
  {
    firstName: `Иван`,
    lastName: `Иванов`,
    email: `arteta@gmail.com`,
    password: `qwertyss`,
    avatar: `image.jpg`,
  },
  {
    firstName: `Сергей`,
    lastName: `Сидоров`,
    email: `barguzin@gmail.com`,
    password: `qwertyss`,
    avatar: `image2.jpg`,
  }
];

const logger = getLogger({
  name: `api-server`,
});

const generateCategories = (categories) => (
  categories.map((item) => ({
    title: item,
    picture: `picture.png`,
  }))
);

const generateComments = (comments, countOffer) => (
  Array(MAX_COMMENTS).fill({}).map(() => ({
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
    [`user_id`]: getRandomInt(1, 2),
    [`offer_id`]: getRandomInt(1, countOffer),
  }))
);

const generateOffers = (count, mockData) => (
  Array(count).fill({}).map(() => ({
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    title: mockData.titles[getRandomInt(0, mockData.titles.length - 1)],
    description: shuffle(mockData.sentences).slice(0, getRandomInt(1, 5)).join(` `),
    sum: getRandomInt(SumRestrict.min, SumRestrict.max),
    picture: getPictureFileName(getRandomInt(PictureRestrict.min, PictureRestrict.max)),
    category: shuffle(mockData.categories).slice(0, getRandomInt(1, mockData.categories.length - 1)),
    [`user_id`]: getRandomInt(1, 2),
  }))
);

const fillDataBase = async (categories, comments, offers) => {
  try {
    await Promise.all([
      models.User.bulkCreate(users),
      models.Category.bulkCreate(categories)
    ]);

    await models.Offer.bulkCreate(offers);
    await models.Comment.bulkCreate(comments);

    const rawCategories = await models.Category.findAll({raw: true});

    for (const offer of offers) {
      const categoriesIds = rawCategories.reduce((acc, item) => {
        if (offer.categories.filter((cat) => cat === item.title).length) {
          acc.push(item.id);
        }
        return acc;
      }, []);

      const offerCategories = await models.Category.findAll({
        where: {
          id: {
            [sequelize.Sequelize.Op.or]: categoriesIds,
          },
        }
      });

      const rawOffer = await models.Offer.findOne({
        where: {
          title: offer.title,
          sum: offer.sum,
        }
      });
      await rawOffer.addCategories(offerCategories);
    }
  } catch (error) {
    logger.error(`An error occured while filling database: ${error.message}`);
  }

};

module.exports = {
  name: `--filldb`,
  async run(args) {
    let count;
    try {
      const files = await fs.readdir(TXT_FILES_DIR);
      if (args) {
        [count] = args;
      }
      const countOfOffers = Number.parseInt(count, 10) || DEFAULT_COUNT;
      const mockData = await makeMockData(files);
      const categories = generateCategories(mockData.categories);
      const comments = generateComments(mockData.comments, countOfOffers);
      const offers = generateOffers(countOfOffers, mockData);

      logger.info(`Trying to connect to database...`);
      const result = await sequelize.sync({force: true});
      logger.info(`Successfully created ${result.config.database} database`);

      await fillDataBase(categories, comments, offers);
      logger.info(`Successfully filled ${result.config.database} database`);
      sequelize.close();

    } catch (error) {
      logger.error(`An error occured: ${error.message}`);
      process.exit(ExitCode.error);
    }
  }
};
