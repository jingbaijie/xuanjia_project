/*
 * @LastEditors: jwzx
 * @LastEditTime: 2020-07-24 14:43:16
 */ 
class PageVo {
    constructor(options){
        //用户Id
        this.userId = options.userId;
        //页面地址栏请求地址
        this.baseUrl = options.baseUrl;
        //页面模版地址
        this.basePageURL = options.basePageURL;
        //页面Id
        this.contentId = options.contentId;
        //页面名称
        this.contentName = options.contentName;
        //内容分类父级Id
        this.parentId = options.parentId;
        //内容分配二级分类Id
        this.typeId = options.typeId;
        //卡通Id
        this.cartoonId = options.cartoonId;
        //卡通子集Id
        this.videoId = options.videoId;
        //游戏Id
        this.gameId = options.gameId;
        //页面类型
        this.action = options.action;
        
    }

    set userId (userId){
        this._userId = userId;
    }
    get userId(){
        return this._userId;
    }
    set baseUrl (baseUrl){
        this._baseUrl = this.baseUrl;
    }
    get baseUrl (){
        return this._baseUrl;
    }
    set basePageURL (basePageURL){
        this._basePageURL = basePageURL;
    }
    get basePageURL (){
        return this._basePageURL;
    }
    set contentId (contentId){
        this._contentId = contentId;
    }
    get contentId(){
        return this._contentId
    }
    set contentName(contentName){
        this._contentName = contentName;
    }
    get contentName(){
        return this._contentName;
    }
    set parentId(parentId){
        this._parentId = parentId;
    }
    get parentId(){
        return this._parentId;
    }
    set typeId(typeId){
        this._typeId = typeId;
    }
    get typeId(){
        return this._typeId;
    }
    set cartoonId(cartoonId){
       this._cartoonId = cartoonId;
    } 
    get cartoonId(){
        return this._cartoonId;
    }
    set videoId(videoId){
        this._videoId = videoId;
    }
    get videoId(){
        return this._videoId;
    }
    set gameId(gameId){
        this._gameId = gameId;
    }
    get gameId(){
        return this._gameId;
    }
    set action(action){
        this._action = action;
    }
    get action(){
        return this._action;
    }

}

module.exports = exports = PageVo;