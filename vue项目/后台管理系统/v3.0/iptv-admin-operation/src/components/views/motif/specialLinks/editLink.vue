<template>
  <div>
    <el-dialog
      width="30vw"
      v-dialogDrag
      ref="dialog__wrapper"
      :title="this.form.id ? '编辑' : '新增'"
      :visible.sync="dialogFormVisible"
      @close="cancel"
      :close-on-click-modal="false"
    >
      <div class="dialog">
        <el-form :model="form" ref="form" :rules="rules">
          <el-form-item label="名称" prop="cname" :label-width="formLabelWidth">
            <el-input v-model="form.cname" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="外部名称"
            prop="ename"
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.ename" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="开机图"
            prop="waitingPic"
            :label-width="formLabelWidth"
          >
            <el-popover placement="right" width="535" trigger="hover">
              <img class="flagImage" slot="reference" :src="waitingPic" alt />
              <image_choice @getSelectImage="(img) => setImg(img)"></image_choice>
            </el-popover>
          </el-form-item>
          <el-form-item
            label="跳转类型"
            prop="recommendDisplayType"
            :label-width="formLabelWidth"
          >
            <el-select
              v-model="form.recommendDisplayType"
              @change="selectRecomType"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in recommendDisplayTypes"
                :key="index"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="主题"
            prop="themeId"
            v-if="
            form.recommendDisplayType != 88 &&
            form.recommendDisplayType != 3 &&
            form.recommendDisplayType != 6 &&
            form.recommendDisplayType != 11
          "
            :label-width="formLabelWidth"
          >
            <el-select
              v-model="form.themeId"
              @change="selectCommpage(form.themeId)"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in themeData"
                :key="index"
                :label="item.cname"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="通用页面"
            prop="commpageId"
            v-if="
              form.recommendDisplayType != 88 &&
              form.recommendDisplayType != 3 &&
              form.recommendDisplayType != 6 &&
              form.recommendDisplayType != 11
            "
            :label-width="formLabelWidth"
          >
            <el-select
              @change="(val) => getLabelTY(val, recommendDisplayPage)"
              v-selectScroll="loadScrollData"
              :filter-method="bySearchValue"
              filterable
              clearable
              v-model="form.commpageId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in recommendDisplayPage"
                :key="item.id"
                :label="item.cname"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="
              form.recommendDisplayType != 88 &&
              form.recommendDisplayType != 3 &&
              form.recommendDisplayType != 6 &&
              form.recommendDisplayType != 11
            "
            :label-width="formLabelWidth"
          >
            <el-select
              @change="(val) => getLabelTY(val, recommendDisplayPage)"
              v-selectScroll="loadScrollData"
              :filter-method="bySearchValue"
              filterable
              clearable
              v-model="commpageId2"
              placeholder="请选择"
            >
              <el-option
                v-for="item in recommendDisplayPage"
                :key="item.id"
                :label="item.cname"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="
              form.recommendDisplayType != 88 &&
              form.recommendDisplayType != 3 &&
              form.recommendDisplayType != 6 &&
              form.recommendDisplayType != 11
            "
            :label-width="formLabelWidth"
          >
            <el-select
              @change="(val) => getLabelTY(val, recommendDisplayPage)"
              v-selectScroll="loadScrollData"
              :filter-method="bySearchValue"
              filterable
              clearable
              v-model="commpageId3"
              placeholder="请选择"
            >
              <el-option
                v-for="item in recommendDisplayPage"
                :key="item.id"
                :label="item.cname"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="form.recommendDisplayType != 4 && form.recommendDisplayType != 8"
            :label="'跳转' + recommendName + '名称'"
            :label-width="formLabelWidth"
            prop="recommendDisplayValue"
          >
            <el-select
              @change="(val) => getLabel(val, recommendDisplayNames)"
              v-selectScroll="loadScrollData2"
              :filter-method="bySearchValue2"
              v-if="
                form.recommendDisplayType != 8 &&
                form.recommendDisplayType != 3 &&
                form.recommendDisplayType != 7 &&
                form.recommendDisplayType != 88
              "
              v-model="form.recommendDisplayValue"
              filterable
            >
              <el-option
                v-for="(item, index) in recommendDisplayNames"
                :key="index"
                :label="item.recommendDisplayName"
                :value="item.recommendDisplayValue"
              ></el-option>
            </el-select>
            <el-input
              @input="onInput()"
              props="recommendDisplayValue"
              v-if="
                form.recommendDisplayType == 3 ||
                form.recommendDisplayType == 88
              "
              v-model="form.recommendDisplayValue"
              autocomplete="off"
            ></el-input>
            <el-cascader
              style="width: 250px"
              v-if="form.recommendDisplayType == 7"
              v-model="form.recommendDisplayValue"
              placeholder="搜索"
              :options="classifyData"
              :props="defaultProps"
              filterable
              clearable
              size="medium"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="占位符" :label-width="formLabelWidth">
            <el-select v-model="form.placeHolder" clearable placeholder="请选择" @change="$forceUpdate()">
              <el-option
                v-for="(item, index) in placeholderList"
                :key="index"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上线时间" prop="cartoonProprietorsStarttime" :label-width="formLabelWidth">
            <el-date-picker
              v-model="form.onlineTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
              default-time="12:00:00"
            />
          </el-form-item>
          <el-form-item label="下线时间" prop="cartoonProprietorsStarttime" :label-width="formLabelWidth">
            <el-date-picker
              v-model="form.offlineTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
              default-time="12:00:00"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="onSubmit('form')"
          style="margin-right: 20px"
          >确 定</el-button
        >
        <el-button type="primary" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import defaultFocus from "@/assets/images/add2.jpg";
