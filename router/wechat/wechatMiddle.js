'use strict';
const sha1 = require('sha1');
const getRawBody = require('raw-body');
const contentType = require('content-type');
const parseString = require('xml2js').parseString;
const Wechat = require('./wechat');
const util = require('./util');
const reply = require('./reply');
module.exports = function(router, opts) {
    router.get("/", function(req, res) {
        var token = opts.token;
        var signature = req.query.signature;
        var nonce = req.query.nonce;
        var timestamp = req.query.timestamp;
        var echostr = req.query.echostr;
        var str = [token, timestamp, nonce].sort().join('');
        var hashcode = sha1(str);
        if (hashcode == signature) {
            res.send("" + echostr);
            global.logger.info("服务器配置成功,返回给微信服务器的数据echostr: " + echostr);
        } else {
            res.send("wrong");
            global.logger.error('签名校验出错，hashcode:%s,signature:%s', hashcode, signature);
        }

    })
    router.post("/", function(req, res) {
        var token = opts.token;
        var signature = req.query.signature;
        var nonce = req.query.nonce;
        var timestamp = req.query.timestamp;
        var echostr = req.query.echostr;
        var str = [token, timestamp, nonce].sort().join('');
        var hashcode = sha1(str);
        if (hashcode !== signature) {
            res.send("wrong");
            return false;
        }
        getRawBody(req, { length: req.headers['content-length'], limit: '1mb', encoding: contentType.parse(req).parameters.charset }, function(err, strings) {
            if (err) {
                console.log(err);
                return false;
            }
            util.parseXMLmessage(strings).then(function(xmlData) {
                var message = util.formatXMLMessage(xmlData.xml);
                global.logger.info("用户通过公众号请求的数据：%j", message);
                req.weixin = message;
                req.opts = opts;
                reply(req, res)
            });
        });

    })
    return router
}