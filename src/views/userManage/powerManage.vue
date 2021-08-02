<template>
  <div class="table-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button @click="handleAddNewMenu('oneLevel')"  type="primary">新增菜单 </el-button>
      </vab-query-form-left-panel>
    </vab-query-form>
    <!-- 列表 -->
    <el-table
      v-loading="listLoading"
      :data="newTreeList"
      :element-loading-text="elementLoadingText"
      :height="height"
      border
      :row-key="getRowKeys" :expand-row-keys ="expandedkey"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
    <!-- default-expand-all -->
      <el-table-column show-overflow-tooltip label="菜单名称" prop="text" ></el-table-column>
      <el-table-column show-overflow-tooltip label="菜单标识" prop="mark"></el-table-column>
      <el-table-column show-overflow-tooltip label="菜单类型" prop="type">
        <template #default="{ row }">
          <span v-if="row.type == '菜单'">{{ row.type }}</span>
          <span v-if="row.type == '按钮'">{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="操作">
        <template #default="{ row }">
          <el-button v-if="row.addMenu" type="text" class="opBtn" @click="handleAddNewMenu('twoLevel',row)">新增菜单</el-button>
          <el-button v-if="row.addOP" type="text" class="opBtn" @click="handleAddNewMenu('addop',row)">新增操作</el-button>
          <!-- <span v-if="scope.row.addMark == 'addMenu' " class="opBtn" @click="handleAddNewMenu('twoLevel',scope.row)">新增菜单</span>
          <span v-if="scope.row.addMark == 'addOP' && scope.row.children " class="opBtn" @click="handleAddNewMenu('addop',scope.row)">新增操作</span> -->
          <el-button class="opBtn" type="text" @click="handleAddNewMenu('edit',row)">编辑</el-button>
          <el-button class="opBtn" type="text" @click="handleAddNewMenu('del',row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页的位置占位 -->
    <div style="height: 46px;width: 100%;"></div>

    <!-- 弹窗 -->
    <el-dialog v-dialogDrag v-if="dialogFormVisible" :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogFormVisible" width="450px" @close='closeDialog'>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item :label="roleName1" prop="MarkName" >
          <el-input size="medium" v-model="ruleForm.MarkName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item :label="roleName2" prop="Name">
          <el-input size="medium" v-model="ruleForm.Name" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="dialogComfirm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 弹窗 删除提示信息 -->
    <div v-dialogDrag v-if="visible" class="del-dialog">
      <el-dialog  :visible.sync="visible" width="25%" :close-on-click-modal="false">
        <p style="display:inline-block;color:#f56c6c;font-size: 25px;margin-top:5px" class="el-icon-warning"></p>
        <p style="display: inline-block;vertical-align: super;">是否确定删除<span style="color:#f56c6c">【{{delName}}】</span>{{type}}？</p>
        <span slot="footer" class="dialog-footer">
          <el-button  @click="visible = false">取 消</el-button>
          <el-button  type="primary" @click="submitDelete">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import { getSysMenu, getMenuUpdate, getMenuOPUpdate } from '@/api/user'
  export default {
    data() {
      return {
        // 获取row的key值
        getRowKeys(row) {
          return row.id;
        },
        elementLoadingText: '正在加载...',
        listLoading: false,
        labelPosition: 'right',
        newTreeList:[],
        visible: false,
        delName:'',
        type:'',

        expandedkey: [],

        OPData:null,
        dialogFlag:'',
        dialogTitle: '',
        dialogFormVisible: false,
        roleName1: '',
        roleName2: '',
        rules:{},
        ruleForm:{
          MarkName: '',
          Name: '',
        },
        UserID: '',
      }
    },

    mounted() {
      var vm = this
      this.UserID = sessionStorage.getItem('UserID')

    },
    activated() {
      this.initGetSysMenu()
    },
    computed: {
      height() {
        return this.$baseTableHeight()
      },
    },
    methods: {
      //查询菜单
      async initGetSysMenu() {
        this.listLoading = true
        let params = {
          CallType: 'new',
          UserID: sessionStorage.getItem('UserID'),
        }
        const { Data, Count } = await getSysMenu(params)
        this.newTreeList = []
        // this.treeFun(data.Data, this.newTreeList,'addMenu')
        this.treeFun(Data, this.newTreeList,'addMenu')
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      },

      //递归遍历树形结构，截取children和text、id，添加type字段
      treeFun(treeList,newTreeList,addMenu,addOP) {
        treeList.map(c=>{
          let tempData={
            text:c.text,
            id:c.id,
            mark:c.name,
            type: c.op == null && c.children == null ? '按钮' : '菜单' ,
            addMenu:addMenu,
            addOP:addOP
          }
          if( c.children && c.children.length>0 ){
            tempData.children=[]
            this.treeFun(c.children, tempData.children, '', 'addOP')
          }
           if(c.op && c.op.length>0){
            tempData.children=[]
            this.treeFun(c.op, tempData.children)
          }
          newTreeList.push(tempData)
          // this.newTreeList = newTreeList
        })
      },
      //点击新增菜单
      handleAddNewMenu(val,data){
        this.OPData = data
        // 设置需要默认展开的节点
        if(this.OPData){
          this.expandedkey.push(this.OPData.id)
        }
        if(val == 'oneLevel'){  //新增一级菜单
          this.dialogFormVisible = true
          this.dialogFlag = val
          this.dialogTitle = '新增一级菜单'
          this.roleName1 = '菜单标识'
          this.roleName2 = '菜单名称'
          this.rules.MarkName = [{ required: true, message: '请输入菜单标识', trigger: 'blur' }]
          this.rules.Name = [{ required: true, message: '请输入菜单名称', trigger: 'blur' }]
        } else if (val == 'twoLevel'){  //新增二级菜单
          this.dialogFormVisible = true
          this.dialogFlag = val
          this.dialogTitle = '新增【'+ data.text + '】下 二级菜单'
          this.roleName1 = '菜单标识'
          this.roleName2 = '菜单名称'
          this.rules.MarkName = [{ required: true, message: '请输入菜单标识', trigger: 'blur' }]
          this.rules.Name = [{ required: true, message: '请输入菜单名称', trigger: 'blur' }]
        } else if (val == 'addop') {  //新增操作按钮
          this.dialogFormVisible = true
          this.dialogFlag = val
          this.dialogTitle = '新增【'+ data.text + '】下 操作按钮'
          this.roleName1 = '操作标识'
          this.roleName2 = '操作名称'
          this.rules.MarkName = [{ required: true, message: '请输入操作标识', trigger: 'blur' }]
          this.rules.Name = [{ required: true, message: '请输入操作名称', trigger: 'blur' }]
        } else if (val == 'edit') {  //点击编辑
          this.dialogFormVisible = true
          if(data.type == '菜单'){  //编辑菜单
            this.dialogFlag = val + 'menu'
            this.dialogTitle = '编辑菜单【'+ data.text + '】'
            this.roleName1 = '菜单标识'
            this.roleName2 = '菜单名称'
            this.ruleForm.MarkName = data.mark
            this.ruleForm.Name = data.text
            this.rules.MarkName = [{ required: true, message: '请输入菜单标识', trigger: 'blur' }]
            this.rules.Name = [{ required: true, message: '请输入菜单名称', trigger: 'blur' }]
          } else if (data.type == '按钮'){ //编辑按钮
          this.dialogFlag = val + 'op'
            this.dialogTitle = '编辑操作按钮【'+ data.text + '】'
            this.roleName1 = '操作标识'
            this.roleName2 = '操作名称'
            this.ruleForm.MarkName = data.mark
            this.ruleForm.Name = data.text
            this.rules.MarkName = [{ required: true, message: '请输入操作标识', trigger: 'blur' }]
            this.rules.Name = [{ required: true, message: '请输入操作名称', trigger: 'blur' }]
          }
        } else if (val == 'del'){  //删除
          if(data.type == '菜单'){ //删除菜单
            this.dialogFlag = val + 'menu'
            this.visible = true
            this.delName = data.text
            this.type = data.type
          } else if (data.type == '按钮' && data.mark !== 'view' ){ //删除按钮
            this.dialogFlag = val + 'op'
            this.visible = true
            this.delName = data.text
            this.type = data.type
          } else if (data.mark == 'view'){
            this.exportDio = true
            this.iconTrue = true
            this.exportTip = '关键操作不能删除'
            setTimeout(() => {
              this.exportDio = false
            }, 1500)
            return
          }
        }

      },
      //弹窗确定
      dialogComfirm(ruleForm) {
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            //新增一级菜单
            if(this.dialogFlag == 'oneLevel'){
              let obj = {}  //定义入参
              obj.CallType = 'new',
              obj.UserID = this.UserID,
              obj.ModuleID = '',
              obj.ParentID = '',
              obj.Name = this.ruleForm.Name,
              obj.MarkName = this.ruleForm.MarkName,
              obj.Description = '',
              obj.OrderID = ''
              this.operateMenuFun(obj)
            }
            //新增二级菜单
            if(this.dialogFlag == 'twoLevel'){
              let obj = {}  //定义入参
              obj.CallType = 'new',
              obj.UserID = this.UserID,
              obj.ModuleID = '',
              obj.ParentID = this.OPData.id,
              obj.Name = this.ruleForm.Name,
              obj.MarkName = this.ruleForm.MarkName,
              obj.Description = '',
              obj.OrderID = ''
              this.operateMenuFun(obj)
            }
            //一级、二级、菜单的编辑
            if(this.dialogFlag == 'editmenu'){
              let obj = {}  //定义入参
              obj.CallType = 'edit',
              obj.UserID = this.UserID,
              obj.ModuleID = this.OPData.id,
              obj.ParentID = '',
              obj.Name = this.ruleForm.Name,
              obj.MarkName = this.ruleForm.MarkName,
              obj.Description = '',
              obj.OrderID = ''
              this.operateMenuFun(obj)
            }

            //新增操作按钮
            if(this.dialogFlag == 'addop'){
              let obj = {}  //定义入参
              obj.CallType = 'new',
              obj.UserID = this.UserID,
              obj.ModuleID = this.OPData.id,
              obj.OperateID = '',
              obj.Name = this.ruleForm.Name,
              obj.MarkName = this.ruleForm.MarkName,
              obj.Description = '',
              obj.OrderID = ''
              this.operateOPFun(obj)
            }
            //操作按钮的编辑
            if(this.dialogFlag == 'editop'){
              //this.OPData.id,是自身id 遍历查询到他的父id
              let fuIdArr = this.findPnodeId(this.OPData.id,this.newTreeList)
              let fuId = fuIdArr[fuIdArr.length-2]

              let obj = {}  //定义入参
              obj.CallType = 'edit',
              obj.UserID = this.UserID,
              obj.ModuleID = fuId,
              obj.OperateID = this.OPData.id,
              obj.Name = this.ruleForm.Name,
              obj.MarkName = this.ruleForm.MarkName,
              obj.Description = '',
              obj.OrderID = ''
              this.operateOPFun(obj)
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //通过id 遍历树形结构，返回它所有的父级id
      //传入参数：需要遍历的json，需要匹配的id
      findPnodeId(leafId, nodes, path) {
        if(path === undefined) {
          path = [];
        }
        for(var i = 0; i < nodes.length; i++) {
          var tmpPath = path.concat();
          tmpPath.push(nodes[i].id);
          if(leafId == nodes[i].id) {
            return tmpPath;
          }
          if(nodes[i].children) {
            var findResult = this.findPnodeId(leafId, nodes[i].children, tmpPath);
            if(findResult) {
              return findResult;
            }
          }
        }
      },
      //确定删除 弹窗 的确定
      submitDelete(){
        //一级、二级、菜单的 、 删除
        if(this.dialogFlag == 'delmenu'){
          let obj = {}  //定义入参
          obj.CallType = 'del',
          obj.UserID = this.UserID,
          obj.ModuleID = this.OPData.id,
          obj.ParentID = '',
          obj.Name = this.ruleForm.Name,
          obj.MarkName = this.ruleForm.MarkName,
          obj.Description = '',
          obj.OrderID = ''
          this.operateMenuFun(obj)
        }
        //操作按钮的 、删除
        if(this.dialogFlag == 'delop'){
          //this.OPData.id,是自身id 遍历查询到他的父id
          let fuIdArr = this.findPnodeId(this.OPData.id,this.newTreeList)
          let fuId = fuIdArr[fuIdArr.length-2]

          let obj = {}  //定义入参
          obj.CallType = 'del',
          obj.UserID = this.UserID,
          obj.ModuleID = fuId,
          obj.OperateID = this.OPData.id,
          obj.Name = this.ruleForm.Name,
          obj.MarkName = this.ruleForm.MarkName,
          obj.Description = '',
          obj.OrderID = ''
          this.operateOPFun(obj)
        }

      },
      //关闭弹窗
      closeDialog() {
        this.dialogFormVisible = false
        this.$refs.ruleForm.resetFields();
      },
      //菜单方法
      async operateMenuFun(obj) {
        const result = await getMenuUpdate(obj)
        if(result.Status == 0 && result.Data[0].execStatus == 0){
          this.initGetSysMenu()
          this.dialogFormVisible = false
          this.visible = false
          this.ruleForm.Name = ''
          this.ruleForm.MarkName = ''
        } else {
          this.$baseMessage(result.Message, 'warning')
        }
      },

      //按钮方法
      async operateOPFun(obj) {
        const result = await getMenuOPUpdate(obj)
        if(result.Status == 0 && result.Data[0].execStatus == 0){
          this.initGetSysMenu()
          // 设置需要默认展开的节点

          this.dialogFormVisible = false
          this.visible = false
          this.ruleForm.Name = ''
          this.ruleForm.MarkName = ''
        }
      }

    }
  };
</script>

<style lang="scss" scoped>
  .opBtn {
    color: $base-color-blue;
    padding: 5px;
    cursor: pointer;
  }
  .del-dialog .el-dialog__body, html body .el-message-box__body {
    border-top: 0px solid #dcdfe6;
  }
  .del-dialog .el-dialog__body {
    color: #606266;
    font-size: 14px;
    word-break: break-all;
  }
</style>
