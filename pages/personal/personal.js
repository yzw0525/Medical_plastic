// pages/user/user.js
var appInstance = getApp();
Page({
  
  data: {
    authSetting: false,
    userinfo: appInstance.globalData.UserInfo,
    imgpath: appInstance.globalData.urlpath + "/images/"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (appInstance.globalData.UserInfo.openid == undefined) {
      wx.navigateTo({
        url: '/pages/user/authorization/authorization'
      })
    } else {
      var userinfo = appInstance.globalData.UserInfo
      this.setData({
        userinfo: userinfo
      })
    }
  },
  onMakePhone: function () {
    wx.makePhoneCall({
      phoneNumber: appInstance.globalData.tel
    })
  }
})