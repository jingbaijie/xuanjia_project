/*
 * @Description: 
 * @Author: jwzx
 * @Date: 2020-08-14 15:59:56
 * @LastEditTime: 2020-08-14 16:28:10
 * @LastEditors: jwzx
 */
function getDate(str) {
    var oDate = "";
    if (str == null || str == "") {
        oDate = new Date();
    } else {
        oDate = new Date(str);
    }
    var oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth() + 1,
        oDay = oDate.getDate(),
        oHour = oDate.getHours(),
        oMin = oDate.getMinutes(),
        oSen = oDate.getSeconds(),
        oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSen);//最后拼接时间
    return oTime;
};
function getzf(num) {
    if (parseInt(num) < 10) {
        num = '0' + num;
    }
    return num;
}


module.exports = {
    getDate
}