<template>
<div class="content-wrapper">
  <el-form :inline="true" size="medium" class="demo-form-inline">
    <div class="content-search-normal">
      <el-form-item label="访问日期">
        <el-date-picker v-model="accessDate" type="daterange" @change="chooseDate();checkButton=0" range-separator="至" value-format="yyyy-MM-dd" start-placeholder="起始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-button @click="chooseDate(1);checkButton=1;clickHandler($event)" :class="{'buttonColor1': checkButton==1}">
            今天
          </el-button>
          <el-button id="tt" @click="chooseDate(2);checkButton=2;clickHandler($event)" :class="{'buttonColor1': checkButton==2}">
            昨天
          </el-button>
          <el-button @click="chooseDate(3);checkButton=3;clickHandler($event)" :class="{'buttonColor1': checkButton==3}">
            近七天
          </el-button>
          <el-button @click="chooseDate(4);checkButton=4;clickHandler($event)" :class="{'buttonColor1': checkButton==4}">
            近三十天
          </el-button>
        </el-row>
      </el-form-item>

      <el-form-item label="运单号">
        <el-input style="width: 200px;" size="medium" :maxlength="11" onkeyup="value=value.replace(/[^\d]/g, '')" v-model="awb" clearable placeholder="请输入运单号" @blur="searchClick(3)">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-form-item>
      <el-form-item label="航司">
        <el-input style="width: 200px;" size="medium" :maxlength="20" v-model="airCPCode" clearable placeholder="请输入航司" @blur="searchClick(3)">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-form-item>


      <!--        <el-form-item style="float: right;margin-right: 0">
                  <el-row>
        &lt;!&ndash;            <el-button @click="newAdd" size="medium">新增</el-button>&ndash;&gt;
                    <el-button @click="searchClick" size="medium" type="primary">搜索</el-button>
                    <el-button @click="restClick" size="medium" type="primary">清空</el-button>
                  </el-row>
                </el-form-item>-->
    </div>
  </el-form>
  <div class="divleft">
    <el-button @click="isSupport();checkButtonOne=7;clickHandler($event)" size="medium" :class="{'buttonColor1': checkButtonOne==7}">
      全部
    </el-button>
    <el-button @click="isSupport(1);checkButtonOne=5;clickHandler($event)" size="medium" :class="{'buttonColor1': checkButtonOne==5}">
      已支持
    </el-button>
    <el-button @click="isSupport(2);checkButtonOne=6;clickHandler($event)" size="medium" :class="{'buttonColor1': checkButtonOne==6}">
      未支持
    </el-button>
    <el-table :data="tableData" border header max-height="500" class="finance-talbe" :row-class-name="tableRowClassName" style="width: 100%;;marginTop:20px;">
      <template slot="empty">
        <img class="data-pic" src="../../assets/kong-icon.png" />
        <p>暂无数据</p>
      </template>
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column prop="airCPCode" label="航司" min-width="80"></el-table-column>
      <el-table-column prop="totalNum" label="访问次数" min-width="80" sortable :sort-method="sortByDate1"></el-table-column>
      <el-table-column prop="successNum" label="成功次数" min-width="80" sortable :sort-method="sortByDate2"></el-table-column>
      <el-table-column prop="failNum" label="失败次数" min-width="80" sortable :sort-method="sortByDate3"></el-table-column>
      <el-table-column prop="rate" label="成功率" min-width="80" sortable :sort-method="sortByDate4"></el-table-column>
      <el-table-column fixed="right" v-if="operation.show" :label="operation.label" :min-width="operation.width" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <a v-for="(item, index) in operation.options" @click.prevent="handleClick( scope.row)">
            <span style="color: #2273CE;">{{ item.label }}</span>
          </a>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="totalNum>0" style="marginTop:20px;textAlign: right;fontSize:14px;">
      总次数:{{ totalNum }},成功率:{{ succRate }}%,失败率:{{ failRate }}%
    </div>
  </div>
  <div class="divright">
    <el-button @click="searchClick(2);clickHandler($event)" size="medium" :class="{'buttonColor1': checkButtonTwo==8}">
      全部
    </el-button>
    <el-button @click="searchClick(1);clickHandler($event)" size="medium" :class="{'buttonColor1': checkButtonTwo==9}">
      成功
    </el-button>
    <el-popover placement="right-start" width="160" v-model="visible" trigger="manual">
      <div>
        <el-checkbox-group v-model="errType" :min="1">
          <el-checkbox v-for="(failType,index) in failTypeList" :label="index+1" :key="index+1" @change="initDetailSearch()">{{failType}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <el-button slot="reference" @click="searchClick(0);clickHandler($event)" size="medium" :class="{'buttonColor1': checkButtonTwo==10}">
        失败
        <i class="el-icon-arrow-down  " @click="visible = !visible;clickHandler($event)"></i>
      </el-button>
    </el-popover>


    <el-table :data="detailData" max-height="500" border stripe header class="finance-talbe" style="width: 100%;marginTop:20px;">
      <template slot="empty">
        <img class="data-pic" src="../../assets/kong-icon.png" />
        <p>暂无数据</p>
      </template>
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column prop="airCompany" label="航司" min-width="80"></el-table-column>
      <el-table-column prop="awb" label="运单号" min-width="80"></el-table-column>
      <el-table-column prop="errMessage" label="查询结果" min-width="80">
        <template slot-scope="scope">
          {{ scope.row.isSuccessed == 1 ? "成功" : scope.row.errMessage }}
        </template>
      </el-table-column>
      <el-table-column prop="repAirNeedTime" label="查询时长" min-width="80"></el-table-column>
      <el-table-column prop="lastQueryTime" label="访问时间" min-width="80"></el-table-column>
    </el-table>
    <div v-show="detailsTotalNum>0" style="marginTop:20px;textAlign: right;fontSize:14px;">总次数:{{ detailsTotalNum }},成功率:{{ detailsSuccRate }}%,失败率:{{
          detailsFailRate
        }}%
    </div>
    <!-- 分页 -->
    <div v-show="total>10">
      <el-pagination :total="total" layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10, 20, 30, 40, 50]" :page-size="pageSize" :current-page="pageNum" @current-change="handleCurrent" @size-change="handleSize"
        style="text-align: right;padding: 19px 30px 18px 0;background: #fff">
      </el-pagination>


    </div>
  </div>

