'use strict';

const express = require(`express`);
const path = require(`path`);
const helmet = require(`helmet`);
const session = require(`express-session`);
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);

const myRoutes = require(`./routes/my-routes`);
const offersRoutes = require(`./routes/offers-routes`);
const mainRoutes = require(`./routes/main-routes`);
const {getLogger} = require(`../service/lib/logger`);
const {APP_PORT, SESSION_SECRET} = require(`../../config`);
const sequelize = require(`../service/lib/sequelize`);
const {PUBLIC_DIR, UPLOAD_DIR, MULTER_ERRORS} = require(`../constants`);

const logger = getLogger({
  name: `front-server`,
});

if (!SESSION_SECRET) {
  throw new Error(`SESSION_SECRET environment variable is not defined`);
}

const app = express();

const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 180000,
  checkExpirationInterval: 60000
});

sequelize.sync({force: false});

app.use(express.urlencoded({extended: false}));

app.use(session({
  secret: SESSION_SECRET,
  store: mySessionStore,
  resave: false,
  proxy: true,
  saveUninitialized: false,
}));

app.use(express.static(path.join(__dirname, PUBLIC_DIR)));
app.use(express.static(path.join(__dirname, UPLOAD_DIR)));

app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      scriptSrc: [`'self'`]
    }
  },
  xssFilter: true,
}));

app.set(`views`, path.join(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });
  next();
});

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/offers`, offersRoutes);

app.use((req, res) => {
  logger.error(`Error status - 404, url: ${req.url}`);
  res.status(404).render(`errors/404`, {title: `Страница не найдена`});
});

app.use((err, req, res, _next) => {
  if (err.message === MULTER_ERRORS.NOT_IMAGE || err.message === MULTER_ERRORS.FILE_TOO_LARGE) {
    logger.error(`Error from multer: ${err.message}`);
    return res.redirect(`${req.url}?error=${encodeURIComponent(err)}`);
  }

  logger.error(`Error status - ${err.status || 500}, ${err}`);
  res.status(err.status || 500);
  return res.render(`errors/500`, {title: `Ошибка сервера`});
});

app.listen(APP_PORT, (err) => {
  if (err) {
    return logger.error(`Ошибка при создании сервера: ${err}`);
  }

  return logger.info(`Ожидаю соединений на ${APP_PORT} порт`);
});
