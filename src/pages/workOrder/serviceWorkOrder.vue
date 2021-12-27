<template>
  <div class="content-wrapper">
    <div class="content">
      <div class="pageTitle">
        <div class="titlePart">
          <div>
            <div>{{pageRoleName}}</div>
            <div style="margin-top:8px">售前客服</div>
          </div>
        </div>
        <div class="titleParts" @click="allWorkOrder">
          全部工单
        </div>
        <div class="titlePartss" @click="waitConfirm">
          <div>
             <div>待我确认</div>
             <div style="margin-top:15px;text-align:center">{{workNumber}}</div>
          </div>
        </div>
      </div>
     <scrollNotice :textArr ="noticeData" ></scrollNotice>
      <Table @flashRight="getPageRight" v-if="pageShow == 'table'" ref="workOrderTable"></Table>
      <workConfirm v-if="pageShow == 'confirm'" @requestData = "waitConfirm('son')" ref="workConfirm"></workConfirm>
    </div>
  </div>
</template>

<script>
  import scrollNotice from '@/components/scrollNotice'
  import Table from "./components/serviceWorkTable";
  import workConfirm from "./components/serviceWaitConfirm";
  export default {
    components:{  
      Table,
      workConfirm,
      scrollNotice
    },
    data() {
      return {
        //滚动公告栏
        noticeTimer:null,//公告定时器
        stopNotice:true,//公告显示一轮重新开始
        noticeData:[],
        pageRoleName:"",
        workNumber:"",
        pageShow:"table"
      }
    },
    mounted() {
      //公告定时器 10min请求一次数据
      this.noticeTimer = setInterval(()=>{this.getRollListData()},600000)
      
      //页面左上角人名
      this.pageRoleName = JSON.parse(sessionStorage.getItem("userInfo")).name
      //滚动公告数据
      this.getRollListData()
      this.getPageRight()
    },
    methods: {
      //全部工单栏 点击事件
      allWorkOrder(){
        this.pageShow = "table"
        this.$refs.workOrderTable.searchClick(true)
      },
      //待我确认
      waitConfirm(e){
        this.pageShow = "confirm"
        if(e!='son') {
          this.$refs.workConfirm.initData()
        }
        this.getPageRight()
      },
      //获取页面右上角数据
      getPageRight(){
        this.workNumber = ''
        this.$http.get(this.$service.countDealingWork4Cst).then(res=>{
        if(res.code == 200) {
          this.workNumber = res.data
        } else {
          this.$message.error(res.message)
        }
      })
      },
      getRollListData(){
        this.$http.get(this.$service.searchRollList+"?size=20").then(res=>{
          if(res.code==200) {
            this.noticeData = res.data.map(item=>item.msgDesc)
            this.$forceUpdate()
          } else {
            this.$message.error(res.message)
          }
        })
      },
    },
    watch:{
       
    },
    beforeDestroy() {
      clearInterval(this.noticeTimer)
    },
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
    .content {
      background-color: #fff;
      padding-top:20px;
      .pageTitle {
        margin-bottom: 15px;
        display:flex;
        justify-content: space-around;
        .titlePart {
          width:200px;
          height:120px;
          border:1px solid rgb(22,155,213);
          font-size:20px;
          color:rgb(22,155,213);
          display: flex;
          justify-content: center;
          align-items: center;
          .content {
            top:50%;
            left:50%;
            margin-top:-50px;
            margin-left:-50px;
            margin: auto;
            background-color: #fff;
          }
        }
        .titleParts {
          width:200px;
          height:120px;
          border: 1px solid black;
          font-size:20px;
          background: rgb(242,242,242);
          display:flex;
          justify-content: center;
          align-items: center;
        }
        .titlePartss {
          width:200px;
          height:120px;
          background: rgb(242,242,242);
          font-size:20px;
          color:rgb(22,155,213);
          display:flex;
          justify-content: center;
          align-items: center;
        }
      }
      
      .content-search-normal {
        padding-top:10px;
        text-align: left;
      }
    }
  }

  
</style>
