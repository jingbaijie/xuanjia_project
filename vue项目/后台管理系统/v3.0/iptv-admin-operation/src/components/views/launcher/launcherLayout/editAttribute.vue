<template>
  <div>
    <el-dialog
      width="75vw"
      v-dialogDrag
      ref="dialog__wrapper"
      title="属性设置"
      :visible.sync="dialogVisible"
     
    >
      <div class="dialog">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="add_btn">
              <el-button type="success" size="mini" plain @click="addConfigs()"
                >添 加</el-button
              >
              <el-button
                type="primary"
                size="mini"
                plain
                @click="onSubmit('form')"
                >提 交</el-button
              >
            </div>
            <el-form :model="form" ref="form" :rules="rules">
              <el-form-item
                label="跳转地址类型"
                :label-width="formLabelWidth"
                prop="recommendDisplayType"
              >
                <el-select
                  v-model="form.recommendDisplayType"
                  @change="selectRecomType"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in recommendDisplayTypes"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="通用页面"
                v-if="
                  form.recommendDisplayType == 7 ||
                    form.recommendDisplayType == 1
                "
                :label-width="formLabelWidth"
                prop="recommendDisplayValue"
              >
                <el-select
                  @change="$forceUpdate()"
                  v-selectScroll="loadScrollData"
                  :filter-method="bySearchValue"
                  filterable
                  v-model="form.recommendDisplayValue"
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
                prop="recommendDisplayValue"
              >
                <el-select
                  @change="$forceUpdate()"
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
                    :value="item.recommendDisplayName"
                  ></el-option>
                </el-select>
                <el-input
                  props="recommendDisplayValue"
                  v-if="
                    form.recommendDisplayType == 3 ||
                      form.recommendDisplayType == 8 ||
                      form.recommendDisplayType == 88
                  "
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
                <el-input
                  v-model="form.recommendTrackName"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="rankId"
                :label-width="formLabelWidth"
                prop="rankId"
              >
                <el-input-number
                  v-model="form.rankId"
                  :min="0"
                ></el-input-number>
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
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="显示图片" :label-width="formLabelWidth">
                    <el-popover placement="right" width="535" trigger="hover">
                      <img
                        class="flagImage"
                        slot="reference"
                        :src="recommendPic"
                        alt
                      />
                      <image_choice
                        @getSelectImage="img => setImg(img, 0)"
                      ></image_choice>
                    </el-popover>
                  </el-form-item>
                  <el-form-item label="标签图片" :label-width="formLabelWidth">
                    <el-popover placement="right" width="535" trigger="hover">
                      <img
                        class="flagImage"
                        slot="reference"
                        :src="recommendLabelPic"
                        alt
                      />
                      <image_choice
                        @getSelectImage="img => setImg(img, 1)"
                      ></image_choice>
                    </el-popover>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="焦点图片" :label-width="formLabelWidth">
                    <el-popover placement="right" width="535" trigger="hover">
                      <img
                        class="flagImage"
                        slot="reference"
                        :src="recommendFocusPic"
                        alt
                      />
                      <image_choice
                        @getSelectImage="img => setImg(img, 2)"
                      ></image_choice>
                    </el-popover>
                  </el-form-item>
                  <el-form-item label="角标图片" :label-width="formLabelWidth">
                    <el-popover placement="right" width="535" trigger="hover">
                      <img
                        class="flagImage"
                        slot="reference"
                        :src="recommendCornerPic"
                        alt
                      />
                      <image_choice
                        @getSelectImage="img => setImg(img, 3)"
                      ></image_choice>
                    </el-popover>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
          <el-col :span="12">
            <el-table
              :data="textTableData"
              border
              style="width: 100%; margin-bottom: 40px"
              :height="tableHeight"
            >
              <el-table-column
                prop="configType"
                label="属性类型"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="configName"
                label="属性名称"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="configValue"
                label="属性值"
                align="center"
              ></el-table-column>
              <el-table-column align="center" label="操作" width="200">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="handelEdit(scope.$index, scope.row)"
                    >编辑</el-button
                  >
                  <el-button
                    size="mini"
                    type="danger"
                    v-if="scope.row.id"
                    @click="handleDelete(scope.row)"
                    >删除</el-button
                  >
                  <el-button
                    size="mini"
                    type="danger"
                    v-else
                    @click="delText(scope.$index, scope.row)"
                    >移除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-table
              :data="imgTableData"
              border
              style="width: 100%"
              :height="tableHeight"
            >
              <el-table-column
                prop="configType"
                label="属性类型"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="picType"
                label="图片类型"
                align="center"
              ></el-table-column>
              <el-table-column prop="pic" label="图片" align="center">
                <template slot-scope="scope">
                  <img
                    :style="{ width: '50px' }"
                    v-if="scope.row.recommendConfigPics"
                    :src="imagesBaseUrl + scope.row.recommendConfigPics.picPath"
                    alt
                  />
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="200">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="handelEdit(scope.$index, scope.row)"
                    >编辑</el-button
                  >
                  <el-button
                    size="mini"
                    type="danger"
                    v-if="scope.row.id"
                    @click="handleDelete(scope.row)"
                    >删除</el-button
                  >
                  <el-button
                    size="mini"
                    type="danger"
                    v-else
                    @click="delPic(scope.$index, scope.row)"
                    >移除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <el-dialog
      width="30vw"
      ref="dialog__wrapper"
      title="添加属性"
      :visible.sync="dialogPicForm"
    >
      <el-form
        :model="picForm"
        ref="picForm"
        class="demo-form-inline"
        :rules="configRules"
      >
        <el-form-item
          label="属性类型"
          :label-width="formLabelWidth"
          prop="configType"
        >
          <el-radio-group v-model="picForm.configType">
            <el-radio :label="1">图片</el-radio>
            <el-radio :label="2">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="picForm.configType == '2'">
          <el-form-item label="属性名称" :label-width="formLabelWidth">
            <el-input v-model.number="picForm.configName"></el-input>
          </el-form-item>
          <el-form-item label="属性值" :label-width="formLabelWidth">
            <el-input v-model.number="picForm.configValue"></el-input>
          </el-form-item>
          <el-form-item label="xValue" :label-width="formLabelWidth">
            <el-input v-model.number="picForm.xValue"></el-input>
          </el-form-item>
          <el-form-item label="yValue" :label-width="formLabelWidth">
            <el-input v-model.number="picForm.yValue"></el-input>
          </el-form-item>
          <el-form-item label="rankId" :label-width="formLabelWidth">
            <el-input-number
              v-model="picForm.rankId"
              :min="0"
            ></el-input-number>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item label="图片类型" :label-width="formLabelWidth">
            <el-select v-model="picForm.picType" placeholder="请选择">
              <el-option
                v-for="item in picTypeList"
                :key="item.id"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图片" :label-width="formLabelWidth">
            <el-popover placement="right" width="535" trigger="hover">
              <img
                class="flagImage"
                slot="reference"
                :src="elementPicUrl"
                alt
              />
              <image_choice
                @getSelectImage="img => setImg(img, 4)"
              ></image_choice>
            </el-popover>
          </el-form-item>
          <el-form-item label="xValue" :label-width="formLabelWidth">
            <el-input v-model.number="picForm.xValue"></el-input>
          </el-form-item>
          <el-form-item label="yValue" :label-width="formLabelWidth">
            <el-input v-model.number="picForm.yValue"></el-input>
          </el-form-item>
          <el-form-item label="rankId" :label-width="formLabelWidth">
            <el-input-number
              v-model="picForm.rankId"
              :min="0"
            ></el-input-number>
          </el-form-item>
        </div>
        <div style="text-align: center">
          <el-button type="primary" @click="onSubmitPicText('picForm')"
            >保 存</el-button
          >
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import defaultFocus from "@/assets/images/add2.jpg";
import image_choice from "@/components/widget/ImageChoiceWidget";
export default {
  name: "editAttribute",
  components: { image_choice, defaultFocus },
  data() {
    return {
      recommendPic: defaultFocus,
      recommendLabelPic: defaultFocus,
      recommendFocusPic: defaultFocus,
      recommendCornerPic: defaultFocus,
      elementPicUrl: defaultFocus,
      dialogVisible: false,
      recommendDisplayPage: [],
      classifyData: [],
      currentPage: "",
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      defaultProps: {
        children: "childrenList",
        label: "typeCname",
        value: "id",
        checkStrictly: true,
        emitPath: false
      },
      recommendDisplayNames: [],
      // 推荐详表显示的类型 0 游戏 ，1 卡通， 2视频 ，3 跳转指定地址 ，4 通用页面id ，5 活动id ，6专题 ，7分类内容 ，8卡通需要鉴权，9历史记录，10智能推荐，88其它
      recommendDisplayTypes: [],
      form: {},
      formLabelWidth: "125px",
      recommendName: "",
      dialogImageUrl: "",
      searchValues: "",
      countPage: 1,
      rules: {
        recommendDisplayType: [
          { required: true, message: "必填项", trigger: "blur" }
        ],
        recommendDisplayValue: [
          { required: true, message: "必填项", trigger: "blur" }
        ],
        rankId: [{ required: true, message: "必填项", trigger: "blur" }]
      },
      configRules: {
        configType: [{ required: true, message: "必填项", trigger: "blur" }]
      },
      picAction: "",
      dialogPicForm: false,
      imgTableData: [],
      textTableData: [],
      picTypeList: [],
      picForm: {
        id: undefined,
        configType: undefined,
        configName: undefined,
        configValue: undefined,
        picType: undefined,
        rankId: undefined,
        xValue: undefined,
        yValue: undefined
      },
      tableHeight: undefined
    };
  },
  created() {
    eventBus.$on("editAttribute", item => {
      this.dialogVisible = true;
      this.tableHeight = "320px";
      //编辑单个推荐回显
      this.form = item;
      if (this.form["recommendPic"]) {
        this.recommendPic =
          this.imagesBaseUrl + this.form["recommendPic"].picPath;
      } else if (item.recommendPic) {
        this.recommendPic = this.imagesBaseUrl + item.recommendPic.picPath;
      } else {
        this.recommendPic = defaultFocus;
      }
      if (this.form["recommendLabelPic"]) {
        this.recommendLabelPic =
          this.imagesBaseUrl + this.form["recommendLabelPic"].picPath;
      } else if (item.recommendLabelpic) {
        this.recommendLabelPic =
          this.imagesBaseUrl + item.recommendLabelpic.picPath;
      } else {
        this.recommendLabelPic = defaultFocus;
      }
      if (this.form["recommendFocusPic"]) {
        this.recommendFocusPic =
          this.imagesBaseUrl + this.form["recommendFocusPic"].picPath;
      } else if (item.recommendFocuspic) {
        this.recommendFocusPic =
          this.imagesBaseUrl + item.recommendFocuspic.picPath;
      } else {
        this.recommendFocusPic = defaultFocus;
      }
      if (this.form["recommendCornerPic"]) {
        this.recommendCornerPic =
          this.imagesBaseUrl + this.form["recommendCornerPic"].picPath;
      } else if (item.recommendCornerpic) {
        this.recommendCornerPic =
          this.imagesBaseUrl + item.recommendCornerpic.picPath;
      } else {
        this.recommendCornerPic = defaultFocus;
      }
      let arr1 = [];
      let arr2 = [];

      item.componentRoomConfigs &&
        item.componentRoomConfigs.forEach(e => {
          if (e.configType == 1) {
            arr1.push(e);
          } else {
            arr2.push(e);
          }
        });
      this.imgTableData = arr1;
      this.textTableData = arr2;
      this.form.recommendDisplayType = item.recommendDisplayType + "";
      this.$set(this.form, "recommendDisplayValue", item.recommendDisplayValue);
      this.selectRecomType(
        item.recommendDisplayType,
        item.recommendDisplayValue
      );
      this.getContentInfo();
      this.getformCurrency();
    });
    this.getRecommendDisplayTypes();
    this.getPicType();
  },
  mounted() {
    this.getClassifyList();
  },
  methods: {
    setImg(item, type) {
      if (type == 0) {
        this.recommendPic = this.imagesBaseUrl + item.picPath;
        this.form["recommendPic"] = {};
        this.form["recommendPic"].id = item.id;
        this.form["recommendPic"].picPath = item.picPath;
        this.form.recommendPicId = item.id;
      } else if (type == 1) {
        this.recommendLabelPic = this.imagesBaseUrl + item.picPath;
        this.form["recommendLabelPic"] = {};
        this.form["recommendLabelPic"].id = item.id;
        this.form["recommendLabelPic"].picPath = item.picPath;
        this.form.recommendLabelpicId = item.id;
      } else if (type == 2) {
        this.recommendFocusPic = this.imagesBaseUrl + item.picPath;
        this.form["recommendFocusPic"] = {};
        this.form["recommendFocusPic"].id = item.id;
        this.form["recommendFocusPic"].picPath = item.picPath;
        this.form.recommendFocuspicId = item.id;
      } else if (type == 3) {
        this.recommendCornerPic = this.imagesBaseUrl + item.picPath;
        this.form["recommendCornerPic"] = {};
        this.form["recommendCornerPic"].id = item.id;
        this.form["recommendCornerPic"].picPath = item.picPath;
        this.form.recommendCornerpicId = item.id;
      } else if (type == 4) {
        this.elementPicUrl = this.imagesBaseUrl + item.picPath;
        this.picForm["recommendConfigPics"] = {};
        this.picForm["recommendConfigPics"].id = item.id;
        this.picForm["recommendConfigPics"].picPath = item.picPath;
        this.picForm.picId = item.id;
      }
    },
    getRecommendDisplayTypes() {
      this.$store
        .dispatch("axios_get_selectDictDataByType", {
          dictType: "recommend_display_type"
        })
        .then(res => {
          this.recommendDisplayTypes = res.data.data;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    loadScrollData(scrollDown) {
      if (scrollDown) {
        if (this.countPage >= this.currentPage) {
          this.$store
            .dispatch("axios_get_pageSkipList", {
              contentType: 4,
              pageNum: ++this.currentPage,
              searchValue: this.searchValues
            })
            .then(res => {
              if (res != "undefined") {
                this.recommendDisplayPage = this.recommendDisplayPage.concat(
                  res.data.data
                );
              }
            });
        }
      }
    },
    getformCurrency() {
      this.$store
        .dispatch("axios_get_pageSkipList", {
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
    //获取图片类型
    getPicType() {
      this.$store
        .dispatch("axios_get_selectDictDataByType", {
          dictType: "room_pic_type"
        })
        .then(res => {
          this.picTypeList = res.data.data;
        })
        .catch();
    },
    addConfigs() {
      this.dialogPicForm = true;
      this.picAction = "add";
      this.picForm = {
        id: undefined,
        configType: 1,
        configName: undefined,
        configValue: undefined,
        picType: undefined,
        rankId: undefined,
        xValue: undefined,
        yValue: undefined
      };
      this.elementPicUrl = defaultFocus;
    },
    handelEdit(index, row) {
      this.dialogPicForm = true;
      this.picAction = "edit";
      this.picForm = row;
      this.picForm.configType = parseInt(row.configType);
      this.elementPicUrl = row.recommendConfigPics
        ? this.imagesBaseUrl + row.recommendConfigPics.picPath
        : defaultFocus;
    },
    delPic(index, row) {
      this.imgTableData.splice(index, 1);
    },
    delText(index, row) {
      this.textTableData.splice(index, 1);
    },
    // 删除
    handleDelete(row) {
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("axios_delete_pageComponent", {
              id: row.id
            })
            .then(res => {
              if (res.data.errorCode == "1000") {
                this.$message.success("删除操作成功！");
              } else {
                this.$message.error(res.data.errorMsg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    onSubmitPicText(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.imgTableData == undefined) {
            this.imgTableData = [];
          }
          if (this.textTableData == undefined) {
            this.textTableData = [];
          }
          if (this.picAction == "add") {
            if (this.picForm.configType == 1) {
              this.imgTableData.push(Object.assign(this.picForm, {}));
            } else {
              this.textTableData.push(Object.assign(this.picForm, {}));
            }
          }
          this.form.componentRoomConfigs = this.imgTableData.concat(
            this.textTableData
          );
          this.dialogPicForm = false;
        }
      });
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          eventBus.$emit("pageComponents", this.form);
          this.dialogVisible = false;
        }
      });
    }
  },
  destroyed() {
    eventBus.$off(["editAttribute"]);
  }
};
</script>
<style scoped>
.el-input {
  width: 80%;
}
.dialog {
  height: 700px;
  overflow: auto;
}
.flagImage {
  width: 50px;
}
.balnce ul li {
  list-style-type: none;
  float: left;
  margin-left: 10px;
  margin-top: 10px;
}
.add_btn {
  width: 100%;
  margin: 0 0 20px 63%;
}
</style>
