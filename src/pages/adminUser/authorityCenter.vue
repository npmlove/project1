<template>
  <div class="content-wrapper">
    <div class="content">
      <el-form :inline="true" size="medium" class="demo-form-inline">
        <div class="content-search-normal">
          <el-form-item style="float: right;margin-right: 20px">
            <el-row>
              <el-button @click="newAdd" size="medium">新增权限</el-button>
            </el-row>
          </el-form-item>
        </div>
      </el-form>
      <Table ref="multipleTable1" :tableData='tableData' :columns='columns' :operation='operation'
        :total='total' :currentPage='pageNum' :pageSize='pageSize' @handleClick='handleClick'>
      </Table>

      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @close='closeDialog' width="150px">
        <el-form :model="ruleForm" ref="ruleForm" :rules="rules" :label-position="labelPosition" label-width="80px"
          size="medium" class="demo-form-inline" style="padding-left: 20px;padding-top:20px;">

          <el-form-item prop="name" label="权限名称">
            <el-input style="width: 280px;" size="medium" :maxlength="inputMax" v-model="ruleForm.name" clearable
              placeholder="请输入权限名称"></el-input>
          </el-form-item>

          <el-form-item prop="path" label="权限路径">
            <el-input style="width: 280px;" size="medium" :maxlength="inputMax" v-model="ruleForm.path" clearable
              placeholder="请输入权限路径"></el-input>
          </el-form-item>

          <el-form-item prop="title" label="权限标签">
            <el-input style="width: 280px;" size="medium" :maxlength="inputMax" v-model="ruleForm.title" clearable
              placeholder="请输入权限标签"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮 -->
        <div slot="footer" class="dialog-footer">
          <div style="text-align: center;padding-top:20px;">
            <el-button size="medium" type="primary"
              @click="dialogComfirm('ruleForm')">确 定</el-button>
            <el-button size="medium" @click="closeDialog">取 消
            </el-button>
          </div>
        </div>
      </el-dialog>

    </div>
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
        tableData: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
        //列
        columns: [{
            label: '权限名称',
            prop: 'name',
            show: true,
            width: '160'
          },
          {
            label: '权限路径',
            prop: 'path',
            show: true,
            width: '150'
          },
          {
            label: '权限标签',
            prop: 'title',
            show: true,
            width: '150',
          },
          {
            label: '注册时间',
            prop: 'createTime',
            show: true,
            width: '100'
          }
        ],
        //操作
        operation: {
          show: true,
          label: '操作',
          width: '120',
          options: [{
              label: '编辑',
              method: 'edit'
            },
            {
              label: '删除',
              method: 'del'
            }
          ]
        },
        labelPosition: 'right',
        ruleForm: {
          name: '',
          path: '',
          title: ''
        },

        rules: {
          name: [{
            required: true,
            message: '请输入权限名称',
            trigger: 'blur'
          }],
          path: [{
            required: true,
            message: '请输入权限路径',
            trigger: 'blur'
          }],
          title: [{
            required: true,
            message: '请输入权限标签',
            trigger: 'blur'
          }]
        },
        dialogTitle: '新增模块',
        dialogFormVisible: false,
        moduleId: ''
      }
    },
    mounted() {
      this.initAuthoritySearch()
    },

    methods: {
      //获取权限
      initAuthoritySearch() {
        const vm = this
        vm.$http.get(vm.$service.moduleSearch).then(data => {
          if (data.code == 200) {
            //总记录数
            // this.total = data.data.total
            this.tableData = data.data
          }
        }).catch((e) => {
          console.log(e)
        })
      },
      dialogComfirm(ruleForm) {
        this.$refs[ruleForm].validate((valid, object) => {
          if (valid) {

            if (this.dialogTitle == '编辑权限') {
              this.ruleForm.id = this.moduleId
              this.$http.post(this.$service.moduleUpdate, this.ruleForm).then(data => {
                if (data.code == 200) {
                  this.initAuthoritySearch()
                  this.dialogFormVisible = false
                } else {
                  this.$message.error(data.message)
                }
              })
            } else if (this.dialogTitle == '新增权限') {
              this.$http.post(this.$service.moduleAdd, this.ruleForm).then(data => {
                if (data.code == 200) {
                  this.initAuthoritySearch()
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
      closeDialog() {
        this.dialogFormVisible = false
      },
      newAdd() {
        this.dialogFormVisible = true
        this.dialogTitle = '新增权限'
        this.ruleForm.name = ''
        this.ruleForm.path = ''
        this.ruleForm.title = ''
      },
      //操作
      handleClick(scope) {
        // console.log(scope)
        if (scope.method == 'edit') {
          this.dialogTitle = '编辑权限'
          this.dialogFormVisible = true
          this.ruleForm.name = scope.row.name
          this.ruleForm.path = scope.row.path
          this.ruleForm.title = scope.row.title
          this.moduleId = scope.row.id
        } else if (scope.method == 'del') {
          this.$confirm("确定删除这条数据?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.$http.get(this.$service.moduleDelete + '?id=' + scope.row.id).then(data => {
              if (data.code == 200) {
                this.initAuthoritySearch()
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

    },

    watch: {
      tableData(idx) {
        return idx
      }
    },
    components: {
      Table
    },
  }
</script>
<style>
  @import url("../../assets/icon/iconfont.css");

  .content-wrapper {
    width: 100%;
    background-color: #f3f6f9 !important;
    box-sizing: border-box;
    padding: 20px;
    overflow: hidden;
  }

  .el-form {
    background-color: #FFF;
  }

  .el-form--inline .el-form-item {
    margin-bottom: 0;
    vertical-align: bottom;
  }

  /* .parimary_btn{
    background-color: #9ac143 !important;
    border-color: #9ac143 !important;
    &:hover {
      color: #f1e3d5 !important;
      background-color: #7f9e3c !important;
      border-color: #7f9e3c !important;
    }
  } */
  .wrapper,
  .content {
    width: 100%;
    /*background-color: #fff;*/
  }

  .content-search-normal {
    padding: 20px 0 20px 30px;
    background: #fff;
  }

  .el-dialog {
    width: 300px;
    min-width: 500px !important;
  }
</style>
