const express = require('express');
const ackServerMiddle = require('./wechat/ackServerMiddle');
const config = require('./config/config');
const app = express();


app.use(ackServerMiddle(config.wechat));

app.listen(config.server.port, function() {
    console.log("server run at http://0.0.0.0:" + config.server.port);
});