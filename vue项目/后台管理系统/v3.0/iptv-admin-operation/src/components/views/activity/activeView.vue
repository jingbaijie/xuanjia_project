<template>
  <div class="theme_el">
    <img
      class="page_background_img"
      v-if="pageInfo.pageBigpicUrl"
      :src="imagesBaseUrl + pageInfo.pageBigpicUrl"
    />
    <div
      class="img_connect"
      v-recomDrag="item"
      :key="item.uid"
      v-for="item in imgArray"
      :id="item.uid"
      :style="{
        width: item.picW / 2 + 'px',
        height: item.picH / 2 + 'px',
        top: item.yValue / 2 + 'px',
        left: item.xValue / 2 + 'px'
      }"
    >
      <img
        v-if="item.checked"
        :src="item.url"
        class="recommends"
        :style="{ width: item.picW / 2 + 'px', height: item.picH / 2 + 'px' }"
      />
      <div :id="item.id" class="img_cover"></div>
    </div>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import { Message, Loading, Image } from "element-ui";

export default {
  name: "activeView",
  inject: ["getPageInfo", "getPageFocus"],
  directives: {
    recomDrag: {
      bind(el, binding) {
        el.style.cursor = "move";
        const sty = el.currentStyle || window.getComputedStyle(el, null);
        let pic = binding.value;
        el.onmousedown = e => {
          const disX = e.clientX - el.offsetLeft;
          const disY = e.clientY - el.offsetTop;
          document.onmousemove = function(e) {
            const l = e.clientX - disX;
            const t = e.clientY - disY;
            el.style.left = `${l}px`;
            el.style.top = `${t}px`;
            pic.xValue = l * 2;
            pic.yValue = t * 2;
          };
          document.onmouseup = function(e) {
            document.onmousemove = null;
            document.onmouseup = null;
          };
        };
      }
    }
  },
  data() {
    return {
      imgArray: [],
      pageInfo: {},
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL
    };
  },
  created() {},
  methods: {
    resetView() {
      this.imgArray = [];
      this.pageInfo = {};
    },
    findPicById(id) {
      let indexA;
      this.imgArray.forEach((item, index) => {
        item.id == id ? (indexA = index) : "";
      });
      return this.imgArray[indexA];
    },
    renderViewImg() {
      this.pageInfo = this.getPageInfo();
      this.pageInfo.fn.focus.forEach(f => {
        f.recomendPic.length > 0
          ? f.recomendPic.forEach(p => {
              this.imgArray.push(p);
            })
          : "";
        f.recomendLabelPic.length > 0
          ? f.recomendLabelPic.forEach(p => {
              this.imgArray.push(p);
            })
          : "";
        f.recommendShowPic.length > 0
          ? f.recommendShowPic.forEach(p => {
              this.imgArray.push(p);
            })
          : "";
      });
      if (this.pageInfo.fn.inputPhone) {
        this.imgArray.push(this.pageInfo.fn.inputPhone.tip);
        this.imgArray.push(this.pageInfo.fn.inputPhone.phone);
      }
      if (this.pageInfo.fn.list) {
        this.imgArray.push(this.pageInfo.fn.list);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.recommends {
  position: absolute;
}
.img_cover {
  filter: alpha(Opacity=80);
  -moz-opacity: 0.5;
  opacity: 0;
  z-index: 100;
  background-color: #ffffff;
  position: relative;
  height: 100%;
}

.img_connect {
  position: absolute;
  display: inline-block !important;
  display: inline;
}
img {
  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
}
.page_background_img {
  position: relative;
  width: 640px;
  height: 360px;
}
.theme_el {
  width: 640px;
  height: 360px;
  float: left;
  position: absolute;
  overflow: hidden;
  border-style: groove;
}
</style>