import image_choice from "@/components/widget/ImageChoiceWidget";
export default {
  name: "editLink",
  data() {
    return {
      formLabelWidth: "150px",
      waitingPic: defaultFocus,
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      form: {},
      rules: {
        cname: [{ required: true, message: "必填项", trigger: "blur" }],
        ename: [{ required: true, message: "必填项", trigger: "blur" }],
        recommendDisplayType: [{ required: true, message: "必填项", trigger: "blur" }],
        recommendDisplayValue: [{ required: true, message: "必填项", trigger: "blur" }],
        commpageId: [{ required: true, message: "必填项", trigger: "blur" }],
        themeId: [{ required: true, message: "必填项", trigger: "blur" }],
      },
      classifyData: [],
      dialogFormVisible: false,
      recommendDisplayPage: [],
      defaultProps: {
        children: "childrenList",
        label: "typeCname",
        value: "id",
      },
      currentPage: 1,
      searchValues: "",
      countPage: "",
      recommendDisplayNames: [],
      recommendName: "",
      recommendDisplayTypes: [],
      commpageId2: undefined,
      commpageId3: undefined,
      defaultDisplayValue: [],
      themeData: [],
      placeholderList: [],
    };
  },
  components: { image_choice },
  created() {
    this.getRecommendDisplayTypes();
    this.getThemeList();
    this.getPlaceholder();
  },
  beforeDestroy() {},
  mounted() {
    this.getClassifyList();
  },
  methods: {
    init(action, data) {
      this.dialogFormVisible = true;
      if (action == "add") {
        this.form = {};
        this.waitingPic = defaultFocus;
      } else {
        let v = JSON.parse(JSON.stringify(data));
        this.dialogFormVisible = true;
        this.form = v;
        if (v.waitingPic) {
          this.waitingPic = this.imagesBaseUrl + v.waitingPic.picPath;
        } else {
          this.waitingPic = defaultFocus;
        }
        if (v.commpageId != undefined && v.commpageId != "") {
          let arr = v.commpageId.split("$");
          if (arr.length == 3) {
            this.form.commpageId = Number(arr[0]);
            this.commpageId2 = Number(arr[1]);
            this.commpageId3 = Number(arr[2]);
          } else if (arr.length == 2) {
            this.form.commpageId = Number(arr[0]);
            this.commpageId2 = Number(arr[1]);
            this.commpageId3 = "";
          } else if (arr.length == 1) {
            this.form.commpageId = Number(arr[0]);
            this.commpageId2 = "";
            this.commpageId3 = "";
          }
        }
        if(this.form.recommendDisplayType == 7){       
          let arr = v.recommendDisplayValue.split(",");
          this.defaultDisplayValue = arr;
          this.form.recommendDisplayValue = Number(arr[arr.length - 1]);
        }
        if (
          this.form.recommendDisplayType == 3 ||
          this.form.recommendDisplayType == 9 ||
          this.form.recommendDisplayType == 88
        ) {
          this.$set(
            this.form,
            "recommendDisplayValue",
            v.recommendDisplayValue
          );
        } else {
          this.$set(
            this.form,
            "recommendDisplayValue",
            Number(v.recommendDisplayValue)
          );
        }
        this.form.recommendDisplayType = v.recommendDisplayType + "";
        this.selectRecomType(v.recommendDisplayType, v.recommendDisplayValue);
        this.getContentInfo();
      }
    },
    getThemeList() {
      this.$store
        .dispatch("axios_get_ThemeList")
        .then((res) => {
          this.themeData = res.data.data;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 获取占位符下拉框
    getPlaceholder() {
      this.$store
        .dispatch("axios_get_selectDictDataByType", {
          dictType: "placeholderConfig",
        })
        .then((res) => {
          this.placeholderList = res.data.data;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    onInput() {
      this.$forceUpdate();
    },
    getLabel(val, data) {
      this.$forceUpdate();
      let obj = {};
      obj = data.find(item => {
        return item.recommendDisplayValue === val;
      });
      this.form.recommendDisplayName = obj.recommendDisplayName;
    },
    getLabelTY(val, data) {
      this.$forceUpdate();
      let obj = {};
      obj = data.find((item) => {
        return item.id === val;
      });
      if (obj != undefined) {
        this.form.recommendDisplayName = obj.cname;
      }
    },
    getRecommendDisplayTypes() {
      this.$store
        .dispatch("axios_get_selectDictDataByType", {
          dictType: "recommend_display_type",
        })
        .then((res) => {
          this.recommendDisplayTypes = res.data.data;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    cancel() {
      this.dialogFormVisible = false;
      this.form = {};
      this.$refs.form.resetFields();
    },
    loadScrollData(scrollDown) {
      if (scrollDown) {
        if (this.countPage >= this.currentPage) {
          this.$store
            .dispatch("axios_get_pageSkipList", {
              themeId: this.form.themeId,
              contentType: 4,
              pageNum: this.currentPage++,
              searchValue: this.searchValues,
            })
            .then((res) => {
              if (res != "undefined") {
                this.recommendDisplayPage = res.data.data;
              }
            });
        }
      }
    },
    getformCurrency() {
      this.$store
        .dispatch("axios_get_pageSkipList", {
          themeId: this.form.themeId,
          contentType: 4,
          pageNum: this.currentPage,
          searchValue: this.searchValues,
        })
        .then((res) => {
          if (res != "undefined") {
            this.recommendDisplayPage = res.data.data;
          }
        })
        .catch((err) => {});
    },
    //根据选择跳转类型 切换跳转名称
    selectRecomType(val, rv) {
      this.$forceUpdate();
      this.currentPage = 1;
      this.countPage = 1;
      this.form.recommendDisplayValue = rv ? rv : "";
      this.searchValues = "";
      this.getContentInfo();
      this.recommendDisplayTypes.forEach((item, index) => {
        if (item.dictValue == val) {
          if (val == 3 || val == 8 || val == 88) {
            this.recommendName = "";
          } else {
            this.recommendName = item.dictLabel;
          }
        }
      });
    },
    selectCommpage(themeId){
      this.$forceUpdate();
      this.form.themeId = themeId;
      this.form.commpageId = "";
      this.commpageId2 = "";
      this.commpageId3 = "";
      this.getformCurrency();
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
        .then((res) => {
          if (res != "undefined") {
            this.classifyData = this.filterData(res.data.data);
          }
        })
        .catch((err) => {});
    },
    filterData(d) {
      d.forEach((element) => {
        if (element.childrenList.length > 0) {
          element.childrenList.forEach((i) => {
            if (i.childrenList.length > 0) {
              i.childrenList.forEach((x) => {
                if (x.childrenList.length > 0) {
                  x.childrenList.forEach((y) => {
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
    getContentInfo() {
      if (this.form.recommendDisplayType != 88 &&
        this.form.recommendDisplayType != 3 &&
        this.form.recommendDisplayType != 6 &&
        this.form.recommendDisplayType != 11
      ) {
        this.loadScrollData(true);
        this.loadScrollData2(true);
        // return;
      } else if (
        this.form.recommendDisplayType == 3 ||
        this.form.recommendDisplayType == 8 ||
        this.form.recommendDisplayType == 88
      ) {
        return;
      }
      if(this.form.recommendDisplayType == 4 || this.form.recommendDisplayType == 6 || this.form.recommendDisplayType == 11){
        this.currentPage = 2;
      }
      this.$store
        .dispatch("axios_get_contentInfo", {
          contentType: this.form.recommendDisplayType,
          pageNum: this.currentPage - 1,
          searchValue: this.searchValues,
        })
        .then((rs) => {
          if (rs != "undefined") {
            this.recommendDisplayNames = rs.data.data.records;
            this.countPage = rs.data.data.pages;
          }
        })
        .catch((err) => {});
    },
    loadScrollData2(scrollDown) {
      if (scrollDown) {
        if (this.countPage >= this.currentPage) {
          this.$store
            .dispatch("axios_get_contentInfo", {
              contentType: this.form.recommendDisplayType,
              pageNum: this.currentPage++,
              searchValue: this.searchValues,
            })
            .then((res) => {
              if (res != "undefined") {
                this.recommendDisplayNames = this.recommendDisplayNames.concat(
                  res.data.data.records
                );
              }
            });
        }
      }
    },
    setImg(item) {
      this.waitingPic = this.imagesBaseUrl + item.picPath;
      this.form.waitingPicId = item.id;
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let arr = [];
          arr.push(this.form.commpageId);
          arr.push(this.commpageId2);
          arr.push(this.commpageId3);
          arr = arr.filter(function (ele) {
            return ele != "" && ele != undefined;
          });
          if (
            this.form.recommendDisplayType != 88 &&
            this.form.recommendDisplayType != 3 &&
            this.form.recommendDisplayType != 6 &&
            this.form.recommendDisplayType != 11
          ) {
            this.form.commpageId = arr.join("$");
          } else {
            this.form.themeId = "";
            this.form.commpageId = "";
            this.commpageId2 = "";
            this.commpageId3 = "";
          }
          if(this.form.recommendDisplayType == 7){
            try {
              this.form.recommendDisplayValue = this.form.recommendDisplayValue.join(",");              
            } catch (error) {
              this.form.recommendDisplayValue = this.defaultDisplayValue.join(",");
            }
          }
          this.$store
            .dispatch("axios_add_pageLink", this.form)
            .then((res) => {
              if (res.data.errorCode == "1000") {
                this.$message.success("操作成功");
                eventBus.$emit("refreshSpecialLinks");
              } else {
                this.$message.error(res.data.errorMsg);
              }
            })
            .catch((err) => {
              this.$message.error("操作失败");
            });
          this.dialogFormVisible = false;
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.flagImage {
  width: 50px;
}
.dialog-footer {
  text-align: center;
}
.el-input {
  width: 80%;
}
.dialog {
  height: 580px;
  overflow: auto;
}
</style>