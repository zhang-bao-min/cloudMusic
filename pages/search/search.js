// pages/search/search.js
import {toPlayMusic
} from '../../common/common.js'
import {
  getSearchDefaultData,
  getSearchHotData,
  getSearchData
} from '../../service/search.js'

let isSend = false //函数节流使用

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchDefaultData: '',
    searchHotData: [],
    keywords: '',
    searchMusics: [],
    searchHistoryList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getSearchDefaultData()
    this._getSearchHotData()

    // 查看本地是否有搜索记录历史
    let searchHistoryList = wx.getStorageSync('searchHistoryList')
    searchHistoryList && this.setData({
      searchHistoryList
    })
  },

  // 搜索事件的回调
  handlesearch(event) {
    let keywords = event.detail.value.trim()
    // 函数节流
    if(isSend) {
      return
    }
    isSend = true
    setTimeout(() => {
      isSend = false
    }, 300)

    if(keywords) {
      this._getSearchData({keywords})
    } else{
      this.setData({
        searchMusics: []
      })
    }
    this.setData({
      keywords
    })
  },

  // 获取搜索默认关键字
  _getSearchDefaultData() {
    getSearchDefaultData().then(res => {
      const searchDefaultData = res.data.data.showKeyword
      this.setData({
        searchDefaultData
      })
    })
  },

  // 获取热搜榜数据
  _getSearchHotData() {
    getSearchHotData().then(res => {
      const searchHotData = res.data.data
      this.setData({
        searchHotData
      })
    })
  },

  // 获取搜索模糊匹配数据
  _getSearchData(options) {
    getSearchData(options).then(res => {
      const searchMusics = res.data.result.songs
      this.setData({
        searchMusics
      })
    })
  },

  // 搜索歌曲确定事件
  handleMusicPLay(event) {
    // 把搜索记录存入本地
    let keyword = event.currentTarget.dataset.keyword
    let id = event.currentTarget.dataset.id
    let {searchHistoryList} = this.data
    // 如果搜索记录存在,则不执行
    searchHistoryList.map(item => {
      console.log(item, keyword);
      if(item == keyword) {
        return
      }
    })
    searchHistoryList.unshift(keyword)
    searchHistoryList.splice(10)
    this.setData({
      searchHistoryList
    })
    wx.setStorageSync('searchHistoryList', searchHistoryList)
    // 调用播放歌曲函数
    toPlayMusic(id)
  },

  // 取消事件回调
  handlecancel() {
    this.setData({
      searchMusics: []
    })
  },

  // 删除历史记录
  deleteHistory() {
    wx.showModal({
      content: '确认清空历史记录',
      success: (res) => {
        if(res.confirm == true) {
          this.setData({
            searchHistoryList: []
          }),
          wx.removeStorageSync('searchHistoryList')
        }
      }
    })
  }
})