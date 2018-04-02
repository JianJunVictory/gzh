'use strict';
const sha1 = require('sha1');
const getRawBody = require('raw-body');
const contentType = require('content-type');
const parseString = require('xml2js').parseString;
const Wechat = require('../wechat/wechat');
const util = require('../wechat/util');
const reply = require('./reply');
module.exports = function(router, opts) {
    router.get("/", function(req, res) {
        console.log(req)
        var token = opts.token;
        var signature = req.query.signature;
        var nonce = req.query.nonce;
        var timestamp = req.query.timestamp;
        var echostr = req.query.echostr;
        var str = [token, timestamp, nonce].sort().join('');
        var hashcode = sha1(str);
        if (hashcode == signature) {
            res.send("" + echostr);
        } else {
            res.send("wrong");
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
                req.weixin = message;
                req.opts = opts;
                reply(req, res)
            });
        });

    })
    return router
}