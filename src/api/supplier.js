import request from '@/utils/request'

export function supplierItems() {
  return request({
    url: '/supplier/items',
    method: 'get'
  })
}
