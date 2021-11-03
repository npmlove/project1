<template>
  <div class="content-wrapper">
    <div class="content">
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
          <!--          <el-form-item>-->
          <!--            <el-select v-model="agentId" placeholder="请输入操作" :remote-method="agentMethod" :loading="loading" clearable-->
          <!--                       filterable remote reserve-keyword style="width: 200px;">-->
          <!--              <el-option-->
          <!--                v-for="item in agentOpt"-->
          <!--                :key="item.id"-->
          <!--                :label="item.agentName"-->
          <!--                :value="item.id">-->
          <!--              </el-option>-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->


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
          <el-table
            :data="tableData"
            border
            stripe
            header
            class="finance-talbe"
            style="width: 100%">
            <template slot="empty">
              <img class="data-pic" src="../../assets/kong-icon.png"/>
              <p>暂无数据</p>
            </template>
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column label="订单号" min-width="120">
              <template slot-scope="scope">
                <a  @click="showFeesDetail=true">{{ scope.row.orderNo }}</a>
              </template>
            </el-table-column>
            <el-table-column prop="waybillNo" label="运单号" min-width="80"></el-table-column>
            <el-table-column prop="departureDate" label="航班日期" min-width="80"></el-table-column>
            <el-table-column prop="presentationTime" label="交单时间" min-width="80"></el-table-column>
            <el-table-column prop="customerName" label="订舱客户" min-width="80"></el-table-column>
            <el-table-column prop="agentName" label="代理上家" min-width="80"></el-table-column>
            <el-table-column prop="airCompanyCode" label="航司" width="50"></el-table-column>
            <el-table-column prop="pol" label="起运港" width="60"></el-table-column>
            <el-table-column prop="pod" label="目的港" width="60"></el-table-column>
            <el-table-column label="货物信息" min-width="80">
              <template slot-scope="scope">
                <div>{{ scope.row.cargoInfo.split(",")[0] }}</div>
                <div>{{ scope.row.cargoInfo.split(",")[1] }}PCS</div>
                <div>{{ scope.row.cargoInfo.split(",")[2] }}CBM</div>
                <div>{{ scope.row.cargoInfo.split(",")[3] }}KGS</div>
                <div>1:{{ scope.row.cargoInfo.split(",")[4] }}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作人员" min-width="80">
              <template slot-scope="scope">
                <div>客服：{{ scope.row.operator.split(",")[1] }}</div>
                <div>销售：{{ scope.row.operator.split(",")[0] }}</div>
                <div>航线：{{ scope.row.operator.split(",")[2] }}</div>
                <!--                  <div>操作：{{scope.row.operator.split(",")[0]}}</div>-->
              </template>
            </el-table-column>
            <el-table-column label="应收金额">
              <el-table-column prop="totalArCny" label="人民币" min-width="80"></el-table-column>
              <el-table-column prop="totalArOrgn" label="原币" min-width="80"></el-table-column>
            </el-table-column>
            <el-table-column label="应付金额">
              <el-table-column prop="totalApCny" label="人民币" min-width="80"></el-table-column>
              <el-table-column prop="totalApOrgn" label="原币" min-width="80"></el-table-column>
            </el-table-column>
            <el-table-column prop="orderProfit" label="利润" min-width="150"></el-table-column>
            <el-table-column prop="operator" label="汇率" width="50"></el-table-column>
            <el-table-column prop="invoicingStatus" label="开票进度" min-width="80"></el-table-column>
            <el-table-column prop="invoicedAmount" label="开票金额" min-width="80"></el-table-column>
            <el-table-column prop="financeStatus" label="订单状态" min-width="80"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="已交单" name="1">
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
    </div>
    <el-dialog title="订单" :visible.sync="dialogFormVisible" width="80%">
      <el-tabs style="margin: 20px 0;" v-model="financeStatus" type="border-card" @tab-click="tabClickData">
        <el-tab-pane label="全部" name="全部">
          <div style="font-size: 18px;font-weight: 100;color: #333;padding: 0 20px 10px 20px;">应收账单</div>
          <Table
            :tableData='tableData'
            :columns='columns1'
            :operation='operation'
            :total='total'
            :currentPage='pageNum'
            :pageSize='pageSize'
            @orderDetails="orderDetails"
            @sizeChange='handleSizeChange'
            @currentChange='handleCurrentChange'>
          </Table>
          <div class="finance-table-price">
            <div>账单合计：￥7000+$600</div>
            <div>人民币合计：￥8625.5</div>
            <div>结算方式：付款买单</div>
          </div>
          <div style="font-size: 18px;font-weight: 100;color: #333;padding: 10px 20px 10px 20px;">应付账单</div>
          <Table
            :tableData='tableData'
            :columns='columns2'
            :operation='operation'
            :total='total'
            :currentPage='pageNum'
            :pageSize='pageSize'
            @orderDetails="orderDetails"
            @sizeChange='handleSizeChange'
            @currentChange='handleCurrentChange'>
          </Table>
          <div class="finance-table-price">
            <div>账单合计：￥7000+$600</div>
            <div>人民币合计：￥8625.5</div>
            <div>订单利润：100</div>
          </div>
          <div style="font-size: 18px;font-weight: 100;color: #333;padding: 10px 20px 10px 20px;">修改记录</div>
          <Table
            :tableData='tableData'
            :columns='columns3'
            :operation='operation'
            :total='total'
            :currentPage='pageNum'
            :pageSize='pageSize'
            @orderDetails="orderDetails"
            @sizeChange='handleSizeChange'
            @currentChange='handleCurrentChange'>
          </Table>
          <div
            style="font-size: 18px;font-weight: 100;color: #333;padding: 10px 20px 10px 20px;border-bottom: 1px dashed #999;">
            操作说明
          </div>
          <el-input
            type="textarea"
            rows="2"
            placeholder="请输入操作说明"
            v-model="textarea2">
          </el-input>
        </el-tab-pane>
        <el-tab-pane label="已交单" name="1">
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">返 回</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确认解锁</el-button>
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
        dialogFormVisible: false,
        showFeesDetail: false,
        //table
        tableData: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
        // 列
        /*        columns: [
                  {label: '订单号', prop: 'orderNo', show: true, width: '150'},
                  {label: '运单号', prop: 'waybillNo', show: true, width: '150'},
                  {label: '航班日期', prop: 'departureDate', show: true, width: '150'},
                  {label: '交单时间', prop: 'presentationTime', show: true, width: '150'},
                  {label: '订舱客户', prop: 'customerName', show: true, width: '150'},
                  {label: '代理上家', prop: 'agentName', show: true, width: '150'},
                  {label: '航司', prop: 'airCompanyCode', show: true, width: '150'},
                  {label: '起运港', prop: 'pol', show: true, width: '150'},
                  {label: '目的港', prop: 'pod', show: true, width: '150'},
                  {label: '货物信息', prop: 'cargoInfo', show: true, width: '150'},
                  {label: '操作人员', prop: 'operator', show: true, width: '150'},
                  {label: '应收费用总计', prop: 'totalArCny', show: true, width: '150'},
                  {label: '应付账单总计', prop: 'totalApCny', show: true, width: '150'},
                  {label: '应收费用总计', prop: 'totalArOrgn', show: true, width: '150'},
                  {label: '应付费用总计', prop: 'totalApOrgn', show: true, width: '150'},
                  {label: '订单利润', prop: 'orderProfit', show: true, width: '150'},
                  //TODO
                  {label: '汇率', prop: 'operator', show: true, width: '150'},
                  {label: '开票进度', prop: 'invoicingStatus', show: true, width: '150'},



                ],*/
        columns1: [
          {label: '序号', prop: 'orderNo', show: true, width: '150'},
          {label: '费用名称', prop: 'airCompanyCode', show: true, width: '100'},
          {label: '收款单位', prop: 'pol', show: true, width: '150'},
          {label: '单价', prop: 'pod', show: true, width: '100'},
          {label: '数量', prop: 'continent', show: true, width: '100'},
          {label: '币种', prop: 'nonStop', show: true, width: '100'},
          {label: '原币合计', prop: 'legCount', show: true, width: '50'},
          {label: '汇率', prop: 'continent', show: true, width: '100'},
          {label: '人民币合计', prop: 'nonStop', show: true, width: '100'},
          {label: '备注', prop: 'legCount', show: true, width: '50'}
        ],
        columns2: [
          {label: '序号', prop: 'orderNo', show: true, width: '150'},
          {label: '费用名称', prop: 'airCompanyCode', show: true, width: '100'},
          {label: '付款单位', prop: 'pol', show: true, width: '150'},
          {label: '单价', prop: 'pod', show: true, width: '100'},
          {label: '数量', prop: 'continent', show: true, width: '100'},
          {label: '币种', prop: 'nonStop', show: true, width: '100'},
          {label: '原币合计', prop: 'legCount', show: true, width: '50'},
          {label: '汇率', prop: 'continent', show: true, width: '100'},
          {label: '人民币合计', prop: 'nonStop', show: true, width: '100'},
          {label: '备注', prop: 'legCount', show: true, width: '50'}
        ],
        columns3: [
          {label: '操作类型', prop: 'orderNo', show: true, width: '150'},
          {label: '说明', prop: 'airCompanyCode', show: true, width: '100'},
          {label: '操作时间', prop: 'pol', show: true, width: '150'},
          {label: '操作人', prop: 'pod', show: true, width: '100'}
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
