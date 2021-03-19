// pages/musicPlay/musicPlay.js
import {
  getMusicDetail,
  getMusicPlayUrl
} from '../../service/musicPlay.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, // 描述音乐是否播放
    music: {},
    musicPlayUrl: ''
  },

  onLoad: function(options) {
    const ids = options.id
    this._getMusicDetail({ids})
    this._getMusicPlayUrl({ids})
  },
  // 点击播放的回调
  handlemusicPlay() {
    this.setData({
      isPlay: !this.data.isPlay
    })

    this._musicControl(this.data.isPlay)
  },

  // 音乐播放暂停功能函数
  _musicControl(isPlay) {
    let backgroundAudioManager = wx.getBackgroundAudioManager()
    let musicLink = this.data.url
    let musicName = this.data.url.name
    if(isPlay) {
      backgroundAudioManager.src = musicLink
      backgroundAudioManager.title = musicLink
    } else {
      backgroundAudioManager.pause()
    }
  }, 

  // 获取音乐详情
  _getMusicDetail(options) {
    return getMusicDetail(options).then(res => {
      const music = res.data.songs[0]
      this.setData({
        music
      })
      wx.setNavigationBarTitle({
        title: music.name
      })
    })
  },

  // 获取音乐源链接
  _getMusicPlayUrl(options) {
    getMusicPlayUrl(options).then(res => {
      const url = res.data.data[0].url
      this.setData({
        url
      })
    })
  }

})