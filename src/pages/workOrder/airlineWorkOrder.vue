<template>
  <div class="content-wrapper">
    <div class="content">
      <div class="pageTitle">
        <div class="titlePart">
          <div>
            <div>{{pageRoleName}}</div>
            <div style="margin-top:8px">航线</div>
          </div>
        </div>
        <div class="titleParts" @click="pageShow='table'">
          全部工单
        </div>
        <div class="titlePartss" @click="waitConfirm">
          <div>
             <div>待我处理</div>
             <div style="margin-top:15px;text-align:center">{{workNumber}}</div>
          </div>
        </div>
      </div>
      <Table  v-if="pageShow == 'table'" :pageRoleId="pageRoleId"></Table>
      <waitDeal v-if="pageShow == 'deal'" :pageRoleId="pageRoleId"> </waitDeal>
    </div>
  </div>
</template>

<script>
  import Table from "./components/airLineWorkTable";
  import waitDeal from "./components/airLineWaitDeal";
  export default {
    components:{  
      Table,
      waitDeal
    },
    data() {
      return {
        pageRoleName:"",
        pageRoleId:"",
        workNumber:"",
        pageShow:"table"
      }
    },
    mounted() {
      //页面左上角人名、id
      this.pageRoleName = JSON.parse(sessionStorage.getItem("userInfo")).name
      this.pageRoleId = JSON.parse(sessionStorage.getItem("userInfo")).id
      this.getPageRight()
    },
    methods: {
      //待我确认
      waitConfirm(){
        this.pageShow = "deal"
        this.getPageRight()
      },
      //获取页面右上角数据
      getPageRight(){
        this.workNumber = ''
        this.$http.get(this.$service.countWork4Prcp).then(res=>{
        if(res.code == 200) {
          this.workNumber = res.data
        } else {
          this.$message.error(res.message)
        }
      })
      },
     
    },
    watch:{
       
    },
    beforeDestroy() {
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
