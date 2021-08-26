<template>
  <div class="content-wrapper">
    <div class="content">
      <div class="echarts-all">
        <div :model="ruleForm" ref="ruleForm">
          <div class="text">轮播图片一</div>
          <el-form class="demo-form ">

            <el-upload class="avatar-uploader" action="#" :show-file-list="false" :before-upload="beforeAvatarUpload"
              :limit="1">
              <img v-if="image" :src="imgUrl+image" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon "></i>
            </el-upload>

            <el-form-item prop="" label="链接地址" style="margin-top:20px ; ">
              <el-input v-model="ruleForm.bannerUrl" placeholder="请输入链接地址(非必填)" class="shuru"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <div style="text-align: center; margin-right: 100px; ">
              <span style="float: left;margin-left: 80px;font-size: 20px ;">状态</span>
              <span class="demonstration">开启</span>
              <el-switch v-model="value1" inactive-color="#00aaff" active-color="#aeb6a5">
              </el-switch>
              <span class="demonstration">禁用</span>
            </div>
          </div>
        </div>
        <div>
          <div class="text">轮播图片二</div>
          <el-form class="demo-form ">
            <el-upload class="avatar-uploader" action="#" :show-file-list="false" :before-upload="beforeAvatarUpload"
              :limit="1">
              <img v-if="image" :src="imgUrl+image" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon "></i>
            </el-upload>
            <el-form-item prop="" label="链接地址" style="margin-top:20px ; ">
              <el-input v-model="input2" placeholder="请输入链接地址(非必填)" class="shuru"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <div style="text-align: center; margin-right: 100px; ">
              <span style="float: left;margin-left: 80px;font-size: 20px ;">状态</span>
              <span class="demonstration">开启</span>
              <el-switch v-model="value2" inactive-color="#00aaff" active-color="#aeb6a5">
              </el-switch>
              <span class="demonstration">禁用</span>
            </div>
          </div>
        </div>

        <div>
          <div class="text">轮播图片三</div>
          <el-form class="demo-form ">
            <el-upload class="avatar-uploader" action="#" :show-file-list="false" :before-upload="beforeAvatarUpload"
              :limit="1">
              <img v-if="image" :src="imgUrl+image" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon "></i>
            </el-upload>
            <el-form-item prop="" label="链接地址" style="margin-top:20px ; ">
              <el-input v-model="input3" placeholder="请输入链接地址(非必填)" class="shuru"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <div style="text-align: center; margin-right: 100px; ">
              <span style="float: left;margin-left: 80px;font-size: 20px ;">状态</span>
              <span class="demonstration">开启</span>
              <el-switch v-model="value3" inactive-color="#00aaff" active-color="#aeb6a5">
              </el-switch>
              <span class="demonstration">禁用</span>
            </div>
          </div>
        </div>
        <div>
          <div class="text">轮播图片四</div>
          <el-form class="demo-form ">
            <el-upload class="avatar-uploader" action="#" :show-file-list="false" :before-upload="beforeAvatarUpload"
              :limit="1">
              <img v-if="image" :src="imgUrl+image" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon "></i>
            </el-upload>
            <el-form-item prop="" label="链接地址" style="margin-top:20px ; ">
              <el-input v-model="input4" placeholder="请输入链接地址(非必填)" class="shuru"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <div style="text-align: center; margin-right: 100px; ">
              <span style="float: left;margin-left: 80px;font-size: 20px ;">状态</span>
              <span class="demonstration">开启</span>
              <el-switch v-model="value4" inactive-color="#00aaff" active-color="#aeb6a5">
              </el-switch>
              <span class="demonstration">禁用</span>
            </div>
          </div>
        </div>
        <div>
          <div class="text">轮播图片五</div>
          <el-form class="demo-form ">
            <el-upload class="avatar-uploader" action="#" :show-file-list="false" :before-upload="beforeAvatarUpload"
              :limit="1">
              <img v-if="image" :src="imgUrl+image" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon "></i>
            </el-upload>
            <el-form-item prop="" label="链接地址" style="margin-top:20px ; ">
              <el-input v-model="input5" placeholder="请输入链接地址(非必填)" class="shuru"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <div style="text-align: center; margin-right: 100px; ">
              <span style="float: left;margin-left: 80px;font-size: 20px ;">状态</span>
              <span class="demonstration">开启</span>
              <el-switch v-model="value5" inactive-color="#00aaff" active-color="#aeb6a5">
              </el-switch>
              <span class="demonstration">禁用</span>
            </div>
          </div>
        </div>
        <!-- 底部按钮 -->
      </div>
      <div slot="footer" class="baocun">
        <div style="text-align: center;padding-top:20px;">
          <el-button style="height: 36px;line-height: 36px;padding: 0;" size="medium" type="primary"
            @click="dialogComfirm ('ruleForm')">保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    toData
  } from '@/util/assist'
  export default {
    data() {
      return {
        file: '',
        image: '',
        input2: '',
        input3: '',
        input4: '',
        input5: '',
        value1: true,
        value2: true,
        value3: true,
        value4: true,
        value5: true,
        
        ruleForm: {
          bannerPath: '',
          bannerUrl: '',
          id: '',
          status: ''
        },
      }
    },
    activated() {
      this.Advertising()
    },
    mounted() {

    },
    methods: {
      //图片上传
      beforeAvatarUpload(file) {
        const isJPG = file.type;
        const isLt500K = file.size / 1024 / 1024 / 1024 < 500;
        if (isJPG === 'image/jpeg' || 'image/png') {
          this.$message.success('上传图片成功');
        } else {
          this.$message.error('上传图片只能是 JPG 格式或 PNG 格式!');
        }
        // isJPG==='image/jpeg' ||'image/png'? this.$message.success('上传成功') :this.$message.error('上传头像图片只能是 JPG 格式或 PNG 格式!')
        if (!isLt500K) {
          this.$message.error('上传头像图片大小不能超过 500KB!');
        }
        // return isJPG && isLt500K;
        this.file = file;
        let reader = new FileReader();
        reader.readAsDataURL(file);
        let that = this;
        reader.onload = function() {
          that.upLoadpdf()
        };
        return false;
      },
      upLoadpdf() {
        const vm = this
        let fileFormData = new FormData();
        fileFormData.append('image', vm.file)
        vm.$http.post(vm.$service.uploadBannerImage, fileFormData).then(res => {
          if (res.code == 200) {
            vm.image = res.data
          }
        })
      },
      //保存
      dialogComfirm(ruleForm) {
        var json = {
          bannerUrl: this.ruleForm.bannerUrl,
          id: 0,
          bannerPath: this.ruleForm.bannerPath,
          status: 0
        }
        this.$http.post(this.$service.changeBanner, json).then(data => {
          if (data.code == 200) {
            // console.log("sss")
          } else {
            this.$message.error(data.message)
          }
        })
      },
      //展示
      Advertising() {
        // var image = new Array(5)
        this.$http.get(this.$service.manageBannerList).then(data => {
          if (data.code == 200) {
            this.image = data.data[0]
            // this.data1 = data.data
            //this.image = data1[0]
            console.log(this.image)
          }
        }).catch((e) => {
          console.log(e)
        })
      },

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

  .echarts-all {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }

  .demonstration {
    font-size: 15px;
  }

  /deep/.a {
    float: left;
    margin-left: 20px;
  }

  .echarts-all>div {
    width: 32.33%;
    height: 45vh;
    min-width: 300px;
    min-height: 300px;
    margin-right: 1.5%;
    border: 1px solid #dedede;
    box-sizing: border-box;
    background-color: #FFF;
    margin-top: 15px;
    // padding: 15px;
  }

  .echarts-all>div:nth-of-type(3n) {
    margin-right: 0;
  }

  //==============
  .demo-form {
    margin-top: 0px;
  }

  /deep/.el-form-item__label {
    font-size: 20px !important;
  }

  .shuru {
    width: 300px;
    height: 30px;
  }

  .avatar-uploader.el-upload {

    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader {
    text-align: center;
    position: relative;
    top: 50%;
    /*偏移*/

  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;


  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
    // background-color: green;

  }

  .text {
    padding-left: 20px;
    padding-top: 20px;
    font-size: 20px;
  }

  .avatar {
    width: 150px;
    height: 150px;
    display: block;
  }
</style>
