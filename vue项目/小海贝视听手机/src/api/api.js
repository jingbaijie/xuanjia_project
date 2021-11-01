import request from "./request";

export function userLogin(params) {
    return request({
        url: "/web/user/registerOrLogin",
        method: "get",
        params,
    });
}
export function userInfo(params) {
    return request({
        url: "/web/user/getUserInfo",
        method: "get",
        params,
    });
}
//修改昵称
export function setUserName(params) {
    return request({
        url: "/web/user/updateName",
        method: "get",
        params,
    });
}

//上传头像
export function setUserHeadortrait(params) {
    return request.request({
        url: "/web/user/uploadIcon",
        method: "post",
        headers: { "Content-Type": "multipart/form-data" },
        data: params,
    });
}

// 获取父标签下的全部分类内容
export function getTypesByParentId(params) {
    return request({
        url: "web/findTypesByParentId",
        method: "get",
        params,
    });
}

// 根据分类ID获取卡通信息
export function getContentsByTypeId(params) {
    return request({
        url: "web/findContentsByTypeId",
        method: "get",
        params,
    });
}

// 搜索卡通接口
export function getSearchContents(params) {
    return request({
        url: "web/search",
        method: "get",
        params,
    });
}

//通用页面信息接口
export function getCommonPageInfo(params) {
    return request({
        url: "web/findCommonPageInfo",
        method: "get",
        params,
    });
}
//播放记录
export function userHistory(params) {
    return request.request({
        url: "/web/view/history",
        method: "get",
        params,
    });
}
//卡通视频接口
export function getVideoList(params) {
    return request({
        url:'web/findVideoListByCartoonId',
        method:'get',
        params
    })

}
//卡通详情
export function getCartoonDetail(params) {
    return request({
        url:'web/findCartoonDetailById',
        method:'get',
        params
    })

}
/**
    * 保存用户观看记录
    * GET请求
    * 参数{userId: 用户名, contentId：游戏或视频Id,contentType: 0-游戏，2-视频,playType: 0-主动，1-被动(小窗口),videoId: 视频Id}
    */
export function setInsert(params) {
    return request({
        url:'web/view/history/insert',
        method:'get',
        params
    })

}