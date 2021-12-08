<template>
  <div class="contont">
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
      <div class="common">
          <div>
            <span>订单号</span>
            <span>{{initData.orderNo}}</span>
          </div>
          <div>
            <span>起运港 </span>
            <span></span>
          </div>
          <div>
            <span>航司 </span>
            <span>CK</span>
          </div> 
          <div>
            <span>单价 </span>
            <span>￥34/kg</span>
          </div>
          <div class="flex">
            <span>运单号 </span>
            <span> <el-input v-model="orderNo" size="mini" placeholder="请输入内容"></el-input> </span>
          </div>
          <div>
            <span>目的港  </span>
            <span> ICN</span>  
          </div>
          <div>
            <span>日期  </span>
            <span>2021-10-29</span>
          </div>
          <div>
            <span>利润 </span>
            <span>￥400</span>
          </div>
          <div>
            <span>客    户 </span>
            <span>苏州乐尚代理有限公司</span>
          </div>
          <div>
            <span>代   理</span>
            <span>上海维达货运公司</span>
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
      <div >
        <orderAriMessage  v-show="radio1=='1'"/>
        <billOrder  v-show="radio1=='2'"/>
      </div>

  </div>
</template>
<script>
import orderAriMessage from './components/orderAriMessage.vue'
import billOrder from './components/billOrder.vue'
export default {
  data() {
    return {
      input: '',
      radio1:'1',
      orderNo:'',// 运单号
      orderId:'',// 账单id
      preSaleList:[] ,// 售前客服初始数组
      pscsId:'', // 售前客服id
      onSaleList:[] ,// 售中客服初始数组
      mscsId:"",// 售中客服id
      airLineList:[] ,// 航线负责人初始数组
      principalId:'', // 航线负责人ID
      initData:{}, // 初始化返回对象
    };
  },
  async created(){
    this.orderId = this.$route.query.id
    await this.initSysSetTing()
    await this.getOriganData()
  },
  components:{
    orderAriMessage,
    billOrder
  },
  methods:{
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
      console.log(res)
      if(res.code == 200){
        this.initData = res.data
      }
    }
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
</style>



