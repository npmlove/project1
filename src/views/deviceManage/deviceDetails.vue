<template>
  <div class="map-container">
    <el-collapse v-model="activeNames" @change="handleChange" >
      <!-- 面板1 设备详情 -->
      <el-collapse-item  name="1">
        <template slot="title">
          <span>设备详情</span>
          <vab-icon :icon="['fas', 'file']" style="margin-left: 10px;font-size: 16px;"/>
         </template>
        <el-form :label-position="labelPosition" :inline="true" label-width="80px" size="medium" class="demo-form-inline" >
          <el-form-item label="设备SN"  required>
            <el-input :disabled="true" v-model="details.devicesn" ></el-input>
          </el-form-item>
          <el-form-item label="设备名称" required >
            <el-input :disabled="true" v-model="details.devicename" ></el-input>
          </el-form-item>
          <el-form-item label="类型" required >
            <el-input :disabled="true" v-model="details.devicetype" ></el-input>
          </el-form-item>
          <el-form-item label="第一次上线时间" label-width="140px" required>
            <el-input :disabled="true" v-model="details.firstcontactdate"  ></el-input>
          </el-form-item>
        </el-form>
        <div style="font-size:14px;font-weight: 700;color: #606266;">当前版本信息:</div>
        <el-table  :data="latestver" border>
          <el-table-column show-overflow-tooltip label="名称" prop="name" ></el-table-column>
          <el-table-column show-overflow-tooltip label="版本" prop="ver"></el-table-column>
        </el-table>
      </el-collapse-item>
      <!-- 面板2 版本信息 -->
      <el-collapse-item name="2">
        <template slot="title">
          <span>版本信息</span>
          <vab-icon :icon="['fas', 'bookmark']" style="margin-left:10px;font-size:16px"/>
        </template>
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-form ref="form" :inline="true" @submit.native.prevent>
              <el-form-item>
                <el-input v-model="searchData" placeholder="请输入文件版本" style="width: 320px;" />
              </el-form-item>
              <el-form-item>
                <el-button icon="el-icon-search" type="primary" native-type="submit" @click="handleQuery" >查询</el-button>
                <el-button @click="restClick">重置</el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-left-panel>
        </vab-query-form>
        <el-tabs type="border-card" @tab-click="handleTabClick" >
          <el-tab-pane label="待升级" >
            <div style="position: relative">
              <el-table  :data="verHistroyInfo" border>
                <el-table-column v-if="itemArr.indexOf('文件名称') > -1" show-overflow-tooltip label="文件名称" prop="filetruename" ></el-table-column>
                <el-table-column v-if="itemArr.indexOf('文件类型') > -1" show-overflow-tooltip label="文件类型" prop="filetype"></el-table-column>
                <el-table-column v-if="itemArr.indexOf('文件版本') > -1" show-overflow-tooltip label="文件版本" prop="filever">
                  <template #default="{ row }">
                    <span style="margin-right: 15px;">{{ row.filever }}</span>
                    <vab-icon :icon="['fas', 'history']" v-if="row.beforupgradeverinfo != '' " @click="openVerDialog(row.beforupgradeverinfo)" style="color:#41B584;font-size:15px"/>
                  </template>
                </el-table-column>
                <el-table-column v-if="itemArr.indexOf('下发日期') > -1" show-overflow-tooltip label="下发日期" prop="createddate"></el-table-column>
                <el-table-column v-if="itemArr.indexOf('状态') > -1" show-overflow-tooltip label="状态" prop="otastatusStr"></el-table-column>
                <el-table-column v-if="itemArr.indexOf('升级进度') > -1" show-overflow-tooltip label="升级进度" prop="progress">
                  <template #default="{ row }">
                    <span>{{row.progress + '%'}}</span>
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
          <el-tab-pane label="下载已完成" >
            <div style="position: relative">
              <el-table  :data="verHistroyInfo" border>
                <el-table-column v-if="itemArr.indexOf('文件名称') > -1" show-overflow-tooltip label="文件名称" prop="filetruename" ></el-table-column>
                <el-table-column v-if="itemArr.indexOf('文件类型') > -1" show-overflow-tooltip label="文件类型" prop="filetype"></el-table-column>
                <el-table-column v-if="itemArr.indexOf('文件版本') > -1" show-overflow-tooltip label="文件版本" prop="filever">
                  <template #default="{ row }">
                    <span style="margin-right: 15px;">{{ row.filever }}</span>
                    <vab-icon :icon="['fas', 'history']" v-if="row.beforupgradeverinfo != '' " @click="openVerDialog(row.beforupgradeverinfo)" style="color:#41B584;font-size:15px"/>
                  </template>
                </el-table-column>
                <el-table-column v-if="itemArr.indexOf('下发日期') > -1" show-overflow-tooltip label="下发日期" prop="createddate"></el-table-column>
                <el-table-column v-if="itemArr.indexOf('状态') > -1" show-overflow-tooltip label="状态" prop="otastatusStr"></el-table-column>
                <el-table-column v-if="itemArr.indexOf('下载完成时间') > -1" show-overflow-tooltip label="下载完成时间" prop="finisheddownloaddatetime"></el-table-column>
                <el-table-column v-if="itemArr.indexOf('升级进度') > -1" show-overflow-tooltip label="升级进度" prop="progress">
                  <template #default="{ row }">
                    <span>{{row.progress + '%'}}</span>
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
          <el-tab-pane label="升级已完成" >
            <div style="position: relative">
              <el-table  :data="verHistroyInfo" border>
                <el-table-column v-if="itemArr.indexOf('文件名称') > -1" show-overflow-tooltip label="文件名称" prop="filetruename" ></el-table-column>
                <el-table-column v-if="itemArr.indexOf('文件类型') > -1" show-overflow-tooltip label="文件类型" prop="filetype"></el-table-column>
                <el-table-column v-if="itemArr.indexOf('文件版本') > -1" show-overflow-tooltip label="文件版本" prop="filever">
                  <template #default="{ row }">
                    <span style="margin-right: 15px;">{{ row.filever }}</span>
                    <vab-icon :icon="['fas', 'history']" v-if="row.beforupgradeverinfo != '' " @click="openVerDialog(row.beforupgradeverinfo)" style="color:#41B584;font-size:15px"/>
                  </template>
                </el-table-column>
                <el-table-column v-if="itemArr.indexOf('下发日期') > -1" show-overflow-tooltip label="下发日期" prop="createddate"></el-table-column>
                <el-table-column v-if="itemArr.indexOf('状态') > -1" show-overflow-tooltip label="状态" prop="otastatusStr"></el-table-column>
                <el-table-column v-if="itemArr.indexOf('升级完成时间') > -1" show-overflow-tooltip label="升级完成时间" prop="lastupgradedatetime"></el-table-column>
                <el-table-column v-if="itemArr.indexOf('升级进度') > -1" show-overflow-tooltip label="升级进度" prop="progress">
                  <template #default="{ row }">
                    <span>{{row.progress + '%'}}</span>
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
          <el-tab-pane label="已取消" >
            <div style="position: relative">
              <el-table  :data="verHistroyInfo" border>
                <el-table-column v-if="itemArr.indexOf('文件名称') > -1" show-overflow-tooltip label="文件名称" prop="filetruename" ></el-table-column>
                <el-table-column v-if="itemArr.indexOf('文件类型') > -1" show-overflow-tooltip label="文件类型" prop="filetype"></el-table-column>
                <el-table-column v-if="itemArr.indexOf('文件版本') > -1" show-overflow-tooltip label="文件版本" prop="filever">
                  <template #default="{ row }">
                    <span style="margin-right: 15px;">{{ row.filever }}</span>
                    <vab-icon :icon="['fas', 'history']" v-if="row.beforupgradeverinfo != '' " @click="openVerDialog(row.beforupgradeverinfo)" style="color:#41B584;font-size:15px"/>
                  </template>
                </el-table-column>
                <el-table-column v-if="itemArr.indexOf('下发日期') > -1" show-overflow-tooltip label="下发日期" prop="createddate"></el-table-column>
                <el-table-column v-if="itemArr.indexOf('状态') > -1" show-overflow-tooltip label="状态" prop="otastatusStr"></el-table-column>
                <el-table-column v-if="itemArr.indexOf('升级进度') > -1" show-overflow-tooltip label="升级进度" prop="progress">
                  <template #default="{ row }">
                    <span>{{row.progress + '%'}}</span>
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
          <el-tab-pane label="全部" >
            <div style="position: relative">
              <el-table  :data="verHistroyInfo" border>
                <el-table-column v-if="itemArr.indexOf('文件名称') > -1" show-overflow-tooltip label="文件名称" prop="filetruename" ></el-table-column>
                <el-table-column v-if="itemArr.indexOf('文件类型') > -1" show-overflow-tooltip label="文件类型" prop="filetype"></el-table-column>
                <el-table-column v-if="itemArr.indexOf('文件版本') > -1" show-overflow-tooltip label="文件版本" prop="filever">
                  <template #default="{ row }">
                    <span style="margin-right: 15px;">{{ row.filever }}</span>
                    <vab-icon :icon="['fas', 'history']" v-if="row.beforupgradeverinfo != '' " @click="openVerDialog(row.beforupgradeverinfo)" style="color:#41B584;font-size:15px"/>
                  </template>
                </el-table-column>
                <el-table-column v-if="itemArr.indexOf('下发日期') > -1" show-overflow-tooltip label="下发日期" prop="createddate"></el-table-column>
                <el-table-column v-if="itemArr.indexOf('状态') > -1" show-overflow-tooltip label="状态" prop="otastatusStr"></el-table-column>
                <el-table-column v-if="itemArr.indexOf('下载完成时间') > -1" show-overflow-tooltip label="下载完成时间" prop="finisheddownloaddatetime"></el-table-column>
                <el-table-column v-if="itemArr.indexOf('升级完成时间') > -1" show-overflow-tooltip label="升级完成时间" prop="lastupgradedatetime" ></el-table-column>
                <el-table-column v-if="itemArr.indexOf('升级进度') > -1" show-overflow-tooltip label="升级进度" prop="progress">
                  <template #default="{ row }">
                    <span>{{row.progress + '%'}}</span>
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
          <!-- 版本信息分页 -->
          <el-pagination :background="background" :current-page="currentPage" :layout="layout" :page-size="pageSize" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" ></el-pagination>
        </el-tabs>
      </el-collapse-item>
      <!-- 面板3 设备报警信息 -->
      <el-collapse-item name="3">
        <template slot="title">
          <span>设备报警信息</span>
          <vab-icon :icon="['fas', 'assistive-listening-systems']" style="margin-left:10px;font-size:16px"/>
        </template>
        <el-tabs type="border-card" @tab-click="handleAlartTabClick" >
          <el-tab-pane label="未处理" >
            <div style="position: relative" >
              <el-table ref="tableSort" v-loading="listLoading" :data="alarmList" :element-loading-text="elementLoadingText" border>
                <el-table-column v-if="itemAlarmArr.indexOf('报警类型') > -1" show-overflow-tooltip prop="alarmeventStr" label="报警类型" ></el-table-column>
                <el-table-column v-if="itemAlarmArr.indexOf('报警时间') > -1" show-overflow-tooltip prop="alarmtime" label="报警时间"></el-table-column>
                <el-table-column v-if="itemAlarmArr.indexOf('通道') > -1" show-overflow-tooltip prop="alarmchanel" label="通道"></el-table-column>
                <el-table-column v-if="itemAlarmArr.indexOf('是否已读') > -1" show-overflow-tooltip prop="isreadStr" label="是否已读"></el-table-column>
              </el-table>
              <div class="table-icon">
                <el-popover placement="bottom-start" trigger="click">
                  <el-checkbox-group v-model="itemAlarmArr">
                    <div class="checkbox-block">
                      <el-checkbox v-for="item in checkAlarmArr" :label="item" :key="item"></el-checkbox>
                    </div>
                  </el-checkbox-group>
                  <vab-icon slot="reference" :icon="['fas', 'cog']"></vab-icon>
                </el-popover>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="已处理">
            <div style="position: relative">
              <el-table ref="tableSort" v-loading="listLoading" :data="alarmList" :element-loading-text="elementLoadingText" border>
                <el-table-column v-if="itemAlarmArr.indexOf('报警类型') > -1" show-overflow-tooltip prop="alarmeventStr" label="报警类型" ></el-table-column>
                <el-table-column v-if="itemAlarmArr.indexOf('报警时间') > -1" show-overflow-tooltip prop="alarmtime" label="报警时间"></el-table-column>
                <el-table-column v-if="itemAlarmArr.indexOf('通道') > -1" show-overflow-tooltip prop="alarmchanel" label="通道"></el-table-column>
                <el-table-column v-if="itemAlarmArr.indexOf('是否已读') > -1" show-overflow-tooltip prop="isreadStr" label="是否已读"></el-table-column>
                <el-table-column v-if="itemAlarmArr.indexOf('操作') > -1" show-overflow-tooltip label="操作" >
                  <template #default="{ row }">
                    <el-button type="text" @click="queryAlarmSolve(row)">查看处理方案</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="table-icon">
                <el-popover placement="bottom-start" trigger="click">
                  <el-checkbox-group v-model="itemAlarmArr">
                    <div class="checkbox-block">
                      <el-checkbox v-for="item in checkAlarmArr" :label="item" :key="item"></el-checkbox>
                    </div>
                  </el-checkbox-group>
                  <vab-icon slot="reference" :icon="['fas', 'cog']"></vab-icon>
                </el-popover>
              </div>
            </div>
          </el-tab-pane>
          <!-- 设备报警分页 -->
          <el-pagination :background="background" :current-page="alarmCurrentPage" :layout="layout" :page-size="alarmPageSize" :total="alarmTotal" @current-change="handleAlarmCurrentChange" @size-change="handleAlarmSizeChange" ></el-pagination>
        </el-tabs>
      </el-collapse-item>
      <!-- 面板4 工况信息 -->
      <el-collapse-item name="4" v-if="details.hasworkload == 1">
        <template slot="title">
          <span>工况信息</span>
          <vab-icon :icon="['fas', 'file-alt']" style="margin-left:10px;font-size:16px"/>
        </template>
        <div>暂无工况信息</div>
      </el-collapse-item>
      <!-- 面板5 位置信息 -->
      <el-collapse-item name="5" v-if="details.hasgps == 1" style="position: relative;">
        <template slot="title">
          <span>位置信息</span>
          <i class="el-icon-location" style="margin-left:10px;font-size:16px"></i>
        </template>
        <div id="map" >
          <baidu-map style="width: 100%;height: 500px !important;"  :center="center" :zoom="zoom" :scroll-wheel-zoom="true" :mapClick="false" :enableMapClick="false"  @ready="mapReady" >
            <bm-marker :position="center" :dragging="false" >
               <!-- animation="BMAP_ANIMATION_BOUNCE" 标志点动画 -->
              <bm-label v-if="contentFlag != 1" :content="content" :offset="{width: 35, height: -20}" />
            </bm-marker>
          </baidu-map>
          <button style="height:30px;cursor: pointer; position: absolute;top: 62px;left: 20px;" @click="fetchData">刷新位置</button>
        </div>
      </el-collapse-item>
    </el-collapse>
    <!-- 弹窗 版本信息 -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" v-if="dialogTableVisible" title="历史版本" :visible.sync="dialogTableVisible" width="400px">
      <el-table :data="dialogData">
        <el-table-column property="name" label="名称" width="150"></el-table-column>
        <el-table-column property="ver" label="版本" width="200"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- drawer 弹窗 报警解决方案查看 -->
    <el-drawer title="报警处理" :visible.sync="drawer" :direction="direction" size="700px" custom-class="demo-drawer"  ref="drawer" @close="handleClose" >
      <div style="width: 100%; height:calc(100vh - 110px) ; overflow-y: auto;">
        <el-form ref="drawerForm" :model="drawerForm" style="padding: 10px 15px;">
          <el-form-item label="处理意见" >
            <el-input v-model="drawerForm.reason" autocomplete="off"  disabled></el-input>
          </el-form-item>
          <el-form-item label="上传视频" >
            <div class="picBox">
              <div v-if="uploadVideoSuccessArr.length == 0" style="color: #F76260;">没有上传视频</div>
              <div v-for="(item,index) in uploadVideoSuccessArr" :key="index" class="picContent">
                <video :src="urlHeader + item.filename"  controls="controls"></video>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="上传图片" >
            <div class="picBox">
              <div v-if="uploadPicSuccessArr.length == 0" style="color: #F76260;">没有上传图片</div>
              <div v-for="(item,index) in uploadPicSuccessArr" :key="index + 1" class="picContent">
                <img :src="urlHeader + item.filename" @click="handlePictureCardPreview(item)">
              </div>
            </div>
          </el-form-item>
          <el-form-item label="备注" >
            <el-input v-model="drawerForm.remarks" autocomplete="off" type="textarea" disabled></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
    <!-- 图片预览弹窗 -->
    <el-dialog :visible.sync="dialogVisible" :modal="false">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import { getDeviceVerAndHistroy, getDevicePosition, getOTATaskList, getSYSAlarmList } from '@/api/device'
  export default {
    components: {},
    data() {
      return {
        searchData:'',
        labelPosition:'right',
        details:{},
        elementLoadingText: '正在加载...',
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        background: true,
        activeNames: ['1','2'],
        latestver:[],  //最新版本
        dialogData:[],
        dialogTableVisible: false,
        verHistroyInfo:[],
        itemArr: ['文件名称', '文件类型', '文件版本', '下发日期', '状态', '下载完成时间', '升级完成时间', '升级进度'],
        checkArr: ['文件名称', '文件类型', '文件版本', '下发日期', '状态', '下载完成时间', '升级进度'],

        center: {},
        zoom: 15,   //地图缩放
        content:'', //位置信息弹窗内容
        title:'',

        lng:'',
        lat:'',

        contentFlag:0,
        pageSize: 10,
        currentPage: 1,
        total: 0,
        status: 0,
        //告警信息
        alarmPageSize: 10,
        alarmCurrentPage: 1,
        alarmTotal: 0,
        alarmStatus: 0,
        alarmSearchData:'',
        alarmList:[],
        itemAlarmArr: ['报警类型', '报警时间', '通道', '是否已读'],
        checkAlarmArr: [ '报警类型', '报警时间', '通道', '是否已读'],

        drawer: false,
        direction: 'rtl',
        drawerForm: {
          reason:'',
          remarks:''
        },
        uploadVideoSuccessArr:[],
        uploadPicSuccessArr:[],
        urlHeader:process.env.NODE_ENV === 'development' ? 'http://192.168.2.150:83' : '',
        //上传图片预览
        dialogImageUrl: '',
        dialogVisible: false,


      }
    },
    computed: {
      height() {
        return this.$baseTableHeight()
      },
    },
    created() {
      //查询设备详情
      this.getDeviceDetail()
      //查询版本信息
      this.getDeviceHistory()
      // 查询告警信息
      this.fetchAlartTData()
    },
    mounted() {},
    methods: {
      handleChange(val) {
        if(val.indexOf('5') > -1) {
          this.fetchData()
        }
      },
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
          this.checkArr = ['文件名称', '文件类型', '文件版本', '下发日期', '状态', '下载完成时间', '升级进度']

        } else if (e.label == '下载已完成') {
          this.status = 100
          this.checkArr.indexOf('升级完成时间') > -1 ? this.checkArr.splice(this.checkArr.indexOf('升级完成时间'),1) : ''
          this.checkArr.indexOf('下载完成时间') > -1 ? '' : this.checkArr.push('下载完成时间')

        } else if (e.label == '升级已完成') {
          this.status = 1000
          this.checkArr.indexOf('下载完成时间') > -1 ? this.checkArr.splice(this.checkArr.indexOf('下载完成时间'),1) : ''
          this.checkArr.indexOf('升级完成时间') > -1 ? '' : this.checkArr.push('升级完成时间')

        } else if (e.label == '已取消') {
          this.checkArr = ['文件名称', '文件类型', '文件版本', '下发日期', '状态', '下载完成时间', '升级进度']
          this.status = -100
        }
        this.getDeviceHistory()
      },
      handleAlartTabClick(e) {
        this.alarmPageSize = 10
        this.alarmCurrentPage = 1
        if (e.label == '未处理') {
          this.alarmStatus = 0
          this.itemAlarmArr = ['报警类型', '报警时间', '通道', '是否已读']
          this.checkAlarmArr = [ '报警类型', '报警时间', '通道', '是否已读']
        } else if (e.label == '已处理') {
          // this.alarmStatus = 100
          this.alarmStatus = 10
          this.itemAlarmArr = ['报警类型', '报警时间', '通道', '是否已读', '操作']
          this.checkAlarmArr = [ '报警类型', '报警时间', '通道', '是否已读', '操作']
        }
        this.fetchAlartTData()
      },
      // 查询设备详情信息
      async getDeviceDetail() {
        this.listLoading = true
        let params = {
          CallType: 'byid',
          UserID: sessionStorage.getItem('UserID'),
          stauid: this.$route.query.stauid
        }
        const { Data, Count } = await getDeviceVerAndHistroy(params)
        this.details = Data.Table[0]
        if(Data.Table[0].latestver != null){
          this.latestver = JSON.parse(Data.Table[0].latestver).data.ver
        }
        // if(Data.Table1.length > 0){
          // this.verHistroyInfo = Data.Table1
        // }
        setTimeout(() => {
          this.listLoading = false
        }, 300)
      },
      //查询版本信息
      async getDeviceHistory() {
        this.listLoading = true
        let params = {
          CallType: 'bydevice',
          UserID: sessionStorage.getItem('UserID'),
          SearchKey: this.searchData,
          filetype: '',
          status: this.status,
          PageSize: this.pageSize,
          CurrentPage: this.currentPage,
          ufileuid: '',
          stauid: this.$route.query.stauid
        }
        const { Data, Count } = await getOTATaskList(params)
        this.verHistroyInfo = Data
        this.total = Count
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      },
      //查询告警信息列表
      async fetchAlartTData(){
        this.listLoading = true
        let params = {
          CallType: '',
          UserID: sessionStorage.getItem('UserID'),
          status: this.alarmStatus,
          stauid: this.$route.query.stauid,
          SearchKey: this.alarmSearchData,
          PageSize: this.alarmPageSize,
          CurrentPage: this.alarmCurrentPage,
        }
        const { Data, Count } = await getSYSAlarmList(params)
        this.alarmList = Data
        this.alarmTotal = Count
        // const imageList = []
        // Data.forEach((item, index) => {
        //   imageList.push(item.alarmimg)
        // })
        // this.imageList = imageList

        setTimeout(() => {
          this.listLoading = false
        }, 500)
      },
      //版本操作 ====start =====
      handleSizeChange(val) {
        this.pageSize = val
        this.getDeviceHistory()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getDeviceHistory()
      },
      handleQuery() {
        this.currentPage = 1
        this.getDeviceHistory()
      },
      restClick() {
        this.searchData = ''
        this.pageSize = 10
        this.currentPage = 1
        this.getDeviceHistory()
      },
      //版本操作 ====ent =====

      //告警操作 ====start =====
      handleAlarmSizeChange(val) {
        this.alarmPageSize = val
        this.fetchAlartTData()
      },
      handleAlarmCurrentChange(val) {
        this.alarmCurrentPage = val
        this.fetchAlartTData()
      },
      alartHandleQuery() {
        this.alarmCurrentPage = 1
        this.fetchAlartTData()
      },
      alartRestClick() {
        this.alarmSearchData = ''
        this.alarmPageSize = 10
        this.alarmCurrentPage = 1
        this.fetchAlartTData()
      },
      //告警操作 ====ent =====

      // 打开弹窗查看 版本信息
      openVerDialog(val){
        if(val == '' || val == null){
          this.$baseMessage('本条数据没有历史版本信息', 'info')
          return false
        }
        this.dialogData = JSON.parse(val).data.ver
        this.dialogTableVisible = true
      },
      // 更新 地理位置信息
      async fetchData() {
        let that = this;
        let params = {
          UserID: sessionStorage.getItem('UserID'),
          devicesn: that.$route.query.devicesn, //传otataskuid 值
          maptype:'baidu'
        }
        const result = await getDevicePosition(params)
        if(result.Status == 0){  //查询成功
          that.lng = result.Data.data.data.lon
          that.lat = result.Data.data.data.lat
          that.title = result.Data.address
          let point = new BMap.Point(that.lng, that.lat)
          that.center = point
          that.content ='<span style="margin-left:0px;vertical-align:middle">' + that.title + '</span>'
          +'<br>'+ '<br>'
          + '<span style="color:#F7402D;margin-right:10px">' + point.lng + '</span>'
          + '<span style="color:#F7402D">' + point.lat + '</span>'

        } else {
          this.contentFlag = 1
          this.$baseMessage(result.Message, 'info')
        }
      },

      //初始页面 地图组件渲染完毕时触发
      mapReady({BMap,map}) {
        if(this.activeNames.indexOf('5') > -1) {
           this.fetchData()
        } else {
          return
        }
        this.fetchData()
      	setTimeout(()=>{
      		console.log('地图组件渲染完毕时触发，返回一个百度地图的核心类和地图实例')
      		let that = this;
      		let point = new BMap.Point(that.lng, that.lat)
          that.center = point
          that.content ='<span style="margin-left:0px;vertical-align:middle">' + that.title + '</span>'
          +'<br>'+ '<br>'
          + '<span style="color:#F7402D;margin-right:10px">' + point.lng + '</span>'
          + '<span style="color:#F7402D">' + point.lat + '</span>'
      	},100);
      },

      //点击 报警列表 查看处理方案
      queryAlarmSolve(row){
        this.drawer = true
        // 如果处理已经保存 则回显数据
        if(row.alarmreason){
          let reason = JSON.parse(row.alarmreason)
          let upload = JSON.parse(row.alarmhandlefile)
          this.drawerForm.remarks = row.alarmhandledesc  //备注
          let reasonArr = []
          for(let i=0;i<reason.length;i++){
            reasonArr.push(reason[i].Name)  //处理意见
            this.drawerForm.reason = reasonArr.toString()
          }
          this.uploadVideoSuccessArr = upload.videoArr
          this.uploadPicSuccessArr = upload.picArr
        }
      },
      //图片预览
      handlePictureCardPreview(item) {
        this.dialogImageUrl = this.urlHeader + item.filename;
        this.dialogVisible = true;
      },
      // 关闭 drawer
      handleClose(){
        this.drawer = false
        this.$refs['drawerForm'].resetFields()
      },

    }
  }
</script>
<style lang="scss" scoped>
  .container {
    width: 100%;
    height: calc(100vh - 214px);
    position: relative;
  }
  /* disabled  输入框 字体颜色 */
  /deep/ .el-input.is-disabled .el-input__inner {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #303133;
    cursor: not-allowed;
  }
  /* 折叠面板的头部样式 */
  /deep/ .el-collapse-item__header {
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
    margin-bottom: 10px;
    color: $base-color-blue;
    border-bottom: 1px solid $base-color-blue ;
  }
  /deep/ .el-collapse-item__arrow {
    margin: 0 8px 0 auto;
    transition: transform .3s;
    font-weight: 700;
    font-size: 16px;
  }
  .picBox{
  	display: flex;
  	flex-wrap: wrap;
  	padding: 20upx;
  }
  .picContent{
		margin: 10px;
		border: 1px dashed #c0ccda;
		/* border-radius: 10px; */
		box-sizing: border-box;
		position: relative;
    width: 150px;
    height: 150px;
	}
  .picContent img {
    width: 150px;
    height: 150px;
  }
  .picContent video {
    width: 150px;
    height: 150px;
  }

</style>
