import {
  baseUrl
} from './config'

export default function (options) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + options.url,
      method: options.method || 'get',
      data: options.data || {},
      header: options.header || {},
      success: resolve,
      fail: reject
    })
  })
}