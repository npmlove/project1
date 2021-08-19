<template>
  <div class="content-wrapper">
    <div class="content">
      
      <el-form :inline="true" size="medium" class="demo-form-inline">
        <div class="content-search-normal">
          <el-form-item>
            <el-input style="width: 200px;" size="medium" v-model="loginName" clearable placeholder="请输入账号"></el-input>
          </el-form-item> 

          <el-form-item>
            <el-input style="width: 200px;" size="medium" v-model="name" clearable placeholder="请输入姓名"></el-input>
          </el-form-item>

          <el-form-item>
            <el-input style="width: 200px;" size="medium" v-model="tel" clearable placeholder="请输入电话"></el-input>
          </el-form-item>

          <el-form-item>
            <el-select placeholder="请选择角色" size="medium" v-model="roleName" clearable style="width: 200px;">
              <el-option v-for="item in roleOpt" :key="item.Value" :label="item.roleName" :value="item.roleName">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-row>
              <el-button @click="searchClick" size="medium" type="primary" icon="el-icon-search">查询</el-button>
              <el-button @click="restClick" size="medium" type="primary">清空</el-button>
            </el-row>
          </el-form-item>

          <el-form-item style="float: right;margin-right: 20px">
            <el-row>
              <el-button @click="newAdd" size="medium" type="primary">新增用户</el-button>
            </el-row>
          </el-form-item>
        </div>
      </el-form>

   <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @close='closeDialog' width="150px">
        <el-form :model="ruleForm" ref="ruleForm" :rules="rules" :label-position="labelPosition" label-width="80px"
          size="medium" class="demo-form-inline" style="padding-left: 20px;padding-top:20px;">
          <el-form-item prop="newPassword" label="新密码">
            <el-input style="width: 280px;" size="medium" v-model="ruleForm.newPassword" clearable placeholder="请输入新密码">
            </el-input>
          </el-form-item>
          <el-form-item prop="checknewPassword" label="校验密码">
            <el-input style="width: 280px;" size="medium" v-model="ruleForm.checknewPassword" clearable
              placeholder="请再次输入新密码"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮 -->
        <div slot="footer" class="dialog-footer">
          <div style="text-align: center;padding-top:20px;">
            <el-button style="height: 36px;line-height: 36px;padding: 0;" size="medium" type="primary"
             @click="submitForm('ruleForm')">确定</el-button>
          </div>
        </div>
      </el-dialog>

      <Table ref="multipleTable1" :checkbox="false" :tableData='tableData' :columns='columns' :operation='operation'
        :total='total' :currentPage='pageNum' :pageSize='pageSize' @sizeChange='handleSizeChange'
        @currentChange='handleCurrentChange' @handleClick='handleClick'>
      </Table>


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
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }
      return {
        //table
        tableData: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
        // 列

        columns: [{
            label: '账号',
            prop: 'loginName',
            show: true,
            width: '160'
          },
          {
            label: '姓名',
            prop: 'name',
            show: true,
            width: '100'
          },
          {
            label: '手机号',
            prop: 'tel',
            show: true,
            width: '150'
          },
          {
            label: '角色',
            prop: 'roleName',
            show: true,
            width: '150'
          },
          {
            label: '状态',
            prop: 'state',
            show: true,
            width: '100'
          },
          {
            label: '注册时间',
            prop: 'createTime',
            show: true,
            width: '100'
          }
        ],
        // 操作
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
            },
            {
              label: '密码重置',
              method: 'revise'
            }
          ]
        },
        rules: {
          newPassword: [{
            required: true,
            message: '请输入新密码',
            trigger: 'blur'
          }],
          checknewPassword: [{
            required: true,
             validator: validatePass2,
            trigger: 'blur'
          }]
        },
        labelPosition: 'right',
        loginName: '',
        name: '',
        tel: '',
        roleName: '',
        roleOpt: [],
        dialogTitle: '密码修改',
        dialogFormVisible: false,
        newPassword: '',
        id: '',
        ruleForm: {
          newPassword: '',
          id: '',
          checknewPassword: ''
        },
      }
    },
    activated() {
     this.initRoleSearch()
      this.initUserSearch()
    },
    methods: {
      //获取用户列表
      initUserSearch() {
        const vm = this
        var params = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          loginName: this.loginName,
          name: this.name,
          tel: this.tel,
          roleName: this.roleName,
        }
        params = toData(params)
        vm.$http.get(vm.$service.userSearch + '?' + params).then(data => {
          if (data.code == 200) {
            this.total = data.data.total
            this.tableData = data.data.records
          }
        }).catch((e) => {
          console.log(e)
        })
      },

      //获取角色
      initRoleSearch() {
        this.$http.get(this.$service.roleSearch).then(data => {
          if (data.code == 200) {
            this.roleOpt = data.data
          }
        })
      },
      //查询
      searchClick() {
        this.pageSize = 10
        this.pageNum = 1
        this.initUserSearch()
      },
      //重置
      restClick() {
        this.loginName = ''
        this.name = ''
        this.tel = ''
        this.roleName = ''
        this.pageSize = 10
        this.pageNum = 1
        this.initUserSearch()
      },
      //新增
      newAdd() {
        this.$router.push('/adminUser/userAdd')
      },
      //操作
      handleClick(scope) {
        if (scope.method == 'edit') {
          this.$router.push({
            path: '/adminUser/userEdit',
            query: {
              delFlag: scope.row.delFlag,
              id: scope.row.id,
              idcard: scope.row.idcard,
              loginName: scope.row.loginName,
              name: scope.row.name,
              roleId: scope.row.roleId,
              roleName: scope.row.roleName,
              state: scope.row.state,
              tel: scope.row.tel,
              password: scope.row.password
            }
          })
        } else if (scope.method == 'del') {
         // this.delFlag  == 1
         // if(this.delFlag==0)
         //  this. initRoleSearch()
        } else if (scope.method == 'revise') {
          this.dialogFormVisible = true
        }
      },
      //修改密码确定
      submitForm(ruleForm) {
        this.$refs[ruleForm].validate((valid, object) => {
          if (valid) {
            var params = {
             id :ruleForm.id,
             newPassword :ruleForm.newPassword,
            }
            params = toData(params)

            this.$http.get(this.$service.userUpdatePassword + '?' + params).then(data => {
              if (data.code == 200) {
                //this.moduleId = scope.row.id
                 this.ruleForm.newPassword = data.newPassword
                 this.ruleForm.id = data.id
                this.closeDialog()
              }
            }).catch((e) => {
              console.log(e)
            })
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
      handleCurrentChange(e) {
        this.pageNum = e
        this.initGetOrderList()
      },
      handleSizeChange(e) {
        this.pageSize = e
        this.initGetOrderList()
      },
      closeDialog() {
        this.dialogFormVisible = false
        this.ruleForm = {
          newPassword: '',
          checknewPassword: '',
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

  .el-form {
    background-color: #FFF;
  }

  .el-form--inline .el-form-item {
    margin-bottom: 0;
    vertical-align: bottom;
  }

  .parimary_btn {
    background-color: #9ac143 !important;
    border-color: #9ac143 !important;

    &:hover {
      color: #f1e3d5 !important;
      background-color: #7f9e3c !important;
      border-color: #7f9e3c !important;
    }
  }

  .icon-shouqi {
    color: #3985ca;
    margin-right: 2px;
    font-size: 14px;
    margin-left: 15px;
  }

  .shouqi {
    cursor: pointer;
    color: #3985ca;
    position: relative;
  }

  .shouqi .iconfont {
    font-size: 2px;
    position: absolute;
    height: 20px;
    line-height: 20px;
    margin-top: 7px;
    margin-left: 10px;
  }

  .wrapper,
  .content {
    width: 100%;

    /*background-color: #fff;*/
  }

  .el-table .sort-caret.ascending {
    border-bottom-color: #FFF;
  }

  .content-search-normal {
    padding: 20px 0 20px 30px;
    background: #fff;
  }

  .content-search-high {
    padding: 0 0 20px 30px;
  }

  /deep/ .el-dialog {
    min-width: 480px;
    border-radius: 6px;
  }
</style>
