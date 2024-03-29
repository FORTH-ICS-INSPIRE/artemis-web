import rateLimit from "express-rate-limit";
/* eslint-disable */
require('dotenv').config();
/* eslint-enable */

function calculateNextResetTime(windowMs) {
    const d = new Date();
    d.setMilliseconds(d.getMilliseconds() + windowMs);
    return d;
}

function MemoryStore(windowMs, file) {
    let hits = {};
    let resetTime = calculateNextResetTime(windowMs);

    this.incr = function (key, cb) {
        if (hits[file + "," + key]) {
            hits[file + "," + key]++;
        } else {
            hits[file + "," + key] = 1;
        }

        cb(null, hits[file + "," + key], resetTime);
    };

    this.decrement = function (key) {
        if (hits[file + "," + key]) {
            hits[file + "," + key]--;
        }
    };

    // export an API to allow hits all IPs to be reset
    this.resetAll = function () {
        hits = {};
        resetTime = calculateNextResetTime(windowMs);
    };

    // export an API to allow hits from one IP to be reset
    this.resetKey = function (key) {
        delete hits[file + "," + key];
    };

    // simply reset ALL hits every windowMs
    const interval = setInterval(this.resetAll, windowMs);
    if (interval.unref) {
        interval.unref();
    }
}

const limiter = (file: string): any => {
    return rateLimit({
        windowMs: parseInt(process.env.LIMIT_WINDOW ?? '900000', 10),
        max: parseInt(process.env.LIMIT_REQUESTS ?? '20', 10),
        store: new MemoryStore(parseInt(process.env.LIMIT_WINDOW ?? '900000', 10), file)
    });
}

export default limiter;