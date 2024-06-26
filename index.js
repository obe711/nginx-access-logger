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

    try {
        await fs.promises.access(config.nginx.accessLogFilePath);
    } catch (error) {
        logger.error("Log file missing or invalid user permission");
        process.exit(9)
    }

    /* Nabla Data Socket */
    const nabla = nablaTx.site({ host: config.nginx.siteName });

    /* Follow Log */
    const tail = new Tail(config.nginx.accessLogFilePath);

    /* Logfile change */
    tail.on("line", logAccess);

    /* Error event */
    tail.on('error', (err) => {
        logger.error(err);
    });

    logger.info(`Logging - ${config.nginx.accessLogFilePath}`);

    /**
     * Log access data to DB
     * 
     * @param {string} data 
     */
    async function logAccess(data) {
        try {
            const newLog = JSON.parse(data.trim())[0];
            if (newLog.uri === "/nabla") return;

            const exists = await DB.Access.check(newLog);

            if (!exists) {
                const randomId = `${Math.floor(1000 + Math.random() * 9000)}`;
                newLog.tsId = newLog.tsId + randomId;
                await DB.Access.log(newLog);
                nabla.accessLog(newLog);
            }
        } catch (err) {
            logger.error(`${err.message}`);
        }
    }
})();