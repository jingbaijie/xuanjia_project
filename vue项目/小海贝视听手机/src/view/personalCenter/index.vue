<template>
  <div>
    <v-header @searchData="onSearchData" @getContents="toSearch" placeholder="请输入关键字" />
    <van-card class="user-panel" :title="username" :thumb="defImg" />
    <van-tabs class="tab" v-model="active" @click-tab="onClickTab">
      <van-divider />
      <van-tab title="播放记录">
        <p class="cord-title" v-if="todayArr.length != 0">今天</p>
        <van-grid :column-num="3">
          <van-grid-item
            @click="handelDetail(item.contentId,item.videoNum)"
            v-for="item in todayArr"
            :key="item._id"
            icon="photo-o"
            text="文字"
          >
            <van-image :src="imagesBaseUrl + item.mediaPic" />
            <div class="grid-title">{{ item.mediaName }}</div>
          </van-grid-item>
        </van-grid>
        <p class="cord-title" v-if="weekArr.length != 0">一周</p>
        <van-grid :column-num="3">
          <van-grid-item
            @click="handelDetail(item.contentId, item.videoNum)"
            v-for="item in weekArr"
            :key="item._id"
            icon="photo-o"
            text="文字"
          >
            <van-image :src="imagesBaseUrl + item.mediaPic" />
            <div class="grid-title">{{ item.mediaName}}</div>
          </van-grid-item>
        </van-grid>
        <p class="cord-title" v-if="monthArr.length != 0">一月</p>
        <van-grid :column-num="3">
          <van-grid-item
            @click="handelDetail(item.contentId, item.videoNum)"
            v-for="item in monthArr"
            :key="item._id"
            icon="photo-o"
            text="文字"
          >
            <van-image :src="imagesBaseUrl + item.mediaPic" />
            <div class="grid-title">{{ item.mediaName }}</div>
          </van-grid-item>
        </van-grid>
      </van-tab>
      <van-tab title="个人设置">
        <div class="set">
          <van-field name="uploader" label="头像">
            <template #input>
              <van-uploader v-model="userImg" :max-count="1" :after-read="onSubmitUserImg" />
            </template>
          </van-field>
          <van-field v-model="userName" label="昵称" maxlength="16" @blur="onSubmitUserName" />
        </div>
        <van-button class="btn" round plain type="primary" @click="outLogin">退出登录</van-button>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import {
  userInfo,
  setUserName,
  setUserHeadortrait,
  userHistory
} from "@/api/api";
import header from "../components/header";
import defImg from "@/images/defaultAvatar.png";
import Cookie from "js-cookie"; //引入
export default {
  components: { "v-header": header },
  data() {
    return {
      val: "",
      active: 0,
      username: "",
      userName: "",
      userImg: [{ url: defImg }], //设置头像
      defImg: "", //头像
      userId: "",
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      monthArr: [],
      weekArr: [],
      todayArr: []
    };
  },
  mounted() {
    this.userId = Cookie.get("userId");
    this.getUserInfo();
    this.getUserHistory();
    this.active = this.$route.params.active;
  },

  methods: {
    onClickTab() {},
    handelDetail(cartoonId, videoNumber) {
      this.$router.push({
        path: "/videoDetails",
        query: { cartoonId, videoNumber }
      });
    },
    outLogin() {
       Cookie.remove("passWord");
      Cookie.remove("userIcon");
      this.$toast("退出成功");
      this.$router.push("/home");
    },

    onSearchData(val) {
      this.val = val;
    },
    toSearch() {
      this.$router.push({
        path: "/search",
        query: { val: this.val }
      });
    },
    getUserHistory() {
      userHistory({ userId: this.userId }).then(response => {
        if (response.data.errorCode == "1000") {
          let data = response.data.data.records;
          this.dataResort(data);
        }
      });
    },

    dataResort(arr) {
      let now = new Date();
      //今天
      let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      //明天
      let tomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );
      //近一周
      let week = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      //近一月
      let month = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 30
      );
      arr.forEach((item, i) => {
        let _item = new Date(item.createDay);
        //判断近一个月
        if (_item >= month && _item < week) {
          this.monthArr.push(item);
        } else if (_item >= week && _item < today) {
          this.weekArr.push(item);
        } else if (_item > today && _item < tomorrow) {
          this.todayArr.push(item);
        } else {
          console.log("其他");
        }
      });
    },
    getUserInfo() {
      userInfo({
        userId: this.userId
      }).then(response => {
        if (response.data.errorCode == "1000") {
          this.username = response.data.data.userName;
          this.userName = response.data.data.userName;
          this.defImg = this.imagesBaseUrl + response.data.data.userIcon;
          this.userImg = [{ url: this.defImg }];
          Cookie.set(
            "userIcon",
            this.imagesBaseUrl + response.data.data.userIcon,
            { expires: 7 }
          );
        }
      });
    },
    onSubmitUserImg(file) {
      let formData = new FormData();
      formData.append("file", file.file);
      formData.append("userId", this.userId);
      setUserHeadortrait(formData).then(response => {
        if (response.data.errorCode == "1000") {
          this.$toast.success(response.data.errorMsg);
          this.username = this.userName;
          this.getUserInfo();
        } else {
          this.$toast.fail(response.data.errorMsg);
        }
      });
    },
    onSubmitUserName() {
      setUserName({
        userId: this.userId,
        userName: this.userName
      }).then(response => {
        if (response.data.errorCode == "1000") {
          this.$toast.success(response.data.errorMsg);
          this.username = this.userName;
        } else {
          this.$toast.fail(response.data.errorMsg);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped >
.grid-title {
  padding-top: 30px;
  width: 194px;
  height: 76px;
  font-size: 26px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #333333;
  line-height: 38px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.set {
  position: absolute;
  left: 37px;
  width: 690px;
  height: 253px;
  background: #ffffff;
  box-shadow: 0px 6px 16px 0px rgba(10, 13, 47, 0.11);
  border-radius: 10px;
  /deep/ .van-cell,
  .van-cell__value {
    padding: 0;
    left: 30px;
  }
}

.set /deep/ .van-image__img {
  position: absolute;
  //   right: 90px;
  top: 28px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
}

.user-panel {
  margin: 0px;
  position: absolute;
  top: 89px;
  width: 750px;
  height: 196px;
  background-color: #fff;
}
/deep/ .van-card__thumb {
  position: absolute;
  left: 30px;
  top: 41px;
  padding: 0px;
  margin: 0px;
  width: 128px;
  height: 128px;
}

.user-panel/deep/ .van-card__title {
  position: absolute;
  left: 189px;
  top: 79px;
  width: 240px;
  height: 100px;
  font-size: 30px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #333333;
}
.tab {
  position: absolute;
  left: 0;
  width: 100%;
  top: 301px;

  background-color: #fff;
  /deep/ .van-tabs__content {
    height: 900px;
  }
  /deep/ .van-tabs__line {
    background-color: #fff;
  }
  /deep/ .van-tab--active .van-tab__text {
    color: #22b3c8;
    font-size: 30px;
  }
}
.tab /deep/ .van-tabs__nav--line {
  box-sizing: content-box;
  height: 100%;
  padding-bottom: 15px;
}
.tab /deep/ .van-tabs__nav {
  position: relative;
  display: flex;
  background-color: var(--van-tabs-nav-background-color);
  -webkit-user-select: none;
  user-select: none;
  font-size: 30px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #333333;
}
.tab /deep/ .van-tab {
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 0 var(--van-padding-base);
  color: var(--van-tab-text-color);
  font-size: var(--van-tab-font-size);
  line-height: var(--van-tab-line-height);
  cursor: pointer;
}
.btn {
  top: 360px;
  left: 196px;
  width: 360px;
  height: 80px;
}
/deep/ .van-field {
  height: 125px;
  line-height: 125px;
  .van-field__label {
    text-align: center;
  }
}

.cord-title {
  //   float: left;
  position: relative;
  left: 31px;
  //   width: 55px;
  height: 27px;
  font-size: 28px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #666666;
  line-height: 32px;
}
/deep/ .van-grid .van-image {
  height: 300px;
}
[class*="van-hairline"]::after {
  border: 0;
}
/deep/ .van-uploader__upload {
  height: 105px;
  width: 135px;
  margin: 10px;
}
</style>
