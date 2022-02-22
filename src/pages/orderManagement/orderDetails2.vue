<template>
  <div class="contont content-wrap" v-if="isDataDone">
    <header class="content-fix-tools">
      <div v-if="initData.status == 9">
      <el-button type="" disabled class="setWidth">{{
        initData.statusDesc
      }}</el-button>
      <el-button type="primary" @click="saveOrder">保存</el-button>
      <el-button type="primary" class="setWidth" @click="exdeOrder(1)"
        >货物已进仓</el-button
      >
      <el-button type="danger" @click="exdeOrder(2)">取消订单</el-button>
    </div>
    <div class="common">
      <div>
        <span>订单号</span>
        <span>{{ initData.orderNo }}</span>
      </div>
      <div>
        <span>起运港 </span>
        <span>{{ initData.pol }}</span>
      </div>
      <div class="flex">
        <span>航司 </span>
        <span>
          <el-select
            v-model="initData.airCompanyCode"
            filterable
            size="mini"
            placeholder="请选择"
          >
            <el-option
              v-for="item in airCompanyCodeList"
              :key="item.airCompanyCode"
              :label="item.airCompanyCode + '-' + item.name"
              :value="item.airCompanyCode"
            >
            </el-option>
          </el-select>
        </span>
      </div>
      <div class="flex">
        <span>航班号 </span>
        <span>
          <el-input
           @blur="initData.flightNo = $event.target.value"
            onkeyup="value=value.replace(/[\W]/g,'')"
            maxlength='6'
            v-model="initData.flightNo"
            size="mini"
            placeholder="请输入航班号" />
        </span>
      </div>
      <div class="flex">
        <span>订舱单价 </span>
        <span>
          <el-input
            v-model="initData.bookingPrice"
            size="mini"
            placeholder="请输入内容"
          >
            <template slot="prepend">￥</template></el-input
          ></span
        >
      </div>
     <div class="flex">
        <img src="../../assets/orderNo.svg" alt="" style="width:15px;height:15px" @click="jumpToOrder">
        <span>运单号 </span>
        <span>
          <el-input
            v-model="initData.waybillNo"
            size="mini"
            placeholder="请输入内容"
          ></el-input>
        </span>
      </div>
      <div class="flex">
        <span>分单号 </span>
        <span>
          <el-input
            v-model="initData.subWaybillNo"
            size="mini"
            placeholder="请输入内容"
            maxlength="80"
          ></el-input>
        </span>
          <span style="fontSize:10px;fontWeight:400;color:#999;transform:translateY(-16px);margin-left:6px">
        <img src="../../assets/billOrderTip.svg" alt="" style="width:15px;height:15px">
        请使用逗号隔开
        </span>
      </div>
      <div>
        <span>目的港 </span>
        <span> {{ initData.pod }}</span>
      </div>
      <div>
        <span>日期 </span>
        <departure-date-picker :date.sync="initData.departureDate" />
      </div>
      <div v-if="notAirPeople && notSaleBefore">
        <span>利润 </span>
        <span>￥{{ initData.orderProfit }}</span>
      </div>
      <div>
        <span>客 户 </span>
        <span>{{ initData.customerName }}</span>
      </div>
      <div>
        <span>代 理</span>
          <el-select
            v-model="initData.agentName"
            filterable
            size="mini"
            :disabled="canSelectAgent"
            placeholder="请选择"
          >
            <el-option
              v-for="item in agentIdList"
              :key="item.id"
              :label="item.agentName"
              :value="item.agentName"
            >
            </el-option>
          </el-select>
      </div>
      <div class="flex">
        <span>进仓编号</span>
        <span>
          <el-input
            v-model="initData.inboundNo"
            size="mini"
            :disabled="initData.status >= 13"
            placeholder="请输入内容"
          ></el-input
        ></span>
      </div>
      <div>
        <span>航线负责人</span>
        <span>
          <el-select
            v-model="initData.principalName"
            @change="getSelectPrincipalId"
            filterable
            size="mini"
            placeholder="请选择"
          >
            <el-option
              v-for="item in airLineList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </span>
      </div>
      <div>
        <span>售前客服</span>
        <span>
          <el-select
            v-model="initData.pscsName"
            @change="getSelectPscsId"
            size="mini"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in preSaleList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </span>
      </div>
      <div>
        <span>售中客服</span>
        <span>
          <el-select
            v-model="initData.mscsName"
            @change="getSelectMscsId"
            filterable
            size="mini"
            placeholder="请选择"
          >
            <el-option
              v-for="item in onSaleList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </span>
      </div>
    </div>
    </header>
    
    <!-- 标签切换 -->
    <tab-bar :tab.sync="radio1" :order="initData" />
    <div class="order-tab-details-wrap">
      <div v-show="radio1 == '1'">
        <h1 class="title">订舱信息</h1>
        <div class="flex">
          <div class="flex_message">品名</div>
          <div>
            <el-input
              size="mini"
              class="ml_10"
              v-model="initData.cargoName"
              placeholder="请输入内容"
            ></el-input>
          </div>
        </div>
        <div class="flex mtop_10">
          <div class="flex_message">品类</div>
          <div>
            <el-select
              class="ml_10"
              size="mini"
              v-model="initData.cargoType"
              placeholder="请选择"
            >
              <el-option
                v-for="item in cargoTypeArray"
                :key="item.value"
                :label="item.lable"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="flex mtop_10">
          <div class="flex_message">包装类型</div>
          <div>
            <el-select
              class="ml_10"
              size="mini"
              v-model="initData.packageType"
              @change="selectTrigger"
              placeholder="请选择"
            >
              <el-option
                v-for="item in packageTypeArray"
                :key="item.value"
                :label="item.lable"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="flex mtop_15">
          <div class="flex_message">单价</div>
          <div>
            <span class="ml_10">￥{{ initData.bookingPrice }}</span>
          </div>
        </div>
        <div class="flex mtop_15">
          <div class="flex_message">航线</div>
          <div>
            <span class="ml_10">{{ initData.pol }}-{{ initData.pod }}</span>
          </div>
        </div>
        <div class="flex mtop_15">
          <div class="flex_message">上家托书</div>
          <div>
            <el-button class="ml_10" @click="downLoadPdf" size="mini"
              >点击下载<i class="el-icon-download el-icon--right"></i
            ></el-button>
          </div>
          <div style="display: flex">
            <div
              v-for="(item, index) in pdfDownLoad"
              :key="index"
              style="margin-left: 20px"
            >
              <div @click="downLoadPDFs(item)" style="text-align: center">
                <img
                  src="../../assets/pdf.png"
                  alt=""
                  v-if="item.attachmentType == 3"
                />
              </div>
              <div
                @click="previewPDF(item)"
                style="
                  width: 60px;
                  fontsize: 10px;
                  lineheight: 15px;
                  margin-left: 10;
                  text-align: center;
                  cursor: pointer;
                "
                v-if="item.attachmentType == 3"
              >
                {{ item.attachmentName }}
              </div>
            </div>
          </div>
          <el-dialog
            title=""
            :visible.sync="pdfDialogVisible"
            width="80%"
            top="0vh"
            center
          >
            <embed style="width: 100%; height: 90vh" :src="filePath" />
          </el-dialog>
        </div>
        <h1 class="title mtop_15">订舱数据</h1>
        <div class="bg_dark">
          <div class="flex_center">
            <div>件数</div>
            <div>毛重</div>
            <div>体积</div>
            <div>比重</div>
            <div>分泡比例</div>
            <div>计费重</div>
          </div>
          <div class="flex_center mtop_10">
            <div>{{ initData.bookingPiece }}</div>
            <div>{{ initData.bookingWeight }}</div>
            <div>{{ initData.bookingCbm }}</div>
            <div>{{ initData.bookingVwr }}</div>
            <div>
              <span v-if="initData.bubblePoint == 1">1/9</span>
              <span v-if="initData.bubblePoint == 2">2/8</span>
              <span v-if="initData.bubblePoint == 3">3/7</span>
              <span v-if="initData.bubblePoint == 4">4/6</span>
              <span v-if="initData.bubblePoint == 5">5/5</span>
              <span v-if="initData.bubblePoint == 6">6/4</span>
              <span v-if="initData.bubblePoint == 7">7/3</span>
              <span v-if="initData.bubblePoint == 8">8/2</span>
              <span v-if="initData.bubblePoint == 9">9/1</span>
              <span v-if="initData.bubblePoint == 10">不分泡</span>
            </div>
            <div>{{ initData.bookingCw }}</div>
          </div>
        </div>
        <!-- <div class="bg_table" v-if="(initData.trayDetail[0].trayNumber !== '')"> -->
        <div class="bg_table" v-show="initData.packageType !== 1">
          <div class="flex_center border padding_contont">
            <div>托盘数量</div>
            <div>长（cm）</div>
            <div>宽（cm）</div>
            <div>高（cm）</div>
            <div></div>
          </div>
          <div
            class="flex_center border padding_contont contont-box"
            v-for="(item, index) in DataCope.trayDetail"
            :key="index"
          >
            <div>
              <div class="booking-form-item-content">
                <input
                  v-model="item.trayNumber"
                  onkeyup="value=value.replace(/[^\d]/g, '')"
                  maxlength="3"
                  type="text"
                />
              </div>
            </div>
            <div>
              <div class="booking-form-item-content">
                <input
                  v-model="item.traySize"
                  onkeyup="value=value.replace(/[^\d]/g, '')"
                  maxlength="3"
                  type="text"
                />
              </div>
            </div>
            <div>
              <div class="booking-form-item-content">
                <input
                  v-model="item.trayWidth"
                  onkeyup="value=value.replace(/[^\d]/g, '')"
                  maxlength="3"
                  type="text"
                />
              </div>
            </div>
            <div>
              <div class="booking-form-item-content">
                <input
                  v-model="item.trayHeight"
                  onkeyup="value=value.replace(/[^\d]/g, '')"
                  maxlength="3"
                  type="text"
                />
              </div>
            </div>
            <div>
              <el-button
                v-show="
                  DataCope.trayDetail.length < 10 &&
                  DataCope.trayDetail.length > 0 &&
                  DataCope.trayDetail.length - 1 == index
                "
                class="tianjia"
                @click="trayAddClick(index, key)"
                style="margin-left: 15px"
                >添加</el-button
              >
              <el-button
                type="danger"
                class="de_n"
                v-show="
                  DataCope.trayDetail.length - 1 !== index ||
                  DataCope.trayDetail.length == 10
                "
                style="margin-left: 15px"
              ></el-button>
              <el-button
                type="danger"
                class="de"
                v-show="DataCope.trayDetail.length > 1"
                @click="trayDeleteClick(index)"
                style="margin-left: 15px"
                >删除</el-button
              >
              <el-button
                type="danger"
                class="de_n"
                v-show="DataCope.trayDetail.length == 1"
                style="margin-left: 15px"
              ></el-button>
            </div>
          </div>
        </div>

        <!-- <h1 class="title">进仓数据</h1>
              <div class="inData ">
                  <div class="flex_center">
                      <div><el-input size="mini" class="ml_10" v-model="initData.inboundPiece" placeholder=""></el-input></div>
                      <div><el-input size="mini" class="ml_10" v-model="initData.inboundWeight" @change="calcVwr" placeholder=""></el-input></div>
                      <div><el-input size="mini" class="ml_10"  v-model="initData.inboundCbm" @change="calcVwr" placeholder=""></el-input></div>
                      <div><el-input size="mini" class="ml_10" :value="initData.inboundVwr == null ? showCwr : '1:' + initData.inboundVwr  " placeholder=""></el-input></div>
                      <div>
                        <el-select class="ml_10" size="mini" v-model="initData.bubblePoint" @change="calcVwr" placeholder="请选择">
                            <el-option
                              v-for="item in bubblePointArray"
                              :key="item.value"
                              :label="item.lable"
                              :value="item.value">
                            </el-option>
                          </el-select>
                      </div>
                      <div><el-input size="mini" class="ml_10"  v-model="initData.inboundCw" placeholder=""></el-input></div>
                  </div>
                  <div class="flex_center mtop_10">
                      <div>件数</div>
                      <div>毛重</div>
                      <div>体积</div>
                      <div>比重</div>
                      <div>分泡比例</div>
                      <div>计费重</div>
                  </div>
              </div> -->
        <h1 class="title">其他服务</h1>
        <div
          class="inData"
          style="background: rgb(240, 240, 240); padding-left: 20px"
        >
          <div>
            <span class="mr_25">报关服务</span>
            <el-radio-group v-model="initData.customsType">
              <el-radio :label="1">自行报关</el-radio>
              <el-radio :label="2">委托报关</el-radio>
            </el-radio-group>
        </div>
          <div class="mtop_10">
            <span class="mr_25">国内提货</span>
            <el-radio-group v-model="initData.isPickUp">
              <el-radio :label="1">不需要</el-radio>
              <el-radio :label="2">需要</el-radio>
            </el-radio-group>
          </div>
          <!-- 提货表单 -->
          <pick-up-form
            v-show="initData.isPickUp === 2"
            :pickUpAddress.sync="initData.pickUpAddress"
            :pickUpContacts.sync="initData.pickUpContacts"
            :pickUpTel.sync="initData.pickUpTel"
            :pickUpTime.sync="initData.pickUpTime" />
          <div class="mtop_10">
            <span class="mr_25">清关服务</span>
            <el-radio-group v-model="initData.cclType">
              <el-radio :label="1">自行清关</el-radio>
              <el-radio :label="2">DDU</el-radio>
              <el-radio :label="3">DDP</el-radio>
              <el-radio :label="4">DAP</el-radio>
            </el-radio-group>
          </div>
          <!-- 送货表单 -->
          <deliver-goods-form
            v-show="initData.cclType !== 1"
            :deliveryAddress.sync="initData.deliveryAddress"
            :deliveryContacts.sync="initData.deliveryContacts"
            :deliveryTel.sync="initData.deliveryTel" />
        </div>
        <h1 class="title">订单备注</h1>
        <div class="inData">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入备注"
            v-model="initData.remark"
          >
          </el-input>
        </div>

        <div class="paddingBottom"></div>
      </div>
      <div v-show="radio1 == '2'">
        <bill-order
        @changePayWay="changePayWay" 
        :payWay="initData.payWay"
          v-show="notAirPeople"
          :getList="initData.arOrderPriceList && initData.arOrderPriceList[0] && initData.arOrderPriceList[0].list"
          :notSaleBefore="true"
          ref="typeOne"
          :titleType="1"
          :vertifyAmount="initData.totalRcWoCny"
        />
        <el-button class="setWidth ml_20" @click="fatherAddOneItem(1)" v-if="notAirPeople"
          >添加费用</el-button
        >
        <div class="line"></div>
        <bill-order :getList="initData.apOrderPriceList" ref="typeTwo" :canSelectAgent="canSelectAgent" :notSaleBefore="notSaleBefore" :titleType="2"  :vertifyAmount="initData.totalApWoCny"/>
        <el-button class="setWidth ml_20" @click="fatherAddOneItem(2)" v-if="notSaleBefore"
          >添加费用</el-button
        >
        <div class="line" v-if="notSaleBefore"></div>
      </div>
      <!-- 进仓指引 -->
      <entry-guide
        v-show="radio1 == '3'"
        :entryData="initData"
        @change="
          (data) => {
            initData = { ...initData, ...data };
          }
        "
      />
      <div v-if="radio1 == '111'" style="margin:-20px 0 0 -20px">
        <ladingBill :orderEmbed="initData.orderNo"></ladingBill>
      </div>
    </div>
  </div>
