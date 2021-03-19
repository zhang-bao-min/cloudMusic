export function toPlayMusic(id) {
  let url = '/pages/musicPlay/musicPlay'
  wx.navigateTo({
    url: id ? url + '?id=' + id : url
  })
}