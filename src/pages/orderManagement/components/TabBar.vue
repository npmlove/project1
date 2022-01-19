<template>
  <!-- 标签切换 -->
  <div class="tab-bar">
    <el-radio-group
      v-model="tab"
      @change="
        (val) => {
          $emit('update:tab', val);
        }
      "
    >
      <el-radio-button label="1">订舱信息</el-radio-button>
      <el-radio-button label="3" v-if="showEntryGuide">进仓指引</el-radio-button>
      <el-radio-button label="2">账单</el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  name: "TabBar",
  props: {
    // 显示进仓指引
    showEntryGuide: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      tab: "1", // 1订舱信息 2账单 3进仓指引
    };
  },
};
</script>

<style lang="less" scoped>
.tab-bar {
  padding: 15px 15px 0;
}
</style>