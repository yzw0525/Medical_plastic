// pages/user/interest/interest.js
var WxParse = require('../../Common/wxParse/wxParse.js');
var appInstance = getApp();
Page({
  data: {

  },
  onLoad: function (options) {
    console.log(options)
    var that = this
    var request_data = {
      "aid": options.aid
    }
    appInstance.func.HttpRequest("queryUserInterestInfos", "POST", request_data, function (resData) {
      var activity = resData;
      that.setData({
        "title": activity.title,
        "litpic": activity.litpic,
        "couponid": activity.couponid,
      })
      WxParse.wxParse('article', 'html', activity.article, that, 0);
    })
  },
  receiveCoupon: function (res) {
    console.log(res.currentTarget.dataset.couponid)
    var couponid = res.currentTarget.dataset.couponid
    if (appInstance.globalData.UserInfo.tel == undefined || appInstance.globalData.UserInfo.tel == null) {
      wx.navigateTo({
        url: '/pages/user/register/register'
      })
    } else {
      var postData = {
        "couponid": couponid,
        "openid": appInstance.globalData.UserInfo.openid,
      }
      appInstance.func.HttpRequest("receiveCoupon", "POST", postData, function (resData) {
        if (resData == 1) {
          wx.showToast({
            title: '领取成功',
            icon: 'success',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: resData.errMsg,
            image: '/icon/icon_tips.svg',
            duration: 1500
          })
        }
      })
    }
  }
})