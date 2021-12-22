<template>
  <div class="contont" v-if="isDataDone">
    <div v-if="initData.status == 9">
        <el-button type="" disabled class="setWidth"   >{{initData.statusDesc}}</el-button>
        <el-button type="primary" @click="saveOrder" >保存</el-button>
        <el-button type="primary" class="setWidth" @click="exdeOrder(1)" >货物已进仓</el-button>
        <el-button type="danger" @click="exdeOrder(2)" >取消订单</el-button>
      </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      orderNo:"",
      orderId:'',
      initData:{},
      isDataDone:false
    };
  },
  created(){
      this.orderId = this.$route.query.id
      this.getOriganData()
  },
  methods:{
        // 获取订单详情
    async  getOriganData(){
      let res = await  this.$http.get(this.$service.orderSearchDetail+`?orderId=${this.orderId}`)
      if(res.code == 200){
        let tempObj = res.data
          tempObj.trayDetail = JSON.parse(tempObj.trayDetail)
          for(let i in tempObj.arOrderPriceList){
           tempObj.arOrderPriceList[i].changeBillAddOne = false
          }
          this.orderNo = tempObj.orderNo
          this.initData = tempObj
          this.isDataDone = true
      }
    },
  }
}
</script>
<style scoped>
.contont{
  height: 100%;
  margin: 0 20px;
  padding: 20px 0;
  overflow: scroll;
}
.tips{
  font-size: 26px;
  font-weight: 800;
}
.common{
  background: rgb(231, 236, 239);
  display: flex;
  color: rgb(2, 175, 240);
  padding: 10px 20px;
  flex-wrap: wrap;
  align-items: center;

}
.common>div{
  width: 25%;
  padding-top: 10px;
}
.flex{
  display: flex;
  align-items: center;
}
.radioTap{
  padding: 15px 15px 0;
}



.flex_message{
  width: 100px;
  text-align: right;
}
.title{
    font-size: 16px;
    color: rgb(2, 175, 240);
    font-weight: 800;
    margin-bottom: 10px;
}
.mtop_15{
  margin-top: 15px;
}
.mtop_10{
    margin-top: 10px;
}
.ml_10{
  margin-left: 20px;
  /* margin-top: 20px; */
}
.mr_25{
    margin-right: 25px;
}
.mt_20{
  margin-top: 20px;
}
.ml_20{
  margin-left: 20px;
}
.setWidth{
  width: 200px;
}
.bg_dark{
    width: 60%;
    background: rgb(128,128,128);
    padding: 10px 0;
    margin-left: 80px;
    font-weight: 900;

}
.flex_center{
    display: flex;
    align-content: center;
}
.flex_center>div{
    flex: 1;
    text-align: center;

}
.bg_table,.inData{
    width: 60%;
    padding: 10px 0;
    margin-left: 80px;
    font-weight: 900;
}
.border{
    border: 1px solid black;
    border-bottom:none
}
.border:nth-last-child(1){
    border: 1px solid black;
}
.padding_contont>div{
    padding: 10px 0;
}

.paddingBottom{
  width: 100%;
  height: 160px;

}
.line{
  width: 100%;
  margin: 20px 0;
  /* background: #000; */
  border: 1px dashed black;
}
.details{
  margin-left: 25px;
  margin-top: 20px;
}
.pTips{
  margin-left: 25px;
  margin-top: 20px;
}
.pTips>span:nth-child(2){
  color: rgb(2, 175, 240);
  text-decoration: underline;
  margin-left: 15px;

}
</style>