import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function addUser(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'put',
    data
  })
}

export function userMenu(params) {
  return request({
    url: '/user/menu',
    method: 'get',
    params: params
  })
}

export function userList(data) {
  return request({
    url: '/user/list',
    method: 'post',
    data
  })
}

export function deleteUser(params) {
  return request({
    url: '/user/delete',
    method: 'delete',
    params: params
  })
}
