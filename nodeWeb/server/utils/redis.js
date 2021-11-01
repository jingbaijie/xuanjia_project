/*
 * @Description: 
 * @Author: jwzx
 * @Date: 2020-07-23 11:03:50
 * @LastEditTime: 2020-08-05 15:49:04
 * @LastEditors: jwzx
 */
let redisClient = require("redis");

const redisConf = global.config.redisConfig;
let redis_client = redisClient.createClient(redisConf);
redis_client.on("error", function (err) {
    console.log(err);
    redis_client.quit();
    redis_client = redisClient.createClient(redisConf);

});

redis = {};
//设置值
redis.set = function (key, value, expire) {
    value = JSON.stringify(value);
    return redis_client.set(key, value, function (err) {
        if (err) throw err;
        if (expire > 0 && !isNaN(expire)) {
            //设置值
            redis.expire(key, expire)
        }

    });
};
text = async (key) => {
    doc = await new Promise((resolve) => {
        redis_client.get(key, function (err, res) {
            if (err) throw err;
            return resolve(res);
        });
    });
    doc = JSON.parse(doc);
    return doc;
}
//取值
redis.get = async (key) => {
    const ret = await text(key);
    return ret;
}
//设置key存储过期时间
redis.expire = async (key, expire) => {
    expire = expire || redisConf.defaultExpireTime;
    return redis_client.expire(key, expire);
}

//获取keys 所有键值key 列表
redis.keys = async (key, cb) => {
    redis_client.keys(key, (err, keys) => {
        cb && cb(err,keys);
    })

}
redis.quit = async ()=>{
    redis_client.quit();
}

module.exports = redis;