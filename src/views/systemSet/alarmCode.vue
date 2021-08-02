<template>
  <div class="table-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form ref="form" :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-input v-model="searchData" placeholder="请输入报警名称 / 报警代码" style="width: 300px" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" native-type="submit" @click="handleQuery" > 查询 </el-button>
            <el-button @click="restClick">重置</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-button icon="el-icon-plus" type="primary" @click="handleAdd" style="float: right" >添加</el-button>
      </vab-query-form-right-panel>
    </vab-query-form>
    <!-- 表格 数据 -->
    <div style="position: relative">
      <el-table ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" :height="height" border>
        <el-table-column v-if="itemArr.indexOf('报警名称') > -1" show-overflow-tooltip label="报警名称" prop="alarmname" ></el-table-column>
        <el-table-column v-if="itemArr.indexOf('报警代码') > -1" show-overflow-tooltip label="报警代码" prop="alarmcode"></el-table-column>
        <el-table-column v-if="itemArr.indexOf('报警描述') > -1" show-overflow-tooltip label="报警描述" prop="alarmdesc" ></el-table-column>
        <el-table-column v-if="itemArr.indexOf('创建人') > -1" show-overflow-tooltip label="创建人" prop="createdby"></el-table-column>
        <el-table-column v-if="itemArr.indexOf('创建时间') > -1" show-overflow-tooltip label="创建时间" prop="createddate"></el-table-column>
        <el-table-column v-if="itemArr.indexOf('操作') > -1" show-overflow-tooltip label="操作" width="180px" >
          <template #default="{ row }">
            <el-button type="text" @click="goToEdit(row)">编辑 </el-button>
            <el-button type="text" @click="deleteRow(row)">删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-icon">
        <el-popover placement="bottom-start" trigger="click">
          <el-checkbox-group v-model="itemArr">
            <div class="checkbox-block">
              <el-checkbox v-for="item in checkArr" :label="item" :key="item" ></el-checkbox>
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
    <!-- 弹窗 -->
    <el-dialog title="新增报警代码" :visible.sync="dialogFormVisible" width="500px" @close="close" v-dialogDrag :close-on-click-modal="false" v-if="dialogFormVisible" >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="报警代码" prop="alarmCode" :disabled="dialogFlag == 'edit' ? 'true' : 'false'">
          <el-input v-model.trim="form.alarmCode" autocomplete="off" placeholder="请输入报警代码"></el-input>
        </el-form-item>
        <el-form-item label="报警名称" prop="alarmName">
          <el-input v-model.trim="form.alarmName" autocomplete="off" placeholder="请输入报警名称"></el-input>
        </el-form-item>
        <el-form-item label="报警描述" prop="alarmDesc">
          <el-input v-model="form.alarmDesc" autocomplete="off" type="textarea" placeholder="请输入报警描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getSYSAlarmCodeList, sysAlarmkCodeUpdate } from '@/api/alarmCode'
  import * as assist from '@/utils/assist'
  export default {
    name: 'ComprehensiveTable',
    components: {},
    data() {
      return {
        searchData: '',
        list: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        background: true,
        elementLoadingText: '正在加载...',
        pageSize: 10,
        currentPage: 1,

        form: {
          alarmCode: '',
          alarmName: '',
          alarmDesc: ''
        },
        rules: {
          alarmCode: [
            { required: true, trigger: 'blur', message: '请输入报警代码' },
          ],
          alarmName: [
            { required: true, trigger: 'blur', message: '请输入报警名称' },
          ],
          alarmDesc: [
            { required: false, trigger: 'blur', message: '请输入报警描述' },
          ],
        },
        dialogFormVisible: false,
        dialogFlag:'',
        currentRow:{},
        itemArr: ['报警名称', '报警代码', '报警描述', '创建人', '创建时间', '操作'],
        checkArr: ['报警名称', '报警代码', '报警描述', '创建人', '创建时间', '操作'],
        operationArr: [],
      }
    },
    computed: {
      height() {
        return this.$baseTableHeight()
      }
    },
    mounted() {
      // this.operationArr = assist.operation('otaList')
    },
    activated() {
      this.fetchData()
    },
    methods: {
      getGuid() {
        function S4() {
          return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        }
        return ( S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4() )
      },
      //点击删除按钮
      deleteRow(row){
        this.$baseConfirm('你确定要删除当前行吗？', null, async () => {
         let params = {
           CallType: 'del',
           UserID: sessionStorage.getItem('UserID'),
           AppToken: '',
           alarmcodeuid: row.alarmcodeuid,
           alarmcode: row.alarmcode,
           alarmname: row.alarmname,
           alarmdesc: row.alarmdesc,
         }
         let result = await sysAlarmkCodeUpdate(params)
         if (result.Status == 0) {
           this.$baseMessage('删除成功', 'success')
           this.fetchData() //更新列表
         }
        })
      },
      //点击编辑
      goToEdit(row) {
        this.dialogFormVisible = true
        this.currentRow = row
        this.dialogFlag = 'edit'
        this.form.alarmName = row.alarmname
        this.form.alarmCode = row.alarmcode
        this.form.alarmDesc = row.alarmdesc
      },

      // 点击添加
      handleAdd() {
        this.dialogFlag = 'new'
        this.dialogFormVisible = true
      },
      // 弹窗关闭
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
        this.$emit('fetch-data')
        this.dialogFlag = ''
      },
      // 弹窗确定
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            let params = {
              CallType: this.dialogFlag == 'new' ? 'new' : 'edit',
              UserID: sessionStorage.getItem('UserID'),
              AppToken: '',
              alarmcodeuid: this.dialogFlag == 'new' ? this.getGuid() : this.currentRow.alarmcodeuid,
              alarmcode: this.form.alarmCode,
              alarmname: this.form.alarmName,
              alarmdesc: this.form.alarmDesc,
            }
            this.dialogFormVisible = false
            this.$refs['form'].resetFields()
            this.form = this.$options.data().form
            this.submit(params) //最后一步提交
          } else {
            return false
          }
        })
      },
      // 弹窗信息提交
      async submit(params) {
        let result = await sysAlarmkCodeUpdate(params)
        if (result.Status == 0) {
          this.$baseMessage('保存成功', 'success')
          this.fetchData() //更新列表
        } else {
          this.$baseMessage(result.Message, 'info')
        }
      },
      // 查询列表信息
      async fetchData() {
        this.listLoading = true
        let params = {
          CallType: '',
          UserID: sessionStorage.getItem('UserID'),
          status: '',
          SearchKey: this.searchData,
          PageSize: this.pageSize,
          CurrentPage: this.currentPage,
        }
        const { Data, Count } = await getSYSAlarmCodeList(params)
        this.list = Data
        this.total = Count
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      },
      // 分页
      handleSizeChange(val) {
        this.pageSize = val
        this.fetchData()
      },
      // 分页
      handleCurrentChange(val) {
        this.currentPage = val
        this.fetchData()
      },
      //条件查询
      handleQuery() {
        this.currentPage = 1
        this.fetchData()
      },
      // 重置
      restClick() {
        this.searchData = ''
        this.pageSize = 10
        this.currentPage = 1
        this.fetchData()
      },
    },
  }
</script>
