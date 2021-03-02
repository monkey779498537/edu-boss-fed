<template>
  <div class="menu-create">
    <create-or-edit :isEidt="true"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateOrEdit from './components/CreateOrEdit.vue'

export default Vue.extend({
  name: 'MenuEdit',
  data () {
    return {
    }
  },
  components: {
    CreateOrEdit
  }
})
</script>

<style lang="scss" scoped></style>
