<template>
  <div class="content-wrapper">
    <div class="content">
      <el-form :inline="true" size="medium" class="demo-form-inline" label-position="right">
        <div class="content-search-normal">
          <el-form-item label="订单号" label-width="100px">
            <el-input v-model="selectResult.orderNo" style="width: 200px;" size="medium" maxlength="15" clearable placeholder="请输入订单号"></el-input>
          </el-form-item>

          <el-form-item label="运单号" label-width="100px">
            <el-input v-model="selectResult.waybillNo" style="width: 200px;" size="medium" clearable placeholder="请输入运单号" onkeyup="this.value = this.value.replace(/[^\d]/g,'');" @blur="selectResult.waybillNo = $event.target.value.substr(0,11)"></el-input>
          </el-form-item>

          <el-form-item label="订舱客户" label-width="100px">
            <el-input v-model="selectResult.customerName" style="width: 200px;" size="medium" maxlength="30" clearable placeholder="请输入订舱客户"></el-input>
          </el-form-item>

          <el-form-item label="代理上家" label-width="100px">
           <el-select
              v-model="selectResult.agentId"
              placeholder="请输入代理上家"
              :remote-method="agentMethod"
              :loading="loading"
              clearable
              filterable
              maxlength="30"
              remote
              reserve-keyword
              id="agentId"
              style="width: 200px"
            >
              <el-option
                v-for="item in agentOpt"
                :key="item.id"
                :label="item.agentName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="航司" label-width="100px">
            <el-select v-model="selectResult.airCompanyCode" placeholder="请输入航司" id="airCompany" :remote-method="companyMethod" maxlength="15" :loading="loading" clearable filterable remote reserve-keyword style="width: 200px;">
              <el-option
                v-for="(item,index) in airCompanyCodeOpt"
                :key="index"
                :label="item.name"
                :value="item.airCompanyCode">
                <span>{{ item.airCompanyCode }}</span>
                <span style="margin-left: 5px">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>

        <div style="width:455px" class="formItem">
          <el-form-item label="下单时间:" label-width="100px">
            <el-date-picker
             style="width:165px"
              value-format="yyyy-MM-dd"
              v-model="selectResult.startOrderTime"
              type="date"
              :picker-options="pickerOptionsStartTwo"
              placeholder="选择日期">
            </el-date-picker >-
             <el-date-picker
             style="width:165px"
              value-format="yyyy-MM-dd"
              v-model="selectResult.endOrderTime"
              type="date"
              :picker-options="pickerOptionsEndTwo"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </div>

        <div style="width:455px" class="formItem">
          <el-form-item label="航班日期" label-width="100px">
             <el-date-picker
             style="width:165px"
              value-format="yyyy-MM-dd"
              v-model="selectResult.startDepartureDate"
              type="date"
              :picker-options="pickerOptionsStartOne"
              placeholder="选择日期">
            </el-date-picker >-
             <el-date-picker
             style="width:165px"
              value-format="yyyy-MM-dd"
              v-model="selectResult.endDepartureDate"
              type="date"
              :picker-options="pickerOptionsEndOne"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </div>
         <el-form-item label="售前客服" class="formItem" label-width="100px">
            <el-select
              id="pscsId"
              v-model="selectResult.pscsId"
              placeholder="请输入售前客服"
              :loading="loading"
              clearable
              filterable
              remote
              reserve-keyword
              style="width: 200px"
            >
              <el-option
                v-for="item in payBefore"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="应收核销状态" label-width="100px">
            <el-select v-model="selectResult.rcvWriteOffStatusList" placeholder="应收核销状态" clearable multiple collapse-tags  @change="dealAllChange" style="width: 200px;">
              <el-option
                v-for="(item,index) in writeOffStatus"
                :key="index"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="应付核销状态" label-width="100px">
            <el-select v-model="selectResult.payWriteOffStatusList" placeholder="应付核销状态" clearable multiple collapse-tags  @change="dealAllChange" style="width: 200px;">
              <el-option
                v-for="(item,index) in writeOffStatus"
                :key="index"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="起运港" label-width="100px">
            <el-select v-model="selectResult.pol" placeholder="起运港三字码" id="pol" :remote-method="polMethod" maxlength="15" :loading="loading" clearable filterable remote reserve-keyword style="width: 200px;">
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

          <el-form-item label="目的港" label-width="100px">
            <el-select v-model="selectResult.pod" placeholder="目的港三字码" id="pod" :remote-method="podMethod" maxlength="15" :loading="loading" clearable filterable remote reserve-keyword style="width: 200px;">
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

          <el-form-item label="售中客服" class="formItem" label-width="100px">
            <el-select
              id="mscsId"
              v-model="selectResult.mscsId"
              placeholder="请输入售中客服"
              :loading="loading"
              clearable
              filterable
              remote
              reserve-keyword
              style="width: 200px"
            >
               <el-option
                v-for="item in paying"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="航线:" class="formItem" label-width="80px">
            <el-select
              id="principalId"
              v-model="selectResult.principalId"
              placeholder="请输入航线"
              :loading="loading"
              clearable
              filterable
              remote
              reserve-keyword
              style="width: 200px"
            >
              <el-option
                v-for="item in airManger"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <div class="operateButton">
              <el-button @click="searchClick(true)" size="mini" type="primary" icon="el-icon-search">查询</el-button>
              <el-button @click="restClick" size="mini" type="primary">清空</el-button>
              </div>
                <div class="operateButton">
                  <el-button size='mini' type="primary" @click="exportList">导出列表</el-button>
                  <el-button @click="drawer = true" type="primary" size='mini'>选择表格列</el-button>
                </div>
        </div>
      </el-form>
      <el-tabs class="nth9_class" v-model="typeCode" type="border-card" @tab-click="tabClickData" value="可操作">
        <el-tab-pane v-for="(item,index) in tabName" :key="index" :label="item+'('+tabNum[index]+')'" :name="item">
           <el-table
            :data="tableData"
            ref="multipleTable"
            border
            stripe
            header
            class="finance-table"
            :cell-style="tableRowClassName"
            @selection-change="handleSelectionChange"
            style="width: 100%"
          >
            <template slot="empty">
              <img class="data-pic" src="../../assets/kong-icon.png" />
              <p>暂无数据</p>
            </template>
            <el-table-column
              type="selection"
              width="40"
              label="序号"
              fixed="left"
              :selectable="ifDisabled"
              v-if="checkedTable.indexOf('序号') !== -1"
            ></el-table-column>
            <el-table-column
              prop="orderNo"
              label="订单号"
              min-width="160"
              type=""
              v-if="checkedTable.indexOf('订单号') !== -1"
            >
            <template slot-scope="scope">
              <div @click="showData(scope.row.id)" style="color:skyBlue;cursor:pointer">
                {{scope.row.orderNo}}
              </div>
            </template>
            </el-table-column>
            <el-table-column
              prop="waybillNo"
              label="运单号"
              min-width="160"
              type=""
              v-if="checkedTable.indexOf('运单号') !== -1"
            ></el-table-column>
            <el-table-column
              prop="customerName"
              label="订舱客户"
              min-width="100"
              type=""
              v-if="checkedTable.indexOf('订舱客户') !== -1"
            ></el-table-column>
            <el-table-column
              prop="departureDate"
              label="航班日期"
              min-width="100"
              type=""
              v-if="checkedTable.indexOf('航班日期') !== -1"
            ></el-table-column>
            <el-table-column
              prop="presentationTime"
              label="交单时间"
              min-width="100"
              type=""
              v-if="checkedTable.indexOf('交单时间') !== -1"
            ></el-table-column>

            <el-table-column
              prop="agentName"
              label="代理上家"
              min-width="160"
              type=""
              v-if="checkedTable.indexOf('代理上家') !== -1"
            ></el-table-column>
            <el-table-column
              prop="airCompanyCode"
              label="航司"
              min-width="160"
              type=""
              v-if="checkedTable.indexOf('航司') !== -1"
            ></el-table-column>
            <el-table-column
              prop="pol"
              label="起运港"
              min-width="160"
              type=""
              v-if="checkedTable.indexOf('起运港') !== -1"
            ></el-table-column>
            <el-table-column
              prop="pod"
              label="目的港"
              min-width="160"
              type=""
              v-if="checkedTable.indexOf('目的港') !== -1"
            ></el-table-column>
             <el-table-column
              prop="cargoInfo"
              label="货物信息"
              min-width="140"
              type=""
              v-if="checkedTable.indexOf('货物信息') !== -1"
            >
              <template slot-scope="scope">
               <span>
                 <div>{{ scope.row.cargoInfo.split(",")[0] }}</div>
                  <div>{{ scope.row.cargoInfo.split(",")[1] }}PCS</div>
                  <div>{{ scope.row.cargoInfo.split(",")[2] }}CBM</div>
                  <div>{{ scope.row.cargoInfo.split(",")[3] }}KGS</div>
                  <div>1:{{ scope.row.cargoInfo.split(",")[4] }}</div>
               </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="operator"
              label="操作人员"
              min-width="160"
              type=""
              v-if="checkedTable.indexOf('操作人员') !== -1"
            >
            <template slot-scope="scope">
              <span>
                <div>客服：{{ scope.row.operator.split(",")[1] }}</div>
                <div>销售：{{ scope.row.operator.split(",")[0] }}</div>
                <div>航线：{{ scope.row.operator.split(",")[2] }}</div>
              </span>
            </template>
            </el-table-column>
            <el-table-column
              label="应收金额"
              v-if="checkedTable.indexOf('应收金额') !== -1"
            >
              <el-table-column prop="totalArCny" label="人民币" width="120">
              </el-table-column>
              <el-table-column label="原币" width="120">
                <template slot-scope="scope">
                  <div v-html="dealOrgn(scope.row.totalArOrgn)" style="white-space:pre-wrap"></div>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column
              label="应收已核销金额"
              v-if="checkedTable.indexOf('应收已核销金额') !== -1"
            >
              <el-table-column prop="totalRcWoCny" label="人民币" width="120">
              </el-table-column>
              <el-table-column label="原币" width="120">
                 <template slot-scope="scope">
                  <div v-html="dealOrgn(scope.row.totalRcWoOrgn)" style="white-space:pre-wrap"></div>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column
              label="应收未核销金额"
              v-if="checkedTable.indexOf('应收未核销金额') !== -1"
            >
              <el-table-column prop="totalRcUnwoCny" label="人民币" width="120">
              </el-table-column>
              <el-table-column label="原币" width="120">
                 <template slot-scope="scope">
                  <div v-html="dealOrgn(scope.row.totalRcUnwoOrgn)" style="white-space:pre-wrap"></div>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column
              label="应付金额"
              v-if="checkedTable.indexOf('应付金额') !== -1"
            >
              <el-table-column prop="totalApCny" label="人民币" width="120">
              </el-table-column>
              <el-table-column prop="city" label="原币" width="120">
                 <template slot-scope="scope">
                  <div v-html="dealOrgn(scope.row.totalApOrgn)" style="white-space:pre-wrap"></div>
                </template>
              </el-table-column>
            </el-table-column>
             <el-table-column
              label="应付已核销金额"
              v-if="checkedTable.indexOf('应付已核销金额') !== -1"
            >
              <el-table-column prop="totalApWoCny" label="人民币" width="120">
              </el-table-column>
              <el-table-column label="原币" width="120">
                 <template slot-scope="scope">
                  <div v-html="dealOrgn(scope.row.totalApWoOrgn)" style="white-space:pre-wrap"></div>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column
              label="应付未核销金额"
              v-if="checkedTable.indexOf('应付未核销金额') !== -1"
            >
              <el-table-column prop="totalApUnwoCny" label="人民币" width="120">
              </el-table-column>
              <el-table-column label="原币" width="120">
                 <template slot-scope="scope">
                  <div v-html="dealOrgn(scope.row.totalApUnwoOrgn)" style="white-space:pre-wrap"></div>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column
              prop="orderProfit"
              label="利润"
              min-width="80"
              v-if="checkedTable.indexOf('利润') !== -1"
            ></el-table-column>
          </el-table>
          <div>
            <div>
              <el-button size="mini" class="pageSkip"><el-checkbox v-model="pageSkipChecked" @change="selectAllTable">跨页全选</el-checkbox></el-button>
              <el-button type="primary" size="mini" @click="getStatistData"
                >数据统计</el-button
              >
              <div v-if="statistDataShow" style="margin-top:15px">
                <div style="display:flex;" class="allStatist">
                  <div>应收总金额:{{statistData.totalArCny}}</div>
                  <div class="statists">已核销总金额:{{statistData.totalRcWoCny}}</div>
                  <div class="statists">未核销总金额:{{statistData.totalRcUnwoCny}}</div>
                  <div class="statists" v-html="dealOrgnS(statistData.totalArOrgn,'应收原币')" style="white-space:pre-wrap;text-align:right"></div>
                  <div class="statists" v-html="dealOrgnS(statistData.totalRcWoOrgn,'已核销原币')" style="white-space:pre-wrap;text-align:right"></div>
                  <div class="statists" v-html="dealOrgnS(statistData.totalRcUnwoOrgn,'未核销原币')" style="white-space:pre-wrap;text-align:right"></div>
                </div>
                <div style="display:flex" class="allStatist">
                  <div>应付总金额:{{statistData.totalApCny}}</div>
                  <div class="statists" >已核销总金额:{{statistData.totalApWoCny}}</div>
                  <div class="statists" >未核销总金额:{{statistData.totalApUnwoCny}}</div>
                  <div class="statists" v-html="dealOrgnS(statistData.totalApOrgn,'应付原币')" style="white-space:pre-wrap;text-align:right"></div>
                  <div class="statists" v-html="dealOrgnS(statistData.totalApWoOrgn,'已核销原币')" style="white-space:pre-wrap;text-align:right"></div>
                  <div class="statists" v-html="dealOrgnS(statistData.totalApUnwoOrgn,'未核销原币')" style="white-space:pre-wrap;text-align:right"></div>
                </div>
              </div>

            </div>
          </div>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageNum"
              :page-sizes="[10, 30, 50]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              style="
                text-align: right;
                padding: 19px 30px 18px 0;
                background: #fff;
              "
            >
            </el-pagination>
        </el-tab-pane>
      </el-tabs>
        <!-- 表格控制列显示 -->
      <el-drawer
        title="表格列控制"
        :visible.sync="drawer"
        size="200px"
        :direction="direction"
      >
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
          style="margin: 0 0 20px 20px"
          >全选</el-checkbox
        >
        <el-checkbox-group v-model="checkedTable" :min="0" :max="20">
          <el-checkbox
            v-for="choose in tableOptions"
            :label="choose"
            :key="choose"
            style="display: block; margin-left: 20px"
            >{{ choose }}</el-checkbox
          >
        </el-checkbox-group>
      </el-drawer>
    </div>
    <el-dialog title="订单" :visible.sync="dialogFormVisible" width="80%">
          <div style="font-size: 18px;font-weight: 100;color: #333;padding: 0 20px 10px 20px;">应收账单</div>
          <Table
            :tableData='tableDataOne'
            :operation="operation"
            :columns='columns1'
            :showSelection="false"
          >
          </Table>
          <div class="finance-table-price">
            <div>账单合计：{{ this.totalArOrgn | getOrgn}}</div>
            <div>人民币合计：￥{{ this.totalArCny }}</div>
            <div>结算方式：{{ this.payWay == 0 ? "付款买单" : "月结买单" }}</div>
          </div>
          <div style="font-size: 18px;font-weight: 100;color: #333;padding: 10px 20px 10px 20px;">应付账单</div>
          <Table
            :tableData='tableDataTwo'
            :operation="operation"
            :columns='columns2'
            :showSelection="false"
            >
          </Table>
          <div class="finance-table-price">
            <div>账单合计：{{ this.totalApOrgn | getOrgn }}</div>
            <div>人民币合计：￥{{ this.totalApCny }}</div>
            <div>账单利润：{{ this.orderProfit }}</div>
          </div>
          <div class="finance-table-price">
            <div>订单利润:{{ this.orderProfit }}</div>
          </div>
          <div style="font-size: 18px;font-weight: 100;color: #333;padding: 10px 20px 10px 20px;">修改记录</div>
          <Table
            :tableData='tableDataThree'
            :operation="operation"
            :columns='columns3'
            :showSelection="false"
            >
          </Table>
    </el-dialog>
  </div>
