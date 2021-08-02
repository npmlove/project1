<template>
  <div class="form-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
          :inline="true"
        >
          <div>
            <el-form-item label="员工姓名" prop="RealName">
              <el-input placeholder="请输入员工姓名" v-model="ruleForm.RealName" style="width: 270px;"></el-input>
            </el-form-item>
            <el-form-item label="所属部门" prop="Department">
              <!-- <el-select placeholder="请选择所属部门" v-model="ruleForm.Department" style="width: 270px;" filterable> -->
                <!-- <el-option
                  v-for="item in DepartmentOpt"
                  :key="item.Value"
                  :label="item.Name"
                  :value="item.Value">
                </el-option> -->
                <el-select
                  v-model="ruleForm.orguid"
                  clearable
                  placeholder="请选择部门"
                  @clear="handleClear"
                  ref="selectUpResId"
                >
                  <el-option hidden key="orguid" :value="ruleForm.orguid" :label="ruleForm.Department"></el-option>
                  <el-tree
                    :data="treeArr"
                    :props="defaultProps"
                    :expand-on-click-node="false"
                    :check-on-click-node="true"
                    @node-click="handleNodeClick"
                    default-expand-all
                  >
                  </el-tree>
                </el-select>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="手机号" prop="UserName">
              <el-input placeholder="请输入手机号码" v-model="ruleForm.UserName" style="width: 270px;"></el-input>
            </el-form-item>
            <!-- <el-form-item label="初始密码" prop="Password">
              <el-input placeholder="请输入初始密码" v-model="ruleForm.Password" style="width: 270px;"></el-input>
            </el-form-item> -->
          </div>
          <div>
            <el-form-item label="员工邮箱" prop="email">
              <el-input placeholder="请输入员工邮箱" v-model="ruleForm.email" style="width: 270px;">
                <template slot="append">@smartsh.com</template>
              </el-input>
            </el-form-item>
            <el-form-item label="直属领导" prop="puid">
              <el-select placeholder="请选择直属领导" v-model="ruleForm.puid" style="width: 270px;" filterable>
                <el-option
                  v-for="item in puidOpt"
                  :key="item.UserID"
                  :label="item.RealName"
                  :value="item.UserID">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="工作地点" prop="workloc">
              <el-select placeholder="请选择工作地点" v-model="ruleForm.workloc" style="width: 270px;" filterable>
                <el-option
                  v-for="item in worklocOpt"
                  :key="item.Value"
                  :label="item.Name"
                  :value="item.Value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="数据权限" prop="powergroup">
              <el-select placeholder="请选择数据权限" v-model="ruleForm.powergroup" style="width: 270px;" filterable>
                <el-option
                  v-for="item in powergroupOpt"
                  :key="item.Value"
                  :label="item.Name"
                  :value="item.Value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="备注" prop="Remarks">
              <el-input placeholder="请输入备注" v-model="ruleForm.Remarks" type="textarea" style="width: 270px;"></el-input>
            </el-form-item>
          </div>
          <div style="text-align: center;">
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { getDictionary, getUserList } from '@/api/common'
  import { getUpdateUser, getUserDetails, getCompanyOrgList } from '@/api/user'
  export default {
    name: 'Form',
    data() {
      return {
        ruleForm: {
          CallType: 'edit',
          Operator: sessionStorage.getItem('UserID'),
          RealName: '',
          Department: '',
          UserName: '',
          email: '',
          puid: '',
          workloc: '',
          powergroup: '',
          Remarks: '',
          orguid:'',
        },
        rules: {
          RealName: [
            { required: true, message: '请输入员工姓名', trigger: 'blur' }
          ],
          Department: [
            { required: true, message: '请选择所属部门', trigger: 'change' },
          ],
          UserName: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
          ],
          // Password: [
          //   { required: true, message: '请输入密码', trigger: 'blur' },
          // ],
          workloc: [
            { required: true, message: '请选择工作地点', trigger: 'change' },
          ]
        },
        DepartmentOpt: [],
        puidOpt: [],
        worklocOpt: [],
        powergroupOpt: [],
        treeArr:[],
        defaultProps: {
          children: "children",
          label: "orgname",
        },
      }
    },
    created() {
      this.initDepartmentOpt()
      this.initUserList()
      this.initWorklocOpt()
      this.initPowergroupOpt()
      this.initGetUserDetails()
    },
    methods: {
      async initGetUserDetails() {
        var json = {
          UserID: this.$route.query.UserID,
        }
        const { Status, Data } = await getUserDetails(json)
        if(Status == 0){
          this.ruleForm.UserID = this.$route.query.UserID,
          this.ruleForm.RealName = Data[0].RealName
          // this.ruleForm.Department = Data[0].Department
          this.ruleForm.UserName = Data[0].UserName
          this.ruleForm.email = Data[0].email
          this.ruleForm.puid = Data[0].puid
          this.ruleForm.workloc = Data[0].workloc
          this.ruleForm.powergroup = Data[0].powergroup
          this.ruleForm.Remarks = Data[0].Remarks

          this.ruleForm.Department = Data[0].Department
          this.ruleForm.orguid = Data[0].orguid
        }
      },
      async submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const { Status, Data } = await getUpdateUser(this.ruleForm)
            if(Status == 0 && Data[0].execStatus == 0){
              this.$router.push('/userManage/userList')
              this.$baseMessage('编辑成功', 'success')
            }else{
              this.$baseMessage(Data[0].Message, 'error')
            }
          } else {
            return false
          }
        })
      },
      //获取部门
      async initDepartmentOpt() {
        var data = {
          CallType: 'all',
          UserID: this.ruleForm.Operator
        }
        const { Status, Data } = await getCompanyOrgList(data)

        // this.DepartmentOpt = Data
        this.treeArr = []
        this.treeArr.push(Data)
      },
      //获取所属领导
      async initUserList() {
        var data = {
          PageSize: 1000000,
          CurrentPage: 1,
          UserID: this.ruleForm.Operator
        }
        const { Status, Data } = await getUserList(data)
        this.puidOpt = Data
        var json = {
          UserID: 'wzsld',
          RealName: '无直属领导'
        }
        this.puidOpt.unshift(json)
      },
      //获取工作地点
      async initWorklocOpt() {
        var data = {
          MarkID: 'gzdd-yg',
          UserID: this.ruleForm.Operator
        }
        const { Status, Data } = await getDictionary(data)
        this.worklocOpt = Data
      },
      //
      async initPowergroupOpt(){
        var data = {
          MarkID: 'sjqx-yg',
          UserID: this.ruleForm.Operator
        }
        const { Status, Data } = await getDictionary(data)
        this.powergroupOpt = Data
      },
      //部门树
      handleNodeClick(data) {
        // 这里主要配置树形组件点击节点后，设置选择器的值；自己配置的数据，仅供参考
        console.log(data)
        this.ruleForm.Department = data.orgname
        this.ruleForm.orguid = data.orguid
        // 选择器执行完成后，使其失去焦点隐藏下拉框的效果
        this.$refs.selectUpResId.blur()
      },
      // 选择器配置可以清空选项，用户点击清空按钮时触发
      handleClear() {
        // 将选择器的值置空
        this.ruleForm.Department = ''
        this.ruleForm.orguid = ''
      }

    }
  }
</script>
