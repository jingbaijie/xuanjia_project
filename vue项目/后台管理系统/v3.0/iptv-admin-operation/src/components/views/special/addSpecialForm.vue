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
            <el-form-item label="英文名称前缀" :label-width="formLabelWidth">
              <el-select
                v-model="prefix"
                placeholder="请选择"
                @change="changePrefix(prefix, pageForm.ename)"
              >
                <el-option
                  v-for="item in enameData"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="选择模板" :label-width="formLabelWidth">
              <el-select
                v-model="pageForm.pageUrl"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in templateList"
                  :key="item.id"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                ></el-option> </el-select
            ></el-form-item>
            <el-form-item
              label="输入英文名称"
              prop="ename"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="pageForm.ename"
                @input="onInput(prefix, pageForm.ename)"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="页面高度" :label-width="formLabelWidth">
              <el-input type="text" v-model="pageForm.pageHeight"></el-input
            ></el-form-item>
            <el-form-item label="完整英文名称" :label-width="formLabelWidth">
              <el-input
                style="width:350px"
                disabled
                v-model="prefixEname"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="背景图" :label-width="formLabelWidth">
              <el-popover placement="right" width="535" trigger="hover">
                <img class="flagImage" slot="reference" :src="bgPicUrl" alt />
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
      <el-col :span="20">
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
                position: 'absolute',
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
                <!-- 
                   @mouseover.stop="editElement(list.id, item)"
                  @mouseover.stop="editElement(list, item)" -->
                <img
                  :src="
                    item.recommendConfigPics &&
                      imagesBaseUrl + item.recommendConfigPics.picPath
                  "
                  @mousemove="editElement(list.id, item, $event)"
                  @click="selectItemElement(list.id, item, $event)"
                  class="recommends"
                  :style="{
                    width: item && item.picW,
                    height: item && item.picH
                  }"
                  alt
                />
                <!-- 
                @mouseover.stop="editElement(list,item,list.componentRoomConfigs)" -->
                <el-button
                  class="el-icon-edit"
                  type="text"
                  :style="{ float: 'left' }"
                  @click.stop="openModelEditElement(list, item)"
                ></el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="box-card">
          <div slot="header">
            <span>专题列表</span>
          </div>
          <ul class="list">
            <li v-for="(item, index) in roomsData" :key="index">
              <img
                :src="
                  item.componentRoomConfigs[0] &&
                    item.componentRoomConfigs[0].configType != 2 &&
                    imagesBaseUrl +
                      item.componentRoomConfigs[0].recommendConfigPics.picPath
                "
                class="recommends"
                :style="{
                  width: '50px',
                  height: '30px'
                }"
                alt
              />
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
        <el-button
          :style="{ float: 'right', margin: '0 5px 5px' }"
          type="primary"
          @click="submitSpecialElement"
          >提交元素</el-button
        >
      </div>
      <el-row :gutter="18">
        <el-col :span="16">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>编辑专题</span>
                  <el-button style="float: right; padding: 3px 0" type="text"
                    >操作按钮</el-button
                  >
                </div>
                <el-form
                  :inline="true"
                  :model="elementForm"
                  class="demo-form-inline"
                >
                  <el-row :gutter="18">
                    <el-col :span="12">
                      <el-form-item
                        label="跳转地址类型"
                        :label-width="formLabelWidth"
                      >
                        <el-select
                          v-model="elementForm.recommendDisplayType"
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
                          elementForm.recommendDisplayType != 88 &&
                          elementForm.recommendDisplayType != 3 &&
                          elementForm.recommendDisplayType != 6 &&
                          elementForm.recommendDisplayType != 11
                        "
                        :label-width="formLabelWidth"
                      >
                        <el-select
                          v-model="elementForm.more1"
                          @change="selectCommpage(elementForm.more1)"
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
                        v-if="
                          elementForm.recommendDisplayType != 88 &&
                          elementForm.recommendDisplayType != 3 &&
                          elementForm.recommendDisplayType != 6 &&
                          elementForm.recommendDisplayType != 11 
                        "
                        :label-width="formLabelWidth"
                        prop="commpageId"
                      >
                        <el-select
                          :filter-method="bySearchValue"
                          v-selectScroll="loadScrollData"
                          filterable
                          v-model="elementForm.commpageId"
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
                        label="通用页面"
                        v-if="
                          elementForm.recommendDisplayType != 88 &&
                          elementForm.recommendDisplayType != 3 &&
                          elementForm.recommendDisplayType != 6 &&
                          elementForm.recommendDisplayType != 11 
                        "
                        :label-width="formLabelWidth"
                      >
                        <el-select
                          :filter-method="bySearchValue"
                          v-selectScroll="loadScrollData"
                          filterable
                          clearable
                          v-model="commpageId2"
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
                        label="通用页面"
                        v-if="
                          elementForm.recommendDisplayType != 88 &&
                          elementForm.recommendDisplayType != 3 &&
                          elementForm.recommendDisplayType != 6 &&
                          elementForm.recommendDisplayType != 11 
                        "
                        :label-width="formLabelWidth"
                      >
                        <el-select
                          :filter-method="bySearchValue"
                          v-selectScroll="loadScrollData"
                          filterable
                          clearable
                          v-model="commpageId3"
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
                        v-if="elementForm.recommendDisplayType != 4 && elementForm.recommendDisplayType != 8"
                        :label="'跳转' + recommendName + '名称'"
                        :label-width="formLabelWidth"
                        prop="recommendDisplayValue"
                      >
                        <el-select
                          v-selectScroll="loadScrollData2"
                          :filter-method="bySearchValue2"
                          v-if="
                            elementForm.recommendDisplayType != 8 &&
                            elementForm.recommendDisplayType != 3 &&
                            elementForm.recommendDisplayType != 7 &&
                            elementForm.recommendDisplayType != 88
                          "
                          v-model="elementForm.recommendDisplayValue"
                          filterable
                          @change="
                            val => getLabelTZ(val, recommendDisplayNames)
                          "
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
                            elementForm.recommendDisplayType == 3 ||
                            elementForm.recommendDisplayType == 88
                          "
                          v-model="elementForm.recommendDisplayValue"
                          autocomplete="off"
                        ></el-input>
                        <el-cascader
                          v-if="elementForm.recommendDisplayType == 7"
                          v-model="elementForm.recommendDisplayValue"
                          placeholder="搜索"
                          :options="classifyData"
                          :props="defaultProps"
                          size="medium"
                          filterable
                          clearable
                        ></el-cascader>
                      </el-form-item>
                      <el-form-item label="占位符" :label-width="formLabelWidth">
                        <el-select v-model="elementForm.placeHolder" clearable placeholder="请选择" @change="$forceUpdate()">
                          <el-option
                            v-for="(item, index) in placeholderList"
                            :key="index"
                            :label="item.dictLabel"
                            :value="item.dictValue"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item
                        label="status"
                        :label-width="formLabelWidth"
                      >
                        <el-input
                          v-model="elementForm.status"
                          autocomplete="off"
                        ></el-input>
                      </el-form-item>
                    </el-col>      
                    <el-col :span="12">                      
                      <el-form-item
                        class="el_title"
                        :label-width="formLabelWidth"
                        label="排行ID"
                        prop="rankId"
                      >
                        <el-input-number
                          size="small"
                          v-model="elementForm.rankId"
                        ></el-input-number>
                      </el-form-item>
                      <el-form-item
                        label="是否免费"
                        :label-width="formLabelWidth"
                      >
                        <el-switch
                          v-model="elementForm.isFree"
                          :active-value="0"
                          :inactive-value="1"
                        ></el-switch>
                      </el-form-item>
                      <el-form-item
                        label="上"
                        :label-width="formLabelWidth"
                        style="float:left"
                      >
                        <el-input v-model="elementForm.movetop"></el-input>
                      </el-form-item>
                      <el-form-item
                        label="下"
                        :label-width="formLabelWidth"
                        style="float:left"
                      >
                        <el-input v-model="elementForm.movedown"></el-input>
                      </el-form-item>
                      <el-form-item
                        label="左"
                        :label-width="formLabelWidth"
                        style="float:left"
                      >
                        <el-input v-model="elementForm.moveleft"></el-input>
                      </el-form-item>
                      <el-form-item
                        label="右"
                        :label-width="formLabelWidth"
                        style="float:left"
                      >
                        <el-input v-model="elementForm.moveright"></el-input>
                      </el-form-item>
                      <el-form-item
                        label="埋点名"
                        :label-width="formLabelWidth"
                      >
                        <el-input
                          v-model="elementForm.recommendTrackName"
                          autocomplete="off"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="18">
                    <el-form-item
                      label="标签图片"
                      :label-width="formLabelWidth"
                    >
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
                    <el-form-item
                      label="焦点图片"
                      :label-width="formLabelWidth"
                    >
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
                    <el-form-item
                      label="显示图片"
                      :label-width="formLabelWidth"
                    >
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
                    <el-form-item
                      label="隐藏图片"
                      :label-width="formLabelWidth"
                    >
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
                  </el-row>
                </el-form>
              </el-card>
            </el-col>
            <el-col :span="12">
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
                      @click="delText(scope.$index, scope.row)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>编辑专题项目</span>
              <el-button
                :style="{ float: 'right', margin: '0 5px 5px' }"
                type="primary"
                size="mini"
                @click="submitItemElement"
                >应用</el-button
              >
            </div>
            <el-form
              :inline="true"
              :model="elementItemForm"
              class="demo-form-inline"
              :rules="rules"
            >
              <el-row :gutter="18">
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
                </el-col>
              </el-row>
            </el-form>
          </el-card>
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

        <div style="text-align: center">
          <el-button type="primary" @click="onSubmitPic">添加</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from "element-ui";
