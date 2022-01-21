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
          <el-form-item label="仓库名称">
            <el-select v-model="form.warehouseId" placeholder="请选择仓库名称">
              <el-option
                v-for="item in warehouseList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="仓库地址">
            <el-input
              v-model="form.warehouseAddress"
              placeholder="填写仓库地址"
              :disabled="warehouseInputDisabled"
            />
          </el-form-item>
          <el-form-item label="仓库电话">
            <el-input v-model="form.warehouseTel" placeholder="填写仓库电话" :disabled="warehouseInputDisabled" />
          </el-form-item>
          <el-form-item label="仓库备注">
            <el-input
              v-model="form.warehouseRemark"
              placeholder="填写仓库留言"
            />
          </el-form-item>
        </el-form>
        <aside class="aside">
          <div class="map-download" v-show="mapData.xpath">
            <img
              src="@/assets/entry-guide_map-download.png"
              style="width: 40px"
              @click="downloadMap"
            />
            <el-button type="text" class="text" @click="dialogVisible = true">{{ mapData.attachmentNameCopy }}</el-button>
          </div>
        </aside>
      </div>
    </div>
    <div class="guide-item" v-if="false">
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
    <el-dialog title="预览进仓地图" :visible.sync="dialogVisible" width="60%" top="3vh" center>
      <iframe :src="computedDocUrl" style="width: 100%; height: 80vh"></iframe>
    </el-dialog>
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
        warehouseName: '',
      },
      warehouseList: [],
      mapData: {},
      flowChart,
      dialogVisible: false,
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
    computedDocUrl() {
      // 处理域名前缀问题
      const host = getHost()
      function getHost() {
        if (process.env.NODE_ENV === 'development') {
          return `https://17dc.shenghuoq.com`
        } else {
          if (window.location.host.includes(`10.8.0.1`)) {
            return `https://17dc.shenghuoq.com`
          } else {
            return window.location.origin
          }
        }
      }
      // const url = `https://homepages.inf.ed.ac.uk/neilb/TestWordDoc.doc` // 预览测试用第三方doc
      const url = `${host}${this.mapData.xpath}`
      // const docViewer = `https://docs.google.com/viewer?embedded=true&url=` // 谷歌预览
      const docViewer = `https://view.officeapps.live.com/op/embed.aspx?src=` // 微软预览
      return `${docViewer}${url}`
    },
    computedWarehouse() {
      return this.warehouseList.find(item => {
        return item.id === this.form.warehouseId
      }) || {}
    },
    warehouseInputDisabled() {
      return this.computedWarehouse.type === 0
    },
  },
  methods: {
    // 下载进仓地图
    downloadMap() {
      // 处理域名前缀问题
      const host = getHost()
      function getHost() {
        if (process.env.NODE_ENV === 'development') {
          return `https://17dc.shenghuoq.com`
        } else {
          if (window.location.host.includes(`10.8.0.1`)) {
            return `https://17dc.shenghuoq.com`
          } else {
            return window.location.origin
          }
        }
      }
      const { xpath, attachmentNameCopy } = this.mapData;
      const tagA = document.createElement("a");
      tagA.href = `${host}${xpath}`;
      tagA.setAttribute("download", attachmentNameCopy); // 设置下载文件名称
      document.body.appendChild(tagA);
      tagA.click();
      document.body.removeChild(tagA)
    },
    // 根据机场查询仓库
    async searchByAirport(pol) {
      const { code, data, message } = await this.$http.get(this.$service.searchByAirport, {
        params: {
          airportCode: pol,
        },
      })
      if (code === 200) {
        this.warehouseList = data
      } else {
        this.$message.error(message);
      }
      
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
          pol,
          warehouseName,
          warehouseType,
          warehouseId,
        } = this.entryData;
        const moment = this.$utils.moment
        const latestDate = latestInboundDate ? moment(latestInboundDate).format('YYYY-MM-DD HH:mm:ss') : moment().format('YYYY-MM-DD HH:mm:ss')
        this.form = {
          warehouseAddress,
          warehouseRemark,
          warehouseTel,
          inboundNo,
          expectedInboundTime: expectedInboundTime || moment().format('YYYY-MM-DD HH:mm:ss'),
          latestInboundDate: latestDate,
          pol,
          warehouseName,
          warehouseType,
          warehouseId,
        };
        this.inboundNo = inboundNo;
        this.mapData =
          orderAttachmentList.find((item) => {
            return item.attachmentType === 5;
          }) || {};
        this.searchByAirport(pol)  
      },
    },
    'entryData.inboundNo'() {
      this.form.inboundNo = this.entryData.inboundNo
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
    'form.warehouseId'() {
      const { tel, address, type, name, mapModulePath, remark } = this.computedWarehouse
      this.form = {
        ...this.form,
        warehouseAddress: address || '',
        warehouseTel: tel || '',
        warehouseType: type,
        warehouseName: name || '',
        mapModulePath: mapModulePath || '',
        warehouseRemark: remark || '',
      }
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
        background: transparent;
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
          display: flex;
          flex-direction: column;
          margin-left: 20px;
          align-items: center;
          text-align: center;
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