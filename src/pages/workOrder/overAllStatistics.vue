<template>
  <div class="content-wrapper">
    <div class="content">
      <el-form
        :inline="true"
        :model="selectResult"
        class="demo-form-inline"
        size="medium"
      >
        <div class="content-search">
          <el-form-item label="角色">
            <el-select
              clearable
              v-model="selectResult.roleType"
              placeholder="请选择角色"
            >
              <el-option label="航线" value="2"></el-option>
              <el-option label="售前客服" value="1"></el-option>
              <el-option label="全部" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名">
            <el-select
              v-model="selectResult.userId"
              placeholder="请输入姓名"
              :loading="loading"
              clearable
              filterable
              :remote-method="nameMethod"
              remote
              reserve-keyword
            >
              <el-option
                v-for="(item, index) in nameList"
                :key="index"
                :value="item.id"
                :label="item.name"
              >
                <span>{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="航班日期" label-width="80px">
            <el-date-picker
              style="width: 150px"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              v-model="selectResult.startDate"
              type="date"
              :picker-options="pickerOptionsStartOne"
              placeholder="选择日期"
            >
            </el-date-picker
            >-
            <el-date-picker
              style="width: 150px"
              v-model="selectResult.endDate"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              :picker-options="pickerOptionsEndOne"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </div>
      </el-form>
      <div class="buttonList">
        <el-button type="primary" plain size="mini" @click="getDay"
          >今天</el-button
        >
        <el-button type="primary" plain size="mini" @click="getWeek"
          >本周</el-button
        >
        <el-button type="primary" plain size="mini" @click="getMonth"
          >本月</el-button
        >
        <div class="button-right">
          <el-button type="primary" size="mini" @click="searchClick"
            >查询</el-button
          >
          <el-button type="primary" size="mini" @click="restClick"
            >清空</el-button
          >
          <el-button type="primary" size="mini" @click="exportFile"
            >导出文件</el-button
          >
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        stripe
        header
        @sort-change="sortChange"
        class="finance-talbe"
        style="width: 100%"
      >
        <template slot="empty">
          <img class="data-pic" src="../../assets/kong-icon.png" />
          <p>暂无数据</p>
        </template>
        <el-table-column
          label="日期"
          min-width="40"
          sortable="custom"
          prop="createDate"
        ></el-table-column>
        <el-table-column
          label="角色"
          min-width="40"
          sortable="custom"
          prop="roleName"
        ></el-table-column>
        <el-table-column
          label="姓名"
          min-width="40"
          sortable="custom"
          prop="userName"
        ></el-table-column>
        <el-table-column
          label="全部工单"
          min-width="40"
          :sortable="'custom'"
          prop="total"
        ></el-table-column>
        <el-table-column
          label="已处理"
          min-width="40"
          sortable="custom"
          prop="processedCount"
        ></el-table-column>
        <el-table-column
          label="待处理"
          min-width="40"
          sortable="custom"
          prop="processingCount"
        ></el-table-column>
        <el-table-column
          label="超时工单"
          min-width="40"
          sortable="custom"
          prop="timeOutCount"
        ></el-table-column>
        <el-table-column
          label="工单总耗时/hour"
          min-width="40"
          sortable="custom"
          prop="totalTakeUp"
        ></el-table-column>
        <el-table-column
          label="工单均耗时/min"
          min-width="40"
          sortable="custom"
          prop="avgTakeUp"
        ></el-table-column>
        <el-table-column
          label="总回复次数"
          min-width="40"
          sortable="custom"
          prop="totalTimes"
        ></el-table-column>
      </el-table>
      <div class="footer">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 搜索框结果
      selectResult: {
        roleType: "",
        userId: "",
        startDate: "",
        endDate: "",
      },
      // 保存姓名
      nameList: [],
      total: "",
      tableData: [],
      pageSize: 20,
      pageNum: 1,
      sortBy: "1",
      sortPath: "1",
      dateFlag: "",
      // 限制航班日期
      pickerOptionsStartOne: {
        disabledDate: (time) => {
          let endDateVal = this.selectResult.endDate;
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime() ;
          }
        },
      },
      pickerOptionsEndOne: {
        disabledDate: (time) => {
          let beginDateVal = this.selectResult.startDate;
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime()- 8.64e7;
          }
        },
      },
    };
  },
  mounted() {
    this.initData();
    window.addEventListener("beforeunload", (e) => {
      var obj = JSON.stringify({ pageNum: this.pageNum });
      sessionStorage.setItem("lastPageNum", obj);
    });
  },
  methods: {
    // 排序
    sortChange(column) {
      var pr = column.prop;
      var type = column.order;
      switch (pr) {
        case "createDate":
          this.sortBy = "0";
          break;
        case "roleName":
          this.sortBy = "1";
          break;
        case "userName":
          this.sortBy = "2";
          break;
        case "total":
          this.sortBy = "3";
          break;
        case "processedCount":
          this.sortBy = "4";
          break;
        case "processingCount":
          this.sortBy = "5";
          break;
        case "timeOutCount":
          this.sortBy = "6";
          break;
        case "totalTakeUp":
          this.sortBy = "7";
          break;
        case "avgTakeUp":
          this.sortBy = "8";
          break;
      }
      if (type == "descending") {
        this.sortPath = "1";
      } else {
        this.sortPath = "0";
      }
      this.initData();
    },
    // 初始化姓名
    initName(keyword) {
      console.log(keyword);
      this.$http
        .get(this.$service.userSearch + "?name=" + keyword)
        .then((data) => {
          if (data.code == 200) {
            this.loading = false;
            this.nameList = data.data.records;
          } else {
            this.$message.error(data.message);
          }
        });
    },
    nameMethod(keyword) {
      this.loading = true;
      this.initName(keyword);
    },
    // 初始化数据
    initData() {
      let params = {
        roleType: this.selectResult.roleType,
        userId: this.selectResult.userId,
        startDate: this.selectResult.startDate,
        endDate: this.selectResult.endDate,
        sortBy: this.sortBy,
        sortPath: this.sortPath,
        dateFlag: this.dateFlag,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      this.$http.post(this.$service.orderStatistics, params).then((data) => {
        if (data.code == 200) {
          this.tableData = data.data.records;
          this.total = data.data.total;
        } else {
          this.$message.error(data.message);
        }
      });
    },
    // 查询
    searchClick() {
      this.pageSize = 10;
      this.pageNum = 1;
      this.initData();
    },
    // 清空
    restClick() {
      this.pageSize = 10;
      this.pageNum = 1;
      this.selectResult.roleType = "";
      this.selectResult.userId = "";
      this.selectResult.startDate = "";
      this.selectResult.endDate = "";
      this.initData();
    },
    // 按今天查询
    getDay() {
      this.selectResult.startDate = "";
      this.selectResult.endDate = "";
      this.dateFlag = "1";
      this.initData();
    },
    // 按本周查询
    getWeek() {
      this.selectResult.startDate = "";
      this.selectResult.endDate = "";
      this.dateFlag = "2";
      this.initData();
    },
    // 按本月查询
    getMonth() {
      this.selectResult.startDate = "";
      this.selectResult.endDate = "";
      this.dateFlag = "3";
      this.initData();
    },
    // 页面大小
    handleSizeChange(e) {
      this.pageSize = e;
      this.initData();
    },
    // 分页
    handleCurrentChange(e) {
      this.pageNum = e;
      this.initData();
    },
    // 导出文件
    exportFile() {
      let json = {
        roleType: this.selectResult.roleType,
        userId: this.selectResult.userId,
        startDate: this.selectResult.startDate,
        endDate: this.selectResult.endDate,
        sortBy: this.sortBy,
        sortPath: this.sortPath,
        dateFlag: this.dateFlag,
      };
      this.$http
        .post(this.$service.exportList, json, {
          responseType: "arraybuffer",
        })
        .then((res) => {
          const aLink = document.createElement("a");
          let blob = new Blob([res], {
            type: "application/vnd.ms-excel",
          });
          aLink.href = URL.createObjectURL(blob);
          aLink.setAttribute("download", "统计" + ".xlsx");
          aLink.click();
          document.body.appendChild(aLink);
        });
    },
  },
  beforeDestroy() {
    sessionStorage.setItem("lastPageNum", "");
  },
};
</script>
<style scoped>
.content {
  background: #fff;
  margin: 20px 20px 0 20px;
  font-family: Arial Regular, Microsoft Yahei, Helvetica, sans-serif;
}
.content-search {
  padding: 20px 20px 0 20px !important;
}
.buttonList {
  margin-left: 20px;
  margin-bottom: 20px;
}
.button-right {
  float: right;
  margin-right: 20px;
}
.footer {
  display: flex;
  height: 100px;
  justify-content: flex-end;
  align-items: center;
}
.el-pagination {
  padding: 2px 60px;
}
</style>