</div>
</template>

<script>
import Table from '@/components/Table'
import {
  toData
} from '@/util/assist'

export default {

  data() {
    return {
      //table
      failTypeList: ['不支持该航司', '官网访问失败', '未找到该单号', '未知错误'],
      failType1: true,
      failType2: true,
      failType3: true,
      failType4: true,
      checkButton: 1,
      errType: [1, 2, 3, 4],
      visible: false,
      checkButtonOne: 7,
      checkButtonTwo: 8,
      isSuccess: null,
      tableData: [],
      detailData: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      awb: null,
      totalNum: 0,
      succRate: 0,
      failRate: 0,
      detailsTotalNum: 0,
      detailsSuccRate: 0,
      detailsFailRate: 0,
      airCPCode: null,
      // 列
      // 操作
      operation: {
        show: true,
        label: '操作',
        width: '160',
        options: [{
          label: '查看',
          method: 'edit'
        }]
      },
      accessDate: [],
      accessDay: [],
      support: null,
      labelPosition: 'right',
      dialogTitle: '',
      dialogFormVisible: false,
    }
  },
  mounted() {
    this.accessDay[0] = this.format(new Date(new Date().toLocaleDateString()).getTime())
    this.accessDay[1] = this.format(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
    // this.checkButton = 1
    // this.checkButtonOne = 7
    // this.checkButtonTwo = 8
    this.initListSearch()
    this.initDetailSearch()
  },
  methods: {
    //获取代理列表
    initListSearch(isSupport) {
      this.detailData = []
      this.tableData = []

      var params = {
        fromDate: this.accessDate.length == 0 ? this.accessDay[0] : this.accessDate[0] + " 00:00:00",
        toDate: this.accessDate.length == 0 ? this.accessDay[1] : this.accessDate[1] + " 23:59:59",
      }
      this.$http.post(this.$service.trackList, params).then(data => {
        if (data.code == 200) {
          if (isSupport === 1) {
            data.data.airCompanyDate = data.data.airCompanyDate.filter(item => item.isSupport == 1)
          } else if (isSupport === 2) {
            data.data.airCompanyDate = data.data.airCompanyDate.filter(item => item.isSupport != 1)
          }
          this.tableData = data.data.airCompanyDate
          this.totalNum = data.data.totalNum
          this.succRate = data.data.succRate
          this.failRate = data.data.failRate
        } else {
          this.$message.error(data.message)
        }
      })
    },
    initDetailSearch(airCPCode, isSuccess) {

      var params = {
        fromDate: this.accessDate.length == 0 ? this.accessDay[0] : this.accessDate[0] + " 00:00:00",
        toDate: this.accessDate.length == 0 ? this.accessDay[1] : this.accessDate[1] + " 23:59:59",
        awb: airCPCode == null ? this.awb == "" ? null : this.awb : null,
        airCPCode: airCPCode != null ? airCPCode : this.airCPCode == "" ? null : this.airCPCode,
        isSuccess: isSuccess == null ? this.isSuccess : isSuccess,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        errType: this.isSuccess == null || this.isSuccess == 1 ? null : this.getParam()
      }
      if ((params.airCPCode == null || params.airCPCode == '') && (params.awb == null || params.awb == '')) {
        return;
      }
      this.$http.post(this.$service.trackDetail, params).then(data => {
        if (data.code == 200) {
          this.total = params.isSuccess == 0 ? data.data.detFailTimes :
            params.isSuccess == 1 ? data.data.detSuccTimes :
            data.data.detailsTotalNum;
          this.detailsTotalNum = data.data.detailsTotalNum
          this.detailsSuccRate = data.data.detailsSuccRate
          this.detailsFailRate = data.data.detailsFailRate
          this.detailData = data.data.monitors;
        } else {
          this.$message.error(data.message)
        }
      })
    },

    clickHandler(evt) {
      let target = evt.target;
      if (target.nodeName == "SPAN") {
        target = evt.target.parentNode;
      }
      if (target.nodeName == "I") {
        target = evt.target.parentNode.parentNode;
      }
      target.blur();
    },
    chooseDate(type) {
      this.awb = null
      this.airCPCode = null
      if (type === 1) {
        this.accessDay[0] = this.format(new Date(new Date().toLocaleDateString()).getTime())
        this.accessDay[1] = this.format(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
        this.checkButtonOne = 7
        this.accessDate = []
      } else if (type === 2) {
        this.accessDay[0] = this.format(new Date(new Date().toLocaleDateString()).getTime() - 24 * 60 * 60 * 1000);
        this.accessDay[1] = this.format(new Date(new Date().toLocaleDateString()).getTime() - 1);
        this.checkButtonOne = 7
        this.accessDate = []
      } else if (type === 3) {
        this.accessDay[0] = this.format(new Date(new Date().toLocaleDateString()).getTime() - 7 * 24 * 60 * 60 * 1000);
        this.accessDay[1] = this.format(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
        this.checkButtonOne = 7
        this.accessDate = []
      } else if (type === 4) {
        this.accessDay[0] = this.format(new Date(new Date().toLocaleDateString()).getTime() - 30 * 24 * 60 * 60 * 1000);
        this.accessDay[1] = this.format(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
        this.checkButtonOne = 7
        this.accessDate = []
      }
      this.initListSearch()
      // this.initDetailSearch()
    },
    isSupport(type) {
      if (type === 1) {
        this.initListSearch(type)
      } else {
        this.initListSearch(type)
      }
    },
    //查询
    getParam() {
      var result = '';
      this.errType.forEach(x => result = result + x + ",")
      var x = result.substring(0, result.length - 1)
      return x.length == 0 ? "1,2,3,4" : x
    },
    searchClick(isSuccess) {

      if (isSuccess === 1) {
        this.visible = false
        this.checkButtonTwo = 9
      } else if (isSuccess === 0) {
        this.checkButtonTwo = 10
      } else if (isSuccess === 2 || isSuccess === 3) {
        this.visible = false
        this.checkButtonTwo = 8
        isSuccess = null
      }
      this.isSuccess = isSuccess
      this.pageSize = 10
      this.pageNum = 1
      this.initDetailSearch(null, isSuccess)
      this.initListSearch()

    },
    //清空
    format(date) {
      //shijianchuo是整数，否则要parseInt转换
      var time = new Date(date);
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s;
    },
    //清空
    restClick() {
      this.airCPCode = null
      this.awb = null
      this.accessDate[0] = this.format(new Date(new Date().toLocaleDateString()).getTime())
      this.accessDate[1] = this.format(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
      this.checkButton = 1
      this.checkButtonOne = 7
      this.checkButtonTwo = 8
      this.pageSize = 10
      this.pageNum = 1
      this.tableData = []
      this.detailData = []
      this.initListSearch()
    },
    // 页码跳转
    handleCurrent(e) {
      this.pageNum = e
      this.initDetailSearch(null, this.isSuccess)
    },
    handleSize(e) {
      this.pageSize = e
      this.initDetailSearch(null, this.isSuccess)
    },
    //操作
    handleClick(row) {
      // this.airCPCode = row.airCPCode
      this.checkButtonTwo = 8
      this.awb = null
      this.airCPCode = row.airCPCode
      this.isSuccess = null
      this.initDetailSearch()
    },
    sortByDate1(obj1, obj2) {
      let val1 = obj1.totalNum
      let val2 = obj2.totalNum
      return val1 - val2
    },
    sortByDate2(obj1, obj2) {
      let val1 = obj1.successNum
      let val2 = obj2.successNum
      return val1 - val2
    },
    sortByDate3(obj1, obj2) {
      let val1 = obj1.failNum
      let val2 = obj2.failNum
      return val1 - val2
    },
    tableRowClassName({
      row,
      rowIndex
    }) {
      if (row.isSupport == '0') {
        return 'warning-row';
      } else if (rowIndex % 2 == 0) {
        return 'row1';
      } else {
        return 'row2';

      }
    },
    sortByDate4(obj1, obj2) {
      let val1 = obj1.rate
      let val2 = obj2.rate
      return val1 - val2
    },
    companyMethod(keyWord) {
      this.initCompanySearchByPage(keyWord)
    },
    //航司公司
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
    //操作
    handleClick(row) {
      // this.airCPCode = row.airCPCode
      this.checkButtonTwo = 8
      this.awb = null
      this.airCPCode = row.airCPCode
      this.isSuccess = null
      this.initDetailSearch()
    },
    sortByDate1(obj1, obj2) {
      let val1 = obj1.totalNum
      let val2 = obj2.totalNum
      return val1 - val2
    },
    sortByDate2(obj1, obj2) {
      let val1 = obj1.successNum
      let val2 = obj2.successNum
      return val1 - val2
    },
    sortByDate3(obj1, obj2) {
      let val1 = obj1.failNum
      let val2 = obj2.failNum
      return val1 - val2
    },
    tableRowClassName({
      row,
      rowIndex
    }) {
      if (row.rate == '0.0') {
        return 'warning-row';
      } else if (rowIndex % 2 == 0) {
        return 'row1';
      } else {
        return 'row2';

      }
    },
    sortByDate4(obj1, obj2) {
      let val1 = obj1.rate
      let val2 = obj2.rate
      return val1 - val2
    }

  },
  watch: {
    tableData(idx) {
      return idx
    }
  },
  components: {
    Table
  }
}
</script>

<style>


@import url("../../assets/icon/iconfont.css");

.content-wrapper {
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  overflow: hidden;
  background-color: #f3f6f9 !important;
}

.el-table .warning-row {
  background: #f28080;
}

.el-table .row1 {
  background: #ffffff;
}

.el-table .row2 {
  background: #F9F9F9;
}

.el-form {
  background-color: #FFF;
}

.el-form--inline .el-form-item {
  margin-bottom: 0;
  vertical-align: bottom;
}

.wrapper,
.content {
  width: 100%;
  background-color: #fff;
}

.content-search-normal {
  padding: 20px !important;
  background: #fff;
}

.el-dialog {
  width: 300px;
  min-width: 500px !important;
}

.divleft {
  float: left;
  width: 49%;
  border: 1px solid #fff
}

.divright {
  float: right;
  width: 50%;
  border: 1px solid #fff
}

.buttonColor1 {
  background: #2273ce;
  color: #FFFFFF;
}

.buttonColor2 {
  background: #FFFFFF;
  color: #2273ce
}

/*鼠标点击后移开，恢复本身样式*/
.buttonDiv,
.buttonDiv:focus:not(.buttonDiv:hover) {
  color: #FFFFFF;
  background: #2273ce;
}

/*鼠标悬浮，没有按下；鼠标按下后抬起，没有移开*/
.buttonDiv:focus,
.buttonDiv:hover {
  background: #2273ce;
  border: 1px solid #2794f8 !important;
  color: #FFFFFF;
}

/*鼠标按下，没有抬起*/
.buttonDiv:active {
  background: #2273ce;
  color: #FFFFFF;
}


</style>
