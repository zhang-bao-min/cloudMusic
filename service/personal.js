import request from '../utils/request'

export function getRecentPlayData(options) {
  return request({
    url: '/user/record',
    data: {
      uid: options.uid,
      type: 0
    }
  })
}