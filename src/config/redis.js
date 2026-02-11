require('dotenv').config();
const { createClient } = require('redis');

const redisclient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-19512.crce217.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 19512,
    }
});

module.exports = redisclient;


