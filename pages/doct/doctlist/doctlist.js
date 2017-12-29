// doctlist.js
var appInstance = getApp();
Page({
  data: {
    doctlist:{},
    projectType:"all",
    offset:0,
    is_more: true,
    imgpath: appInstance.globalData.urlpath+"/images/"
  },
  onLoad: function (options) {
    loadDoctList(this, appInstance)
  },
  setprojectType:function(res){
    var projectType = res.currentTarget.dataset.typeid
    console.log(res)
    this.setData({
      projectType : projectType,
      offset      : 0
    })
    loadDoctList(this, appInstance)
  },
  onMakePhone:function(){
    wx.makePhoneCall({
      phoneNumber: appInstance.globalData.tel
    })
  },
  onLoadMoreDoctList:function(){
    loadDoctList(this, appInstance)
  },
  onReachBottom:function(){
    loadDoctList(this, appInstance)
  }
})
function loadDoctList(that, appInstance){
  var limit = appInstance.globalData.limit
  var offset = that.data.offset
  var request_data={
    "offset": offset,
    "limit" : limit,
    "doctortype": that.data.projectType
  }
  appInstance.func.HttpRequest("getDoctList", "POST", request_data, function (resData) {
    var newdoctlist = resData;
    var doctlist = that.data.doctlist;
    if (resData.length > 0) {
      if (doctlist.length > 0 && offset > 0) {
        that.data.doctlist = that.data.doctlist.concat(newdoctlist)
      } else {
        that.data.doctlist = newdoctlist
      }
      that.setData({
        doctlist: that.data.doctlist,
        offset: offset + newdoctlist.length,
        is_more: newdoctlist.length < limit ? false : true
      })
    } else {
      that.setData({
        is_more: false,
        doctlist: offset == 0 ? {} : doctlist
      })
    }
  })
}