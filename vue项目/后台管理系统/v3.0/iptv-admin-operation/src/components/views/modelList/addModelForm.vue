<template>
  <div>
    <el-page-header @back="handleGoBack" content=""> </el-page-header>
    <el-card class="box-card">
      <div slot="header">
        <span>组件基本信息</span>
      </div>
      <el-form :model="componentForm" ref="componentForm" :rules="comRules">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="组件地址" :label-width="formLabelWidth">
              <el-select
                clearable
                v-model="componentForm.templateUrl"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in templateUrlList"
                  :key="item.id"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- titlePicId  标题图 -->
          <el-col :span="6">
            <el-form-item label="组件类型" :label-width="formLabelWidth">
              <el-select
                clearable
                v-model="componentForm.componentType"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in componentsType"
                  :key="item.id"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                ></el-option> </el-select></el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item
              label="文字标题"
              prop="cname"
              :label-width="formLabelWidth"
            >
              <el-input
                type="text"
                v-model="componentForm.cname"
              ></el-input> </el-form-item
          ></el-col>
          <!-- titlePicId  标题图 -->
          <el-col :span="6">
            <el-form-item
              label="宽度"
              prop="width"
              :label-width="formLabelWidth"
            >
              <el-input
                type="text"
                v-model.number="componentForm.width"
                :min="0"
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="6"
            ><el-form-item
              label="高度"
              prop="height"
              :label-width="formLabelWidth"
            >
              <el-input
                type="text"
                v-model.number="componentForm.height"
                :min="0"
              ></el-input> </el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item
              label="margin-top"
              prop="topVal"
              :label-width="formLabelWidth"
            >
              <el-input
                type="text"
                v-model.number="componentForm.topVal"
                :min="0"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="margin-right"
              prop="rightVal"
              :label-width="formLabelWidth"
            >
              <el-input
                type="text"
                v-model.number="componentForm.rightVal"
                :min="0"
              ></el-input> </el-form-item
          ></el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item
              label="margin-bottom"
              prop="bottomVal"
              :label-width="formLabelWidth"
            >
              <el-input
                type="text"
                v-model.number="componentForm.bottomVal"
                :min="0"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="margin-left"
              prop="leftVal"
              :label-width="formLabelWidth"
            >
              <el-input
                type="text"
                v-model.number="componentForm.leftVal"
                :min="0"
              ></el-input> </el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="模板缩略图" :label-width="formLabelWidth">
              <el-popover placement="right" width="535" trigger="hover">
                <img class="flagImage" slot="reference" :src="previewPicUrl" />
                <image_choice
                  @getSelectImage="
                    img =>
                      setImg(
                        img,
                        'componentForm',
                        'previewPicUrl',
                        'previewPicId',
                        'previewPic'
                      )
                  "
                ></image_choice>
              </el-popover>
              <el-button
                type="text"
                icon="el-icon-delete"
                circle
                @click="
                  delImg(
                    'componentForm',
                    'previewPicUrl',
                    'previewPicId',
                    'previewPic'
                  )
                "
              ></el-button> </el-form-item
          ></el-col>

          <el-col :span="6">
            <el-form-item label="背景图" :label-width="formLabelWidth">
              <!-- <el-input
              type="text"
              v-model="form.bgPicId"
            ></el-input> -->
              <el-popover placement="right" width="535" trigger="hover">
                <img class="flagImage" slot="reference" :src="bgPicUrl" />
                <image_choice
                  @getSelectImage="
                    img =>
                      setImg(
                        img,
                        'componentForm',
                        'bgPicUrl',
                        'bgPicId',
                        'bgPic'
                      )
                  "
                ></image_choice>
              </el-popover>
              <el-button
                type="text"
                icon="el-icon-delete"
                circle
                @click="delImg('componentForm', 'bgPicUrl', 'bgPicId', 'bgPic')"
              ></el-button> </el-form-item
          ></el-col>
          <el-col :span="6">
            <el-form-item label="图片标题" :label-width="formLabelWidth">
              <el-popover placement="right" width="535" trigger="hover">
                <img class="flagImage" slot="reference" :src="titlePicUrl" />
                <image_choice
                  @getSelectImage="
                    img =>
                      setImg(
                        img,
                        'componentForm',
                        'titlePicUrl',
                        'titlePicId',
                        'titlePic'
                      )
                  "
                ></image_choice>
              </el-popover>
              <el-button
                type="text"
                icon="el-icon-delete"
                circle
                @click="
                  delImg(
                    'componentForm',
                    'titlePicUrl',
                    'titlePicId',
                    'titlePic'
                  )
                "
              ></el-button> </el-form-item
          ></el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="submitComponent('componentForm')"
            >提交组件</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div slot="header">
        <span>元件</span>
        <el-button
          style="float: right; padding: 12px;margin-top: -8px;margin-left:5px;"
          @click="getElementList()"
          type="info"
          plain
          >重置</el-button
        >
        <!-- <el-input
          style="width:160px; float: right; padding: 0px;margin-top:-8px;"
          type="text"
          placeholder="输入元件规格"
          v-model="searchElementVal"
        ></el-input> -->
        <el-input
          style="width:200px; float: right; padding: 0px;margin-top:-8px;"
          placeholder="请输入元件规格"
          v-model="searchElementVal"
          class="input-with-select"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getElementList(searchElementVal)"
          ></el-button>
        </el-input>
      </div>
      <div
        :key="'element' + index + item.id"
        v-for="(item, index) in elementList"
        :id="'element' + item.id"
        :style="{
          width: item.width / 3 + 'px',
          height: item.height / 3 + 'px',
          border: ' 3px solid #112',
          margin: '10px'
        }"
        class="elementBox"
        @click="clickElement(item)"
      >
        {{ item.width }}×{{ item.height }}
      </div>
    </el-card>
    <!-- 画布 -->

    <el-card class="box-card">
      <div slot="header">
        <span>组件基本信息</span>
        <!-- <el-button type="info" @click="createElement">创建元件模块</el-button> -->
      </div>
      <div
        ref="canvas"
        class="canvas"
        :style="{
          height: componentForm.height + 'px',
          width: componentForm.width + 'px'
        }"
      >
        <div
          :key="'comE' + index + item.id"
          v-for="(item, index) in elementArr"
          :id="'comE' + item.id"
          v-recomDrag="item"
          :style="{
            position: 'absolute',
            top: item.yValue + 'px',
            left: item.xValue + 'px',
            display: 'inline-block !important',
            display: 'inline',
            backgroundColor: '#ddd',
            borderRadius: '5px',
            width: item.width + 'px',
            height: item.height + 'px'
          }"
          @click="elementInfo(index, item)"
        >
          <el-tag style="position:absolute;top:0;left:0;z-index:100">{{item.rankId}}</el-tag>
          <img
            :src="
              item.recommendPic &&
                item.recommendPic != {} &&
                imagesBaseUrl + item.recommendPic.picPath
            "
            class="recommends"
            :style="{ width: item.width, height: item.height }"
            alt=""
          />

          <el-button
            style="float: right; margin: -15px"
            type="text"
            class="el-icon-close"
            @click="delElement(index)"
          ></el-button>
        </div>
        <!-- 自动创建 -->
        <div
          :key="'comE' + key"
          v-for="(key, index) in newElement.rowNum"
          :id="'comE' + key"
          :style="{
            position: 'absolute',
            top: newElement.top + newElement.height * index + 'px',
            left: newElement.left + 'px',
            marginBottom: newElement.paddingLine + 'px'
          }"
        >
          <div
            :key="'comE' + key"
            v-for="(key, index) in newElement.lineNum"
            :id="'comE' + key"
            v-recomDrag="key"
            :style="{
              position: 'absolute',
              top: newElement.top + 'px',
              left:
                newElement.left +
                newElement.paddingRow +
                newElement.width * index +
                'px',
              display: 'inline-block !important',
              display: 'inline',
              border: ' 3px solid #122',
              borderRadius: '5px',
              marginLeft: newElement.paddingRow + 'px',
              width: newElement.width + 'px',
              height: newElement.height + 'px'
            }"
            @click="elementInfo(index)"
          ></div>
        </div>
      </div>
    </el-card>
    <el-card class="box-card" v-if="ifShowPic">
      <div slot="header">
        <span>坑位配置</span>
      </div>
      <el-row :gutter="18">
        <el-col :span="16">
          <el-form :inline="true" :model="elementForm" class="demo-form-inline">
            <el-form-item
              label="跳转地址类型"
              :label-width="formLabelWidth"
              prop="recommendDisplayType"
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
              label="通用页面"
              v-if="
                elementForm.recommendDisplayType == 7 ||
                  elementForm.recommendDisplayType == 1
              "
              :label-width="formLabelWidth"
              prop="commpageId"
            >
              <el-select
                v-selectScroll="loadScrollData"
                :filter-method="bySearchValue"
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
                  elementForm.recommendDisplayType == 3 ||
                    elementForm.recommendDisplayType == 8 ||
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
              ></el-cascader>
            </el-form-item>
            <el-form-item label="xValue" :label-width="formLabelWidth">
              <el-input
                v-model.number="elementForm.xValue"
                placeholder="xValue"
              ></el-input>
            </el-form-item>
            <el-form-item label="yValue" :label-width="formLabelWidth">
              <el-input
                v-model.number="elementForm.yValue"
                placeholder="yValue"
              ></el-input>
            </el-form-item>
            <el-form-item label="width" :label-width="formLabelWidth">
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
            </el-form-item>
            
            </el-form-item>
            <el-form-item label="埋点名" :label-width="formLabelWidth">
              <el-input
                v-model="elementForm.recommendTrackName"
                autocomplete="off"
              ></el-input>
            </el-form-item>
             <el-form-item label="排行" :label-width="formLabelWidth">
              <el-input
                v-model="elementForm.rankId"
                autocomplete="off"
              ></el-input>
            </el-form-item>
             <el-form-item label="movetop" :label-width="formLabelWidth">
              <el-input
                v-model="elementForm.movetop"
                autocomplete="off"
              ></el-input>
            </el-form-item>
             <el-form-item label="movedown" :label-width="formLabelWidth">
              <el-input
                v-model="elementForm.movedown"
                autocomplete="off"
              ></el-input>
            </el-form-item>
             <el-form-item label="moveleft" :label-width="formLabelWidth">
              <el-input
                v-model="elementForm.moveleft"
                autocomplete="off"
              ></el-input>
            </el-form-item>
             <el-form-item label="moveright" :label-width="formLabelWidth">
              <el-input
                v-model="elementForm.moveright"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="status" :label-width="formLabelWidth">
              <el-input
                v-model="elementForm.status"
                autocomplete="off"
              ></el-input>
            </el-form-item>

            <el-row :gutter="18">
              <el-form-item label="显示图片" :label-width="formLabelWidth">
                <el-popover placement="right" width="535" trigger="hover">
                  <img
                    class="flagImage"
                    slot="reference"
                    :src="recommendPicUrl"
                  />
                  <image_choice
                    @getSelectImage="
                      img =>
                        setImg(
                          img,
                          'elementForm',
                          'recommendPicUrl',
                          'recommendPicId',
                          'recommendPic'
                        )
                    "
                  ></image_choice>
                </el-popover>
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  circle
                  @click="
                    delImg(
                      'elementForm',
                      'recommendPicUrl',
                      'recommendPicId',
                      'recommendPic'
                    )
                  "
                ></el-button>
              </el-form-item>
              <el-form-item label="标签图片" :label-width="formLabelWidth">
                <el-popover placement="right" width="535" trigger="hover">
                  <img
                    class="flagImage"
                    slot="reference"
                    :src="recommendLabelpicUrl"
                  />
                  <image_choice
                    @getSelectImage="
                      img =>
                        setImg(
                          img,
                          'elementForm',
                          'recommendLabelpicUrl',
                          'recommendLabelpicId',
                          'recommendLabelpic'
                        )
                    "
                  ></image_choice>
                </el-popover>
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  circle
                  @click="
                    delImg(
                      'elementForm',
                      'recommendLabelpicUrl',
                      'recommendLabelpicId',
                      'recommendLabelpic'
                    )
                  "
                ></el-button>
              </el-form-item>
              <el-form-item label="角标图片" :label-width="formLabelWidth">
                <el-popover placement="right" width="535" trigger="hover">
                  <img
                    class="flagImage"
                    slot="reference"
                    :src="recommendCornerpicUrl"
                  />
                  <image_choice
                    @getSelectImage="
                      img =>
                        setImg(
                          img,
                          'elementForm',
                          'recommendCornerpicUrl',
                          'recommendCornerpicId',
                          'recommendCornerpic'
                        )
                    "
                  ></image_choice>
                </el-popover>
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  circle
                  @click="
                    delImg(
                      'elementForm',
                      'recommendCornerpicUrl',
                      'recommendCornerpicId',
                      'recommendCornerpic'
                    )
                  "
                ></el-button>
              </el-form-item>
              <el-form-item label="焦点图片" :label-width="formLabelWidth">
                <el-popover placement="right" width="535" trigger="hover">
                  <img
                    class="flagImage"
                    slot="reference"
                    :src="recommendFocuspicUrl"
                  />
                  <image_choice
                    @getSelectImage="
                      img =>
                        setImg(
                          img,
                          'elementForm',
                          'recommendFocuspicUrl',
                          'recommendFocuspicId',
                          'recommendFocuspic'
                        )
                    "
                  ></image_choice>
                </el-popover>
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  circle
                  @click="
                    delImg(
                      'elementForm',
                      'recommendFocuspicUrl',
                      'recommendFocuspicId',
                      'recommendFocuspic'
                    )
                  "
                ></el-button>
              </el-form-item>
            </el-row>
            <el-button type="primary" @click="submitElement"
              >提交元件模块</el-button
            ></el-form
          ></el-col
        >
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
                  v-if="scope.row.pic"
                  :src="imagesBaseUrl + scope.row.pic.picPath"
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
                  @click="delPic(scope.$index, scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
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
            <el-input v-model="paramsForm.configName"></el-input>
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
            <el-select
              v-model="paramsForm.picType"
              placeholder="请选择"
              @change="val => getPicTypeName(val, picTypeList)"
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
                @getSelectImage="
                  img =>
                    setImg(img, 'paramsForm', 'elementPicUrl', 'picId', 'pic')
                "
              ></image_choice>
            </el-popover>
            <el-button
              type="text"
              icon="el-icon-delete"
              circle
              @click="delImg('paramsForm', 'elementPicUrl', 'picId', 'pic')"
            ></el-button>
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
    <createElement></createElement>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import defaultFocus from "@/assets/images/1038275mi7nbetip71bf81.jpg";
