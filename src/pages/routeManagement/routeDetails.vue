<template>
  <div class="content-wrapper">
    <div class="content">
      <el-tabs type="border-card">
        <el-tab-pane label="航线信息">
          <el-form :model="ruleForm" ref="ruleForm" :rules="rules" :label-position="labelPosition" :inline="true" label-width="150px" size="medium" class="demo-form-inline">
            <div style="font-size: 18px;font-weight: 100;margin-bottom: 10px;padding-left: 20px;">航线信息</div>
            <div>
              <el-form-item prop="pol" label="起运港">
                <el-input v-model="ruleForm.pol" :disabled="true" style="width: 217px;"></el-input>
              </el-form-item>
              <el-form-item prop="pod" label="目的港">
                <el-input v-model="ruleForm.pod" :disabled="true" style="width: 217px;"></el-input>
              </el-form-item>
            </div>
            <div>
              <el-form-item prop="airCompanyCode" label="航司公司">
                <el-input v-model="ruleForm.airCompanyCode" :disabled="true" style="width: 217px;"></el-input>
              </el-form-item>
              <el-form-item prop="shortestPrescription" label="时效">
                <el-col style="width: 98px;">
                  <el-input v-model="ruleForm.shortestPrescription" :disabled="true" size="medium" placeholder="起始天数"></el-input>
                </el-col>
                <el-col style="text-align: center;width: 20px;">-</el-col>
                <el-col style="width: 98px;">
                  <el-input v-model="ruleForm.longestPrescription" :disabled="true" size="medium" placeholder="结束天数"></el-input>
                </el-col>
              </el-form-item>
            </div>
            <div>
              <el-form-item prop="status" label="航线状态">
                <el-switch v-model="ruleForm.status" :disabled="true" active-text="上架" inactive-text="下架"></el-switch>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="备注">
                <el-input v-model="ruleForm.remark" :disabled="true" style="width: 596px;" placeholder="请输入备注(最多输入300字符)" type="textarea" maxlength="300" show-word-limit></el-input>
              </el-form-item>
            </div>
            <div style="font-size: 18px;font-weight: 100;margin-bottom: 10px;padding-left: 20px;">航线进程</div>
            <div>
              <el-form-item label="航线路径">
                <div style="display: flex;">
                  <div v-for="(item,index) in fullLeg" :key="index">
                    <el-col style="width: 102px;">
                      <el-input v-model="item.airportName" :disabled="true"></el-input>
                    </el-col>
                    <el-col v-if="index != (fullLeg.length-1)" style="text-align: center;width: 20px;">-</el-col>
                  </div>
                </div>
              </el-form-item>
            </div>
            <div v-for="(parentItem,index) in airportTableArr" :key="index" class="route-module">
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
                </div>
                <div v-for="(childerItem,childerIndex) in parentItem.childerTable" :key="childerIndex"
                  class="flight-template-ul-content">
                  <div class="flight-template-li" style="flex: 0 0 10%;"></div>
                  <div class="flight-template-li" style="flex: 0 0 20%;">
                    <el-select :disabled="true" v-model="childerItem.vehicleType" @focus="vehicleFocus(index,childerIndex)" size="small" clearable placeholder="请选择" style="width: 80%;">
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
                    <el-input :disabled="true" v-model="childerItem.vehicleId" clearable placeholder="请输入" size="small" style="width: 80%;">
                    </el-input>
                  </div>
                  <div class="flight-template-li" style="flex: 0 0 20%;">
                    <el-time-picker :disabled="true" v-model="childerItem.etd" value-format="HH:mm" format="HH:mm" size="small" clearable style="width: 80%;" placeholder="选择时间"></el-time-picker>
                  </div>
                  <div class="flight-template-li" style="flex: 0 0 20%;">
                    <el-time-picker :disabled="true" v-model="childerItem.eta" value-format="HH:mm" format="HH:mm" size="small" clearable style="width: 80%;" placeholder="选择时间"></el-time-picker>
                  </div>
                </div>
              </div>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="航线报价">
          <el-form :label-position="labelPosition" :inline="true" label-width="120px" size="medium" class="demo-form-inline">
            <div v-for="(item,index) in airlineAgent" :key="index" class="route-module" style="width: 95%;margin: 0 auto;margin-bottom: 20px;">
              <div>
                <el-form-item prop="name" label="航线名称">
                  <el-input :disabled="true" v-model="item.name" style="width: 220px;"></el-input>
                </el-form-item>
              </div>
              <div>
                <el-form-item prop="agentId" label="代理公司">
                  <el-input :disabled="true" v-model="item.agentId" style="width: 220px;"></el-input>
                </el-form-item>
                <el-form-item prop="dows" label="班期">
                  <el-select :disabled="true" v-model="item.dows" multiple placeholder="请选择班期" clearable style="width: 220px;">
                    <el-option
                      v-for="item in dowsOpt"
                      :key="item.day"
                      :label="item.day"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div v-if="item.otherFees.length > 0">
                <el-form-item label="杂费">
                  <el-tag v-for="(tagItem,tagIndex) in item.otherFees" :key="tagIndex" type="success" style="margin-right: 5px;">{{tagItem.feesName}} ￥{{tagItem.fees}}</el-tag>
                </el-form-item>
              </div>
              <div v-for="(listItem,listIndex) in item.ratesList" :key="listIndex" style="padding-bottom: 20px;">
                <div>
                  <el-form-item prop="cargoType" label="代理报价">
                    <el-checkbox-group v-model="listItem.cargoType">
                      <el-checkbox :disabled="true" v-for="(optItem,optIndex) in cargoTypeOpt" :key="optIndex" :label="optItem.value">{{optItem.name}}</el-checkbox>
                    </el-checkbox-group>
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
                  </div>
                  <div v-for="(childerItem,childerIndex) in listItem.tableData" :key="childerIndex" class="flight-template-ul-content">
                    <div class="flight-template-li" style="flex: 0 0 10%;">
                      <el-input :value="'1:'+childerItem.vwr" :disabled="true" size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 12%;">
                      <el-input v-model="childerItem.ratesN" :disabled="true" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 12%;">
                      <el-input v-model="childerItem.ratesLevel0" :disabled="true" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 12%;">
                      <el-input v-model="childerItem.ratesLevel1" :disabled="true" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 12%;">
                      <el-input v-model="childerItem.ratesLevel2" :disabled="true" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 12%;">
                      <el-input v-model="childerItem.ratesLevel3" :disabled="true" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 12%;">
                      <el-input v-model="childerItem.ratesLevel4" :disabled="true" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 12%;">
                      <el-input v-model="childerItem.ratesLevel5" :disabled="true" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                    </div>
                  </div>
                </div>
              </div>
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
        //航线进程
        fullLeg: [],
        airportTableArr: [],
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
        airlineAgent: []
      }
    },
    mounted() {
      this.id = this.$route.query.id
      this.initAirlineDetail()
      this.initAirlineRatesDetail()
    },
    methods: {
      //获取航线信息详情
      initAirlineDetail() {
        this.$http.get(this.$service.airlineDetail+'?id='+this.id).then((data) => {
          if(data.code == 200){
            var data = data.data
            this.ruleForm.pol = data.pol
            this.ruleForm.pod = data.pod
            this.ruleForm.airCompanyCode = data.airCompanyCode
            this.ruleForm.shortestPrescription = data.shortestPrescription
            this.ruleForm.longestPrescription = data.longestPrescription
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
            this.airlineAgent = []
            for(var q = 0; q < data.length; q++){
              var json = {
                name: data[q].name,
                agentId: data[q].agentName,
                incidentalName: '',
                incidentalPrice: ''
              }
              json.dows = data[q].dows.split(',')
              json.otherFees = JSON.parse(data[q].otherFees)
              json.otherFeesArr = []
              for(var w = 0; w < json.otherFees.length; w++){
                json.otherFeesArr.push(json.otherFees[w].feesName)
              }
              json.ratesList = []
              for(var e = 0; e < data[q].rates.length; e++){
                var childerJson = {}
                childerJson.vw = ''
                var cargoType = data[q].rates[e].cargoType.toString()
                childerJson.cargoType = cargoType.split(',')
                childerJson.tableData = data[q].rates[e].ratesInsertDTOS
                json.ratesList.push(childerJson)
              }
              this.airlineAgent.push(json)
            }
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
