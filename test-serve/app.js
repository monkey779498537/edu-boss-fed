const express = require('express')
const app = express()
const path = require('path')
const { createProxyMiddleware } = require('http-proxy-middleware')

// app.get('/', (req, res) => {
//   res.send('hello')
// })

// 把dist目录托管到web服务中
// 访问 / 的时候，默认会返回托管目录中的 index.html 文件
app.use(express.static(path.join(__dirname, '../dist')))

app.use('/boss', createProxyMiddleware({ target: 'http://eduboss.lagou.com', changeOrigin: true}))
app.use('/front', createProxyMiddleware({ target: 'http://edufront.lagou.com', changeOrigin: true}))

app.listen(3000, () => {
  console.log('running...')
})
