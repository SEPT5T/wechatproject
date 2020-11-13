// miniprogram/pages/findloss/findloss.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    serch:"",
    img_data:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
 async _init_(){
   let that=this
   wx.cloud.callFunction({
     name:'getdata',
     success:function(res){
let result=res.result
  let temp=[]
  console.log("res",result)
   for(var i in result.data ){
     for(var j in result.data[i].photo){
       if(result.data[i].photo[j][0].image_way=="寻找失物"){
         if(result.data[i].photo[j][0].judgeget==false){
           temp.push(result.data[i].photo[j][0])
         }
          
       }
     }
   }
   that.setData({
     img_data:temp
   })
   console.log(that.data.img_data)
     }
   })
  
  },
  serch(e){
    console.log("e",e.detail.value)
    this.setData({
      serch:e.detail.value
    })
    var text_lenth=this.data.serch.length;
    var judge=false;
    var get_image=[];
   for(var i in this.data.img_data){
     console.log("img",this.data.img_data[i])
        for(var j in this.data.img_data[i].comments){
          if(j==this.data.img_data[i].comments.length-text_lenth+1){
            break;
          }
          else{
            var temp="";
            for(var k in this.data.serch){
              console.log("k",parseInt(j)+parseInt(k) )
             temp=temp+this.data.img_data[i].comments[parseInt(j)+parseInt(k)]
            }
            console.log("temp:",temp)
            if(temp==this.data.serch){
              get_image.push(this.data.img_data[i])
              judge=true;
              break;
            }
          }
        }
        if(judge){
          judge=false;
          break;
        }
   }
   if(get_image.length==0){
    wx.showToast({
      title: '无结果',
      icon: 'error',
      duration: 2000
     })
   }
   else{
     this.setData({
       img_data:get_image
     })
   }
   console.log(this.data.img_data)
   console.log(text_lenth);
  },
  showInput: function () {
    this.setData({
      inputShowed: true   //设置文本框可以输入内容
    });
  },
  // 取消搜索
  hideInput: function () {
    this.setData({
      inputShowed: false
    });
  },
  todetail(e) {        
    app.globalData.currentPhoto = this.data.img_data[e.currentTarget.dataset.index].fileID;
    console.log("img:",app.globalData.currentPhoto)
    app.globalData.choseID = this.data.img_data[e.currentTarget.dataset.index].img_id;
    console.log("app.globalData.currentPhoto",app.globalData.currentPhoto)
    wx.navigateTo({
        url: '/pages/detail/detail',
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
    this._init_();
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