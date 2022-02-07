<template>
  <el-dialog
    :title="computedTitle"
    class="warehouse-dialog"
    :visible.sync="visible"
    append-to-body
    :close-on-click-modal="false"
    width="500px"
    v-if="show"
    @closed="show = false"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="是否自有" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio :label="0">自有</el-radio>
          <el-radio :label="1">第三方</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="仓库名称" prop="name">
        <el-input
          v-model="form.name"
          maxlength="30"
          placeholder="请输入仓库名称"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="仓库所属" prop="belong">
        <el-input
          v-model="form.belong"
          maxlength="30"
          placeholder="请输入仓库所属"
          show-word-limit
          clearable
          :disabled="this.form.type === 0"
        ></el-input>
      </el-form-item>
      <el-form-item label="城市" prop="city">
        <el-input
          v-model="form.city"
          maxlength="30"
          placeholder="请输入城市"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="contact">
        <el-input
          v-model="form.contact"
          maxlength="30"
          placeholder="请输入联系人"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="tel">
        <el-input
          v-model="form.tel"
          maxlength="30"
          placeholder="请输入联系电话"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="仓库地址" prop="address">
        <el-input
          type="textarea"
          v-model="form.address"
          maxlength="50"
          placeholder="请输入仓库地址"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        label="进仓地图"
        prop="mapModulePath"
        style="padding-top: 20px"
      >
        <div class="upload-img">
          <el-input v-model="form.mapModulePath" v-show="false"></el-input>
          <div v-if="!form.mapModulePath" class="docx-icon">
            <img :src="upIcon" style="cursor: pointer" @click="uploadDocx" />
          </div>
          <div v-else class="docx-icon">
            <i class="el-icon-error del-btn" @click="delDocx"></i>
            <img
              :src="gongdanIcon"
              style="cursor: zoom-in"
              @click="$utils.previewDocx({ xpath: form.xpath })"
            />
          </div>
          <div class="help">
            <img :src="helpIcon" @click="showTips = !showTips" />
            <span v-show="showTips"
              >进仓地图仅支持Docx且需要包含固定文本:进仓编号:${inboundNo}.请处理一代信息</span
            >
          </div>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button type="primary" @click="submitForm">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
const rules = {
  type: [
    {
      required: true,
      type: "number",
      message: "请选择是否自有",
      target: "change",
    },
  ],
  name: [{ required: true, message: "请输入仓库名称", target: "blur" }],
  belong: [{ required: true, message: "请输入仓库所属", target: "blur" }],
  city: [{ required: true, message: "请输入城市", target: "blur" }],
  contact: [{ required: true, message: "请输入联系人", target: "blur" }],
  tel: [{ required: true, message: "请输入联系电话", target: "blur" }],
  address: [{ required: true, message: "请输入仓库地址", target: "blur" }],
  mapModulePath: [
    { required: true, message: "请上传进仓地图", target: "change" },
  ],
};
const upIcon = require("@/assets/up.svg");
const gongdanIcon = require("@/assets/gongdan.svg");
const helpIcon = require("@/assets/help.svg");
export default {
  name: "WarehouseDialog",
  props: {
    form: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      visible: false,
      upIcon,
      gongdanIcon,
      helpIcon,
      rules,
      show: false,
      showTips: true,
    };
  },
  computed: {
    computedFormRef() {
      return this.$refs.form;
    },
    computedTitle() {
      return `${this.form.id ? "编辑" : "新建"}仓库`;
    },
    computedSubmit() {
      return this.form.id
        ? {
            api: "editWarehouse",
            text: "保存",
            emitEv: "afterEdit",
          }
        : {
            api: "addWarehouse",
            text: "添加",
            emitEv: "afterAdd",
          };
    },
  },
  methods: {
    submitForm() {
      this.computedFormRef &&
        this.computedFormRef.validate(async (valid) => {
          if (valid) {
            try {
              await this.editWarehouse();
              this.show = false;
              this.$emit(this.computedSubmit.emitEv);
            } catch (error) {}
          } else {
            return false;
          }
        });
    },
    // 上传docx
    async uploadDocx() {
      const files = await this.$utils.loadFile({
        accept:
          ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const file = files[0];
      const fileFormData = new FormData();
      fileFormData.append("file", file);
      const { data, code, message } = await this.$http.post(
        this.$service.uploadWarehouseMap,
        fileFormData
      );
      const { attachmentName, attachmentPath, xpath } = data || {};
      if (code === 200) {
        this.setMap({
          mapModuleName: attachmentName,
          mapModulePath: attachmentPath,
          xpath: xpath,
        });
      } else {
        this.$message.error(message);
      }
    },
    // 删除docx
    delDocx() {
      this.setMap({ mapModuleName: "", mapModulePath: "", xpath: "" });
    },
    // 编辑|新建仓库
    async editWarehouse() {
      const {
        id,
        address,
        belong,
        city,
        contact,
        mapModuleName,
        mapModulePath,
        name,
        tel,
        type,
      } = this.form;
      const apiData = {
        address,
        belong,
        city,
        contact,
        mapModuleName,
        mapModulePath,
        name,
        tel,
        type,
      };
      if (id) {
        apiData.id = id;
      }
      const { code, message } = await this.$http.post(
        this.$service[this.computedSubmit.api],
        apiData
      );
      if (code === 200) {
        this.$message.success(`${this.computedSubmit.text}成功`);
      } else {
        this.$message.error(message);
        return Promise.reject();
      }
    },
    // 设置地图
    setMap({ mapModuleName, mapModulePath, xpath }) {
      this.form.mapModuleName = mapModuleName;
      this.form.mapModulePath = mapModulePath;
      this.form.xpath = xpath;
    },
  },
  watch: {
    "form.type"(newVal, oldVal) {
      // 自有仓库的仓库所属为“自有仓库”不可修改，第三方默认为空可填写
      if (newVal === 0) {
        this.form.belong = "自有仓库";
      } else {
        this.form.belong =
          this.form.belong === "自有仓库" ? "" : this.form.belong;
      }
    },
    "show"(newVal) {
      newVal && (this.visible = true)
    },
  },
};
</script>

<style lang="less" scoped>
.warehouse-dialog {
  .upload-img {
    display: flex;
    .docx-icon {
      position: relative;
      width: 40px;
      .del-btn {
        position: absolute;
        right: 0;
        top: 0;
        font-size: 20px;
        color: #f56c6c;
        transform: translate(50%, -50%);
      }
      img {
        width: 100%;
      }
    }
    .help {
      display: flex;
      flex: 1;
      flex-wrap: wrap;
      align-items: flex-start;
      margin-left: 10px;
      margin-top: auto;
      padding-top: 20px;
      height: 40px;
      img {
        width: 20px;
      }
      span {
        margin-left: 10px;
        flex: 1;
        font-size: 12px;
        line-height: 14px;
      }
    }
  }
}
</style>