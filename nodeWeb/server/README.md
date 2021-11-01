- [nodeWeb](#nodeweb)
- [项目访问地址](#项目访问地址)
- [项目目录](#项目目录)
- [技术栈](#技术栈)
- [建议软件](#建议软件)
- [项目安装](#项目安装)
- [下载并安装项目](#下载并安装项目)
- [ejs页面静态文件使用绝对路径，引用模版需使用相对路径](#ejs页面静态文件使用绝对路径引用模版需使用相对路径)
- [ejs页面常用4种基本语法](#ejs页面常用4种基本语法)
  - [1.模块引入 <%- include (url)%>](#1模块引入---include-url)
  - [2.JS执行代码 <% %>](#2js执行代码--)
  - [3.转义输出数据到模板  <%= 变量 %>](#3转义输出数据到模板--变量-)
  - [4.非转义的数据到模板 <%- html片段 %>](#4非转义的数据到模板---html片段-)
- [根目录全局变量](#根目录全局变量)
  - [路由(页面)公共变量,可以在对应ejs模板文件中使用](#路由页面公共变量可以在对应ejs模板文件中使用)
  - [注意事项](#注意事项)
- [nodeAPI](#nodeapi)
  - [删除个人主题redis缓存](#删除个人主题redis缓存)
  - [删除个人定制眉头redis缓存](#删除个人定制眉头redis缓存)
  - [删除指定key集合下的redis缓存](#删除指定key集合下的redis缓存)
  - [获取redis当前库中keys集合](#获取redis当前库中keys集合)
  - [清空当前redis库中的数据](#清空当前redis库中的数据)

# nodeWeb 
    前端node中间件(express) + ejs

# 项目访问地址
    localhost:9527/iptv-web/

# 项目目录
```
├─nodeweb ----------------------------------------------------------项目
│──├─config ---------------------------------------------------------项目配置文件夹
│──├───├──default.js -----------------------------------------------配置文件
│──├─middleware ----------------------------------------------------中间件文件夹
│──├─node_modules --------------------------------------------------项目依赖文件夹
│──├─public --------------------------------------------------------
│──├────|──HD ------------------------------------------------------------静态文件
│──│────│──├───├──css ---------------------------------------------------公共css
│──│────│──├───├──js ----------------------------------------------------公共js
│──│────│──├───├──images ------------------------------------------------公共图片
│──│────│──├───├──web ---------------------------------------------------模版文件夹
│──│────│──├───├──├──components -----------------------------------------公共模版文件夹
│──│────│──├───├──├───├───commJs.jes ------------------------------导入公共js
│──│────│──├───├──├───├──────header.jes ------------------------------设置公共头
│──│────│──├───├──├───├──────footer.jes ------------------------------设置公共尾
│──│────│──├───├──├───├──────nav.jes ------------------------------设置公共眉头导航
│──│────│──├───├──├──prjectname -----------------------------------------页面文件夹
│──│────│──├───├──├───├──────js ------------------------------------页面私有js
│──│────│──├───├──├───├──────css -----------------------------------页面私有css
│──│────│──├───├──├───├──────image ---------------------------------页面私有图片
│──│────│──├───├──├───├──────html ----------------------------------页面模版文件夹
│──│────│──├───├──├───├──────├────prjectName.ejs----------------页面模版ejs文件
│──├─routes --------------------------------------------------------路由文件夹
│──├─utils ---------------------------------------------------------工具文件夹
├──├──request.js -----------------------------------------------封装http-get请求
│──├─.gitignore ----------------------------------------------------git 可忽略的文件
│──├─app.js --------------------------------------------------------项目服务主文件
│──├─gulpfile.js ---------------------------------------------------gulp配置文件
│──├─package.json --------------------------------------------------项目依赖文件
│──├─README.md -----------------------------------------------------项目介绍
```
# 技术栈

| 技术框架 | 说明      | 版本    |
| -------- | --------- | ------- |
| node     |           | ^10     |
| express  | node 框架 | ^4.17.1 |
| ejs      | 模版引擎  | ^3.1.2  |
| redis    | 数据存储  | ^3.0.2  |

# 建议软件

> vscode  需要装下插件  
* .ejs 
*  EJS language support

> webstorm

# 项目安装

> 如何将npm 切换到 taobao 镜像源，
```
    npm i nrm -g
    nrm ls // 输出镜像源列表
    nrm use taobao   使用淘宝镜像源

    
```
> pm2 使用

```
    pm2 ecosystem //生成pm2 配置文件

    ecosystem.config.js // 文件为启动应用的配置文件

    apps : [{
    //应用进程名称
    name: 'nodeweb',
    //启动脚本路径
    script: 'app.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    //传递给脚本的参数
    args: 'one two',
    //  应用启动实例个数，仅在cluster模式有效，默认为fork；
    instances: 8,
    //默认为true, 发生异常的情况下自动重启
    autorestart: true,
    //监听重启，启用情况下，文件夹或子文件夹下变化应用自动重启
    watch: true,
    // 指定日志日期格式，如YYYY-MM-DD HH:mm:ss
    log_date_format : "YYYY-MM-DD HH:mm:ss",
    //错误输出日志
    "error_file":"./log/null",
    //日志
    "out_file":"./log/null", 
    // 最大内存限制数，超出自动重启；
    max_memory_restart: '1G',    
    //取环境变量
    env : {
      NODE_ENV : "production"
    },
    //忽略监听的文件
    ignore_watch :[
      "node_modules",
      "log",
      "public",
      "static",
      ".git",
      ".gitignore",
      
    ],
    exec_mode: 'cluster'
  },{
        //应用进程名称
        name: 'dev-nodeweb',
        //启动脚本路径
        script: 'app.js',
        // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
        //传递给脚本的参数
        args: 'one two',
        //  应用启动实例个数，仅在cluster模式有效，默认为fork；
        instances: "1",
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
            NODE_ENV: "production",
            PORT : 9528,
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
    }
  ]

```
> script 启动方式
```
"scripts": {
    "start": " pm2 start ecosystem.config.js --only prod-nodeweb",//生产环境
    "dev": " pm2 start ecosystem.config.js --only dev-nodeweb",//开发环境
    "stop": "pm2 del prod-nodeweb",//杀掉生产环境进程
    "restart": "pm2 restart prod-nodeweb",//重启生产环境进程
    "debugger": "cross-env NODE_ENV=production nodemon --ignore 'public/'"
  },

```

# 下载并安装项目

```
    mkdir nodeweb
    cd nodeweb
    git init //初始化本地git仓库
    git remote add origin http://192.168.2.253/jwzx/nodeweb.git  //设置项目源
    git pull origin master //拉取到本地
    npm install //安装项目
    npm run dev //启动项目 或 node app.js
```

# ejs页面静态文件使用绝对路径，引用模版需使用相对路径
# ejs页面常用4种基本语法 

## 1.模块引入 <%- include (url)%>
```  
    //引入公共头，所有页面必须引入这个，不然可能引用组件时导致报错。
    <%- include ('../../components/header') %>
```    
## 2.JS执行代码 <% %>

```
    <%
        let a = 1;
        a++;
        console.log(a);
    %>
```

## 3.转义输出数据到模板  <%= 变量 %>
``` 
    <%
        const nameArr = [1111,2222,3333,4444,5555];
        const imgUrl = "www.xxxx.com/img"
    %>
    <img src='<%= imgUrl %>'>
    <ul>
        <% for(let i=0;i<nameArr.length;i++){ %>
            <li> <%= nameArr[i] %> </li>         
        <% } %>
    </ul> 
```

## 4.非转义的数据到模板 <%- html片段 %>
```
    <%
        const name = "<h1>jwzx</h1>"
    %>
    <!-- 输出1号字的name值 -->
    <html>
    <body>
        <%- name%> ===> <h1>jwzx</h1>
        <%= name%> ===> &lt;h1&gt;jwzx&lt;/h1&gt;
    </body>
    </html>
    
```
# 根目录全局变量

## 路由(页面)公共变量,可以在对应ejs模板文件中使用

``` 
    {
        basePageUrl, //ejs模板目录
        title : "", //页面title
        imgUrl : global.config.imgUrl, // 远程图片服务器地址
        ajaxConf : global.config.imgUrl,
        basePageInfo : { //初始化参数集合,已在commonJs组件中转化,在commonJs之后的js代码中直接使用
            commonPageInfo, //页面公共信息
            selectThemeDetailByUserId, //主题
            bgImg, //背景图
            findTemplateInfo,//模板信息
            reqQuery,//url参数
            basePageUrl,//EJS模板目录
            localImg //模板图片image目录
        },
    }
```
## 注意事项

+ 一.server端对象数据导出给浏览器端使用需要进行字符串-对象转换 
```
 <%- JSON.stringify(buttons) %>
```
+ 二.循环和条件语句两种写法 都能正常运行 内部逻辑有待深入研究 暂推荐第一种写法
>> 1.模板环境与html环境分离 编辑器识别正常 缺点是多写几个标签

            <% if(a = 1 ){ %>
                <%
                    const b = 188;
                %>
                <div id="<%= b %>"></div>
            <% } %>

            <% for(let i=0;i<nameArr.length;i++){ %>
                <%
                    const j = i + 1;
                %>
                <li> <%= nameArr[j] %> </li>         
            <% } %>

>> 2.编辑器识别不正常 注释解析,模块逻辑不清晰 可以少写几个标签

            <% if(a = 1 ){ 
                const b = 188;
            %>
                <div id="<%= a %>"></div>
            <% } %>

            <% for(let i=0;i<nameArr.length;i++){
                const j = i + 1;
            %>
                <li> <%= nameArr[j] %> </li>         
            <% } %>
            

>> 备份:

```
    <% commomJsArr.forEach(element => { %>
    <script type="text/javascript" src="<%= commonJsUrl + element  %>.js?v=<%= commonJsCurTime %> "></script>
    <% }) %>

```

# nodeAPI 

##  删除个人主题redis缓存
+ /nodeApi/updateExtraUserInfo 

    | 地址 |  http://host:port/nodeApi/updateExtraUserInfo   |
    | -------- | --------- | 
    | 请求方式 | get   |
    | 请求参数    |params
       
    |参数|是否必传|参数含义|
    | -------- | --------- | --------- |
    |userId     |M| 用户userId|

+ 实例:
```
    get请求
    http://192.168.2.248:9527/nodeApi/updateExtraUserInfo?userId=123
```
## 删除个人定制眉头redis缓存
+ /nodeApi/updateExtraUserInfo 

    | 地址 |  http://host:port/nodeApi/updateExtraUserInfo   |
    | -------- | --------- | 
    | 请求方式 | get   |
    | 请求参数    |params|
       
    |参数|是否必传|参数含义|
    | -------- | --------- | --------- |
    |userId     |M| 用户userId|

+ 实例:
```
    get请求
    http://192.168.2.248:9527/nodeApi/updateExtraUserInfo?userId=123
```

## 删除指定key集合下的redis缓存
+ /nodeApi/delRedisKeys

    | 地址 |  http://host:port/nodeApi/delRedisKeys   |
    | -------- | --------- | 
    | 请求方式 | get   |
    | 请求参数    |params|
       
    |参数|是否必传|参数含义|
    | -------- | --------- | --------- |
    |key       |    M    | keys值前包含|

+ 实例:
```
    get请求
    // 1、如果key为select,则会把前缀为select 的key都删除掉
    //   1)  "selectThemeDetailByUserId:userId=-1"
    //   2)  "selectThemeDetail:" 
    http://192.168.2.248:9527/nodeApi/delRedisKeys?key=select

    // 2、如果key为*,则会把所有的key都删除掉
    http://192.168.2.248:9527/nodeApi/delRedisKeys?key=*

```

## 获取redis当前库中keys集合
+ /nodeApi/getRedisKeys 

    | 地址 |  http://host:port/nodeApi/getRedisKeys   |
    | -------- | --------- | 
    | 请求方式 | get   |
    | 请求参数 |params |
       
    |参数|是否必传|参数含义|
    | -------- | --------- | --------- |
    |key       |      M    | keys值前包含|

+ 实例:
```
    get请求
    // 1、如果key为select,则会把前缀为select 的key获取到
    //   1)  "selectThemeDetailByUserId:userId=-1"
    //   2)  "selectThemeDetail:" 
    http://192.168.2.248:9527/nodeApi/delRedisKeys?key=select

    // 2、如果key为*,则获取当前库所有key值
    http://192.168.2.248:9527/nodeApi/delRedisKeys?key=*

```
## 清空当前redis库中的数据
+ /nodeApi/redisflushdb 

    |   地址   |  http://host:port/nodeApi/redisflushdb   |
    | -------- | --------- | 
    | 请求方式 | get   |
    | 请求参数 |params
       
    |参数|是否必传|参数含义|
    | -------- | --------- | --------- |
    

+ 实例:
```
    get请求
   
    http://192.168.2.248:9527/nodeApi/redisflushdb 

  

```

