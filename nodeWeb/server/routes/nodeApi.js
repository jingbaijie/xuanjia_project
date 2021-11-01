/*
 * @Description: 
 * @Author: jwzx
 * @Date: 2020-07-30 14:17:33
 * @LastEditTime: 2020-10-16 09:33:25
 * @LastEditors: jwzx
 */ 
const express = require("express");
const router = express.Router();

//删除用户缓存
function delUserRedisKey(req,res,key){
    let {userId} = req.query;
    let redisKey = `${key}:userId=${userId}`;
    redis.del(redisKey);
    
    res.status(200).json(new global.Result().SUCCESS(`删除成功${redisKey}`))
}




 //删除个人主题redis缓存
router.get(`/updateExtraUserInfo`,(req,res)=>{
    delUserRedisKey(req,res,"selectThemeDetailByUserId");
});

// 删除个人定制眉头redis缓存
router.get(`/updateCustomThemeInfo`,(req,res)=>{
   delUserRedisKey(req,res,"findUserCustomByUserId");
});
//删除指定key集合下的redis缓存
router.get("/delRedisKeys",async (req,res)=>{
    let {key} = req.query;
    if(!key){
        res.status(200).json(new global.Result().INVALID_PARAM("/delRedisKeys 请输入key值"));
    return;
    }
    global.redis.clean(key,(err)=>{
        res.status(200).json(new global.Result().SUCCESS())
    });
})
//获取redis当前库中的keys集合
router.get("/getRedisKeys",async(req,res)=>{
    let {key} = req.query;
    if(!key){
        res.status(200).json(new global.Result().INVALID_PARAM("/getRedisKeys 请输入key值"))
    return;
    }
   let keys =  await global.redis.keys(key);

   res.status(200).json(new global.Result().SUCCESS(keys));
})
//清空当前redis缓存数据
router.all("/redisflushdb", async (req, res) => {
    global.redis.flushdb((e) => {
        res.status(200).json(new global.Result().SUCCESS(`缓存清除完毕:${e}`));
    })
})


module.exports = router;