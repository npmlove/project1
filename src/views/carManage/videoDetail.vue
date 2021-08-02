<template>
  <div class="table-container">
    <!-- <div :style="{height:(height + 100 )+'px'}"> -->
    <div >
      <!-- 按钮 区域 -->
      <el-row type="flex" :gutter="10" justify="center"  >
        <el-col :span="5">&nbsp;</el-col>
        <el-col :span="14">
          <div class="grid-content bg-purple" style="text-align: center;">
            <el-button-group>
              <el-button :type="classtype1" @click="selecttype('classtype1', 1, 24)">单屏</el-button>
              <el-button :type="classtype2" @click="selecttype('classtype2', 4, 12)">四分屏</el-button>
              <el-button :type="classtype6" @click="selecttype('classtype6', 6, 8)">六分屏</el-button>
              <el-button :type="classtype3" @click="selecttype('classtype3', 9, 8)">九分屏</el-button>
              <el-button :type="classtype4" @click="selecttype('classtype4', 16, 6)">十六分屏</el-button>
              <el-button>
                <div class="btn-fullscreen" @click="handleFullScreen">
                  <el-tooltip effect="dark" :content="fullscreen ? `取消全屏` : `全屏`" placement="right">
                    <i class="el-icon-rank"></i>
                  </el-tooltip>
                </div>
              </el-button>
            </el-button-group>
          </div>
        </el-col>
        <el-col :span="5">&nbsp;</el-col>
      </el-row>
      <!-- 视屏区域 -->
      <el-main ref="container" id="con_lf_top_div">
        <el-row :gutter="10">
          <el-col
            v-for="(n, index) in fornum" :key="index"
            :xs="24" :sm="24" :md="clonum" :lg="clonum" :xl="clonum"
            :class="clonum == 8 && fornum == 6 ? videoclass66 : videoclass"
            style="border: 2px solid #fff;background-color: #000000;padding: 3px;box-sizing: border-box;"
          >
              <div class="video-wrapper" :id="`videoid${n}`" :style="clonum == 8 && fornum == 6 ? videoclass66 : videoclass" >
                <!-- <div class="video-inner live hide-waiting" style=" position: absolute; top: 0px; bottom: 0px; left: 0px; right: 0px;"> -->
                  <div class="alt table-c">
                    <!-- <div class="talbetop" > -->
                      <table>
                        <tr >
                          <td>
                            <video-player  v-show="n == 1" class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions"></video-player>
                            <span v-show="n !== 1">无信号</span>
                          </td>
                        </tr>
                      </table>
                    <!-- </div> -->
                  </div>
                <!-- </div> -->
              </div>

          </el-col>
        </el-row>
      </el-main>
      <!-- 单屏 底部 选择区域 -->
      <div class="selecteBtnArea" v-if="fornum == 1 && clonum == 24">
        <span v-for="(item, index) in arr" :key="item.id">
          <i :style="activeFlag == item.id ? 'background-color: #41b584' : ''" @click="clickSelecteBtn(item)"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { getVideoDetail } from '@/api/carList'
