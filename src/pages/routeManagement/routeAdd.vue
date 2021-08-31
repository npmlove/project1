<template>
  <div class="content-wrapper">
    <div class="content">
      <el-steps class="stpes-class" :active="active" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="航线价格"></el-step>
      </el-steps>

      <!-- 基本信息 -->
      <el-form v-show="active == 1" :model="ruleForm" ref="ruleForm" :rules="rules" :label-position="labelPosition" :inline="true" label-width="150px" size="medium" class="demo-form-inline">
        <div style="font-size: 18px;font-weight: 100;margin-bottom: 10px;">航线信息</div>
        <div>
          <el-form-item prop="pol" label="起运港">
            <el-select v-model="ruleForm.pol" @change="polChange" placeholder="请输入机场三字码" :remote-method="polMethod" :loading="loading" clearable filterable remote reserve-keyword>
              <el-option
                v-for="(item,index) in polOpt"
                :disabled="ruleForm.pod == item.threeLetterCode"
                :key="item.threeLetterCode"
                :value="item.threeLetterCode">
                  <span>{{item.threeLetterCode}}</span>
                  <span style="margin-left: 5px;">{{item.name}}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="pod" label="目的港">
            <el-select v-model="ruleForm.pod" placeholder="请输入机场三字码" :remote-method="podMethod" :loading="loading" clearable filterable remote reserve-keyword>
              <el-option
                v-for="item in podOpt"
                :disabled="ruleForm.pol == item.threeLetterCode"
                :key="item.threeLetterCode"
                :value="item.threeLetterCode">
                  <span>{{item.threeLetterCode}}</span>
                  <span style="margin-left: 5px;">{{item.name}}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item prop="airCompanyCode" label="航司公司">
            <el-select v-model="ruleForm.airCompanyCode" placeholder="请输入航司二字码" :remote-method="companyMethod" :loading="loading" clearable filterable remote reserve-keyword>
              <el-option
                v-for="item in airCompanyCodeOpt"
                :key="item.twoLetterCode"
                :value="item.twoLetterCode">
                  <span>{{item.twoLetterCode}}</span>
                  <span style="margin-left: 5px;">{{item.name}}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="shortestPrescription" label="时效">
            <el-col style="width: 98px;">
              <el-input v-model="ruleForm.shortestPrescription" size="medium" placeholder="起始天数"></el-input>
            </el-col>
            <el-col style="text-align: center;width: 20px;">-</el-col>
            <el-col style="width: 98px;">
              <el-input v-model="ruleForm.longestPrescription" size="medium" placeholder="结束天数"></el-input>
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
        <div style="font-size: 18px;font-weight: 100;margin-bottom: 10px;">航线进程</div>
        <div>
          <el-form-item label="航线路径">
            <div style="display: flex;">
              <div v-for="(item,index) in fullLeg" :key="index">
                <el-col style="width: 102px;">
                  <el-select :disabled="index == 0 ? true : false" @change="airportChange" @focus="airportEcheckClick" v-model="item.airportName" placeholder="三字码" :remote-method="airportMethod" :loading="loading" filterable remote reserve-keyword>
                    <el-option
                      v-for="item in airportOpt"
                      :key="item.threeLetterCode"
                      :disabled="airportEcheckArr.indexOf(item.threeLetterCode) > -1"
                      :value="item.threeLetterCode">
                        <span>{{item.threeLetterCode}}</span>
                        <span style="margin-left: 5px;">{{item.name}}</span>
                    </el-option>
                  </el-select>
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
            <el-form-item required :label="'航线'+(index+1)">
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
              <div class="flight-template-li" style="flex: 0 0 20%;text-align: center;"><span style="color: #f56c6c;">*</span>航班号/卡车号</div>
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
                    :disabled="parentItem.checkBox.indexOf(item.name) > -1"
                    :value="item.name">
                  </el-option>
                </el-select>
              </div>
              <div class="flight-template-li" style="flex: 0 0 20%;">
                <el-input v-model="childerItem.vehicleId" clearable placeholder="请输入" size="small" style="width: 80%;">
                </el-input>
              </div>
              <div class="flight-template-li" style="flex: 0 0 20%;">
                <el-date-picker v-model="childerItem.etd" type="datetime" size="small"
                  value-format="yyyy-MM-dd HH:mm:ss" style="width: 80%;" placeholder="选择日期时间">
                </el-date-picker>
              </div>
              <div class="flight-template-li" style="flex: 0 0 20%;">
                <el-date-picker v-model="childerItem.eta" type="datetime" size="small"
                  value-format="yyyy-MM-dd HH:mm:ss" style="width: 80%;" placeholder="选择日期时间">
                </el-date-picker>
              </div>
              <div class="flight-template-li" size="small" style="flex: 0 0 10%;">
                <a @click="addChilder(index)" style="font-size: 18px;"><i class="el-icon-circle-plus-outline"></i></a>
                <a @click="delChilder(index,childerIndex)" style="font-size: 18px;"
                  :style="{visibility: childerIndex == 0 ? 'hidden' : 'visible'}"><i class="el-icon-delete"></i></a>
              </div>
            </div>
          </div>
        </div>
        <div class="rest-style">
          <el-form-item label=" " label-width="150px">
            <el-button style="height: 36px;line-height: 36px;padding: 0;" type="primary" @click="submitForm('ruleForm')">下一步</el-button>
          </el-form-item>
        </div>
      </el-form>

      <!-- 航线价格 -->
      <el-form v-show="active == 2" :label-position="labelPosition" :inline="true" label-width="150px" size="medium" class="demo-form-inline">
        <div v-for="(item,index) in airlineAgent" :key="index" class="route-module" style="margin-left: 0;width: 90%;padding-bottom: 0;">
          <img @click="delTableClick(index)" v-if="index != 0" class="close-img" src="../../assets/gaungbi.png" />
          <div>
            <el-form-item prop="name" label="航线名称">
              <el-input placeholder="请输入航线名称" v-model="item.name" style="width: 220px;"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item prop="agentId" label="代理公司">
              <el-select v-model="item.agentId" placeholder="请输入代理公司" :remote-method="agentMethod" :loading="loading" filterable remote reserve-keyword style="width: 220px;">
                <el-option
                  v-for="item in agentOpt"
                  :key="item.value"
                  :label="item.agentName"
                  :value="item.id + '#' + item.agentName">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="dows" label="班期">
              <el-select v-model="item.dows" multiple placeholder="请选择班期" clearable style="width: 220px;">
                <el-option
                  v-for="item in dowsOpt"
                  :key="item.day"
                  :label="item.day"
                  :value="item.day">
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
              <el-tag v-for="(tagItem,tagIndex) in item.otherFees" :key="tagIndex" @close="otherFeesClose(tagIndex)" type="success" closable style="margin-right: 5px;">{{tagItem.feesName}} ￥{{tagItem.fees}}</el-tag>
            </el-form-item>
          </div>
          <div v-for="(listItem,listIndex) in item.ratesList" :key="listIndex" style="padding-bottom: 20px;">
            <div>
              <el-form-item prop="cargoType" label="代理报价">
                <el-checkbox-group v-model="listItem.cargoType">
                  <el-checkbox v-for="(optItem,optIndex) in cargoTypeOpt" :key="optIndex" :label="optItem.value">{{optItem.name}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>
            <div>
              <el-form-item label=" ">
                <el-col style="width: 220px;">
                  <el-input v-model="listItem.vw" placeholder="请输入比重值" style="width: 220px;"></el-input>
                </el-col>
                <el-col style="text-align: center;width: 120px;margin-left: 20px;">
                  <el-button @click="addAirlineVw(index,listIndex)" type="primary" size="medium">添加</el-button>
                </el-col>
              </el-form-item>
            </div>
            <!-- 航班信息 -->
            <div class="flight-template">
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
                  <el-input v-model="childerItem.vwPro" :disabled="true" size="small" style="width: 80%;"></el-input>
                </div>
                <div class="flight-template-li" style="flex: 0 0 12%;">
                  <el-input v-model="childerItem.ratesN" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                </div>
                <div class="flight-template-li" style="flex: 0 0 12%;">
                  <el-input v-model="childerItem.ratesLevel0" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                </div>
                <div class="flight-template-li" style="flex: 0 0 12%;">
                  <el-input v-model="childerItem.ratesLevel1" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                </div>
                <div class="flight-template-li" style="flex: 0 0 12%;">
                  <el-input v-model="childerItem.ratesLevel2" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                </div>
                <div class="flight-template-li" style="flex: 0 0 12%;">
                  <el-input v-model="childerItem.ratesLevel3" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                </div>
                <div class="flight-template-li" style="flex: 0 0 12%;">
                  <el-input v-model="childerItem.ratesLevel4" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                </div>
                <div class="flight-template-li" style="flex: 0 0 12%;">
                  <el-input v-model="childerItem.ratesLevel5" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                </div>
                <div class="flight-template-li" size="small" style="flex: 0 0 6%;">
                  <a @click="delChilder(index,childerIndex)" style="font-size: 18px;"><i class="el-icon-delete"></i></a>
                </div>
              </div>
            </div>
            <div v-if="(item.ratesList.length != 2)" class="rest-style" style="margin-top: 20px;">
              <el-form-item label=" " label-width="150px">
                <el-button @click="addCargoType(index,listIndex)" style="height: 36px;line-height: 36px;padding: 0;" type="primary">添加代理报价</el-button>
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="rest-style" style="padding-left: 20px;">
          <el-form-item label=" " label-width="150px">
            <el-button @click="addAirlineAgent" style="height: 36px;line-height: 36px;padding: 0;" type="primary" >加添代理</el-button>
            <el-button @click="activeClick" style="height: 36px;line-height: 36px;padding: 0;" type="primary" >上一步</el-button>
            <el-button @click="submitData" style="height: 36px;line-height: 36px;padding: 0;" type="primary" >保存</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        active: 1,
        labelPosition: 'right',
        //航线信息
        ruleForm: {
          pol: '',
          pod: '',
          airCompanyCode: '',
          shortestPrescription: '',
          longestPrescription: '',
          status: true,
          remark: ''
        },
        rules: {
          pol: [{required: true, message: '请输入起运港机场三字码', trigger: 'change'}],
          pod: [{ required: true, message: '请输入目的港机场三字码', trigger: 'change'}],
          airCompanyCode: [{required: true, message: '请输入起航司二字码', trigger: 'change'}],
          shortestPrescription: [{required: true, message: '起始天数', trigger: 'change'}],
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
        fullLeg: [{
            airportName: '',
          },
          {
            airportName: '',
          }
        ],
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
            value: '0'
          },
          {
            name: '托盘价',
            value: '1'
          }
        ],
        otherFeesOpt: [
          {
            feesName: '报关费'
          },
          {
            feesName: '制单费'
          },
          {
            feesName: '信息费'
          },
          {
            feesName: '分单费'
          },
          {
            feesName: '其他费用'
          }
        ],
        dowsOpt: [
          {
            day: 'D1'
          },
          {
            day: 'D2'
          },
          {
            day: 'D3'
          },
          {
            day: 'D4'
          },
          {
            day: 'D5'
          },
          {
            day: 'D6'
          },
          {
            day: 'D7'
          }
        ],
        airlineAgent: [
          {
            agentId: '',
            agentName: '',
            dows: [],
            incidentalName: '',
            incidentalPrice: '',
            otherFees: [],
            otherFeesArr: [],
            ratesList: [
              {
                cargoType: ['0'],
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
        ]
      }
    },
    mounted() {
      this.initAirportSearchByPage()
      this.initCompanySearchByPage()
      this.initAgentList()
    },
    methods: {
      //保存
      submitData() {
        var newFullLeg = []
        for(var i = 0; i < this.fullLeg.length; i++){
          newFullLeg.push(this.fullLeg[i].feesName)
        }
        var newAgent = []
        for(var q = 0; q < this.airlineAgent.length; q++){
          var ag = JSON.parse(JSON.stringify(this.airlineAgent[q].agentId))
          var newJson = {
            agentId: ag.split('#')[0],
            agentName: ag.split('#')[1],
            name: this.airlineAgent[q].name,
            otherFees: JSON.stringify(this.airlineAgent[q].otherFees),
            dows: this.airlineAgent[q].dows.toString(),
            ratesList: []
          }
          for(var a = 0; a < this.airlineAgent[q].ratesList.length; a++){
            var list = {}
            list.cargoType = this.airlineAgent[q].ratesList[a].cargoType.toString()
            list.ratesInsertDTOS = []
            for(var z = 0; z < this.airlineAgent[q].ratesList[a].tableData.length; z++){
              var childer = {
                vw: this.airlineAgent[q].ratesList[a].tableData[z].vw,
                ratesN: this.airlineAgent[q].ratesList[a].tableData[z].ratesN,
                dows: this.airlineAgent[q].dows.toString(),
                ratesLevel0: this.airlineAgent[q].ratesList[a].tableData[z].ratesLevel0,
                ratesLevel1: this.airlineAgent[q].ratesList[a].tableData[z].ratesLevel1,
                ratesLevel2: this.airlineAgent[q].ratesList[a].tableData[z].ratesLevel2,
                ratesLevel3: this.airlineAgent[q].ratesList[a].tableData[z].ratesLevel3,
                ratesLevel4: this.airlineAgent[q].ratesList[a].tableData[z].ratesLevel4,
                ratesLevel5: this.airlineAgent[q].ratesList[a].tableData[z].ratesLevel5,
              }
              list.ratesInsertDTOS.push(childer)
            }
            newJson.ratesList.push(list)
          }
          newAgent.push(newJson)
        }
        var data = {
          pol: this.ruleForm.pol,
          pod: this.ruleForm.pod,
          airCompanyCode: this.ruleForm.airCompanyCode,
          shortestPrescription: this.ruleForm.shortestPrescription,
          longestPrescription: this.ruleForm.longestPrescription,
          status: this.ruleForm.status ? 0 : 1,
          fullLeg: newFullLeg.toString(),
          legCount: this.airportTableArr.length,
          legDetail: JSON.stringify(this.airportTableArr),
          airlineAgentInsertDTOS: newAgent
        }
        this.$http.post(this.$service.airlineSave,data).then((data) => {
          if(data.code == 200){

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
      polChange(e) {
        this.fullLeg[0].airportName = e
        this.airportTableArr[0].startRouteName = e
      },
      podMethod(keyWord) {
        this.loading = true
        this.initAirportSearchByPage(keyWord,'目的港')
      },
      //航线路径
      airportMethod(keyWord) {
        this.loading = true
        this.initAirportSearchByPage(keyWord,'航线')
      },
      airportEcheckClick() {
        this.airportEcheckArr = []
        for(var i = 0; i < this.fullLeg.length; i++){
          this.airportEcheckArr.push(this.fullLeg[i].airportName)
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
      delTableClick(index) {
        this.airportTableArr.splice(index,1)
        this.fullLeg.splice(index,1)
      },
      remoteMethod(query) {
        console.log(query)
      },
      //添加杂费
      addFeesClick(index) {
        if(!this.airlineAgent[index].incidentalName){
          this.$message.error('请选择杂费名称')
          return
        }else if(!this.airlineAgent[index].incidentalPrice){
          this.$message.error('请输入杂费金额')
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
      otherFeesClose(index) {
        this.airlineAgent[index].otherFees.splice(index,1)
        this.airlineAgent[index].otherFeesArr.splice(index,1)
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
      //下一步
      submitForm(ruleForm) {
        this.$refs[ruleForm].validate((valid,object) => {
          if (valid) {
            for(var i = 0; i < this.airportTableArr.length; i++){
              for(var q = 0; q < this.airportTableArr[i].childerTable.length; q++){
                if(!this.airportTableArr[i].childerTable[q].vehicleType){
                  this.$message.error('请选择运载方式')
                  return
                }else if(!this.airportTableArr[i].childerTable[q].vehicleId){
                  this.$message.error('请输入航班号/卡车号')
                  return
                }
              }
            }
            this.active = 2
          } else {
            setTimeout(()=>{
              var isError= document.getElementsByClassName("is-error");
              if(isError[0].querySelector('input')){
                isError[0].querySelector('input').focus()
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
          agentId: '',
          agentName: '',
          dows: [],
          incidentalName: '',
          incidentalPrice: '',
          otherFees: [],
          otherFeesArr: [],
          ratesList: [
            {
              cargoType: ['散货价'],
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
        var json = {
          vw: this.airlineAgent[index].ratesList[listIndex].vw,
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
      //添加代理报价
      addCargoType(index,listIndex){
        var json = {
          cargoType: [],
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
