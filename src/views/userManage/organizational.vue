<template>
  <div class="content-wrapper">
    <el-row>
      <el-col class="leftShrinkBtn"  :style="{width: this.leftwidth + 'px'}">
        <div v-show="shrinkFlag != 0" :class="['shrinkBtnLeft', this.colorFlag == 0 ? '' : 'bgcSty']" @mouseenter="mouseenter" @mouseleave="mouseleave" @click="handleToLeft"></div>
        <div v-show="shrinkFlag != 2" :class="['shrinkBtnright', this.colorFlag2 == 0 ? '' : 'bgcSty']"  @mouseenter="mouseenter2" @mouseleave="mouseleave2" @click="handleToright"></div>
        <Category @tree-node-click="treeNodeClick" v-bind:shrinkFlag="shrinkFlag" style="padding:10px;"></Category>
      </el-col>
      <!-- 右侧表格 -->
      <el-col :style="{width: 'calc(100% - '+ this.leftwidth + 'px)'}">
        <div style="padding:7px 10px 10px 20px; ">
          <!-- 搜索条件 -->
          <vab-query-form>
            <vab-query-form-left-panel>
              <el-form :inline="true" size="medium" class="demo-form-inline">
                <div class="content-search-normal">
                  <el-form-item>
                    <el-input size="medium" v-model="searchData" placeholder="请输入编号/姓名/手机号码" style="width: 260px;"></el-input>
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
              <el-table-column v-if="itemArr.indexOf('姓名') > -1" show-overflow-tooltip label="姓名" prop="RealName"></el-table-column>
              <el-table-column v-if="itemArr.indexOf('手机号') > -1" show-overflow-tooltip label="手机号" prop="mobile"></el-table-column>
              <el-table-column v-if="itemArr.indexOf('登录账号') > -1" show-overflow-tooltip label="登录账号" prop="UserName"></el-table-column>
              <el-table-column v-if="itemArr.indexOf('所属部门') > -1" show-overflow-tooltip label="所属部门" prop="dept" ></el-table-column>
              <el-table-column v-if="itemArr.indexOf('状态') > -1" show-overflow-tooltip label="状态" prop="StatusName"></el-table-column>
              <el-table-column v-if="itemArr.indexOf('操作') > -1" show-overflow-tooltip label="操作">
                <template #default="{ row }">
                  <el-button type="text" size="small" @click="editRow(row)">编辑</el-button>
                  <el-button type="text" size="small" @click="disabledRow(row)">禁用</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="table-icon">
              <el-popover placement="bottom-start" trigger="click">
                <el-checkbox-group v-model="itemArr">
                  <div class="checkbox-block">
                    <el-checkbox v-for="item in checkArr" :label="item" :key="item"></el-checkbox>
                  </div>
                </el-checkbox-group>
                <vab-icon slot="reference" :icon="['fas', 'cog']"></vab-icon>
              </el-popover>
            </div>
          </div>
          <!-- 分页 -->
          <el-pagination :disabled="total == 0 ? true : false" :background="background" :current-page="currentPage" :layout="layout" :page-size="pageSize" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" ></el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Category from "./components/tree.vue";
import { getCompanyOrgUserList } from '@/api/user'
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
      itemArr: ['姓名', '手机号', '登录账号', '所属部门','状态', '操作'],
      checkArr: ['姓名', '手机号', '登录账号', '所属部门','状态','操作'],
      orguid:''

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
    // 节点点击事件
    treeNodeClick(data, node, comment) {
      this.orguid = data.orguid
       // this.fetchData(data.orguid)
       this.fetchData()
    },
    async fetchData() {
      this.listLoading = true
      let params = {
        CallType: 'all',
        UserID: sessionStorage.getItem('UserID'),
        orguid: this.orguid,
        SearchKey: this.searchData,
        PageSize: this.pageSize,
        CurrentPage: this.currentPage,
      }
      const { Data, Count } = await getCompanyOrgUserList(params)
      this.list = Data
      this.total = Count
      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },
    //点击编辑
    editRow(row){
      this.$baseMessage('编辑功能待开发', 'info')
    },
    //点击禁用
    disabledRow(row){
      this.$baseMessage('禁用功能待开发', 'info')
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

<style lang="scss" scoped>
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
    // background-color: $base-color-blue;
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
  /* 收缩框 鼠标悬浮的 背景颜色 */
  .bgcSty {
    background-color: #5f5f5f;
  }

</style>
