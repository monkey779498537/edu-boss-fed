<template>
  <div ref="editor" class="text-editor"></div>
</template>
<script lang="ts">
import Vue from 'vue'
import E from 'wangeditor'
import { uploadCourseImage } from '@/services/course'

export default Vue.extend({
  name: 'textEditor',
  props: {
    value: {
      type: String
    }
  },
  mounted () { // 组件渲染好后，需要操作DOM
    this.initEditor()
  },
  methods: {
    initEditor () {
      const editor = new E(this.$refs.editor as any)
      // 配置 onchange 回调函数
      // 注意：事件监听必须在create之前
      editor.config.onchange = (newHtml: string) => {
        this.$emit('input', newHtml)
      }
      editor.config.uploadImgServer = '/upload-img'
      editor.create()
      // 设置初始值
      // 注意：设置初始值一定要在create之后
      editor.txt.html(this.value)

      editor.config.customUploadImg = async function (resultFiles: any, insertImgFn: any) {
        // resultFiles 是 input 中选中的文件列表
        // insertImgFn 是获取图片 url 后，插入到编辑器的方法
        console.log(resultFiles)
        // 1.把用户选择的reultFiles 上传到服务器
        const fd = new FormData()
        fd.append('file', resultFiles[0])
        const { data } = await uploadCourseImage(fd)
        insertImgFn(data.data.name)
      }
    }
  }
})
</script>
<style lang="scss" scoped>
</style>
