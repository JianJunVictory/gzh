var Token =require('../cognate/token')
var opts=require('../../config/config').wechat
var authInfo=require('../../config/config').authToken
var visitUrl=require('../../config/config').visit_url
var request=require('request');
var Promise=require('promise')
var Moment=require('moment');


var sevenDay=require('./active/sevenDay')


module.exports=function(router){
	var tokenApi=new Token(opts);
    router.get('/active',function(req,res){
        var url='https://open.weixin.qq.com/connect/oauth2/authorize?appid='+opts.appID+'&redirect_uri='+authInfo.active_url+'&response_type=code&scope='+authInfo.scope+'&state='+authInfo.state+'#wechat_redirect'
        res.redirect(url);
    })
    router.get('/activePage',function(req,res){
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
					 global.DBManager.wechatActive.findAll({attributes:['activeName','englishName','activeDesc','activeIcon'],where:{isOpen:true,startTime:{'$lt':nowtime},stopTime:{'$gt':nowtime}}}).then(function(result){
						if(result.length==0){
							res.render('noActive.html',{uid:data1.uid});
							return;
						}
						var activeArr=[];
						for (var i=0;i<result.length;i++){
							var active=result[i].dataValues;
							active.activeUrl=visitUrl.activePrefix+active.englishName;
							activeArr.push(active);
						}
					 	res.render('active.html',{uid:data1.uid,activeArr:activeArr});
					 }).catch(function(err){
						console.log(err)
						res.render('noActive.html',{uid:data1.uid});
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
	sevenDay(router)
    return router
}
