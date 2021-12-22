<template>
  <div class="header-container" style="background: #ffffff">
    <div class="logo" :style="{width:leftWidth?'150px':'60px'}">
      <!-- <img src="../../assets/logo.png" style="width: 157px;height: 28px;" /> -->
      <div class="img-url"></div>
      <!-- <div class="hongying">logo</div> -->
    </div>
    <div class="user-info">
      <div>
        <img src="../../assets/openSide.png" v-if="leftWidth" @click="changeNav" />
        <img src="../../assets/closeSide.png" v-else @click="changeNav" />
        <span>管理员</span>
      </div>
      <div class="user">{{roleName}}　{{userName}}</div>
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
export default {
  props: {
    leftWidth:{
      type:Boolean,
      default:()=>false
    }
  },
  data () {
    return {
      userName: '',
      roleName:'',
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
    changeNav(){
      this.$emit("changeNav",!this.leftWidth)
    },
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

    }
  },
  mounted () {
    if(!JSON.parse(sessionStorage.getItem('userInfo'))){
      this.$router.push('/')
      sessionStorage.clear()
      return
    }else{
      this.userName = JSON.parse(sessionStorage.getItem('userInfo')).loginName
      this.roleName = JSON.parse(sessionStorage.getItem('userInfo')).roleName
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
		display: flex;
		height: 50px;
    width: 100%;
    justify-content: space-between;
	}
  .logo{
    display: flex;
    align-items: center;
    background: #2273CE;
    opacity: 1;
    transition: width 1s;
  }
  .logo img{
    width: 94px;
    height: 32px;
  }
  .logo .img-url{
    background-image: url(../../assets/logo.svg);
    width: 157px;
    height: 28px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center;
  }
  .user-info{
    flex: 1;
    font-size: 14px;
    color: #000000;
    display: flex;
    align-items: center;
  }
  .user-info  img{
    margin: 0 25px 0 15px;
    cursor: pointer;
  }
  .user-info .user{
    margin-right: 20px;
    margin-left: auto;
  }
  .user-info span{
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.25)
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
