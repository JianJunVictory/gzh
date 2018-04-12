var Token =require('../../cognate/token')
var opts=require('../../../config/config').wechat
var authInfo=require('../../../config/config').authToken
var visitUrl=require('../../../config/config').visit_url
var request=require('request');
var Promise=require('promise')
var Moment=require('moment');

module.exports=function(router){
	var tokenApi=new Token(opts);
    router.get('/sevenDay',function(req,res){
        var url='https://open.weixin.qq.com/connect/oauth2/authorize?appid='+opts.appID+'&redirect_uri='+authInfo.activePrefix_url+'sevenDayPage'+'&response_type=code&scope='+authInfo.scope+'&state='+authInfo.state+'#wechat_redirect'
        res.redirect(url);
    })
    router.get('/sevenDayPage',function(req,res){
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
				var nowtime=Moment().format("YYYY-MM-DD HH:mm:ss");
                if(data1.uid && data1.openId  && data1.info){
					Process(function(err,data){
						if(!err && data){
							res.render('active/sevenDay.html',{uid:data1.uid,awardArr:data});
						}else{
							res.render('noActive.html',{uid:data1.uid});
						}
					})
                }else{
					res.render('goBind.html',{url:visitUrl.code});
                }
            }).catch(function(err){
				console.log(err)
                res.status(404);
                res.render('404.html');
            })
        })
    })
    return router
}
function Process(cb){
	 global.DBManager.wechatSevenDay.findAll({attributes:['day','awardContent','awardDesc']}).then(function(result){
		if(result.length==0){
			cb(null,null);
		}
		var awardArr=[];
		for(var i=0;i<result.length;i++){
			var award=result[i].dataValues;
			award.awardContent=JSON.parse(award.awardContent);
			awardArr.push(award);
		}
		cb(null,awardArr);
	 }).catch(function(err){
		console.log(err)
		cb(err,null);
	});
}
