<template>
  <div>
    <el-dialog
      width="30vw"
      v-dialogDrag
      ref="dialog__wrapper"
      title="配置"
      :visible.sync="dialogVisible"
    >
      <el-form :model="form" ref="form" :rules="rules" style="max-height:600px;overflow-y:auto">
        <el-form-item label="跳转地址类型" prop="recommendDisplayType" :label-width="formLabelWidth">
          <el-select
            v-model="form.recommendDisplayType"
            @change="selectRecomType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in recommendDisplayTypes"
              :key="item.id"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="主题"
          prop="more1"
          v-if="
            form.recommendDisplayType != 88 &&
            form.recommendDisplayType != 3 &&
            form.recommendDisplayType != 6 &&
            form.recommendDisplayType != 11
          "
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="form.more1"
            @change="selectCommpage(form.more1)"
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
            :filter-method="bySearchValue"
            v-selectScroll="loadScrollData"
            filterable
            clearable
            v-model="form.commpageId"
            placeholder="请选择"
            @change="val => getLabelTY(val, recommendDisplayPage)"
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
            :filter-method="bySearchValue"
            v-selectScroll="loadScrollData"
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
            :filter-method="bySearchValue"
            v-selectScroll="loadScrollData"
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
            @change="val => getLabelTZ(val, recommendDisplayNames)"
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
            size="medium"
            filterable
            clearable
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
        <el-form-item label="埋点名" :label-width="formLabelWidth">
          <el-input
            v-model="form.recommendTrackName"
            autocomplete="off"
          ></el-input>
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
              v-model="dialogFormVisible"
            >
              <transition name="fade-transform" mode="out-in">
                <div class="balnce">
                  <image_choice
                    @getSelectImage="img => recomUploadSuccess(img, 'showList', 2)"
                  ></image_choice>
                </div>
              </transition>
              <el-button slot="reference" size="small" type="primary" plain
                >添 加</el-button
              >
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
              <el-button slot="reference" size="small" type="primary" plain
                >添 加</el-button
              >
              <transition name="fade-transform" mode="out-in">
                <div class="balnce">
                  <image_choice
                    @getSelectImage="img => recomUploadSuccess(img, 'labelList', 1)"
                  ></image_choice>
                </div>
              </transition>
            </el-popover>
          </el-upload>
        </el-form-item>
        <el-form-item label="焦点图片" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            action
            :file-list="form.focusList"
            :on-remove="removefocus"
            list-type="picture"
          >
            <el-popover
              slot="tip"
              placement="right"
              width="535"
              trigger="hover"
              v-model="dialogFormVisible3"
            >
              <el-button slot="reference" size="small" type="primary" plain
                >添 加</el-button
              >
              <transition name="fade-transform" mode="out-in">
                <div class="balnce">
                  <image_choice
                    @getSelectImage="img => recomUploadSuccess(img, 'focusList', 4)"
                  ></image_choice>
                </div>
              </transition>
            </el-popover>
          </el-upload>
        </el-form-item>
        <el-form-item label="隐藏图片" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            action
            :file-list="form.hideList"
            :on-remove="removeHide"
            list-type="picture"
          >
            <el-popover
              slot="tip"
              placement="right"
              width="535"
              trigger="hover"
              v-model="dialogFormVisible4"
            >
              <el-button slot="reference" size="small" type="primary" plain
                >添 加</el-button
              >
              <transition name="fade-transform" mode="out-in">
                <div class="balnce">
                  <image_choice
                    @getSelectImage="img => recomUploadSuccess(img, 'hideList', 3)"
                  ></image_choice>
                </div>
              </transition>
            </el-popover>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" size="mini" @click="onSubmit('form')">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import image_choice from "@/components/widget/ImageChoiceWidget";

