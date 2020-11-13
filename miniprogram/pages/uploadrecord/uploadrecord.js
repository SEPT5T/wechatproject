// miniprogram/pages/uploadrecord/uploadrecord.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photo: [],
    photo_text:[]
  },
  todetail(e) {        
    app.globalData.currentPhoto = this.data.photo[e.currentTarget.dataset.index].fileID;
    console.log(this.data.photo)
    app.globalData.choseID = this.data.photo[e.currentTarget.dataset.index].img_id;
    console.log("app.globalData.currentPhoto",app.globalData.currentPhoto)
    wx.navigateTo({
        url: '/pages/detail/detail',
    })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({

      title: "上传记录"
   
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
   this.init()
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

  },
  async init() {
    //1. 从用户集合中取出当前用户信息
    this.setData({
        photo:[],
    })
    let result = await db.collection('user').get();
    console.log('result:', result)
    if (result.data.length == 0) {
        // 当前用户第一次登录，集合中无用户信息，插入当前用户信息记录，并在全局存储docId
        app.globalData.id = (await db.collection('user').add({
            data: {
                photo: []
            }
        }))._id;
    } else {
        // 能取到当前用户信息，直接取出用户的照片数据进行渲染
        app.globalData.id = result.data[0]._id;
        console.log(result.data[0].photo[0])
         var temp=result.data[0];
        console.log("temp",temp[0])
        for(var i in result.data[0].photo)
        {
            this.data.photo.push(result.data[0].photo[i][0])
        }
        /*this.data.photo.push(result.data[0].photo1[0][0])
        this.data.photo.push(result.data[0].photo1[1][0])*/
        this.setData({
            photo:this.data.photo
        })
    }
    console.log(this.data.photo)
    wx.hideLoading();
},
})