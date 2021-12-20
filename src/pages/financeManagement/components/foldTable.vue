<template>
  <div class="comm-table-back">
    <div class="tb-table">
      <div class="tb-thead">
        <div class="tb-tr">
        
          <div
            class="tb-th"
            v-for="(item, index) in columns"
            :key="index"
            :style="{ flex: item.width ? `0 0 ${item.width + 'px'}` : '' }"
          >
          <div v-if="item.checkBox">
               <el-checkbox
                  v-model="checkAll"
                  :disabled="pageSkipAll"
                  @change="check=>changeCheckAll(check)"
                ></el-checkbox>
          </div>
          <div v-else>
            {{ item.label }}
          </div>
          </div>
        </div>
      </div>
      <div class="tb-tbody" v-if="tableData && tableData.length > 0">
        <template v-for="(item2, index2) of tableData">
          <div class="tb-father" :key="index2">
            <div
              class="tb-td"
              v-for="(item, index) in columns"
              :key="index"
              :style="{ flex: item.width ? `0 0 ${item.width + 'px'}` : '' }"
            >
              <div v-if="item.checkBox == true">
                <el-checkbox
                  v-model="checked[index2]"
                  :disabled="pageSkipAll"
                  @change="check=>changeCheckBox(check,item2,index2)"
                ></el-checkbox>
              </div>
              <div v-else-if="item.key =='orderNo'">
                <div v-if="item2.orderInfos &&item2.orderInfos.length >0 ">
                     <el-popover
                        placement="bottom-start"
                        width="100"
                        trigger="hover"
                        popper-class="invoicePopper"
                        >
                        <div v-for="(item11,index11) in item2.orderInfos" :key ="index11">{{item11.orderNo}}</div>
                        <div slot="reference" @click="$emit('showOrderWayBill',item2)" style="color:skyblue">{{item2.orderNo}}</div>
                     </el-popover>
                  </div>
                    <div v-else>
                        <div@click="$emit('showOrderWayBill',item2)" style="color:skyblue">{{item2.orderNo}}</div>
                    </div>
              </div>
              <div v-else-if="item.key =='waybillNo'">
                <div v-if="item2.orderInfos &&item2.orderInfos.length >0 ">
                     <el-popover
                        placement="bottom-start"
                        width="100"
                        trigger="hover"
                        popper-class="invoicePopper"
                        >
                        <div v-for="(item11,index11) in item2.orderInfos" :key ="index11">{{item11.waybillNo}}</div>
                        <div slot="reference" @click="$emit('showOrderWayBill',item2)" style="color:skyblue">{{item2.waybillNo}}</div>
                     </el-popover>
                  </div>
                    <div v-else>
                        <div@click="$emit('showOrderWayBill',item2)" style="color:skyblue">{{item2.waybillNo}}</div>
                    </div>
              </div>
              <div v-else-if="item.key =='departureDate'">
                 <div v-if="item2.orderInfos &&item2.orderInfos.length >0">
                    <el-popover
                        placement="bottom-start"
                        width="60"
                        trigger="hover"
                        popper-class="invoicePopper"
                        >
                        <div v-for="(item11,index11) in item2.orderInfos" :key ="index11">{{item11.departureDate}}</div>
                        <div slot="reference">{{item2.departureDate}}</div>
                     </el-popover>
                  </div>
                  <div  v-else>
                      <div>{{item2.departureDate}}</div>
                  </div>
              </div>
              <div v-else-if="item.key =='presentationTime'">
                 <div v-if="item2.orderInfos &&item2.orderInfos.length >0">
                     <el-popover
                        placement="bottom-start"
                        width="60"
                        trigger="hover"
                        popper-class="invoicePopper"
                        >
                        <div v-for="(item11,index11) in item2.orderInfos" :key ="index11">{{item11.presentationTime}}</div>
                        <div slot="reference">{{item2.presentationTime}}</div>
                     </el-popover>
                  </div>
                  <div  v-else>
                      <div>{{item2.presentationTime}}</div>
                  </div>
              </div>
              <div v-else-if="item.key=='showInvoice'">
                <div @click="$emit('showInvoice',item2)" style="color:skyblue">查看</div>
              </div>
              <div v-else-if="item.key=='invoiceType'">
                <div>{{item2.invoiceType==0?"增值税普通发票":item2.invoiceType==1?"增值税专用发票":item2.invoiceType==2?"增值税电子普通发票":""}}</div>
              </div>
              <div v-else-if="item.key=='invoicingStatus'">
                <div>{{item2.invoicingStatus==0?"未开":item2.invoicingStatus==1?"部分开":item2.invoicingStatus==2?"已开":""}}</div>
              </div>
              <div v-else-if="item.key=='invoiceNum'">
                <el-popover
                              placement="bottom-start"
                              width="40"
                              trigger="hover"
                              popper-class="invoicePopper"
                              v-if="item2.invoiceInfos"
                              >
                              <div v-for="(item11,index11) in item2.invoiceInfos" :key ="index11">{{item11.invoiceNum}}</div>
                              <div slot="reference"> <template v-if="item2.hasChild">
    <img
                  src="../../../assets/xiajiantou.png"
                  class="foldImg"
                  v-if="item2.ifFold"
                  @click="foldRow(item2, index2)"
                />
                <img
                  src="../../../assets/youjiantou.png"
                  class="foldImg"
                  v-else
                  @click="foldRow(item2, index2)"
                />
  </template>{{item2.invoiceNum}}
  
               
                              </div>
                          </el-popover>
              </div>
              <div v-else-if="item.key=='invoicingTime'">
                <div>
                         <el-popover
                              placement="bottom-start"
                              width="40"
                              popper-class="invoicePopper"
                              trigger="hover"
                               v-if="item2.invoiceInfos"
                              >
                              <div v-for="(item11,index11) in item2.invoiceInfos" :key ="index11">{{item11.invoicingTime}}</div>
                              <div slot="reference">{{item2.invoicingTime}}</div>
                          </el-popover>
                       </div>
              </div>
              <div v-else-if="item.key=='expressInfo'">
                <div v-html="dealExpress(item2.expressInfo)" style="white-space:pre-line;text-align:left!important;width:100%"></div>
              </div>
              <div v-else-if="item.key=='expressStatus'">
                <div @click="$emit('openPost',item2)">
                    {{item2.expressStatus}}
                  </div>
                 </div>
              <div v-else :style="styleObject(item, item2)" class="tb-span" >
                {{ item2[item.key] }}{{item.unit?item.unit:''}}
              </div>
            </div>
          </div>
          <div style="min-width:3255px;height:300px;overflow-y:scroll;" v-if="item2.ifFold && item2.hasChild" class="tb-son">
          <template v-for="(item3, key) in item2.invoiceInfos" id="fold">
            <div class="tb-tr" v-show="item2.ifFold && item2.hasChild" :key="key + '' + index2">
              <div
                class="tb-td"
                v-for="(item, index4) of columns"
                :key="index4"
                :style="{ flex: item.width ? `0 0 ${item.width + 'px'}` : '' }"
              >
                <div v-if="item.checkBox == true" style="opacity:0">
                  <el-checkbox
                    @change=""
                  ></el-checkbox>
                </div>
                  <div v-else-if="item.key == 'invoicingStatus'">
                  <el-checkbox
                    @change="check=>changeCheckBox(check,item3)"
                  ></el-checkbox>
                </div>
                <div v-else-if="item.key=='expressInfo'">
                <div v-html="dealExpress(item3.expressInfo)" style="white-space:pre-line;text-align:left!important;width:100%"></div>
              </div>
                <div v-else-if="item.key=='invoiceType'"></div>
                <div v-else-if="item.key=='invoicedAmount'"  class="tb-span">{{item3.invoiceAmount}}</div>
                <div v-else :style="styleObject(item, item3)" class="tb-span">
                  {{ item3[item.key] }}
                </div>
                 
              </div>
            </div>
          </template>
          </div>
         
        </template>
      </div>
      <div v-else class="no-data">暂无数据</div>
    </div>
  </div>
