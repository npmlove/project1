<template>
    <div class="content-wrapper">
        <el-form :inline="true" size="medium" class="demo-form-inline">
        <div class="content-search-normal">
          <el-form-item label="工单编号:" style="margin-left:15px">
            <el-input v-model="selectResult.workOrderNo" style="width: 200px;" size="medium" :maxlength="11" clearable placeholder="请输入工单编号"></el-input>
          </el-form-item>
          <el-form-item label="提交时间" label-width="80px">
             <el-date-picker
             style="width:150px"
              v-model="selectResult.startCommitDate"
              type="date"
              :picker-options="pickerOptionsStartOne"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker >-
             <el-date-picker
             style="width:150px"
              v-model="selectResult.endCommitDate"
              type="date"
              :picker-options="pickerOptionsEndOne"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
           <el-form-item label="工单状态:" label-width="80px">
            <el-select v-model="selectResult.status" style="width: 210px;" >
              <el-option
                v-for="(item,index) in workOrderStatus"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  label="航线姓名" label-width="80px">
            <el-select
              v-model="selectResult.principalId"
              placeholder="请输入航线"
              clearable
              filterable
              remote
              reserve-keyword
              style="width: 210px"
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
        </div>
        <div class="operateButton">
              <el-button @click="openWorkOrder" size="mini" type="primary" style="backgroundColor:rgb(245,154,35)!important">新建工单</el-button>
              <el-button @click="searchClick()" size="mini" type="primary" icon="el-icon-search">查询</el-button>
              <el-button @click="restClick" size="mini" type="primary">清空</el-button>
              <el-button @click="exportCstListExcel" size="mini" type="primary">导出文件</el-button>
        </div>

      </el-form>
      <!-- 新建工单弹框 -->
        <el-dialog :visible.sync="workOrderDial" title="工单提交" width="40%;" style="padding-bottom:25px" :before-close="handleClose">
            <div style="padding-top:10px">
                <el-input
                    class="bigInput"
                    type="textarea"
                    :rows="2"
                    @change="getKeyWords($event)"
                    placeholder="请输入内容"
                    maxlength="150"
                    show-word-limit
                    v-model="form.content">
                </el-input>
                <el-form style="display:flex;margin-top:10px">
                     <el-form-item label="目的港" label-width="60px" style="width:170px">
                        <el-input style="width:100px" size="medium" v-model="newMessage.pod" disabled>
                     </el-input>
                    </el-form-item>
                    <el-form-item label="件数" label-width="60px" style="width:200px">
                        <el-input style="width:140px" size="medium" v-model="newMessage.piece" maxlength="4" disabled>
                            <template slot="append">PCS</template>
                     </el-input>
                    </el-form-item>
                     <el-form-item label="毛重" label-width="60px" style="width:220px">
                        <el-input style="width:150px" size="medium" v-model="newMessage.weight" maxlength="6" disabled>
                            <template slot="append">KG</template>
                     </el-input>
                    </el-form-item>
                    <el-form-item label="体积" label-width="60px" style="width:240px">
                        <el-input style="width:170px" size="medium" v-model="newMessage.cbm" disabled>
                            <template slot="append">CBM</template>
                     </el-input>
                    </el-form-item>
                </el-form>
                <el-form>
                     <el-form-item label="工单类型">
                        <el-select v-model="form.workOrderType" placeholder="请选择工单类型">
                            <el-option  
                                v-for="item in workOrderType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="紧急程度">
                        <el-popover
                            placement="top-start"
                            width="340"
                            trigger="hover"
                            content="工单常规处理:低(4小时),中等(2小时),紧急(1小时)">
                            <el-radio-group v-model="form.urgency" slot="reference">
                                <el-radio label="0">低</el-radio>
                                <el-radio label="1">中等</el-radio>
                                <el-radio label="2">紧急</el-radio>
                          </el-radio-group>
                        </el-popover>
                    </el-form-item>
                     <el-form-item label="航线人员">
                        <el-select v-model="form.airLinePeople" multiple collapse-tags filterable multiple-limit="6"  clearable placeholder="请选择工单类型">
                         <el-option  
                            v-for="item in airManger"
                            :key="item.value"
                            :label="item.name"
                            :value="item.name+','+item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                </el-form>
                
                  <!-- 底部按钮 -->
                <div slot="footer" class="dialog-footer">
                    <div style="text-align: center;padding-top:20px;">
                    <el-button size="medium" type="primary"
                        @click="newWorkOrder">提交</el-button>
                    <el-button size="medium" @click="workOrderDial = false">取 消
                    </el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
       <el-table
              :data="tableData"
              border
              header
              @row-click="changeRows"
              class="finance-talbe"
              style="width: 100%">
              <template slot="empty">
                <img class="data-pic" src="@/assets/kong-icon.png"/>
                <p>暂无数据</p>
              </template>
              <el-table-column prop="commitTime" label="提交时间" min-width="80"></el-table-column>
              <el-table-column prop="workOrderNo" label="工单编号" min-width="80"></el-table-column>
              <el-table-column prop="workOrderType" label="工单类型" min-width="80">
                  <template slot-scope="scope">
                      <div>
                          {{scope.row.workOrderType | getData(1)}}
                      </div>
                  </template>
              </el-table-column>
              <el-table-column prop="urgency" label="紧急类型" min-width="80">
                  <template slot-scope="scope">
                      <div>
                          {{scope.row.urgency | getData(2)}}
                      </div>
                  </template>
              </el-table-column>
              <el-table-column prop="timeOutFlag" label="超时工单" min-width="80">
                  <template slot-scope="scope">
                      <div>
                          {{scope.row.timeOutFlag | getData(3)}}
                      </div>
                  </template>
              </el-table-column>
              <el-table-column prop="status" label="工单状态" min-width="80">
                  <template slot-scope="scope">
                      <div>
                          {{scope.row.status | getData(4)}}
                      </div>
                  </template>
              </el-table-column>
              <el-table-column prop="principalNames" label="航线人员" min-width="80"></el-table-column>
              <el-table-column prop="createTime" label="工单详情" min-width="80" class="allColumn">
                  <template slot-scope="scope">
                      <el-popover
                            :ref="`popover${scope.$index}`"
                            placement="bottom"
                            width="400"
                            style="textAlign:center"
                            trigger="manual">
                            <div style="display:flex;justify-content:space-between;align-item:center">
                                <div style="fontSize:20px">{{workOrderDetail.title}}</div>
                                <div style="fontSize:28px;color:silver;margin-right:5px;margin-top:-10px;cursor:pointer" @click="closePopover(scope.$index)">X</div>
                            </div>
                            <div class="popoverContent">
                                <div v-for="(item,index) in workOrderDetail.messages" :key="index">
                                    <div>{{item.belong==0?"工单历史":"工单回复"}} <span style="margin-left:5px">{{item.occuTime}}</span> <span style="margin-left:5px">{{item.userName}}:{{item.content}}</span></div>
                                </div>
                            </div>
                            <el-form v-if="scope.row.status == 0 ||scope.row.status == 2">
                                <el-form-item label="反馈待定" label-width="70px">
                                    <div style="width:80%;text-align:left;border:1px solid silver;padding-left:5px">{{workOrderDetail.unFeedbackUsers}}</div>
                                </el-form-item>
                                <el-form-item>
                                    <el-input placeholder="请输入工单内容" v-model="workOrderDetail.content"></el-input>
                                </el-form-item>
                                <el-form-item label="航线人员" label-width="70px">
                                    <el-select placeholder="请选择航线人员" style="width:80%;text-align:left"  v-model="workOrderDetail.principalResult">
                                        <el-option 
                                            v-for="(item,index) in workOrderDetail.principalUsers"
                                            :key="index"
                                            :label="item.name"
                                            :value="item.id+','+item.name">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                 <div class="dialog-footer">
                                    <div style="text-align: center;padding-top:20px;">
                                    <el-button size="medium" type="primary"
                                        @click="confirmWorkOrder(scope.row.id,scope.$index,scope.row.status)">提交</el-button>
                                    <el-button size="medium" @click="cancelWorkOrder(scope.$index,scope.row.id)">关闭
                                    </el-button>
                                    </div>
                                </div>
                            </el-form>
                             <div slot="reference" class="allColumn">
                                 <div>
                                    详情 <img :src="scope.row.arrow?require('@/assets/xiajiantou.png'):require('@/assets/shangjiantou.png')" alt=""  style="width:10px;height:10px" >
                                 </div>
                            </div>
                          </el-popover>
                     
                  </template>
              </el-table-column>
              <el-table-column  label="催单" min-width="80">
                 <template slot-scope="scope">
                  <el-button disabled type="info" size="mini" style="width:68px;background-color:#909399;color:#fff;border:0" v-if="scope.row.status == 3">已关闭</el-button>
                  <el-button @click="remindOrder(scope.row.id)" type="primary" size="mini" style="width:68px" v-else-if="scope.row.canRemind == 1 && scope.row.roundsRemindCount == 0">催单</el-button>
                  <el-button disabled type="info" size="mini" style="width:68px;background-color:#909399;color:#fff;border:0" v-else-if="scope.row.canRemind == 0 && scope.row.roundsRemindCount == 0">催单</el-button>
                  <el-button @click="remindOrder(scope.row.id)" :disabled="scope.row.canRemind" type="warning" size="mini" style="background:rgb(245, 154, 35) !important" v-else-if="scope.row.timeOutFlag == 1 && scope.row.remindFlag == 1">已催单{{scope.row.roundsRemindCount}}</el-button>
                </template>  
              </el-table-column>  
              <el-table-column label="目的港" prop="pod" min-width="40"></el-table-column>
              <el-table-column label="件/毛/体" prop="cargoInfo"min-width="80"></el-table-column>
            </el-table>
             <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="pageNum"
                :page-sizes="[10,30,50]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                style="text-align: right;padding: 19px 30px 18px 0;background: #fff"
                >
              </el-pagination>
    </div>
