'use strict';

const axios = require(`axios`).default;

const {getLogger} = require(`../service/lib/logger`);
const {API_PORT, APP_URL} = require(`../../config`);

const TIMEOUT = 1000;
const defaultUrl = `${APP_URL}:${API_PORT}/api/`;

const logger = getLogger({
  name: `api-axios`,
});

class API {
  constructor(baseUrl, timeout) {
    this._baseUrl = baseUrl;
    this._timeout = timeout;
  }

  async getOffers({limit, offset}) {
    const response = await axios.get(`${this._baseUrl}offers`, {params: {offset, limit}});
    return response.data;
  }

  async getOffer(id) {
    try {
      const {data: offer} = await axios.get(`${this._baseUrl}offers/${id}`);
      return offer;
    } catch (error) {
      return logger.error(`Did not find offer: ${error.message}`);
    }
  }

  async updateOffer(id, offer) {
    try {
      const {data: result} = await axios.put(`${this._baseUrl}offers/${id}`, offer);
      return result;
    } catch (error) {
      return logger.error(`Did not update offer: ${error.message}`);
    }
  }

  async search(query) {
    try {
      const {data: result} = await axios.get(`${this._baseUrl}search?query=${query}`);
      return result;
    } catch (error) {
      return logger.error(`Error while search: ${error.message}`);
    }
  }

  async getCategories() {
    const {data: categories} = await axios.get(`${this._baseUrl}categories`);
    return categories;
  }

  async createOffer(data) {
    try {
      const {data: offer} = await axios({
        method: `post`,
        url: `${this._baseUrl}offers`,
        data,
      });
      return offer;
    } catch (error) {
      return logger.error(`Can not create offer: ${error.message}`);
    }
  }

  async getComments(id) {
    const {data: comments} = await axios.get(`${this._baseUrl}offers/${id}/comments`);
    return comments;
  }

  async getMyComments({limit, offset, page}) {
    const {data: result} = await axios.get(`${this._baseUrl}offers/my-comments`, {params: {offset, limit, page}});
    return result;
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI,
};
