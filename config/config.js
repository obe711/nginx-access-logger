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
    ACCESS_LOG_DIR: Joi.string().required().description('NGINX Log directory'),
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
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      autoIndex: false, // Don't build indexes
      poolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    },
  },
  nginx: {
    siteName: envVars?.SITE_NAME,
    logDir: envVars.ACCESS_LOG_DIR + "/"
  }
};