// 获取闯关数据
function setIsPassed(cityName, isPassed) {
  var isPassedList = CT.getCookie("isPassedList");
  try {
    isPassedList = JSON.parse(isPassedList);
    if (!(isPassedList instanceof Array)) {
      isPassedList = [];
    }
  } catch (e) {
    isPassedList = [];
  }
  var hasCity = false;
  for (var i = 0, len = isPassedList.length; i < len; i++) {
    if (isPassedList[i].cityName === cityName) {
      hasCity = true;
      isPassedList[i].isPassed = isPassed;
    }
  }
  if (!hasCity) {
    isPassedList.push({ cityName: cityName, isPassed: isPassed });
  }
  var reqUserData = JSON.stringify(isPassedList);
  actiObj.setUserDataList(reqUserData, function (res) {
    console.log(res);
    if (res.resultMsg == "success") {
    }
  });
}
