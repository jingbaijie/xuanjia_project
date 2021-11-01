/*
 * @Description: 
 * @Author: jwzx
 * @Date: 2020-07-13 15:11:40
 * @LastEditTime: 2020-08-15 16:40:53
 * @LastEditors: jwzx
 */

const config = global.config.redisConfig;
const logger = require("./logger");

const redisPool = require("redis-connection-pool")("xjRedisPool", {
    host: config.host,
    port: config.port,
    //最大连接数默认是30
    max_clients: config.maxActive,
    perform_checks: true,
    //连接数据库
    database: config.db,
    options: {
        auth_pass: config.password,
        no_ready_check: true
    }

})

let redis = {};
//存值
redis.set = (key, val, expire) => {
    val = JSON.stringify(val);
    return redisPool.set(key, val, (err) => {
        if (err) logger.error(err);
        if (!isNaN(expire) && expire > 0) {
            redis.expire(key, expire);
        }
    })
}

text = async (key) => {
    doc = await new Promise((resolve) => {
        redisPool.get(key, (err, res) => {
            if (err) {
                console.error(err)
                resolve();
            };
            return resolve(res);
        })
    });
    if (doc) {
        doc = JSON.parse(doc);
        return doc;
    } else {
        return "";
    }
};
// 取值
redis.get = async (key, cb) => {
    const ret = await text(key, cb);
    return ret;
}
//设置有效期
redis.expire = async (key, expire) => {
    expire = expire || config.defaultExpireTime;
    return redisPool.expire(key, expire);
}
//删除键值
redis.del = async (key) => {
    return redisPool.del(key, (err) => {
        if (err) logger.error(err);
    })
}

//获取连接池中redis连接
redis.getClient = (cb)=>{
    redisPool.pool.acquire().then((client) => {
        cb && cb(client);
    }).catch(cb);

}

//获取keys值键值列表
redis.keys = async (key) => {
    async function text(key) {
        let keyPattern = `${key}*`;
        return new Promise((resolve, reject) => {

            redis.getClient((client)=>{
                client.keys(keyPattern, (err, keys) => {
                    if ((keys) && (keys.forEach)) {
                        resolve(keys);
                    } else {
                        resolve("")
                        logger.error(`获取redis key为空>>>${key}`);
                    }
                    if (err) {
                        resolve("");
                        logger.error(`获取redis key值报错>>>${key}`,err);
                    }
                    client.quit();
                })
            })

           
        })
    }

    let keys = await text(key);
    return keys;

}

// 删除匹配的keys 的redis 缓存
redis.clean = async (key = "*", cb) => {
    let keyPattern = `${key}*`;
    redis.getClient((client)=>{
        client.keys(keyPattern, (err, keys) => {
            client.quit();
            if ((keys) && (keys.forEach)) {
              keys.forEach((name) => {
                logger.info('deleting name ' + name);
                redisPool.del(name);
              });
            } else {
              logger.error(`ERROR couldnt get keys list on key '${key}': `, keys);
            }
            if (err) {
              logger.error('ERROR failed clearing redis queue. ' + err);
            }
            cb && cb(err,keys);
          });
    })

}
//清除redis全部缓存
redis.flushdb = async (cb) => {
    redis.getClient((client)=>{
        client.flushdb((e)=>{
            cb && cb(e);
            
        })
    })
}


module.exports = redis;







