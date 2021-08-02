<template>
  <div class="table-container">
    <el-form ref="form" :inline="false">
      <el-form-item label="表单名称">
        <el-input v-model="searchData" placeholder="请输入表单名称" style="width: 230px;" />
      </el-form-item>
      <el-form-item label="类型选择">
        <el-radio-group v-model="carType">
          <el-radio v-for="(item,index) in carTion" :key="index" :label="item.value">{{item.name}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>


    <div style="position: relative" >
      <el-table v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" border>
        <el-table-column label="字段名称" >
          <template #default="{ row }">
            <el-select v-model="row.name" placeholder="请选择字段名称" filterable>
              <el-option v-for="item in carOption" :key="item.Value" :label="item.Name" :value="item.Name"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="是否列表显示" >
          <template #default="{ row }">
            <el-radio-group v-model="row.isCarTable">
              <el-radio v-for="(item,index) in optTion" :key="index" :label="item.value">{{item.name}}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column label="是否必填" >
          <template #default="{ row }">
            <el-radio-group v-model="row.required">
              <el-radio v-for="(item,index) in optTion" :key="index" :label="item.value">{{item.name}}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column label="输入/选择/时间" >
          <template #default="{ row }">
            <el-radio-group v-model="row.select">
              <el-radio v-for="(item,index) in typeTion" :key="index" :label="item.value">{{item.name}}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column label="选项录入" >
          <template slot-scope="scope">
            <el-input @focus="addSelectClick(scope.$index,0)"  v-if="scope.row.select == '选择'" v-model="scope.row.selectAdd" placeholder="请输入你的选项" type="textarea"  style="width: 100%"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="是否参与搜索" >
          <template #default="{ row }">
            <el-radio-group v-model="row.search">
              <el-radio v-for="(item,index) in optTion" :key="index" :label="item.value">{{item.name}}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column label="值是否唯一" >
          <template #default="{ row }">
            <el-radio-group v-model="row.keyValue">
              <el-radio v-for="(item,index) in optTion" :key="index" :label="item.value">{{item.name}}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column label="描述" >
          <template #default="{ row }">
            <el-input  placeholder="请输入你的描述" type="textarea" v-model="row.describe" style="width: 100%"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px" >
          <template slot-scope="scope">
            <el-button type="text" @click="toEdit(0)">添加</el-button>
            <el-button type="text"  @click="toDel(scope.row,scope.$index,0)">删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-form ref="form" :inline="false" style="margin-top: 20px;">
      <el-form-item label="类型选择">
        <el-radio-group v-model="carType1">
          <el-radio v-for="(item,index) in carTion1" :key="index" :label="item.value">{{item.name}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>


    <div style="position: relative" >
      <el-table v-loading="listLoading" :data="list1" :element-loading-text="elementLoadingText" border>
        <el-table-column label="字段名称" >
          <template #default="{ row }">
            <el-select v-model="row.name" placeholder="请选择字段名称" filterable>
              <el-option v-for="item in customerOption" :key="item.Value" :label="item.Name" :value="item.Name"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="是否列表显示" >
          <template #default="{ row }">
            <el-radio-group v-model="row.isCarTable">
              <el-radio v-for="(item,index) in optTion" :key="index" :label="item.value">{{item.name}}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column label="是否必填" >
          <template #default="{ row }">
            <el-radio-group v-model="row.required">
              <el-radio v-for="(item,index) in optTion" :key="index" :label="item.value">{{item.name}}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column label="输入/选择/时间" >
          <template #default="{ row }">
            <el-radio-group v-model="row.select">
              <el-radio v-for="(item,index) in typeTion" :key="index" :label="item.value">{{item.name}}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column label="选项录入" >
          <template slot-scope="scope">
            <el-input @focus="addSelectClick(scope.$index,1)" v-if="scope.row.select == '选择'" v-model="scope.row.selectAdd" placeholder="请输入你的选项" type="textarea"  style="width: 100%"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="是否参与搜索" >
          <template #default="{ row }">
            <el-radio-group v-model="row.search">
              <el-radio v-for="(item,index) in optTion" :key="index" :label="item.value">{{item.name}}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column label="值是否唯一" >
          <template #default="{ row }">
            <el-radio-group v-model="row.keyValue">
              <el-radio v-for="(item,index) in optTion" :key="index" :label="item.value">{{item.name}}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column label="描述" >
          <template #default="{ row }">
            <el-input  placeholder="请输入你的描述" type="textarea" v-model="row.describe" style="width: 100%"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px" >
          <template slot-scope="scope">
            <el-button type="text" @click="toEdit(1)">添加</el-button>
            <el-button type="text"  @click="toDel(scope.row,scope.$index,1)">删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center;margin-top: 10px;">
        <el-button style="width: 200px;" class="login-btn" type="primary" @click="handleFormUpdate" >提交</el-button>
      </div>
    </div>
    <!-- 弹窗 -->
    <el-dialog title="选项录入" :visible.sync="dialogFormVisible" width="500px" @close="close" v-dialogDrag :close-on-click-modal="false" v-if="dialogFormVisible" >
      <el-form ref="form" label-width="80px">
        <el-form-item v-for="(item,index) in formTable" :key="index" :label="'选项名称'+(index+1)">
          <el-col :span="12">
            <el-input v-model="item.value" autocomplete="off" placeholder="请输入选项名称"></el-input>
          </el-col>
          <el-col :span="10" style="margin-left: 20px;">
            <el-button size="mini" style="border-color: #41B584;color: #41B584;" @click="addPoint('添加',index,item)"> 添加 </el-button>
            <el-button size="mini" style="border-color: #41B584;color: #41B584;" @click="addPoint('删除',index,item)"> 删除 </el-button>
          </el-col>
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
  import { getFormUpdate } from '@/api/businessSet'
  import { getDictionary, getComTableGet } from '@/api/carList'
  export default {
    components: {},
    data() {
      return {
        listLoading: false,
        elementLoadingText: '正在加载...',
        searchData: '',
        list: [
          {
            uid: this.getGuid(),
            name: '',
            required: false,
            select: '输入',
            selectAdd: '',
            selectArr: '',
            search: false,
            keyValue: false,
            describe: '',
            formValue: '',
            isCarTable: true
          }
        ],
        list1: [
          {
            uid: this.getGuid(),
            name: '',
            required: false,
            select: '输入',
            selectAdd: '',
            selectArr: '',
            search: false,
            keyValue: false,
            describe: '',
            formValue: '',
            isCarTable: true
          }
        ],
        carType: '车辆基本信息',
        carTion: [
          {
            value: '车辆基本信息',
            name: '车辆基本信息'
          }
        ],
        carType1: '客户基本信息',
        carTion1: [
          {
            value: '客户基本信息',
            name: '客户基本信息'
          }
        ],
        optTion: [
          {
            value: true,
            name: '是'
          },
          {
            value: false,
            name: '否'
          }
        ],
        typeTion: [
          {
            value: '输入',
            name: '输入'
          },
          {
            value: '选择',
            name: '选择'
          },
          {
            value: '时间',
            name: '时间'
          }
        ],
        carOption: [],
        customerOption: [],
        //弹窗
        dialogFormVisible: false,
        rowIndex: '',
        rowType: '',
        formTable: [
          {
            value: '',
            key: this.getGuid()
          }
        ],
        cfuid: ''
      }
    },
    activated() {
      this.initCar()
      this.initcustomer()
    },
    methods: {
      getGuid() {
        function S4() {
          return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        }
        return ( S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4() )
      },
      //添加行
      toEdit(type){
        if(type == 0){
          var json = {
            uid: this.getGuid(),
            name: '',
            required: false,
            select: '输入',
            selectAdd: '',
            selectArr: '',
            search: false,
            keyValue: false,
            describe: '',
            formValue: '',
            isCarTable: true
          }
          this.list.push(json)
        }else if(type == 1){
          var json = {
            uid: this.getGuid(),
            name: '',
            required: false,
            select: '输入',
            selectAdd: '',
            selectArr: '',
            search: false,
            keyValue: false,
            describe: '',
            formValue: '',
            isCarTable: true
          }
          this.list1.push(json)
        }

      },
      //获取车辆基本信息
      async initCar() {
        let params = {
          MarkID: 'carDetails',
          UserID: sessionStorage.getItem('UserID')
        }
        const { Data } = await getDictionary(params)
        this.carOption = Data
      },
      //获取车辆基本信息
      async initcustomer() {
        let params = {
          MarkID: 'customerDetails',
          UserID: sessionStorage.getItem('UserID')
        }
        const { Data } = await getDictionary(params)
        this.customerOption = Data
      },
      //数据提交
      async handleFormUpdate() {
        if(!this.searchData){
          this.$baseMessage('请填写表单名称', 'error')
          return
        }
        if(this.carType == '车辆基本信息'){
          for(var i = 0; i < this.list.length; i ++){
            console.log(this.list[i].name)
            if(!this.list[i].name){
              this.$baseMessage('车辆基本信息的第'+(i+1)+'行字段名称没有填写', 'error')
              return
            }else if(this.list[i].select == false && !this.list[i].selectAdd){
              this.$baseMessage('车辆基本信息的第'+(i+1)+'行选项录入没有填写', 'error')
              return
            }
          }
        }
        if(this.carType1 == '客户基本信息'){
          for(var j = 0; j < this.list1.length; j ++){
            if(!this.list1[j].name){
              this.$baseMessage('客户基本信息的第'+(j+1)+'行字段名称没有填写', 'error')
              return
            }else if(this.list1[j].select == false && !this.list1[j].selectAdd){
              this.$baseMessage('客户基本信息的第'+(j+1)+'行选项录入没有填写', 'error')
              return
            }
          }
        }
        var formcontent = [
          {
            type: this.carType,
            data: this.list
          },
          {
            type: this.carType1,
            data: this.list1
          }
        ]
        let params = {
          CallType: 'new',
          UserID: sessionStorage.getItem('UserID'),
          cfuid: this.cfuid ? this.cfuid : this.getGuid(),
          formname: this.searchData,
          formcontent: JSON.stringify(formcontent)
        }
        const { Data } = await getFormUpdate(params)
        if(Data[0].execStatus == '0'){
          this.$baseMessage('添加成功', 'success')
          this.list = [
            {
              uid: this.getGuid(),
              name: '',
              required: false,
              select: true,
              selectAdd: '',
              selectArr: '',
              search: false,
              keyValue: false,
              describe: ''
            }
          ]
          this.list1 = [
            {
              uid: this.getGuid(),
              name: '',
              required: false,
              select: true,
              selectAdd: '',
              selectArr: '',
              search: false,
              keyValue: false,
              describe: ''
            }
          ]
          this.searchData = ''
        }
      },
      toDel(row,index,type){
        var _this = this
        if(type == 0){
          this.$baseConfirm('你确定要删除当前行吗？', null, async () => {
            _this.list.splice(_this.list.indexOf(row),1)
          })
        }else if(type == 1){
          this.$baseConfirm('你确定要删除当前行吗？', null, async () => {
            _this.list1.splice(_this.list1.indexOf(row),1)
          })
        }
      },
      //
      addPoint(type,index,row) {
        if(type == '添加'){
          var json = {
            value: '',
            key: this.getGuid()
          }
          this.formTable.push(json)
        }else{
          this.list.splice(this.list.indexOf(row),1)
        }
      },
      addSelectClick(index,type){
        this.dialogFormVisible = true
        this.rowIndex = index
        this.rowType = type
      },
      // 弹窗关闭
      close() {
        this.dialogFormVisible = false
        this.rowType = ''
        this.rowIndex = ''
        this.formTable = [
          {
            value: '',
            key: this.getGuid()
          }
        ]
      },
      //弹窗 提交、保存
      save(){
        var selectAdd = []
        for(var i = 0; i < this.formTable.length; i++){
          if(!this.formTable[i].value){
            this.$baseMessage('请输入选项名称', 'error')
            return
          }
          selectAdd.push(this.formTable[i].value)
        }
        if(this.rowType == 0){
          this.list[this.rowIndex].selectAdd = selectAdd.toString()
          this.list[this.rowIndex].selectArr = this.formTable
        }else if(this.rowType == 1){
          this.list1[this.rowIndex].selectAdd = selectAdd.toString()
          this.list1[this.rowIndex].selectArr = this.formTable
        }
        this.dialogFormVisible = false
        this.rowIndex = ''
        this.formTable = [
          {
            value: '',
            key: this.getGuid()
          }
        ]
      }
    },
  }
</script>
<style scoped>
</style>
