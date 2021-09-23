<template>
  <div class="content-wrapper">
    <div class="content">
      <el-form :inline="true" size="medium" class="demo-form-inline">
        <div class="content-search-normal">
          <el-form-item>
            <el-input style="width: 200px;" size="medium" :maxlength="inputMax" v-model="tel" clearable placeholder="请输入手机号"></el-input>
          </el-form-item>

          <el-form-item>
            <el-input style="width: 200px;" size="medium" :maxlength="inputMax" v-model="pod" clearable placeholder="请输入认证主体"></el-input>
          </el-form-item>

          <el-form-item>
            <el-input style="width: 200px;" size="medium" :maxlength="inputMax" v-model="nickname" clearable placeholder="请输入微信号"></el-input>
          </el-form-item>

          <el-form-item>
            <el-select placeholder="请选择客服人员" size="medium" v-model="customerService" clearable style="width: 200px;">
              <el-option
                v-for="item in roleOpt"
                :key="item.Value"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-row>
              <el-button @click="searchClick" size="medium" type="primary" icon="el-icon-search">查询</el-button>
              <el-button @click="restClick" size="medium" type="primary">清空</el-button>
            </el-row>
          </el-form-item>

        </div>
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
        @bingdingKefu="bingdingKefu"
        >
      </Table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @close='closeDialog' width="150px">
      <el-form :model="ruleForm" ref="ruleForm" :rules="rules" :label-position="labelPosition" label-width="80px" size="medium" class="demo-form-inline" style="padding-left: 20px;padding-top:20px;">
        <el-form-item prop="customerServiceId" label="售前客服">
          <el-select placeholder="请选择客服人员" size="medium" v-model="ruleForm.customerServiceId" clearable style="width: 200px;">
            <el-option
              v-for="item in roleOpt"
              :key="item.Value"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
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
  </div>
</template>

<script>
  import Table from '@/components/userTable'
  import { toData } from '@/util/assist'
  export default {
    data() {
      return {
        //table
        tableData: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
        // 列
        columns: [
          {label: '用户ID', prop: 'id', show: true, width: '80'},
          {label: '用户头像', prop: 'headImgUrl', show: true, width: '80'},
          {label: '微信名称', prop: 'nickname', show: true, width: '150'},
          {label: '性别', prop: 'sex', show: true, width: '80'},
          {label: '认证主体', prop: 'certificationBody', show: true, width: '150'},
          {label: '结算方式', prop: 'settlementModes', show: true, width: '100'},
          {label: '手机号', prop: 'tel', show: true, width: '100'},
          {label: '注册时间', prop: 'createTime', show: true, width: '150'},
          {label: '绑定售前客服', prop: 'customerService', show: true, width: '100'}
        ],
        // 操作
        operation: {
          show: false,
          label: '操作',
          width: '120',
          options: [{
              label: '绑定客服',
              method: 'binding'
            }
          ]
        },
        labelPosition: 'right',
        tel: '',
        pod: '',
        nickname: '',
        customerService: '',
        roleOpt: [],
        dialogTitle: '密码修改',
        dialogFormVisible: false,
        rules: {
          customerServiceId: [{required: true, message: '请选择售前客服', trigger: 'change'}]
        },
        ruleForm: {
          customerServiceId: '',
          id: ''
        }
      }
    },
    mounted() {
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
          customerService: this.customerService,
          nickname: this.nickname,
          pod: this.pod,
          tel: this.tel
        }
        vm.$http.post(vm.$service.userSearchByPage,params).then(data => {
          if (data.code == 200) {
            this.total = data.data.total
            this.tableData = data.data.records
          }
        }).catch((e) => {
          console.log(e)
        })
      },

      //获取售前客服
      initRoleSearch() {
        const vm = this
        var params = {
          pageNum: '',
          pageSize: 10000,
          loginName: '',
          name: '',
          tel: '',
          roleName: '',
          delFlag: 0
        }
        params = toData(params)
        vm.$http.get(vm.$service.userSearch + '?' + params).then(data => {
          if (data.code == 200) {
            this.roleOpt = data.data.records
          }
        }).catch((e) => {
          console.log(e)
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
        this.tel = ''
        this.pod = ''
        this.nickname = ''
        this.customerService = ''
        this.pageSize = 10
        this.pageNum = 1
        this.initUserSearch()
      },
      bingdingKefu(val) {
        this.dialogFormVisible = true
        this.dialogTitle = '绑定售前客服'
        this.ruleForm.id = val.row.id
        this.ruleForm.customerServiceId = val.row.customerService
      },
      //绑定售前客服
      submitForm(ruleForm) {
        this.$refs[ruleForm].validate((valid, object) => {
          if (valid) {
            var params = {
              id: this.ruleForm.id,
              customerServiceId: this.ruleForm.customerServiceId,
            }
            this.$http.post(this.$service.userUpdateUserinfo, params).then(data => {
              if (data.code == 200) {
                this.dialogFormVisible = false
                this.initUserSearch()
                this.$message.success('绑定成功')
              } else {
                this.$message.error(data.message)
              }
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
        this.initUserSearch()
      },
      handleSizeChange(e) {
        this.pageSize = e
        this.initUserSearch()
      },
      closeDialog() {
        this.dialogFormVisible = false
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
    padding: 20px;
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
