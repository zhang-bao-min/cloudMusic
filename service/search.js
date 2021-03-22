import request from "../utils/request";


export function getSearchDefaultData() {
  return request({
    url: '/search/default'
  })
}

export function getSearchHotData() {
  return request({
    url: '/search/hot/detail'
  })
}

export function getSearchData(options) {
  return request({
    url: '/search',
    data: {
      keywords: options.keywords,
      limit: 10
    }
  })
}