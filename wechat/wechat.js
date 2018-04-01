'use strict';
const Promise = require('promise');
const request = require('request');
const util = require('./util');
var prefix = 'https://api.weixin.qq.com/cgi-bin/';
var api = {
    accessToken: prefix + "token?grant_type=client_credential",
    menu: {
        create: prefix + 'menu/create?',
        get: prefix + 'menu/get?',
        delete: prefix + 'menu/delete?',
        current: prefix + ''
    }
}

function Wechat(opts) {
    this.token = opts.token;
    this.appID = opts.appID;
    this.appsecret = opts.appsecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;
    this.fetchAccessToken();
}

Wechat.prototype.fetchAccessToken = function() {
    var that = this;
    if (this.access_token && this.expires_in) {
        if (this.isValidAccessToken(this)) {
            return Promise.resolve(this);
        }
    }
    return this.getAccessToken().then(function(data) {
        try {
            data = JSON.parse(data)
        } catch (e) {
            return that.updateAccessToken()
        }

        if (that.isValidAccessToken(data)) {
            return Promise.resolve(data);
        } else {
            return that.updateAccessToken();
        }
    }).then(function(data) {
        console.log(data)
        that.access_token = data.access_token;
        that.expire_in = data.expire_in;
        that.saveAccessToken(data);
        console.log(data)
        return Promise.resolve(data);
    })
}
Wechat.prototype.isValidAccessToken = function(data) {
    if (!data || !data.access_token || !data.expires_in) {
        return false;
    }
    var access_token = data.access_token;
    var expires_in = data.expires_in;
    var now = (new Date().getTime());
    if (now < expires_in) {
        return true;
    } else {
        return false;
    }
}

Wechat.prototype.updateAccessToken = function() {
    var appID = this.appID;
    var appsecret = this.appsecret;
    var url = api.accessToken + '&appid=' + appID + '&secret=' + appsecret;
    return new Promise(function(resolve, reject) {
        request({ url: url, json: true, rejectUnauthorized: false }, function(error, response, body) {
            if (error) reject(error)
            var data = body
            var now = (new Date().getTime());
            var expires_in = now + (data.expires_in - 20) * 1000;
            data.expires_in = expires_in;
            resolve(data);
        })
    })

}
Wechat.prototype.reply = function(content, message) {
    return new Promise(function(resolve, reject) {
        var xml = util.tpl(content, message)
        resolve(xml);
    })
}

Wechat.prototype.deleteMenu = function() {
    var that = this;
    return new Promise(function(resolve, reject) {
        that.fetchAccessToken().then(function(data) {
            var url = api.menu.delete + '&access_token=' + data.access_token;
            request({ method: 'GET', rejectUnauthorized: false, url: url, json: true }, function(error, response, body) {
                if (error) {
                    reject(err);
                }
                var _data = body;
                resolve(_data);
            })
        })
    })
}

module.exports = Wechat;