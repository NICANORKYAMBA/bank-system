import logger from '../controllers/logger.js';

export default function errorHandler (err, req, res, next) {
  logger.error(err.message);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.json({ error: err.message });
}

export const handleValidationError = (res, message) => {
  return res.status(400).json({ message });
};

export const handleDatabaseError = (res, err) => {
  console.error(err);
  return res.status(500).json({
    message: 'Database error: ' + err.message
  });
};
