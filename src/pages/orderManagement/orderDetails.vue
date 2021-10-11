<template>
  <div class="content-wrapper">
    <div class="content">
      <!-- 基本信息 -->
      <el-form :label-position="labelPosition" :inline="true" label-width="150px" size="medium" class="demo-form-inline">
        <div style="font-size: 18px;font-weight: 100;margin-bottom: 10px;">客户信息</div>
        <div>
          <el-form-item label="客户">
            <el-input value="苏州乐尚代理有限公司" :disabled="true" style="width: 596px;"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="订单号">
            <el-input value="16948476392" :disabled="true" style="width: 216px;"></el-input>
          </el-form-item>
          <el-form-item label="进仓编号">
            <el-input placeholder="请输入进仓编号" style="width: 216px;"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="运单号">
            <el-input placeholder="请输入运单号" style="width: 216px;"></el-input>
          </el-form-item>
          <el-form-item label="航线人员">
            <el-input v-model="ruleForm.pol" @input="polMethod" @focus="polClick(1,true)" @blur="polClick(1,false)" size="medium" placeholder="请输入航线人员" style="width: 216px;"></el-input>
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
        </div>
        <div>
          <el-form-item label="售前客服">
            <el-input v-model="ruleForm.pol" @input="polMethod" @focus="polClick(1,true)" @blur="polClick(1,false)" size="medium" placeholder="请输入售前客服" style="width: 216px;"></el-input>
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
          <el-form-item prop="pod" label="售中客服">
            <el-input v-model="ruleForm.pod" @input="podMethod" @focus="polClick(2,true)" @blur="polClick(2,false)" size="medium" placeholder="请输入售中客服" style="width: 216px;"></el-input>
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

        <div style="font-size: 18px;font-weight: 100;margin-bottom: 10px;">航线信息</div>
        <div>
          <el-form-item label="起运港">
            <el-input placeholder="请输入起运港"  style="width: 216px;"></el-input>
          </el-form-item>
          <el-form-item label="目的港">
            <el-input placeholder="请输入目的港" style="width: 216px;"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="航司">
            <el-input placeholder="请输入航司" style="width: 216px;"></el-input>
          </el-form-item>
          <el-form-item label="订舱单价">
            <el-input placeholder="请输入订舱单价" style="width: 216px;"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="航线路径">
            <el-col style="width: 98px;">
              <el-input placeholder="三字码"></el-input>
            </el-col>
            <el-col style="text-align: center;width: 20px;">-</el-col>
            <el-col style="width: 98px;">
              <el-input placeholder="三字码"></el-input>
            </el-col>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="分泡比例">
            <el-input placeholder="请输入分泡比例" style="width: 216px;"></el-input>
          </el-form-item>
          <el-form-item label="出发日期">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              style="width: 216px;"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="rest-style">
          <el-form-item label=" " label-width="150px">
            <el-button style="width: auto;">审核失败，制作推荐方案</el-button>
          </el-form-item>
        </div>

        <div v-for="(item,index) in airlineAgent" :key="index" class="route-module" style="margin-left: 0;width: 90%;padding-bottom: 0;">
          <img @click="delTableClick1(index)"  v-if="airlineAgent.length > 1" class="close-img" src="../../assets/gaungbi.png" />
          <div>
            <el-form-item label="起运港">
              <el-input v-model="ruleForm.pol" @input="polMethod" @focus="polClick(1,true)" @blur="polClick(1,false)" size="medium" placeholder="请输入起运港" style="width: 216px;"></el-input>
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
            <el-form-item label="目的港">
              <el-input v-model="ruleForm.pod" @input="podMethod" @focus="polClick(2,true)" @blur="polClick(2,false)" size="medium" placeholder="请输入目的港" style="width: 216px;"></el-input>
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
            <el-form-item label="航司">
              <el-input v-model="ruleForm.pol" @input="polMethod" @focus="polClick(1,true)" @blur="polClick(1,false)" size="medium" placeholder="请输入航司" style="width: 216px;"></el-input>
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
            <el-form-item label="代理公司">
              <el-input v-model="ruleForm.pod" @input="podMethod" @focus="polClick(2,true)" @blur="polClick(2,false)" size="medium" placeholder="请输入代理公司" style="width: 216px;"></el-input>
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
            <el-form-item label="出发日期">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                style="width: 216px;"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="分泡比例">
              <el-input v-model="ruleForm.pod" @input="podMethod" @focus="polClick(2,true)" @blur="polClick(2,false)" size="medium" placeholder="请输入分泡比例" style="width: 216px;"></el-input>
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
            <el-form-item label="订舱单价">
              <el-input placeholder="请输入订舱单价"  style="width: 216px;"></el-input>
            </el-form-item>
            <el-form-item label="航班号">
              <el-input placeholder="请输入航班号" style="width: 216px;"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="航线">
              <el-radio-group>
                <el-radio v-for="(optItem,optIndex) in cargoTypeOpt" :key="optIndex" :label="optItem.value">{{optItem.name}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="rest-style">
            <el-form-item label=" " label-width="150px">
              <el-button style="height: 36px;line-height: 36px;padding: 0;" type="primary" >添加方案</el-button>
            </el-form-item>
          </div>
        </div>

        <div style="font-size: 18px;font-weight: 100;margin-bottom: 10px;">货物信息</div>
        <div>
          <el-form-item label="货物品名">
            <el-input placeholder="请输入货物品名" style="width: 596px;"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="货物品类">
            <el-input v-model="ruleForm.pol" @input="polMethod" @focus="polClick(1,true)" @blur="polClick(1,false)" size="medium" placeholder="请输入货物品类" style="width: 216px;"></el-input>
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
          <el-form-item prop="pod" label="包装类型">
            <el-input v-model="ruleForm.pod" @input="podMethod" @focus="polClick(2,true)" @blur="polClick(2,false)" size="medium" placeholder="请输入包装类型" style="width: 216px;"></el-input>
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
          <el-form-item label="件数">
            <el-input placeholder="请输入件数" style="width: 216px;"></el-input>
          </el-form-item>
          <el-form-item label="体积">
            <el-input placeholder="请输入体积" style="width: 216px;"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="重量">
            <el-input placeholder="请输入重量" style="width: 216px;"></el-input>
          </el-form-item>
          <el-form-item label="比重">
            <el-input placeholder="请输入比重" style="width: 216px;"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="计费重">
            <el-input placeholder="请输入件数" style="width: 216px;"></el-input>
          </el-form-item>
        </div>
        <div style="font-size: 18px;font-weight: 100;margin-bottom: 10px;">账单信息-应收账单</div>
        <div v-for="(parentItem,index) in airportTableArr" :key="index"  class="route-module" style="margin-left: 0;width: 90%;padding-bottom: 0;">
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
              <div class="flight-template-li" style="flex: 0 0 10%;text-align: center;">人名币</div>
              <div class="flight-template-li" style="flex: 0 0 13%;text-align: center;">备注</div>
              <div class="flight-template-li" style="flex: 0 0 10%;text-align: center;">操作</div>
            </div>
            <div v-for="(childerItem,childerIndex) in parentItem.childerTable" :key="childerIndex" class="flight-template-ul-content">
              <div class="flight-template-li" style="flex: 0 0 5%;">{{childerIndex+1}}</div>
              <div class="flight-template-li" style="flex: 0 0 13%;">
                <el-select v-model="childerItem.vehicleType" @focus="vehicleFocus(index,childerIndex)" size="small" clearable placeholder="请选择" style="width: 80%;">
                  <el-option
                    v-for="item in airportOptions"
                    :key="item.name"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div class="flight-template-li" style="flex: 0 0 13%;">
                <el-input v-model="childerItem.vehicleId" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')" size="small" style="width: 80%;"></el-input>
              </div>
              <div class="flight-template-li" style="flex: 0 0 7%;">
                <el-input v-model="childerItem.vehicleId" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')" size="small" style="width: 80%;"></el-input>
              </div>
              <div class="flight-template-li" style="flex: 0 0 7%;">
                <el-input v-model="childerItem.vehicleId" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')" size="small" style="width: 80%;"></el-input>
              </div>
              <div class="flight-template-li" style="flex: 0 0 7%;">
                <el-input v-model="childerItem.vehicleId" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')" size="small" style="width: 80%;"></el-input>
              </div>
              <div class="flight-template-li" style="flex: 0 0 10%;">
                <el-input v-model="childerItem.vehicleId" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')" size="small" style="width: 80%;"></el-input>
              </div>
              <div class="flight-template-li" style="flex: 0 0 5%;">
                <el-input v-model="childerItem.vehicleId" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')" size="small" style="width: 80%;"></el-input>
              </div>
              <div class="flight-template-li" style="flex: 0 0 10%;">
                <el-input v-model="childerItem.vehicleId" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')" size="small" style="width: 80%;"></el-input>
              </div>
              <div class="flight-template-li" style="flex: 0 0 13%;">
                <el-input v-model="childerItem.vehicleId" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')" size="small" style="width: 80%;"></el-input>
              </div>
              <div class="flight-template-li" size="small" style="flex: 0 0 10%;">
                <a :style="{visibility: parentItem.childerTable.length > 9 ? 'hidden' : 'visible'}" @click="addChilder(index)" style="font-size: 18px;"><i class="el-icon-circle-plus-outline"></i></a>
                <a @click="delChilder(index,childerIndex)" style="font-size: 18px;" :style="{visibility: childerIndex == 0 && parentItem.childerTable.length == 1 ? 'hidden' : 'visible'}"><i class="el-icon-delete"></i></a>
              </div>
            </div>
          </div>
          <div style="margin-top: 20px;">
            <el-form-item label="账单合计">
              <div>￥7000+$600</div>
            </el-form-item>
            <el-form-item label="人民币合计">
              <div>￥7000+$600</div>
            </el-form-item>
            <el-form-item label="结算方式">
              <el-select clearable placeholder="请选择结算方式">
                <el-option
                  v-for="item in airportOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div style="font-size: 18px;font-weight: 100;margin-bottom: 10px;">账单信息-应付账单</div>
        <div v-for="(parentItem,index) in airportTableArr" :key="index"  class="route-module" style="margin-left: 0;width: 90%;padding-bottom: 0;">
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
              <div class="flight-template-li" style="flex: 0 0 10%;text-align: center;">人名币</div>
              <div class="flight-template-li" style="flex: 0 0 13%;text-align: center;">备注</div>
              <div class="flight-template-li" style="flex: 0 0 10%;text-align: center;">操作</div>
            </div>
            <div v-for="(childerItem,childerIndex) in parentItem.childerTable" :key="childerIndex" class="flight-template-ul-content">
              <div class="flight-template-li" style="flex: 0 0 5%;">{{childerIndex+1}}</div>
              <div class="flight-template-li" style="flex: 0 0 13%;">
                <el-select v-model="childerItem.vehicleType" @focus="vehicleFocus(index,childerIndex)" size="small" clearable placeholder="请选择" style="width: 80%;">
                  <el-option
                    v-for="item in airportOptions"
                    :key="item.name"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div class="flight-template-li" style="flex: 0 0 13%;">
                <el-input v-model="childerItem.vehicleId" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')" size="small" style="width: 80%;"></el-input>
              </div>
              <div class="flight-template-li" style="flex: 0 0 7%;">
                <el-input v-model="childerItem.vehicleId" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')" size="small" style="width: 80%;"></el-input>
              </div>
              <div class="flight-template-li" style="flex: 0 0 7%;">
                <el-input v-model="childerItem.vehicleId" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')" size="small" style="width: 80%;"></el-input>
              </div>
              <div class="flight-template-li" style="flex: 0 0 7%;">
                <el-input v-model="childerItem.vehicleId" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')" size="small" style="width: 80%;"></el-input>
              </div>
              <div class="flight-template-li" style="flex: 0 0 10%;">
                <el-input v-model="childerItem.vehicleId" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')" size="small" style="width: 80%;"></el-input>
              </div>
              <div class="flight-template-li" style="flex: 0 0 5%;">
                <el-input v-model="childerItem.vehicleId" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')" size="small" style="width: 80%;"></el-input>
              </div>
              <div class="flight-template-li" style="flex: 0 0 10%;">
                <el-input v-model="childerItem.vehicleId" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')" size="small" style="width: 80%;"></el-input>
              </div>
              <div class="flight-template-li" style="flex: 0 0 13%;">
                <el-input v-model="childerItem.vehicleId" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')" size="small" style="width: 80%;"></el-input>
              </div>
              <div class="flight-template-li" size="small" style="flex: 0 0 10%;">
                <a :style="{visibility: parentItem.childerTable.length > 9 ? 'hidden' : 'visible'}" @click="addChilder(index)" style="font-size: 18px;"><i class="el-icon-circle-plus-outline"></i></a>
                <a @click="delChilder(index,childerIndex)" style="font-size: 18px;" :style="{visibility: childerIndex == 0 && parentItem.childerTable.length == 1 ? 'hidden' : 'visible'}"><i class="el-icon-delete"></i></a>
              </div>
            </div>
          </div>
          <div style="margin-top: 20px;">
            <el-form-item label="账单合计">
              <div>￥7000+$600</div>
            </el-form-item>
            <el-form-item label="人民币合计">
              <div>￥7000+$600</div>
            </el-form-item>
            <el-form-item label="结算方式">
              <el-select clearable placeholder="请选择结算方式">
                <el-option
                  v-for="item in airportOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
      </el-form>

      <!-- 航线价格 -->
      <el-form :label-position="labelPosition" :inline="true" label-width="150px" size="medium" class="demo-form-inline">
        <div class="rest-style" style="padding-left: 20px;">
          <el-form-item label=" " label-width="150px">
            <el-button style="height: 36px;line-height: 36px;padding: 0;" type="primary" >保存</el-button>
            <el-button style="height: 36px;line-height: 36px;padding: 0;" type="primary" >审核通过</el-button>
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
        continent: '',
        ruleForm: {
          pol: '',
          pod: '',
          airCompanyCode: '',
          shortestPrescription: '',
          longestPrescription: '',
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
        airportOptions: [
          {
            name: '宽体飞机',
            value: '1'
          },
          {
            name: '窄体飞机',
            value: '2'
          },
          {
            name: '货机',
            value: '3'
          },
          {
            name: '卡车',
            value: '4'
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
      this.initAirportSearchByPage()
      this.initCompanySearchByPage()
      this.initAgentList()
    },
    methods: {
      //班期排序
      dowsChange(index) {
        this.airlineAgent[index].dows.sort()
      },
      //保存
      submitData() {
        var newFullLeg = []
        for(var i = 0; i < this.fullLeg.length; i++){
          newFullLeg.push(this.fullLeg[i].airportName)
        }
        var newAgent = []
        for(var q = 0; q < this.airlineAgent.length; q++){
          var ag = JSON.parse(JSON.stringify(this.airlineAgent[q].agentId))
          var newJson = {
            agentId: ag.split('#')[0],
            agentName: ag.split('#')[1],
            otherFees: JSON.stringify(this.airlineAgent[q].otherFees),
            dows: this.airlineAgent[q].dows.toString(),
            ratesList: []
          }
          if(!newJson.agentId){
            this.$message.error('航线报价模块'+(q+1)+'代理公司未填写')
            return
          }
          if(!newJson.dows){
            this.$message.error('航线报价模块'+(q+1)+'班期未填写')
            return
          }
          for(var a = 0; a < this.airlineAgent[q].ratesList.length; a++){
            var list = {}
            list.cargoType = this.airlineAgent[q].ratesList[a].cargoType.toString()
            if(!list.cargoType){
              this.$message.error('当前代理报价必选')
              return
            }
            list.ratesInsertDTOS = []
            for(var z = 0; z < this.airlineAgent[q].ratesList[a].tableData.length; z++){
              var childer = {
                vwr: this.airlineAgent[q].ratesList[a].tableData[z].vw,
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
        // var pod = JSON.parse(JSON.stringify(this.ruleForm.pod))
        var data = {
          pol: this.ruleForm.pol,
          pod: this.ruleForm.pod,
          continent: this.continent,
          planeType: this.airportTableArr[0].childerTable[0].vehicleType,
          airCompanyCode: this.ruleForm.airCompanyCode,
          shortDuration: this.ruleForm.shortestPrescription,
          longDuration: this.ruleForm.longestPrescription,
          status: this.ruleForm.status ? 0 : 1,
          fullLeg: newFullLeg.toString(),
          legCount: this.airportTableArr.length,
          legDetail: JSON.stringify(this.airportTableArr),
          airlineAgentInsertDTOS: newAgent,
          remark: this.ruleForm.remark
        }
        this.$http.post(this.$service.airlineSave,data).then((data) => {
          if(data.code == 200){
            sessionStorage.setItem('routeAdd','hide')
            this.$router.push('/routeManagement/routeManage')
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
        this.ruleForm.airCompanyCode = item.airCompanyCode
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
        // this.airportEcheckArr = []
        // for(var i = 0; i < this.fullLeg.length; i++){
        //   this.airportEcheckArr.push(this.fullLeg[i].airportName)
        // }
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
      delTableClick1(index) {
        this.airlineAgent.splice(index,1)
      },
      remoteMethod(query) {
        // console.log(query)
      },
      //添加杂费
      addFeesClick(index) {
        console.log(this.airlineAgent)
        var reg = /(^[1-9][0-9]{0,5}$)|(^[0-9]{0,5}[\.][0-9]{1,2}$)/
        if(!this.airlineAgent[index].incidentalName){
          this.$message.error('请选择杂费名称')
          return
        }else if(this.airlineAgent[index].incidentalPrice == ''){
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
            var data = {
              fullLeg: newFullLeg.toString(),
              airCompanyCode: this.ruleForm.airCompanyCode
            }
            this.$http.post(this.$service.airlineCheckAirlineInfo,data).then((data) => {
              if(data.code == 200){
                this.active = 2
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
          var x = Number(a[key])
          var y = Number(b[key])
          var num = x < y ? 1 : 0
          return x > y ? num : -1
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
