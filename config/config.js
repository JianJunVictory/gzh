const Promise = require('promise');
const path = require('path');
const util = require('../libs/util');
const fpath = path.join(__dirname, './wechat.txt');

const config = {
    wechat: {
        appID: "wx63e04fe98fc74772",
        appsecret: "8241a22c4bbca8fcc2863bb2b000930d",
        token: "guangxinxiliujianjun",
        getAccessToken: function() {
            return util.readFileAsync(fpath);
        },
        saveAccessToken: function(data) {
            data = JSON.stringify(data);
            return util.writeFileAysnc(fpath, data);
        }
    },
    server: {
        port: 1234
    },
    authToken: {
        redirect_url: 'http://deb5eaa5.ngrok.io/cognate/bind',
        state: '123',
        scope: 'snsapi_base'
    },
    DBConfig: {
        fishdb: {
            "host": "192.168.232.128",
            "port": 3306,
            "user": "root",
            "password": "123456",
            "database": "wechat",
            "charset": "UTF8_GENERAL_CI",
            "connectNum": 10,
            "idleTimeoutMillis": 30000
        }
    }
}

module.exports = config