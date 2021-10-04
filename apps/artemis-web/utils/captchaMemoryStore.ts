function MemoryStore(windowMs) {
    let hits = {};

    this.decr = function (key) {
        if (hits[key] && hits[key] !== 0) {
            hits[key]--;
        }

        return hits[key];
    };

    this.incr = function (key) {
        if (hits[key]) {
            if (hits[key] < parseInt(process.env.CAPTCHA_TRIES, 10) ?? 4)
                hits[key]++;
        } else {
            hits[key] = 1;
        }

        return hits[key];
    };

    this.getHits = (key) => hits[key] ?? 0;

    this.reset = function (key) {
        hits[key] = 0;
    };

    // export an API to allow hits all IPs to be reset
    this.resetAll = function () {
        hits = {};
    };

    // simply reset ALL hits every windowMs
    const interval = setInterval(this.resetAll, windowMs);
    if (interval.unref) {
        interval.unref();
    }
}

const memory = new MemoryStore(parseInt(process.env.CAPTCHA_WINDOW, 10) ?? 900000);

export default memory;