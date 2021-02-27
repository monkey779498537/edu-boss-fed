/**
 * 用户相关请求模块
 */
import request from '@/utils/request'
import qs from 'qs'

interface User {
  phone: string
  password: string
}

export const login = (data: User) => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    // 如果data是普通对象, content-type -> application/json
    // 如果data是键值对qs.stringify，content-type  -> application/x-www-form-encoded
    // 如果data是表单提交FormData对象，content-type --> multipart/form-data
    data: qs.stringify(data) // axios 默认发送的是application/json格式的数据请求
  })
}
