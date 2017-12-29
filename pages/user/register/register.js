// pages/user/register/register.js
var appInstance = getApp();
Page({
  data: {
    is_send: false,
    clock: 0
  },
  onLoad: function (options) {
  
  },

  /**
   * 表单提交
   */
  MyfromSubmit: function (res) {
    console.log(res)
    var that = this
    var phone = that.data.phone
    var VerificationCode = that.data.VerificationCode
    var inputverification = res.detail.value.verification
    var formId = res.detail.formId
    if (VerificationCode != inputverification){
      wx.showToast({
        title: '验证码错误',
        image: '/icon/icon_tips.svg',
        duration: 1500
      })
      return false;
    }
    var postData={
      "formId": formId,
      "mobile": phone,
      "openid": appInstance.globalData.UserInfo.openid,
    }
    appInstance.func.HttpRequest("registerMember", "POST", postData, function (resData) {
      appInstance.globalData.UserInfo = resData
      wx.setStorageSync('UserInfo', resData)
      wx.showToast({
        title: '注册成功',
        icon: 'success',
        duration: 1500
      })
      setTimeout(function(){
        wx.navigateBack({
          delta: 1
        })
      },2000)
    })

  },
  setPhone:function(res){
    var phone = res.detail.value
    if (phone!=""){
      this.setData({
        phone: phone
      })
    }
  },
  /**
   * 获取验证码
   */
  getVerificationCode:function(res){
    var that = this
    var mobile = this.data.phone
    console.log(mobile)
    var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (mobile == undefined) {
      wx.showToast({
        title: '请输入手机号码',
        image: '/icon/icon_tips.svg',
        duration: 1500
      })
      return false;
    }
    if (!myreg.test(mobile)) {
      wx.showToast({
        title: '手机号码错误',
        image: '/icon/icon_tips.svg',
        duration: 1500
      })
      return false;
    }
    if (appInstance.globalData.UserInfo.openid == undefined) {
      wx.navigateTo({
        url: '/pages/user/authorization/authorization'
      })
      return false;
    }
    var postData={
      "mobile": mobile,
      "openid": appInstance.globalData.UserInfo.openid,
    }
    that.setData({
      is_send: true
    })
    appInstance.func.HttpRequest("sendSmsVerificationCode", "POST", postData, function (resData) {
      CountDown(that, 60 * 1000, 3)//开始倒计时
      console.log(resData)
      that.setData({
        VerificationCode: resData
      })
    })
  }
})
function CountDown(that, total_micro_second = 1 * 2 * 60 * 1000, strFormat = 1) {
  // var total_micro_second = 1 * 2 * 60 * 1000
  count_down(that, strFormat)
  /* 毫秒级倒计时 */
  function count_down(that, strFormat) {
    // 渲染倒计时时钟
    that.setData({
      clock: date_format(total_micro_second, strFormat)
    });

    if (total_micro_second <= 0) {
      that.setData({
        clock: 0,
        is_send: false
      });
      // timeout则跳出递归
      return;
    }
    setTimeout(function () {
      // 放在最后--
      total_micro_second -= 1000;
      count_down(that, strFormat);
    }, 1000)
  }
  // 时间格式化输出，如03:25:19 86。每10ms都会调用一次
  function date_format(micro_second, strFormat) {
    var resultData = "";
    // 秒数
    var second = Math.floor(micro_second / 1000);
    // 小时位
    var hr = Math.floor(second / 3600);
    // 分钟位
    var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
    // 秒位

    var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;
    switch (strFormat) {
      case 1:
        resultData = hr + ":" + min + ":" + sec
        break;
      case 2:
        resultData = min + ":" + sec
        break;
      case 3:
        var sec = second - hr * 3600 - min * 60 == 0 ? 60 : fill_zero_prefix((second - hr * 3600 - min * 60));
        resultData = sec
        break;
      default:
        resultData = hr + ":" + min + ":" + sec
        break;
    }
    return resultData;
  }
  // 位数不足补零
  function fill_zero_prefix(num) {
    return num < 10 ? "0" + num : num
  }
}