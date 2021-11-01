<template>
  <div>
    <el-dialog
      width="60vw"
      v-dialogDrag
      ref="dialog__wrapper"
      :title="title"
      :visible.sync="dialogVisible"
    >
      <div class="dialog">
        <div
          v-for="(v, index) in pagesData"
          :key="index"
          :style="{
            width: v.width + 'px',
            height: v.height + 60 + 'px',
            'margin-left': '5%',
          }"
        >
          <div class="title">
            <img
              style="width: 50%; height: 30px; margin-top: 14px"
              v-if="v.titlePic"
              :src="imagesBaseUrl + v.titlePic.picPath"
              alt=""
            />
            <span v-else style="font-size: 14px">{{ v.cname }}</span>
          </div>
          <div
            :style="{
              width: v.width + 'px',
              height: v.height + 'px',
              position: 'relative',
              border: '1px solid #ccc',
            }"
          >
            <div
              v-for="(page, index1) in v.componentRooms"
              :key="index1"
              :style="{
                width: page.width + 'px',
                height: page.height + 'px',
                position: 'absolute',
                border: '1px solid #ccc',
                top: page.yValue + 'px',
                left: page.xValue + 'px',
              }"
            >
              <img
                :style="{
                  width: page.width + 'px',
                  height: page.height + 'px',
                }"
                :src="
                  page.recommendPic
                    ? imagesBaseUrl + page.recommendPic.picPath
                    : ''
                "
                alt
              />
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "previewPage",
  data() {
    return {
      dialogVisible: false,
      title: "",
      pagesData: [],
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
    };
  },
  created() {},
  methods: {
    init(data) {
      this.pagesData = data;
      this.title = data.cname;
      this.dialogVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog {
  height: 650px;
  overflow: auto;
}
.title {
  width: 100%;
  height: 40px;
  line-height: 40px;
  margin-bottom: 12px;
}
</style>