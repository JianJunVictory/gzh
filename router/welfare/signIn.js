var Token =require('../cognate/token')
var opts=require('../../config/config').wechat
var authInfo=require('../../config/config').authToken
var visitUrl=require('../../config/config').visit_url
var request=require('request');
var Promise=require('promise')

module.exports=function(router){
	var tokenApi=new Token(opts);
    router.get('/page',function(req,res){
        var url='https://open.weixin.qq.com/connect/oauth2/authorize?appid='+opts.appID+'&redirect_uri='+authInfo.signIn_url+'&response_type=code&scope='+authInfo.scope+'&state='+authInfo.state+'#wechat_redirect'
        res.redirect(url);
    })
    router.get('/signIn',function(req,res){
        var code =req.query.code;
        tokenApi.getAuthToken(code).then(function(data){
			console.dir(data);
            var _data=data;
			  global.DBManager.wechatUserInfo.findOne({where:{openId:_data.openid}}).then(function(result){
				console.dir(result);
                if(!result){
                    return Promise.resolve(false);
                }else{
                    return Promise.resolve(result);
                }
            }).then(function(data1){
                if(data1.uid && data1.openId  && data1.info){
                  
                    res.render('signIn.html',{uid:data1.uid});
                }else{
					console.log(visitUrl.code)
					res.render('goBind.html',{url:visitUrl.code});
                }
            }).catch(function(err){
                res.status(404);
                res.render('404.html');
            })
        })
    })
    return router
}
