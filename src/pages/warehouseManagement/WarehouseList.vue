<template>
  <div class="warehouse-list-wrap">
    <!-- 工具栏 -->
    <header class="tools-bar">
      <el-form :inline="true">
        <el-form-item label="仓库名称:">
          <el-input
            v-model="warehouseName"
            clearable
            :maxlength="30"
            placeholder="请输入仓库名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否自有:">
          <el-select
            clearable
            v-model="warehouseType"
            placeholder="请选择是否自有"
          >
            <el-option
              v-for="item in warehouseTypes"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市:">
          <el-input
            v-model="city"
            clearable
            type="text"
            :maxlength="30"
            placeholder="请输入城市名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="仓库所属:">
          <el-select
            v-model="belong"
            placeholder="请选择仓库所属"
            clearable
            filterable
          >
            <el-option
              v-for="item in belongs"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提交者:">
          <el-input
            v-model="userName"
            clearable
            type="text"
            :maxlength="30"
            placeholder="请输入提交者"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="currentPageChange(1)"
            >搜索</el-button
          >
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button type="primary" @click="openWarehouseDialog()"
          >添加仓库</el-button
        >
      </div>
    </header>
    <!-- 表格 -->
    <dc-table
      style="margin-top: 20px"
      :columns="columns"
      :data="warehouses"
      :total="total"
      :current-page="pageNum"
      :page-size="pageSize"
      @page-size-change="pageSizeChange"
      @current-page-change="currentPageChange"
      border
    >
      <template #tools="{ row }">
        <el-button type="text" @click="openWarehouseDialog(row)"
          >编辑</el-button
        >
        <el-button type="text" @click="delWarehouse(row)">删除</el-button>
      </template>
      <template #map="{ row }">
        <div style="display: flex; align-items: center">
          <img
            :src="mapIcon"
            style="width: 30px; cursor: zoom-in"
            @click="$utils.previewDocx({ xpath: row.xpath })"
          />
          <i
            class="el-icon-download"
            style="margin-left: 10px; cursor: pointer; font-size: 24px"
            @click="
              $utils.downloadFile({ url: row.xpath, name: row.mapModuleName })
            "
          ></i>
        </div>
      </template>
    </dc-table>
    <!-- 编辑|新建弹窗 -->
    <warehouse-dialog
      ref="WarehouseDialog"
      :form.sync="form"
      @afterEdit="currentPageChange(); getWarehouseBelongs()"
      @afterAdd="currentPageChange(1); getWarehouseBelongs()"
    />
  </div>
</template>

<script>
import WarehouseDialog from "./WarehouseDialog";
const mapIcon = require("@/assets/map.svg");
const warehouseTypes = [
  {
    value: "",
    label: "全部",
  },
  {
    value: 0,
    label: "自有",
  },
  {
    value: 1,
    label: "第三方",
  },
];
export default {
  name: "WarehouseList",
  components: {
    WarehouseDialog,
  },
  data() {
    return {
      form: {},
      mapIcon,
      city: "",
      belong: "",
      warehouseType: "",
      warehouseTypes,
      warehouseName: "",
      userName: "",
      columns: [
        {
          prop: "userName",
          label: "提交者",
        },
        {
          prop: "typeText",
          label: "自有/第三方",
        },
        {
          prop: "name",
          label: "仓库名称",
        },
        {
          prop: "belong",
          label: "仓库所属",
        },
        {
          prop: "city",
          label: "城市",
        },
        {
          prop: "contact",
          label: "仓库联系人",
        },
        {
          prop: "tel",
          label: "仓库电话",
        },
        {
          prop: "address",
          label: "仓库地址",
          width: "400",
        },
        {
          prop: "tools",
          label: "操作",
        },
        {
          prop: "map",
          label: "地图",
        },
      ],
      warehouses: [], // 仓库列表
      belongs: [], // 所属列表
      pageSize: 10,
      pageNum: 1,
      total: 0,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getWarehouses();
      this.getWarehouseBelongs();
    },
    async getWarehouses() {
      const { belong, city, pageNum, pageSize, warehouseName, warehouseType, userName } =
        this;
      const {
        code,
        data: { records, total },
        message,
      } = await this.$http.post(this.$service.getWarehouses, {
        belong,
        city,
        pageNum,
        pageSize,
        warehouseName,
        warehouseType,
        userName,
      });
      if (code === 200) {
        this.warehouses = records.map((item) => {
          return {
            ...item,
            typeText: warehouseTypes.find((type) => type.value === item.type)
              .label,
          };
        });
        this.total = total;
      } else {
        this.$message.error(message);
      }
    },
    pageSizeChange(size) {
      this.pageSize = size;
      this.getWarehouses();
    },
    currentPageChange(page) {
      this.pageNum = page || this.pageNum;
      this.getWarehouses();
    },
    // 删除仓库
    delWarehouse(warehouse = {}) {
      this.$confirm("是否确认删除?", "提示", {
        type: "warning",
      })
        .then(async () => {
          const { code, message } = await this.$http.post(
            this.$service.delWarehouse, {
              id: warehouse.id
            }
          );
          if (code === 200) {
            this.currentPageChange()
          } else {
            this.$message.error(message);
          }
        })
        .catch(() => {});
    },
    // 打开编辑|新建仓库弹窗
    openWarehouseDialog(warehouse = {}) {
      const dialog = this.$refs.WarehouseDialog;
      if (warehouse.id) {
        this.form = {
          ...warehouse,
        };
      } else {
        this.form = {
          address: "",
          belong: "自有仓库",
          city: "",
          contact: "",
          mapModuleName: "",
          mapModulePath: "",
          name: "",
          tel: "",
          type: 0,
        };
      }
      dialog && (dialog.show = true);
    },
    // 查询仓库所属
    async getWarehouseBelongs() {
      const { code, data, message } = await this.$http.get(
        this.$service.getWarehouseBelongs
      );
      if (code === 200) {
        this.belongs = data.map((item) => {
          return {
            label: item,
            value: item,
          };
        });
      } else {
        this.$message.error(message);
      }
    },
  },
};
</script>


<style scoped lang="less">
.warehouse-list-wrap {
  margin: 20px;
  padding: 20px;
  background: #fff;
}
</style>