</template>
<script>
// import Tools from '@/utils/tools'
// import anime from '../../utils/anime.es'
export default {
  props: {
    //列配置
    columns: {
      type: Array,
      default: () => {
        return [
          { checkBox: true, width: 50 },
          { label: "订单号", width: 160, key: "orderNo" },
          { label: "运单号", width: 160, key: "waybillNo" },
          { label: "订舱公司", width: 160, key: "customerName" },
          { label: "航班日期", width: 160, key: "departureDate" },
          { label: "交单时间", width: 160, key: "presentationTime" },
          { label: "发票抬头", width: 160, key: "invoiceTitle" },
          { label: "开票信息", width: 160, key: "showInvoice" },
          { label: "应收费用总金额", width: 160, key: "totalArCny" },
          {
            label: "申请开票金额",
            width: 160,
            key: "applyAmount",
            unit: "CNY",
          },
          { label: "发票种类", width: 160, key: "invoiceType" },
          { label: "申请人", width: 160, key: "applicant" },
          { label: "申请时间", width: 160, key: "applyTime" },
          { label: "开票进度", width: 160, key: "invoicingStatus" },
          { label: "已开票金额", width: 160, key: "invoicedAmount" },
          { label: "发票号码", width: 160, key: "invoiceNum" },
          { label: "开票时间", width: 160, key: "invoicingTime" },
          { label: "快递信息", width: 160, key: "expressInfo" },
          { label: "快递状态", width: 160, key: "expressStatus" },
          { label: "发票状态", width: 160, key: "invoiceStatus" },
          { label: "是否上传", width: 160, key: "upload" },
        ];
      },
    },
    styleObject: {
      type: Function,
      default: function () {},
    },
    //表格数据
    tableData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    //跨页全选
    pageSkipAll: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      //选中表格数据
      selectResult: [],
      //表格行选中
      checked: [],
      //表头全选
      checkAll: false,
    };
  },
  mounted() {},
  watch: {
    tableData() {
      console.log();
      this.selectResult = [];
      for (let i = 0; i < this.tableData.length; i++) {
        this.$set(this.checked, i, false);
      }
    },
    pageSkipAll() {
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.pageSkipAll == true) {
          this.$set(this.checked, i, true);
          this.checkAll = true;
        } else {
          this.$set(this.checked, i, false);
          this.checkAll = false;
        }
      }
    },
  },
  computed: {},
  methods: {
    //控制快递信息列显示内容
    dealExpress(express) {
      if (!express) {
        express = "";
        return "";
      }
      let data = express.split(",");
      return `<div>公司:${data[0] ? data[0] : ""}\n单号:${
        data[1] ? data[1] : ""
      }\n日期:${data[2] ? data[2] : ""}</div>`;
    },
    //表格头全选事件
    changeCheckAll(e) {
      for (let i = 0; i < this.tableData.length; i++) {
        if (e == true) {
          this.$set(this.checked, i, true);
        } else {
          this.$set(this.checked, i, false);
        }
      }
      if (e == true) {
        this.$emit("changeCheckBox", this.tableData);
      } else {
        this.$emit("changeCheckBox", []);
      }
    },
    //表格选择列选中事件
    changeCheckBox(e, i, index) {
      console.log(i);
      if (index != undefined) {
        this.checked[index] = e;
      }
      if (e == true) {
        this.selectResult.push(i);
      } else {
        let index = this.selectResult.findIndex((item) => (item.id = i.id));
        this.selectResult.splice(index, 1);
      }
      console.log(this.checked);
      this.$emit("changeCheckBox", this.selectResult);
    },
    //展开箭头点击事件
    foldRow(item2, index2) {
      // console.log(item2.ifFold,"FOLD1")
      // debugger
      console.log(item2.ifFold);
      item2.ifFold = !item2.ifFold;
    },
  },
};
</script>
<style lang="less"  scoped>
.comm-table-back {
  .tb-table {
    overflow: scroll;
    margin: 0 auto;
    .tb-thead {
      border-collapse: collapse;
      .tb-tr {
        display: flex;
        .tb-th {
          flex: 1;
          background-color: #5b95ff;
          padding: 0.375rem 0;
          font-size: 8px;
          color: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          &:first-child {
            background-color: #5b95ff;
            position: sticky;
            left: 0;
            z-index: 10;
          }
        }
      }
    }
    .tb-tbody {
      .tb-father {
        display: flex;
        &:nth-child(odd) {
          min-width: 3250px;
          background-color: #ffffff;
          .tb-td {
            &:first-child {
              background-color: #ffffff;
              position: sticky;
              left: 0;
              z-index: 10;
            }
          }
        }
        &:nth-child(even) {
          min-width: 3250px;
          background-color: #f2f6ff;
          .tb-td {
            &:first-child {
              background-color: #f2f6ff;
              position: sticky;
              left: 0;
              z-index: 10;
            }
          }
        }
        .tb-td,
        .tb-th {
          flex: 1;
          padding: 0.375rem 0;
          color: #343434;
          font-size: 10px;
          font-weight: 400;
          display: flex;
          justify-content: center;
          text-align: center !important;
          align-items: center;
          // position:relative;
          // &:first-child{
          //   .foldContent{
          //     position:absolute;
          //     left:10px;
          // }
          // }

          &:first-child {
            .tb-span {
              width: 3.5rem;
              overflow: auto;
              text-align: center;
              white-space: nowrap;
              // margin-right:5px;
              img {
                // position:absolute;
                // left:3.5rem;
                margin-left: 5px;
                width: 12px;
                height: 12px;
                // position:fixed;
                // padding:0 5px;
              }
            }
          }
          .foldImg {
            width: 10px;
            height: 10px;
            margin-right: 5px;
            transform: translateY(-1px);
          }
          &:first-child {
            font-weight: bolder !important;
          }
          .tb-span {
          }
        }
      }
      .tb-son {
        .tb-tr {
          display: flex;
          &:nth-child(odd) {
            min-width: 3250px;
            background-color: #ffffff;
            .tb-td {
              &:first-child {
                background-color: #ffffff;
                position: sticky;
                left: 0;
                z-index: 10;
              }
            }
          }
          &:nth-child(even) {
            min-width: 3250px;
            background-color: #f2f6ff;
            .tb-td {
              &:first-child {
                background-color: #f2f6ff;
                position: sticky;
                left: 0;
                z-index: 10;
              }
            }
          }
          .tb-td,
          .tb-th {
            flex: 1;
            padding: 0.375rem 0;
            color: #343434;
            font-size: 10px;
            font-weight: 400;
            display: flex;
            justify-content: center;
            text-align: center !important;
            align-items: center;
            // position:relative;
            // &:first-child{
            //   .foldContent{
            //     position:absolute;
            //     left:10px;
            // }
            // }

            &:first-child {
              .tb-span {
                width: 3.5rem;
                overflow: auto;
                text-align: center;
                white-space: nowrap;
                // margin-right:5px;
                img {
                  // position:absolute;
                  // left:3.5rem;
                  margin-left: 5px;
                  width: 12px;
                  height: 12px;
                  // position:fixed;
                  // padding:0 5px;
                }
              }
            }
            .foldImg {
              width: 10px;
              height: 10px;
              margin-right: 5px;
              transform: translateY(-1px);
            }
            &:first-child {
              font-weight: bolder !important;
            }
            .tb-span {
            }
          }
        }
      }
    }
    .no-data {
      font-size: 10px;
      color: #b9b9b9;
      padding: 30px 0;
      text-align: center;
    }
  }
}
</style>
