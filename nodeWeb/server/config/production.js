/*
 * @Description: 
 * @Author: jwzx
 * @Date: 2020-07-09 16:40:44
 * @LastEditTime: 2020-08-14 14:22:03
 * @LastEditors: jwzx
 */
module.exports = {
    projectName: "iptv-web",
    host: "172.31.231.225", //本机地址
    port: 9527,
    errTipUrl: "contentName=404_2019v1",
    //其它环境下可替换地址
    deviceUrl : "http://192.168.2.204",
    //机顶盒前端页面可访问请求地址
    ajaxConf: {
        //接口
        webApiUrl: "http://172.31.183.147:8090/webapi/",
        //积分活动接口
        webPointApiUrl: "http://172.31.183.147:8090/xj-base-boot-credit/",
        //日志
        logApiUrl: "http://172.31.183.147:8090/logapi/",
	
	//大数据推荐
        bigApiUrl: 'http://172.31.183.147:8090/recommender/',
        //图片
        imgUrl: "http://172.31.183.147:8090",
        //需要展示的后台配置的参数中的键
        SystemConfigKeys:["orderPage4areaId","first_free_areaids","authProductList"],
        // 导航保留的rankId
        navMustExistRankIdArr : [1,6,7],
		//上下架
		recommendPage: ["newmain","31"]
    },
    // 静态文件夹内容缓存时间
    maxAge : 60*60*1000 ,
    //本地静态文件夹配置
    localConf: [
        {
            //静态文件夹请求路径
            url: "/iptv-web",
            //静态文件夹
            static: "public"
        },
        {
            url: "/",
            static: "static"
        }
    ],
    //如果服务请求出现404
    errTipUrlArr: [
        {
            //请求的项目名称
            projectName: "iptv-admin-operation-test",
            //错误页面指向
            redirectUrl: "/iptv-admin-operation-test/index.html"
        }, {
            //请求的项目名称
            projectName: "iptv-web",
            //错误页面指向
            redirectUrl: "/index.html"
        }
    ],
    imgUrl: "http://172.31.183.147:8090",//图片地址
    //请求接口地址
    interfaceUrl: "http://172.31.231.225:28080/webapi/",
    // interfaceUrl: "http://192.168.2.21:18088/webapi/",

    //代理文件夹配置
    proxyConf: [
        {
            //转发到的ip + port
            proxyUrl: "http://172.31.231.225:28080",
            // proxyUrl: "http://192.168.2.21:18088",
            //需要转发的接口数组
            apiArr: [
                "/webapi",
                "/logapi",
            ],
            opts: {
                preserveHostHdr: true,
                reqAsBuffer: true,
                //转发之前触发该方法
                proxyReqPathResolver: function (req, res) {
                    //这个代理会把匹配到的url（下面的 ‘/api’等）去掉，转发过去直接404，这里手动加回来，
                    req.url = req.baseUrl + req.url;
                    // console.log(1,req)
                    return require('url').parse(req.url).path;
                },
                //转发失败
                proxyErrorHandler: (err, res, next) => {
                    if (err) res.connection.setTimeout(0);
                    next();
                },
                timeout: 0

            }
        },
        {
            //转发到的ip + port
            proxyUrl: "http://172.31.183.147:8090",
            //需要转发的接口数组
            apiArr: [
                "/pic"

            ],
            opts: {
                preserveHostHdr: true,
                reqAsBuffer: true,
                //转发之前触发该方法
                proxyReqPathResolver: function (req, res) {
                    //这个代理会把匹配到的url（下面的 ‘/api’等）去掉，转发过去直接404，这里手动加回来，
                    req.url = req.baseUrl + req.url;
                    // console.log(1,req)
                    return require('url').parse(req.url).path;
                },
                timeout: 0

            }
        }
    ],
     //redis配置参数
     redisConfig: {
        //数据库
        db: 6,
        selected_db: 6,
        //服务器地址
        host: "172.31.231.227",
        //服务器连接端口
        port: 26379,
        //服务器密码(默认为空)
        password: 123456,
        //链接超时时间
        connect_timeout: 300,
        //默认缓存时间5分钟
        defaultExpireTime: 5 * 60,
        //连接池最大连接数（使用负值表示没有限制）
        maxActive: 500,
        // 连接池最大阻塞等待时间（使用负值表示没有限制）
        maxWait: -1,
        // 连接池中的最大空闲连接
        maxIdle: 200,
        // 连接池中的最小空闲连接
        minIdle: 20
    }
}
