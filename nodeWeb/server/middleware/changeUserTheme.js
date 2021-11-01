let keys = {
    /************************************************背景键值*************************************************************************/
    'newmain' : 'THEME_INDEX_BIGPIC',                               // 首页背景
    'main': 'THEME_INDEX_BIGPIC',                                   // 首页背景
    'category': 'THEME_CATEGORY_BIGPIC',                            // 全部内容页
    'personalCenter': 'THEME_HISTORY_BIGPIC',                       // 个人中心页面（收藏、记录、业务介绍等五个分页公共主题背景图）
    'personal': 'THEME_HISTORY_BIGPIC',                             // 记录页
    'gkjlym': 'THEME_HISTORY_BIGPIC',                               // 记录页（新）
    'wdscym': 'THEME_HISTORY_BIGPIC',                               // 收藏页
    'jzzxym': 'THEME_SEARCH_BIGPIC',                                // 家长中心页
    'search': 'THEME_SEARCH_BIGPIC',                                // 搜索页
    'cartoon': 'THEME_DETAIL_BIGPIC',                               // 详情页
    'apk': 'THEME_APK_BOOT_IMAGE',                                  // 开机图
    'yjzbym' : 'THEME_YJBF_BIGPIC',                                 // 一键播放页
    'hbzbj' : 'THEME_HBZBJ_BIGPIC',                                 // 海贝直播间页（一键播放页导航）
    'xhbknj' : 'THEME_XHBKNJ_BIGPIC',                               // 小海贝看南京页（一键播放页导航）
    'chslym' : 'THEME_CHSL_BIGPIC',                                 // 彩虹森林页（一键播放页导航）
    'sojym' : 'THEME_SOJ_BIGPIC',                                   // 手偶剧页（一键播放页导航）
    'mfxtym' : 'THEME_MFXT_BIGPIC',                                 // 魔法学堂页（一键播放页导航）
    'njdst' : 'THEME_NJDST_BIGPIC',                                 // 南京电视台页（一键播放页导航）
    /************************************************其他（页面背景外需添加到主题的图）键值***************************************************************/
    //首页
    'logo': 'THEME_LOGO',                                           // logo图
    'interceptePage': 'THEME_INTERCEPTE_BIGPIC',                    // 退出拦截
    'main_patch': 'THEME_PATCH',                                    // 首页补洞
    'nav': 'THEME_HEAD_PIC_',                                       // 导航
    'navRight': 'THEME_HEAD_RIGHT_PIC_',                            // 导航右图
    'navBelow': 'THEME_HEAD_BELOW_PIC',                              // 导航下图
    'train': 'THEME_INDEX_TRAIN',                                   // 火车
    //个人中心---家长中心-家长锁
    'jzzxym_keyboard' : 'THEME_personalCenter_keyboardPic',                         // 家长锁键盘图
};


/**
 * 将个人主题的配置信息更新到页面配置信息中
 * @param {*} commonPageInfo  页面信息
 * @param {*} themeInfo       个人主题信息
 */
function changeThemeInfo(commonPageInfo,themeInfo){
    //页面信息 
    let pageInfo = commonPageInfo.pageInfo;
    if(!commonPageInfo) return {};
    //页面的英文名
    let commPageEname = pageInfo.commPageEname.split("_")[0];
    //如果页面不存在key中或者主题不存在，直接返回结果
    if(!keys[commPageEname] || !themeInfo){
        return commonPageInfo;
    }
    let userThemeInfo = themeInfo.themeAttrMap;
    if(userThemeInfo){
        for(let key in userThemeInfo){
            var keyArr = key.split("_");
            let picData = userThemeInfo[key];
            let picDataArr = picData.split(",")
         
            if(key.indexOf("THEME_HEAD_PIC") > -1){   //顶部导航
                let index = keyArr[3];
                let i = index - 1;
                if(pageInfo.commonPageInfo.recommend_2[i]){
                    //海报图
                    pageInfo.commonPageInfo.recommend_2[i].recommendPic.picPath = picDataArr[0];
                //选中图
                    pageInfo.commonPageInfo.recommend_2[i].recommendLabelpic.picPath = picDataArr[1];
                //焦点图
                    pageInfo.commonPageInfo.recommend_2[i].recommendFocuspic.picPath = picDataArr[2];
                }
            }else if(key.indexOf("THEME_HEAD_BELOW") > -1){//左侧导航
                let index = keyArr[4];
                let i = index - 1 ;
                if(pageInfo.commonPageInfo.recommend_3[i]){
                    // 推荐位图片
                    pageInfo.commonPageInfo.recommend_3[i].recommendPic.picPath = picDataArr[0];
                    // 选中图
                    pageInfo.commonPageInfo.recommend_3[i].recommendLabelpic && (pageInfo.commonPageInfo.recommend_3[i].recommendLabelpic.picPath = picDataArr[1]);
                    // 焦点图
                    pageInfo.commonPageInfo.recommend_3[i].recommendFocuspic.picPath = picDataArr[2];
                }
            }
            switch (key){
                //logo
                case key["logo"] :
                    pageInfo.commonPageInfo.recommend_1[0].recommendPic.picPath = picDataArr[0];
                break;
                //背景图
                case keys[commPageEname] : 
                    pageInfo.pageTemplateBgpic.picPath = picDataArr[0];
                break;
                //首页补位图
                case keys['main_patch'] :
                    if(commPageEname.indexOf("main") > -1 && pageInfo.pageTemplatePic){
                          pageInfo.pageTemplatePic.picPath = picDataArr[0];
                    }else{
                        pageInfo.pageTemplatePic = {};
                    }
                    break;
                //// 个人中心---家长中心-家长锁 键盘背景
                case keys['jzzxym_keyboard'] : 
                    if(commPageEname == "jzzxym"){
                        commonPageInfo.recommend_4[0].recommendPic.picPath = picDataArr[0];
                    }
            }
        }
    }
    return commonPageInfo;
}

module.exports = changeThemeInfo;