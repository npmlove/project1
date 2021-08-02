<template>
  <div class="table-container">
    <el-form :label-position="labelPosition" :inline="true" size="medium" class="demo-form-inline" style="padding-left: 0px">
      <!-- 详情展示 -->
      <div class="rest-style">
        <el-form-item label="文件名称" label-width="120px" required>
          <el-input :disabled="true" v-model="details.filetruename" style="width: 230px"></el-input>
        </el-form-item>
        <el-form-item label="文件类型" required label-width="120px">
          <el-input :disabled="true" v-model="details.filetype" style="width: 230px" ></el-input>
        </el-form-item>
        <el-form-item label="文件版本" required label-width="120px">
          <el-input :disabled="true" v-model="details.filever" style="width: 230px" ></el-input>
        </el-form-item>
        <el-form-item label="文件描述" label-width="120px" required>
          <el-input :disabled="true" v-model="details.filedesc" style="width: 230px" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" ></el-input>
        </el-form-item>
      </div>
    </el-form>
    <!-- 表格查询 -->
    <vab-query-form>
      <el-form ref="form" :inline="true" @submit.native.prevent>
        <el-form-item>
          <el-input v-model="searchData" placeholder="请输入设备SN" />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" native-type="submit" @click="handleQuery">查询</el-button>
          <el-button @click="restClick">重置</el-button>
        </el-form-item>
        <el-button type="primary" style="float: right" @click="onClickOpenDialog()" >下发升级任务</el-button>
      </el-form>
    </vab-query-form>
    <!-- 表格 -->
    <el-tabs type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="待升级">
        <div style="position: relative">
          <el-table ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" :height="height" border>
            <!-- <el-table-column v-if="itemArr.indexOf('设备SN') > -1" show-overflow-tooltip prop="devicesn" label="设备SN" ></el-table-column> -->
            <el-table-column  v-if="itemArr.indexOf('设备SN') > -1" label="设备SN" prop="devicesn" show-overflow-tooltip>
              <template slot-scope="scope">
                <router-link :to="{path:'deviceDetails',query:{devicesn:scope.row.devicesn,stauid:scope.row.stauid}}" class="link-type">
                  <span>{{ scope.row.devicesn }}</span>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column v-if="itemArr.indexOf('设备名称') > -1" show-overflow-tooltip prop="devicename" label="设备名称" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('设备类型') > -1" show-overflow-tooltip prop="devicetype" label="设备类型" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('创建人') > -1" show-overflow-tooltip label="创建人" prop="createdby2" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('创建日期') > -1" show-overflow-tooltip label="创建日期" prop="createddate" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('状态') > -1" show-overflow-tooltip label="状态" prop="otastatusStr" ></el-table-column>
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
      </el-tab-pane>
      <el-tab-pane label="下载已完成">
        <div style="position: relative">
          <el-table ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" :height="height" border>
            <!-- <el-table-column v-if="itemArr.indexOf('设备SN') > -1" show-overflow-tooltip prop="devicesn" label="设备SN" ></el-table-column> -->
            <el-table-column  v-if="itemArr.indexOf('设备SN') > -1" label="设备SN" prop="devicesn" show-overflow-tooltip>
              <template slot-scope="scope">
                <router-link :to="{path:'deviceDetails',query:{devicesn:scope.row.devicesn,stauid:scope.row.stauid}}" class="link-type">
                  <span>{{ scope.row.devicesn }}</span>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column v-if="itemArr.indexOf('设备名称') > -1" show-overflow-tooltip prop="devicename" label="设备名称" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('设备类型') > -1" show-overflow-tooltip prop="devicetype" label="设备类型" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('创建人') > -1" show-overflow-tooltip label="创建人" prop="createdby2" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('创建日期') > -1" show-overflow-tooltip label="创建日期" prop="createddate" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('下载完成时间') > -1" show-overflow-tooltip label="下载完成时间" prop="finisheddownloaddatetime" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('状态') > -1" show-overflow-tooltip label="状态" prop="otastatusStr" ></el-table-column>
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
      </el-tab-pane>
      <el-tab-pane label="升级已完成">
        <div style="position: relative">
          <el-table ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" :height="height" border>
            <!-- <el-table-column v-if="itemArr.indexOf('设备SN') > -1" show-overflow-tooltip prop="devicesn" label="设备SN" ></el-table-column> -->
            <el-table-column  v-if="itemArr.indexOf('设备SN') > -1" label="设备SN" prop="devicesn" show-overflow-tooltip>
              <template slot-scope="scope">
                <router-link :to="{path:'deviceDetails',query:{devicesn:scope.row.devicesn,stauid:scope.row.stauid}}" class="link-type">
                  <span>{{ scope.row.devicesn }}</span>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column v-if="itemArr.indexOf('设备名称') > -1" show-overflow-tooltip prop="devicename" label="设备名称" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('设备类型') > -1" show-overflow-tooltip prop="devicetype" label="设备类型" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('创建人') > -1" show-overflow-tooltip label="创建人" prop="createdby2" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('创建日期') > -1" show-overflow-tooltip label="创建日期" prop="createddate" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('升级完成时间') > -1" show-overflow-tooltip label="升级完成时间" prop="lastupgradedatetime" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('状态') > -1" show-overflow-tooltip label="状态" prop="otastatusStr" ></el-table-column>
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
      </el-tab-pane>
      <el-tab-pane label="已取消">
        <div style="position: relative">
          <el-table ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" :height="height" border>
            <!-- <el-table-column v-if="itemArr.indexOf('设备SN') > -1" show-overflow-tooltip prop="devicesn" label="设备SN" ></el-table-column> -->
            <el-table-column  v-if="itemArr.indexOf('设备SN') > -1" label="设备SN" prop="devicesn" show-overflow-tooltip>
              <template slot-scope="scope">
                <router-link :to="{path:'deviceDetails',query:{devicesn:scope.row.devicesn,stauid:scope.row.stauid}}" class="link-type">
                  <span>{{ scope.row.devicesn }}</span>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column v-if="itemArr.indexOf('设备名称') > -1" show-overflow-tooltip prop="devicename" label="设备名称" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('设备类型') > -1" show-overflow-tooltip prop="devicetype" label="设备类型" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('创建人') > -1" show-overflow-tooltip label="创建人" prop="createdby2" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('创建日期') > -1" show-overflow-tooltip label="创建日期" prop="createddate" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('状态') > -1" show-overflow-tooltip label="状态" >
              <template #default="{ row }">
                <span v-if="row.otastatus == 0">待升级</span>
                <span v-if="row.otastatus == 100">已完成</span>
                <span v-if="row.otastatus == -100">已取消</span>
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
       </el-tab-pane>
      <el-pagination
        :background="background"
        :current-page="currentPage"
        :layout="layout"
        :page-size="pageSize"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      ></el-pagination>
    </el-tabs>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="800px" @close="close" v-dialogDrag :close-on-click-modal="false" v-if="dialogFormVisible">
      <!-- <vab-query-form> -->
        <el-form ref="form" :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-input v-model="dialogSearchData" placeholder="请输入设备SN" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" native-type="submit" @click="queryDeviceList">查询</el-button>
            <el-button @click="dialogRestClick">重置</el-button>
          </el-form-item>
        </el-form>
      <!-- </vab-query-form> -->
      <el-table v-loading="listLoading" :data="dialogTableList" :element-loading-text="elementLoadingText" height="320" @selection-change="setSelectRows" border>
        <el-table-column how-overflow-tooltip type="selection" width="55"></el-table-column>
        <el-table-column show-overflow-tooltip prop="devicesn" label="设备SN"></el-table-column>
        <el-table-column show-overflow-tooltip label="设备名称" prop="devicename" width="120"></el-table-column>
        <el-table-column show-overflow-tooltip label="设备类型" prop="devicetype" width="120"></el-table-column>
        <el-table-column show-overflow-tooltip label="创建人" prop="createdby" width="120"></el-table-column>
        <el-table-column show-overflow-tooltip label="创建日期" prop="createddate" width="150"></el-table-column>
      </el-table>
      <el-pagination
        :background="background"
        :current-page="dialogTableCurrentPage"
        :layout="layout"
        :page-size="dialogTablePageSize"
        :total="dialogTableTotal"
        @current-change="handleCurrentChangeDialogTable"
        @size-change="handleSizeChangeDialogTable"
      ></el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getDeviceList, getOTATaskList, OTATaskUpd } from '@/api/device'
  export default {
    name: 'ComprehensiveTable',
    components: {},
    data() {
      return {
        labelPosition: 'right',
        searchData: '',
        dialogSearchData: '',
        list: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        background: true,
        selectRows: '',
        elementLoadingText: '正在加载...',
        details: {},
        pageSize: 10,
        currentPage: 1,
        total: 0,
        title: '', //弹窗名字
        dialogFormVisible: false,
        dialogTableList: [], //弹窗里表格
        //弹窗里面的分页
        dialogTableCurrentPage: 1,
        dialogTablePageSize: 10,
        dialogTableTotal: 0,
        itemArr: ['设备SN', '设备名称', '设备类型', '创建人', '创建日期', '状态','下载完成时间', '升级完成时间'],
        checkArr: ['设备SN', '设备名称', '设备类型', '创建人', '创建日期', '状态'],
        status: 0,
      }
    },
    computed: {
      height() {
        return this.$baseTableHeight()
      },
    },
    // created() {
    //   this.fetchData()
    // },
    activated() {
      this.fetchData()
      let details = JSON.parse(sessionStorage.getItem('otadetail'))
      this.details = details
    },
    beforeDestroy() {},
    mounted() {
      //获取文件详情
      // let details = JSON.parse(sessionStorage.getItem('otadetail'))
      // this.details = details
    },
    methods: {
      getGuid() {
        function S4() {
          return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        }
        return ( S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4() )
      },
      //点击tab
      handleTabClick(e) {
        this.pageSize = 10
        this.currentPage = 1
        if (e.label == '待升级') {
          this.status = 0
          this.checkArr = ['设备SN', '设备名称', '设备类型', '创建人', '创建日期', '状态']
        } else if (e.label == '下载已完成') {
          this.status = 100
          this.checkArr.indexOf('升级完成时间') > -1 ? this.checkArr.splice(this.checkArr.indexOf('升级完成时间'),1) : ''
          this.checkArr.indexOf('下载完成时间') > -1 ? '' : this.checkArr.push('下载完成时间')
        }else if (e.label == '升级已完成') {
          this.status = 1000
          this.checkArr.indexOf('下载完成时间') > -1 ? this.checkArr.splice(this.checkArr.indexOf('下载完成时间'),1) : ''
          this.checkArr.indexOf('升级完成时间') > -1 ? '' : this.checkArr.push('升级完成时间')
        } else if (e.label == '已取消') {
          this.status = -100
          this.checkArr = ['设备SN', '设备名称', '设备类型', '创建人', '创建日期', '状态']
        }
        this.fetchData()
      },
      //点击 打开弹窗
      onClickOpenDialog() {
        this.title = '选择下发升级任务的设备'
        this.dialogFormVisible = true
        //查询设备列表
        this.queryDeviceList()
      },
      // 弹窗关闭
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
        this.$emit('fetch-data')
      },
      // 弹窗确定
      save() {
        let ids = []
        for (let i = 0; i < this.selectRows.length; i++) {
          // ids.push("'" + this.selectRows[i].stauid + "'")
          ids.push(this.selectRows[i].stauid)
        }
        //组装 下发升级任务 参数
        let params = {
          CallType: 'new',
          UserID: sessionStorage.getItem('UserID'),
          AppToken: '',
          ufileuid: this.$route.query.ufileuid,
          otabatchuid: this.getGuid(),
          uids: ids.join(','),
        }
        //下发升级任务
        this.taskSubmit(params)
      },
      //弹窗内表格选择
      setSelectRows(val) {
        this.selectRows = val
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
      //弹窗内的重置
      dialogRestClick() {
        this.dialogSearchData = ''
        this.dialogTablePageSize = 10
        this.dialogTableCurrentPage = 1
        this.queryDeviceList()
      },
      // 页面表格分页---start----
      handleSizeChange(val) {
        this.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.fetchData()
      },
      // 页面表格分页---end----
      // 弹窗表格分页---start----
      handleSizeChangeDialogTable(val) {
        this.dialogTablePageSize = val
        this.queryDeviceList()
      },
      handleCurrentChangeDialogTable(val) {
        this.dialogTableCurrentPage = val
        this.queryDeviceList()
      },
      // 弹窗表格分页---end----
      //查询弹窗中的列表
      async queryDeviceList() {
        let params = {
          CallType: 'paging',
          UserID: sessionStorage.getItem('UserID'),
          PageSize: this.dialogTablePageSize,
          CurrentPage: this.dialogTableCurrentPage,
          SearchKey: this.dialogSearchData,
        }
        const { Data, Count } = await getDeviceList(params)
        this.dialogTableList = Data
        this.dialogTableTotal = Count
      },
      //查询页面列表
      async fetchData() {
        this.listLoading = true
        let params = {
          CallType: 'all',
          UserID: sessionStorage.getItem('UserID'),
          SearchKey: this.searchData,
          filetype: '',
          status: this.status,
          PageSize: this.pageSize,
          CurrentPage: this.currentPage,
          ufileuid: this.$route.query.ufileuid,
        }
        const { Data, Count } = await getOTATaskList(params)
        this.list = Data
        this.total = Count
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      },
      //下发升级任务
      async taskSubmit(params) {
        const result = await OTATaskUpd(params)
        if (result.Status == 0) {
          this.$baseMessage('操作成功', 'success')
          this.dialogFormVisible = false
          this.selectRows = []
          this.fetchData()
        } else {
          this.$baseMessage(Message, 'error')
        }
        //接口异常会在 request.js 请求时被拦截，不会传到页面，所以不用加判断
        // else {
        //   this.$baseMessage(result.Message, 'error')
        //   this.dialogFormVisible = false
        //   this.selectRows = []
        // }
      },
    },
  }
</script>
<style scoped>
  /* 禁止输入框样式 */
  div /deep/ .el-input.is-disabled .el-input__inner {
    color: #303133;
    cursor: default;
    /* background-color: rgb(255 255 255 / 95%);
    border-color: rgb(255 255 255 / 95%);
    color: #303133;
    cursor: default; */
  }
  div /deep/ .el-textarea.is-disabled .el-textarea__inner {
    color: #303133;
    cursor: default;
  }
  div /deep/.el-dialog__body {
    padding: 10px 20px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
  }
  div /deep/.el-dialog {
    margin-top: 8vh !important;
    width: 800px;
    overflow: auto;
  }
  div /deep/ .el-checkbox__inner {
    border: 1px solid #909399;
  }
</style>
