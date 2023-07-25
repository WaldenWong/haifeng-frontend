import request from '@/utils/request'

export function goodsTypes() {
  return request({
    url: '/goods/types',
    method: 'get'
  })
}

export function addGoods(data) {
  return request({
    url: '/goods/add',
    method: 'post',
    data
  })
}

export function updateGoods(data) {
  return request({
    url: '/goods/update',
    method: 'put',
    data
  })
}

export function goodsItems(params) {
  return request({
    url: '/goods/items',
    method: 'get',
    params: params
  })
}

export function goodsList(data) {
  return request({
    url: '/goods/list',
    method: 'post',
    data
  })
}

export function deleteGoods(params) {
  return request({
    url: '/goods/delete',
    method: 'delete',
    params: params
  })
}
