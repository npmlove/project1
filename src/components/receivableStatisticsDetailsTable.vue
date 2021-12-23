<template>
  <div>
    <el-table
      ref="multipleTable"
      @sort-change="handleSort"
      @selection-change="handleSelect"
      :data="tableData"
      :header-cell-style="{textAlign:'center'}"
      :cell-style="{textAlign:'center',fontSize:'14px'}"
      :row-class-name="tableRowClassName"
      style="width: 100% ;"
    >
      <template slot="empty">
        <img class="data-pic" src="../assets/kong-icon.png"/>
        <p>暂无数据</p>
      </template>
      <el-table-column v-if="select===0" type="selection" :selectable="ifDisabled" width="50"></el-table-column>
      <!-- <el-table-column
        v-if="checkbox"
        type="selection"
        width="55">
      </el-table-column> -->
      <!--列-->
      <el-table-column
        v-for="(column, index) in columns"
        v-if="column.show&&(selectionTable?checkedTable.indexOf(column.label) !== -1:true)"
        :key="index"
        :sortable="column.sort"
        :prop="column.prop"
        :label="column.label"
        :min-width="column.width"
        align="left"
      >
        <el-table-column v-if="column.label == '应收金额'&&typeof (column.prop)== 'undefined'" prop="totalArCny" label="人民币"
                         min-width="100"></el-table-column>
        <el-table-column v-if="column.label == '应收金额'&&typeof (column.prop) == 'undefined'" label="原币" min-width="100">
          <template slot-scope="scope">
            <div style="white-space:pre">{{ getOrgn(scope.row.totalArOrgn) }}</div>
          </template>
        </el-table-column>
        <el-table-column v-if="column.label == '应付金额'&&typeof (column.prop)== 'undefined'" prop="totalApCny" label="人民币"
                         min-width="100"></el-table-column>
        <el-table-column v-if="column.label == '应付金额'&&typeof (column.prop)== 'undefined'" label="原币" min-width="100">
          <template slot-scope="scope">
            <div style="white-space:pre">{{ getOrgn(scope.row.totalApOrgn) }}</div>
          </template>
        </el-table-column>
        <template slot-scope="scope">
          <span @click="handleItemClick(column.handle, scope)">

            <span v-if=" column.label == '序号'">
           {{ scope.$index + 1 }}
            </span>
                        <div v-else-if=" column.label == '核销金额'">
 <div v-for="(optItem,optIndex) in scope.row.writeOffList" :key="optIndex"
      :style="{'background':(optIndex%2===0?'':'')}" v-if="optItem.status!=-1">{{
     optItem.writeOffAmount
   }}{{ getCurrency(optItem.currency) }}</div>
            </div>
            <div v-else-if=" column.label == '开户行'">
              <div v-for="(optItem,optIndex) in scope.row.writeOffList" :key="optIndex"
                   :style="{'background':(optIndex%2===0?'':'')}" v-if="optItem.status!=-1">{{
                  optItem.accountBank
                }}</div>
            </div>
            <div v-else-if=" column.label == '户名'">
              <div v-for="(optItem,optIndex) in scope.row.writeOffList" :key="optIndex"
                   :style="{'background':(optIndex%2===0?'':'')}" v-if="optItem.status!=-1">{{
                  optItem.accountName
                }}</div>
            </div>
            <div v-else-if=" column.label == '银行账户'">
              <div v-for="(optItem,optIndex) in scope.row.writeOffList" :key="optIndex"
                   :style="{'background':(optIndex%2===0?'':'')}" v-if="optItem.status!=-1">{{
                  optItem.bankAccount
                }}</div>
            </div>
            <div v-else-if=" column.label == '汇率'&&column.prop == 'exchangeRate'">
              <div v-for="(optItem,optIndex) in scope.row.writeOffList" :key="optIndex"
                   :style="{'background':(optIndex%2===0?'':'')}" v-if="optItem.status!=-1">{{
                  optItem.exchangeRate
                }}</div>
            </div>
            <div v-else-if=" column.label == '收款方式'">
              <div v-for="(optItem,optIndex) in scope.row.writeOffList" :key="optIndex"
                   :style="{'background':(optIndex%2===0?'':'')}">{{
                  optItem.writeOffWay === 0 ? "银行转账" : "应付对冲"
                }}</div>
            </div>
            <div v-else-if=" column.label == '付款方式'">
              <div v-for="(optItem,optIndex) in scope.row.writeOffList" :key="optIndex"
                   :style="{'background':(optIndex%2===0?'':'')}"
                   v-if="optItem.status!=-1">{{ optItem.writeOffWay === 0 ? "银行转账" : "应付对冲" }}</div>
            </div>
             <div v-else-if=" column.label == '付款日期'">
              <div v-for="(optItem,optIndex) in scope.row.writeOffList" :key="optIndex"
                   :style="{'background':(optIndex%2===0?'':'')}" v-if="optItem.status!=-1">{{ optItem.payDate }}</div>
            </div>
            <div v-else-if=" column.label == '到账时间'">
              <div v-for="(optItem,optIndex) in scope.row.writeOffList" :key="optIndex"
                   :style="{'background':(optIndex%2===0?'':'')}">{{ optItem.payDate }}</div>
            </div>
            <!--           <div v-else-if=" column.label == '开户行'">
             <div v-for="(optItem,optIndex) in scope.row.writeOffList" :key="optIndex"
                  :style="{'background':(optIndex%2===0?'':'')}">{{ optItem.accountBank }}
                    </div>
                        </div>-->
           <div v-else-if=" column.label == '核销时间'">
 <div v-for="(optItem,optIndex) in scope.row.writeOffList" :key="optIndex"
      :style="{'background':(optIndex%2===0?'':'')}" v-if="optItem.status!=-1">{{ optItem.writeOffTime }}
        </div>
            </div>
            <div v-else-if=" column.label == '记录'&&column.prop == 'log'">
            <table v-for="(optItem,optIndex) in scope.row.log" :key="optIndex"
                   :style="{'background':(optIndex%2===0?'':'')}">
            <table v-if="(optItem.status==0||optItem.status==-1)&&optItem.payWay!=null" style="padding: 0px">
            <td style="margin: 0px;padding: 0px;">{{ "操作" + (optIndex + 1) + "：" + optItem.writeOffOperator }}</td><td
              style="color: cornflowerblue ;margin-right: 0">核销</td><td>{{
                "该订单，核销金额：" + optItem.writeOffAmount + getCurrency(optItem.currency)
              }}</td><td
              style="padding-left: 20px">{{ optItem.writeOffTime }}</td>
          </table>
            <table v-if="(optItem.status==0||optItem.status==-1)&&optItem.payWay==null" style="padding: 0px">
            <td style="margin: 0px;padding: 0px;">{{ "操作" + (optIndex + 1) + "：" + optItem.writeOffOperator }}</td><td
              style="color: cornflowerblue ;margin-right: 0">对账</td><td>{{
                "该订单，对账金额：" + optItem.writeOffAmount + getCurrency(optItem.currency)
              }}</td><td
              style="padding-left: 20px">{{ optItem.writeOffTime }}</td>
          </table>
