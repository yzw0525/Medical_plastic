// online.js
var appInstance = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    postData:{},
    doctlist: {},
    today: formatTime(),
    datetimes:'-',
    doctindex:0,
    projectTypeIndex:0,
    projectType:'all',
    offset: 0,
    imgpath: appInstance.globalData.urlpath + "/images/"
  },
  onLoad: function (options) {
    if (options.projectType) {
      this.setData({
        projectType: options.projectType
      })
    }
    loadProjectType(this, appInstance)
  },
  MyfromSubmit: function (evt) {//表单提交
    var that = this
    var postData = evt.detail.value;
    var formId = evt.detail.formId;
    postData.formId = formId
    
    if (appInstance.globalData.UserInfo.openid == undefined){
      wx.navigateTo({
        url: '/pages/user/authorization/authorization'
      })
    }else{
      postData.openid = appInstance.globalData.UserInfo.openid
      insertRegister(postData, that, appInstance)
    }
  },
  bindDateChange: function (e) {//日期选择器
    this.setData({
      datetimes: e.detail.value
    })
  },
  bindDoctorChange: function (e) {//医生选择
    this.setData({
      doctindex: e.detail.value
    })
  },
  bindProjectTypeChange: function(e) {//预约项目选择
    var projectTypeList = this.data.projectTypeList
    var projectTypeIndex = e.detail.value
    this.setData({
      projectTypeIndex: projectTypeIndex,
      projectType: projectTypeList[projectTypeIndex].id
    })
    loadDoctList(this, appInstance)
  },
})
function loadProjectType(that, appInstance) {
  
  var projectType = that.data.projectType
  var projectTypeIndex=0
  appInstance.func.HttpRequest("getProjectType", "POST", {}, function (resData) {
    projectType = resData[0].id
    for (var i = 0; i<resData.length;i++){
      if (resData[i].id == projectType){
        projectTypeIndex=i
      }
    }
    that.setData({
      projectTypeIndex: projectTypeIndex,
      projectType: projectType,
      projectTypeList: resData
    })
    loadDoctList(that, appInstance, projectType)
  })
}
function loadDoctList(that, appInstance, projectType=null) {
  var doctortype = projectType == null ? that.data.projectType : projectType
  var request_data = {
    "offset": 0,
    "limit": 'all',
    "doctortype": doctortype
  }
  appInstance.func.HttpRequest("getDoctList", "POST", request_data, function (resData) {
    that.setData({
      doctlist: resData,
    })
  })
}
function insertRegister(request_data, that, appInstance){
  appInstance.func.HttpRequest("insertRegister", "POST", request_data, function (resData) {
    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 2000
    })
    that.setData({
      postData:{},
      projectTypeIndex:0
    })
    setTimeout(function(){
      wx.switchTab({
        url: '/pages/index/index'
      })
    },2000)
  })
}
function formatTime(date = new Date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return year + "-" + month + "-" + day;
}