'use strict';
const Promise = require('bluebird'); //
const request = Promise.promisify(require('request'));
const util = require('./util');
var prefix = 'https://api.weixin.qq.com/cgi-bin/token?';
var api = {
    accessToken: prefix + "grant_type=client_credential"
}

function Wechat(opts) {
    this.token = opts.token;
    this.appID = opts.appID;
    this.appsecret = opts.appsecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccesToken = opts.saveAccesToken;

    this.getAccessToken()
        .then(function(data) {
            try {
                data = JSON.parse(data)
            } catch (e) {
                return this.updateAccessToken(data)
            }
            if (this.isValidAccessToken(data)) {
                return Promise.resolve(data);
            } else {
                return this.updateAccessToken();
            }
        }).then(function() {
            this.access_token = data.access_token;
            this.expire_in = data.expire_in;
            thsi.saveAccesToken(data);
        })
}

Wechat.prototype.isValidAccessToken = function(data) {
    if (!data || !data.access_token || !data.expire_in) {
        return false;
    }
    var access_token = data.access_token;
    var expire_in = data.expire_in;
    var now = (new Date().getTime());
    if (now < expire_in) {
        return true;
    } else {
        return false;
    }
}

Wechat.prototype.updateAccessToken = function() {
    var appID = this.appID;
    var appsecret = this.appsecret;
    var token = this.token;
    var url = api.accessToken + '&appid' + appID + '&secret=' + appsecret;

    return new Promise(function(resolve, reject) {
        request({ url: url, json: true })
            .then(function(response) {
                var data = response[1];
                var now = (new Date().getTime());
                var expire_in = now + (data.expire_in - 20) * 1000;
                data.expire_in = expire_in;
                resolve(data);
            })
    })

}
Wechat.prototype.reply = function(content, message) {
    return new Promise(function(resolve, reject) {
        var xml = util.tpl(conetnt, message)
        resolve(xml);
    })
}

module.exports = Wechat;