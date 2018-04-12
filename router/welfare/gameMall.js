var Token =require('../cognate/token')
var opts=require('../../config/config').wechat
var authInfo=require('../../config/config').authToken
var visitUrl=require('../../config/config').visit_url
var request=require('request');
var Promise=require('promise')
var Moment=require('moment');

module.exports=function(router){
	var tokenApi=new Token(opts);
    router.get('/pages',function(req,res){
        var url='https://open.weixin.qq.com/connect/oauth2/authorize?appid='+opts.appID+'&redirect_uri='+authInfo.mall_url+'&response_type=code&scope='+authInfo.scope+'&state='+authInfo.state+'#wechat_redirect'
        res.redirect(url);
    })
    router.get('/mallPage',function(req,res){
        var code =req.query.code;
        tokenApi.getAuthToken(code).then(function(data){
            var _data=data;
			  global.DBManager.wechatUserInfo.findOne({where:{openId:_data.openid}}).then(function(result){
                if(!result){
                    return Promise.resolve(false);
                }else{
                    return Promise.resolve(result);
                }
            }).then(function(dataInfo){
				var data1=dataInfo.dataValues;
                if(data1.uid && data1.openId  && data1.info){
					 global.DBManager.wechatMall.findAll({where:{isDisplay:true}}).then(function(_datas){
						if(!_datas){
							//返回一个商场没开通的页面，尽请等待页面，稍后在做
							return;
						}
						var coinArr=[];
						var diamandArr=[];
						for(var i=0;i<_datas.length;i++){
							if(_datas[i].dataValues.itemId=='1001'){
								coinArr.push(_datas[i].dataValues)
							}else{
								diamandArr.push(_datas[i].dataValues);
							}
						}
						res.render('mall.html',{uid:data1.uid,coinArr:coinArr,diamandArr:diamandArr});
					 }).catch(function(err){
						console.log(err);
					 })
                }else{
					res.render('goBind.html',{url:visitUrl.code});
                }
            }).catch(function(err){
                res.status(404);
                res.render('404.html');
            })
        })
    })
	router.post('/buy',function(req,res){
		var data=req.body;
		console.dir(data);
		data.getTime=Moment(new Date()).format("YYYY-MM-DD");
		global.DBManager.wechatSignInAwardRecord.create(data).then(function(result){
			res.json({
				errcode:'0',
				errMsg:'OK'
			})
		}).catch(function(err){
			console.log(err)
			res.json({
				errcode:'2001',
				errMsg:'database error,create failed'
			})
		})
	})
    return router
}
