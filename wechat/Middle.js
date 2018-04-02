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
        var hashcode = sha1(str);

        if (req.method == "GET") {
            console.log("aaaaaaaaaaaaaaa" + req.baseUrl)
            if (req.baseUrl == "/" || req.baseUrl == "") {
                if (hashcode == signature) {
                    res.send("" + echostr);
                } else {
                    res.send("wrong");
                    next();
                }
            } else {

                next();
            }
        } else if (req.method === "POST") {
            if (req.baseUrl == "" || req.baseUrl == "/") {
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
                        next();
                    });
                });
            } else {
                next();
            }

        }
    }
}