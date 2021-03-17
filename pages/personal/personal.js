// pages/personal/personal.js
import {
  getRecentPlayData
} from '../../service/personal.js'

let startY = 0
let moveY = 0
let moveDistance = 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: 'translateY(0)',
    coverTransition: '',
    userInfo: {},
    recentPlays: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // 读取本地用户信息
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo: JSON.parse(userInfo)
      })

      // 最近播放列表
      let options = {uid: this.data.userInfo.userId}
      this._getRecentPlayData(options)
    }
  },

  handleTouchStart(event) {
    this.setData({
      coverTransition: ''
    })
    startY = event.touches[0].clientY
  },

  // 手指移动事件
  handleTouchMove(event) {
    moveY = event.touches[0].clientY
    moveDistance = moveY - startY
    if(moveDistance < 0){
      return
    }
    if(moveDistance >= 80){
      moveDistance = 80
    }
    this.setData({
      coverTransition: '',
      coverTransform: `translateY(${moveDistance}rpx)`
    })
  },

  handleTouchEnd() {
    // 当手指松开时,回归原位
    this.setData({
      coverTransform: `translateY(0)`,
      coverTransition: 'transform .5s linear'
    })
  },

  // 点击登录回调
  toLogin() {
    // if(JSON.stringify(this.data.userInfo).length == 2) {
    if(!Object.keys(this.data.userInfo).length) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  },

  // 最近播放列表
  _getRecentPlayData(options) {
    getRecentPlayData(options).then((res) => {
      let index = 0
      const recentPlays = res.data.allData.splice(0, 10).map(item => {
        item.id = index++
        return item
      })
      this.setData({
        recentPlays
      })
    })
  }
})