<template>
  <div class="pick-up-form">
    <el-form
      ref="form"
      :rules="rules"
      :model="form"
      label-width="100px"
      size="small"
    >
      <el-form-item label="提货时间" prop="pickUpTime">
        <el-date-picker
          v-model="form.pickUpTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm"
          placeholder="选择提货时间"
          style="width: 170px"
          :clearable="false"
          :picker-options="pickerOptions"
          @change="() => $emit('update:pickUpTime', form.pickUpTime)"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="提货地址" prop="pickUpAddress">
        <el-input
          v-model="form.pickUpAddress"
          placeholder="请输入提货地址"
          @input="() => $emit('update:pickUpAddress', form.pickUpAddress)"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="pickUpTel">
        <el-input
          v-model="form.pickUpTel"
          placeholder="请输入联系电话"
          @input="() => $emit('update:pickUpTel', form.pickUpTel)"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="提货联系人" prop="pickUpContacts">
        <el-input
          v-model="form.pickUpContacts"
          @input="() => $emit('update:pickUpContacts', form.pickUpContacts)"
          placeholder="请输入提货联系人"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
const rules = {
  pickUpTime: [
    {
      required: true,
      type: "string",
      message: "请选择提货时间",
      target: "change",
    },
  ],
  pickUpAddress: [
    {
      required: true,
      type: "string",
      message: "请输入提货地址",
      target: "blur",
    },
  ],
  pickUpTel: [
    {
      required: true,
      type: "string",
      message: "请输入联系电话",
      target: "blur",
    },
  ],
  pickUpContacts: [
    {
      required: true,
      type: "string",
      message: "请输入提货联系人",
      target: "blur",
    },
  ],
};
export default {
  // 提货信息表单
  name: "PickUpForm",
  props: ["pickUpAddress", "pickUpContacts", "pickUpTel", "pickUpTime"],
  data() {
    return {
      rules,
      form: {
        pickUpAddress: this.pickUpAddress,
        pickUpContacts: this.pickUpContacts,
        pickUpTel: this.pickUpTel,
        pickUpTime: this.pickUpTime,
      },
    };
  },
  computed: {
    pickerOptions() {
      return {
        disabledDate(time) {
          return time.getTime() < new Date().getTime() - 24 * 60 * 60 * 1000;
        },
      };
    },
  },
};
</script>

<style lang="less" scoped>
.pick-up-form {
  margin-left: -20px;
  padding: 20px 0;
  width: 360px;
}
</style>