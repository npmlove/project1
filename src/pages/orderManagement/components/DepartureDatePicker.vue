<template>
  <el-date-picker
    class="departure-date-picker"
    v-model="latestInboundDate"
    type="date"
    format="yyyy-MM-dd"
    value-format="yyyy-MM-dd"
    placeholder="选择出发日期"
    style="width: 160px"
    :clearable="false"
    size="mini"
  >
  </el-date-picker>
</template>

<script>
export default {
  // 出发日期选择器，等重构吧，先写个组件处理下
  name: "DepartureDatePicker",
  data() {
    return {
      latestInboundDate: "",
    };
  },
  props: {
    date: {
      type: String,
      default: "",
    },
  },
  watch: {
    date: {
      immediate: true,
      handler(newVal) {
        this.latestInboundDate = newVal
      },
    },
    latestInboundDate(newVal) {
      this.$emit("update:date", newVal);
    },
  },
};
</script>