<template>
  <div class="contentAll" style="background: #fff">
    <v-header @searchData="getSearchVal" @getContents="toSearch" placeholder="请输入关键字" />
    <!-- 标签 -->
    <van-tabs @click="tabClick" v-model="typeId">
      <van-tab
        v-for="(item, index) in tabData"
        :name="item.id"
        :title="item.typeCname"
        :key="index"
      />
    </van-tabs>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        :offset="offset"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <!-- 内容 -->
        <van-grid :column-num="3">
          <van-grid-item
            @click="handelDetail(item.contentId, '01')"
            v-for="(item, index) in contentData"
            :key="index"
            style="flex-basis: 33%"
          >
            <van-image
              :src="formatPic(item.iconPic ? item.iconPic.picPath : '')"
            />
            <div class="desc1">{{ item.contentCname }}</div>
            <div class="desc2">{{ item.more4 }}</div>
          </van-grid-item>
        </van-grid>
      </van-list>
    </van-pull-refresh>
    <!--底部-->
    <foot class="footer"></foot>
  </div>
</template>


<script>
import header from "../components/header";
import foot from "../components/foot";
import { getTypesByParentId, getContentsByTypeId } from "../../api/api";
import pic from "@/api/pic";
export default {
  name: "contentAll",
  components: { "v-header": header, foot },
  data() {
    return {
      tabData: [],
      contentData: [],
      typeId: "",
      val: "",
      offset: 300, //滚动条与底部距离小于 offset 时触发load事件，默认300
      pageNum: 1, // 当前页码
      pageSize: 9, // 分页大小
      total: 0, // 查询总条数
      loading: false, // 滚动加载中
      finished: false, // 滚动加载完成
      refreshing: false, // 下拉强制刷新
    };
  },
  created() {
    const id = this.$route.query && this.$route.query.typeId;
    this.typeId = Number(id);
    this.getTypes();
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
        this.pageNum = 1;
        this.getContents();
        this.refreshing = false;
      }, 1000);
    },
    getSearchVal(val) {
      this.val = val;
    },
    toSearch(){
      this.$router.push({
        path: "/search",
        query: { "val": this.val },
      });
    },
    /*图片地址*/
    formatPic(url) {
      return pic.formatPic(url);
    },
    tabClick(id) {
      this.typeId = id;
      this.pageNum = 1;
      this.finished = false;
      window.scrollTo(0, 0);
      this.getContents();
    },
    getTypes() {
      getTypesByParentId({
        parentId: 1,
      })
        .then((res) => {
          if (res.data.errorCode == 1000) {
            this.tabData = res.data.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getContents() {
      getContentsByTypeId({
        typeId: this.typeId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      })
        .then((res) => {
          if (res.data.errorCode == "1000") {
            if (this.pageNum == 1) {
              this.contentData = res.data.data.records;
            } else {
              res.data.data.records.forEach((item) => {
                this.contentData.push(item);
              });
            }
            if (res.data.data.records.length > 0) {
              this.pageNum++;
              this.loading = false;
            } else {
              this.finished = true;
            }
            this.loading = false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handelDetail(cartoonId, videoNumber) {
      this.$router.push({
        path: "/videoDetails",
        query: { cartoonId, videoNumber },
      });
    },
  },
};
</script>

<style lang="less">
.contentAll {
  .van-tabs {
    width: 100%;
    position: fixed;
    z-index: 999;
    top: 89px;
  }
  .van-tabs--line .van-tabs__wrap {
    height: 130px;
  }
  .van-tabs__wrap--scrollable .van-tab {
    margin-right: 50px;
    font-size: 30px;
    color: #333;
    padding: 0;
    font-family: Source Han Sans CN;
  }
  .van-tabs__nav--line.van-tabs__nav--complete {
    padding-left: 30px;
  }
  .van-tabs__nav--line {
    padding-bottom: 0;
  }
  .van-tabs__line {
    position: absolute;
    bottom: 18px;
    left: 0;
    z-index: 1;
    width: 28px;
    height: 8px;
    background: #00babe;
    border-radius: 4px;
  }
  .van-tab--active {
    font-weight: bold;
    font-size: 36px !important;
  }
  .van-grid {
    padding: 0 10px 0 15px;
    margin-top: 218px;
    .van-grid-item {
      height: 440px;
      .van-grid-item__content {
        padding: 0;
        .van-image,
        .van-image__error,
        .van-image__img,
        .van-image__loading {
          display: block;
          width: 215px;
          height: 299px;
          background: #e8e8e8;
          border-radius: 8px;
        }
      }
    }
  }

  .desc1 {
    width: 215px;
    height: 40px;
    font-size: 24px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #333333;
    line-height: 40px;
    margin: 18px 0 15px 0;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .desc2 {
    width: 215px;
    height: 40px;
    font-size: 22px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #999999;
    line-height: 40px;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  [class*="van-hairline"]::after {
    border: none;
  }
  .footer {
    margin-top: 15px;
  }
}
</style>