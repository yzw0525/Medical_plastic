// doctinfo.js
var WxParse = require('../../Common/wxParse/wxParse.js');
var appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgpath: appInstance.globalData.urlpath + "/images/"
  },
  onLoad: function (options) {
    var that = this
    var request_data = {
      "doctorid": options.doctorid
    }
    appInstance.func.HttpRequest("getDoctorInfos", "POST", request_data, function (resData) {
      var doctor_infos = resData;
      that.setData({
        "doctor_name": doctor_infos.doctorName
      })
      WxParse.wxParse('article', 'html', doctor_infos.content, that, 0);
    })
  }
})