<table v-if="optItem.status==2">
<td>{{ "操作" + (optIndex + 1) + "：" + optItem.writeOffOperator }}</td><td style="color: crimson">撤销</td><td>{{
    "操作" + getIndex(scope.row.log, optItem.revokeId == 0 ? optItem.id : optItem.revokeId)
  }}</td><td
  style="padding-left: 20px">{{ optItem.revokeTime }}</td>
</table>
        </table>
            </div>
                       <table v-else-if=" column.label == '操作'&&column.prop == 'revoke'">
 <table v-for="(optItem,optIndex) in scope.row.log" :key="optIndex" :style="{'background':(optIndex%2===0?'':'')}">
   <td v-if="optItem.status==0" style="padding: 0px"><a @click="revoke(optIndex ,optItem.id,scope.row)">撤销</a></td>
  <td v-if="optItem.status==-1" style="padding: 0px">已撤销</td>
  <td v-if="optItem.status==2" style="padding: 0px"></td>
        </table>
            </table>

            <span v-else-if="column.prop == 'expenseType' && column.label == '费用类型'">
              {{ scope.row.expenseType === 0 ? "国内段" : "国外段" }}
            </span>
            <span v-else-if="column.prop == 'exchangeRateNum' && column.label == '汇率'">
              {{ scope.row.exchangeRate }}
            </span>
            <span v-else-if="column.prop == 'payWay' && column.label == '结算方式'">
              {{ scope.row.payWay === 0 ? "付款买单" :
              scope.row.payWay === 1?"月结":"" }}
            </span>
            <span v-else-if="column.prop == 'rcvWriteOffStatus' && column.label == '核销状态'">
              {{
                scope.row.rcvWriteOffStatus === 0 ? "未对账未核销" :
                  scope.row.rcvWriteOffStatus === 1 ? "部分对账未核销" :
                    scope.row.rcvWriteOffStatus === 2 ? "已对账未核销" :
                      scope.row.rcvWriteOffStatus === 3 ? "未对账部分核销" :
                        scope.row.rcvWriteOffStatus === 4 ? "部分对账部分核销" :
                          scope.row.rcvWriteOffStatus === 5 ? "已对账部分核销" :
                            scope.row.rcvWriteOffStatus === 6 ? "未对账已核销" :
                              scope.row.rcvWriteOffStatus === 7 ? "部分对账已核销" :
                                scope.row.rcvWriteOffStatus === 8 ? "已对账已核销" : ""

              }}
            </span>
            <span v-else-if="column.prop == 'payWriteOffStatus' && column.label == '核销状态'">
              {{
                scope.row.payWriteOffStatus === 0 ? "未对账未核销" :
                  scope.row.payWriteOffStatus === 1 ? "部分对账未核销" :
                    scope.row.payWriteOffStatus === 2 ? "已对账未核销" :
                      scope.row.payWriteOffStatus === 3 ? "未对账部分核销" :
                        scope.row.payWriteOffStatus === 4 ? "部分对账部分核销" :
                          scope.row.payWriteOffStatus === 5 ? "已对账部分核销" :
                            scope.row.payWriteOffStatus === 6 ? "未对账已核销" :
                              scope.row.payWriteOffStatus === 7 ? "部分对账已核销" :
                                scope.row.payWriteOffStatus === 8 ? "已对账已核销" : ""

              }}
            </span>
               <span v-else-if="column.prop == 'rcvWriteOffCount' && column.label == '核销次数'">
              <a v-if="scope.row.rcvWriteOffCount!=0" @click="showWOLogs(scope.row) ">{{ scope.row.rcvWriteOffCount }}</a>
               <div v-if="scope.row.rcvWriteOffCount==0"> 0 </div>
            </span>
               <span v-else-if="column.prop == 'payWriteOffCount' && column.label == '核销次数'">
              <a  v-if="scope.row.payWriteOffCount!=0" @click="showWOLogs(scope.row)">{{ scope.row.payWriteOffCount }}</a>
                  <div v-if="scope.row.payWriteOffCount==0"> 0 </div>
            </span>
            <span v-else-if="column.prop == 'operationType' && column.label == '操作类型'">
              {{
                scope.row.operationType === 0 ? "交单" :
                  scope.row.operationType === 1 ? "解锁申请" :
                    scope.row.operationType === 2 ? "解锁通过" :
                      scope.row.operationType === 3 ? "解锁驳回" :
                          scope.row.operationType === 4 ? "审核通过" :
                            scope.row.operationType === 5 ? "审核驳回" : ""
              }}
            </span>
             <span v-else-if="column.prop == 'cargoInfo' && column.label == '货物信息'">
              <div>{{ scope.row.cargoName }}</div>
                <div>{{ scope.row.inboundPiece }}PCS</div>
                <div>{{ scope.row.inboundCbm }}CBM</div>
                <div>{{ scope.row.inboundWeight }}KGS</div>
                <div>1:{{ scope.row.inboundVwr }}</div>
            </span>
             <span v-else-if="column.prop == 'operator' && column.label == '操作人员'">
               <div>客服：{{ scope.row.pscsName }}</div>
                <div>销售：{{ scope.row.mscsName }}</div>
                <div>航线：{{ scope.row.principalName }}</div>
            </span>
              <span v-else-if=" column.label == '对账金额'&&column.prop == 'rcvCheckAmount'">
              {{ scope.row.rcvCheckAmount }}CNY
            </span>
              <span v-else-if=" column.label == '对账金额'&&column.prop == 'payCheckAmount'">
              {{ scope.row.payCheckAmount }}CNY
            </span>
              <span v-else-if=" column.label == '开票进度'">
               {{
                  scope.row.invoicingStatus == 0 ?
                    '未开票' : scope.row.invoicingStatus == 1 ?
                      '已开票' : scope.row.invoicingStatus == 2 ? '部分开票' : ''
                }}
            </span>
                    <span v-else-if=" column.label == '币种'&&column.prop == 'currency'">
               {{
                        getCurrencyZh(scope.row.currency)
                      }}
            </span>
              <span v-else-if=" column.label == '订单状态'">
                 {{
                  scope.row.financeStatus == 0 ?
                    '未交单' : scope.row.financeStatus == 1 ?
                      '已交单' : scope.row.financeStatus == 2 ?
                        '申请解锁' : scope.row.financeStatus == 3 ?
                          '交单待审核' : scope.row.financeStatus == 4 ?
                            '异常' : scope.row.financeStatus == 5 ?
                              '修改中' : ''
                }}
            </span>
            <!--              <span v-else-if="column.prop=='orderNo'&& column.label == '订单号'">-->
              <a v-else-if="column.prop=='orderNo'&& column.label == '订单号'"
                 @click="showFees(scope.row)"
                 style="color:skyBlue;cursor:pointer">{{ scope.row.orderNo }}</a>
            <!--            </span>-->
            <!--            <div v-else >{{// scope[column.prop]}}</div>-->
            <span v-else v-html="getDataName(scope.row, column)"></span>
          </span>
        </template>
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column
        fixed="right"
        v-if="operation.show"
        :label="operation.label"
        :min-width="operation.width"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <a v-for="(item, index) in operation.options" @click.prevent="handleClick(item.method, scope.row, $event)">
            <span style="color: #2273CE;">{{ item.label }}</span>
          </a>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div v-show="total > 10">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handleCurrent"
        @size-change="handleSize"
        style="text-align: right;padding: 19px 30px 18px 0;background: #fff">
      </el-pagination>
    </div>
  </div>

</template>

<script>
export default {
  props: {
    type: 'index',
    // 表格数据源
    tableData: {
      type: Array,
      default: () => []
    },
    checkedTable: {
      type: Array,
      default: () => []
    },
    //选择
    xuanzhong: {
      type: Array,
      default: () => []
    },
    // 表格的字段展示
    columns: {
      type: Array,
      default: () => []
    },
    // 表格操作
    operation: {
      type: Object,
      default: () => {
      }
    },
    pageSkipChecked: {
      type: Boolean,
      default: () => false
    },
    // 总条数
    total: {
      type: Number,
      default: () => 0
    },
    // 总条数
    select: {
      type: Number,
      default: () => 0
    },
    // 总条数
    selectionTable: {
      type: Boolean,
      default: () => false
    },
    biaoshishu: {
      type: Number,
      default: () => 0
    },
    // 当前页
    currentPage: {
      type: Number,
      default: () => 0
    },
    // 每页条数
    pageSize: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      seletArr: [],
      userName: '',
      arr: [],
      UserID: ''
    }
  },
  mounted() {
    this.UserID = !sessionStorage.getItem('userInfo') ? '' : JSON.parse(sessionStorage.getItem('userInfo')).UserID
    this.userName = !sessionStorage.getItem('userInfo') ? '' : JSON.parse(sessionStorage.getItem('userInfo')).UserName
  },
  watch: {
    tableData(idx) {
      var that = this
      this.arr = []
      that.$nextTick(() => {
        if (that.$refs.multipleTable) {
          that.$refs.multipleTable.clearSelection();
        }
        if (!idx) {
          return
        }
        idx.forEach(row => {
          for (var i = 0; i < this.xuanzhong.length; i++) {
            if (this.xuanzhong[i].code == row.code) {
              that.$refs.multipleTable.toggleRowSelection(
                row,
                true
              )
            }
          }
        })
      })
    }
  },
  methods: {
    selectAllTable(pageSkipChecked, tableData) {
      if (pageSkipChecked) {
        tableData.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    getIndex(log, id) {
      for (var i = 0; i < log.length; i++) {
        if (log[i].id == id) {
          return i + 1;
        }
      }
    },
    getCurrency(type) {
      return type === 1 ? "CNY" :
        type === 2 ? "HKD" :
          type === 3 ? "USD" :
            type === 4 ? "EUR" :
              type === 5 ? "GBP" : "";
    },
    getCurrencyZh(type) {
      return type === 1 ? "人民币" :
        type === 2 ? "港币" :
          type === 3 ? "美元" :
            type === 4 ? "欧元" :
              type === 5 ? "英镑" : "";
    },
    cellStylePadding0({row, column, ronIndex, columnIndex}) {
      if (
        column.property == "writeOffAmount" ||
        column.property == "branchLastTime" ||
        column.property == "branchThisTime" ||
        column.property == "branchAddReduceQty" ||
        column.property == "branchAddReducePercent"
      ) {
        return "padding:0";
      } else {
        return "";
      }
      //console.log(column.property)
    },
    // 排序
    handleSort(column) {
      this.$emit('sortChange', column)
    },
    // 排序
    revoke(index,id, row) {
      this.$emit('revoke', index,id, row)
    },
    // 操作，将操作类型和当前row数据作为参数传递
    handleClick(method, row, e) {
      // 置灰不可点击
      if (e.target.className === 'gary') {
        return
      }
      this.$emit('handleClick', {
        method: method,
        row: row
      })
    },
    // 某一列点击事件
    handleItemClick(method, scope) {
      if (method) {
        this.$emit(method, scope)
      }
    },
    getExchangeRate(exchangeRate) {
      if (typeof (exchangeRate) == "undefined") {
        return "";
      }
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
    getOrgn(orgn) {
      if (!orgn) {
        return '0CNY';
      }
      orgn = JSON.parse(orgn);
      console.log(orgn)
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
      totalOrgn = value1 ? value1 + 'CNY' + '\n' : ''
      totalOrgn += value2 ? value2 + 'HKD' + '\n' : ''
      totalOrgn += value3 ? value3 + 'USD' + '\n' : ''
      totalOrgn += value4 ? value4 + 'EUR' + '\n' : ''
      totalOrgn += value5 ? value5 + 'GBP' : ''
      totalOrgn = totalOrgn.substring(0, totalOrgn.length - 1)
      return totalOrgn;
    },
    showFees(val) {
      this.$emit('showFees', val)
    },
    showWOLogs(val) {
      this.$emit('showWOLogs', val)
    },
    // 页码跳转
    handleCurrent(val) {
      // this.rowSelect()
      this.$emit('currentChange', val)
    },
    ifDisabled(row) {
      if (this.pageSkipChecked == true) {
        return false
      } else {
        return true
      }
    },
    // 展示条数
    handleSize(val) {
      this.$emit('sizeChange', val)
    },
    tableRowClassName({row, rowIndex}) {
      let allWriteOffAmount = 0;
      if (row.writeOffList) {
        row.writeOffList.forEach(x => allWriteOffAmount += x.writeOffAmount)
      }
      if (row.orderProfit > -200 && row.orderProfit < 0) {
        return 'orderProfit-level1';
      } else if (row.orderProfit > -500 && row.orderProfit <= -200) {
        return 'orderProfit-level2';
      } else if (row.orderProfit <= -500) {
        return 'orderProfit-level3';
      } else if (row.abnormalFlag === 1) {
        return 'abnormalFlag';
      }else if(row.ids&&(allWriteOffAmount>row.payCheckAmount||allWriteOffAmount>row.totalApCny||row.payCheckAmount>row.totalApCny)){
        return 'abnormalFlag';
      }else if (rowIndex % 2 == 0) {
        return 'row1';
      } else {
        return 'row2';

      }
    }
    ,
    // 复选框选择
    handleSelect(val) {
      this.$emit('handleSelect', val)
    },
    //开关
    switchChangeUser(val) {
      this.$emit('switchChangeUser', val)
    },
    //去重
    unique1(arr) {
      var hash = [];
      for (var i = 0; i < arr.length; i++) {
        if (hash.indexOf(arr[i]) == -1) {
          hash.push(arr[i]);
        }
      }
      return hash;
    },
    getDataName(scope, items) {
      return scope[items.prop]
    }
  }
}
</script>
<style>
.el-table .abnormalFlag {
  background: #CD5C5C;
}

.el-table .orderProfit-level1 {
  background: #FFDEAD;
}

.el-table .orderProfit-level2 {
  background: #F4A460;
}

.el-table .orderProfit-level3 {
  background: #FA8072;
}

.el-table .row1 {
  background: #ffffff;
}

.el-table .row2 {
  background: #F9F9F9;
}
</style>
<style lang="less" scoped>
a {
  padding: 0;
}

/deep/ .el-table tbody tr:hover > td {
  background-color: transparent;
}

span {
  padding-right: 0px;
}

span.cursor {
  cursor: pointer;
  color: #3985ca;
}

span.gary {
  color: #bcbcbc;
}

.caiwu {
  color: #bcbcbc;

  font-size: 12px;
}

.tupian {
  width: 30px;
  height: auto;
}

.lineHeight28 {
  background: #606266
}
</style>
