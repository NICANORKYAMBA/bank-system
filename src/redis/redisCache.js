import util from 'util';
import client from './redisClient.js';

client.getAsync = util.promisify(client.get).bind(client);
client.delAsync = util.promisify(client.del).bind(client);

const CACHE_EXPIRY_TIME = 3600;

async function checkCache(req, res, next) {
  const cacheKey = req.path;

  try {
    const result = await client.getAsync(cacheKey);

    if (result) {
      let data;
      try {
        data = JSON.parse(result);
      } catch (err) {
        console.error('Error parsing data from Redis:', err);
        return res.status(500).json({
          message: 'Error parsing data from cache',
          error: err.message
        });
      }

      console.log('Returning data from cache:', data);
      res.status(200).json({
        message: 'Data retrieved from cache',
        data
      });
    } else {
      next();
    }
  } catch (err) {
    console.error('Redis error:', err);
    next(err);
  }
}

async function invalidateCache(accountNumber) {
  const cacheKey = 'user:' + accountNumber;

  try {
    await client.delAsync(cacheKey);
  } catch (err) {
    console.error('Error invalidating cache:', err);
  }
}

export { checkCache, invalidateCache };