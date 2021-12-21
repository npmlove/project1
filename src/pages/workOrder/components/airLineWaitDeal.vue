<template>
  <div class="content-wrapper">
    <div class="content">
      <el-form :inline="true" :model="selectResult" size="medium">
        <div class="content-search">
          <el-form-item label="工单编号">
            <el-input
              v-model="selectResult.workOrderNo"
              clearable
              maxlength="11"
              style="width: 200px"
              placeholder="请输入工单编号"
            ></el-input>
          </el-form-item>
          <el-form-item label="提交日期" label-width="80px">
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
              v-model="selectResult.customerId"
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
          <el-form-item label="关键字搜索">
            <el-input
              v-model="selectResult.workOrderNo"
              clearable
              maxlength="11"
              style="width: 200px"
              placeholder="请输入关键字"
            ></el-input>
          </el-form-item>
          <el-form-item class="buttonList">
            <el-button type="primary" @click="searchClick">查询</el-button>
            <el-button type="primary" @click="restClick">清空</el-button>
          </el-form-item>
        </div>
      </el-form>
   <transition-group name="slide" style="display:flex;justify-content:center">
            <div
            :id="'workOrder'+index"
            @click="startInterval(index)"
            class="common"
            v-for="(item, index) in data"
            :key="item.id"
            >
            <div class="head">
                <div style="margin-left:5px">{{ item.workOrderNo }}</div>
                <div class="warn">注:请于10分钟内处理工单</div>
                <div class="time">
                  <i class="el-icon-time" style="width:25px;height:25px"></i>
                  <h1 class="timi" style="margin-top:3px">{{ leaveTimer[index] }}</h1>
                </div>
              </div>
              <div class="sad"></div>
              <div class="items">
                <div>提交人:{{ item.userName }}</div>
                <div>
                  工单类型:{{ item.workOrderType == 0 ? "询价" : "" }}
                </div>
                <div>
                  紧急程度:{{
                    item.urgency == 0
                      ? "低"
                      : item.urgency == 1
                      ? "中等"
                      : "紧急"
                  }}
                </div>
              </div>
              <div style="textAlign:center;margin-top:5px;color:red" v-if="item.timeOutHours>=1"><img src="../../../assets/redTriangle.png" alt="" style="width:20px;height:20px;margin-right:10px"/>超时{{item.timeOutHours}}小时</div>
              <div class="inputarea">
                <div class="text">
                  <div
                    class="textItem"
                    v-for="(item2, index2) in item.messages"
                    :key="index2"
                  >
                   <span style="margin-right:5px">{{ item2.belong == 0 ? "工单历史" : "工单回复"}}</span> 
                  <span style="margin-right:5px">{{ item2.occuTime }}</span> {{ item2.userName }}:  {{ item2.content }}
                  </div>
                </div>
                <div>
                  <el-input
                    style="margin-top: 10px;"
                    type="textarea"
                    placeholder="反馈内容"
                    v-model="waitDeal[index].feedBack"
                    maxlength="150"
                    show-word-limit
                  >
                  </el-input>
                </div>
              </div>
              <div class="select">
                <label style="fontSize:15px;margin-right:5px">转单</label>
                <el-select clearable v-model="waitDeal[index].transfer" placeholder="请选择转单" @visible-change="clearIntervalss()">
                  <el-option
                    v-for="(item1, index1) in item.principalUsers"
                    :key="index1"
                    :label="item1.name"
                    :disabled="item1.id == pageRoleId"
                    :value="item1.id + ',' + item1.name"
                  ></el-option>
                </el-select>
              </div>
              <div class="footer">
                <el-button @click="selectClick(index)" class="footerFirst"
                  >转单</el-button
                >
                <el-button
                  @click="subClick(index)"
                  class="footerEnd"
                  type="primary"
                  >提交</el-button
                >
              </div>
            </div>
      </transition-group>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    pageRoleId:{
      type:Number,
      default:0
    }
  },
  data() {
    return {
      data: [], //循环对象
      nameList:[],//客服姓名
      timer:"",//数据请求定时器
      leaveTimer:[],//工单剩余时间
      leaveTimerNum:[],
      timerInterval:[],//工单倒计时计时器
      waitDeal:[{feedBack:"",transfer:""},{feedBack:"",transfer:""},{feedBack:"",transfer:""}],
      pageSize: "3",
      selectResult: {
        workOrderNo: "",
        startCommitDate: "",
        endCommitDate: "",
        roleName:"",
        status:"",
        customerId:""
      },
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
            return time.getTime() < new Date(beginDateVal).getTime()- 8.64e7;
          }
        },
      },
    };
  },
  mounted() {
    this.initData();
    this.getId();
    // 控制点击工单停止定时器，点击订单外开始定时器
    var vm=this
    document.querySelectorAll('.content-wrapper')[0].onclick = function(e) {
        if((document.getElementById("workOrder0") &&document.getElementById("workOrder0").contains(e.target)) || (document.getElementById("workOrder1") &&document.getElementById("workOrder1").contains(e.target)) || (document.getElementById("workOrder2") &&document.getElementById("workOrder2").contains(e.target))) {
          console.log(111)
          console.log(vm.timer)
          clearInterval(vm.timer)
        } else {
          console.log(222)
          clearInterval(vm.timer)
          vm.timer = setInterval(()=>{
              vm.initData()
          },60000)
        }
      }  
  },
  methods: {
    //点击下拉框停止定时器
    clearIntervalss(){
     clearInterval(this.timer)
    },
    //点击工单停止定时器
    startInterval(index){
      clearInterval(this.timer)
    },
      //客服姓名
    getId() {
      this.$http
        .get(
          this.$service.userSearch + "?roleName=" + this.selectResult.roleName
        )
        .then((data) => {
          this.nameList = data.data.records;
        });
    },
    //工单右上角定时器显示
    getInterval (num,index){
      if(num == 0) {
        this.leaveTimer[index] ="00:00";
      } else {
        this.timerInterval[index] = setInterval(() => {
                  num--
                  console.log(num,index)
                  var m = parseInt(num / 60);
                  var s = parseInt(num % 60);
                  if (m < 10) {
                    m = "0" + m;
                  }
                  if (s < 10) {
                    s = "0" + s;
                  }
                  this.$set(this.leaveTimer,index, m + ":" + s);
                  if (num == 0) {
                    clearInterval(this.timerInterval[index]);
                  }
                }, 1000);
      }
    },
    //查询数据获取
    initData() {
      this.data = []
      this.waitDeal=[{feedBack:"",transfer:""},{feedBack:"",transfer:""},{feedBack:"",transfer:""}]
      let request = JSON.parse(JSON.stringify(this.selectResult))
      request.pageSize = this.pageSize
      this.$http.post(this.$service.searchDealingWork4Prcp, request).then((data) => {
        if (data.code == 200) {
          this.data.push(...data.data);
            for(let i = 0;i<this.timerInterval.length;i++) {
              clearInterval(this.timerInterval[i])
            }
          let copy = data.data
          this.leaveTimerNum= copy.map(item=>item.secondsLeft)
          for(let i=0;i<copy.length;i++) {
              this.getInterval( this.leaveTimerNum[i],i)
          }
          clearInterval(this.timer)
          this.timer = setInterval(()=>{
            this.initData()
          },60000)
        } else {
          this.$message.error(data.message)
        }
      });
    },
    // 查询
    searchClick() {
        this.initData();
        this.$emit('requestData')
    },
    // 清空
    restClick() {
       this.selectResult = {
        workOrderNo: "",
        startCommitDate: "",
        endCommitDate: "",
        roleName:"",
        status:"",
        customerId:""
      },
      this.initData();
    },
     // 转单按钮
    selectClick(index) {
      console.log(this.waitDeal[index].transfer);
        if(this.waitDeal[index].transfer==''){
          this.$message.warning('请选择转单选项后进行操作')
          return
        }
       let userId=this.waitDeal[index].transfer.split(',')[0]
       let userName=this.waitDeal[index].transfer.split(',')[1]
       let params={
        workOrderId:this.data[index].id,
        userId:userId,
        userName:userName
      }
      this.$http.post(this.$service.setOrder,params).then((data)=>{
        if(data.code==200){
          this.$message.success("转单成功")
          this.data.splice(index,1)
          this.initData();
          this.$emit('requestData')
        } else {
          this.$message.error(data.message)
        }
      })
    },

    // 提交按钮
    subClick(index) {
        if(this.waitDeal[index].feedBack==''){
          this.$message.warning('请填写反馈内容后进行操作')
          return
        }
        let json={
            content:this.waitDeal[index].feedBack,
            workOrderId:this.data[index].id,
        }
        this.$http.post(this.$service.handleOrder,json).then((data)=>{
        if(data.code==200){
          this.$message.success("提交成功")
          this.data.splice(index,1)
          this.initData();
          this.$emit('requestData')
        } else {
          this.$message.error(data.message)
        }
        })
    },
  },
  beforeDestroy() {
    clearInterval(this.timer)
    for(let i = 0;i<this.timerInterval.length;i++) {
      clearInterval(this.timerInterval[i])
    }
  },
};
</script>
<style scoped lang="less">
 
      .slide-enter-active {
        animation: slide-in 1s ease-out;
      }
      .slide-leave-active {
        animation: slide-out 1s ease-out;
        position: absolute;
      }
      .slide-move {
        transition: all 1s;
      }

     
      @keyframes slide-in {
        from {
          transform: translateY(100%);
          opacity: 0;
        }
        to {
          transform:translateY(0) ;
          opacity: 1;
        }
      }
       @keyframes slide-out {
        from {
          opacity: 1;
        }
        to {
          transform:translateX(-100%) ;
          opacity: 0;
        }
      }
 /deep/ .el-textarea {
   textarea {
     min-height:160px!important;
   }
 }
