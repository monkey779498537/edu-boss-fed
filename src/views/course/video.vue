<template>
   <div class="container">
    <el-card>
      <div slot="header">
        <div>课程：</div>
        <div>阶段：</div>
        <div>课时：</div>
      </div>
      <el-form label-width="40px">
        <el-form-item label="视频">
          <input
            ref="video-file"
            type="file"
          >
        </el-form-item>
        <el-form-item label="封面">
          <input
            ref="image-file"
            type="file"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handUpload"
          >开始上传</el-button>
          <el-button>返回</el-button>
        </el-form-item>
        <el-form-item>
          <p>视频上传中: {{ uploadPercent }}%</p>
          <p v-if="isUploadSucess">视频转码中： {{ isTransCodeSuccess ? '完成' : '正在处理，请稍后...' }}</p>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { getAliyunImagUploadAddressAdnAuth, getAliyunVideoUploadAddressAdnAuth, aliyuTransCode, getAliyunTransCodePercent } from '@/services/aliyun-upload'
export default Vue.extend({
  name: 'CourseVideo',
  data () {
    return {
      uploader: null,
      imageURL: '',
      videoId: null,
      uploadPercent: 0,
      isUploadSucess: false,
      isTransCodeSuccess: false
    }
  },
  computed: {
    video () {
      return this.$refs['video-file']
    },
    image () {
      return this.$refs['image-file']
    }
  },
  created () {
    this.initUploader()
  },
  methods: {
    initUploader () {
      this.uploader = new window.AliyunUpload.Vod({
        // 阿里账号ID，必须有值
        userId: '1618139964448548',
        // 上传到视频点播的地域，默认值为'cn-shanghai'，//eu-central-1，ap-southeast-1
        region: '',
        // 分片大小默认1 MB，不能小于100 KB
        partSize: 1048576,
        // 并行上传分片个数，默认5
        parallel: 5,
        // 网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        // 网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 开始上传
        onUploadstarted: async (uploadInfo: any) => {
          console.log('onUploadstarted=> ', uploadInfo)
          // 1. 通过后端获取文件上传凭证
          let uploadAddressAndAuth
          if (uploadInfo.isImage) {
            // 获取图片上传凭证
            const { data } = await getAliyunImagUploadAddressAdnAuth()
            uploadAddressAndAuth = data.data
            this.imageURL = data.data.imageURL
          } else {
            // 获取视频上传凭证
            const { data } = await getAliyunVideoUploadAddressAdnAuth({
              fileName: uploadInfo.file.name,
              imageUrl: this.imageURL // 请确保一定先上传图片，业务后端要求和阿里云本身无关
            })
            uploadAddressAndAuth = data.data
            this.videoId = uploadAddressAndAuth.videoId
          }
          // 2. 调用setUploadAuthAndAddress 设置上传凭证
          (this.uploader as any).setUploadAuthAndAddress(uploadInfo, uploadAddressAndAuth.uploadAuth, uploadAddressAndAuth.uploadAddress, uploadAddressAndAuth.imageId || uploadAddressAndAuth.videoId)
          // 3. 设置完成后，上传进度开始
        },
        // 文件上传成功
        onUploadSucceed: function (uploadInfo: any) {
          // console.log('onUploadSucceed=> ', uploadInfo)
        },
        // 文件上传失败
        onUploadFailed: function (uploadInfo: any, code: any, message: any) {
          // console.log('onUploadFailed=> ', uploadInfo, code, message)
        },
        // 文件上传进度，单位：字节
        onUploadProgress: (uploadInfo: any, totalSize: any, loadedPercent: any) => {
          if (!uploadInfo.isImage) {
            this.uploadPercent = Math.floor(loadedPercent * 100)
          }
        },
        // 上传凭证或STS token超时
        onUploadTokenExpired: function (uploadInfo: any) {
          // console.log('onUploadTokenExpired=> ', uploadInfo)
        },
        // 全部文件上传结束
        onUploadEnd: async (uploadInfo: any) => {
          this.isUploadSucess = true
          const { data } = await aliyuTransCode({
            lessonId: this.$route.query.lessonId,
            coverImageUrl: this.imageURL,
            fileName: (this.video as any).files[0].name,
            fileId: this.videoId
          })
          console.log('data=> ', data)
          const timer = setInterval(async () => {
            const { data } = await getAliyunTransCodePercent(this.$route.query.lessonId)
            if (data.data === 100) {
              window.clearInterval(timer)
              this.isTransCodeSuccess = true
              console.log('转码成功')
            }
            console.log('data2=> ', data)
          }, 3000)
        }
      })
    },
    handUpload () {
      this.isUploadSucess = false
      this.isTransCodeSuccess = false
      this.uploadPercent = 0
      // 获取上传的文件
      const viodeFile = (this.video as any).files[0]
      const imageFile = (this.image as any).files[0]
      const uploader = this.uploader as any
      // 将用户选择的文件，添加到上传列表
      // 一旦开始上传，就会按照列表中添加的顺序开始上传
      uploader.addFile(imageFile, null, null, null, '{"Vod":{}}')
      uploader.addFile(viodeFile, null, null, null, '{"Vod":{}}')
      // 开始上传 触发onUploadstarted
      uploader.startUpload()
    }
  }
})
</script>
<style lang="scss" scoped>
</style>
