<template>
  <div class="header">
    <div class="mark" @click="goBack">
      <van-image :src="require('./../../images/logo.png')" />
    </div>
    <van-search
      v-model="searchKey"
      left-icon=""
      shape="round"
      background="#2d2d2e"
      :placeholder="placeholder"
      @search="toSearch"
    >
      <template #right-icon>
        <van-image
          class="searchIcon"
          :src="require('../../images/home/searchIcon.png')"
          @click="toSearch"
        ></van-image>
      </template>
    </van-search>
    <div class="photo">
      <img v-if="userIcon" @click="personalCenter" :src="userIcon" alt />
      <div v-else @click="login">登 录</div>
    </div>
  </div>
</template>

<script>
import { Search, Image as VanImage } from "vant";
import Cookie from "js-cookie"; //引入
const delay = (function () {
  let timer = 0;
  return function (callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();
export default {
  name: "headerSearch",
  components: {
    "van-search": Search,
    "van-image": VanImage,
  },
  props: {
    placeholder: {
      type: String,
      default: "请输入查询关键字",
    },
    searchVal: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      searchKey: this.searchVal,
      userIcon: Cookie.get("userIcon"),
    };
  },
  methods: {
    goBack() {
      this.$router.push("/home");
    },
    login() {
      this.$router.push("/login");
    },
    personalCenter() {
      if(!this.$route.params.active){
        this.$router.push({
          name: "personalCenter",
          params: {
            active: 1
          }
        })
      }    
    },
    toSearch() {
      this.$emit("getContents");
    },
  },
  watch: {
    searchKey() {
      // delay(() => {
      this.$emit("searchData", this.searchKey);
      // }, 800);
    },
  },
};
</script>

<style lang="less">
.header {
  width: 100%;
  height: 89px;
  background: #2d2d2e;
  display: flex;
  position: fixed;
  z-index: 999;
  top: 0;
  .van-field__control {
    margin: -5px 0 0 5px;
  }
  .mark {
    width: 30%;
    .van-image {
      width: 100%;
    }
    .van-image__error,
    .van-image__img,
    .van-image__loading {
      display: block;
      background: none;
      border-radius: 0;
      width: 129px;
      height: 62px;
      margin: 15px 70px 12px 31px;
    }
  }
  .photo {
    width: 15%;
    text-align: center;
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin: 20px 0 19px 0;
    }
    div {
      color: #fff;
      font-size: 25px;
      font-family: Source Han Sans CN;
      line-height: 89px;
    }
  }
  .van-search {
    width: 55%;
    padding: 15px 0 15px 15px;
    .searchIcon {
      width: 28px;
      height: 28px;
    }
    .van-cell {
      height: 60px;
      background: #f6f6f6;
      border-radius: 30px;
      font-size: 24px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #999999;
      line-height: 49px;
    }
  }

  .van-field__left-icon .van-icon,
  .van-field__right-icon .van-icon {
    position: absolute;
    right: 20px;
    top: 8px;
  }
}
</style>