export default {
  name: "configForm",
  components: { image_choice },
  data() {
    return {
      dialogVisible: false,
      recommendDisplayPage: [],
      classifyData: [],
      currentPage: 1,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      dialogFormVisible4: false,
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      defaultProps: {
        children: "childrenList",
        label: "typeCname",
        value: "id"
      },
      recommendDisplayNames: [],
      recommendDisplayTypes: [],
      rules: {
        recommendDisplayType: [{ required: true, message: "必填项", trigger: "blur" }],
        recommendDisplayValue: [{ required: true, message: "必填项", trigger: "blur" }],
        commpageId: [{ required: true, message: "必填项", trigger: "blur" }],
        more1: [{ required: true, message: "必填项", trigger: "blur" }],
      },
      form: {
        recommendDisplayType: "",
        recommendDisplayName: "",
        recommendDisplayValue: "",
        recommendTrackName: "",
        more1: "",
        componentRoomConfigs: [],
        labelList: [],
        focusList: [],
        showList: [],
        hideList: [],
      },
      formLabelWidth: "135px",
      action: "",
      recommendName: "",
      searchValues: "",
      countPage: 1,
      commpageId2: undefined,
      commpageId3: undefined,
      defaultDisplayValue: [],
      themeData: [],
      placeholderList: []
    };
  },
   created() {
    this.getRecomType();
    this.getPlaceholder();
    this.getThemeList();
    eventBus.$on("addConfigForm", ()=>{
      this.dialogVisible = true;
      this.form = {       
        recommendDisplayType: "",
        recommendDisplayValue: undefined,
        recommendTrackName: "",
        commpageId: "",
        componentRoomConfigs: [],
        labelList: [],
        focusList: [],
        showList: [],
        hideList: [],
      };
    });
    eventBus.$on("editConfigForm", (item)=>{
      this.dialogVisible = true;
      let data = JSON.parse(JSON.stringify(item));
      this.form = data;
      this.form.id = data.id;
      this.form.recommendTrackName = data.recommendTrackName;
      if(data.more1 != ""){
        this.form.more1 = Number(data.more1);
      }
      this.form.placeHolder = data.placeHolder;
      if (data.commpageId != undefined && data.commpageId != "" && data.commpageId != null) {
        let arr = data.commpageId.split("$");
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
      if (this.form.recommendDisplayType == 7){    
        let arr1 = [];
        arr1 = data.recommendDisplayValue.split(",");
        this.defaultDisplayValue = arr1;
        this.form.recommendDisplayValue = Number(arr1[arr1.length - 1]);
      }
      if (
        this.form.recommendDisplayType == 3 ||
        this.form.recommendDisplayType == 9 ||
        this.form.recommendDisplayType == 88
      ) {
        this.$set(
          this.form,
          "recommendDisplayValue",
          data.recommendDisplayValue
        );
      }else {
        this.$set(
          this.form,
          "recommendDisplayValue",
          Number(data.recommendDisplayValue)
        );
      }
      this.form.recommendDisplayType = data.recommendDisplayType + "";
      this.selectRecomType(
        data.recommendDisplayType,
        data.recommendDisplayValue
      );
      this.form.labelList = [];
      this.form.showList = [];
      this.form.hideList = [];
      this.form.focusList = [];
      data.componentRoomConfigs.map(v => {
        let type = v.picType;
        if (v.picType) {
          v.recommendConfigPics.url =
            v.recommendConfigPics &&
            this.imagesBaseUrl + v.recommendConfigPics.picPath;
          v.url =
            v.recommendConfigPics &&
            this.imagesBaseUrl + v.recommendConfigPics.picPath;
        }        
        if (type == 1) {       
          this.form.labelList.push(JSON.parse(JSON.stringify(v)));
        } else if (type == 2) {
          this.form.showList.push(JSON.parse(JSON.stringify(v)));
        } else if (type == 3) {
          this.form.hideList.push(JSON.parse(JSON.stringify(v)));
        } else if (type == 4) {
          this.form.focusList.push(JSON.parse(JSON.stringify(v)));
        }     
      });
    });
  },
  methods: {
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
    getLabelTY(val, data) {
      this.$forceUpdate();
      let obj = {};
      obj = data.find(item => {
        return item.id === val;
      });
      this.form.commpageName = obj.cname;
    },
    getLabelTZ(val, data) {
      this.$forceUpdate();
      let obj = {};
      obj = data.find(item => {
        return item.recommendDisplayValue === val;
      });
      this.form.recommendDisplayName = obj.recommendDisplayName;
    },
    getformCurrency() {
      this.$store
        .dispatch("axios_get_pageSkipList", {
          themeId: this.form.more1,
          contentType: 4,
          pageNum: this.currentPage,
          searchValue: this.searchValues
        })
        .then(res => {
          if (res != "undefined") {
            this.recommendDisplayPage = res.data.data;
          }
        })
        .catch(err => {});
    },
    getContentInfo() {
      if (
        this.form.recommendDisplayType != 88 &&
        this.form.recommendDisplayType != 3 &&
        this.form.recommendDisplayType != 6 &&
        this.form.recommendDisplayType != 11) {
        this.loadScrollData(true);
        this.loadScrollData2(true);
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
    loadScrollData(scrollDown) {
      if (scrollDown) {
        if (this.countPage >= this.currentPage) {
          this.$store
            .dispatch("axios_get_pageSkipList", {
              themeId: this.form.more1,
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
    selectCommpage(themeId){
      this.$forceUpdate();
      this.form.more1 = themeId;
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

    //推荐跳转类型
    getRecomType() {
      this.$store
        .dispatch("axios_get_selectDictDataByType", {
          dictType: "recommend_display_type"
        })
        .then(res => {
          this.recommendDisplayTypes = res.data.data;
        })
        .catch();
    },
    //根据选择跳转类型 切换跳转名称
    selectRecomType(val, rv) {
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
            this.$forceUpdate();
          }
        }
      });
    },
    //删除焦点图片
    removefocus(f, fl) {
      this.form.focusList.forEach((item, index) => {
        if (item.id == f.id) {
          this.form.focusList.splice(index, 1);
        }
      });
      this.$store
        .dispatch("axios_delete_pageComponentRoomConfig", {
          id: f.id,
        })
        .then((res) => {
          if (res.data.errorCode == "1000") {
            this.$message.success("删除操作成功！");
          } else {
            this.$message.error(res.data.errorMsg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //删除隐藏图片
    removeHide(f, fl) {
      this.form.hideList.forEach((item, index) => {
        if (item.id == f.id) {
          this.form.hideList.splice(index, 1);
        }
      });
      this.$store
        .dispatch("axios_delete_pageComponentRoomConfig", {
          id: f.id,
        })
        .then((res) => {
          if (res.data.errorCode == "1000") {
            this.$message.success("删除操作成功！");
          } else {
            this.$message.error(res.data.errorMsg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //删除标签图片
    removeLabel(f, fl) {
      this.form.labelList.forEach((item, index) => {
        if (item.id == f.id) {
          this.form.labelList.splice(index, 1);
        }
      });
      this.$store
        .dispatch("axios_delete_pageComponentRoomConfig", {
          id: f.id,
        })
        .then((res) => {
          if (res.data.errorCode == "1000") {
            this.$message.success("删除操作成功！");
          } else {
            this.$message.error(res.data.errorMsg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //删除显示图片
    removeShow(f, fl, type) {
      this.form.showList.forEach((item, index) => {
        if (item.id == f.id) {
          this.form.showList.splice(index, 1);
        }
      });
      this.$store
        .dispatch("axios_delete_pageComponentRoomConfig", {
          id: f.id,
        })
        .then((res) => {
          if (res.data.errorCode == "1000") {
            this.$message.success("删除操作成功！");
          } else {
            this.$message.error(res.data.errorMsg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //上传图片 四种类型
    recomUploadSuccess(file1, type, picType) {
      let files = this.form[type];
      let file = Object.assign({}, file1);
      file.name = file.picCname;
      file.url = this.imagesBaseUrl + file.picPath;
      file.picId = file.id;
      file.picType = picType;
      file.id = file.id + new Date().getTime();
      this.form[type] = [].concat(files).concat(file);
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let componentRoomConfigs = [];
          let formData = {};
          if (this.actionEle == "add") {
            //添加图片到布局
            this.form.labelList &&
              this.form.labelList.forEach(file => {
                componentRoomConfigs.push({
                  picId: file.picId,
                  picType: file.picType,
                  recommendConfigPics: Object.assign(file)
                });
              });
            this.form.focusList &&
              this.form.focusList.forEach(file => {
                componentRoomConfigs.push({
                  picId: file.picId,
                  picType: file.picType,
                  recommendConfigPics: Object.assign(file)
                });
              });
            this.form.hideList &&
              this.form.hideList.forEach(file => {
                componentRoomConfigs.push({
                  picId: file.picId,
                  picType: file.picType,
                  recommendConfigPics: Object.assign(file)
                });
              });
            this.form.showList &&
              this.form.showList.forEach(file => {
                componentRoomConfigs.push({
                  picId: file.picId,
                  picType: file.picType,
                  recommendConfigPics: Object.assign(file)
                });
              });
            Object.assign(formData, this.form);
            delete formData.labelList;
            delete formData.focusList;
            delete formData.showList;
            delete formData.hideList;
            delete formData.recommendConfigPics;
            delete formData.url;
            formData.componentRoomConfigs = componentRoomConfigs;
          } else {
            this.form.labelList &&
              this.form.labelList.forEach(file => {
                if (file.recommendConfigPics == undefined) {
                  componentRoomConfigs.push({
                    picId: file.picId,
                    picType: file.picType,
                    recommendConfigPics: Object.assign(file)
                  });
                } else {
                  componentRoomConfigs.push(Object.assign(file, {}));
                }
              });
            this.form.focusList &&
              this.form.focusList.forEach(file => {
                if (file.recommendConfigPics == undefined) {
                  componentRoomConfigs.push({
                    picId: file.picId,
                    picType: file.picType,
                    recommendConfigPics: Object.assign(file)
                  });
                } else {
                  componentRoomConfigs.push(Object.assign(file, {}));
                }
              });
            this.form.hideList &&
              this.form.hideList.forEach(file => {
                if (file.recommendConfigPics == undefined) {
                  componentRoomConfigs.push({
                    picId: file.picId,
                    picType: file.picType,
                    recommendConfigPics: Object.assign(file)
                  });
                } else {
                  componentRoomConfigs.push(Object.assign(file, {}));
                }
              });
            this.form.showList &&
              this.form.showList.forEach(file => {
                if (file.recommendConfigPics == undefined) {
                  componentRoomConfigs.push({
                    picId: file.picId,
                    picType: file.picType,
                    recommendConfigPics: Object.assign(file)
                  });
                } else {
                  componentRoomConfigs.push(Object.assign(file, {}));
                }
              });
            Object.assign(formData, this.form);
            delete formData.labelList;
            delete formData.focusList;
            delete formData.showList;
            delete formData.hideList;
            delete formData.recommendConfigPics;
            delete formData.url;
            formData.componentRoomConfigs = componentRoomConfigs;
            let arr = [];
            arr.push(this.form.commpageId);
            arr.push(this.commpageId2);
            arr.push(this.commpageId3);
            arr = arr.filter(function (ele) {
              return ele != "" && ele != undefined;
            });
            formData.more1 = this.form.more1;
            if (
              this.form.recommendDisplayType != 88 &&
              this.form.recommendDisplayType != 3 &&
              this.form.recommendDisplayType != 6 &&
              this.form.recommendDisplayType != 11
            ) {
              formData.commpageId = arr.join("$");
            } else {
              formData.more1 = "";
              formData.commpageId = "";
              this.commpageId2 = "";
              this.commpageId3 = "";
            }
            if(this.form.recommendDisplayType == 7){
              try {
                formData.recommendDisplayValue = this.form.recommendDisplayValue.join(",");              
              } catch (error) {
                formData.recommendDisplayValue = this.defaultDisplayValue.join(",");
              }
            }
            eventBus.$emit("componentRoomConfigs", formData);
            this.dialogVisible = false;
          }
        }
      });
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
.balnce ul li {
  list-style-type: none;
  float: left;
  margin-left: 10px;
  margin-top: 10px;
}
</style>
