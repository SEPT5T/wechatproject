// components/aydk_image_view/aydk_image_view.js
const utils = require('../../utils/util')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src:{
      type: String,
      value: ''
    },
    width:{
      type: String,
      value: '40px',
      optionalTypes: [Number]
    },
    height: {
      type: String,
      value: '40px',
      optionalTypes: [Number]
    },
    size: { // 图片默认占屏幕宽度的比例，默认是屏幕的四分之一（除去padding的宽度1/4）
      type: String,
      value: '',
      optionalTypes: [Number]
    },
    type: { // rect circle 
      type: String,
      value: "rect"
    },
    plus: {
      type: Boolean,
      value: false
    },
    clear:{
      type: Boolean,
      value: false
    },
    border: {
      type: Boolean,
      value: false
    },
    mode:{
      type: String,
      value: 'aspectFit'
    },
    defimg:{
      type: String,
      value: ''
    }
  },
  attached() {
    // 处理传入的数据
    let that = this;
    if (utils.isNumber(that.data.height)) {
      that.setData({
        height: that.data.height + 'px'
      })
    }
    if (utils.isNumber(that.data.width)) {
      that.setData({
        width: that.data.width + 'px'
      })
    }
    if (utils.isNumber(that.data.size)) {
      that.setData({
        size: that.data.size + 'px'
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    addImg() {
      let that = this;
      wx.chooseImage({
        count: that.data.add_limit,
        success: function(res) {
          console.log("tempFilePath",res.tempFilePaths);
          that.triggerEvent('addImg', res.tempFilePaths);// 
        },
      })
    },
    deleteImg(e){
      let that = this;
      that.triggerEvent('deleteImg', that.data.src);
    },
    // 图片预览
    showImg(){
      let that =this;
      wx.previewImage({
        urls: that.data.imageList.length > 0 ? that.data.imageList : [that.data.src],
        current: that.data.src
      })
    }
  }
})
