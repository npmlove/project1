<template>
  <div class="table-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form ref="form" :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-input v-model="searchData" placeholder="请输入设备SN" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" native-type="submit" @click="handleQuery">查询</el-button>
            <el-button @click="restClick">重置</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>
    <el-tabs type="border-card" @tab-click="handleTabClick" >
      <el-tab-pane label="待升级" >
        <div style="position: relative" >
          <el-table ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" :height="height-70" border>
            <el-table-column  v-if="itemArr.indexOf('设备SN') > -1" label="设备SN" prop="devicesn" show-overflow-tooltip>
              <template slot-scope="scope">
                <router-link :to="{path:'deviceDetails',query:{devicesn:scope.row.devicesn,stauid:scope.row.stauid}}" class="link-type">
                  <span>{{ scope.row.devicesn }}</span>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column v-if="itemArr.indexOf('设备名称') > -1" show-overflow-tooltip prop="devicename" label="设备名称"></el-table-column>
            <el-table-column v-if="itemArr.indexOf('设备类型') > -1" show-overflow-tooltip prop="devicetype" label="设备类型" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('文件类型') > -1" show-overflow-tooltip prop="filetype" label="文件类型" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('文件名称') > -1" show-overflow-tooltip prop="filetruename" label="文件名称" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('文件版本') > -1" show-overflow-tooltip prop="filever" label="文件版本" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('文件描述') > -1" show-overflow-tooltip prop="filedesc" label="文件描述" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('下发人') > -1" show-overflow-tooltip label="下发人" prop="createdby" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('下发时间') > -1" show-overflow-tooltip label="下发时间" prop="createddate" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('状态') > -1" show-overflow-tooltip label="状态" prop="otastatusStr" ></el-table-column>
            <el-table-column show-overflow-tooltip v-if="itemArr.indexOf('升级进度') > -1" label="升级进度">
              <template #default="{ row }">
                <el-progress :percentage="Number(row.progress)"></el-progress>
              </template>
            </el-table-column>
            <el-table-column v-if="itemArr.indexOf('升级信息') > -1" show-overflow-tooltip label="升级信息" prop="lastotamsg" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('操作') > -1" show-overflow-tooltip label="操作" width="220px">
              <template #default="{ row }">
                <el-button type="text" @click="queryProgress(row)"> 查看更新进度</el-button>
                <el-button type="text" @click="cancelTask(row)">取消升级任务</el-button>
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
      </el-tab-pane>
      <el-tab-pane label="下载已完成">
        <div style="position: relative">
          <el-table ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" :height="height-70" border>
            <el-table-column  v-if="itemArr.indexOf('设备SN') > -1" label="设备SN" prop="devicesn" show-overflow-tooltip>
              <template slot-scope="scope">
                <router-link :to="{path:'deviceDetails',query:{devicesn:scope.row.devicesn,stauid:scope.row.stauid}}" class="link-type">
                  <span>{{ scope.row.devicesn }}</span>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column v-if="itemArr.indexOf('设备名称') > -1" show-overflow-tooltip prop="devicename" label="设备名称"></el-table-column>
            <el-table-column v-if="itemArr.indexOf('设备类型') > -1" show-overflow-tooltip prop="devicetype" label="设备类型" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('文件类型') > -1" show-overflow-tooltip prop="filetype" label="文件类型" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('文件名称') > -1" show-overflow-tooltip prop="filetruename" label="文件名称"></el-table-column>
            <el-table-column v-if="itemArr.indexOf('文件版本') > -1" show-overflow-tooltip prop="filever" label="文件版本"></el-table-column>
            <el-table-column v-if="itemArr.indexOf('文件描述') > -1" show-overflow-tooltip prop="filedesc" label="文件描述"></el-table-column>
            <el-table-column v-if="itemArr.indexOf('下发人') > -1" show-overflow-tooltip label="下发人" prop="createdby" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('下发时间') > -1" show-overflow-tooltip label="下发时间" prop="createddate" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('状态') > -1" show-overflow-tooltip label="状态" prop="otastatusStr" ></el-table-column>
            <el-table-column show-overflow-tooltip v-if="itemArr.indexOf('升级进度') > -1" label="升级进度">
              <template #default="{ row }">
                <el-progress :percentage="Number(row.progress)"></el-progress>
              </template>
            </el-table-column>
            <el-table-column v-if="itemArr.indexOf('升级信息') > -1" show-overflow-tooltip label="升级信息" prop="lastotamsg" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('下载完成时间') > -1" show-overflow-tooltip label="下载完成时间" prop="finisheddownloaddatetime" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('操作') > -1" show-overflow-tooltip label="操作" width="180px" >
              <template #default="{ row }">
                <el-button type="text" @click="queryProgress(row)">查看更新进度</el-button>
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
      </el-tab-pane>
      <el-tab-pane label="升级已完成">
        <div style="position: relative">
          <el-table ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" :height="height-70" border>
            <el-table-column  v-if="itemArr.indexOf('设备SN') > -1" label="设备SN" prop="devicesn" show-overflow-tooltip>
              <template slot-scope="scope">
                <router-link :to="{path:'deviceDetails',query:{devicesn:scope.row.devicesn,stauid:scope.row.stauid}}" class="link-type">
                  <span>{{ scope.row.devicesn }}</span>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column v-if="itemArr.indexOf('设备名称') > -1" show-overflow-tooltip prop="devicename" label="设备名称"></el-table-column>
            <el-table-column v-if="itemArr.indexOf('设备类型') > -1" show-overflow-tooltip prop="devicetype" label="设备类型" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('文件类型') > -1" show-overflow-tooltip prop="filetype" label="文件类型" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('文件名称') > -1" show-overflow-tooltip prop="filetruename" label="文件名称"></el-table-column>
            <el-table-column v-if="itemArr.indexOf('文件版本') > -1" show-overflow-tooltip prop="filever" label="文件版本"></el-table-column>
            <el-table-column v-if="itemArr.indexOf('文件描述') > -1" show-overflow-tooltip prop="filedesc" label="文件描述"></el-table-column>
            <el-table-column v-if="itemArr.indexOf('下发人') > -1" show-overflow-tooltip label="下发人" prop="createdby" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('下发时间') > -1" show-overflow-tooltip label="下发时间" prop="createddate" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('状态') > -1" show-overflow-tooltip label="状态" prop="otastatusStr" ></el-table-column>
            <el-table-column show-overflow-tooltip v-if="itemArr.indexOf('升级进度') > -1" label="升级进度">
              <template #default="{ row }">
                <el-progress :percentage="Number(row.progress)"></el-progress>
              </template>
            </el-table-column> 
            <el-table-column v-if="itemArr.indexOf('升级信息') > -1" show-overflow-tooltip label="升级信息" prop="lastotamsg" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('升级完成时间') > -1" show-overflow-tooltip label="升级完成时间" prop="lastupgradedatetime" ></el-table-column> 
            <el-table-column v-if="itemArr.indexOf('操作') > -1" show-overflow-tooltip label="操作" width="180px" >
              <template #default="{ row }">
                <el-button type="text" @click="queryProgress(row)">查看更新进度</el-button>
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
      </el-tab-pane>
      <el-tab-pane label="已取消">
        <div style="position: relative">
          <el-table ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" :height="height-70" border>
            <el-table-column  v-if="itemArr.indexOf('设备SN') > -1" label="设备SN" prop="devicesn" show-overflow-tooltip>
              <template slot-scope="scope">
                <router-link :to="{path:'deviceDetails',query:{devicesn:scope.row.devicesn,stauid:scope.row.stauid}}" class="link-type">
                  <span>{{ scope.row.devicesn }}</span>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column v-if="itemArr.indexOf('设备名称') > -1" show-overflow-tooltip prop="devicename" label="设备名称"></el-table-column>
            <el-table-column v-if="itemArr.indexOf('设备类型') > -1" show-overflow-tooltip prop="devicetype" label="设备类型"></el-table-column>
            <el-table-column v-if="itemArr.indexOf('文件类型') > -1" show-overflow-tooltip prop="filetype" label="文件类型" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('文件名称') > -1" show-overflow-tooltip prop="filetruename" label="文件名称" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('文件版本') > -1" show-overflow-tooltip prop="filever" label="文件版本"></el-table-column>
            <el-table-column v-if="itemArr.indexOf('文件描述') > -1" show-overflow-tooltip prop="filedesc" label="文件描述"></el-table-column>
            <el-table-column v-if="itemArr.indexOf('下发人') > -1" show-overflow-tooltip label="下发人" prop="createdby"></el-table-column>
            <el-table-column v-if="itemArr.indexOf('下发时间') > -1" show-overflow-tooltip label="下发时间" prop="createddate"></el-table-column>
            <el-table-column v-if="itemArr.indexOf('状态') > -1" show-overflow-tooltip label="状态" prop="otastatusStr" ></el-table-column>
            <el-table-column show-overflow-tooltip v-if="itemArr.indexOf('升级进度') > -1" label="升级进度" >
              <template #default="{ row }">
                <el-progress :percentage="Number(row.progress)"></el-progress>
              </template>
            </el-table-column>
            <el-table-column v-if="itemArr.indexOf('升级信息') > -1" show-overflow-tooltip label="升级信息" prop="lastotamsg" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('操作') > -1" show-overflow-tooltip label="操作" width="180px">
              <template #default="{ row }">
                <el-button type="text" @click="queryProgress(row)"> 查看更新进度 </el-button>
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
      </el-tab-pane>
      <el-tab-pane label="全部">
        <div style="position: relative">
          <el-table ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" :height="height-70" border>
            <el-table-column  v-if="itemArr.indexOf('设备SN') > -1" label="设备SN" prop="devicesn" show-overflow-tooltip>
              <template slot-scope="scope">
                <router-link :to="{path:'deviceDetails',query:{devicesn:scope.row.devicesn,stauid:scope.row.stauid}}" class="link-type">
                  <span>{{ scope.row.devicesn }}</span>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column v-if="itemArr.indexOf('设备名称') > -1" show-overflow-tooltip prop="devicename" label="设备名称" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('设备类型') > -1" show-overflow-tooltip prop="devicetype" label="设备类型" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('文件类型') > -1" show-overflow-tooltip prop="filetype" label="文件类型"></el-table-column>
            <el-table-column v-if="itemArr.indexOf('文件名称') > -1" show-overflow-tooltip prop="filetruename" label="文件名称"></el-table-column>
            <el-table-column v-if="itemArr.indexOf('文件版本') > -1" show-overflow-tooltip prop="filever" label="文件版本"></el-table-column>
            <el-table-column v-if="itemArr.indexOf('文件描述') > -1" show-overflow-tooltip prop="filedesc" label="文件描述"></el-table-column>
            <el-table-column v-if="itemArr.indexOf('下发人') > -1" show-overflow-tooltip label="下发人" prop="createdby" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('下发时间') > -1" show-overflow-tooltip label="下发时间" prop="createddate"></el-table-column>
            <el-table-column v-if="itemArr.indexOf('状态') > -1" show-overflow-tooltip label="状态" prop="otastatusStr" ></el-table-column>
            <el-table-column show-overflow-tooltip v-if="itemArr.indexOf('升级进度') > -1" label="升级进度">
              <template #default="{ row }">
                <el-progress :percentage="Number(row.progress)"></el-progress>
              </template>
            </el-table-column>
            <el-table-column v-if="itemArr.indexOf('升级信息') > -1" show-overflow-tooltip label="升级信息" prop="lastotamsg" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('下载完成时间') > -1" show-overflow-tooltip label="下载完成时间" prop="finisheddownloaddatetime" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('升级完成时间') > -1" show-overflow-tooltip label="升级完成时间" prop="lastupgradedatetime" ></el-table-column>
            <el-table-column v-if="itemArr.indexOf('操作') > -1" show-overflow-tooltip label="操作" width="220px">
              <template #default="{ row }">
                <el-button type="text" @click="queryProgress(row)"> 查看更新进度</el-button>
                <el-button :disabled="row.otastatus != 0" type="text" @click="cancelTask(row)"> 取消升级任务</el-button>
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
  </div>
