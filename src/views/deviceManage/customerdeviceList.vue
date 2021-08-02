<template>
  <div class="table-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form ref="form" :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-input v-model="searchData" placeholder="请输入设备SN" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" native-type="submit" @click="handleQuery" >查询</el-button>
            <el-button @click="restClick">重置</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>
    <div style="position: relative">
      <el-table ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" :height="height" border>
         <el-table-column  v-if="itemArr.indexOf('设备SN') > -1" label="设备SN" prop="devicesn" show-overflow-tooltip>
            <template slot-scope="scope">
              <router-link :to="{path:'deviceDetails',query:{devicesn:scope.row.devicesn,stauid:scope.row.stauid}}" class="link-type">
                <span>{{ scope.row.devicesn }}</span>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column v-if="itemArr.indexOf('设备名称') > -1" show-overflow-tooltip label="设备名称" prop="devicename" ></el-table-column>
          <el-table-column v-if="itemArr.indexOf('设备类型') > -1" show-overflow-tooltip label="设备类型" prop="devicetype" ></el-table-column>
          <el-table-column v-if="itemArr.indexOf('设备状态') > -1" show-overflow-tooltip label="设备状态" prop="astatus">
            <template #default="{ row }">
              <el-tag :type="row.astatus == 1 ? 'success' : 'info'">{{ row.astatus == 0 ? '离线' : '在线' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-if="itemArr.indexOf('所属组织') > -1" show-overflow-tooltip label="所属组织" prop="orgname"></el-table-column>
          <el-table-column v-if="itemArr.indexOf('创建人') > -1" show-overflow-tooltip label="创建人" prop="createdby"></el-table-column>
          <el-table-column v-if="itemArr.indexOf('创建日期') > -1" show-overflow-tooltip label="创建日期" prop="createddate" ></el-table-column>
          <el-table-column v-if="itemArr.indexOf('操作') > -1" show-overflow-tooltip label="操作" >
            <template #default="{ row }">
               <el-button v-if="row.canBingdOrg == 1" :class="[row.corguid == '' ? 'fontColor' : 'fontDisabledColor']" type="text" @click="bindDevice(row)">
                {{ row.corguid == '' ? '分配设备' : '已分配设备' }}
              </el-button>
              <el-button type="text" @click="onClickRecord(row)"> 登录日志 </el-button>
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
    <!-- 分页 -->
    <el-pagination :background="background" :current-page="currentPage" :layout="layout" :page-size="pageSize" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" ></el-pagination>
    <!-- 弹窗选择设备 -->
    <el-dialog title="分配设备" :visible.sync="dialogFormVisible" width="400px">
      <el-form ref="form" label-width="50px">
        <el-form-item label="组织" >
          <el-select v-model="ruleForm.orguid" clearable placeholder="请选择组织" @clear="handleClear" ref="selectUpResId" style="width: 280px;">
            <el-option hidden key="orguid" :value="ruleForm.orguid" :label="ruleForm.Department"></el-option>
            <el-tree :data="treeArr" @node-click="handleNodeClick" :props="defaultProps" :expand-on-click-node="false" :check-on-click-node="true" default-expand-all></el-tree>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="close">取 消</el-button>
        <el-button type="primary" :disabled="ruleForm.orguid == ''" @click="submitBind">确 定</el-button>
      </div>
    </el-dialog>
    <!-- drawer 弹窗 设备登录日志 -->
    <el-drawer title="设备登录日志" :visible.sync="drawerTable" direction="rtl" size="40%" >
      <el-table ref="tableSort" v-loading="listLoading" :data="logList" :element-loading-text="elementLoadingText" :height="height" border style="padding: 10px 20px;">
        <el-table-column show-overflow-tooltip label="状态" prop="loginstatusStr" ></el-table-column>
        <el-table-column show-overflow-tooltip label="操作时间" prop="logindate" ></el-table-column>
      </el-table>
      <el-pagination :background="background" :current-page="drawerTableCurrentPage" :layout="layout" :page-size="drawerTablePageSize" :total="drawerTableTotal" @current-change="handleDrawerCurrentChange" @size-change="handleDrawerSizeChange" ></el-pagination>
    </el-drawer>
  </div>
</template>

<script>
  import { getDeviceList, getComOneLevel, accessoryOrgUpd, getDeviceLoginLogList } from '@/api/device'
  import { getCompanyOrgList } from '@/api/user'
  export default {
    name: 'ComprehensiveTable',
    components: {},
    data() {
      return {
        dialogFormVisible: false,
        searchData: '',
        list: [],
        imageList: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        background: true,
        elementLoadingText: '正在加载...',
        pageSize: 10,
        currentPage: 1,
        total: 0,
        itemArr: [ '设备SN', '设备名称', '设备类型', '设备状态', '所属组织', '创建人', '创建日期', '操作'],
        checkArr: [ '设备SN', '设备名称', '设备类型', '设备状态', '所属组织', '创建人', '创建日期', '操作'],
        currentRow:{},
        treeArr:[],
        ruleForm: {
          Department: '',
          orguid:'',
        },
        defaultProps: {
          children: "children",
          label: "orgname",
        },
        logList:[],
        drawerTable:false,
        drawerTablePageSize: 10,
        drawerTableCurrentPage: 1,
        drawerTableTotal: 0,
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
      handleSizeChange(val) {
        this.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.fetchData()
      },
      handleQuery() {
        this.currentPage = 1
        this.fetchData()
      },
      // 点击重置
      restClick() {
        this.searchData = ''
        this.pageSize = 10
        this.currentPage = 1
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        let params = {
          CallType: 'paging',
          UserID: sessionStorage.getItem('UserID'),
          SearchKey: this.searchData,
          PageSize: this.pageSize,
          CurrentPage: this.currentPage,
        }
        const { Data, Count } = await getDeviceList(params)
        this.list = Data
        this.total = Count
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      },
      //查看日志
      onClickRecord(row){
        this.drawerTable = true
        this.currentRow = row
        this.queryRecord()
      },
      //查询 日志信息
      async queryRecord (){
        let params = {
          CallType: '',
          UserID: sessionStorage.getItem('UserID'),
          devicesn: this.currentRow.devicesn,
          SearchKey: '',
          PageSize: this.drawerTablePageSize,
          CurrentPage: this.drawerTableCurrentPage,
        }
        const result = await getDeviceLoginLogList(params)
        if(result.Status == 0){
          this.logList = result.Data
          this.drawerTableTotal = result.Count
        } else {
          this.$baseMessage(result.Message, 'error')
        }
      },
      // 日志信息 分页
      handleDrawerSizeChange(val) {
        this.drawerTablePageSize = val
        this.queryRecord()
      },
      // 日志信息 分页
      handleDrawerCurrentChange(val) {
        this.drawerTableCurrentPage = val
        this.queryRecord()
      },

      //点击绑定设备
      bindDevice(row){
        if (row.corguid != '') {
          return
        } else
        if(row.canBingdOrg != 1){
          this.$baseMessage('您没有操作权限，请联系管理员设置', 'error')
          return
        }

        this.ruleForm.Department = ''
        this.ruleForm.orguid = ''
        this.currentRow = row
        this.dialogFormVisible = true
        //查询一级组织
        this.getCompanyOneLevel()
      },
      async getCompanyOneLevel() {
        let params = {
          CallType: 'all',
          UserID: sessionStorage.getItem('UserID'),
        }
        // const { Data, Count } = await getComOneLevel(params)
        const { Status, Data } = await getCompanyOrgList(params)
        this.treeArr = []
        this.treeArr.push(Data)
      },
      // 树选择清空
      handleClear() {
        // 将选择器的值置空
        this.ruleForm.Department = ''
        this.ruleForm.orguid = ''
      },
      //选择树
      handleNodeClick(data) {
        // 这里主要配置树形组件点击节点后，设置选择器的值；自己配置的数据，仅供参考
        this.ruleForm.Department = data.orgname
        this.ruleForm.orguid = data.orguid
        // 选择器执行完成后，使其失去焦点隐藏下拉框的效果
        this.$refs.selectUpResId.blur()
      },
      // 弹窗关闭
      close() {
        this.$refs['form'].resetFields()
        this.dialogFormVisible = false
        this.ruleForm.orguid = ''
        // this.group = ''
        // this.groupArr = []
        this.treeArr = []
      },
      //弹窗确定
      submitBind(){
        let params = {
          CallType: 'firstbind',
          UserID: sessionStorage.getItem('UserID'),
          // orguid:this.group,
          orguid:this.ruleForm.orguid,
          uids:this.currentRow.stauid, //当前设备stauid
        }
        this.saveBind(params)
      },
      async saveBind(params) {
        const { Status } = await accessoryOrgUpd(params)
        if(Status == 0){
          this.dialogFormVisible = false
          this.ruleForm.orguid = ''
          this.ruleForm.Department = ''
          // this.group = ''
          // this.groupArr = []
          this.treeArr = []
          this.$baseMessage('分配成功', 'success')
          this.fetchData()
        }

      },

    },
  }
</script>
<style lang="scss" scoped>
  .fontColor {
    color: $base-color-blue;
  }
  .fontDisabledColor {
    color: #ccc;
  }
</style>
