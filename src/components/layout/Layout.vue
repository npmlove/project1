<template>
  <div class="app-wrapper">
    <div class="arrowsImg" v-if="isShow" @click="switchover">
      <img :src="srcImg" alt="">
    </div>
    <navbar/>
    <div style="display: flex;width: 100%;" @mouseover="mouseOver">
      <sidebar :class="['sidebar-container', leftWidth ? 'sidebar-width' : '']"/>
      <div class="main-container">
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
    flex: 0 0 230px !important;
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
    background: #fff;
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
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        .icon {
          padding-right: 5px;
          color: #6E6E6E;
          vertical-align: middle;
        }
        .el-submenu__icon-arrow {
          right: 30px;
          color: #2273CE;
        }
      }
      &.is-active {
        // background-color: #2273CE;
        color: #2273CE;
        .el-submenu__title {
          color: #2273CE;
          .icon {
            color: #2273CE !important;
          }
        }
      }
      .menu-wrapper {
        .el-menu-item {
          font-size: 16px;
          height: 40px;
          line-height: 40px;
          &.is-active {
            // background: #2273CE;
            color: #2273CE;
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
