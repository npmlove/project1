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
            class="common"
            v-for="(item, index) in data"
            :key="item.id"
            style="margin-right: 40px;display:inline-block"
            >
            <div class="title"><h1>{{ item.workOrderNo }}</h1></div>
            <div class="textarea">
                <div class="scroll">
                <div  class="divLists" v-for="(item1, index1) in item.messages" :key="index1"
                    >
                    <span style="margin-rigth:6px;font-size:16px;">{{ item1.belong == 0 ? "工单历史" : "工单回复"
                    }}</span> <span style="margin-right:6px">{{ item1.occuTime }}</span>{{ item1.userName }}:  {{
                    item1.content
                    }}</div
                >
                </div>
                <div class="demo-input-suffix input1">
                <div>反馈待定 {{item.unFeedbackUsers}}</div>
                </div>
                <div class="input2">
                <el-input
                    type="textarea"
                    placeholder="请输入工单内容"
                    v-model="item.workOrderContent"
                    maxlength="150"
                    show-word-limit
                >
                </el-input>
                </div>
                <div class="demo-input-suffix select">
                航线人员
                <el-select
                    clearable
                    v-model="item.airPerson"
                    placeholder="请选择航线人员"
                >
                    <el-option
                    v-for="(item2, index2) in item.principalUsers"
                    :key="index2"
                    :label="item2.name"
                    :value="item2.id+','+item2.name"
                    >
                    </el-option>
                </el-select>
                </div>
                <div class="footer">
                <el-button
                    type="primary"
                    style="width: 75px"
                    @click="handle(index,item)"
                    >提交</el-button
                >
                <el-button type="info" @click="close(index,item.id)"
                    >关闭</el-button
                >
                </div>
            </div>
            </div>
      </transition-group>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: [], //循环对象
      timer:"",//数据请求定时器
      pageSize: "3",
      selectResult: {
        workOrderNo: "",
        startCommitDate: "",
        endCommitDate: "",
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
    console.log(this.data)
    this.initData();
    // 控制点击工单停止定时器，点击订单外开始定时器
    var vm=this
    document.querySelectorAll('.content-wrapper')[0].onclick = function(e) {
        if((document.getElementById("workOrder0") &&document.getElementById("workOrder0").contains(e.target)) || (document.getElementById("workOrder1") &&document.getElementById("workOrder1").contains(e.target)) || (document.getElementById("workOrder2") &&document.getElementById("workOrder2").contains(e.target))) {
          console.log(vm.timer)
          clearInterval(vm.timer)
        } else {
          clearInterval(vm.timer)
          vm.timer = setInterval(()=>{
              vm.initData()
          },60000)
        }
      }  
  },
  methods: {
    //初始化数据
    initData() {
      this.data = []
      let params = {
        endCommitDate: this.selectResult.endCommitDate,
        workOrderNo: this.selectResult.workOrderNo,
        startCommitDate: this.selectResult.startCommitDate,
        pageSize: this.pageSize,
      };
      this.$http.post(this.$service.searchDealing, params).then((data) => {
        if (data.code == 200) {
          this.data.push(...data.data);
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
        this.$emit('requestData')
        this.initData();
    },
    // 清空
    restClick() {
      this.selectResult.workOrderNo = "";
      this.selectResult.startCommitDate = "";
      this.selectResult.endCommitDate = "";
      this.initData();
    },
    // 提交
    handle(index,item) {
      if(!item.workOrderContent || !item.airPerson){
        this.$message.warning("请填写信息后进行操作")
        return false
      }
        var principalNames=item.airPerson.split(',')[1]
        var principalIds=item.airPerson.split(',')[0]
        let json={
          content:item.workOrderContent,
          id:item.id,
          principalIds: principalIds, 
          principalNames:principalNames
        }
        this.$http.post(this.$service.workOrderAskAgain,json).then((data)=>{
          if(data.code==200){
            this.$message.success("提交工单成功")
            this.data.splice(index,1)
            this.initData();
            this.$emit('requestData')
          } else {
            this.$message.error(data.message)
          }
        })
    },
    close (index,id){
      this.$http.post(this.$service.closeWorkOrder+"?workOrderId="+id).then(res=>{
          if(res.code==200){
              this.$message.success("关闭工单成功")
              this.data.splice(index,1)
              this.initData();
              this.$emit('requestData')
          }
          else {
              this.$message.error(res.message)
          }
       })
    },
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
};
</script>
<style scoped>
 
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
  flex:0 0 400px;
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
</style>


