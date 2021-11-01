<!--
 * @Description: 
 * @Author: jwzx
 * @Date: 2020-07-29 16:18:23
 * @LastEditTime: 2020-08-14 09:31:30
 * @LastEditors: jwzx
--> 

# 项目目录
```
├─nodeweb ----------------------------------------------------------项目
│──├─admin ---------------------------------------------------------管理后台
│──├───├──iptv-admin-operation -------------------------------------管理后台项目
│──├─server --------------------------------------------------------nodeweb项目服务
│──├─buildServer ---------------------------------------------------打包后上线node
│──├─.gitignore ----------------------------------------------------git 可忽略的文件
│──├─README.md -----------------------------------------------------项目介绍
```
# 项目技术栈

| 技术框架                | 说明              | 版本                      
| ---------------------- | ---------------- | ----------------- |
| node                   |                  |   ^10   
| express                | node 框架         |  ^4.17.1
| ejs                    | 模版引擎          | ^3.1.2
| redis                  | 数据存储          | ^3.0.2           
|vue                     |                  |
|elementUI               |                   |

# 项目server打包

```
   //命令行输入
    

   $ gulp
    [10:46:18] Using gulpfile D:\study\channelWeb\gulpfile.js
    [10:46:18] Starting 'default'...
    [10:46:18] Starting 'buildClean'...
    [10:46:19] Finished 'buildClean' after 511 ms
    [10:46:19] Starting 'build'...
    [10:46:22] Finished 'build' after 3.46 s
    [10:46:22] Finished 'default' after 3.98 s  
   
```
    + 打包后生成 buildServer.zip  ，发布上线代码
  