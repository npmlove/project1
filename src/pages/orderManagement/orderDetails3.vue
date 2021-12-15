<template>
  <div class="contont" v-if="isDataDone">
      <!-- <div class="opeartion">
          <div> <span class="tips">操作中,待完成</span> </div>
          <div>
            <el-button  type="primary">保存</el-button>
          </div>
          <div>
            <el-button  type="primary">操作完成</el-button>
          </div>
          <div>
            <el-button  type="danger">操作异常，取消订单</el-button>
          </div>
      </div> -->
      <el-button type="danger" @click="saveOrder" >保存</el-button>
      <el-button type="danger" @click="ceshi">ceshi</el-button>
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
      <div   style="height:60vh;">
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
              <div class="bg_table">
                  <div class="flex_center border padding_contont " style="">
                      <div>托盘数量</div>
                      <div>长（cm）</div>
                      <div>宽（cm）</div>
                      <div>高（cm）</div>
                  </div>
                  <div class="flex_center border padding_contont "  v-for="(item,index) in initData.trayDetail" :key="index">
                        <div>{{item.trayNumber}}</div>
                        <div>{{item.traySize}}</div>
                        <div>{{item.trayWidth}}</div>
                        <div>{{item.trayHeight}}</div>
                  </div>
              </div>
              <h1 class="title">进仓数据</h1>
              <div class="inData ">
                  <div class="flex_center">
                      <div><el-input size="mini" class="ml_10" v-model="initData.inboundPiece" placeholder=""></el-input></div>
                      <div><el-input size="mini" class="ml_10" v-model="initData.inboundWeight" placeholder=""></el-input></div>
                      <div><el-input size="mini" class="ml_10" v-model="initData.inboundCbm" placeholder=""></el-input></div>
                      <div><el-input size="mini" class="ml_10" v-model="initData.inboundVwr" placeholder=""></el-input></div>
                      <div>
                        <el-select class="ml_10" size="mini" v-model="initData.bubblePoint" placeholder="请选择">
                            <el-option
                              v-for="item in bubblePointArray"
                              :key="item.value"
                              :label="item.lable"
                              :value="item.value">
                            </el-option>
                          </el-select>
                      </div>
                      <div><el-input size="mini" class="ml_10" v-model="initData.inboundCw" placeholder=""></el-input></div>
                  </div>
                  <div class="flex_center mtop_10">
                      <div>件数</div>
                      <div>毛重</div>
                      <div>体积</div>
                      <div>比重</div>
                      <div>分泡比例</div>
                      <div>计费重</div>
                  </div>
                  <binList class="mtop_10" ref="typeThree" :childData= "initData.orderCargoDetailList" />
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
          <billOrder  :getList= "initData.arOrderPriceList[0].list" :propDate= "typeOneProp" :changeBill= 'changeBillOne' :billId= 'billIdOne' ref="typeOne" />
          <div v-if="creatNewBillBoolen" >
            <!-- 新建账单内容 -->
              <billOrder ref="typeFour" :getList='[]'  :changeBill= 'changeBillFour' :propDate= 'typeFourProp' :billId='0 ' />
              <el-button   style="margin-left:20px;width:200px"   @click="fatherNewFour()" >新增</el-button>
              <el-button   style="margin-left:20px;width:200px" type="primary" @click="reconciliationClient(4)" >发起客户对账</el-button>
          </div>
         
          <div >
              <el-button v-if="initData.arOrderPriceList[0].status == 3 && creatNewBillBoolen == false" type="primary" @click="creatNewBill" style="width:200px;margin-left:20px;" >新建账单</el-button>
              <el-button  v-if="initData.arOrderPriceList[0].status == 0" style="width:200px"  @click="fatherNewOne()"  >新增</el-button>
              <el-button  v-if="initData.arOrderPriceList[0].status == 0"  style="margin-left:20px;width:200px" type="primary" @click="reconciliationClient(1)" >发起客户对账</el-button>
          </div>
          
          <div  >
            <p class="pTips" v-if="initData.arOrderPriceList[0].status == 1">
                <span>账单已发送，等待客户确认....（倒计时：{{initData.billCreateTime}}）</span>
                <span @click="reWriteBill">修改账单</span>
            </p>
            <p class="pTips" v-if="initData.arOrderPriceList[0].status == 2">
                <span>账单已确认</span>
                <span @click="reWriteBill">修改账单</span>
            </p>
            <p class="pTips" v-if="initData.arOrderPriceList[0].status == 3">
                <span>账单已确认，开票已申请</span>
                <span >修改账单</span>
            </p>
            <p class="pTips" v-if="initData.arOrderPriceList[0].status == 4">
                <span>账单已确认，发票开具￥</span>
                <span >修改账单</span>
            </p>
          </div>
          
          <div class="line"></div>
          <billOrder  :getList= "initData.apOrderPriceList" :propDate= "typeTwoProp" :changeBill= 'changeBillTwo' :billId= 'billIdTwo' ref="typeTwo" />
          <div class="line"></div>
          <div class="paddingBottom"></div>
        </div>
        
      </div>

  </div>
