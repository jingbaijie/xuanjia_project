/*
 * @LastEditors: zhanggao
 * @LastEditTime: 2020-11-17 14:26:17
 */
var jsonType = { 'Content-Type': 'application/json;charset=UTF-8' }

const urlList = [
    {name:"axios_query_boxUpdateList",url:'/boxadmin/repairInfo/boxUpdateList',method:'get',reType:'get'},
    {name:"axios_query_repairList",url:'/boxadmin/repairInfo/repairList',method:'get',reType:'get'},
    /**
     * 生成盒子编号接口
     */
    {name:"axios_add_deviceno",url:'/boxadmin/deviceInfo/genSnAndSerNum',method:'post',headers:jsonType,reType:'get'},
    /**
     * 删除设备信息接口
     * param: ids (支持批量删除121_122_521_119)
     * 
     */
    {name:"axios_del_device",url:'/boxadmin/deviceInfo/delete',method:'get',reType:'update'},
    {name:"axios_edit_device",url:'/boxadmin/deviceInfo/update',method:'get',reType:'update'},
    {name:"axios_add_device",url:'/boxadmin/deviceInfo/insert',method:'get',reType:'update'},
    {name:"axios_get_device",url:'/boxadmin/deviceInfo/deviceList',method:'get',reType:'get'},
    /**
     * 删除厂商信息接口
     * param: ids (支持批量删除121_122_521_119)
     * 
     */
    {name:"axios_del_factory",url:'/boxadmin/factoryInfo/delete',method:'get',reType:'update'},
    {name:"axios_edit_factory",url:'/boxadmin/factoryInfo/update',method:'get',reType:'update'},
    {name:"axios_add_factory",url:'/boxadmin/factoryInfo/insert',method:'get',reType:'update'},
    {name:"axios_get_factoryList",url:'/boxadmin/factoryInfo/factoryList',method:'get',reType:'get'},
    /** 升级 */
    {name:"axios_add_apkUpdateInfo",url:'/boxadmin/apkUpdateInfo/batchInsert',method:'get',reType:'update'},
    {name:"axios_query_boxUpdateList",url:'/boxadmin/apkUpdateInfo/boxUpdateList',method:'get',reType:'get'},
    /** 版本 */
    // 查询
    {name:"axios_query_versionList",url:'/boxadmin/versionInfo/versionList',method:'get',reType:'get'},
    // 添加 /boxadmin/versionInfo/insert
    {name:"axios_add_versionList",url:'/boxadmin/versionInfo/insert',method:'get',reType:'update'},
    // 修改 /boxadmin/apkUpdateInfo/update
    {name:"axios_update_versionList",url:'/boxadmin/versionInfo/update',method:'get',reType:'update'},
    // 删除 /boxadmin/apkUpdateInfo/delete
    {name:"axios_delete_versionList",url:'/boxadmin/versionInfo/delete',method:'get',reType:'update'},
    // 改变版本状态
    {name:"axios_update_updateIsActive",url:'/boxadmin/versionInfo/updateIsActive',method:'get',reType:'update'},
    /** 盒子日志相关接口 boxadmin/deviceInfo/deviceNum*/
    {name:"axios_query_numList",url:'/boxadmin/deviceInfo/deviceNum',method:'get',reType:'get'},
    // 查询升级成功或者失败盒子数目
    {name:"axios_query_updatedDeviceNum",url:'/boxadmin/log/updateLog/updatedDeviceNum',method:'get',reType:'update'},
    // 查询盒子在线数接口 /boxadmin/onlineInfo/list
    {name:"axios_query_onlineInfo",url:'/boxadmin/onlineInfo/list',method:'get',reType:'get'},
    /** 字典接口 */
    // 查询 /boxadmin/dicInfo/versionList
    {name:"axios_query_dicInfo",url:'/boxadmin/versionInfo/getDicData',method:'get',reType:'get'},
    /**内容下发 */
    {name:"axios_get_distribution",url:'content/distribution/records',method:'post',reType:'get'},
    {name:"axios_get_userList",url:'content/whiteAndBlackList/userList',method:'post',reType:'get'},
    //重新发送过期片单的信息 /content/series/checkCopyrightPeriod
    {name:"axios_get_checkCopyrightPeriod",url:'/content/series/checkCopyrightPeriod',method:'post',reType:'get'},
    {name:"axios_get_importExcelMedia",url:'content/series/importExcelMedia',method:'post',reType:'update'},
    //添加节目集：图片匹配
    {name:"axios_get_autoMatchPic",url:'/content/series/autoMatchPic',method:'post',reType:'update'},
    ///system/dictData/selectDictDataByType
    //dictType
    // 节目管理操作查看-节目信息-操作新增
    {name:"axios_get_programInsert",url:'/content/program/insert',method:'post',headers:jsonType,reType:'update'},
    // 节目管理操作查看-节目信息-操作修改
    {name:"axios_get_programUpdate",url:'/content/program/update',method:'post',headers:jsonType,reType:'update'},
    //修改密码
    {name:"axios_get_revisePwd",url:'/media/sysUser/resetPwd',method:'post',reType:'update'},
    //批量修改分类和标签
    //content/series/batchUpdateTypeAndTag
    {name:"axios_update_tag",url:'content/series/batchUpdateTypeAndTag',method:'post',headers:jsonType,reType:'update'},
    {name:"axios_update_game_tag",url:'content/game/batchUpdateTypeAndTag',method:'post',headers:jsonType,reType:'update'},
    //游戏排行
    //content/game/updateRankId
    {name:"axios_update_gameRankId",url:'content/game/updateRankId',method:'post',reType:'update'},
    //节目排行
    //content/series/updateRankId
    {name:"axios_update_seriesRankId",url:'content/series/updateRankId',method:'post',reType:'update'},
    //获取模板归属分类
    //media/sysConfig/configList
    {name:"axios_get_levelType",url:'recommend/pageTemplateWareHouse/levelType',method:'get',reType:'get'},
    //system/sysDictType/dictTypeList
    //字典类型管理
    {name:"axios_get_dictTypeList",url:'system/dictType/dictTypeList',method:'post',reType:'get'},
    //system/sysDictType/dictTypeList
    {name:"axios_add_dictTypeList",url:'system/dictType/insert',method:'post',headers:jsonType,reType:'update'},
    //system/sysDictType/dictTypeList
    {name:"axios_del_dictTypeList",url:'system/dictType/delete',method:'post',reType:'update'},
    //system/sysDictType/dictTypeList
    {name:"axios_edit_dictTypeList",url:'system/dictType/update',method:'post',headers:jsonType,reType:'update'},
    //字典管理
    {name:"axios_get_dictDataList",url:'system/dictData/dictDataList',method:'post',reType:'get'},
    {name:"axios_edit_dictDataList",url:'system/dictData/update',method:'post',headers:jsonType,reType:'update'},
    {name:"axios_add_dictDataList",url:'system/dictData/insert',method:'post',headers:jsonType,reType:'update'},
    {name:"axios_del_dictDataList",url:'system/dictData/delete',method:'post',reType:'update'},
    //参数管理
    {name:"axios_get_configList",url:'system/config/configList',method:'post',reType:'get'},
    {name:"axios_del_configList",url:'system/config/delete',method:'post',reType:'update'},
    {name:"axios_edit_configList",url:'system/config/update',method:'post',headers:jsonType,reType:'update'},
    {name:"axios_add_configList",url:'system/config/insert',method:'post',headers:jsonType,reType:'update'},
    // 模板管理
    // content/pageTemplateWareHouse/pageTemplateWareHouseList
    {name:"axios_del_pageTemplateWareHouseList",url:'recommend/pageTemplateWareHouse/delete',method:'post',reType:'update'},
    {name:"axios_get_pageTemplateWareHouseList",url:'recommend/pageTemplateWareHouse/pageTemplateWareHouseList',method:'post',reType:'get'},
    {name:"axios_add_pageTemplateWareHouseList",url:'recommend/pageTemplateWareHouse/insert',method:'post',headers:jsonType,reType:'update'},
    {name:"axios_edit_pageTemplateWareHouseList",url:'recommend/pageTemplateWareHouse/update',method:'post',headers:jsonType,reType:'update'},
    {name:"axios_add_batchInsert",url:'content/program/batchInsert',method:'post',reType:'update'},
    //获取视频
    {name:"axios_get_selectAllCartoonSimpleInfo",url:'content/series/selectAllCartoonSimpleInfo',method:'post',reType:'get'},
    {name:"axios_get_productTagList",url:'content/tag/productTagList',method:'post',reType:'get'},
    //黑白名单管理
    {name:"axios_del_blackList",url:'content/whiteAndBlackList/delete',method:'post',reType:'update'},
    {name:"axios_add_blackList",url:'content/whiteAndBlackList/insert',method:'post',headers:jsonType,reType:'update'},
    {name:"axios_edit_blackList",url:'content/whiteAndBlackList/update',method:'post',headers:jsonType,reType:'update'},
    {name:"axios_get_blackList",url:'content/whiteAndBlackList/whiteAndBlackList',method:'post',reType:'get'},
    // 通过节目集Id获取节目列表：// 参数：seriesId
    {name:"axios_get_programListBySeriesId",url:'content/program/getProgramListBySeriesId',method:'post',reType:'update'},
    //游戏管理
    {name:"axios_add_game",url:'content/game/insert',method:'post',headers:jsonType,reType:'update'},
    {name:"axios_edit_game",url:'content/game/update',method:'post',headers:jsonType,reType:'update'},
    {name:"axios_get_gameList",url:'content/game/gameList',method:'post',reType:'get'},
    {name:"axios_get_movieListByProgramId",url:'content/series/getMovieListByProgramId',method:'post',reType:'get'},
    //   修改游戏 是否免费接口0-免费 1-收费
    // /content/game/updateIsFree
    // 参数：gameId，isFree
    {name:"axios_update_gameIsFree",url:'content/game/updateIsFree',method:'post',reType:'update'},
    //游戏上下架
    {name:"axios_update_GameBooleanUp",url:'content/game/updateBooleanUp',method:'post',reType:'update'},
    // 卡通管理
    // content/series/seriesList 参数：typeId
    {name:"axios_get_seriesList",url:'content/series/seriesList',method:'post',reType:'get'},
    {name:"axios_add_seriesList",url:'content/series/insert',method:'post',headers:jsonType,reType:'update'},
    {name:"axios_edit_seriesList",url:'content/series/update',method:'post',headers:jsonType,reType:'update'},
    // 内容送审
    // 新增审核任务
    {name:"axios_add_contentReviewInfo",url:'content/contentReviewInfo/addReviewInfo',method:'post',headers:jsonType,reType:'update'},
    // 获取拥有审核属性的平台
    {name:"axios_get_getContentCheckPlat",url:'content/contentReviewInfo/getCheckPlatform',method:'post',reType:'get'},
    // 修改审核结果
    {name:"axios_edit_getContentReviewResult",url:'/content/contentReviewInfo/getReviewResult',method:'post',headers:jsonType,reType:'get'},
    //   批量节目修改 是否免费接口0-免费 1-收费
    // 参数：seriesId,  videoId, isFree
    {name:"axios_update_seriesIsFree",url:'content/series/updateIsFree',method:'post',reType:'update'},
    //   批量节目上下架
    {name:"axios_update_BooleanUp",url:'content/series/updateBooleanUp',method:'post',reType:'update'},
    //卡通删除
    {name:"axios_del_seriesDel",url:'content/series/delete',method:'post',reType:'update'},
    //节目删除
    {name:"axios_del_programDel",url:'/content/program/delete',method:'post',reType:'update'},
    //节目批量是否可搜索
    {name:"axios_set_batchUpdateSearchFlag",url:'/content/series/batchUpdateSearchFlag',method:'post',reType:'update'},
    //标签管理
    {name:"axios_get_labelContent",url:'content/tag/getContentByTagsId',method:'post',reType:'get'},
    {name:"axios_del_labelContent",url:'content/tag/delete',method:'post',reType:'update'},
    {name:"axios_edit_labelContent",url:'content/tag/update',method:'post',headers:jsonType,reType:'update'},
    {name:"axios_add_labelContent",url:'content/tag/insert',method:'post',headers:jsonType,reType:'update'},
    //获取产品列表
    {name:"axios_get_productList",url:'content/tag/product',method:'post',reType:'get'},
    //分类管理
    {name:"axios_get_tagList",url:'content/tag/tagList',method:'post',reType:'get'},
    {name:"axios_add_typeInfo",url:'content/type/insert',method:'post',headers:jsonType,reType:'update'},
    {name:"axios_edit_typeInfo",url:'content/type/update',method:'post',headers:jsonType,reType:'update'},
    {name:"axios_get_typeInfo",url:'content/type/typeInfo',method:'post',reType:'get'},
    {name:"axios_del_typeInfo",url:'content/type/delete',method:'post',reType:'update'},
    //获取分类树
    {name:"axios_get_classify",url:'content/type/typeTree',method:'post',reType:'get'},
    //CPSP信息列表
    {name:"axios_get_cp",url:'content/cpDetail/cpDetailList',method:'post',reType:'get'},
    //检查用户名唯一
    {name:"axios_check_user",url:'media/sysUser/checkUnique',method:'post',reType:'get'},
    //检查活动名唯一
    {name:"axios_check_activity",url:'activity/checkUnique',method:'post',reType:'get'},
    //检查专题名唯一
    {name:"axios_check_templatename",url:'content/special/checkUnique',method:'post',reType:'get'},
    //检查角色名唯一
    {name:"axios_check_rolename",url:'media/sysRole/checkUnique',method:'post',reType:'get'},
    {name:"axios_edit_template",url:'content/special/update',method:'post',reType:'update'},
    //创建专项链接
    {name:"axios_get_createSpecialUrl",url:'content/special/createSpecialUrl',method:'get',reType:'update'},
    //专题编辑 根据专题ID获取专题
    {name:"axios_get_contentInfo",url:'content/special/getContentInfoList',method:'post',reType:'get'},
    //获取专题，推荐列表
    {name:"axios_get_template",url:'content/special/list',method:'get',reType:'get'},
    //新增专题，推荐列表
    {name:"axios_add_template",url:'content/special/add',method:'post',reType:'update'},
    //获取奖品列表
    {name:"axios_get_prize",url:'prize/prizeList',method:'post',reType:'get'},
    //添加新的奖品
    {name:"axios_add_prize",url:'prize/insert',method:'post',reType:'update'},
    //编辑奖品
    {name:"axios_edit_prize",url:'prize/update',method:'post',reType:'update'},
    //删除奖品
    {name:"axios_del_prize",url:'prize/delete',method:'post',reType:'update'},
    //活动增删改查接口
    {name:"axios_add_active",url:'activity/insert',method:'post',headers:jsonType,reType:'update'},
    {name:"axios_del_active",url:'activity/delete',method:'post',reType:'update'},
    {name:"axios_edit_active",url:'activity/update',method:'post',headers:jsonType,reType:'update'},
    {name:"axios_get_active",url:'activity/activityList',method:'post',reType:'get'},
    {name:"axios_get_active_by_id",url:'activity/selectActivityDetailByActivityId',method:'post',reType:'get'},
    {name:"axios_get_view",url:'content/special/view',method:'get',reType:'get'},
    //上传图片资源
    {name:"axios_add_images",url:'content/image/add',method:'post',reType:'get'},
    //获取图片列表
    {name:"axios_get_pic_resouce",url:'content/image/list?dleteFlag=0',method:'get',reType:'get'},
    //删除图片
    {name:"axios_del_images",url:'content/image/delete',method:'get',reType:'update'},
    //图片修改
    {name:"axios_editFileName_images",url:'content/image/editFileName',method:'get',reType:'update'},
    //用户登录
    {name:"axios_user_logout",url:'auth/userlogout',method:'post',reType:'get'},  
    //查询用户信息
    {name:"axios_get_userInfo",url:'media/sysUser/info',method:'get',reType:'get'},
    //加载导航栏菜单权限
    {name:"axios_load_navbar",url:'media/sysUser/pageIndex',method:'get',reType:'get'},
    //菜单增删改查
    {name:"axios_get_menu",url:'media/sysMenu/menuList',method:'post',reType:'get'},
    {name:"axios_edit_menu",url:'media/sysMenu/update',method:'post',reType:'update'},
    {name:"axios_add_menu",url:'media/sysMenu/insert',method:'post',reType:'update'},
    {name:"axios_del_menu",url:'media/sysMenu/delete',method:'post',reType:'update'},
    //用户增删改查
    {name:"axios_get_user",url:'media/sysUser/userList',method:'post',reType:'get'},
    {name:"axios_add_user",url:'media/sysUser/insert',method:'post',reType:'update'},
    {name:"axios_edit_user",url:'media/sysUser/update',method:'post',reType:'update'},
    {name:"axios_del_user",url:'media/sysUser/delete',method:'post',reType:'update'},
    //角色增删改查
    {name:"axios_get_role",url:'media/sysRole/roleList',method:'post',reType:'get'},
    {name:"axios_add_role",url:'media/sysRole/insert',method:'post',reType:'update'},
    {name:"axios_edit_role",url:'media/sysRole/update',method:'post',reType:'update'},
    {name:"axios_del_role",url:'media/sysRole/delete',method:'post',reType:'update'},
    //主题管理
    //查询主题信息
    {name:"axios_get_themeList",url:'theme/list',method:'post',reType:'get'},
    //添加主题信息
    {name:"axios_add_theme",url:'theme/insert',method:'post',headers:jsonType,reType:'update'},
    //修改主题
    {name:"axios_update_theme",url:'theme/update',method:'post',headers:jsonType,reType:'update'},
    //切换主题
    {name:"axios_update_themeChange",url:'/theme/change',method:'post',reType:'update'},
    //删除主题
    {name:"axios_del_theme",url:'theme/delete',method:'post',reType:'update'},
    //查询主题属性信息
    {name:"axios_get_themeDetail",url:'themeAttr/list',method:'post',reType:'get'},
    //新增主题属性
    {name:"axios_add_themeDetail",url:'themeAttr/insert',method:'post',headers:jsonType,reType:'update'},
    //更新主题属性
    {name:"axios_update_themeDetail",url:'themeAttr/update',method:'post',headers:jsonType,reType:'update'},
    //删除主题属性
    {name:"axios_del_themeDetail",url:'themeAttr/delete',method:'post',reType:'update'},
    //查询属性名称  参数：dictType：SYS_THEME_CONFIG
    {name:"axios_get_selectDictDataByType",url:'system/dictData/selectDictDataByType',method:'post',reType:'get'},
    /**
     * 体验券
     */
    //查询优惠券信息
    {name:"axios_get_saleCard",url:'saleCard/list',method:'post',reType:'get'},
    //预览优惠券信息
    {name:"axios_preview_saleCard",url:'saleCard/preview',method:'post',reType:'get'},
    //生成优惠券接口
    {name:"axios_add_saleCard",url:'saleCard/insert',method:'post',reType:'update'},
    /**
     * cpsp
     */
    //查询
    {name:"axios_get_cpDetail",url:'content/cpDetail/cpDetailList',method:'post',reType:'get'},
    //新增
    {name:"axios_add_cpDetail",url:'content/cpDetail/insert',method:'post',headers:jsonType,reType:'update'},
    //更新
    {name:"axios_update_cpDetail",url:'content/cpDetail/update',method:'post',headers:jsonType,reType:'update'},
    //删除
    {name:"axios_del_cpDetail",url:'content/cpDetail/delete',method:'post',reType:'update'},
    /**
     * 首页
     */
    //参数查看
    {name:"axios_config_detailByKey",url:'index/getConfigDetailByKey',method:'post',reType:'get'},
    //片单数据
    {name:"axios_get_mediaInfo",url:'index/getMediaInfo',method:'post',reType:'get'},
    //设置
    {name:"axios_update_configById",url:'index/updateConfigById',method:'post',headers:jsonType,reType:'update'},
]

export default urlList