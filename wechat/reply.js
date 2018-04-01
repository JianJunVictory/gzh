var Wechat = require('./wechat');
var config = require('../config/config');
module.exports = function() {
    return function(req, res, next) {
        var message = req.weixin;
        if (message.MsgType == 'event') {
            if (message.Event === 'subscribe') {
                if (message.EventKey) {
                    console.log('扫描二维码 ' + message.EventKey + message.ticket);
                }
                res.body = "哈哈，你订阅了订阅号！";
            } else if (message.Event === 'unsubscribe') {
                console.log('取消了关注');
            } else if (message.Event === 'LOCATION') {
                res.body = "你上报的位置是" + message.Latitude + message.Longitude + ' 精度' + message.Precision;
                console.log('取消了关注');
            } else if (message.Event === 'CLICK') {
                res.body = "你点击了菜单" + message.EventKey;
                console.log('取消了关注');
            } else if (message.Event === 'SCAN') {
                res.body = "你点击了菜单" + message.EventKey;
                console.log('取消了关注');
            } else if (message.Event === 'VIEW') {
                res.body = "你点击了菜单" + message.EventKey;
                console.log('取消了关注');
            } else if (message.MsgType == 'text') {
                var content = message.content;
                var replys = "太复杂了"
                if ('1' === content) {
                    replys = '1111111111111';
                } else if ('2' === content) {
                    replys = '222222222222';
                } else if ('3' === content) {
                    replys = '33333333333333333';
                }
                res.body = replys;
            }

        } else {}
        next();
    }
}