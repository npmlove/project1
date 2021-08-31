<template>
  <div class="content-wrapper">
    <div class="main-title">
      <el-button class="in-out-button" @click="checkImportExcelDialogVisible">导入</el-button>
    </div>
    <!-- 导入弹框 -->
    <el-dialog title="导入" :visible.sync="importExcelDialogVisible" width="600px" class="import-class" destroy-on-close
      @close="excelInfo=''">
      <div v-loading="loadingUpload">
        <div>
          第一步：请<a @click="downTemplate">下载模板</a>，按说明填写信息后上传
        </div>
        <div class="uploadExcel">
          <span>第二步：导入文件</span>
          <el-upload class="upload-demo" action="#" :on-change="handleChange" :on-preview="handlePreview"
            :on-remove="handleRemove" :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary" v-if="excelInfo==''">选取文件
            </el-button>
          </el-upload>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="importExcelDialogVisible = false">取 消</el-button>
          <el-button type="danger" :disabled="importExcelDisabled" @click="importExcel">确 定</el-button>
        </span>
      </div>
    </el-dialog>
    <div class="content">
      <el-input style="width: 280px;" size="medium" :maxlength="inputMax" v-model="ids" clearable placeholder="例: 1,2,3,4"></el-input>
      <div class="echarts-all">
        <el-button type="warning" size="small" plain icon="el-icon-download" @click="handleExport">导出</el-button>
      </div>
    </div>

  </div>
</template>

<script>
  import axios from "axios";

  export default {
    data() {
      return {
        ids: '',
        checkCode: 0,
        dialogVisible: false,
        loadingUpload: false,
        importExcelDialogVisible: false, //导入弹框开关
        importExcelDisabled: true, //导入弹框确定开关
        excelInfo: "", //文件信息
      }
    },
    mounted() {

    },
    methods: {
      // 导入文件的上传
      handleChange(file) {
        this.excelInfo = file.raw;
        this.importExcelDisabled = false;
        const isExcel = file.raw.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isExcel) {
          this.$message.error('只能上传Excel文件!');
        }
        if (!isLt2M) {
          this.$message.error('上传Excel文件不能超过 2MB!');
        }
        return isExcel && isLt2M;
      },
      // 删除文件
      handleRemove(file) {
        this.excelInfo = "";
        this.importExcelDisabled = true;
      },
      // 预览文件
      handlePreview(file) {
        window.location.href = URL.createObjectURL(file.raw);
      },
      checkImportExcelDialogVisible() {
        if (this.checkCode == 10010) {
          this.dialogVisible = true;
        } else {
          this.importExcelDialogVisible = true;
        }
      },
      importExcel() {
        this.loadingUpload = true
        this.importExcelDisabled = true;
        const formdate = new FormData();
        formdate.append("excel", this.excelInfo);
        axios.post(this.$service.airlineExcelImport, formdate, {
          responseType: 'arraybuffer'
        }).then(res => {
          if (res.byteLength == 0) {
            this.$message.success('导入成功')
            this.importExcelDialogVisible = false
            return;
          } else {
            this.$message.success('导入失败,请查看失败文件')
            this.importExcelDialogVisible = false
          }
          const aLink = document.createElement("a");
          let blob = new Blob([res], {
            type: "application/vnd.ms-excel"
          })
          aLink.href = URL.createObjectURL(blob)
          aLink.setAttribute('download', '导入失败文件' + '.xlsx') // 设置下载文件名称

          aLink.click()
          document.body.appendChild(aLink)
        })
      },
      downTemplate() {
        axios.get(this.$service.downloadTemplate, {
          responseType: 'arraybuffer'
        }).then((res) => {
          // if(res.status == "200") {
          const aLink = document.createElement("a");
          let blob = new Blob([res], {
            type: "application/vnd.ms-excel"
          })
          aLink.href = URL.createObjectURL(blob)
          aLink.setAttribute('download', '价格导入模板' + '.xlsx') // 设置下载文件名称
          aLink.click()
          document.body.appendChild(aLink)
          // this.$refs.loadElement.appendChild(aLink)
          // }
        })
      },
      handleExport() {
        this.$confirm("是否导出航线价格?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          axios.post(this.$service.airlineExcelExport, {
            ids: this.ids
          }, {
            responseType: 'arraybuffer'
          }).then((res) => {
            // if(res.status == "200") {
            const aLink = document.createElement("a");
            let blob = new Blob([res], {
              type: "application/vnd.ms-excel"
            })
            aLink.href = URL.createObjectURL(blob)
            if (this.ids.length > 1) {
              aLink.setAttribute('download', '客户资源' + '.zip') // 设置下载文件名称
            } else {
              aLink.setAttribute('download', '客户资源' + '.xlsx') // 设置下载文件名称
            }

            aLink.click()
            document.body.appendChild(aLink)
            // this.$refs.loadElement.appendChild(aLink)
            // }
          })

        });
      },
    }
  }
</script>

<style scoped lang="less">
  @import url("../../assets/icon/iconfont.css");

  .content-wrapper {
    width: 100%;
    box-sizing: border-box;
    /*height: 100%;*/
    padding: 20px;
    overflow: hidden;
    background-color: #f3f6f9 !important;
  }

  .echarts-all {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }

  .echarts-all>div {
    width: 32.33%;
    height: 45vh;
    min-width: 450px;
    min-height: 430px;
    margin-right: 1.5%;
    border: 1px solid #dedede;
    box-sizing: border-box;
    background-color: #FFF;
    margin-top: 15px;
    // padding: 15px;
  }

  .echarts-all>div:nth-of-type(3n) {
    margin-right: 0;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
