'use strict';

const axios = require(`axios`).default;

const {getLogger} = require(`../service/lib/logger`);

const TIMEOUT = 1000;
const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

const logger = getLogger({
  name: `api-axios`,
});

class API {
  constructor(baseUrl, timeout) {
    this._baseUrl = baseUrl;
    this._timeout = timeout;
  }

  async getOffers() {
    const {data: offers} = await axios.get(`${this._baseUrl}offers`);
    return offers;
  }

  async getOffer(id) {
    const {data: offer} = await axios.get(`${this._baseUrl}offers/${id}`);
    return offer;
  }

  async search(query) {
    try {
      const {data: offers} = await axios.get(`${this._baseUrl}search?query=${query}`);
      return offers;
    } catch (error) {
      return logger.error(`Error while search: ${error.message}`);
    }
  }

  async getCategories() {
    const {data: categories} = await axios.get(`${this._baseUrl}categories`);
    return categories;
  }

  async createOffer(data) {
    const {data: offer} = await axios({
      method: `post`,
      url: `${this._baseUrl}offers`,
      data
    });
    return offer;
  }

  async getComments(id) {
    const {data: comments} = await axios.get(`${this._baseUrl}offers/${id}/comments`);
    return comments;
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI,
};
