<template>
  <div style="padding-bottom:15px">
    <div v-if="datatype != 'order0'" class="policy" >
      <div>
        <p style="margin-left: 50px">分单类型</p>
        <div class="radioSelect">
          <el-radio-group
            v-model="radioSelect"
            @change="radioSelectChange(radioSelect)"
          >
            <el-radio :label="0">系统分单</el-radio>
            <el-radio :label="1">客户分单</el-radio>
          </el-radio-group>
        </div>
      </div>

      <div
        style="display: flex; justify-content: space-around; flex-wrap: wrap"
      >
        <div>
          <div style="margin-bottom: 10px; margin-top: 10px">
            <span style="color: red">*</span>
            分单号 HAWB NO||{{ currentIndex }}
          </div>
          <div>
            <input
              ref="inputAgain"
              style="border: 1px solid black; cursor: not-allowed"
              type="text"
              disabled
              onKeyUp="value=value.replace(/[\W]/g,'')"
              @blur="inputData.input1 = $event.target.value"
              maxlength="20"
              spellcheck="false"
              v-model="inputData.input1"
              clearable
            />
          </div>
        </div>

        <div>
          <div style="margin-bottom: 10px; margin-top: 10px">
            <span style="color: red">*</span>
            件数 No. of Pieces||{{ currentIndex }}
          </div>
          <div>
            <input
              style="border: 1px solid black"
              type="text"
              maxlength="4"
              onKeyUp="value=value.replace(/[^1-9]/g,'')"
              @blur="inputData.input2 = $event.target.value"
              spellcheck="false"
              v-model="inputData.input2"
              clearable
            />
          </div>
        </div>

        <div>
          <div style="margin-bottom: 10px; margin-top: 10px">
            <span style="color: red">*</span>
            毛重 Gross Weight||{{ currentIndex }}
          </div>
          <div>
            <input
              style="border: 1px solid black"
              type="text"
              maxlength="6"
              onKeyUp="value=value.replace(/[^1-9]/g,'')"
              @blur="inputData.input3 = $event.target.value"
              spellcheck="false"
              v-model="inputData.input3"
              clearable
            />
          </div>
        </div>

        <div>
          <div style="margin-bottom: 10px; margin-top: 10px">
            <span style="color: red">*</span>
            体积 Measurement||{{ currentIndex }}
          </div>
          <div>
            <input
              style="border: 1px solid black"
              type="text"
              onkeyup="this.value= this.value.match(/^-?\d{0,6}(\.\d{0,4})?/)? this.value.match(/^-?\d{0,}(\.\d{0,4})?/)[0] : ''"
              @blur="inputData.input4 = $event.target.value"
              spellcheck="false"
              v-model="inputData.input4"
              clearable
            />
          </div>
        </div>

        <div>
          <div style="margin-bottom: 10px; margin-top: 10px">
            <span style="color: red">*</span>
            计费重 Chargeable Weight||{{ currentIndex }}
          </div>
          <div>
            <input
              style="border: 1px solid black"
              type="text"
              onKeyUp="value=value.replace(/[\W]/g,'')"
              @blur="inputData.input5 = $event.target.value"
              spellcheck="false"
              v-model="inputData.input5"
              clearable
            />
          </div>
        </div>
      </div>
    </div>
    <div class="itemList">
      <div class="item1" v-for="(itm, indx) in texts" :key="indx">
        <div class="text">
          <span v-if="itm.title1 != '操作信息'" style="color: red">*</span
          >{{ itm.title1 }}
        </div>
        <div class="text">{{ itm.title2 }}</div>
        <el-input
          type="textarea"
          placeholder="请输入内容"
          ref="inputArea"
          v-model="texts[indx].content"
          onKeyUp="value=value.replace(/[\W]/g,'')"
          @blur="texts[indx].content = $event.target.value"
          spellcheck="false"
          maxlength="500"
          show-word-limit
        >
        </el-input>
      </div>
    </div>
    <div class="footer">
      <div class="footer-one">
        <!-- table -->
        <div v-if="datatype == 'order0'">
          <div class="text"><span style="color: red">*</span>杂费</div>
          <div class="text">Other charges</div>
          <div style="display: flex">
            <div
              style="
                border: 1px solid black;
                width: 100px;
                height: 40px;
                line-height: 40px;
                text-align: center;
              "
              v-for="(item, index) in tableHead"
              :key="index"
            >
              {{ item.name }}
            </div>
          </div>

          <div
            v-for="(item, index) in tableData"
            :key="index"
            style="display: flex"
          >
            <div
              style="width: 100px; border: 1px solid black"
              v-for="(item1, index1) in tableHead"
              :key="index1"
            >
              <div v-if="item1.label == 'a'">
                <el-input
                  clearable
                  maxlength="50"
                  onKeyUp="value=value.replace(/[\W]/g,'')"
                  @blur="tableData[index].name = $event.target.value"
                  v-model="tableData[index].name"
                >
                </el-input>
              </div>
              <div v-if="item1.label == 'b'">
                <el-input
                  clearable
                  maxlength="50"
                  onKeyUp="value=value.replace(/[^\d]/g,'') "
                   @blur="tableData[index].value = $event.target.value"
                  v-model="tableData[index].value"
                ></el-input>
              </div>
              <div
                style="display: flex; justify-content: space-around"
                v-if="item1.label == 'c'"
              >
                <a
                  style="border: 1px solid #6289dc; margin-top: 10px"
                  v-if="tableData.length == index + 1"
                  @click="tableData.push({})"
                  >添加</a
                >

                <a
                  style="border: 1px solid #6289dc; margin-top: 10px"
                  @click="tableData.pop()"
                  >删除</a
                >
              </div>
            </div>
          </div>
        </div>
        <div class="radio">
          <div class="text">支付信息</div>
          <div class="text">Accounting Information</div>
          <el-radio-group v-model="radio" @change="radioChange">
            <el-radio :label="0">运费预付</el-radio>
            <el-radio :label="1">运费到付</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="lis1">
        <el-button
          class="cun"
          type="warning"
          size="mini"
          @click="save(datatype,currentIndex)"
          >保存数据</el-button
        >
        <el-button class="res" size="mini" @click="relick(datatype)"
          >清空</el-button
        >
      </div>
      <div class="lis2">
        <el-button class="alig" size="mini" @click="previewData(currentIndex)"
          >提单预览</el-button
        >
        <el-popover
          placement="top"
          width="160"
          ref="downloadPop"
          v-model="visible"
        >
          <div style="display: flex; justify-content: space-between">
            <p style="fontsize: 12px; height: 28px; line-height: 28px">
              下载类型:
            </p>
            <el-select
              size="mini"
              style="width: 100px"
              v-model="value"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div style="text-align: center; margin: 0; margin-top: 20px">
            <a style="border: 1px solid #6289dc" @click="visible = false"
              >取消</a
            >
            <a
              style="border: 1px solid #6289dc"
              @click="installData(datatype)"
              :href="dataPath"
              >确定</a
            >
          </div>
          <el-button
            type="primary"
            slot="reference"
            size="mini"
            @click="commitData(currentIndex)"
            >提单下载</el-button
          >
        </el-popover>
      </div>
    </div>
    <el-dialog title="预览pdf" :visible.sync="dialogVisible" width="40%" center>
      <embed
        :src="filePath"
        style="width: 100%; height: 100%"
        :key="previewKey"
      />
    </el-dialog>

    <el-dialog
      title="预览舱单pdf"
      :visible.sync="dialogCangDan"
      width="40%"
      center
    >
      <embed
        :src="cangDanPath"
        style="width: 100%; height: 100%"
        :key="previewKey"
      />
    </el-dialog>
  </div>
