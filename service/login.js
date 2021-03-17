import request from '../utils/request'

export function userLogin(userData) {
  return request({
    url: '/login/cellphone',
    data: {
      phone: userData.phone,
      password: userData.password
    }
  })
}