</template>
<script>
import binList from './components/binList.vue'
import billOrder from './components/billOrder.vue'
export default {
  data() {
    return {
      input: '',
      radio1:'1',
      isDataDone:false,// 已经获取到数据在渲染界面
      orderNo:'',// 运单号
      orderId:'',// 账单id
      changeBillOne:false, // 是否修改应收changeBill账单状态 默认false
      changeBillTwo:false, // 是否修改应付changeBill账单状态
      changeBillFour:false,
      creatNewBillBoolen:false, // 新建账单的状态
      preSaleList:[] ,// 售前客服初始数组
      pscsId:'', // 售前客服id
      onSaleList:[] ,// 售中客服初始数组
      mscsId:"",// 售中客服id
      airLineList:[] ,// 航线负责人初始数组
      principalId:'', // 航线负责人ID
      typeOneProp:{}, //传递给typeone 对象
      billIdOne:'',//传递给账单id
      typeTwoProp:{}, //传递给typeTwo 对象
      typeFourProp:{}, //传递给typeFour 对象
      billIdTwo:'',//传递给账单id
      initData:{}, // 初始化返回对象
      bubblePointArray:[
        {
          value:1,
          lable:"1/9"
        },
        {
          value:2,
          lable:"2/8"
        },
        {
          value:3,
          lable:"3/7"
        },
        {
          value:4,
          lable:'4/6'
        },
        {
          value:5,
          lable:'5/5'
        },
        {
          value:6,
          lable:'6/4'
        },
        {
          value:7,
          lable:'7/3'
        },
        {
          value:8,
          lable:'8/2'
        },
        {
          value:9,
          lable:'9/1'
        },
        {
          value:10,
          lable:'不分泡'
        },

      ], // 分泡比率数组
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
  computed:{
    getInboundCw(){
      return this.initData.inboundCw
    }
  },
  watch:{
    getInboundCw(newValue){
      console.log(newValue)
      this.dealChildPrice(newValue)
    }
  },

   created(){
    this.orderId = this.$route.query.id
     this.getOriganData()
     this.initSysSetTing()
  },
  components:{
    binList,
    billOrder
  },
  methods:{
    // 创建一个新账单
    creatNewBill(){
      this.typeFourProp ={
          orderId:this.orderId,
          expenseType:1,
          orderNo:this.initData.orderNo,
          expenseUnitName:this.initData.expenseUnitName
      }
      this.creatNewBillBoolen = true
    },

    // Four组件的新增放到父组件触发
    fatherNewFour(){
      this.$refs.typeFour.addOneTableObj()
    },
    // 组件的新增放到父组件触发
    fatherNewOne(){
      this.$refs.typeOne.addOneTableObj()
    },
    // 修改账单
    reWriteBill(){
      let arrayTypeOne = this.$refs.typeOne.tableData
      let {billId} = arrayTypeOne[0]
      console.log(billId)
      this.$http.post(this.$service.modifyBill,{billId:billId}).then(res=>{
        if(res.code == 200){
            this.$message({
              message: '修改账单成功',
              type: 'success'
            })
          this.changeBillOne = !this.changeBillOne
        }
      })
      
    },
    // 保存账单
    saveOrder(){
      let arrayTypeOne = this.$refs.typeOne.tableData
      let arrayTypeTwo = this.$refs.typeTwo.tableData
      // console.log(arrayTypeOne)
      // console.log(arrayTypeTwo)
      let order = this.initData
        delete order.arOrderPriceList
        delete order.apOrderPriceList
        delete order.orderCargoDetailList
        delete order.orderPriceList
        delete order.trayDetail
       let orderPriceList =  arrayTypeOne.concat(arrayTypeTwo)
       let orderCargoDetailList = this.$refs.typeThree.tableData

  
      let params = {
        order:order,
        orderPriceList:orderPriceList,
        orderCargoDetailList:orderCargoDetailList,
      }
     this.$http.post(this.$service.orderSaveOrder,params).then((data) => {
            if(data.code == 200){
              this.$router.push('/orderManagement/orderManage')
            } else {
              this.$message.error(data.message)
            }
      })
    },
    // 如果子组件中有空运费 输入计费重的时候同时修改子组件单价
    dealChildPrice(num){
      // 取到子组件typeOne
      let a = this.$refs.typeOne.tableData
      
      for(let i in a){
        if(a[i].expenseName == '空运费'){
          a.quantity = num
          this.$set(a[i],'quantity',num)
        }
      }
      let b = this.$refs.typeTwo.tableData
      for(let i in b){
        if(b[i].expenseName == '空运费'){
          b.quantity = num
          this.$set(b[i],'quantity',num)
        }
      }


    },
    // 获取页面初始配置
    async initSysSetTing(){
      let res1 = await this.$http.get(this.$service.userSearch+'?roleName=售前客服&pageSize=50000')
      let res2 = await this.$http.get(this.$service.userSearch+'?roleName=售中客服&pageSize=50000')
      let res3 = await this.$http.get(this.$service.userSearch+'?roleName=航线负责人&pageSize=50000')
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
        this.initData = tempObj
        
        let { id , orderNo ,expenseUnitName} = tempObj
        if(tempObj.arOrderPriceList[0].list.length > 0){
          this.billIdOne = tempObj.arOrderPriceList[0].list[0].billId
        }
        if(tempObj.apOrderPriceList.length > 0 ){
          this.billIdTwo = tempObj.apOrderPriceList[0].billId
        }
        this.changeBillOne = tempObj.arOrderPriceList[0].status == 1 ? false : true
        this.typeOneProp = {
          orderId:id,
          expenseType:1,
          orderNo:orderNo,
          expenseUnitName:expenseUnitName
        }
        this.typeTwoProp = {
          orderId:id,
          expenseType:2,
          orderNo:orderNo,
          expenseUnitName:expenseUnitName
        }
        this.isDataDone = true
      }
    },
    // 客户发起对账
    async reconciliationClient(type){
      let {departureDate , fullLeg  ,orderNo ,waybillNo} = this.initData ;
      let userId = sessionStorage.getItem('userId')
      let tempArray  = type == 1 ? this.$refs.typeOne.tableData :  this.$refs.typeFour.tableData;
      let totalCny = type == 1 ?  this.$refs.typeOne.totalCnyStr : this.$refs.typeFour.totalCnyStr ;
      if(totalCny > 0){
        let params = {
          departureDate:departureDate,
          fullLeg:fullLeg,
          orderNo:orderNo,
          waybillNo:waybillNo,
          orderId:this.orderId,
          userId:userId,
          prices:tempArray,
        }
        console.log(params)
        this.$http.post(this.$service.priceSendBill, params).then(res => {
            if (res.code == 200) {
              console.log(res)
              this.$router.push('/orderManagement/orderManage')
            }else{
              this.$message.error(res.message)
            }
          })
      }else{
        this.$message.error(`${this.initData.customerName}，账单金额异常，发起对账失败`)
        return
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
.opeartion{
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #d5d5d5;
  /* border-radius: 15px; */
  padding-bottom: 20px;
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
  .ml_10{
    margin-left: 20px;
    margin-top: 20px;
  }
  .ml_10{
    margin-left: 10px;
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
.mtop_10{
    margin-top: 10px;
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
.mr_25{
    margin-right: 25px;
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
