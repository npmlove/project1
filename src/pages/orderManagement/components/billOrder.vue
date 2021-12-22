<template>
  <div class="contont">
    <div>
      <h1 class="title flex">
          <span>{{title}}</span> 
          <span class="calcSome"><span>原币合计{{totalOrgnStr}}</span><span>人民币合计:{{totalCnyStr}}</span></span> 
          </h1>
        <el-table
          :data="tableData"
          border
          stripe
          size='small'
          class="inData"
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            >
          </el-table-column>
          <el-table-column
            label="费用名称"
            >
            <template slot-scope="scope">
                <el-select v-model="scope.row.expenseName" :disabled="scope.row.ingStatic"  placeholder="请选择">
                  <el-option
                    v-for="item in  expenseCodeOpt "
                    :key="item.sortNo"
                    :label="item.label"
                    :value="item.expenseName">
                  </el-option>
                </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="付款单位"
            >
            <template slot-scope="scope">
                <el-input size="small" :disabled="scope.row.ingStatic" v-model="scope.row.expenseUnitName" clearable></el-input>    
            </template>
          </el-table-column>
          <el-table-column
            label="数量">
            <template slot-scope="scope">
                <el-input size="small" :disabled="scope.row.ingStatic" v-model="scope.row.quantity" clearable></el-input>    
            </template>
          </el-table-column>
          <el-table-column
            label="单价">
            <template slot-scope="scope">
                <el-input size="small" :disabled="scope.row.ingStatic" v-model="scope.row.price" clearable></el-input>    
            </template>
          </el-table-column>
          <el-table-column
            label="币种">
            <template slot-scope="scope">
                <el-select v-model="scope.row.currency" :disabled="scope.row.ingStatic"   placeholder="请选择">
                  <el-option
                    v-for="item in moneyList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="totalOrgn"
            label="原币合计">
          </el-table-column>
          <el-table-column
            prop="exchangeRate"
            label="汇率">
          </el-table-column>
          <el-table-column
            prop="totalCny"
            label="人民币合计">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <div >
                <span @click="deleOneTableObj(scope)" >删除</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="备注">
            <template slot-scope="scope">
                <el-input size="small"  v-model="scope.row.remark" clearable></el-input>    
            </template>
          </el-table-column>
        </el-table>
    </div>
    <div class="ccc"></div>
  </div>
</template>
<script>
  import {toData} from '@/util/assist'
// expenseName      费用名称
// expenseType      费用类型 1=应收 2=应付
//  expenseUnitId   费用源单位id
// expenseUnitName  费用源单位名称
//  price           单价
//  quantity        数量
// remark           备注
// totalCny         人民币合计
// totalOrgn        原币合计
// currency         币种
// exchangeRate     汇率
// ingStatic        修改当前数据状态 主要是为了初始化第一条数据