import createElement from "./createElementForm";
import image_choice from "@/components/widget/ImageChoiceWidget";
export default {
  name: "addModel",
  data() {
    return {
      tableHeight: "280px",
      comId: "",
      countPage: "",
      currentPage: 1,
      recommendDisplayPage: [],
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      recommendDisplayNames: [],
      typeIds: this.$store.state.typeIds2,
      recommendName: "",
      bgPicUrl: defaultFocus,
      previewPicUrl: defaultFocus,
      elementPicUrl: defaultFocus,
      titlePicUrl: defaultFocus,
      recommendPicUrl: defaultFocus,
      recommendLabelpicUrl: defaultFocus,
      recommendCornerpicUrl: defaultFocus,
      recommendFocuspicUrl: defaultFocus,
      classifyData: [],
      defaultProps: {
        children: "childrenList",
        label: "typeCname",
        value: "id",
        checkStrictly: true,
        emitPath: false
      },
      componentForm: {
        cname: "",
        titlePicId: "",
        width: "",
        height: "",
        topVal: "",
        rightVal: "",
        bottomVal: "",
        leftVal: "",
        previewPicId: "",
        bgPicId: ""
      },
      searchValues: "",
      elementForm: {
        recommendDisplayType: "",
        recommendDisplayValue: undefined,
        xValue: undefined,
        yValue: undefined,
        width: "",
        height: "",
        status: "",
        recommendTrackName: "",
        rankId : "",
        movedown: null,
        moveleft: null,
        moveright: null,
        movetop: null,
      },
      paramsForm: {
        id: undefined,
        configType: 1,
        configName: undefined,
        configValue: undefined,
        picType: "",
        rankId: undefined,
        xValue: undefined,
        yValue: undefined
      },
      imgTableData: [],
      textTableData: [],
      ifShowPic: false,
      elementArr: [],
      elementList: [],
      picTypeList: [],
      recommendDisplayTypes: [], //下拉数据
      templateUrlList: [],
      formLabelWidth: "120px",
      dialogParamsForm: false,
      newElement: {}, //自动创建元素
      action: "", //操作状态
      paramsAction: "", //图片状态
      componentsType: [],
      searchElementVal: "",
      comRules: {
        cname: [{ required: true, message: "必填", trigger: "blur" }],
        height: [{ type: "number", message: "必须为数字值" }],
        width: [{ type: "number", message: "必须为数字值" }],
        leftVal: [{ type: "number", message: "必须为数字值" }],
        topVal: [{ type: "number", message: "必须为数字值" }],
        rightVal: [{ type: "number", message: "必须为数字值" }],
        bottomVal: [{ type: "number", message: "必须为数字值" }]
      }
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
            const l = e.clientX - disX;
            const t = e.clientY - disY;
            el.style.left = `${l}px`;
            el.style.top = `${t}px`;
            el.dragData = {
              left: l,
              top: t
            };
            console.log(this.dataset);
            // console.log(el.style.left,el.style.top);
            eventBus.$emit(
              "elmousemove",
              binding.value,
              el.dragData.left,
              el.dragData.top
            );
          };
          document.onmouseup = function(e) {
            document.onmousemove = null;
            document.onmouseup = null;
          };
        };
      }
    }
  },
  components: { image_choice, createElement },
  inject: ["getModel"],
  created() {
    eventBus.$on("elmousemove", (item, l, t) => {
      item.xValue = l;
      item.yValue = t;
    });
    this.getClassifyList();
    this.getElementList(); //元件
    this.getPicType(); //获取图片类型
    this.getRecomType();
    this.getTemplate();
    this.getComponentType();
    let v = this.getModel();
    if (v.action == "edit") {
      this.action = "edit";
      this.paramsForm = v.modelData;
      this.getComponentById(); //组件信息
    } else {
      this.action = "add";
    }
    this.comId = v.modelData.id;
  },
  mounted() {
    this.getElementList(); //元件
    this.getPicType(); //获取图片类型
    this.getRecomType();
    this.getTemplate();
    this.getComponentType();
    let v = this.getModel();
    if (v.modelData.id) {
      this.action = "edit";
      this.getComponentById(); //组件信息
    } else {
      this.action = "add";
      this.componentForm = {
        cname: "",
        titlePicId: undefined,
        width: undefined,
        height: undefined,
        topVal: undefined,
        rightVal: undefined,
        bottomVal: undefined,
        leftVal: undefined,
        previewPicId: undefined,
        bgPicId: undefined
      };
      this.elementForm = {
        recommendDisplayType: undefined,
        recommendDisplayValue: undefined,
        xValue: undefined,
        yValue: undefined,
        width: undefined,
        hight: undefined,
        status: undefined,
        recommendTrackName: "",
        rankId : "",
        movedown: null,
        moveleft: null,
        moveright: null,
        movetop: null,
      };
      this.imgTableData = [];
      this.textTableData = [];
      this.ifShowPic = false;
      this.elementArr = [];
    }
    this.comId = v.modelData.id;
  },
  beforeDestroy() {},
  computed: {},
  methods: {
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
    createElementInfo(val) {
      this.newElement = val;
    },
    delElement(index) {
      this.elementArr.splice(index, 1);
    },

    clickElement(item) {
      var len = this.elementArr.length;
      let param = {
        id: item.id + new Date().getTime(),
        recommendDisplayType: undefined,
        recommendDisplayValue: undefined,
        xValue: 0,
        yValue: 0,
        width: item.width,
        height: item.height,
        status: "",
        recommendTrackName: "",
        rankId : len,
        movedown: null,
        moveleft: null,
        moveright: null,
        movetop: null,
      };
      this.elementArr.push(param);
    },
    addConfigs() {
      this.dialogParamsForm = true;
      this.paramsAction = "add";
      this.paramsForm = {
        id: undefined,
        configType: 1,
        configName: undefined,
        configValue: undefined,
        picType: "",
        rankId: undefined,
        xValue: undefined,
        yValue: undefined
      };
      this.elementPicUrl = defaultFocus;
      // this.recommendPicUrl = defaultFocus;
      // this.recommendLabelpicUrl = defaultFocus;
      // this.recommendCornerpicUrl = defaultFocus;
      // this.recommendFocuspicUrl = defaultFocus;
    },
    handelEdit(index, row) {
      this.dialogParamsForm = true;
      this.paramsForm = row;
      this.paramsAction = "edit";
      this.elementPicUrl = row.pic
        ? this.imagesBaseUrl + row.pic.picPath
        : defaultFocus;
    },
    delPic(index, row) {
      this.imgTableData.splice(index, 1);
      this.elementForm.componentRoomConfigs = this.imgTableData.concat(
        this.textTableData
      );
    },
    delText(index, row) {
      this.textTableData.splice(index, 1);
      this.elementForm.componentRoomConfigs = this.imgTableData.concat(
        this.textTableData
      );
    },
    //点击坑位
    elementInfo(index, item) {
      // debugger;
      this.ifShowPic = true;
      console.log(item);
      // this.elementForm = this.elementArr[index];
      //因为elementForm就是item，而item的实际的
      this.elementForm = item;
      // this.elementForm.recommendDisplayType = item.recommendDisplayType + "";
      // this.elementForm.recommendDisplayValue = Number(
      //   item.recommendDisplayValue
      // );
      if(!item.rankId){
        this.$set(this.elementForm,"rankId",index);
      }
      if (item.recommendDisplayType == null) {
        this.elementForm.recommendDisplayType = "";
      } else {
        this.elementForm.recommendDisplayType = item.recommendDisplayType + "";
      }
      if (
        this.elementForm.recommendDisplayType == 3 ||
        this.elementForm.recommendDisplayType == 8 ||
        this.elementForm.recommendDisplayType == 88
      ) {
        this.$set(
          this.elementForm,
          "recommendDisplayValue",
          item.recommendDisplayValue
        );
      } else {
        this.$set(
          this.elementForm,
          "recommendDisplayValue",
          Number(item.recommendDisplayValue)
        );
      }

      this.selectRecomType(
        item.recommendDisplayType,
        item.recommendDisplayValue
      );
      this.getContentInfo();
      let arr1 = [];
      let arr2 = [];
      if (this.elementForm.componentRoomConfigs) {
        this.elementForm.componentRoomConfigs.forEach(e => {
          if (e.configType == 1) {
            arr1.push(e);
          } else {
            arr2.push(e);
          }
        });
        this.imgTableData = arr1;
        this.textTableData = arr2;
      }
      this.recommendPicUrl = item.recommendPic
        ? this.imagesBaseUrl + item.recommendPic.picPath
        : defaultFocus;
      this.recommendLabelpicUrl = item.recommendLabelpic
        ? this.imagesBaseUrl + item.recommendLabelpic.picPath
        : defaultFocus;
      this.recommendCornerpicUrl = item.recommendCornerpic
        ? this.imagesBaseUrl + item.recommendCornerpic.picPath
        : defaultFocus;
      this.recommendFocuspicUrl = item.recommendFocuspic
        ? this.imagesBaseUrl + item.recommendFocuspic.picPath
        : defaultFocus;
      // else {
      //   //切换如果为空
      //   this.imgTableData = [];
      //   this.textTableData = [];
      //   this.recommendPicUrl = defaultFocus;
      //   this.recommendLabelpicUrl = defaultFocus;
      //   this.recommendCornerpicUrl = defaultFocus;
      //   this.recommendFocuspicUrl = defaultFocus;
      // }
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
    // img, 'paramsForm', 'elementPicUrl', 'picId', 'pic'
    setImg(item, obj, url, id, arr) {
      this[url] = this.imagesBaseUrl + item.picPath;
      this[obj][arr] = {};
      this[obj][arr].id = item.id;
      this[obj][arr].picPath = item.picPath;
      this[obj][id] = item.id;
    },

    // 'paramsForm', 'elementPicUrl', 'picId', 'pic'
    delImg(obj, url, id, arr) {
      this[url] = defaultFocus;
      this[obj][arr] = {};
      this[obj][id] = undefined;
    },

    getElementList(searchVal) {
      this.$store
        .dispatch("axios_get_elementList", { picW: searchVal })
        .then(res => {
          if (res != "undefined") {
            this.elementList = res.data.data.records;
          }
        })
        .catch(err => {});
    },
    getComponentById() {
      let comId = this.getModel().modelData.id;
      this.$store
        .dispatch("axios_get_componentById", {
          id: comId
        })
        .then(res => {
          if (res != "undefined") {
            this.componentForm = res.data.data[0];
            this.bgPicUrl = this.componentForm.bgPic
              ? this.imagesBaseUrl + this.componentForm.bgPic.picPath
              : defaultFocus;
            this.previewPicUrl = this.componentForm.previewPic
              ? this.imagesBaseUrl + this.componentForm.previewPic.picPath
              : defaultFocus;
            this.titlePicUrl = this.componentForm.titlePic
              ? this.imagesBaseUrl + this.componentForm.titlePic.picPath
              : defaultFocus;

            if (this.componentForm.componentRooms) {
              this.elementArr = this.componentForm.componentRooms;
            }
          }
        })
        .catch(err => {});
    },
    submitComponent(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {};
          params = Object.assign(this.componentForm, {});
          if (this.getModel().modelData.id) {
            params = Object.assign(this.componentForm, {
              id: this.getModel().modelData.id
            });
          }
          this.$store
            .dispatch("axios_add_componentList", params)
            .then(res => {
              if (res.data.errorCode == "1000") {
                this.$message.success("操作成功");
                if (this.action == "add") {
                  this.comId = res.data.data.id;
                }
              } else {
                this.$message.error(res.data.errorMsg);
              }
            })
            .catch(err => {});
        }
      });
    },
    submitElement() {
      let rooms = {};
      let params = Object.assign(this.componentForm, rooms);

      if (this.action == "add") {
        params.id = this.comId;
      } else {
        params.id = this.getModel().modelData.id;
      }
      params.rooms = Object.assign(this.elementArr, {});
      this.$store
        .dispatch("axios_update_componentList", params)
        .then(res => {
          if (res.data.errorCode == "1000") {
            this.$message.success("操作成功");
            // eventBus.$emit("modelList");
          } else {
            this.$message.error(res.data.errorMsg);
          }
        })
        .catch(err => {});
    },
    onSubmitPic() {
      this.elementForm.componentRoomConfigs = [];
      if (this.paramsAction == "add") {
        if (this.paramsForm.configType == 1) {
          this.imgTableData.push(Object.assign(this.paramsForm, {}));
        } else {
          this.textTableData.push(Object.assign(this.paramsForm, {}));
        }
      }
      let data = this.imgTableData.concat(this.textTableData);
      data.forEach(file => {
        this.elementForm.componentRoomConfigs.push(file);
      });
      //
      // let data = this.imgTableData.concat(this.textTableData);
      // data.forEach(file => {
      //   this.elementForm.componentRoomConfigs.push(file);
      // });
      // debugger
      this.dialogParamsForm = false;
    },

    //根据选择跳转类型 切换跳转名称
    selectRecomType(val, rv) {
      this.$forceUpdate();
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
          }
        }
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
    // getLabel(val, data) {
    //   let obj = {};
    //   obj = data.find(item => {
    //     return item.recommendDisplayValue === val + "";
    //   });
    //   this.elementForm.recommendDisplayName = obj.recommendDisplayName;
    // },
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
        this.elementForm.recommendDisplayType == 7 ||
        this.elementForm.recommendDisplayType == 1
      ) {
        this.loadScrollData(true);
        this.loadScrollData2(true);
        // return;
      } else if (
        this.elementForm.recommendDisplayType == 3 ||
        this.elementForm.recommendDisplayType == 8 ||
        this.elementForm.recommendDisplayType == 88
      ) {
        return;
      }
      this.$store
        .dispatch("axios_get_contentInfo", {
          contentType: this.elementForm.recommendDisplayType,
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
  margin-top: 10px;
}
</style>