</template>
<script>
import axios from "../../static/axios.min.js";
export default {
  props: {
    datatype: String,
    mainData: Object,
    menudata:Array,
    currentIndex:Number
  },
  data() {
    return {
      // 绑定key值重新渲染
      previewKey: 1,
      // 弹出框状态
      visible: false,
      // 下载格式选择
      options: [
        {
          label: "pdf",
          value: "pdf",
        },
        {
          label: "excel",
          value: "excel",
        },
      ],
      // 默认选择格式
      value: "pdf",
      // textarea绑定数组
      texts: [
        {
          title1: "发货信息",
          title2: "Shipper's Name and Address",
          content: "",
        },
        {
          title1: "收货信息",
          title2: "Consignee's Name and Address",
          content: "",
        },
        { title1: "通知人", title2: "notify party", content: "" },
        { title1: "品名", title2: "Nature and Quantity of Goods", content: "" },
        { title1: "唛头", title2: "Shipping mark", content: "" },
        { title1: "操作信息", title2: "Handling information", content: "" },
      ],
      // 支付信息单选按钮
      radio: 0,
      // 分单类型单选按钮
      radioSelect: 0,
      // 预览pdf模态框状态
      dialogVisible: false,
      // 舱单模态框状态
      dialogCangDan: false,
      // 舱单预览文件路径
      cangDanPath: "",
      //预览文件路径
      filePath: "",
      // 下载文件路径
      dataPath: "",
      // 方便控制预览之后提示
      previewState: "",
      // 杂费数据
      tableData: [{}],
      // 表头
      tableHead: [
        { name: "杂费", label: "a" },
        { name: "金额", label: "b" },
        { name: "操作", label: "c" },
      ],
      inputData: {
        input1: "",
        input2: "",
        input3: "",
        input4: "",
        input5: "",
      },
    };
  },
  mounted() {
    this.initData();
  },
  activated() {
  
  },
  methods: {
    // 初始化页面数据
    initData() {
      // 主单数据展示
      if (this.datatype == "order0") {
        this.texts[0].content = this.mainData.shipperInfo;
        this.texts[1].content = this.mainData.consigneeInfo;
        this.texts[2].content = this.mainData.notificationInfo;
        this.texts[3].content = this.mainData.goodsInfo;
        this.texts[4].content = this.mainData.shippingMark;
        this.texts[5].content = this.mainData.handlingInfo;
        if (this.mainData.wtVal == "0") {
          this.radio = 0;
        } else if (this.mainData.wtVal == "1") {
          this.radio = 1;
        }
        let json = this.mainData.otherCharges;
        var arr = [];
        // 数据处理
        if (JSON.stringify(json) != "{}" && json) {
          let names = Object.keys(json);
          let values = Object.values(json);
          for (let i = 0; i < names.length; i++) {
            let o = {};
            o.name = names[i];
            o.value = values[i];
            arr.push(o);
          }
          this.tableData = arr;
        }
      }
      // 分单数据展示
      for (let i = 0, j = 5; i < j; i++) {
        if (this.datatype == (this.menudata[i] && this.menudata[i].title)) {
          if (!this.mainData.hawbList) {
            break;
          }
          let data = this.mainData.hawbList[i];
          if (data && data.wtVal && data.wtVal == "0") {
            this.radio = 0;
          } else if (data && data.wtVal && data.wtVal == "1") {
            this.radio = 1;
          }
          if (data && data.hawb) {
            var keys = data.hawb.slice(0, 3);
          }
          if (keys == "FLD") {
            this.radioSelect = 0;
            this.radioSelectChange();
          } else {
            this.radioSelect = 1;
            this.radioSelectChange();
          }
          if (data) {
            this.inputData.input1 = data.hawb;
            this.inputData.input2 = data.pieces;
            this.inputData.input3 = data.grossWeight;
            this.inputData.input4 = data.measurement;
            this.inputData.input5 = data.chargeableWeight;
            this.texts[0].content = data.shipperInfo;
            this.texts[1].content = data.consigneeInfo;
            this.texts[2].content = data.notificationInfo;
            this.texts[3].content = data.goodsInfo;
            this.texts[4].content = data.shippingMark;
            this.texts[5].content = data.handlingInfo;
          }
        }
      }
    },
    // 舱单预览和下载
    cangDanDialog() {
      this.dialogCangDan = true;
      var order = this.mainData.orderNo;
      this.previewKey = this.previewKey + 1;
      this.cangDanPath = `http://10.8.0.1/track/bill-of-lading/preview/ware/pdf/${order}`;
    },
    // 限制系统分单不可输入
    radioSelectChange() {
      if (this.radioSelect == 1) {
        this.$refs.inputAgain.style.cursor = "none";
        this.$refs.inputAgain.disabled = false;
      } else {
        this.$refs.inputAgain.style.cursor = "not-allowed";
        this.$refs.inputAgain.disabled = true;
      }
    },
    // 主单修改保存
    saveMainData() {
      if (this.mainData.id) {
        var obj = {};
        // 处理数据
        let data = this.tableData;
        for (let i = 0; i < data.length; i++) {
          obj[data[i].name] = data[i].value;
        }

        let json = {
          id: this.mainData.id,
          shipperInfo: this.texts[0].content,
          consigneeInfo: this.texts[1].content,
          notificationInfo: this.texts[2].content,
          goodsInfo: this.texts[3].content,
          shippingMark: this.texts[4].content,
          handlingInfo: this.texts[5].content,
          otherCharges: JSON.stringify(obj),
          wtVal: this.radio,
        };
        axios
          .post("http://10.8.0.1/track/bill-of-lading/edit", json)
          .then((data) => {
            if (data.data.code == 200) {
              this.$message.success("保存成功");
              json.otherCharges = obj;
              json.orderNo = this.mainData.orderNo;
              this.$emit("sonSaveData", [0, json]);
            } else {
              this.$message.error(data.data.message);
            }
          });
      } else {
        this.$message.error("请先输入订单号");
      }
    },
    // 分单修改保存
    saveOtherData(type,index) {
      if (this.mainData.id) {
        let idx = type.slice(-1);
        let data = this.mainData.hawbList[index - 1];
        console.log(index,"saveOtherData")
        let copy = JSON.parse(JSON.stringify(data));
        delete copy.ifNewData;
        if (Object.keys(copy).length > 0) {
          let json = {
            id: data.id,
            shipperInfo: this.texts[0].content,
            consigneeInfo: this.texts[1].content,
            notificationInfo: this.texts[2].content,
            goodsInfo: this.texts[3].content,
            shippingMark: this.texts[4].content,
            handlingInfo: this.texts[5].content,
            hawb: this.inputData.input1,
            pieces: this.inputData.input2,
            grossWeight: this.inputData.input3,
            measurement: this.inputData.input4,
            chargeableWeight: this.inputData.input5,
            wtVal: this.radio,
          };
          axios
            .post("http://10.8.0.1/track/bill-of-lading/edit", json)
            .then((data) => {
              if (data.data.code == 200) {
                this.$message.success("保存成功");
                this.$emit("sonSaveData", [index, json]);
              } else {
                this.$message.error(data.data.message);
              }
            });
        } else {
          let params = {
            chargeableWeight: this.inputData.input5,
            consigneeInfo: this.texts[1].content,
            goodsInfo: this.texts[3].content,
            grossWeight: this.inputData.input3,
            handlingInfo: this.texts[5].content,
            hawb: this.inputData.input1,
            measurement: this.inputData.input4,
            notificationInfo: this.texts[2].content,
            orderNo: this.mainData.orderNo,
            pieces: this.inputData.input2,
            shipperInfo: this.texts[0].content,
            shippingMark: this.texts[4].content,
            wtVal: this.radio,
          };
          axios
            .post("http://10.8.0.1/track/bill-of-lading/save", params)
            .then((data) => {
              if (data.data.code == 200) {
                this.$message.success("保存成功");
                params.id = data.data.data.id;
                this.$emit("sonSaveData", [index, params]);
              } else {
                this.$message.error(data.data.message);
              }
            });
        }
      } else {
        this.$message.error("请先输入订单号");
      }
    },
    // 保存
    save(type) {
      let index = this.currentIndex
      console.log(index,"saveIndex")
      this.previewKey = this.previewKey + 1;
      if (type == "order0") {
        if (
          this.texts[0].content != "" &&
          this.texts[1].content != "" &&
          this.texts[2].content != "" &&
          this.texts[3].content != "" &&
          this.texts[4].content != "" &&
          this.tableData[0].name != ""&&
          this.tableData[0].value != ""
      
        ) {
          this.saveMainData();
        } else {
          this.$message.error("带*的为必填项，请输入完后再操作");
        }
      } else {
        if (
          this.texts[0].content  &&
          this.texts[1].content  &&
          this.texts[2].content  &&
          this.texts[3].content  &&
          this.texts[4].content  &&
          this.inputData.input1  &&
          this.inputData.input2  &&
          this.inputData.input3  &&
          this.inputData.input4  &&
          this.inputData.input5 
        ) {
          this.saveOtherData(type,index);
          console.log(this.texts);
        } else {
          this.$message.error("带*的为必填项，请输入完后再操作");
        }
      }
    },
    // 重置清空输入信息
    relick(datatype) {
      // 主单清空
      if (datatype == "order0") {
        this.texts[0].content = "";
        this.texts[1].content = "";
        this.texts[2].content = "";
        this.texts[3].content = "";
        this.texts[4].content = "";
        this.texts[5].content = "";
        this.tableData = [{}];
      } else {
        this.inputData.input1 = "";
        this.inputData.input2 = "";
        this.inputData.input3 = "";
        this.inputData.input4 = "";
        this.inputData.input5 = "";
        this.texts[0].content = "";
        this.texts[1].content = "";
        this.texts[2].content = "";
        this.texts[3].content = "";
        this.texts[4].content = "";
        this.texts[5].content = "";
      }
    },
    // 判断已有数据是否改变,改变了提示用户先保存在预览和下载
    tipsComing(type) {
      if (!type) {
        let obj = {};
        let data = this.tableData;
        for (let i = 0; i < data.length; i++) {
          obj[data[i].name] = data[i].value;
        }
        let json = JSON.stringify(obj);
        let getjson = JSON.stringify(this.mainData.otherCharges);
        if (
          this.texts[0].content != this.mainData.shipperInfo ||
          this.texts[1].content != this.mainData.consigneeInfo ||
          this.texts[2].content != this.mainData.notificationInfo ||
          this.texts[3].content != this.mainData.goodsInfo ||
          this.texts[4].content != this.mainData.shippingMark ||
          this.texts[5].content != this.mainData.handlingInfo ||
          this.radio != this.mainData.wtVal ||
          json != getjson
        ) {
          this.$refs.downloadPop.disabled = true;
          this.$message.error("请先保存数据后再预览和下载最新的数据");
          this.previewState = true;
        }
      } else {
        for (var i = 0, j = 5; i < j; i++) {
          if (type == (i + 1)) {
             i = type-1
            var data = this.mainData.hawbList[i];
            if (this.mainData.hawbList[i].hawb) {
              var keys = this.mainData.hawbList[i].hawb.slice(0, 3);
            }
            if (keys == "FLD") {
              var meta = 0;
            } else {
              var meta = 1;
            }
            if (
              this.radioSelect != meta ||
              this.inputData.input1 != data.hawb ||
              this.inputData.input2 != data.pieces ||
              this.inputData.input3 != data.grossWeight ||
              this.inputData.input4 != data.measurement ||
              this.inputData.input5 != data.chargeableWeight ||
              this.texts[0].content != data.shipperInfo ||
              this.texts[1].content != data.consigneeInfo ||
              this.texts[2].content != data.notificationInfo ||
              this.texts[3].content != data.goodsInfo ||
              this.texts[4].content != data.shippingMark ||
              this.texts[5].content != data.handlingInfo ||
              this.radio != data.wtVal
            ) {
              this.$refs.downloadPop.disabled = true;
              this.$message.error("请先保存数据后再预览和下载最新的数据");
              this.previewState = true;
              
            }
          }
        }
      }
    },
    // 预览
    previewData(type) {
      // 主单预览
      if (!type) {
        let id = this.mainData.id;
        // 有主单数据
        if (id) {
          this.tipsComing(type);
          if (this.previewState) {  
            this.dialogVisible = false;
            this.previewState = false;
          } else {
            axios.get(`http://10.8.0.1/track/bill-of-lading/preview/bill/pdf/${id}`).then((data)=>{
              if(data.data.code) {
                this.$message.error('请求错误')
              } else {
                this.filePath = `http://10.8.0.1/track/bill-of-lading/preview/bill/pdf/${id}`;
                 this.dialogVisible = true;
              }
            })
            
          }
          return;
        } else {
          this.$message.error("请先输入订单号");
          return;
        }
      }
      // 请求了数据
      if (this.mainData.id) {
        let idx = type;
        let data = this.mainData.hawbList[idx - 1];
        if(data) {
        var copy = JSON.parse(JSON.stringify(data));
        delete copy.ifNewData;
        }
        // 有分单数据
        if (JSON.stringify(copy) != "{}" && copy) {
          this.tipsComing(type);
          if (this.previewState) {
            this.dialogVisible = false;
            this.previewState = false;
          } else {
             axios.get(`http://10.8.0.1/track/bill-of-lading/preview/bill/pdf/${data.id}`).then((res)=>{
              if(res.data.code) {
                this.$message.error('请求错误')
              } else {
                this.filePath = `http://10.8.0.1/track/bill-of-lading/preview/bill/pdf/${data.id}`;
                 this.dialogVisible = true;
              }
            })
          }
          return;
        } else {
          this.$message.error("请先保存数据");
          
          return;
        }
      } else {
        this.$message.error("请先输入订单号");
      }
    },
    // 下载
    installData(type) {
      this.visible = false;
      let typ = this.value;
      if (type == "order0") {
        let id = this.mainData.id;
        this.dataPath = `http://10.8.0.1/track/bill-of-lading/download/bill/${typ}/${id}`;
        return;
      }
      let idx = type.slice(-1);
      let data = this.mainData.hawbList[idx - 1];
      if (data) {
        this.dataPath = `http://10.8.0.1/track/bill-of-lading/download/bill/${typ}/${data.id}`;
        return;
      }
    },
    // 限制无订单号输入点击下载
    commitData(type) {
      // 没有请求数据
      if (!this.mainData.id) {
        this.$refs.downloadPop.disabled = true;
        this.$message.error("请先输入订单号");
      }
      // 请求了数据
      else {
        if (!type) {
          this.tipsComing(type);
        }
        if (type) {
          this.tipsComing(type);
        }
        var idx = type.slice(-1);
        let data = this.mainData.hawbList[idx - 1];

        if (data) {
          delete data.ifNewData;
          // 请求了数据但是是新建分单提示先保存数据
          if (this.mainData.id && JSON.stringify(data) == "{}") {
            this.$refs.downloadPop.disabled = true;
            // this.$message.error("请先保存数据");
          }
        }
      }
    },
  },
  watch: {
    // 监听传过来的数据以页面初始化数据
    mainData() {
      this.initData();
    },
    currentIndex() {
      console.log(this.currentIndex,"xxCurrent")
    }
  },
};
</script>
<style scoped lang="less">
/deep/.el-dialog__body {
  height: 800px;
  overflow: scroll;
}
.itemList {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 50px;
}
.text {
  height: 20px;
  padding: 5px;
}
.radioSelect {
  position: relative;
  left: 120px;
  bottom: 15px;
}

.policy {
  height: 100px;
  margin-top: 30px;
}
.item1 {
  margin-top: 5px;
}
/deep/.el-textarea {
  textarea {
    height: 120px !important;
    width: 400px !important;
  }
}

.footer-one {
  display: flex;

  height: 100px;
  margin-top: 20px;
  margin-left: 20px;
}
.radio {
  margin-left: 60px;
}
.cun {
  background-color: orange !important;
}
.res {
  background-color: rgb(129, 211, 248) !important;
}
.lis1 {
  float: right;
  margin-right: 80px;
}
.alig {
  background-color: #909399;
  color: #fff;
}
.lis2 {
  text-align: center;
  margin-top: 90px;
}
</style>