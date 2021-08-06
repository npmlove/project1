<template>
  <div class="content-wrapper">
    <div class="content">
      <el-form :model="ruleForm" ref="ruleForm" :rules="rules" :label-position="labelPosition" label-width="150px" size="medium" class="demo-form-inline" style="padding-left: 20px;">
        <el-form-item prop="loginName" label="账号">
          <el-input style="width: 280px;" size="medium" v-model="ruleForm.loginName" clearable placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="姓名">
          <el-input style="width: 280px;" size="medium" v-model="ruleForm.name" clearable placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item prop="tel" label="手机号">
          <el-input style="width: 280px;" size="medium" v-model="ruleForm.tel" clearable placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item prop="roleId" label="角色">
          <el-select placeholder="请选择角色" size="medium" v-model="ruleForm.roleId" clearable style="width: 280px;">
            <el-option
              v-for="item in roleOpt"
              :key="item.Value"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="rest-style">
          <el-form-item label=" " style="padding-top: 50px;padding-bottom: 30px;">
            <el-button style="height: 36px;line-height: 36px;padding: 0;" type="primary" @click="submitForm('ruleForm')">提交</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import qs from 'qs'
  export default {
    data() {
      var telPhone = (rule, value, callback) => {
        var reg = /^(1[3456789])\d{9}$/
        if (value === '') {
          callback(new Error('请输入手机号'));
        } else if (!reg.test(value)) {
          callback(new Error('请输入有效手机号码'));
        } else {
          callback();
        }
      }
      return {
        labelPosition: 'right',
        ruleForm: {
          delFlag: 0,
          idcard: '',
          loginName: '',
          name: '',
          roleId: '',
          roleName: '',
          state: 0,
          tel: '',
          id: '',
          password: ''
        },
        rules: {
          loginName: [
            {required: true, message: '请输入账号', trigger: 'blur'},
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
          ],
          name: [{required: true, message: '请输入姓名', trigger: 'blur'}],
          tel: [{required: true, validator: telPhone, trigger: 'blur' }],
          roleId: [{required: true, message: '请选择角色', trigger: 'change'}]
        },
        roleOpt: []
      }
    },
    mounted () {
      this.initRoleSearch()
      this.ruleForm = {
        delFlag: this.$route.query.delFlag,
        idcard: this.$route.query.idcard,
        loginName: this.$route.query.loginName,
        name: this.$route.query.name,
        roleId: this.$route.query.roleId,
        roleName: this.$route.query.roleName,
        state: this.$route.query.state,
        tel: this.$route.query.tel,
        id: this.$route.query.id,
        password: this.$route.query.password
      }
    },
    methods: {
      //保存
      submitForm(ruleForm) {
        this.$refs[ruleForm].validate((valid,object) => {
          if (valid) {
            this.$http.post(this.$service.userUpdate,this.ruleForm).then(data => {
              if(data.code == 200){
                this.$router.push('/adminUser/userCenter')
              }else{
                this.$message.error(data.message)
              }
            })
          } else {
            setTimeout(()=>{
              var isError= document.getElementsByClassName("is-error");
              if(isError[0].querySelector('input')){
                isError[0].querySelector('input').focus()
              }else if(isError[0].querySelector('textarea')){
                isError[0].querySelector('textarea').focus()
              }
            },100);
            return false;
          }
        })
      },
      //获取角色
      initRoleSearch() {
        this.$http.get(this.$service.roleSearch).then(data => {
          if(data.code == 200){
            this.roleOpt = data.data
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
	@import url("../../assets/icon/iconfont.css");
	.content-wrapper {
		width: 100%;
    box-sizing: border-box;
    /*height: 100%;*/
    padding: 20px;
    overflow: hidden;
    background-color: #f3f6f9 !important;
  }
  .content {
    /deep/
    .textArea {
      .el-form-item__content {
        height: 64px;
        .el-textarea__inner {
          resize: none;
          padding: 10px 15px;
        }
      }
    }
    /deep/
    .radio-group {
      margin-bottom: 30px;
      .el-form-item__label,
      .el-form-item__content {
        // height: 25px;
        line-height: 25px;
      }
    }
    /deep/
    .brother-radio {
      margin-bottom: 12px;
    }
    /deep/
    .el-form-item__content{
      height: auto;
    }
  }
	.el-form {
		background-color: #FFF;
		padding: 22px 20px 0 20px;
		height: 100%;
	}
  .dialog-demo{
    padding: 20px 0 0 0;
  }
	.el-form--inline .el-form-item {
		vertical-align: bottom;
  }
	.parimary_btn {
		background-color: #36c85c;
		border-color: #36c85c;
	}
	.icon-shouqi {
		color: #1778FC;
		margin-right: 2px;
		font-size: 14px;
		margin-left: 15px;
	}
	.shouqi {
		cursor: pointer;
		color: #1778FC;
	}
  .wrapper, .content {
    width: 100%;
    /*background-color: #FFFFFF;*/
  }
	.zColor {
		.el-form-item__label{
			color: #F00;
		}
	}
	.el-tishi {
		height: 20px;
		background-color: #FBE9E9;
		color: #DC2424;
		line-height: 20px;
		font-size: 12px;
		vertical-align: middle;
    padding-left: 10px;
	}
	.hd {
		visibility: hidden;
	}
	.export_dio {
  	position: fixed;
  	top: 50%;
  	left: 50%;
  	transform: translate(-50%,-50%);
  	background-color: rgba(0,0,0,0.7);
  	padding: 0 20px;
  	color: #FFF;
  	font-size: 14px;
  	line-height: 55px;
  	border-radius: 10px;
  }
  .export_dio .iconfont {
  	font-size: 28px;
  	vertical-align: middle;
  	margin-right: 5px;
  }

</style>
