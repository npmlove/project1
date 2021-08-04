<template>
  <el-scrollbar class="side-bar-container" :class="{ 'is-collapse': collapse }">
    <vab-logo />
    <el-menu
      :background-color="variables['menu-background']"
      :text-color="variables['menu-color']"
      :active-text-color="variables['menu-color-active']"
      :default-active="activeMenu"
      :collapse="collapse"
      :collapse-transition="false"
      :default-openeds="defaultOpens"
      :unique-opened="uniqueOpened"
      mode="vertical"
    >
      <template v-for="route in routes">
        <vab-side-bar-item
          :key="route.path"
          :full-path="route.path"
          :item="route"
        />
      </template>
    </el-menu>
  </el-scrollbar>
</template>
<script>
  import variables from '@/styles/variables.scss'
  import { mapGetters } from 'vuex'
  import { defaultOopeneds, uniqueOpened } from '@/config'

  export default {
    name: 'VabSideBar',
    data() {
      return {
        uniqueOpened,
      }
    },
    computed: {
      ...mapGetters({
        collapse: 'settings/collapse',
        // routes: 'routes/routes', //0701 注释
      }),
      //0701 修改 =======start=======
      routes() {
        const vm = this
        const routes = JSON.parse(JSON.stringify(vm.$router.options.routes))


        // if(!sessionStorage.getItem('menu')){
        //   vm.$router.push('/')
        //   sessionStorage.clear()
        //   return
        // }
        // const menu = JSON.parse(sessionStorage.getItem('menu'))
        // const routesArr = []
        // for (var i = 0; i < routes.length; i++) {
        //   for (var q = 0; q < menu.length; q++) {
        //     const menuTitle = menu[q].name
        //     const childrenArr = menu[q].children
        //     if (routes[i].name === menuTitle && childrenArr.length != 0) {
        //       routesArr.push(routes[i])
        //     }
        //   }
        // }
        // const routesArr1 = vm.unique1(routesArr)
        // var param = {}
        // for (var ii = 0; ii < menu.length; ii++) {
        //   var temp = menu[ii]
        //   for(var aaa = 0; aaa < temp.children.length; aaa++){
        //     param[temp.children[aaa].name] = temp
        //   }
        // }
        // var newData = []
        // for (var iii = 0; iii < routesArr1.length; iii++) {
        //   var tempiii = routesArr1[iii]
        //   // var path = tempiii.path

        //   var newChildren = []
        //   var children = tempiii.children || []
        //   for (var j = 0; j < children.length; j++) {
        //     var c = children[j]
        //     var childrenPath = c.path
        //     if ((c.hidden !== undefined && c.hidden) || param[childrenPath]) {
        //       newChildren.push(c)
        //     }
        //   }
        //   if (newChildren.length === 0) {
        //     continue
        //   }
        //   var row = tempiii
        //   row.children = newChildren
        //   newData.push(row)
        // }
        return routes

        // return routes
      },
      //=======end===================
      defaultOpens() {
        if (this.collapse) {
        }
        return defaultOopeneds
      },
      activeMenu() {
        const route = this.$route
        const { meta, path } = route
        if (meta.activeMenu) {
          return meta.activeMenu
        }
        return path
      },
      variables() {
        return variables
      },
    },
    methods: {
      unique1(arr) {
        var hash = []
        for (var i = 0; i < arr.length; i++) {
          if (hash.indexOf(arr[i]) === -1) {
            hash.push(arr[i])
          }
        }
        return hash
      },
    },
  }
</script>
<style lang="scss" scoped>
  @mixin active {
    overflow: visible;
    &:hover {
      color: $base-color-white!important;
      background-color: $base-menu-background !important;
      font-size: 16px !important;
    }

    &.is-active {
      // color: $base-color-white;
      background-color: $base-menu-background-active !important;
      //0705 改
      border-top-left-radius: 25px;
      border-bottom-left-radius: 25px;
      color: $base-color-default !important;
      margin-left: 4px;
      position: relative;
    }
    &.is-active:after{
      position: absolute;
      height: 95px;
      content: '';
      width: 50px;
      background-image: url(../../../assets/disexuanzhong.png);
      background-size: 44%;
      background-repeat: no-repeat;
      background-position: right;
      top: -23px;
      right: -4px;
      z-index: 9999;

    }
    // &.is-active::before{
    //     display: block;
    //     position: absolute;
    //     content: "";
    //     width:30px;
    //     height:30px;
    //     // background-color:#F6F8F9;
    //     // border-top-left-radius: 30px;
    //     // top: -15px;
    //     // right: -8px;
    //     background-color:#0045C7;
    //     border-bottom-right-radius: 30px;
    //     top: -30px;
    //     right: -0px;
    //     z-index: 888;
    // }
    // //叠加的伪元素 白色
    // &.is-active span::before{
    //     display: block;
    //     position: absolute;
    //     content: "";
    //     width:30px;
    //     height:30px;
    //     background-color:#F6F8F9;
    //     top: -30px;
    //     right: -0px;
    // }


    // &.is-active::after{
    //     display: block;
    //     position: absolute;
    //     content: "";
    //     width:30px;
    //     height:30px;
    //     // background-color:#F6F8F9;
    //     // border-bottom-left-radius: 30px;
    //     // bottom: -15px;
    //     // right: -8px;
    //     // z-index: 999;
    //     background-color:#0045C7;
    //     border-top-right-radius: 30px;
    //     top: 50px;
    //     right: -0px;
    //     z-index: 888;
    // }
    // // 叠加的伪元素 白色
    // &.is-active span::after{
    //     display: block;
    //     position: absolute;
    //     content: "";
    //     width:30px;
    //     height:30px;
    //     background-color:#F6F8F9;
    //     top: 50px;
    //     right: 0px;
    //     z-index: 777;
    // }
  }

  .side-bar-container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: $base-z-index;
    width: $base-left-menu-width;
    height: 100vh;
    overflow: hidden;
    background: $base-menu-background;
    // box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
    transition: width $base-transition-time;

    &.is-collapse {
      width: $base-left-menu-width-min;
      border-right: 0;

      ::v-deep {
        .el-menu {
          transition: width $base-transition-time;
        }

        .el-menu--collapse {
          border-right: 0;

          .el-submenu__icon-arrow {
            right: 10px;
            margin-top: -3px;
          }
        }
      }
    }

    ::v-deep {
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }

      .el-menu {
        border: 0;
        .vab-fas-icon {
          padding-right: 3px;
          font-size: $base-font-size-default;
        }

        .vab-remix-icon {
          padding-right: 3px;
          font-size: $base-font-size-default + 2;
        }
      }

      .el-menu-item,
      .el-submenu__title {
        height: $base-menu-item-height;
        overflow: hidden;
        line-height: $base-menu-item-height;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
      }

      .el-menu-item {
        @include active;
      }


    }
  }
</style>
