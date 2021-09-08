import rateLimit from "express-rate-limit";
require('dotenv').config();

const limiter = rateLimit({
    windowMs: parseInt(process.env.LIMIT_WINDOW),
    max: parseInt(process.env.LIMIT_REQUESTS)
});

export default limiter;