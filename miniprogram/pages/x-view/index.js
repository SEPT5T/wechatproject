// components/hx-row/hx-row.js
const utils = require('../../utils/util')
Component({
  externalClasses: ['display'],
  /**
   * 组件的属性列表
   */
  properties: {
    height: {
      type: String,
      value: '',
      optionalTypes: [Number]
    },
    width: {
      type: String,
      value: '100%',
      optionalTypes: [Number]
    },
    weight: {
      type: Number,
      value: 1
    },
    row: {
      type: String,
      value: 'left'
    },
    col: { // 垂直方向的
      type: String,
      value: 'center'
    },
    bg: { // 默认是无色
      type: String,
      value: ''
    },
    bgStyle: { // 背景颜色 style
      type: String,
      value: ''
    },
    color: { // 字体颜色 class
      type: String,
      value: ''
    },
    colorStyle: { // 字体颜色 style
      type: String,
      value: ''
    },
    font: { // 字体大小，默认是14，单位是像素
      type: String,
      value: "14px"
    },
    radius: {
      type: String,
      value: 'rect'
    },
    shadow: {
      type: Boolean,
      value: false
    },
    target: {
      type: String,
      value: ''
    },
    margin: {
      type: String,
      value: "0px"
    },
    padding: {
      type: String,
      value: "8px"
    },
    direct: {
      type: String,
      value: "row"
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
  },
  /**
   * 组件的初始数据
   */
  data: {
    start: 0,
    isMove: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _touchStart(e) {
      let that = this;
      that.data.isMove = false;
      that.data.start = e.timeStamp;
    },
    _bindtouchend(e) {
      let that = this;
      if (that.data.isMove) {
        return;
      }
      if (e.timeStamp - that.data.start > 400) {//长按
        that.triggerEvent('longClick', that.data.bindData);
      } else { // 点击事件
        that.triggerEvent('click', that.data.bindData);
        if (that.data.target) {
          wx.navigateTo({
            url: that.data.target,
          })
        }
      }
      that.data.start = e.timeStamp;
    },
    _bindtouchmove(e) {
      let that = this;
      that.data.isMove = true;
    }
  }
})
