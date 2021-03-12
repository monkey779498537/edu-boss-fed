<template>
  <div class="course-create">
    <create-or-updata-course></create-or-updata-course>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateOrUpdataCourse from './components/CreateOrUpdate.vue'

export default Vue.extend({
  name: 'CourseCreate',
  components: {
    CreateOrUpdataCourse
  }
})
</script>

<style lang="scss" scoped>
</style>
