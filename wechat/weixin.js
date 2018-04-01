var Wechat = require('./wechat');
module.exports = function(options) {
    var wechat = new Wechat(options);
    return function(req, res, next) {
        var content = res.body;
        var message = req.message;
        wechat.reply(content, message).then(function(xml) {
            delete res.body;
            res.status(200);
            res.type('application/xml');
            res.send(xml);
            next();
        })
    }
}