<template>
  <div class="content-wrapper">
    <div class="content">
      <el-form :inline="true" size="medium" class="demo-form-inline">
        <div class="content-search-normal">
          <el-form-item>
            <el-input v-model="orderNo" style="width: 200px;" size="medium" :maxlength="inputMax" clearable placeholder="请输入订单号"></el-input>
          </el-form-item>

          <el-form-item>
            <el-input v-model="waybillNo" style="width: 200px;" size="medium" :maxlength="inputMax" clearable placeholder="请输入运单号"></el-input>
          </el-form-item>

          <el-form-item>
            <el-input v-model="inboundNo" style="width: 200px;" size="medium" :maxlength="inputMax" clearable placeholder="请输入订舱客户"></el-input>
          </el-form-item>

          <el-form-item>
            <el-input v-model="inboundNo" style="width: 200px;" size="medium" :maxlength="inputMax" clearable placeholder="请输入代理上家"></el-input>
          </el-form-item>

          <el-form-item>
            <el-select v-model="agentId" placeholder="请输入航司" :remote-method="agentMethod" :loading="loading" clearable filterable remote reserve-keyword style="width: 200px;">
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
            <el-select v-model="pol" placeholder="起运港三字码" :remote-method="polMethod" :loading="loading" clearable filterable remote reserve-keyword style="width: 200px;">
              <el-option
                v-for="(item,index) in polOpt"
                :disabled="pod == item.threeLetterCode"
                :key="item.threeLetterCode"
                :value="item.threeLetterCode">
                <span>{{item.threeLetterCode}}</span>
                <span style="margin-left: 5px;">{{item.name}}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select v-model="pod" placeholder="目的港三字码" :remote-method="podMethod" :loading="loading" clearable filterable remote reserve-keyword style="width: 200px;">
              <el-option
                v-for="item in podOpt"
                :disabled="pol == item.threeLetterCode"
                :key="item.threeLetterCode"
                :value="item.threeLetterCode">
                <span>{{item.threeLetterCode}}</span>
                <span style="margin-left: 5px;">{{item.name}}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select v-model="agentId" placeholder="开票进度" :remote-method="agentMethod" :loading="loading" clearable filterable remote reserve-keyword style="width: 200px;">
              <el-option
                v-for="item in agentOpt"
                :key="item.id"
                :label="item.agentName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select v-model="agentId" placeholder="请输入客服" :remote-method="agentMethod" :loading="loading" clearable filterable remote reserve-keyword style="width: 200px;">
              <el-option
                v-for="item in agentOpt"
                :key="item.id"
                :label="item.agentName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="agentId" placeholder="请输入销售" :remote-method="agentMethod" :loading="loading" clearable filterable remote reserve-keyword style="width: 200px;">
              <el-option
                v-for="item in agentOpt"
                :key="item.id"
                :label="item.agentName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="agentId" placeholder="请输入航线" :remote-method="agentMethod" :loading="loading" clearable filterable remote reserve-keyword style="width: 200px;">
              <el-option
                v-for="item in agentOpt"
                :key="item.id"
                :label="item.agentName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="agentId" placeholder="请输入操作" :remote-method="agentMethod" :loading="loading" clearable filterable remote reserve-keyword style="width: 200px;">
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
      <el-tabs class="nth9_class" v-model="typeCode" type="border-card" @tab-click="tabClickData">
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
              <el-table-column prop="date1" label="订单号" min-width="80"></el-table-column>
              <el-table-column prop="date2" label="运单号" min-width="80"></el-table-column>
              <el-table-column prop="date3" label="航班日期" min-width="80"></el-table-column>
              <el-table-column prop="date4" label="交单时间" min-width="80"></el-table-column>
              <el-table-column prop="date5" label="订舱客户" min-width="80"></el-table-column>
              <el-table-column prop="date6" label="代理上家" min-width="80"></el-table-column>
              <el-table-column prop="date7" label="航司" width="50"></el-table-column>
              <el-table-column prop="date8" label="起运港" width="60"></el-table-column>
              <el-table-column prop="date9" label="目的港" width="60"></el-table-column>
              <el-table-column label="货物信息" min-width="80">
                <template slot-scope="scope">
                  <div>发动机</div>
                  <div>1PCS</div>
                  <div>20CBM</div>
                  <div>500KGS</div>
                  <div>1:25</div>
                </template>
              </el-table-column>
              <el-table-column label="操作人员" min-width="80">
                <template slot-scope="scope">
                  <div>客服：张三</div>
                  <div>销售：李四</div>
                  <div>航线：王五</div>
                  <div>操作：赵六</div>
                </template>
              </el-table-column>
              <el-table-column label="应收金额">
                <el-table-column prop="date12" label="人民币" min-width="80"></el-table-column>
                <el-table-column prop="date13" label="原币" min-width="80"></el-table-column>
              </el-table-column>
              <el-table-column label="应付金额">
                <el-table-column prop="date14" label="人民币" min-width="80"></el-table-column>
                <el-table-column prop="date15" label="原币" min-width="80"></el-table-column>
              </el-table-column>
              <el-table-column prop="date16" label="利润" min-width="150"></el-table-column>
              <el-table-column prop="date17" label="汇率" width="50"></el-table-column>
              <el-table-column prop="date18" label="开票进度" min-width="80"></el-table-column>
              <el-table-column prop="date19" label="开票金额" min-width="80"></el-table-column>
              <el-table-column prop="date20" label="订单状态" min-width="80"></el-table-column>
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
        <el-tab-pane label="未交单" name="2">
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
        <el-tab-pane label="修改申请" name="3">
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
        <el-tab-pane label="修改审核" name="4">
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
        <el-tab-pane label="异常" name="5">
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
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="活动名称">
          <el-input autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Table from '@/components/financeTable'
  import { toData } from '@/util/assist'
  export default {
    data() {
      return {
        dialogFormVisible: false,
        //table
        tableData: [
          {
            date1: 'T21082416088448',
            date2: '123-12345679',
            date3: '2021-09-04',
            date4: '2021-09-04',
            date5: '石家庄XXX有限公司',
            date6: '上海XXX运输有限公司',
            date7: 'QW',
            date8: 'CLT',
            date9: 'SZX',
            date10: '发动机',
            date11: '张三（上海）',
            date12: '200',
            date13: '200CNY',
            date14: '100',
            date15: '100CNY',
            date16: '100',
            date17: '1',
            date18: '部分开',
            date19: '100',
            date20: '正常'
          },
          {
            date1: 'T21082416088448',
            date2: '123-12345679',
            date3: '2021-09-04',
            date4: '2021-09-04',
            date5: '石家庄XXX有限公司',
            date6: '上海ZXC运输有限公司',
            date7: 'QW',
            date8: 'CLT',
            date9: 'SZX',
            date10: '发动机',
            date11: '张三（上海）',
            date12: '200',
            date13: '200CNY',
            date14: '100',
            date15: '100CNY',
            date16: '100',
            date17: '1',
            date18: '部分开',
            date19: '100',
            date20: '修改审核'
          },
          {
            date1: 'T21082416088448',
            date2: '123-12345679',
            date3: '2021-09-04',
            date4: '2021-09-04',
            date5: '石家庄XXX有限公司',
            date6: '上海AQS运输有限公司',
            date7: 'QW',
            date8: 'CLT',
            date9: 'SZX',
            date10: '发动机',
            date11: '张三（上海）',
            date12: '200',
            date13: '200CNY',
            date14: '100',
            date15: '100CNY',
            date16: '100',
            date17: '1',
            date18: '部分开',
            date19: '100',
            date20: '修改申请'
          }
        ],
        pageSize: 10,
        pageNum: 1,
        total: 0,
        // 列
        columns: [
          {label: '航线', prop: 'orderNo', show: true, width: '150'},
          {label: '货物信息', prop: 'airCompanyCode', show: true, width: '100'},
          {label: '账单信息', prop: 'pol', show: true, width: '150'},
          {label: '操作人员', prop: 'pod', show: true, width: '100'},
          {label: '状态', prop: 'continent', show: true, width: '100'},
          {label: '下单时间', prop: 'nonStop', show: true, width: '100'},
          {label: '备注', prop: 'legCount', show: true, width: '50'}
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
        orderNo: '',
        waybillNo: '',
        inboundNo: '',
        agentId: '',
        agentOpt: [],
        customerName: '',
        pol: '',
        polOpt: [],
        pod: '',
        podOpt: [],
        typeCode: '全部',
        orderCount: 0
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
      //详情
      orderDetails(scope) {
        if(scope.row.status == '3' || scope.row.status == '5'){
          this.$router.push({
            path: '/orderManagement/orderDetails1',
            query: {
              id: scope.row.id
            }
          })
        }else if(scope.row.status == '9'){
          this.$router.push({
            path: '/orderManagement/orderDetails2',
            query: {
              id: scope.row.id
            }
          })
        }else if(scope.row.status == '13' || scope.row.status == '17' || scope.row.status == '21'){
          this.$router.push({
            path: '/orderManagement/orderDetails3',
            query: {
              id: scope.row.id
            }
          })
        }else if(scope.row.status == '25' || scope.row.status == '27' || scope.row.status == '29' || scope.row.status == '31' || scope.row.status == '33'){
          this.$router.push({
            path: '/orderManagement/orderDetails4',
            query: {
              id: scope.row.id
            }
          })
        }else if(scope.row.status == '37' || scope.row.status == '41'){
          this.$router.push({
            path: '/orderManagement/orderDetails5',
            query: {
              id: scope.row.id
            }
          })
        }else if(scope.row.status == '43'){
          this.$router.push({
            path: '/orderManagement/orderDetails6',
            query: {
              id: scope.row.id
            }
          })
        }else if(scope.row.status == '39'){
          this.$router.push({
            path: '/orderManagement/orderDetails7',
            query: {
              id: scope.row.id
            }
          })
        }
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
        var json = {
        	orderNo: this.orderNo,
        	waybillNo: this.waybillNo,
        	inboundNo: this.inboundNo,
        	pol: this.pol,
        	pod: this.pod,
        	agentId: this.agentId,
          customerName: this.customerName,
        	typeCode: 8
        }
        json = toData(json)
        this.$http.get(this.$service.orderCountList+'?'+json).then(data => {
          if (data.code == 200) {
            this.orderCount = data.data
          }else {
            this.$message.error(data.message)
          }
        }).catch((e) => {
          console.log(e)
        })
      },
      //航线列表
      initData() {
        var json = {
        	orderNo: this.orderNo,
        	waybillNo: this.waybillNo,
        	inboundNo: this.inboundNo,
        	pol: this.pol,
        	pod: this.pod,
        	agentId: this.agentId,
          customerName: this.customerName,
        	typeCode: this.typeCode == '全部订单' ? '' : this.typeCode,
        	pageNum: this.pageNum,
        	pageSize: this.pageSize
        }
        json = toData(json)
        this.$http.get(this.$service.orderSearchByPage+'?'+json).then(data => {
          if (data.code == 200) {
            this.total = data.data.total
            this.tableData = data.data.records
          }else {
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

  .wrapper,.content {
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
