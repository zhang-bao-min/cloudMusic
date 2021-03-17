import request from '../utils/request'

export function getVideoGroupData() {
  return request({
    url: '/video/group/list'
  })
}

export function getVideoData(options) {
  const cookie = wx.getStorageSync('cookies') ? JSON.parse(wx.getStorageSync('cookies')).find(item => item.indexOf('MUSIC_U') !== -1) : ''
  return request({
    url: '/video/group',
    data: {
      id: options.id
    },
    header: {
      cookie
    }
  })
}
