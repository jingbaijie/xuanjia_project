<template>
  <div>
    <el-card class="box-card" :style="{'overflow-y':'auto'}">
      <div slot="header" class="clearfix">
        <span>新建推荐详情</span>
        <el-button
          style="float:right; padding: 11px;border-left:1px solid #eee"
          type="text"
          @click="onSubmit()"
        >提 交</el-button>
      </div>
      <el-form :model="form" :rules="rules" style="max-height:600px;overflow-y:auto">
        <el-form-item label="归属推荐类型" :label-width="formLabelWidth">
          <el-select
            v-model="curType"
            filterable
            allow-create
            default-first-option
            @change="selectType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in typeIds"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="排行" :label-width="formLabelWidth">
          <el-input v-model="form.rank" autocomplete="off"></el-input>
        </el-form-item>-->
        <el-form-item label="跳转地址类型" :label-width="formLabelWidth">
          <el-select
            v-model="form.recommendDisplayType"
            @change="selectRecomType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in recommendDisplayTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="'跳转'+recommendName+'名称'" :label-width="formLabelWidth">
          <el-select
            v-if=" form.recommendDisplayType != 8 && form.recommendDisplayType!=3&& form.recommendDisplayType!=7&& form.recommendDisplayType!=88"
            v-selectScroll="loadScrollData"
            :filter-method="bySearchValue"
            v-model="form.recommendDisplayValue"
            placeholder="请选择"
            filterable
            @change="val=>getLabel(val,recommendDisplayNames)"
          >
            <el-option
              v-for="(item,index) in recommendDisplayNames"
              :key="index"
              :label="item.recommendDisplayName"
              :value="item.recommendDisplayValue"
            ></el-option>
          </el-select>
          <el-input
            v-if=" form.recommendDisplayType==3 || form.recommendDisplayType==8|| form.recommendDisplayType==88"
            v-model.trim="form.recommendDisplayValue"
            autocomplete="off"
          ></el-input>
          <el-cascader
            v-if="form.recommendDisplayType == 7"
            v-model="form.recommendDisplayValue"
            placeholder="搜索"
            :options="classifyData"
            :props="defaultProps"
            size="medium"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="埋点名" :label-width="formLabelWidth">
          <el-input v-model="form.recommendTrackName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否免费" :label-width="formLabelWidth">
          <el-switch
            v-model="form.isFree"
            :active-value="0"
            :inactive-value="1"
            @change="changeIsFree()"
          ></el-switch>
        </el-form-item>
        <el-form-item label="为默认焦点" :label-width="formLabelWidth">
          <el-switch
            v-model="form.onfocus"
            :active-value="0"
            :inactive-value="1"
            @change="changeOnFocus()"
          ></el-switch>
        </el-form-item>
        <el-form-item label="动画" :label-width="formLabelWidth">
          <el-input v-model="form.animation" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="more1" :label-width="formLabelWidth">
          <el-input v-model="form.more1" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="more2" :label-width="formLabelWidth">
          <el-input v-model="form.more2" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="more3" :label-width="formLabelWidth">
          <el-input v-model="form.more3" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="more4" :label-width="formLabelWidth">
          <el-input v-model="form.more4" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="推荐图片" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            action
            :file-list="form.recomList"
            :on-remove="removeRecome"
            list-type="picture"
          >
            <el-popover
              slot="tip"
              placement="right"
              width="535"
              trigger="hover"
              v-model="dialogFormVisible"
            >
              <el-button slot="reference" size="small" type="primary" plain>添 加</el-button>
              <transition name="fade-transform" mode="out-in">
                <div class="balnce">
                  <image_choice @getSelectImage="img => recomUploadSuccess(img)"></image_choice>
                </div>
              </transition>
            </el-popover>
          </el-upload>
        </el-form-item>
        <el-form-item label="标签图片" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            action
            :file-list="form.labelList"
            :on-remove="removeLabel"
            list-type="picture"
          >
            <el-popover
              slot="tip"
              placement="right"
              width="535"
              trigger="hover"
              v-model="dialogFormVisible2"
            >
              <el-button slot="reference" size="small" type="primary" plain>添 加</el-button>
              <transition name="fade-transform" mode="out-in">
                <div class="balnce">
                  <image_choice @getSelectImage="img => labelUploadSuccess(img)"></image_choice>
                </div>
              </transition>
            </el-popover>
          </el-upload>
        </el-form-item>
        <el-form-item label="角标图片" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            action
            :file-list="form.cornerList"
            :on-remove="removeCorner"
            list-type="picture"
          >
            <el-popover
              slot="tip"
              placement="right"
              width="535"
              trigger="hover"
              v-model="dialogFormVisible5"
            >
              <el-button slot="reference" size="small" type="primary" plain>添 加</el-button>
              <transition name="fade-transform" mode="out-in">
                <div class="balnce">
                  <image_choice @getSelectImage="img => cornerUploadSuccess(img)"></image_choice>
                </div>
              </transition>
            </el-popover>
          </el-upload>
        </el-form-item>
        <el-form-item label="显示图片" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            action
            :on-remove="removeShow"
            :file-list="form.showList"
            list-type="picture"
          >
            <el-popover
              slot="tip"
              placement="right"
              width="535"
              trigger="hover"
              v-model="dialogFormVisible3"
            >
              <el-button slot="reference" size="small" type="primary" plain>添 加</el-button>
              <transition name="fade-transform" mode="out-in">
                <div class="balnce">
                  <image_choice @getSelectImage="img => showUploadSuccess(img)"></image_choice>
                </div>
              </transition>
            </el-popover>
          </el-upload>
        </el-form-item>
        <el-form-item label="显示图片" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            action
            :on-remove="removeHide"
            :file-list="form.hideList"
            list-type="picture"
          >
            <el-popover
              slot="tip"
              placement="right"
              width="535"
              trigger="hover"
              v-model="dialogFormVisible4"
            >
              <el-button slot="reference" size="small" type="primary" plain>添 加</el-button>
              <transition name="fade-transform" mode="out-in">
                <div class="balnce">
                  <image_choice @getSelectImage="img => hideUploadSuccess(img)"></image_choice>
                </div>
              </transition>
            </el-popover>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import image_choice from "@/components/widget/ImageChoiceWidget";
