// pages/personal/mymsg/mymsg.js
var appInstance = getApp();
Page({

  data: {
    msg_list: {},
    userinfo: {},
    offset: 0,
    imgpath: appInstance.globalData.urlpath + "/images/"
  },
  onLoad: function (options) {
    if (appInstance.globalData.UserInfo.openid == undefined) {
      wx.navigateTo({
        url: '/pages/user/authorization/authorization'
      })
    }
  },
  onShow: function () {
    this.setData({
      userinfo: appInstance.globalData.UserInfo
    })
    loadMyMsgList(this, appInstance)
  },
  onReachBottom: function () {
    loadMyMsgList(this, appInstance)
  }
})
function loadMyMsgList(that, appInstance) {
  var limit = appInstance.globalData.limit
  var offset = that.data.offset
  var request_data = {
    "offset": offset,
    "limit": limit,
    "openid": that.data.userinfo.openid
  }
  appInstance.func.HttpRequest("queryMyInformationList", "POST", request_data, function (resData) {
    var new_list = resData;
    var list = that.data.msg_list;
    if (new_list.length > 0) {
      if (list.length > 0 && offset > 0) {
        list = list.concat(new_list)
      } else {
        list = new_list
      }
      that.setData({
        msg_list: list,
        offset: offset + new_list.length,
        is_more: new_list.length < limit ? false : true
      })
    } else {
      that.setData({
        is_more: false,
        msg_list: offset == 0 ? {} : list
      })
    }
  })
}