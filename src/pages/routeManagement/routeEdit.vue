<template>
  <div class="content-wrapper">
    <div class="content">
      <el-tabs type="border-card">
        <el-tab-pane label="航线信息">
          <el-form :model="ruleForm" ref="ruleForm" :rules="rules" :label-position="labelPosition" :inline="true" label-width="150px" size="medium" class="demo-form-inline">
            <div style="font-size: 18px;font-weight: 100;margin-bottom: 10px;padding-left: 20px;">航线信息</div>
            <div>
              <el-form-item prop="pol" label="起运港">
                <!-- <el-select v-model="ruleForm.pol" @change="polChange" placeholder="请输入机场三字码" :remote-method="polMethod" :loading="loading" clearable filterable remote reserve-keyword>
                  <el-option
                    v-for="(item,index) in polOpt"
                    :disabled="ruleForm.pod == item.threeLetterCode"
                    :key="item.threeLetterCode"
                    :value="item.threeLetterCode">
                      <span>{{item.threeLetterCode}}</span>
                      <span style="margin-left: 5px;">{{item.name}}</span>
                  </el-option>
                </el-select> -->
                <el-input v-model="ruleForm.pol" @input="polMethod" @focus="polClick(1,true)" @blur="polClick(1,false)" size="medium" placeholder="请输入机场三字码" style="width: 216px;"></el-input>
                <div v-show="isPol" class="el-select-dropdown el-popper" style="min-width: 216px;">
                  <div class="el-scrollbar" style="">
                    <div class="el-select-dropdown__wrap el-scrollbar__wrap" style="margin-bottom: -5px; margin-right: -5px;">
                      <ul class="el-scrollbar__view el-select-dropdown__list">
                        <li v-if="polOpt.length > 0" :class="{'is-disabled': ruleForm.pod == item.threeLetterCode}" @mousedown="polChange(item)" v-for="(item,index) in polOpt" :key="index" class="el-select-dropdown__item">
                          <span>{{item.threeLetterCode}}</span>
                          <span style="margin-left: 5px;">{{item.name}}</span>
                        </li>
                        <li v-if="polOpt.length == 0" class="el-select-dropdown__item" style="color: #c0c4cc;">暂无数据</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </el-form-item>
              <el-form-item prop="pod" label="目的港">
                <!-- <el-select v-model="ruleForm.pod" placeholder="请输入机场三字码" :remote-method="podMethod" :loading="loading" clearable filterable remote reserve-keyword>
                  <el-option
                    v-for="item in podOpt"
                    :disabled="ruleForm.pol == item.threeLetterCode"
                    :key="item.threeLetterCode"
                    :value="item.threeLetterCode">
                      <span>{{item.threeLetterCode}}</span>
                      <span style="margin-left: 5px;">{{item.name}}</span>
                  </el-option>
                </el-select> -->
                <el-input v-model="ruleForm.pod" @input="podMethod" @focus="polClick(2,true)" @blur="polClick(2,false)" size="medium" placeholder="请输入机场三字码" style="width: 216px;"></el-input>
                <div v-show="isPod" class="el-select-dropdown el-popper" style="min-width: 216px;">
                  <div class="el-scrollbar" style="">
                    <div class="el-select-dropdown__wrap el-scrollbar__wrap" style="margin-bottom: -5px; margin-right: -5px;">
                      <ul class="el-scrollbar__view el-select-dropdown__list">
                        <li v-if="podOpt.length > 0" :class="{'is-disabled': ruleForm.pol == item.threeLetterCode}" @mousedown="polChange1(item)" v-for="(item,index) in podOpt" :key="index" class="el-select-dropdown__item">
                          <span>{{item.threeLetterCode}}</span>
                          <span style="margin-left: 5px;">{{item.name}}</span>
                        </li>
                        <li v-if="podOpt.length == 0" class="el-select-dropdown__item" style="color: #c0c4cc;">暂无数据</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </el-form-item>
            </div>
            <div>
              <el-form-item prop="airCompanyCode" label="航司代码">
                <!-- <el-select v-model="ruleForm.airCompanyCode" placeholder="请输入航司二字码" :remote-method="companyMethod" :loading="loading" clearable filterable remote reserve-keyword>
                  <el-option
                    v-for="item in airCompanyCodeOpt"
                    :key="item.twoLetterCode"
                    :value="item.twoLetterCode">
                      <span>{{item.twoLetterCode}}</span>
                      <span style="margin-left: 5px;">{{item.name}}</span>
                  </el-option>
                </el-select> -->
                <el-input v-model="ruleForm.airCompanyCode" @input="companyMethod" @focus="polClick(3,true)" @blur="polClick(3,false)" size="medium" placeholder="请输入航司二字码" style="width: 216px;"></el-input>
                <div v-show="isAirCompanyCode" class="el-select-dropdown el-popper" style="min-width: 216px;">
                  <div class="el-scrollbar" style="">
                    <div class="el-select-dropdown__wrap el-scrollbar__wrap" style="margin-bottom: -5px; margin-right: -5px;">
                      <ul class="el-scrollbar__view el-select-dropdown__list">
                        <li v-if="airCompanyCodeOpt.length > 0" @mousedown="polChange2(item)" v-for="(item,index) in airCompanyCodeOpt" :key="index" class="el-select-dropdown__item">
                          <span>{{item.twoLetterCode}}</span>
                          <span style="margin-left: 5px;">{{item.name}}</span>
                        </li>
                        <li v-if="airCompanyCodeOpt.length == 0" class="el-select-dropdown__item" style="color: #c0c4cc;">暂无数据</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </el-form-item>
              <el-form-item prop="shortDuration" label="时效">
                <el-col style="width: 98px;">
                  <el-input v-model="ruleForm.shortDuration" onkeyup="value=value.replace(/[^\d]/g, '')" size="medium" placeholder="起始天数"></el-input>
                </el-col>
                <el-col style="text-align: center;width: 20px;">-</el-col>
                <el-col style="width: 98px;">
                  <el-input v-model="ruleForm.longDuration" onkeyup="value=value.replace(/[^\d]/g, '')" size="medium" placeholder="结束天数"></el-input>
                </el-col>
              </el-form-item>
            </div>
            <div>
              <el-form-item prop="status" label="航线状态">
                <el-switch v-model="ruleForm.status" active-text="上架" inactive-text="下架"></el-switch>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="备注">
                <el-input v-model="ruleForm.remark" style="width: 596px;" placeholder="请输入备注(最多输入300字符)" type="textarea"
                  maxlength="300" show-word-limit></el-input>
              </el-form-item>
            </div>
            <div style="font-size: 18px;font-weight: 100;margin-bottom: 10px;padding-left: 20px;">航线进程</div>
            <div>
              <el-form-item required label="航线路径">
                <div style="display: flex;">
                  <div v-for="(item,index) in fullLeg" :key="index">
                    <el-col style="width: 102px;">
                      <!-- <el-select :disabled="index == 0 ? true : false" @change="airportChange" @focus="airportEcheckClick" v-model="item.airportName" placeholder="三字码" :remote-method="airportMethod" :loading="loading" filterable remote reserve-keyword>
                        <el-option
                          v-for="item in airportOpt"
                          :key="item.threeLetterCode"
                          :disabled="airportEcheckArr.indexOf(item.threeLetterCode) > -1"
                          :value="item.threeLetterCode">
                            <span>{{item.threeLetterCode}}</span>
                            <span style="margin-left: 5px;">{{item.name}}</span>
                        </el-option>
                      </el-select> -->
                      <el-input :disabled="index == 0 ? true : false" v-model="item.airportName" @input="airportMethod" @focus="airportEcheckClick(true,index,item.airportName)" @blur="airportEcheckClick(false,index)" size="medium" placeholder="三字码"></el-input>
                      <div v-if="index != 0 && index == airportNameIndex" class="el-select-dropdown el-popper" style="min-width: 216px;">
                        <div class="el-scrollbar" style="">
                          <div class="el-select-dropdown__wrap el-scrollbar__wrap" style="margin-bottom: -5px; margin-right: -5px;">
                            <ul class="el-scrollbar__view el-select-dropdown__list">
                              <li v-if="airportOpt.length > 0" :class="{'is-disabled': airportEcheckArr.indexOf(item.threeLetterCode) > -1}" @mousedown="polChange3(item,index)" v-for="(item,chidlerIndex) in airportOpt" :key="chidlerIndex" class="el-select-dropdown__item">
                                <span>{{item.threeLetterCode}}</span>
                                <span style="margin-left: 5px;">{{item.name}}</span>
                              </li>
                              <li v-if="airportOpt.length == 0" class="el-select-dropdown__item" style="color: #c0c4cc;">暂无数据</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </el-col>
                    <el-col v-if="index != (fullLeg.length-1)" style="text-align: center;width: 20px;">-</el-col>
                  </div>
                  <el-button @click="airportClick" style="height: 36px;line-height: 36px;padding: 0;margin-left: 10px;"
                    type="primary">添加路径</el-button>
                </div>
              </el-form-item>
            </div>
            <div v-for="(parentItem,index) in airportTableArr" :key="index" class="route-module">
              <img @click="delTableClick(index)" v-if="index != 0" class="close-img" src="../../assets/gaungbi.png" />
              <el-form :label-position="labelPosition" :inline="true" label-width="150px" size="small" class="demo-form-inline">
                <el-form-item required :label="'航程'+(index+1)">
                  <el-col style="width: 102px;">
                    <el-input v-model="parentItem.startRouteName" :disabled="true"></el-input>
                  </el-col>
                  <el-col style="text-align: center;width: 20px;">-</el-col>
                  <el-col style="width: 102px;">
                    <el-input v-model="parentItem.endRouteName" :disabled="true"></el-input>
                  </el-col>
                </el-form-item>
              </el-form>
              <!-- 航班信息 -->
              <div class="flight-template">
                <div class="flight-template-ul-header">
                  <div class="flight-template-li" style="flex: 0 0 10%;text-align: center;">航班信息</div>
                  <div class="flight-template-li" style="flex: 0 0 20%;text-align: center;"><span style="color: #f56c6c;">*</span>运载方式</div>
                  <div class="flight-template-li" style="flex: 0 0 20%;text-align: center;"><span v-if="index == 0" style="color: #f56c6c;">*</span>航班号/卡车号</div>
                  <div class="flight-template-li" style="flex: 0 0 20%;text-align: center;">起飞时间(ETD)</div>
                  <div class="flight-template-li" style="flex: 0 0 20%;text-align: center;">到达时间(ETA)</div>
                  <div class="flight-template-li" style="flex: 0 0 10%;text-align: center;">操作</div>
                </div>
                <div v-for="(childerItem,childerIndex) in parentItem.childerTable" :key="childerIndex"
                  class="flight-template-ul-content">
                  <div class="flight-template-li" style="flex: 0 0 10%;"></div>
                  <div class="flight-template-li" style="flex: 0 0 20%;">
                    <el-select v-model="childerItem.vehicleType" @focus="vehicleFocus(index,childerIndex)" size="small" clearable placeholder="请选择" style="width: 80%;">
                      <el-option
                        v-for="item in airportOptions"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="flight-template-li" style="flex: 0 0 20%;">
                    <el-input v-model="childerItem.vehicleId" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')" clearable placeholder="请输入" size="small" style="width: 80%;">
                    </el-input>
                  </div>
                  <div class="flight-template-li" style="flex: 0 0 20%;">
                    <el-time-picker v-model="childerItem.etd" value-format="HH:mm" format="HH:mm" size="small" clearable style="width: 80%;" placeholder="选择时间"></el-time-picker>
                  </div>
                  <div class="flight-template-li" style="flex: 0 0 20%;">
                    <el-time-picker v-model="childerItem.eta" value-format="HH:mm" format="HH:mm" size="small" clearable style="width: 80%;" placeholder="选择时间"></el-time-picker>
                  </div>
                  <div class="flight-template-li" size="small" style="flex: 0 0 10%;">
                    <a v-if="parentItem.childerTable.length != 10" @click="addChilder(index)" style="font-size: 18px;"><i class="el-icon-circle-plus-outline"></i></a>
                    <a @click="delChilder(index,childerIndex)" style="font-size: 18px;" :style="{visibility: childerIndex == 0 && parentItem.childerTable.length == 1 ? 'hidden' : 'visible'}"><i class="el-icon-delete"></i></a>
                  </div>
                </div>
              </div>
            </div>
            <div class="rest-style">
              <el-form-item label=" " label-width="150px">
                <el-button style="height: 36px;line-height: 36px;padding: 0;" type="primary" @click="submitForm('ruleForm')">保存</el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="航线报价">
          <el-form :label-position="labelPosition" :inline="true" label-width="120px" size="medium" class="demo-form-inline">
            <div v-for="(item,index) in airlineAgent" :key="index" class="route-module" style="width: 95%;margin: 0 auto;margin-bottom: 20px;">
              <img @click="delTableClick1(index,item.id)" v-if="airlineAgent.length > 1" class="close-img" src="../../assets/gaungbi.png" />
              <!-- <div>
                <el-form-item prop="name" label="航线名称">
                  <el-input placeholder="请输入航线名称" v-model="item.name" style="width: 220px;"></el-input>
                </el-form-item>
              </div> -->
              <div>
                <el-form-item required label="代理公司">
                  <el-select v-model="item.agentId" @change="agentChang" clearable placeholder="请输入代理公司" :remote-method="agentMethod" :loading="loading" filterable remote reserve-keyword style="width: 220px;">
                    <el-option
                      v-for="item in agentOpt"
                      :key="item.value"
                      :disabled="checkDaili.indexOf(item.id) > -1 ? true : false"
                      :label="item.agentName"
                      :value="item.id + '#' + item.agentName">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div>
                <el-form-item required label="班期">
                  <el-select @change="dowsChange(index)" v-model="item.dows" multiple placeholder="请选择班期" clearable style="width: 468px;">
                    <el-option
                      v-for="item in dowsOpt"
                      :key="item.day"
                      :label="item.day"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div>
                <el-form-item label="杂费">
                  <el-col style="width: 220px;">
                    <el-select v-model="item.incidentalName" placeholder="请选择杂费名称" clearable style="width: 220px;">
                      <el-option
                        v-for="itemOpt in otherFeesOpt"
                        :key="itemOpt.feesName"
                        :label="itemOpt.feesName"
                        :disabled="item.otherFeesArr.indexOf(itemOpt.feesName) > -1"
                        :value="itemOpt.feesName">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col style="text-align: center;width: 30px;">-</el-col>
                  <el-col style="width: 220px;">
                    <el-input v-model="item.incidentalPrice" placeholder="请输入杂费金额" style="width: 220px;"></el-input>
                  </el-col>
                  <el-col style="text-align: center;width: 120px;margin-left: 20px;">
                    <el-button @click="addFeesClick(index)" type="primary" size="medium">添加</el-button>
                  </el-col>
                </el-form-item>
              </div>
              <div v-if="item.otherFees.length > 0">
               <el-form-item label=" ">
                  <el-tag v-for="(tagItem,tagIndex) in item.otherFees" :key="tagIndex" @close="otherFeesClose(index,tagIndex)" type="success" closable style="margin-right: 5px;">{{tagItem.feesName}} ￥{{tagItem.fees}}</el-tag>
                </el-form-item>
              </div>
              <div v-for="(listItem,listIndex) in item.ratesList" :key="listIndex" style="padding-bottom: 20px;">
                <div style="position: relative;">
                  <el-form-item required label="代理报价">
                    <el-checkbox-group v-model="listItem.cargoType">
                      <el-checkbox :disabled="!(item.ratesList.length != 2) && (listItem.cargoType.length != 2)" v-for="(optItem,optIndex) in cargoTypeOpt" :key="optIndex" :label="optItem.value">{{optItem.name}}</el-checkbox>
                    </el-checkbox-group>
                    <img v-if="!(item.ratesList.length != 2) && (listItem.cargoType.length != 2)" @click="delTableClickImg(index,listIndex)" class="close-img" src="../../assets/gaungbi.png" style="position: absolute;top: 0;right: -50px;" />
                  </el-form-item>
                </div>
                <div>
                  <el-form-item label=" ">
                    <el-col style="width: 220px;">
                      <el-input v-model="listItem.vw" placeholder="请输入比重值" style="width: 220px;"></el-input>
                    </el-col>
                    <el-col style="text-align: center;width: 120px;margin-left: 20px;">
                      <el-button v-if="listItem.tableData.length != 10" @click="addAirlineVw(index,listIndex)" type="primary" size="medium">添加</el-button>
                    </el-col>
                  </el-form-item>
                </div>
                <!-- 航班信息 -->
                <div class="flight-template" style="margin-left: 0;width: 100%;">
                  <div class="flight-template-ul-header">
                    <div class="flight-template-li" style="flex: 0 0 10%;text-align: center;">比重(体积:重量)</div>
                    <div class="flight-template-li" style="flex: 0 0 12%;text-align: center;">M(最低收费)</div>
                    <div class="flight-template-li" style="flex: 0 0 12%;text-align: center;">N(小货价)</div>
                    <div class="flight-template-li" style="flex: 0 0 12%;text-align: center;">45KG+</div>
                    <div class="flight-template-li" style="flex: 0 0 12%;text-align: center;">100KG+</div>
                    <div class="flight-template-li" style="flex: 0 0 12%;text-align: center;">300KG+</div>
                    <div class="flight-template-li" style="flex: 0 0 12%;text-align: center;">500KG+</div>
                    <div class="flight-template-li" style="flex: 0 0 12%;text-align: center;">1000KG+</div>
                    <div class="flight-template-li" style="flex: 0 0 6%;text-align: center;">操作</div>
                  </div>
                  <div v-for="(childerItem,childerIndex) in listItem.tableData" :key="childerIndex" class="flight-template-ul-content">
                    <div class="flight-template-li" style="flex: 0 0 10%;">
                      <el-input :value="'1:'+childerItem.vw" :disabled="true" size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 12%;">
                      <el-input onkeyup="value=value.replace(/[^\d\.\/]/ig,'')" v-model="childerItem.ratesLevel0" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 12%;">
                      <el-input onkeyup="value=value.replace(/[^\d\.\/]/ig,'')" v-model="childerItem.ratesN" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 12%;">
                      <el-input onkeyup="value=value.replace(/[^\d\.\/]/ig,'')" v-model="childerItem.ratesLevel1" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 12%;">
                      <el-input onkeyup="value=value.replace(/[^\d\.\/]/ig,'')" v-model="childerItem.ratesLevel2" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 12%;">
                      <el-input onkeyup="value=value.replace(/[^\d\.\/]/ig,'')" v-model="childerItem.ratesLevel3" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 12%;">
                      <el-input onkeyup="value=value.replace(/[^\d\.\/]/ig,'')" v-model="childerItem.ratesLevel4" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 12%;">
                      <el-input onkeyup="value=value.replace(/[^\d\.\/]/ig,'')" v-model="childerItem.ratesLevel5" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" size="small" style="flex: 0 0 6%;">
                      <a @click="delChilder1(index,listIndex,childerIndex)" style="font-size: 18px;"><i class="el-icon-delete"></i></a>
                    </div>
                  </div>
                </div>
                <div class="rest-style" style="margin-top: 20px;">
                  <el-form-item label=" ">
                    <el-button v-if="(item.ratesList.length != 2) && (listItem.cargoType.length != 2)" @click="addCargoType(index,listIndex)" style="height: 36px;line-height: 36px;padding: 0;" type="primary">设置{{listItem.cargoType.toString() == '2' ? '散货价' : '托盘价'}}</el-button>
                    <el-button v-if="listIndex == (item.ratesList.length-1)" @click="submitData(index)" style="height: 36px;line-height: 36px;padding: 0;" type="primary" >保存</el-button>
                  </el-form-item>

                </div>
              </div>
            </div>
            <div class="rest-style" style="padding-left: 20px;margin-top: 20px;">
              <el-form-item label=" ">
                <el-button @click="addAirlineAgent" style="height: 36px;line-height: 36px;padding: 0;" type="primary" >添加代理</el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        id: '',
        labelPosition: 'right',
        //航线信息
        continent: '',
        ruleForm: {
          pol: '',
          pod: '',
          airCompanyCode: '',
          shortDuration: '',
          longDuration: '',
          status: true,
          remark: ''
        },
        isPol: false,
        isPod: false,
        isAirCompanyCode: false,
        airportNameIndex: 0,
        rules: {
          pol: [{required: true, message: '请输入起运港机场三字码', trigger: 'change'}],
          pod: [{ required: true, message: '请输入目的港机场三字码', trigger: 'change'}],
          airCompanyCode: [{required: true, message: '请输入起航司二字码', trigger: 'change'}],
          shortDuration: [{required: true, message: '起始天数', trigger: 'change'}],
          status: [{required: true, message: '请选择航线', trigger: 'change'}]
        },
        loading: false,
        polOpt: [],
        podOpt: [],
        airCompanyCodeOpt: [],
        airportOpt: [],
        airportEcheckArr: [],
        agentOpt: [],
        //航线进程
        fullLeg: [],
        airportTableArr: [
          {
            voyage_no: '',
            startRouteName: '',
            endRouteName: '',
            checkBox: [],
            childerTable: [{
              vehicleType: '',
              vehicleId: '',
              etd: '',
              eta: ''
            }]
          }
        ],
        airportOptions: [{
            name: '宽体飞机'
          },
          {
            name: '窄体飞机'
          },
          {
            name: '货车'
          },
          {
            name: '卡车'
          }
        ],
        //航线价格
        cargoTypeOpt: [
          {
            name: '散货价',
            value: '1'
          },
          {
            name: '托盘价',
            value: '2'
          }
        ],
        otherFeesOpt: [
          {
            feesName: '制单费'
          },
          {
            feesName: '信息费'
          },
          {
            feesName: '运抵费'
          },
          {
            feesName: '其他费用'
          }
        ],
        dowsOpt: [
          {
            day: 'D1',
            value: '1'
          },
          {
            day: 'D2',
            value: '2'
          },
          {
            day: 'D3',
            value: '3'
          },
          {
            day: 'D4',
            value: '4'
          },
          {
            day: 'D5',
            value: '5'
          },
          {
            day: 'D6',
            value: '6'
          },
          {
            day: 'D7',
            value: '7'
          }
        ],
        airlineAgent: [
          {
            name: '',
            agentId: '',
            agentName: '',
            dows: [],
            incidentalName: '',
            incidentalPrice: '',
            otherFees: [],
            otherFeesArr: [],
            ratesList: [
              {
                cargoType: ['1'],
                vw: '',
                tableData: [
                  // {
                    // vw: '',
                    // vwPro: '',
                    // cargoType: '',
                    // ratesN: '',
                    // ratesLevel0: '',
                    // ratesLevel1: '',
                    // ratesLevel2: '',
                    // ratesLevel3: '',
                    // ratesLevel4: '',
                    // ratesLevel5: '',
                  // }
                ]
              }
            ]
          }
        ],
        checkDaili: []
      }
    },
    mounted() {
      this.id = this.$route.query.id
      this.initAirportSearchByPage()
      this.initCompanySearchByPage()
      this.initAgentList()
      this.initAirlineDetail()
      this.initAirlineRatesDetail()
    },
    methods: {
      //班期排序
      dowsChange(index) {
        this.airlineAgent[index].dows.sort()
      },

      //获取航线信息详情
      initAirlineDetail() {
        this.$http.get(this.$service.airlineDetail+'?id='+this.id).then((data) => {
          if(data.code == 200){
            var data = data.data
            this.ruleForm.pol = data.pol
            this.ruleForm.pod = data.pod
            this.continent = data.continent
            this.ruleForm.airCompanyCode = data.airCompanyCode
            this.ruleForm.shortDuration = data.shortDuration
            this.ruleForm.longDuration = data.longDuration
            this.ruleForm.status = data.status == 0 ? true : false
            this.ruleForm.remark = data.remark
            var newFulleg = data.fullLeg.split(',')
            for(var i = 0; i < newFulleg.length; i++){
              var json = {
                airportName: newFulleg[i]
              }
              this.fullLeg.push(json)
            }
            this.airportTableArr = JSON.parse(data.legDetail)
          }
        })
      },
      //航线报价信息详情
      initAirlineRatesDetail() {
        this.$http.get(this.$service.airlineRatesDetail+'?id='+this.id).then((data) => {
          if(data.code == 200){
            var data = data.data
            this.checkDaili = []
            this.airlineAgent = []
            for(var q = 0; q < data.length; q++){
              var json = {
                name: data[q].name,
                agentId: data[q].agentId+'#'+data[q].agentName,
                incidentalName: '',
                incidentalPrice: '',
                id: data[q].id
              }
              this.checkDaili.push(data[q].agentId)
              json.dows = data[q].dows.split(',')
              json.otherFees = JSON.parse(data[q].otherFees)
              json.otherFeesArr = []
              for(var w = 0; w < json.otherFees.length; w++){
                json.otherFeesArr.push(json.otherFees[w].feesName)
              }
              if(data[q].rates){
                json.ratesList = []
                for(var e = 0; e < data[q].rates.length; e++){
                  var childerJson = {}
                  childerJson.vw = ''
                  var cargoType = data[q].rates[e].cargoType.toString()
                  childerJson.cargoType = cargoType.split(',')
                  for(var z = 0; z < data[q].rates[e].ratesInsertDTOS.length; z++){
                    data[q].rates[e].ratesInsertDTOS[z].vw = data[q].rates[e].ratesInsertDTOS[z].vwr
                  }
                  childerJson.tableData = data[q].rates[e].ratesInsertDTOS
                  json.ratesList.push(childerJson)
                }
                this.airlineAgent.push(json)
              }else{
                json.ratesList = [
                  {
                    cargoType: ["1"],
                    vw: '',
                    tableData: []
                  }
                ]
                this.airlineAgent.push(json)
              }
            }
            // console.log(this.airlineAgent)
          }
        })
      },
      //保存
      submitData(index) {
        var newDataLine = JSON.parse(JSON.stringify(this.airlineAgent[index]))
        var newAgent = {}
        var ag = JSON.parse(JSON.stringify(newDataLine.agentId))
        newAgent.airlineId = this.id
        newAgent.agentId = ag.split('#')[0]
        newAgent.agentName = ag.split('#')[1]
        newAgent.dows = newDataLine.dows.toString()
        newAgent.id = newDataLine.id
        // newAgent.name = newDataLine.name
        newAgent.otherFees = JSON.stringify(newDataLine.otherFees)
        newAgent.ratesList = []
        for(var a = 0; a < newDataLine.ratesList.length; a++){
          var list = {}
          list.cargoType = newDataLine.ratesList[a].cargoType.toString()
          if(!list.cargoType){
            this.$message.error('当前代理报价必选')
            return
          }
          list.ratesInsertDTOS = []
          for(var z = 0; z < newDataLine.ratesList[a].tableData.length; z++){
            var childer = {
              vwr: newDataLine.ratesList[a].tableData[z].vw,
              ratesN: newDataLine.ratesList[a].tableData[z].ratesN,
              dows: newDataLine.dows.toString(),
              ratesLevel0: newDataLine.ratesList[a].tableData[z].ratesLevel0,
              ratesLevel1: newDataLine.ratesList[a].tableData[z].ratesLevel1,
              ratesLevel2: newDataLine.ratesList[a].tableData[z].ratesLevel2,
              ratesLevel3: newDataLine.ratesList[a].tableData[z].ratesLevel3,
              ratesLevel4: newDataLine.ratesList[a].tableData[z].ratesLevel4,
              ratesLevel5: newDataLine.ratesList[a].tableData[z].ratesLevel5,
            }
            list.ratesInsertDTOS.push(childer)
          }
          newAgent.ratesList.push(list)
        }

        this.$http.post(this.$service.airlineSaveCascade,newAgent).then((data) => {
          if(data.code == 200){
            this.$message.success('航线报价保存成功')
            // this.$router.push('/routeManagement/routeManage')
            this.initAirlineRatesDetail()
          }else{
            this.$message.error(data.message)
          }
        })
      },
      //起始港三字码
      initAirportSearchByPage(keyWord,type) {
        if(!keyWord){
          keyWord = ''
        }
        this.$http.get(this.$service.airportSearchByPage+'?keyWord='+keyWord).then((data) => {
          this.loading = false
          if(data.code == 200){
            if(type == '起始港'){
              this.polOpt = data.data.records
            }else if(type == '目的港') {
              this.podOpt = data.data.records
            }else if(type == '航线'){
              this.airportOpt = data.data.records
            }else{
              this.polOpt = data.data.records
              this.podOpt = data.data.records
              this.airportOpt = data.data.records
            }
          }
        })
      },
      polMethod(keyWord) {
        this.loading = true
        this.initAirportSearchByPage(keyWord,'起始港')
      },
      polChange(item) {
        if(item.threeLetterCode == this.ruleForm.pod){
          return
        }
        this.ruleForm.pol = item.threeLetterCode
        this.fullLeg[0].airportName = item.threeLetterCode
        this.airportTableArr[0].startRouteName = item.threeLetterCode
      },
      polChange1(item) {
        if(item.threeLetterCode == this.ruleForm.pol){
          return
        }
        this.continent = item.continent
        this.ruleForm.pod = item.threeLetterCode
      },
      polChange2(item) {
        this.ruleForm.airCompanyCode = item.twoLetterCode
      },
      polChange3(item,index){
        if(this.airportEcheckArr.indexOf(item.threeLetterCode) > -1){
          return
        }
        this.fullLeg[index].airportName = item.threeLetterCode
        this.airportNameIndex = 0
        for(var i = 0; i < this.fullLeg.length; i++){
          if(i < (this.fullLeg.length - 1)){
            this.airportTableArr[i].startRouteName = this.fullLeg[i].airportName
            this.airportTableArr[i].endRouteName = this.fullLeg[i+1].airportName
          }
        }
      },
      polClick(type,is) {
        if(type == '1'){
          this.isPol = is
        }else if(type == '2'){
          this.isPod = is
        }else if(type == '3'){
          this.isAirCompanyCode = is
        }
      },
      podMethod(keyWord) {
        this.loading = true
        this.initAirportSearchByPage(keyWord,'目的港')
      },
      //航线路径
      airportMethod(keyWord) {
        this.loading = true
        this.initAirportSearchByPage(keyWord,'航线')
        this.airportEcheckArr = []
        for(var i = 0; i < this.fullLeg.length; i++){
          this.airportEcheckArr.push(this.fullLeg[i].airportName)
        }
      },
      airportEcheckClick(is,index,item) {
        if(is){
          this.initAirportSearchByPage(item,'航线')
          this.airportNameIndex = index
          this.airportEcheckArr = []
          for(var i = 0; i < this.fullLeg.length; i++){
            this.airportEcheckArr.push(this.fullLeg[i].airportName)
          }
        }else{
          this.airportNameIndex = 0
        }
      },
      airportChange(e) {
        for(var i = 0; i < this.fullLeg.length; i++){
          if(i < (this.fullLeg.length - 1)){
            this.airportTableArr[i].startRouteName = this.fullLeg[i].airportName
            this.airportTableArr[i].endRouteName = this.fullLeg[i+1].airportName
          }
        }
      },
      vehicleFocus(index,childerIndex) {
        var table = this.airportTableArr[index].childerTable
        this.airportTableArr[index].checkBox = []
        for(var i = 0; i < table.length; i++){
          this.airportTableArr[index].checkBox.push(table[i].vehicleType)
        }
      },
      //航司公司
      initCompanySearchByPage(keyWord) {
        if(!keyWord){
          keyWord = ''
        }
        this.$http.get(this.$service.companySearchByPage+'?keyWord='+keyWord).then((data) => {
          this.loading = false
          if(data.code == 200){
            this.airCompanyCodeOpt = data.data.records
          }
        })
      },
      companyMethod(keyWord) {
        this.initCompanySearchByPage(keyWord)
      },
      //添加航线路径
      airportClick() {
        var json = {
          airportName: ''
        }
        this.fullLeg.push(json)
        var jsonArr = {
          voyage_no: '',
          startRouteName: '',
          endRouteName: '',
          checkBox: [],
          childerTable: [{
            vehicleType: '',
            vehicleId: '',
            etd: '',
            eta: ''
          }]
        }
        this.airportTableArr.push(jsonArr)
      },
      //添加航班信息
      addChilder(index) {
        var json = {
          vehicleType: '',
          vehicleId: '',
          etd: '',
          eta: ''
        }
        this.airportTableArr[index].childerTable.push(json)
      },
      //删除航班信息
      delChilder(index, childerIndex) {
        this.airportTableArr[index].childerTable.splice(childerIndex, 1)
      },
      //删除代理报价
      delChilder1(index, listIndex ,childerIndex) {
        this.airlineAgent[index].ratesList[listIndex].tableData.splice(childerIndex, 1)
      },
      delTableClick(index) {
        this.airportTableArr.splice(index,1)
        this.fullLeg.splice(index,1)
        for(var i = 0; i < this.fullLeg.length; i++){
          if(i < (this.fullLeg.length - 1)){
            this.airportTableArr[i].startRouteName = this.fullLeg[i].airportName
            this.airportTableArr[i].endRouteName = this.fullLeg[i+1].airportName
          }
        }
      },
      delTableClick1(index,id) {
        if(id){
          this.$confirm("确定删除这条代理报价?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.$http.delete(this.$service.airlineDeleteCascade+'?airlineId='+this.id+'&relationId='+id).then((data) => {
              if(data.code == 200){
                this.airlineAgent.splice(index,1)
                this.$message.success('删除航线报价成功')
              }else{
                this.$message.error('删除航线报价失败')
              }
            })
          }).catch(() => {
            console.log('取消')
          })
        }else{
          this.airlineAgent.splice(index,1)
        }
      },
      remoteMethod(query) {
        // console.log(query)
      },
      //添加杂费
      addFeesClick(index) {
        var reg = /(^[1-9][0-9]{0,5}$)|(^[0-9]{0,5}[\.][0-9]{1,2}$)/
        if(!this.airlineAgent[index].incidentalName){
          this.$message.error('请选择杂费名称')
          return
        }else if(!this.airlineAgent[index].incidentalPrice){
          this.$message.error('请输入杂费金额')
          return
        }else if(!reg.test(this.airlineAgent[index].incidentalPrice)){
          this.$message.error('金额范围是整数最大六位数，小数保留两位')
          return
        }

        var json = {
          feesName: this.airlineAgent[index].incidentalName,
          fees: this.airlineAgent[index].incidentalPrice
        }
        this.airlineAgent[index].otherFees.push(json)
        this.airlineAgent[index].otherFeesArr.push(json.feesName)
        this.airlineAgent[index].incidentalName = ''
        this.airlineAgent[index].incidentalPrice = ''
      },
      //删除杂费
      otherFeesClose(index,tagIndex) {
        this.airlineAgent[index].otherFees.splice(tagIndex,1)
        this.airlineAgent[index].otherFeesArr.splice(tagIndex,1)
      },
      //代理公司
      initAgentList(agentName) {
        if(!agentName){
          agentName = ''
        }
        var data = {
          agentName: agentName
        }
        this.$http.post(this.$service.agentList,data).then((data) => {
          this.loading = false
          if(data.code == 200){
            this.agentOpt = data.data.records
          }
        })
      },
      agentMethod(agentName) {
        this.initAgentList(agentName)
      },
      agentChang() {
        this.checkDaili = []
        for(var i = 0; i < this.airlineAgent.length; i++){
          var qa = JSON.parse(JSON.stringify(this.airlineAgent[i].agentId))
          if(qa.split('#')[0]){
            this.checkDaili.push(Number(qa.split('#')[0]))
          }
        }
      },
      //下一步
      submitForm(ruleForm) {
        this.$refs[ruleForm].validate((valid,object) => {
          if (valid) {
            var newFullLeg = []
            for(var i = 0; i < this.fullLeg.length; i++){
              if(!this.fullLeg[i].airportName){
                this.$message.error('请填写完整的航线路径')
                return
              }
              newFullLeg.push(this.fullLeg[i].airportName)
            }
            var tt = JSON.parse(JSON.stringify(this.ruleForm.pod))
            if(this.fullLeg[this.fullLeg.length-1].airportName != tt.split('#')[0]){
              this.$message.error('航线路径错误，目的港信息不匹配')
              return
            }
            for(var i = 0; i < this.airportTableArr.length; i++){
              for(var q = 0; q < this.airportTableArr[i].childerTable.length; q++){
                if(!this.airportTableArr[i].childerTable[q].vehicleType){
                  this.$message.error('航程'+(i+1)+'航班信息第'+(q+1)+'行运载方式未填写')
                  return
                }
                if(i == 0){
                  if(this.airportTableArr[i].childerTable[q].vehicleId == ''){
                    this.$message.error('航程'+(i+1)+'航班信息第'+(q+1)+'航班号/卡车号未填写')
                    return
                  }
                }
              }
            }

            var pod = JSON.parse(JSON.stringify(this.ruleForm.pod))
            var data = {
              id: this.id,
              pol: this.ruleForm.pol,
              pod: this.ruleForm.pod,
              continent: this.continent,
              planeType: this.airportTableArr[0].childerTable[0].vehicleType,
              airCompanyCode: this.ruleForm.airCompanyCode,
              shortDuration: this.ruleForm.shortDuration,
              longDuration: this.ruleForm.longDuration,
              status: this.ruleForm.status ? 0 : 1,
              fullLeg: newFullLeg.toString(),
              legCount: this.airportTableArr.length,
              legDetail: JSON.stringify(this.airportTableArr),
              remark: this.ruleForm.remark
            }
            this.$http.post(this.$service.airlineUpdate,data).then(data => {
              if (data.code == 200) {
                this.$router.push('/routeManagement/routeManage')
                this.$message.success('航线信息保存成功')
              }else{
                this.$message.error(data.message)
              }
            })
          } else {
            setTimeout(()=>{
              var isError= document.getElementsByClassName("is-error");
              if(isError[0].querySelector('input')){
                isError[0].querySelector('input')
              }else if(isError[0].querySelector('textarea')){
                isError[0].querySelector('textarea').focus()
              }
            },100);
            return false;
          }
        })
      },
      //上一步
      activeClick() {
        this.active = 1
      },
      //添加代理
      addAirlineAgent() {
        var json = {
          id: '',
          name: '',
          agentId: '',
          agentName: '',
          dows: [],
          incidentalName: '',
          incidentalPrice: '',
          otherFees: [],
          otherFeesArr: [],
          ratesList: [
            {
              cargoType: ['1'],
              vw: '',
              tableData: []
            }
          ]
        }
        this.airlineAgent.push(json)
      },
      //添加比重
      addAirlineVw(index,listIndex) {
        if(!this.airlineAgent[index].ratesList[listIndex].vw){
          this.$message.error('请输入比重值')
          return
        }else if(!(/(^[1-9]\d*$)/.test(this.airlineAgent[index].ratesList[listIndex].vw))){
          this.$message.error('只能输入正整数')
          return
        }
        for(var i = 0; i < this.airlineAgent[index].ratesList[listIndex].tableData.length; i++){
          if(this.airlineAgent[index].ratesList[listIndex].tableData[i].vw == this.airlineAgent[index].ratesList[listIndex].vw){
            this.$message.error('比重已存在，请重新输入')
            return
          }
        }

        var json = {
          vw: Number(this.airlineAgent[index].ratesList[listIndex].vw),
          vwPro: '1:'+this.airlineAgent[index].ratesList[listIndex].vw,
          cargoType: '',
          ratesN: 0,
          ratesLevel0: 0,
          ratesLevel1: 0,
          ratesLevel2: 0,
          ratesLevel3: 0,
          ratesLevel4: 0,
          ratesLevel5: 0,
        }
        this.airlineAgent[index].ratesList[listIndex].tableData.push(json)
        this.airlineAgent[index].ratesList[listIndex].vw = ''
        this.sortByKey(this.airlineAgent[index].ratesList[listIndex].tableData,'vw')
        this.airlineAgent[index].ratesList[listIndex].tableData = this.unique(this.airlineAgent[index].ratesList[listIndex].tableData)
      },
      //数组对象排序
      sortByKey(array,key) {
        return array.sort(function(a,b) {
          var x = Number(a[key]);
          var y = Number(b[key]);
          return ((x>y) ? ((x<y) ? 1 : 0) : -1);
        })
      },
      //数组去重
      unique(arr) {
        const res = new Map();
        return arr.filter((a) => !res.has(a.vw) && res.set(a.vw, 1))
      },
      //删除代理报价
      delTableClickImg(index,listIndex) {
        this.airlineAgent[index].ratesList.splice(listIndex,1)
      },
      //添加代理报价
      addCargoType(index,listIndex){
        var num = ''
        if(this.airlineAgent[index].ratesList[0].cargoType[0] == '1'){
          num = '2'
        }else{
          num = '1'
        }
        var json = {
          cargoType: [num],
          vw: '',
          tableData: []
        }
        this.airlineAgent[index].ratesList.push(json)
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
