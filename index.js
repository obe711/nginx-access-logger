#!/usr/bin/env node

/*!
 * nginx-access-logger
 * Copyright(c) 2021 Obediah Benjamin Klopfenstein <obe711@gmail.com>
 * MIT Licensed
 */

"use strict";

require("dotenv").config();
const fs = require('fs');
const DBconnect = require("./connection/DB");
const Tail = require('tail').Tail;



(async () => {
    /* Mongoose Connection */
    const DB = await DBconnect(process.env.MONGODB_URL);

    /* Access log path */
    const accessLog = await getSiteLogFilePath();

    /* Follow Log */
    const tail = new Tail(accessLog);

    /* Logfile change */
    tail.on("line", logAccess);

    /* Error event */
    tail.on('error', (err) => {
        console.error(err)
    });

    console.log("Logging", accessLog);

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
 * @returns {string} log file path
 */
async function getSiteLogFilePath() {

    let logPath;

    if (process.env?.ACCESS_LOG_PATH) {
        logPath = process.env.ACCESS_LOG_PATH
    } else {

        const nodeArguments = process.argv.slice(2);

        if (nodeArguments.length < 1) {
            console.error("Missing Site argument");
            process.exit(9)
        }

        if (nodeArguments.length > 1) {
            console.error("Too many arguments. Only pass site name");
            process.exit(9)
        }

        logPath = process.env.NODE_ENV === "development" ? `./log/${nodeArguments[0]}-access.log` : `/var/log/nginx/${nodeArguments[0]}-access.log`;
    }

    try {
        await fs.promises.access(logPath);
        return logPath;
    } catch (error) {
        console.error("Log file missing");
        process.exit(9)
    }
}





