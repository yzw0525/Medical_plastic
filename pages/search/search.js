// pages/search/search.js
var appInstance = getApp();
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    list_data:{},
    history_search_keyword:[],
    searchType:"project",
    selectTypeArr: ['项目', '案例'],
    typeIndex:0,
    offset: 0,
  },
  onLoad: function (options) {
    //获取缓存历史搜索记录
    var history_search_keyword = wx.getStorageSync('historySearchKeyword')
    if (history_search_keyword !=""){
      console.log(typeof history_search_keyword)
      this.setData({
        "history_search_keyword": history_search_keyword,
      })
    }
  },
  //开始搜索
  searchSubmit: function (res, Quick = false){
    var keyword = Quick ? res : res.detail.value
    var searchType = this.data.searchType
    if (keyword == ""){
      wx.showToast({
        title: "输入搜素关键词",
        image: '/icon/icon_tips.svg',
        duration: 2000
      })
      return false
    }
    this.setData({
      "offset": 0,
      "searchType": searchType,
      "keyword": keyword
    })
    //写入历史搜索
    var historySearchKeyword = this.data.history_search_keyword
    if (!appInstance.func.in_array(keyword,historySearchKeyword)){
      
      if (historySearchKeyword==""){
        console.log(typeof historySearchKeyword)
        historySearchKeyword = new Array(keyword);
      }else{
        historySearchKeyword.push(keyword)  
      }
      wx.setStorageSync('historySearchKeyword', historySearchKeyword)
    }
    search(this, appInstance)//
  },
  //下拉加载
  onReachBottom: function () {
    search(this, appInstance)
  },
  //设置搜索关键词
  setSearchKeyword:function(res){
    var keyword = res.currentTarget.dataset.keyword
    this.setData({
      searchKeyword: keyword
    })
    this.searchSubmit(keyword,true)
  },
  //设置搜索类型
  selectType:function(){
    var that=this
    wx.showActionSheet({
      itemList: that.data.selectTypeArr,
      success: function (res) {
        var searchType = that.data.searchType
        that.setData({
          typeIndex: res.tapIndex,
          keyword:'',
          list_data:{},
          offset:0,
          searchType: res.tapIndex == 0 ? "project" : "case"
        })
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  //清空历史记录
  clearHistorySearch:function(){
    var historySearchKeyword = []
    wx.setStorageSync('historySearchKeyword', historySearchKeyword)
  },
  inputFocus:function(){
    var history_search_keyword = wx.getStorageSync('historySearchKeyword')
    this.setData({
      "history_search_keyword": history_search_keyword,
      showSearchKeyword: true
    })
  },
  inputBlur: function () {
    this.setData({
      showSearchKeyword: false
    })
  }
})
function search(that, appInstance){
    var limit = appInstance.globalData.limit
    var offset = that.data.offset
    var request_data = {
      "offset": offset,
      "limit": limit,
      "searchType": that.data.searchType,
      "keyword": that.data.keyword
    }
    appInstance.func.HttpRequest("search", "POST", request_data, function (resData) {
      var new_list_data = resData;
      var list_data = that.data.list_data;
      if (resData.length > 0) {
        if (list_data.length > 0 && offset > 0) {
          that.data.list_data = that.data.list_data.concat(new_list_data)
        } else {
          that.data.list_data = new_list_data
        }
        that.setData({
          list_data: that.data.list_data,
          offset: offset + new_list_data.length,
          is_more: new_list_data.length < limit ? false : true
        })
      } else {
        that.setData({
          is_more: false,
          list_data: offset == 0 ? {} :list_data,
        })
      }
    })
}