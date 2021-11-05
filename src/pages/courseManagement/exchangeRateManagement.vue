<template>
  <div class="content-wrapper">
    <div class="content">
      <el-form :inline="true" size="medium" class="demo-form-inline" style="padding-top: 10px;padding-left: 10px">
        <el-form-item label="年份">
          <el-select v-model="form.recentYear" @change="yearChange" placeholder="请选择" clearable>
            <el-option
              v-for="item in years"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <Table
        :tableData='tableData'
        :columns='columns'
        :operation='operation'
        :total='total'
        :currentPage='pageNum'
        :pageSize='pageSize'
        @sizeChange='handleSizeChange'
        @currentChange='handleCurrentChange'
        @handleClick='handleClick'>
      </Table>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @close='closeDialog' width="200px">
      <el-form :model="ruleForm" ref="ruleForm" :rules="rules" :label-position="labelPosition" label-width="80px"
               size="medium" class="demo-form-inline" style="padding-left: 20px;padding-top:20px;" label="请编辑汇率信息">
        <el-form-item prop="currencyHkd" label="港币">
          <el-input style="width: 280px;" v-model="ruleForm.currencyHkd" clearable placeholder=""
                    :maxlength="inputMax"></el-input>
        </el-form-item>
        <el-form-item prop="currencyUsd" label="美元">
          <el-input style="width: 280px;" v-model="ruleForm.currencyUsd" clearable placeholder=""
                    :maxlength="inputMax"></el-input>
        </el-form-item>
        <el-form-item prop="currencyEur" label="欧元">
          <el-input style="width: 280px;" v-model="ruleForm.currencyEur" clearable placeholder=""
                    :maxlength="inputMax"></el-input>
        </el-form-item>
        <el-form-item prop="currencyGbp" label="英镑">
          <el-input style="width: 280px;" v-model="ruleForm.currencyGbp" clearable placeholder=""
                    :maxlength="inputMax"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <div style="text-align: center;">提示: 汇率设置后24小时内支持修改</div>
      <div slot="footer" class="dialog-footer">
        <div style="text-align: center;padding-top:20px;">
          <el-button style="height: 36px;line-height: 36px;padding: 0;" size="medium" type="primary"
                     @click="dialogComfirm('ruleForm')">确定
          </el-button>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import Table from '@/components/Table'
  import {
    toData
  } from '@/util/assist'

  export default {
    data() {
      var sortNo = (rule, value, callback) => {
        var reg = /(^[1-9][0-9]{0,3}$)|(^[0-9]{0,5}[\.][0-9]{1,4}$)/
        if (!reg.test(value)) {
          callback(new Error('汇率范围是整数最大四位数，小数保留四位'));
        } else {
          callback();
        }
      };
      return {
        //table
        /*   monthArr: [
             '有效期','1月','2月','3月','4月'
             ,'5月','6月','7月','8月','9月','10月','11月',
             '12月'
           ],*/
        years: [],
        form: {
          recentYear: ''
        },
        tableData: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
        // 列
        columns: [
          {
            label: '有效期',
            prop: 'monthNo',
            show: true,
            width: '160'
          },
          {
            label: '港币',
            prop: 'currencyHkd',
            show: true,
            width: '160'
          },
          {
            label: '美元',
            prop: 'currencyUsd',
            show: true,
            width: '160'
          },
          {
            label: '欧元',
            prop: 'currencyEur',
            show: true,
            width: '160'
          },
          {
            label: '英镑',
            prop: 'currencyGbp',
            show: true,
            width: '160'
          },
          {
            label: '添加时间',
            prop: 'updatetime',
            show: true,
            width: '160'
          }
        ],
        // 操作
        operation: {
          show: true,
          label: '操作',
          width: '160',
          options: [{
            label: '编辑',
            method: 'edit'
          }
          ]
        },
        agentId: '',
        ruleForm: {
          currencyUsd: '',
          currencyHkd: '',
          currencyEur: '',
          currencyGbp: '',
          monthNo: ''
        },
        rules: {
          currencyUsd: [{required: true, message: '请输入美元汇率', trigger: 'blur'}, {validator: sortNo, trigger: 'blur'}],
          currencyHkd: [{required: true, message: '请输入港币汇率', trigger: 'blur'}, {validator: sortNo, trigger: 'blur'}],
          currencyEur: [{required: true, message: '请输入欧元汇率', trigger: 'blur'}, {validator: sortNo, trigger: 'blur'}],
          currencyGbp: [{required: true, message: '请输入英镑汇率', trigger: 'blur'}, {validator: sortNo, trigger: 'blur'}],
        },
        labelPosition: 'right',
        id: null,
        agentCode: '',
        dialogTitle: '',
        dialogFormVisible: false,

      }
    },
    mounted() {
      this.init()
      this.initExchangeRateSearch()
    },
    methods: {
      init() {
        var myDate = new Date;
        var year = myDate.getFullYear();//获取当前年
        this.initSelectYear(year)
        this.form.recentYear = year;
      },
      initSelectYear(year) {
        this.years = [];
        for (let i = 0; i < 30; i++) {
          this.years.push({value: (year - i), label: (year - i) + "年"});
        }
        for (let i = 1; i < 30; i++) {
          this.years.unshift({value: (year + i), label: (year + i) + "年"});

        }
      },
      yearChange(value) {
        this.form.recentYear = value
        this.initExchangeRateSearch()
      },


      //获取代理列表
      initExchangeRateSearch() {
        this.$http.post(this.$service.searchByYear + "?yearNo=" + this.form.recentYear).then(data => {
          this.tableData = []
          if (data.code == 200) {
            let month = 1;
            for (let i = 0; month < 13;) {
              if (data.data[i] != undefined && data.data[i].monthNo == month) {
                this.tableData.push(data.data[i])
                i++;
              } else {
                this.tableData.push({monthNo: month})
              }
              month++;
            }
          } else {
            this.$message.error(data.message)
          }
        })
      },

      dialogComfirm(ruleForm) {
        this.$refs[ruleForm].validate((valid, object) => {
          if (valid) {
            if (this.dialogTitle == '请编辑汇率信息') {
              var data = {
                currencyHkd: this.ruleForm.currencyHkd,
                currencyUsd: this.ruleForm.currencyUsd,
                currencyGbp: this.ruleForm.currencyGbp,
                currencyEur: this.ruleForm.currencyEur,
                id: this.id,
                monthNo: this.ruleForm.monthNo,

                yearNo: this.form.recentYear
              }
              this.$http.post(this.$service.editByYearAndMonth, data).then(data => {
                if (data.code == 200) {
                  this.$message.success('编辑成功')
                  this.initExchangeRateSearch()
                  this.dialogFormVisible = false
                } else {
                  this.$message.error(data.message)
                }
              })
            }
          } else {
            setTimeout(() => {
              var isError = document.getElementsByClassName("is-error");
              if (isError[0].querySelector('input')) {
                isError[0].querySelector('input').focus()
              } else if (isError[0].querySelector('textarea')) {
                isError[0].querySelector('textarea').focus()
              }
            }, 100);
            return false;
          }
        })
      },
      //操作
      handleClick(scope) {
        if (!this.checkEdit(scope.row.updatetime)){
          this.$message.error("汇率设置已超过24小时")
          return;
        }
        if (scope.method == 'edit') {
          this.dialogTitle = '请编辑汇率信息'
          this.dialogFormVisible = true
          this.ruleForm.currencyUsd = scope.row.currencyUsd
          this.ruleForm.currencyHkd = scope.row.currencyHkd
          this.ruleForm.currencyEur = scope.row.currencyEur
          this.ruleForm.currencyGbp = scope.row.currencyGbp
          this.ruleForm.monthNo = scope.row.monthNo
          this.id = scope.row.id
        }
      },
      checkEdit(date) {
        var today = new Date();
        date = new Date(date)
        var dateStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate() + 1) + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        var todayStr = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        if (todayStr > dateStr) {
          return false;
        } else {
          return true;
        }
      },
      handleCurrentChange(e) {
        this.pageNum = e
        this.initAgentSearch()
      },
      handleSizeChange(e) {
        this.pageSize = e
        this.initAgentSearch()
      },
      closeDialog() {
        this.dialogFormVisible = false
        this.agentId = ''
      },
    },
    watch: {
      tableData(idx) {
        return idx
      }
    },
    components: {
      Table
    }
  }
</script>

<style>
  @import url("../../assets/icon/iconfont.css");

  .content-wrapper {
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    overflow: hidden;
    background-color: #f3f6f9 !important;
  }

  .el-form {
    background-color: #FFF;
  }

  .el-form--inline .el-form-item {
    margin-bottom: 0;
    vertical-align: bottom;
  }

  .wrapper, .content {
    width: 100%;
    background-color: #fff;
  }

  .content-search-normal {
    padding: 20px !important;
    background: #fff;
  }

  .el-dialog {
    width: 300px;
    min-width: 500px !important;
  }
</style>
