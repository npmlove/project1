<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <template v-if=" hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.alwaysShow">
      <router-link :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }" >
          <item :meta="Object.assign({}, item.meta, onlyOneChild.meta)" />
        </el-menu-item>
      </router-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body >
      <template slot="title">
        <item :meta="item.meta" />
      </template>
      <sidebar-item v-for="child in item.children" :is-nest="true" :item="child" :key="child.path" :base-path="resolvePath(child.path)" />
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
      item: {
        type: Object,
        required: true,
      },
      isNest: {
        type: Boolean,
        default: false,
      },
      basePath: {
        type: String,
        default: '',
      },
    },
    data() {
      // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
      // TODO: refactor with render function
      this.onlyOneChild = null
      return { }
    },
    methods: {
      hasOneShowingChild(children = [], parent) {
        const showingChildren = children.filter((item) => {
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
          this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
          return true
        }

        return false
      },
      resolvePath(routePath) {
        return path.resolve(this.basePath, routePath)
      },
    },
  }
</script>
<style scoped>
  div /deep/ .el-menu-item {
    /* height: 56px; */
    height: $base-menu-item-height;
    /* line-height: 56px; */
    line-height: $base-menu-item-height;
    font-size: 14px;
    color: #fff;
    padding: 0 20px;
    list-style: none;
    cursor: pointer;
    position: relative;
    transition: border-color 0.3s, background-color 0.3s, color 0.3s;
    box-sizing: border-box;
    white-space: nowrap;
  }

  div /deep/ .el-submenu__title {
    /* height: 56px; */
    height: $base-menu-item-height;
    /* line-height: 56px; */
    line-height: $base-menu-item-height;
    font-size: 14px;
    color: #fff;
    padding: 0 20px;
    list-style: none;
    cursor: pointer;
    position: relative;
    transition: border-color 0.3s, background-color 0.3s, color 0.3s;
    box-sizing: border-box;
    white-space: nowrap;
  }

  div /deep/ .el-menu-item:hover {
    background: #41b584 !important;
  }

  div /deep/ .el-submenu__title:hover {
    background: rgba(38, 42, 57) !important;
  }
  div /deep/ .el-submenu .is-active {
    background: #41b584 !important;
  }
</style>
