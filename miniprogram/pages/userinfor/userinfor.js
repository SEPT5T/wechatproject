// miniprogram/pages/userinfor/userinfor.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userimg:"",
    username:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    wx.getSetting({

            success: function(res) {
      
              if (res.authSetting['scope.userInfo']) {
        var url=''
        wx.getUserInfo({
          success:function(res){
            console.log(res);
            var avatarUrl = res.userInfo.avatarUrl;
            console.log(avatarUrl)
            that.setData({
              userimg:res.userInfo.avatarUrl,
              username:res.userInfo.nickName
            })
            console.log("userimg",that.data.userimg)
          }
        })
      
              } else {
      
                //用户没有授权
      
                wx.navigateTo({
        url: '/pages/firstlogin/firstlogin',
      })
      
              }
      
            }
      
          });
      
      
  
    
  },
  touploadrecord(){
    wx.navigateTo({
      url: '/pages/uploadrecord/uploadrecord'
    })
  },
  tocollectionrecord(){
    wx.navigateTo({
      url: '/pages/collectionrecord/collectionrecord'
    })
  },
  toreturnrecord(){
    wx.navigateTo({
      url: '/pages/returnrecord/returnrecord'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad()
    /*this.setData({
      userimg:
    })*/
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})