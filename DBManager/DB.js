var Sequelize=require('sequelize');
module.exports = function (config) {
        var seqFishDB = new Sequelize(config.fishdb.database, config.fishdb.user, config.fishdb.password, {
        host: config.fishdb.host,
        port: config.fishdb.port,
        dialect: 'mysql',
        pool: {
            max: config.fishdb.connectNum,
            min: 0,
            idle: config.fishdb.idleTimeoutMillis
        },
        timezone: '+08:00',
        logging: global.logger.debug
    });

    var table={
        wechatUserInfo:seqFishDB.define('wechatUserInfo',{
			id: {
                type: Sequelize.STRING, primaryKey: true
            },
            openId:{
                type: Sequelize.STRING
            },
            uid:{
                type:Sequelize.STRING
            },
            info:{
                type:Sequelize.STRING
            }
        },{
            freezeTableName: true,
            timestamps: false
        })
    }
     for (var key in table) {
        table[key].sync();
    }
    table.seqFishDB = seqFishDB;
    return table;
}
