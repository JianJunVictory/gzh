'use strict';
const sha1 = require('sha1');
const getRawBody = require('raw-body');
const contentType = require('content-type');
const parseString = require('xml2js').parseString;
const Wechat = require('./wechat');
var util = require('./util');

module.exports = function(opts) {
    return function(req, res, next) {
        var token = opts.token;
        var signature = req.query.signature;
        var nonce = req.query.nonce;
        var timestamp = req.query.timestamp;
        var echostr = req.query.echostr;
        var str = [token, timestamp, nonce].sort().join('');
        var sha = sha1(str);

        if (req.method == "GET") {

            if (sha === signature) {
                res.send('' + echostr);
                next();
            } else {
                res.send('wrong');
                return false;
            }
        } else if (req.method === "POST") {

            if (sha !== signature) {
                res.send('wrong')
                return false;
            }
            getRawBody(req, {
                length: req.headers['content-length'],
                limit: '1mb',
                encoding: contentType.parse(req).parameters.charset
            }, function(err, string) {
                if (err) {
                    console.error(err);
                    return;
                }
                var content = util.parseXMLAsync(string).then(function(xmlData) {
                    var message = util.formatXMLMessage(xmlData);
                    req.weixin = message;
                    next();
                });

            })

        }
    }
}