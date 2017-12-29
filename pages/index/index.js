// pages/index/index.js
var appInstance = getApp();
Page({
  data: {
    case_list:{},
    offset: 0,
    imgpath: appInstance.globalData.urlpath + "/images/"
  },
  onLoad: function (options) {
    loadRecommendProjectList(this, appInstance)
    loadCaseList(this, appInstance)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    loadCaseList(this, appInstance)
  },
  onShareAppMessage: function () {
  
  }
})
function loadRecommendProjectList(that, appInstance) {
  var request_data = {
    "offset": 0,
    "limit": 8,
    "projectType": 'recommend'
  }
  appInstance.func.HttpRequest("getProjectList", "POST", request_data, function (resData) {
    that.setData({
      recommendProjectList: resData
    })
  })
}
function loadCaseList(that, appInstance) {
  var limit = appInstance.globalData.limit
  var offset = that.data.offset
  var request_data = {
    "offset": offset,
    "limit": limit,
    "case_type":"all"
  }
  appInstance.func.HttpRequest("getCaseList", "POST", request_data, function (resData) {
    console.log(resData)
    var new_case_list = resData;
    var case_list = that.data.case_list;
    if (resData.length > 0) {
      if (case_list.length > 0) {
        that.data.case_list = new_case_list.concat(that.data.case_list)
      } else {
        that.data.case_list = new_case_list
      }
      that.setData({
        case_list: that.data.case_list,
        offset: offset + new_case_list.length,
        is_more: new_case_list.length < limit ? false : true
      })
    } else {
      that.setData({
        is_more: false
      })
    }
  })
}