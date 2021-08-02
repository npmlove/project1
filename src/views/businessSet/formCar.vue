<template>
  <div class="table-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form ref="form" :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-input v-model="searchData" placeholder="请输入" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" native-type="submit" @click="handleQuery">查询</el-button>
            <el-button @click="restClick">重置</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-button icon="el-icon-plus" type="primary" @click="handleAdd" style="float: right" >新增标准化</el-button>
      </vab-query-form-right-panel>
    </vab-query-form>

    <div style="position: relative" >
      <el-table ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" :height="height-70" border>
        <el-table-column v-if="itemArr.indexOf('表单名称') > -1" show-overflow-tooltip prop="formname" label="表单名称" ></el-table-column>
        <el-table-column v-if="itemArr.indexOf('创建人') > -1" show-overflow-tooltip prop="createdby" label="创建人" ></el-table-column>
        <el-table-column v-if="itemArr.indexOf('创建时间') > -1" show-overflow-tooltip prop="createddate" label="创建时间" ></el-table-column>
        <el-table-column label="操作" width="180px" >
          <template #default="{ row }">
            <el-button type="text" @click="toEdit(row,'编辑')">编辑 </el-button>
            <el-button type="text"  @click="toEdit(row,'查看')">查看 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-icon">
        <el-popover placement="bottom-start" trigger="click">
          <el-checkbox-group v-model="itemArr">
            <div class="checkbox-block">
              <el-checkbox v-for="item in checkArr" :label="item" :key="item"></el-checkbox>
            </div>
          </el-checkbox-group>
          <vab-icon slot="reference" :icon="['fas', 'cog']"></vab-icon>
        </el-popover>
      </div>
    </div>
    <el-pagination
      :background="background"
      :current-page="currentPage"
      :layout="layout"
      :page-size="pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
  </div>
</template>

<script>
  import { getFormList } from '@/api/businessSet'
  export default {
    data() {
      return {
        searchData: '',
        list: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        background: true,
        elementLoadingText: '正在加载...',
        pageSize: 10,
        currentPage: 1,
        total: 0,
        itemArr: ['表单名称', '创建人', '创建时间'],
        checkArr: ['表单名称', '创建人', '创建时间']
      }
    },
    computed: {
      height() {
        return this.$baseTableHeight()
      },
    },
    activated() {
      this.fetchData()
    },
    methods: {
      // 点击添加
      handleAdd() {
        this.$router.push('./formType')
      },
      // 点击编辑
      toEdit(row,type){
        if(type == '编辑'){
          this.$router.push({
            path: './formTypeEdit',
            query: {
              cfuid: row.cfuid
            }
          })
        }else if(type == '查看'){
          this.$router.push({
            path: './formTypeDetails',
            query: {
              cfuid: row.cfuid
            }
          })
        }
      },
      //页面多条件查询
      handleQuery() {
        this.currentPage = 1
        this.fetchData()
      },
      //重置
      restClick() {
        this.searchData = ''
        this.pageSize = 10
        this.currentPage = 1
        this.fetchData()
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.fetchData()
      },
      //查询页面列表
      async fetchData() {
        this.listLoading = true
        let params = {
          CallType: '',
          UserID: sessionStorage.getItem('UserID'),
          SearchKey: this.searchData,
          PageSize: this.pageSize,
          CurrentPage: this.currentPage,
        }
        const { Data, Count } = await getFormList(params)
        this.list = Data
        this.total = Count
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      },
    },
  }
</script>
<style scoped>
</style>
