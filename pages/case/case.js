// pages/case/case.js
var appInstance = getApp();
Page({
  data: {
    case_list: {},
    projectType: "all",
    offset: 0,
    is_more: true,
    imgpath: appInstance.globalData.urlpath + "/images/"
  },
  onLoad: function (options) {
    loadCaseList(this, appInstance)
  },
  setprojectType: function (res) {
    var projectType = res.currentTarget.dataset.typeid
    console.log(projectType)
    this.setData({
      projectType: projectType,
      offset: 0
    })
    loadCaseList(this, appInstance)
  },
  onLoadMoreDoctList: function () {
    loadCaseList(this, appInstance)
  },
  onReachBottom: function () {
    loadCaseList(this, appInstance)
  }
})
function loadCaseList(that, appInstance) {
  var limit = appInstance.globalData.limit
  var offset = that.data.offset
  var request_data = {
    "offset": offset,
    "limit": limit,
    "case_type": that.data.projectType
  }
  appInstance.func.HttpRequest("getCaseList", "POST", request_data, function (resData) {
    var new_case_list = resData;
    var case_list = that.data.case_list;
    if (resData.length > 0) {
      if (case_list.length > 0 && offset > 0) {
        that.data.case_list = that.data.case_list.concat(new_case_list)
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
        is_more: false,
        case_list: offset == 0 ? {} : case_list
      })
    }
  })
}