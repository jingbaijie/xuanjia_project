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
      <el-form :model="form" style="max-height:600px;overflow-y:auto">
        <el-form-item label="归属推荐类型" :label-width="formLabelWidth">
          <el-select
            v-model="curType"
            filterable
            allow-create
            default-first-option
            @change="selectType"
            placeholder="请选择推荐类型"
          >
            <el-option
              v-for="item in typeIds2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
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
        <el-form-item
          label="通用页面"
          v-if="form.recommendDisplayType==7"
          :label-width="formLabelWidth"
        >
          <el-select
            v-selectScroll="loadScrollData"
            :filter-method="bySearchValue"
            filterable
            v-model="form.commonPageId"
            placeholder="请选择"
            @change="val=>getLabel(val,recommendDisplayPage)"
          >
            <el-option
              v-for="item in recommendDisplayPage"
              :key="item.recommendDisplayValue"
              :label="item.recommendDisplayName"
              :value="item.recommendDisplayValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="'跳转'+recommendName+'名称'" :label-width="formLabelWidth">
          <el-select
            v-selectScroll="loadScrollData2"
            :filter-method="bySearchValue2"
            v-if="form.recommendDisplayType != 8 && form.recommendDisplayType!=3 && form.recommendDisplayType!=7 && form.recommendDisplayType!=88"
            v-model="form.recommendDisplayValue"
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
            v-if=" form.recommendDisplayType==3 || form.recommendDisplayType==8 || form.recommendDisplayType==88"
            v-model="form.recommendDisplayValue"
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
                  <image_choice @getSelectImage="img => recomUploadSuccess(img,0)"></image_choice>
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
                  <image_choice @getSelectImage="img => recomUploadSuccess(img,1)"></image_choice>
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
                  <image_choice @getSelectImage="img => recomUploadSuccess(img,4)"></image_choice>
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
              <transition name="fade-transform" mode="out-in">
                <div class="balnce">
                  <image_choice @getSelectImage="img => recomUploadSuccess(img,2)"></image_choice>
                </div>
              </transition>
              <el-button slot="reference" size="small" type="primary" plain>添 加</el-button>
            </el-popover>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import image_choice from "@/components/widget/ImageChoiceWidget";