</template>

<script>
  import { getOTATaskList, OTATaskUpd } from '@/api/device'
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
        itemArr: [ '设备SN', '设备名称', '设备类型', '文件类型', '文件名称', '文件版本', '文件描述', '下发人', '下发时间', '状态', '升级进度', '升级信息', '下载完成时间', '升级完成时间', '操作' ],
        checkArr: [ '设备SN', '设备名称', '设备类型', '文件类型', '文件名称', '文件版本', '文件描述', '下发人', '下发时间', '状态', '升级进度', '升级信息', '操作'],
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
    },
    beforeDestroy() {},
    mounted() {},
    methods: {
      //点击tab
      handleTabClick(e) {
        this.pageSize = 10
        this.currentPage = 1
        if (e.label == '全部') {
          this.status = ''
          this.checkArr.indexOf('下载完成时间') > -1 ? '' : this.checkArr.push('下载完成时间')
          this.checkArr.indexOf('升级完成时间') > -1 ? '' : this.checkArr.push('升级完成时间')

        } else if (e.label == '待升级') {
          this.status = 0
          this.checkArr = [ '设备SN', '设备名称', '设备类型', '文件类型', '文件名称', '文件版本', '文件描述', '下发人', '下发时间', '状态', '升级进度', '升级信息', '操作']

        } else if (e.label == '下载已完成') {
          this.status = 100
          this.checkArr.indexOf('升级完成时间') > -1 ? this.checkArr.splice(this.checkArr.indexOf('升级完成时间'),1) : ''
          this.checkArr.indexOf('下载完成时间') > -1 ? '' : this.checkArr.push('下载完成时间')

        } else if (e.label == '升级已完成') {
          this.status = 1000
          this.checkArr.indexOf('下载完成时间') > -1 ? this.checkArr.splice(this.checkArr.indexOf('下载完成时间'),1) : ''
          this.checkArr.indexOf('升级完成时间') > -1 ? '' : this.checkArr.push('升级完成时间')

        } else if (e.label == '已取消') {
          this.checkArr = [ '设备SN', '设备名称', '设备类型', '文件类型', '文件名称', '文件版本', '文件描述', '下发人', '下发时间', '状态', '升级进度', '升级信息', '操作']
          this.status = -100
        }
        this.fetchData()
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
      //点击 查看更新进度
      queryProgress(row) {
        this.$router.push({
          path: '/deviceManage/otaProgress',
          query: {
            otataskuid: row.otataskuid,
          },
        })
      },
      //取消升级任务
      cancelTask(row) {
        if (row.otataskuid) {
          this.$baseConfirm('你确定要取消当前升级任务吗', null, async () => {
            let params = {
              CallType: 'cancel',
              UserID: sessionStorage.getItem('UserID'),
              AppToken: '',
              // ufileuid: row.otataskuid,
              uids: row.otataskuid,
            }
            this.cancelTaskSubmit(params)
          })
        }
      },
      // 取消升级任务： 调接口
      async cancelTaskSubmit(params) {
        const result = await OTATaskUpd(params)
        if (result.Status == 0) {
          this.$baseMessage('取消升级任务成功', 'success')
          this.fetchData()
        }
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
          // ufileuid: this.$route.query.ufileuid,
        }
        const { Data, Count } = await getOTATaskList(params)
        this.list = Data
        this.total = Count
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      },
    },
  }
</script>
<style scoped></style>
