import request from '../utils/request'

export function getBannersData() {
  return request({
    url: '/banner',
    data: {
      type: 1
    }
  })
}

export function getRecommendsData() {
  console.log();
  return request({
    url: '/personalized',
    data: {
      limit: 10
    }
  })
}

export function gethotListsData(idx) {
  return request({
    url: '/top/list',
    data: {
      idx
    }
  })
}