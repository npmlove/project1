<template>
  <div>
    <ul class="domtree" style="">
      <!-- 第一层 -->
      <li v-for="(item, index) in leveloneList" :key="item.id" style="position: relative; margin-bottom: 10px">
        <!-- 第一层 收缩 icon -->
        <span v-show="indexArr.indexOf(item.id) == -1" @click="onClickItem(index, item)" class="iconSty iconAdd"> + </span>
        <span v-show="indexArr.indexOf(item.id) > -1" @click="onClickItem(index, item)" class="iconSty iconSub"> - </span>
        <!-- 第一层 内容 -->
        <span @mouseover="mouseover(index)" @mouseout="mouseout(index)" @click="onClickItem(index, item)" :class="[ 'companySty', bgFlag == index || clickFlag == item.id ? 'bgSty' : '' ]"> {{ item.companyname }} </span>

        <ul v-show="item.children && indexArr.indexOf(item.id) > -1">
          <!-- 第二层 -->
          <li v-for="(item2, index2) in item.children" :key="item2.id" @click="onClickItem2(index2, item2)" @mouseover="mouseoverTwo(item2.id)" @mouseout="mouseoutTwo(item2.id)" :class="['carNumSty', twoLevelFlag == item2.id ? 'bgSty' : '']">
            <!-- 第二层 内容 -->
            <span style="margin-left: 5px; display: inline-block" :class="[styFlag.indexOf(item2.id) > -1 ? 'fontColor' : '']"> {{ item2.carNum }} </span>
            <!-- 状态标识 -->
            <span v-show="item2.status == 1" class="statusSty"></span>
            <!-- 视频标识 -->
            <span v-show="item2.videoStatus == 1" class="videoIcon"></span>
            <!-- <span class="videoIcon"></span> -->
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      //第一层数据
      leveloneList: {
        type: Array,
        default: () => [],
      },
      // 第二层数据  +  第三层
      leveltwoList: {
        type: Array,
        default: () => [],
      },
      indexArr: {
        type: Array,
        default: () => [],
      },
      styFlag: {
        type: Array,
        default: () => [],
      },
      clickFlag: {
        type: String,
        default: () => '',
      },
      onlineSn: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        // styFlag: [],
        bgFlag: -1,
        // clickFlag: '',
        twoLevelFlag: '',
      }
    },
    mounted() {},
    methods: {
      mouseover(index) {
        this.bgFlag = index
      },
      mouseout() {
        this.bgFlag = -1
      },
      mouseoverTwo(id) {
        this.twoLevelFlag = id
      },
      mouseoutTwo(id) {
        this.twoLevelFlag = ''
      },
      //点击行
      onClickItem(index, item) {
        // this.clickFlag = item.id
        this.$emit('updateStyFlag', item.id)
        //点击+indexArr >-1 说明树已经被展开
        // 情况一、收缩树
        if (this.indexArr.indexOf(item.id) > -1) {
          // 1、indexArr中 移除当前点击的数据 id
          this.indexArr.splice(this.indexArr.indexOf(item.id), 1)
          // 2、indexArr中 清除子数组展开的 id
          // for(let j=0;j<item.children.length;j++){
          // 	this.indexArr.splice(this.indexArr.indexOf(item.children[j].id),1)
          // }
          //3、删除子数组
          this.leveloneList[index].children = []
          return
        }
        //情况二、 展开树
        //1、展开 一级菜单
        this.indexArr.push(item.id)
        //2、组装子数据 展开二级菜单
        let arr = []
        for (let j = 0; j < this.leveltwoList.length; j++) {
          if (this.leveltwoList[j].cuid == item.id) {
            let obj = {}
            obj.id = this.leveltwoList[j].stuid
            obj.carNum = this.leveltwoList[j].shoptruckno
            obj.tel = this.leveltwoList[j].bindphone
            obj.people = this.leveltwoList[j].bindbyrealname
            obj.status = this.leveltwoList[j].astatus
            obj.SN = this.leveltwoList[j].devicesn
            obj.hasVideo = this.leveltwoList[j].hasVideo
            obj.videototalchanel = this.leveltwoList[j].videototalchanel
            this.leveloneList[index].children.push(obj)
          }
        }
        //渲染 视频 状态
          for(let i=0;i<this.leveloneList[index].children.length;i++){
            if(this.onlineSn.indexOf(this.leveloneList[index].children[i].SN) > -1){
              this.leveloneList[index].children[i].videoStatus = 1  //在线
            } else {
              this.leveloneList[index].children[i].videoStatus = 0   //离线
            }
          }
      },
      //点击二级结构  展开详细信息
      onClickItem2(index2, item2) {
        // this.styFlag = [item2.id]
        this.$emit('updateStyFlag', item2.id)
        // this.clickFlag = item2.id
        this.$emit('tableList', item2)
        console.log('点击车辆：')
        console.log(item2)
        this.indexArr.indexOf(item2.id) == -1
          ? this.indexArr.push(item2.id)
          : this.indexArr.splice(this.indexArr.indexOf(item2.id), 1)
      },
    },
  }
</script>

<style scoped>
  ul.domtree,
  ul.domtree ul {
    margin: 0;
    padding: 10px 0 0 15px;
  }
  ul.domtree li {
    list-style: none;
    position: relative;
  }
  ul.domtree > li:first-child:before {
    border-style: none none dashed none;
  }
  ul.domtree li:before {
    position: absolute;
    content: '';
    top: -8px;
    left: -10px;
    width: 10px;
    height: 18px;
    border-style: none none dashed dashed;
    border-width: 0.5px;
    border-color: #999;
  }
  ul.domtree li:not(:last-child):after {
    position: absolute;
    content: '';
    top: 10px;
    left: -10px;
    bottom: 0;
    border-style: none none none dashed;
    border-width: 0.5px;
    border-color: #999;
  }
  .content {
    width: 100%;
    height: 100vh;
    background-color: #222630;
    padding: 20px;
    box-sizing: border-box;
    overflow-x: auto;
  }
  /* 收缩icon + */
  .iconSty {
    cursor: pointer;
    display: inline-block;
    width: 11px;
    height: 11px;
    line-height: 11px;
    font-size: 12px;
    background-color: #41b584;
    color: #fff;
    z-index: 1;
    position: absolute;
    top: 5px;
    left: -16px;
    text-align: center;
  }
  .iconAdd {
    /* background: url(../../static/253.png) no-repeat;  */
    background-size: 100% 100%;
    background-position: center center;
  }
  .iconSub {
    /* background: url(../../static/9999.png) no-repeat;  */
    background-size: 100% 100%;
    background-position: center center;
  }
  .fontColor {
    color: #41b584;
  }
  .bgSty {
    background-color: #f5f7fa;
  }
  .companySty {
    box-sizing: border-box;
    padding-left: 5px;
    cursor: pointer;
    display: inline-block;
    width: 100%;
    height: 20px;
    line-height: 20px;
  }
  .carNumSty {
    box-sizing: border-box;
    padding-left: 5px;
    cursor: pointer;
    display: inline-block;
    width: 100%;
    height: 20px;
    line-height: 20px;
  }
  .statusSty {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: #41b584;
    position: absolute;
    left: 80%;
    top: 5px;
  }
  .videoIcon {
  		position: absolute;
  		/* left: 85%; */
  		left: calc(80% + 18px);
  		top: 1px;
  		display: inline-block;
  		width: 16px;
  		height: 18px;
  		background: url(../../../assets/video.png) no-repeat;
  		background-size: 90% 90%;
  		background-position: center center;
  	}
</style>
