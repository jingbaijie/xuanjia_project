export default {
  add_cached_view: (state, view) => {

    if (state.cachedViews.includes(view)) return
      state.cachedViews.push(view)
  },
  del_cache_view: (state, view) => {
    for (const i of state.cachedViews) {
      if (i === view) {
        const index = state.cachedViews.indexOf(i)
        state.cachedViews.splice(index, 1)
        break
      }
    }
  },
  recomTypeList_setter (state, value) {
    state.typeIds2.push(value)
  
  },
  recommendList_setter (state, value) {
    state.recommendList.push(value)
    
  },
  recommendList_update (state, value) {
    state.recommendList.splice(value.index,1);
    state.recommendList.push(value)
  },
  recommendList_clear(state) {
    state.recommendList=[]
  },
  loginInfo_setter (state, value) {
    state.loginInfo = value
  },
  userInfo_setter (state, value) {
    state.userInfo = value
    localStorage.setItem('nickname', value.nickname || '')
  },
  userInfo_phone_number_setter (state, value) {
    state.userInfo.phone_number = value
  },
  userInfo_mobile_setter (state, value) {
    state.userInfo.mobile = value
  },
  userInfo_app_two_factor_setter (state, value) {
    state.userInfo.app_two_factor = value
  },
  userInfo_notice_setter (state, value) {
    state.userInfo.notice = value
  },
  tradePriceData_setter (state, jsonData) {
    state.tradePriceData[jsonData.key] = jsonData.value
  },
  ads_setter (state, jsonData) {
    state.ads[jsonData.key] = jsonData.value
  },
  orders_setter (state, value) {
    state.orders = value
  },
  myAds_setter (state, value) {
    state.myAds = value
  },
  deposit_setter (state, value) {
    state.deposit = value
  },
  withdraw_setter (state, value) {
    state.withdraw = value
  },
  bankList_setter (state, value) {
    state.bankList = value
  },
  countryList_setter (state, value) {
    state.countryList = value
  },
  collectionList_setter (state, value) {
    state.collectionList = value
  },
  homeCarouselList_setter (state, value) {
    state.homeCarouselList = value
  },
  inviteBannerList_setter (state, value) {
    state.inviteBannerList = value
  },
  code_setter (state, value) {
    state.code = value
  },
  axiosCancel_setter (state, item) {
    for (let key in item) {
      Vue.set(state.axiosCancel, key, item[key])
    }
  },
  saveToken (state, value) {
    localStorage.setItem('userToken', value)
    state.userToken = value
  },
  delToken (state) {
    localStorage.removeItem('userToken')
    localStorage.removeItem('nickname')
    state.userToken = null
  },
  device_setter (state, value) {
    state.device = value
  },
  isFirstLogin_setter (state, value) {
    state.isFirstLogin = value
    localStorage.setItem('isFirstLogin', value)
  }
}
