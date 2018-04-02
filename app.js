const express = require('express');
const middle = require('./wechat/Middle');
const config = require('./config/config');
const reply = require('./wechat/reply');
const app = express();
const weixin = require('./wechat/weixin');
const router = express.Router();
const newrout = require('./router/wechatMiddle')(router, config.wechat)


// app.use(middle(config.wechat));
// app.use(reply(config.wechat));
// app.use(weixin(config.wechat));
app.use(newrout)
app.get('/name', function(req, res) {
    res.send('aaaa')
})
app.listen(config.server.port, function() {
    console.log("server run at http://0.0.0.0:" + config.server.port);
});