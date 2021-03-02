<template>
  <div class="resource">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="form" :model="form" class="demo-form-inline">
          <el-form-item prop="name" label="资源名称">
            <el-input v-model="form.name" placeholder="资源名称" :disabled="isLoading"></el-input>
          </el-form-item>
          <el-form-item prop="url" label="资源路径">
            <el-input v-model="form.url" placeholder="资源路径" :disabled="isLoading"></el-input>
          </el-form-item>
          <el-form-item prop="categoryId" label="资源分类">
            <el-select clearable v-model="form.categoryId" placeholder="资源分类" :disabled="isLoading">
              <el-option v-for="item in resourceCategories" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :disabled='isLoading'>查询搜索</el-button>
            <el-button @click="onReset" :disabled="isLoading">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
       <el-table
        :data="resources"
        v-loading = "isLoading"
        style="width: 100%; margin-bottom: 20px;">
        <el-table-column
          type="index"
          label="编号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="资源名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="url"
          label="资源路径">
        </el-table-column>
        <el-table-column
          prop="createdTime"
          label="添加时间">
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="form.current"
        :page-sizes="[5, 10, 20]"
        :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        :disabled="isLoading">
      </el-pagination>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getResourcePages } from '@/services/resource'
import { getResourceCategories } from '@/services/resource-category'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'ResourceList',
  data () {
    return {
      resources: [],
      form: {
        name: '',
        url: '',
        current: 1, // 默认查询第1页数据
        size: 5, // 每页大小
        categoryId: null // 资源分类
      },
      totalCount: 0,
      resourceCategories: [], // 资源分类列表
      isLoading: true
    }
  },
  created () {
    this.loadResoure()
    this.loadResoureCategories()
  },
  methods: {
    onSubmit () {
      this.form.current = 1
      this.loadResoure()
    },
    onReset () {
      (this.$refs.form as Form).resetFields()
      this.form.current = 1
      this.loadResoure()
    },
    async loadResoure () {
      this.isLoading = true
      const { data } = await getResourcePages(this.form)
      if (data.code === '000000') {
        this.resources = data.data.records
        this.totalCount = data.data.total
      }
      this.isLoading = false
    },
    async loadResoureCategories () {
      this.isLoading = true
      const { data } = await getResourceCategories()
      if (data.code === '000000') {
        this.resourceCategories = data.data
      }
      this.isLoading = false
    },
    handleSizeChange (val: number) {
      console.log(`每页 ${val} 条`)
      this.form.size = val
      this.form.current = 1
      this.loadResoure()
    },
    handleCurrentChange (val: number) {
      console.log(`当前页: ${val}`)
      this.form.current = val
      this.loadResoure()
    }
  }
})
</script>

<style lang="scss" scoped></style>
