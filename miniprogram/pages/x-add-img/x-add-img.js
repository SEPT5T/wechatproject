/**
 * 须知：添加图片有几种添加方式
 * 1.添加的同时上传，这样最后提交表单的时候便捷，但是会浪费一些多余的流量和服务器资源
 * 2.添加只保存本地url，最后提交表单的时候上传，这样最后提交的时候，会有用户的等待时间
 * 本组件采用的第二种方式
 * 第一种，以后再兼容
 */

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    num:{ // 上传图片的数量，默认是四张
      type: Number,
      value: 4
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imageList: [],
    image_text:[],
    image_way:[],
    image_label:[],
    idx:0,
    viewnumber:[0,0],
    checked_id:[false,false],
    checked_name:["寻找失物","寻找失主"],
    label_text:["电子产品","手机"]
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    addImg(e){
      let that = this;
      console.log("e:",e.detail)
      that.setData({
        imageList:that.data.imageList.concat(e.detail)
      })
      that.triggerEvent('getImageList', that.data.imageList);
    },
    deleteImg(e){
      let that = this;
      that.setData({
        imageList: that.data.imageList.filter(item=> {
          return item!=e.detail;
        })
      })
      that.triggerEvent('getImageList', that.data.imageList);
    },
    textselect(e){
      let that = this;
      var label=[];
      console.log(label)
      var id=e.currentTarget.id;
      var temp=this.data.viewnumber[id];
      var data_change='viewnumber['+id+']';
      console.log("number:",this.data.viewnumber[id]);
      console.log("id:",e.currentTarget.id);
    if (temp==0){
      that.setData({
      [data_change]:1
      })
    }else{
      that.setData({
        [data_change]:0
        })
    }
    for(var i in this.data.viewnumber){
      console.log("第",i);
      console.log("第",i,"个值",this.data.viewnumber[i])
      if(this.data.viewnumber[i]==1){
        console.log("i:",i)
        label=label.concat(this.data.label_text[i]);
        console.log(label) 
      } 
    }
    this.setData({
        image_label:label
      })
  },
  choseway(e){
    var id1=0;
    if(e.detail.value==""){
      this.setData({
        checked_id:[false,false]
      })
    }
    if(e.detail.value.length==1){
      id1=parseInt(e.detail.value);
    }
    else{
      id1=parseInt(e.detail.value[1]);
    }
    var temp='checked_id['+id1+']';
    let that=this;
    switch(id1){

      case 0:
        this.setData({
          [temp]:true,
          ['checked_id[1]']:false,
        })
        break;
      case 1:
        this.setData({
          [temp]:true,
          ['checked_id[0]']:false,
        })
        break;
    }
    for(var i in this.data.checked_id){
      if(this.data.checked_id[i]){
        var str=this.data.checked_name[i];
        this.setData({
          image_way:str
        })
      }
    }
  },
  getcomments(e){
   var str=e.detail.value;
   this.setData({
     image_text:str
   })
  },
  uploadImage() {
    wx.showLoading({
        title: '上传图片中',
        mask: true
    })
    var imgs=this.data.imageList;
    console.log(imgs)
    // TODO 照片上传至云存储
    const uploadTasks = imgs.map(item => {
        return wx.cloud.uploadFile({
            cloudPath: `photos/${Date.now()}-${Math.floor(Math.random(0,1)*1000)}.png`,
            filePath: item
        })
    });
    Promise.all(uploadTasks).then(result => {
       console.log(result)
        this.addPhotos(result);
    }).catch(err => {
      console.log(err);
        wx.hideLoading();
        wx.showToast({
            title: '上传图片错误',
            icon: 'error'
        })
    })
},
async addPhotos(photos) {
  wx.showLoading({
      title: '添加图片中',
      mask: true
  })
  console.log(photos)
  // 构造照片数据结构体，保存到数据库
  const db = wx.cloud.database();
  const app=getApp();
  const _=db.command;
  if(app.globalData.id=='')
  {
    wx.showModal({
      title: '请先登录',
      success: (result) => {},
    })
  }
  else{
  let result = await db.collection('user').doc(app.globalData.id).get()
  const albumPhotos = photos.map(photo => ({
      fileID: photo.fileID,
      comments: this.data.image_text,
      img_id:app.globalData.id,
      image_way:this.data.image_way,
      imag_label:this.data.image_label,
      judgeget:false,
      get_id:''
  }));
  console.log(albumPhotos)
  console.log("id",app.globalData.id)
  console.log("addtimes",app.globalData.addtimes)
  const tempphotos=[];
  tempphotos.push(albumPhotos)
  console.log("albumPhotos",albumPhotos)
  console.log("tempphotos",tempphotos)
  db.collection('user').doc(app.globalData.id).update({
      data: {
          photo: _.push(tempphotos)
      }
  }).then(result => {
      console.log(result);
      wx.showToast({
        title: '上传成功',
        duration:2000,
        icon:'success',
        mask: true
    })
    wx.switchTab({
      url: '/pages/photos/photos',
    })
  })}
},
  }
  
})
