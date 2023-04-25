const dotenv = require('dotenv');
const path = require('node:path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    NABLA_PORT: Joi.number().default(41234),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    MONGODB_DATABASE: Joi.string().required().description('Mongo DB Database'),
    SITE_NAME: Joi.string().description('Site name'),
    ACCESS_LOG_DIR: Joi.string().description('NGINX Log directory'),
    ACCESS_LOG_FILE_PATH: Joi.string().description('NGINX Log file'),
    DAYS_TO_EXPIRE: Joi.number().default(15),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  nablaPort: envVars.NABLA_PORT,
  mongoose: {
    url: envVars.MONGODB_URL + '/' + envVars.MONGODB_DATABASE + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    database: envVars.MONGODB_DATABASE,
    options: {
    },
    expireInDays: envVars?.DAYS_TO_EXPIRE
  },
  nginx: {
    siteName: envVars?.SITE_NAME,
    logDir: envVars.ACCESS_LOG_DIR + "/",
    accessLogFilePath: envVars?.ACCESS_LOG_FILE_PATH
  }
};