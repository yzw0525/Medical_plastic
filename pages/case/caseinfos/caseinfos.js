// pages/case/caseinfos/caseinfos.js
var WxParse = require('../../Common/wxParse/wxParse.js');
var appInstance = getApp();
Page({
  data: {
    imgpath: appInstance.globalData.urlpath + "/images/"
  },
  onLoad: function (options) {
    console.log(options)
    var that=this
    var request_data ={
      "caseid" : options.caseid
    }
    appInstance.func.HttpRequest("getCaseInfos", "POST", request_data, function (resData) {
      var case_infos = resData;
      that.setData({
        "projectType": case_infos.case_type,
        "case_title": case_infos.case_title
      })
      WxParse.wxParse('article', 'html', case_infos.content, that, 0);
    })
  }
})