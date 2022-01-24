<template>
  <component :is="component"></component>
</template>
<script>
import orderDetails1 from "./orderDetails1";
import orderDetails2 from "./orderDetails2";
import orderDetails3 from "./orderDetails3";
import orderDetails4 from "./orderDetails4";
import orderDetails5 from "./orderDetails5";
import orderDetails6 from "./orderDetails6";
import orderDetails7 from "./orderDetails7";
import orderDetails8 from "./orderDetails8";
export default {
  // 订单详情总页
  name: "OrderDetail",
  components: {
    orderDetails1,
    orderDetails2,
    orderDetails3,
    orderDetails4,
    orderDetails5,
    orderDetails6,
    orderDetails7,
    orderDetails8,
  },
  created() {
    this.getOrderDetail()
  },
  data() {
    return {
      component: "",
    };
  },
  methods: {
    async getOrderDetail() {
      // 获取最新订单状态
      const {
        code,
        data: { status, fastOrderFlag, id },
      } = await this.$http.get(this.$service.orderSearchDetail, {
        params: {
          orderId: this.$route.query.id,
        },
      });
      if (code !== 200) {
        return;
      }
      this.component = (function () {
        if (status == "3" && fastOrderFlag == "1") {
          return "orderDetails8";
        } else if (status == "3" || status == "5") {
          return "orderDetails1";
        } else if (status == "9") {
          return "orderDetails2";
        } else if (status == "13" || status == "17" || status == "21") {
          return "orderDetails3";
        } else if (
          status == "25" ||
          status == "27" ||
          status == "29" ||
          status == "31" ||
          status == "33"
        ) {
          return "orderDetails4";
        } else if (status == "37" || status == "41") {
          return "orderDetails5";
        } else if (status == "43") {
          return "orderDetails6";
        } else if (status == "39") {
          return "orderDetails7";
        }
      })();
    },
  },
  watch: {
    "$route.query.timestamp"() {
      this.getOrderDetail();
    },
  },
};
</script>