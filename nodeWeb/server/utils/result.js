/*
 * @Description: 
 * @Author: jwzx
 * @Date: 2020-08-05 18:21:30
 * @LastEditTime: 2020-08-15 09:37:10
 * @LastEditors: jwzx
 *     SUCCESS(1, "1000", "操作成功"),
    ERROR(0, "1001", "服务器异常"),
    INVALID_PARAM(0, "1002", "参数不合法"),
    INVALID_METHOD(0, "1003", "请求方法不允许"),
    INVALID_USER(0, "1004", "账号或者密码不对"),
    RESULT_ERROR(0, "1005", "操作失败"),
    USER_UNSIGN(0, "1006", "用户未签到"),
    ORDER_FAIL(0, "2001", "订购失败"),
    AUTH_FAIL(0, "2002", "鉴权失败"),
    AUTH_SUCCESS(0, "2003", "鉴权成功"),
    NO_RESULT(0, "1007", "结果集为空"),
    USER_NOT_EXISTED(0, "1009", "用户信息不存在"),
    USER_EXISTED(0, "1008", "用户信息已存在"),
    BLACK_LIST_USER(0,"1010", "黑名单用户"),
    WHITE_LIST_USER(0,"1011", "白名单用户");
 * 
 */
class Result {
    
    /**
     * 
     * @param {number} successFlg {请求结果状态}
     * @param {string} errorCode {错误码}
     * @param {string} errorMsg {错误信息}
     */
    constructor(successFlg,errorCode,errorMsg){
        this.successFlg = successFlg;
        this.errorCode = errorCode;
        this.errorMsg = errorMsg;
    }
    setData(data){
        this.data = data;
    }
    
}

class ShowData {
    constructor(){
        
        
    }
    /**
     * 操作成功
     * @param {*} data 
     */
    SUCCESS(data){
        return this.initData(0,"1000","操作成功",data);
    }
    /**
     * 服务异常
     * @param {*} data 
     */
    ERROR(data){
        return this.initData(1,"1001", data || "服务器异常");
    }
    /**
     * 参数不合法
     * @param {*} data 
     */
    INVALID_PARAM(data){
        return this.initData(1,"1002", "参数不合法",data);
    }
      /**
     * 请求超时
     * @param {*} data 
     */
    TIME_OUT(data){
        return this.initData(1,"1003", "请求超时",data);
    }
    /**
     * 操作失败
     * @param {*} data 
     */
    RESULT_FAIL(data){
        return this.initData(0, "1005", data || "操作失败")
    }
    
    /**
     * 初始数据
     * @param {number} successFlg 请求结果状态 
     * @param {string} errorCode  错误码
     * @param {string} errorMsg 错误信息 
     * @param {any} data 结果数据 
     */
    initData(successFlg,errorCode,errorMsg,data){
        let initData = new Result(successFlg,errorCode,errorMsg);
        if(initData){
            initData.setData(data)
        }
        return initData;
    }
}



module.exports = ShowData;







