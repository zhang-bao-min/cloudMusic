// pages/recommendSong/recommendSong.js
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
    recommendSongs: []
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
    let song = event.currentTarget.dataset.song
    toPlayMusic(song.id)
  }
})