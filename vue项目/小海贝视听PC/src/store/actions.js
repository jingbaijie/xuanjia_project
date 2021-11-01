import axios from '@/utils/axios'
import qs from 'qs'

const http = {
  get: function (url, reqParams, config) {
    return new Promise((resolve, reject) => {
      axios.get(url, Object.assign({params: reqParams}, config)).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  post: function (url, reqParams, config) {
    return new Promise((resolve, reject) => {
      axios.post(url, qs.stringify(Object.assign(reqParams, config))).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
}
export default {
  /**
   * 获取页面配置信息
   * GET请求
   * 参数{contentName: 页面英文名,contentId: 页面ID,isRecommend: 是否推荐已下架内容，可不传（true为推荐，false为不推荐）}
   */
  getCommpageInfo ({commit}, reqParams = {}, config = {}) {
    return http.get('web/findCommonPageInfo', reqParams, config)
  },
  /**
   * 获取专题页面配置信息
   * GET请求
   * 参数{contentName: 页面英文名,contentId: 页面ID,isRecommend: 是否推荐已下架内容，可不传（true为推荐，false为不推荐）}
   */
  getRecCommpageInfo ({commit}, reqParams = {}, config = {}) {
    return http.get('web/findRecCommonPageInfo', reqParams, config)
  },
  /**
   * 获取卡通详情
   * GET请求
   * 参数{id: 卡通ID}
   */
  getCartoonDetail ({commit}, reqParams = {}, config = {}) {
    return http.get('web/findCartoonDetailById', reqParams, config)
  },
  /**
   * 获取卡通下的视频子集列表
   * GET请求
   * 参数{cartoonId: 卡通ID,videoId:单个视频ID，当传入这个值时，返回单个视频信息}
   */
  getVideoList ({commit}, reqParams = {}, config = {}) {
    return http.get('web/findVideoListByCartoonId', reqParams, config)
  },
  /**
   * 获取单个视频详情，不返回视频的播放内容，只返回名称及对应卡通ID
   * GET请求
   * 参数{id: 视频ID}
   */
  getVideoDetail ({commit}, reqParams = {}, config = {}) {
    return http.get('web/findVideoDetailByEntity', reqParams, config)
  },
  /**
   * 获取父标签下的全部分类内容
   * GET请求
   * 参数{parentId: 父标签ID}
   */
  getTypesFromParentId ({commit},reqParams = {}, config = {}){
    return http.get('web/findTypesByParentId', reqParams, config)
  },
  /**
   * 根据分类ID获取卡通信息
   * GET请求
   * 参数{typeId: 分类类型ID}
   */
  getContentsByTypeId ({commit}, reqParams = {}, config = {}) {
    return http.get('web/findContentsByTypeId', reqParams, config)
  },
  /**
   * 上传用户收藏内容
   * GET请求
   * 参数{userId: 用户ID,contentType: 收藏类型0：游戏，1：卡通, contentId: 卡通ID/游戏ID}
   */
  setCollectsWithUserId ({commit}, reqParams = {}, config = {}) {
    return http.get('web/saveUserCollect', reqParams, config)
  },
  /**
   * 取消用户收藏内容
   * GET请求
   * 参数{userId: 用户ID,contentType: 收藏类型0：游戏，1：卡通, contentId: 卡通ID/游戏ID，booleanCollect: 必须为0}
   */
  cancelCollectsWithUserId ({commit}, reqParams = {}, config = {}) {
    return http.get('web/deleteUserCollect', reqParams, config)
  },
  /**
   * 获取用户收藏片单
   * GET请求
   * 参数{userId: 用户ID,pageNum: 当前分页,pageSize: 每页的数据数量}
   */
  getCollectsByUserId ({commit}, reqParams = {}, config = {}) {
    return http.get('web/findCollectsByUserId', reqParams, config)
  },
  /**
   * 保存用户观看记录
   * GET请求
   * 参数{userId: 用户名, contentId：游戏或视频Id,contentType: 0-游戏，2-视频,playType: 0-主动，1-被动(小窗口),videoId: 视频Id}
   */
  setUserView ({commit},reqParams = {}, config = {}){
    return http.get('web/view/history/insert', reqParams, config)
  },
  /**
   * 获取用户观看历史
   * GET请求
   * 参数{userId: 用户ID,pageNum: 当前分页,pageSize: 每页的数据数量}
   */
  getViewHistory ({commit}, reqParams = {}, config = {}) {
    return http.get('web/view/history', reqParams, config)
  },
  /**
   * 片单搜索接口
   * GET请求
   * 参数{searchValue: 搜索内容}
   */
  getSearchResult ({commit}, reqParams = {}, config = {}) {
    return http.get('web/search', reqParams, config)
  },
  /**
   * 用户注册或登录
   * GET请求
   * 参数{userId: 用户ID,userName: 用户昵称，非必填,userIcon: 用户头像，非必填,passWord: 密码}
   */
  registOrLogin ({commit}, reqParams = {}, config = {}){
    return http.get('web/user/registerOrLogin', reqParams, config)
  },
  /**
   * 获取用户基本信息
   * GET请求
   * 参数{userId: 用户ID}
   */
  getUserInfo ({commit}, reqParams = {}, config = {}){
    return http.get('web/user/getUserInfo', reqParams, config)
  },
  /**
   * 修改用户昵称
   * GET请求
   * 参数{userId: 用户ID,userName: 用户昵称}
   */
  updateNickName ({commit}, reqParams = {}, config = {}){
    return http.get('web/user/updateName', reqParams, config)
  },
  /**
   * 修改用户头像
   * POST请求
   * 参数{file: 文件路径,uploadFileName: 上传文件名称, userId: 用户ID}
   */
  uploadIcon ({commit}, reqParams = {}, config = {}){
    return http.post('web/user/uploadIcon', reqParams, config)
  }
}
