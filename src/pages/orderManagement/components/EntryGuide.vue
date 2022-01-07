<template>
  <div class="entry-guide">
    <div class="guide-item">
      <h1 class="title">进仓指引</h1>
      <div class="guide-content">
        <el-form
          ref="form"
          :model="form"
          class="form"
          label-width="120px"
          size="mini"
        >
          <el-form-item label="进仓编号">
            <div class="inline-item">
              <el-input
                v-model="form.inboundNo"
                placeholder="进仓编号"
                style="width: 160px"
              />
              <el-button type="text" @click="form.inboundNo = inboundNo"
                >获取进仓编号</el-button
              >
            </div>
          </el-form-item>
          <el-form-item label="预计进仓时间">
            <el-date-picker
              v-model="form.expectedInboundTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm"
              placeholder="选择预计进仓时间"
              style="width: 160px"
              :clearable="false"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="最晚进仓时间">
            <el-date-picker
              v-model="form.latestInboundDate"
              type="datetime"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择最晚进仓时间"
              style="width: 160px"
              :clearable="false"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="仓库地址">
            <el-input
              v-model="form.warehouseAddress"
              placeholder="填写仓库地址"
            />
          </el-form-item>
          <el-form-item label="仓库电话">
            <el-input v-model="form.warehouseTel" placeholder="填写仓库电话" />
          </el-form-item>
          <el-form-item label="仓库备注">
            <el-input
              v-model="form.warehouseRemark"
              placeholder="填写仓库留言"
            />
          </el-form-item>
        </el-form>
        <aside class="aside">
          <div class="map-download" @click="downloadMap">
            <img
              src="@/assets/entry-guide_map-download.png"
              style="width: 40px"
            />
            <el-button type="text" class="text">进仓地图</el-button>
          </div>
        </aside>
      </div>
    </div>
    <div class="guide-item">
      <h1 class="title">入库记录</h1>
      <div class="record">
        <p>入库人员:</p>
        <div class="flow-chart">
          <template v-for="item in computedFlowChart">
            <div :key="item.icon">
              <img :src="item.iconUrl" />
              <p>{{ item.text }}</p>
            </div>
            <span :key="`${item.icon}-line`"></span>
          </template>
        </div>
        <!-- <ul class="list">
          <li></li>
        </ul> -->
      </div>
    </div>
  </div>
</template>

<script>
const flowChart = [
  {
    text: "入库",
    icon: "ruku",
  },
  {
    text: "进库数据测量",
    icon: "jinkushujuceliang",
  },
  {
    text: "出库",
    icon: "chuku",
  },
];
export default {
  // 进仓指引
  name: "EntryGuide",
  props: {
    entryData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      inboundNo: "", // 本地进仓编号
      form: {
        warehouseAddress: "", // 仓库地址
        warehouseRemark: "", // 仓库备注
        warehouseTel: "", // 仓库电话
        inboundNo: "", // 进仓编号
        expectedInboundTime: "", // 预计进仓时间
        latestInboundDate: "", // 最晚进仓时间
      },
      mapData: {},
      flowChart,
    };
  },
  computed: {
    computedFlowChart() {
      return this.flowChart.map((item) => {
        return {
          ...item,
          iconUrl: require(`@/assets/entry-guide_${item.icon}.png`),
        };
      });
    },
  },
  methods: {
    // 下载进仓地图
    downloadMap() {
      const { xpath: url, attachmentName } = this.mapData;
      if (!url) {
        this.$message.error("暂无地图");
        return;
      }
      axios({
        method: "get",
        url,
        responseType: "arraybuffer", //接受使用分片方式
      }).then((res) => {
        const aLink = document.createElement("a");
        let blob = new Blob([res], {
          type: "application/msword",
        });
        aLink.href = URL.createObjectURL(blob);
        aLink.setAttribute("download", attachmentName); // 设置下载文件名称
        aLink.click();
        document.body.appendChild(aLink);
      });
    },
  },
  watch: {
    "entryData.orderId": {
      immediate: true,
      handler() {
        const {
          warehouseAddress,
          warehouseRemark,
          warehouseTel,
          inboundNo,
          expectedInboundTime,
          latestInboundDate,
          orderAttachmentList,
        } = this.entryData;
        this.form = {
          warehouseAddress,
          warehouseRemark,
          warehouseTel,
          inboundNo,
          expectedInboundTime,
          latestInboundDate: `${latestInboundDate} 00:00:00`,
        };
        this.inboundNo = inboundNo;
        this.mapData =
          orderAttachmentList.find((item) => {
            return item.attachmentType === 5;
          }) || {};
      },
    },
    form: {
      deep: true,
      handler() {
        const { latestInboundDate } = this.form;
        this.$emit("change", {
          ...this.form,
          latestInboundDate: latestInboundDate.slice(0, 10),
        });
      },
    },
  },
};
</script>

<style lang="less" scoped>
.entry-guide {
  .guide-item {
    margin-top: 40px;
    &:nth-child(1) {
      margin-top: 0;
    }
    .title {
      font-size: 16px;
      color: rgb(2, 175, 240);
      font-weight: 800;
    }
    .guide-content {
      display: flex;
      .form {
        margin-top: 10px;
        .el-form-item {
          margin-bottom: 10px;
          .inline-item {
            display: flex;
            > * {
              margin-left: 20px;
              &:nth-child(1) {
                margin-left: 0;
              }
            }
          }
        }
      }
      .aside {
        margin-top: auto;
        .map-download {
          margin-left: 20px;
          width: 80px;
          height: 80px;
          text-align: center;
          cursor: pointer;
          .text {
            margin-top: 10px;
          }
        }
      }
    }
  }
  .record {
    margin-top: 20px;
    > * {
      margin-top: 30px;
    }
    .flow-chart {
      display: flex;
      align-items: center;
      div {
        width: 80px;
        img {
          width: 100%;
        }
        p {
          margin-top: 10px;
          text-align: center;
        }
      }
      span {
        margin: 0 30px;
        width: 80px;
        height: 1px;
        background: #000;
        &:nth-last-of-type(1) {
          display: none;
        }
      }
    }
  }
}
</style>