'use strict';
const sha1 = require('sha1');
const getRawBody = require('raw-body');
const contentType = require('content-type');
const parseString = require('xml2js').parseString;

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
                var xml = string.toString();
                parseString(xml, function(err, data) {
                    var message = data.xml;
                    if (message.MsgType[1] == "event") {
                        if (message.Event[1] == "subscribe") {
                            res.status(200);
                            res.set('Content-Type', 'text/xml');
                            var str = "<xml><ToUserName><![CDATA[" + message.FromUserName + "]]></ToUserName><FromUserName><![CDATA[" + message.ToUserName + "]]></FromUserName><CreateTime>" + (new Date().getTime()) + "</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[你好]]></Content></xml>"
                            res.send(xml(str));
                            next();
                        }
                    }
                });

            })

        }
    }
}