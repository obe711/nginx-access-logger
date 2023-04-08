#!/usr/bin/env node

/*!
 * nginx-access-logger
 * Copyright(c) 2021 Obediah Benjamin Klopfenstein <obe711@gmail.com>
 * MIT Licensed
 */

"use strict";

require("dotenv").config();
const fs = require('node:fs');
const DBconnect = require("./connection/DB");
const Tail = require('tail').Tail;
const config = require("./config/config");
const logger = require("./config/logger");



(async () => {
    /* Mongoose Connection */
    const DB = await DBconnect();

    /* Access log path */
    const accessLog = await getSiteLogFilePath();

    /* Follow Log */
    const tail = new Tail(accessLog, { logger });

    /* Logfile change */
    tail.on("line", logAccess);

    /* Error event */
    tail.on('error', (err) => {
        logger.error(err);
    });

    logger.info(`Logging - ${accessLog}`);

    /**
     * Log access data to DB
     * 
     * @param {string} data 
     */
    async function logAccess(data) {
        const newLog = JSON.parse(data.trim())[0];

        const exists = await DB.Access.check(newLog);

        if (!exists) {
            await DB.Access.log(newLog);
        }
    }
})();


/* Global functions */

/**
 * Return the path of the logfile
 * 
 * @returns {Promise<string>} log file path
 */
async function getSiteLogFilePath() {

    let logPath;

    if (config.nginx.siteName) {
        logPath = config.nginx.logDir + config.nginx.siteName + "-access.log";
    } else {
        const nodeArguments = process.argv.slice(2);

        if (nodeArguments.length < 1) {
            logger.error("Missing Site argument");
            process.exit(9)
        }

        if (nodeArguments.length > 1) {
            logger.error("Too many arguments. Only pass site name");
            process.exit(9)
        }

        logPath = config.nginx.logDir + nodeArguments[0] + "-access.log";
    }

    try {
        await fs.promises.access(logPath);
        return logPath;
    } catch (error) {
        logger.error("Log file missing");
        process.exit(9)
    }
}





