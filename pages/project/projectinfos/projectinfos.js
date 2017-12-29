// pages/project/projectinfos/projectinfos.js
var WxParse = require('../../Common/wxParse/wxParse.js');
var appInstance = getApp();
Page({
  data: {

  },
  onLoad: function (options) {
    console.log(options)
    var that = this
    var request_data = {
      "projectid": options.projectid
    }
    appInstance.func.HttpRequest("getProjectInfos", "POST", request_data, function (resData) {
      var project = resData;
      that.setData({
        "title": project.title,
        "projectType": project.typeid,
        "description": project.description,
        "pic_head": project.pic_head,
        "price": project.price,
        "oprice_price": project.oprice_price,
        "clicks": project.clicks,
      })
      WxParse.wxParse('article', 'html', project.content, that, 0);
    })
  }
})