<template>
  <div class="table-container" >
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form ref="form" :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-input v-model="searchData" placeholder="请输入公司名称/车号" style="width: 260px" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" native-type="submit" @click="handleQuery">查询</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="restClick">更新</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>
    <el-row :style="{ height:this.height }">
      <!-- <el-col :xs="24" :sm="24" :md="8" :lg="4" :xl="4" style="padding-right: 20px" > -->
      <el-col :style="{width: this.leftwidth + 'px', height:this.height }" class="leftTree" >
        <LineTree
          style="margin-top: -10px"
          :leveloneList="leveloneList"
          :leveltwoList="leveltwoList"
          :onlineSn="onlineSn"
          @tableList="tableList"
          v-bind:indexArr="indexArr"
          v-bind:styFlag="styFlag"
          v-bind:clickFlag="clickFlag"
          @updateStyFlag="updateStyFlag"
        ></LineTree>
      </el-col>
      <!-- <el-col :xs="24" :sm="24" :md="16" :lg="20" :xl="20"> -->
      <el-col :style="{width: 'calc(100% - '+ this.leftwidth + 'px)' }" class="rightTable">
        <el-table border ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" :height="height" >
          <el-table-column show-overflow-tooltip prop="carNum" label="车号" ></el-table-column>
          <el-table-column show-overflow-tooltip prop="SN" label="设备SN" ></el-table-column>
          <el-table-column show-overflow-tooltip label="状态">
            <template #default="{ row }">
              <el-tag :type="row.status == 1 ? 'success' : 'info'">
                {{ row.status == 0 ? '离线' : '在线' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="people" label="绑定设备者"></el-table-column>
          <el-table-column show-overflow-tooltip prop="tel" label="联系方式"></el-table-column>
          <el-table-column show-overflow-tooltip label="操作" width="180px">
            <template #default="{ row }">
              <!-- <el-button :disabled="row.hasVideo != 1" type="text" @click="queryVideo(row)">查看视频</el-button> -->
              <el-button type="text" @click="queryVideo(row)">查看视频</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页的位置占位 -->
        <div style="height: 46px;width: 100%;"></div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getCompanyList, getVideoStatus } from '@/api/carList'
import LineTree from './components/LineTree'

export default {
  name: 'MenuManagement',
  components: { LineTree },
  data() {
    return {
      leftwidth:280,
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      list: [],
      listLoading: true,
      elementLoadingText: '正在加载...',
      leveloneList: [],
      leveltwoList: [],
      searchData: '',
      indexArr: [],
      styFlag: [],
      clickFlag: '',

      conditionQueryFlag:0,  //0未点击更新按钮，1点击了更新按钮
      timer: null,  // 定时器
      timerFlag:1,

      onlineSn:[], //可以看视频 的sn
      noonlineSn:[], //不可以看视频 的sn
    }
  },
  async created() {
    this.getCompanyTree()
  },
  computed: {
    height() {
      return this.$baseTableHeight()
    },
  },
  methods: {
    //点击更新
    restClick() {
      this.conditionQueryFlag = 0
      this.timerFlag = 1
      this.timer = null,
      this.onlineSn = []
      this.noonlineSn = []

      this.indexArr = []
      this.styFlag = []
      this.clickFlag = ''
      this.searchData = ''
      this.list = []
      this.getCompanyTree()
    },
    //点击查询，传参给子组件
    handleQuery() {
      this.conditionQueryFlag = 1
      if (this.searchData == '') {
        this.indexArr = []
        this.styFlag = []
        this.clickFlag = ''
      }
      this.list = []
      this.styFlag = []
      this.getCompanyTree()
    },
    //接受子组件传过来的参数
    tableList(value) {
      this.list = [] //置空list  ，push进去新的数据
      this.list.push(value)
    },
    updateStyFlag(value) {
      this.styFlag = []
      this.styFlag.push(value)
      this.clickFlag = value
    },
    //查看 视频
    queryVideo(row) {
      this.$router.push({
        path: '/carManage/videoDetail',
        query: {
          sn: row.SN,
          videototalchanel: row.videototalchanel,
        },
      })
    },
    async getCompanyTree() {
      this.listLoading = true
      let params = {
        CallType: 'all',
        UserID: sessionStorage.getItem('UserID'),
        cuid: '',
        SearchKey: this.searchData,
      }
      const { Data } = await getCompanyList(params)
      if(Data.Table.length == 0 && Data.Table1.length == 0){
        this.$baseMessage('查询结果为空！请重新查询', 'info')
        setTimeout(() => { this.listLoading = false }, 300)
        return false
      }
      //遍历table 数组 构造 公司数据
      let arr = []
      for (let i = 0; i < Data.Table.length; i++) {
        let obj = {}
        obj.id = Data.Table[i].cuid //公司id
        obj.companyname = Data.Table[i].companyname //公司名称
        obj.children = [] // 添加 children 属性
        arr.push(obj)
      }
      this.leveloneList = arr
      this.leveltwoList = Data.Table1

      if(this.conditionQueryFlag == 0){
        this.listLoading = true
        this.setTimeQuery()
      }
      //判断如果是 查询， 则把查询数据的所有id拿出来，展开 树形结构
      if (this.searchData) {
        //展开 公司 id
        for (let i = 0; i < Data.Table.length; i++) {
          this.indexArr.push(Data.Table[i].cuid)
        }
        //组装 children 数据， 展开 车辆 id
        for (let i = 0; i < Data.Table.length; i++) {
          for (let j = 0; j < Data.Table1.length; j++) {
            if (Data.Table1[j].cuid == Data.Table[i].cuid) {
              let obj = {}
              obj.id = Data.Table1[j].stuid
              obj.carNum = Data.Table1[j].shoptruckno
              obj.SN = Data.Table1[j].devicesn
              obj.people = Data.Table1[j].bindbyrealname
              obj.tel = Data.Table1[j].bindphone
              obj.status = Data.Table1[j].tstatus
              this.onlineSn.indexOf(this.leveltwoList[j].devicesn) > -1 ? obj.videoStatus = 1 : obj.videoStatus = 0
              this.leveloneList[i].children.push(obj)
              //展开 车辆 id
              this.indexArr.push(Data.Table1[j].stuid)
            }
          }
        }
      }
      if(this.conditionQueryFlag == 1){
        setTimeout(() => { this.listLoading = false }, 300)
      }

    },
    //设置定时器，定时查询
    setTimeQuery(){
      console.log(this.leveltwoList)
      //保存所有sn（页面刷新、点击更新按钮 时 调用此方法）
      for(let i=0;i<this.leveltwoList.length;i++){
        this.noonlineSn.push(this.leveltwoList[i].devicesn)
      }
      this.timer = setInterval(()=>{
        this.timerFlag++;
        this.updateStatus() //定时每秒查询一次
        this.clearInterval() //四秒后清楚定时器
      }, 1000);
    },
    //清除定时器
    clearInterval(){
      if(this.timerFlag>4){
        clearInterval(this.timer);
        this.listLoading = false
      }
    },
    //调接口，获取最新 状态
    async updateStatus() {
      let obj = {}
      obj.dvrsn = this.noonlineSn.join(';')//入参，不在线的sn号
      obj.UserID = sessionStorage.getItem('UserID')
      const res = await getVideoStatus(obj)
      let result = JSON.parse(unescape(res.Data))
      console.log('结果：')
      console.log(result.data)
      if(result.code == 2000){
      	let marker = 0
      	this.noonlineSn = []
      	//循环每次的查询结果保存 每次在线的sn
      	for(let j=0;j<result.data.length;j++){
      		if(result.data[j].status == 1){
      			//1在线，保存每次查询的在线的sn
      			this.onlineSn.push(result.data[j].uuid)
      		} else {
      			//0离线
      			marker = 1
      			//保存 离线的sn 做为下次查询的入参
      			this.noonlineSn.push(result.data[j].uuid)
      		}
      	}
      	//marker一直等于0，说明没有离线的，清除定时器，不用查询下一次了
      	if(marker == 0){
      		clearInterval(this.timer);
      		this.listLoading = false
      	}
      }else{
        this.$baseMessage(res.data.Message, 'errors')
      }

    }




  },
}
</script>
<style scoped>
  .leftTree {
    padding-right: 10px;
    min-height: 200px;
    border-right: 1px solid #DCDFE6;
  }
  .rightTable {
    padding-left: 10px;
  }
</style>
