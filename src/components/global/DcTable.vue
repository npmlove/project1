<template>
  <div class="dc-table">
    <el-table v-bind="$attrs" v-on="$listeners" style="width: 100%">
      <el-table-column
        v-for="item in columns"
        v-bind="item"
        :key="item.prop"
        align="center"
        header-align="center"
      >
        <template #default="{ $index, row }" v-if="item.type !== 'selection'">
          <slot :name="item.prop" :row="row" :index="$index">{{
            row[item.prop]
          }}</slot>
        </template>
      </el-table-column>
      <template slot="empty">
        <img :src="emptyImg" />
        <p>暂无数据</p>
      </template>
    </el-table>
    <footer class="footer">
      <el-pagination
        v-bind="$attrs"
        v-on="$listeners"
        @current-change="val => $emit('current-page-change', val)"
        @size-change="val => $emit('page-size-change', val)"
        :layout="layout"
        :page-sizes="pageSizes"
      />
    </footer>
  </div>
</template>

<script>
const emptyImg = require(`@/assets/kong-icon.png`);
export default {
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    layout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper",
    },
    "page-sizes": {
      type: Array,
      default: () => [10, 20, 30, 40, 50],
    },
  },
  data() {
    return {
      emptyImg,
    };
  },
};
</script>

<style lang="less" scoped>
.dc-table {
  .footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
}
</style>
