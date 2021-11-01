<template>
  <div>
    <div class="img_list">
      <el-tabs
        v-if="isAuth('system:pic:list')"
        type="border-card"
        @tab-click="
          tab => {
            nodeClick(1, pageSize, tab);
          }
        "
      >
        <el-tab-pane
          :key="type.id"
          v-for="type in Imagestypes"
          class="prize_pic"
          :label="type.title"
        >
          <div style="btn_tab">
            <el-button
              v-if="isAuth('system:pic:update')"
              type="primary"
              @click="upLoadImage"
              plain
              icon="el-icon-upload"
              size="small"
              :style="{ 'margin-left': '20px' }"
              >上传图片</el-button
            >
            <el-button
              v-if="isAuth('system:pic:delete')"
              type="danger"
              @click="deleteImage(curImgIndex)"
              plain
              icon="el-icon-delete"
              size="small"
              :style="{ 'margin-left': '20px' }"
              >刪除图片</el-button
            >
            <el-input
              class="searchInput"
              style
              placeholder="通过名称或者MD5搜索图片"
              v-model="searchValue"
            ></el-input>
          </div>
          <ul class="selectImg">
            <el-radio-group v-model="curImgIndex">
              <li :key="img.id" v-for="img in imgData">
                <el-card
                  :body-style="{ padding: '8px', cursor: 'pointer' }"
                  shadow="hover"
                >
                  <img
                    :id="img.id"
                    :src="imagesBaseUrl + img.picPath"
                    @click="showDetail(img)"
                  />
                  <div style="padding: 14px;">
                    <el-radio
                      :label="img.id"
                      :change="selectImg"
                      :style="{ 'margin-right': '0' }"
                      >{{ beautySub(img.picCname, 4) }}</el-radio
                    >
                  </div>
                </el-card>
              </li>
            </el-radio-group>
          </ul>
        </el-tab-pane>
      </el-tabs>
    </div>
    <imageDetail :imagesBaseUrl="imagesBaseUrl"></imageDetail>
    <imageUpLoad></imageUpLoad>
    <div v-if="!isAuth('system:pic:list')" class="msg">暂无权限</div>
    <pagination
      v-if="isAuth('system:pic:list')"
      v-show="total > 0"
      :total="total"
      :page.sync="currentPage"
      :limit.sync="pageSize"
      @pagination="getImages"
    />
  </div>
</template>

<script>
import { Message, Loading } from "element-ui";
import { eventBus } from "@/common/eventBus";
import imageDetail from "./imageDetail";
import imageUpLoad from "./imageUpLoad";
import Pagination from "@/components/widget/Pagination";
// 节流函数
const delay = (function() {
  let timer = 0;
  return function(callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();

export default {
  name: "imageList",
  inject: ["getMenuId"],
  components: {
    imageDetail,
    imageUpLoad,
    Pagination
  },
  data() {
    return {
      searchValue: "",
      menuId: this.getMenuId(),
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      currentPage: 1, //分页当前页码
      pageSize: 20,
      total: 1,
      userData: [],
      search: "",
      imgData: [],
      curImgIndex: "",
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
  created() {
    this.getImages(this.currentPage, this.pageSize, { index: 0 });
    eventBus.$on("refreshImageList", type => {
      this.getImages(this.currentPage, this.pageSize, { index: type });
    });
  },
  watch: {
    searchValue() {
      delay(() => {
        this.getImages();
      }, 300);
    }
  },
  methods: {
    nodeClick(curpage, pageSize, tab) {
      this.currentPage = curpage;
      this.getImages(curpage, pageSize, tab);
    },
    upLoadImage() {
      eventBus.$emit("showUpLoad");
    },
    showDetail(img) {
      eventBus.$emit("showDetail", img);
    },
    selectImg(value) {},
    beautySub(str, len) {
      if (typeof str == "string") {
        let reg = /[\u4e00-\u9fa5]/g,
          slice = str.substring(0, len),
          chineseCharNum = ~~(slice.match(reg) && slice.match(reg).length),
          realen = slice.length * 2 - chineseCharNum;
        return str.substr(0, realen) + (realen < str.length ? "..." : "");
      }
    },
    getImages(currentPage, pageSize, tab) {
      if (tab) {
        this.levelId = tab.index;
      }
      let formatdata = {
        levelId: this.levelId,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        picCname: this.searchValue
      };
      if (this.levelId == 0) {
        delete formatdata.levelId;
      }
      this.$store
        .dispatch("axios_get_pic_resouce", formatdata)
        .then(rs => {
          this.imgData = rs.data.data.records;
          this.total = rs.data.data.total;
        })
        .catch(err => {});
    },
    deleteImage(id) {
      if (!id) {
        Message({ message: "请选择图片", type: "error" });
        return;
      }
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("axios_del_images", {
              contentId: id
            })
            .then(rs => {
              this.getImages(this.currentPage, this.pageSize, {
                index: this.levelId
              });
              Message({ message: rs.data.errorMsg, type: "success" });
            })
            .catch(err => {
              Message({ message: err.data.errorMsg, type: "error" });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>

<style lang='scss' scoped>
.btn_tab {
  width: 100%;
  height: 100px;
}
.bottom {
  margin-top: 13px;
  line-height: 12px;
  text-align: center;
}
.button {
  padding: 10px;
}
.el-input--mini .el-input__inner {
  width: 100px;
}

.flagImage {
  width: 50px;
}
ul li img {
  width: 128px;
  height: 72px;
}
.selectImg {
  margin: 0 auto;
  width: 100%;
  height: 60vh;
  overflow-y: scroll;
  white-space: nowrap;
}
.prize_pic ul li {
  list-style-type: none;
  float: left;
  margin-left: 20px;
  margin-top: 20px;
}
.block {
  display: inline-block;
}
.searchInput {
  width: 200px;
  float: left;
  border-radius: 30px;
  // border: 1px solid #e3e3e3;
}
// /deep/ .el-input__inner{
//   border-radius: 15px;
// }
</style>
