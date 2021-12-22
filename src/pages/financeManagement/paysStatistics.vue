<template>
  <div class="content-wrapper">
    <el-form :inline="true" :model="formInline" size="small"  class="demo-form-inline">
      <el-form-item class="test" label="订单号" >
        <el-autocomplete
          class="inline-input"
          v-model="formInline.orderNos"
          :fetch-suggestions="querySearch"
          placeholder="请输入订单号"
          clearable
          :trigger-on-focus="false" >
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="运单号">
        <el-autocomplete
          class="inline-input"
          clearable
          v-model="formInline.waybillNo"
          :fetch-suggestions="querySearch"
          placeholder="请输入订单号"
          :trigger-on-focus="false" >
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="应付对象">
        <el-input v-model="formInline.expenseUnitName" clearable placeholder="请输入应付对象"></el-input>
      </el-form-item>
      <el-form-item label="订舱公司">
        <el-input v-model="formInline.customerName" clearable placeholder="请输入应付对象"></el-input>
      </el-form-item>
      <el-form-item label="航司">
        <el-select
          v-model="formInline.airCompanyCode"
          filterable
          remote
          clearable
          reserve-keyword
          placeholder="请输入航司名称"
          :remote-method="remoteMethodFour">
          <el-option
            v-for="item in optionFour"
            :key="item.airCompanyCode"
            :label="item.label"
            :value="item.airCompanyCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="代理上家">
        <el-select
          v-model="formInline.agentName"
          filterable
          remote
          clearable
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
          clearable
          :value-format='formatDate'
          placeholder="开始">
        </el-date-picker>-
        <el-date-picker
          v-model="formInline.endOrderTime"
          type="date"
          clearable
          :value-format='formatDate'
          placeholder="结束">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="航班日期">
         <el-date-picker
          v-model="formInline.startDepartureDate"
          type="date"
          clearable
          :value-format='formatDate'
          placeholder="开始">
        </el-date-picker>-
        <el-date-picker
          v-model="formInline.endDepartureDate"
          type="date"
          clearable
          :value-format='formatDate'
          placeholder="结束">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="起运港">
        <el-select
          v-model="formInline.pol"
          filterable
          remote
          clearable
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
          clearable
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
        <el-select v-model="formInline.payWay"  placeholder="请选择">
          <el-option
            v-for="item in payWayArray"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="核销状态">
        <el-select v-model="formInline.payWriteOffStatus"  placeholder="请选择">
          <el-option
            v-for="item in payWriteOffStatusArray"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="售前客服">
        <el-select v-model="formInline.pscsId" filterable clearable placeholder="请选择">
          <el-option
            v-for="item in preSaleList"
            :key="item.id"
            :label="item.loginName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="航线负责人">
        <el-select v-model="formInline.principalId" filterable clearable placeholder="请选择">
          <el-option
            v-for="item in airLineList"
            :key="item.id"
            :label="item.loginName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="售中客服" >
        <el-select v-model="formInline.mscsId" filterable clearable placeholder="请选择">
          <el-option
            v-for="item in onSaleList"
            :key="item.id"
            :label="item.loginName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>

      </el-form-item>
    </el-form>
    <el-row type='flex' style="direction: rtl;" >
          <el-button size="small" @click="exportBillList">导出列表</el-button>
          <el-button size="small" @click="fatherVerification">核销</el-button>
          <el-button size="small" @click="fatherReconciliation">对账</el-button>
          <el-button size="small" @click="drawer = true" type="primary" >选择表格列</el-button>
          <el-button size="small" type="primary" @click="clearAllData">清空</el-button>
          <el-button size="small" type="primary" @click="onSubmit">查询</el-button>
    </el-row>
      <el-drawer
        size='15%'
        title="确认表格列"
        :visible.sync="drawer"
        :with-header="false">
        <div class="drawerTip">

             <el-checkbox  v-model="checkedIndex0">全选</el-checkbox>
             <el-checkbox class="mycheckbox"  v-model="checkedIndex1">订单号</el-checkbox>
             <el-checkbox class="mycheckbox" v-model="checkedIndex2">运单号</el-checkbox>
             <el-checkbox class="mycheckbox" v-model="checkedIndex3">应付对象</el-checkbox>
             <el-checkbox class="mycheckbox" v-model="checkedIndex4">航班日期</el-checkbox>
             <el-checkbox class="mycheckbox" v-model="checkedIndex5">交单时间</el-checkbox>
             <el-checkbox class="mycheckbox" v-model="checkedIndex6">应收总金额</el-checkbox>
             <el-checkbox class="mycheckbox" v-model="checkedIndex7">利润</el-checkbox>
             <el-checkbox class="mycheckbox" v-model="checkedIndex8">应付费用名称</el-checkbox>
             <el-checkbox class="mycheckbox" v-model="checkedIndex9">应付金额</el-checkbox>
             <el-checkbox class="mycheckbox" v-model="checkedIndex10">已对账金额</el-checkbox>
             <el-checkbox class="mycheckbox" v-model="checkedIndex11">未对账金额</el-checkbox>
             <el-checkbox class="mycheckbox" v-model="checkedIndex12">已核销金额</el-checkbox>
             <el-checkbox class="mycheckbox" v-model="checkedIndex13">未核销金额</el-checkbox>
             <el-checkbox class="mycheckbox" v-model="checkedIndex14">应付总金额</el-checkbox>
             <el-checkbox class="mycheckbox" v-model="checkedIndex15">汇率</el-checkbox>
             <el-checkbox class="mycheckbox" v-model="checkedIndex16">结算方式</el-checkbox>
             <el-checkbox class="mycheckbox" v-model="checkedIndex17">核销次数</el-checkbox>
             <el-checkbox class="mycheckbox" v-model="checkedIndex14">核销状态</el-checkbox>



        </div>

      </el-drawer>

      <div class="el_tabs">
        <el-button :class="{tip: woStatus == 0}" @click="handleClick(0,initBoolen=true)" >可操作({{countAuth}})</el-button>
        <el-button :class="{tip: woStatus == 1}" @click="handleClick(1,initBoolen=true)">业务修改中({{countNoAuth}})</el-button>
        <el-button :class="{tip: woStatus == 2}" @click="handleClick(2,initBoolen=true)">异常({{countErr}})</el-button>
      </div>
    <el-table

      :data="tableData"
      border
      max-height="600"
      :cell-style= backStyle
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
        :selectable='judgeAllSelect'
        width="55">
      </el-table-column>
      <el-table-column
        prop="orderNo"
        label="订单号"
        v-if="checkedIndex1"
        width="140">
      </el-table-column>
      <el-table-column
        prop="waybillNo"
         v-if="checkedIndex2"
        label="运单号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="expenseUnitName"
         v-if="checkedIndex3"
        label="应付对象"
        width="250">
      </el-table-column>
      <el-table-column
        prop="departureDate"
        label="航班日期"
         v-if="checkedIndex4"
        width="100">
      </el-table-column>
      <el-table-column
        prop="presentationTime"
        label="交单时间"
         v-if="checkedIndex5"
        width="100">
      </el-table-column>
      <el-table-column
        label="应收总金额"
         v-if="checkedIndex6"
         prop="totalArCny">

      </el-table-column>
      <el-table-column
        prop="orderProfit"
        v-if="checkedIndex7"
        label="利润"
        width="100">
      </el-table-column>
      <el-table-column
        prop="expenseName"
         v-if="checkedIndex8"
        label="应付费用名称"
        width="100">
      </el-table-column>
      <el-table-column
       v-if="checkedIndex9"
      label="应付金额" >
        <el-table-column
            prop="totalApCny"
            label="人民币"
            width="100">
          </el-table-column>
          <el-table-column
            label="原币"
            width="100">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.totalApOrgn" :key="index">{{item}}</div>
            </template>
          </el-table-column>
      </el-table-column>
      <el-table-column
        prop="payCheckAmount"
        label="已对账金额"
        v-if="checkedIndex10"
        width="100">

      </el-table-column>
      <el-table-column
        prop="unreconciledAmount"
        label="未对账金额"
        v-if="checkedIndex11"
        width="100">
      </el-table-column>
      <el-table-column
        label="已核销金额"
        v-if="checkedIndex12"
        width="200">
        <el-table-column
          prop="payWriteOffAmountRmb"
          label="人民币"
          width="100">
        </el-table-column>
        <el-table-column
          label="原币"
          width="100">
          <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.payWriteOffAmounts" :key="index">{{item}}</div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="未核销金额"
        v-if="checkedIndex13"
        width="200">
        <el-table-column
          prop="unwrittenOffAmountRmb"
          label="人民币"
          width="100">
        </el-table-column>
        <el-table-column
          label="原币"
          width="100">
          <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.unwrittenOffAmounts" :key="index">{{item}}</div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        prop="exchangeRates"
        label="汇率"
        v-if="checkedIndex15"
        width="100">
      </el-table-column>
      <el-table-column
        label="结算方式"
        v-if="checkedIndex16"
        width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.payWay == 0">付款</span>
          <span v-if="scope.row.payWay == 1">月结</span>
        </template>
      </el-table-column>
      <el-table-column
        label="核销次数"
        v-if="checkedIndex17"
        width="100">
        <template slot-scope="scope">
          <span   @click="recordsBtn(scope.row)">{{scope.row.payWriteOffCount}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="核销状态"
        v-if="checkedIndex14"
        width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.payWriteOffStatus == 0">未对账未核销</span>
          <span v-if="scope.row.payWriteOffStatus == 1">部分对账未核销</span>
          <span v-if="scope.row.payWriteOffStatus == 2">已对账未核销</span>
          <span v-if="scope.row.payWriteOffStatus == 3">未对账部分核销</span>
          <span v-if="scope.row.payWriteOffStatus == 4">部分对账部分核销</span>
          <span v-if="scope.row.payWriteOffStatus == 5">对账部分核销</span>
          <span v-if="scope.row.payWriteOffStatus == 6">未对账已核销</span>
          <span v-if="scope.row.payWriteOffStatus == 7">部分对账已核销</span>
          <span v-if="scope.row.payWriteOffStatus == 8">已对账已核销</span>
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
    <reconciliation @farhersearch='onSubmit'  :childPropsObj = childPropsObj ref="reconciliationData"/>
    <!-- 核销模态框组件 -->
    <verification  @farhersearch2='onSubmit' :childPropsObj= verificationObj :verificationArr= 'verificationArr' ref="verificationData" />
    <!-- 点击核销次数模态框 -->
    <el-dialog
      title="应付核销操作记录"
      :visible.sync="payWriteOffCountBoolen"
      width="60%"

      :before-close="handleClose">
      <div class="diaModalClass">
        <el-table
          max-height='500'
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
            label="应付对象"
            width="250">
          </el-table-column>
          <el-table-column
            prop="totalApOrgn"

            label="应付金额"
            width="100">
          </el-table-column>
          <el-table-column
            label="记录"
            width="500">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.tempObj" :key="index">
                <div v-if="item.status == 0 || item.status == -1">
                  <div v-if="item.payCheckAmount > 0 ">
                   <!-- 对账数据 -->
                   {{`操作${index + 1}:${item.writeOffOperator}`}}
                   <span class="text_color_blue">对账</span>
                   该订单,对账{{ item.payCheckAmount}}金额
                   <span v-if="item.currency == 1"> CNY</span>
                    <span v-if="item.currency == 2"> 港币</span>
                    <span v-if="item.currency == 3"> 美元</span>
                    <span v-if="item.currency == 4"> 欧元</span>
                    <span v-if="item.currency == 5"> 英镑</span>
                  </div>
                  <div v-else>

                    {{`操作${index + 1}:${item.writeOffOperator}`}}
                    <span class="text_color_blue">核销</span>
                    该订单,核销{{item.writeOffAmount}}金额
                      <span v-if="item.currency == 1"> CNY</span>
                      <span v-if="item.currency == 2"> 港币</span>
                      <span v-if="item.currency == 3"> 美元</span>
                      <span v-if="item.currency == 4"> 欧元</span>
                      <span v-if="item.currency == 5"> 英镑</span>
                  </div>


                </div>
                <div v-if='item.status == 2'>
                    {{`操作${index + 1}:${item.writeOffOperator} `}}撤销了操作{{item.tIndex}}
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
        // activeName:'0',
        drawer:false, // 右侧表格状态
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
        woStatus:0,// 正常0，业务修改中1，异常2
        tableData: [],
        // slectAllDataArray:[],// 全选后返回的所在状态下的数据 不展示
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
        childPropsObj:{}, //
        childBoolen:false, // 子组件是否引入
        preSaleList:[],// 售前客服数组
        onSaleList:[],// 售中客服数组
        airLineList:[],// 航线负责人数组
        options:[], //
        optionTwo:[], //
        optionThree:[],//
        optionFour:[],//
        verificationObj:{},// 传递给核销组件的对象
        verificationArr:[], //传递给核销组件的数组
        tableColumnArray:{},// 表头默认显示状态
        checkedIndex0:true ,// 默认全选
        checkedIndex1:true ,
        checkedIndex2:true ,
        checkedIndex3:true ,
        checkedIndex4:true ,
        checkedIndex5:true ,
        checkedIndex6:true ,
        checkedIndex7:true ,
        checkedIndex8:true ,
        checkedIndex9:true ,
        checkedIndex10:true ,
        checkedIndex11:true ,
        checkedIndex12:true ,
        checkedIndex13:true ,
        checkedIndex14:true ,
        checkedIndex15:true ,
        checkedIndex16:true ,
        checkedIndex17:true ,
      }
    },
    watch:{
      checkedIndex0(newValue){
        if(newValue == true){

          this.checkedIndex1 = true
          this.checkedIndex2 = true
          this.checkedIndex3 = true
          this.checkedIndex4 = true
          this.checkedIndex5 = true
          this.checkedIndex6 = true
          this.checkedIndex7 = true
          this.checkedIndex8 = true
          this.checkedIndex9 = true
          this.checkedIndex10 = true
          this.checkedIndex11 = true
          this.checkedIndex12 = true
          this.checkedIndex13 = true
          this.checkedIndex14 = true
          this.checkedIndex15 = true
          this.checkedIndex16 = true
          this.checkedIndex17 = true

        }else {
          this.checkedIndex1 = false
          this.checkedIndex2 = false
          this.checkedIndex3 = false
          this.checkedIndex4 = false
          this.checkedIndex5 = false
          this.checkedIndex6 = false
          this.checkedIndex7 = false
          this.checkedIndex8 = false
          this.checkedIndex9 = false
          this.checkedIndex10 = false
          this.checkedIndex11 = false
          this.checkedIndex12 = false
          this.checkedIndex13 = false
          this.checkedIndex14 = false
          this.checkedIndex15 = false
          this.checkedIndex16 = false
          this.checkedIndex17 = false

        }
      }
    },
    async mounted() {
      await this.onSubmit()
      await this.getSysInitial()
      

    },
    components:{
      reconciliation,
      verification
    },
    methods: {

      // 清空搜索数据
      clearAllData(){
        this.formInline= {
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
        }
        this.woStatus = 0
        this.currentPage = 1
      },
      // 跨页之后禁止单选
      judgeAllSelect(){

        return !this.slectAllDataStatic
      },
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
              this.handleClose()
              this.onSubmit()
            }

          })
      },
      handleClose(){
         this.payWriteOffCountData = []
         this.payWriteOffCountBoolen = false
      },
      async recordsBtn(e){
        let res = await this.$http.post(this.$service.searchRecords,{ids:e.ids})
        if(res.code == 200){
          console.log(res.data)
          let arr = res.data
          for(let i in arr){
            if(arr[i].status == 2){
              for(let j in arr){
                if(arr[i].revokeId == arr[j].id){
                  arr[i].tIndex = Number(j)  + 1
                }
              }
            }
          }
          let te = Object.assign({},e,{tempObj:arr})
          this.$set(this.payWriteOffCountData,0,te)
          setTimeout(()=>{
            this.payWriteOffCountBoolen = true
          },10)

        }

      },
      // 导出列表
      async exportBillList(){
        let {slectAllDataStatic , formInline , woStatus , multipleSelection } = this  ;
        if(slectAllDataStatic){
          let params = Object.assign({},formInline,{woStatus,woStatus})
          let res = await this.$http.post(this.$service.billExportExcel,params,{responseType: 'arraybuffer'})
          exportFile(res,"application/x-xls",'应付统计')
        }else{
          if(multipleSelection.length>0){
            let idArray  =  multipleSelection.map((e)=>{
              return e.ids
            })
            let params = {
              ids:idArray,
              woStatus:woStatus,
            }
            let res = await this.$http.post(this.$service.billExportExcel,params,{responseType: 'arraybuffer'})
            exportFile(res,"application/x-xls",'应付统计')
          }else{
            this.$message({
                message: '请先选择数据',
                type: 'warning'
            });
          }
        }
      },

      async  handleClick(e,initBoolen = true) {

        this.woStatus = e
        this.currentPage = 1
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

          await this.getTabelData(formInline,currentPage,woStatus,slectAllDataStatic,this.pageSize)
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
            return {value:item.threeLetterCode, label: item.name}
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
            return {value:item.threeLetterCode, label: item.name}
          })
        }else{
          this.optionThree =[]
        }
      },
      // 输入航司的时候返回值
      async remoteMethodFour(e){
        if(e !== ''){
            let res = await this.$http.get(this.$service.companySearchByPage+`?keyWord=${e}`)
            console.log(res.data.records)
            this.optionFour = res.data.records.map((item)=>{
            return {value:item.name, label: item.name}
          })
        }else{
          this.optionFour =[]
        }
      },
      // 获取搜索条件当中的原始值
      async getSysInitial(){
        let res1 = await this.$http.get(this.$service.userSearchNoAuth+'?roleName=售前客服&pageSize=50000')
        let res2 = await this.$http.get(this.$service.userSearchNoAuth+'?roleName=售中客服&pageSize=50000')
        let res3 = await this.$http.get(this.$service.userSearchNoAuth+'?roleName=航线负责人&pageSize=50000')
        Promise.all([res1,res2,res3]).then(res=>{
          this.preSaleList = res[0].data.records
          this.onSaleList = res[1].data.records
          this.airLineList = res[2].data.records
        })
      },
      async onSubmit() {
        this.currentPage = 1
        let { formInline, currentPage, woStatus,slectAllDataStatic} = this ;
        await this.getTabelData(formInline,currentPage,woStatus,slectAllDataStatic)
        await this.handleClick(woStatus,false)
      },
      async handleCurrentChange(e){
        let { formInline, woStatus,slectAllDataStatic} = this ;
        this.currentPage = e
        await this.getTabelData(formInline,e,woStatus,slectAllDataStatic)
      },
      // 点击对账
      async fatherReconciliation(){
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
            let idsArray = tempArray.map((item)=>{
               return item.ids
            })

            let tempAds = []
            for(let j in idsArray){
              if(idsArray[j] == null){

              }else{
                if(idsArray[j].indexOf(',') == -1){
                  tempAds.push(idsArray[j])
                }else{
                  let te = idsArray[j].split(',')
                  tempAds =  tempAds.concat(te)

                }
              }
            }



            let {formInline} = this
            let params= Object.assign({},formInline,{ids:tempAds})
            let res = await this.$http.post(this.$service.toCheckAmount,params)
            if(res.code == 200){
              let testObj = Object.assign({},res.data,{expenseUnitName:tempString},{ids:tempAds})
              this.childPropsObj = testObj
              setTimeout(()=>{
                  this.$refs.reconciliationData.input3 = ''
                  this.$refs.reconciliationData.showModal()
              },0)

            }

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
      async fatherVerification(){
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
            let {formInline} = this
            let idsArray = tempArray.map((item)=>{
               return item.ids
            })

            let tempAds = []
            for(let j in idsArray){
              if(idsArray[j] == null){

              }else{
                if(idsArray[j].indexOf(',') == -1){
                  tempAds.push(idsArray[j])
                }else{
                  let te = idsArray[j].split(',')
                  tempAds =  tempAds.concat(te)

                }
              }
            }
            let test = tempArray.map(res=>{
              return{orderId:res.orderId,ids:res.ids}
            })
            this.verificationArr = test
            let params= Object.assign({},formInline,{ids:tempAds})
            let res = await this.$http.post(this.$service.toWriteOffAmountCount,params)
            if(res.code == 200){
              this.verificationObj = res.data
              console.log(res.data)
              setTimeout(()=>{
                this.$refs.verificationData.showModal()
              },0)
            }

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
        let { formInline, currentPage, woStatus,slectAllDataStatic} = this
        if(this.slectAllDataStatic){
          await this.getTabelData(formInline, currentPage, woStatus,slectAllDataStatic)
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
        console.log(arrayt)
        this.arrayOne = this.arrayOne
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
            if(resData){
                for(let i in resData.records){
                  resData.records[i].totalApOrgn = await this.dealApString(resData.records[i].totalApOrgn)
                  resData.records[i].payWriteOffAmounts = await this.dealApString(resData.records[i].payWriteOffAmounts)
                  resData.records[i].unwrittenOffAmounts = await this.dealApString(resData.records[i].unwrittenOffAmounts)
                }
                if(this.woStatus == 1){
                  this.pageTotal = res.data.countNoAuth
                }else if(this.woStatus == 2){
                  this.pageTotal = res.data.countErr
                }else{
                  this.pageTotal = res.data.countAuth
                }
                  this.tableData = resData.records
                if(slectAllDataStatic){
                  this.multipleSelection = resData.records
                }else{
                  this.multipleSelection = []
                }
                setTimeout(async()=>{
                  await this.dealSelectAll(slectAllDataStatic)
                },0)
            }else{
               this.tableData = []
            }

          }
        } catch (error) {
          console.log(error)
        }
      },
      // 处理利润异常样式
      backStyle({row,rowIndex}){
        if( row.unwrittenOffAmountRmb < row.payCheckAmount < row.totalApCny){
          console.log('第二种异常')
          return 'background-color: #FA8072';
        }
        if (-200 < row.orderProfit && row.orderProfit < 0 ) {
          return 'background-color: #FFDEAD';
        }else if (-500 <= row.orderProfit && row.orderProfit <= -200) {
          return 'background-color: #F4A460';
        }else if ( row.orderProfit < -500 ) {
          return 'background-color: #FA8072';
        }else if(row.orderProfit < 0 ){
          return 'background-color: #CD5C5C'
        }
        
      },
      // 处理返回的原币string
      async dealApString(tempString){

        if(typeof(tempString) == 'string'){
          let st =    JSON.parse(tempString)
          let ss = st.map(res=>{
            if(res.currency == 1){
              return res.amount + '￥'
            }else if(res.currency == 2){
              return res.amount + 'HK$'
            }else if(res.currency == 3){
              return res.amount + '$'
            }else if(res.currency == 4){
              return res.amount + '€'
            }else if(res.currency == 5){
              return res.amount + '￡'
            }
          })

          return ss
        }else {
          return null
        }

      }
    },
  }
</script>

<style scoped>
.demo-form-inline {
  /* width: 80%; */
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

}
.endItem{
  position: relative;
  right: -88px;
}

.content-wrapper{
  margin: 20px;
  width: calc(100% - 100px);
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
.el_tabs{
  display: flex;
  justify-content: start;
  border-top: 1px solid #d5d5d5;
}
.el_tabs .el-button{
  margin-left: 0;
  border-radius: 0;
}
.tip{
  color: #409EFF;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}
.drawerTip{
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  margin-top: 10vh;
}
.drawerTip>.mycheckbox{
  margin-top: 10px;
}
</style>
