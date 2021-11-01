/*
 * @Description: 
 * @Author: jwzx
 * @Date: 2020-08-30 18:32:57
 * @LastEditTime: 2020-09-10 18:42:43
 * @LastEditors: jwzx
 */
const http = require("http");
const querystring = require("querystring");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");




class Proxy {
    constructor() {
        // 转发地址
        this.url = "";
        //请求参数
        this.postData = "";
        // 请求头
        this.headers = {};
        // 转发端口
        this.port = "";
        // 请求host
        this.host = "";

    }
    // 初始化
    init(req, res, opts) {
        const { port = "", host = "" } = opts;
        this.url = req.originalUrl;
        this.postData = querystring.stringify(req.body);
        this.host = host;
        this.port = port;
        Object.assign(this.headers, req.headers, {
            connection: 'close'
        });
        if (req.headers['content-type'] && req.headers['content-type'].indexOf('multipart/form-data') !== -1) {
            this.uploadFile(req, res);

        } else {
            this.httpProxy(req, res);
        }
    }
    //上传文件转发
    uploadFile(req, res) {
        const formData = new FormData();

        const params = req.body;
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                const value = params[key];
                formData.append(key, value);
            }
        }
        //获取文件流
        const files = req.files;
        if (!Object.keys(files).length) return res.status(200).json(new global.Result().INVALID_PARAM("请选择文件"));
        for (const key in files) {
            if (files.hasOwnProperty(key)) {
                const item = files[key];
                const { path: filePath, originalFilename } = item;
                // 得到newPath新地址用于创建读取流
                const newPath = path.join(path.dirname(filePath), originalFilename);
                fs.rename(filePath, newPath, (err) => {
                    if (err) {
                        res.status(200).json(new global.Result().RESULT_FAIL(`文件流读取有问题：${err.message}`))
                        global.logger.error(`文件流读取有问题：${err.message}`);;
                        return;
                    }
                    // 创建读取流
                    const file = fs.createReadStream(newPath);
                    formData.append(key, file);
                    //合并文件流
                    Object.assign(this.headers, formData.getHeaders(), {
                        "Transfer-Encoding": "chunked"
                    });
                    this.httpProxy(req, res, (req1) => {
                        // 文件流转发
                        formData.pipe(req1);

                    })
                })

            }
        }
    }
    //请求转发
    httpProxy(req, res, callback) {
        var req1 = http.request({
            protocol: "http:",
            port: this.port,
            host: this.host,
            method: req.method,
            path: this.url,
            headers: this.headers,
            timeout : 5000
        }, (res1) => {
            let body = "";
            res1.on("data", (chunk) => {
                if (req.method.toLocaleUpperCase() != "POST") {
                    res.write(chunk, "binary");
                } else {
                    res.write(chunk);
                }
            })
            res1.on("end", () => {
                global.logger.info(`响应中已无数据:${this.url}`);
                res.end();
            })
            res.writeHead(res1.statusCode, res1.headers);
        })
        callback && callback(req1);
        req1.on("error", (e) => {
            global.logger.error(`请求遇到问题：${e.message}`);
            res.status(200).json(new global.Result().ERROR(`请求遇到问题：${e.message}`));
        })
        if (req.method.toLocaleUpperCase() == "POST" && !callback) {
            if (req.headers["content-type"] && req.headers["content-type"].indexOf("json") > -1) {
                req1.write(JSON.stringify(req.body));
            } else {
                req1.write(this.postData);
            }
        }
        if (callback) {
            // 文件流上传需要请求结束才可以转发请求后结束
            req.on("end", () => {
                req1.end()
            })
        } else {
            req1.end();
        }

    }

}

module.exports = Proxy;





