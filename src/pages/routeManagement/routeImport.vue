<template>
  <div class="content-wrapper">
    <div class="content">
      <div style="font-size: 16px;font-weight: 100;margin-bottom: 10px;">数据导入</div>
      <div style="font-size: 14px;color: #999;">温馨提示：请按<a :href="href">下载模板</a>说明填写信息后上传，可支持多个文件同时导入，支持格式：xls</div>
      <div style="margin: 20px 0;display: flex;align-items: flex-start;">
        <el-upload
          style="display: inline-block;margin-left: 10px;"
          class="upload-demo"
          action="#"
          :on-change="handleChange"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :auto-upload="false">
          <el-button type="primary" size="medium">立即导入</el-button>
        </el-upload>
      </div>

      <div style="border-bottom: 1px solid rgba(153, 153, 153, 0.2);margin-bottom: 20px;"></div>

      <div style="font-size: 16px;font-weight: 100;margin-bottom: 10px;">下载航线价格表</div>
      <div style="font-size: 14px;color: #999;">请输入需要下载的航线id，多条航线用逗号分隔，最多可支持20条</div>
      <div style="margin-top: 20px;">
        <el-input style="width: 280px;" size="medium"  v-model="ids" clearable
                  placeholder="例: 1,2,3,4"></el-input>
        <el-button type="success" size="medium" plain icon="el-icon-download" @click="handleExport"
                   style="margin-left: 10px;">导出
        </el-button>
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
        excelInfo: "", //文件信息
        href: ''
      }
    },
    mounted() {
      this.href = '/image/template/excelTemplate.xlsx'
    },
    methods: {
      // 导入文件的上传
      handleChange(file) {
        this.excelInfo = file.raw;
        const isExcel = file.raw.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isExcel) {
          this.$message.error('只能上传Excel文件!');
          return
        }
        if (!isLt2M) {
          this.$message.error('上传Excel文件不能超过 2MB!');
          return
        }
        this.importExcel()
      },
      importExcel() {
        const formdate = new FormData();
        formdate.append("excel", this.excelInfo);
        axios.post(this.$service.airlineExcelImport, formdate, {responseType: 'arraybuffer'}).then(res => {
          let enc = new TextDecoder("utf-8");
          let uint8_msg = new Uint8Array(res);
          let str=enc.decode(uint8_msg);
          if (str.indexOf("code") !== -1) {
            let data = JSON.parse(enc.decode(uint8_msg));
            this.$message.error(data.message)
            return;
          }
          if (res.byteLength == 0) {
            this.$message.success('导入成功')
            return;
          } else {
            this.$message.error('导入失败,请查看失败文件')
          }
          const aLink = document.createElement("a");
          let blob = new Blob([res], {
            type: "application/vnd.ms-excel"
          })
          aLink.href = URL.createObjectURL(blob)
          aLink.setAttribute('download', '导入失败文件' + '.xlsx')
          aLink.click()
          document.body.appendChild(aLink)
        })
      },
      // 删除文件
      handleRemove(file) {
        this.excelInfo = "";
      },
      // 预览文件
      handlePreview(file) {
        window.location.href = URL.createObjectURL(file.raw);
      },
      //导出
      handleExport() {
        if (!this.ids) {
          this.$message.error('请输入航线ID')
          return
        }
        this.$confirm("是否导出航线价格?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let value = this.ids.replace("，",",").replace(/\s*/g,"");
          var flag = new RegExp("[`~!@#$^&*()=|{}':;'\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]")
          if(flag.test(value)){
            this.$message.error('请用逗号分割')
            return
          }
          axios.post(this.$service.airlineExcelExport, {
            ids:    value
          }, {
            responseType: 'arraybuffer'
          }).then((res) => {
            let enc = new TextDecoder("utf-8");
            let uint8_msg = new Uint8Array(res);
            let str=enc.decode(uint8_msg);
            if (str.indexOf("code") !== -1) {
              let data = JSON.parse(enc.decode(uint8_msg));
              this.$message.error(data.message)
              return;
            }
            // if(res.status == "200") {
            const aLink = document.createElement("a");
            let blob = new Blob([res], {
              type: "application/vnd.ms-excel"
            })
            aLink.href = URL.createObjectURL(blob)
            if ([...new Set(value.split(","))].filter((x)=>x!=='').length > 1) {
              aLink.setAttribute('download', '航线价格表' + '.zip') // 设置下载文件名称
            } else {
              aLink.setAttribute('download', '航线价格表' + '.xlsx') // 设置下载文件名称
            }

            aLink.click()
            document.body.appendChild(aLink)
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

  .content {
    background-color: #FFF;
    padding: 20px;
    box-sizing: border-box;
  }
</style>