</template>
<script>
import {exportFile} from '@/util/util.js'
export default {
    props:{
        tableData:{
            type:Array,
            default:()=>{
                return []
            }
        }
    },
    created(){
        if(sessionStorage.getItem("lastPageNum") && JSON.parse(sessionStorage.getItem("lastPageNum")).pageNum) {
            this.pageNum =Number(JSON.parse(sessionStorage.getItem("lastPageNum")).pageNum)
        }
    },
    mounted(){
        //表格数据定时器
        this.tableTimer = setInterval(()=>{this.searchClick()},60000)
        this.pageRoleName = JSON.parse(sessionStorage.getItem("userInfo")).name
        this.searchClick()
        this.$http.get(this.$service.userSearch+'?roleName=航线负责人&pageSize=50000').then(data=>{
          this.airManger = data.data.records
        })
        window.addEventListener('beforeunload', e => {
            var obj = JSON.stringify({"pageNum":this.pageNum})
            sessionStorage.setItem('lastPageNum', obj);
        });
    },
    data(){
        return {
            newMessage:{pod:"",piece:"",cbm:"",weight:""},
            //表格数据定时器
            tableTimer:null,
            pageRoleName:"",
            //新建工单弹框
            workOrderDial:false,
            //新建工单弹框结果
            form:{workOrderType:0,urgency:"0",content:"",airLinePeople:[]},
            //
            workOrderType:[{label:"询价",value:0}],
            //航线搜索框
            airManger:[],
            //工单状态搜索框
            workOrderStatus:[{value:"",label:"全部"},{value:"0",label:"工单待处理"},{value:"1",label:"工单处理中"},{value:"2",label:"待客服确认"},{value:"3",label:"已关闭"}],
            //搜索框结果
            selectResult:{
                workOrderNo:"",
                endCommitDate:"",
                startCommitDate:"",
                principalId:"",
                status:"",
            },
            pageNum:1,
            pageSize:10,
            total:0,
            //工单详情popover
            workOrderDetail:{title:"",unFeedbackUsers:"",messages:[],content:"",principalUsers:[],principalResult:""},
            workOrderBox:[],
            //提交时间
            // 限制结束日期大于开始日期
            pickerOptionsStartOne: {
                disabledDate: time => {
                    let endDateVal = this.selectResult.endCommitDate
                    if (endDateVal) {
                    return time.getTime() > new Date(endDateVal).getTime()
                    }
                }
                },
            pickerOptionsEndOne: {
             disabledDate: time => {
                let beginDateVal = this.selectResult.startCommitDate
                if (beginDateVal) {
                return time.getTime() < new Date(beginDateVal).getTime()- 8.64e7
                }
             }
            },
        }
    },
    methods:{
        //获取关键字 
        getKeyWords(e){
            this.$http.post(this.$service.stringIfContent,e).then(data=>{
                let copy = data.data
                this.newMessage.pod = copy.pod
                this.newMessage.piece = copy.piece
                this.newMessage.cbm = copy.cbm
                this.newMessage.weight = copy.weight
            })
        },
         //新建工单确认关闭
        handleClose(done) {
            this.$confirm('确认关闭？',{customClass:'confirmClass'})
                .then(_ => {
                    done();
                })
            .catch(_ => {});
        },
        changeRows(row,column){
            if(column.label=="工单详情"){
                let index
                this.tableData.forEach((item,index1)=>{
                    if(item.id == row.id) {
                        index = index1
                    }
                })
                for(let i = 0;i<this.tableData.length;i++) {
                    if(index == i) continue
                    this.$refs["popover" + i].showPopper = false
                    this.tableData[i].arrow = true
                 }
            this.$refs["popover"+index].showPopper= !this.$refs["popover"+index].showPopper
            this.tableData[index].arrow = !this.tableData[index].arrow
            //判断是否需要请求航线选择框信息
            let withPrcps = ""
            if(row.status ==0 || row.status ==2) {
                withPrcps = true
            } else if(row.status ==1 || row.status ==3) {
                withPrcps = false
            }
            this.workOrderDetail={title:"",unFeedbackUsers:"",messages:[],content:"",principalUsers:[],principalResult:""},
            this.$http.get(this.$service.searchWorkOrderDetailById+"?withPrcps="+withPrcps+"&workOrderId="+row.id).then(data=>{
                let copyData = data.data
                this.workOrderDetail.title = copyData.workOrderNo;
                this.workOrderDetail.unFeedbackUsers = copyData.unFeedbackUsers;
                this.workOrderDetail.messages = copyData.messages;
                this.workOrderDetail.principalUsers = copyData.principalUsers;

            })
            }
        },
       
        //新建工单按钮
        openWorkOrder(){
            this.form = {workOrderType:0,urgency:"0",content:"",airLinePeople:[]},
            this.newMessage = {pod:"",piece:"",cbm:"",weight:""},
            this.workOrderDial = true
        },
        //新建工单 弹框提交
        newWorkOrder(){
            let request = {}
            request.roleName = this.pageRoleName
            request.workOrderType = this.form.workOrderType
            request.urgency = this.form.urgency
            request.principalIds = this.form.airLinePeople.map(item=>item.split(",")[1]).join()
            request.principalNames = this.form.airLinePeople.map(item=>item.split(",")[0]).join()
            request.content = this.form.content
            this.$http.post(this.$service.launchWorkOrder,request).then(res=>{
                if(res.code==200) {
                    this.$message.success("新建工单成功")
                     this.$emit("flashRight")
                } else {
                    this.$message.error(res.message)
                }
            })
            this.workOrderDial = false
            this.searchClick()
            clearInterval(this.tableTimer)
            this.tableTimer = setInterval(()=>{this.searchClick()},60000)
        },
        
        //点击工单详情箭头图标
        // changeArrow(data){  
        //     let index = data.$index
        //     this.$refs["popover"+index].showPopper= !this.$refs["popover"+index].showPopper
        //     this.tableData[index].arrow = !this.tableData[index].arrow
        //     //判断是否需要请求航线选择框信息
        //     let withPrcps = ""
        //     if(data.row.status ==0 || data.row.status ==2) {
        //         withPrcps = true
        //     } else if(data.row.status ==1 || data.row.status ==3) {
        //         withPrcps = false
        //     }
        //     this.workOrderDetail={title:"",unFeedbackUsers:"",messages:[],content:"",principalUsers:[],principalResult:""},
        //     this.$http.get(this.$service.searchWorkOrderDetailById+"?withPrcps="+withPrcps+"&workOrderId="+data.row.id).then(data=>{
        //         let copyData = data.data
        //         this.workOrderDetail.title = copyData.workOrderNo;
        //         this.workOrderDetail.unFeedbackUsers = copyData.unFeedbackUsers;
        //         this.workOrderDetail.messages = copyData.messages;
        //         this.workOrderDetail.principalUsers = copyData.principalUsers;

        //     })
        // },
        //订单详情弹框取消按钮关闭
        cancelWorkOrder(index,id){
            this.tableData[index].arrow=true
            this.$http.post(this.$service.closeWorkOrder+"?workOrderId="+id).then(res=>{
                if(res.code==200){
                    this.$message.success("关闭工单成功")
                }
                else {
                    this.$message.error(res.message)
                }
            })
            this.$refs[`popover${index}`].showPopper = false
            clearInterval(this.tableTimer)
            this.tableTimer = setInterval(()=>{this.searchClick()},60000)
        },
        //订单详情弹框右上角X关闭
       closePopover(index){
           this.tableData[index].arrow = !this.tableData[index].arrow
           let data = "popover"+index
           this.$refs[data].showPopper=false
       },
       //订单详情弹框 提交按钮
       confirmWorkOrder(id,index,status) {
           if(this.workOrderDetail.principalResult=="" || this.workOrderDetail.content == ""){
               this.$message.warning("请完成信息填写后进行提交操作")
               return
           }
           let request = {
               id:id,
               content:this.workOrderDetail.content,
               principalIds:this.workOrderDetail.principalResult.split(",")[0],
               principalNames:this.workOrderDetail.principalResult.split(",")[1],
           }
            this.$http.post(this.$service.workOrderAskAgain,request).then(res=>{
                if(res.code == 200) {
                    this.$message.success("提交工单成功")
                    if(status == 2) {
                        this.$emit("flashRight")
                    }
                }else {
                    this.$message.error(res.message)
                }
            })
            this.tableData[index].arrow = !this.tableData[index].arrow
            let data = "popover"+index
            this.$refs[data].showPopper=false
            this.searchClick()
            clearInterval(this.tableTimer)
            this.tableTimer = setInterval(()=>{this.searchClick()},60000)
       },
       //表格催单
       remindOrder(id){
           this.$http.post(this.$service.remindWorkOrder+"?workOrderId="+id).then(res=>{
               if(res.code==200) {
                   this.$message.success("催单成功")
                   this.searchClick()
               } else {
                   this.$message.error(res.message)
               }
           })
           clearInterval(this.tableTimer)
            this.tableTimer = setInterval(()=>{this.searchClick()},60000)
       },
        //查询按钮
        searchClick(returnStart){
            if(returnStart) this.pageNum = 1
            this.selectResult.pageSize=this.pageSize
            this.selectResult.pageNum=this.pageNum
            this.$http.post(this.$service.searchByPageForCst,this.selectResult).then(data=>{
                if(data.code==200) {
                    let copyData = data.data.records
                    this.total = data.data.total
                    copyData.forEach(item=>item.arrow=true)
                    this.tableData = copyData
                } else {
                    this.$message.error(data.message)
                }
            })
        },
        //清空
        restClick(){
            this.selectResult = {
                workOrderNo:"",
                endCommitDate:"",
                startCommitDate:"",
                principalId:"",
                status:"",
                pageNum:1,
                pageSize:10,
            }
        },
        //导出文件
        exportCstListExcel(){
            this.$http.post(this.$service.exportCstListExcel,this.selectResult,{
            responseType: 'arraybuffer'
            }).then(res=>{
                const aLink = document.createElement("a");
                let blob = new Blob([res], {
                type: "application/vnd.ms-excel"
                })
                aLink.href = URL.createObjectURL(blob)
                aLink.setAttribute('download', '客服工单列表' + '.xlsx') // 设置下载文件名称
                aLink.click()
                document.body.appendChild(aLink)
                })
            clearInterval(this.tableTimer)
            this.tableTimer = setInterval(()=>{this.searchClick()},60000)
        },
        handleCurrentChange(e) {
        this.pageNum = e
        this.searchClick()
        clearInterval(this.tableTimer)
        this.tableTimer = setInterval(()=>{this.searchClick()},60000)
      },
      handleSizeChange(e) {
        this.pageSize = e
        this.searchClick()
        clearInterval(this.tableTimer)
        this.tableTimer = setInterval(()=>{this.searchClick()},60000)
      },
    },
    filters:{
        getData(value,type){
            if(type == 1) {
                return value==0?"询价":''
            }
            else if (type == 2) {
                return value==0?"低":value==1?"中等":value==2?"紧急":""
            }
            else if (type == 3) {
                return value == 0?"未超时":value==1?"超时":""
            }
            else if (type == 4) {
                return value == 0?"工单待处理":value==1?"工单处理中":value==2 ?"待您确认":value==3 ?"已关闭":""
            }
        }
    },
    destroyed() {
        sessionStorage.setItem("lastPageNum","")
        clearInterval(this.tableTimer)

    },
}
</script>
<style lang="less" scoped>
/deep/.bigInput {
     .el-textarea__inner {
        min-height:150px!important
    }
}

/deep/.confirmClass {
   width:500px
}

.content-wrapper {
    width: 100%;
    box-sizing: border-box;
    /*height: 100%;*/
    padding: 20px;
    overflow: hidden;
    background-color: #FFF!important;
    .content-search-normal{
        text-align: left;
    }
}
.el-form {
    background-color: #FFF;
    text-align: center;
  }

   .operateButton {
    display:flex;
    justify-content: flex-end;
    margin-bottom:-10px;
   
    button {
      margin:0px 10px 20px 10px;
    }
  }
  .popoverContent {
      border:1px solid silver;
      height:150px;
      overflow: scroll;
      margin-bottom: 10px;
  }
  /deep/ .el-dialog {
      padding-bottom:25px
  }
  .allColumn {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
  }
  /deep/ .el-table__row {
      td {
          .cell {
              .allColumn
          }
      }
  }
</style>