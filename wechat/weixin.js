var Wechat = require('./wechat');
module.exports = function(options) {
    var wechat = new Wechat(options);
    return function(req, res, next) {
        var content = req.content;
        var message = req.weixin;
        wechat.reply(content, message).then(function(xml) {
            delete req.content;
            res.status(200);
            //res.set('Content-Type', 'application/xml');
            res.send(xml);
            next();
        })
    }
}