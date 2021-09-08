<template>
  <div class="content-wrapper">
    <el-form :inline="true" size="medium" class="demo-form-inline">
      <div class="content-search-normal">
        <el-form-item :style="{visibility: newRoleId == '-1' ? 'visible' : 'hidden'}"
          style="float: right;margin-right: 20px">
          <el-row>
            <el-button @click="newAdd" size="medium">新增角色</el-button>
          </el-row>
        </el-form-item>
      </div>
    </el-form>
    <div class="content">
      <Table ref="multipleTable1" :tableData='tableData' :columns='columns' :operation='operation'
        :total='total' :currentPage='pageNum' :pageSize='pageSize' @handleClick='handleClick'>
      </Table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @close='closeDialog' class="aaa">
      <el-form :label-position="labelPosition" :inline="true" size="medium" class="dialog-demo">
        <div class="rest-style" style="margin-top: 20px;">
          <el-form-item label="角色名称" label-width="120px" required>
            <el-input size="medium" :maxlength="inputMax" v-model="roleName" placeholder="请输入角色名称" maxlength="10">
            </el-input>
          </el-form-item>
        </div>
      </el-form>
      <!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <div style="text-align: center;padding-top:20px;">
          <el-button style="height: 36px;line-height: 36px;padding: 0;" size="medium" type="primary"
            @click="dialogComfirm">确 定</el-button>
          <el-button style="height: 36px;line-height: 36px;padding: 0;" size="medium" @click="closeDialog">取 消
          </el-button>
        </div>
      </div>
    </el-dialog>
    <el-drawer :title="drawerTitle" :visible.sync="drawer" :direction="direction" :before-close="handleClose">
      <!-- <el-checkbox-group>
        <el-checkbox v-for="(item,index) in moduleArr" :label="item.name" :key="index">{{item.name}}</el-checkbox>
      </el-checkbox-group> -->
      <el-checkbox-group v-model="cargoType">
        <div v-for="(optItem,optIndex) in moduleArr" :key="optIndex" style="padding-left: 20px;margin-bottom: 10px;">
          <el-checkbox :disabled="true" checked :label="optItem.value">{{optItem.name}}</el-checkbox>
        </div>
      </el-checkbox-group>
    </el-drawer>
  </div>
</template>

<script>
  import Table from '@/components/Table'
  export default {
    data() {
      return {
        cargoType: '',
        //table
        tableData: [],
        pageSize: 1000,
        pageNum: 1,
        total: 0,
        // 列
        columns: [{
            label: '角色名称',
            prop: 'roleName',
            show: true,
            width: '160'
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
              label: '权限设置',
              method: 'setting'
            }
          ]
        },
        labelPosition: 'right',
        dialogTitle: '',
        roleName: '',
        roleId: '',
        dialogFormVisible: false,
        drawer: false,
        direction: 'rtl',
        moduleArr: [],
        drawerTitle: '',
        newRoleId: ''
      }
    },
    mounted() {
      this.initRoleSearch()
      this.initAuthoritySearch()
      this.newRoleId = JSON.parse(sessionStorage.getItem('userInfo')).roleId
      if (this.newRoleId == '-1') {
        this.operation.show = true
      } else {
        this.operation.show = false
      }
    },
    methods: {
      //关闭抽屉
      handleClose() {
        this.drawer = false
      },
      //获取权限
      initAuthoritySearch() {
        const vm = this
        vm.$http.get(vm.$service.moduleSearch).then(data => {
          if (data.code == 200) {
            this.moduleArr = data.data
            console.log(this.moduleArr)
          }
        }).catch((e) => {
          console.log(e)
        })
      },
      //新增角色
      newAdd() {
        this.dialogTitle = '新增角色'
        this.dialogFormVisible = true
      },
      dialogComfirm() {
        if (this.dialogTitle == '新增角色') {
          if (!this.roleName) {
            this.$message.error('请输入角色名称')
            return
          }
          var data = {
            roleName: this.roleName
          }
          this.$http.post(this.$service.roleAdd, data).then(data => {
            if (data.code == 200) {
              this.dialogFormVisible = false
              this.dialogTitle = ''
              this.roleId = ''
              this.roleName = ''
              this.initRoleSearch()
            } else {
              this.$message.error(data.message)
            }
          })
        } else if (this.dialogTitle == '编辑角色') {
          var data = {
            roleName: this.roleName,
            id: this.roleId
          }
          this.$http.post(this.$service.roleUpdate, data).then(data => {
            if (data.code == 200) {
              this.dialogFormVisible = false
              this.dialogTitle = ''
              this.roleId = ''
              this.roleName = ''
              this.initRoleSearch()
            } else {
              this.$message.error(data.message)
            }
          })
        }

      },
      closeDialog() {
        this.dialogTitle = ''
        this.roleId = ''
        this.roleName = ''
        this.dialogFormVisible = false
      },
      //获取角色
      initRoleSearch() {
        this.$http.get(this.$service.roleSearch).then(data => {
          if (data.code == 200) {
            this.tableData = data.data
          } else {
            this.$message.error(data.message)
          }
        })
      },
      //操作
      handleClick(scope) {
        if (scope.method == 'edit') {
          this.dialogTitle = '编辑角色'
          this.dialogFormVisible = true
          this.roleId = scope.row.id
          this.roleName = scope.row.roleName
        } else if (scope.method == 'del') {
          this.$confirm("确定删除这条数据?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.$http.get(this.$service.roleDelete + '?id=' + scope.row.id).then(data => {
              if (data.code == 200) {
                this.initRoleSearch()
                this.$message.success('删除成功')
              } else {
                this.$message.error(data.message)
              }
            })
          }).catch(() => {
            console.log('取消')
          })

        } else if (scope.method == 'setting') {
          this.drawer = true
          this.drawerTitle = scope.row.roleName
        }
      }
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

  .aaa .el-dialog {
    width: 300px;
    min-width: 500px;
  }
</style>
