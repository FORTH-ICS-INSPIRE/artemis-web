import rateLimit from "express-rate-limit";
require('dotenv').config();


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

const limiter = (file) => rateLimit({
    windowMs: parseInt(process.env.LIMIT_WINDOW),
    max: parseInt(process.env.LIMIT_REQUESTS),
    store: new MemoryStore(parseInt(process.env.LIMIT_WINDOW), file)
});

export default limiter;