const app = getApp()
const db = wx.cloud.database()
const _ = db.command;

Page({
    data: {
        photo: [],
        photo_text:[],
        imgUrls:[
            'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3636112845,3905310374&fm=26&gp=0.jpg',
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1604553002371&di=c4f0992a8dff5d511b56c26147eaf265&imgtype=0&src=http%3A%2F%2Fimg.pconline.com.cn%2Fimages%2Fupload%2Fupc%2Ftx%2Fonlinephotolib%2F1505%2F14%2Fc0%2F6778749_1431591876360.jpg'

        ]
    },

    onLoad(options) {
        let that=this
        wx.showLoading({
            title: '初始化中',
            mask: true
        });
        that.init()
        wx.cloud.callFunction({
           name:'getdata',
           success:function(result){ 
               result=result.result
               console.log("res",result)
            for(var i in result.data){
                console.log("res",result.data[i])
                for(var j in result.data[i].photo)
             {  
                 console.log("j",j)
               if(result.data[i].photo[j][0].judgeget==false){
                   console.log("lmg",result.data[i].photo[j][0])
                   that.data.photo.push(result.data[i].photo[j][0])
               }    
             }
             }
              var temp=result.data[0];
             console.log("temp",temp[0])
             
             /*this.data.photo.push(result.data[0].photo1[0][0])
             this.data.photo.push(result.data[0].photo1[1][0])*/
             that.setData({
                 photo:that.data.photo
             })
             wx.hideLoading();
              
           }
        })

       
    },
    onShow() {
        
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
                    photo: [],
                    photoget: [],
                    photoreturn:[]
                }
            }))._id;
        }else{
            app.globalData.id=result.data[0]._id
        }
    },
    // 跳转照片详情
    todetail(e) {        
        app.globalData.currentPhoto = this.data.photo[e.currentTarget.dataset.index].fileID;
        console.log(this.data.photo)
        app.globalData.choseID = this.data.photo[e.currentTarget.dataset.index].img_id;
        console.log("app.globalData.currentPhoto",app.globalData.currentPhoto)
        wx.navigateTo({
            url: '/pages/detail/detail',
        })
    },
    // 选择照片
    changeview_choseImage: function(){
    wx.navigateTo({
      url: '/pages/x-add-img/x-add-img',
    })
    },
    chooseImage: function () {
        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: res => {
                console.log('res:', res)
                this.uploadImage(res.tempFilePaths);
            }
        })
    },
    // 上传照片
    uploadImage: function (imgs) {
        wx.showLoading({
            title: '上传图片中',
            mask: true
        })
        // TODO 照片上传至云存储
        const uploadTasks = imgs.map(item => {
            return wx.cloud.uploadFile({
                cloudPath: `photos/${Date.now()}-${Math.floor(Math.random(0,1)*1000)}.png`,
                filePath: item
            })
        });
        Promise.all(uploadTasks).then(result => {
            this.addPhotos(result);
        }).catch(err => {
            wx.hideLoading();
            wx.showToast({
                title: '上传图片错误',
                icon: 'error'
            })
        })
    },
    // 添加图片数据至数据库
    addPhotos(photos) {
        wx.showLoading({
            title: '添加图片中',
            mask: true
        })
        // 构造照片数据结构体，保存到数据库
        const albumPhotos = photos.map(photo => ({
            fileID: photo.fileID,
            comments: ''
        }));
        db.collection('user').doc(app.globalData.id).update({
            data: {
                photo: _.push(albumPhotos)
            }
        }).then(result => {
            console.log(result);
            this.init();
        })
    },
    // 删除图片
    removeImage(e) {
        const that = this
        wx.showModal({
            title: '提示',
            content: '是否要删除该图片',
            success(res) {
                if (res.confirm) {
                    wx.showLoading({
                        title: '删除中',
                        mask: true
                    })
                    // TODO 照片删除功能
                    db.collection('user').doc(app.globalData.id).update({
                        data: {
                            photo: _.pull({
                                fileID: that.data.photo[e.currentTarget.dataset.index].fileID
                            })
                        }
                    }).then(result => {
                        console.log(result);
                        wx.cloud.deleteFile({
                            fileList: [that.data.photo[e.currentTarget.dataset.index].fileID]
                        }).then(res=>{
                            that.init();
                        });
                    })
                }
            }
        })
    },
    onPullDownRefresh: function () {
        //调用刷新时将执行的方法
    	this.onLoad();
    },
    
})