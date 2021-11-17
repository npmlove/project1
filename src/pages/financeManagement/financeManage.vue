<template>
  <div class="content-wrapper">
    <div class="content" style="position: relative;">
      <el-form :inline="true" size="medium" class="demo-form-inline"  label-position="left">
        <div class="content-search-normal">
          <el-form-item label="订单号:" class="formItem"  label-width="80px">
            <el-input v-model="selectResult.orderNo" style="width: 200px;" size="medium" maxlength="15"  onkeyup="this.value = this.value.replace(/[^\da-zA-Z]/g,'');" clearable
                      placeholder="请输入订单号"></el-input>
          </el-form-item>

          <el-form-item label="运单号:" class="formItem"  label-width="80px">
            <el-input v-model="selectResult.waybillNo" style="width: 200px;" size="medium" maxlength="11"  onkeyup="this.value = this.value.replace(/[^\d]/g,'');" clearable
                      placeholder="请输入运单号"></el-input>
          </el-form-item>

          <el-form-item label="订舱客户:" class="formItem"  label-width="80px">
            <el-input v-model="selectResult.customerName" style="width: 200px;" size="medium" maxlength="30" clearable
                      placeholder="请输入订舱客户"></el-input>
          </el-form-item>

          <el-form-item label="代理上家:" class="formItem"  label-width="80px">
            <el-select v-model="selectResult.agentId" placeholder="请输入代理上家" :remote-method="agentMethod" :loading="loading" clearable
                       filterable remote reserve-keyword style="width: 200px;">
              <el-option
                v-for="item in agentOpt"
                :key="item.id"
                :label="item.agentName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="航司:" class="formItem"  label-width="80px">
            <el-select v-model="selectResult.agentId" placeholder="请输入航司" :remote-method="agentMethod" :loading="loading" clearable
                       filterable remote reserve-keyword style="width: 200px;">
              <el-option
                v-for="item in agentOpt"
                :key="item.id"
                :label="item.agentName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>


          <el-form-item label="起运港:" class="formItem"  label-width="80px">
            <el-select v-model="selectResult.pol" placeholder="起运港三字码" :remote-method="polMethod" :loading="loading" clearable
                       filterable remote reserve-keyword style="width: 200px;">
              <el-option
                v-for="(item,index) in polOpt"
                :disabled="pod == item.threeLetterCode"
                :key="item.threeLetterCode"
                :value="item.threeLetterCode">
                <span>{{ item.threeLetterCode }}</span>
                <span style="margin-left: 5px;">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="目的港:" class="formItem"  label-width="80px">
            <el-select v-model="selectResult.pod" placeholder="目的港三字码" :remote-method="podMethod" :loading="loading" clearable
                       filterable remote reserve-keyword style="width: 200px;">
              <el-option
                v-for="item in podOpt"
                :disabled="pol == item.threeLetterCode"
                :key="item.threeLetterCode"
                :value="item.threeLetterCode">
                <span>{{ item.threeLetterCode }}</span>
                <span style="margin-left: 5px;">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="开票进度:" class="formItem"  label-width="80px">
            <el-select v-model="selectResult.agentId" placeholder="请选择开票进度" :remote-method="agentMethod" :loading="loading" clearable
                       filterable remote reserve-keyword style="width: 200px;">
              <el-option
                v-for="item in agentOpt"
                :key="item.id"
                :label="item.agentName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="客服:" class="formItem"  label-width="80px">
            <el-select v-model="selectResult.agentId" placeholder="请输入客服" :remote-method="agentMethod" :loading="loading" clearable
                       filterable remote reserve-keyword style="width: 200px;">
              <el-option
                v-for="item in agentOpt"
                :key="item.id"
                :label="item.agentName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="销售:" class="formItem"  label-width="80px">
            <el-select v-model="selectResult.agentId" placeholder="请输入销售" :remote-method="agentMethod" :loading="loading" clearable
                       filterable remote reserve-keyword style="width: 200px;">
              <el-option
                v-for="item in agentOpt"
                :key="item.id"
                :label="item.agentName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="航班日期:" style="width:480px"  label-width="80px">
            <el-date-picker
             style="width:180px"
              v-model="selectResult.startDepartureDate"
              type="date"
              :picker-options="pickerOptionsStartOne"
              placeholder="选择日期">
            </el-date-picker >-
             <el-date-picker
             style="width:180px"
              v-model="selectResult.endDepartureDate"
              type="date"
              :picker-options="pickerOptionsEndOne"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="交单时间:" style="width:480px" >
            <el-date-picker
             style="width:180px"
              v-model="selectResult.startPresentationTime"
              type="date"
              :picker-options="pickerOptionsStartTwo"
              placeholder="选择日期">
            </el-date-picker >-
             <el-date-picker
             style="width:180px"
              v-model="selectResult.endPresentationTime"
              type="date"
              :picker-options="pickerOptionsEndTwo"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="航线:" class="formItem"  label-width="80px">
            <el-select v-model="selectResult.agentId" placeholder="请输入航线" :remote-method="agentMethod" :loading="loading" clearable
                       filterable remote reserve-keyword style="width: 200px;">
              <el-option
                v-for="item in agentOpt"
                :key="item.id"
                :label="item.agentName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作:" class="formItem"  label-width="80px">
            <el-select v-model="selectResult.agentId" placeholder="请输入航线" :remote-method="agentMethod" :loading="loading" clearable
                       filterable remote reserve-keyword style="width: 200px;">
              <el-option
                v-for="item in agentOpt"
                :key="item.id"
                :label="item.agentName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <div class="operateButton">
              <el-button @click="searchClick" size="mini" type="primary" icon="el-icon-search">查询</el-button>
              <el-button @click="restClick" size="mini" type="primary">清空</el-button>
          </div>
          <div class="operateButton">
            <el-button size='mini' type="primary" @click="changeData()">修改</el-button>
            <el-button size='mini' type="primary">导出列表</el-button>
            <el-button @click="drawer = true" type="primary" size='mini'>选择表格列</el-button>
          </div>
        </div>
      </el-form>
      <el-tabs class="nth9_class" v-model="typeCode" type="border-card" @tab-click="tabClickData" value="全部">
        <el-tab-pane v-for="(item,index) in tabName" :key="index" :label="item+'( '+tabNum[index]+' )'" :name="item">
          <el-table
              :data="tableData"
              border
              stripe
              header
              class="finance-table"
              @selection-change="handleSelectionChange"
              style="width: 100%">
              <template slot="empty">
                <img class="data-pic" src="../../assets/kong-icon.png"/>
                <p>暂无数据</p>
              </template>
              <el-table-column prop="id" width="40" type="" label="序号" v-if="checkedTable.indexOf('序号')!==-1"></el-table-column>
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column prop="orderNo" label="订单号" min-width="160"  type="" v-if="checkedTable.indexOf('订单号')!==-1"></el-table-column>
              <el-table-column prop="waybillNo" label="运单号" min-width="160"  type="" v-if="checkedTable.indexOf('运单号')!==-1"></el-table-column>
              <el-table-column prop="departureDate" label="航班日期" min-width="100"  type="" v-if="checkedTable.indexOf('航班日期')!==-1"></el-table-column>
              <el-table-column prop="presentationTime" label="交单时间" min-width="100"  type="" v-if="checkedTable.indexOf('交单时间')!==-1"></el-table-column>
              <el-table-column prop="customerName" label="订舱客户" min-width="100"  type="" v-if="checkedTable.indexOf('订舱客户')!==-1"></el-table-column>
              <el-table-column prop="invoiceTitle" label="代理上家" min-width="160"  type="" v-if="checkedTable.indexOf('代理上家')!==-1"></el-table-column>
              <el-table-column prop="invoiceTitle" label="航司" min-width="160"  type="" v-if="checkedTable.indexOf('航司')!==-1"></el-table-column>
              <el-table-column prop="invoiceTitle" label="起运港" min-width="160"  type="" v-if="checkedTable.indexOf('起运港')!==-1"></el-table-column>
              <el-table-column prop="invoiceTitle" label="目的港" min-width="160"  type="" v-if="checkedTable.indexOf('目的港')!==-1"></el-table-column>
              <el-table-column prop="invoiceTitle" label="货物信息" min-width="160"  type="" v-if="checkedTable.indexOf('货物信息')!==-1"></el-table-column>
              <el-table-column prop="invoiceTitle" label="操作人员" min-width="160"  type="" v-if="checkedTable.indexOf('操作人员')!==-1"></el-table-column>
              <el-table-column label="应收金额"  v-if="checkedTable.indexOf('应收金额')!==-1">
                <el-table-column
                    prop="province"
                    label="人民币"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="city"
                    label="原币"
                    width="120">
                </el-table-column>
              </el-table-column>
              <el-table-column label="应付金额" v-if="checkedTable.indexOf('应付金额')!==-1">
                <el-table-column
                    prop="province"
                    label="人民币"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="city"
                    label="原币"
                    width="120">
                </el-table-column>
              </el-table-column>
              <el-table-column prop="invoiceStatus" label="利润" min-width="80" v-if="checkedTable.indexOf('利润')!==-1"></el-table-column>
              <el-table-column prop="invoiceStatus" label="汇率" min-width="80" v-if="checkedTable.indexOf('汇率')!==-1"></el-table-column>
              <el-table-column prop="invoiceStatus" label="开票进度" min-width="80" v-if="checkedTable.indexOf('开票进度')!==-1"></el-table-column>
              <el-table-column prop="upload" label="开票金额" min-width="80" v-if="checkedTable.indexOf('开票金额')!==-1"></el-table-column>
              <el-table-column prop="upload" label="订单状态" min-width="80" v-if="checkedTable.indexOf('订单状态')!==-1"></el-table-column>
            </el-table>
             <div style="display:flex;justify-content:space-between">
               <div>
                 <el-button type="primary" size="mini">跨页全选</el-button>
                 <el-button type="primary" size="mini" @click="getStatistData">数据统计</el-button>
                 <div style="margin-top:15px" v-if="statistDataShow">
                   <span>应收总金额:{{statistData.shouldGet}}</span>
                   <span style="margin-left:15px">申请开票金额: {{statistData.applyInvoice}}</span>
                   <span style="margin-left:15px">已开票金额:{{statistData.invoicedMoney}}</span>
                 </div>
               </div>
               
               <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[10, 200, 300, 400]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                style="text-align: right;padding: 19px 30px 18px 0;background: #fff"
                >
              </el-pagination>
             </div>
        </el-tab-pane>
      </el-tabs>
      <!-- 表格控制列显示 -->
      <el-drawer
        title="表格列控制"
        :visible.sync="drawer"
        size="200px"
        :direction="direction"
        >
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" style="margin:0 0 20px 20px">全选</el-checkbox>
        <el-checkbox-group 
          v-model="checkedTable"
          :min="0"
          :max="20">
              <el-checkbox v-for="choose in tableOptions" :label="choose" :key="choose" style="display:block;margin-left:20px">{{choose}}</el-checkbox>
        </el-checkbox-group>
      </el-drawer>
    </div>
    <el-dialog :visible.sync="dialogFormVisible" width="80%">
      <el-tabs v-model="orderId" type="card" editable @edit="handleTabsEdit">
        <el-tab-pane
          :key="item.name"
          v-for="(item, index) in detailTabs"
          :label="item.title"
          :name="item.name"
        >
          <div style="font-size: 18px;font-weight: 100;color: #333;padding: 0 20px 10px 20px;">应收账单</div>
          <Table
            :tableData='arData'
            :columns='columns1'
            :operation='operation'
            :total='total1'
            :currentPage='pageNum'
            :pageSize='pageSize'
            @orderDetails="orderDetails"
            @sizeChange='handleSizeChange'
            @currentChange='handleCurrentChange'>
          </Table>
          <div class="finance-table-price">
            <div>账单合计：{{ getOrgn(this.totalArOrgn) }}</div>
            <div>人民币合计：￥{{ this.totalArCny }}</div>
            <div>结算方式：{{ this.payWay==0?"付款买单":"月结买单" }}</div>
          </div>
          <div style="font-size: 18px;font-weight: 100;color: #333;padding: 10px 20px 10px 20px;">应付账单</div>
          <Table
            :tableData='apData'
            :columns='columns2'
            :operation='operation'
            :total='total1'
            :currentPage='pageNum'
            :pageSize='pageSize'
            @orderDetails="orderDetails"
            @sizeChange='handleSizeChange'
            @currentChange='handleCurrentChange'>
          </Table>
          <div class="finance-table-price">
            <div>账单合计：{{ getOrgn(this.totalApOrgn) }}</div>
            <div>人民币合计：￥{{ this.totalApCny }}</div>
            <div>订单利润：{{ this.orderProfit }}</div>
          </div>
          <div style="font-size: 18px;font-weight: 100;color: #333;padding: 10px 20px 10px 20px;">修改记录</div>
          <Table
            :tableData='logData'
            :columns='columns3'
            :operation='operation'
            :total='total1'
            :currentPage='pageNum'
            :pageSize='pageSize'
            @orderDetails="orderDetails"
            @sizeChange='handleSizeChange'
            @currentChange='handleCurrentChange'>
          </Table>
          <div v-show="financeStatus==2||financeStatus==3||orderFinanceStatus==3||orderFinanceStatus==2">
            <div
              style="font-size: 18px;font-weight: 100;color: #333;padding: 10px 20px 10px 20px;border-bottom: 1px dashed #999;">
              操作说明
            </div>
            <el-input
              type="textarea"
              rows="2"
              placeholder="请输入操作说明"
              v-model="info">
            </el-input>
          </div>

        </el-tab-pane>
      </el-tabs>





