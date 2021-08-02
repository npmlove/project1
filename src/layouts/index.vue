<template>
  <div class="vue-admin-beautiful-wrapper" :class="classObj">
    <!-- 水平布局 -->
    <div v-if="'horizontal' === layout" class="layout-container-horizontal" :class="{ fixed: header === 'fixed', 'no-tabs-bar': tabsBar === 'false' || tabsBar === false }">
      <div :class="header === 'fixed' ? 'fixed-header' : ''">
        <vab-top-bar />
        <div v-if="tabsBar === 'true' || tabsBar === true" :class="{ 'tag-view-show': tabsBar }">
          <div class="vab-main">
            <vab-tabs-bar />
          </div>
        </div>
      </div>
      <div class="vab-main main-padding app-main-container">
        <!-- <vab-ad /> -->
        <!-- <vab-app-main /> -->
        <router-view v-if="!$route.meta.keepAlive" />       
        <keep-alive>           
          <router-view v-if="$route.meta.keepAlive" />          
        </keep-alive>
        <footer  class="footer-copyright">Copyright <vab-icon :icon="['fas', 'copyright']"></vab-icon> smart 车辆视屏管理系统</footer>
      </div>
    </div>
    <!-- 垂直布局 -->
    <div v-else class="layout-container-vertical" :class="{ fixed: header === 'fixed', 'no-tabs-bar': tabsBar === 'false' || tabsBar === false}" >
      <div v-if="device === 'mobile' && collapse === false" class="mask" @click="handleFoldSideBar" />
      <vab-side-bar />
      <!-- 2021-06-10 添加左侧菜单 组件 -->
      <!-- <Sidebar class="side-bar-container el-scrollbar" :class="collapse ? 'siderWidthSmall' : 'siderWidth'" /> -->
      <div class="vab-main" :class="collapse ? 'is-collapse-main' : ''">
        <div :class="header === 'fixed' ? 'fixed-header' : ''">
          <!-- 面包屑 -->
          <vab-nav-bar />
          <!-- 打开的 tabs -->
          <vab-tabs-bar v-if="tabsBar === 'true' || tabsBar === true" />
        </div>
        <!-- <vab-ad /> -->
        <!-- <vab-app-main /> -->
        <div class="vab-main main-padding app-main-container">
          <router-view v-if="!$route.meta.keepAlive" />    
          <keep-alive>        
            <router-view v-if="$route.meta.keepAlive" />       
          </keep-alive>
		  <!-- 添加的 版权 页底部 -->
          <footer  class="footer-copyright">Copyright <vab-icon :icon="['fas', 'copyright']"></vab-icon> smart 云平台</footer>
        </div>
      </div>
    </div>
    <el-backtop />
  </div>
</template>

