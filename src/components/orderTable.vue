<template>
  <div class="order_table">
    <el-table stripe ref="multipleTable" @sort-change="handleSort" @selection-change="handleSelect" :data="tableData" style="width: 100%;">
      <template slot="empty">
        <img class="data-pic" src="../assets/kong-icon.png" />
        <p>暂无数据</p>
      </template>
      <!--列-->
      <el-table-column
        v-for="(column, index) in columns"
        v-if="column.show"
        :key="index"
        :sortable="column.sort"
        :prop="column.prop"
        :label="column.label"
        :min-width="column.width"
        align="left"
        >
        <template slot-scope="scope">
          <div v-if="column.label == '航线'" style="padding-top: 30px;">
            <div class="dingdan">
              <div> <img src="@/assets/huixingzhen.png" style="width:15px;height:15px" alt="" v-if="scope.row.fastOrderFlag == 1"> 订单号：{{scope.row.orderNo}}</div>
              <div>代理：{{scope.row.agentName}}</div>
              <div>客户：{{scope.row.customerName}}<a v-if="scope.row.qq"   :href="`tencent://message/?uin=${scope.row.qq}&Menu=yes&Service=300&sigT=42a1e5347953b64c5ff3980f8a6e644d4b31456cb0b6ac6b27663a3c4dd0f4aa14a543b1716f9d45`"><img  style="width:25px;" src="../assets/qq.svg"/></a></div>
              <div>进仓编号：{{scope.row.inboundNo || '暂无'}}</div>
              <div>运单号：{{scope.row.waybillNo || '暂无'}}</div>
              <div @click="orderDetails(scope)" style="color: #2273ce;cursor: pointer;">订单详情</div>
            </div>
            <div class="hangxian-date">
              <div>{{scope.row.departureDate}}</div>
              <div>{{scope.row.airCompanyName}} {{scope.row.flightNo}}</div>
            </div>
            <div class="hangxian-route">
              <div class="hangxian-route-sanzima">
                <div>{{scope.row.pol}}</div>
                <div>{{scope.row.polName}}</div>
              </div>
              <div class="hangxian-route-zhida">{{scope.row.legCount == '1' ? '直达' : '中转'}}</div>
              <div class="hangxian-route-sanzima">
                <div>{{scope.row.pod}}</div>
                <div>{{scope.row.podName}}</div>
              </div>
            </div>
          </div>
          <div v-else-if="column.label == '货物信息'" style="padding-top: 30px;">
            <div v-if="scope.row.status >= 13 && scope.row.inboundPiece">
              <div>品名：{{scope.row.cargoName}}</div>
              <div>{{scope.row.inboundPiece}}PCS</div>
              <div>{{scope.row.inboundCbm}}CBM</div>
              <div>{{scope.row.inboundWeight}}KGS</div>
              <div>1:{{scope.row.inboundVwr}}</div>
            </div>
            <div v-else>
              <div>品名：{{scope.row.cargoName}}</div>
              <div>{{scope.row.bookingPiece}}PCS</div>
              <div>{{scope.row.bookingCbm}}CBM</div>
              <div>{{scope.row.bookingWeight}}KGS</div>
              <div>1:{{scope.row.bookingVwr}}</div>
            </div>
          </div>
          <div v-else-if="column.label == '账单信息'" style="padding-top: 30px;">
            <div v-if="scope.row.payWay == '0'">付款买单<!-- —<span style="color: #F00;">未核销</span> --></div>
            <div v-if="scope.row.payWay == '1'">月结买单<!-- —<span style="color: #F00;">未核销</span> --></div>
            <div>单价：￥{{scope.row.bookingPrice || 0}}/kg</div>
            <div>应收账单：{{priceType(scope.row.totalArOrgn) || 0}}</div>
            <div>应付账单：{{priceType(scope.row.totalApOrgn) || 0}}</div>
            <div>利润：￥{{scope.row.orderProfit || 0}}</div>
          </div>
          <div v-else-if="column.label == '操作人员'" style="padding-top: 30px;">
            <div>航线：{{scope.row.principalName || '暂无'}}</div>
            <div>售前客服：{{scope.row.pscsName || '暂无'}}</div>
            <div>售中客服：{{scope.row.mscsName || '暂无'}}</div>
          </div>
          <div v-else-if="column.label == '状态'" style="padding-top: 30px;">
            <div v-if="scope.row.status == '5' || scope.row.status == '27' || scope.row.status == '29' || scope.row.status == '33'" style="color: #F00;">{{scope.row.statusDesc}}</div>
            <div v-else>{{scope.row.statusDesc}}</div>
          </div>
          <div v-else-if="column.label == '下单时间'" style="padding-top: 30px;">
            <div>{{scope.row.orderTime}}</div>
          </div>
          <div v-else-if="column.label == '备注'" style="padding-top: 30px;">
            <div>{{scope.row.remark}}</div>
          </div>
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
            <span style="color: #2273CE;">{{item.label}}</span>
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
    // 表格数据源
    tableData: {
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
      default: () => {}
    },
    // 总条数
    total: {
      type: Number,
      default: () => 0
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
        if(!idx){
          return
        }
        idx.forEach(row => {
          for(var i = 0; i < this.xuanzhong.length; i++){
            if(this.xuanzhong[i].code == row.code){
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
    priceType(json) {
      if(json){
        var arr = JSON.parse(json)
        var price = ''
        for(var i = 0; i < arr.length; i++){
          if(arr[i].currency == '1'){
            price += '￥'+arr[i].amount+'+'
          }else if(arr[i].currency == '2'){
            price += 'HK$'+arr[i].amount+'+'
          }else if(arr[i].currency == '3'){
            price += '$'+arr[i].amount+'+'
          }else if(arr[i].currency == '4'){
            price += '€'+arr[i].amount+'+'
          }else if(arr[i].currency == '5'){
            price += '￡'+arr[i].amount+'+'
          }
        }
        price = price.substring(0, price.length - 1)
        return price
      }
    },
    
    // 排序
    handleSort (column) {
      this.$emit('sortChange', column)
    },
    // 操作，将操作类型和当前row数据作为参数传递
    handleClick (method, row, e) {
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
    handleItemClick (method, scope) {
      if (method) {
        this.$emit(method, scope)
      }
    },
    // 页码跳转
    handleCurrent (val) {
      // this.rowSelect()
      this.$emit('currentChange', val)
    },
    // 展示条数
    handleSize (val) {
      this.$emit('sizeChange', val)
    },
    // 复选框选择
    handleSelect (val) {
      this.$emit('selectChange', val)
    },
    orderDetails(val) {
      this.$emit('orderDetails',val)
    },
    getDataName(scope, items) {
      return scope[items.prop]
    }
  }
}
</script>
<style lang="less" scoped>
  .hangxian-date{
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
  }
  .hangxian-route{
    display: flex;
    justify-content: space-between;
    text-align: center;
  }
  .hangxian-route .hangxian-route-sanzima div:last-child{
    line-height: 14px;
    font-size: 12px;
    font-weight: 500;
    color: #333333;
    flex: 0 0 96px;
    width: 96px;
    height: 28px;
    overflow: hidden;
    text-overflow: ellipsis;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
  .hangxian-route .hangxian-route-zhida{
    background-image: url(../assets/route_icon.png);
    flex: 0 0 34px;
    background-repeat: no-repeat;
    background-size: 34px;
    background-position: bottom center;
    height: 30px;
  }
  .dingdan{
    display: flex;
    position: absolute;
    top: 5px;
    min-width: 1600px;
  }
  .dingdan > div{
    margin-right: 50px;
    font-weight: 500;
    font-size: 14px;
  }
  .dingdan > div:last-child{
    margin-right: 0;
  }

</style>
