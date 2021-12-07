<template>
  <div class="contont">
    <div>
      <h1 class="title">应收账单</h1>
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
                <el-input size="small" :disabled="scope.row.ingStatic" v-model="scope.row.expenseName" clearable></el-input>    
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
            label="币种">
            <template slot-scope="scope">
                <el-select v-model="scope.row.currency" :disabled="scope.row.ingStatic"  placeholder="请选择">
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
            prop="remark"
            label="备注">
          </el-table-column>
        </el-table>
         <div class="operate">
            <el-button  style="width:200px"  @click="addOneTableObj()"  >新增</el-button>
            <el-button  style="width:200px" type="primary" >发起客户对账</el-button>
         </div>
        <div class="line"></div>



    </div>
    <div class="ccc"></div>
  </div>
</template>
<script>
import {moneyList} from './../../../util/util'
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
  constructor(expenseName , expenseUnitName , quantity, price , currency  , exchangeRate = 1, remark, ingStatic = false){
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
    console.log(this.exchangeRate)
    return isNaN(Number(this.quantity) * Number(this.price) * Number(this.exchangeRate)) ? '' : Number(this.quantity) * Number(this.price) * Number(this.exchangeRate) 
  }
}
export default {
  data() {
    return {
      tableData: [], // 应收
      moneyList:moneyList
    };
  },
  async mounted(){
    // 初始化table 
    await this.initTabelData()
  },
  methods:{
    async initTabelData(){
      let tempObj = new tableObj('空运费','苏州乐尚代理有限公司','37.5','200','1','1','',true)
    
      this.tableData.push(tempObj)
    
    },
    // 应收
    addOneTableObj(){
      let tempObj = new tableObj()
      this.tableData.push(tempObj)
    },
    
    deleOneTableObj(e){
      let index = e.$index
      console.log(index)
      if(index == 0){
        this.$message({
          message: '第一条数据不能删除',
          type: 'warning'
        });
      }else{
        this.tableData.splice(index,1)
      }
    },
    // 应付
    addOneTableObjTwo(){
      let tempObj = new tableObj()
      this.tableDataTwo.push(tempObj)
    },
  }  
}
</script>
<style scoped>
.ccc{
  height: 60vh;

}
.contont{
  height: 100vh;
  margin: 0 20px;
  padding: 20px 0;
}
.title{
  font-size: 20px;
  font-weight: 800;
}
.inData{
  margin-top: 10px;
}
.operate{
  margin-top: 20px;
  display: flex;
  justify-content: end;
}
.line{
  width: 100%;
  margin: 20px 0;
  /* background: #000; */
  border: 1px dashed black;
}
</style>