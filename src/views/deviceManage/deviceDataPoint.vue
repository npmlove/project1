<template>
  <div class="table-container">
    <!-- 详情展示 -->
    <el-form :label-position="labelPosition" :inline="true" size="medium" class="demo-form-inline" style="margin-bottom: -15px;">
      <el-form-item label="设备名称" label-width="80px" required>
        <el-input :disabled="true" v-model="details.cdevicename" style="width: 230px;"></el-input>
      </el-form-item>
      <el-form-item label="设备类型"  label-width="80px" required>
        <el-input :disabled="true" v-model="details.cdevicetype" style="width: 230px" ></el-input>
      </el-form-item>
      <el-form-item label="设备类型描述" label-width="110px" required>
        <el-input :disabled="true" v-model="details.cdevicedesc" style="width: 230px" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" ></el-input>
      </el-form-item>
    </el-form>
    <!-- 搜索条件 -->
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form ref="form" :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-input v-model="searchData" placeholder="请输入点位名称/类型" style="width: 300px" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" native-type="submit" @click="handleQuery" > 查询 </el-button>
            <el-button @click="restClick">重置</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-button icon="el-icon-plus" type="primary" @click="handleAdd" style="float: right" >添加设备点位</el-button>
      </vab-query-form-right-panel>
    </vab-query-form>
    <!-- 表格 数据 -->
    <div style="position: relative">
      <el-table ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" :height="height" border>
        <el-table-column v-if="itemArr.indexOf('点位类别') > -1" show-overflow-tooltip label="点位类别" prop="dptypename" ></el-table-column>
        <el-table-column v-if="itemArr.indexOf('点位编号') > -1" show-overflow-tooltip label="点位编号" prop="pointkey" ></el-table-column>
        <el-table-column v-if="itemArr.indexOf('点位名称') > -1" show-overflow-tooltip label="点位名称" prop="pointname" ></el-table-column>
        <el-table-column v-if="itemArr.indexOf('点位类型') > -1" show-overflow-tooltip label="点位类型" prop="pointdatatype" ></el-table-column>
        <el-table-column v-if="itemArr.indexOf('点位单位') > -1" show-overflow-tooltip label="点位单位" prop="pointunit" ></el-table-column>
        <el-table-column v-if="itemArr.indexOf('点位描述') > -1" show-overflow-tooltip label="点位描述" prop="pointdesc" ></el-table-column>
        <el-table-column v-if="itemArr.indexOf('操作') > -1" show-overflow-tooltip label="操作" width="180px" >
          <template #default="{ row }">
            <el-button type="text" @click="goToEdit(row)">编辑 </el-button>
            <el-button type="text" @click="toDelete(row)">删除 </el-button>
            <el-button type="text"@click="setPointRule(row)">设置点位规则 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-icon">
        <el-popover placement="bottom-start" trigger="click">
          <el-checkbox-group v-model="itemArr">
            <div class="checkbox-block">
              <el-checkbox v-for="item in checkArr" :label="item" :key="item" ></el-checkbox>
            </div>
          </el-checkbox-group>
          <vab-icon slot="reference" :icon="['fas', 'cog']"></vab-icon>
        </el-popover>
      </div>
    </div>
    <!-- 分页 -->
    <el-pagination :background="background" :current-page="currentPage" :layout="layout" :page-size="pageSize" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" ></el-pagination>
    <!--新增点位 弹窗 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close" v-dialogDrag :close-on-click-modal="false" v-if="dialogFormVisible" >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="点位类型" prop="pointType">
          <el-select v-model="form.pointType" placeholder="请选择点位类型" filterable clearable v-el-select-loadmore="loadmorePointType" style="width: 310px" >
            <el-option v-for="item in pointTypeArr" :key="item.dptypeuid" :label="item.dptypename" :value="item.dptypeuid" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="点位数据图标" prop="pointicon">
          <el-input v-model="form.pointicon" autocomplete="off"  placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="点位名称" prop="pointname">
          <el-input v-model="form.pointname" autocomplete="off"  placeholder="请输入点位名称"></el-input>
        </el-form-item>
        <el-form-item label="点位编号" prop="pointkey">
          <span v-if="dialogFlag == 'new'" style="font-weight: 700;">点位编号系统自动添加</span>
          <span v-if="dialogFlag == 'edit'" >{{form.pointkey}}</span>
        </el-form-item>
        <el-form-item label="点位数据类型" prop="pointdatatype">
          <el-select v-model="form.pointdatatype" clearable placeholder="请选择点位数据类型" style="width: 310px;">
            <el-option v-for="item in options" :key="item.DictionaryID" :label="item.Name" :value="item.Name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="点位单位" prop="pointunit">
          <el-select v-model="form.pointunit" clearable filterable placeholder="请选择点位单位" style="width: 310px;">
            <el-option v-for="item in unitoptions" :key="item.DictionaryID" :label="item.Name" :value="item.Name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="点位描述" prop="pointdesc">
          <el-input v-model="form.pointdesc" autocomplete="off" type="textarea" placeholder="请输入点位描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 点位规则 drawer -->
    <el-drawer :title="'设置点位规则' + '【' + currentRow.pointdatatype + '】'" :visible.sync="drawer" :direction="direction" size="700px" custom-class="demo-drawer"  ref="drawer" @close="handleClose" >
      <div style="width: 100%; height:calc(100vh - 110px) ; overflow-y: auto;">
        <el-form ref="drawerForm" :model="drawerForm" :rules="drawerFormRules" style="padding: 10px 15px;">
          <el-form-item label="报警条件" prop="pointRuleObj">
            <el-tooltip class="item" effect="dark" content="点位条件和点位条件之间组合报警" placement="top-start">
              <span class="el-icon-question"></span>
            </el-tooltip>
            <span v-show="alarmFlag" style="color: #f34d37;margin-left: 20px;">【点位】【操作符】【点位值】【点位组合操作】必填!</span>
            <el-col :span="24" v-for="(item,index) in pointRuleObj" :key="'pointRuleObj' + index" style="margin-bottom: 10px;">
              <!-- 选择点位 -->
              <el-col :span="6">
                <el-select v-model="item.pointname" placeholder="点位" filterable v-el-select-loadmore="loadmore">
                  <el-option v-for="item in pointSelectArr" :key="item.pointuid" :label="item.pointname" :value="item.pointname"></el-option>
                </el-select>
              </el-col>
              <!-- 选择操作符 -->
              <el-col class="line" :span="5" style="padding: 0 4px">
                <el-select v-model="item.op" placeholder="操作符" >
                  <el-option v-for="item in pointOPArr" :key="item.value" :label="item.label" :value="item.label"></el-option>
                </el-select>
              </el-col>
              <!-- 点位值 -->
              <el-col :span="6" :style="{paddingRight: '4px'}">
                <el-input v-model="item.pointval" autocomplete="off" placeholder="点位值"></el-input>
              </el-col>
              <!-- 点位组合操作 -->
              <el-col :span="5" v-show="pointRuleObj.length > 1 && index !== pointRuleObj.length-1">
                <el-select v-model="item.rule" placeholder="点位组合操作" >
                  <el-option v-for="item in pointComposeArr" :key="item.value" :label="item.label" :value="item.label"></el-option>
                </el-select>
              </el-col>
              <el-col :span="2" :style="{paddingLeft: '10px'}">
                <span style="border-color: #41B584;color: #41B584;cursor: pointer;" @click="delPoint(index)">删除</span>
              </el-col>
            </el-col>
            <!-- 添加 按钮 -->
            <el-col :span="24" :style="{marginLeft: '0px'}">
              <el-button size="mini" style="border-color: #41B584;color: #41B584;" @click="addPoint"> 添加 </el-button>
            </el-col>
          </el-form-item>
          <el-form-item label="转换" prop="mapRelation" v-show="currentRow.pointdatatype == '值映射类型' ">
            <el-tooltip class="item" effect="dark" content="将点位结果值映射为自定义字段,例如:deviceId 转为 id" placement="top-start">
              <span class="el-icon-question"></span>
            </el-tooltip>
            <span v-show="mapRelationFlag" style="color: #f34d37;margin-left: 20px;">【点位值】【映射值】必填!</span>
            <el-col :span="24" v-for="(item,index) in mapRuleObj" :key="'mapRuleObj' + index" style="margin-bottom: 10px;">

              <el-col :span="10" :style="{paddingRight: '4px'}">
                <el-input v-model="item.oldVal" autocomplete="off" placeholder="点位值"></el-input>
              </el-col>
              <el-col :span="10" >
                <el-input v-model="item.newVal" autocomplete="off" placeholder="映射值"></el-input>
              </el-col>
              <el-col :span="2" :style="{paddingLeft: '10px'}">
                <span style="border-color: #41B584;color: #41B584;cursor: pointer;" @click="delMapPoint(index)">删除</span>
              </el-col>
            </el-col>
            <!-- 添加 按钮 -->
            <el-col :span="24" :style="{marginLeft: '0px'}">
              <el-button size="mini" style="border-color: #41B584;color: #41B584;" @click="addMapPoint"> 添加 </el-button>
            </el-col>
          </el-form-item>

          <el-form-item label="是否报警" prop="isAlarm" v-show="isAlarmChecked">
            <el-radio disabled v-model="drawerForm.isAlarm" label="1">是</el-radio>
          </el-form-item>

          <el-form-item label="选择报警点位" v-show="!isAlarmChecked">
          <el-checkbox :indeterminate="drawerForm.isIndeterminate" v-model="drawerForm.checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="drawerForm.checkedPoints" @change="handleCheckedPointChange">
              <el-checkbox v-for="(item,index) in isAlarmCheckedArr" :label="item.pointname" :key="index">{{item.pointname}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="是否强制创建" prop="isCreate">
            <el-radio-group v-model="drawerForm.isCreate">
              <el-radio label="是"></el-radio>
              <el-radio label="否"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <!-- drawer 底部按钮 -->
      <div style="padding:0 40px;position: fixed;bottom: 20px;">
        <el-button type="primary" @click="handleDrawerSave" style="width: 300px;">确 定</el-button>
        <el-button @click="handleClose" style="width: 300px;">取 消</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
  import { getDeviceDataPointList, deviceDataPointUpdate, getFileType } from '@/api/device'
  import { getDeviceDataPointTypeList } from '@/api/businessSet'
  import * as assist from '@/utils/assist'
  export default {
    name: 'ComprehensiveTable',
    components: {},
    data() {
      return {
        labelPosition: 'left',
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        background: true,
        elementLoadingText: '正在加载...',
        details: {}, //上方 详情信息
        searchData: '',
        list: [],
        currentRow:{}, //设置点位选择的当前行
        title: '', //弹窗名字
        dialogFormVisible: false,
        dialogFlag:'',
        form: {
          pointType:'',  //点位大类
          pointicon: '',
          pointname: '',
          pointkey: '',
          pointdatatype: '',
          pointunit: '',
          pointdesc: ''
        },
        pointTypeTotal:'',
        pointTypeArr:[],  //点位大类 数组
        pointTypeSelectParams: { //点位大类 查询 参数
          pageSize: 10,
          currentPage: 1,
        },

        options: [], //设备点位数据类型
        unitoptions: [], //点位单位数组
        rules: {
          pointType: [
            { required: false, trigger: 'blur', message: '请选择点位类型' },
          ],
          pointicon: [
            { required: false, trigger: 'blur', message: '请输入点位数据图标' },
          ],
          pointname: [
            { required: true, trigger: 'blur', message: '请输入点位名称' },
          ],
          pointkey: [
            { required: false, trigger: 'blur', message: '请输入点位编号' },
          ],
          pointdatatype: [
            { required: true, trigger: 'change', message: '请选择点位数据类型' },
          ],
          pointunit: [
            { required: true, trigger: 'blur', message: '请选择点位单位' },
          ],
          pointdesc: [
            { required: false, trigger: 'blur', message: '请输入点位描述' },
          ],
          mapvalue: [
            { required: true, trigger: 'blur', message: '请选择映射值' },
          ],
        },
        itemArr: ['点位类别', '点位编号', '点位名称', '点位类型', '点位单位', '点位描述', '操作'],
        checkArr: ['点位类别', '点位编号', '点位名称', '点位类型', '点位单位', '点位描述', '操作'],
        pageSize: 10,
        currentPage: 1,
        //左侧点位规则弹窗
        drawer: false,
        direction: 'rtl',
        drawerForm: {
          isAlarm:'1', //是否报警
          isAlarmArr:[],
          isCreate:'', //是否强制创建
          checkAll: false,
          checkedPoints: [], // 选中的点位
          isIndeterminate: true, //checkbox 全选、非全选的样式
        },
        //点位规则数据 初始值
        pointRuleObj: [{pointname:'',op:'', pointval:'', rule:''}],
        //转换（映射） 数据 初始值
        mapRuleObj: [{oldVal:'',newVal:''}],
        //运算符
        pointOPArr: [
          { value: '0', label: '等于(=)' },
          { value: '1', label: '不等于(!=)' },
          { value: '2', label: '大于(>)' },
          { value: '3', label: '小于(<)' },
          { value: '4', label: '大于等于(>=)' },
          { value: '5', label: '小于等于(<=)' },
        ],
        //表达式运算
        pointComposeArr: [
          { value: '0', label: '和(&&)' },
          { value: '1', label: '或者(||)' }
        ],
        drawerFormRules: {
          pointRuleObj: [
            { required: false, trigger: 'blur', message: '请填写报警条件' },
          ],
          mapRelation: [
            { required: false, trigger: 'blur', message: '请填写转换值' },
          ],
          isAlarm: [
            { required: true, trigger: 'blur', message: '请选择是否报警' },
          ],
          isCreate: [
            { required: true, trigger: 'blur', message: '请选择是否强制创建' },
          ],
        },
        alarmFlag:false, //报警条件校验是否填写完整
        mapRelationFlag:false, //映射 是否填写完整
        isAlarmChecked:false,
        isAlarmCheckedArr:[],
        //点位下拉选择
        pointSelectArr: [],
        pointSelectParams: {
          pageSize: 10,
          currentPage: 1,
        },
        operationArr: [], //权限
      }
    },
    computed: {
      height() {
        return this.$baseTableHeight()
      }
    },
    mounted() {
      // this.operationArr = assist.operation('otaList')
    },
    activated() {
      this.fetchData()
      let details = JSON.parse(sessionStorage.getItem('deviceTypeDetail'))
      this.details = details
    },
    watch:{
      pointRuleObj:{
        handler(){
          let result = assist.arrNoRepeatByKey(this.pointRuleObj)
          if(result.length == 1){
            this.isAlarmChecked = true
          } else {
            this.isAlarmChecked = false
            this.isAlarmCheckedArr = result
          }
        },
        deep:true
      }
    },
    methods: {
      getGuid() {
        function S4() {
          return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        }
        return ( S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4() )
      },
      async queryPointUnit() {
        let params = {
          MarkID: '设备点位单位',
          UserID: sessionStorage.getItem('UserID'),
        }
        const { Data } = await getFileType(params)
        this.unitoptions = Data
      },
      async queryPointDataType() {
        let params = {
          MarkID: '设备点位数据类型',
          UserID: sessionStorage.getItem('UserID'),
        }
        const { Data } = await getFileType(params)
        this.options = Data
      },
      //点位大类 下拉选择 懒加载
      async queryPointType() {
        let params = {
          CallType: '',
          UserID: sessionStorage.getItem('UserID'),
          cdtypeuid: this.details.cdtypeuid,
          SearchKey: '',
          PageSize: this.pointTypeSelectParams.pageSize,
          CurrentPage: this.pointTypeSelectParams.currentPage
        }
        const { Data, Count } = await getDeviceDataPointTypeList(params)
        // this.pointTypeArr = Data
        this.pointTypeArr = [...this.pointTypeArr, ...Data];
        this.pointTypeTotal = Count
        // console.log(Data)
      },
      //点位大类 下拉选择 懒加载
      loadmorePointType() {
        this.pointTypeSelectParams.currentPage = this.pointTypeSelectParams.currentPage+1;
        if(this.pointTypeSelectParams.currentPage >= this.pointTypeTotal/10+1){
          return
        }
        this.queryPointType();
      },
      // 点击添加
      handleAdd() {
        this.queryPointType()  //查询点位大类
        this.queryPointUnit()  //点击添加 查询 点位单位
        this.queryPointDataType()  //点击添加 查询 点位数据类型

        this.title = '添加设备点位'
        this.dialogFlag = 'new'
        this.dialogFormVisible = true
      },
      //点击编辑
      goToEdit(row) {
        this.queryPointType()  //查询点位大类
        this.queryPointUnit()  //点击添加 查询 点位单位
        this.queryPointDataType()  //点击添加 查询 点位数据类型

        this.title = '编辑设备点位'
        this.dialogFlag = 'edit'
        this.dialogFormVisible = true
        this.currentRow = row

        this.form.pointType = row.dptypename
        this.form.pointicon = row.pointicon
        this.form.pointname = row.pointname
        this.form.pointkey = row.pointkey
        this.form.pointdatatype = row.pointdatatype
        this.form.pointunit = row.pointunit
        this.form.pointdesc = row.pointdesc
      },
      // 弹窗关闭
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
        this.currentRow = {}
        this.pointTypeArr = []
        this.pointTypeSelectParams.pageSize = 10
        this.pointTypeSelectParams.currentPage = 1
        this.$emit('fetch-data')
      },

      //点击 删除
      toDelete(row){
        this.$baseConfirm('你确定要删除当前行吗？', null, async () => {
          let params = {
            CallType: 'del',
            UserID: sessionStorage.getItem('UserID'),
            AppToken: '',
            cdtypeuid: row.cdtypeuid,
            pointuid: row.pointuid,
            pointicon: row.pointicon,
            pointname: row.pointname,
            pointkey: row.pointkey,
            pointdatatype: row.pointdatatype,
            pointunit: row.pointunit,
            pointdesc: row.pointdesc
          }
          this.submit(params)
        })
      },
      // 弹窗确定
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            let params = {
              CallType: this.dialogFlag == 'new' ? 'new' : 'edit',
              UserID: sessionStorage.getItem('UserID'),
              AppToken: '',
              cdtypeuid: this.$route.query.cdtypeuid,
              pointuid: this.dialogFlag == 'new' ? this.getGuid() : this.currentRow.pointuid,
              pointicon: this.form.pointicon,
              pointname: this.form.pointname,
              pointkey: this.form.pointkey,
              pointdatatype: this.form.pointdatatype,
              pointunit: this.form.pointunit,
              pointdesc: this.form.pointdesc,
              dptypeuid: this.form.pointType
            }
            this.dialogFormVisible = false
            this.$refs['form'].resetFields()
            this.form = this.$options.data().form
            this.submit(params) //最后一步提交
            // console.log(params)
          } else {
            return false
          }
        })
      },
      // 弹窗信息提交
      async submit(params) {
        let result = await deviceDataPointUpdate(params)
        if (result.Status == 0) {
          this.$baseMessage('操作成功', 'success')
          this.fetchData() //更新列表
        }
      },
      // 查询列表信息
      async fetchData() {
        this.listLoading = true
        let params = {
          CallType: '',
          UserID: sessionStorage.getItem('UserID'),
          orguid:'',
          cdtypeuid: this.$route.query.cdtypeuid,
          SearchKey: this.searchData,
          PageSize: this.pageSize,
          CurrentPage: this.currentPage,
        }
        const { Data, Count } = await getDeviceDataPointList(params)
        this.list = Data
        this.total = Count
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      },
      // 分页
      handleSizeChange(val) {
        this.pageSize = val
        this.fetchData()
      },
      // 分页
      handleCurrentChange(val) {
        this.currentPage = val
        this.fetchData()
      },
      //条件查询
      handleQuery() {
        this.currentPage = 1
        this.fetchData()
      },
      // 重置
      restClick() {
        this.searchData = ''
        this.pageSize = 10
        this.currentPage = 1
        this.fetchData()
      },
      //点击设置点位规则
      setPointRule(row){
        this.currentRow = row
        this.drawer = true
        //打开drawer 弹窗赋值
        if(this.currentRow.pointalarmvalue){
          let valone = JSON.parse(this.currentRow.pointalarmvalue)
          this.pointRuleObj = valone  //点位规则数据
          let valtwo = JSON.parse(this.currentRow.pointvaluemap)
          this.mapRuleObj = valtwo  //转换（映射） 数据
        }
        //查询点位信息
        this.getSelectPoint()
      },
      //点位 下拉选择 懒加载
      loadmore() {
        this.pointSelectParams.currentPage = this.pointSelectParams.currentPage+1;
        this.getSelectPoint();
      },
      //点位 下拉选择 懒加载
      async getSelectPoint() {
        if(this.pointSelectParams.currentPage >= this.total/10+1){
          return
        }
        let params = {
          CallType: '',
          UserID: sessionStorage.getItem('UserID'),
          orguid:'',
          cdtypeuid: this.$route.query.cdtypeuid,
          SearchKey: '',
          PageSize: this.pointSelectParams.pageSize,
          CurrentPage: this.pointSelectParams.currentPage,
        }
        const { Data } = await getDeviceDataPointList(params)
        // this.pointSelectArr = Data
        this.pointSelectArr = [...this.pointSelectArr, ...Data];
      },
      //点位删除
      delPoint(index) {
        this.index--;
        this.pointRuleObj.splice(index,1)
      },
      //点位添加
      addPoint() {
        this.pointRuleObj.push(
          {pointname:'',op:'', pointval:'', rule:''}
        )
      },
      //映射删除
      delMapPoint(index) {
        this.index--;
        this.mapRuleObj.splice(index,1)
      },
      //映射添加
      addMapPoint() {
        this.mapRuleObj.push(
          {oldVal:'',newVal:''}
        )
      },
      //是否报警 全选
      handleCheckAllChange(val) {
        this.drawerForm.isIndeterminate = false;
        // 点击全选按钮 把所有点位放进checkedPoints=['点位1'，'点位2'，'点位3']
        this.drawerForm.checkedPoints = []
        if(val){
          for(let i=0;i<this.pointRuleObj.length;i++){
            this.drawerForm.checkedPoints.push(this.pointRuleObj[i].pointname)
          }
        }
      },
      //是否报警 非全选
      handleCheckedPointChange(value) {
        this.drawerForm.checkAll = value.length === this.pointRuleObj.length;
        this.drawerForm.isIndeterminate = value.length > 0 && value.length < this.pointRuleObj.length;
      },
      // 关闭 drawer
      handleClose(){
        this.drawer = false
        this.$refs['drawerForm'].resetFields()
        //关闭drawer 还原 初值
        this.pointRuleObj = [{pointname:'',op:'', pointval:'', rule:''}]
        this.mapRuleObj = [{oldVal:'',newVal:''}]
        this.currentRow = {}
        this.alarmFlag = false
        this.mapRelationFlag = false
        //还原 点位 下拉选择 懒加载 的初始值
        this.pointSelectArr = []
        this.pointSelectParams.pageSize = 10
        this.pointSelectParams.currentPage = 1
      },
      // 确定 drawer
      handleDrawerSave(){
        var regex = /\((.+?)\)/g;  //匹配小括号的正则
        //1、判断 报警条件 是否填写完整
        for(let i=0;i<this.pointRuleObj.length;i++){
          if(!this.pointRuleObj[i].pointname || this.pointRuleObj[i].pointname == ''){
            this.alarmFlag = true
            return
          } else if (!this.pointRuleObj[i].op || this.pointRuleObj[i].op == ''){
            this.alarmFlag = true
            return
          } else if(!this.pointRuleObj[i].pointval || this.pointRuleObj[i].pointval == ''){
            this.alarmFlag = true
            return
          } else if(i != this.pointRuleObj.length - 1 && (this.pointRuleObj[i].rule == "" || !this.pointRuleObj[i].rule)){
            this.alarmFlag = true
            return
          } else {
            this.alarmFlag = false
          }
          //准转操作符 '等于(=)' --> '='
          if(this.pointRuleObj[i].op){
            let str = this.pointRuleObj[i].op.match(regex)
            this.pointRuleObj[i].opVal =  str[0].substring(1, str[0].length - 1)
          }
          if(this.pointRuleObj[i].rule){
            let strule = this.pointRuleObj[i].rule.match(regex)
            this.pointRuleObj[i].ruleVal =  strule[0].substring(1, strule[0].length - 1)
          }
        }
        //3、判断 映射信息是否填写完整
        if(this.currentRow.pointdatatype == '值映射类型'){
          for(let j=0;j<this.mapRuleObj.length;j++){
            if(!this.mapRuleObj[j].oldVal || this.mapRuleObj[j].oldVal == ''){
              this.mapRelationFlag = true
              return
            } else if (!this.mapRuleObj[j].newVal || this.mapRuleObj[j].newVal == ''){
              this.mapRelationFlag = true
              return
            } else {
              this.mapRelationFlag = false
            }
          }
        }

        this.$refs['drawerForm'].validate(async (valid) => {
          if (valid) {
            //2、多个点位，选择要报警的点位,组装 isAlarmArr 点位的编号
            for(let i=0;i<this.list.length;i++){
              if(this.drawerForm.checkedPoints[i] == this.list[i].pointname){
                this.drawerForm.isAlarmArr.push(this.list[i].pointkey)
              }
            }
            let params = {
              CallType: 'setalarm',
              UserID: sessionStorage.getItem('UserID'),
              AppToken: '',
              cdtypeuid: this.$route.query.cdtypeuid,
              pointuid: this.currentRow.pointuid,
              // pointalarmvalue: this.pointRuleObj, // 点位报警值，可能多个点位组合， json值
              pointalarmvalue: JSON.stringify(this.pointRuleObj),
              pointdatatype: this.currentRow.pointdatatype, //点位数据类型
              // pointvaluemap: this.mapRuleObj, //点位数据类型，值映射类型 json值
              pointvaluemap: this.currentRow.pointdatatype == '值映射类型' ? JSON.stringify(this.mapRuleObj) : '',

              // isalarm: this.pointRuleObj.length > 1 ? this.drawerForm.isAlarmArr.join(',') : this.drawerForm.isAlarm, //是否报警
              isalarm: '', //是否报警
              isforce: this.drawerForm.isCreate == '是' ? '1' : '0'  //是否强制创建
            }
            // console.log('drawer 提交 参数：')
            // console.log(params)
            this.drawerSubmit(params)
          } else {
            return false
          }
        })
      },
      // drawer 规则 弹窗 提交
      async drawerSubmit(params) {
        let result = await deviceDataPointUpdate(params)
        if (result.Status == 0) {
          this.handleClose() // 关闭drawer弹窗，复原初值
          this.$baseMessage('操作成功', 'success')
          this.fetchData() //更新列表
        }
      },


    },
  }
</script>
<style scoped>
  /* 禁止输入框样式 */
  div /deep/ .el-input.is-disabled .el-input__inner {
    color: #303133;
    cursor: default;
    /* background-color: rgb(255 255 255 / 95%);
    border-color: rgb(255 255 255 / 95%);
    color: #303133;
    cursor: default; */
  }
  div /deep/ .el-textarea.is-disabled .el-textarea__inner {
    color: #303133;
    cursor: default;
  }
  /* drawer__header 设置 */
  div /deep/ .el-drawer__header {
    align-items: center;
    color: #72767b;
    display: flex;
    margin-bottom: 0px;
    padding: 20px;
    padding-bottom: 0;
  }
  /* 选中 radio 并禁用 样式 */
   div /deep/ .el-radio__input.is-disabled.is-checked .el-radio__inner {
    background-color: #41b584;
    border-color: #41b584;
  }
</style>
