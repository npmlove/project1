<template>
  <div class="content-wrapper">
    <div class="content">
      <el-form :inline="true" size="medium" class="demo-form-inline">
        <div class="content-search-normal">
          <el-form-item label="字典编号">
            <el-input style="width: 200px;" size="medium" :maxlength="inputMax" v-model="code" clearable placeholder="请输入字典编号"></el-input>
          </el-form-item>
          <el-form-item label="字典名称">
            <el-input style="width: 200px;" size="medium" :maxlength="inputMax" v-model="dictValue" clearable placeholder="请输入字典名称"></el-input>
          </el-form-item>
          <el-form-item label="字典备注">
            <el-input style="width: 200px;" size="medium" :maxlength="inputMax" v-model="remark" clearable placeholder="请输入字典备注"></el-input>
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-button @click="searchClick" size="medium" type="primary">搜索 </el-button>
              <el-button @click="restClick" size="medium" type="primary">清空</el-button>
            </el-row>
          </el-form-item>
          <el-form-item style="float: right;margin-right: 0">
            <el-row>
              <el-button @click="newAdd" size="medium">新增</el-button>
            </el-row>
          </el-form-item>
        </div>
      </el-form>
      <Table :tableData='tableData' :columns='columns' :operation='operation' :total='total'
        :currentPage='pageNum' :pageSize='pageSize' @sizeChange='handleSizeChange' @currentChange='handleCurrentChange'
        @handleClick='handleClick'>
      </Table>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @close='closeDialog' width="200px">
      <el-form :model="ruleForm" ref="ruleForm" :rules="rules" :label-position="labelPosition" label-width="80px"
        size="medium" class="demo-form-inline" style="padding-left: 20px;padding-top:20px;">
        <el-form-item prop="code" label="字典编号">
          <el-input style="width: 280px;" v-model="ruleForm.code" clearable placeholder="请输入字典编号"
            :maxlength="inputMax"></el-input>
        </el-form-item>
        <el-form-item prop="dictValue" label="字典名称">
          <el-input style="width: 280px;" v-model="ruleForm.dictValue" clearable placeholder="请输入字典名称"
            :maxlength="inputMax"></el-input>
        </el-form-item>
        <el-form-item prop="parentId" label="上级字典">
          <el-input style="width: 280px;"  clearable placeholder="请选择上级字典"
            :maxlength="inputMax"></el-input>
        </el-form-item>
        <el-form-item prop="dictKey" label="字典键值">
          <el-input style="width: 280px;" v-model="ruleForm.dictKey" clearable placeholder="请输入字典键值"
            :maxlength="inputMax"></el-input>
        </el-form-item>
        <el-form-item prop="sort" label="字典排序">
          <el-input style="width: 280px;" v-model="ruleForm.sort" clearable placeholder="请输入字典排序"
            :maxlength="inputMax"></el-input>
        </el-form-item>
        <el-form-item prop="remark" label="字典备注">
          <el-input style="width: 280px;"  clearable placeholder="请输入字典备注"
            :maxlength="inputMax"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <div style="text-align: center;padding-top:20px;">
          <el-button size="medium" type="primary"
            @click="dialogComfirm('ruleForm')">确定</el-button>
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
        columns: [
          {
            label: "字典编号",
            prop: "code",
            show: true,
            width: '100'

          },
          {
            label: "字典名称",
            prop: "dictValue",
            show: true,
            width: '100'
          },
          {
            label: "上级字典",
            prop: "parentId",
            show:false
          },
          {
            label: "字典键值",
            prop: "dictKey",
            show: true,
            width: '100'
          },
          {
            label: "字典排序",
            prop: "sort",
            show: true,
            width: '100'
          },
          {
            label: "字典备注",
            prop: "remark",
            show: true,
            width: '100'
          },
        ],
        // 操作
        operation: {
          show: true,
          label: '操作',
          width: '160',
          options: [{
            label: '查看',
            method: 'view'
          },
            {
              label: '编辑',
              method: 'del'
            },
            {
              label: '删除',
              method: 'del'
            },
            {
              label: '新增子项',
              method: 'add'
            },
          ]
        },
        ruleForm: {
          code: '',
          dictValue: '',
          dictKey:'',
          sort:''
        },
        rules: {
          code: [{
            required: true,
            message: '请输入字典编号',
            trigger: 'blur'
          }],
          dictValue: [{
            required: true,
            message: '请输入字典名称',
            trigger: 'blur'
          }],
          dictKey: [{
            required: true,
            message: '请输入字典键值',
            trigger: 'blur'
          }],
          sort: [{
            required: true,
            message: '请输入字典排序',
            trigger: 'blur'
          }]
        },
        tableData: [],
        labelPosition: 'right',
        code: '',
        dictValue: '',
        remark:'',
        dialogTitle: '',
        dialogFormVisible: false,
      }
    },
    mounted() {
      this.initAgentSearch()
    },
    methods: {
      //获取代理列表
      initAgentSearch() {
        var params = {
          code: this.code,
          dictValue: this.dictValue,
        }
        this.$http.get(this.$service.dictList+ '?code='+this.code+"&dict_value="+this.dictValue).then(data => {
          if (data.code == 200) {
            this.tableData = data.data.records
          } else {
            this.$message.error(data.message)
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
                } else {
                  this.$message.error(data.message)
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
          this.$confirm("确定删除这条数据?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.$http.put(this.$service.agentDelete + '?id=' + scope.row.id).then(data => {
              if (data.code == 200) {
                this.initAgentSearch()
                this.$message.success('删除成功')
              } else {
                this.$message.error(data.message)
              }
            })
          }).catch(() => {
            console.log('取消')
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
