/*
 * @Description: 
 * @Author: jwzx
 * @Date: 2020-07-15 13:40:11
 * @LastEditTime: 2020-11-03 19:20:48
 * @LastEditors: jwzx
 */
module.exports = {
    apps: [
        {
            //应用进程名称
            name: 'prod-nodeweb',
            //启动脚本路径
            script: 'app.js',
            // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
            //传递给脚本的参数
            args: 'one two',
            //  应用启动实例个数，仅在cluster模式有效，默认为fork；
            instances: "10",
            //默认为true, 发生异常的情况下自动重启
            autorestart: true,
            //监听重启，启用情况下，文件夹或子文件夹下变化应用自动重启
            watch: true,
            // 指定日志日期格式，如YYYY-MM-DD HH:mm:ss
            log_date_format: "YYYY-MM-DD HH:mm:ss",
            //错误输出日志
            "error_file": "../log/null",
            //日志
            "out_file": "../log/null",
            // 最大内存限制数，超出自动重启；
            max_memory_restart: '1G',
            env: {
                NODE_ENV: "production",
                PORT: 9527,
            },
            ignore_watch: [
                "node_modules",
                "log",
                "public",
                "static",
                ".git",
                ".gitignore",
                "iptv-admin-operation"

            ],
            exec_mode: 'cluster'
        }, {
            //应用进程名称
            name: 'dev-nodeweb',
            //启动脚本路径
            script: 'app.js',
            // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
            //传递给脚本的参数
            args: 'one two',
            //  应用启动实例个数，仅在cluster模式有效，默认为fork；
            instances: "10",
            //默认为true, 发生异常的情况下自动重启
            autorestart: true,
            //监听重启，启用情况下，文件夹或子文件夹下变化应用自动重启
            watch: true,
            // 指定日志日期格式，如YYYY-MM-DD HH:mm:ss
            log_date_format: "YYYY-MM-DD HH:mm:ss",
            //错误输出日志
            "error_file": "./log/null",
            //日志
            "out_file": "./log/null",
            // 最大内存限制数，超出自动重启；
            max_memory_restart: '1G',
            env: {
                NODE_ENV: "development",
                PORT: 9527,
            },
            ignore_watch: [
                "node_modules",
                "log",
                "public",
                "static",
                ".git",
                ".gitignore",
                "iptv-admin-operation",
                "gulpfile.js",
                "out"

            ],
            exec_mode: 'cluster'
        }
    ]


};