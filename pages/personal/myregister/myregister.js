// pages/Personal/myregister/myregister.js
var appInstance = getApp();
Page({
  data: {
    register_list:{},
    userinfo:{},
    offset:0
  },
  onLoad: function (options) {
    if (appInstance.globalData.UserInfo.openid == undefined) {
      wx.navigateTo({
        url: '/pages/user/authorization/authorization'
      })
    }
  },
  onShow:function(){
    this.setData({
      userinfo: appInstance.globalData.UserInfo
    })
    loadMyRegisterList(this, appInstance)
  },
  onReachBottom: function () {
    loadMyRegisterList(this, appInstance)
  },
  /**
   * 取消 预约
   */
  onCancelMyRegister:function(res){
    var that= this
    var rid = res.currentTarget.dataset.rid
    var openid = this.data.userinfo.openid
    var listindex = res.currentTarget.dataset.listindex
    var request_data={
      "registerid": rid,
      "openid": openid
    }
    appInstance.func.HttpRequest("cancelMyRegister", "POST", request_data, function (resData) {
      if(resData==1){
        that.setData({
          [`register_list[${listindex}].is_to_hospital`] : 2
        })
      }else{

      }
    })
  }
})
function loadMyRegisterList(that, appInstance) {
  var limit = appInstance.globalData.limit
  var offset = that.data.offset
  var request_data = {
    "offset": offset,
    "limit": limit,
    "openid": that.data.userinfo.openid
  }
  appInstance.func.HttpRequest("queryMyRegisterList", "POST", request_data, function (resData) {
    var new_list = resData;
    var list = that.data.register_list;
    if (new_list.length > 0) {
      if (list.length > 0 && offset > 0) {
        list = list.concat(new_list)
      } else {
        list = new_list
      }
      that.setData({
        register_list: list,
        offset: offset + new_list.length,
        is_more: new_list.length < limit ? false : true
      })
    } else {
      that.setData({
        is_more: false,
        register_list: offset == 0 ? {} : list
      })
    }
  })
}