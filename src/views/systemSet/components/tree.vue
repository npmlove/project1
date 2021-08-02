<!-- 分类信息 -->
<template>
  <div>
    <div>
      <el-input v-show="shrinkFlag != 0" size="medium" placeholder="输入关键字进行过滤"  v-model="filterText" style="margin-top: -10px;"></el-input>
      <div :style="{height: this.$baseTableHeight() + 'px'}"   class="treeArea tree-container">
        <el-tree
          class="tree"
          :data="menus"
          :props="defaultProps"
          :expand-on-click-node="false"
          :default-expanded-keys="expandedkey"
          node-key="orguid"
          ref="menuTree"
          @node-click="nodeclick"
          :filter-node-method="filterNode"
          :highlight-current="true"

        >
        <!-- default-expand-all -->
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span> <i :class="data.orgicon" ></i>{{node.label}} </span>
            <!-- 右侧操作按钮 -->
            <!-- <span> -->
              <!-- <el-tooltip class="item" effect="dark" content="分配设备" placement="top"> -->
                 <!-- <i v-show="data.btnright == 1" style="color:#41b584" class="el-icon-setting" type="text" size="mini" @click="() => append(node,data)"></i> -->
               <!-- </el-tooltip> -->
              <!-- <el-button v-show="data.btnright == 1" style="color:#41b584" type="text" size="mini" @click="() => append(node,data)">分配设备</el-button> -->
            <!-- </span> -->
          </span>
        </el-tree>
      </div>
      <!-- 弹窗 -->
      <!-- <el-dialog :title="title" :visible.sync="dialogFormVisible" width="800px" @close="close" v-dialogDrag :close-on-click-modal="false" v-if="dialogFormVisible">
        <vab-query-form>
          <el-form ref="form" :inline="true" @submit.native.prevent>
            <el-form-item>
              <el-input v-model="dialogSearchData" placeholder="请输入设备SN" />
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-search" type="primary" native-type="submit" @click="queryDeviceList">查询</el-button>
              <el-button @click="dialogRestClick">重置</el-button>
            </el-form-item>
          </el-form>
        </vab-query-form>
        <el-table v-loading="listLoading" :data="dialogTableList" :element-loading-text="elementLoadingText" height="420" @selection-change="setSelectRows" border>
          <el-table-column how-overflow-tooltip type="selection" width="55"></el-table-column>
          <el-table-column show-overflow-tooltip prop="devicesn" label="设备SN"></el-table-column>
          <el-table-column show-overflow-tooltip label="设备名称" prop="devicename" width="120"></el-table-column>
          <el-table-column show-overflow-tooltip label="设备类型" prop="devicetype" width="120"></el-table-column>
          <el-table-column show-overflow-tooltip label="创建人" prop="createdby" width="120"></el-table-column>
          <el-table-column show-overflow-tooltip label="创建日期" prop="createddate" width="150"></el-table-column>
        </el-table>
        <el-pagination
          :background="background"
          :current-page="dialogTableCurrentPage"
          :layout="layout"
          :page-size="dialogTablePageSize"
          :total="dialogTableTotal"
          @current-change="handleCurrentChangeDialogTable"
          @size-change="handleSizeChangeDialogTable"
        ></el-pagination>
        <div slot="footer" class="dialog-footer">
          <el-button @click="close">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </el-dialog> -->
    </div>
  </div>
</template>

<script>
 import { getCompanyOrgList } from '@/api/user'  //查树
 import { distributionOrgDevice, getOrgDeviceList } from '@/api/optionAddtion'