</template>

<script>
  import Table from '@/components/financeTable'
  import { toData } from '@/util/assist'
  export default {
    data() {
      return {

       //表格控制列drawer
      drawer: false,
      checkAll: false,
      isIndeterminate: true,
      direction: "rtl",
      checkedTable: [  "序号",
        "订单号",
        "运单号",
        "航班日期",
        "交单时间",
        "订舱客户",
        "代理上家",
        "航司",
        "起运港",
        "目的港",
        "应收金额",
        "应收已核销金额",
        "应收未核销金额",
        "应付金额",
        "应付已核销金额",
        "应付未核销金额",
        "利润",],
      tableOptions: [
        "序号",
        "订单号",
        "运单号",
        "航班日期",
        "交单时间",
        "订舱客户",
        "代理上家",
        "航司",
        "起运港",
        "目的港",
        "应收金额",
        "应收已核销金额",
        "应收未核销金额",
        "应付金额",
        "应付已核销金额",
        "应付未核销金额",
        "利润",

      ],
        //表格tab页
        tabName:["可操作","业务修改中","异常"],
        tabNum:[0,0,0],
        dialogFormVisible: false,
         //搜索框结果
        selectResult:{
          orderNo:"",
          waybillNo:"",
          customerName:"",
          agentId:"",
          airCompanyCode:"",
          startOrderTime:"",
          endOrderTime:"",
          startDepartureDate:"",
          endDepartureDate:"",
          pscsId:"",
          rcvWriteOffStatusList:[""],
          payWriteOffStatusList:[""],
          pol:"",
          pod:"",
          mscsId:"",
          principalId:"",
          woStatus:0
        },
        columns1: [
        { label: "序号", show: true, width: "50" },
        { label: "费用名称", prop: "expenseName", show: true, width: "100" },
        {
          label: "收款单位",
          prop: "expenseUnitName",
          show: true,
          width: "150",
        },
        { label: "单价", prop: "price", show: true, width: "100" },
        { label: "数量", prop: "quantity", show: true, width: "100" },
        { label: "币种", prop: "currency", show: true, width: "100" },
        { label: "原币合计", prop: "totalOrgn", show: true, width: "100" },
        { label: "汇率", prop: "exchangeRateOnly", show: true, width: "100" },
        { label: "人民币合计", prop: "totalCny", show: true, width: "100" },
        { label: "备注", prop: "remark", show: true, width: "50" },
      ],
      columns2: [
        { label: "序号", prop: "orderNo", show: true, width: "50" },
        { label: "费用名称", prop: "expenseName", show: true, width: "100" },
        {
          label: "付款单位",
          prop: "expenseUnitName",
          show: true,
          width: "150",
        },
        { label: "单价", prop: "price", show: true, width: "100" },
        { label: "数量", prop: "quantity", show: true, width: "100" },
        { label: "币种", prop: "currency", show: true, width: "100" },
        { label: "原币合计", prop: "totalOrgn", show: true, width: "100" },
        { label: "汇率", prop: "exchangeRateOnly", show: true, width: "100" },
        { label: "人民币合计", prop: "totalCny", show: true, width: "100" },
        { label: "备注", prop: "remark", show: true, width: "50" },
      ],
      columns3: [
        { label: "操作类型", prop: "operationType", show: true, width: "150" },
        { label: "说明", prop: "operationInfo", show: true, width: "100" },
        { label: "操作时间", prop: "createTime", show: true, width: "150" },
        { label: "操作人", prop: "operator", show: true, width: "100" },
      ],
        pageSize: 10,
        pageNum: 1,
        total: 0,
        //table
        selectTableData:[],
        tableData:[],
        tableDataOne:[],
        tableDataTwo:[],
        tableDataThree:[],
        pageSkipChecked:false,
        //数据统计
        statistDataShow:false,
        errorStatist:false,
        statistData:{},
        totalArOrgn:"",
        totalApOrgn:"",
        totalArCny:"",
        totalApCny:"",
        orderProfit:"",
        payWay:"",
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
              return time.getTime() < new Date(beginDateVal).getTime()-8.64e7
            }
          }
        },
        // 下单时间
         pickerOptionsStartTwo: {
          disabledDate: time => {
            let endDateVal = this.selectResult.startOrderTime
            if (endDateVal) {
              return time.getTime() > new Date(endDateVal).getTime()
            }
          }
        },
        pickerOptionsEndTwo: {
          disabledDate: time => {
            let beginDateVal = this.selectResult.endOrderTime
            if (beginDateVal) {
              return time.getTime() < new Date(beginDateVal).getTime()-8.64e7
            }
          }
        },
        writeOffStatus:[{value:"全部",id:""},{value:"未对账",id:'0'},{value:"部分对账",id:'1'},{value:"已对账",id:'2'},{value:"部分对账部分核销",id:'4'},{value:"已对账部分核销",id:'5'},{value:"已对账已核销",id:'8'}],
        agentOpt: [],
        polOpt: [],
        podOpt: [],
        airCompanyCodeOpt:[],
        payBefore:[],
        paying:[],
        airManger:[],
        typeCode: '可操作',
        orderCount: 0
      }
    },
    mounted() {
      this.initData()
      this.initAgentList()
      this.initAirportSearchByPage()
      this.initCompanySearchByPage()
      this.operateData()
      this.dom()
    },
    methods: {
      //原币处理
      dealOrgn(orgn,extraWord) {
      if (!orgn) {
        return 0+'CNY';
      }
       orgn = JSON.parse(orgn);
      var totalOrgn = "";
      var value1;
      var value2;
      var value3;
      var value4;
      var value5;
      // HK$ $ € ￡
      for (var i = 0; i < orgn.length; i++) {
        if (orgn[i].currency == "1") {
          value1 = orgn[i].amount;
        } else if (orgn[i].currency == "2") {
          value2 = orgn[i].amount;
        } else if (orgn[i].currency == "3") {
          value3 = orgn[i].amount;
        } else if (orgn[i].currency == "4") {
          value4 = orgn[i].amount;
        } else if (orgn[i].currency == "5") {
          value5 = orgn[i].amount;
        }
      }
      totalOrgn = "";
      totalOrgn += (value1 || value1 == 0) ? value1 + "CNY" + "\n" : "";
      totalOrgn += (value2 || value2 == 0) ? value2 + "HKD" + "\n" : "";
      totalOrgn += (value3 || value3 == 0) ? value3 + "USD" + "\n" : "";
      totalOrgn += (value4 || value4 == 0) ? value4 + "EUR" + "\n" : "";
      totalOrgn += (value5 || value5 == 0) ? value5 + "GBP" + "\n": "";
      totalOrgn = totalOrgn.substring(0, totalOrgn.length - 1);
      return (extraWord?extraWord+":":"") +totalOrgn;
    },
     dealOrgnS(orgn,extraWord) {
      if (!orgn) {
        return 0+'CNY';
      }
       orgn = JSON.parse(orgn);
      var totalOrgn = "";
      var value1;
      var value2;
      var value3;
      var value4;
      var value5;
      // HK$ $ € ￡
      for (var i = 0; i < orgn.length; i++) {
        if (orgn[i].currency == "1") {
          value1 = orgn[i].amount;
        } else if (orgn[i].currency == "2") {
          value2 = orgn[i].amount;
        } else if (orgn[i].currency == "3") {
          value3 = orgn[i].amount;
        } else if (orgn[i].currency == "4") {
          value4 = orgn[i].amount;
        } else if (orgn[i].currency == "5") {
          value5 = orgn[i].amount;
        }
      }
      totalOrgn = "";
      totalOrgn += (value1 || value1 == 0) ? value1.toLocaleString('en-US') + "CNY" + "\n" : "";
      totalOrgn += (value2 || value2 == 0) ? value2.toLocaleString('en-US') + "HKD" + "\n" : "";
      totalOrgn += (value3 || value3 == 0) ? value3.toLocaleString('en-US') + "USD" + "\n" : "";
      totalOrgn += (value4 || value4 == 0) ? value4.toLocaleString('en-US') + "EUR" + "\n" : "";
      totalOrgn += (value5 || value5 == 0) ? value5.toLocaleString('en-US') + "GBP" + "\n": "";
      totalOrgn = totalOrgn.substring(0, totalOrgn.length - 1);
      return (extraWord?extraWord+":":"") +totalOrgn;
    },
      //限制搜索条件的最大位数
      dom(){
          //代理上家
        const select = document.querySelector('#agentId')
        select.setAttribute('maxLength',30)
        //航司
        const select1 = document.querySelector('#airCompany')
        select1.setAttribute('maxLength',15)
         //起运港目的港
        const select2 = document.querySelector('#pod')
        select2.setAttribute('maxLength',15)
         const select3 = document.querySelector('#pol')
        select3.setAttribute('maxLength',15)
        //售前售中航线
         const select4 = document.querySelector('#pscsId')
         select4.setAttribute('maxLength',10)
         const select5 = document.querySelector('#mscsId')
         select5.setAttribute('maxLength',10)
         const select6 = document.querySelector('#principalId')
         select6.setAttribute('maxLength',10)
      },
        //获取表格选中数据
        handleSelectionChange (e) {
          this.selectTableData = e
          // console.log(this.selectTableData)
        },
      tableRowClassName({row, rowIndex}) {
        if(row.abnormalFlag > 1  && row.orderProfit>=0){
          return 'background-color:#CD5C5C ';
        }
      else if (row.orderProfit<0 &&  row.orderProfit>-200 ) {
        return 'background-color: #FFDEAD';
      }
        else if (row.orderProfit<=-200 && row.orderProfit>-500) {
          return 'background-color: #F4A460';
        } else if (row.orderProfit<=-500 ) {
        return 'background-color: #FA8072';
      }
      },
       //搜索表单中多选框控制
      dealAllChange (){
      if(this.selectResult.rcvWriteOffStatusList.indexOf("0") != -1 && this.selectResult.rcvWriteOffStatusList.indexOf("1") != -1 && this.selectResult.rcvWriteOffStatusList.indexOf("2") != -1 && this.selectResult.rcvWriteOffStatusList.indexOf("4") != -1 && this.selectResult.rcvWriteOffStatusList.indexOf("5") != -1 && this.selectResult.rcvWriteOffStatusList.indexOf("8") != -1) {
        this.selectResult.rcvWriteOffStatusList = [""]
      }
       else if (this.selectResult.rcvWriteOffStatusList.indexOf("")>0){
        this.selectResult.rcvWriteOffStatusList = [""]
      }
      else if(this.selectResult.rcvWriteOffStatusList.indexOf("0") != -1 || this.selectResult.rcvWriteOffStatusList.indexOf("1") != -1 || this.selectResult.rcvWriteOffStatusList.indexOf("2") != -1 || this.selectResult.rcvWriteOffStatusList.indexOf("4") != -1 || this.selectResult.rcvWriteOffStatusList.indexOf("5") != -1 || this.selectResult.rcvWriteOffStatusList.indexOf("8") != -1  ) {
          if(this.selectResult.rcvWriteOffStatusList.indexOf("") != -1){
            let index = this.selectResult.rcvWriteOffStatusList.indexOf("")
            this.selectResult.rcvWriteOffStatusList.splice(index,1)
          } 
        }
      if(this.selectResult.payWriteOffStatusList.indexOf("0") != -1 && this.selectResult.payWriteOffStatusList.indexOf("1") != -1 && this.selectResult.payWriteOffStatusList.indexOf("2") != -1 && this.selectResult.payWriteOffStatusList.indexOf("4") != -1 && this.selectResult.payWriteOffStatusList.indexOf("5") != -1 && this.selectResult.payWriteOffStatusList.indexOf("8") != -1) {
        this.selectResult.payWriteOffStatusList = [""]
      }
       else if (this.selectResult.payWriteOffStatusList.indexOf("")>0){
        this.selectResult.payWriteOffStatusList = [""]
      }
      else if(this.selectResult.payWriteOffStatusList.indexOf("0") != -1 || this.selectResult.payWriteOffStatusList.indexOf("1") != -1 || this.selectResult.payWriteOffStatusList.indexOf("2") != -1 || this.selectResult.payWriteOffStatusList.indexOf("4") != -1 || this.selectResult.payWriteOffStatusList.indexOf("5") != -1 || this.selectResult.payWriteOffStatusList.indexOf("8") != -1  ) {
        if(this.selectResult.payWriteOffStatusList.indexOf("") != -1){
            let index = this.selectResult.payWriteOffStatusList.indexOf("")
            this.selectResult.payWriteOffStatusList.splice(index,1)
          } 
        }
       
      },
      //数据统计
      getStatistData(){
        let copyData = JSON.parse(JSON.stringify(this.selectResult))
        if(copyData.rcvWriteOffStatusList[0] === "") {
          delete copyData.rcvWriteOffStatusList
          }
        if(copyData.payWriteOffStatusList[0] === "") {
          delete copyData.payWriteOffStatusList
          }
        this.statistDataShow = !this.statistDataShow
        if(this.statistDataShow == false) return""
        this.$http.post(this.$service.subWoList,copyData).then(data=>{
          if(data.code == 200) {
          this.statistData = data.data
          this.statistData.totalArCny = this.statistData.totalArCny.toLocaleString('en-US')
          this.statistData.totalRcWoCny = this.statistData.totalRcWoCny.toLocaleString('en-US')
          this.statistData.totalRcUnwoCny = this.statistData.totalRcUnwoCny.toLocaleString('en-US')
          this.statistData.totalApCny = this.statistData.totalApCny.toLocaleString('en-US')
          this.statistData.totalApWoCny = this.statistData.totalApWoCny.toLocaleString('en-US')
          this.statistData.totalApUnwoCny = this.statistData.totalApUnwoCny.toLocaleString('en-US')
          this.errorStatist = data.data.hasAbNormal
          }
        })
      },
      //订单号弹框
      showData(id){
        this.dialogFormVisible = true
        this.$http.get(this.$service.searchWoDetail+"?orderId="+id).then(data=>{
          this.tableDataOne = data.data.arOrderPriceList
          this.tableDataTwo = data.data.apOrderPriceList
          this.tableDataThree = data.data.orderPresentLogs
          this.totalArOrgn = data.data.totalArOrgn;
          this.totalApOrgn = data.data.totalApOrgn;
          this.totalArCny = data.data.totalArCny;
          this.totalApCny = data.data.totalApCny;
          this.orderProfit = data.data.orderProfit;
        })
      },
      //表格选择列显示drawer -全选
    handleCheckAllChange(val) {
      this.checkedTable = val ? this.tableOptions : [];
      this.isIndeterminate = false;
    },
      //tab切换
      tabClickData() {
        this.pageNum =1
          this.statistDataShow = false
        this.pageSkipChecked = false
      	this.initData()
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
       //航司
      initCompanySearchByPage(keyWord) {
        if (!keyWord) {
          keyWord = ''
        }
        this.$http.get(this.$service.companySearchByPage + '?keyWord=' + keyWord).then((data) => {
          this.loading = false
          if (data.code == 200) {
            this.airCompanyCodeOpt = data.data.records
          } else {
            this.$message.error(data.message)
          }
        })
      },
      companyMethod(keyWord) {
        this.initCompanySearchByPage(keyWord)
      },
      //售前售中客服、航线负责人数据
      operateData (){
        this.$http.get(this.$service.userSearchNoAuth+'?roleName=售前客服&pageSize=50000').then(data=>{
          this.payBefore = data.data.records
        })
        this.$http.get(this.$service.userSearchNoAuth+'?roleName=售中客服&pageSize=50000').then(data=>{
          this.paying = data.data.records
        })
        this.$http.get(this.$service.userSearchNoAuth+'?roleName=航线负责人&pageSize=50000').then(data=>{
          this.airManger = data.data.records
        })
      },
       //跨页全选禁用
      ifDisabled(row) {
        if(this.pageSkipChecked == true) {
          return false
        } else {
          return true
        }
      },
      //跨页全选按钮
    selectAllTable(){
        for(let i=0;i<this.$refs.multipleTable.length;i++){
          this.$refs.multipleTable[i].clearSelection();
          for(let j=0;j<this.tableData.length;j++){
            if(this.pageSkipChecked == true ) {
							this.$refs.multipleTable[i].toggleRowSelection(this.tableData[j]);
						} else {
              this.$refs.multipleTable[i].clearSelection();;
            }
          }
        }
      },
      //查询条件处理
      selectResultData (){
        let copyData = JSON.parse(JSON.stringify(this.selectResult))
        if(copyData.rcvWriteOffStatusList[0] === "") {
          delete copyData.rcvWriteOffStatusList
          }
        if(copyData.payWriteOffStatusList[0] === "") {
          delete copyData.payWriteOffStatusList
          }
          copyData.pageSize =this.pageSize
          copyData.pageNum =this.pageNum
          copyData.woStatus = this.typeCode == "可操作" ? 0 :this.typeCode == "业务修改中" ? 1 :this.typeCode == "异常" ?  2 :""
          return copyData
      },
      //导出列表
      exportList (){
        if(this.selectTableData.length == 0) {
          this.$message({type:"warning",message:"请选择数据"})
          return false
      }
        let requestData = {}
        if(this.pageSkipChecked == true) {
          requestData.overPageCheck = true
          requestData.financePageDTO = this.selectResultData()
        } else {
          requestData.orderIds = []
          this.selectTableData.forEach((item,index)=>{
            requestData.orderIds[index] = item.id
          })
        }
        this.$http.post(this.$service.exportWoExcel,requestData, {
            responseType: 'arraybuffer'
          }).then(res=>{
            const aLink = document.createElement("a");
            let blob = new Blob([res], {
              type: "application/vnd.ms-excel"
            })
            aLink.href = URL.createObjectURL(blob)
            aLink.setAttribute('download', '财务核销列表' + '.xlsx') // 设置下载文件名称
            aLink.click()
            document.body.appendChild(aLink)
        })
      },
      //查询数据
      initData() {
          let copyData = this.selectResultData()
          this.errorStatist = false
          this.$http.post(this.$service.searchWoByPage,copyData).then(data => {
          if (data.code == 200) {
          this.statistDataShow = false
            this.tableData = data.data.page.records
            this.tabNum = [data.data.countAuth?data.data.countAuth:0,data.data.countNoAuth?data.data.countNoAuth:0,data.data.countErr?data.data.countErr:0]
            this.total = data.data.page.total
            setTimeout(()=>{
              this.selectAllTable()
            },0)
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
        this.pageSkipChecked = false
        this.initData()
      },
      //重置
      restClick() {

        this.selectResult={
          orderNo:"",
          waybillNo:"",
          customerName:"",
          agentId:"",
          airCompanyCode:"",
          startOrderTime:"",
          endOrderTime:"",
          startDepartureDate:"",
          endDepartureDate:"",
          pscsId:"",
          rcvWriteOffStatusList:[""],
          payWriteOffStatusList:[""],
          pol:"",
          pod:"",
          mscsId:"",
          principalId:"",
          woStatus:0
        },
        this.pageNum = 1
        this.pageSize = 10
        this.initData()
        this.pageSkipChecked = false
        this.selectAllTable()
      },
      handleCurrentChange(e) {
        this.pageNum = e
        this.initData()
      },
      handleSizeChange(e) {
        this.pageNum = 1
        this.pageSize = e
        this.initData()
      },
    },

    components: {
      Table
    },
    filters:{
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
        totalOrgn += value1 ? value1.toLocaleString('en-US') + 'CNY' + '+' : ''
        totalOrgn += value2 ? value2.toLocaleString('en-US') + 'HKD' + '+' : ''
        totalOrgn += value3 ? value3.toLocaleString('en-US') + 'USD' + '+' : ''
        totalOrgn += value4 ? value4.toLocaleString('en-US') + 'EUR' + '+' : ''
        totalOrgn += value5 ? value5.toLocaleString('en-US') + 'GBP' + '+' : ''
        totalOrgn = totalOrgn.substring(0, totalOrgn.length - 1)
        return totalOrgn;
      }
    }
  }
</script>


<style scoped lang="less">
  @import url("../../assets/icon/iconfont.css");
  // /deep/.el-table tbody tr:hover>td {
    // background-color:blue!important
// }

 /deep/.el-input--medium{
     .el-input__inner {
        text-overflow: ellipsis!important;
      }
     }
/deep/.pageSkip {
        padding:3px 5px!important
  }
  /deep/ .el-table {
          .cell {
            text-align: center;
          }
          th {
    height:35px
  }
      }
   .content-search-normal {
    .formItem{
      display:inline-block;
      width: 320px;
      margin-top:-5px;
    }
  }
  .allStatist {
    div {
      flex:0 0 160px
    }
    .statists {
      margin-right:15px;
    }
  }
    .statists {
      margin-right:15px;
    }
  .content-wrapper {
    width: 100%;
    box-sizing: border-box;
    /*height: 100%;*/
    padding: 20px;
    overflow: hidden;
    background-color: #f3f6f9 !important;
  }
.operateButton {
    display:flex;
    justify-content: flex-end;
    margin-bottom:-10px;
    .upLoad {
      /deep/.el-button--medium {
        padding:6px 20px
      }
    }
    button {
      margin:0px 10px 20px 10px;
    }
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
