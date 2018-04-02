var Wechat = require('./wechat');
var menu = require('../config/menu');
module.exports = function(opts) {
    var wechatApi = new Wechat(opts)
    wechatApi.createMenu(menu).then(function(data) {
            console.log(data);
        })
        /*	wechatApi.deleteMenu().then(function(data){
                console.log(data);
            })*/
    return function(req, res, next) {
        dotext(req, opts, function(data) {
            req.content = data;
            next();
        })
    }
}

function dotext(req, opts, cb) {
    var wechat = new Wechat(opts);
    var message = req.weixin;
    var msgType = message.MsgType;
    if (msgType == "event") {
        if (message.Event === 'subscribe') {
            if (message.EventKey) {
                console.log("扫描二维码 " + message.EventKey + ' ' + message.ticket)
            }
            var replyData = "哈哈，你订阅了号"
            cb(replyData);
        } else if (message.Event === 'unsubscribe') {
            console.log('取消关注');
            var replyData = '取消关注'
            cb(replyData);
        } else if (message.Event === 'Location') {
            cb("你上报的位置是：" + message.Latitude + message.Longtiude + '-' + message.Precision);
        } else if (message.Event === 'CLICK') {
            if (message.EventKey == 'join_qun') {
                var replys = 'http://sighttp.qq.com/authd?IDKEY=f7968c8570255f4f492d90a5689ec2c9cb0250c03962254c'
            } else {
                var replys = "你点击了菜单:" + message.EventKey
            }
            cb(replys);
        } else if (message.Event === 'SCAN') {
            console.log('关注后扫描二维码' + message.EventKey + ' ' + message.Ticket)
            cb("看到你扫描了一下哦:" + message.EventKey);
        } else if (message.Event === 'VIEW') {
            console.log('关注后扫描二维码' + message.EventKey + ' ' + message.Ticket)
            cb("你点击了菜单中的链接:" + message.EventKey);
        } else if (message.Event === 'scancode_push') {
            console.log('关注后扫描二维码scancode_push' + message.ScanCodeInfo.ScanType + ' ' + message.ScanCodeInfo.ScanResult)
            cb("你点击了菜单中的链接scancode_push:" + message.EventKey);
        } else if (message.Event === 'scancode_waitmsg') {
            console.log('关注后扫描二维码scancode_waitmsg' + message.ScanCodeInfo.ScanType + ' ' + message.ScanCodeInfo.ScanResult)
            cb("你点击了菜单中的链接:" + message.EventKey);
        } else if (message.Event === 'pic_sysphoto') {
            console.log('关注后扫描二维码pic_sysphoto' + message.SendPicsInfo.PicList + ' ' + message.SendPicsInfo.Count)
            cb("你点击了菜单中的链接:" + message.EventKey);
        } else if (message.Event === 'pic_sysphoto_or_album') {
            console.log('关注后扫描二维码pic_sysphoto_or_album' + message.SendPicsInfo.PicList + ' ' + message.SendPicsInfo.Count)
            cb("你点击了菜单中的链接:" + message.EventKey);
        } else if (message.Event === 'pic_weixin') {
            console.log('关注后扫描二维码pic_weixin' + message.SendPicsInfo.PicList + ' ' + message.SendPicsInfo.Count)
            cb("你点击了菜单中的链接:" + message.EventKey);
        } else if (message.Event === 'location_select') {
            console.log('关注后扫描二维码location_select')
            console.log(message.SendLocationInfo.Location_X)
            console.log(message.SendLocationInfo.Location_Y)
            console.log(message.SendLocationInfo.Scale)
            console.log(message.SendLocationInfo.Label)
            console.log(message.SendLocationInfo.Poiname)
            cn("你点击了菜单中的链接:" + message.EventKey);
        }
    } else if (msgType === "text") {
        var content = message.Content;
        if (content === '1') {
            //同上同下，以后可以扩展从数据库配置
            var replysData = '信息item1'
            cb(replysData)
        } else if (content === '2') {
            var replysData = '信息item2'
            cb(replysData)
        } else if (content === '3') {
            var replysData = [{
                title: '完美创优',
                description: '哟个游戏公司',
                picUrl: 'https://bpic.588ku.com/original_origin_min_pic/18/03/21/353363dc9f1370726cea4636268b2f1b.jpg!ww1200',
                url: 'http://github.com'
            }, {
                title: '完美创优',
                description: '哟个游戏公司',
                picUrl: 'https://bpic.588ku.com/original_origin_min_pic/18/03/21/353363dc9f1370726cea4636268b2f1b.jpg!ww1200',
                url: 'http://www.baidu.com'
            }]
            cb(replysData)
        } else if (content === '4') {
            wechat.uploadMaterial('image', __dirname + '/san.png', { type: 'image' })
                .then(function(datas) {
                    console.log(datas)
                    var replys = {
                        type: 'image',
                        mediaId: datas.media_id
                    }
                    cb(replys)
                })
        } else if (content === '5') {
            wechat.uploadMaterial('video', __dirname + '/testVedio.mp4', { type: 'video', description: '{"title":"protect envirment","introduction":"to protect evirment is our bility"}' })
                .then(function(datas) {
                    var replys = {
                        type: 'video',
                        title: '回复内容',
                        description: '保护环境',
                        mediaId: datas.media_id
                    }
                    cb(replys)
                })
        } else if (content === '6') {
            wechat.countMaterial().then(function(datas) {
                console.log(datas)
                var replys = "数量" + datas.voice_count + " " + datas.video_count + ' ' + datas.image_count + ' ' + datas.news_count;
                cb(replys)
            })
        } else if ('7' === content) {
            wechat.batchMaterial({}).then(function(datas) {
                console.log("%j", datas);
                var replys = "获取素材列表成功，并打印咋后天";
                cb(replys)
            })
        } else if ('8' === content) {
            wechat.deleteMaterial("2HM5WyjgSLTvz3oB6aVW5H84nC0krrib3sgvykQLNCc").then(function(data) {
                var replys = "删除返货code:" + data.errcode
                cb(replys)
            })
        } else if ('9' === content) {
            wechat.createTag('wechat').then(function(data) {
                console.log("新分组WECHAT: %j", data);
            }).then(function() {
                wechat.fetchTag().then(function(data) {
                    console.log("创建后的分组列表：%j", data);
                })
            }).then(function() {
                wechat.getTagList(message.FromUserName).then(function(data) {
                    console.log("查看自己的分组：%j", data);
                })
            }).then(function() {
                var replys = "9 ok"
                cb(replys)
            })
        } else if ('10' === content) {
            wechat.fetchUser(message.FromUserName).then(function(data) {
                console.log("10:%j", data);
                var replys = JSON.stringify(data);
                cb(replys)
            })
        } else if ('11' === content) {
            wechat.listUsers().then(function(data) {
                console.log("11:%j", data);
                var replys = JSON.stringify(data);
                console.log(222222222222)
                cb(replys)
            })
        } else if ('12' == content) {
            var mpnews = {
                "media_id": "2HM5WyjgSLTvz3oB6aVW5Gy6T2FaNHwTqbluZnF7gAY"
            }
            var text = { content: "Hello test ni hao" };
            wechat.sendByTag('text', text, 2).then(function(data) {
                console.log("12%j", data);
                var replys = 'Yeah!';
                cb(replys)
            })
        } else if ('13' === content) {
            var senmanticData = {
                query: '环太平洋',
                city: '合肥市',
                category: 'movie',
                uid: message.FromUserName
            }
            wechat.semantic(senmanticData).then(function(data) {
                console.log(data);
                var replys = JSON.stringify(data);
                cb(replys)
            })
        }
    }
}