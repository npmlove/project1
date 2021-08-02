<template>
  <div class="sidebar-wrapper">
    <el-scrollbar style="height: 100%">
      <VabLogo style=" position: relative; height: 65px; overflow: hidden; line-height: 65px; background: #2f3447; height: 75px;line-height: 75px; text-align: center;" />
      <aside class="menu-expanded">
        <!--导航菜单-->
       <el-menu
          :unique-opened="true"
          :default-active="activePath"
          :collapse="collapse"
          background-color="#2f3447"
          :class="collapse == 'false' ? 'el-icon-arrow-right:before' : ''"
        >
          <!-- <el-menu :default-active="activePath"> -->
          <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
        </el-menu>
      </aside>
    </el-scrollbar>
  </div>
</template>

<script>
  import SidebarItem from './SidebarItem'
  import VabLogo from '../VabLogo/index'
  import { mapGetters } from 'vuex'

  export default {
    name: 'Sidebar',
    components: { SidebarItem, VabLogo },
    data() {
      return {
        activePath: '',
      }
    },
    computed: {
      ...mapGetters({
        collapse: 'settings/collapse',
      }),
      routes() {
        const vm = this
        const routes = JSON.parse(JSON.stringify(vm.$router.options.routes))


        if(!sessionStorage.getItem('menu')){
          vm.$router.push('/')
          sessionStorage.clear()
          return
        }
        const menu = JSON.parse(sessionStorage.getItem('menu'))
        const routesArr = []
        for (var i = 0; i < routes.length; i++) {
          for (var q = 0; q < menu.length; q++) {
            const menuTitle = menu[q].name
            const childrenArr = menu[q].children
            if (routes[i].name === menuTitle && childrenArr.length != 0) {
              routesArr.push(routes[i])
            }
          }
        }
        const routesArr1 = vm.unique1(routesArr)
        var param = {}
        for (var ii = 0; ii < menu.length; ii++) {
          var temp = menu[ii]
          for(var aaa = 0; aaa < temp.children.length; aaa++){
            param[temp.children[aaa].name] = temp
          }
        }
        var newData = []
        for (var iii = 0; iii < routesArr1.length; iii++) {
          var tempiii = routesArr1[iii]
          // var path = tempiii.path

          var newChildren = []
          var children = tempiii.children || []
          for (var j = 0; j < children.length; j++) {
            var c = children[j]
            var childrenPath = c.path
            if ((c.hidden !== undefined && c.hidden) || param[childrenPath]) {
              newChildren.push(c)
            }
          }
          if (newChildren.length === 0) {
            continue
          }
          var row = tempiii
          row.children = newChildren
          newData.push(row)
        }
        return newData

        // return routes
      },
    },
    watch: {
      $route() {
        this.updatePath()
      },
    },
    mounted() {
      this.updatePath()
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
      updatePath() {
        const path = this.$route
        const redirect = path.meta.redirect || this.$route.path
        this.activePath = redirect //当前激活的菜单
      },
    },
  }
</script>
<style scoped>
  div /deep/ .el-menu {
    border-right: solid 0px #e6e6e6;
    list-style: none;
    position: relative;
    margin: 0;
    padding-left: 0;
    /* background-color: #fff; */
  }
  div /deep/ .el-menu-item .is-active {
    color: #fff;
    background-color: #41b584;
  }
  div /deep/ .el-icon-arrow-right:before {
    /* content: ""; */
    content: '';
  }
</style>
