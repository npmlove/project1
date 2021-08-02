<template>
  <div class="form-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="16">
        <div style="margin-bottom: 10px;color: #CCC;font-size: 16px;">车辆基本信息</div>
        <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm" :inline="true">
          <el-form-item v-for="(item,index) in carArr" :key="index" :label="item.name" :required="item.required">
            <el-input v-if="item.select == '输入'" :placeholder="'请输入'+item.name" v-model="item.formValue" style="width: 270px"></el-input>
            <el-select v-else-if="item.select == '选择'" :placeholder="'请选择'+item.name" v-model="item.formValue" style="width: 270px" filterable>
              <el-option v-for="selectItem in item.selectArr" :key="selectItem.key" :label="selectItem.value" :value="selectItem.value"></el-option>
            </el-select>
            <el-date-picker v-else-if="item.select == '时间'" v-model="item.formValue" style="width: 270px;" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
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
            <el-input v-if="item.select == '输入'" :placeholder="'请输入'+item.name" v-model="item.formValue" style="width: 270px"></el-input>
            <el-select v-else-if="item.select == '选择'" :placeholder="'请选择'+item.name" v-model="item.formValue" style="width: 270px" filterable>
              <el-option v-for="selectItem in item.selectArr" :key="selectItem.key" :label="selectItem.value" :value="selectItem.value"></el-option>
            </el-select>
            <el-date-picker v-else-if="item.select == '时间'" v-model="item.formValue" style="width: 270px;" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div style="width: 100%;border-bottom: 1px dashed #CCC;"></div>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="16">
        <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm" :inline="true" style="margin-top: 20px;">
          <el-form-item label="网关产品">
            <el-button icon="el-icon-plus" size="medium" type="primary" @click="handleAdd">网关产品</el-button>
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
              <!-- <el-table-column prop="createdbyName" label="绑定人" ></el-table-column>
              <el-table-column prop="createddate" label="绑定时间" ></el-table-column> -->
              <el-table-column label="操作" width="180px" >
                <template slot-scope="scope">
                  <el-button type="text"  @click="toDel(scope.row,scope.$index)">删除 </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div style="text-align: center;margin-top: 20px;">
            <el-form-item>
              <el-button style="width: 200px;" type="primary" @click="submitForm">提交</el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-col>
    </el-row>
    <!-- 弹窗 -->
    <el-dialog title="添加产品网关" :visible.sync="dialogFormVisible" width="500px" @close="close" v-dialogDrag :close-on-click-modal="false" v-if="dialogFormVisible" >
      <el-form label-width="120px">
        <el-form-item label="网关产品SN">
          <el-input v-model="chanPinSn" autocomplete="off" placeholder="请输入选项名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getShopTruckDetailsDs, getShopTruckUpdate, getComTableGet } from '@/api/carList'
  export default {
    name: 'Form',
    data() {
      return {
        formname: '',
        cfuid: '',
        //车辆基本信息
        carArr: [],
        //客户基本信息
        customerArr: [],
        tableData: [],
        dialogFormVisible: false,
        chanPinSn: ''
      }
    },
    created() {
      window.addEventListener('beforeunload', e => this.beforeUnloadClick(e))
    },
    activated() {
      if(sessionStorage.getItem('commonCarAdd') == 'true'){
        this.carDetailsForm()
        sessionStorage.setItem('commonCarAdd','false')
      }
    },
    methods: {
      beforeUnloadClick(e) {
        sessionStorage.setItem('commonCarAdd','true')
      },
      async submitForm() {
        var uids = []
        var formsearchcontent = []
        var formcontent = []

        if(this.tableData.length > 0){
          for(var i = 0; i < this.tableData.length; i++){
            uids.push(this.tableData[i].stauid)
          }
        }
        for(var j = 0; j < this.carArr.length; j++){
          var json = {
            key: this.carArr[j].name,
            v: this.carArr[j].formValue,
            iskey: this.carArr[j].keyValue ? 1 : 0,
            isSearch: this.carArr[j].search ? 1 : 0,
            isshow: this.carArr[j].isCarTable ? 1 : 0,
          }
          formcontent.push(json)
          if(this.carArr[j].search){
            formsearchcontent.push(this.carArr[j].name)
          }
        }
        for(var q = 0; q < this.customerArr.length; q++){
          var json = {
            key: this.customerArr[q].name,
            v: this.customerArr[q].formValue,
            iskey: this.customerArr[q].keyValue ? 1 : 0,
            isSearch: this.customerArr[q].search ? 1 : 0,
            isshow: this.customerArr[q].isCarTable ? 1 : 0,
          }
          formcontent.push(json)
          if(this.customerArr[q].search){
            formsearchcontent.push(this.customerArr[q].name)
          }
        }
        let params = {
          CallType: 'new',
          UserID: sessionStorage.getItem('UserID'),
          stuid: this.getGuid(),
          formcontent: JSON.stringify(formcontent),
          formsearchcontent: formsearchcontent.toString(),
          uids: uids.toString()
        }
        const { Data, Status } = await getShopTruckUpdate(params)
        if(Status == 0){
          sessionStorage.setItem('commonCarAdd',true)
          this.$router.push('./commonCarList')
        }
      },
      close() {
        this.chanPinSn = ''
        this.dialogFormVisible = false
      },
      handleAdd() {
        this.dialogFormVisible = true
      },
      toDel(row,index) {
        this.tableData.splice(this.tableData.indexOf(row),1)
      },
      async save() {
        let params = {
          CallType: 'checkbinddevicesn',
          UserID: sessionStorage.getItem('UserID'),
          val1: this.chanPinSn
        }
        const { Data, Status } = await getComTableGet(params)
        if(Status == 0 && Data.length > 0){
          var json = {
            stauid: Data[0].stauid,
            devicename: Data[0].devicename,
            devicetype: Data[0].devicetype,
            devicesn: Data[0].devicesn,
            astatus: Data[0].astatus,
            createddate: this.formatTime,
            createdbyuid: sessionStorage.getItem('UserID'),
            createdbyName: JSON.parse(sessionStorage.getItem('userInfo')).RealName
          }
          this.tableData.push(Data[0])
          this.dialogFormVisible = false
          this.chanPinSn = ''
        }else{
          this.$baseMessage('添加产品网关失败', 'error')
        }

      },
      getGuid() {
        function S4() {
          return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        }
        return ( S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4() )
      },
      formatTime() {
      	var date = new Date();
      	var YY = date.getFullYear();
      	var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      	var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
      	var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      	var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
      	var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
      	return YY + MM + DD +" "+hh + mm+ ss;
      },

      //查看详情 赋值表单
      async carDetailsForm() {
        let params = {
          CallType: 'newshoptruck',
          UserID: sessionStorage.getItem('UserID'),
          keyid: ''
        }
        const { Data } = await getComTableGet(params)
        if(Data.length > 0){
          this.cfuid = Data[0].cfuid
          this.formname = Data[0].formname
          var formcontent = JSON.parse(Data[0].formcontent)
          console.log(formcontent)
          for(var i = 0; i < formcontent.length; i++){
            if(formcontent[i].type == '车辆基本信息'){
              this.carArr = formcontent[i].data
            }else if(formcontent[i].type == '客户基本信息'){
              this.customerArr = formcontent[i].data
            }
          }
        }else{
          this.$baseMessage('没有表单信息请去业务设置里面添加', 'error')
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
