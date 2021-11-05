<template>
  <div class="content-wrapper">
    <div class="content" style="position: relative;">
      <el-form :inline="true" size="medium" class="demo-form-inline">
        <div class="content-search-normal">
          <el-form-item>
            <el-input v-model="orderNo" style="width: 200px;" size="medium" :maxlength="inputMax" clearable
                      placeholder="请输入订单号"></el-input>
          </el-form-item>

          <el-form-item>
            <el-input v-model="waybillNo" style="width: 200px;" size="medium" :maxlength="inputMax" clearable
                      placeholder="请输入运单号"></el-input>
          </el-form-item>

          <el-form-item>
            <el-input v-model="inboundNo" style="width: 200px;" size="medium" :maxlength="inputMax" clearable
                      placeholder="请输入订舱客户"></el-input>
          </el-form-item>

          <el-form-item>
            <el-input v-model="inboundNo" style="width: 200px;" size="medium" :maxlength="inputMax" clearable
                      placeholder="请输入代理上家"></el-input>
          </el-form-item>

          <el-form-item>
            <el-select v-model="agentId" placeholder="请输入航司" :remote-method="agentMethod" :loading="loading" clearable
                       filterable remote reserve-keyword style="width: 200px;">
              <el-option
                v-for="item in agentOpt"
                :key="item.id"
                :label="item.agentName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-date-picker
              type="daterange"
              range-separator="至"
              start-placeholder="航班开始日期"
              end-placeholder="航班结束日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-date-picker
              type="daterange"
              range-separator="至"
              start-placeholder="交单开始日期"
              end-placeholder="交单结束日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-select v-model="pol" placeholder="起运港三字码" :remote-method="polMethod" :loading="loading" clearable
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

          <el-form-item>
            <el-select v-model="pod" placeholder="目的港三字码" :remote-method="podMethod" :loading="loading" clearable
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

          <el-form-item>
            <el-select v-model="agentId" placeholder="开票进度" :remote-method="agentMethod" :loading="loading" clearable
                       filterable remote reserve-keyword style="width: 200px;">
              <el-option
                v-for="item in agentOpt"
                :key="item.id"
                :label="item.agentName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select v-model="agentId" placeholder="请输入客服" :remote-method="agentMethod" :loading="loading" clearable
                       filterable remote reserve-keyword style="width: 200px;">
              <el-option
                v-for="item in agentOpt"
                :key="item.id"
                :label="item.agentName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="agentId" placeholder="请输入销售" :remote-method="agentMethod" :loading="loading" clearable
                       filterable remote reserve-keyword style="width: 200px;">
              <el-option
                v-for="item in agentOpt"
                :key="item.id"
                :label="item.agentName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="agentId" placeholder="请输入航线" :remote-method="agentMethod" :loading="loading" clearable
                       filterable remote reserve-keyword style="width: 200px;">
              <el-option
                v-for="item in agentOpt"
                :key="item.id"
                :label="item.agentName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>


          <el-form-item>
            <el-row>
              <el-button @click="searchClick" size="medium" type="primary" icon="el-icon-search">查询</el-button>
              <el-button @click="restClick" size="medium" type="primary">清空</el-button>
            </el-row>
          </el-form-item>
        </div>
      </el-form>
      <el-tabs class="nth9_class" v-model="financeStatus" type="border-card" @tab-click="tabClickData">
        <el-tab-pane label="全部" name="全部">
          <Table
            :tableData='tableData'
            :columns='columns'
            :operation='operation'
            :total='total'
            :currentPage='pageNum'
            :pageSize='pageSize'
            @showFees="showFees"
            @sizeChange='handleSizeChange'
            @currentChange='handleCurrentChange'>
          </Table>
        </el-tab-pane>
        <el-tab-pane label="已交单" name="1">
          <Table
            :tableData='tableData'
            :columns='columns'
            :operation='operation'
            :total='total'
            :currentPage='pageNum'
            :pageSize='pageSize'
            @showFees="showFees"
            @sizeChange='handleSizeChange'
            @currentChange='handleCurrentChange'>
          </Table>
        </el-tab-pane>
        <el-tab-pane label="未交单" name="0">
          <Table
            :tableData='tableData'
            :columns='columns'
            :operation='operation'
            :total='total'
            :currentPage='pageNum'
            :pageSize='pageSize'
            @orderDetails="orderDetails"
            @sizeChange='handleSizeChange'
            @currentChange='handleCurrentChange'>
          </Table>
        </el-tab-pane>
        <el-tab-pane label="修改申请" name="2">
          <Table
            :tableData='tableData'
            :columns='columns'
            :operation='operation'
            :total='total'
            :currentPage='pageNum'
            :pageSize='pageSize'
            @orderDetails="orderDetails"
            @sizeChange='handleSizeChange'
            @currentChange='handleCurrentChange'>
          </Table>
        </el-tab-pane>
        <el-tab-pane label="修改中" name="5">
          <Table
            :tableData='tableData'
            :columns='columns'
            :operation='operation'
            :total='total'
            :currentPage='pageNum'
            :pageSize='pageSize'
            @orderDetails="orderDetails"
            @sizeChange='handleSizeChange'
            @currentChange='handleCurrentChange'>
          </Table>
        </el-tab-pane>
        <el-tab-pane label="修改审核" name="3">
          <Table
            :tableData='tableData'
            :columns='columns'
            :operation='operation'
            :total='total'
            :currentPage='pageNum'
            :pageSize='pageSize'
            @orderDetails="orderDetails"
            @sizeChange='handleSizeChange'
            @currentChange='handleCurrentChange'>
          </Table>
        </el-tab-pane>
        <el-tab-pane label="异常" name="4">
          <Table
            :tableData='tableData'
            :columns='columns'
            :operation='operation'
            :total='total'
            :currentPage='pageNum'
            :pageSize='pageSize'
            @orderDetails="orderDetails"
            @sizeChange='handleSizeChange'
            @currentChange='handleCurrentChange'>
          </Table>
        </el-tab-pane>
      </el-tabs>
      <el-button size='medium' type="primary" style='position: absolute;right:0px;top:135px;'>导出列表</el-button>
      <el-button size='medium' type="primary" style='position: absolute;right:110px;top:135px;'>修改</el-button>
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
        multipleSelection:[],

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
      this.initData()
      this.initOrderCountList()
      this.initAgentList()
      this.initAirportSearchByPage()
    },
    methods: {
      //tab切换
      tabClickData() {
        this.initData()
        this.initOrderCountList()
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
      selectChange(val){
        this.multipleSelection = val;
        console.log(this.multipleSelection)
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
  }

  .content-search-high {
    padding: 0 0 20px 30px;
  }

  /deep/ .el-dialog {
    min-width: 480px;
    border-radius: 6px;
  }
</style>
