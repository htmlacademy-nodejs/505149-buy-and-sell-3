'use strict';

const fs = require(`fs`).promises;
const {nanoid} = require(`nanoid`);

const {getLogger} = require(`../lib/logger`);
const {getRandomInt, shuffle, OfferType, SumRestrict, PictureRestrict, getPictureFileName, makeMockData} = require(`../../utils`);

const {
  MAX_ID_LENGTH,
  TXT_FILES_DIR,
  MAX_COMMENTS,
  DEFAULT_COUNT,
  FILE_NAME
} = require(`../../../src/constants`);

const logger = getLogger({
  name: `api-server`,
});

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generateOffers = (count, mockData) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    title: mockData.titles[getRandomInt(0, mockData.titles.length - 1)],
    description: shuffle(mockData.sentences).slice(0, getRandomInt(1, 5)).join(` `),
    sum: getRandomInt(SumRestrict.min, SumRestrict.max),
    picture: getPictureFileName(getRandomInt(PictureRestrict.min, PictureRestrict.max)),
    category: shuffle(mockData.categories).slice(0, getRandomInt(1, mockData.categories.length - 1)),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), mockData.comments),
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const files = await fs.readdir(TXT_FILES_DIR);

    const mockData = await makeMockData(files);
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateOffers(countOffer, mockData), null, 2);

    try {
      await fs.writeFile(FILE_NAME, content);
      logger.info(`Operation success. File created.`);
    } catch (err) {
      logger.error(`Can't write data to file...`);
    }
  }
};