export default {
  name: "recomConfigDetail",
  props: ["actionType"],
  inject: ["getRecomList", "getDetailAction", "setDetailAction"],
  components: { image_choice },
  data() {
    return {
      recommendDisplayPage: [],
      classifyData: [],
      preBtn: true,
      nextBtn: false,
      pageTotle: 0,
      currentPage: 1,
      curType: "",
      recomType: "",
      recomName: "",
      contentInfo: "",
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      dialogFormVisible5: false,
      imgData: [],
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      updataToken: {},
      defaultProps: {
        children: "childrenList",
        label: "typeCname",
        value: "id",
        checkStrictly: true,
        emitPath: false
      },
      typeIds2: this.$store.state.typeIds2,
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
        },
        {
          label: "占位符",
          value: "9"
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
        // recommendDisplayTypePage:"",
        more1: "",
        more2: "",
        more3: "",
        more4: "",
        recomList: [],
        labelList: [],
        showList: [],
        hideList: [],
        cornerList: []
      },
      formLabelWidth: "125px",
      action: "",
      recommendName: "",
      dialogImageUrl: "",
      dialogVisible: false,
      searchValues: "",
      countPage: 1
    };
  },
  watch: {
    form: {
      handler: function() {},
      deep: true
    }
  },
  methods: {
    getLabel(val, data) {
      let obj = {};
      obj = data.find(item => {
        return item.recommendDisplayValue === val;
      });
      this.form.recommendDisplayName = obj.recommendDisplayName;
    },
    loadScrollData(scrollDown) {
      if (scrollDown) {
        if (this.countPage >= this.currentPage) {
          this.$store
            .dispatch("axios_get_contentInfo", {
              contentType: 4,
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
    getformCurrency() {
      this.$store
        .dispatch("axios_get_contentInfo", {
          contentType: 4,
          pageNum: this.currentPage,
          searchValue: this.searchValues
        })
        .then(res => {
          if (res != "undefined") {
            this.recommendDisplayPage = res.data.data.records;
          }
        })
        .catch(err => {});
    },
    getContentInfo() {
      if (this.form.recommendDisplayType == 7) {
        this.loadScrollData(true);
        return;
      } else if (
        this.form.recommendDisplayType == 3 ||
        this.form.recommendDisplayType == 8 ||
        this.form.recommendDisplayType == 88
      ) {
        return;
      }
      this.$store
        .dispatch("axios_get_contentInfo", {
          contentType: this.form.recommendDisplayType,
          pageNum: this.currentPage,
          searchValue: this.searchValues
        })
        .then(rs => {
          if (rs != "undefined") {
            this.recommendDisplayNames = rs.data.data.records;
            this.countPage = rs.data.data.pages;
          }
        })
        .catch(err => {});
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
                this.recommendDisplayNames = this.recommendDisplayNames.concat(
                  res.data.data.records
                );
              }
            });
        }
      }
    },
    bySearchValue(val) {
      this.currentPage = 1;
      this.searchValues = val;
      this.getformCurrency();
    },
    bySearchValue2(val) {
      this.currentPage = 1;
      this.searchValues = val;
      this.getContentInfo();
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

    //动态添加推荐类型
    selectType(val) {
      let obj = {};
      obj = this.typeIds2.find(item => {
        return item.value === val;
      });
      if (typeof obj == "undefined") {
        obj = {
          value: Math.floor(Math.random() * 100000 + 1) + "",
          label: val
        };
        this.typeIds2.push(obj);
      }
      this.form.typeId = obj;
    },

    //根据选择跳转类型 切换跳转名称
    selectRecomType(val,rv) {
      this.currentPage = 1;
      this.countPage = 1;
      this.form.recommendDisplayValue = rv ? rv : "";
      this.searchValues = "";
      this.getContentInfo();
      this.recommendDisplayTypes.forEach((item, index) => {
        if (item.value == val) {
          if (val == 3 || val == 8 || val == 88) {
            this.recommendName = "";
          } else {
            this.recommendName = item.label;
          }
        }
      });
    },
    //删除推荐图片
    removeRecome(f, fl) {
      this.form.recomList.forEach((item, index) => {
        if (item.id == f.id) {
          this.form.recomList.splice(index, 1);
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
    //删除标签图片
    removeLabel(f, fl) {
      this.form.labelList.forEach((item, index) => {
        if (item.id == f.id) {
          this.form.labelList.splice(index, 1);
          eventBus.$emit("removeRecom", item);
          // this.setDetailAction('add');
        }
      });
    },
    //删除显示图片
    removeShow(f, fl) {
      this.form.showList.forEach((item, index) => {
        if (item.id == f.id) {
          this.form.showList.splice(index, 1);
          eventBus.$emit("removeRecom", item);
          // this.setDetailAction('add');
        }
      });
    },
    //上传图片 三种类型
    recomUploadSuccess(file, type) {
      file.name = file.picCname;
      file.url = this.imagesBaseUrl + file.picPath;
      file.picId = file.id;
      if (type == 0) {
        file.picType = "0";
        this.form.recomList.push(file);
      } else if (type == 1) {
        file.picType = "1";
        this.form.labelList.push(file);
      } else if (type == 2) {
        file.picType = "2";
        this.form.showList.push(file);
      } else if (type == 4) {
        file.picType = "4";
        this.form.cornerList.push(file);
      } else {
        file.picType = "3";
        this.form.hideList.push(file);
      }
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
    if (this.actionType == "edit" && this.getDetailAction() == "edit") {
      //编辑单个推荐回显
      let editData = this.getRecomList();
      this.curType = editData.data.typeId.value;
      this.form = editData.data;
      this.form.commonPageId = parseInt(editData.data.commonPageId);
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
      this.getContentInfo();
    }
  },
  mounted() {
    this.getClassifyList();
  },
  destroyed() {}
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
