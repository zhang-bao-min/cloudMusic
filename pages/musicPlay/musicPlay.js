// pages/musicPlay/musicPlay.js
import Pubsub from 'pubsub-js'
import moment from 'moment'
import {
  getMusicDetail,
  getMusicPlayUrl
} from '../../service/musicPlay.js'

const appInstance = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, // 描述音乐是否播放
    music: {},
    musicPlayUrl: '',
    currentTime: '00:00',
    durationTime: '00:00',
    currentWidth: '0'
  },

  onLoad: function(options) {
    const ids = options.id

    // 监控当前音乐是否在播放
    if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === ids) {
      this.setData({
        isPlay: true
      })
    }

    // 音乐实例对象
    this.backgroundAudioManager = wx.getBackgroundAudioManager()

    // 监听系统控制音乐播放/暂停/停止
    this.backgroundAudioManager.onPlay(() => {
      this.changePlayState(true)
      // 把音乐状态存到全局
      appInstance.globalData.musicId = ids
    })
    this.backgroundAudioManager.onPause(() => this.changePlayState(false))
    this.backgroundAudioManager.onStop(() => this.changePlayState(false))

    /**
     * 监听音乐自然播放结束
     * 自动切换下一首且播放
     * 进度条归零 */ 
    this.backgroundAudioManager.onEnded(() => {
      this._switchMusic()
      // 发布消息给recommendSong页面
      Pubsub.publish('switchType', 'next')
      this.setData({
        currentWidth: 0,
        currentTime: '00:00'
      })
    })

    this._getMusicPlayUrl({ids})
    this._getMusicDetail({ids})

    // 监听音乐实时进度
    this.backgroundAudioManager.onTimeUpdate(() => {
      let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
      let currentWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 450
      this.setData({
        currentTime,
        currentWidth
      })
    })
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
    let musicLink = this.data.url
    let musicName = this.data.music.name
    if(isPlay) {
      this.backgroundAudioManager.src = musicLink
      this.backgroundAudioManager.title = musicName
    } else {
      this.backgroundAudioManager.pause()
    }
  }, 

  // 获取音乐详情
  _getMusicDetail(options) {
    return getMusicDetail(options).then(res => {
      const music = res.data.songs[0]
      const durationTime = moment(res.data.songs[0].dt).format('mm:ss')
      this.setData({
        music,
        durationTime
      })
      wx.setNavigationBarTitle({
        title: music.name
      })
      this._musicControl(true)
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
  },

  // 控制播放状态
  changePlayState(isPlay) {
    this.setData({
      isPlay
    })
    appInstance.globalData.isMusicPlay = isPlay
  },

  // 切换歌曲的回调
  handleStwich(event) {
    const type = event.currentTarget.id
    // 暂停上一首音乐
    this.backgroundAudioManager.stop()
    this._switchMusic()
    // 发布消息给recommendSong页面
    Pubsub.publish('switchType', type)
  },

  // 处理发布订阅切歌事件
  _switchMusic() {
    // 订阅来自recommendSong页面发布的消息
    Pubsub.subscribe('musicId', (msg, musicId) => {
      // 获取音乐详情
      this._getMusicDetail({ids: musicId})
      this._getMusicPlayUrl({ids: musicId})
      // 自动播放音乐
      this._musicControl(true, musicId)
      // 取消订阅
      Pubsub.unsubscribe('musicId')
    })
  }
})