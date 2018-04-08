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
                if (data1.uid && data1.openId && data1.openId != '' && data1.info) {
                    res.render('afterBatch.html', { uid: data1.uid });
                } else {
                    _data.scopes = _data.scope;
                    delete _data.scope;
                    res.render('beforeBatch.html', _data);
                }
            }).catch(function(err) {
                res.status(404);
                res.render('404.html');
            })
        })
    })
    router.post('/checkCode', function(req, res) {
        var uid = req.body.uid;
        var wechatInfo = req.body;
        var checkCode = Math.random().toString(16).substr(3, 6);
        global.DBManager.wechatUserInfo.findOne({ where: { openId: wechatInfo.openid } }).then(function(result) {
            if (!result) {
                global.DBManager.wechatUserInfo.create({ uid: uid, openId: wechatInfo.openid, checkCode: checkCode }).then(function(_reslut) {
                    res.json({ 'errcode': 0, 'errMsg': 'OK' });
                }).catch(function(err) {
                    res.json({ 'errcode': 2001, 'errMsg': 'database error,create failed' });
                })
            } else {
                global.DBManager.wechatUserInfo.update({ uid: uid, checkCode: checkCode }, { where: { openId: wechatInfo.openid } }).then(function(result) {
                    res.json({ 'errcode': 0, 'errMsg': 'OK' });
                }).catch(function(err) {
                    res.json({ 'errcode': 2001, 'errMsg': 'database error,create failed' });
                })
            }
        })
    });
    router.post('/bind', function(req, res) {
        var checkCode = req.body.checkCode;
        var uid = req.body.uid;
        var wechatInfo = req.body;
        global.DBManager.wechatUserInfo.findOne({ attributes: ['checkCode'], where: { uid: uid } }).then(function(result) {
            if (!result.dataValues.checkCode) {
                res.json({});
            }
            if (result.dataValues.checkCode == checkCode) {

                if (wechatInfo.expires_in > (new Date().getTime())) {
                    tokenApi.getUserInfo(wechatInfo).then(function(_datas) {
                        global.DBManager.wechatUserInfo.update({ info: JSON.stringify(_datas) }, { where: { uid: uid } }).then(function(result) {
                            res.json({
                                errcode: '0',
                                errMsg: 'OK',
                                redirect_uri: authInfo.redirect_url
                            })
                        }).catch(function(err) {
                            res.json({
                                errcode: '2003',
                                errMsg: 'database error ,update failed'
                            })
                            return Promise.reject(err);
                        })
                    })
                } else {
                    tokenApi.refreshToken(wechatInfo).then(function(_datas) {
                        tokenApi.isValidAuthToken(_datas).then(function(_result) {
                            if (_result) {
                                tokenApi.getUserInfo(wechatInfo).then(function(_dataS) {
                                    global.DBManager.wechatUserInfo.update({ info: JSON.stringify(_dataS) }, { where: { uid: uid } }).then(function(result) {
                                        res.json({
                                            errcode: '0',
                                            errMsg: 'OK',
                                            redirect_uri: authInfo.redirect_url
                                        })

                                    }).catch(function(err) {
                                        res.json({
                                            errcode: '2003',
                                            errMsg: 'database error ,update failed'
                                        })

                                        return Promise.reject(err);
                                    })
                                })
                            } else {
                                res.json({
                                    errcode: '3002',
                                    errMsg: "access_token过期，refresh_token过期"
                                })
                            }
                        })
                    })
                }
            } else {
                res.json({
                    errcode: '3001',
                    errMsg: "验证码不正确"
                });
            }
        }).catch(function(err) {
            res.json({
                errcode: '2001',
                errMsg: "数据库异常"
            });
        })


    });

    router.post('/unbind', function(req, res) {
        var uid = req.body.uid;
        global.DBManager.wechatUserInfo.destroy({ where: { uid: uid } }).then(function(result) {
            res.json({ 'errcode': '0', 'errMsg': 'OK' });
        }).catch(function(err) {
            res.json({ 'errcode': '2003', 'errMsg': 'database error,delete dailed' });
        });
    });
    return router;
}