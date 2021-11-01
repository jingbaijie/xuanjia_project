<template>
  <div>
    <el-dialog
      width="35vw"
      v-dialogDrag
      ref="dialog__wrapper"
      :title="this.form.id ? '编辑' : '新增'"
      :visible.sync="dialogFormVisible"
      @close="cancel"
      :close-on-click-modal="false"
    >
      <div class="dialog">
        <el-form :model="form" ref="form" :rules="rules">
          <el-form-item
            label="栏目名称"
            prop="cname"
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.cname" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="英文名称"
            prop="ename"
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.ename" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="父级栏目" :label-width="formLabelWidth">
            <el-cascader
              v-model="form.pid"
              :show-all-levels="false"
              :options="parentData"
              :props="{
                children: 'subMenus',
                label: 'cname',
                value: 'id',
                checkStrictly: true,
                emitPath: false,
              }"
              filterable
              clearable
              size="medium"
            ></el-cascader>
          </el-form-item>
          <el-form-item
            label="排序"
            prop="rankId"
            :label-width="formLabelWidth"
          >
            <el-input-number
              v-model="form.rankId"
              :min="0"
              controls-position="right"
            ></el-input-number>
          </el-form-item>
          <el-form-item
            label="跳转类型"
            prop="displayType"
            :label-width="formLabelWidth"
          >
            <el-select
              v-model="form.displayType"
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
            v-if="form.displayType != 88 &&
              form.displayType != 3 &&
              form.displayType != 6 &&
              form.displayType != 11
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
            v-if="form.displayType != 88 &&
              form.displayType != 3 &&
              form.displayType != 6 &&
              form.displayType != 11
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
            prop="commpageId"
            v-if="form.displayType != 88 &&
              form.displayType != 3 &&
              form.displayType != 6 &&
              form.displayType != 11
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
            prop="commpageId"
            v-if="form.displayType != 88 &&
              form.displayType != 3 &&
              form.displayType != 6 &&
              form.displayType != 11
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
            :label="'跳转' + recommendName + '名称'"
            :label-width="formLabelWidth"
            prop="displayValue"
          >
            <el-select
              @change="(val) => getLabel(val, recommendDisplayNames)"
              v-selectScroll="loadScrollData2"
              :filter-method="bySearchValue2"
              v-if="
                form.displayType != 8 &&
                form.displayType != 3 &&
                form.displayType != 7 &&
                form.displayType != 88
              "
              v-model="form.displayValue"
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
              props="displayValue"
              @input="onInput()"
              v-if="
                form.displayType == 3 ||
                form.displayType == 88
              "
              v-model="form.displayValue"
              autocomplete="off"
            ></el-input>
            <el-cascader
              style="width: 250px"
              v-if="form.displayType == 7"
              v-model="form.displayValue"
              placeholder="搜索"
              :options="classifyData"
              :props="defaultProps"
              filterable
              clearable
              size="medium"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="占位符" :label-width="formLabelWidth">
            <el-select v-model="form.placeholder" clearable placeholder="请选择">
              <el-option
                v-for="(item, index) in placeholderList"
                :key="index"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="埋点名称" :label-width="formLabelWidth">
            <el-input v-model="form.trackName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="焦点图"
            prop="focusPic"
            :label-width="formLabelWidth"
          >
            <el-popover placement="right" width="535" trigger="hover">
              <img class="flagImage" slot="reference" :src="focusImg" alt />
              <image_choice
                @getSelectImage="(img) => setImg(img, 0)"
              ></image_choice>
            </el-popover>
          </el-form-item>
          <el-form-item
            label="角标图"
            prop="markPic"
            :label-width="formLabelWidth"
          >
            <el-popover placement="right" width="535" trigger="hover">
              <img class="flagImage" slot="reference" :src="markImg" alt />
              <image_choice
                @getSelectImage="(img) => setImg(img, 1)"
              ></image_choice>
            </el-popover>
          </el-form-item>
          <el-form-item
            label="图标"
            prop="picLib"
            :label-width="formLabelWidth"
          >
            <el-popover placement="right" width="535" trigger="hover">
              <img class="flagImage" slot="reference" :src="picLib" alt />
              <image_choice
                @getSelectImage="(img) => setImg(img, 2)"
              ></image_choice>
            </el-popover>
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
  name: "editColumn",
  props: ["parentData"],
  data() {
    return {
      formLabelWidth: "150px",
      focusImg: defaultFocus,
      markImg: defaultFocus,
      picLib: defaultFocus,
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      form: {},
      rules: {
        cname: [{ required: true, message: "必填项", trigger: "blur" }],
        ename: [
          { required: true, message: "必填项", trigger: "blur" },
          {
            validator: function (rule, value, callback) {
              //  校验英文的正则
              if (/^[A-Za-z0-9]{1,30}$/.test(value) == false) {
                callback(new Error("请输入英文！"));
              } else {
                //校验通过
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        displayType: [{ required: true, message: "必填项", trigger: "blur" }],
        displayValue: [{ required: true, message: "必填项", trigger: "blur" }],
        commpageId: [{ required: true, message: "必填项", trigger: "blur" }],
        themeId: [{ required: true, message: "必填项", trigger: "blur" }]
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
      placeholderList: []
    };
  },
  components: { image_choice },
  created() {
    this.getThemeList();
    this.getPlaceholder();
    eventBus.$on("addColumn", () => {
      this.addColumn();
    });
    eventBus.$on("editColumn", (v) => {
      this.editColumn(v);
    });
    this.getRecommendDisplayTypes();
  },
  beforeDestroy() {
    eventBus.$off(["addColumn", "editColumn"]);
  },
  mounted() {
    this.getClassifyList();
  },
  methods: {
    cancel() {
      this.dialogFormVisible = false;
      this.form = {};
      this.$refs.form.resetFields();
    },
    onInput() {
      this.$forceUpdate();
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
    getLabel(val, data) {
      this.$forceUpdate();
      let obj = {};
      obj = data.find((item) => {
        return item.recommendDisplayValue === val;
      });
      this.form.displayName = obj.recommendDisplayName;
    },
    getLabelTY(val, data) {
      this.$forceUpdate();
      let obj = {};
      obj = data.find((item) => {
        return item.id === val;
      });
      if (obj != undefined) {
        this.form.displayName = obj.cname;
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
      this.form.displayValue = rv ? rv : "";
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
      if (
        this.form.displayType != 88 &&
        this.form.displayType != 3 &&
        this.form.displayType != 6 &&
        this.form.displayType != 11
      ) {
        this.loadScrollData(true);
        this.loadScrollData2(true);
        // return;
      } else if (
        this.form.displayType == 3 ||
        this.form.displayType == 8 ||
        this.form.displayType == 88
      ) {
        return;
      }
      this.$store
        .dispatch("axios_get_contentInfo", {
          contentType: this.form.displayType,
          pageNum: this.currentPage,
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
              contentType: this.form.displayType,
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
    setImg(item, type) {
      if (type == 0) {
        this.focusImg = this.imagesBaseUrl + item.picPath;
        this.form.focuspicId = item.id;
      } else if (type == 1) {
        this.markImg = this.imagesBaseUrl + item.picPath;
        this.form.markpicId = item.id;
      } else if (type == 2) {
        this.picLib = this.imagesBaseUrl + item.picPath;
        this.form.picId = item.id;
      }
    },
    addColumn() {
      this.dialogFormVisible = true;
      this.focusImg = defaultFocus;
      this.markImg = defaultFocus;
      this.picLib = defaultFocus;
      this.form = {};
    },
    editColumn(data) {
      this.dialogFormVisible = true;
      let v = JSON.parse(JSON.stringify(data));
      this.form = v;
      if (v.focuspic) {
        this.focusImg = this.imagesBaseUrl + v.focuspic.picPath;
      } else {
        this.focusImg = defaultFocus;
      }
      if (v.markpic) {
        this.markImg = this.imagesBaseUrl + v.markpic.picPath;
      } else {
        this.markImg = defaultFocus;
      }
      if (v.picLib) {
        this.picLib = this.imagesBaseUrl + v.picLib.picPath;
      } else {
        this.picLib = defaultFocus;
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
      if(this.form.displayType == 7){       
        let arr = v.displayValue.split(",");
        this.defaultDisplayValue = arr;
        this.form.displayValue = Number(arr[arr.length - 1]);
      }
      if (
        v.displayType == 3 ||
        v.displayType == 9 ||
        v.displayType == 88
      ) {
        this.$set(this.form, "displayValue", v.displayValue);
      } else {
        this.$set(this.form, "displayValue", Number(v.displayValue));
      }
      this.form.displayType = v.displayType + "";
      this.selectRecomType(v.displayType, v.displayValue);
      this.getContentInfo();
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let actionUrl;
          this.form.pid = this.form.pid == null ? 0 : this.form.pid;
          let arr = [];
          arr.push(this.form.commpageId);
          arr.push(this.commpageId2);
          arr.push(this.commpageId3);
          arr = arr.filter(function (ele) {
            return ele != "" && ele != undefined;
          });
          if (
            this.form.displayType != 88 &&
            this.form.displayType != 3 &&
            this.form.displayType != 6 &&
            this.form.displayType != 11
          ) {
            this.form.commpageId = arr.join("$");
          } else {
            this.form.themeId = "";
            this.form.commpageId = "";
            this.commpageId2 = "";
            this.commpageId3 = "";
          }
          if(this.form.displayType == 7){
            try {
              this.form.displayValue = this.form.displayValue.join(",");              
            } catch (error) {
              this.form.displayValue = this.defaultDisplayValue.join(",");
            }
          }
          this.form.id
            ? (actionUrl = "axios_update_column")
            : (actionUrl = "axios_add_column");
          if (
            this.form.id == undefined ||
            this.form.pid != this.form.id ||
            this.form.pid == undefined
          ) {
            this.$store
              .dispatch(actionUrl, this.form)
              .then((response) => {
                if (response.data.errorCode == "1000") {
                  this.$message.success("操作成功");
                  eventBus.$emit("refreshColumn");
                } else {
                  this.$message.error(response.data.errorMsg);
                }
              })
              .catch((err) => {
                this.$message.error("操作失败");
              });
            this.cancel();
          } else {
            this.$message.error("不能选择自身栏目数据为父级栏目！");
          }
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
  height: 600px;
  overflow: auto;
}
</style>