export function toPlayMusic(id) {
  let url = '/pages/musicPlay/musicPlay'
  wx.navigateTo({
    url: id ? url + '?id=' + id : url
  })
}

export function toSearch() {
  let url = '/pages/search/search'
  wx.navigateTo({
    url
  })
}