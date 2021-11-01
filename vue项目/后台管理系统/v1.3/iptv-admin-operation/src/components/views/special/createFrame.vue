<template>
  <div class="theme_activ">
    <div class="theme">
      <div class="theme_el">
        <img
          v-if="imgurl"
          :src="imgurl"
          :style="{ position: 'relative', width: '640px', height: '360px' }"
        />
        <div
          :key="'columnOne' + item.id"
          v-for="item in imgArray"
          :id="item.id"
          v-recomDrag="item.id"
          :style="{
            position: 'absolute',
            top: item.top + 'px',
            left: item.left + 'px',
            display: 'inline-block !important',
            display: 'inline',
            width: item.width,
            height: item.height
          }"
        >
          <img
            :src="item.imgurl"
            class="recommends"
            :style="{ width: item.width, height: item.height }"
          />
          <div :id="item.id" class="img_cover"></div>
        </div>
      </div>
      <div style="height:100px;border-bottom: 2px dashed #eee;">
        <div class="dialog-footer">
          <el-button type="success" size="small" plain @click="goBack">返 回</el-button>
        </div>
        <div class="dialog-footer">
          <el-button type="warning" size="small" plain @click="publishTemplate">保 存</el-button>
        </div>
        <div class="dialog-footer">
          <el-button type="danger" size="small" plain @click="checkTemplate">创建专项链接</el-button>
        </div>
      </div>
    </div>
    <div class="theme_info">
      <el-form label-position="left">
        <!-- <el-button
          @click="goBack"
          type="text"
          icon="el-icon-arrow-left"
          :style="{ color: '#409EFF' }"
        >上一页</el-button>-->
        <el-form-item
          label="专题信息"
          style="margin-top:20px;margin-left:20px; text-align:center"
          :label-width="formLabelWidth"
        >
          <el-button
            type="primary"
            @click="resetForm('templateThemeInfo')"
            v-if="!activname"
            plain
          >新 建</el-button>
        </el-form-item>
        <el-form-item
          :label="activname"
          style="color:#409EFF;margin-top:20px;margin-left:20px;border-bottom: 2px dashed #eee; height:100px;text-align:center"
          :label-width="formLabelWidth"
        >
          <el-button
            v-if="activname"
            type="primary"
            plain
            @click="resetForm('templateThemeInfo')"
          >编辑</el-button>
        </el-form-item>
        <el-form-item
          label="推荐详情列表"
          style="margin-top:20px;margin-left:20px;text-align:center"
          :label-width="formLabelWidth"
        >
          <el-button type="primary" @click="resetForm('recomConfigList')" plain>编 辑</el-button>
        </el-form-item>
        <el-form-item
          style="margin-top:20px;margin-left:20px;"
          v-for="item in newSubmitData.recommendInfo"
          :key="'columnTwo' + item.typeId"
          :label="item.name"
          :label-width="formLabelWidth"
        >
          <el-button
            type="success"
            class="el-icon-check"
            @click="resetForm('recomConfigList')"
            size="small"
            circle
          ></el-button>
        </el-form-item>
      </el-form>
      <!-- <div class="dialog-footer">
        <el-button type="primary" plain @click="publishTemplate()">保存</el-button>
      </div>
      <div class="dialog-footer">
        <el-button type="primary" plain @click="checkTemplate">创建专项链接</el-button>
      </div>-->
    </div>
    <!-- </el-card> -->
    <div class="theme_config">
      <transition name="fade-transform" mode="out-in">
        <component :is="tabView" :actionType="actionType"></component>
        <!-- <router-view></router-view> -->
      </transition>
    </div>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import { Message, Loading, Image } from "element-ui";
import templateThemeInfo from "../special/templateThemeInfo";
import recomConfigList from "../special/recomConfigList";
import recomConfigDetail from "../special/recomConfigDetail";
import bg from "@/assets/images/1038275mi7nbetip71bf81.jpg";
import axios from "@/common/axios";