import { eventBus } from "@/common/eventBus";
import defaultFocus from "@/assets/images/1038275mi7nbetip71bf81.jpg";
import image_choice from "@/components/widget/ImageChoiceWidget";
export default {
  name: "addSpecial",
  data() {
    return {
      tableHeight: "280px",
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
        pageUrl: undefined,
        pageBgimgId: ""
      },
      searchValues: "",
      elementForm: {},
      elementItemForm: {
        recommendDisplayType: "",
        recommendDisplayValue: undefined,
        xValue: undefined,
        yValue: undefined,
        width: undefined,
        height: undefined,
        status: undefined,
        recommendTrackName: "",
        id: null,
        movetop: "",
        movedown: "",
        moveleft: "",
        moveright: "",
        componentRoomConfigs: []
      },
      paramsForm: {
        id: undefined,
        configType: 2,
        configName: undefined,
        configValue: undefined,
        picType: undefined,
        rankId: undefined,
        xValue: undefined,
        yValue: undefined
      },
      // imgTableData: [],
      textTableData: [],
      // ifShowPic: false,
      elementArr: [],
      elementList: [],
      picTypeList: [],
      recommendDisplayTypes: [], //下拉数据
      templateUrlList: [],
      formLabelWidth: "120px",
      dialogParamsForm: false,
      action: "", //操作状态
      actionEle: "", //操作状态
      paramsAction: "", //图片状态
      componentsType: [],
      pageRules: {
        cname: [{ required: true, message: "必填", trigger: "blur" }]
      },
      rules: {
        rankId: [{ required: true, message: "必填", trigger: "blur" }]
      },
      roomsData: [],
      imgArray: [],
      showConfig: false,
      imgurl: defaultFocus,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      dialogFormVisible4: false,
      dialogFormVisible5: false,
      templateList: [],
      enameData: [],
      prefix: "",
      prefixEname: "",
      commpageId2: undefined,
      commpageId3: undefined,
      defaultDisplayValue: [],
      themeData: [],
      placeholderList: [],
      defaultProps: {
        children: "childrenList",
        label: "typeCname",
        value: "id"
      },
      classifyData: [],
    };
  },
  directives: {
    recomDrag: {
      bind(el, binding) {
        el.style.cursor = "move";
        el.moveflag = false;
        const sty = el.currentStyle || window.getComputedStyle(el, null);
        el.onmousedown = ed => {
          el.moveflag = true;
          const disX = ed.clientX - el.offsetLeft;
          const disY = ed.clientY - el.offsetTop;
          window.onmousemove = function(e) {
            // e.stopPropagation();
            e.preventDefault();
            if (true == el.moveflag) {
              let event = e;
              const l = event.clientX - disX;
              const t = event.clientY - disY;
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
            }
          };
          window.onmouseup = function(e) {
            if (true == el.moveflag) {
              // e.stopPropagation();
              e.preventDefault();
              el.moveflag = false;
              window.onmousemove = null;
            }
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
    this.getPicType(); //获取图片类型
    this.getRecomType();
    this.getTemplate();
    this.getComponentType();
    this.getEnameData();
    this.getPlaceholder();
    this.getThemeList();
    let v = this.getModel();
    if (v.action == "edit") {
      this.action = "edit";
      this.pageForm = v.modelData;
      this.pageForm.pageUrl = Number(v.modelData.pageUrl);
    } else {
      this.action = "add";
      this.pageForm = {
        cname: "",
        ename: "",
        pageHeight: "",
        pageUrl: undefined,
        pageBgimgId: ""
      };
      this.elementForm = {
        labelList: [],
        focusList: [],
        showList: [],
        hideList: [],
        recommendDisplayType: "",
        recommendDisplayValue: undefined,
        xValue: undefined,
        yValue: undefined,
        width: undefined,
        height: undefined,
        status: undefined,
        recommendTrackName: "",
        id: null,
        movetop: "",
        movedown: "",
        moveleft: "",
        moveright: "",
        componentRoomConfigs: []
      };
      this.elementItemForm = {};
      // this.imgTableData = [];
      this.textTableData = [];
      // this.ifShowPic = false;
      this.elementArr = [];
    }
    this.comId = v.modelData.id;
  },
  watch: {
    deep: true,
    imgArray: {
      handler(newV, oldV) {}
    }
  },
  mounted() {
    this.getPicType(); //获取图片类型
    this.getRecomType();
    this.getTemplate();
    this.getComponentType();
    this.getTemplateList();
    this.getClassifyList();
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
    //获取模板url
    getTemplateList() {
      this.$store
        .dispatch("axios_get_selectDictDataByType", {
          dictType: "templateUrl"
        })
        .then(res => {
          this.templateList = res.data.data;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    changePrefix(prefix, ename) {
      this.prefixEname = prefix + "_" + ename;
    },
    onInput(prefix, ename) {
      this.prefixEname = prefix + "_" + ename;
    },
    // 获取页面英文名前缀下拉框
    getEnameData() {
      this.$store
        .dispatch("axios_get_selectDictDataByType", {
          dictType: "pageJump"
        })
        .then(res => {
          this.enameData = res.data.data;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
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
            let ename = this.pageForm.ename;
            this.prefixEname = ename;
            let index = ename.lastIndexOf("_");
            this.pageForm.ename = ename.substring(index + 1);
            this.prefix = ename.split("_")[0];
            this.bgPicUrl = this.pageForm.pageBackImg
              ? this.imagesBaseUrl + this.pageForm.pageBackImg.picPath
              : defaultFocus;

            if (this.pageForm.pageComponents) {
              this.roomsData = this.pageForm.pageComponents[0].componentRooms;
              // console.log(
              //   "this.roomsData获取" + JSON.stringify(this.roomsData)
              // );
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
        hideList: [],
        recommendDisplayType: "",
        recommendDisplayValue: undefined,
        xValue: undefined,
        yValue: undefined,
        width: undefined,
        height: undefined,
        status: undefined,
        recommendTrackName: "",
        componentRoomConfigs: [],
        movetop: "",
        movedown: "",
        moveleft: "",
        moveright: ""
      };
      this.elementItemForm = {
        id: null,
        xValue: undefined,
        yValue: undefined
      };
    },
    onInput() {
      this.$forceUpdate();
    },
    openModelEditElement(list) {
      this.actionEle = "edit";
      this.showConfig = true;
      this.textTableData = [];
      if (this.elementForm.id != list.id) {
        this.elementForm = {
          labelList: [],
          focusList: [],
          showList: [],
          hideList: [],
          recommendDisplayType: "",
          recommendDisplayValue: undefined,
          xValue: undefined,
          yValue: undefined,
          width: undefined,
          height: undefined,
          status: undefined,
          recommendTrackName: "",
          id: null,
          movetop: "",
          movedown: "",
          moveleft: "",
          moveright: "",
          componentRoomConfigs: []
        };
        // this.elementItemForm = item;
        // Object.assign(this.elementItemForm, item);
        this.elementForm = list;
        this.elementForm.more1 = Number(list.more1);
        this.elementForm.rankId = list.rankId;
        this.elementForm.recommendDisplayType = String(
          list.recommendDisplayType
        );
        this.elementForm.id = list.id;
        this.elementForm.recommendTrackName = list.recommendTrackName;
        this.elementForm.movetop = list.movetop;
        this.elementForm.movedown = list.movedown;
        this.elementForm.moveleft = list.moveleft;
        this.elementForm.moveright = list.moveright;
        if (list.commpageId != undefined && list.commpageId != "" && list.commpageId != null) {
          let arr = list.commpageId.split("$");
          if (arr.length == 3) {
            this.elementForm.commpageId = Number(arr[0]);
            this.commpageId2 = Number(arr[1]);
            this.commpageId3 = Number(arr[2]);
          } else if (arr.length == 2) {
            this.elementForm.commpageId = Number(arr[0]);
            this.commpageId2 = Number(arr[1]);
            this.commpageId3 = "";
          } else if (arr.length == 1) {
            this.elementForm.commpageId = Number(arr[0]);
            this.commpageId2 = "";
            this.commpageId3 = "";
          }
        }
        if (this.elementForm.recommendDisplayType == 7){    
          let arr1 = [];
          arr1 = list.recommendDisplayValue.split(",");
          this.defaultDisplayValue = arr1;
          this.elementForm.recommendDisplayValue = Number(arr1[arr1.length - 1]);
        }
        if (
          this.elementForm.recommendDisplayType == 3 ||
          this.elementForm.recommendDisplayType == 9 ||
          this.elementForm.recommendDisplayType == 88
        ) {
          this.$set(
            this.elementForm,
            "recommendDisplayValue",
            list.recommendDisplayValue
          );
        }else {
          this.$set(
            this.elementForm,
            "recommendDisplayValue",
            Number(list.recommendDisplayValue)
          );
        }
        this.selectRecomType(
          list.recommendDisplayType,
          list.recommendDisplayValue
        );
        this.elementForm.labelList = [];
        this.elementForm.showList = [];
        this.elementForm.hideList = [];
        this.elementForm.focusList = [];
        list.componentRoomConfigs.map(v => {
          // debugger;
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
            this.elementForm.labelList.push(JSON.parse(JSON.stringify(v)));
          } else if (type == 2) {
            this.elementForm.showList.push(JSON.parse(JSON.stringify(v)));
          } else if (type == 3) {
            this.elementForm.hideList.push(JSON.parse(JSON.stringify(v)));
          } else if (type == 4) {
            this.elementForm.focusList.push(JSON.parse(JSON.stringify(v)));
          }
          if (v.configType == "2") {
            this.textTableData.push(v);
          }
        });
      }
      this.$forceUpdate();
    },
    selectItemElement(id, item, event) {
      console.log(item.xValue);
      event.preventDefault();
      this.elementItemForm.listId = id;
      this.elementItemForm.id = item.id;
      this.elementItemForm.xValue = item.xValue;
      this.elementItemForm.yValue = item.yValue;
    },
    editElement(id, item, event) {
      event.preventDefault();
      // console.log(id);
      if (
        this.elementItemForm.listId == id &&
        this.elementItemForm.id == item.id
      ) {
        this.elementItemForm.xValue = item.xValue;
        this.elementItemForm.yValue = item.yValue;
      }
    },
    //提交专题列表详情
    submitSpecialElement() {
      // console.log("------------------------------\n",JSON.stringify(this.roomsData));
      // debugger;
      // if (!this.elementItemForm.rankId) {
      //   this.message.error("rankId必填");
      //   return;
      // }
      // console.log(this.elementForm.id, "----", this.elementItemForm.id);
      // return ;
      let componentRoomConfigs = [];
      let xy = {
          xValue: undefined,
          yValue: undefined
        },
        formData = {};
      if (this.textTableData != []) {
        this.textTableData.forEach(file => {
          componentRoomConfigs.push(file);
        });
      }
      // debugger
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
        // this.elementForm.componentRoomConfigs = componentRoomConfigs;
        // this.roomsData.push({ ...this.elementForm, ...this.elementItemForm });

        Object.assign(formData, this.elementForm);
        delete formData.labelList;
        delete formData.focusList;
        delete formData.showList;
        delete formData.hideList;
        delete formData.recommendConfigPics;
        delete formData.url;
        // this.roomsData = newArr; //过滤掉修改的数据
        // this.elementForm.componentRoomConfigs = componentRoomConfigs;
        formData.componentRoomConfigs = componentRoomConfigs;
        let arr = [];
        arr.push(this.elementForm.commpageId);
        arr.push(this.commpageId2);
        arr.push(this.commpageId3);
        arr = arr.filter(function (ele) {
          return ele != "" && ele != undefined;
        });
        formData.more1 = this.elementForm.more1;
        if (
          this.elementForm.recommendDisplayType != 88 &&
          this.elementForm.recommendDisplayType != 3 &&
          this.elementForm.recommendDisplayType != 6 &&
          this.elementForm.recommendDisplayType != 11
        ) {
          formData.commpageId = arr.join("$");
        } else {
          this.elementForm.more1 = "";
          this.elementForm.commpageId = "";
          this.commpageId2 = "";
          this.commpageId3 = "";
        }
        if(this.elementForm.recommendDisplayType == 7){
          try {
            formData.recommendDisplayValue = this.elementForm.recommendDisplayValue.join(",");              
          } catch (error) {
            formData.recommendDisplayValue = this.defaultDisplayValue.join(",");
          }
        }
        this.roomsData.push(formData);
      } else {
        // let xyData = xy;
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
        let newArr = this.roomsData;
        /* var newArr = this.roomsData.filter((item,index) => {
          return item.id != this.elementForm.id;
        }); */
        Object.assign(formData, this.elementForm);
        delete formData.labelList;
        delete formData.focusList;
        delete formData.focusList;
        delete formData.hideList;
        delete formData.recommendConfigPics;
        delete formData.url;
        // console.log("this.elementForm提交" + JSON.stringify(this.elementForm));
        // this.roomsData = newArr; //过滤掉修改的数据
        // this.elementForm.componentRoomConfigs = componentRoomConfigs;
        formData.componentRoomConfigs = componentRoomConfigs;
        // console.log(formData);
        // console.log(this.elementItemForm);
        // newArr.push(formData);
        this.roomsData = newArr.map(item => {
          // console.log(item);
          if (item.id == formData.id) {
            // console.log(formData.componentRoomConfigs);
            return formData;
          } else {
            return item;
          }
        });
        // this.roomsData = newArr; //更新数据
        // console.log("this.elementForm提交newArr" + JSON.stringify(newArr));
      }
      this.showConfig = false;
      // console.log(this.roomsData);
    },
    submitItemElement() {
      if (this.elementItemForm.listId) {
        this.roomsData.forEach(list => {
          if (this.elementItemForm.listId == list.id) {
            list.componentRoomConfigs.forEach(item => {
              if (item.id == this.elementItemForm.id) {
                item.xValue = this.elementItemForm.xValue;
                item.yValue = this.elementItemForm.yValue;
              }
            });
          }
        });
      }
    },
    // 删除专题元素
    delSpecialElement(item) {
      // this.roomsData.forEach((i, index) => {
      //   if (item.id == i.id) {
      //     this.roomsData.splice(index, 1);
      //   }
      // });

      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("axios_del_specialRoom", {
              id: item.id
            })
            .then(res => {
              if (res.data.errorCode == "1000") {
                this.roomsData.forEach((i, index) => {
                  if (item.id == i.id) {
                    this.roomsData.splice(index, 1);
                  }
                });
                Message({ message: res.data.errorMsg, type: "success" });
              } else {
                Message({ message: res.data.errorMsg, type: "warning" });
              }
            })
            .catch(err => {
              Message({ message: "删除失败，服务器暂无响应！", type: "error" });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    addConfigs() {
      this.dialogParamsForm = true;
      this.paramsAction = "add";
      this.paramsForm = {
        id: undefined,
        configType: 2,
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
      this.elementForm.componentRoomConfigs = this.textTableData;
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
    //获取模板地址
    getTemplate() {
      this.$store
        .dispatch("axios_get_selectDictDataByType", {
          dictType: "templateUrl"
        })
        .then(res => {
          this.templateUrlList = res.data.data;
        })
        .catch();
    },
    //获取组件类型
    getComponentType() {
      this.$store
        .dispatch("axios_get_selectDictDataByType", {
          dictType: "componentType"
        })
        .then(res => {
          this.componentsType = res.data.data;
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
        ename: this.prefix + "_" + this.pageForm.ename,
        pageUrl: this.pageForm.pageUrl,
        themeId: 3,
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
        // if (this.paramsForm.configType == 1) {
        //   this.imgTableData.push(Object.assign(this.paramsForm, {}));
        // } else {
        this.textTableData.push(Object.assign(this.paramsForm, {}));
        // }
      }
      this.textTableData.forEach(file => {
        this.elementForm.componentRoomConfigs.push(file);
      });
      this.elementForm.componentRoomConfigs.push(this.textTableData);
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
    selectCommpage(themeId){
      this.$forceUpdate();
      this.elementForm.more1 = themeId;
      this.elementForm.commpageId = "";
      this.commpageId2 = "";
      this.commpageId3 = "";
      this.getformCurrency();
    },
    loadScrollData(scrollDown) {
      if (scrollDown) {
        if (this.countPage >= this.currentPage) {
          this.$store
            .dispatch("axios_get_pageSkipList", {
              themeId: this.elementForm.more1,
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
              contentType: this.elementForm.recommendDisplayType,
              pageNum: this.currentPage++,
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
      this.$forceUpdate();
      let obj = {};
      obj = data.find(item => {
        return item.id === val;
      });
      this.elementForm.commpageName = obj.cname;
    },
    getLabelTZ(val, data) {
      this.$forceUpdate();
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
          themeId: this.elementForm.more1,
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
        this.elementForm.recommendDisplayType != 88 &&
        this.elementForm.recommendDisplayType != 3 &&
        this.elementForm.recommendDisplayType != 6 &&
        this.elementForm.recommendDisplayType != 11 
      ) {
        this.loadScrollData(true);
        this.loadScrollData2(true);
      } else if (
        this.elementForm.recommendDisplayType == 3 ||
        this.elementForm.recommendDisplayType == 8 ||
        this.elementForm.recommendDisplayType == 88
      ) {
        return;
      }
      if(this.elementForm.recommendDisplayType == 4 || this.elementForm.recommendDisplayType == 6 || this.elementForm.recommendDisplayType == 11){
        this.currentPage = 2;
      }
      this.$store
        .dispatch("axios_get_contentInfo", {
          contentType: this.elementForm.recommendDisplayType,
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
  padding: 0;
  border: 3px solid #d1d1d2;
  width: 1280px;
  height: 400px;
  /* float: left; */
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
.list li img {
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




