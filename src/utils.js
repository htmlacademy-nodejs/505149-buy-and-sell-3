'use strict';

const fs = require(`fs`).promises;

const {getLogger} = require(`./service/lib/logger`);

const logger = getLogger({
  name: `api-server-utils`,
});

const readContent = async (fileName) => {
  try {
    const content = await fs.readFile(`./data/${fileName}.txt`, `utf8`);
    const contentArray = content.split(`\n`);
    contentArray.pop();
    return contentArray;
  } catch (err) {
    logger.error(err);
    return [];
  }
};
const TimeConstants = {
  MS: 1000,
  SECONDS: 60,
  MINUTES: 60,
  HOURS: 24,
  DAYS_LIMIT: 90,
};

module.exports = {
  SumRestrict: {
    min: 1000,
    max: 100000,
  },
  OfferType: {
    offer: `offer`,
    buy: `buy`,
  },
  PictureRestrict: {
    min: 1,
    max: 16,
  },
  TimeConstants,
  DateRestrict: {
    min: Date.now() - TimeConstants.SECONDS * TimeConstants.MINUTES * TimeConstants.HOURS * TimeConstants.DAYS_LIMIT * TimeConstants.MS,
    max: Date.now(),
  },
  getRandomInt: (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  shuffle: (someArray) => {
    for (let i = someArray.length - 1; i > 0; i--) {
      const randomPosition = Math.floor(Math.random() * i);
      [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
    }
    return someArray;
  },
  ensureArray: (value) => Array.isArray(value) ? value : [value],
  getFourSortedByCommentsAmount: (someArray) => someArray.slice().sort((a, b) => b.comments.length - a.comments.length).slice(0, 4),
  readContent,
  getPictureFileName: (number) => number >= 10 ? `item${number}.jpg` : `item0${number}.jpg`,
  makeMockData: async (files) => {
    let mockData = {};
    try {
      for (const file of files) {
        const fileName = file.split(`.`)[0];
        const data = await readContent(fileName);
        mockData[fileName] = data;
      }
      return mockData;
    } catch (error) {
      logger.error(error);
      return mockData;
    }
  },
};
