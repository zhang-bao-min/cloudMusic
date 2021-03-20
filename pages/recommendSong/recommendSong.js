// pages/recommendSong/recommendSong.js
import Pubsub from 'pubsub-js'
import {
  getRecommendSongData
} from '../../service/recommendSong.js'
import {
  toPlayMusic
} from '../../common/common.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    month: '',
    day: '',
    recommendSongs: [],
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 动态显示日期
    const arrDate = new Date().toDateString().split(' ')
    this.setData({
      month: arrDate[1],
      day: arrDate[2] + 'th'
    })

    // 判断用户是否登录
    const userInfo = wx.getStorageSync('userInfo')
    if(!userInfo) {
      wx.showModal({
        title: '未登录',
        content: '去登录',
        icon: 'none',
        success: (res) => {
          console.log(res);
          if(res.confirm) {
            // 未登录,跳转登录
            wx.reLaunch({
              url: '/pages/login/login',
            })
          } else {
            wx.switchTab({
              url: '/pages/home/home',
            })
          }
        }
      })
    }
    this._getRecommendSongData()

    // 订阅来自musicPlay页面发布的消息
    Pubsub.subscribe('switchType', (msg, type) => {
      let {recommendSongs, index } = this.data
      // 获取上下一一首的下标
      if(type === 'pre') {
        // index === 0 && index = recommendSongs.length - 1
        // index -= 1 
        index === 0 ? index = recommendSongs.length - 1 : index -= 1
      } else {
        index === recommendSongs.length - 1 ? index = 0 : index += 1
      }
      this.setData({
        index
      })
      const musicId = recommendSongs[index].id
      // 发布消息到musicPlay页面
      Pubsub.publish('musicId', musicId)
    })
  },

  // 获取歌曲数据
  _getRecommendSongData(){
    getRecommendSongData().then(res => {
      const recommendSongs = res.data.recommend
      this.setData({
        recommendSongs
      })
    })
  },

  // 点击播放音乐
  handlePlayMusic(event) {
    let {song, index} = event.currentTarget.dataset
    this.setData({
      index
    })
    toPlayMusic(song.id)
  }
})