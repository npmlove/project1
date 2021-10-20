<template>
  <div class="content-wrapper">
    <div class="content">
      <el-form :label-position="labelPosition" :inline="true" label-width="150px" size="medium" class="demo-form-inline">
        <div v-if="status == '5'" style="display: flex;align-items: center;margin-bottom: 20px;">
          <div style="font-size: 18px;font-weight: 100;color: #2273ce;">待客户确认备选方案</div>
          <div style="margin: 0 20px;"><el-button style="width: auto;" size="medium" type="primary">取消订单</el-button></div>
          <div style="font-size: 18px;font-weight: 100;color: #F00;">{{timeOut}}</div>
        </div>

        <!-- 客户信息 -->
        <div style="font-size: 18px;font-weight: 100;margin-bottom: 10px;">客户信息</div>
        <div>
          <el-form-item label="客户">
            <el-input v-model="customerName" :disabled="true" style="width: 596px;"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="订单号">
            <el-input v-model="orderNo" :disabled="true" style="width: 216px;"></el-input>
          </el-form-item>
          <el-form-item label="进仓编号">
            <el-input :disabled="orderStatus.indexOf(status) > -1 ? false : true" v-model="inboundNo" maxlength="30" placeholder="请输入进仓编号" clearable style="width: 216px;"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="运单号">
            <el-input :disabled="orderStatus.indexOf(status) > -1 ? false : true" v-model="waybillNo" onkeyup="value=value.replace(/[^\d]/g, '')" maxlength="11" placeholder="请输入运单号" clearable style="width: 216px;"></el-input>
          </el-form-item>
          <el-form-item label="航线人员">
            <el-select :disabled="orderStatus.indexOf(status) > -1 ? false : true" v-model="principalId" placeholder="请输入航线人员" filterable clearable style="width: 216px;">
              <el-option
                v-for="item in principalIdOpt"
                :key="item.id"
                :label="item.name"
                :value="item.id+'#'+item.name">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="售前客服">
            <el-select :disabled="orderStatus.indexOf(status) > -1 ? false : true" v-model="pscsId" placeholder="请输入售前客服" filterable clearable style="width: 216px;">
              <el-option
                v-for="item in pscsIdOpt"
                :key="item.id"
                :label="item.name"
                :value="item.id+'#'+item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="pod" label="售中客服">
            <el-select :disabled="orderStatus.indexOf(status) > -1 ? false : true" v-model="mscsId" placeholder="请输入售中客服" filterable clearable style="width: 216px;">
              <el-option
                v-for="item in mscsIdOpt"
                :key="item.id"
                :label="item.name"
                :value="item.id+'#'+item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <div>
            <el-form-item label="订单备注">
              <el-input :disabled="orderStatus.indexOf(status) > -1 ? false : true" v-model="remark" maxlength="200" placeholder="请输入订单备注" type="textarea" style="width: 596px;" show-word-limit></el-input>
            </el-form-item>
          </div>
        </div>

        <!-- 其他服务-国内提货 -->
        <div style="font-size: 18px;font-weight: 100;margin-bottom: 10px;">其他服务-国内提货</div>
        <div>
          <el-form-item label="国内提货">
            <el-radio-group v-model="isPickUp">
              <el-radio :disabled="orderStatus.indexOf(status) > -1 ? false : true" v-for="(item,index) in isPickUpOpt" :key="index" :label="item.Value">{{item.Name}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div v-if="isPickUp == '2'">
          <el-form-item label="提货地址">
            <el-input :disabled="orderStatus.indexOf(status) > -1 ? false : true" v-model="pickUpAddress" placeholder="请输入提货地址" maxlength="50" type="textarea" style="width: 596px;" show-word-limit></el-input>
          </el-form-item>
        </div>
        <div v-if="isPickUp == '2'">
          <el-form-item label="提货联系人">
            <el-input :disabled="orderStatus.indexOf(status) > -1 ? false : true" v-model="pickUpContacts" placeholder="请输入提货联系人" maxlength="15" style="width: 596px;"></el-input>
          </el-form-item>
        </div>
        <div v-if="isPickUp == '2'">
          <el-form-item label="联系电话">
            <el-input :disabled="orderStatus.indexOf(status) > -1 ? false : true" v-model="pickUpTel" placeholder="请输入联系电话" onkeyup="value=value.replace(/[^\d]/g, '')" maxlength="11" style="width: 596px;"></el-input>
          </el-form-item>
        </div>

        <!-- 其他服务-清关服务 -->
        <div style="font-size: 18px;font-weight: 100;margin-bottom: 10px;">其他服务-清关服务</div>
        <div>
          <el-form-item label="清关服务">
            <el-radio-group v-model="cclType">
              <el-radio :disabled="orderStatus.indexOf(status) > -1 ? false : true" v-for="(item,index) in cclTypeOpt" :key="index" :label="item.Value">{{item.Name}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div v-if="cclType != '1'">
          <el-form-item label="提货地址">
            <el-input :disabled="orderStatus.indexOf(status) > -1 ? false : true" v-model="deliveryAddress" placeholder="请输入提货地址" maxlength="200" type="textarea" style="width: 596px;" show-word-limit></el-input>
          </el-form-item>
        </div>
        <div v-if="cclType != '1'">
          <el-form-item label="提货联系人">
            <el-input :disabled="orderStatus.indexOf(status) > -1 ? false : true" v-model="deliveryContacts" placeholder="请输入提货联系人" maxlength="50" style="width: 596px;"></el-input>
          </el-form-item>
        </div>
        <div v-if="cclType != '1'">
          <el-form-item label="联系电话">
            <el-input :disabled="orderStatus.indexOf(status) > -1 ? false : true" v-model="deliveryTel" placeholder="请输入联系电话" maxlength="20" style="width: 596px;"></el-input>
          </el-form-item>
        </div>

        <!-- 航线信息 -->
        <div style="font-size: 18px;font-weight: 100;margin-bottom: 10px;">航线信息</div>
        <div>
          <el-form-item label="起运港">
            <el-select v-model="pol" :disabled="orderStatus.indexOf(status) > -1 ? false : true" :remote-method="polMethod" @change="initAirlineSearchByPage" :loading="loading" clearable filterable remote reserve-keyword placeholder="请选择起运港" style="width: 216;">
              <el-option
                v-for="item in polOpt"
                :key="item.threeLetterCode"
                :disabled="item.pod == item.threeLetterCode"
                :label="item.threeLetterCode"
                :value="item.threeLetterCode">
                <span style="margin-right: 5px;">{{item.threeLetterCode}}</span>
                <span>{{item.name}}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="目的港">
            <el-select v-model="pod" :disabled="orderStatus.indexOf(status) > -1 ? false : true" :remote-method="podMethod" @change="initAirlineSearchByPage" :loading="loading" clearable filterable remote reserve-keyword placeholder="请选择起运港" style="width: 216;">
              <el-option
                v-for="item in podOpt"
                :key="item.threeLetterCode"
                :disabled="item.pol == item.threeLetterCode"
                :label="item.threeLetterCode"
                :value="item.threeLetterCode">
                <span style="margin-right: 5px;">{{item.threeLetterCode}}</span>
                <span>{{item.name}}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="航司">
            <el-select v-model="airCompanyName" :disabled="orderStatus.indexOf(status) > -1 ? false : true" @change="initAirlineSearchByPage" :remote-method="companyMethod" :loading="loading" clearable filterable remote reserve-keyword placeholder="请选择航司" style="width: 216;">
              <el-option
                v-for="item in airCompanyCodeOpt"
                :key="item.airCompanyCode"
                :label="item.name"
                :value="item.airCompanyCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订舱单价">
            <el-input v-model="bookingPrice" :disabled="orderStatus.indexOf(status) > -1 ? false : true" placeholder="请输入订舱单价" style="width: 216px;"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="航线路径">
            <!-- <el-input v-model="fullLeg" :disabled="true" placeholder="请输入航线路径" style="width: 596px;"></el-input> -->
            <div v-if="flightNoOpt.length == 0" style="color: #2273ce;">选择起运港、目的港、航司、代理公司后才会有推荐航线</div>
            <el-radio-group v-else v-model="fullLeg" :disabled="orderStatus.indexOf(status) > -1 ? false : true">
              <el-radio v-for="(optItem,optIndex) in flightNoOpt" :key="optIndex" :label="optItem.fullLeg">{{optItem.fullLeg}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="分泡比例">
            <el-select :disabled="orderStatus.indexOf(status) > -1 ? false : true" v-model="bubblePoint"  filterable clearable placeholder="请选择分泡比例" style="width: 216;">
              <el-option
                v-for="item in bubblePointOpt"
                :key="item.Name"
                :label="item.Name"
                :value="item.Value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出发日期">
            <el-date-picker
              v-model="departureDate"
              type="date"
              placeholder="选择日期"
               :disabled="orderStatus.indexOf(status) > -1 ? false : true"
              style="width: 216px;"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="代理公司">
            <el-select :disabled="orderStatus.indexOf(status) > -1 ? false : true" v-model="agentId" filterable clearable placeholder="请选代理公司" style="width: 216;">
              <el-option
                v-for="item in agentIdOpt"
                :key="item.id"
                :label="item.agentName"
                :value="item.id+'#'+item.agentName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="航班号">
            <el-input :disabled="orderStatus.indexOf(status) > -1 ? false : true" v-model="flightNo" maxlength="30" placeholder="请输入航班号" style="width: 216px;"></el-input>
          </el-form-item>
        </div>

        <!-- 货物信息 -->
        <div style="font-size: 18px;font-weight: 100;margin-bottom: 10px;">货物信息</div>
        <div>
          <el-form-item label="货物品名">
            <el-input :disabled="orderStatus.indexOf(status) > -1 ? false : true" v-model="cargoName" placeholder="请输入货物品名" style="width: 596px;"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="货物品类">
            <el-select :disabled="orderStatus.indexOf(status) > -1 ? false : true" v-model="cargoType" clearable placeholder="请选择货物品类" style="width: 216;">
              <el-option
                v-for="item in cargoTypeOpt"
                :key="item.Name"
                :label="item.Name"
                :value="item.Value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="包装类型">
            <el-select :disabled="orderStatus.indexOf(status) > -1 ? false : true" v-model="packageType" clearable placeholder="请选择包装类型" style="width: 216;">
              <el-option
                v-for="item in packageTypeOpt"
                :key="item.Name"
                :label="item.Name"
                :value="item.Value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="件数">
            <el-input v-model="bookingPiece" :disabled="true" placeholder="请输入件数" style="width: 216px;"></el-input>
          </el-form-item>
          <el-form-item label="体积">
            <el-input v-model="bookingCbm" :disabled="true" placeholder="请输入体积" style="width: 216px;"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="重量">
            <el-input :value="bookingWeight" :disabled="true" placeholder="请输入重量" style="width: 216px;"></el-input>
          </el-form-item>
          <el-form-item label="比重">
            <el-input :value="1+':'+bookingVwr" :disabled="true" placeholder="请输入比重" style="width: 216px;"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="计费重">
            <el-input v-model="bookingCw" :disabled="true" placeholder="请输入计费重" style="width: 216px;"></el-input>
          </el-form-item>
        </div>

        <!-- 账单信息-应收账单 -->
        <div style="font-size: 18px;font-weight: 100;margin-bottom: 10px;">账单信息-应收账单</div>
        <div class="route-module" style="margin-left: 0;width: 90%;padding-bottom: 0;">
          <div class="flight-template" style="width: auto;margin-left: 0;">
            <div class="flight-template-ul-header">
              <div class="flight-template-li" style="flex: 0 0 5%;text-align: center;">序号</div>
              <div class="flight-template-li" style="flex: 0 0 13%;text-align: center;">费用名称</div>
              <div class="flight-template-li" style="flex: 0 0 13%;text-align: center;">收款单位</div>
              <div class="flight-template-li" style="flex: 0 0 7%;text-align: center;">单价</div>
              <div class="flight-template-li" style="flex: 0 0 7%;text-align: center;">数量</div>
              <div class="flight-template-li" style="flex: 0 0 7%;text-align: center;">币种</div>
              <div class="flight-template-li" style="flex: 0 0 10%;text-align: center;">原币合计</div>
              <div class="flight-template-li" style="flex: 0 0 5%;text-align: center;">汇率</div>
              <div class="flight-template-li" style="flex: 0 0 10%;text-align: center;">人名币合计</div>
              <div class="flight-template-li" style="flex: 0 0 13%;text-align: center;">备注</div>
              <div v-if="orderStatus.indexOf(status) > -1" class="flight-template-li" style="flex: 0 0 10%;text-align: center;">操作</div>
            </div>
            <div v-for="(childerItem,childerIndex) in arOrderPriceList" :key="childerIndex" class="flight-template-ul-content">
              <div class="flight-template-li" style="flex: 0 0 5%;">{{childerIndex+1}}</div>
              <div class="flight-template-li" style="flex: 0 0 13%;">
                <el-input v-if="childerItem.expenseName == '空运费'" value="空运费" :disabled="true" size="small" style="width: 90%;"></el-input>
                <el-select :disabled="orderStatus.indexOf(status) > -1 ? false : true" v-else v-model="childerItem.expenseName" size="small" clearable placeholder="请选择" style="width: 90%;">
                  <el-option
                    v-for="item in expenseCodeOpt"
                    :key="item.expenseName"
                    :label="item.expenseName"
                    :value="item.expenseName">
                  </el-option>
                </el-select>
              </div>
              <div class="flight-template-li" style="flex: 0 0 13%;">
                <el-input v-if="childerItem.expenseName == '空运费'" :value="childerItem.expenseUnitName" :disabled="true" size="small" style="width: 90%;"></el-input>
                <el-input :disabled="orderStatus.indexOf(status) > -1 ? false : true" v-else v-model="childerItem.expenseUnitName" size="small" style="width: 90%;"></el-input>
              </div>
              <div class="flight-template-li" style="flex: 0 0 7%;">
                <el-input v-if="childerItem.expenseName == '空运费'" :value="childerItem.price" :disabled="true" size="small" style="width: 90%;"></el-input>
                <el-input :disabled="orderStatus.indexOf(status) > -1 ? false : true" v-else v-model="childerItem.price" @blur="priceBlur(childerItem.price,childerIndex,'应收','单价')" onkeyup="value=value.replace(/[^\d\.]/g, '')"size="small" style="width: 90%;"></el-input>
              </div>
              <div class="flight-template-li" style="flex: 0 0 7%;">
                <el-input v-if="childerItem.expenseName == '空运费'" :value="childerItem.quantity" :disabled="true" size="small" style="width: 90%;"></el-input>
                <el-input :disabled="orderStatus.indexOf(status) > -1 ? false : true" v-else v-model="childerItem.quantity" @blur="priceBlur(childerItem.quantity,childerIndex,'应收','数量')" maxlength="7" onkeyup="value=value.replace(/[^\d]/g, '')" size="small" style="width: 90%;"></el-input>
              </div>
              <div class="flight-template-li" style="flex: 0 0 7%;">
                <el-select :disabled="(childerItem.expenseName == '空运费') || (orderStatus.indexOf(status) == -1) ? true : false" v-model="childerItem.currency" size="small" clearable placeholder="请选择" style="width: 90%;">
                  <el-option
                    v-for="item in currencyOpt"
                    :key="item.Name"
                    :label="item.Name"
                    :value="item.Value">
                  </el-option>
                </el-select>
              </div>
              <div class="flight-template-li" style="flex: 0 0 10%;">
                <el-input v-model="childerItem.totalCny" :disabled="true" size="small" style="width: 90%;"></el-input>
              </div>
              <div class="flight-template-li" style="flex: 0 0 5%;">
                <el-input v-if="childerItem.expenseName == '空运费'" :value="childerItem.exchangeRate" :disabled="true" size="small" style="width: 90%;"></el-input>
                <el-input :disabled="orderStatus.indexOf(status) > -1 ? false : true" v-else v-model="childerItem.exchangeRate"  @blur="priceBlur(childerItem.exchangeRate,childerIndex,'应收','汇率')" onkeyup="value=value.replace(/[^\d\.]/g, '')" size="small" style="width: 90%;"></el-input>
              </div>
              <div class="flight-template-li" style="flex: 0 0 10%;">
                <el-input v-model="childerItem.totalOrgn" :disabled="true" size="small" style="width: 90%;"></el-input>
              </div>
              <div class="flight-template-li" style="flex: 0 0 13%;">
                <el-input :disabled="orderStatus.indexOf(status) > -1 ? false : true" v-model="childerItem.remark" maxlength="50" size="small" style="width: 80%;"></el-input>
              </div>
              <div v-if="orderStatus.indexOf(status) > -1" class="flight-template-li" size="small" style="flex: 0 0 10%;">
                <a :style="{visibility: arOrderPriceList.length > 9 ? 'hidden' : 'visible'}" @click="addArOrderPriceList(childerIndex)" style="font-size: 18px;"><i class="el-icon-circle-plus-outline"></i></a>
                <a @click="delArOrderPriceList(childerIndex)" style="font-size: 18px;"><i class="el-icon-delete"></i></a>
              </div>
            </div>
          </div>
          <div style="margin-top: 20px;">
            <el-form-item label="账单合计">
              <div>{{totalArOrgn}}</div>
            </el-form-item>
            <el-form-item label="人民币合计">
              <div>{{totalArCny}}</div>
            </el-form-item>
            <el-form-item label="结算方式">
              <el-select :disabled="settlementModes == '0'" v-model="settlementModes" clearable placeholder="请选择结算方式">
                <el-option
                  v-for="item in settlementModesOpt"
                  :key="item.Name"
                  :label="item.Name"
                  :value="item.Value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>

        <!-- 账单信息-应付账单 -->
        <div style="font-size: 18px;font-weight: 100;margin-bottom: 10px;">账单信息-应付账单</div>
        <div class="route-module" style="margin-left: 0;width: 90%;padding-bottom: 0;">
          <div class="flight-template" style="width: auto;margin-left: 0;">
            <div class="flight-template-ul-header">
              <div class="flight-template-li" style="flex: 0 0 5%;text-align: center;">序号</div>
              <div class="flight-template-li" style="flex: 0 0 13%;text-align: center;">费用名称</div>
              <div class="flight-template-li" style="flex: 0 0 13%;text-align: center;">付款单位</div>
              <div class="flight-template-li" style="flex: 0 0 7%;text-align: center;">单价</div>
              <div class="flight-template-li" style="flex: 0 0 7%;text-align: center;">数量</div>
              <div class="flight-template-li" style="flex: 0 0 7%;text-align: center;">币种</div>
              <div class="flight-template-li" style="flex: 0 0 10%;text-align: center;">原币合计</div>
              <div class="flight-template-li" style="flex: 0 0 5%;text-align: center;">汇率</div>
              <div class="flight-template-li" style="flex: 0 0 10%;text-align: center;">人名币合计</div>
              <div class="flight-template-li" style="flex: 0 0 13%;text-align: center;">备注</div>
              <div v-if="orderStatus.indexOf(status) > -1" class="flight-template-li" style="flex: 0 0 10%;text-align: center;">操作</div>
            </div>
            <div v-for="(childerItem,childerIndex) in apOrderPriceList" :key="childerIndex" class="flight-template-ul-content">
              <div class="flight-template-li" style="flex: 0 0 5%;">{{childerIndex+1}}</div>
              <div class="flight-template-li" style="flex: 0 0 13%;">
                <el-input v-if="childerItem.expenseName == '空运费'" value="空运费" :disabled="true" size="small" style="width: 80%;"></el-input>
                <el-select :disabled="orderStatus.indexOf(status) > -1 ? false : true" v-else v-model="childerItem.expenseName" size="small" clearable placeholder="请选择" style="width: 80%;">
                  <el-option
                    v-for="item in expenseCodeOpt"
                    :key="item.expenseName"
                    :label="item.expenseName"
                    :value="item.expenseName">
                  </el-option>
                </el-select>
              </div>
              <div class="flight-template-li" style="flex: 0 0 13%;">
                <el-input :disabled="(childerItem.expenseName == '空运费') || (orderStatus.indexOf(status) == -1) ? true : false" v-model="childerItem.expenseUnitName" size="small" style="width: 90%;"></el-input>
              </div>
              <div class="flight-template-li" style="flex: 0 0 7%;">
                <el-input v-if="childerItem.expenseName == '空运费'" :value="childerItem.price" :disabled="true" size="small" style="width: 90%;"></el-input>
                <el-input :disabled="orderStatus.indexOf(status) > -1 ? false : true" v-else v-model="childerItem.price" @blur="priceBlur(childerItem.price,childerIndex,'应付','单价')" onkeyup="value=value.replace(/[^\d\.]/g, '')" size="small" style="width: 90%;"></el-input>
              </div>
              <div class="flight-template-li" style="flex: 0 0 7%;">
                <el-input v-if="childerItem.expenseName == '空运费'" :value="childerItem.quantity" :disabled="true" size="small" style="width: 90%;"></el-input>
                <el-input :disabled="orderStatus.indexOf(status) > -1 ? false : true" v-else v-model="childerItem.quantity" @blur="priceBlur(childerItem.quantity,childerIndex,'应付','数量')" maxlength="7" onkeyup="value=value.replace(/[^\d]/g, '')" size="small" style="width: 90%;"></el-input>
              </div>
              <div class="flight-template-li" style="flex: 0 0 7%;">
                <el-select :disabled="(childerItem.expenseName == '空运费') || (orderStatus.indexOf(status) == -1) ? true : false" v-model="childerItem.currency" size="small" clearable placeholder="请选择" style="width: 80%;">
                  <el-option
                    v-for="item in currencyOpt"
                    :key="item.Name"
                    :label="item.Name"
                    :value="item.Value">
                  </el-option>
                </el-select>
              </div>
              <div class="flight-template-li" style="flex: 0 0 10%;">
                <el-input v-model="childerItem.totalCny" :disabled="true" size="small" style="width: 90%;"></el-input>
              </div>
              <div class="flight-template-li" style="flex: 0 0 5%;">
                <el-input v-if="childerItem.expenseName == '空运费'" :value="childerItem.exchangeRate" :disabled="true" size="small" style="width: 90%;"></el-input>
                <el-input :disabled="orderStatus.indexOf(status) > -1 ? false : true" v-else v-model="childerItem.exchangeRate" @blur="priceBlur(childerItem.exchangeRate,childerIndex,'应付','汇率')" onkeyup="value=value.replace(/[^\d\.]/g, '')" size="small" style="width: 90%;"></el-input>
              </div>
              <div class="flight-template-li" style="flex: 0 0 10%;">
                <el-input v-model="childerItem.totalOrgn" :disabled="true" size="small" style="width: 90%;"></el-input>
              </div>
              <div class="flight-template-li" style="flex: 0 0 13%;">
                <el-input :disabled="orderStatus.indexOf(status) > -1 ? false : true" v-model="childerItem.remark" maxlength="50" size="small" style="width: 80%;"></el-input>
              </div>
              <div v-if="orderStatus.indexOf(status) > -1" class="flight-template-li" size="small" style="flex: 0 0 10%;">
                <a :style="{visibility: apOrderPriceList.length > 9 ? 'hidden' : 'visible'}" @click="addApOrderPriceList(childerIndex)" style="font-size: 18px;"><i class="el-icon-circle-plus-outline"></i></a>
                <a @click="delApOrderPriceList(childerIndex)" style="font-size: 18px;"><i class="el-icon-delete"></i></a>
              </div>
            </div>
          </div>
          <div style="margin-top: 20px;">
            <el-form-item label="账单合计">
              <div>{{totalApOrgn}}</div>
            </el-form-item>
            <el-form-item label="人民币合计">
              <div>{{totalApCny}}</div>
            </el-form-item>
            <el-form-item label="利润">
              <div>{{orderProfit}}</div>
            </el-form-item>
          </div>
        </div>
      </el-form>

      <!-- 航线价格 -->
      <el-form v-if="orderStatus.indexOf(status) > -1" :label-position="labelPosition" :inline="true" label-width="150px" size="medium" class="demo-form-inline">
        <div class="rest-style" style="padding-left: 20px;">
          <el-form-item label=" " label-width="150px">
            <el-button @click="submitClick('保存')" style="height: 36px;line-height: 36px;padding: 0;" type="primary" >保存</el-button>
            <el-button @click="submitClick('失败')" style="height: 36px;line-height: 36px;padding: 0;" type="primary" >取消订单</el-button>
            <el-button @click="submitClick('通过')" style="height: 36px;line-height: 36px;padding: 0;" type="primary" >审核通过</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {toData} from '@/util/assist'
  export default {
    data() {
      return {
        orderStatus: [9],
        labelPosition: 'right',
        loading: false,
        id: '',
        orderId: '',
        status: '',
        dow: '',
        detailsArr: {},
        customerId: '',
        customerName: '',
        orderNo: '',
        inboundNo: '',
        waybillNo: '',
        principalId: '',
        principalIdOpt: [],
        pscsId: '',
        pscsIdOpt: [],
        mscsId: '',
        mscsIdOpt: [],
        remark: '',
        isPickUp: '1',
        pickUpAddress: '',
        pickUpContacts: '',
        pickUpTel: '',
        isPickUpOpt: [
          {
            Name: '不需要',
            Value: '1'
          },
          {
            Name: '需要',
            Value: '2'
          }
        ],
        cclType: '1',
        deliveryAddress: '',
        deliveryContacts: '',
        deliveryTel: '',
        cclTypeOpt: [
          {
            Name: '自行清关',
            Value: '1'
          },
          {
            Name: 'DDU',
            Value: '2'
          },
          {
            Name: 'DDP',
            Value: '3'
          },
          {
            Name: 'DAP',
            Value: '4'
          }
        ],
        pol: '',
        pod: '',
        airCompanyCode: '',
        airCompanyName: '',
        bookingPrice: '',
        fullLeg: '',
        bubblePoint: '',
        bubblePointOpt: [
          {
            Name: '不分泡',
            Value: '10'
          },
          {
            Name: '1/9',
            Value: '1'
          },
          {
            Name: '2/8',
            Value: '2'
          },
          {
            Name: '3/7',
            Value: '3'
          },
          {
            Name: '4/6',
            Value: '4'
          },
          {
            Name: '5/5',
            Value: '5'
          },
          {
            Name: '6/4',
            Value: '6'
          },
          {
            Name: '7/3',
            Value: '7'
          },
          {
            Name: '8/2',
            Value: '8'
          },
          {
            Name: '9/1',
            Value: '9'
          }
        ],
        departureDate: '',
        agentId: '',
        agentIdOpt: [],
        flightNo: '',
        cargoName: '',
        cargoType: '',
        cargoTypeOpt: [
          {
            Name: '普货',
            Value: '1'
          },
          {
            Name: '化工',
            Value: '2'
          },
          {
            Name: '危险品',
            Value: '3'
          },
          {
            Name: '防疫物资',
            Value: '4'
          }
        ],
        packageType: '',
        packageTypeOpt: [
          {
            Name: '散货价',
            Value: '1'
          },
          {
            Name: '托盘价',
            Value: '2'
          }
        ],
        bookingPiece: '',
        bookingCbm: '',
        bookingWeight: '',
        bookingVwr: '',
        bookingCw: '',
        showMake: false,
        orderOptionsList: [
          {
            pol: '',
            pod: '',
            airCompanyCode: '',
            agentId: '',
            agentName: '',
            departureDate: '',
            bookingPrice: '',
            bubblePoint: '',
            flightNo: '',
            id: '',
            dow: '',
            orderId: '',
            sortNo: '',
            fullLeg: '',
            flightNoOpt: []
          }
        ],
        polOpt: [],
        podOpt: [],
        airCompanyCodeOpt: [],
        flightNoOpt: [],
        arOrderPriceList: [],
        apOrderPriceList: [],
        currencyOpt: [
          {
            Name: '人民币',
            Value: '1'
          },
          {
            Name: '港币',
            Value: '2'
          },
          {
            Name: '美元',
            Value: '3'
          },
          {
            Name: '欧元',
            Value: '4'
          },
          {
            Name: '英镑',
            Value: '5'
          }
        ],
        expenseCodeOpt: [],
        settlementModes: '',
        settlementModesOpt: [
          {
            Name: '付款买单',
            Value: '0'
          },
          {
            Name: '月结买单',
            Value: '1'
          }
        ],
        totalApCny: '',
        totalApOrgn: '',
        totalArCny: '',
        totalArOrgn: '',
        orderProfit: '',
        customsType: '',
        pscsName: '',
        principalName: '',
        mscsName: '',
        agentName: '',
        activityCodeDoing: '',
        activityCodeDoing: '',
        updateTime: '',
        timeOut: '',
        h: '',
        m: '',
        s: ''
      }
    },
    created() {
      this.orderId = this.$route.query.id
      this.initPrincipal()
      this.initPscs()
      this.initMscs()
      this.initAgent()
      this.initExpenseCode()
      this.initDetails()
      this.initPolPod()
      this.companyMethod()
    },
    methods: {
      //倒计时
      countTime(totalTime) {
        //获取当前时间
        var date = new Date();
        var now = date.getTime();

        //设置截止时间
        var endDate = new Date(totalTime);
        var end = endDate.getTime()+24*60*60*1000;

        //时间差
        var leftTime = end-now;

        //定义变量 d,h,m,s保存倒计时的时间
        if (leftTime>=0) {
          this.h = Math.floor(leftTime/1000/60/60%24);
          this.m = Math.floor(leftTime/1000/60%60);
          this.s = Math.floor(leftTime/1000%60);
        }
        this.h = this.h > 9 ? this.h : '0'+this.h
        this.m = this.m > 9 ? this.m : '0'+this.m
        this.s = this.s > 9 ? this.s : '0'+this.s
        this.timeOut = this.h +'时'+ this.m +'分'+ this.s +'秒'
        setTimeout(() => {
          this.countTime(this.updateTime)
        },1000);
      },
      //保存
      submitClick(type) {
        var order = {
          agentId: this.agentId.split('#')[0],
          agentName: this.agentId.split('#')[1],
          airCompanyCode: this.airCompanyCode,
          bookingCbm: this.bookingCbm,
          bookingCw: this.bookingCw,
          bookingPiece: this.bookingPiece,
          bookingPrice: this.bookingPrice,
          bookingWeight: this.bookingWeight,
          bubblePoint: this.bubblePoint,
          cargoName: this.cargoName,
          cargoType: this.cargoType,
          cclType: this.cclType,
          customerId: this.customerId,
          customsType: this.customsType,
          deliveryAddress: this.deliveryAddress,
          deliveryContacts: this.deliveryContacts,
          deliveryTel: this.deliveryTel,
          departureDate: this.departureDate,
          dow: this.dow,
          flightNo: this.flightNo,
          fullLeg: this.fullLeg,
          id: this.orderId,
          isPickUp: this.isPickUp,
          mscsId: this.mscsId.split('#')[0],
          mscsName: this.mscsId.split('#')[1],
          orderNo: this.orderNo,
          orderProfit: this.orderProfit,
          packageType: this.packageType,
          pickUpAddress: this.pickUpAddress,
          pickUpContacts: this.pickUpContacts,
          pickUpTel: this.pickUpTel,
          principalId: this.principalId.split('#')[0],
          principalName: this.principalId.split('#')[1],
          pscsId: this.pscsId.split('#')[0],
          pscsName: this.pscsId.split('#')[1],
          remark: this.remark,
          settlementModes: this.settlementModes,
          status: this.status,
          totalApCny: this.totalApCny,
          totalApOrgn: this.totalApOrgn,
          totalArCny: this.totalArCny,
          totalArOrgn: this.totalArOrgn,
          waybillNo: this.waybillNo,
          pod: this.pod,
          pol: this.pol,
          activityCodeDoing: this.activityCodeDoing,
          activityCodeDone: this.activityCodeDone,
          inboundNo: this.inboundNo
        }
        var orderPriceList = []
        orderPriceList = this.arOrderPriceList.concat(this.apOrderPriceList)
        if(this.showMake){
          var orderOptionsList = []
          for(var q = 0; q < this.orderOptionsList.length; q++){
            var json = {
              agentId: this.orderOptionsList[q].agentId.split('#')[0],
              agentName: this.orderOptionsList[q].agentId.split('#')[1],
              airCompanyCode: this.orderOptionsList[q].airCompanyCode.split('#')[0],
              airCompanyName: this.orderOptionsList[q].airCompanyCode.split('#')[1],
              bookingPrice: this.orderOptionsList[q].bookingPrice,
              bubblePoint: this.orderOptionsList[q].bubblePoint,
              departureDate: this.orderOptionsList[q].departureDate,
              dow: new Date(this.orderOptionsList[q].departureDate).getDay() == 0 ? 7 : new Date(this.orderOptionsList[q].departureDate).getDay(),
              flightNo: this.orderOptionsList[q].flightNo,
              fullLeg: this.orderOptionsList[q].fullLeg,
              pod: this.orderOptionsList[q].pod,
              pol: this.orderOptionsList[q].pol,
              sortNo: q+1,
              id: this.orderOptionsList[q].id,
              orderId: this.orderId
            }
            orderOptionsList.push(json)
          }
          var data = {
            order: order,
            orderOptionsList: orderOptionsList,
            orderPriceList: orderPriceList,
          }
        } else {
          var data = {
            order: order,
            orderPriceList: orderPriceList,
          }
        }
        if(type == '保存'){
          this.$http.post(this.$service.orderSaveOrder,data).then((data) => {
            if(data.code == 200){
              this.$router.push('/orderManagement/orderManage')
            } else {
              this.$message.error(data.message)
            }
          })
        }else if(type == '通过'){
          data.ctrlMap = {
            ctrlFlag: 1
          }
          this.$http.post(this.$service.orderExecuteOrder,data).then((data) => {
            if(data.code == 200){
              this.$router.push('/orderManagement/orderManage')
            } else {
              this.$message.error(data.message)
            }
          })
        }else if(type == '失败'){
          this.$confirm('确定取消订单?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            data.ctrlMap = {
              ctrlFlag: 2
            }
            this.$http.post(this.$service.orderExecuteOrder,data).then((data) => {
              if(data.code == 200){
                this.$router.push('/orderManagement/orderManage')
              } else {
                this.$message.error(data.message)
              }
            })
          })
        }
      },
      //账单合计、人名币合计
      totalPriceType(type) {
        if(type == '应收'){
          var newArr = []
          this.totalArCny = 0
          var value1 = 0
          var value2 = 0
          var value3 = 0
          var value4 = 0
          var value5 = 0
          // HK$ $ € ￡
          for(var i = 0; i < this.arOrderPriceList.length; i++){
            this.totalArCny += this.arOrderPriceList[i].totalOrgn
            var json = {}
            if(this.arOrderPriceList[i].currency == '1'){
              value1 += this.arOrderPriceList[i].totalCny
            }else if(this.arOrderPriceList[i].currency == '2'){
              value2 += this.arOrderPriceList[i].totalCny
            }else if(this.arOrderPriceList[i].currency == '3'){
              value3 += this.arOrderPriceList[i].totalCny
            }else if(this.arOrderPriceList[i].currency == '4'){
              value4 += this.arOrderPriceList[i].totalCny
            }else if(this.arOrderPriceList[i].currency == '5'){
              value5 += this.arOrderPriceList[i].totalCny
            }
          }
          this.totalArOrgn = ''
          this.totalArOrgn += value1 ? '￥'+value1+'+' : ''
          this.totalArOrgn += value2 ? 'HK$'+value2+'+' : ''
          this.totalArOrgn += value3 ? '$'+value3+'+' : ''
          this.totalArOrgn += value4 ? '€'+value4+'+' : ''
          this.totalArOrgn += value5 ? '￡'+value5 : ''
          this.totalArOrgn = this.totalArOrgn.substring(0, this.totalArOrgn.length - 1)
        }else if(type == '应付'){
          var newArr = []
          this.totalApCny = 0
          var value1 = 0
          var value2 = 0
          var value3 = 0
          var value4 = 0
          var value5 = 0
          // HK$ $ € ￡
          for(var i = 0; i < this.apOrderPriceList.length; i++){
            this.totalApCny += this.apOrderPriceList[i].totalOrgn
            var json = {}
            if(this.apOrderPriceList[i].currency == '1'){
              value1 += this.apOrderPriceList[i].totalCny
            }else if(this.apOrderPriceList[i].currency == '2'){
              value2 += this.apOrderPriceList[i].totalCny
            }else if(this.apOrderPriceList[i].currency == '3'){
              value3 += this.apOrderPriceList[i].totalCny
            }else if(this.apOrderPriceList[i].currency == '4'){
              value4 += this.apOrderPriceList[i].totalCny
            }else if(this.apOrderPriceList[i].currency == '5'){
              value5 += this.apOrderPriceList[i].totalCny
            }
          }
          this.totalApOrgn = ''
          this.totalApOrgn += value1 ? '￥'+value1+'+' : ''
          this.totalApOrgn += value2 ? 'HK$'+value2+'+' : ''
          this.totalApOrgn += value3 ? '$'+value3+'+' : ''
          this.totalApOrgn += value4 ? '€'+value4+'+' : ''
          this.totalApOrgn += value5 ? '￡'+value5 : ''
          this.totalApOrgn = this.totalApOrgn.substring(0, this.totalApOrgn.length - 1)
        }
      },
      //账单单价、数量、汇率计算
      priceBlur(val,index,type,title) {
        var reg = /(^[1-9][0-9]{0,5}$)|(^[0-9]{0,6}[\.][0-9]{1,4}$)/
        var reg1 = /(^[1-9][0-9]{0,3}$)|(^[0-9]{0,4}[\.][0-9]{1,4}$)/
        var num = Number(val)
        if(title == '单价'){
          if(!reg.test(num) && (num != '')){
          	this.$message.error('单价最大输入六位正整数，小数保留四位')
            if(type == '应收'){
              this.arOrderPriceList[index].price = ''
              this.arOrderPriceList[index].totalCny = ''
              this.arOrderPriceList[index].totalOrgn = ''
            }else if(type == '应付'){
              this.apOrderPriceList[index].price = ''
              this.apOrderPriceList[index].totalCny = ''
              this.apOrderPriceList[index].totalOrgn = ''
            }
          }else if(num == ''){
            if(type == '应收'){
              this.arOrderPriceList[index].totalCny = ''
              this.arOrderPriceList[index].totalOrgn = ''
            }else if(type == '应付'){
              this.apOrderPriceList[index].totalCny = ''
              this.apOrderPriceList[index].totalOrgn = ''
            }
          }else{
            if(type == '应收' && this.arOrderPriceList[index].price && this.arOrderPriceList[index].quantity){
              this.arOrderPriceList[index].totalCny = Math.ceil(this.arOrderPriceList[index].price*this.arOrderPriceList[index].quantity)
              if(this.arOrderPriceList[index].exchangeRate == ''){
                this.arOrderPriceList[index].totalOrgn = Math.ceil(this.arOrderPriceList[index].price*this.arOrderPriceList[index].quantity*1)
              }else{
                this.arOrderPriceList[index].totalOrgn = Math.ceil(this.arOrderPriceList[index].price*this.arOrderPriceList[index].quantity*this.arOrderPriceList[index].exchangeRate)
              }
              this.totalPriceType('应收')
            }else if(type == '应付' && this.apOrderPriceList[index].price && this.apOrderPriceList[index].quantity){
              this.apOrderPriceList[index].totalCny = Math.ceil(this.apOrderPriceList[index].price*this.apOrderPriceList[index].quantity)
              if(this.apOrderPriceList[index].exchangeRate == ''){
                this.apOrderPriceList[index].totalOrgn = Math.ceil(this.apOrderPriceList[index].price*this.apOrderPriceList[index].quantity*1)
              }else{
                this.apOrderPriceList[index].totalOrgn = Math.ceil(this.apOrderPriceList[index].price*this.apOrderPriceList[index].quantity*this.apOrderPriceList[index].exchangeRate)
              }
              this.totalPriceType('应付')
            }
          }
        }else if(title == '汇率'){
          if(!reg1.test(num) && (num != '')){
          	this.$message.error('单价最大输入四位正整数，小数保留四位')
            if(type == '应收'){
              this.arOrderPriceList[index].exchangeRate = ''
              this.arOrderPriceList[index].totalOrgn = ''
            }else if(type == '应付'){
              this.apOrderPriceList[index].exchangeRate = ''
              this.apOrderPriceList[index].totalOrgn = ''
            }
          }else if(type == '应收' && this.arOrderPriceList[index].price && this.arOrderPriceList[index].quantity){
            if(this.arOrderPriceList[index].exchangeRate == ''){
              this.arOrderPriceList[index].totalOrgn = Math.ceil(this.arOrderPriceList[index].price*this.arOrderPriceList[index].quantity*1)
            }else{
              this.arOrderPriceList[index].totalOrgn = Math.ceil(this.arOrderPriceList[index].price*this.arOrderPriceList[index].quantity*this.arOrderPriceList[index].exchangeRate)
            }
            this.totalPriceType('应收')
          }else if(type == '应付' && this.apOrderPriceList[index].price && this.apOrderPriceList[index].quantity){
            if(this.apOrderPriceList[index].exchangeRate == ''){
              this.apOrderPriceList[index].totalOrgn = Math.ceil(this.apOrderPriceList[index].price*this.apOrderPriceList[index].quantity*1)
            }else{
              this.apOrderPriceList[index].totalOrgn = Math.ceil(this.apOrderPriceList[index].price*this.apOrderPriceList[index].quantity*this.apOrderPriceList[index].exchangeRate)
            }
            this.totalPriceType('应付')
          }
        }else if(title == '数量'){
          if(num == ''){
            if(type == '应收'){
              this.arOrderPriceList[index].totalCny = ''
              this.arOrderPriceList[index].totalOrgn = ''
            }else if(type == '应付'){
              this.apOrderPriceList[index].totalCny = ''
              this.apOrderPriceList[index].totalOrgn = ''
            }
          }else{
            if(type == '应收' && this.arOrderPriceList[index].price && this.arOrderPriceList[index].quantity){
              this.arOrderPriceList[index].totalCny = Math.ceil(this.arOrderPriceList[index].price*this.arOrderPriceList[index].quantity)
              if(this.arOrderPriceList[index].exchangeRate == ''){
                this.arOrderPriceList[index].totalOrgn = Math.ceil(this.arOrderPriceList[index].price*this.arOrderPriceList[index].quantity*1)
              }else{
                this.arOrderPriceList[index].totalOrgn = Math.ceil(this.arOrderPriceList[index].price*this.arOrderPriceList[index].quantity*this.arOrderPriceList[index].exchangeRate)
              }
              this.totalPriceType('应收')
            }else if(type == '应付' && this.apOrderPriceList[index].price && this.apOrderPriceList[index].quantity){
              this.apOrderPriceList[index].totalCny = Math.ceil(this.apOrderPriceList[index].price*this.apOrderPriceList[index].quantity)
              if(this.apOrderPriceList[index].exchangeRate == ''){
                this.apOrderPriceList[index].totalOrgn = Math.ceil(this.apOrderPriceList[index].price*this.apOrderPriceList[index].quantity*1)
              }else{
                this.apOrderPriceList[index].totalOrgn = Math.ceil(this.apOrderPriceList[index].price*this.apOrderPriceList[index].quantity*this.apOrderPriceList[index].exchangeRate)
              }
              this.totalPriceType('应付')
            }
          }
        }else if(type == '推荐'){
          if(!reg1.test(num) && (num != '')){
          	this.$message.error('单价最大输入四位正整数，小数保留四位')
            this.orderOptionsList[index].bookingPrice = ''
            return
          }
        }
      },
      // 审核失败，制作推荐方案
      showMakeClick() {
        this.showMake = !this.showMake
        // this.$confirm('是否制作推荐方案?', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   this.showMake = true
        // }).catch(() => {
        //   this.showMake = false
        // })
      },
      delTableMack(index) {
        this.orderOptionsList.splice(index,1)
      },
      addOrderOptionsList() {
        var json = {
          pol: '',
          pod: '',
          airCompanyCode: '',
          agentId: '',
          agentName: '',
          departureDate: '',
          bookingPrice: '',
          bubblePoint: '',
          flightNo: '',
          id: '',
          dow: '',
          orderId: '',
          sortNo: '',
          fullLeg: '',
          flightNoOpt: []
        }
        this.orderOptionsList.push(json)
      },
      //航线
      initAirlineSearchByPage(index,item) {
        if(!this.agentId || !this.pol || !this.pod || !this.airCompanyCode){
          return
        }
        var json = {
          airCompanyCode: this.airCompanyCode,
          pol: this.pol,
          pod: this.pod,
          pageNum: 1,
          agentName: this.agentId.split('#')[1]
        }
        this.$http.post(this.$service.airlineSearchByPage,json).then((data) => {
          if(data.code == 200){
            this.flightNoOpt = data.data.records
            this.$forceUpdate()
          }else{
            this.$message.error(data.message)
          }
        })
      },
      //费用名称
      initExpenseCode() {
        var json = {
          pageSize: 50000,
        }
        json = toData(json)
        this.$http.get(this.$service.expenseSearchExcludeAirFee+'?'+json).then((data) => {
          if(data.code == 200){
            this.expenseCodeOpt = data.data.records
          }else{
            this.$message.error(data.message)
          }
        })
      },
      //航司公司
      initCompany(keyWord) {
        if(!keyWord){
          keyWord = ''
        }
        this.$http.get(this.$service.companySearchByPage+'?keyWord='+keyWord).then((data) => {
          this.loading = false
          if(data.code == 200){
            this.airCompanyCodeOpt = data.data.records
          } else {
            this.$message.error(data.message)
          }
        })
      },
      companyMethod(keyWord) {
        this.initCompany(keyWord)
      },
      //起始港目的港
      initPolPod(keyWord, type) {
        if (!keyWord) {
          keyWord = ''
        }
        this.$http.get(this.$service.airportSearchByPage + '?keyWord=' + keyWord).then((data) => {
          if (data.code == 200) {
            this.loading = false
            if (type == '起始港') {
              this.polOpt = data.data.records
              console.log(this.polOpt)
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
        this.initPolPod(keyWord,'起始港')
      },
      podMethod(keyWord) {
        this.loading = true
        this.initPolPod(keyWord,'目的港')
      },
      //航线人员
      initPrincipal() {
        var json = {
          roleName: '航线负责人',
          pageSize: 50000,
        }
        json = toData(json)
        this.$http.get(this.$service.userSearch+'?'+json).then((data) => {
          if(data.code == 200){
            this.principalIdOpt = data.data.records
          }else{
            this.$message.error(data.message)
          }
        })
      },
      //售前客服
      initPscs() {
        var json = {
          roleName: '售前客服',
          pageSize: 50000,
        }
        json = toData(json)
        this.$http.get(this.$service.userSearch+'?'+json).then((data) => {
          if(data.code == 200){
            this.pscsIdOpt = data.data.records
          }else{
            this.$message.error(data.message)
          }
        })
      },
      //售中客服
      initMscs() {
        var json = {
          roleName: '售中客服',
          pageSize: 50000,
        }
        json = toData(json)
        this.$http.get(this.$service.userSearch+'?'+json).then((data) => {
          if(data.code == 200){
            this.mscsIdOpt = data.data.records
          }else{
            this.$message.error(data.message)
          }
        })
      },
      //代理公司
      initAgent() {
        var data = {
          pageSize: 50000,
        }
        this.$http.post(this.$service.agentList,data).then((data) => {
          this.loading = false
          if(data.code == 200){
            this.agentIdOpt = data.data.records
          }else{
            this.$message.error(data.message)
          }
        })
      },
      //账单添加与删除
      delApOrderPriceList(index) {
        this.apOrderPriceList.splice(index,1)
        this.totalPriceType('应付')
      },
      addApOrderPriceList() {
        var json = {
          currency: '1',
          exchangeRate: 1,
          expenseName: '',
          expenseType: 2,
          expenseUnitId: '',
          expenseUnitName: '',
          id: '',
          orderId: this.orderId,
          price: '',
          quantity: '',
          remark: '',
          totalCny: '',
          totalOrgn: '',
        }
        this.apOrderPriceList.push(json)
      },
      delArOrderPriceList(index) {
        this.arOrderPriceList.splice(index,1)
        this.totalPriceType('应收')
      },
      addArOrderPriceList() {
        var json = {
          currency: '1',
          exchangeRate: 1,
          expenseName: '',
          expenseType: 1,
          expenseUnitId: '',
          expenseUnitName: '',
          id: '',
          orderId: this.orderId,
          price: '',
          quantity: '',
          remark: '',
          totalCny: '',
          totalOrgn: '',
        }
        this.arOrderPriceList.push(json)
      },
      //账单转化
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
      //获取详情
      initDetails() {
        this.$http.get(this.$service.orderSearchDetail+'?orderId='+this.orderId).then((data) => {
          if(data.code == 200){
            this.detailsArr = data.data
            var data = data.data
            this.status = data.status
            this.pscsName = data.pscsName
            this.principalName = data.principalName
            this.mscsName = data.mscsName
            this.agentName = data.agentName
            this.id = data.id
            this.customerId = data.customerId
            this.orderNo = data.orderNo
            this.customerName = data.customerName
            this.inboundNo = data.inboundNo
            this.waybillNo = data.waybillNo
            this.principalId = data.principalId+'#'+data.principalName
            this.pscsId = data.pscsId+'#'+data.pscsName
            this.mscsId = data.mscsId+'#'+data.mscsName
            this.remark = data.remark
            this.pol = data.pol
            this.pod = data.pod
            this.dow = data.dow
            this.customsType = data.customsType
            this.airCompanyCode = data.airCompanyCode
            this.airCompanyName = data.airCompanyName
            this.bookingPrice = data.bookingPrice
            this.fullLeg = data.fullLeg
            this.bubblePoint = data.bubblePoint.toString()
            this.departureDate = data.departureDate
            this.agentId = data.agentId+'#'+data.agentName
            this.flightNo = data.flightNo
            this.cargoName = data.cargoName
            this.cargoType = data.cargoType.toString()
            this.packageType = data.packageType.toString()
            this.bookingPiece = data.bookingPiece
            this.bookingCbm = data.bookingCbm
            this.bookingWeight = data.bookingWeight
            this.bookingVwr = data.bookingVwr
            this.bookingCw = data.bookingCw
            this.isPickUp = data.isPickUp.toString()
            this.pickUpAddress = data.pickUpAddress
            this.pickUpContacts = data.pickUpContacts
            this.pickUpTel = data.pickUpTel
            this.cclType = data.cclType.toString()
            this.deliveryAddress = data.deliveryAddress
            this.deliveryContacts = data.deliveryContacts
            this.deliveryTel = data.deliveryTel
            this.settlementModes = data.settlementModes.toString()
            this.totalApCny = data.totalApCny
            this.totalApOrgn = this.priceType(data.totalApOrgn)
            this.totalArCny = data.totalArCny
            this.totalArOrgn = this.priceType(data.totalArOrgn)
            this.orderProfit = data.orderProfit
            this.activityCodeDoing = data.activityCodeDoing
            this.activityCodeDone = data.activityCodeDone
            if(data.apOrderPriceList){
              for(var i = 0; i < data.apOrderPriceList.length; i++){
                data.apOrderPriceList[i].currency = data.apOrderPriceList[i].currency.toString()
              }
            }
            this.apOrderPriceList = data.apOrderPriceList
            if(data.arOrderPriceList){
              for(var i = 0; i < data.arOrderPriceList.length; i++){
                data.arOrderPriceList[i].currency = data.arOrderPriceList[i].currency.toString()
              }
            }
            this.arOrderPriceList = data.arOrderPriceList
            if(data.orderOptionsList != null){
              if(data.orderOptionsList.length != 0){
                this.showMake = true
                this.orderOptionsList = data.orderOptionsList
                for(var q = 0; q < this.orderOptionsList.length; q++){
                  this.orderOptionsList[q].flightNoOpt = []
                  this.orderOptionsList[q].bubblePoint = data.orderOptionsList[q].bubblePoint.toString()
                  this.orderOptionsList[q].agentId = data.orderOptionsList[q].agentId+'#'+data.orderOptionsList[q].agentName
                  // console.log(data.orderOptionsList[q])
                  // this.initAirlineSearchByPage(q,data.orderOptionsList[q])
                }
              }
            }
            if(data.status == '5'){
              this.updateTime = data.updateTime
              this.countTime(data.updateTime)
            }
            this.initAirlineSearchByPage()
          }else{
            this.$message.error(data.message)
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  @import url("../../assets/icon/iconfont.css");

  .content-wrapper {
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    overflow: hidden;
    background-color: #f3f6f9;
  }

  .content {
    background-color: #FFF;
    padding: 20px;
    box-sizing: border-box;
    /deep/ .el-form{
      background-color: transparent;
    }
    /deep/ .el-form--inline .el-form-item{
      margin-bottom: 20px;
      vertical-align: top;
    }

    /deep/ .textArea {
      .el-form-item__content {
        height: 64px;

        .el-textarea__inner {
          resize: none;
          padding: 10px 15px;
        }
      }
    }

    /deep/ .radio-group {
      margin-bottom: 30px;

      .el-form-item__label,
      .el-form-item__content {
        // height: 25px;
        line-height: 25px;
      }
    }

    /deep/ .brother-radio {
      margin-bottom: 12px;
    }

    /deep/ .el-form-item__content {
      height: auto;
    }
  }

  .stpes-class {
    width: 500px;
    margin-left: 200px;
    margin-bottom: 20px;
  }

  .route-module {
    background-color: rgba(153, 153, 153, 0.1);
    padding: 20px;
    width: 80%;
    margin-left: 80px;
    border-radius: 5px;
    margin-bottom: 20px;
    position: relative;
  }

  .flight-template {
    width: 80%;
    margin-left: 150px;
  }

  .flight-template-ul-header {
    background-color: #FAFAFA;
    font-weight: bold;
    display: flex;
    font-size: 14px;
  }

  .flight-template-ul-header .flight-template-li {
    height: 40px;
    line-height: 40px;
  }

  .flight-template-ul-content {
    display: flex;
    font-size: 14px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.09);

  }

  .flight-template-ul-content .flight-template-li {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 40px;
  }
  .close-img{
    width: 40px;
    height: 40px;
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
  }
</style>
