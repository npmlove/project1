<template>
  <div class="contont content-wrap" v-if="isDataDone">
    <header class="content-fix-tools">
      <div v-if="initData.status == 13">
      <el-button type="" disabled class="setWidth">{{
        initData.statusDesc
      }}</el-button>
      <el-button type="primary" @click="saveOrder">保存</el-button>
      <el-button type="primary" class="setWidth" @click="exdeOrder(1)"
        >进仓数据填写完成</el-button
      >
      <el-button type="danger" @click="exdeOrder(2)"
        >进仓异常,取消订单</el-button
      >
    </div>
    <div v-if="initData.status == 17">
      <el-button type="" disabled class="setWidth">{{
        initData.statusDesc
      }}</el-button>
      <el-button type="primary" @click="saveOrder">保存</el-button>
      <el-button type="primary" class="setWidth" @click="exdeOrder(1)"
        >进仓数据已确认</el-button
      >
      <el-button type="danger" @click="exdeOrder(2)"
        >进仓数据有异议,取消订单</el-button
      >
    </div>
    <div v-if="initData.status == 21">
      <el-button type="" disabled class="setWidth">{{
        initData.statusDesc
      }}</el-button>
      <el-button type="primary" @click="saveOrder">保存</el-button>
      <el-button type="primary" class="setWidth" @click="exdeOrder(1)"
        >操作完成</el-button
      >
      <el-button type="danger" @click="exdeOrder(2)"
        >操作异常,取消订单</el-button
      >
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
            v-model="initData.flightNo"
            @blur="initData.flightNo = $event.target.value"
            maxlength='6'
            onkeyup="value=value.replace(/[\W]/g,'')"
            size="mini"
            placeholder="请输入航班号" />
        </span>
      </div>
      <div class="flex">
        <span>订舱单价 </span>
        <span>
          <el-input
            :disabled="initData.canPriceChange"
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
            :disabled="initData.status>21"
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
      <div v-if="notAirPeople">
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
            @change="changeAgent"
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
            :disabled="initData.status >= 13"
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
        <div class="bg_table">
          <div class="flex_center border padding_contont" style="">
            <div>托盘数量</div>
            <div>长（cm）</div>
            <div>宽（cm）</div>
            <div>高（cm）</div>
          </div>
          <div
            class="flex_center border padding_contont"
            v-for="(item, index) in initData.trayDetail"
            :key="index"
          >
            <div>{{ item.trayNumber }}</div>
            <div>{{ item.traySize }}</div>
            <div>{{ item.trayWidth }}</div>
            <div>{{ item.trayHeight }}</div>
          </div>
        </div>
        <h1 class="title">进仓数据</h1>
        <div class="inData" style="width: 1200px">
          <div class="flex_center">
            <div>件数</div>
            <div>毛重</div>
            <div>体积</div>
            <div>比重</div>
            <div>分泡比例</div>
            <div>计费重</div>
            <div style="width: 300px; flex: initial">进仓图片</div>
          </div>
          <div class="flex_center mtop_10">
            <div>
              <el-input
                :disabled="num21"
                size="mini"
                class="ml_10"
                v-model="initData.inboundPiece"
                placeholder=""
                @input="val => { initData.inboundPiece = $utils.getNumber(val, true) }"
                :min="1"
              ></el-input>
            </div>
            <div>
              <el-input
                :disabled="num21"
                size="mini"
                class="ml_10"
                v-model="initData.inboundWeight"
                @change="calcVwr"
                placeholder=""
                @input="val => { initData.inboundWeight = $utils.getNumber(val) }"
              ></el-input>
            </div>
            <div>
              <el-input
                :disabled="num21"
                size="mini"
                class="ml_10"
                v-model="initData.inboundCbm"
                @change="calcVwr"
                placeholder=""
                @input="val => { initData.inboundCbm = $utils.getNumber(val) }"
              ></el-input>
            </div>
            <div>
              <el-input
                :disabled="num21"
                size="mini"
                class="ml_10"
                :value="
                  initData.inboundVwr == null
                    ? showCwr
                    : '1:' + initData.inboundVwr
                "
                placeholder=""
              ></el-input>
            </div>
            <div>
              <el-select
                :disabled="num21"
                class="ml_10"
                size="mini"
                v-model="initData.bubblePoint"
                @change="calcVwr"
                placeholder="请选择"
              >
                <el-option
                :disabled="num21"
                  v-for="item in bubblePointArray"
                  :key="item.value"
                  :label="item.lable"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div>
              <el-input
                :disabled="num21"
                size="mini"
                class="ml_10"
                v-model="initData.inboundCw"
                placeholder=""
              ></el-input>
            </div>
            <div style="width: 310px; flex: initial">
              <image-uploader style="margin-left: 30px" :images="initData.totalImages" :orderId="orderId" :disabled="initData.status === 21" />
            </div>
          </div>
          <binList
            class="mtop_10"
            ref="typeThree"
            :number="pageNumber"
            :orderId="orderId"
            :childData="initData.orderCargoDetailList"
          />
        </div>
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
        <!-- 应付账单可以最多有5个 做个循环 循环组件ref -->
        <div v-for="(item, index) in initData.arOrderPriceList" :key="index">
          <!-- 组件部分 -->
          <bill-order @changePayWay="changePayWay" :newBill="index==0?false:true" :payWay="initData.payWay"  :getList="item.list" :ref="`typeBill${index}`" :currentStatus="item.status" v-show="notAirPeople" :notSaleBefore="true" :titleType="1" :vertifyAmount="initData.totalRcWoCny"/>
          <!-- 操作部分 -->
          <el-button
            class="setWidth ml_20"
            @click="fatherAddOneItem(index)"
            v-if="
              (initData.financeStatus == 0 || initData.financeStatus == 4) &&
              item.status == 0 &&  notAirPeople
            "
            >添加费用</el-button
          >
          
          <div
            class="ml_20"
            v-if="initData.canCheckFlag == 1 && item.status == 0 && notAirPeople"
          >
            <el-button
              
              class="setWidth"
              type="primary"
              @click="reconciliationClient(index)"
              >发起客户对账</el-button
            >
          </div>
          <div v-if="notAirPeople" class="largerText">
            <p class="pTips" v-if="item.status == 0 && notAirPeople">
              <span>未发起客户对账</span>
              <!-- <span >修改账单</span> -->
            </p>
            <p class="pTips" v-if="item.status == 1">
              <span class="bill-count-down-time"
                >账单已发送，等待客户确认....（倒计时：{{
                  item.billCountDownTime
                }}）</span
              >
              <span
                @click="reWriteBill(index)"
                v-if="
                  initData.financeStatus == 0 || initData.financeStatus == 4
                "
                >修改账单</span
              >
            </p>
             <!-- <p class="pTips" v-if="initData.orderInvoiceApply && initData.orderInvoiceApply.orderInvoiceApply && initData.orderInvoiceApply.orderInvoiceApply.length>0">
              <span style="text-decoration:underline" :style="{color:initData.orderInvoiceApply.abnormalFlag ? 'red':'rgb(2, 175, 240)'}" @click="shiftShowBill">开票记录</span>
              <span
                @click="reWriteBill(index)"
                v-if="
                  initData.financeStatus == 0 || initData.financeStatus == 4
                "
                >修改账单</span
              >
            </p> -->
            <p class="pTips" v-if="item.status == 2">
              <span>账单已确认</span>
              <span
                @click="reWriteBill(index)"
                v-if="
                  initData.financeStatus == 0 || initData.financeStatus == 4
                "
                >修改账单</span
              >
            </p>
            <p class="pTips" v-if="item.status == 3">
              <span>账单已确认，开票已申请</span>
              <span
                @click="reWriteBill(index)"
                v-if="
                  initData.financeStatus == 0 || initData.financeStatus == 4
                "
                >修改账单</span
              >
            </p>
            <p class="pTips" v-if="item.status == 4">
              <span>账单已确认，发票开具￥{{ item.invoiceAmount }}</span>
              <span
                @click="reWriteBill(index)"
                v-if="
                  initData.financeStatus == 0 || initData.financeStatus == 4
                "
                >修改账单</span
              >
            </p>
            <!-- <billHistory v-if="showBillHistory" @shiftShowBill ="shiftShowBill" :tableData="this.initData.orderInvoiceApply.orderInvoiceApply"></billHistory> -->
          </div>
          <!-- 新增账单 -->
          <div v-if="notAirPeople"> 
            <el-button
              v-if="
                index == initData.arOrderPriceList.length - 1 &&
                index < 4 &&
                item.status == 3 &&
                (initData.financeStatus == 0 || initData.financeStatus == 4)
              "
              type="primary"
              @click="creatNewBill(index)"
              class="setWidth ml_20 mt_20"
              >新建账单</el-button
            >
          </div>
        </div>
        <div v-if="creatNewBillBoolen && notAirPeople">
          <billOrder
            :newBill = "true"
            :notSaleBefore="true"
            ref="typeNewBill"
            :getList="[]"
            :titleType="1"
            :orderIdTemp="orderId"
            :orderNoTemp="orderNo"
          />
          <el-button class="setWidth ml_20" @click="fatherAddOneItem(100)"
            >添加费用</el-button
          >
          <el-button
            class="setWidth ml_20"
            type="primary"
            @click="reconciliationClient(100)"
            >发起客户对账</el-button
          >
        </div>
        <div class="line"></div>
        <div></div>
        <billOrder @changeAgentName="changeAgentName" :getList.sync="initData.apOrderPriceList" ref="typeTwo" :notSaleBefore="notSaleBefore"  :titleType="2"  :vertifyAmount="initData.totalApWoCny"/>
        <!-- 应收添加 -->
        <el-button
          class="setWidth ml_20"
          v-if="(initData.financeStatus == 0 || initData.financeStatus == 4) && notSaleBefore"
          @click="fatherAddOneItem(200)"
          >添加费用</el-button
        >
        <br />
        <br />
        <br />
        <div v-if="notSaleBefore" style="padding-bottom: 20px">
      
        <span class="ml_20 largerText" v-if="initData.financeStatus == 0">未交单</span>
        <span class="ml_20 largerText" v-if="initData.financeStatus == 1">已交单</span>
        <span class="ml_20 largerText" v-if="initData.financeStatus == 2">请解锁</span>
        <span class="ml_20 largerText" v-if="initData.financeStatus == 3">交单待审核</span>
        <span class="ml_20 largerText" v-if="initData.financeStatus == 4">修改中</span>
        <el-button
          class="setWidth ml_20"
          :type="isChangeJiaoDan ? 'primary' : ''"
          :disabled="!isChangeJiaoDan"
          v-if="isChangeJiaoDan && isChangeJiaoDan2"
          @click="commitionBill()"
          >交单</el-button
        >
        <el-button
          class="setWidth ml_20"
          v-if="initData.financeStatus == 1"
          @click="recommiter"
          >申请解锁</el-button
        >
        <el-button class="setWidth ml_20" v-if="initData.financeStatus == 2"
          >解锁已申请，等待审核</el-button
        >
        <p class="opearte" @click="showoplist" v-if="operateList.length > 0">
          账单操作记录
        </p>
        </div>
        <opeartes ref="addOpearte" :oplist="operateList" />
        <div class="line" v-if="notSaleBefore"></div>
        <div class="paddingBottom"></div>
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
import binList from "./components/binList.vue";
import billOrder from "./components/billOrder.vue";
import opeartes from "./components/opeartes.vue";
import ladingBill from './ladingBillDownLoad.vue'
import TabBar from "./components/TabBar.vue";
import EntryGuide from "./components/EntryGuide.vue";
import DepartureDatePicker from "./components/DepartureDatePicker";
import { judgeWaybillNo } from "@/util/util";
import ImageUploader  from './components/ImageUploader'
import billHistory from './components/billHistory'
import PickUpForm from './components/PickUpForm'
import DeliverGoodsForm from './components/DeliverGoodsForm'
export default {
  data() {
    return {
      showBillHistory:false,
      filePath: '',
      notAirPeople:true,
      notSaleBefore:true,
      //pdf预览和下载
      num21:"",
      pageNumber:'3',
      pdfDownLoad: "",
      pdfDialogVisible: false,

      radio1: "1",
      showCwr: "", //显示的比重 不传给后台
      isDataDone: false, // 已经获取到数据在渲染界面
      isChangeJiaoDan: true, // 交单是否显示出来
      orderNo: "", // 运单号
      orderId: "", // 账单id
      creatNewBillBoolen: false, // 新建账单的状态
      operateList: [], // 账单操作记录
      preSaleList: [], // 售前客服初始数组
      onSaleList: [], // 售中客服初始数组
      airLineList: [], // 航线负责人初始数组
      airCompanyCodeList: [], //
      principalId: "", // 航线负责人ID
      typeTwoProp: {}, //传递给typeTwo 对象
      billIdTwo: "", //传递给账单id
      initData: {}, // 初始化返回对象
      billFourArray: [], // 账单
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
      billTimer: null, // 账单倒计时定时器
      agentIdList:[]
    };
  },
  computed: {
    //页面代理是否可选
    canSelectAgent() {
      if(this.initData.status == 39){ //取消
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
    '$route.query.timestamp'() {
      this.getOriganData()
    },
  },

  created() {
    console.log(this.creatNewBillBoolen)
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
    this.getOriganData();
    this.initSysSetTing();
    this.getOPerateList();
  },
  beforeDestroy() {
    clearInterval(this.billTimer);
  },
  components: {
    billHistory,
    binList,
    ladingBill,
    billOrder,
    opeartes,
    TabBar,
    EntryGuide,
    DepartureDatePicker,
    ImageUploader,
    PickUpForm,
    DeliverGoodsForm,
  },
  methods: {
    changeAgentName(val){
      this.initData.agentName = val
    },
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
    //代理修改应付账单空运费联动修改
    changeAgent(val){
      // console.log(val)
      this.$refs.typeTwo.tableData[0].expenseUnitName=val
    },
    //切换开票记录表格显示
    shiftShowBill(){
      this.showBillHistory = !this.showBillHistory
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

    // 点击账单操作记录
    showoplist() {
      this.$refs.addOpearte.show();
    },
    // 获取账单操作记录
    async getOPerateList() {
      let res = await this.$http.get(
        this.$service.billOpearteList + `?orderId=${this.orderId}`
      );
      if (res.code == 200) {
        if (res.data.length > 0) {
          this.operateList = res.data;
        }
      }
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
    // 如果子组件中有空运费 输入bookingPrice的时候同时修改子组件单价
    dealBookingPrice(e) {
      // console.log(e);
      if (e) {
        // 应收
        // console.log(this.$refs.typeBill0)
        let a = this.$refs.typeBill0&& this.$refs.typeBill0[0].tableData;
        for (let i in a) {
          if (a[i].expenseName == "空运费") {
            a[i].price = e;
            this.$set(a[i], "price", e);
          }
        }
        let b = this.$refs.typeTwo && this.$refs.typeTwo.tableData;
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
        let a = this.$refs.typeBill0 && this.$refs.typeBill0[0].tableData;
        for (let i in a) {
          if (a[i].expenseName == "空运费") {
            a[i].quantity = num;
            this.$set(a[i], "quantity", num);
          }
        }
        let b = this.$refs.typeTwo && this.$refs.typeTwo.tableData;
        for (let i in b) {
          if (b[i].expenseName == "空运费") {
            b[i].quantity = num;
            this.$set(b[i], "quantity", num);
          }
        }
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
    // 判断是否能够账单删除
    judgeDeleteBIll() {
      return (
        this.initData.financeStatus == 0 || this.initData.financeStatus == 4
      );
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
    // 申请解锁
    recommiter() {
      this.$prompt("申请解锁", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^(\s|\S){0,200}$/,
        inputErrorMessage: "限制200字",
      })
        .then(({ value }) => {
          if (!value) {
            this.$message.error("请填写申请理由");
          } else {
            var data = {
              financeStatus: this.initData.financeStatus,
              operationType: 1,
              orderId: this.orderId,
              info: value,
            };
            this.$http
              .post(this.$service.presentSavePresentLog, data)
              .then((res) => {
                if (res.code == 200) {
                  this.$alert("申请成功", {
                    confirmButtonText: "确定",
                    callback: () => {
                      // this.$router.push("/orderManagement/orderManage");
                      this.getOriganData()
                      this.getOPerateList()
                    },
                  });
                } else {
                  this.$message.error(res.message);
                }
              });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    // 操作完成 推进订单进程 不然没法对账
    exdeOrder(e) {
      let { inboundWeight, inboundCbm, inboundCw, inboundPiece, inboundNo } =
        this.initData;
      if (!inboundNo) {
        this.$message.error("请输入进仓编号");
        return;
      }
      if (!inboundPiece) {
        this.$message.error("请输入进仓件数");
        return;
      }
      if (!inboundWeight) {
        this.$message.error("请输入毛重");
        return;
      }
      if (!inboundCbm) {
        this.$message.error("请输入体积");
        return;
      }
      if (!inboundCw) {
        this.$message.error("请输入计费重");
        return;
      }

      let arrayTypeThree = this.$refs.typeThree.tableData;
      let tempthree = arrayTypeThree.filter((item) => {
        return (
          item.piece == undefined ||
          item.piece == "" ||
          item.cbm === undefined ||
          item.cbm === "" ||
          item.width == undefined ||
          item.width == "" ||
          item.height == undefined ||
          item.height == "" ||
          item.length == undefined ||
          item.length == ""
        );
      });
      if (tempthree.length > 0) {
        this.$message.error("请填写进仓数据");
        return;
      }
      let b=arrayTypeThree.reduce((pre,item)=>{
            return pre+Number(item.piece)
        },0)
      let C_B_M = arrayTypeThree.reduce((pre,item)=>{
            return pre+Number(item.cbm)
        },0)
        if(b !== Number(this.initData.inboundPiece)){
          this.$message.error('总件数与分件数不匹配')
          return;
        }
        
      // 13待平台出进仓数据 17进仓数据确认 21操作中待完成
      if ([21].includes(this.initData.status) && e === 1) {
        if (!this.initData.waybillNo) {
          this.$message.error("请输入运单号");
          return;
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
      if(C_B_M !== Number(this.initData.inboundCbm) && this.initData.status === 13){
          this.$message.error('总体积与分体积不匹配')
        }
      let arrayTypeOne = this.initData.arOrderPriceList[0].list;
      let arrayTypeTwo = this.initData.apOrderPriceList;
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
      if (order.hasOwnProperty("trayDetail")) {
        delete order.trayDetail;
      }
      let orderPriceList = arrayTypeOne.concat(arrayTypeTwo);
      let orderCargoDetailList = this.$refs.typeThree.tableData;
      for(var i=1;i<orderCargoDetailList.length;i++){
          orderCargoDetailList[i].id = '',
          orderCargoDetailList[i].orderId = ''
        }
      const totalImages = order.totalImages
      let params = {
        order: order,
        orderPriceList: orderPriceList,
        orderCargoDetailList: orderCargoDetailList,
        orderAttachmentList: [
          ...(order.orderAttachmentList || []).map(item => {
            const image = totalImages.find(img => img.id === item.id) || item
            return image
          }),
          ...totalImages.filter(img => !img.id)
        ],
        ctrlMap: {
          ctrlFlag: e,
        },
      };
      this.$http.post(this.$service.orderExecuteOrder, params).then((data) => {
        if (data.code == 200) {
          this.$message("成功");
          // this.$router.push("/orderManagement/orderManage");
          this.$utils.orderDetailRefresh(this.initData)
        } else {
          this.$message.error(data.message);
        }
      });
    },
    // 交单
    async commitionBill() {
      // 交单前需选择付款单位
      const isAllApPriceFinish = this.initData.apOrderPriceList.every(price => {
        if (!price.expenseUnitName) {
          this.$message.error(`请选择${price.expenseName}付款单位`);
        }
        return price.expenseUnitName
      });
      if (!isAllApPriceFinish) {
        return
      }
      // 账单暂时已经定 确认
      await this.saveOrder();
      let data = {
        financeStatus: this.initData.financeStatus,
        operationType: 0,
        orderId: this.orderId,
        info: "",
      };
      this.$http.post(this.$service.presentSavePresentLog, data).then((res) => {
        if (res.code == 200) {
          if (this.initData.financeStatus == 0) {
            this.$alert("交单成功", {
              confirmButtonText: "确定",
              callback: () => {
                // this.$router.push("/orderManagement/orderManage");
                this.getOriganData()
              },
            });
          } else if (this.initData.financeStatus == 4) {
            this.$alert("交单已提交，待审核", {
              confirmButtonText: "确定",
              callback: () => {
                // this.$router.push("/orderManagement/orderManage");
                this.getOriganData()
              },
            });
          }
          this.getOPerateList()
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 创建一个新账单
    creatNewBill(e) {
      this.creatNewBillBoolen = true;
    },
    // Four组件的新增放到父组件触发
    fatherAddOneItem(e) {
      if (e == 0) {
        this.$refs.typeBill0[0].addOneTableObj();
      } else if (e == 1) {
        this.$refs.typeBill1[0].addOneTableObj();
      } else if (e == 2) {
        this.$refs.typeBill2[0].addOneTableObj();
      } else if (e == 3) {
        this.$refs.typeBill3[0].addOneTableObj();
      } else if (e == 4) {
        this.$refs.typeBill4[0].addOneTableObj();
      } else if (e == 100) {
        // 这里是新增账单
        this.$refs.typeNewBill.addOneTableObj(true);
      } else if (e == 200) {
        this.$refs.typeTwo.addOneTableObj();
      }
    },
    // 组件的新增放到父组件触发
    fatherNewOne() {
      this.$refs.typeOne.addOneTableObj();
    },
    // 修改账单
    reWriteBill(e) {
      this.initData.arOrderPriceList[e].changeBillAddOne = true;
      let tempArray = [];
      if (e == 0) {
        tempArray = this.$refs.typeBill0[0].tableData;
      } else if (e == 1) {
        tempArray = this.$refs.typeBill1[0].tableData;
      } else if (e == 2) {
        tempArray = this.$refs.typeBill2[0].tableData;
      } else if (e == 3) {
        tempArray = this.$refs.typeBill3[0].tableData;
      } else if (e == 4) {
        tempArray = this.$refs.typeBill4[0].tableData;
      }
      tempArray.map((res) => {
        if (res.expenseName == "空运费") {
          res.ingStatic = true;
        } else {
          res.ingStatic = false;
        }
      });
      const { billId } = this.initData.arOrderPriceList[e].list[0];
      this.$http
        .post(this.$service.modifyBill, { billId: billId })
        .then((res) => {
          if (res.code == 200) {
            this.$message({
              message: "修改账单成功",
              type: "success",
            });
            this.getOriganData();
          } else {
            this.$message.error(res.message);
          }
        });
    },
    // 保存账单
    saveOrder() {
      let { inboundWeight, inboundCbm, inboundCw, inboundPiece, inboundNo } =
        this.initData;
      if (!inboundNo) {
        this.$message.error("请输入进仓编号");
        return;
      }
      if (!inboundPiece) {
        this.$message.error("请输入进仓件数");
        return;
      }
      if (!inboundWeight) {
        this.$message.error("请输入毛重");
        return;
      }
      if (!inboundCbm) {
        this.$message.error("请输入体积");
        return;
      }
      if (!inboundCw) {
        this.$message.error("请输入计费重");
        return;
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
        this.initData.waybillNo = null
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
      let boolenNo = judgeWaybillNo(inboundNo);
      if (boolenNo) {
        let arrayTypeThree = this.$refs.typeThree.tableData;
        let tempthree = arrayTypeThree.filter((item) => {
          return (
            item.piece == undefined ||
            item.piece == "" ||
            item.cbm == undefined ||
            item.cbm == "" ||
            item.width == undefined ||
            item.width == "" ||
            item.height == undefined ||
            item.height == "" ||
            item.length == undefined ||
            item.length == ""
          );
        });
        if (tempthree.length > 0) {
          this.$message.error("进仓数据未填写");
          return;
        }
        let b=arrayTypeThree.reduce((pre,item)=>{
            return pre+Number(item.piece)
        },0)
      let C_B_M = arrayTypeThree.reduce((pre,item)=>{
            return pre+Number(item.cbm)
        },0)
        if(b !== Number(this.initData.inboundPiece)){
          this.$message.error('总件数与分件数不匹配')
          return;
        }
        if(C_B_M !== Number(this.initData.inboundCbm) && this.initData.status === 13){
          console.log(C_B_M,this.initData.inboundCbm);
          this.$message.error('总体积与分体积不匹配')
        }
        // 获取应收账单的长度 为 12345
        let tempLength = this.initData.arOrderPriceList.length;
        let arrayTypeOne = [];
        if (tempLength == 1) {
          arrayTypeOne = this.$refs.typeBill0[0].tableData;
        } else if (tempLength == 2) {
          arrayTypeOne = [
            ...this.$refs.typeBill0[0].tableData,
            ...this.$refs.typeBill1[0].tableData,
          ];
        } else if (tempLength == 3) {
          arrayTypeOne = [
            ...this.$refs.typeBill0[0].tableData,
            ...this.$refs.typeBill1[0].tableData,
            ...this.$refs.typeBill2[0].tableData,
          ];
        } else if (tempLength == 4) {
          arrayTypeOne = [
            ...this.$refs.typeBill0[0].tableData,
            ...this.$refs.typeBill1[0].tableData,
            ...this.$refs.typeBill2[0].tableData,
            ...this.$refs.typeBill3[0].tableData,
          ];
        } else if (tempLength == 5) {
          arrayTypeOne = [
            ...this.$refs.typeBill0[0].tableData,
            ...this.$refs.typeBill1[0].tableData,
            ...this.$refs.typeBill2[0].tableData,
            ...this.$refs.typeBill3[0].tableData,
            ...this.$refs.typeBill4[0].tableData,
          ];
        }
        let arrayTypeTwo = this.$refs.typeTwo.tableData;
        let order = this.initData;
        // if (order.hasOwnProperty("apOrderPriceList")) {
        //   delete order.apOrderPriceList;
        // }
        if (order.hasOwnProperty("orderCargoDetailList")) {
          delete order.orderCargoDetailList;
        }
        // if (order.hasOwnProperty("orderPriceList")) {
        //   delete order.orderPriceList;
        // }
        if (order.hasOwnProperty("trayDetail")) {
          delete order.trayDetail;
        }
        let orderPriceList = arrayTypeOne.concat(arrayTypeTwo);
        if(orderPriceList.some(item=>!item.quantity || !item.price)){
          return this.$message.warning("请填写费用金额")
        }
      let orderCargoDetailList = this.$refs.typeThree.tableData
      for(var i=1;i<orderCargoDetailList.length;i++){
          orderCargoDetailList[i].id = '',
          orderCargoDetailList[i].orderId = ''
        }
        const totalImages = order.totalImages
        let params = {
          order: order,
          orderPriceList: orderPriceList,
          orderCargoDetailList: orderCargoDetailList,
          orderAttachmentList: [
            ...(order.orderAttachmentList || []).map(item => {
              const image = totalImages.find(img => img.id === item.id) || item
              return image
            }),
            ...totalImages.filter(img => !img.id)
          ]
        };
        return this.$http.post(this.$service.orderSaveOrder, params).then((data) => {
          if (data.code == 200) {
            this.$message("保存成功");
            // this.$router.push("/orderManagement/orderManage");
            this.getOriganData()
          } else {
            this.$message.error(data.message);
          }
        });
      } else {
        this.$message.error("进仓编号最大输入20位");
      }
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
      this.$route.meta.title = '订单详情-操作中'
      let res = await this.$http.get(
        this.$service.orderSearchDetail + `?orderId=${this.orderId}`
      );
      if (res.code == 200) {
        let tempObj = res.data;
        this.pdfDownLoad = tempObj.orderAttachmentList;
        for (let i = 0; i < this.pdfDownLoad.length; i++) {
          if(this.pdfDownLoad[i].attachmentType !== 5) {
            var copyName = this.pdfDownLoad[i].attachmentName;
            var copyNames = copyName.split("");
            copyNames.splice(7, 9);
            this.pdfDownLoad[i].attachmentName = copyNames.join("");
          }
        }
        tempObj.trayDetail = JSON.parse(tempObj.trayDetail);
        for (let i in tempObj.arOrderPriceList) {
          tempObj.arOrderPriceList[i].changeBillAddOne = false;
        }
        let tempArr = tempObj.arOrderPriceList;
        let isBoo = tempArr.filter((item) => {
          return item.status == 0 || item.status == 1;
        });

        this.isChangeJiaoDan2 = isBoo.length > 0 ? false : true;
        this.isChangeJiaoDan =
          tempObj.financeStatus == 0 || tempObj.financeStatus == 4;
        this.orderNo = tempObj.orderNo;
        this.initData = {
          ...tempObj,
          totalImages: tempObj.orderAttachmentList.filter(item => item.attachmentType === 1),
        };
        this.isDataDone = true;
        this.billTimer = setInterval(() => {
          this.initData.arOrderPriceList = this.initData.arOrderPriceList.map(
            (item) => {
              return {
                ...item,
                billCountDownTime: this.$utils.billCountDown(
                  item.billCreateTime,
                  this.billTimer
                ),
              };
            }
          );
        }, 500);
        if((this.initData.status) == 21){
          this.num21 = true
          this.pageNumber = "4"
        }else{
          this.num21 = false
        }
      }
    },
    // 客户发起对账
    async reconciliationClient(e) {
      try {
         await this.saveOrder(false)
      }catch (err){
        return 
      }
     
      // 客户发起对账前需选择付款单位
      const isAllApPriceFinish = this.initData.apOrderPriceList.every(price => {
        if (!price.expenseUnitName) {
          this.$message.error(`请选择${price.expenseName}付款单位`);
        }
        return price.expenseUnitName
      });
      if (!isAllApPriceFinish) {
        return
      }
      let { departureDate, fullLeg, orderNo, waybillNo } = this.initData;
      let userId = sessionStorage.getItem("userId");
      // let tempArray = [];

      // if (e == 0) {
      //   tempArray = this.$refs.typeBill0[0].tableData;
      // } else if (e == 1) {
      //   tempArray = this.$refs.typeBill1[0].tableData;
      // } else if (e == 2) {
      //   tempArray = this.$refs.typeBill2[0].tableData;
      // } else if (e == 3) {
      //   tempArray = this.$refs.typeBill3[0].tableData;
      // } else if (e == 4) {
      //   tempArray = this.$refs.typeBill4[0].tableData;
      // } else if (e == 100) {
      //   tempArray = this.$refs.typeNewBill.tableData;
      // }
      
      // let typeTwo = this.$refs.typeTwo.tableData;
      let tempArray = (() => {
        if (e != 100) {
          return this.initData.arOrderPriceList[e].list
        } else {
          return this.$refs.typeNewBill.tableData;
        }
      })()
      const typeTwo = this.initData.apOrderPriceList;
      tempArray = tempArray.concat(typeTwo);
      if(tempArray.some(item=>!item.quantity || !item.price)) {
        
        return this.$message.warning("请填写数量和单价")
      }
      let params = {
        departureDate: departureDate,
        fullLeg: fullLeg,
        orderNo: orderNo,
        waybillNo: waybillNo,
        orderId: this.orderId,
        userId: userId,
        prices: tempArray,
      };
      this.$http
        .post(this.$service.priceSendBill, params)
        .then((res) => {
          console.log(res);
          if (res.code == 200) {
            // this.$router.push("/orderManagement/orderManage");
            this.creatNewBillBoolen = false
            this.getOriganData()
          } else {
            console.log(res.message);
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style scoped>
.largerText {
  font-size: 20px;
  font-weight: 600;
}
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
  margin:10px 0 10px 20px;
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
.pTips {
  margin-left: 25px;
  margin-top: 5x;
  margin-bottom:15px;
}
.pTips > span:nth-child(2) {
  color: rgb(2, 175, 240);
  text-decoration: underline;
  margin-left: 15px;
}
.opearte {
  color: rgb(2, 175, 240);
  text-decoration: underline;
  text-align: right;
  margin-right: 30px;
  position: relative;
  font-size: 16px;
  cursor: pointer;
  float: right;
  margin-top: 20px;
}
</style>
