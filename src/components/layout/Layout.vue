<template>
  <div class="app-wrapper">
    <div class="arrowsImg" v-if="isShow" @click="switchover">
      <img :src="srcImg" alt="">
    </div>
    <navbar/>
    <div style="display: flex;width: 100%;" @mouseover="mouseOver">
      <sidebar :class="['sidebar-container', leftWidth ? 'sidebar-width' : '']"/>
      <div class="main-container" :style="{width:leftWidth?'calc(100vw - 150px)':'100vw'}">
        <crumb/>
        <router-view v-if="!$route.meta.keepAlive"/>
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"/>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from './Navbar'
import Sidebar from './Sidebar/index'
import Crumb from './Crumb'
export default {
  name: "Layout",
  components: {
    Navbar,
    Sidebar,
    Crumb
  },
  data() {
    return {
      isShow: false,
      leftWidth: false,
      srcImg: require('../../assets/zankai.png')
    }
  },
  methods: {
    mouseOver(event) {
      if (event.clientX < 230) {
        this.isShow = true;
        if (this.leftWidth) {
          this.srcImg = require('../../assets/shou.png');
        } else {
          this.srcImg = require('../../assets/zankai.png');
        }

      } else {
        this.isShow = false;
      }
    },
    switchover() {
      this.leftWidth = !this.leftWidth;
      if (this.leftWidth) {
        this.srcImg = require('../../assets/shou.png');
      } else {
        this.srcImg = require('../../assets/zankai.png');
      }
    }
  }
}
</script>

<style lang="less" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  .arrowsImg {
    position: absolute;
    left: 0;
    top: 64px;
    z-index: 10;
    img {
      width: 40px;
      height: 40px;
    }
  }
  .sidebar-width {
    flex: 0 0 150px !important;
  }
  .sidebar-wrapper {
    /deep/
    .el-scrollbar__wrap {
      overflow-x: hidden;
      position: relative;
      .menu-expanded{
        position: absolute;
        width: 100%;
        height: 100%;
        overflow-x: auto;
      }
    }
    flex: 0 0 0;
    // width: 230px;
    transition: flex 1s;
    overflow: hidden;
    background: #2B333B;
    /deep/
    a {
      padding: 0;
    }
    /deep/
    .el-menu {
      border-right: none !important;
    }
    /deep/
    .el-submenu {
      .el-submenu__title {
        padding-right: 30px !important;
        padding-left: 15px !important;
        height: 60px;
        line-height: 60px;
        font-size: 14px;
        background-color: #2B333B;
        color: #FFFFFF;
        .icon {
          padding-right: 5px;
          color: #ffffff;
          vertical-align: middle;
        }
        .el-submenu__icon-arrow {
          right: 10px;
          color: #ffffff;
        }
      }
      &.is-active {

        color: #2273CE;
        .el-submenu__title {
          background-color: #ffffff !important;
          color: #2273CE;
          .icon {
            color: #2273CE !important;
          }
          .el-submenu__icon-arrow {
            right: 10px;
            color: #2273CE;
          }
        }
      }
      .menu-wrapper {
        .el-menu-item {
          font-size: 14px;
          height: 40px;
          line-height: 40px;
          padding-left: 42px !important;
          &.is-active {
            // background: #2273CE;
            background: rgba(34, 115, 206, 0.05000000074505806);
            color: #000000;
            border-right: 4px solid #2273CE;
          }
        }

      }
    }
  }
  .main-container {
    // width: calc(100% - 230px);
    width: 100%;
    box-sizing: border-box;
    // margin-left: 230px;

  }
}
</style>
