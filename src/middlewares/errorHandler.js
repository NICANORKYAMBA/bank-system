const logger = require('../controllers/logger');

function errorHandler(err, req, res, next) {
    logger.error(err.message);
    if (res.headersSent) {
        return next(err);
    }
    res.status(500);
    res.json({ error: err.message });
}

module.exports = errorHandler;