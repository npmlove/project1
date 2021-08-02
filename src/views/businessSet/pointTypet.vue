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
        <el-button icon="el-icon-plus" type="primary" @click="handleAdd" style="float: right" >添加点位类型</el-button>
      </vab-query-form-right-panel>
    </vab-query-form>

    <div style="position: relative" >
      <el-table ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" :height="height-70" border>
        
        <el-table-column v-if="itemArr.indexOf('设备类型') > -1" show-overflow-tooltip prop="cdevicename" label="设备类型" ></el-table-column>
        <el-table-column v-if="itemArr.indexOf('类别名称') > -1" show-overflow-tooltip prop="dptypename" label="类别名称" ></el-table-column>
        <el-table-column v-if="itemArr.indexOf('类别描述') > -1" show-overflow-tooltip prop="dptypedesc" label="类别描述" ></el-table-column>
        <el-table-column v-if="itemArr.indexOf('操作') > -1" show-overflow-tooltip label="操作" width="180px" >
          <template #default="{ row }">
            <el-button type="text" @click="toEdit(row)">编辑 </el-button>
            <el-button type="text"  @click="toDel(row)">删除 </el-button>
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
    <!-- 弹窗 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close" v-dialogDrag :close-on-click-modal="false" v-if="dialogFormVisible" >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备类型" prop="deviceType">
          <el-select v-model="form.deviceType" placeholder="请选择设备类型" style="width: 350px" >
            <el-option v-for="item in deviceTypeArr" :key="item.cdtypeuid" :label="item.cdevicename" :value="item.cdtypeuid" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类别名称" prop="dptypename">
          <el-input v-model.trim="form.dptypename" autocomplete="off" placeholder="请输入点位类别名称"></el-input>
        </el-form-item>
        <el-form-item label="类别描述" prop="dptypedesc">
          <el-input v-model="form.dptypedesc" autocomplete="off" type="textarea" placeholder="请输入点位类别描述"></el-input>
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
  import { getDeviceDataPointTypeList, deviceDataPointTypeUpdate } from '@/api/businessSet'
  import { getDeviceTypeList } from '@/api/device'
  export default {
    name: 'ComprehensiveTable',
    components: {},
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
        itemArr: ['设备类型', '类别名称', '类别描述', '操作'],
        checkArr: ['设备类型', '类别名称', '类别描述', '操作'],
        currentRow:{},
        title:'',
        dialogFlag:'',
        dialogFormVisible: false,

        form: {
          dptypename: '',
          dptypedesc:'',
          deviceType:'',
        },
        deviceTypeArr:[],
        rules: {
          deviceType: [
            { required: false, trigger: 'blur', message: '请选择设备类型' },
          ],
          dptypename: [
            { required: true, trigger: 'blur', message: '请输入点位类别名称' },
          ],
          dptypedesc: [
            { required: false, trigger: 'blur', message: '请填写备注' },
          ],
        },

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
    beforeDestroy() {},
    mounted() {},
    methods: {
      getGuid() {
        function S4() {
          return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        }
        return ( S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4() )
      },
      async queryDeviceType() {
        let params = {
          CallType: '',
          UserID: sessionStorage.getItem('UserID'),
          orguid:'',
          SearchKey: '',
          PageSize: '',
          CurrentPage: '',
        }
        const { Data} = await getDeviceTypeList(params)
        this.deviceTypeArr = Data
      },
      // 点击添加
      handleAdd() {
        this.queryDeviceType()  //查询设备类型数组
        this.title = '添加点位类型'
        this.dialogFormVisible = true
        this.dialogFlag = 'new'
      },
      // 点击编辑
      toEdit(row){
        this.title = '编辑点位类型'
        this.dialogFormVisible = true
        this.dialogFlag = 'edit'
        this.currentRow = row
        this.form.dptypename = row.dptypename
        this.form.dptypedesc = row.dptypedesc
      },
      // 点击删除
      toDel(row){
        this.$baseConfirm('你确定要删除当前行吗？', null, async () => {
          let params = {
            CallType: 'del',
            UserID: sessionStorage.getItem('UserID'),
            dptypeuid: row.dptypeuid,
            cdtypeuid:'',
            dptypename: row.dptypename,
            dptypedesc: row.dptypedesc
          }
          let result = await deviceDataPointTypeUpdate(params)
          this.$baseMessage('删除成功', 'success')
          this.fetchData()
        })
      },
      // 弹窗关闭
      close() {
        this.$refs['form'].resetFields()
        this.dialogFormVisible = false
        this.title = ''
        this.dialogFlag = ''
        this.currentRow = {}
      },
      //弹窗 提交、保存
      save(status){
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            let params = {
              CallType: this.dialogFlag == 'new' ? 'new' : 'edit',
              UserID: sessionStorage.getItem('UserID'),
              dptypeuid: this.dialogFlag == 'new' ? this.getGuid(): this.currentRow.dptypeuid,
              cdtypeuid: this.form.deviceType,
              dptypename: this.form.dptypename,
              dptypedesc: this.form.dptypedesc
            }
            this.sumbitSave(params)
          } else {
            return false
          }
        })
      },
      //处理报警结果保存
      async sumbitSave(params){
        let result = await deviceDataPointTypeUpdate(params)
        if (result.Status == 0) {
          this.$baseMessage('操作成功', 'success')
          this.close()
          this.fetchData() //更新列表
        } else {
          this.$baseMessage(result.Message, 'info')
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
          CallType: 'all',
          UserID: sessionStorage.getItem('UserID'),
          cdtypeuid: '',
          SearchKey: this.searchData,
          PageSize: this.pageSize,
          CurrentPage: this.currentPage,
        }
        const { Data, Count } = await getDeviceDataPointTypeList(params)
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
