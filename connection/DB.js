const mongoose = require('mongoose');
const config = require("../config/config");
const logger = require("../config/logger")

module.exports = async function DBconnect() {
    try {
        mongoose.connect(config.mongoose.url, config.mongoose.options);

        logger.info(`Connected to ${process.env.NODE_ENV} ${config.mongoose.database} MongoDB`);

        const Access = mongoose.model("Access", require('../schema/accessLog.schema'));

        return { Access }

    } catch (err) {
        logger.error(`DB: ${err.message}`);
    }
};