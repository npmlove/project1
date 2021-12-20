<template>
  <div class="contont" v-if="isDataDone">
      <el-button type="" disabled class="setWidth"  >{{initData.statusDesc}}</el-button>
      <el-button type="primary" @click="saveOrder" >保存</el-button>
      <el-button type="primary" @click="exdeOrder(1)" >操作完成</el-button>
      <el-button type="primary" @click="exdeOrder(2)" >取消订单</el-button>
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
                      <div><el-input size="mini" class="ml_10" v-model="initData.inboundWeight" @change="calcVwr" placeholder=""></el-input></div>
                      <div><el-input size="mini" class="ml_10"  v-model="initData.inboundCbm" @change="calcVwr" placeholder=""></el-input></div>
                      <div><el-input size="mini" class="ml_10" disabled v-model="initData.inboundVwr" placeholder=""></el-input></div>
                      <div>
                        <el-select class="ml_10" size="mini" v-model="initData.bubblePoint" @change="calcVwr" placeholder="请选择">
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
                  <binList class="mtop_10" ref="typeThree" :orderId= "orderId" :childData= "initData.orderCargoDetailList" />
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
          <!-- 应付账单可以最多有5个 做个循环 循环组件ref -->
          <div v-for="(item,index) in initData.arOrderPriceList"   :key="index">
            <!-- 组件部分 -->
            <bill-order  :getList = item.list  :ref="`typeBill${index}`" />
            <!-- 操作部分 -->
            <div class="ml_20" v-if="item.status == 0 || item.changeBillAddOne" >
              <el-button  class="setWidth"   @click="fatherAddOneItem(index)" >添加费用</el-button>
              <el-button  class="setWidth"  type="primary" @click="reconciliationClient(index)" >发起客户对账</el-button>
            </div>
            <div  >
              <p class="pTips" v-if="item.status == 1 && item.changeBillAddOne ==false ">
                  <span>账单已发送，等待客户确认....（倒计时：{{item.billCreateTime}}）</span>
                  <span @click="reWriteBill(index)">修改账单</span>
              </p>
              <p class="pTips" v-if="item.status == 2">
                  <span>账单已确认</span>
                  <span @click="reWriteBill(index)">修改账单</span>
              </p>
              <p class="pTips" v-if="item.status == 3">
                  <span>账单已确认，开票已申请</span>
                  <span >修改账单</span>
              </p>
              <p class="pTips" v-if="item.status == 4">
                  <span>账单已确认，发票开具￥{{item.invoiceAmount}}</span>
                  <span >修改账单</span>
              </p>
            </div>
            <!-- 新增账单 -->
            <div>
                <el-button v-if="(index == initData.arOrderPriceList.length - 1 && index !== 4) && item.status == 3" type="primary" @click="creatNewBill(index)" class="setWidth ml_20 mt_20" >新建账单</el-button>
            </div>
          </div>
          <div v-if="creatNewBillBoolen" >
              <billOrder    ref="typeNewBill" :getList='[]' :orderIdTemp='orderId' :orderNoTemp='orderNo' />
              <el-button  class="setWidth ml_20"   @click="fatherAddOneItem(100)" >添加费用</el-button>
              <el-button   class="setWidth ml_20" type="primary" @click="reconciliationClient(100)" >发起客户对账</el-button>
          </div>
          <div class="line"></div>
            <billOrder  :getList= "initData.apOrderPriceList"  ref="typeTwo" />
            <!-- 应收添加 -->
            <!-- <el-button  class="setWidth ml_20"   @click="fatherAddOneItem(200)" >添加费用</el-button> -->
            <span  class="ml_20" v-if="initData.financeStatus == 0">未交单</span>
            <span  class="ml_20" v-if="initData.financeStatus == 1">已交单</span>
            <span  class="ml_20" v-if="initData.financeStatus == 2">请解锁</span>
            <span  class="ml_20" v-if="initData.financeStatus == 3">交单待审核</span>
            <span class="ml_20" v-if="initData.financeStatus == 4">修改中</span>
            <el-button class="setWidth ml_20" :type="isChangeJiaoDan ? 'primary' : ''" :disabled="!isChangeJiaoDan" v-if="isChangeJiaoDan" @click="commitionBill()">交单</el-button>
            <el-button class="setWidth ml_20" v-if="initData.financeStatus == 1 " @click="recommiter" >申请解锁</el-button>
            <el-button class="setWidth ml_20" v-if="initData.financeStatus == 2 " >解锁已申请，等待审核</el-button>
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
      isChangeJiaoDan:true, // 交单是否显示出来
      orderNo:'',// 运单号
      orderId:'',// 账单id
      creatNewBillBoolen:false, // 新建账单的状态
      preSaleList:[] ,// 售前客服初始数组
      pscsId:'', // 售前客服id
      onSaleList:[] ,// 售中客服初始数组
      mscsId:"",// 售中客服id
      airLineList:[] ,// 航线负责人初始数组
      principalId:'', // 航线负责人ID
      typeTwoProp:{}, //传递给typeTwo 对象
      billIdTwo:'',//传递给账单id
      initData:{}, // 初始化返回对象
      billFourArray:[], // 账单
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
    calcVwr(){
      let {inboundWeight,inboundCbm,bubblePoint} = this.initData
      if(inboundWeight && inboundCbm){
        let scale = inboundCbm / inboundWeight
        this.initData.inboundVwr = Math.ceil(scale > 1/167 ? scale : 1/167) 
        if(bubblePoint == 10){
          this.initData.inboundCw = inboundWeight
        }else if(bubblePoint == 9){
           this.initData.inboundCw = Math.ceil(inboundCbm * 167 * 0.9 + inboundWeight * 0.1)
        }else if(bubblePoint == 8){
          this.initData.inboundCw = Math.ceil(inboundCbm * 167 * 0.8 + inboundWeight * 0.2)
        }else if(bubblePoint == 7){
          this.initData.inboundCw = Math.ceil(inboundCbm * 167 * 0.7 + inboundWeight * 0.3)
        }else if(bubblePoint == 6){
          this.initData.inboundCw = Math.ceil(inboundCbm * 167 * 0.6 + inboundWeight * 0.4)
        }else if(bubblePoint == 5){
          this.initData.inboundCw = Math.ceil(inboundCbm * 167 * 0.5 + inboundWeight * 0.5)
        }else if(bubblePoint == 4){
          this.initData.inboundCw = Math.ceil(inboundCbm * 167 * 0.4 + inboundWeight * 0.6)
        }else if(bubblePoint == 3){
          this.initData.inboundCw = Math.ceil(inboundCbm * 167 * 0.3 + inboundWeight * 0.7)
        }else if(bubblePoint == 2){
          this.initData.inboundCw = Math.ceil(inboundCbm * 167 * 0.2 + inboundWeight * 0.8)
        }else if(bubblePoint == 1){
          this.initData.inboundCw = Math.ceil(inboundCbm * 167 * 0.1 + inboundWeight * 0.9)
        }
      }else{

      }
    },
    // 申请解锁
    recommiter(){
      this.$prompt('申请解锁', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^(\s|\S){0,200}$/,
          inputErrorMessage: '限制200字'
        }).then(({ value }) => {
              var data = {
                financeStatus: this.initData.financeStatus,
                operationType: 1,
                orderId: this.orderId,
                info: value
              }
              this.$http.post(this.$service.presentSavePresentLog, data).then(res => {
                if (res.code == 200) {
                  this.$alert('申请成功', {
                    confirmButtonText: '确定',
                    callback: () => {
                      this.$router.push('/orderManagement/orderManage')
                    }
                  });
                }else{
                  this.$message.error(res.message)
                }
              })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
 

    },
    // 操作完成 推进订单进程 不然没法对账
    exdeOrder(e){
      // ctrlFlag 1 前进状态 2 取消   （3 待平台审核 失败的时候传3）
      let arrayTypeOne = this.$refs.typeBill0[0].tableData
      let arrayTypeTwo = this.$refs.typeTwo.tableData
      let order = this.initData
        delete order.arOrderPriceList
        delete order.apOrderPriceList
        delete order.orderCargoDetailList
        delete order.orderPriceList
        delete order.trayDetail
        delete order.createTime
        delete order.updateTime
      let orderPriceList =  arrayTypeOne.concat(arrayTypeTwo)
      let orderCargoDetailList = this.$refs.typeThree.tableData
      let params = {
        order:order,
        orderPriceList:orderPriceList,
        orderCargoDetailList:orderCargoDetailList,
        ctrlMap:{
          ctrlFlag:e
        }
        
      }
     this.$http.post(this.$service.orderExecuteOrder,params).then((data) => {
            if(data.code == 200){
              this.$message('成功')
              this.$router.push('/orderManagement/orderManage')
            } else {
              this.$message.error(data.message)
            }
      })
    },

    // 交单
    commitionBill(){
      // 账单暂时已经定 确认

     console.log(this.initData.financeStatus)

      let tempArr = this.initData.arOrderPriceList
      let isBoo  = tempArr.filter(item=>{
        return    item.status <3
      })
      if(isBoo.length > 0){
         this.$message.error('存在账单未对账');
      }else{
        let data = {
          financeStatus: this.initData.financeStatus,
          operationType: 0,
          orderId: this.orderId,
          info: ''
        }
        this.$http.post(this.$service.presentSavePresentLog, data).then(res => {
          if (res.code == 200) {
            this.$alert('交单成功', {
              confirmButtonText: '确定',
              callback: () => {
                this.$router.push('/orderManagement/orderManage')
              }
            });
          }else{
            this.$message.error(res.message)
          }
        })
      }


    },
    // 创建一个新账单
    creatNewBill(e){
      this.creatNewBillBoolen = true
    },

    // Four组件的新增放到父组件触发
    fatherAddOneItem(e){
      if(e == 0){
        this.$refs.typeBill0[0].addOneTableObj()
      }else if(e == 1){
        this.$refs.typeBill1[0].addOneTableObj()
      }else if(e == 2){
        this.$refs.typeBill2[0].addOneTableObj()
      }else if(e == 3){
        this.$refs.typeBill3[0].addOneTableObj()
      }else if(e == 4){
        this.$refs.typeBill4[0].addOneTableObj()
      }else if(e == 100){
        // 这里是新增账单
        this.$refs.typeNewBill.addOneTableObj()
      }else if(e == 200){
        this.$refs.typeTwo.addOneTableObj()
      }
     
    },
    // 组件的新增放到父组件触发
    fatherNewOne(){
      this.$refs.typeOne.addOneTableObj()
    },
    // 修改账单
    reWriteBill(e){
      this.initData.arOrderPriceList[e].changeBillAddOne = true
      let  tempArray = []
      if(e == 0){
        tempArray = this.$refs.typeBill0[0].tableData
       
      }else if(e == 1){
        tempArray = this.$refs.typeBill1[0].tableData
       
      }else if(e == 2){
        tempArray = this.$refs.typeBill2[0].tableData
       
      }else if(e == 3){
        tempArray = this.$refs.typeBill3[0].tableData
       
      }else if(e == 4){
        tempArray = this.$refs.typeBill4[0].tableData 
        
      }
      tempArray.map(res=>{
        if(res.expenseName == '空运费'){
          res.ingStatic = true
        }else{
          res.ingStatic = false
        }
      })
      let {billId} = tempArray[0]
      this.$http.post(this.$service.modifyBill,{billId:billId}).then(res=>{
        if(res.code == 200){
            this.$message({
              message: '修改账单成功',
              type: 'success'
            })
        }
      })
    },
    // 保存账单
    saveOrder(){
      // 在修改账单的过程中不允许保存
      let tempArray = this.initData.arOrderPriceList
      let test = tempArray.filter(res=>{
        return res.status == 2 || res.status == 1
      })
      if(test.length > 0){
        this.$message.error("账单在修改")
        return ;
      }
      if(this.initData.financeStatus == 1 || this.initData.financeStatus == 4){
        this.$message.error('账单在交单')
        return ;
      }
      let {inboundWeight,inboundCbm, inboundCw , inboundPiece} = this.initData
      if(!inboundPiece){
        this.$message.error('请输入进仓件数')
        return ;
      }
      if(!inboundWeight){
        this.$message.error('请输入毛重')
        return ;
      }
      if(!inboundCbm){
        this.$message.error('请输入体积')
        return ;
      }
      if(!inboundCw){
        this.$message.error('请输入计费重')
        return ;
      }
      let arrayTypeThree = this.$refs.typeThree.tableData 
      let tempthree = arrayTypeThree.filter(item=>{
        return (item.piece == undefined || item.piece == '') || (item.cbm == undefined || item.cbm == "") || (item.weight == undefined || item.weight == '')  || (item.cargoSize == undefined || item.cargoSize == '')
      }) 
      if(tempthree.length > 0){
        this.$message.error('进仓数据未填写')
        return ;
      }
      
      let arrayTypeOne = this.$refs.typeBill0[0].tableData
      let arrayTypeTwo = this.$refs.typeTwo.tableData
      let order = this.initData
        delete order.arOrderPriceList
        delete order.apOrderPriceList
        delete order.orderCargoDetailList
        delete order.orderPriceList
        delete order.trayDetail
       let orderPriceList =  arrayTypeOne.concat(arrayTypeTwo)
       let orderCargoDetailList = arrayTypeThree

  
      let params = {
        order:order,
        orderPriceList:orderPriceList,
        orderCargoDetailList:orderCargoDetailList,
      }
     this.$http.post(this.$service.orderSaveOrder,params).then((data) => {
            if(data.code == 200){
              this.$message('保存成功')
              this.$router.push('/orderManagement/orderManage')
            } else {
              this.$message.error(data.message)
            }
      })
    },
    // 如果子组件中有空运费 输入计费重的时候同时修改子组件单价
    dealChildPrice(num){
      // 取到子组件typeOne
      let a = this.$refs.typeBill0[0].tableData
      
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
          for(let i in tempObj.arOrderPriceList){
           tempObj.arOrderPriceList[i].changeBillAddOne = false
          }
          this.isChangeJiaoDan = tempObj.financeStatus == 0 ||  tempObj.financeStatus == 4
          this.orderNo = tempObj.orderNo
          this.initData = tempObj 
          this.isDataDone = true
      }
    },
    // 客户发起对账
    async reconciliationClient(e){
      let {departureDate , fullLeg  ,orderNo ,waybillNo} = this.initData ;
      let userId = sessionStorage.getItem('userId')
      let  tempArray = []
      let  totalCny = 0
      if(e == 0){
        tempArray = this.$refs.typeBill0[0].tableData
        totalCny = this.$refs.typeBill0[0].totalCnyStr
      }else if(e == 1){
        tempArray = this.$refs.typeBill1[0].tableData
        totalCny = this.$refs.typeBill1[0].totalCnyStr
      }else if(e == 2){
        tempArray = this.$refs.typeBill2[0].tableData
        totalCny = this.$refs.typeBill2[0].totalCnyStr
      }else if(e == 3){
        tempArray = this.$refs.typeBill3[0].tableData
        totalCny = this.$refs.typeBill3[0].totalCnyStr
      }else if(e == 4){
        tempArray = this.$refs.typeBill4[0].tableData 
        totalCny = this.$refs.typeBill4[0].totalCnyStr
      }else if(e == 100){
        tempArray = this.$refs.typeNewBill.tableData 
        totalCny = this.$refs.typeNewBill.totalCnyStr
      }
      
      
      if(totalCny > 0){
        let params = {
          departureDate:departureDate,
          fullLeg:fullLeg,
          orderNo:orderNo,
          waybillNo:waybillNo,
          orderId:this.orderId ,
          userId:userId,
          prices:tempArray,
        }

        this.$http.post(this.$service.priceSendBill, params).then(res => {
              console.log(res)
            if (res.code == 200) {
             
              this.$router.push('/orderManagement/orderManage')
            }else{
              this.$message.error(res.message)
            }
          }).catch(err=>{
            console.log(err)
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