<!--      <el-tabs style="margin: 20px 0;" v-model="financeStatus" type="border-card" @tab-click="tabClickData">

        <el-tab-pane label="全部" name="全部">

        </el-tab-pane>

      </el-tabs>-->
      <div slot="footer" class="dialog-footer" v-show="financeStatus==2||orderFinanceStatus==2">
        <el-button @click="savePresentLog(3)">驳回</el-button>
        <el-button type="primary" @click="savePresentLog(2)">确认解锁</el-button>
      </div>
      <div slot="footer" class="dialog-footer" v-show="financeStatus==3||orderFinanceStatus==3">
        <el-button @click="savePresentLog(5)">驳回</el-button>
        <el-button type="primary" @click="savePresentLog(3)">审核通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Table from '@/components/financeTable'
  import {toData} from '@/util/assist'

  export default {
    data() {
      return {
        //表格控制列drawer
        drawer: false,
        checkAll: false,
        isIndeterminate: true,
        direction: 'rtl',
        checkedTable:['序号','订单号', '运单号', '航班日期','交单时间'],
        tableOptions:['序号','订单号', '运单号', '航班日期','交单时间','订舱客户','代理上家','航司','起运港','目的港','应收金额','应付金额','利润','汇率','开票进度','开票金额','订单状态'],
       
        //表格tab
        tabName:["全部","合并开票","单独开票","异常"],
        typeCode:"全部",
        tabNum:[0,0,0,0],
        detailTabs:[],
        dialogFormVisible: false,
        showFeesDetail: false,
        //table
        tableData: [],
        arData: [],
        apData: [],
        logData: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
        // 列
                columns: [
                  {label: '订单号', prop: 'orderNo', show: true, width: '120'},
                  {label: '运单号', prop: 'waybillNo', show: true, width: '80'},
                  {label: '航班日期', prop: 'departureDate', show: true, width: '80'},
                  {label: '交单时间', prop: 'presentationTime', show: true, width: '80'},
                  {label: '订舱客户', prop: 'customerName', show: true, width: '80'},
                  {label: '代理上家', prop: 'agentName', show: true, width: '200'},
                  {label: '航司', prop: 'airCompanyCode', show: true, width: '50'},
                  {label: '起运港', prop: 'pol', show: true, width: '60'},
                  {label: '目的港', prop: 'pod', show: true, width: '60'},
                  {label: '货物信息', prop: 'cargoInfo', show: true, width: '80'},
                  {label: '操作人员', prop: 'operator', show: true, width: '80'},
                  {label: '应收金额', show: true},
                  {label: '应付金额',  show: true},
                  {label: '利润', prop: 'orderProfit', show: true, width: '100'},
                  {label: '汇率',show: true, width: '50'},
                  {label: '开票进度', prop: 'invoicingStatus', show: true, width: '80'},
                  {label: '开票金额', prop: 'invoicedAmount', show: true, width: '80'},
                  {label: '订单状态', prop: 'financeStatus', show: true, width: '80'},



                ],
        columns1: [
          {label: '序号', show: true, width: '50'},
          {label: '费用名称', prop: 'expenseName', show: true, width: '100'},
          {label: '收款单位', prop: 'expenseUnitName', show: true, width: '150'},
          {label: '单价', prop: 'price', show: true, width: '100'},
          {label: '数量', prop: 'quantity', show: true, width: '100'},
          {label: '币种', prop: 'currency', show: true, width: '100'},
          {label: '原币合计', prop: 'totalOrgn', show: true, width: '100'},
          {label: '汇率', prop: 'exchangeRate', show: true, width: '100'},
          {label: '人民币合计', prop: 'totalCny', show: true, width: '100'},
          {label: '备注', prop: 'remark', show: true, width: '50'}
        ],
        columns2: [
          {label: '序号', prop: 'orderNo', show: true, width: '50'},
          {label: '费用名称', prop: 'expenseName', show: true, width: '100'},
          {label: '付款单位', prop: 'expenseUnitName', show: true, width: '150'},
          {label: '单价', prop: 'price', show: true, width: '100'},
          {label: '数量', prop: 'quantity', show: true, width: '100'},
          {label: '币种', prop: 'currency', show: true, width: '100'},
          {label: '原币合计', prop: 'totalOrgn', show: true, width: '100'},
          {label: '汇率', prop: 'exchangeRate', show: true, width: '100'},
          {label: '人民币合计', prop: 'totalCny', show: true, width: '100'},
          {label: '备注', prop: 'remark', show: true, width: '50'}
        ],
        columns3: [
          {label: '操作类型', prop: 'operationType', show: true, width: '150'},
          {label: '说明', prop: 'operationInfo', show: true, width: '100'},
          {label: '操作时间', prop: 'createTime', show: true, width: '150'},
          {label: '操作人', prop: 'operator', show: true, width: '100'}
        ],
        // 操作
        operation: {
          show: false,
          label: '操作',
          width: '180',
          options: [
            {label: '编辑', method: 'routeEdit'}
          ]
        },
        //航班日期选择器
         // 限制结束日期大于开始日期
        pickerOptionsStartOne: {
          disabledDate: time => {
            let endDateVal = this.selectResult.endDepartureDate
            if (endDateVal) {
              return time.getTime() > new Date(endDateVal).getTime()
            }
          }
        },
        pickerOptionsEndOne: {
          disabledDate: time => {
            let beginDateVal = this.selectResult.startDepartureDate
            if (beginDateVal) {
              return time.getTime() < new Date(beginDateVal).getTime()
            }
          }
        },
        // 交易时间
         pickerOptionsStartTwo: {
          disabledDate: time => {
            let endDateVal = this.selectResult.endPresentationTime
            if (endDateVal) {
              return time.getTime() > new Date(endDateVal).getTime()
            }
          }
        },
        pickerOptionsEndTwo: {
          disabledDate: time => {
            let beginDateVal = this.selectResult.startPresentationTime
            if (beginDateVal) {
              return time.getTime() < new Date(beginDateVal).getTime()
            }
          }
        },
        //搜索框结果
        selectResult:{
          orderNo:"",
          waybillNo:"",
          customerName:"",
          invoiceTitle:"",
          upload:"",
          invoiceNum:"",
          invoiceType:[""],
          invoicingStatus:[""],
          invoiceStatus:"",
          expressStatus:"",
          startDepartureDate:"",
          endDepartureDate:"",
          startPresentationTime:"",
          endPresentationTime:"",
          startInvoiceApplyTime:"",
          endInvoiceApplyTime:"",
          startInvoicingTime:"",
          endInvoicingTime:"",
        },
        orderNo: null,
        waybillNo: null,
        agentId: null,
        agentOpt: [],
        customerName: null,
        pol: null,
        polOpt: [],
        pod: null,
        podOpt: [],
        financeStatus: '全部',
        airCompanyCode: null,
        orderCount: 0,
        startDepartureDate: null,
        endDepartureDate: null,
        startPresentationTime: null,
        endPresentationTime: null,
        startOrderTime: null,
        endOrderTime: null,
        invoicingStatus: null,
        pscsId: null,
        mscsId: null,
        principalId: null,
        totalApOrgn: null,
        totalArCny: null,
        totalApCny: null,
        totalArOrgn: null,
        orderProfit: null,
        payWay: null,
        orderId: null,
        info:null,
        orderFinanceStatus:null,

        invoiceOpt: [
          {
            Name: '未开票',
            Value: '0'
          },
          {
            Name: '已开票',
            Value: '1'
          },
          {
            Name: '部分开票',
            Value: '2'
          }
        ],
      }
    },
    mounted() {
      // this.initData()
      // this.initOrderCountList()
      // this.initAgentList()
      // this.initAirportSearchByPage()
    },
    methods: {
       //表格选择列显示drawer -全选
       handleCheckAllChange(val) {
        this.checkedTable = val ? this.tableOptions : [];
        this.isIndeterminate = false;
      },
      //tab切换
      tabClickData() {
        // this.initData()
        // this.initOrderCountList()
      },
      detailTabClickData(){
        this.showFees(this.orderId)
      },
      //起始港三字码
      initAirportSearchByPage(keyWord, type) {
        if (!keyWord) {
          keyWord = ''
        }
        this.$http.get(this.$service.airportSearchByPage + '?keyWord=' + keyWord).then((data) => {
          this.loading = false
          if (data.code == 200) {
            if (type == '起始港') {
              this.polOpt = data.data.records
            } else if (type == '目的港') {
              this.podOpt = data.data.records
            } else {
              this.polOpt = data.data.records
              this.podOpt = data.data.records
            }
          } else {
            this.$message.error(data.message)
          }
        })
      },
      polMethod(keyWord) {
        this.loading = true
        this.initAirportSearchByPage(keyWord, '起始港')
      },
      podMethod(keyWord) {
        this.loading = true
        this.initAirportSearchByPage(keyWord, '目的港')
      },
      //代理公司
      initAgentList(agentName) {
        if (!agentName) {
          agentName = ''
        }
        var data = {
          agentName: agentName
        }
        this.$http.post(this.$service.agentList, data).then((data) => {
          this.loading = false
          if (data.code == 200) {
            this.agentOpt = data.data.records
          } else {
            this.$message.error(data.message)
          }
        })
      },
      agentMethod(agentName) {
        this.initAgentList(agentName)
      },
      initOrderCountList() {
      },
      savePresentLog(operationType){
        var json = {
          orderId: this.orderId,
          info: this.info,
          operationType: operationType,
          financeStatus: this.orderFinanceStatus,
        }
        // json = toData(json)
        this.$http.post(this.$service.financeOrderList, json).then(data => {
          if (data.code == 200) {
            this.$message.success("操作成功")
          } else {
            this.$message.error(data.message)
          }
        }).catch((e) => {
          console.log(e)
        })
      },
      showFees(orderId, payWay,financeStatus) {
        this.dialogFormVisible = true;
        this.$http.get(this.$service.orderPriceTable + '?orderId=' + orderId).then(data => {
          if (data.code == 200) {
            // this.total = data.data.total
            this.arData = data.data.arOrderPriceList
            this.apData = data.data.apOrderPriceList
            this.logData = data.data.logs
            this.totalArOrgn = data.data.totalArOrgn
            this.totalApOrgn = data.data.totalApOrgn
            this.totalArCny = data.data.totalArCny
            this.totalApCny = data.data.totalApCny
            this.orderProfit = data.data.orderProfit
            this.payWay = payWay
            this.orderId=orderId
            this.orderFinanceStatus=financeStatus
          } else {
            this.$message.error(data.message)
          }
          console.log(this.arData)
        }).catch((e) => {
          console.log(e)
        })
      },
      handleSelect(val){

        this.detailTabs = val;
      },

      getOrgn(orgn) {
        if (!orgn) {
          return;
        }
        orgn = JSON.parse(orgn);
        var totalOrgn = ''
        var value1 = 0
        var value2 = 0
        var value3 = 0
        var value4 = 0
        var value5 = 0
        // HK$ $ € ￡
        for (var i = 0; i < orgn.length; i++) {
          if (orgn[i].currency == '1') {
            value1 += orgn[i].amount
          } else if (orgn[i].currency == '2') {
            value2 += orgn[i].amount
          } else if (orgn[i].currency == '3') {
            value3 += orgn[i].amount
          } else if (orgn[i].currency == '4') {
            value4 += orgn[i].amount
          } else if (orgn[i].currency == '5') {
            value5 += orgn[i].amount
          }
        }
        totalOrgn = ''
        totalOrgn += value1 || value1 == 0 ? value1 + 'CNY' + '+' : ''
        totalOrgn += value2 ? value2 + 'HKD' + '+' : ''
        totalOrgn += value3 ? value3 + 'USD' + '+' : ''
        totalOrgn += value4 ? value4 + 'EUR' + '+' : ''
        totalOrgn += value5 ? value5 + 'GBP' : ''
        totalOrgn = totalOrgn.substring(0, totalOrgn.length - 1)
        return totalOrgn;
      },
      getExchangeRate(exchangeRate) {
        var totalOrgn = ''
        var value1 = 0
        var value2 = 0
        var value3 = 0
        var value4 = 0
        var value5 = 0
        for (var i = 0; i < exchangeRate.length; i++) {
          if (exchangeRate[i].currency == '1') {
            value1 += exchangeRate[i].exchangeRate
          } else if (exchangeRate[i].currency == '2') {
            value2 += exchangeRate[i].exchangeRate
          } else if (exchangeRate[i].currency == '3') {
            value3 += exchangeRate[i].exchangeRate
          } else if (exchangeRate[i].currency == '4') {
            value4 += exchangeRate[i].exchangeRate
          } else if (exchangeRate[i].currency == '5') {
            value5 += exchangeRate[i].exchangeRate
          }
        }
        totalOrgn = ''
        totalOrgn += value1 || value1 == 0 ? 'CNY:' + value1 + '+' : ''
        totalOrgn += value2 ? 'HKD:' + value2 + '+' : ''
        totalOrgn += value3 ? 'USD:' + value3 + '+' : ''
        totalOrgn += value4 ? 'EUR:' + value4 + '+' : ''
        totalOrgn += value5 ? 'GBP:' + value5 : ''
        totalOrgn = totalOrgn.substring(0, totalOrgn.length - 1)
        return totalOrgn;
      },
      //航线列表
      initData() {
        var json = {
          orderNo: this.orderNo,
          waybillNo: this.waybillNo,
          customerName: this.customerName,
          agentId: this.agentId,
          airCompanyCode: this.airCompanyCode,
          startDepartureDate: this.startDepartureDate,
          endDepartureDate: this.endDepartureDate,
          startPresentationTime: this.startPresentationTime,
          endPresentationTime: this.endPresentationTime,
          startOrderTime: this.startOrderTime,
          endOrderTime: this.endOrderTime,
          financeStatus: this.financeStatus == '全部' ? null : this.financeStatus,
          pol: this.pol,
          pod: this.pod,
          invoicingStatus: this.invoicingStatus,
          pscsId: this.pscsId,
          mscsId: this.mscsId,
          principalId: this.principalId,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
        // json = toData(json)
        this.$http.post(this.$service.financeOrderList, json).then(data => {
          if (data.code == 200) {
            this.total = data.data.total
            this.tableData = data.data.records
          } else {
            this.$message.error(data.message)
          }
        }).catch((e) => {
          console.log(e)
        })
      },
      //查询
      searchClick() {
        this.pageSize = 10
        this.pageNum = 1
        this.initData()
        this.initOrderCountList()
      },
      //重置
      restClick() {
        this.orderNo = ''
        this.waybillNo = ''
        this.inboundNo = ''
        this.pol = ''
        this.pod = ''
        this.agentId = ''
        this.customerName = ''
        this.pageNum = 1
        this.pageSize = 10
        this.initData()
        this.initOrderCountList()
      },
      handleCurrentChange(e) {
        this.pageNum = e
        this.initData()
      },
      handleSizeChange(e) {
        this.pageSize = e
        this.initData()
      },
    },
    watch: {
      tableData(idx) {
        return idx
      }
    },
    components: {
      Table
    }
  }
</script>


<style scoped lang="less">
  @import url("../../assets/icon/iconfont.css");
.operateButton {
    display:flex;
    justify-content: flex-end;
    margin-bottom:-10px;
    button {
      margin:0px 10px 20px 10px;
    }
  }
  .content-wrapper {
    width: 100%;
    box-sizing: border-box;
    /*height: 100%;*/
    padding: 20px;
    overflow: hidden;
    background-color: #f3f6f9 !important;
  }

  .el-form {
    background-color: #FFF;
  }

  .el-form--inline .el-form-item {
    margin-bottom: 20px;
    margin-right:0px;
    vertical-align: bottom;
  }

  .parimary_btn {
    background-color: #9ac143 !important;
    border-color: #9ac143 !important;

    &:hover {
      color: #f1e3d5 !important;
      background-color: #7f9e3c !important;
      border-color: #7f9e3c !important;
    }
  }

  .icon-shouqi {
    color: #3985ca;
    margin-right: 2px;
    font-size: 14px;
    margin-left: 15px;
  }

  .shouqi {
    cursor: pointer;
    color: #3985ca;
    position: relative;
  }

  .shouqi .iconfont {
    font-size: 2px;
    position: absolute;
    height: 20px;
    line-height: 20px;
    margin-top: 7px;
    margin-left: 10px;
  }

  .wrapper, .content {
    width: 100%;
  }

  .el-table .sort-caret.ascending {
    border-bottom-color: #FFF;
  }

  .content-search-normal {
    padding: 20px 20px 0 20px !important;
    background: #fff;
    .formItem{
      width: 320px;
      margin-top:-5px;
    }
  }

  .content-search-high {
    padding: 0 0 20px 30px;
  }

  /deep/ .el-dialog {
    min-width: 480px;
    border-radius: 6px;
  }
</style>
