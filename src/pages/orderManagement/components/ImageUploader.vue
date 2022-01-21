<template>
  <div class="image-uploader">
    <div class="upload-btn" :class="{ disabled: disabled }">
      <i class="el-icon-upload" @click="loadImage"></i>
    </div>
    <ul>
      <li v-for="(item, index) in images" :key="item.id">
        <i
          class="el-icon-error del-btn"
          :class="{ disabled: disabled }"
          @click="delImage(index)"
        ></i>
        <img :src="item.xpath" @click="previewImage(item)" />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ImageUploader",
  props: {
    images: {
      type: Array,
      require: true,
      default: [],
    },
    orderId: {
      type: [Number, String],
      require: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    // 载入本地图片
    async loadImage() {
      if (this.disabled) {
        return;
      }
      if (this.images.length >= 6) {
        this.$message.error("最多上传6张图片");
        return;
      }
      const files = await this.$utils.loadImage();
      const file = files[0];
      if (file.size > 500 * 1024) {
        this.$message.error("上传图片大小不能超过500kb");
        return;
      }
      const fileFormData = new FormData();
      fileFormData.append("file", file);
      const { data, code, message } = await this.$http.post(
        this.$service.attachmentUpload,
        fileFormData,
        {
          params: {
            attachType: 1,
            orderId: this.orderId,
          },
        }
      );
      if (code === 200) {
        this.images.push(data);
      } else {
        this.$message.error(message);
      }
    },
    // 预览图片
    previewImage(image) {
      this.$msgbox({
        dangerouslyUseHTMLString: true,
        title: "预览图片",
        message: `<img src="${image.xpath}" style="min-width: 100%; max-width: 80vw; max-height: 60vh" />`,
        center: true,
        showConfirmButton: false,
        customClass: "image-preview-message-box",
      })
        .then(() => {})
        .catch(() => {});
    },
    // 删除图片
    delImage(index) {
      this.images.splice(index, 1);
    },
  },
};
</script>

<style lang="less" scoped>
.image-uploader {
  padding: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;

  ul {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    li {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      margin: 5px;
      height: 30px;
      width: 30px;
      .del-btn {
        display: none;
        position: absolute;
        right: -16px;
        top: -16px;
        transform: translate(-50%, 50%);
        font-size: 16px;
        color: #f56c6c;
      }
      &:hover {
        .del-btn {
          display: block;
          &.disabled {
            display: none;
          }
        }
      }
    }
  }
  img {
    max-height: 100%;
    max-width: 100%;
    cursor: zoom-in;
  }
  .upload-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    font-size: 24px;
    cursor: pointer;
    color: #2273ce;
    &.disabled {
      cursor: not-allowed;
      i {
        display: none;
      }
    }
  }
}
</style>