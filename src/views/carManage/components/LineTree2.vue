<template>
  <div>
    <ul class="domtree" style="">
      <!-- 第一层 -->
      <li
        v-for="(item, index) in leveloneList"
        :key="item.id"
        style="position: relative; margin-bottom: 10px"
      >
        <!-- 第一层 收缩 icon -->
        <span
          v-show="indexArr.indexOf(item.id) == -1"
          @click="onClickItem(index, item)"
          class="iconSty iconAdd"
        >
          +
        </span>
        <span
          v-show="indexArr.indexOf(item.id) > -1"
          @click="onClickItem(index, item)"
          class="iconSty iconSub"
        >
          -
        </span>
        <!-- 第一层 内容 -->
        <span style="margin-left: 5px">{{ item.companyname }}</span>

        <ul v-show="item.children && indexArr.indexOf(item.id) > -1">
          <!-- <ul> -->
          <!-- 第二层 -->
          <li
            v-for="(item2, index2) in item.children"
            :key="item2.id"
            style="
              position: relative;
              margin-bottom: 5px;
              min-width: 287px;
              cursor: pointer;
            "
            @click="onClickItem2(index2, item2)"
          >
            <!-- 第二层 内容 -->
            <span
              style="margin-left: 5px; display: inline-block"
              :class="[styFlag.indexOf(item2.id) > -1 ? 'fontColor' : '']"
            >
              {{ item2.carNum }}
            </span>
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
      // childValue: {
      //   type: String,
      //   default: () => '',
      // },
    },
    data() {
      return {
        // indexArr: [],
        styFlag: [],
      }
    },
    mounted() {},
    // watch: {
    //   indexArr(val, oldVal) {
    //     console.log(val)
    //     console.log(oldVal)
    //   },
    // },
    methods: {
      //点击行
      onClickItem(index, item) {
        console.log(item)
        console.log(item.id)
        //点击+indexArr >-1 说明树已经被展开
        // 情况一、收缩树
        if (this.indexArr.indexOf(item.id) > -1) {
          console.log(1)
          // 1、indexArr中 移除当前点击的数据 id
          this.indexArr.splice(this.indexArr.indexOf(item.id), 1)
          console.log(111)
          console.log(this.indexArr)
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
        console.log(2)
        let arr = []
        for (let j = 0; j < this.leveltwoList.length; j++) {
          console.log(3)
          if (this.leveltwoList[j].cuid == item.id) {
            console.log(4)
            let obj = {}
            obj.id = this.leveltwoList[j].stuid
            obj.carNum = this.leveltwoList[j].shoptruckno
            obj.tel = this.leveltwoList[j].bindphone
            obj.people = this.leveltwoList[j].bindbyrealname
            obj.status = this.leveltwoList[j].tstatus
            obj.SN = this.leveltwoList[j].devicesn
            this.leveloneList[index].children.push(obj)
          }
        }
      },
      //点击二级结构  展开详细信息
      onClickItem2(index2, item2) {
        // console.log('tableList', item2)
        this.styFlag = [item2.id]
        this.$emit('tableList', item2)
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
    height: 15px;
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
    /* height: 846px; */
    /* border:1px solid red; */
    /* min-width: 277px; */

    /*三角箭头的颜色*/
    scrollbar-arrow-color: #fff;
    /*滚动条滑块按钮的颜色*/
    scrollbar-face-color: #11141e;
    /*滚动条整体颜色*/
    scrollbar-highlight-color: #11141e;
    /*滚动条阴影*/
    scrollbar-shadow-color: #11141e;
    /*滚动条轨道颜色*/
    scrollbar-track-color: #222630;
    /*滚动条3d亮色阴影边框的外观颜色——左边和上边的阴影色*/
    /* scrollbar-3dlight-color:#0099dd; */
    /*滚动条3d暗色阴影边框的外观颜色——右边和下边的阴影色*/
    /* scrollbar-darkshadow-color: #0099dd; */
    /*滚动条基准颜色*/
    /* scrollbar-base-color: #0099dd;	        */
  }

  /* 收缩icon + */
  .iconSty {
    cursor: pointer;
    display: inline-block;
    width: 11px;
    height: 11px;
    font-size: 12px;
    /* background-color: #ccc; */
    background-color: #41b584;
    color: #fff;
    z-index: 1;
    position: absolute;
    top: 0px;
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
    margin-bottom: 8px;
    position: relative;
    height: 14px;
    min-width: 270px;
    color: #41b584;
  }
</style>
