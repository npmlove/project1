<template>
  <div class="content-wrapper">
    <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
      <el-form-item label="订单号">
        <el-autocomplete
          class="inline-input"
          v-model="formInline.orderNo"
          :fetch-suggestions="querySearch"
          placeholder="请输入订单号"
          :trigger-on-focus="false" >
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="运单号">
        <el-autocomplete
          class="inline-input"
          v-model="formInline.waybillNo"
          :fetch-suggestions="querySearch"
          placeholder="请输入订单号"
          :trigger-on-focus="false" >
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="应付对象">
        <el-input v-model="formInline.customerName" placeholder="请输入应付对象"></el-input>
      </el-form-item>
      <el-form-item label="订舱公司">
        <el-select
          v-model="formInline.pod"
          filterable
          remote
          reserve-keyword
          placeholder="请输入订舱公司名称"
          :remote-method="remoteMethodFour">
          <el-option
            v-for="item in optionFour"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="代理上家">
        <el-select
          v-model="formInline.agentName"
          filterable
          remote
          reserve-keyword
          placeholder="请输入订舱代理上家"
          :remote-method="remoteMethod">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="下单日期">
         <el-date-picker
          v-model="formInline.startOrderTime"
          type="date"
          :value-format='formatDate'
          placeholder="开始">
        </el-date-picker>-
        <el-date-picker
          v-model="formInline.endOrderTime"
          type="date"
          :value-format='formatDate'
          placeholder="结束">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="航班日期">
         <el-date-picker
          v-model="formInline.startDepartureDate"
          type="date"
          :value-format='formatDate'
          placeholder="开始">
        </el-date-picker>-
        <el-date-picker
          v-model="formInline.endDepartureDate"
          type="date"
          :value-format='formatDate'
          placeholder="结束">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="起运港">
        <el-select
          v-model="formInline.pol"
          filterable
          remote
          reserve-keyword
          placeholder="请输入起运港"
          :remote-method="remoteMethodTwo">
          <el-option
            v-for="item in optionTwo"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目的港">
        <el-select
          v-model="formInline.pod"
          filterable
          remote
          reserve-keyword
          placeholder="请输入目的港"
          :remote-method="remoteMethodThree">
          <el-option
            v-for="item in optionThree"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="结算方式">
        <el-select v-model="formInline.payWay" placeholder="请选择">
          <el-option
            v-for="item in payWayArray"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="核销状态">
        <el-select v-model="formInline.payWriteOffStatus" placeholder="请选择">
          <el-option
            v-for="item in payWriteOffStatusArray"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="售前客服">
        <el-select v-model="formInline.pscsId" placeholder="请选择">
          <el-option
            v-for="item in preSaleList"
            :key="item.id"
            :label="item.loginName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="航线负责人">
        <el-select v-model="formInline.principalId" placeholder="请选择">
          <el-option
            v-for="item in airLineList"
            :key="item.id"
            :label="item.loginName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="售中客服">
        <el-select v-model="formInline.mscsId" placeholder="请选择">
          <el-option
            v-for="item in onSaleList"
            :key="item.id"
            :label="item.loginName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="primary" @click="clearAllData">清空</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :span="12">
          <el-radio-group v-model="woStatus" size="small" @change="radioEvent" >
              <el-radio-button  label= '0' >可操作({{(countAuth)}})</el-radio-button>
              <el-radio-button label= '1'>业务修改中({{countNoAuth}})</el-radio-button>
              <el-radio-button label= '2'>异常({{(countErr)}})</el-radio-button>
          </el-radio-group>
      </el-col>
      <el-col :span="12">
          <el-button size="small" @click="fatherReconciliation">对账</el-button>
          <el-button size="small" @click="fatherVerification">核销</el-button>
          <el-button size="small" @click="exportBillList">导出列表</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      border='true'
      stripe
      max-height="600"
      ref="multipleTable"
      @select='clckOne'
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        fixed
        :index="indexMethod">
      </el-table-column>
      <el-table-column
        type="selection"
        fixed
        width="55">
      </el-table-column>
      <el-table-column
        prop="orderNo"
        label="订单号"
        width="140">
      </el-table-column>
      <el-table-column
        prop="waybillNo"
        label="运单号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="expenseUnitName"
        label="应收对象"
        width="250">
      </el-table-column>
      <el-table-column
        prop="departureDate"
        label="航班日期"
        width="100">
      </el-table-column>
      <el-table-column
        prop="presentationTime"
        label="交单时间"
        width="100">
      </el-table-column>
      <el-table-column
        label="应收金额"
        width="200">
        <el-table-column
          prop="totalArCny"
          label="人民币"
          width="100">
        </el-table-column>
        <el-table-column
          prop="totalApOrgn.amount"
          label="原币"
          width="100">
        </el-table-column>
      </el-table-column>
      <el-table-column
        prop="payCheckAmount"
        label="已对账金额"
        width="100">
      </el-table-column>
      <el-table-column
        prop="unreconciledAmount"
        label="未对账金额"
        width="100">
      </el-table-column>
      <el-table-column
        label="已核销金额"
        width="200">
        <el-table-column
          prop="payWriteOffAmountRmb"
          label="人民币"
          width="100">
        </el-table-column>
        <el-table-column
          prop="exchangeRate"
          label="原币"
          width="100">
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="未核销金额"
        width="200">
        <el-table-column
          prop="unwrittenOffAmountRmb"
          label="人民币"
          width="100">
        </el-table-column>
        <el-table-column
          prop="unwrittenOffAmount"
          label="原币"
          width="100">
        </el-table-column>
      </el-table-column>
      <el-table-column
        prop="totalApCny"
        label="应付总金额"
        width="100">
      </el-table-column>
      <el-table-column
        prop="orderProfit"
        label="利润"
        width="100">
      </el-table-column>
      <el-table-column
        prop="exchangeRate"
        label="汇率"
        width="100">
      </el-table-column>
      <el-table-column
        label="结算方式"
        width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.payWay == 0">付款</span>
          <span v-if="scope.row.payWay == 1">月结</span>
        </template>
      </el-table-column>
      <el-table-column
        label="核销次数"
        width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.payWriteOffCount > 0" style="cursor:pointer;color:rgb(97,180,120)" @click="recordsBtn(scope.row)">{{scope.row.payWriteOffCount}}</span>
          <span v-else >{{scope.row.payWriteOffCount}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="核销状态"
        width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.payWriteOffStatus == 0">未核销</span>
          <span v-if="scope.row.payWriteOffStatus == 1">已核销</span>
          <span v-if="scope.row.payWriteOffStatus == 2">部分核销</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer">
      <div>
        <el-button  :type= slectAllDataButtonType @click="slectAllData">跨页全选</el-button>
        <el-button  :type= computedDataType @click="calcSlectData">数据统计</el-button>
      </div>
      <div>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total,  prev, pager, next, jumper"
          :total="pageTotal">
        </el-pagination>
      </div>
    </div>
    <div v-show="computedDataStatic" class="calcDataContont" >
          <span>应付总金额{{dataStaticObj.totalApCny}}</span>
          <span>应付已核销总金额{{dataStaticObj.totalApWoCny}}</span>
          <span >
              <span>应付未核销总金额</span>
              <span class="fon" v-for="(item,index) in dataStaticObj.totalApWoOrgn" :key="index">               
                  <span v-if="item.currency == 1"> {{item.amount}}CNY</span>
                  <span v-if="item.currency == 2"> {{item.amount}}港币</span>
                  <span v-if="item.currency == 3"> {{item.amount}}美元</span>
                  <span v-if="item.currency == 4"> {{item.amount}}欧元</span>
                  <span v-if="item.currency == 5"> {{item.amount}}英镑</span> 
              </span>
            </span>    
          <span >
            <span>应付原币</span>
            <span class="fon" v-for='(item,index) in dataStaticObj.totalApOrgn' :key="index">
                  <span v-if="item.currency == 1"> {{item.amount}}CNY</span>
                  <span v-if="item.currency == 2"> {{item.amount}}港币</span>
                  <span v-if="item.currency == 3"> {{item.amount}}美元</span>
                  <span v-if="item.currency == 4"> {{item.amount}}欧元</span>
                  <span v-if="item.currency == 5"> {{item.amount}}英镑</span> 
            </span>
          </span>
          <span>应付已核销原币{{dataStaticObj.totalApUnwoCny}}</span>
          <span  >
            <span>应付未核销</span>
            <span class="fon" v-for='(item,index) in dataStaticObj.totalApUnwoOrgn' :key="index">
                  <span v-if="item.currency == 1"> {{item.amount}}CNY</span>
                  <span v-if="item.currency == 2"> {{item.amount}}港币</span>
                  <span v-if="item.currency == 3"> {{item.amount}}美元</span>
                  <span v-if="item.currency == 4"> {{item.amount}}欧元</span>
                  <span v-if="item.currency == 5"> {{item.amount}}英镑</span> 
            </span>
          </span>  
    </div>
    <!-- 对账模态框组件 -->
    <reconciliation @farhersearch='onSubmit' :multipleselection= childPropsData ref="reconciliationData"/> 
    <!-- 核销模态框组件 -->
    <verification  @farhersearch2='onSubmit' :multipleselection= verificationData ref="verificationData" />
    <!-- 点击核销次数模态框 -->
    <el-dialog
      title="应付核销操作记录"
      :visible.sync="payWriteOffCountBoolen"
      width="60%"
      :before-close="handleClose">
      <div class="diaModalClass">
        <el-table
          :data="payWriteOffCountData"
          >
          <el-table-column
            type="index"
            label="序号"
            fixed
            :index="indexMethod">
          </el-table-column>
          <el-table-column
            prop="orderNo"
            label="订单号"
            width="140">
          </el-table-column>
          <el-table-column
            prop="waybillNo"
            label="运单号"
            width="100">
          </el-table-column>
          <el-table-column
            prop="expenseUnitName"
            label="应收对象"
            width="250">
          </el-table-column>
          <el-table-column
            prop="totalArCny"
            label="应付金额"
            width="100">
          </el-table-column>
          <el-table-column
            label="记录"
            width="500">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.tempObj" :key="index">
                <div v-if="item.status == 0 || item.status == -1">
                  {{`操作${index + 1}:${item.accountName} `}}
                  <span class="text_color_blue"  >{{item.payCheckAmount > 0 ? "对账" : '核销'}}</span>
                  该订单，对账金额：
                  <span v-if="item.currency == 1"> {{item.writeOffAmount}}CNY</span>
                  <span v-if="item.currency == 2"> {{item.writeOffAmount}}港币</span>
                  <span v-if="item.currency == 3"> {{item.writeOffAmount}}美元</span>
                  <span v-if="item.currency == 4"> {{item.writeOffAmount}}欧元</span>
                  <span v-if="item.currency == 5"> {{item.writeOffAmount}}英镑</span> 
                {{item.writeOffTime}}
                </div>
                <div v-if='item.status == 2'>
                    {{`操作${index + 1}:${item.accountName} `}}撤销了
                    <span style="margin-left:100px">{{item.writeOffTime}}</span>
                </div>
                

              </div>
            </template>
          </el-table-column>

          <el-table-column      
            label="操作">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.tempObj" :key="index">
                <div>
                    <span class="text_color_blue"  @click="cheXiao(index)">{{item.status == 0 ? '撤销' : ''}}</span>
                    <span >{{item.status == -1 ? '已撤销' : ''}}</span>
                    <span class="opacity" v-show="item.status == 2" >ceshi</span>
                </div>
              </div>    
            </template>        
          </el-table-column>
        </el-table>
      </div>

    </el-dialog>
  </div>
</template>

<script>

import reconciliation from './components/reconciliation.vue'
import verification from './components/verification.vue'
import {exportFile} from '../../util/util'
  export default {
    data() {
      return {   
        formInline: {
          orderNo:'',
          waybillNo:'',
          customerName:'',
          airCompanyCode:'',
          agentName:'',
          startDepartureDate:'',
          endDepartureDate:'',
          startOrderTime:'',
          endOrderTime:'',
          pol:"",
          pod:"",
          payWay:'',
          payWriteOffStatus:'',
          pscsId:'',
          principalId:'',
          mscsId:'',
        },
        payWayArray:[{
          value: '',
          label: '全部'
        }, {
          value: '0',
          label: '付款买单'
        }, {
          value: '1',
          label: '月结'
        }],
        payWriteOffStatusArray:[{
          value: '',
          label: '全部'
        }, {
          value: '0',
          label: '未对账'
        }, {
          value: '1',
          label: '部分对账'
        }, {
          value: '2',
          label: '已对账'
        }, {
          value: '4',
          label: '部分对账部分核销'
        }, {
          value: '5',
          label: '已对账部分核销'
        }, {
          value: '8',
          label: '已对账已核销'
        }],
        payWriteOffCountBoolen:false,// 点击核销次数 控制模态框的显示
        payWriteOffCountData:[],// 模态框展示的数据
        payWriteOffCountIds:'',//
        woStatus:0,// 正常0，业务修改中1，异常2
        tableData: [],
        slectAllDataArray:[],// 全选后返回的所在状态下的数据 不展示
        dataStaticObj:{},// 数据统计对象
        countAuth:"",// 可操作数量
        countErr:'',// 异常数量
        countNoAuth:'',//业务修改中数量
        formatDate:"yyyy-MM-dd",
        currentPage:1, // 分页当前页默认1
        pageSize:10,//分页每页数据量默认10
        pageTotal:100,// 分页总数据量
        slectAllDataStatic:false,// 跨页全选的状态 默认false
        slectAllDataButtonType:"",// 跨页全选 点击与不点击之后的样式改变
        computedDataType:'',// 数据统计样式改变
        computedDataStatic:false,// 数据统计样式改变
        multipleSelection:[],// 单选的数组,
        childPropsData:[], //  传入对账子组件的数组
        childBoolen:false, // 子组件是否引入 
        preSaleList:[],// 售前客服数组
        onSaleList:[],// 售中客服数组
        airLineList:[],// 航线负责人数组
        options:[], //
        optionTwo:[], //
        optionThree:[],//
        optionFour:[],//
        verificationData:[],// 传递给核销组件的数据

      }
    },
    async mounted() {
      await this.onSubmit()
      await this.getSysInitial()
      await this.radioEvent(0,false)
    },
    components:{
      reconciliation,
      verification
    },
    methods: {
      // 撤销
      async cheXiao(e){
        let { id } = this.payWriteOffCountData[0].tempObj[e]
        console.log()
        
        this.$confirm(`确认撤销 “操作${e+1}” 吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            let res = await this.$http.post(this.$service.revokeRecords + '?id=' + id)
            console.log(res)
            if(res.code == 200){
              let res1 = await this.$http.post(this.$service.searchRecords,{ids:e.ids})
               this.payWriteOffCountData[0].tempObj = res1.data
              this.$message({
              type: 'success',
              message: '撤销成功!'
            });
            }
            
          }).catch(() => {
            
         
        });
      },
      handleClose(){
         this.payWriteOffCountData = []
         this.payWriteOffCountBoolen = false
         this.payWriteOffCountIds = ''
      },
      async recordsBtn(e){
        console.log(e)
        this.payWriteOffCountIds = e.ids
        this.payWriteOffCountData.push(e)
        let res = await this.$http.post(this.$service.searchRecords,{ids:e.ids})
        if(res.code == 200){
          this.payWriteOffCountData[0].tempObj = res.data
          this.payWriteOffCountBoolen = true
        }
       
      },
      // 导出列表
      async exportBillList(){
        let {slectAllDataStatic , formInline , woStatus , multipleSelection } = this  ;
        if(slectAllDataStatic){
          let params = Object.assign({},formInline,{woStatus,woStatus})
          let res = await this.$http.post(this.$service.billExportExcel,params)
          exportFile(res,"application/vnd.ms-excel",'应付统计')
        }else{
          if(multipleSelection.length>0){
            let idArray  =  multipleSelection.map((e)=>{
              return e.ids
            })
            let params = {
              ids:idArray,
              woStatus:woStatus,
            }
            let res = await this.$http.post(this.$service.billExportExcel,params)
            exportFile(res,"application/vnd.ms-excel",'应付统计')
          }else{
            this.$message({
                message: '请先选择数据',
                type: 'warning'
            });
          }
        }
      },
      async radioEvent(e,initBoolen=true){
        this.woStatus = e
        let { formInline, currentPage, woStatus,slectAllDataStatic, countAuth,countErr,countNoAuth} = this
        let tempTotal = ''
        if(e == 0){
          tempTotal =countAuth
        }else if(e == 1){
          tempTotal = countNoAuth
        }else if(e == 2){
          tempTotal = countErr
        }
        let params = Object.assign({},formInline,{pageNum:currentPage,woStatus:woStatus},{pageSize:tempTotal})
        this.$http.post(this.$service.dataStatistics,params).then(res=>{
          if(res.code ==200){
            let tempObj = res.data
            tempObj.totalApUnwoOrgn = JSON.parse(tempObj.totalApUnwoOrgn)
            tempObj.totalApOrgn = JSON.parse(tempObj.totalApOrgn)
            tempObj.totalApWoOrgn = JSON.parse(tempObj.totalApWoOrgn)
            this.dataStaticObj = tempObj
          }
        })
        if(initBoolen){
          await this.getTabelData(formInline,currentPage,woStatus,slectAllDataStatic,tempTotal)
        } 
      },
      // 输入代理上家的时候返回值
      async remoteMethod(e){
        if (e !== '') {
          let res =  await this.$http.post(this.$service.agentList,{agentName:e})
          this.options = res.data.records.map((item)=>{
            return {value:item.agentName, label: item.agentName}
          })
        } else {
          this.options = [];
        }
      },
      // 输入起始港的时候返回值
      async remoteMethodTwo(e){
        if(e !== ''){
            let res = await this.$http.get(this.$service.airportSearchByPage+`?keyWord=${e}`)
            this.optionTwo = res.data.records.map((item)=>{
            return {value:item.name, label: item.name}
          })
        }else{
          this.optionTwo =[]
        }
      },
      // 输入目的港的时候返回值
      async remoteMethodThree(e){
        if(e !== ''){
            let res = await this.$http.get(this.$service.airportSearchByPage+`?keyWord=${e}`)
            this.optionThree = res.data.records.map((item)=>{
            return {value:item.name, label: item.name}
          })
        }else{
          this.optionThree =[]
        }
      },
      // 输入航司的时候返回值
      async remoteMethodFour(e){
        if(e !== ''){
            let res = await this.$http.get(this.$service.companySearchByPage+`?keyWord=${e}`)
            this.optionFour = res.data.records.map((item)=>{
            return {value:item.name, label: item.name}
          })
        }else{
          this.optionFour =[]
        }
      },
      // 获取搜索条件当中的原始值
      async getSysInitial(){
        let res1 = await this.$http.get(this.$service.userSearch+'?roleName=售前客服&pageSize=50000')
        let res2 = await this.$http.get(this.$service.userSearch+'?roleName=售中客服&pageSize=50000')
        let res3 = await this.$http.get(this.$service.userSearch+'?roleName=航线负责人&pageSize=50000')
        Promise.all([res1,res2,res3]).then(res=>{
          this.preSaleList = res[0].data.records
          this.onSaleList = res[1].data.records
          this.airLineList = res[2].data.records
        })
      },
      async onSubmit() {
        let { formInline, currentPage, woStatus,slectAllDataStatic} = this ;
        await this.getTabelData(formInline,currentPage,woStatus,slectAllDataStatic)
      },
      async handleCurrentChange(e){
        let { formInline, woStatus,slectAllDataStatic} = this ;
        this.currentPage = e 
        await this.getTabelData(formInline,e,woStatus,slectAllDataStatic)
      },
      // 点击对账
      fatherReconciliation(){
        let tempArray = this.multipleSelection
        if(tempArray.length >= 1){
          let tempString = tempArray[0].expenseUnitName
          let a = tempArray.filter((i)=>{
            if(i.expenseUnitName ==  tempString){
              return i
            }
          })
          if(tempArray.length !== a.length){
              this.$message({
                showClose: true,
                message: '应付对象不一致，请重新勾选',
                type: 'warning'
              });
          }else{
            this.childPropsData = tempArray
            this.$refs.reconciliationData.showModal()
          }
        }else if(tempArray.length == 0){
          this.$message({
            showClose: true,
            message: '请先勾选一条数据',
            type: 'warning'
          });
            return ;
        }
      },
      // 核销
      fatherVerification(){
        let tempArray = this.multipleSelection
        if(tempArray.length >= 1){
          let tempString = tempArray[0].expenseUnitName
          let a = tempArray.filter((i)=>{
            if(i.expenseUnitName ==  tempString){
              return i
            }
          })
          if(tempArray.length !== a.length){
              this.$message({
                showClose: true,
                message: '应付对象不一致，请重新勾选',
                type: 'warning'
              });
          }else{
            this.verificationData = tempArray
            this.$refs.verificationData.showModal()
          }
        }else if(tempArray.length == 0){
          this.$message({
            showClose: true,
            message: '请先勾选一条数据',
            type: 'warning'
          });
            return ;
        }
      },
      // 单选数据
      async clckOne(selection, row){
        this.multipleSelection = selection
      },

      // 跨页全选
      async slectAllData(){
        this.slectAllDataStatic = !this.slectAllDataStatic
        this.slectAllDataButtonType = this.slectAllDataStatic == false ? '' : 'primary'
        let { formInline, currentPage, woStatus,slectAllDataStatic, pageTotal} = this
        if(this.slectAllDataStatic){
          await this.getTabelData(formInline, currentPage, woStatus,slectAllDataStatic, pageTotal)
        }else{
          await this.getTabelData(formInline, currentPage, woStatus,slectAllDataStatic)
        }
        
      },
      // 数据统计
      async calcSlectData(){
        this.computedDataStatic = !this.computedDataStatic
        this.computedDataType = this.computedDataStatic == false ? '' : 'primary'
      },
      // 默认处理tableData是否全选 
     async dealSelectAll(e){
        this.tableData.forEach((item)=>{
            this.$refs.multipleTable.toggleRowSelection(item,e)
        }) 
     },
      // 处理input的输入选择
      querySearch(q,cb){
        let tempQuery = []
        let arrayt = []
        q =  q.replace(/，/ig,',').replace(/\s/ig,',').replace(/\//g,',').replace(/-/ig,'')
        if(q.charAt(q.length - 1) == ','){
          q = q.slice(0,q.length - 1)
        }
        if(q.indexOf(',')){
          tempQuery = q.split(",")
        }else{
          tempQuery[0] = q
        }
        for(let i in tempQuery){
          let newobj = {}
          newobj.value = tempQuery[i]
          newobj.label = tempQuery[i]
          arrayt.push(newobj)
        }
        cb(arrayt)
      },
      // 获取tabel数据
      async  getTabelData(formInline,currentPage,woStatus,slectAllDataStatic=false,pageSize=10){
        let tempObj = Object.assign({},formInline,{pageNum:currentPage,woStatus:woStatus},{pageSize:pageSize})
        try {
          let res = await this.$http.post(this.$service.searchWoByPageBill,tempObj)
          if(res.code == 200){
            let resData = res.data.page ;
            this.countNoAuth = res.data.countNoAuth
            this.countAuth = res.data.countAuth
            this.countErr = res.data.countErr
            if(this.woStatus == 1){
              this.pageTotal = res.data.countNoAuth
            }else if(this.woStatus == 2){
              this.pageTotal = res.data.countErr
            }else{
              this.pageTotal = res.data.countAuth
            }
            if(pageSize != 10){
              this.slectAllDataArray = resData.records
            }else {
              this.tableData = resData.records
            }
            
            setTimeout(async()=>{
               await this.dealSelectAll(slectAllDataStatic) 
            },0)
          }
        } catch (error) {
          console.log(error)
        }
      },
    },
  }
</script>

<style scoped>
.content-wrapper{
  margin: 20px;
}
.footer{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}
.calcDataContont{
  margin-bottom: 10px;
  display: flex;
  
 
}
.text_color_blue{
    color: #62a0ed;
}
.calcDataContont>span{
 margin-left: 10px;
 
 
}
.calcDataContont .fon{
  display: flex;
  flex-direction: column;
}
.diaModalClass{
  margin-top: 20px;
  padding-bottom: 20px;
}
.opacity{
  opacity: 0;
}
</style>
