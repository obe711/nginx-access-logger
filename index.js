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
const NablaTx = require("mt-nabla-tx");

const devLogger = config.env !== "production" ? logger : null

const nablaTx = new NablaTx({ logger: devLogger, port: config.nablaPort });


(async () => {
    /* Mongoose Connection */
    const DB = await DBconnect();

    /* Access log path */
    const { logPath, host } = await getSiteLogFilePath();
    logger.info(`Access log: ${logPath}`)

    /* Nabla Data Socket */
    const nabla = nablaTx.site({ host });

    /* Follow Log */
    const tail = new Tail(logPath);

    /* Logfile change */
    tail.on("line", logAccess);

    /* Error event */
    tail.on('error', (err) => {
        logger.error(err);
    });

    logger.info(`Logging - ${logPath}`);

    /**
     * Log access data to DB
     * 
     * @param {string} data 
     */
    async function logAccess(data) {
        const newLog = JSON.parse(data.trim())[0];
        if (newLog.uri === "/nabla") return;

        const exists = await DB.Access.check(newLog);

        if (!exists) {
            await DB.Access.log(newLog);
            nabla.accessLog(newLog);
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
    let host;

    if (config.nginx.siteName) {
        host = config.nginx.siteName;
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

        host = nodeArguments[0];
    }

    logPath = config.nginx?.accessLogFilePath || config.nginx.logDir + host + "-access.log";

    try {
        await fs.promises.access(logPath);
        return { logPath, host };
    } catch (error) {
        logger.error("Log file missing");
        process.exit(9)
    }
}





