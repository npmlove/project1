<template>
  <div>
    <el-table
      class="mtop_10"
      :data="tableData"
      border
      stripe
      size="small"
      style="width: 100%"
    >
      <el-table-column label="件数 PCS">
        <template slot-scope="scope">
          <el-input
            size="small"
            :disabled="list_B"
            v-model="scope.row.piece"
            clearable
            @input="
              (val) => {
                scope.row.piece = $utils.getNumber(val, true);
              }
            "
            @change="calcVolume(scope.row)"
            :min="1"
            :ref="'a_' + scope.$index"
            @keyup.enter.native="nextInput($event, 'b', scope.$index)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="体积 CBM(m³)">
        <template slot-scope="scope">
          <el-input
            size="small"
            :disabled="list_B"
            v-model="scope.row.cbm"
            clearable
            @input="
              (val) => {
                scope.row.cbm = $utils.getNumber(val);
              }
            "
            :ref="'b_' + scope.$index"
            @keyup.enter.native="nextInput($event, 'c', scope.$index)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="重量 KGS">
        <template slot-scope="scope">
          <el-input
            size="small"
            :disabled="list_B"
            v-model="scope.row.weight"
            clearable
            @input="
              (val) => {
                scope.row.weight = $utils.getNumber(val);
              }
            "
            :ref="'c_' + scope.$index"
            @keyup.enter.native="nextInput($event, 'd', scope.$index)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="长(cm)">
        <template slot-scope="scope">
          <el-input
            :disabled="list_B"
            size="small"
            placeholder="长"
            v-model="scope.row.length"
            @input="
              (val) => {
                scope.row.length = $utils.getNumber(val);
              }
            "
            @change="calcVolume(scope.row)"
            clearable
            :ref="'d_' + scope.$index"
            @keyup.enter.native="nextInput($event, 'e', scope.$index)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="宽(cm)">
        <template slot-scope="scope">
          <el-input
            :disabled="list_B"
            size="small"
            placeholder="宽"
            v-model="scope.row.width"
            @input="
              (val) => {
                scope.row.width = $utils.getNumber(val);
              }
            "
            @change="calcVolume(scope.row)"
            clearable
            :ref="'e_' + scope.$index"
            @keyup.enter.native="nextInput($event, 'f', scope.$index)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="高(cm)">
        <template slot-scope="scope">
          <el-input
            :disabled="list_B"
            size="small"
            placeholder="高"
            v-model="scope.row.height"
            @input="
              (val) => {
                scope.row.height = $utils.getNumber(val);
              }
            "
            @change="calcVolume(scope.row)"
            clearable
            :ref="'f_' + scope.$index"
            @keyup.enter.native="nextInput($event, 'g', scope.$index)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="包装方式">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.packing"
            :disabled="list_B"
            placeholder="请选择"
          >
            <el-option
              v-for="item in packingArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="外箱情况">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.outerBox"
            :disabled="list_B"
            placeholder="请选择"
          >
            <el-option
              v-for="item in outerBoxArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="进仓图片" width="170">
        <template slot-scope="scope">
          <image-uploader
            :images="scope.row.orderAttachments"
            :orderId="orderId"
            :disabled="list_B"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div>
            <span
              class="tips"
              v-if="tableData.length - 1 == scope.$index && !list_B"
              @click="addOneTableObj(scope)"
              >新增</span
            >
            <span
              v-if="scope.$index != 0 && !list_B"
              @click="deleOneTableObj(scope)"
              >删除</span
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import ImageUploader from "./ImageUploader";
//     piece: '', 件数 PCS
//     cbm: '',体积 CBM
//     weight: '',重量 KGS
//     cargoSize: '', 货物尺寸
//     packing: '',包装方式
//     outerBox: ''外箱情况
class tempObj {
  constructor(
    id,
    orderId,
    piece,
    cbm,
    weight,
    width,
    height,
    length,
    packing = 1,
    outerBox = 1,
    orderAttachments = []
  ) {
    this.piece = piece;
    this.id = id;
    this.orderId = orderId;
    this.cbm = cbm;
    this.weight = weight;
    this.width = width;
    this.height = height;
    this.length = length;
    this.packing = packing;
    this.outerBox = outerBox;
    this.orderAttachments = orderAttachments;
  }
}
export default {
  props: ["childData", "orderId", "number"],
  components: {
    ImageUploader,
  },
  data() {
    return {
      number: this.unmber,
      list_B: "",
      id: "",
      orderId: this.orderId,
      tableData: [], //进仓数据
      packingArray: [
        {
          value: 1,
          label: "纸箱",
        },
        {
          value: 2,
          label: "夹板箱",
        },
        {
          value: 3,
          label: "托盘",
        },
        {
          value: 4,
          label: "木箱",
        },
      ], // 包箱方式数组
      outerBoxArray: [
        {
          value: 1,
          label: "正常",
        },
        {
          value: 2,
          label: "异常",
        },
      ],
      formLabelAlign: {
        name: "",
        region: "",
        type: "",
      },
    };
  },

  mounted() {
    if (this.number == 3) {
      this.list_B = false;
    } else {
      this.list_B = true;
    }
    if (this.childData.length > 0) {
      let { id, orderId } = this.childData[0];
      this.id = id;
      this.orderId = orderId;
      let tempIndata = this.childData;
      for (let i in tempIndata) {
        tempIndata[i].orderAttachments = tempIndata[i].orderAttachments || [];
        delete tempIndata[i].createTime;
        delete tempIndata[i].updateTime;
      }
      this.tableData = tempIndata;
    } else {
      this.addOneTableObj();
    }
  },

  methods: {
    // 体积计算
    calcVolume(row) {
      const { width, height, length, piece } = row;
      // 长宽高 和 件数 是否填写且满足数字要求
      const allTest = [width, height, length, piece].every((item) => {
        return item;
      });
      if (allTest) {
        // 处理小数点前6后2
        [
          {
            key: "width",
            val: width,
          },
          {
            key: "height",
            val: height,
          },
          {
            key: "length",
            val: length,
          },
        ].forEach((item) => {
          if (item.val >= 999999.99) {
            row[item.key] = 999999.99;
          }
          const val = String(row[item.key]);
          if (val.includes(".") && val.split(".")[1].length > 2) {
            row[item.key] = `${val.split(".")[0]}.${val
              .split(".")[1]
              .slice(0, 2)}`;
          }
        });
        row.cbm = Math.max(
          Math.round(((width * height * length * piece) / 1000000) * 100) / 100,
          0.01
        );
      }
    },
    // 聚焦换位
    nextInput(event, num, index) {
      if (num == "a" && index == this.tableData.length - 1) {
        return console.log("last");
      } else if (num == "a") {
        index = Number(index) + 1;
      }
      event.target.blur();
      // 下行input
      const nextRef = this.$refs[num + "_" + index];
      if (nextRef) {
        nextRef.focus();
      } else {
        // 下行首个input
        const nextRowRef = this.$refs["a_" + (index + 1)];
        if (nextRowRef) {
          nextRowRef.focus();
        }
      }
    },
    addOneTableObj() {
      if (this.tableData.length >= 50) {
        this.$message.error("最多添加50条数据");
        return;
      }
      let tempObjs = new tempObj(this.id, this.orderId);
      this.tableData.push(tempObjs);
    },
    deleOneTableObj(e) {
      let index = e.$index;
      if (index == 0) {
        this.$message({
          message: "第一条数据不能删除",
          type: "warning",
        });
      } else {
        this.tableData.splice(index, 1);
      }
    },
  },
};
</script>

<style  scoped>
.tips {
  color: rgb(2, 175, 240);
}
</style>

<style lang="less" scoped>
.tips {
  color: rgb(2, 175, 240);
}
</style>