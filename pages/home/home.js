// 导入home页请求函数
import {
  getBannersData,
  getRecommendsData,
  gethotListsData
} from '../../service/home.js'

// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    recommends: [],
    hotLists: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this._getBannersData()
    this._getRecommendsData()
    this._gethotListsData()
  },

  // 获取轮播图数据
  _getBannersData() {
    getBannersData().then(res =>{
      const banners = res.data.banners
      this.setData({
        banners
      })
    })
  },

  // 获取推荐数据
  _getRecommendsData() {
    getRecommendsData().then(res => {
      const recommends = res.data.result
      this.setData({
        recommends
      })
    })
  },

  // 获取热歌榜数据
  _gethotListsData() {
    const hotLists = []
    for(let idx = 0; idx < 10; idx++){
      gethotListsData(idx).then(res => {
        const hotListData = res.data.playlist
        const hotListItem = {name: hotListData.name, tracks: hotListData.tracks.slice(0, 3)}
        hotLists.push(hotListItem)
        this.setData({
          hotLists
        })
      })
    }
  }
})