const app= getApp()
const db = wx.cloud.database()
const _ = db.command;
var that = null;
Page({
  data:{
    img:[],
    imgtext:'',
    img_way:" ",
    locotion:'',
    up_id:'',
    img_data:[]
  },
  onLoad(){
    that = this;
    this._init_();
  },
  getcomments: function(e){
    that.setData({
      comments:e.detail.value
    });
  },
  async _init_(){
    var temp=[];
    let that=this
    wx.cloud.callFunction({
      name:'getdata',
      success:function(res){ 
    let result = res.result
    var chosephoto;
    for(var i in result.data){
      console.log(i)
      if(result.data[i]._id==app.globalData.choseID){
        console.log(result.data[i])
        result=result.data[i]
        break;
      }
    }
    console.log("res",result.photo)
    for(var i in result.photo){
      console.log("i",i)
      if(result.photo[i][0].fileID==app.globalData.currentPhoto){
        chosephoto=i;
        for(var j in result.photo[i] ){
          temp.push(result.photo[i][j].fileID)
        } 
      }
    }
    console.log(result.photo[chosephoto][0])
    var img_text=result.photo[chosephoto][0].comments
    var imgway=result.photo[chosephoto][0].image_way
    var upid=result.photo[chosephoto][0].img_id
    var imgdata=[];
    imgdata.push(result.photo[chosephoto])
    console.log(imgway)
   that.setData({
      img:temp,
      imgtext:img_text,
      img_way:imgway,
      locotion:chosephoto,
      up_id: upid,
      img_data:imgdata
    })
    console.log("imgdata",that.data.img)
  }
})
    
  },
  getcomments: function(e){
    that.setData({
      comments:e.detail.value
    });
  },
  // 预览图片大图
  previewImage: function(e) {
    console.log("res",this.data.img[e.currentTarget.dataset.index])
    wx.previewImage({
      current:this.data.img[e.currentTarget.dataset.index],
        urls: this.data.img
    })
  },
  // 保存评论数据至数据库
  saveComment: function(){
    //TODO 照片评论功能
    db.collection('user').doc(app.globalData.id).update({
      data:{
        photo:_.pull({
            fileID:that.data.fileID
        })
      }
    }).then(result=>{
      db.collection('user').doc(app.globalData.id).update({
        data:{
          photo:_.push({
              fileID:that.data.fileID,
              comments:that.data.comments
          })
        }
      }).then(res=>{
        console.log(result);
        wx.showToast({
          title: '保存成功'
        });
      })
    })
  },
  async Confirmcollection(){
    let that=this;
   wx.showModal({
    title: '提示',
    content: '是否确认领取',
     cancelColor: 'cancelColor',
     success(res){
      if(app.globalData.id==''){
        wx.showToast({
          title: '请先登录',
        })
      }
      else{
      if(res.confirm){
        console.log(that.data.locotion)
        db.collection('user').where({
          _id:app.globalData.choseID
        }).update({
          data:{
           ['photo.'+that.data.locotion+'.0.judgeget']:true,
           ['photo.'+that.data.locotion+'.0.get_id']:app.globalData.id
          } ,
          success:function(res){
            console.log(res)
          }
      })
      db.collection('user').doc(app.globalData.id).update({
       data: {
         photoget: _.push(that.data.img_data)
       }
     })
     }}
     }
   })
  },
  async Confirmreturn(){
    let that=this;
   wx.showModal({
    title: '提示',
    content: '是否确认归还',
     cancelColor: 'cancelColor',
     success(res){
       if(app.globalData.id==''){
         wx.showToast({
           title: '请先登录',
         })
       
       }
       else{

       
       if(res.confirm){
         console.log(that.data.locotion)
         db.collection('user').where({
           _id:app.globalData.choseID
         }).update({
           data:{
            ['photo.'+that.data.locotion+'.0.judgeget']:true,
            ['photo.'+that.data.locotion+'.0.get_id']:app.globalData.id
           } ,
           success:function(res){
             console.log(res)
           }
       })
       db.collection('user').doc(app.globalData.id).update({
        data: {
          photoreturn: _.push(that.data.img_data)
        }
      })
      }}
     }
   })
  }
})