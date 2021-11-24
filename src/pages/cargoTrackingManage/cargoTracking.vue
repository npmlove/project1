<template>
  <div class="content-wrapper">
    <el-form :inline="true" size="medium" class="demo-form-inline">
      <div class="content-search-normal">

        <el-form-item>
          <el-row>
            <el-button @click="chooseDate(1)"  type="primary" plain>
              今天
            </el-button>
            <el-button @click="chooseDate(2)"  type="primary" plain>
              昨天
            </el-button>
            <el-button @click="chooseDate(3)"  type="primary" plain>
              近七天
            </el-button>
            <el-button @click="chooseDate(4)"  type="primary" plain>
              近三十天
            </el-button>

          </el-row>
        </el-form-item>

        <el-form-item label="运单号">
          <el-input style="width: 200px;" size="medium" :maxlength="inputMax" v-model="awb" clearable
                    placeholder="请输入运单号"></el-input>
        </el-form-item>
        <el-form-item label="航司">
          <el-input style="width: 200px;" size="medium" :maxlength="inputMax" v-model="airCPCode" clearable
                    placeholder="请输入航司"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="accessDate"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd"
            start-placeholder="起始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item style="float: right;margin-right: 0">
          <el-row>
<!--            <el-button @click="newAdd" size="medium">新增</el-button>-->
            <el-button @click="searchClick" size="medium" type="primary">搜索</el-button>
            <el-button @click="restClick" size="medium" type="primary">清空</el-button>
          </el-row>
        </el-form-item>
      </div>
    </el-form>
    <div class="divleft">
      <el-button @click="chooseDate" size="medium" type="primary" plain>
        全部
      </el-button>
      <el-button @click="chooseDate(5)" size="medium" type="primary" plain>
        已支持
      </el-button>
      <el-button @click="chooseDate(6)" size="medium" type="primary" plain>
        未支持
      </el-button>
      <el-table
        :data="tableData"
        border
        stripe
        header
        max-height="750"
        class="finance-talbe"
        style="width: 100%">
        <template slot="empty">
          <img class="data-pic" src="../../assets/kong-icon.png"/>
          <p>暂无数据</p>
        </template>
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="airCPCode" label="航司" min-width="80"></el-table-column>
        <el-table-column prop="totalNum" label="访问次数" min-width="80"></el-table-column>
        <el-table-column prop="successNum" label="成功次数" min-width="80"></el-table-column>
        <el-table-column prop="failNum" label="失败次数" min-width="80"></el-table-column>
        <el-table-column prop="rate" label="成功率" min-width="80"></el-table-column>
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
      <div v-show="totalNum>0" >
        总次数:{{ totalNum }},成功率:{{ succRate }}%,失败率:{{ failRate }}%
      </div>
    </div>
    <div class="divright">
      <el-button @click="searchClick" size="medium" type="primary" plain>
        全部
      </el-button>
      <el-button @click="searchClick(null,1)" size="medium" type="primary" plain>
        成功
      </el-button>
      <el-button @click="searchClick(null,0)" size="medium" type="primary" plain>
        失败
      </el-button>
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
            {{ scope.row.isSuccessed==1?"成功":scope.row.errMessage}}
          </template>
        </el-table-column>
        <el-table-column prop="repAirNeedTime" label="查询时长" min-width="80"></el-table-column>
        <el-table-column prop="lastQueryTime" label="访问时间" min-width="80"></el-table-column>
      </el-table>
      <div v-show="detailsTotalNum>0">总次数:{{ detailsTotalNum }},成功率:{{ detailsSuccRate }}%,失败率:{{ detailsFailRate }}%</div>
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
        isSuccess:'',
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
          fromDate:this.accessDate === '' ? '' : this.accessDate[0] + " 00:00:00",
          toDate: this.accessDate === '' ? '' : this.accessDate[1] + " 23:59:59",
          awb:airCPCode==null? this.awb :null,
          airCPCode:airCPCode!=null?airCPCode: this.airCPCode,
          isSuccess: isSuccess == null ? this.support : isSuccess,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
        console.log(params);
        this.$http.post(this.$service.trackDetail, params).then(data => {
          if (data.code == 200) {
            this.total = parseInt(data.data.detailsTotalNum)
            this.detailsTotalNum = data.data.detailsTotalNum
            this.detailsSuccRate = data.data.detailsSuccRate
            this.detailsFailRate = data.data.detailsFailRate
            this.detailData = data.data.monitors
          } else {
            this.$message.error(data.message)
          }
        })
      },
      chooseDate(type) {
        if (type === 1) {
          this.accessDate[0] = this.format(new Date(new Date().toLocaleDateString()).getTime())
          this.accessDate[1] = this.format(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
        } else if (type === 2) {
          this.accessDate[0] = this.format(new Date(new Date().toLocaleDateString()).getTime() - 24 * 60 * 60 * 1000);
          this.accessDate[1] = this.format(new Date(new Date().toLocaleDateString()).getTime() - 1);
        } else if (type === 3) {
          this.accessDate[0] = this.format(new Date(new Date().toLocaleDateString()).getTime() - 7 * 24 * 60 * 60 * 1000);
          this.accessDate[1] = this.format(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
        } else if (type === 4) {
          this.accessDate[0] = this.format(new Date(new Date().toLocaleDateString()).getTime() - 30 * 24 * 60 * 60 * 1000);
          this.accessDate[1] = this.format(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
        }
        this.initListSearch(type)
      },
      //查询
      searchClick(type, isSuccess) {
        this.isSuccess=isSuccess
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
</style>
