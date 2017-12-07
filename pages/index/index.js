//index.js
//获取应用实例
var app = getApp()
// function getUserInfo(){
//   //获取用户信息,显示到页面上
//   app.getUserInfo(function (userInfo) {
//     // 将用户信息存放到userinfo对象中,
//     // wx.setStorageSync("userInfo", userInfo);
//     // console.log(userInfo)
//     // var appid = app.globalData.appid;
//     // var secret = app.globalData.secret;
//     // var code = app.globalData.code;
//     // app.func.getOpenId(appid, secret, code, function (res) {
//     //   console.log(res.data)
//     //   wx.setStorageSync("openid", res.data.openid);
//     //   var user = {
//     //     "open_id": res.data.openid,
//     //     "nick_name": userInfo.nickName,
//     //     "avatar": userInfo.avatarUrl
//     //   }
//     //   app.func.post('User/login', user, function (res) {
//     //     console.log(res.result.token);
//     //     wx.setStorageSync("token", res.result.token);
//     //     wx.setStorageSync("session_id", res.result.session_id);
//     //   })
//     // });
//   })
// }

/**
 * 取得商品列表
 */
function getData(that,index){
  var shopList = that.data.shopList;
  var loadingFlag = that.data.loadingFlag;
  if (shopList[index].length == 0){
    that.setData({
      loadingFlag: true
    })
    var data = {
      type: index
    }
    app.func.post('Shop/goods_list', data, function (res) {
      if (res.isError) {
        shopList[index] = res.result;
      }
      that.setData({
        shopList,
        loadingFlag: false
      })
    })
  }
}

/**
 * 取得商品数量
 */
function getNums(that) {
  var nums;
  var data = {
    type: 0
  }
  app.func.post('Shop/goods_count', data, function (res) {
    if (res.isError) {
      nums = res.result;
    }

    that.setData({
      nums
    })
  })
}

Page({
  data: {
    tabList: ['全部', '上新', '热销'],
    shopList:[[],[],[]],
    tabIndex: 0,
    loadingFlag:false,
    base_url: app.globalData.base_url
  },
  onLoad: function () {
    wx.authorize({
      scope: 'scope.userInfo',
      success: function (res) {
        console.log("认证")
        app.getUserInfo();
      }
    })
    wx.checkSession({
      fail: function() {
        console.log("失效了")
        app.getUserInfo();
      }
    })

    // 取得各类型商品数量
    getNums(this);

    // 初始化时，加载商品列表
    getData(this, this.data.tabIndex);
  },
  tab: function (event) {
    var that = this;
    var index = event.currentTarget.dataset.index;
    that.setData({
      tabIndex: index
    })
    getData(that,index);
  }
})