</template>
<script>
import billOrder from "./components/billOrder.vue";
import { judgeWaybillNo } from "@/util/util";
import TabBar from "./components/TabBar.vue";
import ladingBill from './ladingBillDownLoad.vue'
import EntryGuide from "./components/EntryGuide.vue";
import DepartureDatePicker from "./components/DepartureDatePicker";
import PickUpForm from './components/PickUpForm'
import DeliverGoodsForm from './components/DeliverGoodsForm'
export default {
  data() {
    return {
      notAirPeople:true,
      notSaleBefore:true,
      //pdf预览和下载
      pdfDownLoad: "",
      pdfDialogVisible: false,
      DataCope: [],
      orderNo: "",
      orderId: "",
      initData: {},
      isDataDone: false,
      radio1: "1",
      pdfIMg: require("../../assets/pdf.png"),
      preSaleList: [], // 售前客服初始数组
      onSaleList: [], // 售中客服初始数组
      airLineList: [], // 航线负责人初始数组
      airCompanyCodeList: [], // 航司初始数组

      // trayDetail_number:{},
      bubblePointArray: [
        {
          value: 1,
          lable: "1/9",
        },
        {
          value: 2,
          lable: "2/8",
        },
        {
          value: 3,
          lable: "3/7",
        },
        {
          value: 4,
          lable: "4/6",
        },
        {
          value: 5,
          lable: "5/5",
        },
        {
          value: 6,
          lable: "6/4",
        },
        {
          value: 7,
          lable: "7/3",
        },
        {
          value: 8,
          lable: "8/2",
        },
        {
          value: 9,
          lable: "9/1",
        },
        {
          value: 10,
          lable: "不分泡",
        },
      ], // 分泡比率数组
      cargoTypeArray: [
        {
          value: 1,
          lable: "普货",
        },
        {
          value: 2,
          lable: "化工",
        },
        {
          value: 3,
          lable: "危险品",
        },
        {
          value: 4,
          lable: "防疫物资",
        },
      ],
      packageTypeArray: [
        {
          value: 1,
          lable: "散货",
        },
        {
          value: 2,
          lable: "托盘",
        },
      ],
      agentIdList:[]
    };
  },
  components: {
    billOrder,
    TabBar,
    EntryGuide,
    DepartureDatePicker,
    ladingBill,
    PickUpForm,
    DeliverGoodsForm,
  },
  computed: {
    //页面代理是否可选
    canSelectAgent() {
      if(this.initData.status==39){ //取消
        if(this.initData.prestatus >=25){
                return true
        }else{
                return false
        }
      }else{
        if(this.initData.status >=25){
             return true
        }else{
          return false
        }
}
    },
    getInboundCw() {
      return this.initData.inboundCw;
    },
    getBookingPrice() {
      return this.initData.bookingPrice;
    },
  },
  watch: {
    getInboundCw(newValue) {
      this.dealChildPrice(newValue);
    },
    getBookingPrice(nv) {
      this.dealBookingPrice(nv);
    },
  },
  async created() {
    let dataShow = JSON.parse(sessionStorage.getItem("userInfo"))
    if(dataShow.name != "admin"){
      if(dataShow.roleName == "航线负责人") {
        this.notAirPeople = false
      }
      else if(dataShow.roleName == "售前客服") {
        this.notSaleBefore = false
      }
    }
    this.orderId = this.$route.query.id;
    await this.getOriganData();
    await this.initSysSetTing();
  },
  methods: {
    //跳转到提单页面
    jumpToOrder(){
      this.$router.push({
        name:"ladingBillDownLoad",
        params:{
          orderNo:this.initData.orderNo
        }
      })
    },
    changePayWay(val){
      this.initData.payWay = val
      // console.log(val)
    },
    trayAddClick(index, key) {
      var json = {
        trayNumber: "",
        traySize: "",
        trayWidth: "",
        trayHeight: "",
      };
      this.DataCope.trayDetail.push(json);
    },
    trayDeleteClick(index) {
      this.DataCope.trayDetail.splice(index, 1);
      // console.log(this.DataCope.trayDetail)
    },
    // selectTrigger(e){
    //   console.log(e);
    //   this.initData.packageType=e
    //   // 将更改数据传进后台
    // },
    //下载pdf
    downLoadPDFs(item) {
      axios({
        method: "get",
        url: item.xpath,
        responseType: "arraybuffer", //接受使用分片方式
      }).then((res) => {
        const aLink = document.createElement("a");
        let blob = new Blob([res], {
          type: "application/pdf",
        });
        aLink.href = URL.createObjectURL(blob);
        aLink.setAttribute("download", item.attachmentName); // 设置下载文件名称
        aLink.click();
        document.body.appendChild(aLink);
      });
    },
    //预览pdf
    previewPDF(item) {
      this.pdfDialogVisible = true;
      this.filePath = item.xpath;
    },
    exdeOrder(e) {
      let irder = this.DataCope;
      if (this.initData.packageType !== 1) {
        for (var i = 0; i < irder.trayDetail.length; i++) {
          if (
            irder.trayDetail[i].trayNumber == "" ||
            irder.trayDetail[i].traySize == "" ||
            irder.trayDetail[i].trayWidth == "" ||
            irder.trayDetail[i].trayHeight == ""
          ) {
            return this.$message.error("请完整填写订舱托盘数据");
          }
        }
      }
      if (e === 1) {
        if (this.initData.waybillNo) {
          // 校验运单号
          const { waybillNo } = this.initData;
          const waybillNoTest = /(^\d{3}-\d{8}$)|(^\d{11}$)/.test(waybillNo);
          if (!waybillNoTest) {
            return this.$message.error(
              "运单号应为: xxx—xxxxxxxx或xxxxxxxxxxx共计11位数字"
            );
          }
        } else {
          this.initData.waybillNo = null;
        }
      }
      this.initData.trayDetail = JSON.stringify(irder.trayDetail);
      // let order = this.initData
      // ctrlFlag 1 前进状态 2 取消   （3 待平台审核 失败的时候传3）
      if (e == 1) {
        let { inboundNo } = this.initData;
        if (!inboundNo) {
          this.$message.error("请输入进仓编号");
          return;
        }
        let boolenNo = judgeWaybillNo(inboundNo);
        if (boolenNo) {
          let arrayTypeOne = this.$refs.typeOne.tableData;
          let arrayTypeTwo = this.$refs.typeTwo.tableData;
          let order = this.initData;
          if (order.hasOwnProperty("apOrderPriceList")) {
            delete order.apOrderPriceList;
          }
          if (order.hasOwnProperty("orderCargoDetailList")) {
            delete order.orderCargoDetailList;
          }
          if (order.hasOwnProperty("orderPriceList")) {
            delete order.orderPriceList;
          }
          // if(order.hasOwnProperty('trayDetail')){
          // delete order.trayDetail
          // }
          let orderPriceList = arrayTypeOne.concat(arrayTypeTwo);

          let params = {
            order: order,
            orderPriceList: orderPriceList,
            ctrlMap: {
              ctrlFlag: e,
            },
          };
          this.$http
            .post(this.$service.orderExecuteOrder, params)
            .then((data) => {
              if (data.code == 200) {
                this.$message("成功");
                // this.$router.push("/orderManagement/orderManage");
                this.$utils.orderDetailRefresh(this.initData)
              } else {
                this.$message.error(data.message);
              }
            });
        } else {
          this.$message.error("进仓编号最大输入20位");
        }
      } else {
        let arrayTypeOne = this.$refs.typeOne.tableData;
        let arrayTypeTwo = this.$refs.typeTwo.tableData;
        let order = this.initData;
        if (order.hasOwnProperty("apOrderPriceList")) {
          delete order.apOrderPriceList;
        }
        if (order.hasOwnProperty("orderCargoDetailList")) {
          delete order.orderCargoDetailList;
        }
        if (order.hasOwnProperty("orderPriceList")) {
          delete order.orderPriceList;
        }
        // if(order.hasOwnProperty('trayDetail')){
        // delete order.trayDetail
        // }
        let orderPriceList = arrayTypeOne.concat(arrayTypeTwo);

        let params = {
          order: order,
          orderPriceList: orderPriceList,
          ctrlMap: {
            ctrlFlag: e,
          },
        };
        this.$http
          .post(this.$service.orderExecuteOrder, params)
          .then((data) => {
            if (data.code == 200) {
              this.$message("成功");
              // this.$router.push("/orderManagement/orderManage");
              this.$utils.orderDetailRefresh(this.initData)
            } else {
              this.$message.error(data.message);
            }
          });
      }
    },
    saveOrder() {
      let irder = this.DataCope;
      if (this.initData.packageType !== 1) {
        for (var i = 0; i < irder.trayDetail.length; i++) {
          if (
            irder.trayDetail[i].trayNumber == "" ||
            irder.trayDetail[i].traySize == "" ||
            irder.trayDetail[i].trayWidth == "" ||
            irder.trayDetail[i].trayHeight == ""
          ) {
            return this.$message.error("请完整填写订舱托盘数据");
          }
        }
      }
      if (this.initData.waybillNo) {
        // 校验运单号
        const { waybillNo } = this.initData;
        const waybillNoTest = /(^\d{3}-\d{8}$)|(^\d{11}$)/.test(waybillNo);
        if (!waybillNoTest) {
          return this.$message.error(
            "运单号应为: xxx—xxxxxxxx或xxxxxxxxxxx共计11位数字"
          );
        }
      } else {
        this.initData.waybillNo = null;
      }
      const { pickUpAddress ,pickUpContacts, pickUpTel, pickUpTime, isPickUp, deliveryAddress, deliveryContacts, deliveryTel, cclType } = this.initData
      // 校验提货信息
      if (isPickUp === 2) {
        const checkPickUp = [pickUpAddress ,pickUpContacts, pickUpTel, pickUpTime].every(item => item)
        if (!checkPickUp) {
          return this.$message.error(
            "请填写国内提货相关信息"
          )
        }
      }
      // 校验收货信息
      if (cclType !== 1) {
        const checkDelivery = [deliveryAddress, deliveryContacts, deliveryTel].every(item => item)
        if (!checkDelivery) {
          return this.$message.error(
            "请填写送货相关信息"
          )
        }
      }
      this.initData.trayDetail = JSON.stringify(irder.trayDetail);
      let order = this.initData;
      if (order.hasOwnProperty("apOrderPriceList")) {
        delete order.apOrderPriceList;
      }
      if (order.hasOwnProperty("orderCargoDetailList")) {
        delete order.orderCargoDetailList;
      }
      if (order.hasOwnProperty("orderPriceList")) {
        delete order.orderPriceList;
      }
      // if(order.hasOwnProperty('trayDetail')){
      //   delete order.trayDetail
      // }
      // console.log(order.trayDetail);
      let arrayTypeOne = this.$refs.typeOne.tableData;
      let arrayTypeTwo = this.$refs.typeTwo.tableData;
      let orderPriceList = arrayTypeOne.concat(arrayTypeTwo);
       if(orderPriceList.some(item=>!item.quantity || !item.price || !item.expenseName)){
          return this.$message.warning("请填写费用金额")
        }
      let params = {
        order: order,
        orderPriceList: orderPriceList,
      };
      this.$http.post(this.$service.orderSaveOrder, params).then((data) => {
        if (data.code == 200) {
          this.$message("保存成功");
          // this.$router.push("/orderManagement/orderManage");
          this.getOriganData()
        } else {
          this.$message.error(data.message);
        }
      });
      // }else{
      //   this.$message.error('进仓编号最大输入20位')
      // }
    },
    // 获取URl 协议
    async getUrl() {
      return window.location.protocol;
    },
    // 获取url主机
    async getHost() {
      return window.location.host;
    },
    // 托书下载

    async downLoadPdf() {
      let str =
        (await this.getUrl()) +
        "//" +
        (await this.getHost()) +
        "/image/order-attach/bookingNote-agent/";

      this.$http
        .post(this.$service.createAgentBookingNotePdf, this.orderId)
        .then((res) => {
          console.log(res);
          const a = document.createElement("a");
          a.setAttribute("href", str + res.attachmentPath);
          a.setAttribute("download", res.attachmentName);
          a.click();
        });
    },
    calcVwr() {
      let { inboundWeight, inboundCbm, bubblePoint } = this.initData;
      if (inboundWeight && inboundCbm) {
        this.initData.inboundVwr = Math.ceil(
          Number(inboundWeight) / Number(inboundCbm)
        );
        console.log(this.initData.inboundVwr);
        this.showCwr = `1:${this.initData.inboundVwr}`;
        if (bubblePoint == 10) {
          this.initData.inboundCw = Math.max(inboundCbm * 167, inboundWeight);
        } else if (bubblePoint == 9) {
          this.initData.inboundCw = Math.ceil(
            inboundCbm * 167 * 0.9 + inboundWeight * 0.1
          );
        } else if (bubblePoint == 8) {
          this.initData.inboundCw = Math.ceil(
            inboundCbm * 167 * 0.8 + inboundWeight * 0.2
          );
        } else if (bubblePoint == 7) {
          this.initData.inboundCw = Math.ceil(
            inboundCbm * 167 * 0.7 + inboundWeight * 0.3
          );
        } else if (bubblePoint == 6) {
          this.initData.inboundCw = Math.ceil(
            inboundCbm * 167 * 0.6 + inboundWeight * 0.4
          );
        } else if (bubblePoint == 5) {
          this.initData.inboundCw = Math.ceil(
            inboundCbm * 167 * 0.5 + inboundWeight * 0.5
          );
        } else if (bubblePoint == 4) {
          this.initData.inboundCw = Math.ceil(
            inboundCbm * 167 * 0.4 + inboundWeight * 0.6
          );
        } else if (bubblePoint == 3) {
          this.initData.inboundCw = Math.ceil(
            inboundCbm * 167 * 0.3 + inboundWeight * 0.7
          );
        } else if (bubblePoint == 2) {
          this.initData.inboundCw = Math.ceil(
            inboundCbm * 167 * 0.2 + inboundWeight * 0.8
          );
        } else if (bubblePoint == 1) {
          this.initData.inboundCw = Math.ceil(
            inboundCbm * 167 * 0.1 + inboundWeight * 0.9
          );
        }
      } else {
      }
    },
    // 如果子组件中有空运费 输入bookingPrice的时候同时修改子组件单价
    dealBookingPrice(e) {
      console.log(e);
      if (e) {
        // 应收
        let a = this.$refs.typeOne.tableData;
        for (let i in a) {
          if (a[i].expenseName == "空运费") {
            a[i].price = e;
            this.$set(a[i], "price", e);
          }
        }
        let b = this.$refs.typeTwo.tableData;
        for (let i in b) {
          if (b[i].expenseName == "空运费") {
            b[i].price = e;
            this.$set(b[i], "price", e);
          }
        }
      }
    },
    // 如果子组件中有空运费 输入计费重的时候同时修改子组件数量
    dealChildPrice(num) {
      // 取到子组件typeOne
      if (num) {
        // 应收
        let a = this.$refs.typeOne.tableData;
        for (let i in a) {
          if (a[i].expenseName == "空运费") {
            a[i].quantity = num;
            this.$set(a[i], "quantity", num);
          }
        }
        let b = this.$refs.typeTwo.tableData;
        for (let i in b) {
          if (b[i].expenseName == "空运费") {
            b[i].quantity = num;
            this.$set(b[i], "quantity", num);
          }
        }
      }
    },
    judgeDeleteBIll() {
      return true;
    },
    // Four组件的新增放到父组件触发
    fatherAddOneItem(e) {
      if (e == 1) {
        this.$refs.typeOne.addOneTableObj();
      } else if (e == 2) {
        this.$refs.typeTwo.addOneTableObj();
      }
    },
    // 选择框获取id 航线负责人
    getSelectPrincipalId(e) {
      let arrayTest = this.airLineList;
      arrayTest.filter((res) => {
        if (res.name == e) {
          this.initData.principalId = res.id;
        }
      });
    },
    // 获取售前客服 id
    getSelectPscsId(e) {
      let arrayTest = this.preSaleList;
      arrayTest.filter((res) => {
        if (res.name == e) {
          this.initData.pscsId = res.id;
        }
      });
    },

    // 获取售中客服 id
    getSelectMscsId(e) {
      let arrayTest = this.onSaleList;
      arrayTest.filter((res) => {
        if (res.name == e) {
          this.initData.mscsId = res.id;
        }
      });
    },
    // 获取页面初始配置
    async initSysSetTing() {
      let res1 = await this.$http.get(
        this.$service.userSearchNoAuth + "?roleName=售前客服&pageSize=50000"
      );
      let res2 = await this.$http.get(
        this.$service.userSearchNoAuth + "?roleName=售中客服&pageSize=50000"
      );
      let res3 = await this.$http.get(
        this.$service.userSearchNoAuth + "?roleName=航线负责人&pageSize=50000"
      );
      let res4 = await this.$http.get(
        this.$service.companySearchByPage + "?pageSize=50000"
      );
       let res5 = await this.$http.post(this.$service.agentList, {
        pageSize: 50000,
      });
      Promise.all([res1, res2, res3, res4,res5]).then((res) => {
        this.preSaleList = res[0].data.records;
        this.onSaleList = res[1].data.records;
        this.airLineList = res[2].data.records;
        this.airCompanyCodeList = res[3].data.records;
        this.agentIdList = res[4].data.records;
      });
    },
    // 获取订单详情
    async getOriganData() {
      this.$route.meta.title = '订单详情-待进仓'
      let res = await this.$http.get(
        this.$service.orderSearchDetail + `?orderId=${this.orderId}`
      );
      if (res.code == 200) {
        let tempObj = res.data;
        // this.trayDetail_number=JSON.parse(res.data.trayDetail)
        this.pdfDownLoad = tempObj.orderAttachmentList;
        for (let i = 0; i < this.pdfDownLoad.length; i++) {
          if(this.pdfDownLoad[i].attachmentType !== 5) {
            var copyName = this.pdfDownLoad[i].attachmentName;
            var copyNames = copyName.split("");
            copyNames.splice(7, 9);
            this.pdfDownLoad[i].attachmentName = copyNames.join("");
          }
        }
        // tempObj.trayDetail = JSON.parse(tempObj.trayDetail)
        for (let i in tempObj.arOrderPriceList) {
          tempObj.arOrderPriceList[i].changeBillAddOne = false;
        }
        this.orderNo = tempObj.orderNo;
        this.initData = tempObj;
        let DataCop = JSON.parse(JSON.stringify(tempObj));
        this.DataCope = DataCop;
        this.DataCope.trayDetail = JSON.parse(DataCop.trayDetail);
        this.isDataDone = true;
      }
    },
  },
};
</script>
<style scoped>
.contont {
  height: 100%;
  margin: 0 20px;
  padding: 20px 0;
  overflow: scroll;
}
.tips {
  font-size: 26px;
  font-weight: 800;
}
.common {
  background: rgb(231, 236, 239);
  display: flex;
  color: rgb(2, 175, 240);
  padding: 10px 20px;
  flex-wrap: wrap;
  align-items: center;
}
.common > div {
  width: 25%;
  padding-top: 10px;
}
.flex {
  display: flex;
  align-items: center;
}
.radioTap {
  padding: 15px 15px 0;
}

