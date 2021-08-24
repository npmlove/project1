 <template>
 	<div class="content-wrapper">
     <div class="content">
       <div class="echarts-all">
         <div>
           <div id="echartsPie1" style="width: 100%;height: 100%;"></div>
         </div>
         <div>
           <div id="echartsPie2" style="width: 100%;height: 100%;"></div>
         </div>
         <div>
           <div id="echartsPie3" style="width: 100%;height: 100%;"></div>
         </div>
         <div>
<!--             <el-upload
              class="avatar-uploader"
              :headers="tocken"
               list-type="picture-card"
               auto-upload="false"
               action="http://121.5.49.152:38501/dcErp/faw/t-banner/uploadBannerImage/posts/"
               :on-preview="handlePictureCardPreview"
               :on-remove="handleRemove"
               :data="resData"
               ref="upload"
               name=imgUrl""
               :on-success="onSuccess"
               :on-progress="onProgress"
               :limit="1">
               <i class="el-icon-plus "></i>
             </el-upload>
             <el-dialog :visible.sync="dialogVisible">
               <img width="100%" :src="dialogImageUrl" alt="">
             </el-dialog> -->
             <el-upload
                 class="avatar-uploader"
                 action="http://121.5.49.152:38501/dcErp/faw/t-banner/uploadBannerImage/posts/"
                 //是否显示已上传文件列表
                 :show-file-list="false"
                 //上传之前判断文件格式
                 :before-upload="beforeAvatarUpload"
                 //上传时额外携带的参数
                 :data="resData"
                 //成功之后返给页面显示
                 :on-success="onSuccess"
                 :name=imgUrl
                 :limit="1">
                 <i class="el-icon-plus "></i> 
             </el-upload>
        <!--   <div class="btn">
                 <input type="button" value="保存" class="yes" @click="submit2">

           </div> -->
         </div>
         <div>
           <div id="echartsPie5" style="width: 100%;height: 100%;"></div>
         </div>
         <div>
           <div id="echartsPie6" style="width: 100%;height: 100%;"></div>
         </div>
       </div>
     </div>
   </div>
 </template>

 <script>
   import qs from 'qs'
   import echarts from 'echarts'
   export default {
     data() {
       return {
             imageUrl: ''
       }
     },
     mounted() {

     },
     methods: {
      
       beforeAvatarUpload(file) {
         const isJPG = file.type === 'image/jpeg';
         const isLt2M = file.size / 1024 / 1024 < 2;

         if (!isJPG) {
           this.$message.error('上传头像图片只能是 JPG 格式!');
         }
         if (!isLt2M) {
           this.$message.error('上传头像图片大小不能超过 2MB!');
         }
         return isJPG && isLt2M;
       },
       
       //图片上传成功后，后台返回图片路径
       onSuccess(){
         this.$http.post(this.$service.uploadBannerImage, data).then(data => {
           if (data.code == 200) {
           
           this.
         }
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
   .echarts-all{
     width: 100%;
     display: flex;
     flex-wrap: wrap;
   }
   .echarts-all > div{
     width: 32.33%;
     height: 45vh;
     min-width: 450px;
     min-height: 430px;
     margin-right: 1.5%;
     border: 1px solid #dedede;
     box-sizing: border-box;
     background-color: #FFF;
     margin-top: 15px;
     // padding: 15px;
   }
   .echarts-all > div:nth-of-type(3n){
     margin-right: 0;
   }
   //==============
     .avatar-uploader .el-upload {
       border: 1px dashed #d9d9d9;
       border-radius: 6px;
       cursor: pointer;
       position: relative;
       overflow: hidden;
     }
     .avatar-uploader .el-upload:hover {
       border-color: #409EFF;
     }
     .avatar-uploader-icon {
       font-size: 28px;
       color: #8c939d;
       width: 178px;
       height: 178px;
       line-height: 178px;
       text-align: center;
     }
     .avatar {
       width: 178px;
       height: 178px;
       display: block;
     }
 </style>
