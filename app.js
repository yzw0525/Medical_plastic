//app.js
var Common = require('./pages/Common/CommonPublic.js');
var RSA = require('./pages/Common/wxapp_rsa.js')
App({
  onLaunch:function(cb){
    var that=this
    //登录态
    wx.checkSession({
      success: function (res) {
        var UserInfo = wx.getStorageSync('UserInfo')
        if (UserInfo) {
          that.globalData.UserInfo = UserInfo
        } else {
          that.onUserLogin();
        }
      },
      fail: function () {
        that.onUserLogin()
      }
    })
  },
  onUserLogin:function(){
    var that = this
    //调用登录接口
    wx.login({
      success: function (coderes) {
        wx.getUserInfo({
          withCredentials: true,
          lang: "zh_CN",
          success: function (res) {
            var request_data = {
              "code": coderes.code,
              "userinfo": res.userInfo
            };
            that.func.HttpRequest("getUserInfo", "POST", request_data, function (res) {
              console.log(res)
              that.globalData.UserInfo = res
              wx.setStorageSync('UserInfo', res)
            })
          },
          fail: function (faildata) {
            console.log(faildata)
          }
        })
      },
      fail: function (faildata) {
        console.log(faildata)
      }
    })
  },
  globalData:{
    urlpath: "http://xxx.xxx.com",
    VERIFICATION:"xxxxxxxxxxxxxxxx",
    limit:5,
    UserInfo:{},
    tel: 'xxxxxxxx',
  },
  formatTime: function (date){
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()

    return year + "-" + month + "-" + day;
  },
  func: {
    objSort: Common.objSort,//对象排序
    objCount: Common.objCount,//计算num
    addition: Common.addition,//加
    subtraction: Common.subtraction,//减
    multiply: Common.multiply,//乘
    division: Common.division,//除
    randomString: Common.randomString,//随机字符串
    in_array: Common.in_array,//搜索数组内元素是否存在
    HttpRequest: Common.HttpRequest,
  }
})
