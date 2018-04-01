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
                req.content = "哈哈，你订阅了订阅号！";
            } else if (message.Event === 'unsubscribe') {
                console.log('取消了关注');
            } else if (message.Event === 'LOCATION') {
                req.content = "你上报的位置是" + message.Latitude + message.Longitude + ' 精度' + message.Precision;
                console.log('取消了关注');
            } else if (message.Event === 'CLICK') {
                req.content = "你点击了菜单" + message.EventKey;
                console.log('取消了关注');
            } else if (message.Event === 'SCAN') {
                req.content = "你点击了菜单" + message.EventKey;
                console.log('取消了关注');
            } else if (message.Event === 'VIEW') {
                req.content = "你点击了菜单" + message.EventKey;
                console.log('取消了关注');
            }
        } else if (message.MsgType == 'text') {
            var content = message.Content;
            var replys = "太复杂了"
            if ('1' === content) {
                replys = '1111111111111';
            } else if ('2' === content) {
                replys = '222222222222';
            } else if ('3' === content) {
                replys = '33333333333333333';
            }
            req.content = replys;
        }

        next();
    }
}