// pages/user/authorization/authorization.js
var appInstance = getApp();
Page({

  onLoad: function () {
    if (appInstance.func.objCount(appInstance.globalData.UserInfo) > 0) {
      wx.navigateBack({
        delta: 1
      })
    }else{
      wx.showLoading({
        title: '正在登陆',
      })
      setTimeout(function () {
        wx.openSetting({//重新唤起授权
          success: function (data) {
            if (data.authSetting["scope.userInfo"] == true) {
              appInstance.onUserLogin()
              wx.navigateBack({
                delta: 1
              })
            }
          },
          fail: function (faildata) {
            console.error(faildata)
          }
        })
      }, 1000)
    }
  },
})