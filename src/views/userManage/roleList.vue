<template>
  <div class="table-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button @click="handleAdd" icon="el-icon-plus" type="primary"> 新增角色 </el-button>
      </vab-query-form-left-panel>
    </vab-query-form>
    <el-table ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" :height="height" border>
      <el-table-column show-overflow-tooltip label="角色名称" prop="Name" ></el-table-column>
      <el-table-column show-overflow-tooltip label="描述" prop="Description"></el-table-column>
      <el-table-column show-overflow-tooltip label="操作">
        <template #default="{ row }">
          <el-button type="text" @click="editRole(row)"> 编辑</el-button>
          <el-button type="text" @click="selectPower(row)">分配权限</el-button>
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

    <!-- 弹窗 -->
    <el-dialog v-dialogDrag v-if="dialogFormVisible" :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogFormVisible" width="500px" @close="close">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
        <el-form-item v-if="dialogFlag !== 'power'" label="角色名称" prop="Name">
          <el-input v-model.trim="ruleForm.Name" placeholder="请输入角色名称" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogFlag !== 'power'" label="描述" prop="Description">
          <el-input v-model="ruleForm.Description" placeholder="请输入描述" type="textarea" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item v-if="dialogFlag == 'power'" size="medium" label="选择权限" required >
          <div style="height: 500px;overflow-y: auto;">
              <el-tree ref="tree" :data="treeData" :default-checked-keys="defaultCheck" show-checkbox node-key="id" default-expand-all>
                <span class="custom-tree" slot-scope="{ data }">
                  <span class="label"> {{data.text}} </span>
                </span>
              </el-tree>
          </div>
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
  import { getRoleUpdate, queryRoleList, getSysMenu, getCheckedOperation, getRoleOperationUpdate, getSysMenus } from '@/api/user'
  export default {
    name: 'userList',
    data() {
      return {
        list: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        background: true,
        elementLoadingText: '正在加载...',
        pageSize: 10,
        currentPage: 1,
        total: 0,
        dialogFormVisible: false,
        rules:{
          Name:[{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        },
        ruleForm:{
          Name: '',
          Description: '',
        },
        dialogFlag:'',
        dialogTitle:'',
        currentRow:null,

        treeData: [],
        defaultCheck: [],
      }
    },
    computed: {
      height() {
        return this.$baseTableHeight()
      },
    },
    created() {

    },
    activated() {
      this.fetchData()
    },
    methods: {
      //点击 新增角色
      handleAdd() {
        this.dialogFlag = 'add'
        this.dialogTitle = '新增角色'
        this.dialogFormVisible = true
      },
      //新增角色 弹窗确定
      save() {
        this.$refs['ruleForm'].validate(async (valid) => {
          if (valid) {
            if(this.dialogFlag == 'power') {
              var treeArr = this.$refs.tree.getCheckedKeys()
              this.savePower(treeArr)
            } else {
              this.updateRole()
            }
          } else {
            return false
          }
        })
      },
      //关闭新增角色弹窗
      close() {
        this.$refs['ruleForm'].resetFields()
        this.dialogFormVisible = false
        this.dialogFlag = ''
      },
      //点击编辑按钮
      editRole(row){
        this.currentRow = row
        this.dialogFlag = 'edit'
        this.dialogTitle = '编辑角色'
        this.dialogFormVisible = true
        this.ruleForm.Name = row.Name
        this.ruleForm.Description = row.Description
      },
      //点击分配权限
      selectPower(row){
        this.currentRow = row
        this.dialogFlag = 'power'
        this.dialogTitle = '分配权限'
        this.dialogFormVisible = true
        //查询树
        this.initGetSysMenu()
        this.initGetCheckedOperation(row.RoleID)

      },
      async initGetSysMenu() {
        let params = {
          CallType:'new',
          UserID: sessionStorage.getItem('UserID')
        }
        const { Data, Count } = await getSysMenu(params)
        var list = Data
        for(var i = 0; i < list.length; i++){
          for(var j = 0; j < list[i].children.length; j++){
            list[i].children[j].children = list[i].children[j].op
          }
        }
        this.treeData = list
      },
      async initGetCheckedOperation(RoleID) {
        let params = {
          CallType:'checked',
          UserID: sessionStorage.getItem('UserID'),
          RoleID: RoleID
        }
        const { Data, Count } = await getCheckedOperation(params)
          this.defaultCheck = []
          var json = Data
          for(var q = 0; q < json.length; q++){
            this.defaultCheck.push(json[q].OperateID)
          }
      },

      //列表分页
      handleSizeChange(val) {
        this.pageSize = val
        this.fetchData()
      },
      // 列表分页
      handleCurrentChange(val) {
        this.currentPage = val
        this.fetchData()
      },
      //新增 、 编辑 角色
      async updateRole() {
        let params = {
          CallType:this.dialogFlag == 'add' ? 'new' : (this.dialogFlag == 'edit' ? 'edit' : ''),
          UserID: sessionStorage.getItem('UserID'),
          RoleID: this.dialogFlag == 'edit' ? this.currentRow.RoleID : '',
          Name: this.ruleForm.Name,
          Description: this.ruleForm.Description,
        }
        let result = await getRoleUpdate(params)
        if(result.Status == 0){
          this.$baseMessage('操作成功', 'success')
          this.dialogFormVisible = false
          this.ruleForm.Name = ''
          this.ruleForm.Description = ''
          this.fetchData()
        }
      },
      //角色 分配权限
      async savePower (OperationIDStr){
        let params = {
          CallType: 'new',
          UserID: sessionStorage.getItem('UserID'),
          // UserID:  this.currentRow.RoleID,
          RoleID: this.currentRow.RoleID,
          // OperationIDStr: OperationIDStr,
          OperationIDStr: OperationIDStr.toString()
        }
        let result = await getRoleOperationUpdate(params)
        if(result.Status === 0 && result.Data[0].execStatus == 0){
          this.$baseMessage('分配成功', 'success')
          this.dialogFormVisible = false

            //分配权限成功后  重新查询系统 菜单，并写入sessionStorage
            var json = { CallType: '', UserID: sessionStorage.getItem('UserID') }
            let menus = await getSysMenus(json)
            if (menus.Status == 0) {
              sessionStorage.setItem('menu',JSON.stringify(menus.Data))
              // vm.$router.push('/orderCenter/default')
              // vm.$router.push(response.result[0] && response.result[0].pageUrl || '/')
            }
        }

      },
      // 查询角色列表
      async fetchData() {
        this.listLoading = true
        let params = {
          UserID: sessionStorage.getItem('UserID'),
          PageSize: this.pageSize,
          CurrentPage: this.currentPage,
        }
        const { Data, Count } = await queryRoleList(params)
        this.list = Data
        this.total = Count
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      },
    },
  }
</script>
<style>

</style>
