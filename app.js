var js = require('/common/js/index');
//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(){
    var that = this
      //调用登录接口
    wx.login({
      success: function (res) {
        //获取登录code,然后换取openid跟session_key
        if (res.code){
          var code = res.code
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              var data = {
                js_code: code,
                nick_name: res.userInfo.nickName,
                avatar: res.userInfo.avatarUrl
              }
              that.func.post('User/login', data, function (res) {
                if (res.isError) {
                  wx.setStorageSync("token", res.result.token);
                  wx.setStorageSync("session_id", res.result.session_id);
                }
              })
            }
          })
        }
      }
    })
  },
  globalData:{
    userInfo:null,
    // appid: "wx4274f3ea5516d94c",
    // secret: "e573bfd063761434312f473def762ecd",
    base_url:"http://101.201.102.193/ds/"
  },
  func:{
    post:js.post,
    get: js.get,
    getOpenId: js.getOpenId,
    getData: js.getData,
    chooseImg: js.chooseImg,
    upFile: js.upFile,
    showModal: js.showModal,
    showAlert: js.showAlert,
    showToast: js.showToast
  }
})