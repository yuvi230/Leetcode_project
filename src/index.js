const express = require('express');
const app = express();
require('dotenv').config();
const main = require('./config/db');
const cookieParser = require('cookie-parser');
const authRouter = require('./router/UserAuth');
const redisclient = require('./config/redis');


app.use(express.json());
app.use(cookieParser());
app.use('/user', authRouter);

const initialzeconnection = async() => {
    try {
        await Promise.all([main(),redisclient.connect()]);
        console.log("connected to db");
        app.listen(process.env.PORT, () => {
            console.log("Server is running on port " + process.env.PORT);
        });
    } catch (err) {
        console.error("Connection initialization failed", err);
    }
}
initialzeconnection();
