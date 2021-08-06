<template>
  <div class="app-wrapper">
    <navbar/>
    <div style="display: flex;width: 100%;">
      <sidebar class="sidebar-container"/>
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
  }
}
</script>

<style lang="less" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
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
    flex: 0 0 230px;
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
        }
      }
      &.is-active {
        background-color: #00A06E;
        color: #FFF;
        .el-submenu__title {
          color: #FFF;
          .icon {
            color: #FFF;
          }
        }
      }
      .menu-wrapper {
        .el-menu-item {
          font-size: 16px;
          height: 40px;
          line-height: 40px;
          &.is-active {
            background: #00A06E;
            color: #FFF;
            // border-left: 4px solid #00A06E;
            background-color: ;
          }
        }

      }
    }
  }
  .main-container {
    width: calc(100% - 230px);
    box-sizing: border-box;
    // margin-left: 230px;

  }
}
</style>
