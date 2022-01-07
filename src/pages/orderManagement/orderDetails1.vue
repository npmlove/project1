<template>
  <div class="contont" v-if="isDataDone">
    <div v-if="initData.status == 3">
      <el-button type="" disabled class="setWidth">{{
        initData.statusDesc
      }}</el-button>
      <el-button type="primary" @click="saveOrder">保存</el-button>
      <el-button v-if="isShow5 == false" type="primary" @click="exdeOrder(1)"
        >审核通过</el-button
      >
      <el-button v-if="isShow5 == true" @click="exdeOrder(3)" type="danger"
        >审核失败</el-button
      >
      <el-button type="danger" @click="exdeOrder(2)">取消订单</el-button>
      <el-button type="primary setWidth" @click="showOtherWays"
        >失败,制作备选方案</el-button
      >
    </div>
    <div v-if="initData.status == 5">
      <el-button type="" disabled class="setWidth">{{
        initData.statusDesc
      }}</el-button>
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
        <span>运单号 </span>
        <span>
          <el-input
            v-model="initData.waybillNo"
            size="mini"
            placeholder="请输入内容"
          ></el-input>
        </span>
      </div>
      <div>
        <span>目的港 </span>
        <span> {{ initData.pod }}</span>
      </div>
      <div>
        <span>日期 </span>
        <span>{{ initData.orderTime }}</span>
      </div>
      <div>
        <span>利润 </span>
        <span>￥{{ initData.orderProfit }}</span>
      </div>
      <div>
        <span>客 户 </span>
        <span>{{ initData.customerName }}</span>
      </div>
      <div class="flex">
        <span>代 理</span>
        <span>
          <el-select
            v-model="initData.agentName"
            filterable
            size="mini"
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
        </span>
      </div>
      <div class="flex">
        <span>进仓编号</span>
        <span>
          <el-input
            v-model="initData.inboundNo"
            size="mini"
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
    <tab-bar :tab.sync="radio1" :order="initData" :showEntryGuide="false" />
    <div class="order-tab-details-wrap">
      <div v-show="radio1 == '1'" class="details">
        <div class="addNewWays" v-if="isShow5">
          <!-- v-if="initData.orderOptionsList.length > 0 " -->
          <!-- 审核失败 推荐制作方案 -->
          <div
            class="newFlag"
            v-for="(item, index) in initData.orderOptionsList"
            :key="index"
          >
            <div>
              <span> <i class="el-icon-star-on red"></i>起运港</span>
              <span>
                <el-select
                  v-model="item.pol"
                  size="mini"
                  :remote-method="polMethod"
                  clearable
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请选择起运港"
                >
                  <el-option
                    v-for="item in polList"
                    :key="item.threeLetterCode"
                    :label="item.threeLetterCode + '-' + item.name"
                    :value="item.threeLetterCode"
                  >
                  </el-option>
                </el-select>
              </span>
            </div>
            <div>
              <span> <i class="el-icon-star-on red"></i>目的港</span>
              <span>
                <el-select
                  v-model="item.pod"
                  size="mini"
                  :remote-method="podMethod"
                  clearable
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请选择目的港"
                >
                  <el-option
                    v-for="item in podList"
                    :key="item.threeLetterCode"
                    :label="item.threeLetterCode + '-' + item.name"
                    :value="item.threeLetterCode"
                  >
                  </el-option>
                </el-select>
              </span>
            </div>
            <div>
              <span
                ><i class="el-icon-star-on red"></i
                >航&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;司</span
              >
              <span>
                <el-select
                  v-model="item.airCompanyCode"
                  @change="getOrderAirName(item, index)"
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
            <div>
              <span
                ><i class="el-icon-star-on red"></i
                >日&nbsp;&nbsp;&nbsp;&nbsp;期</span
              >
              <span>
                <el-date-picker
                  size="mini"
                  style="width: 193px"
                  v-model="item.departureDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </span>
            </div>
            <div>
              <span
                ><i class="el-icon-star-on red"></i
                >单&nbsp;&nbsp;&nbsp;&nbsp;价</span
              >
              <span>
                <el-input
                  style="width: 193px"
                  v-model="item.bookingPrice"
                  size="mini"
                  placeholder="请输入内容"
                ></el-input>
              </span>
            </div>
            <div>
              <span><i class="el-icon-star-on red"></i>分泡比例</span>
              <span>
                <el-select
                  size="mini"
                  v-model="item.bubblePoint"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in bubblePointArray"
                    :key="item.value"
                    :label="item.lable"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </span>
            </div>
            <div>
              <span
                ><i class="el-icon-star-on red"></i>代
                &nbsp;&nbsp;&nbsp;理</span
              >
              <span>
                <el-select
                  v-model="item.agentId"
                  filterable
                  size="mini"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in agentIdList"
                    :key="item.id"
                    :label="item.agentName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </span>
            </div>
            <div>
              <span>
                <i class="el-icon-star-on" style="color: white"></i>航班号</span
              >
              <span
                ><el-input
                  style="width: 193px"
                  v-model="item.flightNo"
                  size="mini"
                  placeholder="请输入航班号"
                ></el-input
              ></span>
            </div>
            <div>
              <span><i class="el-icon-star-on red"></i> 是否中转</span>
              <span>
                <el-radio v-model="item.chooseRadio" label="1">直达</el-radio>
                <el-radio v-model="item.chooseRadio" label="2">中转</el-radio>
              </span>
            </div>

            <el-button
              type="primary"
              @click="addOrderOne"
              v-if="initData.orderOptionsList.length - 1 == index && index != 2"
              size="mini"
              >添加方案</el-button
            >
            <el-button type="danger" @click="deleteOrderOne(index)" size="mini"
              >删除方案</el-button
            >
          </div>
        </div>

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
          <div class="flex_center mtop_10">
            <div>件数</div>
            <div>毛重</div>
            <div>体积</div>
            <div>比重</div>
            <div>分泡比例</div>
            <div>计费重</div>
          </div>
        </div>
        <!-- 问题，无限循环 -->
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
            v-for="(item, index) in initData.trayDetail"
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
                  initData.trayDetail.length < 10 &&
                  initData.trayDetail.length > 0 &&
                  initData.trayDetail.length-1 == index
                "
                class="tianjia "
                @click="trayAddClick(index,key)"
                style="margin-left: 15px"
                >添加</el-button
              >
              <el-button
                type="danger"
                class="de_n"
                v-show="initData.trayDetail.length-1 !== index||
                              initData.trayDetail.length == 10"
                style="margin-left: 15px"
              ></el-button>
              <el-button
                type="danger"
                class="de"
                v-show="initData.trayDetail.length > 1"
                @click="trayDeleteClick(index)"
                style="margin-left: 15px"
                >删除</el-button
              >
              <el-button
                type="danger"
                class="de_n"
                v-show="initData.trayDetail.length == 1"
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
          <!-- <div>
                      <span class="mr_25">报关服务</span>
                      <el-radio-group v-model="initData.customsType">
                        <el-radio :label="1">自行报关</el-radio>
                        <el-radio :label="2">委托报关</el-radio>
                      </el-radio-group>
                  </div> -->
          <div class="mtop_10">
            <span class="mr_25">国内提货</span>
            <el-radio-group v-model="initData.isPickUp">
              <el-radio :label="1">不需要</el-radio>
              <el-radio :label="2">需要</el-radio>
            </el-radio-group>
          </div>
          <div class="mtop_10">
            <span class="mr_25">清关服务</span>
            <el-radio-group v-model="initData.cclType">
              <el-radio :label="1">自行清关</el-radio>
              <el-radio :label="2">DDU</el-radio>
              <el-radio :label="3">DDP</el-radio>
              <el-radio :label="4">DAP</el-radio>
            </el-radio-group>
          </div>
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
      <div v-show="radio1 == '2'" class="details">
        <bill-order
          :getList="initData.arOrderPriceList[0].list"
          ref="typeOne"
        />
        <el-button class="setWidth ml_20" @click="fatherAddOneItem(1)"
          >添加费用</el-button
        >
        <div class="line"></div>
        <billOrder :getList="initData.apOrderPriceList" ref="typeTwo" />
        <el-button class="setWidth ml_20" @click="fatherAddOneItem(2)"
          >添加费用</el-button
        >
        <div class="line"></div>
      </div>
    </div>
  </div>