class tableObj{
  constructor(expenseName , expenseUnitName , quantity, price , currency  , exchangeRate = 1, remark, ingStatic = false,){
    this.expenseName = expenseName
    this.expenseUnitName = expenseUnitName
    this.price = price
    this.quantity = quantity
    this.currency = currency
    this.exchangeRate = exchangeRate
    this.remark = remark
    this.ingStatic = ingStatic
    this.totalOrgn = this.countTotalOrgn()
    this.totalCny = this.countTotalCny()
  }
  countTotalOrgn(){
    return isNaN(Number(this.quantity) * Number(this.price)) ? '' : Number(this.quantity) * Number(this.price)
  }
  countTotalCny(){
    return  isNaN(Number(this.quantity) * Number(this.price) * Number(this.exchangeRate)) ? '' : Number(this.quantity) * Number(this.price)  * Number(this.exchangeRate) 
    // 
  }
}
export default {
  props:['orderIdTemp','orderNoTemp','getList'],
  data() {
    return {
      tableData: [], // 
      title:'',
      expenseType:1,
      expenseUnitName:'',
      billId:0,
      orderIdTemp:'',
      orderNoTemp:'',
      orderId:''  ,// 订单id
      orderNo:'',//
      rates:[], // 汇率数组
      expenseCodeOpt:[] ,// 选择费用 
      totalOrgnArr:[],// 原币合并数组
      totalOrgnStr:'',// 原币合并字符串
      totalCnyStr:"",//人民币合计字符串
      moneyList:[{
        value: 1,
        label: 'CNY',
        symbol:'￥'
      }, {
        value: 2,
        label: '港币',
        symbol:"HK$"
      }, {
        value: 3,
        label: '美元',
        symbol:'$'
      }, {
        value: 4,
        label: '欧元',
        symbol:'€'
      }, {
        value: 5,
        label: '英镑',
        symbol:'￡',
      }]
    };
  },
  async mounted(){
    // 初始化table prop
    if(this.orderNoTemp == undefined){
      let a = this.getList

      let {orderId,expenseType,orderNo,expenseUnitName,billId} = a[0]
        a.map((res)=>{
            res.ingStatic = true
            delete res.createTime
            delete res.updateTime
        })
      this.tableData = a
      this.orderId = orderId
      this.expenseType = expenseType
      this.orderNo = orderNo
      this.expenseUnitName = expenseUnitName
      this.billId = billId
      this.title =  expenseType == 1 ? '应收账单' : '应付账单'
      this.dealOriginData(a)

    }else{
      this.orderId = this.orderIdTemp
      this.orderNo = this.orderNoTemp
      this.addOneTableObj()
    }
    await this.getRates()
    await this.initExpenseCode()
    
   

  },
  watch:{
    tableData:{
      deep:true,
      handler(newValue){
          for(let i in newValue){
            newValue[i].exchangeRate =  this.getCurrentRate(newValue[i].currency) 
            newValue[i].totalOrgn = Math.floor((isNaN(Number(newValue[i].quantity) * Number(newValue[i].price)) ? '' : Number(newValue[i].quantity) * Number(newValue[i].price)) * 100) /100 
            newValue[i].totalCny =  Math.floor(( isNaN(Number(newValue[i].quantity) * Number(newValue[i].price) * this.getCurrentRate(newValue[i].currency)) ? '' : Number(newValue[i].quantity) * Number(newValue[i].price)  * this.getCurrentRate(newValue[i].currency) )*100)/100
            console.log(this.getCurrentRate(newValue[i].currency))
         }
            this.totalCnyStr =this.calcTotalCny(newValue)
            let {temArray,tempStr} =  this.calcTotalOrgn(newValue)
            this.totalOrgnArr = temArray
            this.totalOrgnStr = tempStr
      }
    }
  },
  methods:{
    // 处理原始传入数据
    dealOriginData(newValue){
        for(let i in newValue){
          newValue[i].exchangeRate =  this.getCurrentRate(newValue[i].currency) 
          newValue[i].totalOrgn = Math.floor((isNaN(Number(newValue[i].quantity) * Number(newValue[i].price)) ? '' : Number(newValue[i].quantity) * Number(newValue[i].price)) * 100) /100 
          newValue[i].totalCny =  Math.floor(( isNaN(Number(newValue[i].quantity) * Number(newValue[i].price) *this.getCurrentRate(newValue[i].currency)) ? '' : Number(newValue[i].quantity) * Number(newValue[i].price)  * this.getCurrentRate(newValue[i].currency) )*100)/100
        }
        this.totalCnyStr =this.calcTotalCny(newValue)
        let {temArray,tempStr} =  this.calcTotalOrgn(newValue)
        this.totalOrgnArr = temArray
        this.totalOrgnStr = tempStr
     
  
    },
    async getRates(){ // 获取当前订单的汇率
      let res = await this.$http.get(this.$service.getExchangeRatesForOrder+'?orderId='+this.orderId)
      if(res.code == 200){
        this.rates = res.data 
      }
    },
    // 获取指定币种的汇率
     getCurrentRate(a){

      let tempArray = this.rates
      for(let i in tempArray){
        if(i == a){
          return tempArray[i]
        }
      }
    },

    //费用名称 除了空运费
    async  initExpenseCode() {
        var json = {
          pageSize: 50000,
        }
        json = toData(json)
        this.$http.get(this.$service.expenseSearchExcludeAirFee+'?'+json).then((data) => {
          if(data.code == 200){
            this.expenseCodeOpt = data.data.records
          }
        })
      },

    // 计算人民币合计
    calcTotalCny(array){
      return  array.reduce((total, cur) => { return total += cur.totalCny}, 0);
    },
    // 计算原币合计
    calcTotalOrgn(arr){
  　　var map = {},dest = [];
  　　for(var i = 0; i < arr.length; i++){
  　　　　var ai = arr[i];
  　　　　if(!map[ai.currency]){
            let symbol = ''
            if(ai.currency == 1){
              symbol = '￥'
            }else if(ai.currency == 2){
              symbol = 'HK$'
            }else if(ai.currency == 3){
              symbol = '$'
            }else if(ai.currency == 4){
              symbol = '€'
            }else if(ai.currency == 5){
              symbol = '￡'
            }

  　　　　　　dest.push({
                currency:ai.currency,
                symbol:symbol,
                totalOrgn:ai.totalOrgn
  　　　　　　});
  　　　　　　map[ai.currency] = ai;
  　　　　}else{
  　　　　　　for(var j = 0; j < dest.length; j++){
  　　　　　　　　var dj = dest[j];
  　　　　　　　　if(dj.currency == ai.currency){
  　　　　　　　　　　dj.totalOrgn +=   ai.totalOrgn
  　　　　　　　　　　break;
  　　　　　　　　}
  　　　　　　}
  　　　　}
  　　};
    let str = ''
    for(let i in dest){
          str += dest[i].symbol +  dest[i].totalOrgn + '+'
        }
    return {temArray : dest,tempStr:str.substr(0, str.length - 1)}
    },
    // 添加
    addOneTableObj(){
      let tempObj = new tableObj('',this.expenseUnitName)

      let a = Object.assign({},tempObj,{
        orderId:this.orderId,
        expenseType:this.expenseType,
        orderNo:this.orderNo,
        billId:this.billId}
      )
      console.log(a)
      this.tableData.push(a)
    },
    // 删除
    deleOneTableObj(e){
      let index = e.$index
      let ttt = this.$parent.judgeDeleteBIll()
      if(ttt){
        this.$message({
          message: '交单时不允许删除',
          type: 'warning'
        });
      }else{
      if(index == 0){
        this.$message({
          message: '这条数据不能删除',
          type: 'warning'
        });
      }else{
        this.tableData.splice(index,1)
      }
      }

    },
  }  
}
</script>
<style scoped>

.contont{

  margin: 0 20px;
  padding: 20px 0;
}
.title{
  font-size: 20px;
  font-weight: 800;
  display: flex;
  justify-content: space-between;
}
.inData{
  margin-top: 10px;
}
.operate{
  margin-top: 20px;
  display: flex; 
}
.calcSome{
  font-size: 16px;
  
  color: rgb(213,49,22);
}
.calcSome>span:nth-child(1){
  margin-right: 100px;
}
</style>