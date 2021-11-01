/*
 * @LastEditors: jwzx
 */


const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const logger = require("./utils/logger");
const rfs = require("file-stream-rotator");
var proxy = require("express-http-proxy");
var compression = require("compression");

const open = require("open");
const config = require("config-lite")(__dirname);
const routes = require("./routes");
const {errTip,redirectUrl} = require("./utils/errAction");
const Result = require("./utils/result");
const {getDate} = require("./utils/getDate");

const app = express();

// console.log(config)

//将配置挂载到全局变量上
// 本地全局变量
// 将设置为不可删除、只读
Object.defineProperty(global, "config", {
    value: config,
    // 当且仅当该属性的 writable 键值为 true 时，属性的值，也就是上面的 value，
    // 才能被赋值运算符改变。
    writable: false,
    //当且仅当该属性的 configurable 键值为 true 时，该属性的描述符才能够被改变，
    // 同时该属性也能从对应的对象上被删除。
    configurable: false,
});
//设置全局响应结果数据格式
Object.defineProperty(global,"Result",{
    value : Result,
    writable : false,
    configurable: false
})

//设置全局日志打印方法
Object.defineProperty(global,"logger",{
    value : logger,
    writable : false,
    configurable: false
})

const redis = require("./utils/redisPool");

Object.defineProperty(global, "redis", {
    value: redis,
    writable: false,
    configurable: false,
})

//压缩响应
app.use(compression());

//清除掉地址栏中双斜杠无法匹配路由情况
app.use((req, res, next) => {
    req.url = req.url.replace(/(:?\/\/)/g, function (str) {
        if (str == "//") {
            return str.replace(str, "/")
        } else {
            return str;
        }
    }).replace(/\?times=[\d]*/g,"");
    req.originalUrl = req.originalUrl.replace(/(:?\/\/)/g, function (str) {
        if (str == "//") {
            return str.replace(str, "/")
        } else {
            return str;
        }
    }).replace(/\?times=[\d]*/g,"");
    
    next();
})

app.post('*', bodyParser.urlencoded({ extended: true }),
    function (req, res, next) {
        next();
    });

//设置模版目录
app.set("views", path.join(__dirname, "public/HD/web"));
app.set('view engine', "ejs");

//设置是否启用视图编译缓存，启用将加快服务器执行效率

console.log(process.env.NODE_ENV  + ">>>" + process.env.PORT);
if(process.env.NODE_ENV == "production"){
    app.set("view cache", true);
    logger.info("开启视图缓存")
}


//修改传入日志的时间为本地
morgan.token('date', function getDateToken(req, res, format) {
    return getDate();
})

let morganLogType = "[:date]  :method :url :status :response-time ms - :res[content-length] ':referrer'"

//记录请求日志
app.use(morgan(morganLogType, {
    skip: (req, res) => {
        if(process.env.NODE_ENV == "production"){
            // 状态码小于400的不记录
            return res.statusCode < 400
        }
    }
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(cookieParser());
//设置静态文件
config.localConf.forEach(function (val) {
    app.use(val.url, express.static(path.join(__dirname, val.static),{ maxAge: config.maxAge }),);
})

// 反向代理（这里把需要进行反代的路径配置到这里即可）

config.proxyConf.forEach(function (val) {
    let proxyUrl = val.proxyUrl;
    let opts = val.opts;

    val.apiArr.forEach(function (val1) {
        app.use(val1, proxy(proxyUrl, opts));
    })
})
//存在日志文件夹，就创建日志文件夹
const logDirectory = path.join(__dirname, '../log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.getStream({
    date_format: "YYYY-MM-DD",
    filename: path.join(logDirectory, "access-%DATE%.log"),
    frequency: "daily",
    verbose: false
})
if(process.env.NODE_ENV == "production"){
    app.use(morgan("combined", { stream: accessLogStream }));
}

//路由
routes(app);
//异常捕获
process.on('uncaughtException', (err) => {
    logger.error(`${err.status || 500} - ${err.message} - ${err.stack} `);
    // process.exit(1)
});
process.on('unhandledRejection', err => {
    logger.error(`${err.status || 500} - ${err.message} - ${err.stack}`);
    // process.exit(1) // To exit with a 'failure' code
});


app.use(function (req, res, next) {
    res.setTimeout(10*1000, function () {
        logger.error("Request has timed out.>>>>" + req.originalUrl);
        redirectUrl(req,res);
        // return res.status(408).json(new Result().TIME_OUT(req.originalUrl))
    });
    var err = new Error("not found Page!!" + req.originalUrl);
    err.status = 404;
    next(err);
})

//异常处理
app.use(errTip);

//监听端口，启动程序
 const PORT = process.env.PORT || config.port;
app.listen(PORT, () => {
    console.log(`http://${config.host}:${PORT}/${config.projectName}/`)
    //   open(`http://${config.host}:${config.port}/iptv-web/`,{app: 'chrome'})
})





