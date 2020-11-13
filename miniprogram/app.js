App({
  onLaunch() {
    wx.cloud.init({
      traceUser: true,
    })
    wx.getSetting({
      success (res){
       console.log(res)
      }})
  },
  globalData: {
    id: '',
    currentPhoto: {},
    choseID:'',
    img_group:{},
    userinfo:null
  }
})