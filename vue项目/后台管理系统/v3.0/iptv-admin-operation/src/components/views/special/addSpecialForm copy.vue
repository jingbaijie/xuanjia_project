<template>
  <div>
    <el-page-header @back="handleGoBack" content=""> </el-page-header>
    <el-card class="box-card">
      <div slot="header">
        <span>专题基本信息</span>
      </div>
      <el-form :model="pageForm" ref="pageForm" :rules="pageRules">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="页面中文名" :label-width="formLabelWidth">
              <el-input type="text" v-model="pageForm.cname"></el-input>
            </el-form-item>
            <el-form-item label="页面英文名" :label-width="formLabelWidth">
              <el-input type="text" v-model="pageForm.ename"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="选择模板" :label-width="formLabelWidth">
              <el-select
                v-model="pageForm.templateUrl"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in templateList"
                  :key="item.id"
                  :label="item.templateCname"
                  :value="item.id"
                ></el-option> </el-select
            ></el-form-item>
            <el-form-item label="页面高度" :label-width="formLabelWidth">
              <el-input
                type="text"
                v-model="pageForm.pageHeight"
              ></el-input></el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="背景图" :label-width="formLabelWidth">
              <el-popover placement="right" width="535" trigger="hover">
                <img class="flagImage" slot="reference" :src="bgPicUrl" />
                <image_choice
                  @getSelectImage="img => setImg(img, 1)"
                ></image_choice> </el-popover></el-form-item
          ></el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="submitElement()">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-row :gutter="20">
      <el-col :span="18">
        <el-card class="box-card">
          <div slot="header">
            <el-button type="primary" plain @click="openEditElement"
              >创建推荐详情</el-button
            >
            <!-- <el-button type="primary" plain  @click="openModelEditElement">编辑详情</el-button> -->
          </div>
          <div
            ref="canvas"
            class="canvas"
            :style="{
              height: pageForm.pageHeight + 'px',
              backgroundImage: 'url(' + bgPicUrl + ')'
            }"
          >
            <!-- <img
          v-if="imgurl"
          :src="imgurl"
          :style="{
            position: 'relative',
            width: '1280px',
            height: pageForm.height + 'px'
          }"
        /> -->
            <div
              :key="'rooms' + index"
              v-for="(list, index) in roomsData"
              :style="{
                position: 'relative',
                display: 'inline-block !important',
                display: 'inline',
                backgroundColor: '#ddd'
              }"
            >
              <div
                :key="
                  'columnOne' +
                    index +
                    new Date().getTime() +
                    (parseInt(Math.random() * 99999) + 10000)
                "
                v-if="(list.componentRoomConfigs || []).length != 0"
                v-for="item in list.componentRoomConfigs"
                :id="item.id"
                v-recomDrag="{ item }"
                :style="{
                  position: 'relative',
                  top: item.yValue + 'px',
                  left: item.xValue + 'px',
                  display: 'inline-block !important',
                  display: 'inline',
                  width: item.width,
                  height: item.height
                }"
              >
                <img
                  :src="
                    item.recommendConfigPics &&
                      imagesBaseUrl + item.recommendConfigPics.picPath
                  "
                  @mouseover.stop="editElement(list, item)"
                  class="recommends"
                  :style="{
                    width: item && item.picW,
                    height: item && item.picH
                  }"
                />
                <!-- 
                @mouseover.stop="editElement(list,item,list.componentRoomConfigs)" -->
                <el-button
                  class="el-icon-edit"
                  :style="{ fontSize: '24px' }"
                  type="text"
                  @click.stop="openModelEditElement(list, item)"
                ></el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header">
            <span>专题列表</span>
          </div>
          <ul>
            <li v-for="item in roomsData">
              <!-- <img
                :src="
                  item.componentRoomConfigs[0] &&
                    imagesBaseUrl +
                      item.componentRoomConfigs[0].recommendConfigPics.picPath
                "
                class="recommends"
                :style="{
                  width: '50px',
                  height: '30px'
                }"
              /> -->
              {{ item.rankId }}
              <el-button
                v-if="item.rankId"
                style="float: right"
                type="danger"
                size="mini"
                icon="el-icon-delete"
                circle
                @click="delSpecialElement(item)"
              ></el-button>
              <el-divider></el-divider>
            </li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
    <el-card class="box-card" v-if="showConfig">
      <div slot="header">
        <span>配置</span>
      </div>
      <el-row :gutter="18">
        <el-col :span="16">
          <el-form
            :inline="true"
            :model="elementItemForm"
            class="demo-form-inline"
          >
            <el-row :gutter="18">
              <el-col :span="8">
                <el-form-item
                  label="跳转地址类型"
                  :label-width="formLabelWidth"
                >
                  <el-select
                    v-model="elementItemForm.recommendDisplayType"
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
                  label="通用页面"
                  v-if="
                    elementItemForm.recommendDisplayType == 7 ||
                      elementItemForm.recommendDisplayType == 1
                  "
                  :label-width="formLabelWidth"
                  prop="commpageId"
                >
                  <el-select
                    :filter-method="bySearchValue"
                    filterable
                    v-model="elementItemForm.commpageId"
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
                  :label="'跳转' + recommendName + '名称'"
                  :label-width="formLabelWidth"
                  prop="recommendDisplayValue"
                >
                  <el-select
                    v-selectScroll="loadScrollData2"
                    :filter-method="bySearchValue2"
                    v-if="
                      elementItemForm.recommendDisplayType != 8 &&
                        elementItemForm.recommendDisplayType != 3 &&
                        elementItemForm.recommendDisplayType != 7 &&
                        elementItemForm.recommendDisplayType != 88
                    "
                    v-model="elementItemForm.recommendDisplayValue"
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
                    props="recommendDisplayValue"
                    v-if="
                      elementItemForm.recommendDisplayType == 3 ||
                        elementItemForm.recommendDisplayType == 8 ||
                        elementItemForm.recommendDisplayType == 88
                    "
                    v-model="elementItemForm.recommendDisplayValue"
                    autocomplete="off"
                  ></el-input>
                  <el-cascader
                    v-if="elementItemForm.recommendDisplayType == 7"
                    v-model="elementItemForm.recommendDisplayValue"
                    placeholder="搜索"
                    :options="classifyData"
                    :props="defaultProps"
                    size="medium"
                  ></el-cascader>
                </el-form-item>
                <el-form-item label="status" :label-width="formLabelWidth">
                  <el-input
                    v-model="elementItemForm.status"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
                <el-form-item label="埋点名" :label-width="formLabelWidth">
                  <el-input
                    v-model="elementItemForm.recommendTrackName"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="xValue" :label-width="formLabelWidth">
                  <el-input
                    v-model.number="elementItemForm.xValue"
                    placeholder="xValue"
                  ></el-input>
                </el-form-item>
                <el-form-item label="yValue" :label-width="formLabelWidth">
                  <el-input
                    v-model.number="elementItemForm.yValue"
                    placeholder="yValue"
                  ></el-input>
                </el-form-item>

                <!-- <el-form-item label="width" :label-width="formLabelWidth">
                  <el-input
                    v-model.number="elementForm.width"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>

                <el-form-item label="height" :label-width="formLabelWidth">
                  <el-input
                    v-model.number="elementForm.height"
                    autocomplete="off"
                  ></el-input>
                </el-form-item> -->
                <el-form-item label="是否免费" :label-width="formLabelWidth">
                  <el-switch
                    v-model="elementItemForm.isFree"
                    :active-value="0"
                    :inactive-value="1"
                  ></el-switch>
                </el-form-item>
                <el-form-item
                  class="el_title"
                  :label-width="formLabelWidth"
                  label="排行ID"
                >
                  <el-input-number
                    size="small"
                    v-model="elementItemForm.rankId"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="上"
                  :label-width="formLabelWidth"
                  style="float:left"
                >
                  <el-input-number
                    v-model="elementItemForm.movetop"
                    :min="0"
                    controls-position="right"
                  ></el-input-number>
                </el-form-item>
                <el-form-item
                  label="下"
                  :label-width="formLabelWidth"
                  style="float:left"
                >
                  <el-input-number
                    v-model="elementItemForm.movedown"
                    controls-position="right"
                    :min="0"
                  ></el-input-number>
                </el-form-item>
                <el-form-item
                  label="左"
                  :label-width="formLabelWidth"
                  style="float:left"
                >
                  <el-input-number
                    v-model="elementItemForm.moveleft"
                    :min="0"
                    controls-position="right"
                  ></el-input-number>
                </el-form-item>
                <el-form-item
                  label="右"
                  :label-width="formLabelWidth"
                  style="float:left"
                >
                  <el-input-number
                    v-model="elementItemForm.moveright"
                    controls-position="right"
                    :min="0"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="8"> </el-col>
              <el-col :span="16"> </el-col>
            </el-row>
          </el-form>
          <el-form :inline="true" :model="elementForm" class="demo-form-inline">
            <el-row :gutter="18">
              <el-form-item label="标签图片" :label-width="formLabelWidth">
                <el-upload
                  class="upload-demo"
                  action
                  :file-list="elementForm.labelList"
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
                    <el-button
                      slot="reference"
                      size="small"
                      type="primary"
                      plain
                      >添 加</el-button
                    >
                    <transition name="fade-transform" mode="out-in">
                      <div class="balnce">
                        <image_choice
                          @getSelectImage="
                            img => picUploadSuccess(img, 'labelList', 1)
                          "
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
                  :multiple="true"
                  :file-list="elementForm.focusList"
                  :on-remove="removefocus"
                  list-type="picture"
                >
                  <el-popover
                    slot="tip"
                    placement="right"
                    width="535"
                    trigger="hover"
                    v-model="dialogFormVisible5"
                  >
                    <el-button
                      slot="reference"
                      size="small"
                      type="primary"
                      plain
                      >添 加</el-button
                    >
                    <transition name="fade-transform" mode="out-in">
                      <div class="balnce">
                        <image_choice
                          @getSelectImage="
                            img => picUploadSuccess(img, 'focusList', 4)
                          "
                        ></image_choice>
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
                  :file-list="elementForm.showList"
                  list-type="picture"
                >
                  <el-popover
                    slot="tip"
                    placement="right"
                    width="535"
                    trigger="hover"
                    v-model="dialogFormVisible3"
                  >
                    <el-button
                      slot="reference"
                      size="small"
                      type="primary"
                      plain
                      >添 加</el-button
                    >
                    <transition name="fade-transform" mode="out-in">
                      <div class="balnce">
                        <image_choice
                          @getSelectImage="
                            img => picUploadSuccess(img, 'showList', 2)
                          "
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
                  :on-remove="removeHide"
                  :file-list="elementForm.hideList"
                  list-type="picture"
                >
                  <el-popover
                    slot="tip"
                    placement="right"
                    width="535"
                    trigger="hover"
                    v-model="dialogFormVisible4"
                  >
                    <el-button
                      slot="reference"
                      size="small"
                      type="primary"
                      plain
                      >添 加</el-button
                    >
                    <transition name="fade-transform" mode="out-in">
                      <div class="balnce">
                        <image_choice
                          @getSelectImage="
                            img => picUploadSuccess(img, 'hideList', 3)
                          "
                        ></image_choice>
                      </div>
                    </transition>
                  </el-popover>
                </el-upload>
              </el-form-item>
              <el-button type="primary" @click="submitSpecialElement"
                >提交元素</el-button
              >
            </el-row>
          </el-form>
        </el-col>

        <el-col :span="8">
          <el-button
            :style="{ float: 'right', margin: '0 5px 5px 0' }"
            size="mini"
            @click="addConfigs()"
            class="el-icon-plus"
            >添加</el-button
          >

          <el-table
            :data="textTableData"
            border
            style="width: 100%; margin-bottom: 40px"
            height="280px"
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
                  @click="delText(scope.$index, scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <!-- <el-button type="primary" @click="submitElement">保存专题</el-button> -->
    </el-card>

    <el-dialog
      width="30vw"
      ref="dialog__wrapper"
      title="添加属性"
      :visible.sync="dialogParamsForm"
    >
      <el-form :model="paramsForm" ref="paramsForm" class="demo-form-inline">
        <el-form-item
          label="属性类型"
          :label-width="formLabelWidth"
          prop="configType"
        >
          <el-radio-group v-model="paramsForm.configType">
            <el-radio :label="1">图片</el-radio>
            <el-radio :label="2">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="paramsForm.configType == '2'">
          <el-form-item label="属性名称" :label-width="formLabelWidth">
            <el-input v-model.number="paramsForm.configName"></el-input>
          </el-form-item>
          <el-form-item label="属性值" :label-width="formLabelWidth">
            <el-input v-model.number="paramsForm.configValue"></el-input>
          </el-form-item>
          <el-form-item label="xValue" :label-width="formLabelWidth">
            <el-input v-model.number="paramsForm.xValue"></el-input>
          </el-form-item>
          <el-form-item label="yValue" :label-width="formLabelWidth">
            <el-input v-model.number="paramsForm.yValue"></el-input>
          </el-form-item>
          <el-form-item label="rankId" :label-width="formLabelWidth">
            <el-input-number
              v-model="paramsForm.rankId"
              :min="0"
            ></el-input-number>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item label="图片类型" :label-width="formLabelWidth">
            <el-select v-model="paramsForm.picType" placeholder="请选择">
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
            <el-input v-model.number="paramsForm.xValue"></el-input>
          </el-form-item>
          <el-form-item label="yValue" :label-width="formLabelWidth">
            <el-input v-model.number="paramsForm.yValue"></el-input>
          </el-form-item>
          <el-form-item label="rankId" :label-width="formLabelWidth">
            <el-input-number
              v-model="paramsForm.rankId"
              :min="0"
            ></el-input-number>
          </el-form-item>
        </div>
        <div style="text-align: center">
          <el-button type="primary" @click="onSubmitPic">添加</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import defaultFocus from "@/assets/images/1038275mi7nbetip71bf81.jpg";
