<template>
  <div>
    <el-dialog
      width="75vw"
      v-dialogDrag
      ref="dialog__wrapper"
      title="属性设置"
      :visible.sync="dialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="dialog">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="add_btn">
              <el-button type="primary" size="mini" plain @click="closeDialog()"
                >取 消</el-button
              >
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
                label="频道ID"
                :label-width="formLabelWidth"
                prop="channelType"
              >
                <el-select
                  v-model="form.channelType"
                  placeholder="请选择"
                  @change="$forceUpdate()"
                >
                  <el-option
                    v-for="item in channelList"
                    :key="item.id"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
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
                  form.recommendDisplayType != 88 &&
                  form.recommendDisplayType != 3 &&
                  form.recommendDisplayType != 6 &&
                  form.recommendDisplayType != 11
                "
                :label-width="formLabelWidth"
                prop="commpageId"
              >
                <el-select
                  v-selectScroll="loadScrollData"
                  :filter-method="bySearchValue"
                  filterable
                  v-model="form.commpageId"
                  placeholder="请选择"
                  @change="(val) => getLabelTY(val, recommendDisplayPage)"
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
                  v-selectScroll="loadScrollData"
                  :filter-method="bySearchValue"
                  filterable
                  clearable
                  v-model="commpageId2"
                  placeholder="请选择"
                  @change="(val) => getLabelTY(val, recommendDisplayPage)"
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
                  v-selectScroll="loadScrollData"
                  :filter-method="bySearchValue"
                  filterable
                  clearable
                  v-model="commpageId3"
                  placeholder="请选择"
                  @change="(val) => getLabelTY(val, recommendDisplayPage)"
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
                  form.recommendDisplayType != 4 &&
                  form.recommendDisplayType != 8
                "
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
                  @change="(val) => getLabelTZ(val, recommendDisplayNames)"
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
                <el-select v-model="form.placeHolder" clearable placeholder="请选择">
                  <el-option
                    v-for="(item, index) in placeholderList"
                    :key="index"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="埋点名"
                prop="recommendTrackName"
                :label-width="formLabelWidth"
              >
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
              <el-form-item
                label="more1"
                prop="more1"
                :label-width="formLabelWidth"
              >
                <el-input v-model="form.more1" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item
                label="more2"
                prop="more2"
                :label-width="formLabelWidth"
              >
                <el-input v-model="form.more2" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item
                label="more3"
                prop="more3"
                :label-width="formLabelWidth"
              >
                <el-input v-model="form.more3" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item
                label="more4"
                prop="more4"
                :label-width="formLabelWidth"
              >
                <el-input v-model="form.more4" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item
                label="movetop"
                prop="movetop"
                :label-width="formLabelWidth"
              >
                <el-input v-model="form.movetop" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item
                label="movedown"
                prop="movedown"
                :label-width="formLabelWidth"
              >
                <el-input v-model="form.movedown" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item
                label="moveleft"
                prop="moveleft"
                :label-width="formLabelWidth"
              >
                <el-input v-model="form.moveleft" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item
                label="moveright"
                prop="moveright"
                :label-width="formLabelWidth"
              >
                <el-input v-model="form.moveright" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item
                label="显示图片"
                prop="recommendPic"
                :label-width="formLabelWidth"
              >
                <el-popover placement="right" width="535" trigger="hover">               
                  <img
                      class="flagImage"
                      slot="reference"
                      :src="recommendPic"
                      style="border: 1px solid #ccc"
                      alt
                    />
                  <image_choice
                    @getSelectImage="(img) => setImg(img, 0)"
                  ></image_choice>
                </el-popover>
                <el-button
                  class="remove"
                  v-if="dialogFormVisible1"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  plain
                  circle
                  @click="removePic(0)"
                ></el-button>
              </el-form-item>
              <el-form-item
                label="标签图片"
                prop="recommendLabelPic"
                :label-width="formLabelWidth"
              >
                <el-popover placement="right" width="535" trigger="hover">
                  <img
                    class="flagImage"
                    slot="reference"
                    :src="recommendLabelPic"
                    style="border: 1px solid #ccc"
                    alt
                  />
                  <image_choice
                    @getSelectImage="(img) => setImg(img, 1)"
                  ></image_choice>
                </el-popover>
                <el-button
                  class="remove"
                  v-if="dialogFormVisible2"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  plain
                  circle
                  @click="removePic(1)"
                ></el-button>
              </el-form-item>
              <el-form-item
                label="焦点图片"
                prop="recommendFocusPic"
                :label-width="formLabelWidth"
              >
                <el-popover placement="right" width="535" trigger="hover">
                  <img
                    class="flagImage"
                    slot="reference"
                    :src="recommendFocusPic"
                    style="border: 1px solid #ccc"
                    alt
                  />
                  <image_choice
                    @getSelectImage="(img) => setImg(img, 2)"
                  ></image_choice>
                </el-popover>
                <el-button
                  class="remove"
                  v-if="dialogFormVisible3"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  plain
                  circle
                  @click="removePic(2)"
                ></el-button>
              </el-form-item>
              <el-form-item
                label="角标图片"
                prop="recommendCornerPic"
                :label-width="formLabelWidth"
              >
                <el-popover placement="right" width="535" trigger="hover">
                  <img
                    class="flagImage"
                    slot="reference"
                    :src="recommendCornerPic"
                    style="border: 1px solid #ccc"
                    alt
                  />
                  <image_choice
                    @getSelectImage="(img) => setImg(img, 3)"
                  ></image_choice>
                </el-popover>
                <el-button
                  class="remove"
                  v-if="dialogFormVisible4"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  plain
                  circle
                  @click="removePic(3)"
                ></el-button>
              </el-form-item>
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
              >
                <template slot-scope="scope">
                  {{ configType[scope.row.configType] }}
                </template>
              </el-table-column>
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
                  <el-button size="mini" @click="handelEdit(scope.row)"
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
                    @click="delText(scope.$index)"
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
              >
                <template slot-scope="scope">
                  {{ configType[scope.row.configType] }}
                </template>
              </el-table-column>
              <el-table-column label="图片类型" align="center">
                <template slot-scope="scope">
                  {{ scope.row.configName }}
                </template>
              </el-table-column>
              <el-table-column prop="pic" label="图片" align="center">
                <template slot-scope="scope">
                  <img
                    :style="{ width: '50px' }"
                    v-if="scope.row.pic"
                    :src="imagesBaseUrl + scope.row.pic.picPath"
                    alt
                  />
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="200">
                <template slot-scope="scope">
                  <el-button size="mini" @click="handelEdit(scope.row)"
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
                    @click="delPic(scope.$index)"
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
            <el-input v-model="picForm.configName"></el-input>
          </el-form-item>
          <el-form-item label="属性值" :label-width="formLabelWidth">
            <el-input v-model="picForm.configValue"></el-input>
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
            <el-select
              v-model="picForm.picType"
              placeholder="请选择"
              @change="(val) => getPicTypeName(val, picTypeList)"
            >
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
                @getSelectImage="(img) => setImg(img, 4)"
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
  props: ["channelList"],
  components: { image_choice, defaultFocus },
  data() {
    return {
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      dialogFormVisible4: false,
      recommendPic: defaultFocus,
      recommendLabelPic: defaultFocus,
      recommendFocusPic: defaultFocus,
      recommendCornerPic: defaultFocus,
      elementPicUrl: defaultFocus,
      dialogVisible: false,
      recommendDisplayPage: [],
      classifyData: [],
      currentPage: 1,
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      defaultProps: {
        children: "childrenList",
        label: "typeCname",
        value: "id",
      },
      recommendDisplayNames: [],
      recommendDisplayTypes: [],
      placeholderList: [],
      form: {},
      formLabelWidth: "140px",
      recommendName: "",
      dialogImageUrl: "",
      searchValues: "",
      countPage: 1,
      commpageId2: undefined,
      commpageId3: undefined,
      rules: {
        channelType: [{ required: true, message: "必填项", trigger: "blur" }],
        recommendDisplayType: [
          { required: true, message: "必填项", trigger: "blur" },
        ],
        recommendDisplayValue: [
          { required: true, message: "必填项", trigger: "blur" },
        ],
        commpageId: [{ required: true, message: "必填项", trigger: "blur" }],
        rankId: [{ required: true, message: "必填项", trigger: "blur" }],
      },
      configRules: {
        configType: [{ required: true, message: "必填项", trigger: "blur" }],
      },
      configType: {
        1: "图片",
        2: "其他",
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
        yValue: undefined,
      },
      tableHeight: undefined,
      themeId: "",
      defaultDisplayValue: []
    };
  },
  created() {
    eventBus.$on("editAttribute", (data, id, themeType) => {
      this.themeId = id;
      this.dialogVisible = true;
      this.tableHeight = "320px";
      let item = JSON.parse(JSON.stringify(data));
      this.$nextTick(() => {
        //编辑单个推荐回显
        this.form = item;
        if (item.channelType) {
          this.form.channelType = item.channelType;
        } else {
          this.form.channelType = themeType;
        }
        if (this.form["recommendPic"]) {
          this.recommendPic =
            this.imagesBaseUrl + this.form["recommendPic"].picPath;
          this.dialogFormVisible1 = true;
        } else if (item.recommendPic) {
          this.recommendPic = this.imagesBaseUrl + item.recommendPic.picPath;
          this.dialogFormVisible1 = true;
        } else {
          this.recommendPic = defaultFocus;
          this.dialogFormVisible1 = false;
        }
        if (this.form["recommendLabelpic"]) {
          this.recommendLabelPic =
            this.imagesBaseUrl + this.form["recommendLabelpic"].picPath;
          this.dialogFormVisible2 = true;
        } else if (item.recommendLabelpic) {
          this.recommendLabelPic =
            this.imagesBaseUrl + item.recommendLabelpic.picPath;
          this.dialogFormVisible2 = true;
        } else {
          this.recommendLabelPic = defaultFocus;
          this.dialogFormVisible2 = false;
        }
        if (this.form["recommendFocuspic"]) {
          this.recommendFocusPic =
            this.imagesBaseUrl + this.form["recommendFocuspic"].picPath;
          this.dialogFormVisible3 = true;
        } else if (item.recommendFocuspic) {
          this.recommendFocusPic =
            this.imagesBaseUrl + item.recommendFocuspic.picPath;
          this.dialogFormVisible3 = true;
        } else {
          this.recommendFocusPic = defaultFocus;
          this.dialogFormVisible3 = false;
        }
        if (this.form["recommendCornerpic"]) {
          this.recommendCornerPic =
            this.imagesBaseUrl + this.form["recommendCornerpic"].picPath;
          this.dialogFormVisible4 = true;
        } else if (item.recommendCornerpic) {
          this.recommendCornerPic =
            this.imagesBaseUrl + item.recommendCornerpic.picPath;
          this.dialogFormVisible4 = true;
        } else {
          this.recommendCornerPic = defaultFocus;
          this.dialogFormVisible4 = false;
        }
        let arr1 = [];
        let arr2 = [];
        item.componentRoomConfigs.forEach((e) => {
          if (e.configType == 1) {
            arr1.push(e);
          } else {
            arr2.push(e);
          }
        });
        this.imgTableData = arr1;
        this.textTableData = arr2;
        if (item.commpageId != undefined && item.commpageId != "") {
          let arr = item.commpageId.split("$");
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
        if (item.recommendDisplayType == null) {
          this.form.recommendDisplayType = "";
        } else {
          this.form.recommendDisplayType = item.recommendDisplayType + "";
        }
        if (this.form.recommendDisplayType == 7) {
          let arr = item.recommendDisplayValue.split(",");
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
            item.recommendDisplayValue
          );
        } else {
          this.$set(
            this.form,
            "recommendDisplayValue",
            Number(item.recommendDisplayValue)
          );
        }
        this.selectRecomType(
          item.recommendDisplayType,
          item.recommendDisplayValue
        );
      });
    });
    this.getRecommendDisplayTypes();
    this.getPicType();
    this.getPlaceholder();
  },
  mounted() {
    this.getClassifyList();
  },
  methods: {
    getPicTypeName(val, data) {
      this.$forceUpdate();
      let obj = {};
      obj = data.find((item) => {
        return item.dictValue === val;
      });
      this.picForm.configName = obj.dictLabel;
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

    closeDialog() {
      this.dialogVisible = false;
      this.$refs.form.resetFields();
      this.imgTableData = [];
      this.textTableData = [];
    },
    onInput() {
      this.$forceUpdate();
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
    getLabelTZ(val, data) {
      this.$forceUpdate();
      let obj = {};
      obj = data.find((item) => {
        return item.recommendDisplayValue === val;
      });
      this.form.recommendDisplayName = obj.recommendDisplayName;
    },
    setImg(item, type) {
      if (type == 0) {
        this.recommendPic = this.imagesBaseUrl + item.picPath;
        this.form["recommendPic"] = {};
        this.form["recommendPic"].id = item.id;
        this.form["recommendPic"].picPath = item.picPath;
        this.form.recommendPicId = item.id;
        this.dialogFormVisible1 = true;
      } else if (type == 1) {
        this.recommendLabelPic = this.imagesBaseUrl + item.picPath;
        this.form["recommendLabelpic"] = {};
        this.form["recommendLabelpic"].id = item.id;
        this.form["recommendLabelpic"].picPath = item.picPath;
        this.form.recommendLabelpicId = item.id;
        this.dialogFormVisible2 = true;
      } else if (type == 2) {
        this.recommendFocusPic = this.imagesBaseUrl + item.picPath;
        this.form["recommendFocuspic"] = {};
        this.form["recommendFocuspic"].id = item.id;
        this.form["recommendFocuspic"].picPath = item.picPath;
        this.form.recommendFocuspicId = item.id;
        this.dialogFormVisible3 = true;
      } else if (type == 3) {
        this.recommendCornerPic = this.imagesBaseUrl + item.picPath;
        this.form["recommendCornerpic"] = {};
        this.form["recommendCornerpic"].id = item.id;
        this.form["recommendCornerpic"].picPath = item.picPath;
        this.form.recommendCornerpicId = item.id;
        this.dialogFormVisible4 = true;
      } else if (type == 4) {
        this.elementPicUrl = this.imagesBaseUrl + item.picPath;
        this.picForm["pic"] = {};
        this.picForm["pic"].id = item.id;
        this.picForm["pic"].picPath = item.picPath;
        this.picForm.picId = item.id;
      }
    },
    removePic(type) {
      if (type == 0) {
        this.recommendPic = defaultFocus;
        this.form["recommendPic"] = null;
        this.form.recommendPicId = null;
        this.dialogFormVisible1 = false;
      } else if (type == 1) {
        this.recommendLabelPic = defaultFocus;
        this.form.recommendLabelpic = null;
        this.form.recommendLabelpicId = null;
        this.dialogFormVisible2 = false;
      } else if (type == 2) {
        this.recommendFocusPic = defaultFocus;
        this.form.recommendFocuspic = null;
        this.form.recommendFocuspicId = null;
        this.dialogFormVisible3 = false;
      } else if (type == 3) {
        this.recommendCornerPic = defaultFocus;
        this.form.recommendCornerpic = null;
        this.form.recommendCornerpicId = null;
        this.dialogFormVisible4 = false;
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
              themeId: this.themeId,
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
          themeId: this.themeId,
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
    getContentInfo() {
      if (
        this.form.recommendDisplayType != 88 &&
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
      if (
        this.form.recommendDisplayType == 4 ||
        this.form.recommendDisplayType == 6 ||
        this.form.recommendDisplayType == 11
      ) {
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
    //根据选择跳转类型 切换跳转名称
    selectRecomType(val, rv) {
      this.$forceUpdate();
      this.currentPage = 1;
      this.countPage = 1;
      this.form.recommendDisplayValue = rv ? rv : "";
      if (rv == undefined) {
        this.form.commpageId = "";
        this.commpageId2 = "";
        this.commpageId3 = "";
      }
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
          dictType: "room_pic_type",
        })
        .then((res) => {
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
        yValue: undefined,
      };
      this.elementPicUrl = defaultFocus;
    },
    handelEdit(row) {
      this.dialogPicForm = true;
      this.picAction = "edit";
      this.picForm = row;
      this.picForm.configType = parseInt(row.configType);
      if (row.picType) {
        this.picForm.picType = row.picType.toString();
      }
      this.elementPicUrl = row.pic
        ? this.imagesBaseUrl + row.pic.picPath
        : defaultFocus;
    },
    delPic(index) {
      this.imgTableData.splice(index, 1);
    },
    delText(index) {
      this.textTableData.splice(index, 1);
    },
    // 删除
    handleDelete(row) {
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store
            .dispatch("axios_delete_pageComponentRoomConfig", {
              id: row.id,
            })
            .then((res) => {
              if (res.data.errorCode == "1000") {
                this.$message.success("删除操作成功！");
                eventBus.$emit("getThemePages");
                this.dialogVisible = false;
              } else {
                this.$message.error(res.data.errorMsg);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    onSubmitPicText(formName) {
      this.$refs[formName].validate((valid) => {
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
          this.dialogPicForm = false;
        }
      });
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.componentRoomConfigs = this.imgTableData.concat(
            this.textTableData
          );
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
            this.form.commpageId = "";
            this.commpageId2 = "";
            this.commpageId3 = "";
          }
          if (this.form.recommendDisplayType == 7) {
            try {
              this.form.recommendDisplayValue =
                this.form.recommendDisplayValue.join(",");
            } catch (error) {
              this.form.recommendDisplayValue =
                this.defaultDisplayValue.join(",");
            }
          }
          eventBus.$emit("pageComponents", this.form);
          this.dialogVisible = false;
        }
      });
    },
  },
  destroyed() {
    eventBus.$off(["editAttribute", "getThemePages"]);
  },
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
  margin: 0 0 20px 53%;
}
.remove {
  position: absolute;
  left: 80px;
  top: 5px;
}
</style>
