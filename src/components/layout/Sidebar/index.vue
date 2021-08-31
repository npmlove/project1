<template>
  <div class="sidebar-wrapper">
    <el-scrollbar style="height: 100%">
      <aside class="menu-expanded">
        <!--导航菜单-->
        <el-menu :default-active="activePath">
          <sidebar-item
            style="color:#fff"
            v-for="route in routes"
            :key="route.path"
            :item="route"
            :base-path="route.path"/>
        </el-menu>
      </aside>
    </el-scrollbar>
  </div>
</template>

<script>
import SidebarItem from './SidebarItem'
import qs from 'qs'

export default {
  components: { SidebarItem },
  data() {
    return {
      activePath: ''
    }
  },
  computed: {
    routes() {
      const menu = JSON.parse(JSON.stringify(this.$router.options.routes))
      // console.log(menu)
      return menu
    },

    routes11111() {
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

      // return newData
      return routes
    }
  },
  watch: {
    $route() {
      this.updatePath()
    }
  },
  mounted(){
    this.updatePath()
    //获取最新菜单
    // this.getAllSysMenu()

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
      this.activePath = redirect
    },
    //获取系统菜单
    getAllSysMenu(){
      const vm = this
      let params = {
        CallType: 'byuser',
        UserID: sessionStorage.getItem('UserID'),
      }
      vm.$http.post(vm.$service.getAllSysMenu,qs.stringify(params)).then(data => {
        if(data.Status == 0){
          sessionStorage.setItem('menu',JSON.stringify(data.Data))
          this.$store.dispatch('getLeftMenu', data.Data)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  /deep/
  .el-submenu.is-active .el-submenu__title .iconfont {
    color: #fff !important;
  }
</style>
