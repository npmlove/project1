<template>
  <div class="content-wrapper">
    <div class="content">
      <el-form
        :inline="true"
        size="medium"
        class="demo-form-inline"
        label-position="left"
      >
        <div class="content-search-normal">
          <el-form-item label="订单号:" class="formItem" label-width="80px">
            <el-popover
               placement="right"
               width="200"
               trigger="click">
               <div v-for="(item,index) in selectResult.orderNos.split(/[,，/' ']/).splice(0,20)" :key="index">
                 {{index==19?"...":item}}
               </div>
            <el-input
                style="width: 190px"
                slot="reference"
                v-model="selectResult.orderNos"
                placeholder="请输入订单号"
                clearable
                  >
              </el-input>
          </el-popover>
            
          </el-form-item>
          <el-form-item label="运单号:" class="formItem" label-width="80px">
            <el-popover
               placement="right"
               width="200"
               trigger="click">
               <div v-for="(item,index) in selectResult.waybillNos.split(/[,，/' ']/).splice(0,20)" :key="index">
                 {{index==19?"...":item}}
               </div>
           <el-input
              slot="reference"
               style="width: 190px"
               v-model="selectResult.waybillNos"
               placeholder="请输入运单号"
               clearable
               >
            </el-input>
          </el-popover>
          </el-form-item>
          <el-form-item label="应收对象:" class="formItem" label-width="80px">
            <el-input
              v-model="selectResult.reconciliationUnit"
              style="width: 190px"
              size="medium"
              maxlength="30"
              clearable
              placeholder="请输入应收对象"
            ></el-input>
          </el-form-item>
          <el-form-item label="订舱客户:" class="formItem" label-width="80px">
            <el-input
              v-model="selectResult.customerName"
              style="width: 190px"
              size="medium"
              maxlength="30"
              clearable
              placeholder="请输入订舱客户"
            ></el-input>
          </el-form-item>
      
          <el-form-item label="代理上家:" class="formItem" label-width="80px" >
            <el-select
              v-model="selectResult.agentId"
              placeholder="请输入代理上家"
              :remote-method="agentMethod"
              :loading="loading"
              clearable
              filterable
              remote
              maxlength="30"
              reserve-keyword
              style="width: 190px"
            >
              <el-option
                v-for="item in agentOpt"
                :key="item.id"
                :label="item.agentName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="航司:" class="formItem" label-width="80px">
            <el-select
              v-model="selectResult.airCompanyCode"
              placeholder="请输入航司"
              :remote-method="companyMethod"
              :loading="loading"
              clearable
              filterable
              remote
              maxlength="15"
              reserve-keyword
              style="width: 190px"
            >
              <el-option
                v-for="(item,index) in airCompanyCodeOpt"
                :key="index"
                :label="item.name"
                :value="item.airCompanyCode"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="起运港:" class="formItem" label-width="80px">
            <el-select
              v-model="selectResult.pol"
              placeholder="起运港三字码"
              :remote-method="polMethod"
              :loading="loading"
              clearable
              filterable
              maxlength="15"
              remote
              reserve-keyword
              style="width: 190px"
            >
              <el-option
                v-for="(item, index) in polOpt"
                :disabled="pod == item.threeLetterCode"
                :key="item.threeLetterCode"
                :value="item.threeLetterCode"
              >
                <span>{{ item.threeLetterCode }}</span>
                <span style="margin-left: 5px">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="目的港:" class="formItem" label-width="80px">
            <el-select
              v-model="selectResult.pod"
              placeholder="目的港三字码"
              :remote-method="podMethod"
              maxlength="15"
              :loading="loading"
              clearable
              filterable
              remote
              reserve-keyword
              style="width: 190px"
            >
              <el-option
                v-for="item in podOpt"
                :disabled="pol == item.threeLetterCode"
                :key="item.threeLetterCode"
                :value="item.threeLetterCode"
              >
                <span>{{ item.threeLetterCode }}</span>
                <span style="margin-left: 5px">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
         <el-form-item label="核销状态" label-width="80px" style="width:320px">
            <el-select v-model="selectResult.rcvWriteOffStatusList" placeholder="核销状态" clearable multiple collapse-tags  @change="dealAllChange" style="width: 190px;">
              <el-option
                v-for="(item,index) in writeOffStatus"
                :key="index"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
         
          <el-form-item label="售前客服:" class="formItem" label-width="80px">
            <el-select
              v-model="selectResult.pscsId"
              placeholder="请输入售前客服"
              :loading="loading"
              clearable
              filterable
              remote
              reserve-keyword
              style="width: 190px"
            >
              <el-option
                v-for="item in payBefore"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="售中客服:" class="formItem" label-width="80px">
            <el-select
              v-model="selectResult.mscsId"
              placeholder="请输入售中客服"
              :loading="loading"
              clearable
              filterable
              remote
              reserve-keyword
              style="width: 190px"
            >
              <el-option
                v-for="item in paying"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item
            label="航班日期:"
            style="width: 480px"
            label-width="80px"
          >
            <el-date-picker
              style="width: 180px"
              value-format="yyyy-MM-dd"
              v-model="selectResult.startDepartureDate"
              type="date"
              :picker-options="pickerOptionsStartOne"
              placeholder="选择日期"
            >
            </el-date-picker
            >-
            <el-date-picker
              style="width: 180px"
              value-format="yyyy-MM-dd"
              v-model="selectResult.endDepartureDate"
              type="date"
              :picker-options="pickerOptionsEndOne"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="下单时间:" style="width: 480px">
            <el-date-picker
              value-format="yyyy-MM-dd"
              style="width: 180px"
              v-model="selectResult.startOrderTime"
              type="date"
              :picker-options="pickerOptionsStartTwo"
              placeholder="选择日期"
            >
            </el-date-picker
            >-
            <el-date-picker
              value-format="yyyy-MM-dd"
              style="width: 180px"
              v-model="selectResult.endOrderTime"
              type="date"
              :picker-options="pickerOptionsEndTwo"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
           <el-form-item label="结算方式:" label-width="80px">
            <el-select
              v-model="selectResult.payWay"
              placeholder="请选择结算方式"
              style="width: 190px"
            >
              <el-option
                v-for="(item,index) in payWayData"
                :key="index"
                :label="item.value"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="航线:" class="formItem" label-width="80px">
            <el-select
              v-model="selectResult.principalId"
              placeholder="请输入航线"
              :loading="loading"
              clearable
              filterable
              remote
              reserve-keyword
              style="width: 190px"
            >
              <el-option
                v-for="item in airManger"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <div class="operateButton">
            <el-button
              @click="searchClick"
              size="mini"
              type="primary"
              icon="el-icon-search"
              >查询</el-button
            >
            <el-button @click="restClick" size="mini" type="primary"
              >清空</el-button
            >
          </div>
          <div class="operateButton">
            <el-button size="mini" type="primary" @click="getStatement">生成对账单</el-button>
            <el-button size="mini" type="primary" @click="chargeOff">核销</el-button>
            <el-button size="mini" type="primary" @click="getExportExcel">导出列表</el-button>
            <el-button @click="drawer = true" type="primary" size="mini"
              >选择表格列</el-button
            >
          </div>
          <!-- 表格控制列显示 -->
      <el-drawer
        title="表格列控制"
        :visible.sync="drawer"
        size="200px"
        :direction="direction"
      >
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
          style="margin: 0 0 20px 20px"
          >全选</el-checkbox
        >
        <el-checkbox-group v-model="checkedTable" :min="0" :max="20">
          <el-checkbox
            v-for="choose in tableOptions"
            :label="choose"
            :key="choose"
            style="display: block; margin-left: 20px"
            >{{ choose }}</el-checkbox
          >
        </el-checkbox-group>
      </el-drawer>
        </div>
      </el-form>
    </div>
     <el-tabs  v-model="typeCode" type="border-card" @tab-click="tabClickData" value="可操作">
        <el-tab-pane v-for="(item,index) in tabName" :key="index" :label="item+'('+tabNum[index]+')'" :name="item">
           <el-table
            :data="tableData"
            ref="multipleTable"
            border
            stripe
            header
            class="finance-table"
            :cell-style="tableRowClassName"
            @selection-change="handleSelectionChange"
            style="width: 100%"
          >
            <template slot="empty">
              <img class="data-pic" src="../../assets/kong-icon.png" />
              <p>暂无数据</p>
            </template>
            <el-table-column
              type="selection"
              width="40"
              label="序号"
               fixed="left"
              :selectable="ifDisabled"
              v-if="checkedTable.indexOf('序号') !== -1"
            ></el-table-column>
            <el-table-column
              prop="orderNo"
              label="订单号"
              min-width="160"
              type=""
              v-if="checkedTable.indexOf('订单号') !== -1"
            >
            <template slot-scope="scope">
              <div @click="showData(scope.row.id,scope.row.orderNo)" style="color:skyBlue">
                {{scope.row.orderNo}}
              </div>
            </template>
            </el-table-column>
            <el-table-column
              prop="waybillNo"
              label="运单号"
              min-width="160"
              type=""
              v-if="checkedTable.indexOf('运单号') !== -1"
            ></el-table-column>
            <el-table-column
              prop="reconciliationUnit"
              label="应收对象"
              min-width="100"
              type=""
              v-if="checkedTable.indexOf('应收对象') !== -1"
            ></el-table-column>
            <el-table-column
              prop="departureDate"
              label="航班日期"
              min-width="100"
              type=""
              v-if="checkedTable.indexOf('航班日期') !== -1"
            ></el-table-column>
            <el-table-column
              prop="presentationTime"
              label="交单时间"
              min-width="100"
              type=""
              v-if="checkedTable.indexOf('交单时间') !== -1"
            ></el-table-column>
            
            <el-table-column
              label="应收金额"
              v-if="checkedTable.indexOf('应收金额') !== -1"
            >
              <el-table-column prop="totalArCny" label="人民币" width="120">
              </el-table-column>
              <el-table-column label="原币" width="120">
                <template slot-scope="scope">
                  <div>
                    {{scope.row.totalArOrgn | getOrgn}}
                   </div>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="已对账金额" prop="rcvCheckAmount"  v-if="checkedTable.indexOf('已对账金额') !== -1"></el-table-column>
            <el-table-column label="未对账金额" prop="notRcvCheckAmount"  v-if="checkedTable.indexOf('未对账金额') !== -1"></el-table-column>

            <el-table-column
              label="已核销金额"
              v-if="checkedTable.indexOf('已核销金额') !== -1"
            >
              <el-table-column prop="rcvWriteOffAmountCny" label="人民币" width="120">
              </el-table-column>
              <el-table-column label="原币" width="120">
                 <template slot-scope="scope">
                  <div>
                    {{scope.row.rcvWriteOffAmountOrgn | getOrgn}}
                   </div>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column
              label="未核销金额"
              v-if="checkedTable.indexOf('未核销金额') !== -1"
            >
              <el-table-column prop="notRcvWriteOffAmountCny" label="人民币" width="120">
              </el-table-column>
              <el-table-column label="原币" width="120">
                 <template slot-scope="scope">
                  <div>
                    {{scope.row.notRcvWriteOffAmountOrgn | getOrgn}}
                   </div>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column
              prop="totalApCny"
              label="应付总金额"
              min-width="80"
              v-if="checkedTable.indexOf('应付总金额') !== -1"
            ></el-table-column> 
            <el-table-column
              prop="orderProfit"
              label="利润"
              min-width="80"
              v-if="checkedTable.indexOf('利润') !== -1"
            ></el-table-column>
            <el-table-column
              prop="exchangeRate"
              label="汇率"
              min-width="80"
              v-if="checkedTable.indexOf('汇率') !== -1"
            >
            <template slot-scope="scope">
              <div>
                {{scope.row.exchangeRate| getExchangeRate}}
              </div>
            </template>
            </el-table-column>
            <el-table-column
              prop="payWay"
              label="结算方式"
              min-width="80"
              v-if="checkedTable.indexOf('结算方式') !== -1"
            >
            <template slot-scope="scope">
              <div>{{scope.row.payWay == 0 ?"付款买单":scope.row.payWay == 1 ?"月结买单":""}}</div>
            </template>
            </el-table-column>
            <el-table-column
              prop="rcvWriteOffCount"
              label="核销次数"
              min-width="80"
              v-if="checkedTable.indexOf('核销次数') !== -1"
            >
            <template slot-scope="scope">
              <div @click="getRcvWrite(scope.row)" style="color:skyblue">{{scope.row.rcvWriteOffCount}}</div>
            </template>
            </el-table-column>
            <el-table-column
              prop="rcvWriteOffStatus"
              label="核销状态"
              min-width="80"
              v-if="checkedTable.indexOf('核销状态') !== -1"
            >
            <template slot-scope="scope">
              <div>
                 {{scope.row.rcvWriteOffStatus | getWriteOffStatus}} 
              </div>
            </template>
            </el-table-column>
          </el-table>
          <div>
            <div>
              <el-button size="mini" class="pageSkip"><el-checkbox v-model="pageSkipChecked" @change="selectAllTable">跨页全选</el-checkbox></el-button>
              <el-button type="primary" size="mini" @click="getStatistData"
                >数据统计</el-button
              >
              <div style="margin-top: 15px;display:flex;font-size:12px" v-if="statistDataShow">
                <div class="statist">
                  <div>应收总金额:{{statistData.totalArCny}}</div>
                  <div class="statists">应收原币:{{statistData.totalArOrgn | getOrgn}}</div>
                </div>
                <div class="statist">
                  <div>已核销总金额:{{statistData.totalRcWoCny}}</div>
                  <div class="statists">已核销原币:{{statistData.totalRcWoOrgn | getOrgn}}</div>
                </div>
                <div class="statist">
                  <div>未核销总金额:{{statistData.totalRcUnwoCny}}</div>
                  <div class="statists">未核销原币:{{statistData.totalRcUnwoOrgn | getOrgn}}</div>
                </div>
                <div class="statist" style="color:red;font-size:20px" v-if = "errorStatist">
                  <div>存在异常订单！</div>
                </div>
              </div>
            </div>
          </div>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageNum"
              :page-sizes="[10, 30, 50]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              style="
                text-align: right;
                padding: 19px 30px 18px 0;
                background: #fff;
              "
            >
            </el-pagination>
        </el-tab-pane>
      </el-tabs>
      <el-dialog :title="dialogTitleOne+' 订单详情'" :visible.sync="dialogFormVisibleOne" width="80%">
          <Table
            :tableData='tableDataTwo'
            :operation="operation"
            :columns='columns2'
            :showSelection="false"
            >
          </Table>
          <div style="font-size: 18px;font-weight: 100;color: #333;padding: 0 20px 10px 20px;">应收账单</div>
          <Table
            :tableData='tableDataOne'
            :operation="operation"
            :columns='columns1'
            :showSelection="false"
          >
          </Table>
          <div class="finance-table-price">
            <div>账单合计：{{ this.totalArOrgn | getOrgn}}</div>
            <div>人民币合计：￥{{ this.totalArCny }}</div>
            <div>结算方式：{{ this.payWay == 0 ? "付款买单" : "月结买单" }}</div>
          </div>
          <div style="font-size: 18px;font-weight: 100;color: #333;padding: 10px 20px 10px 20px;">修改记录</div>
          <Table
            :tableData='tableDataThree'
            :operation="operation"
            :columns='columns3'
            :showSelection="false"
            >
          </Table>
    </el-dialog>
      <el-dialog title="应收核销操作记录" :visible.sync="dialogFormVisibleTwo" width="90%" top="35vh">
        <div style="width:100%;">
          <el-table
              :data = "receiveOperate"
              >
              <el-table-column label="序号" type="index"></el-table-column>
              <el-table-column label="订单号" prop="orderNo"></el-table-column>
              <el-table-column label="运单号" prop="waybillNo"></el-table-column>
              <el-table-column label="应收对象" prop="reconciliationUnit"></el-table-column>
              <el-table-column label="应收金额" prop="totalArOrgn">
                <template slot-scope="scope">
                  <div>
                    {{scope.row.totalArOrgn | getOrgn}}
                   </div>
                </template>
              </el-table-column>
              
              <el-table-column label="记录" width="600">
                <template slot-scope="scope">
                  <div v-for="(item,index) in scope.row.records" :key="index">
                    <div v-if="item.status == 2">操作{{index+1}}:{{item.writeOffOperator}} <span style="color:red;margin-left:10px">撤销"</span><span>操作{{item.deleteId}}" <span style="opacity:0">核销金额:XXXHKD</span> {{item.revokeTime}}</span> </div>
                    <div v-else>操作{{index+1}}:{{item.writeOffOperator}} <span style="color:skyblue;margin-left:10px">核销</span><span>该订单,核销金额: {{item.writeOffAmount}}{{['CNY','HKD','USD','EUR','GBP'][item.currency]}}</span><span style="margin-left:10px">{{item.writeOffTime}}</span></div>

                  </div>
                </template>
              </el-table-column>
              <el-table-column width="100" label="操作">
                <template slot-scope="scope">
                  <div v-for="(item,index) in scope.row.records" :key="index">
                      <div v-if="item.status == 0" style="color:skyblue" @click="confirmReset(index,item.id,scope.row.copyId)">撤销</div>
                      <div v-else-if="item.status ==2" style="opacity:0;">撤销</div>
                      <div v-else-if="item.status ==-1" >已撤销</div>
                  </div>
                </template>
              </el-table-column>
          </el-table>
        </div>
    </el-dialog>
    <!-- 核销按钮弹框 -->
    <el-dialog title="应收核销" :visible.sync="dialogFormVisibleThree" width= "800px" style="margin:auto;">
      <el-form style="display:flex;flex-wrap:wrap;justify-content:space-between;margin-top:20px" label-position="left">
         <el-form-item label="核销金额:" required label-width="130px">
            <el-input v-model.number="chargeOffData.writeOffAmount" placeholder="请输入核销金额" style="width:200px"></el-input>
          </el-form-item>
          <el-form-item label="收款账户信息:"  required class="formItem" label-width="130px">
            <el-select
              v-model="chargeOffData.userInfo"
              placeholder="请输入收款账户信息"
              :remote-method="chargeInfoMethod"
              maxlength="15"
              clearable
              filterable
              remote
              reserve-keyword
              style="width: 260px"
            >
              <el-option
                v-for="item in chargeUserInfo"
                :key="item.id"
                :label="`${item.accountBank}-${item.userName}-${item.bankAccount}`"
                :value="`${item.accountBank}-${item.userName}-${item.bankAccount}`"
              >
                <span>{{ item.accountBank }}-</span>
                <span>{{ item.userName }}-</span>
                <span>{{ item.bankAccount }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="币种:" required label-width="130px">
            <el-select
              v-model="chargeOffData.currency"
              placeholder="请选择币种"
              @change= "changeCurrency"
              style="width: 200px"
            >
              <el-option
                v-for="(item,index) in chargeMoney"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收款方式:" required label-width="130px">
            <el-select
              v-model="chargeOffData.writeOffWay"
              placeholder="请选择收款方式"
              clearable
              style="width: 260px"
            >
              <el-option
                v-for="(item,index) in chargeWriteOffWay"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="到账时间:" required label-width="130px">
           
            <el-date-picker
              style="width: 200px"
              v-model="chargeOffData.payDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>

          </el-form-item>
          <el-form-item label="结算方式:" label-width="120px">
            <div style="width:260px">
              <el-radio-group v-model="chargeOffData.payWay">
                <el-radio label="0">付款买单</el-radio>
                <el-radio label="1">月结</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
      </el-form>
      <div style="display:flex;justify-content:space-around;margin-top:15px">
        <div>订单总金额: {{moneyData[0]}}</div>
        <div>未核销金额: {{moneyData[1]}}{{currencyArray[chargeOffData.currency-1]}}</div>
        <div>已核销金额:  {{moneyData[2]}}{{currencyArray[chargeOffData.currency-1]}}</div>
      </div>
        <!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <div style="text-align: center;padding-top:20px;">
          <el-button size="medium" type="primary"
            @click="confirmReceive">确认核销</el-button>
          <el-button size="medium" @click="dialogFormVisibleThree = false">取 消
          </el-button>
        </div>
      </div>

    </el-dialog>
    <!-- 生成对账单弹框 -->
    <el-dialog :visible.sync="dialogFormVisibleFour" width="80%">
      <div style="text-align:center">
        <div style="fontSize:20px;fontWeight:bolder;margin:30px 0 15px 0">上海飞莱达供应链管理有限公司</div>
        <div style="fontWeight:bold;fontSize:12px;margin-bottom:10px">Shanghai Feilaida Supply Chain Management Co., Ltd.</div>
        <div style="fontWeight:bold;fontSize:12px;margin-bottom:10px">上海市青浦区诸光路1588弄虹桥世界中心L3B栋606-608</div>
        <div style="fontWeight:bold;fontSize:12px;margin-bottom:30px">客户对账单</div>
        <hr/>
        <div style="margin:8px 0;text-align:center;position:relative">
          <span style="position:absolute;left:0;">{{dialFourDatas.reconciliationUnit}}</span>
          <span>费用明细单</span>
        </div>
        <el-table :data="dialFourTable">
          <el-table-column label="委托单号" prop="orderNo"></el-table-column>
          <el-table-column label="业务类型" prop="businessType"></el-table-column>
          <el-table-column label="航班日期" prop="departureDate"></el-table-column>
          <el-table-column label="运单号" prop="waybillNo"></el-table-column>
          <el-table-column label="起运港-目的港" prop="polAndPod"></el-table-column>
          <el-table-column label="单价" prop="price"></el-table-column>
          <el-table-column label="计费重" prop="cwStr"></el-table-column>
          <el-table-column label="币种" prop="currencyStr"></el-table-column>
          <el-table-column label="应收金额" prop="totalArCny"></el-table-column>
          <el-table-column label="开票金额" prop="invoiceAmount"></el-table-column>
        </el-table>
        <div style="display:flex;justify-content:space-between;margin:15px 0 ">
          <div>总票数:{{dialFourDatas.totalOrderNum}}</div>
          <div>开票金额:  ¥ {{dialFourDatas.invoiceAmount}}</div>
          <div>应收金额:  ¥ {{dialFourDatas.totalArCny}}</div>
          <div>已收金额:  ¥ {{dialFourDatas.totalWoCny}}</div>
          <div>未收金额:  ¥ {{dialFourDatas.totalUnWoCny}}</div>
        </div>
        
      </div>
      <el-form label-position="left">
          <el-form-item required label=" ">
            <el-input type="text" v-model="dialCheckInfo.feeWarnInfo" placeholder="上信息请确认签字盖章回传,如若未回复三个工作日内默认确认,请悉知！"  style="width:50%"></el-input>
          </el-form-item>
          <div style="margin:30px 0 20px 10px;fontSize:15px;fontWeight:bold">我司信息:</div>
          <el-form-item label="公司开户名" required label-width="100px">
            <el-input type="text" v-model="dialCheckInfo.accountName" placeholder="请输入公司开户名" style="width:50%" maxlength="4"></el-input>
          </el-form-item >
          <el-form-item label = "开户行" required label-width="100px">
            <el-input type="text" v-model="dialCheckInfo.accountBank" placeholder="请输入开户行" style="width:50%" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="人民币账号" required label-width="100px">
            <el-input type="text" v-model="dialCheckInfo.bankAccountCny" placeholder="请输入人民币账号" style="width:50%" maxlength="19"></el-input>
          </el-form-item>
          <el-form-item label="美金账号" required label-width="100px" >
            <el-input type="text" v-model="dialCheckInfo.bankAccountUsd" style="width:50%" maxlength="19"></el-input>
          </el-form-item>
          <div style="margin:20px 0"><span>签字:</span><span style="margin-left:200px">日期:</span></div>
          <div style="display:flex;justify-content:space-between;padding-bottom:30px;height:40px">
            <el-form-item label=" " required style="width:70%"> 
              <el-input type="text" v-model="dialCheckInfo.statementWarnInfo" style="width:80%" placeholder="若有异议,请联系我司财务部,联系电话:17898843921" maxlength="100"></el-input>
            </el-form-item>
            <el-button sizi="mini" @click="exportAccount">导出对账单</el-button>
          </div>
          
        </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import Table from '@/components/financeTable'
  export default {
    data() {
      return {
        pageSkipChecked:false,//跨页全选
        statistDataShow:false,//数据统计
        statistData:{},//数据统计数据
        errorStatist:false,//数据统计异常
        //表格控制列drawer
      drawer: false,
      checkAll: false,
      isIndeterminate: true,
      direction: "rtl",
      checkedTable: [  "序号",
        "订单号",
        "运单号",
        "应收对象",
        "航班日期",
        "交单时间",
        "应收金额",
        "已对账金额",
        "未对账金额",
        "已核销金额",
        "未核销金额",
        "应付总金额",
        "利润",
        "汇率",
        "结算方式",
        "核销次数",
        "核销状态",
        ],
      tableOptions: [  
        "序号",
        "订单号",
        "运单号",
        "应收对象",
        "航班日期",
        "交单时间",
        "应收金额",
        "已对账金额",
        "未对账金额",
        "已核销金额",
        "未核销金额",
        "应付总金额",
        "利润",
        "汇率",
        "结算方式",
        "核销次数",
        "核销状态"
        ],
        //表格tab页
        tabName:["可操作","业务修改中","异常"],
        tabNum:[0,0,0],
        typeCode:"可操作",
        //核销状态
        writeOffStatus:[{value:"全部",id:""},{value:"未对账未核销",id:0},{value:"部分对账未核销",id:1},{value:"已对账未核销",id:2},{value:"未对账部分核销",id:3},{value:"部分对账部分核销",id:4},{value:"已对账部分核销",id:5},{value:"未对账已核销",id:6},{value:"部分对账已核销",id:7},{value:"已对账已核销",id:8},],
        payWayData:[{value:"全部",id:""},{value:"付款买单",id:0},{value:"月结买单",id:1}],
        //搜索框结果
      selectResult:{
        orderNos:"",
        waybillNos:"",
        reconciliationUnit:"",
        customerName:"",
        agentId:"",
        airCompanyCode:"",
        pol:"",
        pod:"",
        payWay:"",
        rcvWriteOffStatusList:[""],
        mscsId:"",
        pscsId:"",
        startDepartureDate:"",
        endDepartureDate:"",
        startOrderTime:"",
        endOrderTime:"",
        principalId:"",
    },
    //表格选中数据
    selectTableData:[],
    //表格数据
    tableData:[],
    //表格分页
    pageSize: 10,
    pageNum: 1,
    total: 0,
    //弹框控制
    dialogTitleOne:"",
    dialogFormVisibleOne:false,
    dialogFormVisibleTwo:false,
    dialogFormVisibleThree:false,
    dialogFormVisibleFour:false,
    //核销次数弹框
    receiveOperate:[{}],
    //订单号列弹框数据
    totalArOrgn:"",
    totalArCny:"",
    payWay:"",
    //订单号列弹框表格数据
      columns1: [
        { label: "序号", show: true, width: "50" },
        { label: "费用名称", prop: "expenseName", show: true, width: "100" },
        {
          label: "收款单位",
          prop: "expenseUnitName",
          show: true,
          width: "150",
        },
        { label: "单价", prop: "price", show: true, width: "100" },
        { label: "数量", prop: "quantity", show: true, width: "100" },
        { label: "币种", prop: "currency", show: true, width: "100" },
        { label: "原币合计", prop: "totalOrgn", show: true, width: "100" },
        { label: "汇率", prop: "exchangeRateOnly", show: true, width: "100" },
        { label: "人民币合计", prop: "totalCny", show: true, width: "100" },
        { label: "备注", prop: "remark", show: true, width: "50" },
      ],
       columns2: [
        { label: "订舱客户", prop: "customerName", show: true, width: "100" },
        {
          label: "代理上家",
          prop: "agentName",
          show: true,
          width: "150",
        },
        { label: "航司", prop: "airCompanyCode", show: true, width: "100" },
        { label: "起运港", prop: "pol", show: true, width: "100" },
        { label: "目的港", prop: "pod", show: true, width: "100" },
        { label: "货物信息", prop: "cargoInfo", show: true, width: "100" },
        { label: "操作人员", prop: "operation", show: true, width: "100" },
      ],
       columns3: [
        { label: "操作类型", prop: "operationType", show: true, width: "150" },
        { label: "说明", prop: "operationInfo", show: true, width: "100" },
        { label: "操作时间", prop: "createTime", show: true, width: "150" },
        { label: "操作人", prop: "operator", show: true, width: "100" },
      ],
      // 操作
      operation: {
        show: false,
        label: "操作",
        width: "180",
        options: [{ label: "编辑", method: "routeEdit" }],
      },
      currencyArray:["CNY","HKD","USD","EUR","GBP"],
      //应收订单弹框数据
      tableDataOne:[],
      tableDataTwo:[],
      tableDataThree:[],

      //核销弹框数据
      chargeOffData:{writeOffAmount:"",writeOffWay:"",payWay:"0",currency:"",userInfo:"",payDate:""},
      chargeMoney:[], //币种
      copyChargeNum:[],
      chargeWriteOffWay:[{value:0,label:"银行转账"},{value:1,label:"应付对冲"}], //收款方式
      chargeUserInfo:[],//收款账户信息
      moneyData:[0,0,0],

      //生成对账单弹框数据
      dialFourTable:[],
      dialFourDatas:{},
      dialCheckInfo:{feeWarnInfo:"",accountName:"上海飞莱达供应链管理有限公司",accountBank:"中国银行上海万科支行",bankAccountCny:"4390817",bankAccountUsd:"",statementWarnInfo:""},
      //航班日期选择器
         // 限制结束日期大于开始日期
        pickerOptionsStartOne: {
          disabledDate: time => {
            let endDateVal = this.selectResult.endDepartureDate
            if (endDateVal) {
              return time.getTime() > new Date(endDateVal).getTime()
            }
          }
        },
        pickerOptionsEndOne: {
          disabledDate: time => {
            let beginDateVal = this.selectResult.startDepartureDate
            if (beginDateVal) {
              return time.getTime() < new Date(beginDateVal).getTime()
            }
          }
        },
        // 下单时间
         pickerOptionsStartTwo: {
          disabledDate: time => {
            let endDateVal = this.selectResult.endOrderTime
            if (endDateVal) {
              return time.getTime() > new Date(endDateVal).getTime()
            }
          }
        },
        pickerOptionsEndTwo: {
          disabledDate: time => {
            let beginDateVal = this.selectResult.startOrderTime
            if (beginDateVal) {
              return time.getTime() < new Date(beginDateVal).getTime()
            }
          }
        },
        //搜索框接口数据
        agentOpt: [],
        polOpt: [],
        podOpt: [],
        airCompanyCodeOpt:[],
        payBefore:[],
        paying:[],
        airManger:[],
      }
    },
    mounted() {
      this.searchClick()
      this.initAgentList()
      this.initAirportSearchByPage()
      this.initCompanySearchByPage()
      this.operateData()
    },
    methods:{
      //表格列全选控制
      handleCheckAllChange(val) {
      this.checkedTable = val ? this.tableOptions : [];
      this.isIndeterminate = false;
    },
       tableRowClassName({row, rowIndex}) {
        if(row.abnormalFlag == 1){
          return 'background-color: #CD5C5C';
        }
      else if (row.orderProfit<0 &&  row.orderProfit>-200 ) {
        return 'background-color: #FFDEAD';
      }
        else if (row.orderProfit<=-200 && row.orderProfit>-500) {
          return 'background-color: #F4A460';
        } else if (row.orderProfit<=-500 ) {
        return 'background-color: #FA8072';
      }
      },
       // 处理input的输入选择
      querySearch(q,cb){
        let tempQuery = []
        let arrayt = []
        q =  q.replace(/，/ig,',').replace(/\s/ig,',').replace(/\//g,',').replace(/-/ig,'').replace(/,/ig,',')
        if(q.charAt(q.length - 1) == ','){
          q = q.slice(0,q.length - 1)
        }
        if(q.indexOf(',')){
          tempQuery = q.split(",")
        }else{
          tempQuery[0] = q
        }
        for(let i in tempQuery){
          let newobj = {}
          newobj.value = tempQuery[i]
          newobj.label = tempQuery[i]
          arrayt.push(newobj)
        }
        cb(arrayt)
      },
      //生成对账单
      getStatement(){
        if(this.typeCode == "业务修改中"){
          this.$message({
            type:'warning',
            message:"该tab页数据不支持生成对账单"
          })
          return
        }
        if(this.selectTableData.length == 0){
          this.$message({
            type:'warning',
            message:"请至少勾选一条数据"
          })
        }
       else if(!this.selectTableData.every(item=>item.reconciliationUnit == this.selectTableData[0].reconciliationUnit)) {
          this.$message({
            type:'warning',
            message:"应收对象不一致,请重新勾选"
          })
        } else {
        this.dialCheckInfo={feeWarnInfo:"",accountName:"上海飞莱达供应链管理有限公司",accountBank:"中国银行上海万科支行",bankAccountCny:"4390817",bankAccountUsd:"",statementWarnInfo:""}
        let requestData = {}
        if(this.pageSkipChecked == false) {
          requestData.overPageCheck = false
          requestData.rcvIds = this.selectTableData.map(item=>item.id)
        } else {
          requestData.overPageCheck = true
          requestData.financePageDTO = this.searchDataDeal()
        }
        this.$http.post(this.$service.getAccountStatement,requestData).then(res=>{
          if(res.code == 200) {
            this.dialFourTable = res.data.fees
            this.dialFourDatas = res.data.summationInfo
            this.dialFourDatas.reconciliationUnit = res.data.checkInfo.reconciliationUnit
            this.dialogFormVisibleFour = true
          } else {
            this.$message.error(res.message)
          }
          
        })
        }
      },
      //生成对账单-导出对账单
      exportAccount(){
        if(Object.values(this.dialCheckInfo).some(item=>item=="")){
          this.$message.warning("请填写全部信息")
          return
        }
        let request ={}
        request.fees = this.dialFourTable
        request.summationInfo = JSON.parse(JSON.stringify(this.dialFourDatas))
        request.checkInfo = this.dialCheckInfo
        request.checkInfo.reconciliationUnit = request.summationInfo.reconciliationUnit
        delete request.summationInfo.reconciliationUnit
        this.$http.post(this.$service.exportCheckPdf,request,{
            responseType: 'arraybuffer'
          }).then(res=>{
            const aLink = document.createElement("a");
            let blob = new Blob([res], {
              type: "application/pdf"
            })
            aLink.href = URL.createObjectURL(blob)
            aLink.setAttribute('download', '应收统计对账单' + '.pdf') 
            aLink.click()
            document.body.appendChild(aLink)
        })
      },
      //核销按钮
      chargeOff(){
        console.log(this.selectTableData)
        if(this.selectTableData.length == 0) {
          this.$message({
            type:'warning',
            message:"请至少勾选一条数据进行核销操作"
          })
        }
        else if(!this.selectTableData.every(item=>item.reconciliationUnit == this.selectTableData[0].reconciliationUnit)) {
          this.$message({
            type:'warning',
            message:"应收对象不一致,请重新勾选"
          })
        }
        else {
          this.chargeOffData = {writeOffAmount:"",writeOffWay:"",payWay:"0",currency:"",userInfo:"",payDate:""},
          this.copyChargeNum=[]
          this.moneyData = [0,0,0]
          this.chargeInfoMethod()
          let requestData = {}
          if(this.pageSkipChecked == true) {
            requestData.financePageDTO = this.searchDataDeal()
            requestData.overPageCheck = true
          } else {
            requestData.overPageCheck = false
            requestData.rcvIds = this.selectTableData.map(item=>item.id)
          }
            

          this.$http.post(this.$service.getWoFrameData,requestData).then(res=>{
            if(res.code == 200){
            let copyChargeMoney = res.data.currencyList
            this.moneyData[0] = res.data.totalArCny
            copyChargeMoney.forEach((item,index)=>{
              //弹框底部未核销金额和已核销金额（需要随币种选择框变化）
            this.copyChargeNum[0] = res.data.arUnWoOrgn
            this.copyChargeNum[1] = res.data.arWoOrgn
            //设置币种选项
            this.$set(this.chargeMoney,index,{label:this.currencyArray[item-1],value:item}) 
            this.dialogFormVisibleThree = true;
          })
          } else {
            this.$message.error(res.message)
          }
        })
        }
      },
      //核销按钮弹框 币种选择框change
      changeCurrency(data){
        let copy = JSON.parse(JSON.stringify(this.copyChargeNum))
        this.moneyData[1]=JSON.parse(copy[0]).filter(item=>item.currency==data)[0].amount
        this.moneyData[2]= JSON.parse(copy[1]).filter(item=>item.currency==data)[0].amount
      },
      //核销按钮弹框确认核销
      confirmReceive(){
        if(Object.values(this.chargeOffData).indexOf("")!=-1) {
          this.$message.warning("请完成信息填写")
          return
        } else if(this.chargeOffData.writeOffAmount > this.moneyData[1]){
          this.$message.warning("核销金额不能大于未核销金额,请重新填写")
          return 
        }
        let requestData = JSON.parse(JSON.stringify(this.chargeOffData))
        requestData.exportWoDTO = {overPageCheck:this.pageSkipChecked}
        if(this.pageSkipChecked == false) {
            requestData.exportWoDTO.rcvIds= this.selectTableData.map(item=>item.id)
        }
        else {
          requestData.exportWoDTO.financePageDTO = this.searchDataDeal()
        } 
        let array = requestData.userInfo.split("-")
        requestData.accountBank = array[0]
        requestData.accountName = array[1]
        requestData.bankAccount = array[2]
        delete requestData.userInfo
        this.$http.post(this.$service.arWriteOff,requestData).then(res=>{
          if(res.code == 200){
            this.$message.success("确认核销成功")
          } else {
            this.$message.error(res.message)
          }
          this.initData(this.searchDataDeal())
          this.dialogFormVisibleThree =false
        })
      },
      //核销次数列点击事件
       getRcvWrite (row){
         
        this.receiveOperate= [{}]
        this.dialogFormVisibleTwo = true
        const copyData = [{}]
        copyData[0].orderNo = row.orderNo
        copyData[0].waybillNo = row.waybillNo
        copyData[0].reconciliationUnit = row.reconciliationUnit
        copyData[0].totalArOrgn = row.totalArOrgn
        this.$http.get(this.$service.searchArList+'?rcvId='+row.id).then(res=>{
          let data =res.data
          data.forEach((item,index)=>{
            if(item.status == -1 ){
              data.forEach((item2,index2)=>{
                if(item2.id == item.id && index2 != index) {
                  item2.deleteId = index+1
                }
              })
            }
          })
          copyData[0].records = data
          this.receiveOperate = copyData
          this.receiveOperate[0].copyId = row.id
        })
        
      },
       //核销次数列确认核销
        confirmReset(index,id,rowId){
          this.$confirm(`确定核销"操作${index+1}"`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.$http.get(this.$service.arRevoke+'?woId='+id).then(data => {
              if(data.code==200){
                   this.$http.get(this.$service.searchArList+'?rcvId='+rowId).then(res=>{
                      let data =res.data
                      data.forEach((item,index)=>{
                        if(item.status == -1 ){
                          data.forEach((item2,index2)=>{
                            if(item2.id == item.id && index2 != index) {
                              item2.deleteId = index+1
                            }
                          })
                        }
                      })
                     console.log(res.data)
                     this.$set(this.receiveOperate[0],"records",res.data)
                     this.$forceUpdate()
                  })
              }
            })
            this.initData(this.searchDataDeal())
          }).catch(() => {
            console.log('取消')
          })
        },
      //数据统计
      getStatistData() {
        this.statistData = {}
        this.errorStatist = false
        this.statistDataShow = !this.statistDataShow
        this.$http.post(this.$service.receivableSum,this.searchDataDeal()).then(res=>{
          this.statistData = {
            totalArCny:res.data.totalArCny.toLocaleString('en-US'),
            totalArOrgn:res.data.totalArOrgn,
            totalRcUnwoCny:res.data.totalRcUnwoCny.toLocaleString('en-US'),
            totalRcUnwoOrgn:res.data.totalRcUnwoOrgn,
            totalRcWoCny:res.data.totalRcWoCny.toLocaleString('en-US'),
            totalRcWoOrgn:res.data.totalRcWoOrgn,
          }
          this.errorStatist =res.data.hasAbNormal
        })
      },
      //表格数据勾选
      handleSelectionChange(e) {
        this.selectTableData = e
      },
      //导出列表
      getExportExcel() {
        if(this.selectTableData.length == 0) {
          this.$message.warning("请至少选择一条信息")
          return 
        }
        let requestData;
        if(this.pageSkipChecked == true) {
          requestData = {
            financePageDTO:this.searchDataDeal(),
            overPageCheck:true,
          }
        } else {
          requestData = {
            rcvIds:this.selectTableData.map(item=>item.id),
            overPageCheck:false,
          }
        }
        this.$http.post(this.$service.exportWoListExcel,requestData,{
            responseType: 'arraybuffer'
          }).then(res=>{
            const aLink = document.createElement("a");
            let blob = new Blob([res], {
              type: "application/vnd.ms-excel"
            })
            aLink.href = URL.createObjectURL(blob)
            aLink.setAttribute('download', '应收统计' + '.xlsx') 
            aLink.click()
            document.body.appendChild(aLink)
        })
      },
      //切换tab
      tabClickData(){
        this.statistDataShow = false
        this.pageSkipChecked = false
        this.initData(this.searchDataDeal())
      },
      
      //订单号详情
      showData(id,orderNo){
        this.dialogTitleOne = ""
        this.dialogTitleOne = orderNo
        this.dialogFormVisibleOne = true
        this.$http.get(this.$service.searchOrderDetail+`?orderId=${id}`).then(data=>{
            this.tableDataOne = data.data.arOrderPriceList
            this.tableDataThree = data.data.orderPresentLogs
            this.tableDataTwo = [{
              customerName:data.data.customerName,
              agentName:data.data.agentName,
              airCompanyCode:data.data.airCompanyCode,
              pol:data.data.pol,
              pod:data.data.pod,
              cargoInfo:data.data.cargoName+","+data.data.inboundPiece+","+data.data.inboundCbm+","+data.data.inboundWeight+","+data.data.inboundVwr,
              operation:data.data.pscsName+","+data.data.mscsName+","+data.data.principalName
              
            }]
            this.totalArOrgn = data.data.totalArOrgn
            this.totalArCny = data.data.totalArCny
            this.payWay = data.data.payWay
        })
      },
      //跨页全选禁用
      ifDisabled(row) {
        if(this.pageSkipChecked == true) {
          return false
        } else {
          return true
        }
      },
        //跨页全选按钮
    selectAllTable(){
        for(let i=0;i<this.$refs.multipleTable.length;i++){
          this.$refs.multipleTable[i].clearSelection();
          for(let j=0;j<this.tableData.length;j++){
            if(this.pageSkipChecked == true ) {
							this.$refs.multipleTable[i].toggleRowSelection(this.tableData[j]);
						} else {
              this.$refs.multipleTable[i].clearSelection();;
            }
          }
        }
      },
       //搜索表单中多选框控制
      dealAllChange (){
        if(this.selectResult.rcvWriteOffStatusList.indexOf("") != -1) {
          this.selectResult.rcvWriteOffStatusList = [""]
        }
      },
      //核销按钮收款账户信息
      chargeInfoMethod(keyWord) {
        if(!keyWord) {
          keyWord = ''
        }
        this.$http.get(this.$service.searchByAccount + '?account='+ keyWord).then(data=>{
          this.chargeUserInfo = data.data
        })
      },
        //起始港三字码
      initAirportSearchByPage(keyWord, type) {
        if (!keyWord) {
          keyWord = ''
        }
        this.$http.get(this.$service.airportSearchByPage + '?keyWord=' + keyWord).then((data) => {
          this.loading = false
          if (data.code == 200) {
            if (type == '起始港') {
              this.polOpt = data.data.records
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
        this.initAirportSearchByPage(keyWord, '起始港')
      },
      podMethod(keyWord) {
        this.loading = true
        this.initAirportSearchByPage(keyWord, '目的港')
      },
      //代理公司
      initAgentList(agentName) {
        if (!agentName) {
          agentName = ''
        }
        var data = {
          agentName: agentName
        }
        this.$http.post(this.$service.agentList, data).then((data) => {
          this.loading = false
          if (data.code == 200) {
            this.agentOpt = data.data.records
          } else {
            this.$message.error(data.message)
          }
        })
      },
      agentMethod(agentName) {
        this.initAgentList(agentName)
      },
       //航司
      initCompanySearchByPage(keyWord) {
        if (!keyWord) {
          keyWord = ''
        }
        this.$http.get(this.$service.companySearchByPage + '?keyWord=' + keyWord).then((data) => {
          this.loading = false
          if (data.code == 200) {
            this.airCompanyCodeOpt = data.data.records
          } else {
            this.$message.error(data.message)
          }
        })
      },
      companyMethod(keyWord) {
        this.initCompanySearchByPage(keyWord)
      },
      //售前售中客服、航线负责人数据
      operateData (){
        this.$http.get(this.$service.userSearch+'?roleName=售前客服&pageSize=50000').then(data=>{
          this.payBefore = data.data.records
        })
        this.$http.get(this.$service.userSearch+'?roleName=售中客服&pageSize=50000').then(data=>{
          this.paying = data.data.records
        })
        this.$http.get(this.$service.userSearch+'?roleName=航线负责人&pageSize=50000').then(data=>{
          this.airManger = data.data.records
        })
      },
      //查询数据处理
      searchDataDeal (){
        let copyData = JSON.parse(JSON.stringify(this.selectResult))
        if(copyData.rcvWriteOffStatusList.indexOf("")!=-1) delete copyData.rcvWriteOffStatusList
        copyData.woStatus = ["可操作","业务修改中","异常"].indexOf(this.typeCode)
        copyData.pageSize =this.pageSize
        copyData.pageNum =this.pageNum
        return copyData
      },
      //查询接口
      initData (useData) {
        this.statistDataShow = false
        this.$http.post(this.$service.receivableSearch,useData).then(res=>{
          this.tableData = res.data.page.records
          this.tabNum = [res.data.countAuth,res.data.countNoAuth,res.data.countErr]
          this.total = res.data.page.total
           setTimeout(()=>{
              this.selectAllTable()
            },0)
        })
      },
      searchClick(){
        this.pageSkipChecked = false
        this.initData(this.searchDataDeal())
      },
      restClick(){
          this.selectResult={
        orderNos:"",
        waybillNos:"",
        reconciliationUnit:"",
        customerName:"",
        agentId:"",
        airCompanyCode:"",
        pol:"",
        pod:"",
        payWay:"",
        rcvWriteOffStatusList:[""],
        mscsId:"",
        pscsId:"",
        startDepartureDate:"",
        endDepartureDate:"",
        startOrderTime:"",
        endOrderTime:"",
        principalId:"",
    }
      },
      handleSizeChange(e) {
        this.pageNum = 1
        this.pageSize = e
        this.initData(this.searchDataDeal())

      },
      handleCurrentChange(e) {
        this.pageNum = e
        this.initData(this.searchDataDeal())
      },
    },
    filters:{
      getOrgn(orgn) {
        if (!orgn) {
          return;
        }
        orgn = JSON.parse(orgn);
        var totalOrgn = ''
        var value1 = 0
        var value2 = 0
        var value3 = 0
        var value4 = 0
        var value5 = 0
        // HK$ $ € ￡
        for (var i = 0; i < orgn.length; i++) {
          if (orgn[i].currency == '1') {
            value1 += orgn[i].amount
          } else if (orgn[i].currency == '2') {
            value2 += orgn[i].amount
          } else if (orgn[i].currency == '3') {
            value3 += orgn[i].amount
          } else if (orgn[i].currency == '4') {
            value4 += orgn[i].amount
          } else if (orgn[i].currency == '5') {
            value5 += orgn[i].amount
          }
        }
        totalOrgn = ''
        totalOrgn += value1 ? value1.toLocaleString('en-US') + 'CNY' + '+' : ''
        totalOrgn += value2 ? value2.toLocaleString('en-US') + 'HKD' + '+' : ''
        totalOrgn += value3 ? value3.toLocaleString('en-US') + 'USD' + '+' : ''
        totalOrgn += value4 ? value4.toLocaleString('en-US') + 'EUR' + '+' : ''
        totalOrgn += value5 ? value5.toLocaleString('en-US') + 'GBP' + '+': ''
        totalOrgn = totalOrgn.substring(0, totalOrgn.length - 1)
        return totalOrgn;
      },
      getExchangeRate(exchangeRate) {
        let copy = JSON.parse(exchangeRate)
        if (typeof (exchangeRate) == "undefined") {
          return "";
        }
        var totalOrgn = ''
        var value1 = 0
        var value2 = 0
        var value3 = 0
        var value4 = 0
        var value5 = 0
        for (var i = 0; i < copy.length; i++) {
          if (copy[i].currency == '1') {
            value1 += copy[i].amount
          } else if (copy[i].currency == '2') {
            value2 += copy[i].amount
          } else if (copy[i].currency == '3') {
            value3 += copy[i].amount
          } else if (copy[i].currency == '4') {
            value4 += copy[i].amount
          } else if (copy[i].currency == '5') {
            value5 += copy[i].amount
          }
        }
        totalOrgn = ''
        totalOrgn += value1 || value1 == 0 ? 'CNY:' + value1 + '+' : ''
        totalOrgn += value2 ? 'HKD:' + value2 + '+' : ''
        totalOrgn += value3 ? 'USD:' + value3 + '+' : ''
        totalOrgn += value4 ? 'EUR:' + value4 + '+' : ''
        totalOrgn += value5 ? 'GBP:' + value5 : ''
        totalOrgn = totalOrgn.substring(0, totalOrgn.length - 1)
        return totalOrgn;
      },
      getWriteOffStatus(data){
        let array = ["未对账未核销","部分对账未核销","已对账未核销","未对账部分核销","部分对账部分核销","已对账部分核销","未对账已核销","部分对账已核销","已对账已核销"]
        return array[data]
      }
    },
    components:{
      Table
    }
      
  }
</script>

<style lang="less">
    .orderNoReceive {
      width:200px!important;
      height:200px!important;
      overflow:scroll!important
    }
</style>
<style scoped lang="less">

.statist {
    margin-left:15px;
    .statists {
      margin-top:10px;
    }
  }
/deep/.pageSkip {
        padding:3px 5px!important
  }
/deep/ .el-table {
          .cell {
            text-align: center;
          }
      } 
  .content-wrapper {
    width: 100%;
    box-sizing: border-box;
    /*height: 100%;*/
    padding: 20px;
    overflow: hidden;
    background-color: #f3f6f9 !important;
    .content {
      width: 100%;
      .content-search-normal {
        padding: 20px 20px 0 20px !important;
        background: #fff;
        .formItem {
          width: 320px;
          margin-top: -5px;
        }
        .operateButton {
           display: flex;
           justify-content: flex-end;
           margin-bottom: -10px;
           button {
             margin: 0px 10px 20px 10px;
           }
          }
      } 
    }
  }
  .el-form--inline .el-form-item {
    margin-bottom: 20px;
    margin-right: 0px;
    vertical-align: bottom;
  }
</style>
