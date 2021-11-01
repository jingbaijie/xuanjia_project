<template>
  <div class="search" style="background: #fff">
    <v-header
      :searchVal="searchVal"
      @searchData="getSearchVal"
      placeholder="请输入关键字"
      @getContents="getContents"
    />
    <div class="serachPage">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          :offset="offset"
          :finished-text="text"
          @load="onLoad"
        >
          <div class="card" v-for="(item, index) in cartoonData" :key="index">
            <van-card
              @click="handelDetail(item.contentId, 1)"
              :title="item.contentName"
              :desc="item.tagCname"
              :thumb="formatPic(item.contentPic)"
            >
              <template #footer>
                {{ item.detailedDescription }}
              </template>
            </van-card>
            <div class="v-botton" v-if="item.cartoonSumvideonum <= 6">
              <van-button
                v-for="(v, index) in Number(item.cartoonSumvideonum)"
                :key="index"
                type="default"
                @click="handelDetail(item.contentId, index + 1)"
                >{{ v }}</van-button
              >
            </div>
            <div class="v-botton" v-else>
              <van-button
                type="default"
                @click="handelDetail(item.contentId, 1)"
                >1</van-button
              >
              <van-button
                type="default"
                @click="handelDetail(item.contentId, 2)"
                >2</van-button
              >
              <van-button
                type="default"
                @click="handelDetail(item.contentId, 3)"
                >3</van-button
              >
              <van-button type="default" @click="getAllBlues(item)"
                >···</van-button
              >
              <van-button
                type="default"
                @click="
                  handelDetail(item.contentId, item.cartoonSumvideonum - 1)
                "
                >{{ item.cartoonSumvideonum - 1 }}</van-button
              >
              <van-button
                type="default"
                @click="handelDetail(item.contentId, item.cartoonSumvideonum)"
                >{{ item.cartoonSumvideonum }}</van-button
              >
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <!-- 总集数弹窗 -->
    <van-popup
      v-model="show"
      closeable
      position="bottom"
      :style="{ height: '60%' }"
    >
      <div class="title">{{ contentName }}</div>
      <div class="all-botton">
        <van-button
          v-for="(n, index) in cartoonSumvideonum"
          :key="index"
          type="default"
          @click="handelDetail(cartoonId, index + 1)"
          >{{ n }}</van-button
        >
      </div>
    </van-popup>
    <!--底部-->
    <foot class="footer"></foot>
  </div>
</template>

<script>
import { getSearchContents } from "../../api/api";
import pic from "@/api/pic";
import header from "../components/header";
import foot from "../components/foot";
export default {
  name: "search",
  components: { "v-header": header, foot },
  data() {
    return {
      show: false,
      searchVal: "",
      keyValue: "",
      cartoonData: [],
      contentName: "",
      cartoonSumvideonum: "",
      cartoonId: "",
      offset: 300, //滚动条与底部距离小于 offset 时触发load事件，默认300
      pageNum: 1, // 当前页码
      pageSize: 10, // 分页大小
      total: 0, // 查询总条数
      loading: false, // 滚动加载中
      text: "",
      finished: false, // 滚动加载完成
      refreshing: false, // 下拉强制刷新
    };
  },
  created() {
    this.keyValue = this.$route.query && this.$route.query.val;
    this.searchVal = this.keyValue ? this.keyValue : "";
  },
  methods: {
    onLoad() {
      this.loading = true;
      setTimeout(() => {
        this.getContents();
      }, 1000);
    },
    onRefresh() {
      setTimeout(() => {
        this.getContents();
        this.refreshing = false;
      }, 1000);
    },
    /*图片地址*/
    formatPic(url) {
      return pic.formatPic(url);
    },
    getSearchVal(val) {
      this.searchVal = val;
      this.pageNum = 1;
      this.finished = false;
      // this.getContents();
    },
    getContents() {
      if (this.searchVal == undefined) {
        this.searchVal = "";
      }
      getSearchContents({
        searchValue: this.searchVal,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }).then((res) => {
        if (res.data.errorCode == "1000") {
          let arr = [];
          res.data.data.records.forEach((e) => {
            e.tagCname.forEach((v) => {
              arr.push(v.typeCname);
            });
            e.tagCname = arr.join(" · ");
          });
          if (this.pageNum == 1) {
            this.cartoonData = res.data.data.records;
          } else {
            res.data.data.records.forEach((item) => {
              this.cartoonData.push(item);
            });
          }
          if (res.data.data.records.length > 0) {
            this.pageNum++;
            this.loading = false;
          } else {
            this.finished = true;
          }
          if (this.cartoonData.length == 0) {
            this.text = "抱歉，没有找到相关视频！";
          } else {
            this.text = "没有更多了";
          }
          this.loading = false;
        }
      });
    },
    getAllBlues(data) {
      this.show = true;
      this.cartoonId = data.contentId;
      this.contentName = data.contentName;
      this.cartoonSumvideonum = Number(data.cartoonSumvideonum);
    },
    handelDetail(cartoonId, videoNumber) {
      if (videoNumber < 10) {
        videoNumber = "0" + videoNumber;
      }
      this.$router.push({
        path: "/videoDetails",
        query: { cartoonId, videoNumber },
      });
    },
  },
};
</script>

<style lang="less">
.search {
  .serachPage {
    width: 100%;
    margin-top: 89px;
    .card {
      width: 100%;
      height: 510px;
      background-color: #fff;
      .van-card {
        width: 100%;
        height: 400px;
        padding: 47px 30px 0 30px;
        background-color: #fff;
        .van-card__header {
          width: 100%;
          .van-card__thumb {
            width: 215px;
            height: 299px;
            .van-image {
              .van-image__error,
              .van-image__img,
              .van-image__loading {
                display: block;
                width: 215px;
                height: 299px;
              }
            }
          }
          .van-card__content {
            width: 100%;
            margin-left: 17px;
            .van-card__title {
              width: 100%;
              height: 40px;
              font-size: 30px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              color: #333333;
              line-height: 40px;
              margin-bottom: 26px;
              max-height: 40px;
            }
            .van-ellipsis {
              width: 100%;
              height: 40px;
              font-size: 26px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              color: #999999;
              line-height: 40px;
              max-height: 40px;
              margin-bottom: 20px;
            }
          }
        }
        .van-card__footer {
          text-align: left;
          width: 65%;
          height: 164px;
          font-size: 26px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #999999;
          line-height: 34px;
          margin: -170px 0 0 248px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 5; //限制行数
          -webkit-box-orient: vertical;
        }
      }
    }
  }
  .van-button--default {
    width: 103px;
    height: 105px;
    background: #f5f5f5;
    font-size: 30px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #333333;
    margin-right: 15px;
  }
  .v-botton {
    height: 105px;
    padding-left: 30px;
  }
  .all-botton {
    height: 85%;
    margin-top: 30px;
    padding-left: 30px;
    overflow: auto;
    .van-button--default {
      width: 116px;
      height: 113px;
      background: #f5f5f5;
      margin-bottom: 30px;
      margin-right: 27px;
      font-size: 34px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #333333;
      line-height: 34px;
    }
  }
  .van-icon-cross::before {
    font-size: 24px;
    font-weight: 500;
    color: #666666;
    line-height: 34px;
  }
  .van-popup__close-icon--top-right {
    top: 20px;
  }
  .title {
    width: 85%;
    height: 45px;
    font-size: 36px;
    font-family: Source Han Sans CN;
    font-weight: 500;
    color: #000000;
    line-height: 45px;
    margin: 39px 0 0 26px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .footer {
    margin-top: 15px;
  }
}
</style>