.content-wrapper {
    width: 100%;
    box-sizing: border-box;
    /*height: 100%;*/
    padding: 20px;
    overflow: hidden;
    background-color: #FFF!important;
}
.content {
  background: #fff;
  margin: 20px 20px 0 20px;
  font-family: Arial Regular, Microsoft Yahei, Helvetica, sans-serif;
}
.content-search {
  /* padding: 20px 20px 0 20px !important; */
  text-align: center;
  padding-top: 20px;
}
.text {
  
  overflow-x: scroll;
}
.common {
  flex:0 0 450px;
  border: 3px solid gray;
  margin-right: 60px;
  display:inline-block;
  box-shadow:5px 5px 15px gray
}

.title {
  height: 30px;
  border-top: 1px solid;
  border-left: 1px solid;
  border-right: 1px solid;
  border-bottom: 1px solid rgb(193, 193, 193);
}
.textarea {
  height: 500px;
  border-left: 1px solid;
  border-bottom: 1px solid;
  border-right: 1px solid;
}
.scroll {
  height: 200px;
  margin: 0 10px;
  border-bottom: 1px solid rgb(193, 193, 193);
  border-left: 1px solid rgb(193, 193, 193);
  border-right: 1px solid rgb(193, 193, 193);
  overflow: auto;
  overflow-x: hidden;
}
.divLists{

font-size: 15px;
  padding-top:10px;
}
h1{
  height: 22px;
  font-size: 20px;

}
.input1 {
  margin-left: 10px;
  margin-top: 5px;
}
.input2 {
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
}
.select {
  margin-top: 30px;
  margin-left: 10px;
}
.footer {
  text-align: center;
  margin-top: 60px;
}
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
  height: 45px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.head :first-child {
  font-size: 14px;
  margin-right: 10px;
}

.warn {
  color: red;
  font-size:16px
}
.sad {
  height: 2px;
  background-color: rgb(121, 121, 121);
}
.items {
  font-size:15px;
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
  height:auto;
  padding-bottom:15px;
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
  display:flex;
  margin-right:5px;
}

.delete {
  font-size: 20px;
  margin-right:8px
}
.timi {
  margin-left: -5px;
  padding-bottom: 5px;
  margin-top:2px;
  color:red
}
.text {
  height: 240px;
  border: 1px solid rgb(193, 193, 193);
  overflow: auto;
  overflow-x: hidden;
}
.textItem {
  font-size: 15px;
  padding-top: 10px;
}
.el-icon-time:before{
  font-size: 25px;
}



</style>


