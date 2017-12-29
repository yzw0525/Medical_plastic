// pages/user/rights/rights.js
var appInstance = getApp();
Page({
  data: {
    activity_list:{},
    offset: 0,
    imgpath: appInstance.globalData.urlpath + "/images/"
  },
  onLoad: function (options) {
    loadActivityList(this, appInstance)
  },
  onReachBottom: function () {
    loadActivityList(this, appInstance)
  }
})
function loadActivityList(that, appInstance) {
  var limit = appInstance.globalData.limit
  var offset = that.data.offset
  var request_data = {
    "offset": offset,
    "limit": limit
  }
  appInstance.func.HttpRequest("queryActivityList", "POST", request_data, function (resData) {
    var new_list = resData;
    var list = that.data.activity_list;
    if (new_list.length > 0) {
      if (list.length > 0 && offset > 0) {
        list = list.concat(new_list)
      } else {
        list = new_list
      }
      that.setData({
        activity_list: list,
        offset: offset + new_list.length,
        is_more: new_list.length < limit ? false : true
      })
    } else {
      that.setData({
        is_more: false,
        activity_list: offset == 0 ? {} : list
      })
    }
  })
}