// pages/Personal/coupon/coupon.js
var WxParse = require('../../Common/wxParse/wxParse.js');
var appInstance = getApp();
Page({

  data: {
    "coupon_list":{},
    "state_type": "not",//not already overdue
    "offset":0
  },
  onLoad: function (options) {
    if (appInstance.globalData.UserInfo.openid == undefined) {
      wx.navigateTo({
        url: '/pages/user/authorization/authorization'
      })
    }
  },
  setStateType:function(res){
    console.log(res)
    var state_type = res.currentTarget.dataset.state_type
    this.setData({
      "state_type": state_type,
      "coupon_list": {},
      "offset" :0
    })
    loadCouponList(this, appInstance)
  },
  onShow: function () {
    this.setData({
      userinfo: appInstance.globalData.UserInfo
    })
    loadCouponList(this, appInstance)
  },
  onReachBottom: function () {
    loadMyMsgList(this, appInstance)
  },
  onFoldMenu:function(res){
    console.log(res)
    var foldindex = res.currentTarget.dataset.foldindex
    var foldcontent = this.data.coupon_list[foldindex].content
    var this_foldindex = this.data.foldindex
    var animation_height=0
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: "ease-in-out",
      delay: 0,
    });
    this.animation = animation
    console.log(foldindex)
    console.log(this_foldindex)
    if (foldindex === this_foldindex){
      foldindex=''
      foldcontent=''
      animation_height=0
    }else{
      animation_height = '100%'
    }
    console.log(animation_height)
    animation.height(animation_height).step()
    if (foldcontent !== "") {
      WxParse.wxParse('foldcontent', 'html', foldcontent, this, 0);
    }
    this.setData({
      "foldindex": foldindex,
      "animationFold": animation.export()
    })
    
  }
})
function loadCouponList(that, appInstance) {
  var limit = appInstance.globalData.limit
  var offset = that.data.offset
  var request_data = {
    "offset": offset,
    "limit": limit,
    "state_type": that.data.state_type,
    "openid": that.data.userinfo.openid
  }
  appInstance.func.HttpRequest("queryCouponList", "POST", request_data, function (resData) {
    var new_list = resData;
    var list = that.data.coupon_list;
    if (new_list.length > 0) {
      if (list.length > 0 && offset > 0) {
        list = list.concat(new_list)
      } else {
        list = new_list
      }
      that.setData({
        coupon_list: list,
        offset: offset + new_list.length,
        is_more: new_list.length < limit ? false : true
      })
    } else {
      that.setData({
        is_more: false,
        coupon_list: offset == 0 ? {} : list
      })
    }
  })
}