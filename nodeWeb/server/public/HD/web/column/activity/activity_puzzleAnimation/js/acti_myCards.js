// 获取用户信息
xjDataLog.isDebug = false;
xjDataLog.isMsg = false;
function queryUserInfo() {
  actiObj.getUserDataList(function (data) {
    xjDataLog.writeInfo("1");
    xjDataLog.writeInfo(actiUserId+"-----userId");
    xjDataLog.writeInfo(actiActivityId+"-----activityid");
    if (data.errorCode == "1000") {
      xjDataLog.writeInfo("2");
      var userData = {};
      if (data.data&&data.data.userActiData) {
        xjDataLog.writeInfo("2.5"); 
        xjDataLog.writeInfo(data.data.userActiData);
        userData = CT.stringToJson(data.data.userActiData)
        CT.$("mcWord").innerHTML = userData.mcCards.length;
        CT.$("jlWord").innerHTML = userData.jlCards.length;
        CT.$("dreamWord").innerHTML = userData.dreamCards.length;
      } else {
        CT.$("mcWord").innerHTML = 0;
        CT.$("jlWord").innerHTML = 0;
        CT.$("dreamWord").innerHTML = 0;
      }
    } else {
      CT.$("mcWord").innerHTML = 0;
      CT.$("jlWord").innerHTML = 0;
      CT.$("dreamWord").innerHTML = 0;
    }
  });
}
queryUserInfo();
function backFunc() {
  actiObj.actiCommonJumpUrl("./acti_puzzleAnimation.html");
}
