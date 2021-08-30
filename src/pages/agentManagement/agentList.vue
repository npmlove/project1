<template>
  <div class="content-wrapper">
    <div class="content">
      <el-form :inline="true" size="medium" class="demo-form-inline">
        <div class="content-search-normal">
          <el-form-item label="代理名称">
            <el-input style="width: 200px;" size="medium" :maxlength="inputMax" v-model="agentName" clearable  placeholder="请输入代理名称"></el-input>
          </el-form-item>
          <el-form-item label="代理简称">
            <el-input style="width: 200px;" size="medium" :maxlength="inputMax" v-model="agentAbbreviation" clearable placeholder="请输入代理简称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-button @click="searchClick" size="medium" type="primary">搜索 </el-button>
              <el-button @click="restClick" size="medium" type="primary">清空</el-button>
            </el-row>
          </el-form-item>
          <el-form-item style="float: right;margin-right: 0">
            <el-row>
              <el-button @click="newAdd" size="medium" type="primary">新增</el-button>
            </el-row>
          </el-form-item>
        </div>
      </el-form>
      <Table
        :checkbox="false"
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
      <el-form :model="ruleForm" ref="ruleForm" :rules="rules" :label-position="labelPosition" label-width="80px" size="medium" class="demo-form-inline" style="padding-left: 20px;padding-top:20px;">
        <el-form-item prop="agentName" label="代理名称">
          <el-input style="width: 280px;" v-model="ruleForm.agentName" clearable placeholder="请输入代理名称" :maxlength="inputMax"></el-input>
        </el-form-item>
        <el-form-item prop="agentCode" label="代理简称">
          <el-input style="width: 280px;" v-model="ruleForm.agentCode" clearable placeholder="请输入代理简称" :maxlength="inputMax"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <div style="text-align: center;padding-top:20px;">
          <el-button style="height: 36px;line-height: 36px;padding: 0;" size="medium" type="primary" @click="dialogComfirm('ruleForm')">确定</el-button>
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
      return {
        //table
        tableData: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
        // 列
        columns: [{
            label: '代理名称',
            prop: 'agentName',
            show: true,
            width: '160'
          },
          {
            label: '代理简称',
            prop: 'agentCode',
            show: true,
            width: '160'
          },
          {
            label: '添加时间',
            prop: 'createTime',
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
            },
            {
              label: '删除',
              method: 'del'
            },
          ]
        },
        agentId: '',
        ruleForm: {
          agentName: '',
          agentCode: ''
        },
        rules: {
          agentName: [{ required: true, message: '请输入代理名称', trigger: 'blur'}],
          agentCode: [{required: true, message: '请输入代理简称', trigger: 'blur'}]
        },
        labelPosition: 'right',
        agentName: '',
        agentAbbreviation: '',
        dialogTitle: '',
        dialogFormVisible: false,
      }
    },
    activated() {
      this.initAgentSearch()
    },
    methods: {
      //获取代理列表
      initAgentSearch() {
        var params = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          agentName: this.agentName,
          agentAbbreviation: this.agentAbbreviation,
        }
        this.$http.post(this.$service.agentList, params).then(data => {
          if (data.code == 200) {
            this.total = data.data.total
            this.tableData = data.data.records
          }
        })
      },

      //查询
      searchClick() {
        this.pageSize = 10
        this.pageNum = 1
        this.initAgentSearch()
      },
      //清空
      restClick() {
        this.agentName = ''
        this.agentAbbreviation = ''
        this.pageSize = 10
        this.pageNum = 1
        this.initAgentSearch()
      },

      //新增
      newAdd() {
        this.dialogFormVisible = true
        this.dialogTitle = '新增代理'
        this.ruleForm = {
          agentName: '',
          agentCode: ''
        }
      },
      dialogComfirm(ruleForm) {
        this.$refs[ruleForm].validate((valid, object) => {
          if (valid) {
            if (this.dialogTitle == '新增代理') {
              this.$http.post(this.$service.agentSave, this.ruleForm).then(data => {
                if (data.code == 200) {
                  this.$message.success('新增成功')
                  this.initAgentSearch()
                  this.dialogFormVisible = false
                }
              })
            } else if (this.dialogTitle == '编辑代理') {
              var data = {
                agentCode: this.ruleForm.agentCode,
                agentName: this.ruleForm.agentName,
                id: this.agentId,
                status: '0'
              }
              this.$http.put(this.$service.agentUpdate, data).then(data => {
                if (data.code == 200) {
                  this.$message.success('编辑成功')
                  this.initAgentSearch()
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
        if (scope.method == 'edit') {
          this.dialogTitle = '编辑代理'
          this.dialogFormVisible = true
          this.ruleForm.agentName = scope.row.agentName
          this.ruleForm.agentCode = scope.row.agentCode
          this.agentId = scope.row.id
        } else if (scope.method == 'del') {
          this.$http.put(this.$service.agentDelete + '?id=' + scope.row.id).then(data => {
            if (data.code == 200) {
              this.initAgentSearch()
              this.$message.success('删除成功')
            } else {
              this.$message.error(data.message)
            }
          })
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

  .wrapper,
  .content {
    width: 100%;
    background-color: #fff;
  }

  .content-search-normal {
    padding: 20px;
    background: #fff;
  }

  .el-dialog {
    width: 300px;
    min-width: 500px;
  }
</style>
