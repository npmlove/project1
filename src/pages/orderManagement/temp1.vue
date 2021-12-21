




<template>
  <div class="contont" v-if="isDataDone">
      <el-button type="" disabled class="setWidth"  >{{initData.statusDesc}}</el-button>
      <el-button type="primary" @click="saveOrder"  >保存</el-button>
      <el-button type="primary"  >审核失败</el-button>
      <el-button type="primary"  >取消订单</el-button>
      <div class="common">
          <div>
            <span>订单号</span>
            <span>{{initData.orderNo}}</span>
          </div>
          <div>
            <span>起运港 </span>
            <span>{{initData.pol}}</span>
          </div>
          <div>
            <span>航司 </span>
            <span>{{initData.airCompanyName}}</span>
          </div>
          <div class="flex">
            <span>订舱单价 </span>
            <span> <el-input  v-model="initData.bookingPrice" size="mini" placeholder="请输入内容">
               <template slot="prepend">￥</template></el-input></span>
          </div>
          <div class="flex">
            <span>运单号 </span>
            <span> <el-input v-model="initData.waybillNo" size="mini" placeholder="请输入内容"></el-input> </span>
          </div>
          <div>
            <span>目的港  </span>
            <span> {{initData.pod}}</span>
          </div>
          <div>
            <span>日期  </span>
            <span>{{initData.orderTime}}</span>
          </div>
          <div>
            <span>利润 </span>
            <span>￥{{initData.orderProfit}}</span>
          </div>
          <div>
            <span>客    户 </span>
            <span>{{initData.customerName}}</span>
          </div>
          <div>
            <span>代   理</span>
            <span>{{initData.agentName}}</span>
          </div>
          <div>
            <span>航线负责人</span>
            <span>
              <el-select v-model="principalId" size="mini" placeholder="请选择">
                <el-option
                  v-for="item in airLineList"
                  :key="item.id"
                  :label="item.loginName"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
          <div>
            <span>售前客服</span>
            <span>
              <el-select v-model="pscsId" size="mini" placeholder="请选择">
                <el-option
                  v-for="item in preSaleList"
                  :key="item.id"
                  :label="item.loginName"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
          <div>
            <span>售中客服</span>
            <span>
              <el-select v-model="input" size="mini" placeholder="请选择">
                <el-option
                  v-for="item in onSaleList"
                  :key="item.id"
                  :label="item.loginName"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
      </div>
      <div class="radioTap">
        <el-radio-group v-model="radio1">
          <el-radio-button label="1">订舱信息</el-radio-button>
          <el-radio-button label="2">账单</el-radio-button>
        </el-radio-group>
      </div>
      <div style="height:60vh">
        <div v-show="radio1=='1'" class="details">
            <h1 class="title">订舱信息</h1>
            <div class="flex ">
              <div class="flex_message">品名</div>
              <div><el-input size="mini" class="ml_10" v-model="initData.cargoName" placeholder="请输入内容"></el-input></div>
            </div>
            <div class="flex mtop_10">
              <div class="flex_message">品类</div>
              <div>
                <el-select class="ml_10" size="mini" v-model="initData.cargoType" placeholder="请选择">
                  <el-option
                    v-for="item in cargoTypeArray"
                    :key="item.value"
                    :label="item.lable"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="flex mtop_10">
              <div class="flex_message">包装类型</div>
              <div>
                <el-select class="ml_10" size="mini" v-model="initData.packageType" placeholder="请选择">
                  <el-option
                    v-for="item in packageTypeArray"
                    :key="item.value"
                    :label="item.lable"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="flex mtop_15 ">
              <div class="flex_message">单价</div>
              <div><span class="ml_10">￥{{initData.bookingPrice}}</span></div>
            </div>
            <div class="flex mtop_15 ">
              <div class="flex_message">航线</div>
              <div><span class="ml_10">{{initData.pol}}-{{initData.pod}}</span></div>
            </div>
            <div class="flex mtop_15 ">
              <div class="flex_message">托书下载</div>
              <div>
                <el-button class="ml_10" size="mini">点击下载<i class="el-icon-download el-icon--right"></i></el-button>
              </div>
            </div>
            <h1 class="title mtop_15">订舱数据</h1>
            <div class="bg_dark">
                <div class="flex_center">
                    <div>{{initData.bookingPiece}}</div>
                    <div>{{initData.bookingWeight}}</div>
                    <div>{{initData.bookingCbm}}</div>
                    <div>{{initData.bookingVwr}}</div>
                    <div>
                      <span v-if="initData.bubblePoint == 1">1/9</span>
                      <span v-if="initData.bubblePoint == 2">2/8</span>
                      <span v-if="initData.bubblePoint == 3">3/7</span>
                      <span v-if="initData.bubblePoint == 4">4/6</span>
                      <span v-if="initData.bubblePoint == 5">5/5</span>
                      <span v-if="initData.bubblePoint == 6">6/4</span>
                      <span v-if="initData.bubblePoint == 7">7/3</span>
                      <span v-if="initData.bubblePoint == 8">8/2</span>
                      <span v-if="initData.bubblePoint == 9">9/1</span>
                      <span v-if="initData.bubblePoint == 10">不分泡</span>
                    </div>
                    <div>{{initData.bookingCw}}</div>
                </div>
                <div class="flex_center mtop_10">
                    <div>件数</div>
                    <div>毛重</div>
                    <div>体积</div>
                    <div>比重</div>
                    <div>分泡比例</div>
                    <div>计费重</div>
                </div>
            </div>
            <h1 class="title">其他服务</h1>
              <div class="inData" style="background:rgb(240,240,240);padding-left:20px">
                  <div>
                      <span class="mr_25">报关服务</span>
                      <el-radio-group v-model="initData.customsType">
                        <el-radio :label="1">自行报关</el-radio>
                        <el-radio :label="2">委托报关</el-radio>
                      </el-radio-group>
                  </div>
                  <div class="mtop_10">
                      <span class="mr_25">国内提货</span>
                      <el-radio-group v-model="initData.isPickUp">
                        <el-radio :label="1">不需要</el-radio>
                        <el-radio :label="2">需要</el-radio>
                      </el-radio-group>
                  </div>
                  <div class="mtop_10">
                      <span class="mr_25">清关服务</span>
                      <el-radio-group v-model="initData.cclType">
                        <el-radio :label="1">自行清关</el-radio>
                        <el-radio :label="2">DDU</el-radio>
                        <el-radio :label="3">DDP</el-radio>
                        <el-radio :label="4">DAP</el-radio>
                      </el-radio-group>
                  </div>
              </div>
              <h1 class="title">订单备注</h1>
              <div class="inData">
                  <el-input
                      type="textarea"
                      :rows="2"
                      placeholder="请输入备注"
                      v-model="initData.remark">
                  </el-input>
              </div>

              <div class="paddingBottom"></div>
        </div>
        <div v-show="radio1=='2'" class="details">
          <!-- 应付账单 可能数组 -->
          <div v-for="(item,index) in initData.arOrderPriceList"   :key="index">
            <bill-order  :getList = item.list  :ref="`typeBill${index}`" />
            <el-button  class="setWidth ml_20"   @click="fatherAddOneItem(index)" >添加费用</el-button>
          </div>

          <!-- 应收 -->
          <div class="line"></div>
          <div>
            <billOrder  :getList= "initData.apOrderPriceList"  ref="typeTwo" />
            <el-button  class="setWidth ml_20"   @click="fatherAddOneItem(200)" >添加费用</el-button>
          </div>

        </div>
      </div>
  </div>
