<template>
  <div class="table-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form ref="form" :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-input v-model="searchData" placeholder="请输入设备名称 / 设备类型" style="width: 300px" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" native-type="submit" @click="handleQuery" > 查询 </el-button>
            <el-button @click="restClick">重置</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-button icon="el-icon-plus" type="primary" @click="handleAdd" style="float: right" >添加设备类型</el-button>
      </vab-query-form-right-panel>
    </vab-query-form>
    <!-- 表格 数据 -->
    <div style="position: relative">
      <el-table ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" :height="height" border>
        <el-table-column v-if="itemArr.indexOf('设备名称') > -1" show-overflow-tooltip label="设备名称" prop="cdevicename" ></el-table-column>
        <el-table-column v-if="itemArr.indexOf('设备类型') > -1" show-overflow-tooltip label="设备类型" prop="cdevicetype"></el-table-column>
        <el-table-column v-if="itemArr.indexOf('点位前缀') > -1" show-overflow-tooltip label="点位前缀" prop="cdevicedatapointprefix"></el-table-column>
        <el-table-column v-if="itemArr.indexOf('设备类型描述') > -1" show-overflow-tooltip label="设备类型描述" prop="cdevicedesc" ></el-table-column>
        <el-table-column v-if="itemArr.indexOf('操作') > -1" show-overflow-tooltip label="操作" width="180px" >
          <template #default="{ row }">
            <el-button type="text" @click="goToEdit(row)">编辑 </el-button>
            <el-button type="text"  @click="toDelete(row)">删除 </el-button>
            <el-button type="text" @click="setDeviceDataPoint(row)">设置点位 </el-button>
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
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close" v-dialogDrag :close-on-click-modal="false" v-if="dialogFormVisible" >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备名称" prop="cdevicename">
          <el-input v-model="form.cdevicename" autocomplete="off"  placeholder="请输入设备名称"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" prop="cdevicetype">
          <el-input v-model="form.cdevicetype" autocomplete="off"  placeholder="请输入设备类型"></el-input>
        </el-form-item>
        <el-form-item label="点位前缀" prop="cdevicedatapointprefix">
          <el-input :disabled="dialogFlag == 'edit' ? true : false" v-model="form.cdevicedatapointprefix" autocomplete="off"  placeholder="请输入点位前缀"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="cdevicedesc" >
          <el-input v-model="form.cdevicedesc" autocomplete="off" type="textarea"  placeholder="请输入设备类型描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="save" >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getDeviceTypeList, deviceTypeUpdate, getComOneLevel } from '@/api/device'
  import * as assist from '@/utils/assist'
  export default {
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
        title: '', //弹窗名字
        dialogFormVisible: false,
        dialogFlag:'',
        currentRow:{},
        form: {
          cdevicename: '',
          cdevicetype: '',
          cdevicedesc: '',
          cdevicedatapointprefix: ''
        },
        rules: {
          cdevicename: [
            { required: true, trigger: 'blur', message: '请输入设备名称' },
          ],
          cdevicetype: [
            { required: true, trigger: 'blur', message: '请输入设备类型' },
          ],
          cdevicedesc: [
            { required: false, trigger: 'blur', message: '请输入设备类型描述' },
          ],
          cdevicedatapointprefix: [
            { required: true, trigger: 'blur', message: '请输入点位前缀' },
          ]
        },
        itemArr: ['设备名称', '设备类型', '点位前缀', '设备类型描述', '操作'],
        checkArr: ['设备名称', '设备类型', '点位前缀', '设备类型描述', '操作'],

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
      // 点击添加
      handleAdd() {
        this.title = '添加设备类型'
        this.dialogFlag = 'new'
        this.dialogFormVisible = true
      },
      //点击编辑
      goToEdit(row) {
        this.title = '编辑设备类型'
        this.dialogFlag = 'edit'
        this.dialogFormVisible = true
        this.currentRow = row //保存当前行数据
        //回显数据
        this.form.cdevicename = row.cdevicename
        this.form.cdevicetype = row.cdevicetype
        this.form.cdevicedesc = row.cdevicedesc
        this.form.cdevicedatapointprefix = row.cdevicedatapointprefix
      },
      // 弹窗关闭
      close() {
        this.$refs['form'].resetFields()
        this.dialogFormVisible = false
        this.dialogFlag = ''
        this.currentRow = {}
      },
      //点击 删除
      toDelete(row){
        this.$baseConfirm('你确定要删除当前行吗？', null, async () => {
          let params = {
            CallType: 'del',
            UserID: sessionStorage.getItem('UserID'),
            AppToken: '',
            cdtypeuid: row.cdtypeuid,
            cdevicename: row.cdevicename,
            cdevicetype: row.cdevicetype,
            cdevicedesc: row.cdevicedesc,
            cdevicedatapointprefix: row.cdevicedatapointprefix
          }
          this.submit(params,'del')
        })
      },
      // 弹窗确定
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            if(this.dialogFlag == 'edit'){ //编辑
              let params1 = {
                CallType: 'edit',  //保存编辑
                UserID: sessionStorage.getItem('UserID'),
                AppToken: '',
                cdtypeuid: this.currentRow.cdtypeuid,
                cdevicename: this.form.cdevicename,
                cdevicetype: this.form.cdevicetype,
                cdevicedesc: this.form.cdevicedesc,
                cdevicedatapointprefix: this.form.cdevicedatapointprefix
              }
              this.submit(params1)
            } else {  //新增
              //前缀查重
              let params = {
                CallType:'checkdpprefix',
                UserID: sessionStorage.getItem('UserID'),
                val1: this.form.cdevicedatapointprefix
              }
              const { Data } = await getComOneLevel(params)
              if(Data.length != 0){ //有重复
                this.$baseMessage('点位前缀重复，请重新填写！', 'warning')
                return
              } else if(Data.length == 0){ //无重复
                let params2 = {
                  CallType: 'new',
                  UserID: sessionStorage.getItem('UserID'),
                  AppToken: '',
                  cdtypeuid: this.getGuid(),
                  cdevicename: this.form.cdevicename,
                  cdevicetype: this.form.cdevicetype,
                  cdevicedesc: this.form.cdevicedesc,
                  cdevicedatapointprefix: this.form.cdevicedatapointprefix
                }
                this.submit(params2) //最后一步提交
              }
            }
          } else {
            return false
          }
        })
      },
      // 弹窗信息提交
      async submit(params,marker) {
        let result = await deviceTypeUpdate(params)
        if (result.Status == 0) {
          this.$baseMessage('操作成功', 'success')
          this.fetchData() //更新列表
          if(!marker){
            this.dialogFormVisible = false
            this.dialogFlag = ''
            this.currentRow = {}
            this.$refs['form'].resetFields()
          }
        }
      },
      //跳转页面
      setDeviceDataPoint(row) {
        //把本行数据保存到sessionStorage
        sessionStorage.setItem('deviceTypeDetail', JSON.stringify(row))
        this.$router.push({
          path: '/deviceManage/deviceDataPoint',
          query: {
            cdtypeuid: row.cdtypeuid,
          },
        })
      },
      // 查询列表信息
      async fetchData() {
        this.listLoading = true
        let params = {
          CallType: '',
          UserID: sessionStorage.getItem('UserID'),
          orguid:'',
          SearchKey: this.searchData,
          PageSize: this.pageSize,
          CurrentPage: this.currentPage,
        }
        const { Data, Count } = await getDeviceTypeList(params)
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
