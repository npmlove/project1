<template>
  <div class="table-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form ref="form" :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-input v-model="searchData" placeholder="请输入员工姓名/手机号"/>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" native-type="submit" @click="handleQuery" >查询</el-button>
            <el-button @click="restClick">重置</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-button @click="handleAdd" icon="el-icon-plus" type="primary">新增员工</el-button>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" :height="height" border>
      <el-table-column show-overflow-tooltip label="账号" prop="UserName" ></el-table-column>
      <el-table-column show-overflow-tooltip label="姓名" prop="RealName"></el-table-column>
      <el-table-column show-overflow-tooltip label="部门" prop="dept"></el-table-column>
      <el-table-column show-overflow-tooltip label="操作">
        <template #default="{ row }">
          <el-button type="text" @click="editTableBtn('编辑', row)"> 编辑 </el-button>
          <el-button type="text" @click="editTableBtn('重置密码', row)"> 重置密码 </el-button>
          <el-button type="text" @click="editTableBtn('分配角色', row)"> 分配角色 </el-button>
          <el-button type="text" @click="editTableBtn('查看', row)"> 查看 </el-button>
          <el-button type="text" @click="editTableBtn('启用', row)"> 启用 </el-button>
          <el-button type="text" @click="editTableBtn('禁用', row)"> 禁用 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :background="background"
      :current-page="currentPage"
      :layout="layout"
      :page-size="pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
    
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="500px" @close="close" >
      <el-form ref="pwdForm" :model="pwdForm" :rules="pwdRules" label-width="100px">
        <!-- 重置密码 -->
        <el-form-item v-show="dialogFlag == 'pwd'" label="管理员密码" prop="OldPassword">
          <el-input v-model.trim="pwdForm.OldPassword" placeholder="请输入管理员密码" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-show="dialogFlag == 'pwd'" label="重置密码" prop="Password">
          <el-input v-model.trim="pwdForm.Password" placeholder="请输入重置密码" autocomplete="off"></el-input>
        </el-form-item>

        <!-- 分配角色 -->
        <el-form-item v-show="dialogFlag == 'role'" label="分配角色"  prop="roleValue" >
          <el-select required placeholder="请选择分配角色" filterable v-model="pwdForm.roleValue" multiple style="width: 230px;">
            <el-option v-for="item in roleOpt" :key="item.Value" :label="item.Name" :value="item.Value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getUserList, getUpdateUserPWD, queryRoleList, getUserRoles, getUserRoleUpdate, getUpdateUser } from '@/api/user'
  export default {
    name: 'userList',
    data() {
      return {
        searchData: '',
        list: [],
        imageList: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        background: true,
        elementLoadingText: '正在加载...',
        pageSize: 10,
        currentPage: 1,
        total: 0,
        dialogFormVisible: false,
        pwdForm: {
          CallType: 'resetpwd',
          LoginUserID: sessionStorage.getItem('UserID'),
          UserID: '',
          OldPassword: '',
          Password: '',

          roleValue: [],
        },
        pwdRules: {}, //表单校验规则
        dialogFlag:'',
        dialogTitle:'',
        roleOpt: [],
      }
    },
    computed: {
      height() {
        return this.$baseTableHeight()
      },
    },
    created() {
      this.fetchData()
    },
    methods: {
      save() {
        this.$refs['pwdForm'].validate(async (valid) => {
          if (valid) {
            if(this.dialogFlag == 'role'){
              let params = {
                CallType: 'new',
                UserID: this.rowRole.UserID,
                RoleIDStr: this.pwdForm.roleValue.toString()
              }
              const { Data, Count } = await getUserRoleUpdate(params)
              this.$baseMessage('分配成功', 'success')
              delete this.pwdRules.roleValue
              this.dialogFormVisible = false
              this.dialogFlag = ''
              this.dialogTitle = ''
            } else {
              const { Status, Data, Message } = await getUpdateUserPWD(this.pwdForm)
              if (Status == 0) {
                this.dialogFormVisible = false
                this.dialogFlag = ''
                this.dialogTitle = ''
                this.$refs['pwdForm'].resetFields()
                this.$baseMessage('修改成功', 'success')
                delete this.pwdRules.OldPassword
                delete this.pwdRules.Password
              } else {
                this.dialogFormVisible = true
                this.$baseMessage(Message, 'error')
              }
            }
          } else {
            return false
          }
        })
      },
      close() {
        this.pwdForm.OldPassword = ''
        this.pwdForm.Password = ''
        this.dialogFormVisible = false
        this.dialogFlag = ''
        this.dialogTitle = ''
        this.roleOpt = []
        this.pwdForm.roleValue = []
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.fetchData()
      },
      handleQuery() {
        this.currentPage = 1
        this.fetchData()
      },
      // 点击重置
      restClick() {
        this.searchData = ''
        this.pageSize = 10
        this.currentPage = 1
        this.fetchData()
      },
      //操作
      editTableBtn(type, row) {
        if (type == '编辑') {
          this.$router.push({
            path: '/userManage/userEdit',
            query: {
              UserID: row.UserID,
            },
          })
        } else if (type == '重置密码') {
          this.dialogFlag = 'pwd'
          this.pwdForm.UserID = row.UserID

          this.pwdRules.OldPassword = [{ required: true, trigger: 'blur', message: '请输入管理员密码' }]
          this.pwdRules.Password = [ { required: true, trigger: 'blur', message: '请输入新密码' }]
          this.dialogFormVisible = true

        } else if (type == '分配角色') {
          this.rowRole = row
          this.dialogFlag = 'role'
          this.dialogTitle = '分配角色'

          this.pwdRules.roleValue = [{ required: true, message: '请选择要分配的角色', trigger: 'blur' }]
          this.dialogFormVisible = true

          this.fenPeiQuery1(row.UserID)
          this.fenPeiQuery2()
        } else if (type == '查看') {
          this.$router.push({
            path: '/userManage/userAdd',
            query: {
              UserID: row.UserID,
              type: 'see'
            }
          })
        } else if (type == '启用') {
          if (row.UserID) {
            this.$baseConfirm('你确定要【启用】当前员工吗？', null, async () => {
              let params = {
                CallType: 'active',
                UserID: row.UserID,
                UserName: '',
                RealName: '',
                Password: '',
                Remarks: '',
                email: '',
                puid: '',
                Department: '',
                Operator: sessionStorage.getItem('UserID'),
                workloc: '',
                powergroup: ''
              }
              const { Data, Count } = await getUpdateUser(params)
              this.$baseMessage(Data[0].Message, 'success')
              this.fetchData()
            })
          }
        } else if (type == '禁用') {
          if (row.UserID) {
            this.$baseConfirm('你确定要【禁用】当前员工吗？', null, async () => {
              let params = {
                CallType: 'del',
                UserID: row.UserID,
                UserName: '',
                RealName: '',
                Password: '',
                Remarks: '',
                email: '',
                puid: '',
                Department: '',
                Operator: sessionStorage.getItem('UserID'),
                workloc: '',
                powergroup: ''
              }
              const { Data, Count } = await getUpdateUser(params)
              this.$baseMessage(Data[0].Message, 'success')
              this.fetchData()
            })
          }

        }
      },
      //点击分配按钮
      async fenPeiQuery1(UserID) {
        //查已经分配过的 角色
        let params = { CallType: '', UserID: UserID }
        const { Data, Count } = await getUserRoles(params)
        for(var i = 0; i < Data.length; i++){
          this.pwdForm.roleValue.push(Data[i].RoleID)
        }
      },
      //点击分配按钮
      async fenPeiQuery2() {
        //查全部角色
        let params2 = {
          SearchKey: '',
          UserID: sessionStorage.getItem('UserID'),
          PageSize: 1000,
          CurrentPage: 1,
        }
        const { Data, Count } = await queryRoleList(params2)

        var list = Data
        for(var i = 0; i < list.length; i++){
          var json = {}
          json.Value = list[i].RoleID
          json.Name = list[i].Name
          this.roleOpt.push(json)
        }
      },

      //新增员工
      handleAdd() {
        this.$router.push('/userManage/userAdd')
      },
      async fetchData() {
        this.listLoading = true
        let params = {
          UserID: sessionStorage.getItem('UserID'),
          SearchKey: this.searchData,
          PageSize: this.pageSize,
          CurrentPage: this.currentPage,
        }
        const { Data, Count } = await getUserList(params)
        this.list = Data
        this.total = Count
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      },
    },
  }
</script>