.flex_message {
  width: 100px;
  text-align: right;
}
.title {
  font-size: 16px;
  color: rgb(2, 175, 240);
  font-weight: 800;
  margin-bottom: 10px;
}
.mtop_15 {
  margin-top: 15px;
}
.mtop_10 {
  margin-top: 10px;
}
.ml_10 {
  margin-left: 20px;
  /* margin-top: 20px; */
}
.mr_25 {
  margin-right: 25px;
}
.mt_20 {
  margin-top: 20px;
}
.ml_20 {
  margin-left: 20px;
}
.setWidth {
  width: 200px;
}
.bg_dark {
  width: 60%;
  /* min-width: 650px; */
  background: rgb(128, 128, 128);
  padding: 10px 0;
  margin-left: 80px;
  font-weight: 900;
  position: relative;
}
.flex_center {
  display: flex;
  position: relative;
  align-content: center;
}
.flex_center > div {
  flex: 1;
  text-align: center;
}
.bg_table,
.inData {
  width: 60%;
  /* min-width: 650px; */
  padding: 10px 0;
  margin-left: 80px;
  font-weight: 900;
}
.border {
  border: 1px solid black;
  border-bottom: none;
}
.border:nth-last-child(1) {
  border: 1px solid black;
}
.padding_contont > div {
  padding: 10px 0;
}
.contont-box {
  display: flex;
}
.contont-box input {
  width: 30%;
}
.paddingBottom {
  width: 100%;
  height: 160px;
}
.line {
  width: 100%;
  margin: 20px 0;
  /* background: #000; */
  border: 1px dashed black;
}
.pTips {
  margin-left: 25px;
  margin-top: 20px;
}
.pTips > span:nth-child(2) {
  color: rgb(2, 175, 240);
  text-decoration: underline;
  margin-left: 15px;
}
.de {
  /* position: absolute; */
  /* background: orange; */
  width: 40px;
  height: 20px;
  font-size: 16px;
  padding: 0;
  right: -50px;
  top: 5px;
  border: 0;
  background: rgb(128, 128, 128);
}
.de_n {
  width: 40px;
  height: 20px;
  background: rgba(255, 255, 255, 0);
  cursor: auto;
  border: 0;
}
.tianjia {
  width: 40px;
  height: 20px;
  background: rgb(2, 175, 240);
  color: white;
  /* margin: 40px; */
  cursor: pointer;
  padding: 0;
}
/* .tianjia:hover{

} */
</style>