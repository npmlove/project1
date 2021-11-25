<template>
  <div class="content-wrapper">
    <el-form :inline="true" size="medium" class="demo-form-inline">
      <div class="content-search-normal">
        <el-form-item label="访问日期">
          <el-date-picker
            v-model="accessDate"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd"
            start-placeholder="起始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-button @click="chooseDate(1)" :class="checkButton==1?'buttonDiv':'buttonColor2'">
              今天
            </el-button>
            <el-button @click="chooseDate(2)" :class="checkButton==2?'buttonDiv':'buttonColor2'">
              昨天
            </el-button>
            <el-button @click="chooseDate(3)" :class="checkButton==3?'buttonDiv':'buttonColor2'">
              近七天
            </el-button>
            <el-button @click="chooseDate(4)" :class="checkButton==4?'buttonDiv':'buttonColor2'">
              近三十天
            </el-button>
          </el-row>
        </el-form-item>

        <el-form-item label="运单号">
          <el-input style="width: 200px;" size="medium" :maxlength="11" onkeyup="value=value.replace(/[^\d]/g, '')"
                    v-model="awb" clearable
                    placeholder="请输入运单号">
            <a slot="prefix" class="el-input__icon el-icon-search" @click="searchClick"></a>
          </el-input>
        </el-form-item>
        <el-form-item label="航司">
          <el-input style="width: 200px;" size="medium" :maxlength="20" v-model="airCPCode" clearable
                    placeholder="请输入航司">
            <a slot="prefix" class="el-input__icon el-icon-search" @click="searchClick"></a>
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
      <el-button @click="chooseDate" size="medium" :class="checkButton1==7?'buttonDiv':'buttonColor2'">
        全部
      </el-button>
      <el-button @click="chooseDate(5)" size="medium" :class="checkButton1==5?'buttonDiv':'buttonColor2'">
        已支持
      </el-button>
      <el-button @click="chooseDate(6)" size="medium" :class="checkButton1==6?'buttonDiv':'buttonColor2'">
        未支持
      </el-button>
      <el-table
        :data="tableData"
        border
        header
        max-height="750"
        class="finance-talbe"
        :row-class-name="tableRowClassName"
        style="width: 100%">
        <template slot="empty">
          <img class="data-pic" src="../../assets/kong-icon.png"/>
          <p>暂无数据</p>
        </template>
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="airCPCode" label="航司" min-width="80"></el-table-column>
        <el-table-column prop="totalNum" label="访问次数" min-width="80" sortable
                         :sort-method="sortByDate1"></el-table-column>
        <el-table-column prop="successNum" label="成功次数" min-width="80" sortable
                         :sort-method="sortByDate2"></el-table-column>
        <el-table-column prop="failNum" label="失败次数" min-width="80" sortable
                         :sort-method="sortByDate3"></el-table-column>
        <el-table-column prop="rate" label="成功率" min-width="80" sortable :sort-method="sortByDate4"></el-table-column>
        <el-table-column
          fixed="right"
          v-if="operation.show"
          :label="operation.label"
          :min-width="operation.width"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <a v-for="(item, index) in operation.options" @click.prevent="handleClick( scope.row)">
              <span style="color: #2273CE;">{{ item.label }}</span>
            </a>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="totalNum>0">
        总次数:{{ totalNum }},成功率:{{ succRate }}%,失败率:{{ failRate }}%
      </div>
    </div>
    <div class="divright">
      <el-button @click="searchClick(null,2)" size="medium" :class="checkButton2==8?'buttonDiv':''">
        全部
      </el-button>
      <el-button @click="searchClick(null,1)" size="medium" :class="checkButton2==9?'buttonDiv':''">
        成功
      </el-button>
      <el-popover
        placement="right-start"
        width="160"
        v-model="visible">
        <div>
          <el-checkbox v-model="failType1" @change="changeErrType('1',failType1)" style="display:block;"
                       label="不支持该航司"></el-checkbox>
          <el-checkbox v-model="failType2" @change="changeErrType('2',failType2)" style="display:block;"
                       label="官网访问失败"></el-checkbox>
          <el-checkbox v-model="failType3" @change="changeErrType('3',failType3)" style="display:block;"
                       label="未找到该单号"></el-checkbox>
          <el-checkbox v-model="failType4" @change="changeErrType('4',failType4)" style="display:block;"
                       label="未找到该单号"></el-checkbox>
        </div>
        <el-button slot="reference" @click="searchClick(null,0)" size="medium" :class="checkButton2==10?'buttonDiv':''">
          失败
          <i class="el-icon-arrow-down "></i>
        </el-button>
      </el-popover>


      <el-table
        :data="detailData"
        border
        stripe
        header
        class="finance-talbe"
        style="width: 100%">
        <template slot="empty">
          <img class="data-pic" src="../../assets/kong-icon.png"/>
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
      <div v-show="detailsTotalNum>0">总次数:{{ detailsTotalNum }},成功率:{{ detailsSuccRate }}%,失败率:{{
          detailsFailRate
        }}%
      </div>
      <!-- 分页 -->
      <div v-show="total>10">
        <el-pagination
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="pageSize"
          :current-page="pageNum"
          @current-change="handleCurrent"
          @size-change="handleSize"
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
        failType1: false,
        failType2: false,
        failType3: false,
        failType4: false,
        checkButton: 0,
        errType: [],
        checkButton1: 0,
        checkButton2: 0,
        isSuccess: '',
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
          }
          ]
        },
        accessDate: [],
        support: null,
        labelPosition: 'right',
        dialogTitle: '',
        dialogFormVisible: false,
      }
    },
    mounted() {
      this.accessDate[0] = this.format(new Date(new Date().toLocaleDateString()).getTime())
      this.accessDate[1] = this.format(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
      this.initListSearch()
    },
    methods: {
      //获取代理列表
      initListSearch(filter) {
        var params = {
          fromDate: this.accessDate === '' ? '' : this.accessDate[0] + " 00:00:00",
          toDate: this.accessDate === '' ? '' : this.accessDate[1] + " 23:59:59",
        }
        this.$http.post(this.$service.trackList, params).then(data => {
          if (data.code == 200) {
            if (filter === 5) {
              data.data.airCompanyDate = data.data.airCompanyDate.filter(item => item.isSupport == 1)
            } else if (filter === 6) {
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
          fromDate: this.accessDate === '' ? '' : this.accessDate[0] + " 00:00:00",
          toDate: this.accessDate === '' ? '' : this.accessDate[1] + " 23:59:59",
          awb: airCPCode == null ? this.awb : null,
          airCPCode: airCPCode != null ? airCPCode : this.airCPCode,
          isSuccess: isSuccess == null ? this.support : isSuccess,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          errType: this.getParam()
        }
        this.$http.post(this.$service.trackDetail, params).then(data => {
          if (data.code == 200) {
            this.total = parseInt(data.data.detailsTotalNum)
            this.detailsTotalNum = data.data.detailsTotalNum
            this.detailsSuccRate = data.data.detailsSuccRate
            this.detailsFailRate = data.data.detailsFailRate

            if (this.failType1) {
              this.detailData.push(data.data.monitors.filter(item => item.failType == 1));
            }
            if (this.failType2) {
              this.detailData.push(data.data.monitors.filter(item => item.failType == 2));
            }
            if (this.failType3) {
              this.detailData.push(data.data.monitors.filter(item => item.failType == 3));
            }
            if (this.failType4) {
              this.detailData.push(data.data.monitors.filter(item => item.failType == 4));
            }
            if (this.detailData.length == 0) {
              this.detailData = data.data.monitors;
            }
          } else {
            this.$message.error(data.message)
          }
        })
      },
      chooseDate(type) {
        if (type === 1) {
          this.checkButton = 1;
          this.accessDate[0] = this.format(new Date(new Date().toLocaleDateString()).getTime())
          this.accessDate[1] = this.format(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
        } else if (type === 2) {
          this.checkButton = 2;
          this.accessDate[0] = this.format(new Date(new Date().toLocaleDateString()).getTime() - 24 * 60 * 60 * 1000);
          this.accessDate[1] = this.format(new Date(new Date().toLocaleDateString()).getTime() - 1);
        } else if (type === 3) {
          this.checkButton = 3;
          this.accessDate[0] = this.format(new Date(new Date().toLocaleDateString()).getTime() - 7 * 24 * 60 * 60 * 1000);
          this.accessDate[1] = this.format(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
        } else if (type === 4) {
          this.checkButton = 4;
          this.accessDate[0] = this.format(new Date(new Date().toLocaleDateString()).getTime() - 30 * 24 * 60 * 60 * 1000);
          this.accessDate[1] = this.format(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
        } else if (type === 5) {
          this.checkButton1 = 5;
        } else if (type === 6) {
          this.checkButton1 = 6;
        } else {
          this.checkButton1 = 7;
        }
        this.initListSearch(type)
      },
      //查询
      getParam() {
        var result = '';
        this.errType.forEach(x => result = result + x + ",")
        var x=result.substring(0, result.length - 1)
        return x.length==0?"1,2,3,4":x
      },
      searchClick(type, isSuccess) {
        if (isSuccess === 1) {
          this.checkButton2 = 9
        } else if (isSuccess === 0) {
          this.checkButton2 = 10
        } else if (isSuccess === 2) {
          this.checkButton2 = 8
          isSuccess = null
        }
        this.isSuccess = isSuccess
        this.pageSize = 10
        this.pageNum = 1
        // this.initListSearch(type)
        this.initDetailSearch(null, isSuccess)
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
      changeErrType(data, option) {
        if (option) {
          this.errType.push(data)
        } else {
          var index = this.errType.indexOf(data);
          this.errType.splice(index, 1)
        }
      },
      restClick() {
        this.airCPCode = null
        this.awb = null
        this.accessDate[0] = this.format(new Date(new Date().toLocaleDateString()).getTime())
        this.accessDate[1] = this.format(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);

        this.pageSize = 10
        this.pageNum = 1
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

        this.initDetailSearch(row.airCPCode)
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
      tableRowClassName({row, rowIndex}) {
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

  .wrapper, .content {
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
    color: white
  }

  .buttonColor2 {
    background: #FFFFFF;
    color: #2273ce
  }

  /*鼠标点击后移开，恢复本身样式*/
  .buttonDiv, .buttonDiv:focus:not(.buttonDiv:hover) {
    color: #FFFFFF;
    background: #2273ce;
  }

  /*鼠标悬浮，没有按下；鼠标按下后抬起，没有移开*/
  .buttonDiv:focus, .buttonDiv:hover {
    color: #FFFFFF;
    background: #2273ce;
  }

  /*鼠标按下，没有抬起*/
  .buttonDiv:active {
    color: #FFFFFF;
    background: #2273ce;
  }

</style>
