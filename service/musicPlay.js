import request from '../utils/request'

export function getMusicDetail(options) {
  return request({
    url: '/song/detail',
    data: {
      ids: options.ids
    }
  })
}

export function getMusicPlayUrl(options) {
  return request({
    url: '/song/url',
    data: {
      id: options.ids
    }
  })
}