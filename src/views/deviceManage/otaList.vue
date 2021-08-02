<template>
  <div class="table-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form ref="form" :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-input v-model="searchData" placeholder="请输入名称/类型/版本" style="width: 300px" />
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
        <el-table-column v-if="itemArr.indexOf('文件名称') > -1" show-overflow-tooltip label="文件名称" prop="filetruename" ></el-table-column>
        <el-table-column v-if="itemArr.indexOf('文件类型') > -1" show-overflow-tooltip label="文件类型" prop="filetype"></el-table-column>
        <el-table-column v-if="itemArr.indexOf('文件版本') > -1" show-overflow-tooltip label="文件版本" prop="filever" width="120" ></el-table-column>
        <!-- <el-table-column v-if="itemArr.indexOf('路径') > -1" show-overflow-tooltip label="路径" prop="filepath"></el-table-column> -->
        <el-table-column v-if="itemArr.indexOf('文件大小 (字节)') > -1" show-overflow-tooltip label="文件大小 (字节)" prop="filesize">
          <!-- <template #default="{ row }">
            <span> {{row.filesize + '&nbsp' + 'kb'}} </span>
          </template> -->
        </el-table-column>
        <el-table-column v-if="itemArr.indexOf('上传人') > -1" show-overflow-tooltip label="上传人" prop="createdby"></el-table-column>
        <el-table-column v-if="itemArr.indexOf('上传时间') > -1" show-overflow-tooltip label="上传时间" prop="createddate"></el-table-column>
        <el-table-column v-if="itemArr.indexOf('文件描述') > -1" show-overflow-tooltip label="文件描述" prop="filedesc" ></el-table-column>
        <el-table-column v-if="itemArr.indexOf('操作') > -1" show-overflow-tooltip label="操作" width="180px" >
          <template #default="{ row }">
            <el-button type="text" @click="goToDetailPage(row)">下发升级任务 </el-button>
            <el-button type="text" v-if="operationArr.indexOf('del') != -1" @click="deleteRow(row)">删除 </el-button>
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
        <el-form-item label="文件类型" prop="filetype">
          <el-select v-model="form.filetype" placeholder="请选择文件类型" style="width: 350px" @change="filetypeChange" >
            <el-option v-for="item in typeList" :key="item.DictionaryID" :label="item.Name" :value="item.Name + '/' + item.Value" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传文件" prop="uploadFile">
          <el-upload
            ref="upload"
            :action="action"
            :data="filedata"
            :auto-upload="true"
            :multiple="false"
            :on-success="uploadSuccess"
            :before-upload="uploadBefore"
            :on-error="handleError"
            name="file"
            class="upload-content"
            list-type="text"
            :show-file-list="true"
            :file-list="fileList"
           
          >
            <!-- :limit="1" -->
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="版本号" prop="filever">
          <el-input v-model.trim="form.filever" autocomplete="off" placeholder="请输入版本号"></el-input>
        </el-form-item>
        <el-form-item label="文件描述" prop="filedesc">
          <el-input v-model="form.filedesc" autocomplete="off" type="textarea" placeholder="请输入文件描述"></el-input>
          <!-- v-model.trim="form.filedesc" -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button :disabled="btnFlag== 0" type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getOTAList, submitUploadFile, getFileType } from '@/api/device'
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
        uploadSucessInfo: {},
        title: '', //弹窗名字
        typeList: [], // 文件类型数组
        filedata: {
          UserID: sessionStorage.getItem('UserID'),
          filetype: '',
        },
        form: {
          filever: '', //版本
          filedesc: '', //版本描述
          filetype: '', //文件类型 选中的值
          uploadFile: {}, //上传成功 返回的文件信息
        },
        rules: {
          filetype: [
            { required: true, trigger: 'change', message: '请选择文件类型' },
          ],
          uploadFile: [
            { required: true, trigger: 'change', message: '请上传文件' },
          ],
          filever: [
            { required: true, trigger: 'blur', message: '请填写版本号' },
          ],
        },

        dialogFormVisible: false,
        action: process.env.NODE_ENV === 'development' ? 'http://192.168.2.150:83/api/device/DeviceFileUpload' : '/api/device/DeviceFileUpload',
        ufileuid: '',
        fileList: [],
        filesize: '',
        filesign: '',
        filesignmethod: '',
        itemArr: ['文件名称', '文件类型', '文件版本', '文件大小 (字节)', '上传人', '上传时间', '文件描述', '操作'],
        checkArr: ['文件名称', '文件类型', '文件版本', '文件大小 (字节)', '上传人', '上传时间', '文件描述', '操作'],
        btnFlag:0,
        operationArr: [],
      }
    },
    computed: {
      height() {
        return this.$baseTableHeight()
      }
    },
    mounted() {
      this.operationArr = assist.operation('otaList')
    },
    // created() {
    //   this.fetchData()
    // },
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
      //跳转页面
      goToDetailPage(row) {
        //把本行数据保存到sessionStorage
        sessionStorage.setItem('otadetail', JSON.stringify(row))
        this.$router.push({
          path: '/deviceManage/otadetail',
          query: {
            ufileuid: row.ufileuid,
          },
        })
      },
      //点击删除按钮
      deleteRow(row){
        this.$baseConfirm('你确定要删除当前行吗？', null, async () => {
          let params = {
            CallType: 'del',
            UserID: sessionStorage.getItem('UserID'),
            ufileuid: row.ufileuid
          }
          let result = await submitUploadFile(params)
          this.$baseMessage('删除成功', 'success')
          this.fetchData()
        })
      },
      //点击编辑
      goToEdit(row) {
        //点击添加 查询 文件类型
        this.queryFileType()

        this.title = '编辑文件'
        this.dialogFormVisible = true
        this.form.filever = row.filever
        this.form.filedesc = row.filedesc
        this.form.filetype = row.filetype
        this.fileList = [{ name: row.filetruename }]
      },

      // 点击添加
      handleAdd() {
        //点击添加 查询 文件类型
        this.queryFileType()

        this.title = '添加文件'
        this.dialogFormVisible = true
      },
      async queryFileType() {
        let params = {
          MarkID: '车辆监控文件类型',
          UserID: sessionStorage.getItem('UserID'),
        }
        const { Data } = await getFileType(params)
        this.typeList = Data
      },
      //文件类型选择发生变化
      filetypeChange() {
        let arr = this.form.filetype.split('/')
        this.filedata.filetype = arr[1]
        this.form.filetype = arr[0]
      },
      // 弹窗关闭
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
        this.$emit('fetch-data')
        this.fileList = []
      },
      // 弹窗确定
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            //组装参数
            if (!this.form.uploadFile.truefilename) {
              this.$baseMessage('请上传文件！', 'warning')
              return
            }
            let params = {
              CallType: 'new',
              UserID: sessionStorage.getItem('UserID'),
              AppToken: '',
              ufileuid: this.getGuid(),
              // filetype: this.form.uploadFile.filetype,  //这个是返回的文件类型（不对）
              filetype: this.form.filetype, //这个是选择的文件类型 （对）
              filetruename: this.form.uploadFile.truefilename,
              filepath: this.form.uploadFile.filename,
              filever: this.form.filever,
              filedesc: this.form.filedesc,
              filesize: this.filesize,
              filesign: this.filesign,
              filesignmethod: this.filesignmethod,
            }
            this.dialogFormVisible = false
            this.$refs['form'].resetFields()
            this.form = this.$options.data().form
            this.submitUpload(params) //最后一步提交
          } else {
            return false
          }
        })
      },
      //文件上传之前的回调
      uploadBefore(file) {
        this.filesize = file.size //保存文件大小

        if (this.form.filetype == '') {
          this.$baseMessage('请先选择文件类型', 'warning')
          return false
        }
        return true
      },
      // 上传文件成功的回调
      uploadSuccess(item) {
        if (item.Status == 0) {
          this.$baseMessage(item.Data[0].truefilename + '上传成功', 'success')
          this.btnFlag = 1
        }
        this.uploadSucessInfo = item.Data[0]
        this.form.uploadFile = item.Data[0]
        this.filesign = item.Data[0].filesign
        this.filesignmethod = item.Data[0].filesignmethod
      },
      //上传失败的 回调
      handleError(err, file, fileList) {
        this.$baseMessage(`文件[${file.raw.name}]上传失败`, 'error')
      },

      // 弹窗信息提交
      async submitUpload(params) {
        let result = await submitUploadFile(params)
        if (result.Status == 0) {
          this.$baseMessage('保存成功', 'success')
          const { Data } = result
          this.ufileuid = Data[0].ufileuid
          this.fetchData() //更新列表
        }
      },
      // 查询列表信息
      async fetchData() {
        this.listLoading = true
        let params = {
          CallType: 'all',
          UserID: sessionStorage.getItem('UserID'),
          filetype: '',
          status: '',
          SearchKey: this.searchData,
          PageSize: this.pageSize,
          CurrentPage: this.currentPage,
        }
        const { Data, Count } = await getOTAList(params)
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
