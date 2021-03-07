<template>
  <div>
    <el-form>
      <el-form-item label="角色名称">
        <el-input v-model="role.name"></el-input>
      </el-form-item>
      <el-form-item label="角色编码">
        <el-input v-model="role.code"></el-input>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input type="textarea" v-model="role.description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="$emit('cancel')">取消</el-button>
        <el-button type='primary' @click="onSubmit">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { createOrUpdate, getRoleById } from '@/services/role'
export default Vue.extend({
  name: 'CreatedOrEditRole',
  data () {
    return {
      role: {
        code: '',
        name: '',
        description: ''
      }
    }
  },
  props: {
    roleId: {
      type: [String, Number],
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  created () {
    // 如果是编辑操作，根据ID加载战士角色信息
    if (this.isEdit) {
      this.loadRole()
    } else {
      console.log(2)
    }
  },
  methods: {
    async onSubmit () {
      await createOrUpdate(this.role)
      this.$message.success('操作成功')
      this.$emit('success')
    },
    async loadRole () {
      const { data } = await getRoleById(this.roleId)
      this.role = data.data
    }
  }
})
</script>
<style lang="scss" scoped>
</style>
