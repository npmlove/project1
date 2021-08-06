<template>
	<div class="content-wrapper">
    <el-form :inline="true" size="medium" class="demo-form-inline">
      <div class="content-search-normal">
        <el-form-item style="float: right;margin-right: 20px">
          <el-row>
            <el-button @click="newAdd" size="medium" type="primary">新增角色</el-button>
          </el-row>
        </el-form-item>
      </div>
    </el-form>
	    <div class="content">
        <Table
          ref="multipleTable1"
          :checkbox = "false"
          :tableData = 'tableData'
          :columns = 'columns'
          :operation = 'operation'
          :total = 'total'
          :currentPage = 'pageNum'
          :pageSize = 'pageSize'
          @handleClick = 'handleClick'
        >
        </Table>
	    </div>
      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @close='closeDialog' class="aaa">
        <el-form :label-position="labelPosition" :inline="true" size="medium" class="dialog-demo">
          <div class="rest-style" style="margin-top: 20px;">
            <el-form-item label="角色名称" label-width="120px" required>
              <el-input size="medium" v-model="roleName" placeholder="请输入角色名称"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <!-- 底部按钮 -->
        <div slot="footer" class="dialog-footer">
          <div style="text-align: center;padding-top:20px;">
            <el-button style="height: 36px;line-height: 36px;padding: 0;" size="medium" type="primary" @click="dialogComfirm">确 定</el-button>
            <el-button style="height: 36px;line-height: 36px;padding: 0;" size="medium" @click="closeDialog">取 消</el-button>
          </div>
        </div>
      </el-dialog>
  	</div>
</template>

<script>
  import Table from '@/components/Table'
  import qs from 'qs'
  export default {
    data() {
      return {
        //table
        tableData: [],
        pageSize: 1000,
        pageNum: 1,
        total: 0,
        // 列
        columns: [
          {label: '角色名称', prop: 'roleName', show: true, width: '160'},
          {label: '注册时间', prop: 'createTime', show: true, width: '100'}
        ],
        // 操作
        operation: {
          show: true,
          label: '操作',
          width: '120',
          options: [
            {label: '编辑', method: 'edit'},
            {label: '删除', method: 'del'},
            {label: '权限设置', method: 'setting'}
          ]
        },
        labelPosition: 'right',
        dialogTitle: '',
        roleName: '',
        roleId: '',
        dialogFormVisible: false
      }
    },
    activated() {
      this.initRoleSearch()
    },
    methods: {
      //新增角色
      newAdd() {
        this.dialogTitle = '新增角色'
        this.dialogFormVisible = true
      },
      dialogComfirm() {
        if(this.dialogTitle == '新增角色'){
          if(!this.roleName){
            this.$message.error('请输入角色名称')
            return
          }
          var data = {
            roleName: this.roleName
          }
          this.$http.post(this.$service.roleAdd,data).then(data => {
            if(data.code == 200){
              this.dialogFormVisible = false
              this.dialogTitle = ''
              this.roleId = ''
              this.roleName = ''
              this.initRoleSearch()
            }
          })
        }else if(this.dialogTitle == '编辑角色'){
          var data = {
            roleName: this.roleName,
            id: this.roleId
          }
          this.$http.post(this.$service.roleUpdate,data).then(data => {
            if(data.code == 200){
              this.dialogFormVisible = false
              this.dialogTitle = ''
              this.roleId = ''
              this.roleName = ''
              this.initRoleSearch()
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
          if(data.code == 200){
            this.tableData = data.data
          }
        })
      },
      //操作
      handleClick(scope) {
        if(scope.method == 'edit'){
          this.dialogTitle = '编辑角色'
          this.dialogFormVisible = true
          this.roleId = scope.row.id
          this.roleName  = scope.row.roleName
        }else if(scope.method == 'del'){
          this.$http.get(this.$service.roleDelete+'?id='+scope.row.id).then(data => {
            if(data.code == 200){
              this.$message.success('删除成功')
            }else{
              this.$message.error(data.message)
            }
          })
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
	.el-form{
		background-color: #FFF;
	}
	.el-form--inline .el-form-item{
    margin-bottom: 0;
		vertical-align: bottom;
	}
	.parimary_btn{
		background-color: #9ac143 !important;
    border-color: #9ac143 !important;
    &:hover {
      color: #f1e3d5 !important;
      background-color: #7f9e3c !important;
      border-color: #7f9e3c !important;
    }
  }
	.icon-shouqi{
		color: #3985ca;
		margin-right: 2px;
		font-size: 14px;
		margin-left: 15px;
	}
	.shouqi{
		cursor: pointer;
		color: #3985ca;
		position: relative;
	}
	.shouqi .iconfont{
		font-size: 2px;
		position: absolute;
    height: 20px;
    line-height: 20px;
    margin-top: 7px;
    margin-left: 10px;
	}
  .wrapper, .content {
    width: 100%;
    /*background-color: #fff;*/
  }
  .el-table .sort-caret.ascending{
    border-bottom-color: #FFF;
  }
  .content-search-normal {
    padding: 20px 0 20px 30px;
    background: #fff;
	}
	.content-search-high {
	  padding: 0 0 20px 30px;
	}
  .aaa .el-dialog{
    width: 300px;
    min-width: 500px;
  }
</style>