<script>
  import Sidebar from './components/Sidebar/index'
  import { mapActions, mapGetters } from 'vuex'
  import { tokenName } from '@/config'
  export default {
    name: 'Layout',
    data() {
      return {
        oldLayout: '',
        flag: -1
      }
    },
    computed: {
      ...mapGetters({
        layout: 'settings/layout',
        tabsBar: 'settings/tabsBar',
        collapse: 'settings/collapse',
        header: 'settings/header',
        device: 'settings/device',
      }),
      classObj() {
        return {
          mobile: this.device === 'mobile',
        }
      },
      height() {
        return this.$baseTableHeight()
      },
    },
    beforeMount() {
      window.addEventListener('resize', this.handleResize)
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.handleResize)
    },
    mounted() {
      if (document.body.clientWidth < 1500) {
        this.flag = 0
      }

      this.oldLayout = this.layout
      const userAgent = navigator.userAgent
      if (userAgent.includes('Juejin')) {
        this.$baseAlert(
          'vue-admin-beautiful不支持在掘金内置浏览器演示，请手动复制以下地址到浏览器中查看http://mpfhrd48.sanxing.uz7.cn/vue-admin-beautiful'
        )
      }
      const isMobile = this.handleIsMobile()
      if (isMobile) {
        if (isMobile) {
          //横向布局时如果是手机端访问那么改成纵向版
          this.$store.dispatch('settings/changeLayout', 'vertical')
        } else {
          this.$store.dispatch('settings/changeLayout', this.oldLayout)
        }
        this.$store.dispatch('settings/toggleDevice', 'mobile')
        setTimeout(() => {
          this.$store.dispatch('settings/foldSideBar')
        }, 2000)
      } else {
        this.$store.dispatch('settings/openSideBar')
      }
      this.$nextTick(() => {
        window.addEventListener(
          'storage',
          (e) => {
            if (e.key === tokenName || e.key === null) window.location.reload()
            if (e.key === tokenName && e.value === null)
              window.location.reload()
          },
          false
        )
      })
    },
    methods: {
      ...mapActions({
        handleFoldSideBar: 'settings/foldSideBar',
      }),
      handleIsMobile() {
        return document.body.getBoundingClientRect().width - 1 < 992
      },
      handleResize() {
        if (!document.hidden) {
          const isMobile = this.handleIsMobile()
          if (isMobile) {
            //横向布局时如果是手机端访问那么改成纵向版
            this.$store.dispatch('settings/changeLayout', 'vertical')
          } else {
            this.$store.dispatch('settings/changeLayout', this.oldLayout)
          }

          this.$store.dispatch(
            'settings/toggleDevice',
            isMobile ? 'mobile' : 'desktop'
          )
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  // 侧边栏的宽度
  // .siderWidth {
  //   width: 256px;
  //   height: 100vh;
  //   margin-top: -70px;
  //   float: left;
  //   position: fixed;
  //   background-color: #2f3447;
  //   z-index: 999;
  // }
  // .siderWidthSmall {
  //   width: 65px;
  //   height: 100vh;
  //   margin-top: -70px;
  //   float: left;
  //   position: fixed;
  //   background-color: #2f3447;
  //   z-index: 999;
  // }
  .footer-copyright {
    min-height: 40px;
    line-height: 40px;
    color: rgba(0, 0, 0, 0.45);
    text-align: center;
    border-top: 1px dashed $base-border-color;
    background-color: #fff;
  }

  @mixin fix-header {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: $base-z-index - 2;
    width: 100%;
    overflow: hidden;
  }

  .vue-admin-beautiful-wrapper {
    position: relative;
    width: 100%;
    height: 100%;

    .layout-container-horizontal {
      position: relative;

      &.fixed {
        padding-top: calc(#{$base-top-bar-height} + #{$base-tabs-bar-height});
      }

      &.fixed.no-tabs-bar {
        padding-top: $base-top-bar-height;
      }

      ::v-deep {
        .vab-main {
          width: 88%;
          margin: auto;
        }

        .fixed-header {
          @include fix-header;
        }

        .tag-view-show {
          background: $base-color-white;
          box-shadow: $base-box-shadow;
        }

        .nav-bar-container {
          .fold-unfold {
            display: none;
          }
        }

        .main-padding {
          .app-main-container {
            margin-top: $base-padding;
            margin-bottom: $base-padding;
            background: $base-color-white;
          }
        }
      }
    }

    .layout-container-vertical {
      position: relative;

      .mask {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: $base-z-index - 1;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        background: #000;
        opacity: 0.5;
      }

      &.fixed {
        padding-top: calc(#{$base-nav-bar-height} + #{$base-tabs-bar-height});
      }

      &.fixed.no-tabs-bar {
        padding-top: $base-nav-bar-height;
      }

      .vab-main {
        position: relative;
        min-height: 100%;
        margin-left: $base-left-menu-width;
        background: #f6f8f9;
        transition: $base-transition;

        ::v-deep {
          .fixed-header {
            @include fix-header;

            left: $base-left-menu-width;
            width: $base-right-content-width;
            box-shadow: $base-box-shadow;
            transition: $base-transition;
          }

          .nav-bar-container {
            position: relative;
            box-sizing: border-box;
          }

          .tabs-bar-container {
            box-sizing: border-box;
          }

          .app-main-container {
            width: calc(100% - #{$base-padding} - #{$base-padding});
            margin: $base-padding auto;
            background: $base-color-white;
            border-radius: $base-border-radius;
          }
        }

        &.is-collapse-main {
          margin-left: $base-left-menu-width-min;

          ::v-deep {
            .fixed-header {
              left: $base-left-menu-width-min;
              width: calc(100% - 65px);
            }
          }
        }
      }
    }

    /* 手机端开始 */
    &.mobile {
      ::v-deep {
        .el-pager,
        .el-pagination__jump {
          display: none;
        }

        .layout-container-vertical {
          .el-scrollbar.side-bar-container.is-collapse {
            width: 0;
          }

          .vab-main {
            width: 100%;
            margin-left: 0;
          }
        }

        .vab-main {
          .fixed-header {
            left: 0 !important;
            width: 100% !important;
          }
        }
      }
    }

    /* 手机端结束 */
  }
</style>
