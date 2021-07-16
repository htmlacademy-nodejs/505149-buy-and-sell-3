'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

const {getLogger} = require(`../../service/lib/logger`);
const {ensureArray} = require(`../../utils`);

const UPLOAD_DIR = `../upload/img/`;

const api = require(`../api`).getAPI();
const offersRouter = new Router();
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const logger = getLogger({
  name: `front-server-multer`,
});

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

offersRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`new-offer`, {categories});
});

offersRouter.post(`/add`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const offerData = {
    picture: file.filename,
    sum: body.sum,
    type: body.type,
    description: body.description,
    title: body[`title`],
    category: ensureArray(body.category),
  };

  try {
    await api.createOffer(offerData);
    res.redirect(`/my`);
  } catch (err) {
    logger.error(err);
    res.redirect(`back`);
  }
});

offersRouter.get(`/category/:id`, (req, res) => res.render(`category`, {}));
offersRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  try {
    const offer = await api.getOffer(id);
    res.render(`offer`, {offer});
  } catch (error) {
    res.status(error.response.status).render(`errors/404`, {title: `Страница не найдена`});
  }
});

offersRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [offer, categories] = await Promise.all([api.getOffer(id), api.getCategories()
  ]);
  const plainOfferCategories = offer.categories.reduce((acc, item) => {
    acc.push(item.title);
    return acc;
  }, []);

  if (offer) {
    res.render(`offer-edit`, {offer, categories, plainOfferCategories, id});
  } else {
    res.status(404).render(`errors/404`, {title: `Страница не найдена`});
  }
});

module.exports = offersRouter;
