import axios from 'axios'
import store from '@/store'

const request = axios.create({
  // 配置文件
  // baseURL
  // timeout
})

// 请求拦截
request.interceptors.request.use(function (config) {
  // 发送之前
  console.log('config =>', config)
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
}, function (error) {
  // 请求错误
  return Promise.reject(error)
})

// 响应拦截

export default request
