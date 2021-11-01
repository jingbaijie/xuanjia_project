import axios from "@/common/axios";
import qs from "qs"; // post请求转码
import store from "./index";

const http = {
    get: function(url, requestJson, config) {
        return new Promise((resolve, reject) => {
            axios
                .get(url, Object.assign({ params: requestJson }, config))
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    post: function(url, requestJson, config) {
        return new Promise((resolve, reject) => {
            axios
                .post(url, qs.stringify(Object.assign(requestJson, config)))
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    // 二进制流文件下载
    downloadBlob: function(url, requestJson, config) {
        return new Promise((resolve, reject) => {
            axios
                .post(url, qs.stringify(Object.assign(requestJson, config)), {
                    responseType: "blob"
                })
                .then(res => {
                    var data = res;
                    if (!data) {
                        return;
                    }
                    var blob = new Blob([data.data], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                    });
                    var url = window.URL.createObjectURL(blob);
                    var aLink = document.createElement("a");
                    aLink.style.display = "none";
                    aLink.href = url;
                    aLink.setAttribute(
                        "download",
                        "excel_" + new Date().getTime() + ".xls"
                    );
                    document.body.appendChild(aLink);
                    aLink.click();
                    document.body.removeChild(aLink); //下载完成移除元素
                    window.URL.revokeObjectURL(url); //释放掉blob对象
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    // 二进制流文件下载
    downloadBlobText: function(url, requestJson, config) {
        return new Promise((resolve, reject) => {
            axios
                .post(url, qs.stringify(Object.assign(requestJson, config)), {
                    responseType: "blob"
                })
                .then(res => {
                    var data = res;
                    if (!data) {
                        return;
                    }
                    var blob = new Blob([data.data], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                    });
                    var url = window.URL.createObjectURL(blob);
                    var aLink = document.createElement("a");
                    aLink.style.display = "none";
                    aLink.href = url;
                    aLink.setAttribute(
                        "download",
                        "text_" + new Date().getTime() + ".txt"
                    );
                    document.body.appendChild(aLink);
                    aLink.click();
                    document.body.removeChild(aLink); //下载完成移除元素
                    window.URL.revokeObjectURL(url); //释放掉blob对象
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    postJson: function(url, requestJson, config) {
        return new Promise((resolve, reject) => {
            axios
                .post(url, JSON.stringify(Object.assign(requestJson, config)), {
                    headers: { "Content-Type": "application/json;charset=UTF-8" }
                })
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },

    postJ: function(url, requestJson, config) {
        return new Promise((resolve, reject) => {
            axios
                .post(url, requestJson, {
                    headers: { "Content-Type": "application/json;charset=UTF-8" }
                })
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },

    put: function(url, requestJson, config) {
        return new Promise((resolve, reject) => {
            axios
                .put(url, qs.stringify(Object.assign(requestJson, config)))
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    putJson: function(url, requestJson, config) {
        return new Promise((resolve, reject) => {
            axios
                .put(url, JSON.stringify(Object.assign(requestJson, config)), {
                    headers: { "Content-Type": "application/json;charset=UTF-8" }
                })
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    delete: function(url, requestJson, config) {
        return new Promise((resolve, reject) => {
            axios
                .delete(url, Object.assign({ params: requestJson }, config))
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
};
export default {
    // 游戏管理
    // content/gameManage/gameList 参数：typeId

    // 通过节目id获取视频信息列表：
    // content/series/getMovieListByProgramId 参数：programId

    // 卡通上下架
    // content/series/updateBooleanUp  参数：seriesId，booleanUp

    // 获取标签
    // /content/tag/productTagList

    // /content/series/selectAllCartoonSimpleInfo
    // searchValue
    // pageNum
    // pageSize

    // /content/program/batchInsert
    // cartoonId
    // start
    // end
    // prefix

    //清缓存
    axios_clearCache() {
        var url = this.baseUrl;
        // if (method && method.toLocaleUpperCase() == "POST") {
        var params = {
            log: typeof args == "object" ? JSON.stringify(args) : args
        };
        if (!args) {
            return;
        }
        var oAjax = null;
        try {
            oAjax = new XMLHttpRequest();
        } catch (e) {
            oAjax = new ActiveXObject("Microsoft.XMLHTTP");
        }
        oAjax.open("POST", url, true);
        oAjax.withCredentials = false;
        oAjax.send(JSON.stringify(params));
        oAjax.onreadystatechange = function() {
            /*/当状态为4的时候，执行以下操作*/
            if (oAjax.readyState == 4) {
                if (oAjax.status == 200) {
                    // success && success(eval("(" + oAjax.responseText + ")"));
                    this.$message.success("清除成功");
                } else {
                    // fail && fail(status);
                    this.$message.success("清除失败");
                }
            }
        };
    },

    axios_get_systemConfigByKey({ commit }, requestData = {}) {
        return http.get("/system/config/getSystemConfigByKey", requestData);
    },

    axios_query_boxUpdateList({ commit }, requestData = {}) {
        return http.get("/boxadmin/repairInfo/boxUpdateList", requestData);
    },
    axios_query_repairList({ commit }, requestData = {}) {
        return http.get("/boxadmin/repairInfo/repairList", requestData);
    },

    //组件模板
    axios_get_componentList({ commit }, requestData = {}) {
        return http.get("/content/component/list", requestData);
    },
    axios_add_componentList({ commit }, requestData = {}) {
        return http.postJson("/content/component/add", requestData);
    },
    axios_update_componentList({ commit }, requestData = {}) {
        return http.postJson("content/component/update", requestData);
    },
    //元件
    axios_get_elementList({ commit }, requestData = {}) {
        return http.get("/content/componentElement/list", requestData);
    },
    axios_add_elementList({ commit }, requestData = {}) {
        return http.postJson("/content/componentElement/add", requestData);
    },
    //通过组件ID获取组件及下面房间及配置的接口
    axios_get_componentById({ commit }, requestData = {}) {
        return http.get("/content/component/selectComponentById", requestData);
    },

    //删除专题坑位

    axios_del_specialRoom({ commit }, requestData = {}) {
        return http.get("content/pageComponent/room/delete", requestData);
    },
    /**
     * 生成盒子编号接口
     */
    axios_add_deviceno({ commit }, requestData = {}) {
        return http.postJson("/boxadmin/deviceInfo/genSnAndSerNum", requestData);
    },
    /**
     * 删除设备信息接口
     * param: ids (支持批量删除121_122_521_119)
     *
     */
    axios_del_device({ commit }, requestData = {}) {
        return http.get("/boxadmin/deviceInfo/delete", requestData);
    },
    axios_edit_device({ commit }, requestData = {}) {
        return http.get("/boxadmin/deviceInfo/update", requestData);
    },
    axios_add_device({ commit }, requestData = {}) {
        return http.get("/boxadmin/deviceInfo/insert", requestData);
    },
    axios_get_device({ commit }, requestData = {}) {
        return http.get("/boxadmin/deviceInfo/deviceList", requestData);
    },
    /**
     * 删除厂商信息接口
     * param: ids (支持批量删除121_122_521_119)
     *
     */
    axios_del_factory({ commit }, requestData = {}) {
        return http.get("/boxadmin/factoryInfo/delete", requestData);
    },
    axios_edit_factory({ commit }, requestData = {}) {
        return http.get("/boxadmin/factoryInfo/update", requestData);
    },
    axios_add_factory({ commit }, requestData = {}) {
        return http.get("/boxadmin/factoryInfo/insert", requestData);
    },
    axios_get_factoryList({ commit }, requestData = {}) {
        return http.get("/boxadmin/factoryInfo/factoryList", requestData);
    },

    /** 升级 */
    axios_add_apkUpdateInfo({ commit }, requestData = {}) {
        return http.get("/boxadmin/apkUpdateInfo/batchInsert", requestData);
    },
    axios_query_boxUpdateList({ commit }, requestData = {}) {
        return http.get("/boxadmin/apkUpdateInfo/boxUpdateList", requestData);
    },

    /** 版本 */
    // 查询
    axios_query_versionList({ commit }, requestData = {}) {
        return http.get("/boxadmin/versionInfo/versionList", requestData);
    },
    // 添加 /boxadmin/versionInfo/insert
    axios_add_versionList({ commit }, requestData = {}) {
        return http.get("/boxadmin/versionInfo/insert", requestData);
    },
    // 修改 /boxadmin/apkUpdateInfo/update
    axios_update_versionList({ commit }, requestData = {}) {
        return http.get("/boxadmin/versionInfo/update", requestData);
    },
    // 删除 /boxadmin/apkUpdateInfo/delete
    axios_delete_versionList({ commit }, requestData = {}) {
        return http.get("/boxadmin/versionInfo/delete", requestData);
    },
    // 改变版本状态
    axios_update_updateIsActive({ commit }, requestData = {}) {
        return http.get("/boxadmin/versionInfo/updateIsActive", requestData);
    },
    /** 盒子日志相关接口 boxadmin/deviceInfo/deviceNum*/
    axios_query_numList({ commit }, requestData = {}) {
        return http.get("/boxadmin/deviceInfo/deviceNum", requestData);
    },
    // 查询升级成功或者失败盒子数目
    axios_query_updatedDeviceNum({ commit }, requestData = {}) {
        return http.get("/boxadmin/log/updateLog/updatedDeviceNum", requestData);
    },
    // 查询盒子在线数接口 /boxadmin/onlineInfo/list
    axios_query_onlineInfo({ commit }, requestData = {}) {
        return http.get("/boxadmin/onlineInfo/list", requestData);
    },
    /** 字典接口 */
    // 查询 /boxadmin/dicInfo/versionList
    axios_query_dicInfo({ commit }, requestData = {}) {
        return http.get("/boxadmin/versionInfo/getDicData", requestData);
    },

    /**内容下发 */
    axios_get_distribution({ commit }, requestData = {}) {
        return http.post("content/distribution/records", requestData);
    },

    axios_get_userList({ commit }, requestData = {}) {
        return http.post("content/whiteAndBlackList/userList", requestData);
    },

    //new  节目管理
    //追加关联标签接口
    axios_get_addTag({ commit }, requestData = {}) {
        return http.postJson("content/series/addTag", requestData);
    },
    //覆盖关联标签接口
    axios_set_coverTag({ commit }, requestData = {}) {
        return http.postJson("content/series/coverTag", requestData);
    },
    //单个解除关联标签
    axios_set_releaseTag({ commit }, requestData = {}) {
        return http.postJson("content/series/releaseTag", requestData);
    },
    //全部解除关联标签
    axios_set_releaseAllTag({ commit }, requestData = {}) {
        return http.postJson("content/series/releaseAllTag", requestData);
    },

    //标签

    axios_get_tagList({ commit }, requestData = {}) {
        return http.get("content/tag/tagList", requestData);
    },
    axios_get_tagListNoPage({ commit }, requestData = {}) {
        return http.get("content/tag/tagListNoPage", requestData);
    },
    axios_del_tagList({ commit }, requestData = {}) {
        return http.get("content/tag/delete", requestData);
    },
    axios_add_tagList({ commit }, requestData = {}) {
        return http.postJson("content/tag/insert", requestData);
    },
    axios_update_tagList({ commit }, requestData = {}) {
        return http.postJson("content/tag/update", requestData);
    },
    axios_export_tagList({ commit }, requestData = {}) {
        return http.downloadBlob("content/tag/export", requestData);
    },
    ///content/series/importExcelMedia
    // 节目管理
    //导出
    axios_get_export({ commit }, requestData = {}) {
        return http.downloadBlob("content/series/export", requestData);
    },

    //导出播放信息
    axios_get_exportVideoInfo({ commit }, requestData = {}) {
        return http.downloadBlob("bjghInject/getPlayUrl", requestData);
    },

    //重新发送过期片单的信息 /content/series/checkCopyrightPeriod
    axios_get_checkCopyrightPeriod({ commit }, requestData = {}) {
        return http.post("/content/series/checkCopyrightPeriod", requestData);
    },

    axios_get_importExcelMedia({ commit }, requestData = {}) {
        return http.post("content/series/importExcelMedia", requestData);
    },
    //添加节目集：图片匹配
    axios_get_autoMatchPic({ commit }, requestData = {}) {
        return http.post("/content/series/autoMatchPic", requestData);
    },

    //添加节目子集：视频海报图批量匹配
    axios_get_videoDetail({ commit }, requestData = {}) {
        return http.post("/content/videoDetail/autoMatchPic", requestData);
    },

    //机构图片批量匹配
    axios_get_institutionDetail({ commit }, requestData = {}) {
        return http.post("/content/cpDetail/autoMatchPic", requestData);
    },

    //活动图片批量匹配
    axios_get_activityDetail({ commit }, requestData = {}) {
        return http.post("/activity/autoMatchPic", requestData);
    },

    //下拉获取所有机构接口
    axios_get_allCp({ commit }, requestData = {}) {
        return http.post("/content/cpDetail/getAllCp", requestData);
    },

    ///system/dictData/selectDictDataByType
    //dictType
    // 节目管理操作查看-节目信息-操作新增
    axios_get_programInsert({ commit }, requestData = {}) {
        return http.postJson("/content/program/insert", requestData);
    },
    // 节目管理操作查看-节目信息-操作修改
    axios_get_programUpdate({ commit }, requestData = {}) {
        return http.postJson("/content/program/update", requestData);
    },

    //修改密码
    axios_get_revisePwd({ commit }, requestData = {}) {
        return http.post("/media/sysUser/resetPwd", requestData);
    },

    //批量修改分类和标签
    //content/series/batchUpdateTypeAndTag
    axios_update_tag({ commit }, requestData = {}) {
        return http.postJson("content/series/batchUpdateTypeAndTag", requestData);
    },
    axios_update_game_tag({ commit }, requestData = {}) {
        return http.postJson(
            "content/gameManage/batchUpdateTypeAndTag",
            requestData
        );
    },
    //游戏排行
    //content/gameManage/updateRankId
    axios_update_gameRankId({ commit }, requestData = {}) {
        return http.post("content/gameManage/updateRankId", requestData);
    },
    //游戏删除
    axios_del_game({ commit }, requestData = {}) {
        return http.post("content/gameManage/delete", requestData);
    },

    //节目排行
    //content/series/updateRankId
    axios_update_seriesRankId({ commit }, requestData = {}) {
        return http.post("content/series/updateRankId", requestData);
    },

    //获取模板归属分类
    //media/sysConfig/configList
    axios_get_levelType({ commit }, requestData = {}) {
        return http.get("recommend/pageTemplateWareHouse/levelType", requestData);
    },
    //system/sysDictType/dictTypeList

    //字典类型管理
    axios_get_dictTypeList({ commit }, requestData = {}) {
        return http.post("system/dictType/dictTypeList", requestData);
    },
    //system/sysDictType/dictTypeList
    axios_add_dictTypeList({ commit }, requestData = {}) {
        return http.postJson("system/dictType/insert", requestData);
    },
    //system/sysDictType/dictTypeList
    axios_del_dictTypeList({ commit }, requestData = {}) {
        return http.post("system/dictType/delete", requestData);
    },
    //system/sysDictType/dictTypeList
    axios_edit_dictTypeList({ commit }, requestData = {}) {
        return http.postJson("system/dictType/update", requestData);
    },

    //字典管理
    axios_get_dictDataList({ commit }, requestData = {}) {
        return http.post("system/dictData/dictDataList", requestData);
    },
    axios_edit_dictDataList({ commit }, requestData = {}) {
        return http.postJson("system/dictData/update", requestData);
    },
    axios_add_dictDataList({ commit }, requestData = {}) {
        return http.postJson("system/dictData/insert", requestData);
    },
    axios_del_dictDataList({ commit }, requestData = {}) {
        return http.post("system/dictData/delete", requestData);
    },

    //参数管理
    axios_get_configList({ commit }, requestData = {}) {
        return http.post("system/config/configList", requestData);
    },
    axios_del_configList({ commit }, requestData = {}) {
        return http.post("system/config/delete", requestData);
    },
    axios_edit_configList({ commit }, requestData = {}) {
        return http.postJson("system/config/update", requestData);
    },
    axios_add_configList({ commit }, requestData = {}) {
        return http.postJson("system/config/insert", requestData);
    },

    axios_del_pageTemplateWareHouseList({ commit }, requestData = {}) {
        return http.post("recommend/pageTemplateWareHouse/delete", requestData);
    },
    // 模板管理
    // content/pageTemplateWareHouse/pageTemplateWareHouseList
    axios_get_pageTemplateWareHouseList({ commit }, requestData = {}) {
        return http.post(
            "recommend/pageTemplateWareHouse/pageTemplateWareHouseList",
            requestData
        );
    },
    axios_add_pageTemplateWareHouseList({ commit }, requestData = {}) {
        return http.postJson("recommend/pageTemplateWareHouse/insert", requestData);
    },
    axios_edit_pageTemplateWareHouseList({ commit }, requestData = {}) {
        return http.postJson("recommend/pageTemplateWareHouse/update", requestData);
    },

    axios_add_batchInsert({ commit }, requestData = {}) {
        return http.post("content/program/batchInsert", requestData);
    },
    //获取视频
    axios_get_selectAllCartoonSimpleInfo({ commit }, requestData = {}) {
        return http.post("content/series/selectAllCartoonSimpleInfo", requestData);
    },

    axios_get_productTagList({ commit }, requestData = {}) {
        return http.post("content/tag/productTagList", requestData);
    },

    //黑白名单管理
    axios_del_blackList({ commit }, requestData = {}) {
        return http.post("content/whiteAndBlackList/delete", requestData);
    },
    axios_add_blackList({ commit }, requestData = {}) {
        return http.postJson("content/whiteAndBlackList/insert", requestData);
    },
    axios_edit_blackList({ commit }, requestData = {}) {
        return http.postJson("content/whiteAndBlackList/update", requestData);
    },
    axios_get_blackList({ commit }, requestData = {}) {
        return http.post(
            "content/whiteAndBlackList/whiteAndBlackList",
            requestData
        );
    },

    // 通过节目集Id获取节目列表：// 参数：seriesId
    axios_get_programListBySeriesId({ commit }, requestData = {}) {
        return http.post("content/program/getProgramListBySeriesId", requestData);
    },
    //游戏管理
    axios_add_game({ commit }, requestData = {}) {
        return http.postJson("content/gameManage/insert", requestData);
    },
    axios_edit_game({ commit }, requestData = {}) {
        return http.postJson("content/gameManage/update", requestData);
    },
    axios_get_gameList({ commit }, requestData = {}) {
        return http.post("content/gameManage/gameList", requestData);
    },
    axios_get_movieListByProgramId({ commit }, requestData = {}) {
        return http.post("content/series/getMovieListByProgramId", requestData);
    },
    //   修改游戏 是否免费接口0-免费 1-收费
    // /content/gameManage/updateIsFree
    // 参数：gameId，isFree
    axios_update_gameIsFree({ commit }, requestData = {}) {
        return http.post("content/gameManage/updateIsFree", requestData);
    },
    //游戏上下架
    axios_update_GameBooleanUp({ commit }, requestData = {}) {
        return http.post("content/gameManage/updateBooleanUp", requestData);
    },

    // 卡通管理
    // content/series/seriesList 参数：typeId
    axios_get_seriesList({ commit }, requestData = {}) {
        return http.get("content/series/seriesList", requestData);
    },
    axios_add_seriesList({ commit }, requestData = {}) {
        return http.postJson("content/series/insert", requestData);
    },
    axios_edit_seriesList({ commit }, requestData = {}) {
        return http.postJson("content/series/update", requestData);
    },

    // 内容送审
    // 新增审核任务
    axios_add_contentReviewInfo({ commit }, requestData = {}) {
        return http.postJson(
            "content/contentReviewInfo/addReviewInfo",
            requestData
        );
    },
    // 获取拥有审核属性的平台
    axios_get_getContentCheckPlat({ commit }, requestData = {}) {
        return http.post("content/contentReviewInfo/getCheckPlatform", requestData);
    },
    // 修改审核结果
    axios_edit_getContentReviewResult({ commit }, requestData = {}) {
        return http.postJson(
            "/content/contentReviewInfo/getReviewResult",
            requestData
        );
    },

    //   批量节目修改 是否免费接口0-免费 1-收费
    // 参数：seriesId,  videoId, isFree
    axios_update_seriesIsFree({ commit }, requestData = {}) {
        return http.post("content/series/updateIsFree", requestData);
    },
    //   批量节目上下架
    axios_update_BooleanUp({ commit }, requestData = {}) {
        return http.post("content/series/updateBooleanUp", requestData);
    },
    //卡通删除
    axios_del_seriesDel({ commit }, requestData = {}) {
        return http.post("content/series/delete", requestData);
    },
    //节目删除
    axios_del_programDel({ commit }, requestData = {}) {
        return http.post("/content/program/delete", requestData);
    },

    //节目批量是否可搜索
    axios_set_batchUpdateSearchFlag({ commit }, requestData = {}) {
        return http.post("/content/series/batchUpdateSearchFlag", requestData);
    },

    //标签管理
    axios_get_labelContent({ commit }, requestData = {}) {
        return http.post("content/tag/getContentByTagsId", requestData);
    },
    axios_del_labelContent({ commit }, requestData = {}) {
        return http.post("content/tag/delete", requestData);
    },
    axios_edit_labelContent({ commit }, requestData = {}) {
        return http.postJson("content/tag/update", requestData);
    },
    axios_add_labelContent({ commit }, requestData = {}) {
        return http.postJson("content/tag/insert", requestData);
    },

    //获取产品列表
    axios_get_productList({ commit }, requestData = {}) {
        return http.post("content/tag/product", requestData);
    },

    //分类管理
    // axios_get_tagList({ commit }, requestData = {}) {
    //     return http.post("content/tag/tagList", requestData);
    // },
    axios_add_typeInfo({ commit }, requestData = {}) {
        return http.postJson("content/type/insert", requestData);
    },
    axios_edit_typeInfo({ commit }, requestData = {}) {
        return http.postJson("content/type/update", requestData);
    },
    axios_get_typeInfo({ commit }, requestData = {}) {
        return http.post("content/type/typeInfo", requestData);
    },
    axios_del_typeInfo({ commit }, requestData = {}) {
        return http.post("content/type/delete", requestData);
    },

    //获取分类树
    axios_get_classify({ commit }, requestData = {}) {
        return http.post("content/type/typeTree", requestData);
    },

    //CPSP信息列表
    axios_get_cp({ commit }, requestData = {}) {
        return http.post("content/cpDetail/cpDetailList", requestData);
    },

    //检查用户名唯一
    axios_check_user({ commit }, requestData = {}) {
        return http.post("media/sysUser/checkUnique", requestData);
    },
    //检查活动名唯一
    axios_check_activity({ commit }, requestData = {}) {
        return http.post("activity/checkUnique", requestData);
    },
    //检查专题名唯一
    axios_check_templatename({ commit }, requestData = {}) {
        return http.post("content/special/checkUnique", requestData);
    },

    //检查角色名唯一
    axios_check_rolename({ commit }, requestData = {}) {
        return http.post("media/sysRole/checkUnique", requestData);
    },
    axios_edit_template({ commit }, requestData = {}) {
        return http.post("content/special/update", requestData);
    },

    //创建专项链接
    axios_get_createSpecialUrl({ commit }, requestData = {}) {
        return http.get("content/special/createSpecialUrl", requestData);
    },
    //专题编辑 根据专题ID获取专题
    axios_get_contentInfo({ commit }, requestData = {}) {
        return http.post("content/special/getContentInfoList", requestData);
    },
    //获取专题，推荐列表
    axios_get_template({ commit }, requestData = {}) {
        return http.get("content/special/list", requestData);
    },
    //新增专题，推荐列表
    axios_add_template({ commit }, requestData = {}) {
        return http.post("content/special/add", requestData);
    },

    //获取奖品列表
    axios_get_prize({ commit }, requestData = {}) {
        return http.post("prize/prizeList", requestData);
    },
    //添加新的奖品
    axios_add_prize({ commit }, requestData = {}) {
        return http.post("prize/insert", requestData);
    },
    //编辑奖品
    axios_edit_prize({ commit }, requestData = {}) {
        return http.post("prize/update", requestData);
    },
    //删除奖品
    axios_del_prize({ commit }, requestData = {}) {
        return http.post("prize/delete", requestData);
    },

    //活动增删改查接口
    axios_add_active({ commit }, requestData = {}) {
        return http.postJson("activity/insert", requestData);
    },
    axios_del_active({ commit }, requestData = {}) {
        return http.post("activity/delete", requestData);
    },
    axios_edit_active({ commit }, requestData = {}) {
        return http.postJson("activity/update", requestData);
    },
    axios_get_active({ commit }, requestData = {}) {
        return http.post("activity/activityList", requestData);
    },
    axios_get_active_by_id({ commit }, requestData = {}) {
        return http.post("activity/selectActivityDetailByActivityId", requestData);
    },
    axios_get_view({ commit }, requestData = {}) {
        return http.get("content/special/view", requestData);
    },

    //上传图片资源
    axios_add_images({ commit }, requestData = {}) {
        return http.post("content/image/add", requestData);
    },
    //获取图片列表
    axios_get_pic_resouce({ commit }, requestData = {}) {
        return http.get("content/image/list?dleteFlag=0", requestData);
    },
    //删除图片
    axios_del_images({ commit }, requestData = {}) {
        return http.get("content/image/delete", requestData);
    },
    //图片修改
    axios_editFileName_images({ commit }, requestData = {}) {
        return http.post("content/image/edit", requestData);
    },

    //用户登录
    axios_user_logout({ commit }, requestData = {}) {
        return http.post("auth/userlogout", requestData);
    },
    //查询用户信息
    axios_get_userInfo({ commit }, requestData = {}) {
        return http.get("media/sysUser/info", requestData);
    },

    //加载导航栏菜单权限 全业务平台菜单接口
    // axios_load_navbar({ commit }, requestData = {}) {
    //     return http.get("index/pageIndex", requestData);
    // },
    //加载导航栏菜单权限
    axios_load_navbar({ commit }, requestData = {}) {
        return http.get("media/sysUser/pageIndex", requestData);
    },

    //菜单增删改查
    axios_get_menu({ commit }, requestData = {}) {
        return http.post("media/sysMenu/menuList", requestData);
    },
    axios_edit_menu({ commit }, requestData = {}) {
        return http.post("media/sysMenu/update", requestData);
    },
    axios_add_menu({ commit }, requestData = {}) {
        return http.post("media/sysMenu/insert", requestData);
    },
    axios_del_menu({ commit }, requestData = {}) {
        return http.post("media/sysMenu/delete", requestData);
    },

    //用户更换头像昵称
    axios_get_userAvatar({ commit }, requestData = {}) {
        return http.get("content/avatar/list", requestData);
    },
    axios_add_userAvatar({ commit }, requestData = {}) {
        return http.postJson("content/avatar/add", requestData);
    },
    axios_edit_userAvatar({ commit }, requestData = {}) {
        return http.postJson("content/avatar/update", requestData);
    },
    axios_edit_userAvatarUpdateBooleanUp({ commit }, requestData = {}) {
        return http.post("content/avatar/batchUpdateBooleanUp", requestData);
    },
    axios_edit_userAvatarMatchPic({ commit }, requestData = {}) {
        return http.post("content/avatar/autoMatchPic", requestData);
    },

    //用户增删改查
    axios_get_user({ commit }, requestData = {}) {
        return http.post("media/sysUser/userList", requestData);
    },
    axios_add_user({ commit }, requestData = {}) {
        return http.post("media/sysUser/insert", requestData);
    },
    axios_edit_user({ commit }, requestData = {}) {
        return http.post("media/sysUser/update", requestData);
    },
    axios_del_user({ commit }, requestData = {}) {
        return http.post("media/sysUser/delete", requestData);
    },
    axios_resetPwd_user({ commit }, requestData = {}) {
        return http.post("media/sysUser/resetPwd", requestData);
    },

    //角色增删改查
    axios_get_role({ commit }, requestData = {}) {
        return http.post("media/sysRole/roleList", requestData);
    },
    axios_add_role({ commit }, requestData = {}) {
        return http.post("media/sysRole/insert", requestData);
    },
    axios_edit_role({ commit }, requestData = {}) {
        return http.post("media/sysRole/update", requestData);
    },
    axios_del_role({ commit }, requestData = {}) {
        return http.post("media/sysRole/delete", requestData);
    },
    //主题管理
    //查询主题信息
    axios_get_themeList({ commit }, requestData = {}) {
        return http.post("theme/list", requestData);
    },

    //添加主题信息
    axios_add_theme({ commit }, requestData = {}) {
        return http.postJson("theme/insert", requestData);
    },
    //修改主题
    axios_update_theme({ commit }, requestData = {}) {
        return http.postJson("theme/update", requestData);
    },
    //切换主题
    axios_update_themeChange({ commit }, requestData = {}) {
        return http.post("/theme/change", requestData);
    },
    //删除主题
    axios_del_theme({ commit }, requestData = {}) {
        return http.post("theme/delete", requestData);
    },
    //查询主题属性信息
    axios_get_themeDetail({ commit }, requestData = {}) {
        return http.post("themeAttr/list", requestData);
    },
    //新增主题属性
    axios_add_themeDetail({ commit }, requestData = {}) {
        return http.postJson("themeAttr/insert", requestData);
    },
    //更新主题属性
    axios_update_themeDetail({ commit }, requestData = {}) {
        return http.postJson("themeAttr/update", requestData);
    },
    //删除主题属性
    axios_del_themeDetail({ commit }, requestData = {}) {
        return http.post("themeAttr/delete", requestData);
    },

    //查询属性名称  参数：dictType：SYS_THEME_CONFIG
    axios_get_selectDictDataByType({ commit }, requestData = {}) {
        return http.post("system/dictData/selectDictDataByType", requestData);
    },

    /**
     * 体验券
     */
    //查询优惠券信息
    axios_get_saleCard({ commit }, requestData = {}) {
        return http.post("saleCard/list", requestData);
    },
    //预览优惠券信息
    axios_preview_saleCard({ commit }, requestData = {}) {
        return http.post("saleCard/preview", requestData);
    },

    //生成优惠券接口
    axios_add_saleCard({ commit }, requestData = {}) {
        return http.post("saleCard/insert", requestData);
    },
    //下载前面生成的优惠券卡号，每行一个卡号
    axios_download_saleCard({ commit }, requestData = {}) {
        return http.downloadBlobText("saleCard/download", requestData);
    },

    /**
     * cpsp
     */
    //查询
    axios_get_cpDetail({ commit }, requestData = {}) {
        return http.post("content/cpDetail/cpDetailList", requestData);
    },
    //新增
    axios_add_cpDetail({ commit }, requestData = {}) {
        return http.postJson("content/cpDetail/insert", requestData);
    },
    //更新
    axios_update_cpDetail({ commit }, requestData = {}) {
        return http.postJson("content/cpDetail/update", requestData);
    },
    //删除
    axios_del_cpDetail({ commit }, requestData = {}) {
        return http.post("content/cpDetail/delete", requestData);
    },

    //统一搜索上线下线
    axios_sub_unifiedSearch({ commit }, requestData = {}) {
        return http.get("unifiedSearch/handleDetailPage", requestData);
    },

    /*
     *机构增删改查
     */
    //获取机构信息列表
    axios_get_institution({ commit }, requestData = {}) {
        return http.post("content/cpDetail/cpDetailList", requestData);
    },
    //新增机构以及上传logo图和二维码等信息
    axios_add_institution({ commit }, requestData = {}) {
        return http.post("content/cpDetail/insert", requestData);
    },
    //编辑机构以及上传logo图和二维码等信息
    axios_edit_institution({ commit }, requestData = {}) {
        return http.post("content/cpDetail/update", requestData);
    },
    //机构上下架（相关联的学员和视频都会统一上下架）
    axios_updown_BooleanUp({ commit }, requestData = {}) {
        return http.post("content/cpDetail/delete", requestData);
    },
    //新增/编辑页面获取 机构地区列表和机构标签列表
    axios_getAreaAndTypeList_institution({ commit }, requestData = {}) {
        return http.post("content/cpDetail/getAreaAndTypeList", requestData);
    },
    //学员可配置功能
    axios_flag_institution({ commit }, requestData = {}) {
        return http.post("content/series/updateFlag", requestData);
    },
    //学员列表中根据机构筛选学员
    axios_get_seriesListByCpId({ commit }, requestData = {}) {
        return http.post("content/series/seriesListByCpId", requestData);
    },

    /**
     * 主题管理
     */

    /**根据所传条件获取主题以及主题的配置 */
    axios_get_ThemeList({ commit }, requestData = {}) {
        return http.get("content/theme/list", requestData);
    },
    axios_get_ThemeById({ commit }, requestData = {}) {
        return http.get("content/theme/getThemeById", requestData);
    },
    /**上传主题 */
    axios_add_Theme({ commit }, requestData = {}) {
        return http.postJson("content/theme/add", requestData);
    },
    /**更新主题 */
    axios_update_Theme({ commit }, requestData = {}) {
        return http.postJson("content/theme/update", requestData);
    },
    /** 启动主题 */
    axios_update_currentTheme({ commit }, requestData = {}) {
        return http.postJson("content/theme/updateCurrentThemeById", requestData);
    },

    // //专题
    // /**根据所传条件主题id获取所有页面信息 */
    // axios_get_pageWebListS({ commit }, requestData = {}) {
    //     return http.get("content/page/pageWebList", requestData);
    // },

    /**根据所传条件主题id获取所有页面信息 */
    axios_get_pages({ commit }, requestData = {}) {
        return http.get("content/page/list", requestData);
    },
    /**上传页面 */
    axios_add_pages({ commit }, requestData = {}) {
        return http.postJson("content/page/add", requestData);
    },
    /**更新页面 */
    axios_update_pages({ commit }, requestData = {}) {
        return http.postJson("content/page/update", requestData);
    },
    /** 获取通用页面数据 */
    axios_get_pageSkipList({ commit }, requestData = {}) {
        return http.get("content/page/pageSkipList", requestData);
    },

    /**获取所有皮肤或根据所传参数获取皮肤 */
    axios_get_themeskin({ commit }, requestData = {}) {
        return http.get("content/themeskin/list", requestData);
    },
    /**新增皮肤（根据是否传主键id判断是更新还是新增） */
    axios_add_themeskin({ commit }, requestData = {}) {
        return http.postJson("content/themeskin/add", requestData);
    },
    /**更新皮肤（根据是否传主键id判断是更新还是新增） */
    axios_update_themeskin({ commit }, requestData = {}) {
        return http.postJson("content/themeskin/update", requestData);
    },
    /** 切换皮肤 */
    axios_update_currentThemeSkin({ commit }, requestData = {}) {
        return http.postJson(
            "content/themeskin/updateCurrentThemeSkinById",
            requestData
        );
    },

    /**获取用户皮肤 */
    axios_get_platAll({ commit }, requestData = {}) {
        return http.get("authapi/platform/getPlatform", requestData);
    },


    /**获取用户皮肤 */
    axios_get_userSkin({ commit }, requestData = {}) {
        return http.get("user/userSkin/getByUserId", requestData);
    },

    /**重置用户皮肤 */
    axios_reset_userSkin({ commit }, requestData = {}) {
        return http.get("user/userSkin/reset", requestData);
    },

    /** 主题页面树 */
    axios_get_listLeftbar({ commit }, requestData = {}) {
        return http.get("content/theme/listLeftbar", requestData);
    },
    /** 删除自定义字段 */
    axios_delete_pageConfig({ commit }, requestData = {}) {
        return http.get("content/pageConfig/delete", requestData);
    },

    /**删除一个页面下面的组件 */
    axios_delete_component({ commit }, requestData = {}) {
        return http.get("content/page/deleteComponentById", requestData);
    },

    /**删除坑位下的属性 */
    axios_delete_pageComponentRoomConfig({ commit }, requestData = {}) {
        return http.get("content/pageComponentRoomConfig/delete", requestData);
    },

    /** 获取专项链接列表 */
    axios_get_pageLinkList({ commit }, requestData = {}) {
        return http.get("content/pageLink/list", requestData);
    },
    /** 新增/编辑专项链接列表 */
    axios_add_pageLink({ commit }, requestData = {}) {
        return http.postJson("content/pageLink/add", requestData);
    },

    /** 根据条件查询菜单（栏目） */
    axios_get_column({ commit }, requestData = {}) {
        return http.get("content/menu/list", requestData);
    },
    /** 创建菜单(栏目/导航) */
    axios_add_column({ commit }, requestData = {}) {
        return http.postJson("content/menu/create", requestData);
    },
    /** 更新菜单(栏目/导航) */
    axios_update_column({ commit }, requestData = {}) {
        return http.putJson("content/menu/update", requestData);
    },
    /** 删除菜单(栏目/导航) */
    axios_delete_column({ commit }, requestData = {}) {
        return http.delete("content/menu/delete", requestData);
    },

    //launcher增加
    axios_add_launcher({ commit }, requestData = {}) {
        return http.postJson("content/launcher/add", requestData);
    },
    //launcher列表
    axios_get_launcher({ commit }, requestData = {}) {
        return http.get("content/launcher/list", requestData);
    },
    //launcher编排
    axios_update_launcher({ commit }, requestData = {}) {
        return http.postJson("content/launcher/update", requestData);
    },
    //通过LauncherID查询Launcher
    axios_get_launcherById({ commit }, requestData = {}) {
        return http.get("content/launcher/selectLauncherById", requestData);
    },
    //发布Launcher
    axios_publish_Launcher({ commit }, requestData = {}) {
        return http.postJson("content/launcher/publish", requestData);
    },
    //Launcher下的页面组件及坑位
    axios_get_launcherPageById({ commit }, requestData = {}) {
        return http.get("content/launcher/selectLauncherPageById", requestData);
    },
    //launcher下的所有页面
    axios_get_pagesByLauncherId({ commit }, requestData = {}) {
        return http.get("content/launcher/selectPagesByLauncherId", requestData);
    },

    //获取所有页面列表
    axios_get_pageSkipList({ commit }, requestData = {}) {
        return http.get("content/page/pageSkipList", requestData);
    },

    /**
     * 首页
     */
    //参数查看
    axios_config_detailByKey({ commit }, requestData = {}) {
        return http.post("index/getConfigDetailByKey", requestData);
    },
    //片单数据
    axios_get_mediaInfo({ commit }, requestData = {}) {
        return http.post("index/getMediaInfo", requestData);
    },
    //设置
    axios_update_configById({ commit }, requestData = {}) {
        return http.postJson("index/updateConfigById", requestData);
    },
    add_view({ commit }, view) {
        commit("add_cached_view", view);
    },
    del_view({ commit, state }, view) {
        return new Promise(resolve => {
            commit("del_cache_view", view);
            resolve([...state.cachedViews]);
        });
    },
    axios_me({ commit }, requestData = {}) {
        let source = axios.CancelToken.source();
        store.commit("axiosCancel_setter", {
            me: source
        });
        return new Promise((resolve, reject) => {
            http
                .post("/api/v1/members/me.json", requestData, {
                    cancelToken: source.token
                })
                .then(res => {
                    if (res.data && +res.data.error === 0) {
                        commit("userInfo_setter", res.data.member);
                    } else {}
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
};