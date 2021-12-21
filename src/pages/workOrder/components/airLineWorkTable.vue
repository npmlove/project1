<template>
  <div class="content-wrapper">
    <div class="content">
      <el-form :inline="true" :model="selectResult" class="demo-form-inline">
        <div class="content-search">
          <el-form-item label="工单编号">
            <el-input
              clearable
              onKeyUp="value=value.replace(/[\W]/g,'')"
              maxlength="11"
              v-model="selectResult.workOrderNo"
              placeholder="请输入工单编号"
            ></el-input>
          </el-form-item>
          <el-form-item label="提交时间" label-width="80px">
            <el-date-picker
              style="width: 150px"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              v-model="selectResult.startCommitDate"
              type="date"
              :picker-options="pickerOptionsStartOne"
              placeholder="起始日期"
            >
            </el-date-picker
            >-
            <el-date-picker
              style="width: 150px"
              v-model="selectResult.endCommitDate"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              :picker-options="pickerOptionsEndOne"
              placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="工单状态">
            <el-select
              clearable
              v-model="selectResult.status"
              placeholder="请选择工单状态"
            >
              <el-option label="全部" value="null"></el-option>
              <el-option label="工单待处理" value="0"></el-option>
              <el-option label="工单已关闭" value="1"></el-option>
              <el-option label="工单待关闭" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客服姓名">
            <el-select
              v-model="selectResult.roleName"
              placeholder="请输入客服姓名"
              clearable
              filterable
              remote
              reserve-keyword
            >
              <el-option
                v-for="(item, index) in nameList"
                :key="index"
                :value="item.id"
                :label="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div class="export">
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
      <el-table
        :data="tableData"
        border
        max-height="600"
        header
        class="finance-talbe"
        @row-click="imgShow"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <template slot="empty">
          <img class="data-pic" src="@/assets/kong-icon.png" />
          <p>暂无数据</p>
        </template>
        <el-table-column
          prop="commitTime"
          label="提交时间"
          min-width="40"
        ></el-table-column>
        <el-table-column
          prop="workOrderNo"
          label="工单编号"
          min-width="40"
        ></el-table-column>
        <el-table-column prop="workOrderType" label="工单类型" min-width="40">
          <template slot-scope="scope">
            <div>
              {{ scope.row.workOrderType | getWorkOrderType }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="commitName"
          label="提交人"
          min-width="40"
        ></el-table-column>
        <el-table-column prop="urgency" label="紧急类型" min-width="40">
          <template slot-scope="scope">
            <div>
              {{ scope.row.urgency | getUrgency }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="timeOutFlag" label="超时工单" min-width="40">
          <template slot-scope="scope">
            <div>
              {{ scope.row.timeOutFlag | getTimeOutFlag }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="statusStr"
          label="工单状态"
          min-width="40"
        ></el-table-column>
        <el-table-column label="工单详情" min-width="40">
          <template slot-scope="scope">
            <el-popover
              placement="bottom"
              popper-class="popper"
              width="450"
              :ref="`popover${scope.$index}`"
              trigger="manual"
            >
              <div slot="reference">
                详情
                <img
                  :src="
                    scope.row.ifFold
                      ? require('@/assets/shangjiantou.png')
                      : require('@/assets/xiajiantou.png')
                  "
                  alt=""
                  style="width: 10px; height: 10px"
                />
              </div>
              <div v-if="!statuShow" class="head"> 
                <div>{{ scope.row.workOrderNo }}</div>
                <div @click="closePopover(scope.$index,scope)" class="delete">X</div>
              </div>
              <div v-if="statuShow" class="head">
                <div>{{ scope.row.workOrderNo }}</div>
                <div class="warn">注:请于10分钟内处理工单</div>
                <div class="time">
                  <i class="el-icon-time"></i>
                  <h1 class="timi">{{ timer }}</h1>
                </div>
                <div @click="closePopover(scope.$index,scope)" class="delete">X</div>
              </div>
              <div v-if="statuShow" class="sad"></div>
              <div v-if="statuShow" class="items">
                <div>提交人:{{ details.userName }}</div>
                <div>
                  工单类型:{{ details.workOrderType == 0 ? "询价" : "" }}
                </div>
                <div>
                  紧急程度:{{
                    details.urgency == 0
                      ? "低"
                      : details.urgency == 1
                      ? "中等"
                      : "紧急"
                  }}
                </div>
              </div>
              <div style="textAlign:center;margin-top:5px;color:red" v-if="statuShow && details.timeOutHours>=1"><img src="../../../assets/redTriangle.png" alt="" style="width:20px;height:20px;margin-right:10px"/>超时{{details.timeOutHours}}小时</div>
              <div class="inputarea">
                <div class="text">
                  <div
                    class="textItem"
                    v-for="(item, index) in details.messages"
                    :key="index"
                  >
                    <span style="margin-right: 5px">{{
                      item.belong == 0 ? "工单历史" : "工单回复"
                    }}</span>
                    <span style="margin-right: 5px">{{ item.occuTime }}</span>
                    {{ item.userName }}: {{ item.content }}
                  </div>
                </div>
                <div v-if="statuShow">
                  <el-input
                    style="margin-top: 10px"
                    type="textarea"
                    placeholder="反馈内容"
                    v-model="text"
                    maxlength="150"
                    show-word-limit
                  >
                  </el-input>
                </div>
              </div>
              <div v-if="statuShow" class="select">
                <label>转单</label>
                <el-select clearable v-model="setText" placeholder="请选择转单">
                  <el-option
                    v-for="(item1, index1) in details.principalUsers"
                    :key="index1"
                    :label="item1.name"
                    :disabled="item1.id == pageRoleId"
                    :value="item1.id + ',' + item1.name"
                  ></el-option>
                </el-select>
              </div>
              <div v-if="statuShow" class="footer">
                <el-button @click="selectClick(scope)" class="footerFirst"
                  >转单</el-button
                >
                <el-button
                  @click="subClick(scope)"
                  class="footerEnd"
                  type="primary"
                  >提交</el-button
                >
              </div>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>

      <div class="footer">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[10, 30, 50]"
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
  props: {
    pageRoleId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      selectResult: {
        workOrderNo: "",
        startCommitDate: "",
        endCommitDate: "",
        status: "",
        roleName: "",
      },
      nameList: [],
      details: [],
      dataTimer: "", //数据请求定时器
      //工单倒计时数字
      timer: "10:00",
      //工单倒计时定时器
      timerInterval: "",

      text: "", //反馈内容
      setText: "", //转单选项
      statuShow: "true",
      pageSize: 10,
      pageNum: 1,
      total: "",
      tableData: [],
      pickerOptionsStartOne: {
        // 限制航班日期
        disabledDate: (time) => {
          let endDateVal = this.selectResult.endCommitDate;
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime();
          }
        },
      },
      pickerOptionsEndOne: {
        disabledDate: (time) => {
          let beginDateVal = this.selectResult.startCommitDate;
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime() - 8.64e7;
          }
        },
      },
    };
  },
  created() {
    if (
      sessionStorage.getItem("lastPageNum") &&
      JSON.parse(sessionStorage.getItem("lastPageNum")).pageNum
    ) {
      this.pageNum = Number(
        JSON.parse(sessionStorage.getItem("lastPageNum")).pageNum
      );
    }
  },
  mounted() {
    this.initData();
    this.dataTimer = setInterval(() => {
      this.initData();
    }, 60000);
    this.getId();
    window.addEventListener("beforeunload", (e) => {
      var obj = JSON.stringify({ pageNum: this.pageNum });
      sessionStorage.setItem("lastPageNum", obj);
    });
  },
  methods: {
    //客服姓名数据
    getId() {
      this.$http
        .get(
          this.$service.userSearch + "?roleName=" + this.selectResult.roleName
        )
        .then((data) => {
          this.nameList = data.data.records;
        });
    },
    //数据查询
    initData() {
      let json = {
        workOrderNo: this.selectResult.workOrderNo,
        startCommitDate: this.selectResult.startCommitDate,
        endCommitDate: this.selectResult.endCommitDate,
        status: this.selectResult.status,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        customerId: this.selectResult.roleName,
      };
      this.$http.post(this.$service.airOrder, json).then((data) => {
        if (data.code == 200) {
          this.tableData = data.data.records;
          this.total = data.data.total;
          this.tableData.forEach((item) => {
            item.ifFold = false;
          });
       
          clearInterval(this.dataTimer);
          this.dataTimer = setInterval(() => {
            this.initData();
          }, 60000);
        } else {
          this.$message.error(data.message);
        }
      });
    },
    searchClick() {
      this.initData();
    },
    restClick() {
      this.selectResult.workOrderNo = "";
      this.selectResult.startCommitDate = "";
      this.selectResult.endCommitDate = "";
      this.selectResult.status = "";
      this.selectResult.roleName = "";
      this.initData();
    },
    //分页切换
    handleSizeChange(e) {
      this.pageSize = e;
      this.initData();
    },
    handleCurrentChange(e) {
      this.pageNum = e;
      this.initData();
    },
    //工单详情
    imgShow(row,column) {
       if(column.label=="工单详情"){
                let index
                this.tableData.forEach((item,index1)=>{
                    if(item.id == row.id) {
                        index = index1
                    }
                })
      this.text = "";
      this.setText = "";
      clearInterval(this.timerInterval);
      this.timer = "";
      let data = this.tableData[index];
      for(let i = 0;i<this.tableData.length;i++) {
        if(index == i) continue
        this.$refs["popover" + i].showPopper = false
        this.tableData[i].ifFold = false

      }
      this.$refs["popover" + index].showPopper = !this.$refs["popover" + index].showPopper;
      if(this.$refs["popover" + index].showPopper){
          clearInterval(this.dataTimer);
      } else {
         this.dataTimer = setInterval(() => {
            this.initData();
          }, 60000);
      }
      data.ifFold = !data.ifFold;
      this.$set(this.tableData, index, data);
      var withPrcps = "";
      
      if (data.statusStr == "工单已关闭") {
        withPrcps = false;
        this.statuShow = false;
      } else {
        withPrcps = true;
        this.statuShow = true;
      }
      this.$http
        .get(
          this.$service.detailsSearch +
            "?withPrcps=" +
            withPrcps +
            "&workOrderId=" +
            data.id
        )
        .then((data) => {
          if (data.code == 200) {
            this.details = data.data;
            var time = data.data.secondsLeft;
            if (time > 0 ){
              this.timerInterval = setInterval(() => {
              time--;
              var m = parseInt(time / 60);
              var s = parseInt(time % 60);
              if (m < 10) {
                m = "0" + m;
              }
              if (s < 10) {
                s = "0" + s;
              }
              this.timer = m + ":" + s;
              if (time == 0) {
                clearInterval(this.timerInterval);
              }
            }, 1000);
            } else {
              this.timer = "00:00"
            }
                }
        });
       }
    },
    //导出文件
    exportFile() {
      let params = {
        customerId: this.selectResult.roleName,
        endCommitDate: this.selectResult.endCommitDate,
        startCommitDate: this.selectResult.startCommitDate,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        status: this.selectResult.status,
        workOrderNo: this.selectResult.workOrderNo,
      };
      this.$http
        .post(this.$service.airOrderExport, params, {
          responseType: "arraybuffer",
        })
        .then((res) => {
          const aLink = document.createElement("a");
          let blob = new Blob([res], {
            type: "application/vnd.ms-excel",
          });
          aLink.href = URL.createObjectURL(blob);
          aLink.setAttribute("download", "航线审核工单" + ".xlsx");
          aLink.click();
          document.body.appendChild(aLink);
        });
    },
    //工单详情 转单按钮
    selectClick(scope) {
      if (this.setText == "") {
        this.$message.warning("请选择转单选项后进行操作");
        return;
      }
      let userId = this.setText.split(",")[0];
      let userName = this.setText.split(",")[1];
      let params = {
        workOrderId: scope.row.id,
        userId: userId,
        userName: userName,
      };
      this.$http.post(this.$service.setOrder, params).then((data) => {
        if (data.code == 200) {
          this.$message.success("转单成功");
          let data = "popover" + scope.$index;
          this.$refs[data].showPopper = false;
          let ifFolds = this.tableData[scope.$index].ifFold;
          this.tableData[scope.$index].ifFold = !ifFolds;
          this.initData();
           this.dataTimer = setInterval(() => {
            this.initData();
          }, 60000);
        } else {
          this.$message.error(data.message);
        }
      });
    },

    //工单详情 提交按钮
    subClick(scope) {
      if (this.text == "") {
        this.$message.warning("请填写反馈内容后进行操作");
        return;
      }
      let json = {
        content: this.text,
        workOrderId: scope.row.id,
      };
      this.$http.post(this.$service.handleOrder, json).then((data) => {
        if (data.code == 200) {
          this.$message.success("提交成功");
          let data = "popover" + scope.$index;
          this.$refs[data].showPopper = false;
          let ifFolds = this.tableData[scope.$index].ifFold;
          this.tableData[scope.$index].ifFold = !ifFolds;
           this.dataTimer = setInterval(() => {
            this.initData();
          }, 60000);
          this.initData();
        } else {
          this.$message.error(data.message);
        }
      });
    },
    //订单详情弹框右上角X关闭
    closePopover(index,e) {
      let dataFold = e.row;
      dataFold.ifFold = !dataFold.ifFold;
      this.$set(this.tableData, index, dataFold);
      let data = "popover" + index;
      this.$refs[data].showPopper = false;
       this.dataTimer = setInterval(() => {
            this.initData();
          }, 60000);
    },
  },
  filters: {
    getWorkOrderType(res) {
      return res == 0 ? "询价" : "";
    },
    getUrgency(res) {
      return res == 0 ? "低" : res == 1 ? "中等" : "紧急";
    },
    getTimeOutFlag(res) {
      return res == 0 ? "否" : "是";
    },
  },
  destroyed() {
    sessionStorage.setItem("lastPageNum", "");
    clearInterval(this.dataTimer)
  },
};
</script>
<style lang="less">
.popper {
  padding: 0;
}
</style>
<style scoped lang="less">
.content {
  background: #fff;
  margin: 20px 20px 0 20px;
  font-family: Arial Regular, Microsoft Yahei, Helvetica, sans-serif;
}
.content-search {
  padding: 20px 20px 0 20px !important;
}
.export {
  float: right;
  margin-right: 20px;
  margin-bottom: 20px;
}
.footer {
  display: flex;
  height: 100px;
  justify-content: flex-end;
  margin-right: 20px;
}

.head {
  height: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.head :first-child {
  font-size: 22px;
  margin-right: 10px;
}

.warn {
  color: red;
}
.sad {
  height: 2px;
  background-color: rgb(121, 121, 121);
}
.items {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}
.inputarea {
  margin: 10px;
}
.footer {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  height: auto;
  padding-bottom: 15px;
}
.select {
  margin-top: 10px;
  margin-left: 10px;
}
.footerFirst {
  width: 80px;
  height: 40px !important;
  background-color: orange;
}
.footerEnd {
  width: 80px;
  height: 40px;
}
.time {
  display: flex;
}

.delete {
  font-size: 20px;
  margin-right: 8px;
  cursor: pointer;
}
.timi {
  margin-left: -5px;
  padding-bottom: 5px;
  margin-top: 2px;
}
.text {
  height: 150px;
  border: 1px solid rgb(193, 193, 193);
  overflow: auto;
  overflow-x: hidden;
}
.textItem {
  font-size: 15px;
  padding-top: 10px;
}
</style>


