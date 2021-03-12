<template>
  <div class="course-create">
    <create-or-updata is-edit :courseId='courseId'/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateOrUpdata from './components/CreateOrUpdate.vue'

export default Vue.extend({
  name: 'CourseEdit',
  components: {
    CreateOrUpdata
  },
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
