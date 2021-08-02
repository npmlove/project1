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
                    <el-input size="medium" v-model="searchData" placeholder="请输入车辆档案编号/车架号/车辆牌照" style="width: 260px;"></el-input>
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
            <vab-query-form-right-panel>
              <el-button icon="el-icon-plus" size="medium" type="primary" @click="handleAdd" style="float: right;margin-top: 5px;" >新增车辆</el-button>
            </vab-query-form-right-panel>
          </vab-query-form>
          <!-- 表格数据 -->
          <div style="position: relative">
            <el-table border ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" :height="height" >
              <el-table-column v-for="(tableItem,index) in tableColumn" :key="index" :label="tableItem.label" :prop="tableItem.prop" v-if="itemArr.indexOf(tableItem.label) > -1" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作" min-width="120px">
                <template #default="{ row }">
                  <el-button type="text" @click="handleUnbindDevice(row,'编辑')">编辑</el-button>
                  <el-button type="text" @click="handleUnbindDevice(row,'查看')">查看</el-button>
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
  </div>
</template>

<script>

import Category from "./components/tree.vue";
import { getShopTruckList } from '@/api/carList'
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
      itemArr: [],
      checkArr: [],
      tableColumn: [],
      orguid:'',
      btnright:'',
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
    handleAdd() {
      this.$router.push('./commonCarAdd')
    },
    //查看与编辑
    handleUnbindDevice(row,type){
      if(type == '编辑'){
        this.$router.push({
          path: './commonCarEdit',
          query: {
            stuid: row.stuid
          }
        })
      }else if(type == '查看'){
        this.$router.push({
          path: './commonCarDetails',
          query: {
            stuid: row.stuid
          }
        })
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
      this.list = []
      this.listLoading = true
      let params = {
        CallType: '',
        UserID: sessionStorage.getItem('UserID'),
        orguid: this.orguid,
        SearchKey:this.searchData,
        PageSize:this.pageSize,
        CurrentPage: this.currentPage
      }
      const { Data, Count } = await getShopTruckList(params)
      this.total = Count
      if(Data.length > 0){
        var newData = JSON.parse(Data[0].fromcontent)
        this.itemArr = []
        this.checkArr = []
        this.tableColumn = []
        for(var i = 0; i < newData.length; i++){
          if(newData[i].isshow == 1){
            this.itemArr.push(newData[i].key)
            this.checkArr.push(newData[i].key)
            var json  = {
              label: newData[i].key,
              prop: 'prop'+i
            }
            this.tableColumn.push(json)
          }
        }
        this.list = []
        for(var j = 0; j < Data.length; j++){
          if(Data[j].fromcontent){
            var dataArr = JSON.parse(Data[j].fromcontent)
            var jsonName = ''
            
            for(var q = 0; q < dataArr.length; q++){
              if(dataArr[q].isshow == 1){
                if(q == (dataArr.length - 1)){
                  jsonName += '"prop'+q+'":"'+dataArr[q].v+'"'
                }else{
                  jsonName += '"prop'+q+'":"'+dataArr[q].v+'",'
                }
              }
            }
            var jsonNameSt = '{'+jsonName+'}'
            jsonNameSt = JSON.parse(jsonNameSt)
            jsonNameSt.stuid = Data[j].stuid
            this.list.push(jsonNameSt)
          }
        }
        setTimeout(() => {
          this.listLoading = false
        }, 300)
      }
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