import { eventBus } from "@/common/eventBus";
export default {
  name: "recomConfigDetail",
  props: ["actionType"],
  inject: ["getRecomList", "getDetailAction", "setDetailAction"],
  data() {
    return {
      preBtn: true,
      nextBtn: false,
      pageTotle: 0,
      currentPage: 1,
      classifyData: [],
      curType: "",
      recomType: "",
      recomName: "",
      contentInfo: "",
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      dialogFormVisible4: false,
      dialogFormVisible5: false,
      imgData: [],
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      head: {
        "x-a-t": localStorage.getItem("token")
      },
      defaultProps: {
        children: "childrenList",
        label: "typeCname",
        value: "id",
        checkStrictly: true,
        emitPath: false
      },
      typeIds: [
        { value: "1", label: "通用专题正文推荐" },
        { value: "2", label: "通用专题退出推荐" },
        { value: "3", label: "通用专题其他推荐" },
        { value: "4", label: "通用专题上/左拉推荐" },
        { value: "5", label: "通用专题下/右他推荐" }
      ],
      recommendDisplayNames: [],
      // 推荐详表显示的类型 0 游戏 ，1 卡通， 2视频 ，3 跳转指定地址 ，4 通用页面id ，5 活动id ，6专题 ，7分类内容 ，8卡通需要鉴权，88其它
      recommendDisplayTypes: [
        {
          value: "0",
          label: "游戏"
        },
        {
          value: "1",
          label: "卡通"
        },
        {
          value: "2",
          label: "视频"
        },
        {
          value: "3",
          label: "跳转指定地址"
        },
        {
          value: "4",
          label: "通用页面"
        },
        {
          value: "5",
          label: "活动"
        },
        {
          value: "6",
          label: "专题"
        },
        {
          value: "7",
          label: "分类内容"
        },
        {
          value: "8",
          label: "卡通需要鉴权"
        },
        {
          value: "88",
          label: "其他"
        }
      ],
      form: {
        typeId: {
          value: "",
          label: ""
        },
        rank: "",
        recommendDisplayType: "",
        recommendDisplayName: "",
        recommendDisplayValue: "",
        recommendTrackName: "",
        animation: "",
        onfocus: 1,
        isFree: 1,
        movetop: "",
        movedown: "",
        moveleft: "",
        moveright: "",
        more1: "",
        more2: "",
        more3: "",
        more4: "",
        recomList: [],
        labelList: [],
        showList: [],
        cornerList: [],
        hideList: []
      },
      formLabelWidth: "125px",
      action: "",
      recommendName: "",
      dialogImageUrl: "",
      dialogVisible: false,
      rules: {},
      countPage: 1
    };
  },
  components: { image_choice },
  methods: {
    getLabel(val, data) {
      let obj = {};
      obj = data.find(item => {
        return item.recommendDisplayValue === val;
      });
      this.form.recommendDisplayName = obj.recommendDisplayName;
    },
    loadScrollData2(scrollDown) {
      if (scrollDown) {
        if (this.countPage >= this.currentPage) {
          this.$store
            .dispatch("axios_get_contentInfo", {
              contentType: this.form.recommendDisplayType,
              pageNum: ++this.currentPage,
              searchValue: this.searchValues
            })
            .then(res => {
              if (res != "undefined") {
                this.recommendDisplayPage = this.recommendDisplayPage.concat(
                  res.data.data.records
                );
              }
            });
        }
      }
    },
    lastPage() {
      if (this.currentPage == 1) {
        this.preBtn = true;
      } else {
        this.currentPage--;
        this.preBtn = false;
      }
      this.getImages();
    },
    nextPage() {
      this.currentPage++;
      if (this.currentPage == 1) {
        this.preBtn = true;
      } else {
        this.preBtn = false;
      }
      this.getImages();
    },
    chageTab(tab) {
      this.preBtn = true;
      this.currentPage = 1;
      this.levelId = tab.index;
      this.getImages(tab);
    },
    getClassifyList() {
      this.$store
        .dispatch("axios_get_classify")
        .then(res => {
          if (res != "undefined") {
            this.classifyData = this.filterData(res.data.data);
          }
        })
        .catch(err => {});
    },
    filterData(d) {
      d.forEach(element => {
        if (element.childrenList.length > 0) {
          element.childrenList.forEach(i => {
            if (i.childrenList.length > 0) {
              i.childrenList.forEach(x => {
                if (x.childrenList.length > 0) {
                  x.childrenList.forEach(y => {
                    delete y.childrenList;
                  });
                } else {
                  delete x.childrenList;
                }
              });
            } else {
              delete i.childrenList;
            }
          });
        } else {
          delete element.childrenList;
        }
      });
      return d;
    },
    bySearchValue(val) {
      this.currentPage = 1;
      this.searchValues = val;
      this.getContentInfo();
    },
    loadScrollData(scrollDown) {
      console.log(this.currentPage);
      if (scrollDown) {
        if (this.countPage >= this.currentPage) {
          this.$store
            .dispatch("axios_get_contentInfo", {
              contentType: this.form.recommendDisplayType,
              pageNum: ++this.currentPage,
              searchValue: this.searchValues
            })
            .then(res => {
              if (res != "undefined") {
                this.recommendDisplayNames = this.recommendDisplayNames.concat(
                  res.data.data.records
                );
              }
            });
        }
      }
    },
    getContentInfo() {
      this.$store
        .dispatch("axios_get_contentInfo", {
          contentType: this.form.recommendDisplayType,
          pageNum: this.currentPage,
          searchValue: this.searchValues
        })
        .then(rs => {
          this.countPage = rs.data.data.pages;
          this.recommendDisplayNames = rs.data.data.records;
        })
        .catch(err => {});
    },
    changeIsFree() {},
    changeOnFocus() {},
    getImages(tab) {
      let formateData = {
        levelId: this.levelId,
        pageNum: this.currentPage,
        pageSize: 12,
        temp: 0
      };
      if (this.levelId == 0) {
        delete formateData.levelId;
      }
      this.$store
        .dispatch("axios_get_pic_resouce", formateData)
        .then(rs => {
          this.imgData = rs.data.data.records;
        })
        .catch(err => {});
    },
    selectType(val) {
      let obj = {};
      obj = this.typeIds.find(item => {
        return item.value === val;
      });
      this.form.typeId = obj;
    },
    selectRecomType(val, rv) {
      this.currentPage = 1;
      this.countPage = 1;
      this.form.recommendDisplayValue = rv ? rv : "";
      this.searchValues = "";
      this.getContentInfo();

      this.recommendDisplayTypes.forEach((item, index) => {
        if (item.value == val) {
          if (val == 3) {
            this.recommendName = "";
          } else {
            this.recommendName = item.label;
          }
        }
      });
    },
    removeRecome(f, fl) {
      this.form.recomList.forEach((item, index) => {
        if (item.id == f.id) {
          this.form.recomList.splice(index, 1);
          eventBus.$emit("removeRecom", item);
          // this.setDetailAction('add');
        }
      });
    },
    removeLabel(f, fl) {
      this.form.labelList.forEach((item, index) => {
        if (item.id == f.id) {
          this.form.labelList.splice(index, 1);
          eventBus.$emit("removeRecom", item);
          // this.setDetailAction('add');
        }
      });
    },
    removeCorner(f, fl) {
      this.form.cornerList.forEach((item, index) => {
        if (item.id == f.id) {
          this.form.cornerList.splice(index, 1);
          eventBus.$emit("removeRecom", item);
          // this.setDetailAction('add');
        }
      });
    },
    removeShow(f, fl) {
      this.form.showList.forEach((item, index) => {
        if (item.id == f.id) {
          this.form.showList.splice(index, 1);
          eventBus.$emit("removeRecom", item);
          // this.setDetailAction('add');
        }
      });
    },
    removeHide(f, fl) {
      this.form.hideList.forEach((item, index) => {
        if (item.id == f.id) {
          this.form.hideList.splice(index, 1);
          eventBus.$emit("removeRecom", item);
          // this.setDetailAction('add');
        }
      });
    },
    recomUploadSuccess(file) {
      file.name = file.picCname;
      file.url = this.imagesBaseUrl + file.picPath;
      file.picId = file.id;
      file.picType = "0";
      this.form.recomList.push(file);
    },
    labelUploadSuccess(file) {
      file.name = file.picCname;
      file.url = this.imagesBaseUrl + file.picPath;
      file.picId = file.id;
      file.picType = "1";
      this.form.labelList.push(file);
    },
    cornerUploadSuccess(file) {
      file.name = file.picCname;
      file.url = this.imagesBaseUrl + file.picPath;
      file.picId = file.id;
      file.picType = "4";
      this.form.cornerList.push(file);
    },
    showUploadSuccess(file) {
      file.name = file.picCname;
      file.url = this.imagesBaseUrl + file.picPath;
      file.picId = file.id;
      file.picType = "2";
      this.form.showList.push(file);
    },
    hideUploadSuccess(file) {
      file.name = file.picCname;
      file.url = this.imagesBaseUrl + file.picPath;
      file.picId = file.id;
      file.picType = "3";
      this.form.hideList.push(file);
      console.log(this.form.hideList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    onSubmit() {
      if (this.actionType == "edit" && this.getDetailAction() == "edit") {
        this.setDetailAction("add");
        this.form.index = this.editIndex;
        this.$store.commit("recommendList_update", this.form);
        eventBus.$emit("goRecomeList", {
          page: "recomConfigList",
          data: this.form
        });
      } else {
        eventBus.$emit("goRecomeList", {
          page: "recomConfigList",
          data: this.form
        });
        this.$store.commit("recommendList_setter", this.form);
      }
    }
  },
  created() {
    this.getImages();
    if (this.actionType == "edit" && this.getDetailAction() == "edit") {
      let editData = this.getRecomList();
      this.curType = editData.data.typeId.value;
      this.form = editData.data;
      console.log(editData.data);
      this.form.recommendDisplayType = editData.data.recommendDisplayType + "";
      if (
        this.form.recommendDisplayType != 8 &&
        this.form.recommendDisplayType != 3
      ) {
        this.form.recommendDisplayValue = parseInt(
          editData.data.recommendDisplayValue
        );
      } else {
        this.form.recommendDisplayValue = editData.data.recommendDisplayValue;
      }

      this.selectRecomType(
        editData.data.recommendDisplayType,
        editData.data.recommendDisplayValue
      );
      this.editIndex = editData.index;
    }
  },
  mounted() {
    this.getClassifyList();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-input {
  width: 80%;
}
img {
  width: 128px;
  height: 72px;
}
.selectImg {
  width: 100%;
  height: 400px;
  white-space: nowrap;
}
.balnce ul li {
  list-style-type: none;
  float: left;
  margin-left: 10px;
  margin-top: 10px;
}
</style>

<style>
.box-card {
  height: 80vh;
}

.avatar-uploader {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.el-upload--picture-card {
  width: 70px;
  height: 70px;
  line-height: 70px;
}
</style>
