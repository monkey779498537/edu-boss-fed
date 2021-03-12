import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import qs from 'qs'

const request = axios.create({
  // 配置文件
  // baseURL
  // timeout
})

function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

function refreshToken () {
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      refreshtonken: store.state.user.refresh_token
    })
  })
}

// 请求拦截
request.interceptors.request.use(function (config) {
  // 发送之前
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
let isRfreshing = false // 控制刷新 token 的状态
let requests: any[] = [] // 刷新 token 期间过来的401请求，后续需要重新发出去
request.interceptors.response.use(function (response) { // 状态码2XXX时
  // 响应成功后
  return response
}, async function (error) { // 状态码非2xxx时
  // 响应错误
  if (error.response) { // 请求发出去收到响应了，但状态码超出2xx范围
    // 400  未授权，token失效
    // 401  token无效（未提供token、token过期、token伪造）
    // 403  没有权限,越权操作未授权模块
    // 404
    // 500
    const { status } = error.response
    if (status === 400) {
      Message.error('请求参数错误')
    } else if (status === 401) { // token无效（未提供token、token过期、token伪造）
      // 如果没有refresh_token，直接跳转登录重新登录
      if (!store.state.user) { //  无登录信息
        redirectLogin()
        return Promise.reject(error)
      }
      if (!isRfreshing) {
        isRfreshing = true // 开启刷新状态
        // 如果有refresh_token 则尝试使用 refresh_token 获取新的access_token
        // 尝试刷新获取新的token
        // 注意： 如果这里直接使用request生成的axios，会导致接口二次请求依然401的情况，又重复轮询回到这里
        // 解决方案：使用axios.created()生成新的请求实例,不用request生成的axios实例，可以区分开
        return refreshToken().then(res => {
          if (!res.data.success) {
            throw new Error('刷新 token 失败')
          }
          //    成功 -> 把本次失败的请求重新发送出去
          // 把刷新之后的拿到的新的 access_token 更新到容器和本地存储中
          store.commit('setUser', res.data.content)
          // 吧 requests 队列中的请求重新发出去
          requests.forEach(cb => cb())
          // 重置requests数组
          requests = []
          // 把失败请求重新发送出去   error.config 失败请的配置对象信息
          return request(error.config)
        }).catch(err => {
          console.log(err)
          // 清除当前登录用户状态信息
          store.commit('setUser', null)
          //    失败 -> 跳转登录页重新登录获取新的token
          redirectLogin()
          return Promise.reject(error)
        }).finally(() => {
          // 不管成功失败 都需要重置刷新状态
          isRfreshing = false
        })
      }
      // 刷新状态下，把请求挂起，放到requests数组中,在Promise不让其结束，可以让其挂起
      return new Promise(resolve => {
        requests.push(() => {
          resolve(request(error.config))
        })
      })
    } else if (status === 403) {
      Message.error('未授权，请联系管理员')
    } else if (status === 404) {
      Message.error('请求资源不存在，请联系管理员')
    } else if (status >= 500) {
      Message.error('服务器错误，请联系管理员')
    }
  } else if (error.request) { // 请求发出去了，未收到响应（超时、网络问题）
    Message.error('请求超时,请刷新重试！')
  } else { // 在设置请求是发生了一些事情，触发错误了（未知消息）
    Message.error(`请求失败：${error.message}`)
  }
  //  错误对象抛出，仍给上一个调用者
  return Promise.reject(error)
})

export default request
