'use strict';

const request = require(`supertest`);

const {createApp} = require(`../cli/server`);
const {sequelize} = require(`../database`);
const {HttpCode, ExitCode} = require(`../../constants`);

const mockOffer = {
  "title": `Title`,
  "picture": `02.jpg`,
  "description": `Some description`,
  "type": `offer`,
  "sum": 1,
  "categories": [
    `Разное`,
  ],
};

let app = null;
let mockOfferId;
let mockCommentId;

beforeAll(async () => {
  try {
    app = await createApp();
  } catch (error) {
    process.exit(ExitCode.error);
  }
});

afterAll(() => {
  sequelize.close();
});

describe(`Offer API end-points:`, () => {
  let res;

  test(`status code of GET offers query should be 200`, async () => {
    res = await request(app).get(`/api/offers`);
    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`output after GET should be an array with at least length 1`, async () => {
    res = await request(app).get(`/api/offers`);
    expect(res.body.offers.length).toBeGreaterThan(0);
    expect(res.body.count).toBeGreaterThan(0);
    expect(Array.isArray(res.body.offers)).toBeTruthy();
  });

  test(`status code for wrong GET offer request should be 404`, async () => {
    res = await request(app).get(`/api/offers/999999`);

    expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  test(`status code for POST offer request should be 201`, async () => {
    res = await request(app)
      .post(`/api/offers`)
      .send(mockOffer);

    mockOfferId = res.body.id;

    expect(res.statusCode).toBe(HttpCode.CREATED);
  });

  test(`status code for incorrect POST offer query should be 400`, async () => {
    res = await request(app)
      .post(`/api/offers`)
      .send({"some": `some`});

    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`status code for GET offer query by id should be 200`, async () => {
    res = await request(app).get(`/api/offers/${mockOfferId}`);

    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`status code for GET query to my/comments should be 200`, async () => {
    res = await request(app).get(`/api/offers/my-comments`);

    expect(res.statusCode).toBe(HttpCode.OK);
    expect(res.body.slicedOffers.length).toBe(3);
    expect(Array.isArray(res.body.slicedOffers)).toBeTruthy();
  });

  test(`PUT request should work and status code should be 200`, async () => {
    res = await request(app)
      .put(`/api/offers/${mockOfferId}`)
      .send({
        "title": `Title`,
        "picture": `01.jpg`,
        "description": `New description`,
        "type": `offer`,
        "sum": 999,
        "categories": [2],
      });
    expect(res.statusCode).toBe(HttpCode.OK);
    expect(res.body.sum).toBe(`999`);
    expect(res.body.categories[0].id).toBe(`2`);
  });

  test(`wrong PUT request should not work and status code  should be 400`, async () => {
    res = await request(app)
      .put(`/api/offers/${mockOfferId}`)
      .send({
        "title": `Title`,
      });
    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`DELETE offer request should work and status code after deleting should be 200`, async () => {
    res = await request(app).delete(`/api/offers/${mockOfferId}`);
    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`status for incorrect DELETE offer request should be 500`, async () => {
    res = await request(app).delete(`/api/offers/xx`);

    expect(res.statusCode).toBe(HttpCode.INTERNAL_SERVER_ERROR);
  });
});

describe(`Offer comments API end-points`, () => {
  let res;

  test(`status code after GET request for comments should be 200 and and output should be array`, async () => {
    res = await request(app)
      .post(`/api/offers`)
      .send(mockOffer);

    mockOfferId = res.body.id;
    res = await request(app).get((`/api/offers/${mockOfferId}/comments`));

    expect(res.statusCode).toBe(HttpCode.OK);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test(`status code after request of comments with wrong offer id should be 404`, async () => {
    res = await request(app).get((`/api/offers/xx/comments`));

    expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  test(`status code after POST comment request should be 201`, async () => {
    res = await request(app)
      .post((`/api/offers/${mockOfferId}/comments`))
      .send({
        "text": `Some text`,
      });

    expect(res.statusCode).toBe(HttpCode.CREATED);
  });

  test(`status code after wrong POST request of comment should be 400`, async () => {
    res = await request(app)
      .post((`/api/offers/${mockOfferId}/comments`))
      .send({
        "some": `Some`,
      });

    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`delete comment request should delete comment and status code after should be 200`, async () => {
    res = await request(app)
    .post((`/api/offers/${mockOfferId}/comments`))
    .send({
      "text": `Some text`,
    });
    mockCommentId = res.body.id;

    res = await request(app).delete((`/api/offers/${mockOfferId}/comments/${mockCommentId}`));
    expect(res.statusCode).toBe(HttpCode.OK);

    res = await request(app).get((`/api/offers/${mockOfferId}/comments`));
    expect(res.body.length).toBe(1);
  });

  test(`status code after delete comment request with wrong comment id should return 404`, async () => {
    res = await request(app).delete((`/api/offers/${mockOffer.id}/comments/xx`));

    expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
  });
});
