import request from '../utils/request'

export function getRecommendSongData() {
  const cookie = wx.getStorageSync('cookies') ? JSON.parse(wx.getStorageSync('cookies')).find(item => item.indexOf('MUSIC_U') !== -1) : ''
  return request({
    url: '/recommend/songs',
    header: {
      cookie
    }
  })
}