export default {
  name: "createFrame",
  components: {
    templateThemeInfo: templateThemeInfo,
    recomConfigList: recomConfigList,
    recomConfigDetail: recomConfigDetail
  },
  directives: {
    recomDrag: {
      bind(el, binding) {
        el.style.cursor = "move";
        const sty = el.currentStyle || window.getComputedStyle(el, null);
        el.onmousedown = e => {
          const disX = e.clientX - el.offsetLeft;
          const disY = e.clientY - el.offsetTop;
          document.onmousemove = function(e) {
            const l = e.clientX - disX;
            const t = e.clientY - disY;
            el.style.left = `${l}px`;
            el.style.top = `${t}px`;
            eventBus.$emit("elmousemove", el.id, l, t);
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
      editSubmitData: {},
      actionType: "new",
      commPageEname: "",
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      activname: "",
      imgurl: bg,
      tabView: "",
      formLabelWidth: "130px",
      templateData: {},
      imgArray: [],
      contentId: "",
      newSubmitData: {
        pageInfo: {
          commPageCname: "",
          commPageEname: "",
          levelId: 4,
          isFree: 1
        },
        templateInfo: {
          id: 17,
          templatePicId: "",
          templateUrl: "123"
        },
        recommendInfo: []
      },
      editRecom: { data: [], index: 0 },
      detailAction: "",
      templateActionType: ""
    };
  },
  provide() {
    return {
      setTemplateData: value => (this.templateData = value),
      getTemplateData: () => {
        return this.templateData;
      },
      getRecomList: () => {
        return this.editRecom;
      },
      getDetailAction: () => {
        return this.detailAction;
      },
      setDetailAction: value => (this.detailAction = value),
      getTemplateActionType: () => {
        return this.templateActionType;
      },
      setTemplateActionType: value => {
        this.templateActionType = value;
      }
    };
  },
  inject: ["getContentId"],
  computed: {},
  created() {
    let at = this.getContentId();
    if (at.action == "edit") {
      this.actionType = at.action;
      this.templateActionType = "edit";
      this.getTemplateById(at.contentId);
    }
  },
  watch: {
    deep: true,
    imgArray: {
      handler(newV, oldV) {}
    }
  },
  methods: {
    getTemplateById(id) {
      this.contentId = id;
      this.$store
        .dispatch("axios_get_view", {
          contentId: id
        })
        .then(req => {
          let d = req.data.data;
          this.templateData = d.pageInfo;
          this.templateData.templateInfo = d.templateInfo;
          this.activname = d.pageInfo.commPageCname;
          this.imgurl =
            this.imagesBaseUrl + d.templateInfo.picLibraryTab.picPath;
          this.templateData.bgimg = d.templateInfo.picLibraryTab;
          this.templateData.templateUrl = d.templateInfo.templateUrl;
          this.newSubmitData.recommendInfo = d.recommendInfo;
          this.newSubmitData.recommendInfo.forEach(item => {
            item.name = this.$store.state.typeIds.find(
              i => i.value === item.typeId
            ).label;
          });
          this.formateRecome(d.recommendInfo);
          this.editSubmitData = d;
          this.commPageEname = d.pageInfo.commPageEname;
        })
        .catch(err => {});
    },
    sortBy(field) {
      return function(a, b) {
        return a[field] - b[field];
      };
    },
    //格式化数据回显
    formateRecome(newList) {
      let formateDataList = [];
      newList.forEach(item => {
        item.details.forEach(detail => {
          let formateData = {
            typeId: {
              value: "",
              label: "",
              id: "",
              rankId: ""
            },
            id: "",
            recommendDisplayType: "",
            recommendDisplayName: "",
            recommendDisplayValue: 2,
            recommendTrackName: "",
            recomList: [],
            labelList: [],
            showList: [],
            hideList: [],
            cornerList: []
          };
          formateData["typeId"].value = item.typeId;
          formateData.typeId.rankId = item.rankId;
          formateData.typeId.label = this.$store.state.typeIds.find(
            i => i.value === item.typeId
          ).label;
          formateData.typeId.id = item.id;
          formateData.id = detail.id;
          formateData.rankId = detail.rankId;
          formateData.recommendDisplayType = detail.recommendDisplayType;
          formateData.recommendDisplayName = detail.recommendDisplayName;
          formateData.recommendDisplayValue = detail.recommendDisplayValue;
          formateData.recommendTrackName = detail.recommendTrackName;
          formateData.animation = detail.animation;
          formateData.isFree = detail.isFree;
          formateData.onfocus = detail.onfocus;
          formateData.movetop = detail.movetop;
          formateData.movedown = detail.movedown;
          formateData.moveleft = detail.moveleft;
          formateData.moveright = detail.moveright;
          formateData.more1 = detail.more1;
          formateData.more2 = detail.more2;
          formateData.more3 = detail.more3;
          formateData.more4 = detail.more4;
          detail.recommendPicInfo.forEach(pic => {
            let type = pic.picType;
            pic.url = this.imagesBaseUrl + pic.picPath;
            if (type == 0) {
              formateData.recomList.push(pic);
            } else if (type == 1) {
              formateData.labelList.push(pic);
            } else if (type == 2) {
              formateData.showList.push(pic);
            } else if (type == 3) {
              formateData.hideList.push(pic);
            } else if (type == 4) {
              formateData.cornerList.push(pic);
            }
            eventBus.$emit("setRecom", pic);
          });
          formateDataList.push(formateData);
        });
      });
      this.$store.commit("recommendList_setter", formateDataList);
      this.$store.state.recommendList = formateDataList;
    },
    checkTemplate() {
      this.$store
        .dispatch("axios_get_createSpecialUrl", {
          contentId: this.contentId,
          type: "6" // 专题的type 6
        })
        .then(res => {
          if (res.data.errorCode == "1000") {
            eventBus.$emit("templateList");
            this.$message.success("已创建专项链接！");
            eventBus.$emit("refreshSpecial");
          } else if (res.data.errorCode == "1002") {
            eventBus.$emit("templateList");
            this.$message.success("创建专项链接失败!" + res.data.errorMsg);
          }
        })
        .catch(err => {
          this.$message.success("创建专项链接失败");
        });
    },
    publishTemplate() {
      if (
        this.actionType == "new" ||
        this.editSubmitData.pageInfo == undefined
      ) {
        this.newSubmitData.recommendInfo.sort(this.sortBy("typeId"));
        axios
          .post("sysadmin/content/special/add", this.newSubmitData)
          .then(rs => {
            if (rs.data.errorCode == "1000") {
              this.contentId = rs.contentId;
              this.$message.success(
                "添加成功  " + JSON.stringify(rs.data.errorMsg)
              );
              eventBus.$emit("templateList");
              eventBus.$emit("refreshSpecial");
            } else {
              this.$message.error(
                "添加失败  " + JSON.stringify(rs.data.errorMsg)
              );
            }
          })
          .catch(er => {
            this.$message.error("添加失敗 ");
          });
      } else {
        // this.editSubmitData.recommendInfo.sort(this.sortBy("typeId"));
        this.editSubmitData.recommendInfo.sort(this.sortBy("rankId"));
        axios
          .post("sysadmin/content/special/update", this.editSubmitData)
          .then(rs => {
            if (rs.data.errorCode == "1000") {
              this.$message.success(
                "编辑成功" + JSON.stringify(rs.data.errorMsg)
              );
              eventBus.$emit("refreshSpecial");
            } else {
              this.$message.error(
                "编辑失败" + JSON.stringify(rs.data.errorMsg)
              );
            }
          })
          .catch(er => {
            this.$message.error("编辑失敗 ");
          });
      }
    },
    goBack() {
      eventBus.$emit("templateList");
    },
    resetForm(page) {
      this.tabView = page;
      this.deteleObject(() => {});
    },
    deteleObject(obj) {
      var uniques = [];
      var stringify = {};
      for (var i = 0; i < obj.length; i++) {
        var keys = Object.keys(obj[i]);
        keys.sort(function(a, b) {
          return Number(a) - Number(b);
        });
        var str = "";
        for (var j = 0; j < keys.length; j++) {
          str += JSON.stringify(keys[j]);
          str += JSON.stringify(obj[i][keys[j]]);
        }
        if (!stringify.hasOwnProperty(str)) {
          uniques.push(obj[i]);
          stringify[str] = true;
        }
      }
      uniques = uniques;
      return uniques;
    }
  },
  mounted() {
    eventBus.$on("setRecom", imgData => {
      this.imgArray.push({
        id: imgData.id,
        imgurl: imgData.url,
        top: imgData.yValue / 2 || 0,
        left: imgData.xValue / 2 || 0,
        width: imgData.picW / 2 + "px",
        height: imgData.picH / 2 + "px"
      });
    });
    eventBus.$on("removeRecom", imgData => {
      this.imgArray.forEach((item, index) => {
        if (item.id == imgData.id) {
          this.imgArray.splice(index, 1);
        }
      });
    });
    eventBus.$on("updatePositionX", (id, value) => {
      this.imgArray.forEach((item, index) => {
        if (item.id == id) {
          this.imgArray[index].left = value / 2;
        }
      });
    });
    eventBus.$on("updatePositionY", (id, value) => {
      this.imgArray.forEach((item, index) => {
        if (item.id == id) {
          this.imgArray[index].top = value / 2;
        }
      });
    });
    eventBus.$on("createNew", () => {
      this.detailAction = "add";
      this.tabView = "recomConfigDetail";
    });

    eventBus.$on("setBgImg", form => {
      if (this.actionType == "new") {
        this.templateData = form;
        this.newSubmitData.pageInfo = form;
        this.newSubmitData.templateInfo.templatePicId = form.bgimg.id;
        if (form.templateInfo.id) {
          this.newSubmitData.templateInfo.id = form.templateInfo.id;
        }
        this.newSubmitData.pageInfo.pageTrackName = form.pageTrackName;
        this.imgurl = this.imagesBaseUrl + form.bgimg.picPath;
        this.activname = form.commPageCname;
        this.tabView = "";
        this.commPageEname = form.commPageEname;
      } else {
        this.editSubmitData.pageInfo = form;
        this.editSubmitData.templateInfo.picLibraryTab = form.bgimg;
        this.editSubmitData.templateInfo.templatePicId = form.bgimg.id;
      }
      this.imgurl = this.imagesBaseUrl + form.bgimg.picPath;
      this.activname = form.commPageCname;
      this.commPageEname = form.commPageEname;
      this.tabView = "";
    });

    eventBus.$on("submitRecomeList", d => {
      this.editSubmitData.recommendInfo = d;
      this.newSubmitData.recommendInfo = d;
      this.tabView = "";
    });
    eventBus.$on("goRecomeList", d => {
      d ? (this.tabView = d.page) : (this.tabView = "");
      // this.editRecom.data = d.data;
      // this.editRecom.index = d.data.index;
    });
    eventBus.$on("editRecomList", (d, index) => {
      this.actionType = "edit";
      this.tabView = "recomConfigDetail";
      this.editRecom.data = d;
      this.editRecom.index = index;
    });
  },
  beforeDestroy() {
    eventBus.$off([
      "createNew",
      "setBgImg",
      "submitRecomeList",
      "goRecomeList",
      "setRecom",
      "removeRecom",
      "updatePositionY",
      "updatePositionX",
      "editRecomList"
    ]);
    this.$store.commit("recommendList_clear");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
img {
  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
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
.background_img {
  position: relative;
  width: 640px;
  height: 360px;
  z-index: 21111;
}
.recommends {
  position: absolute;
}
.dialog-footer {
  margin-top: 20px;
  margin-left: 20px;
}

.theme_activ {
  display: flex;
}
.theme {
  margin-top: 2%;
  width: 640px;
  min-width: 640px;
  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  float: left;
}
.theme_el {
  width: 640px;
  height: 360px;
  float: left;
  position: relative;
  overflow: hidden;
  border-style: groove;
}
.dialog-footer {
  float: left;
  margin-left: 10px;
  margin-top: 25px;
}
.theme_info {
  width: 300px;
  float: left;
  padding-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
  border-left: 2px dashed #eee;
  border-right: 2px dashed #eee;
}
.theme_config {
  width: 400px;
  float: left;
  padding-top: 10px;
}
.add_btn {
  margin: 10px 0 0 10px;
  float: left;
}

.el-input--mini .el-input__inner {
  width: 100px;
}
</style>