import image_choice from "@/components/widget/ImageChoiceWidget";
export default {
  name: "addSpecial",
  data() {
    return {
      comId: "",
      countPage: "",
      currentPage: 1,
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      recommendDisplayNames: [],
      recommendName: "",
      bgPicUrl: defaultFocus,
      elementPicUrl: defaultFocus,
      recommendDisplayPage: [],
      pageForm: {
        cname: "",
        ename: "",
        pageHeight: "",
        pageUrl: "",
        pageBgimgId: ""
      },
      searchValues: "",
      elementForm: {},
      elementItemForm: {},
      paramsForm: {
        id: undefined,
        configType: 1,
        configName: undefined,
        configValue: undefined,
        picType: undefined,
        rankId: undefined,
        xValue: undefined,
        yValue: undefined
      },
      imgTableData: [],
      textTableData: [],
      picTypeList: [],
      recommendDisplayTypes: [], //下拉数据
      formLabelWidth: "120px",
      dialogParamsForm: false,
      action: "", //操作状态
      actionEle: "", //操作状态
      paramsAction: "", //图片状态
      pageRules: {
        cname: [{ required: true, message: "必填", trigger: "blur" }]
      },
      roomsData: [],
      showConfig: false,
      imgurl: defaultFocus,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      dialogFormVisible4: false,
      dialogFormVisible5: false,
      templateList: []
    };
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
            e.stopPropagation();
            // console.log(e);
            const l = e.clientX - disX;
            const t = e.clientY - disY;
            el.style.left = `${l}px`;
            el.style.top = `${t}px`;
            el.dragData = {
              left: l,
              top: t
            };
            // console.log(el.style.left,el.style.top);
            eventBus.$emit(
              "elmousemove",
              binding.value,
              binding.value.id,

              binding.value.picId,
              binding.value.picType,
              el.dragData.left,
              el.dragData.top
            );
          };
          document.onmouseup = function(e) {
            e.stopPropagation();
            document.onmousemove = null;
            document.onmouseup = null;
          };
        };
      }
    }
  },
  components: { image_choice },
  inject: ["getModel"],
  created() {
    eventBus.$on("elmousemove", (item, id, picId, picType, l, t) => {
      item.item.xValue = l;
      item.item.yValue = t;
      //  this.componentRoomConfigs.forEach(itemm=>{
      //   if(itemm.id == id){
      //     debugger
      //   }
      // })
    });
    // this.getPicType(); //获取图片类型
    // this.getRecomType();
    // this.getTemplate();
    // this.getComponentType();
    let v = this.getModel();
    if (v.action == "edit") {
      this.action = "edit";
      this.pageForm = v.modelData;
    } else {
      this.action = "add";
      this.pageForm = {
        cname: "",
        ename: "",
        pageHeight: "",
        pageUrl: "",
        pageBgimgId: ""
      };
      this.elementForm = {
        labelList: [],
        focusList: [],
        showList: [],
        hideList: []
      };
      this.elementItemForm = {};
      this.imgTableData = [];
      this.textTableData = [];
    }
    this.comId = v.modelData.id;
  },
  watch: {},
  mounted() {
    this.getPicType(); //获取图片类型
    this.getRecomType(); //推荐归属类型
    this.getTemplate(); //获取模板地址
    this.getComponentType();
    this.getTemplateList();
    let v = this.getModel();

    if (v.modelData.id) {
      this.action = "edit";
      this.getComponentById(); //组件信息
      this.pageForm.id = v.modelData.id;
    } else {
      this.action = "add";
    }
    this.comId = v.modelData.id;
  },
  beforeDestroy() {},
  computed: {},
  methods: {
    //获取模板url
    getTemplateList() {
      var parms = {
        pageNum: this.currentPage,
        pageSize: 999999
      };
      this.$store
        .dispatch("axios_get_pageTemplateWareHouseList", parms)
        .then(res => {
          if (res != "undefined") {
            this.templateList = res.data.data.list.records;
          }
        })
        .catch(err => {
          this.message.error("模板地址数据获取失败");
        });
    },
    //获取页面信息
    getComponentById() {
      let comId = this.getModel().modelData.id;
      this.$store
        .dispatch("axios_get_pages", {
          id: comId
        })
        .then(res => {
          if (res != "undefined") {
            this.pageForm = res.data.data.records[0];
            this.bgPicUrl = this.pageForm.pageBackImg
              ? this.imagesBaseUrl + this.pageForm.pageBackImg.picPath
              : defaultFocus;

            if (this.pageForm.pageComponents) {
              this.roomsData = this.pageForm.pageComponents[0].componentRooms;
            }
          }
        })
        .catch(err => {});
    },

    picUploadSuccess(file1, type, picType) {
      let files = this.elementForm[type];
      let file = Object.assign({}, file1);
      file.name = file.picCname;
      file.url = this.imagesBaseUrl + file.picPath;
      file.picId = file.id;
      file.picType = picType;
      file.id = file.id + new Date().getTime();
      // this.$nextTick(()=>{
      // this.elementForm[type].push(file);
      // })
      this.elementForm[type] = [].concat(files).concat(file);
      // this.$forceUpdate();
    },
    removeLabel(f, fl) {
      this.elementForm.labelList.forEach((item, index) => {
        if (item.id == f.id) {
          this.elementForm.labelList.splice(index, 1);
          // eventBus.$emit("removeRecom", item);
        }
      });
    },
    removefocus(f, fl) {
      this.elementForm.focusList.forEach((item, index) => {
        if (item.id == f.id) {
          this.elementForm.focusList.splice(index, 1);
          // eventBus.$emit("removeRecom", item);
        }
      });
    },
    removeShow(f, fl) {
      this.elementForm.showList.forEach((item, index) => {
        if (item.id == f.id) {
          this.elementForm.showList.splice(index, 1);
          // eventBus.$emit("removeRecom", item);
        }
      });
    },
    removeHide(f, fl) {
      this.elementForm.hideList.forEach((item, index) => {
        if (item.id == f.id) {
          this.elementForm.hideList.splice(index, 1);
          // eventBus.$emit("removeRecom", item);
        }
      });
    },
    getPicTypeName(val, data) {
      let obj = {};
      obj = data.find(item => {
        return item.dictValue === val;
      });
      this.paramsForm.configName = obj.dictLabel;
    },
    handleGoBack() {
      eventBus.$emit("modelList");
    },
    createElement() {
      eventBus.$emit("addE");
    },

    openEditElement() {
      this.actionEle = "add";
      this.showConfig = true;
      this.elementForm = {
        labelList: [],
        focusList: [],
        showList: [],
        hideList: []
      };
      this.elementItemForm = {
        recommendDisplayType: "",
        recommendDisplayValue: undefined,
        xValue: undefined,
        yValue: undefined,
        width: undefined,
        height: undefined,
        status: undefined,
        recommendTrackName: "",

        movetop: "",
        movedown: "",
        moveleft: "",
        moveright: "",
        moveright: ""
      };
    },
    openModelEditElement(list) {
      this.actionEle = "edit";
      this.showConfig = true;
      this.elementForm = {
        labelList: [],
        focusList: [],
        showList: [],
        hideList: []
      };
      this.elementForm.id = list.id;
      console.log(this.elementForm);
      list.componentRoomConfigs.forEach(v => {
        let type = v.picType;
        v.recommendConfigPics.url =
          this.imagesBaseUrl + v.recommendConfigPics.picPath;
        v.url = this.imagesBaseUrl + v.recommendConfigPics.picPath;

        if (type == 1) {
          // this.elementForm.labelList.push(v.recommendConfigPics);
          this.elementForm.labelList.push(JSON.parse(JSON.stringify(v)));
        } else if (type == 2) {
          // this.elementForm.showList.push(v.recommendConfigPics);
          this.elementForm.showList.push(JSON.parse(JSON.stringify(v)));
        } else if (type == 3) {
          // this.elementForm.hideList.push(v.recommendConfigPics);
          this.elementForm.hideList.push(JSON.parse(JSON.stringify(v)));
        } else if (type == 4) {
          // this.elementForm.focusList.push(v.recommendConfigPics);
          this.elementForm.focusList.push(JSON.parse(JSON.stringify(v)));
        }
      });

      this.$forceUpdate();
    },
    editElement(list, item) {
      // this.actionEle = "edit";
      // this.showConfig = true;
      // this.this.elementItemForm =
      if (this.elementItemForm.id != item.id) {
        this.elementItemForm = item;
        this.elementItemForm.rankId = list.rankId;
        this.elementItemForm.recommendDisplayType = list.recommendDisplayType;
        this.elementItemForm.recommendDisplayValue = list.recommendDisplayValue;
        // this.elementItemForm.id = list.id;
        this.elementItemForm.recommendTrackName = list.recommendTrackName;
        this.elementItemForm.movetop = list.movetop;
        this.elementItemForm.movedown = list.movedown;
        this.elementItemForm.moveleft = list.moveleft;
        this.elementItemForm.moveright = list.moveright;
      }
      // this.$forceUpdate();

      /* this.elementForm.labelList = [];
      this.elementForm.focusList = [];
      this.elementForm.showList = [];
      this.elementForm.hideList = [];
      list.componentRoomConfigs.forEach(v => {
        let type = v.picType;
        v.recommendConfigPics.url =
          this.imagesBaseUrl + v.recommendConfigPics.picPath;
        v.url = this.imagesBaseUrl + v.recommendConfigPics.picPath;
         
        if (type == 1) {
          // this.elementForm.labelList.push(v.recommendConfigPics);
          this.elementForm.labelList.push(JSON.parse(JSON.stringify(v)));
        } else if (type == 2) {
          // this.elementForm.showList.push(v.recommendConfigPics);
          this.elementForm.showList.push(JSON.parse(JSON.stringify(v)));
        } else if (type == 3) {
          // this.elementForm.hideList.push(v.recommendConfigPics);
          this.elementForm.hideList.push(JSON.parse(JSON.stringify(v)));
        } else if (type == 4) {
          // this.elementForm.focusList.push(v.recommendConfigPics);
          this.elementForm.focusList.push(JSON.parse(JSON.stringify(v)));
        }
      });
       
      this.$forceUpdate(); */
    },
    createConfig(data) {
      var obj = new Object();
      // obj.id = data.id;
      // obj.picId = data.recommendConfigPics.picId;
      // obj.picType = data.recommendConfigPics.picType;
      // obj.imgurl = data.recommendConfigPics.picPath;
      // obj.width = data.recommendConfigPics.picW;
      // obj.height = data.recommendConfigPics.picH;
      // obj.xValue = data.recommendConfigPics.xValue;
      // obj.yValue = data.recommendConfigPics.yValue;
      obj = data;
      return obj;
    },
    //提交专题列表详情
    submitSpecialElement() {
      let componentRoomConfigs = [];
      let xy = {
        xValue: undefined,
        yValue: undefined
      };

      if (this.actionEle == "add") {
        //添加图片到布局
        this.elementForm.labelList &&
          this.elementForm.labelList.forEach(file => {
            componentRoomConfigs.push({
              picId: file.picId,
              picType: file.picType,
              recommendConfigPics: Object.assign(file, xy)
            });
          });
        this.elementForm.focusList &&
          this.elementForm.focusList.forEach(file => {
            componentRoomConfigs.push({
              picId: file.picId,
              picType: file.picType,
              recommendConfigPics: Object.assign(file, xy)
            });
          });
        this.elementForm.hideList &&
          this.elementForm.hideList.forEach(file => {
            componentRoomConfigs.push({
              picId: file.picId,
              picType: file.picType,
              recommendConfigPics: Object.assign(file, xy)
            });
          });
        this.elementForm.showList &&
          this.elementForm.showList.forEach(file => {
            componentRoomConfigs.push({
              picId: file.picId,
              picType: file.picType,
              recommendConfigPics: Object.assign(file, xy)
            });
          });
        this.elementForm.componentRoomConfigs = componentRoomConfigs;
        this.roomsData.push({ ...this.elementForm, ...this.elementItemForm });
      } else {
        this.elementForm.labelList &&
          this.elementForm.labelList.forEach(file => {
            if (file.recommendConfigPics == undefined) {
              componentRoomConfigs.push({
                picId: file.picId,
                picType: file.picType,
                recommendConfigPics: Object.assign(file, xy)
              });
            } else {
              componentRoomConfigs.push(Object.assign(file, {}));
            }
          });
        this.elementForm.focusList &&
          this.elementForm.focusList.forEach(file => {
            if (file.recommendConfigPics == undefined) {
              componentRoomConfigs.push({
                picId: file.picId,
                picType: file.picType,
                recommendConfigPics: Object.assign(file, xy)
              });
            } else {
              componentRoomConfigs.push(Object.assign(file, {}));
            }
          });
        this.elementForm.hideList &&
          this.elementForm.hideList.forEach(file => {
            if (file.recommendConfigPics == undefined) {
              componentRoomConfigs.push({
                picId: file.picId,
                picType: file.picType,
                recommendConfigPics: Object.assign(file, xy)
              });
            } else {
              componentRoomConfigs.push(Object.assign(file, {}));
            }
          });
        this.elementForm.showList &&
          this.elementForm.showList.forEach(file => {
            if (file.recommendConfigPics == undefined) {
              componentRoomConfigs.push({
                picId: file.picId,
                picType: file.picType,
                recommendConfigPics: Object.assign(file, xy)
              });
            } else {
              componentRoomConfigs.push(Object.assign(file, {}));
            }
          });
        var newArr = this.roomsData.filter(item => {
          return item.id != this.elementForm.id;
        });
        this.roomsData = newArr; //过滤掉修改的数据
        this.elementForm.componentRoomConfigs = componentRoomConfigs;
        newArr.push({ ...this.elementForm, ...this.elementItemForm });
        this.roomsData = newArr; //更新数据
      }
      this.showConfig = false;
    },
    // 删除专题元素
    delSpecialElement(item) {
      this.roomsData.forEach((i, index) => {
        if (item.id == i.id) {
          this.roomsData.splice(index, 1);
        }
      });
    },
    addConfigs() {
      this.dialogParamsForm = true;
      this.paramsAction = "add";
      this.paramsForm = {
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
      this.dialogParamsForm = true;
      this.paramsForm = row;
      this.paramsAction = "edit";
      this.elementPicUrl = row
        ? this.imagesBaseUrl + row.picPath
        : defaultFocus;
    },
    delText(index, row) {
      this.textTableData.splice(index, 1);
      this.elementForm.componentRoomConfigs = this.imgTableData.concat(
        this.textTableData
      );
    },

    //推荐归属类型
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

    setImg(item, type) {
      if (type == 1) {
        this.bgPicUrl = this.imagesBaseUrl + item.picPath;
        // this.imgurl = this.imagesBaseUrl + item.picPath;
        this.pageForm["bgPic"] = {};
        this.pageForm["bgPic"].id = item.id;
        this.pageForm["bgPic"].picPath = item.picPath;
        this.pageForm.pageBgimgId = item.id;
      } else if (type == 4) {
        this.elementPicUrl = this.imagesBaseUrl + item.picPath;
        this.paramsForm["pic"] = {};
        this.paramsForm["pic"].id = item.id;
        this.paramsForm["pic"].picPath = item.picPath;
        this.paramsForm.picId = item.id;
      }
    },

    submitElement() {
      let params = {
        id: this.comId || "",
        cname: this.pageForm.cname,
        ename: this.pageForm.ename,
        pageUrl: "",
        pageHeight: this.pageForm.pageHeight,
        pageWidth: 1280,
        pageType: 1,
        // bgPic: this.pageForm.bgPic || "",
        pageBgimgId: this.pageForm.pageBgimgId || "",
        pageComponents: [
          {
            componentRooms: this.roomsData
          }
        ]
      };
      if (this.action == "edit") {
        params.pageComponents[0].id = this.pageForm.pageComponents[0].id || "";
      }
      this.$store
        .dispatch("axios_add_pages", params)
        .then(res => {
          if (res.data.errorCode == "1000") {
            this.$message.success("操作成功");
            eventBus.$emit("modelList");
          } else {
            this.$message.error(res.data.errorMsg);
          }
        })
        .catch(err => {});
    },
    onSubmitPic() {
      if (this.paramsAction == "add") {
        if (this.paramsForm.configType == 1) {
          this.imgTableData.push(Object.assign(this.paramsForm, {}));
        } else {
          this.textTableData.push(Object.assign(this.paramsForm, {}));
        }
      }
      this.elementForm.componentRoomConfigs = this.imgTableData.concat(
        this.textTableData
      );
      this.dialogParamsForm = false;
    },

    //根据选择跳转类型 切换跳转名称
    selectRecomType(val, rv) {
      this.currentPage = 1;
      this.countPage = 1;
      this.elementForm.recommendDisplayValue = rv ? rv : "";
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
    // loadScrollData(scrollDown) {
    //   if (scrollDown) {
    //     if (this.countPage >= this.currentPage) {
    //       this.$store
    //         .dispatch("axios_get_pageSkipList", {
    //           contentType: 4,
    //           pageNum: ++this.currentPage,
    //           searchValue: this.searchValues
    //         })
    //         .then(res => {
    //           if (res != "undefined") {
    //             this.recommendDisplayPage = this.recommendDisplayPage.concat(
    //               res.data.data.records
    //             );
    //           }
    //         });
    //     }
    //   }
    // },
    loadScrollData2(scrollDown) {
      if (scrollDown) {
        if (this.countPage >= this.currentPage) {
          this.$store
            .dispatch("axios_get_contentInfo", {
              contentType: this.elementForm.recommendDisplayType,
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
    getLabelTY(val, data) {
      let obj = {};
      obj = data.find(item => {
        return item.id === val;
      });
      this.elementForm.commpageName = obj.cname;
    },
    getLabelTZ(val, data) {
      let obj = {};
      obj = data.find(item => {
        return item.recommendDisplayValue === val;
      });
      this.elementForm.recommendDisplayName = obj.recommendDisplayName;
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
      if (
        this.elementItemForm.recommendDisplayType == 7 ||
        this.elementItemForm.recommendDisplayType == 1
      ) {
        // this.loadScrollData(true);
        // this.loadScrollData2(true);
        // return;
        this.getformCurrency();
      } else if (
        this.elementItemForm.recommendDisplayType == 3 ||
        this.elementItemForm.recommendDisplayType == 8 ||
        this.elementItemForm.recommendDisplayType == 88
      ) {
        return;
      }
      this.$store
        .dispatch("axios_get_contentInfo", {
          contentType: this.elementItemForm.recommendDisplayType,
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
    }
  },
  beforeDestroy() {
    eventBus.$off("elmousemove");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  scoped>
.canvas {
  border: 3px solid #d1d1d2;
  width: 1280px;
  height: 400px;
  float: left;
  position: relative;
  overflow: hidden;
  border-style: groove;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}
.elementBox {
  float: left;
}
.flagImage {
  width: 50px;
}
.recommends {
  position: absolute;
}
ul li img {
  width: 128px;
  height: 72px;
  list-style-type: none;
  float: left;
  margin-left: 10px;
  margin-top: 10px;
}
.box-card {
  width: 1300;
  margin-top: 10px;
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
</style>