</template>
<script>
import billOrder from "./components/billOrder.vue";
import TabBar from './components/TabBar.vue'
class orderSecondWays {
  constructor(
    pol,
    pod,
    airCompanyCode,
    agentId,
    bookingPrice,
    departureDate,
    flightNo,
    chooseRadio = "1"
  ) {
    this.pod = pod;
    this.pol = pol;
    this.airCompanyCode = airCompanyCode;
    this.agentId = agentId;
    this.bubblePoint = 10;
    this.bookingPrice = bookingPrice;
    this.departureDate = departureDate;
    this.flightNo = flightNo;
    this.chooseRadio = chooseRadio;
    this.fullLeg = "";
    this.sortNo = "";
    this.airCompanyName = "";
  }
}
// params
// pod    目的港
// pol    起运港
// airCompanyCode  航司二字码
// agentId      代理ID
// bubblePoint   分泡比率
// bookingPrice  订舱单价
// departureDate 航线出发日期
// flightNo      航班号
// fullLeg       航线全路径
// chooseRadio   直达 中转

export default {
  data() {
    return {
      //pdf预览和下载
      pdfDownLoad: "",
      pdfDialogVisible: false,
      orderNo: "",
      orderId: "",
      initData: {},
      isDataDone: false,
      radio1: "1",
      pdfIMg: require("../../assets/pdf.png"),
      preSaleList: [], // 售前客服初始数组
      onSaleList: [], // 售中客服初始数组
      airLineList: [], // 航线负责人初始数组
      agentIdList: [], // 代理公司初始数组
      airCompanyCodeList: [], // 航司初始数组
      polList: [], // 起始港初始数组
      podList: [], // 目的港初始数组
      isShow5: false, //
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
          value: 5,
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
    };
  },
  components:{
    billOrder,
    TabBar,
  },
  computed: {
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
    this.orderId = this.$route.query.id;
    await this.getOriganData();
    await this.initSysSetTing();
    this.initPolPod();
  },
  methods: {
    trayAddClick(index,key) {
      var json = {
        trayNumber: "",
        traySize: "",
        trayWidth: "",
        trayHeight: "",
      };
      this.initData.trayDetail.push(json);
    },
    trayDeleteClick(index) {
      this.initData.trayDetail.splice(index, 1);
      // console.log(this.initData.trayDetail);
    },
    // 获取备选方案重航空公司的name
    getOrderAirName(e) {
      let { airCompanyCodeList } = this;
      let te = airCompanyCodeList.filter((item) => {
        if (item.airCompanyCode == e.airCompanyCode) {
          return item;
        }
      });
      e.airCompanyName = te[0].name;
    },
    calcFullLeg(e) {
      return e.chooseRadio == "1"
        ? `${e.pol},${e.pod}`
        : `${e.pol},中转,${e.pod}`;
    },
    // 转换失败显示状态
    showOtherWays() {
      this.isShow5 = !this.isShow5;
      if (this.isShow5) {
        this.addOrderOne();
      } else {
        this.deleteOrderOne();
      }
    },
    // 新增一个备选方案
    addOrderOne() {
      let { pol, pod } = this.initData;
      let tempObj = new orderSecondWays(pol, pod, "", "", "", "", "", "1");
      this.initData.orderOptionsList.push(tempObj);
    },
    // 删除一个备选方案 A21122716444035
    deleteOrderOne(e) {
      if (e == 0) {
      } else {
        this.initData.orderOptionsList.splice(e, 1);
      }
    },
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
      let order = this.initData;
      for (var i = 0; i < order.trayDetail.length; i++) {
        if (
          order.trayDetail[i].trayNumber == "" ||
          order.trayDetail[i].traySize == "" ||
          order.trayDetail[i].trayWidth == "" ||
          order.trayDetail[i].trayHeight == ""
        ) {
          return this.$message.error("请完整填写订舱托盘数据");
        }
      }
      order.trayDetail = JSON.stringify(order.trayDetail);
      // ctrlFlag 1 前进状态 2 取消   （3 待平台审核 失败的时候传3）
      let arrayTypeOne = this.$refs.typeOne.tableData;
      let arrayTypeTwo = this.$refs.typeTwo.tableData;
      // let order = this.initData
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
      //  delete order.trayDetail
      // }
      let orderPriceList = arrayTypeOne.concat(arrayTypeTwo);
      let tempArray = this.initData.orderOptionsList;
      let params = {};
      if (this.isShow5) {
        // 有备选方案的时候
        // 先判断是否填写
        let tempArray1 = tempArray.filter((item) => {
          if (
            item.airCompanyCode == "" ||
            item.agentId == "" ||
            item.bookingPrice == "" ||
            item.bookingPrice == "" ||
            item.departureDate == ""
          ) {
            return item;
          }
        });
        if (tempArray1.length > 0) {
          this.$message.error("备选方案中有部分未填写");
          return;
        } else {
          for (let i in tempArray) {
            tempArray[i].fullLeg = this.calcFullLeg(tempArray[i]);
            tempArray[i].sortNo = Number(i + 1);
            if (tempArray[i].hasOwnProperty("createTime")) {
              delete tempArray[i].createTime;
            }
            if (tempArray[i].hasOwnProperty("updateTime")) {
              delete tempArray[i].updateTime;
            }
          }
          params = {
            order: order,
            orderPriceList: orderPriceList,
            orderOptionsList: tempArray,
            ctrlMap: {
              ctrlFlag: e,
            },
          };
        }
      } else {
        params = {
          order: order,
          orderPriceList: orderPriceList,
          ctrlMap: {
            ctrlFlag: e,
          },
        };
      }
      this.$http.post(this.$service.orderExecuteOrder, params).then((data) => {
        if (data.code == 200) {
          this.$message("成功");
          this.$router.push("/orderManagement/orderManage");
        } else {
          this.$message.error(data.message);
        }
      });
    },
    saveOrder() {
      let order = this.initData;
      for (var i = 0; i < order.trayDetail.length; i++) {
        if (
          order.trayDetail[i].trayNumber == "" ||
          order.trayDetail[i].traySize == "" ||
          order.trayDetail[i].trayWidth == "" ||
          order.trayDetail[i].trayHeight == ""
        ) {
          return this.$message.error("请完整填写订舱托盘数据");
        }
      }
      order.trayDetail = JSON.stringify(order.trayDetail);
      // let order = this.initData;
      if (order.hasOwnProperty("apOrderPriceList")) {
        delete order.apOrderPriceList;
      }
      if (order.hasOwnProperty("orderCargoDetailList")) {
        delete order.orderCargoDetailList;
      }
      if (order.hasOwnProperty("orderPriceList")) {
        delete order.orderPriceList;
      }
      let arrayTypeOne = this.$refs.typeOne.tableData;
      let arrayTypeTwo = this.$refs.typeTwo.tableData;
      let orderPriceList = arrayTypeOne.concat(arrayTypeTwo);
      let tempArray = this.initData.orderOptionsList;
      let params = {};
      if (this.isShow5) {
        // 有备选方案的时候
        // 先判断是否填写
        let tempArray1 = tempArray.filter((item) => {
          if (
            item.airCompanyCode == "" ||
            item.agentId == "" ||
            item.bookingPrice == "" ||
            item.bookingPrice == "" ||
            item.departureDate == ""
          ) {
            return item;
          }
        });
        if (tempArray1.length > 0) {
          this.$message.error("备选方案中有部分未填写");
          return;
        }
        for (let i in tempArray) {
          tempArray[i].fullLeg = this.calcFullLeg(tempArray[i]);
          tempArray[i].sortNo = Number(i + 1);
          if (tempArray[i].hasOwnProperty("createTime")) {
            delete tempArray[i].createTime;
          }
          if (tempArray[i].hasOwnProperty("updateTime")) {
            delete tempArray[i].updateTime;
          }
        }

        params = {
          order: order,
          orderPriceList: orderPriceList,
          orderOptionsList: tempArray,
        };
      } else {
        params = {
          order: order,
          orderPriceList: orderPriceList,
        };
      }
      this.$http.post(this.$service.orderSaveOrder, params).then((data) => {
        if (data.code == 200) {
          this.$message("保存成功");
          this.$router.push("/orderManagement/orderManage");
        } else {
          this.$message.error(data.message);
        }
      });
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
      let arrayTest = this.airLineList;
      arrayTest.filter((res) => {
        if (res.name == e) {
          this.initData.pscsId = res.id;
        }
      });
    },

    // 获取售中客服 id
    getSelectMscsId(e) {
      let arrayTest = this.airLineList;
      arrayTest.filter((res) => {
        if (res.name == e) {
          this.initData.mscsId = res.id;
        }
      });
    },
    polMethod() {
      this.initPolPod(keyWord, "起始港");
    },
    podMethod() {
      this.initPolPod(keyWord, "目的港");
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
      let res4 = await this.$http.post(this.$service.agentList, {
        pageSize: 50000,
      });
      let res5 = await this.$http.get(
        this.$service.companySearchByPage + "?pageSize=50000"
      );
      Promise.all([res1, res2, res3, res4, res5]).then((res) => {
        this.preSaleList = res[0].data.records;
        this.onSaleList = res[1].data.records;
        this.airLineList = res[2].data.records;
        this.agentIdList = res[3].data.records;
        this.airCompanyCodeList = res[4].data.records;
      });
    },
    initPolPod(keyWord, type) {
      if (!keyWord) {
        keyWord = "";
      }
      this.$http
        .get(this.$service.airportSearchByPage + "?keyWord=" + keyWord)
        .then((data) => {
          if (data.code == 200) {
            if (type == "起始港") {
              this.polOpt = data.data.records;
            } else if (type == "目的港") {
              this.podList = data.data.records;
            } else {
              this.polList = data.data.records;
              this.podList = data.data.records;
            }
          } else {
            this.$message.error(data.message);
          }
        });
    },
    // 获取订单详情
    async getOriganData() {
      let res = await this.$http.get(
        this.$service.orderSearchDetail + `?orderId=${this.orderId}`
      );
      if (res.code == 200) {
        let tempObj = res.data;
        for (let i in tempObj.arOrderPriceList) {
          tempObj.arOrderPriceList[i].changeBillAddOne = false;
        }
        if (tempObj.orderOptionsList.length > 0) {
          this.isShow5 = true;
        }
        for (let i in tempObj.orderOptionsList) {
          let ac = tempObj.orderOptionsList[i].fullLeg;
          console.log(ac);
          let judgeAc = ac.split(",");
          if (judgeAc.length > 2) {
            this.$set(tempObj.orderOptionsList[i], "chooseRadio", "2");
          } else {
            this.$set(tempObj.orderOptionsList[i], "chooseRadio", "1");
          }
        }
        this.orderNo = tempObj.orderNo;
        tempObj.trayDetail = JSON.parse(tempObj.trayDetail);
        this.initData = tempObj;
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
  background: rgb(128, 128, 128);
  padding: 10px 0;
  margin-left: 80px;
  font-weight: 900;
}
.flex_center {
  display: flex;
  align-content: center;
}
.flex_center > div {
  flex: 1;
  text-align: center;
}
.bg_table,
.inData {
  width: 60%;
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
.details {
  margin-left: 25px;
  margin-top: 20px;
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
.newFlag {
  display: flex;

  justify-content: space-between;
  flex-wrap: wrap;
  background: #fff;
  padding: 20px;
  margin-bottom: 15px;
}
.newFlag > div {
  width: 310px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.newFlag > div > span:nth-child(1) {
  width: 100px;
}
.newFlag > div > span:nth-child(2) {
  width: 200px;
}
.addNewWays {
  width: 1000px;
  font-size: 16px;
  background: #d5d5d5;
  padding: 20px;
  padding-bottom: 5px;
  margin-bottom: 20px;
}
.red {
  color: red;
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
.details {
  margin-left: 25px;
  margin-top: 20px;
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
</style>