export default {
  props: {
    shrinkFlag: {
      type: Number,
      default: () => 1,
    }
   },
  data() {
    return {
      elementLoadingText: '正在加载...',
      layout: 'total, sizes, prev, pager, next, jumper',
      background: true,
      listLoading: true,

      filterText:'',  //树形过滤
      dialogFormVisible: false,

       // title: "",
      // dialogSearchData: '',
      // dialogTableList: [], //弹窗里表格
      //弹窗里面的分页
      // dialogTableCurrentPage: 1,
      // dialogTablePageSize: 10,
      // dialogTableTotal: 0,
      // selectRows: [],

      menus:[],
      currentItem:null, //当前操作的数据（添加、编辑、删除）
      // expandedkey: [ "e54fe2cb-8d3f-46c7-af12-44126924c87a"],
      expandedkey: [],
      defaultProps: {
        children: "children",
        label: "orgname",
      },
      rootId:''

    };
  },
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val);
    },
  },

  created() {
    this.getMenus();
  },
  activated() {
    // this.getMenus();
  },
  methods: {
    //点击末级节点，给父组件传参，查询对应员工
    nodeclick(data, node, component) {
      //向父组件发送事件；
      if(this.dialogFormVisible == true){
        return  //点击的是分配按钮就不给查询列表数据
      }
      this.$emit("tree-node-click", data, node, component);
    },
    //树节点过滤
    filterNode(value, data) {
      if (!value) return true;
      return data.orgname.indexOf(value) !== -1;
    },
    //查询 树 接口
    async getMenus() {
      this.listLoading = true
      let params = {
        CallType: 'all',
        UserID: sessionStorage.getItem('UserID'),
        SearchKey: '',
        PageSize: '',
        CurrentPage: ''
      }
      const { Data, Count } = await getCompanyOrgList(params)
      this.menus = []
      this.menus.push(Data)
      this.rootId = Data.orguid
      this.expandedkey = [Data.orguid];
      this.$emit("queryRootAllData", Data.orguid);

      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },
    //分配 设备
    // append(node,data) {
    //   this.title = "分配设备";
    //   this.dialogFormVisible = true;
    //   this.currentItem = data  //当前操作的数据
    //   //查询设备列表
    //   this.queryDeviceList(data)
    // },
    //查询弹窗中的列表
    // async queryDeviceList(data) {
    //   this.listLoading = true
    //   let params = {
    //     CallType: 'unbindpaging',
    //     UserID: sessionStorage.getItem('UserID'),
    //     orguid: data.orguid,
    //     PageSize: this.dialogTablePageSize,
    //     CurrentPage: this.dialogTableCurrentPage,
    //     SearchKey: this.dialogSearchData,
    //   }

    //   const { Data, Count } = await getOrgDeviceList(params)
    //   this.dialogTableList = Data
    //   this.dialogTableTotal = Count
    //   setTimeout(() => {
    //     this.listLoading = false
    //   }, 300)
    // },
    //点击取消 关闭弹窗
    // close() {
    //   this.dialogFormVisible = false
    //   this.currentItem = null
    // },
    //弹窗选择的数据
    // setSelectRows(val) {
    //   this.selectRows = val
    // },
    // 弹窗确定
    // save() {
    //   let ids = []
    //   for (let i = 0; i < this.selectRows.length; i++) {
    //     // ids.push("'" + this.selectRows[i].stauid + "'")
    //     ids.push(this.selectRows[i].stauid)
    //   }
    //   //组装 参数 绑定设备
    //   let params = {
    //     CallType: 'new',
    //     UserID: sessionStorage.getItem('UserID'),
    //     AppToken: '',
    //     orguid: this.currentItem.orguid,
    //     uids: ids.join(','),
    //   }
    //   //确认绑定
    //   this.addDevice(params)
    // },
    //确认分配接口
    // async addDevice(params) {
    //   const { Data, Count } = await distributionOrgDevice(params)
    //   this.$baseMessage('操作成功', 'success')
    //   this.dialogFormVisible = false
    //   this.expandedkey = [this.currentItem.orguid];
    //   this.getOrgList();
    // },
    //弹窗内的重置
    // dialogRestClick() {
    //   this.dialogSearchData = ''
    //   this.dialogTablePageSize = 10
    //   this.dialogTableCurrentPage = 1
    //   this.queryDeviceList(this.currentItem)
    // },
    // 弹窗表格分页---start----
    // handleSizeChangeDialogTable(val) {
    //   this.dialogTablePageSize = val
    //   this.queryDeviceList(this.currentItem)
    // },
    // handleCurrentChangeDialogTable(val) {
    //   this.dialogTableCurrentPage = val
    //   this.queryDeviceList(this.currentItem)
    // },
    //关闭弹窗后 查询 当前组织绑定的设备，并传值到父组件渲染列表
    // async getOrgList() {
    //   let params = {
    //     CallType: 'bingdpaging',
    //     UserID: sessionStorage.getItem('UserID'),
    //     orguid: this.currentItem.orguid,
    //     SearchKey:'',
    //     PageSize:10,
    //     CurrentPage: 1
    //   }
    //   const { Data, Count } = await getOrgDeviceList(params)
    //   this.currentItem = null
    //   //把列表数据、置空查询数据、currentPage：1 这个三个数据传到父组件
    //   let obj = {}
    //   obj.tableList = Data
    //   obj.tableTotal = Count
    //   this.$emit('tableList', obj)
    // }

  },
};
</script>
<style scoped >
  .content-wrapper {
		width: 100%;
    box-sizing: border-box;
    padding: 20px;
    overflow: hidden;
    background-color: #f3f6f9 !important;
  }
  .content {
    background-color: #fff;
  }
  /deep/.el-dialog{
    width: 300px;
    min-width: 500px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 10px;
  }
  .treeArea {
    width: 100%;
    overflow-y: auto;
    margin-top: 10px;

    margin-left: -10px;
  }

  /* 树形结构节点添加连线 */
  .tree /deep/ .el-tree-node {
    position: relative;
    /* padding-left: 16px; */
  }

  .tree /deep/ .el-tree-node__children {
    /* padding-left: 10px; */
    padding-left: 26px;
  }

  .tree /deep/ .el-tree-node :last-child:before {
    height: 38px;
  }

  .tree /deep/ .el-tree > .el-tree-node:before {
    border-left: none;
  }

  .tree-container /deep/ .el-tree > .el-tree-node:after {
    border-top: none;
  }

  .tree /deep/ .el-tree-node:before {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .tree /deep/ .el-tree-node:after {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }
  .tree /deep/ .el-tree-node__expand-icon.is-leaf {
    display: none;
  }

  .tree /deep/ .el-tree-node:before {
    border-left: 1px dashed #b8b9bb;
    /* border-left: 1px dashed red; */
    bottom: 0px;
    height: 100%;
    top: -26px;
    width: 1px;
  }

  .tree /deep/ .el-tree-node:after {
    border-top: 1px dashed #b8b9bb;
    /* border-top: 1px dashed blue; */
    height: 20px;
    top: 12px;
    /* width: 18px; */
    width: 12px;
  }

  .tree /deep/ .el-tree-node__content {
    /* padding-left: 18px !important; */
    padding-left: 12px !important;
  }

  .tree /deep/ .el-tree-node__content > .el-tree-node__expand-icon {
      padding: 0px !important;
  }

</style>
