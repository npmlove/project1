<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <router-link :to="resolvePath(onlyOneChild.path)" style="height: 40px;display: flex;flex-direction: column">
        <el-menu-item style="height: 40px;line-height: 40px" :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <item :meta="Object.assign({},item.meta,onlyOneChild.meta)" :leftWidth="leftWidth" :isTop="isTop" />
        </el-menu-item>
      </router-link>
    </template>

    <el-submenu v-else ref="subMenu"
                :class="isTop?'leftWidth':''"
                :index="resolvePath(item.path)"
                popper-append-to-body>
      <template slot="title">
        <item :meta="item.meta" :leftWidth="leftWidth" :isTop="isTop" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :is-nest="true"
        :item="child"
        :leftWidth="leftWidth"
        :isTop="false"
        :key="child.path"
        :base-path="resolvePath(child.path)"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import Item from './Item'

export default {
  name: 'SidebarItem',
  components: { Item },
  props: {
    // route object
    leftWidth:{
      type:Boolean,
      default:()=>false
    },
    isTop:{
      type:Boolean,
      default:()=>false
    },
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {

    }
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
<style scoped lang="less">
.leftWidth /deep/ .el-submenu__icon-arrow{
  display: none !important;
}
</style>
