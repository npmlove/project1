<template>
  <div class="content-wrapper">
    <el-row>
      <el-col class="leftShrinkBtn"  :style="{width: this.leftwidth + 'px'}">
        <div v-show="shrinkFlag != 0" :class="['shrinkBtnLeft', this.colorFlag == 0 ? '' : 'bgcSty']" @mouseenter="mouseenter" @mouseleave="mouseleave" @click="handleToLeft"></div>
        <div v-show="shrinkFlag != 2" :class="['shrinkBtnright', this.colorFlag2 == 0 ? '' : 'bgcSty']"  @mouseenter="mouseenter2" @mouseleave="mouseleave2" @click="handleToright"></div>
        <!-- <Category @tableList="tableList" @queryRootAllData="queryRootAllData" @tree-node-click="treeNodeClick" v-bind:shrinkFlag="shrinkFlag" style="padding:10px;"></Category> -->
        <Category  @queryRootAllData="queryRootAllData" @tree-node-click="treeNodeClick" v-bind:shrinkFlag="shrinkFlag" style="padding:10px;"></Category>
      </el-col>
      <el-col :style="{width: 'calc(100% - '+ this.leftwidth + 'px)'}">
        <div style="padding:7px 10px 10px 20px; ">
          <!-- 搜索条件 -->
          <vab-query-form>
            <vab-query-form-left-panel>
              <el-form :inline="true" size="medium" class="demo-form-inline">
                <div class="content-search-normal">
                  <el-form-item>
                    <el-input size="medium" v-model="searchData" placeholder="请输入设备sn" style="width: 260px;"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-row>
                      <el-button  @click="handleQuery" size="medium" type="primary" icon="el-icon-search">查询</el-button>
                      <el-button @click="restClick" size="medium" >重置</el-button>
                    </el-row>
                  </el-form-item>
                </div>
              </el-form>
            </vab-query-form-left-panel>
          </vab-query-form>
          <!-- 表格数据 -->
          <div style="position: relative">
            <el-table border ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" :height="height" >
              <el-table-column v-if="itemArr.indexOf('设备sn') > -1" show-overflow-tooltip label="设备sn" prop="devicesn"></el-table-column>
              <el-table-column v-if="itemArr.indexOf('设备名称') > -1" show-overflow-tooltip label="设备名称" prop="devicename"></el-table-column>
              <el-table-column v-if="itemArr.indexOf('设备类型') > -1" show-overflow-tooltip label="设备类型" prop="devicetype"></el-table-column>
              <el-table-column v-if="itemArr.indexOf('所属组织') > -1" show-overflow-tooltip label="所属组织" prop="orgname"></el-table-column>
              <el-table-column v-if="itemArr.indexOf('设备状态') > -1" show-overflow-tooltip label="设备状态" prop="astatus">
                <template #default="{ row }">
                  <el-tag :type="row.astatus == 1 ? 'success' : 'info'">
                    {{ row.astatus == 0 ? '离线' : '在线' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip label="操作">
                <template #default="{ row }">
                  <!-- <el-button type="text" v-show="btnright == 1" >分配设备</el-button> -->
                  <el-button type="text" :disabled="btnright != 1 || currentClickOrg.children.length == 0 " @click="handleFenPeiDevice(row)">分配设备</el-button>
                  <el-button type="text" :disabled="row.canunbind != 1 " @click="handleUnbindDevice(row)">解绑设备</el-button>
                  <el-button type="text" :disabled="row.canunbind != 1 " @click="handleUnbindDevice(row)">重新分配设备</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="table-icon">
              <el-popover placement="bottom-start" trigger="click">
                <el-checkbox-group v-model="itemArr">
                  <div class="checkbox-block">
                    <el-checkbox
                      v-for="item in checkArr"
                      :label="item"
                      :key="item"
                    ></el-checkbox>
                  </div>
                </el-checkbox-group>
                <vab-icon slot="reference" :icon="['fas', 'cog']"></vab-icon>
              </el-popover>
            </div>
          </div>
          <el-pagination
            :disabled="total == 0 ? true : false"
            :background="background"
            :current-page="currentPage"
            :layout="layout"
            :page-size="pageSize"
            :total="total"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          ></el-pagination>

        </div>
      </el-col>
    </el-row>
    <!-- 弹窗选择设备 -->
    <el-dialog title="分配设备" :visible.sync="dialogFormVisible" width="400px" @close="close">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="50px">
        <el-form-item label="组织" prop="orgname">
          <el-select v-model="ruleForm.orguid" clearable placeholder="请选择组织" @clear="handleClear" ref="selectUpResId" style="width: 280px;">
            <el-option hidden key="orguid" :value="ruleForm.orguid" :label="ruleForm.orgname"></el-option>
            <el-tree :data="treeArr" @node-click="handleNodeClick" :props="defaultProps" :expand-on-click-node="false" :check-on-click-node="true" default-expand-all></el-tree>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="close()">取 消</el-button>
        <el-button type="primary" @click="submitBind">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import Category from "./components/tree.vue";
import { getOrgDeviceList, distributionOrgDevice } from '@/api/optionAddtion'
import { getCompanyOrgList } from '@/api/user'
export default {
  components: { Category},
  data() {
    return {
      shrinkFlag:1, //0：宽1，1：宽280， 2：宽400
      colorFlag:0,
      colorFlag2:0,
      leftwidth:280,  //左侧初始宽度

      searchData: '',
      list: [],
      elementLoadingText: '正在加载...',
      pageSize: 10,
      currentPage: 1,
      total: 0,
      listLoading: false,
      layout: 'total, sizes, prev, pager, next, jumper',
      background: true,
      itemArr: ['设备sn', '设备名称', '设备类型', '所属组织', '设备状态', '操作'],
      checkArr: ['设备sn', '设备名称', '设备类型', '所属组织', '设备状态', '操作'],
      orguid:'',
      btnright:'',

      dialogFormVisible: false,
      treeArr:[],
      ruleForm: {
        orgname: '',
        orguid:'',
      },
      rules: {
        orgname: [ { required: true, message: '请选择组织', trigger: 'blur' } ],
      },
      defaultProps: {
        children: "children",
        label: "orgname",
      },
      currentDeviceRow:null,
      currentClickOrg:null

    };
  },
  computed: {
    height() {
      return this.$baseTableHeight()
    },
  },
  activated() {

  },
  methods: {
    //点击分配设备
    handleFenPeiDevice(row){
      this.currentDeviceRow = row
      this.dialogFormVisible = true
      this.getCompanyLevel()

    },
    async getCompanyLevel() {
      let params = {
        CallType: 'downorg',
        UserID: sessionStorage.getItem('UserID'),
        porguid: this.orguid
      }
      const { Status, Data } = await getCompanyOrgList(params)
      this.treeArr = []
      this.treeArr.push(Data)
    },
    // 树选择清空
    handleClear() {
      // 将选择器的值置空
      this.ruleForm.orgname = ''
      this.ruleForm.orguid = ''
    },
    //选择树
    handleNodeClick(data) {
      // 这里主要配置树形组件点击节点后，设置选择器的值；自己配置的数据，仅供参考
      this.ruleForm.orgname = data.orgname
      this.ruleForm.orguid = data.orguid
      // 选择器执行完成后，使其失去焦点隐藏下拉框的效果
      this.$refs.selectUpResId.blur()
    },
    close() {
      this.$refs['ruleForm'].resetFields()
      this.dialogFormVisible = false
      this.ruleForm.orguid = ''
      this.ruleForm.orgname = ''
    },
    //弹窗确定
    submitBind(){
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if(this.orguid == this.ruleForm.orguid){
            this.$baseConfirm('请选择 【' + this.ruleForm.orgname + '】 以下的组织', null, async () => {
              this.ruleForm.orguid = ''
              this.ruleForm.orgname = ''
            })
          } else {
            let params = {
              CallType: 'new',
              UserID: sessionStorage.getItem('UserID'),
              AppToken: '',
              orguid: this.ruleForm.orguid,
              uids: this.currentDeviceRow.stauid
            }
            this.saveBind(params)
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //确认分配接口
    async saveBind(params) {
      const { Data, Count } = await distributionOrgDevice(params)
      if(Data.Table[0].execStatus == 0){
        this.$baseMessage('操作成功', 'success')
        this.dialogFormVisible = false
        this.fetchData()
      } else {
        this.$baseMessage(Data.Table[0].message, 'error')
      }
    },
    //点击 解绑设备按钮
    handleUnbindDevice(row){
      this.$baseConfirm('确认解绑【' + row.devicename + '】设备吗？', null, async () => {
        let params = {
          CallType: 'unbind',
          UserID: sessionStorage.getItem('UserID'),
          uids: row.orgauid
        }
        this.unbindDevice(params)
      })
    },
    //确认解绑 接口
    async unbindDevice(params){
      const { Data, Count } = await distributionOrgDevice(params)
      if(Data.Table[0].execStatus == 0){
        this.$baseMessage('操作成功', 'success')
        this.fetchData()
      } else {
        this.$baseMessage(Data.Table[0].message, 'error')
      }
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
    // 子组件传来的， 节点点击事件
    treeNodeClick(data, node, comment) {
      // console.log('点击的组织：')
      // console.log(data)
      this.currentClickOrg = data
      this.orguid = data.orguid
      this.btnright = data.btnright
      this.fetchData()
    },
    // 子组件传来的， 初始页面查询根节点下的数据
    queryRootAllData(orguid) {
      this.orguid = orguid
       this.fetchData()
    },
    //初始页面 查询根节点下面绑定的所有 设备
    async fetchData() {
      this.listLoading = true
      let params = {
        CallType: 'bingdpaging',
        // CallType: 'unbindpaging',
        UserID: sessionStorage.getItem('UserID'),
        orguid: this.orguid,
        SearchKey:this.searchData,
        PageSize:this.pageSize,
        CurrentPage: this.currentPage
      }
      const { Data, Count } = await getOrgDeviceList(params)
      this.list = Data
      this.total = Count
      setTimeout(() => {
        this.listLoading = false
      }, 300)
    },

    //鼠标进入收缩按钮
    mouseenter(){
      this.colorFlag = 1
    },
    mouseleave(){
      this.colorFlag = 0
    },
    mouseenter2(){
      this.colorFlag2 = 1
    },
    mouseleave2(){
      this.colorFlag2 = 0
    },
    //点击收缩到左侧按钮
    // shrinkFlag:1, //0：宽1，1：宽280， 2：宽400
    handleToLeft(){
      if(this.shrinkFlag == 1){
        this.leftwidth = 1
        this.shrinkFlag = 0
        //左侧 宽度为1时，给父组件传值 隐藏掉 上面的拖拽和搜索框

      } else if(this.shrinkFlag == 2){
        this.leftwidth = 280
        this.shrinkFlag = 1
      }

    },
    handleToright(){
      if(this.shrinkFlag == 0){
        this.leftwidth = 280
        this.shrinkFlag = 1
      } else if(this.shrinkFlag == 1){
        this.leftwidth = 420
        this.shrinkFlag = 2
      }
    }

  }
};
</script>

<style scoped>
  .content-wrapper {
		width: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }
  .leftShrinkBtn {
    padding-top: 11px;
    border-right: 1px solid #DCDFE6;
    position: relative;
  }
  .shrinkBtnLeft {
    position: absolute;
    width: 10px;
    height: 60px;
    top: 30%;
    right: -10px;
    background-color: #bdbdbd;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    transition-duration: .3s;
    cursor: pointer;
  }
  .shrinkBtnLeft:before {
    content: '<';
    color: #fff;
    width: 100%;
    height: 100%;
    display: inline-block;
    margin-top: 20px;
  }
  .shrinkBtnright{
    position: absolute;
    width: 10px;
    height: 60px;
    top: 50%;
    right: -10px;
    background-color: #bdbdbd;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    transition-duration: .3s;
    cursor: pointer;
  }
  .shrinkBtnright:before {
    content: '>';
    color: #fff;
    width: 100%;
    height: 100%;
    display: inline-block;
    margin-top: 20px;
  }
  .bgcSty {
    background-color: #5f5f5f;
  }
</style>
