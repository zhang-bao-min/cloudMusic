// pages/login/login.js
import {
  userLogin
} from '../../service/login.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: '',
    code: '',
    userInfo: {},
    cookies: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 获取用户输入的账号信息
  handleinput(event) {
    let type = event.currentTarget.id
    // if(type == 'phone') {
    //   this.setData({
    //     phone: event.detail.value
    //   })
    // } else if(type == 'password') {
    //   this.setData({
    //     password: event.detail.value
    //   })
    // }
    this.setData({
      [type]: event.detail.value
    })
  },

  // 登录事件
  async login() {
    let {phone, password} = this.data

    if(!phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return
    }

    // 验证手机号是否正确
    let phoneReg = /^[1]([3-9])[0-9]{9}$/
    if (!phoneReg.test(phone)) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
      return
    }

    // 验证密码
    if(!password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return
    }

    // 验证登录
    await this._userLogin({phone, password})
    const code = this.data.code
    if(code === 200) {
      wx.showToast({
        title: '登录成功',
        icon: 'none'
      })
      // 将用户信息存储到本地
      wx.setStorageSync('cookies', JSON.stringify(this.data.cookies))
      wx.setStorageSync('userInfo', JSON.stringify(this.data.userInfo))
      wx.reLaunch({
        url: '/pages/personal/personal',
      })
    } else if (code === 502) {
      wx.showToast({
        title: '密码错误',
        icon: 'none'
      })
    } else if (code === 400) {
      wx.showToast({
        title: '手机号错误',
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '登录失败',
        icon: 'none'
      })
    }
  },

  // 用户登录
  _userLogin(userData) {
    return userLogin(userData).then(res => {
      const cookies = res.cookies
      const code = res.data.code
      const userInfo = res.data.profile
      this.setData({
        code,
        userInfo,
        cookies
      })
    })
  }
})