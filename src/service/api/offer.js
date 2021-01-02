'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);
const offerValidator = require(`../middlewares/offer-validator`);
const commentValidator = require(`../middlewares/comment-validator`);
const offerExist = require(`../middlewares/offer-exist`);
const {getLogger} = require(`../lib/logger`);

const route = new Router();
const logger = getLogger({
  name: `api-server`,
});

module.exports = (app, offerService, commentService) => {
  app.use(`/offers`, route);

  route.get(`/`, async (req, res) => {
    const offers = await offerService.findAll();

    return res.status(HttpCode.OK)
        .json(offers);
  });

  route.get(`/:offerId`, async (req, res) => {
    const {offerId} = req.params;
    const offer = await offerService.findOne(offerId);

    if (!offer) {
      logger.error(`Error status - ${HttpCode.NOT_FOUND}, url: /api/offers${req.url}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Did not find offer with id: ${offerId}`);
    }

    return res.status(HttpCode.OK)
        .json(offer);
  });

  route.post(`/`, offerValidator, async (req, res) => {
    const offer = await offerService.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(offer);
  });

  route.put(`/:offerId`, offerValidator, async (req, res) => {
    const {offerId} = req.params;
    const offer = await offerService.findOne(offerId);

    if (!offer) {
      logger.error(`Error status - ${HttpCode.NOT_FOUND}, url: /api/offers${req.url}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Did not find offer with id: ${offerId}`);
    }

    const updatedOffer = offerService.update(offerId, req.body);

    return res.status(HttpCode.OK)
      .json(updatedOffer);
  });

  route.delete(`/:offerId`, async (req, res) => {
    const {offerId} = req.params;
    const offer = await offerService.delete(offerId);

    if (!offer) {
      logger.error(`Error status - ${HttpCode.NOT_FOUND}, url: /api/offers${req.url}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Did not find offer with id: ${offerId}`);
    }

    return res.status(HttpCode.OK)
      .json(offer);
  });

  route.get(`/:offerId/comments`, offerExist(offerService), async (req, res) => {
    const {offer} = res.locals;

    const comments = await commentService.findAll(offer.id);

    return res.status(HttpCode.OK)
      .json(comments);
  });

  route.delete(`/:offerId/comments/:commentId`, offerExist(offerService), async (req, res) => {
    const {commentId} = req.params;
    const deletedComment = await commentService.delete(commentId);

    if (!deletedComment) {
      logger.error(`Error status - ${HttpCode.NOT_FOUND}, url: /api/offers${req.url}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Did not find comment with id: ${commentId}`);
    }

    return res.status(HttpCode.OK)
      .json(deletedComment);
  });

  route.post(`/:offerId/comments`, [offerExist(offerService), commentValidator], async (req, res) => {
    const {offer} = res.locals;
    const comment = await commentService.create(offer.id, req.body);

    return res.status(HttpCode.CREATED)
      .json(comment);
  });
};
