// pages/home/childCpns/c-select/c-select.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

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
    handleRecommendSongs() {
      wx.navigateTo({
        url: '/pages/recommendSong/recommendSong',
      })
    }
  }
})