import { videoPlayer } from 'vue-video-player'
export default {
  components: {
    videoPlayer,
  },
  data() {
    return {
      fullscreen: false,
      fornum: 1,
      clonum: 24,
      // fornum: 4,
      // clonum: 12,
      videoclass:
        'padding-bottom: 40.25%; position: relative; margin: 0px auto; overflow: hidden;',
      videoclass66:
        'padding-bottom: 60.45%; position: relative; margin: 0px auto; overflow: hidden;',
      // videoclass:'padding-bottom: 42%; position: relative; margin: 0px auto; overflow: hidden;',
      classtype1: 'primary',
      // classtype2: 'primary',
      classtype2: '',
      classtype3: '',
      classtype4: '',
      classtype6: '',

      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        autoplay: true, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        // aspectRatio: '1590:650',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: 'application/x-mpegURL',
            src: '',
          },
        ],
        poster: '', // 封面地址
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: false, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true, // 是否显示全屏按钮
        },
      },
      videoUrlArr: [],
      arr: [{id:1,item:1},{id:2,item:2},{id:3,item:3},{id:4,item:4},],
      activeFlag: 1,
    }
  },
  created() {
    let that = this
    this.$nextTick(()=>{
      // console.log(this.$refs.container)
      // console.log(this.$refs.container.$el.offsetWidth)
      // console.log(this.$refs.container.$el.offsetHeight)

      // console.log(this.$refs.container.$el.clientWidth)
      // console.log(this.$refs.container.$el.clientHeight)
      if(this.fornum == 1 && this.clonum == 24){  //一分屏
        that.playerOptions.aspectRatio = this.$refs.container.$el.clientWidth + ':' + (this.$refs.container.$el.clientHeight - 20);
        // that.playerOptions.aspectRatio = this.$refs.container.$el.clientWidth + ':' + '650';
      } else if (this.fornum == 4 && this.clonum == 12){  //四分屏
        that.playerOptions.aspectRatio = this.$refs.container.$el.clientWidth / 2 + ':' + this.$refs.container.$el.clientHeight / 2;
      } else if (this.fornum == 6 && this.clonum == 8){  //六分屏
        that.playerOptions.aspectRatio = this.$refs.container.$el.clientWidth / 2 + ':' + this.$refs.container.$el.clientHeight / 3;
      } else if (this.fornum == 9 && this.clonum == 8){  //九分屏
        that.playerOptions.aspectRatio = this.$refs.container.$el.clientWidth /3 + ':' + this.$refs.container.$el.clientHeight / 3;
      } else if (this.fornum == 16 && this.clonum == 6){  //十六分屏
        that.playerOptions.aspectRatio = this.$refs.container.$el.clientWidth / 4 + ':' + this.$refs.container.$el.clientHeight / 4;
      }
      console.log(that.playerOptions.aspectRatio)
    })


    //查询视频
    that.queryVideo()

    window.onresize = function () {
      if (!that.checkFull()) {
        // 退出全屏后要执行的动作
        // console.log('退出全屏')
        that.fullscreen = false
        for (let n = 1; n <= that.fornum; n++) {
          document.getElementById('videoid' + n).style =
            'padding-bottom: 40.25%; position: relative; margin: 0px auto; overflow: hidden;'
          //处理6屏的样式
          if (that.fornum == 6) {
            document.getElementById('videoid' + n).style =
              'padding-bottom: 60.45%; position: relative; margin: 0px auto; overflow: hidden;'
          }
        }
      } else {
        for (let n = 1; n <= that.fornum; n++) {
          document.getElementById('videoid' + n).style =
            'padding-bottom: 52.25%; position: relative; margin: 0px auto; overflow: hidden;'
          //处理6屏的样式
          if (that.fornum == 6) {
            document.getElementById('videoid' + n).style =
              'padding-bottom: 80%; position: relative; margin: 0px auto; overflow: hidden;'
          }
        }
      }
    }
  },
  computed: {
    height() {
      return this.$baseTableHeight()
    },
  },
  methods: {
    selecttype(item, fnum, clo) {
      //类名、几分屏、几列
      this.items = []
      for (let i = 0; i < fnum; i++) {
        this.items[i] = false
      }
      this.fornum = fnum
      this.clonum = clo

      if (item === 'classtype1') {
        this.classtype1 = 'primary'
        this.classtype2 = ''
        this.classtype3 = ''
        this.classtype4 = ''
        this.classtype6 = ''
      } else if (item === 'classtype2') {
        this.classtype1 = ''
        this.classtype2 = 'primary'
        this.classtype3 = ''
        this.classtype4 = ''
        this.classtype6 = ''
      } else if (item === 'classtype3') {
        this.classtype1 = ''
        this.classtype2 = ''
        this.classtype3 = 'primary'
        this.classtype4 = ''
        this.classtype6 = ''
      } else if (item === 'classtype4') {
        this.classtype1 = ''
        this.classtype2 = ''
        this.classtype3 = ''
        this.classtype6 = ''
        this.classtype4 = 'primary'
      } else if (item === 'classtype6') {
        this.classtype1 = ''
        this.classtype2 = ''
        this.classtype3 = ''
        this.classtype4 = ''
        this.classtype6 = 'primary'
      }
    },
    checkFull() {
      //判断浏览器是否处于全屏状态 （需要考虑兼容问题）
      //火狐浏览器
      var isFull =
        document.mozFullScreen ||
        document.fullScreen ||
        //谷歌浏览器及Webkit内核浏览器
        document.webkitIsFullScreen ||
        document.webkitRequestFullScreen ||
        document.mozRequestFullScreen ||
        document.msFullscreenEnabled
      if (isFull === undefined) {
        isFull = false
      }
      return isFull
    },

    // 全屏事件
    handleFullScreen() {
       // let element = document.documentElement;//设置后就是我们平时的整个页面全屏效果
      let element = document.getElementById('con_lf_top_div');//设置后就是   id==con_lf_top_div 的容器全屏
        if (this.fullscreen) {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        } else {
          if (element.requestFullscreen) {
            element.requestFullscreen();
          } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
          } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
          } else if (element.msRequestFullscreen) {
            // IE11
            element.msRequestFullscreen();
          }
        }
        this.fullscreen = !this.fullscreen;

    },
    //获取视屏详情接口方法 queryVideo
    async queryVideo() {
      this.listLoading = true
      let params = {
        UserID: sessionStorage.getItem('UserID'),
        devicesn: this.$route.query.sn, //设备sn
        channel: this.$route.query.videototalchanel, // 设备视频第几通道
      }
      const { Data } = await getVideoDetail(params)
      const result = JSON.parse(Data)
      console.log('视屏详情：')
      console.log(JSON.parse(Data))
      this.playerOptions.sources[0].src = result.playUrl
      console.log(this.playerOptions.sources[0].src)
      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },
    //单屏时点击选择按钮
    clickSelecteBtn(item){
      console.log(item)
      this.activeFlag = item.id
    }
  }
}
</script>

<style scoped>
  .video-wrapper {
    position: relative;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
  }
  .alt {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: #000;
    /* background-color: palegoldenrod; */
    color: #fff;
    text-align: center;
  }
  .alt table {
    width: 100%;
    height: 100%;
  }
  .talbetop {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .table-c table {
   /* border-right: 2px solid #fff; */
    /* border-bottom: 2px solid #fff; */
  }
  .table-c table td {
    /* border-left: 2px solid #fff; */
    /* border-top: 1px solid #fff; */
  }
  /*
  css 注释：
  只对table td设置左与上边框；
  对table设置右与下边框；
  为了便于截图，我们将css 注释说明换行排版
  */

  .selecteBtnArea {
    width: 100%;
    height: 30px;
    padding: 0 20px;
    text-align: center;
    margin-top: -10px;
  }
  .selecteBtnArea span i {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 10px;
    background-color: rgb(68, 60, 60);
    margin: -10px 5px;
    cursor: pointer;
  }

  .selecteBtnArea span .bgc {
    background-color: #41b584;
  }
</style>
