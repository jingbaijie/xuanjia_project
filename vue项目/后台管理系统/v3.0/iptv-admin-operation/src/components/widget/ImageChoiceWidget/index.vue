<template>
  <transition name="fade-transform" mode="out-in">
    <el-tabs type="border-card" @tab-click="chageTab">
      <div :style="{ height: '50px', 'margin-left': '10px' }">
        <search
          id="header-search"
          class="right-menu-item"
          @searchKey="getSearch"
        />
        <div class="press_btn">
          <el-button type="text" :disabled="preBtn" @click="lastPage"
            >上一页</el-button
          >
          <el-button type="text" :disabled="nextBtn" @click="nextPage"
            >下一页</el-button
          >
        </div>
      </div>
      <el-tab-pane
        :key="type.id"
        v-for="type in Imagestypes"
        :label="type.title"
      >
        <ul class="selectImg">
          <li :key="img.id" v-for="img in imgData">
            <el-card
              :body-style="{ padding: '8px', cursor: 'pointer' }"
              shadow="hover"
            >
              <div style="width: 100px;height: 20px;font-size: 12px">
                尺寸:{{ img.picW }}×{{ img.picH }}
              </div>
              <img
                :id="img.id"
                :src="imagesBaseUrl + img.picPath"
                @click="showAttr(img)"
              />
            </el-card>
          </li>
        </ul>
      </el-tab-pane>
    </el-tabs>
  </transition>
</template>
<script>
import { eventBus } from "@/common/eventBus";
import Search from "@/components/widget/HeaderSearch";

export default {
  data() {
    return {
      name: "ImageChoiceWidget",
      imgData: [],
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      preBtn: true,
      nextBtn: false,
      currentPage: 1,
      levelId: "",
      searchValue: "",
      total: "",
      pages: "",
      Imagestypes: [
        {
          id: "0",
          title: "所有"
        },
        {
          id: "1",
          title: "首页"
        },
        {
          id: "2",
          title: "分类"
        },
        {
          id: "3",
          title: "详情"
        },
        {
          id: "4",
          title: "活动"
        },
        {
          id: "5",
          title: "专题"
        },
        {
          id: "6",
          title: "其他"
        },
        {
          id: "7",
          title: "标签图"
        },
        {
          id: "8",
          title: "详情卡通图"
        }
      ]
    };
  },
  methods: {
    getSearch(keys) {
      this.currentPage = 1;
      this.searchValue = keys;
      this.getImages();
    },
    chageTab(tab) {
      this.preBtn = true;
      this.currentPage = 1;
      this.levelId = tab.index;
      this.getImages(tab);
    },
    lastPage() {
      if (this.currentPage == 1) {
        this.preBtn = true;
      } else {
        this.currentPage--;
        this.nextBtn = false;
      }
      this.getImages();
    },
    nextPage() {
      this.currentPage++;
      if (this.currentPage <= this.pages) {
        this.preBtn = false;
      } else {
        this.nextBtn = true;
      }
      this.getImages();
    },
    showAttr(item) {
      item["domainUrl"] = this.imagesBaseUrl;
      this.$emit("getSelectImage", item);
    },
    getImages(tab) {
      let formateData = {
        levelId: this.levelId,
        pageNum: this.currentPage,
        pageSize: 12,
        picCname: this.searchValue,
        temp: 0
      };
      if (this.levelId == 0) {
        delete formateData.levelId;
      }
      this.$store
        .dispatch("axios_get_pic_resouce", formateData)
        .then(rs => {
          this.imgData = rs.data.data.records;
          this.pages = rs.data.data.pages;
          if (this.pages <= 1) {
            this.nextBtn = true;
            this.preBtn = true;
          } else if (this.currentPage <= 1) {
            this.preBtn = true;
            if (this.pages >= 2) {
              this.nextBtn = false;
            }
          } else {
            this.nextBtn = false; 
          }
          if (this.currentPage > this.pages - 1) {
            this.nextBtn = true;
          }
        })
        .catch(err => {});
    }
  },
  mounted() {
    this.getImages();
  },
  components: { Search: Search }
};
</script>
<style lang='scss' scoped>
ul li img {
  width: 128px;
  height: 72px;
}
.selectImg {
  width: 100%;
  height: 400px;
  white-space: nowrap;
}
ul li {
  list-style-type: none;
  float: left;
  margin-left: 10px;
  margin-top: 10px;
}
.right-menu-item {
  float: left;
  width: 250px;
}
.press_btn {
  height: "50px";
  float: right;
}
</style>
