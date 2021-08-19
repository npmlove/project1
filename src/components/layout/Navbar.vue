<template>
  <div class="header-container" style="background: #313131">
    <div class="logo">
      <!-- <img src="../../assets/logo_icon@2x.png" /> -->
      <div class="hongying">logo</div>
    </div>
    <div class="user-info">
      <div class="user">{{userName}}</div>
      <!-- <div @click="restPas" class="out-user1">修改密码</div> -->
      <div @click="outClick" class="out-user">退出</div>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" @close='closeDialog' class="aaa">
      	<el-form :label-position="labelPosition" :inline="true" size="medium" class="dialog-demo">
          <div class="rest-style" style="margin-top: 20px;">
            <el-form-item label="原始密码" label-width="120px" required>
              <el-input size="medium" v-model="oldPass" :class="{borderIpt: errorItem === 1}" placeholder="请输入原始密码" @focus="errorItem=''"></el-input>
              <div v-if="errorItem === 1" class="el-tishi">{{tips}}</div>
            </el-form-item>
          </div>
          <div class="rest-style">
            <el-form-item label="新密码" label-width="120px" required>
              <el-input size="medium" v-model="newPass" :class="{borderIpt: errorItem === 2}" placeholder="请输入新密码" @focus="errorItem=''"></el-input>
              <div v-if="errorItem === 2" class="el-tishi">{{tips}}</div>
            </el-form-item>
          </div>
          <div class="rest-style">
            <el-form-item label="确认新密码" label-width="120px" required>
              <el-input size="medium" v-model="newPass2" :class="{borderIpt: errorItem === 3}" placeholder="请输入确认新密码" @focus="errorItem=''"></el-input>
              <div v-if="errorItem === 3" class="el-tishi">{{tips}}</div>
            </el-form-item>
          </div>
        </el-form>
      	<!-- 底部按钮 -->
      	<div slot="footer" class="dialog-footer">
          <div style="text-align: center;padding-top:20px;">
            <el-button style="height: 36px;line-height: 36px;padding: 0;" size="medium" type="primary" @click="dialogComfirm">确 定</el-button>
            <el-button style="height: 36px;line-height: 36px;padding: 0;" size="medium" @click="closeDialog">取 消</el-button>
          </div>
      	</div>
    </el-dialog>
  </div>

</template>

<script>
  import qs from 'qs'
export default {
  data () {
    return {
      userName: '',
      labelPosition: 'right',
      dialogFormVisible: false,
      passwrod1: '',
      passwrod2: '',
      errorItem: '',
      tips: '',
      oldPass:'',
      newPass: '',
      newPass2: '',
      exportDio: false,
      iconTrue: true,
      exportTip: ''
    }
  },
  methods:{
    outClick(){
      this.$router.push('/')
      sessionStorage.clear()
    },
    restPas() {
      this.dialogFormVisible = true
    },
    closeDialog() {
      this.dialogFormVisible = false
    },
    dialogComfirm() {
      let reg = eval(JSON.parse(sessionStorage.getItem('userInfo')).pwdRegex)

      if(!this.oldPass){
      	this.errorItem = 1
      	this.tips = '请输入原始密码'
      }else if(!this.newPass){
      	this.errorItem = 2
      	this.tips = '请输入新密码'
      }else if(this.newPass.length < 6 || this.newPass.length > 8){
      	this.errorItem = 2
      	this.tips = '请输入6-8位密码'
      }else if(!reg.test(this.newPass)){
      	this.errorItem = 2
      	this.tips = '密码必须包含字母、数字'
      }else if(!this.newPass2){
      	this.errorItem = 3
      	this.tips = '请确认新密码'
      }else if(this.newPass != this.newPass2){
      	this.errorItem = 3
      	this.tips = '密码不一致'
      }else{
      	this.$http.post(this.$service.getUpdateUserPWD,qs.stringify({
      	  CallType: '',
      	  UserID: JSON.parse(sessionStorage.getItem('userInfo')).UserID,
      	  OldPassword: this.oldPass,
      	  Password: this.newPass2
      	})).then(data => {
      	  if(data.Status == 0){
            this.dialogFormVisible = false
      	    this.exportDio = true
      	    this.iconTrue = true
      	    this.exportTip = '密码修改成功'
      	    setTimeout(() => {
      	    	this.exportDio = false
      	    }, 1500)
      	  }else{
            this.exportDio = true
            this.iconTrue = true
            this.exportTip = data.Message
            setTimeout(() => {
            	this.exportDio = false
            }, 1500)
          }
      	})
      }
    }
  },
  mounted () {
    if(!JSON.parse(sessionStorage.getItem('userInfo'))){
      this.$router.push('/')
      sessionStorage.clear()
      return
    }else{
      this.userName = JSON.parse(sessionStorage.getItem('userInfo')).roleName
    }
  }
}
</script>

<style>
  .aaa .el-dialog{
    width: 300px;
    min-width: 500px;
  }
  .header-container {
    padding: 0 30px;
		display: flex;
		height: 64px;
    justify-content: space-between;
	}
  .logo{
    display: flex;
    align-items: center;
  }
  .logo img{
    width: 94px;
    height: 32px;
  }
  .logo .hongying{
    font-size:18px;
    font-weight:500;
    color:rgba(246,246,246,1);
    margin-left: 20px;
    /* background-image: url(../../assets/MES@2x.png); */
    background-size: contain;
    background-repeat: no-repeat;
    width: 106px;
    background-position: center;
    height: 32px;
  }
  .user-info{
    font-size: 14px;
    color: #FFF;
    display: flex;
    align-items: center;
  }
  .user-info .user{
    margin-right: 20px;
  }
  .user-info .out-user{
    width:60px;
    height:25px;
    border:1px solid #FFF;
    border-radius:5px;
    text-align: center;
    line-height: 25px;
    cursor: pointer;
  }
  .out-user1{
    width:80px;
    height:25px;
    border:1px solid #FFF;
    border-radius:5px;
    text-align: center;
    line-height: 25px;
    cursor: pointer;
    margin-right: 10px;
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
</style>
