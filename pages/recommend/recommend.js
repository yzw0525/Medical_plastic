// pages/recommend/recommend.js
var appInstance = getApp();
Page({
  data: {
    project_list: {},
    projectType: "recommend",
    offset: 0,
    is_more: true
  },
  onLoad: function (options) {
    loadProjectList(this, appInstance)
  },
  onLoadMoreDoctList: function () {
    loadProjectList(this, appInstance)
  },
  onReachBottom: function () {
    loadProjectList(this, appInstance)
  }
})
function loadProjectList(that, appInstance) {
  var limit = appInstance.globalData.limit
  var offset = that.data.offset
  var request_data = {
    "offset": offset,
    "limit": limit,
    "projectType": that.data.projectType
  }
  appInstance.func.HttpRequest("getProjectList", "POST", request_data, function (resData) {
    var new_project_list = resData;
    var project_list = that.data.project_list;
    if (resData.length > 0) {
      if (project_list.length > 0 && offset > 0) {
        that.data.project_list = new_project_list.concat(that.data.project_list)
      } else {
        that.data.project_list = new_project_list
      }
      that.setData({
        project_list: that.data.project_list,
        offset: offset + new_project_list.length,
        is_more: new_project_list.length < limit ? false : true
      })
    } else {
      that.setData({
        is_more: false,
        project_list: offset == 0 ? {} : project_list
      })
    }
  })
}