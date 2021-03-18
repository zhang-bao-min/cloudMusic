// pages/video/video.js
import {
  getVideoGroupData,
  getVideoData
} from '../../service/video.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],
    navId: '',
    videos: [],
    videoId: '',
    videoUpdateTime: [],
    isTriggered: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._getVideoGroupData()
  },

  onShareAppMessage: function() {

  },

  changeNav(event) {
    let navId = event.currentTarget.id
    this.setData({
      navId,
      videos: [1]
    })

    wx.showLoading({
      title: '正在加载'
    })

    this._getVideoData({id: navId})
    // console.log(videoGroupList[this.data.navId]);
  },

  // 标签列表数据
  _getVideoGroupData() {
    getVideoGroupData().then((res) => {
      const videoGroupList = res.data.data.splice(0, 14)
      const navId = videoGroupList[0].id
      this.setData({
        videoGroupList,
        navId: videoGroupList[0].id
      })

      this._getVideoData({id: navId})
    })
  },

  // 视频数据
  _getVideoData(options) {
    getVideoData(options).then((res) => {
      // 关闭加载
      wx.hideLoading()
      let index = 0
      let videos = res.data.datas.map(item => {
        item.id = index++
        return item
      })

      this.setData({
        videos,
        // 关闭下拉刷新
        isTriggered: false
      })
    })
  },

  // 点击播放回调
  handlePlay(event){
    /**
     * 点击播放事件中需找到上一个播放的视频
     * 播放新的视频之前停止掉之前播放的视频
     * 
     * 问题
     * 如何找到上一个播放的视频
     * 如何确认点击播放的视频和正在播放的不是同一个视频
     * 
     * 单例模式
     * 需要创建多个对象的场景下,通过一个对象接收,始终保持只有一个对象
     * 节省内存空间
     */
    // 
    const vid = event.currentTarget.id
    this.setData({
      videoId: vid
    })
    // 
    // this.vid !== vid && this.videoContext && this.videoContext.stop()
    // if (this.vid !== vid) {
    //   if (this.videoContext) {
    //     this.videoContext.stop()
    //   }
    // }
    // this.vid = vid
    this.videoContext = wx.createVideoContext(vid)
    
    // 判断当前的视频是否播放过,如果有,跳转到指定的播放位置
    let {videoUpdateTime} = this.data
    let videoItem = videoUpdateTime.find(item => item.vid === vid)
    if(videoItem) {
      this.videoContext.seek(videoItem.currentTime)
    }
    this.videoContext.play()
  },

  // 监听视频播放进度回调
  handleTimeUpdate(event) {
    // 创建对象,记录当前播放视频的id和进度
    let videoTimeObj = {vid: event.currentTarget.id, currentTime: event.detail.currentTime}
    /**
     * 判断记录播放时长的videoUpdateTime数组中是否有当前视频的播放记录
     *  如果有,修改数组中的当前播放时长
     *  如果没有,把当前视频添加进去
     */
    let {videoUpdateTime} = this.data
    let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid)
    if(videoItem) {
      videoItem.currentTime = event.detail.currentTime
    } else {
      videoUpdateTime.push(videoTimeObj)
    }
    this.setData({
      videoUpdateTime
    })
  },

  // 视频播放结束的回调
  handleEnded(event) {
    let {videoUpdateTime} = this.data
    // 播放结束时找到对应视频的下标,在videoUpdateTime中移除
    videoUpdateTime.splice(videoUpdateTime.findIndex(item => item.vid === event.currentTarget.id), 1)
    this.setData({
      videoUpdateTime
    })
  },

  // 下拉刷新回调
  handleResref() {
    this._getVideoData({id: this.data.navId})
  }
})