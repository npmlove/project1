<template>
  <div class="table-container">
    <el-form ref="form" :inline="false">
      <el-form-item label="表单名称">
        <el-input :disabled="true" v-model="searchData" placeholder="请输入表单名称" style="width: 230px;" />
      </el-form-item>
      <el-form-item label="类型选择">
        <el-radio-group :disabled="true" v-model="carType">
          <el-radio v-for="(item,index) in carTion" :key="index" :label="item.value">{{item.name}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>


    <div style="position: relative" >
      <el-table v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" border>
        <el-table-column label="字段名称" >
          <template #default="{ row }">
            <el-select :disabled="true" v-model="row.name" placeholder="请选择字段名称" filterable>
              <el-option v-for="item in carOption" :key="item.Value" :label="item.Name" :value="item.Name"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="是否列表显示" >
          <template #default="{ row }">
            <el-radio-group :disabled="true" v-model="row.isCarTable">
              <el-radio v-for="(item,index) in optTion" :key="index" :label="item.value">{{item.name}}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column label="是否必填" >
          <template #default="{ row }">
            <el-radio-group :disabled="true" v-model="row.required">
              <el-radio v-for="(item,index) in optTion" :key="index" :label="item.value">{{item.name}}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column label="输入/选择/时间" >
          <template #default="{ row }">
            <el-radio-group :disabled="true" v-model="row.select">
              <el-radio v-for="(item,index) in typeTion" :key="index" :label="item.value">{{item.name}}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column label="选项录入" >
          <template slot-scope="scope">
            <el-input :disabled="true" @focus="addSelectClick(scope.$index,0)"  v-if="scope.row.select == '选择'" v-model="scope.row.selectAdd" placeholder="请输入你的选项" type="textarea"  style="width: 100%"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="是否参与搜索" >
          <template #default="{ row }">
            <el-radio-group :disabled="true" v-model="row.search">
              <el-radio v-for="(item,index) in optTion" :key="index" :label="item.value">{{item.name}}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column label="值是否唯一" >
          <template #default="{ row }">
            <el-radio-group :disabled="true" v-model="row.keyValue">
              <el-radio v-for="(item,index) in optTion" :key="index" :label="item.value">{{item.name}}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column label="描述" >
          <template #default="{ row }">
            <el-input :disabled="true"  placeholder="请输入你的描述" type="textarea" v-model="row.describe" style="width: 100%"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-form ref="form" :inline="false" style="margin-top: 20px;">
      <el-form-item label="类型选择">
        <el-radio-group :disabled="true" v-model="carType1">
          <el-radio v-for="(item,index) in carTion1" :key="index" :label="item.value">{{item.name}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>


    <div style="position: relative" >
      <el-table v-loading="listLoading" :data="list1" :element-loading-text="elementLoadingText" border>
        <el-table-column label="字段名称" >
          <template #default="{ row }">
            <el-select :disabled="true" v-model="row.name" placeholder="请选择字段名称" filterable>
              <el-option v-for="item in customerOption" :key="item.Value" :label="item.Name" :value="item.Name"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="是否列表显示" >
          <template #default="{ row }">
            <el-radio-group :disabled="true" v-model="row.isCarTable">
              <el-radio v-for="(item,index) in optTion" :key="index" :label="item.value">{{item.name}}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column label="是否必填" >
          <template #default="{ row }">
            <el-radio-group :disabled="true" v-model="row.required">
              <el-radio v-for="(item,index) in optTion" :key="index" :label="item.value">{{item.name}}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column label="输入/选择/时间" >
          <template #default="{ row }">
            <el-radio-group :disabled="true" v-model="row.select">
              <el-radio v-for="(item,index) in typeTion" :key="index" :label="item.value">{{item.name}}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column label="选项录入" >
          <template slot-scope="scope">
            <el-input :disabled="true" @focus="addSelectClick(scope.$index,1)" v-if="scope.row.select == '选择'" v-model="scope.row.selectAdd" placeholder="请输入你的选项" type="textarea"  style="width: 100%"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="是否参与搜索" >
          <template #default="{ row }">
            <el-radio-group v-model="row.search">
              <el-radio :disabled="true" v-for="(item,index) in optTion" :key="index" :label="item.value">{{item.name}}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column label="值是否唯一" >
          <template #default="{ row }">
            <el-radio-group v-model="row.keyValue">
              <el-radio :disabled="true" v-for="(item,index) in optTion" :key="index" :label="item.value">{{item.name}}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column label="描述" >
          <template #default="{ row }">
            <el-input :disabled="true" placeholder="请输入你的描述" type="textarea" v-model="row.describe" style="width: 100%"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
        list: [],
        list1: [],
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
        customerOption: []
      }
    },
    activated() {
      this.initCar()
      this.initcustomer()
      this.carDetailsForm()
    },
    methods: {
      //查看详情 赋值表单
      async carDetailsForm() {
        let params = {
          CallType: 'formdetails',
          UserID: sessionStorage.getItem('UserID'),
          keyid: this.$route.query.cfuid
        }
        const { Data } = await getComTableGet(params)
        if(Data.length > 0){
          this.cfuid = Data[0].cfuid
          this.searchData = Data[0].formname
          var formcontent = JSON.parse(Data[0].formcontent)
          console.log(formcontent)
          for(var i = 0; i < formcontent.length; i++){
            if(formcontent[i].type == '车辆基本信息'){
              this.list = formcontent[i].data
            }else if(formcontent[i].type == '客户基本信息'){
              this.list1 = formcontent[i].data
            }
          }
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
    }
  }
</script>
<style scoped>
</style>
