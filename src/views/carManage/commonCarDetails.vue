<template>
  <div class="form-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="16">
        <div style="margin-bottom: 10px;color: #CCC;font-size: 16px;">车辆基本信息</div>
        <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm" :inline="true">
          <el-form-item v-for="(item,index) in carArr" :key="index" :label="item.name" :required="item.required">
            <el-input :disabled="true" v-if="item.select == '输入'" :placeholder="'请输入'+item.name" v-model="item.formValue" style="width: 270px"></el-input>
            <el-select :disabled="true" v-else-if="item.select == '选择'" :placeholder="'请选择'+item.name" v-model="item.formValue" style="width: 270px" filterable>
              <el-option v-for="selectItem in item.selectArr" :key="selectItem.key" :label="selectItem.value" :value="selectItem.value"></el-option>
            </el-select>
            <el-date-picker :disabled="true" v-else-if="item.select == '时间'" v-model="item.formValue" style="width: 270px;" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div style="width: 100%;border-bottom: 1px dashed #CCC;"></div>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="16">
        <div style="margin-bottom: 10px;color: #CCC;font-size: 16px;margin-top: 15px;">客户基本信息</div>
        <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm" :inline="true">
          <el-form-item v-for="(item,index) in customerArr" :key="index" :label="item.name" :required="item.required">
            <el-input :disabled="true" v-if="item.select == '输入'" :placeholder="'请输入'+item.name" v-model="item.formValue" style="width: 270px"></el-input>
            <el-select :disabled="true" v-else-if="item.select == '选择'" :placeholder="'请选择'+item.name" v-model="item.formValue" style="width: 270px" filterable>
              <el-option v-for="selectItem in item.selectArr" :key="selectItem.key" :label="selectItem.value" :value="selectItem.value"></el-option>
            </el-select>
            <el-date-picker :disabled="true" v-else-if="item.select == '时间'" v-model="item.formValue" style="width: 270px;" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div style="width: 100%;border-bottom: 1px dashed #CCC;"></div>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="16">
        <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm" :inline="true" style="margin-top: 20px;">
          <el-form-item label="网关产品">
            <!-- <el-button icon="el-icon-plus" size="medium" type="primary" @click="handleAdd">网关产品</el-button> -->
          </el-form-item>
          <!-- 表格数据 -->
          <div style="position: relative" >
            <el-table :data="tableData" border>
              <el-table-column prop="devicename" label="产品名称" ></el-table-column>
              <el-table-column prop="devicetype" label="型号" ></el-table-column>
              <el-table-column prop="devicesn" label="SN" ></el-table-column>
              <el-table-column prop="astatus" label="当前状态" >
                <template slot-scope="scope">
                  <div>{{scope.row.astatus == 0 ? '离线' : '在线'}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="bindby" label="绑定人" ></el-table-column>
              <el-table-column prop="binddate" label="绑定时间" ></el-table-column>
              <!-- <el-table-column label="操作" width="180px" >
                <template slot-scope="scope">
                  <el-button type="text"  @click="toDel(scope.row,scope.$index)">删除 </el-button>
                </template>
              </el-table-column> -->
            </el-table>
          </div>
        </el-form>
      </el-col>
    </el-row>
    <div style="width: 100%;border-bottom: 1px dashed #CCC;margin-top: 20px;"></div>
    <el-tabs type="border-card" style="margin-top: 20px;">
      <el-tab-pane v-for="(item,index) in totalArr" :label="item[0].dptypename" :key="index">
        <div style="position: relative" >
          <el-table :cell-style="tableRowClassName" ref="tableSort" v-loading="listLoading" :data="item" :element-loading-text="elementLoadingText" border>
            <el-table-column show-overflow-tooltip prop="pointname" label="点位名称" ></el-table-column>
            <el-table-column show-overflow-tooltip label="点位值">
              <template #default="{ row }">
                <div v-if="newKey.indexOf(row.pointkey) == -1">无上报数据</div>
                <div v-else-if="row.pointdatatype == '数值类型'">{{numberType(row)}}</div>
                <div v-else-if="row.pointdatatype == '值映射类型'">{{mappingType(row)}}</div>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="pointunit" label="单位"></el-table-column>
            <el-table-column show-overflow-tooltip prop="ts" label="时间">
              <template #default="{ row }">
                <div>{{timeType(row)}}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="历史轨迹">
        <div style="position: relative">
          <el-table ref="tableSort" v-loading="listLoading" :data="list3" :element-loading-text="elementLoadingText" border>
            <el-table-column show-overflow-tooltip prop="alarmeventStr" label="时间" ></el-table-column>
            <el-table-column show-overflow-tooltip prop="alarmtime" label="位置"></el-table-column>
            <el-table-column show-overflow-tooltip label="操作" width="180px" >
              <template #default="{ row }">
                <el-button type="text" @click="toSolve(row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
  import { getShopTruckDetailsDs, getShopTruckUpdate, getComTableGet, getDeviceWorkData } from '@/api/carList'
  export default {
    name: 'Form',
    data() {
      return {
        //车辆基本信息
        carArr: [],
        //客户基本信息
        customerArr: [],
        tableData: [],
        valueArr: [],

        //table
        listLoading: false,
        elementLoadingText: '正在加载...',
        list: [],
        table2: [],
        table3: [],
        newKey: [],
        newValue: [],
        totalArr: [],
        newTotalArr: []

      }
    },
    mounted () {
      this.carDetailsForm()
    },
    methods: {
      //报警设置
      tableRowClassName({row,rowIndex}) {
        if(this.newKey.indexOf(row.pointkey) > -1){
          if(row.pointalarmvalue){
            var rulObj = JSON.parse(row.pointalarmvalue)
            var titleArr = []
            var reg = ''
            for(var i = 0; i < rulObj.length; i++){
              titleArr.push(rulObj[i].pointname)
              if(i == (rulObj.length - 1)){
                reg = reg+'point'+i+rulObj[i].opVal+rulObj[i].pointval
              }else{
                reg = reg+'point'+i+rulObj[i].opVal+rulObj[i].pointval+rulObj[i].ruleVal
              }
            }
            var keyArr = this.dataType(titleArr)
            if(keyArr){
              console.log(this.pointType(reg,...keyArr))
              if (this.pointType(reg,...keyArr)) {
                return 'color: #F00;';
              }else {
                return 'color: #333;';
              }
            }
          }
        }
      },
      pointType (reg,point0,point1,point2,point3,point4,point5,point6,point7){
        console.log(reg)
        point0 = Number(point0)
        point1 = Number(point1)
        point2 = Number(point2)
        point3 = Number(point3)
        point4 = Number(point4)
        point5 = Number(point5)
        point6 = Number(point6)
        point7 = Number(point7)
        if(eval(reg)){
          return true
        } else {
          return false
        }
      },
      dataType(arr) {
        if(arr.length > 0){
          var keyArr = []
          for(var j = 0; j < arr.length; j++){
            for(var i = 0; i < this.newTotalArr.length; i++){
              if(arr[j] == this.newTotalArr[i].pointname){
                if(this.newKey.indexOf(this.newTotalArr[i].pointkey) > -1){
                  var index = this.newKey.indexOf(this.newTotalArr[i].pointkey)
                  keyArr.push(this.newValue[index])
                }
              }
            }
          }
          return keyArr
        }
      },
      //时间转换
      timeType(row) {
        if(row.ts){
          var date = new Date(row.ts)
          var Y = date.getFullYear() + '-'
          var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
          var D = date.getDate() < 10 ? '0'+date.getDate()+' ' : date.getDate()+' '
          var h = date.getHours() + ':'
          var m = date.getMinutes() + ':'
          var s = date.getSeconds()
          return Y+M+D+h+m+s
        }else{
          var date = new Date()
          var Y = date.getFullYear() + '-'
          var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
          var D = date.getDate() < 10 ? '0'+date.getDate()+' ' : date.getDate()+' '
          var h = date.getHours() + ':'
          var m = date.getMinutes() + ':'
          var s = date.getSeconds()
          return Y+M+D+h+m+s
        }
      },
      //值映射类型
      mappingType(row) {
        var index = this.newKey.indexOf(row.pointkey)
        var value = this.newValue[index]
        if(row.pointvaluemap){
          var pointvaluemap = JSON.parse(row.pointvaluemap)
          for(var i = 0; i < pointvaluemap.length; i++){
            if(value == pointvaluemap[i].oldVal){
              value = pointvaluemap[i].newVal
            }
          }
        }
        return value
      },
      //数值类型
      numberType(row) {
        var index = this.newKey.indexOf(row.pointkey)
        var value = this.newValue[index]
        return value
      },
      //查看工况信息
      async carDeviceWorkData(devicesn) {
        let params = {
          CallType: '',
          UserID: sessionStorage.getItem('UserID'),
          devicesn: devicesn,
          action: 'subscribe'
        }
        const { Data, Status } = await getDeviceWorkData(params)
        if(Status == 0){
          var newData = Data.data.data.workData
          this.newKey = []
          this.newValue = []
          for(var i = 0; i < newData.length; i++){
            this.newKey.push(newData[i].k)
            this.newValue.push(newData[i].v)
          }
          if(Data.ts){
            for(var j = 0; j < this.totalArr.length; j++){
              for(var q = 0; q < this.totalArr[j].length; q++){
                this.totalArr[j][q].ts = Data.ts
              }
            }
          }
        }
      },
      //查看表单内容
      async carDetailsForm() {
        let params = {
          CallType: 'newshoptruck',
          UserID: sessionStorage.getItem('UserID'),
          keyid: ''
        }
        const { Data } = await getComTableGet(params)
        var formcontent = JSON.parse(Data[0].formcontent)
        for(var i = 0; i < formcontent.length; i++){
          if(formcontent[i].type == '车辆基本信息'){
            this.carArr = formcontent[i].data
          }else if(formcontent[i].type == '客户基本信息'){
            this.customerArr = formcontent[i].data
          }
        }
        this.carDetails()
      },
      //查看表单详情
      async carDetails() {
        let params = {
          CallType: '',
          UserID: sessionStorage.getItem('UserID'),
          stuid: this.$route.query.stuid
        }
        const { Data } = await getShopTruckDetailsDs(params)
        this.tableData = Data.Table1
        this.table2 = Data.Table2
        this.table3 = Data.Table3
        this.carDeviceWorkData(Data.Table[0].devicesn)
        var fromcontent = JSON.parse(Data.Table[0].fromcontent)
        for(var i = 0; i < fromcontent.length; i++){
          for(var j = 0; j < this.carArr.length; j++){
            if(this.carArr[j].name == fromcontent[i].key){
              this.carArr[j].formValue = fromcontent[i].v
            }
          }
          for(var q = 0; q < this.customerArr.length; q++){
            if(this.customerArr[q].name == fromcontent[i].key){
              this.customerArr[q].formValue = fromcontent[i].v
            }
          }
        }
        this.totalArr = []
        this.newTotalArr = []
        for(var w = 0; w < this.table3.length; w++){
          var jsonArr = []
          for(var j = 0; j < this.table2.length; j++){
            if(this.table3[w].dptypename == this.table2[j].dptypename){
              // this.table2[j].ts = Data.ts
              jsonArr.push(this.table2[j])
              this.newTotalArr.push(this.table2[j])
            }
          }
          this.totalArr.push(jsonArr)
        }
      }
    }
  }
</script>
<style scoped="scoped">
  /* input框 禁用时的字体颜色 */
  /deep/
  .el-input.is-disabled .el-input__inner {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #303133;
    cursor: not-allowed;
  }
  /* 文本域 禁用时的字体颜色 */
  /deep/
  .el-textarea.is-disabled .el-textarea__inner {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #303133;
    cursor: not-allowed;
  }
</style>