</template>

<script>
import billOrder from './components/billOrder.vue'
export default {
  data() {
    return {
      preSaleList:[],
      onSaleList:[],
      airLineList:[],
      orderId:'',
      orderNo:'',
      initData:{},// 初始化返回数据
      isDataDone:false, // 获取到数据后渲染页面
      radio1:'1', // 默认选择1
      // 分泡比率数组
      cargoTypeArray:[
        {
          value:1,
          lable:"普货"
        },
        {
          value:2,
          lable:"化工"
        },
        {
          value:3,
          lable:"危险品"
        },
        {
          value:5,
          lable:"防疫物资"
        }],
      packageTypeArray:[
        {
          value:1,
          lable:"散货"
        },{
          value:2,
          lable:"托盘"
        },
        ],
    };
  },
  components:{
    billOrder
  },
  async created(){
    this.orderId = this.$route.query.id
    await this.getOriganData()
    await this.initSysSetTing()
  },
  methods:{
    // 保存
    saveOrder(){
      let arrayTypeOne = this.$refs.typeBill0[0].tableData
      let arrayTypeTwo = this.$refs.typeTwo.tableData
      let order = this.initData
        delete order.arOrderPriceList
        delete order.apOrderPriceList
        delete order.orderCargoDetailList
        delete order.orderPriceList
        delete order.trayDetail
       let orderPriceList =  arrayTypeOne.concat(arrayTypeTwo)



      let params = {
        order:order,
        orderPriceList:orderPriceList
      }
      console.log(orderPriceList)
    //  this.$http.post(this.$service.orderSaveOrder,params).then((data) => {
    //         if(data.code == 200){
    //           this.$message('保存成功')
    //           this.$router.push('/orderManagement/orderManage')
    //         } else {
    //           this.$message.error(data.message)
    //         }
    //   })

    },
    // 子组件的新增放到父组件触发
    fatherAddOneItem(e){
      if(e == 0){
        this.$refs.typeBill0[0].addOneTableObj()
      }else if(e == 200){
        this.$refs.typeTwo.addOneTableObj()
      }

    },
        // 获取页面初始配置
    async initSysSetTing(){
      let res1 = await this.$http.get(this.$service.userSearchNoAuth+'?roleName=售前客服&pageSize=50000')
      let res2 = await this.$http.get(this.$service.userSearchNoAuth+'?roleName=售中客服&pageSize=50000')
      let res3 = await this.$http.get(this.$service.userSearchNoAuth+'?roleName=航线负责人&pageSize=50000')
      Promise.all([res1,res2,res3]).then(res=>{
        this.preSaleList = res[0].data.records
        this.onSaleList = res[1].data.records
        this.airLineList = res[2].data.records
      })
    },
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
  },
}
</script>

<style scoped>
.contont{
  height: 100%;
  margin: 0 20px;
  padding: 20px 0;
  overflow: scroll;
}
.setWidth{
  width: 200px;
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
.details{
  margin-left: 25px;
  margin-top: 20px;
}
.title{
    font-size: 16px;
    color: rgb(2, 175, 240);
    font-weight: 800;
    margin-bottom: 10px;
}
.flex_message{
  width: 100px;
  text-align: right;
}
.ml_10{
  margin-left: 10px;
}
.ml_20{
  margin-left: 20px;
}
.mtop_10{
  margin-top: 10px;
}
.mtop_15{
  margin-top: 15px;
}
.mr_25{
  margin-right: 25px;
}
.bg_table,.inData{
    width: 60%;
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
.bg_dark{
    width: 60%;
    background: rgb(128,128,128);
    padding: 10px 0;
    margin-left: 80px;
    font-weight: 900;

}
.line{
  width: 100%;
  margin: 20px 0;
  /* background: #000; */
  border: 1px dashed #d5d5d5;
}
</style>
