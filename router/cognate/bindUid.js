/**
 * 获取access_token 的Url=https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code,
 * 此处的access_token 与公众号中的access_token不一样。
 */
var Token = require('./token')
var opts = require('../../config/config').wechat
var authInfo = require('../../config/config').authToken
var request = require('request');
var Promise = require('promise')
module.exports = function(router) {
    var tokenApi = new Token(opts);

    router.get('/code', function(req, res) {
        var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + opts.appID + '&redirect_uri=' + authInfo.redirect_url + '&response_type=code&scope=' + authInfo.scope + '&state=' + authInfo.state + '#wechat_redirect'
        res.redirect(url);
    })

    router.get('/bind', function(req, res) {
        var code = req.query.code;
        tokenApi.getAuthToken(code).then(function(data) {
            var _data = data;
            global.DBManager.wechatUserInfo.findOne({ openId: _data.openid }).then(function(result) {
                if (!result) {
                    return Promise.resolve(false);
                } else {
                    return Promise.resolve(result);
                }
            }).then(function(data1) {
                if (data1.openId && data1.openId != '') {
                    res.render('afterBatch.html', { uid: data1.uid });
                } else {
                    res.render('beforeBatch.html', { openid: _data.openid });
                }
            })
        })
    })
    router.post('/bind', function(req, res) {
        console.log("有请求，从绑定页面");
        var uid = req.body;
        console.dir(uid)
        tokenApi.getAuthToken().then(function(data) {

        });
    })
    return router;
}