'use strict';

module.exports.DEFAULT_COMMAND = `--help`;
module.exports.MAX_DATA_COUNT = 1000;
module.exports.USER_ARGV_INDEX = 2;
module.exports.MAX_ID_LENGTH = 6;
module.exports.MAX_COMMENTS = 4;
module.exports.DEFAULT_COUNT = 1;
module.exports.TXT_FILES_DIR = `./data/`;
module.exports.FILE_NAME = `mocks.json`;

module.exports.ExitCode = {
  error: 1,
  success: 0,
};

module.exports.HttpCode = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
};

module.exports.Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`,
  TEST: `test`,
};
