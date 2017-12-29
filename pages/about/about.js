// pages/about/about.js
var appInstance = getApp();
Page({
  data: {
    environment_index:0,
    imgpath: appInstance.globalData.urlpath + "/images/"
  },
  onLoad: function (options) {
   
  },
  setEnvironmentIndex:function(res){
    var environment_index = res.currentTarget.dataset.environment_index
    this.setData({
      environment_index: environment_index
    })
  },
  changeEnvironment:function(e){
    console.log(e)
    this.setData({
      environment_index: e.detail.current
    })
  }
})