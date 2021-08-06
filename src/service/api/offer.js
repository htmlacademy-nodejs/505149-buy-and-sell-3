'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);
const offerValidator = require(`../middlewares/offer-validator`);
const commentValidator = require(`../middlewares/comment-validator`);
const offerExist = require(`../middlewares/offer-exist`);
const {getLogger} = require(`../lib/logger`);

const route = new Router();
const logger = getLogger({
  name: `api-server-offer`,
});

module.exports = (app, offerService, commentService) => {
  app.use(`/offers`, route);

  route.get(`/`, async (req, res) => {
    const {limit, offset, comments} = req.query;
    let result;

    try {
      if (limit || offset) {
        result = await offerService.findPage({limit, offset, comments});
      } else {
        result = await offerService.findAll(comments);
      }

      res.status(HttpCode.OK).json(result);
    } catch (err) {
      logger.error(`Error status - ${HttpCode.INTERNAL_SERVER_ERROR}`);
      res.status(HttpCode.INTERNAL_SERVER_ERROR).send(err);
    }
  });

  route.get(`/:offerId`, async (req, res) => {
    const {offerId} = req.params;
    const {comments} = req.query;
    const offer = await offerService.findOne(offerId, comments);

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

    if (!offer) {
      logger.error(`Error status - ${HttpCode.INTERNAL_SERVER_ERROR}`);
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).send(`Can not create offer`);
    }

    return res.status(HttpCode.CREATED)
      .json(offer);
  });

  route.put(`/:offerId`, offerValidator, async (req, res) => {
    const {offerId} = req.params;

    const isOfferUpdated = await offerService.update(offerId, req.body);

    if (!isOfferUpdated) {
      logger.error(`Error status - ${HttpCode.NOT_FOUND}, url: /api/offers${req.url}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${offerId}`);
    }

    return res.status(HttpCode.OK).send(`Updated`);
  });

  route.delete(`/:offerId`, async (req, res) => {
    const {offerId} = req.params;
    const isOfferDeleted = await offerService.drop(offerId);

    if (!isOfferDeleted) {
      logger.error(`Error status - ${HttpCode.INTERNAL_SERVER_ERROR}`);
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).send(`Can not delete offer`);
    }

    return res.status(HttpCode.OK).send(`Deleted!`);
  });

  route.get(`/:offerId/comments`, offerExist(offerService), async (req, res) => {
    const {offer} = res.locals;

    const comments = await commentService.findAll(offer.id);

    if (!comments) {
      logger.error(`Error status - ${HttpCode.NOT_FOUND}`);
      return res.status(HttpCode.NOT_FOUND).send(`Can not find comments for offer with id ${offer.id}.`);
    }

    return res.status(HttpCode.OK)
      .json(comments);
  });

  route.delete(`/:offerId/comments/:commentId`, offerExist(offerService), async (req, res) => {
    const {commentId} = req.params;
    const deletedComment = await commentService.delete(commentId);

    if (!deletedComment) {
      logger.error(`Error status - ${HttpCode.INTERNAL_SERVER_ERROR}`);
      return res.status(HttpCode.INTERNAL_SERVER_ERROR)
        .send(`Can not delete comment`);
    }

    return res.status(HttpCode.OK)
      .json(deletedComment);
  });

  route.post(`/:offerId/comments`, [offerExist(offerService), commentValidator], async (req, res) => {
    const {offer} = res.locals;
    const comment = await commentService.create(offer.id, req.body);

    if (!comment) {
      logger.error(`Error status - ${HttpCode.INTERNAL_SERVER_ERROR}`);
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).send(`Can not create comment`);
    }

    return res.status(HttpCode.CREATED)
      .json(comment);
  });
};
