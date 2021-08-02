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
      <el-tab-pane label="未处理" >
        <div style="position: relative" >
          <el-table ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" :height="height-70" border>
            <el-table-column  v-if="itemArr.indexOf('设备SN') > -1" label="设备SN" prop="devicesn" show-overflow-tooltip>
              <template slot-scope="scope">
                <router-link :to="{path:'deviceDetails',query:{devicesn:scope.row.devicesn,stauid:scope.row.stauid}}" class="link-type">
                  <span>{{ scope.row.devicesn }}</span>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column v-if="itemArr.indexOf('报警类型') > -1" show-overflow-tooltip prop="alarmeventStr" label="报警类型" ></el-table-column>
            <!-- <el-table-column v-if="itemArr.indexOf('报警状态') > -1" show-overflow-tooltip prop="alarmstatusStr" label="报警状态"></el-table-column> -->
            <el-table-column v-if="itemArr.indexOf('报警时间') > -1" show-overflow-tooltip prop="alarmtime" label="报警时间"></el-table-column>
            <el-table-column v-if="itemArr.indexOf('通道') > -1" show-overflow-tooltip prop="alarmchanel" label="通道"></el-table-column>
            <el-table-column v-if="itemArr.indexOf('是否已读') > -1" show-overflow-tooltip prop="isreadStr" label="是否已读"></el-table-column>
            <!-- <el-table-column v-if="itemArr.indexOf('报警图片') > -1" show-overflow-tooltip prop="alarmimg" label="报警图片">
              <template #default="{ row }">
                <el-image v-if="imgShow" :preview-src-list="imageList" :src="row.alarmimg" style="width: 32px;height: 32px;"></el-image>
              </template>
            </el-table-column> -->
            <el-table-column v-if="itemArr.indexOf('操作') > -1" show-overflow-tooltip label="操作" width="180px" >
              <template #default="{ row }">
                <el-button type="text" @click="toSolve(row)">处理 </el-button>
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
      <el-tab-pane label="已处理">
        <div style="position: relative">
          <el-table ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" :height="height-70" border>
            <el-table-column  v-if="itemArr.indexOf('设备SN') > -1" label="设备SN" prop="devicesn" show-overflow-tooltip>
              <template slot-scope="scope">
                <router-link :to="{path:'deviceDetails',query:{devicesn:scope.row.devicesn,stauid:scope.row.stauid}}" class="link-type">
                  <span>{{ scope.row.devicesn }}</span>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column v-if="itemArr.indexOf('报警类型') > -1" show-overflow-tooltip prop="alarmeventStr" label="报警类型" ></el-table-column>
            <!-- <el-table-column v-if="itemArr.indexOf('报警状态') > -1" show-overflow-tooltip prop="alarmstatusStr" label="报警状态"></el-table-column> -->
            <el-table-column v-if="itemArr.indexOf('报警时间') > -1" show-overflow-tooltip prop="alarmtime" label="报警时间"></el-table-column>
            <el-table-column v-if="itemArr.indexOf('通道') > -1" show-overflow-tooltip prop="alarmchanel" label="通道"></el-table-column>
            <el-table-column v-if="itemArr.indexOf('是否已读') > -1" show-overflow-tooltip prop="isreadStr" label="是否已读"></el-table-column>
           <!-- <el-table-column v-if="itemArr.indexOf('报警图片') > -1" show-overflow-tooltip prop="alarmimg" label="报警图片">
              <template #default="{ row }">
                <el-image v-if="imgShow" :preview-src-list="imageList" :src="row.alarmimg" style="width: 32px;height: 32px;"></el-image>
              </template>
            </el-table-column> -->
            <el-table-column v-if="itemArr.indexOf('操作') > -1" show-overflow-tooltip label="操作" width="180px" >
              <template #default="{ row }">
                <el-button type="text" @click="toSolve(row)">查看处理方案 </el-button>
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
    <!-- 弹窗 -->
    <el-dialog title="报警处理" :visible.sync="dialogFormVisible" width="620px" :before-close="close" v-dialogDrag :close-on-click-modal="false" v-if="dialogFormVisible" >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="处理意见" prop="solveOption" >
          <el-select :disabled="editFlag" v-model="form.solveOption" multiple placeholder="请选择处理意见" style="width: 350px" @change="optionChange" >
            <el-option v-for="item in solveOptionArr" :key="item.DictionaryID" :label="item.Name" :value="item.Value" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传视频" prop="uploadVideo" >
          <el-upload
            :disabled="editFlag"
            ref="upload"
            :action="action"
            :data="filedata"
            :file-list="fileList"
            :auto-upload="true"
            :multiple="false"
            name="file"
            class="upload-content"
            list-type="picture-card"
            :show-file-list="true"
            :on-success="uploadVideoSuccess"
            :before-upload="uploadVideoBefore"
            :on-error="handleVideoError"
          >
          <i slot="default" class="el-icon-plus" ></i>
          <div slot="file" slot-scope="{file}" >
            <video :src="urlHeader + file.url" class="uploadSizeSty" controls="controls"></video>
            <span v-if="editFlag != true" style="position: absolute;top: -1px;right: 0px;cursor: pointer;">
              <span  @click="handleVideoRemove(file)" >
                <i class="el-icon-circle-close" style="font-size: 18px;"></i>
              </span>
            </span>
          </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="上传图片" prop="uploadPic">
          <el-upload
            :disabled="editFlag"
            ref="upload1"
            :action="action"
            :data="filedata"
            :file-list="filePicList"
            :auto-upload="true"
            :multiple="false"
            name="file"
            class="upload-content"
            list-type="picture-card"
            :show-file-list="true"
            :on-success="uploadSuccess"
            :before-upload="uploadBefore"
            :on-error="handleError"
          >
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{file}">
              <!-- <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" > -->
              <img class="el-upload-list__item-thumbnail" :src="urlHeader + file.url" alt="" >
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)" >
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span v-if="editFlag != true" class="el-upload-list__item-delete" @click="handleRemove(file)" >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </el-upload>
        </el-form-item>
        <!-- 图片预览弹窗 -->
        <el-dialog :visible.sync="dialogVisible" :modal="false">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>

        <el-form-item label="备注" prop="remarks">
          <el-input :disabled="editFlag" v-model="form.remarks" autocomplete="off" type="textarea" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="editFlag" @click="submit(0)">保存</el-button>
        <el-button :disabled="editFlag" type="primary" @click="submit(10)">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getSYSAlarmList, getFileType, sysAlarmkHandle } from '@/api/device'
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
        // itemArr: [ '设备SN', '报警类型', '报警状态', '报警时间', '通道', '是否已读', '报警图片'],
        // checkArr: [ '设备SN', '报警类型', '报警状态', '报警时间', '通道', '是否已读', '报警图片'],
        itemArr: [ '设备SN', '报警类型', '报警时间', '通道', '是否已读', '操作'],
        checkArr: [ '设备SN', '报警类型', '报警时间', '通道', '是否已读','操作'],
        status: 0,
        // imageList:[],
        // imgShow: true,
        currentRow:{},
        dialogFormVisible: false,
        solveOptionArr: [], // 处理意见
        solvereason:[], //处理意见JSON
        form: {
          solveOption: [], //处理意见
          remarks:'', //备注
        },
        rules: {
          solveOption: [
            { required: true, trigger: 'blur', message: '请选择处理意见' },
          ],
          remarks: [
            { required: false, trigger: 'blur', message: '请填写备注' },
          ],
        },
        fileList: [], //上传的视频列表
        //上传 参数
        filedata: {
          UserID: sessionStorage.getItem('UserID'),
          filetype: 'alarmhandle',
          folderaddymd: 1,
        },
        //上传接口
        urlHeader:process.env.NODE_ENV === 'development' ? 'http://192.168.2.150:83' : '',
        action: process.env.NODE_ENV === 'development' ? 'http://192.168.2.150:83/api/system/SysFileUpload' : '/api/system/SysFileUpload',
        filePicList: [], //上传的图片列表
        //上传图片预览
        dialogImageUrl: '',
        dialogVisible: false,
        // disabled: false,
        editFlag:false

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
      //点击tab
      handleTabClick(e) {
        this.pageSize = 10
        this.currentPage = 1
        if (e.label == '未处理') {
          this.status = 0
        } else if (e.label == '已处理') {
          this.status = 10
        }
        this.fetchData()
      },
      //点击 处理
      toSolve(row){
        //点击处理 查询 处理意见
        this.querySolveOption()
        this.dialogFormVisible = true
        this.currentRow = row
        // 如果处理已经保存 则回显数据
        if(row.alarmhandlestatus == 10){
          this.editFlag = true //已经提交禁止操作 disabled
        } else {
          this.editFlag = false
        }
        if(row.alarmreason){
          let reason = JSON.parse(row.alarmreason)
          let upload = JSON.parse(row.alarmhandlefile)
          this.form.remarks = row.alarmhandledesc  //备注
          for(let i=0;i<reason.length;i++){
            this.form.solveOption.push(reason[i].Value)  //处理意见
          }
          for(let j=0;j<upload.videoArr.length;j++){
            upload.videoArr[j].url = upload.videoArr[j].filename
          }
          for(let K=0;K<upload.picArr.length;K++){
            upload.picArr[K].url = upload.picArr[K].filename
          }
          this.fileList = upload.videoArr
          this.filePicList = upload.picArr

        }
      },
      async querySolveOption() {
        let params = {
          MarkID: '报警列表处理意见',
          UserID: sessionStorage.getItem('UserID'),
        }
        const { Data } = await getFileType(params)
        this.solveOptionArr = Data
      },
      optionChange(){
        // console.log(this.form.solveOption)
      },
      //视频 上传之前的回调
      uploadVideoBefore(file) {
        const isLt10M = file.size / 1024 / 1024  < 10;
        if (['video/mp4', 'video/ogg', 'video/flv','video/avi','video/wmv','video/rmvb'].indexOf(file.type) == -1) {
          this.$message.error('请上传正确的视频格式');
          return false;
        }
        // if (!isLt10M) {
        //   this.$message.error('上传视频大小不能超过10MB哦!');
        //   return false;
        // }
      },
      // 上传视频 成功的回调
      uploadVideoSuccess(file) {
        if (file.Status == 0) {
          this.$baseMessage(file.Data[0].truefilename + '上传成功', 'success')
          file.Data[0].url = file.Data[0].filename
          this.fileList.push(file.Data[0])
        }
      },
      //上传视频 失败的回调
      handleVideoError(err, file, fileList) {
        console.log('视频上传失败')
        this.$baseMessage(`视频[${file.raw.name}]上传失败`, 'error')
      },
      //图片 上传之前的回调
      uploadBefore(file) {
        if (['image/jpeg', 'image/jpg', 'image/gif', 'image/bmp', 'image/png'].indexOf(file.type) == -1) {
          this.$message.error('请上传正确的图片格式');
          return false;
        }
      },
      // 上传图片 成功的回调
      uploadSuccess(file) {
        if (file.Status == 0) {
          this.$baseMessage(file.Data[0].truefilename + '上传成功', 'success')
          file.Data[0].url = file.Data[0].filename
          this.filePicList.push(file.Data[0])
        }
      },
      //上传图片 失败的 回调
      handleError(err, file, fileList) {
        console.log('图片上传失败')
        this.$baseMessage(`图片[${file.raw.name}]上传失败`, 'error')
      },
      //图片 移除
      handleRemove(file) {
        for(let i=0;i<this.filePicList.length;i++){
          if(this.filePicList[i].filename == file.filename){
            let str = i--
            this.filePicList.splice(str,1)
          }
        }
      },
      //视屏移除
      handleVideoRemove(file) {
        for(let i=0;i<this.fileList.length;i++){
          if(this.fileList[i].filename == file.filename){
            let str = i--
            this.fileList.splice(str,1)
          }
        }
      },
      //图片预览
      handlePictureCardPreview(file) {
        this.dialogImageUrl = this.urlHeader + file.url;
        console.log(this.dialogImageUrl)
        this.dialogVisible = true;
      },
      // 弹窗关闭
      close() {
        if(this.editFlag ==  true){
          this.closeClear()
          return
        }
        this.$baseConfirm('点击关闭当前弹窗数据将不会保存，您确定要关闭吗？', null, async () => {
          this.$refs['form'].resetFields()
          this.form = this.$options.data().form
          this.dialogFormVisible = false
          this.$emit('fetch-data')

          this.solveOptionArr = []
          this.fileList = []
          this.filePicList = []
          this.currentRow = {}
          this.solvereason = []
          this.form.solveOption = []
        })
      },
      closeClear() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
        this.$emit('fetch-data')

        this.solveOptionArr = []
        this.fileList = []
        this.filePicList = []
        this.currentRow = {}
        this.solvereason = []
        this.form.solveOption = []
      },
      //弹窗 提交、保存
      submit(status){
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            //组装处理的意见json
            this.solvereason = []
            for(let i=0;i<this.solveOptionArr.length;i++){
              if(this.form.solveOption.indexOf(this.solveOptionArr[i].Value) > -1){
                this.solvereason.push(this.solveOptionArr[i])
              }
            }
            let uploadFile = {}
            uploadFile.videoArr = this.fileList
            uploadFile.picArr = this.filePicList
            let params = {
              CallType: '',
              UserID: sessionStorage.getItem('UserID'),
              alarmuid: this.currentRow.alarmuid,
              alarmreason: JSON.stringify(this.solvereason),   //json  报警原因
              alarmhandlefile: JSON.stringify(uploadFile),    //json 报警处理上传文件
              alarmhandledesc:this.form.remarks,    // 报警处理描述
              alarmhandlestatus: status  //报警处理状态 0 保存 10 提交
            }
            this.sumbitSave(params)
          } else {
            return false
          }
        })
      },
      //处理报警结果保存
      async sumbitSave(params){
        let result = await sysAlarmkHandle(params)
        if (result.Status == 0) {
          this.$baseMessage('操作成功', 'success')
          this.closeClear()
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
          CallType: '',
          UserID: sessionStorage.getItem('UserID'),
          status: this.status,
          SearchKey: this.searchData,
          PageSize: this.pageSize,
          CurrentPage: this.currentPage,
        }
        const { Data, Count } = await getSYSAlarmList(params)
        this.list = Data
        this.total = Count
        // const imageList = []
        // Data.forEach((item, index) => {
        //   imageList.push(item.alarmimg)
        // })
        // this.imageList = imageList

        setTimeout(() => {
          this.listLoading = false
        }, 500)
      },
    },
  }
</script>
<style scoped>
  .uploadSizeSty{
      box-sizing: border-box;
      border: 1px dashed #d9d9d9;
      width: 148px;
      height: 146px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 20px;
      /* margin-top: 10px; */
      position: relative;
      border-radius: 5px;
    }
</style>
