<template>
  <div>
    <el-dialog
      width="71vw"
      v-dialogDrag
      ref="dialog__wrapper"
      :title="title"
      :visible.sync="dialogVisible"
    >
      <div class="dialog">
        <div v-if="pageBackImgUrl" style="width: 1300px; height: 720px; position: relative">
          <img style="width: 1280px; height: 720px" :src="pageBackImgUrl" alt />
        </div>
        <div
          style="
            margin-top: 70px;
            width: 96.6%;
            height: 85.5%;
            overflow: auto;
            position: absolute;
            top: 0;
          "
        >
          <div
            v-for="(v, index) in pagesData"
            :key="index"
            :style="{
              width: v.width + 'px',
              height: v.height + 60 + 'px',
            }"
          >
            <div class="title">
              <img
                style="width: 50%; height: 30px; margin-top: 14px"
                v-if="v.titlePic"
                :src="imagesBaseUrl + v.titlePic.picPath"
                alt=""
              />
              <!-- <span v-else style="font-size: 14px;">{{ v.cname }}</span> -->
            </div>
            <div
              :style="{
                width: v.width + 'px',
                height: v.height + 'px',
                position: 'relative',
              }"
            >
              <div
                v-for="(page, index1) in v.componentRooms"
                :key="index1"
                :style="{
                  width: page.width + 'px',
                  height: page.height + 'px',
                  position: 'absolute',
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
      pageBackImgUrl: "",
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
    };
  },
  created() {},
  methods: {
    init(data, pageBackImg) {
      this.pagesData = data;
      if(pageBackImg != undefined){
        this.pageBackImgUrl = this.imagesBaseUrl + pageBackImg.picPath;
      }else{
        this.pageBackImgUrl = "";
      }
      this.title = data.cname;
      this.dialogVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog {
  height: 740px;
  overflow: auto;
}
.title {
  width: 100%;
  height: 40px;
  margin-left: 20px;
  line-height: 40px;
  margin-bottom: 10px;
}
</style>