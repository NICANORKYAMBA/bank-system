import redis from 'redis';

const client = redis.createClient({
    host: 'localhost',
    port: 6379,
    retry_strategy: function(options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
            return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
            return undefined;
        }

        return Math.min(options.attempt * 100, 3000);
    }
});

client.on('error', (err) => {
    console.error('Redis client encountered an error:', err);
});

client.on('connect', () => {
    console.log('Redis client connected');
});

client.on('ready', () => {
    console.log('Redis client is ready to issue commands');
});

client.on('end', () => {
    console.log('Connection to Redis server has been closed');
});

export default client;