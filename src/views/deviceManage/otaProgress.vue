<template>
  <div class="table-container">
    <div :style="{height:(height + 100 )+'px'}">
      <!-- 进程 未满 100% 的样式 -->
      <el-progress type="circle" :percentage="Number(progressValue)" v-if="progressValue !== '100'" ></el-progress>
      <!-- 进程 已满 100% 的样式 -->
      <el-progress type="circle" :percentage="Number(progressValue)" status="success" v-if="progressValue == '100'" ></el-progress>
    </div>
 <!--   <div>
      <el-button type="primary" native-type="submit" @click="fetchData" style="margin-left: 25px">刷新进度</el-button>
    </div> -->
  </div>
</template>
<script>
  import { getOTAProgress } from '@/api/device'
  export default {
    name: 'ComprehensiveTable',
    components: {},
    data() {
      return {
        progressValue: '',
        status: '',

        url: 'ws://cloud.smartsh.com:1984',
        webSocket: null,
      }
    },
    computed: {
      height() {
        return this.$baseTableHeight()
      },
    },
    created() {
      this.fetchData()
      this.init()
    },
    beforeDestroy() {},
    mounted() {},
    methods: {
      //查询页面列表
      async fetchData() {
        this.listLoading = true
        let params = {
          CallType: 'otaprogress',
          UserID: sessionStorage.getItem('UserID'),
          keyid: this.$route.query.otataskuid, //传otataskuid 值
        }
        const { Data } = await getOTAProgress(params)
        this.progressValue = Data[0].progress
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      },
      //-------------------websock start -------------------------
      init() {
        const wsuri = this.url
        this.webSocket = new WebSocket(wsuri)
        this.webSocket.onmessage = this.onmessage
        this.webSocket.onopen = this.onopen
        this.webSocket.onerror = this.onerror
        this.webSocket.onclose = this.onclose
      },
      onopen() {
        this.status = '成功'
        console.log('连接成功')
      },
      onerror() {
        this.status = '失败'
        console.log('连接失败')
        // this.initWebSocket()
      },
      onmessage({ data }) {
        let result = JSON.parse(data)
        console.log('推送结果：')
        console.log(result)
         if (result.type == 'otaprogress'){  //判断推送的是OTA进程数据
          if(result.data.otataskuid == this.$route.query.otataskuid){  //判断推送的是否是当前数据的进程
             this.progressValue = result.data.data.step   //保存进程值
          }
        }
      },
      send(Data) {
        console.log('发送数据')
        // this.webSocket.send(Data)
      },
      onclose(e) {
        this.status = '断开'
        console.log('断开连接')
      },
      //-------------------websock ent -------------------------

    }
  }
</script>
<style scoped></style>
