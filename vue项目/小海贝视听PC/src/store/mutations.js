/*
 * @Author: your name
 * @Date: 2021-09-01 11:05:57
 * @LastEditTime: 2021-09-08 11:22:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tvjoy-web\src\store\mutations.js
 */
export default {
    //用户有存储信息时，刚进入网站塞入用户信息
    noLoginSetState(state,playLoad){
        state.userInfo.id=payload.id;
        state.userInfo.headerImg=payload.headerImg;
        state.userInfo.name=payload.name;
        // sessionStorage.setItem('userInfo',JSON.stringify(state.userInfo));
    },
    //修改登录状态，刷新或者跳转页面是否重新登陆
    changeLogin(state,payload){
        // payload=Boolean(payload)
        state.isLogin=payload;
        sessionStorage.setItem('isLogin',payload);
    },
    //获取到用户信息后保存
    changeUserInfo(state,payload){
        state.userInfo.id=payload.userId;
        state.userInfo.headerImg=configs.pic_BASEURL+payload.userIcon;
        state.userInfo.name=payload.userName;
        sessionStorage.setItem('userInfo',JSON.stringify(state.userInfo));
    },
    //将session的数据保存出来
    sessionChangeState(state){
        state.isLogin=sessionStorage.getItem('isLogin')=='false'?false:true;
        state.userInfo=JSON.parse(sessionStorage.getItem('userInfo'));
    },
    //修改用户name
    changeUserName(state,payload){
        state.userInfo.name=payload.username;
        sessionStorage.setItem('userInfo',JSON.stringify(state.userInfo));
    },
    //修改用户头像
    changeUserHeader(state,payload){
        state.userInfo.headerImg=payload.headerImg;
        sessionStorage.setItem('userInfo',JSON.stringify(state.userInfo));
    },
    //保存当前搜索的key
    changeSearchKey(state,payload){
        state.searchKey = payload.params;
    },
    //退出登录
    loginOut(state,payload){
        state.userInfo.id='';
        state.userInfo.name='';
        state.userInfo.headerImg='';
        sessionStorage.setItem('userInfo',JSON.stringify(state.userInfo));
    }
}
