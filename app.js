const express = require('express');
const ackServerMiddle = require('./wechat/ackServerMiddle');
const config = require('./config/config');
const reply = require('./wechat/reply');
const app = express();
const weixin = require('./wechat/weixin');


app.use(ackServerMiddle(config.wechat));
app.use(reply());
app.use(weixin(config.wechat));

app.listen(config.server.port, function() {
    console.log("server run at http://0.0.0.0:" + config.server.port);
});