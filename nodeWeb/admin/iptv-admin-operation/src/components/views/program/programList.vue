
<template>
  <div>
    <!--
      左侧产品树 
    -->
    <el-row>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <p>产品/节目</p>
          <el-tree
            :data="classifyData"
            node-key="id"
            :expand-on-click-node="false"
            :props="defaultProps"
            @node-click="nodeClick"
            :highlight-current="true"
            accordion
          ></el-tree>
        </div>
      </el-col>
      <el-col :span="20">
        <!--
      节目集列表 
        -->
        <div>
          <div :style="{'line-height':'50px','height':'50px','margin':'20px 0 0 0'}">
            <el-switch
              :style="{'float':'right','margin':'0 10px 0 0'}"
              v-model="isCheckCopyright"
              active-text="过期数据"
              inactive-text="全部数据"
              active-value="1"
              inactive-value="0"
            ></el-switch>
            <!-- <el-switch
              :style="{'float':'right','margin':'0 10px 0 0'}"
              v-model="isBatchSearch"
              active-text="可搜索"
              inactive-text="不可搜索"
              active-value="1"
              inactive-value="0"
              @change="setBatchSearch"
              :disabled="!selectedIDs"
            ></el-switch>-->
            <el-popover placement="top" width="250" trigger="click">
              <el-button size="mini" type="warning" plain @click="setBatchSearch(1)">可搜索</el-button>
              <el-button size="mini" type="warning" plain @click="setBatchSearch(0)">不可搜</el-button>
              <el-button
                slot="reference"
                :style="{'float':'right','margin':'0 10px 0 0'}"
                size="mini"
                type="success"
                plain
              >是否可搜索</el-button>
            </el-popover>

            <el-button
              v-if="isAuth('system:series:insert')"
              :style="{'float':'right','margin':'0 10px 0 0'}"
              size="mini"
              type="warning"
              plain
              @click="handleCreate()"
            >新增</el-button>
            <el-button
              v-if="isAuth('system:series:insert')"
              :style="{'float':'right','margin':'0 10px 0 0'}"
              size="mini"
              type="warning"
              plain
              @click="handlePicture()"
            >节目集图片匹配</el-button>

            <el-tooltip class="item" effect="dark" content="发送过期邮件" placement="top-start">
              <el-button
                v-if="isAuth('system:series:insert')"
                :style="{'float':'right','margin':'0 10px 0 0'}"
                size="mini"
                type="warning"
                plain
                @click="handleEmail()"
              >邮件</el-button>
            </el-tooltip>
            <self-button-batch-class
              :tagsData="tagsData"
              :classifyData="classifyData"
              :selectedIDs="selectedIDs"
              @batchUpdateClass="batchUpdateClass"
            />
            <singleFree
              :tagsData="tagsData"
              :classifyData="classifyData"
              :selectedIDs="selectedIDs"
              @batchSingleFree="batchSingleFree"
            ></singleFree>
            <el-popover placement="top" width="250" trigger="click">
              <el-button
                v-if="isAuth('system:series:export')"
                size="mini"
                type="warning"
                plain
                @click="handleExport()"
              >内容导出</el-button>
              <el-button
                v-if="isAuth('system:series:insert')"
                size="mini"
                type="warning"
                plain
                @click="handleContent()"
              >内容导入</el-button>
              <el-button
                slot="reference"
                :style="{'float':'right','margin':'0 10px 0 0'}"
                size="mini"
                type="success"
                plain
              >导入or导出</el-button>
            </el-popover>
            <el-popover
              placement="top"
              width="350"
              trigger="click"
              :style="{'float':'right','margin':'0 10px 0 0'}"
            >
              <el-button
                v-if="isAuth('system:series:insert')"
                size="mini"
                type="warning"
                plain
                @click="handleBatchDel(selectedIDs,programData)"
              >批量删除</el-button>
              <self-button-batch-online
                @batchOnLine="batchOnLine"
                :style="{'float':'right','margin':'0 10px 0 0'}"
              />
              <self-button-batch-free
                @batchIsFree="batchIsFree"
                :style="{'float':'right','margin':'0 10px 0 0'}"
              />

              <el-button
                slot="reference"
                :style="{'float':'right','margin':'0 10px 0 0'}"
                size="mini"
                type="success"
                plain
              >批量操作</el-button>
            </el-popover>

            <self-button-search @getTypeInfo="config=>getTypeInfoBySearch(curProductId,config)" />
            <el-breadcrumb
              :style="{'margin':'10px 0 20px 20px'}"
              separator-class="el-icon-d-arrow-right"
            ></el-breadcrumb>
          </div>

          <el-table
            v-if="isAuth('system:series:list')"
            :data="programData"
            v-loading="loadingProgramList"
            ref="multipleTable"
            :height="tableHeight"
            @selection-change="data=>handleSelectionChange(data,1)"
            :style="{'font-size': '13px'}"
          >
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column prop="id" align="center" width="50" label="ID"></el-table-column>
            <el-table-column prop="cartoonCname" sortable align="center" label="中文名" width="90"></el-table-column>
            <el-table-column prop="cartoonEname" sortable label="英文名" width="90"></el-table-column>
            <el-table-column prop="tagsInfoList" align="center" label="标签名" width="90">
              <template slot-scope="scope">
                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  v-if="scope.row.tagsInfoList.length > 0 "
                >
                  <el-tag
                    :style="{'margin':'0 0 5px 5px'}"
                    :key="index"
                    type="success"
                    v-for="(item,index) in scope.row.tagsInfoList"
                  >{{item.typeCname}}</el-tag>
                  <el-button size="mini" slot="reference">{{scope.row.tagsInfoList[0].typeCname}}</el-button>
                </el-popover>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="cspInfo.cpCname" label="CP/SP信息"> -->
            <el-table-column label="CP信息">
              <template slot-scope="scope">
                <span v-if="scope.row.cspInfo">{{scope.row.cspInfo.cpCname}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="cartoonProprietorsStarttime" label="版权开始" width="100"></el-table-column>
            <el-table-column prop="cartoonProprietorsEndtime" label="版权结束" width="100">
              <template slot-scope="scope">
                <span
                  v-if="scope.row.copyrightWarning   == 1"
                  style="color:red"
                >{{scope.row.cartoonProprietorsEndtime}}</span>
                <span
                  v-if="scope.row.copyrightWarning   != 1"
                  style="color:#000"
                >{{scope.row.cartoonProprietorsEndtime}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="cspInfo.cpCname" label="版权方"></el-table-column>
            <el-table-column prop="cartoonSumvideonum" label="集数"></el-table-column>
            <el-table-column
              v-if="breadcrumb.length>3"
              prop="rankId"
              align="center"
              sortable
              label="排行"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.rankId"
                  @blur="submitRank(scope.row.rankId,scope.row.id)"
                  @keyup.enter.native="submitRank(scope.row.rankId,scope.row.id)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="详情图">
              <template slot-scope="scope">
                <img
                  :style="{'width':'50px'}"
                  v-if="scope.row.detailPic"
                  :src="imagesBaseUrl+scope.row.detailPic.picPath"
                />
              </template>
            </el-table-column>
            <el-table-column label="卡通图">
              <template slot-scope="scope">
                <img
                  :style="{'width':'50px'}"
                  v-if="scope.row.iconPic"
                  :src="imagesBaseUrl+scope.row.iconPic.picPath"
                />
              </template>
            </el-table-column>
            <el-table-column label="标签图">
              <template slot-scope="scope">
                <img
                  :style="{'width':'50px'}"
                  v-if="scope.row.labelPic"
                  :src="imagesBaseUrl+scope.row.labelPic.picPath"
                />
              </template>
            </el-table-column>
            <el-table-column align="center" label="免费状态" width="100">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="isFree[scope.row.isFree]"
                  placement="top"
                >
                  <el-switch
                    v-model="scope.row.isFree"
                    :active-value="1"
                    :inactive-value="0"
                    @change="booleanUp=>changeIsFree(booleanUp,scope.row)"
                  ></el-switch>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column align="center" label="上架状态" width="100">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="online[scope.row.booleanUp]"
                  placement="top"
                >
                  <el-switch
                    v-model="scope.row.booleanUp"
                    :active-value="2"
                    :inactive-value="0"
                    active-color="#13ce66"
                    @change="booleanUp=>changeOnLine(booleanUp,scope.row)"
                  ></el-switch>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column align="center" label="搜索状态" width="100">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="isSearch[scope.row.more1]"
                  placement="top"
                >
                  <el-switch
                    v-model="scope.row.more1"
                    active-value="1"
                    inactive-value="0"
                    active-color="#13ce66"
                    @change="setBatchSearch(scope.row)"
                  ></el-switch>
                </el-tooltip>
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="100">
              <template slot-scope="scope">
                <el-dropdown @command="command=>handleCommand(command,scope.$index)">
                  <span class="el-dropdown-link">
                    选择操作
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-if="isAuth('system:series:insert')" command="add">新增节目</el-dropdown-item>
                    <el-dropdown-item v-if="isAuth('system:series:list')" command="view">查 看</el-dropdown-item>
                    <el-dropdown-item v-if="isAuth('system:series:update')" command="edit">编 辑</el-dropdown-item>
                    <el-dropdown-item command="del">删 除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="!isAuth('system:series:list')" class="msg">暂无权限</div>
          <pagination
            v-if="isAuth('system:series:list')"
            v-show="total>0"
            :total="total"
            :page.sync="currentPage"
            :limit.sync="pageSize"
            @pagination="getTypeInfo(curProductId)"
          />
        </div>
      </el-col>
    </el-row>
    <el-dialog v-dialogDrag title="批量增加节目" :visible.sync="dialogVisible2"  width="35vw">
      <el-form :model="program">
        <el-form-item label="卡通名称" :label-width="formLabelWidth">
          <el-select v-model="program.cartoonId" filterable placeholder="请选择">
            <el-option
              v-for="item in programDataList"
              :key="item.recommendDisplayValue"
              :label="item.recommendDisplayName"
              :value="item.recommendDisplayValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="集数" :label-width="formLabelWidth">
          <el-input-number size="mini" controls-position="right" v-model="program.start" :min="0"></el-input-number>到
          <el-input-number size="mini" controls-position="right" v-model="program.end" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="视频文件前缀" :label-width="formLabelWidth">
          <el-input v-model="program.prefix"></el-input>
        </el-form-item>
        <div class="dialog-footer">
          <el-button type="primary" @click="onSubmitProgram">提 交</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!--
          查看按钮 弹窗 部分
    -->
    <el-dialog v-dialogDrag title="节目集详情" :visible.sync="dialogVisible" width="80%">
      <!--
          点击树 路径
      -->
      <el-breadcrumb :style="{'margin':'10px 0 20px 0px'}" separator-class="el-icon-d-arrow-right">
        <el-breadcrumb-item :key="index" v-for="(item,index) in breadcrumb_child">{{item}}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!--
          节目集详情信息
        -->
        <el-tab-pane label="节目集信息" name="first">
          <div class="program_content">
            <div class="pro_line">
              <div class="pro_name">归属类型</div>
              <div class="pro_value">{{'炫佳乐园'}}</div>
              <div class="pro_name">节目名称</div>
              <div class="pro_value">{{curProgram.cartoonCname}}</div>
            </div>
            <div class="pro_line">
              <div class="pro_name">节目标签</div>
              <div class="pro_value">{{curProgram.cartoonCname}}</div>
              <div class="pro_name">英文名称</div>
              <div class="pro_value">{{curProgram.cartoonEname}}</div>
            </div>

            <div class="pro_line">
              <div class="pro_name">详情图片</div>
              <div class="pro_value">
                <img
                  v-if="curProgram.detailPic.picPath"
                  :src="imagesBaseUrl+curProgram.detailPic.picPath"
                  style="width: 60px"
                />
              </div>
              <div class="pro_name">卡通图片</div>
              <div class="pro_value">
                <img
                  v-if="curProgram.iconPic.picPath"
                  :src="imagesBaseUrl+curProgram.iconPic.picPath"
                  style="width: 60px"
                />
              </div>
            </div>
            <div class="pro_line">
              <div class="pro_name">标签图片</div>
              <div class="pro_value">
                <img
                  v-if="curProgram.labelPic.picPath"
                  :src="imagesBaseUrl+curProgram.labelPic.picPath"
                  style="width: 60px"
                />
              </div>
              <div class="pro_name">视频集数</div>
              <div class="pro_value">{{curProgram.cartoonSumvideonum}}</div>
            </div>
            <div class="pro_line">
              <div class="pro_name">版权方</div>
              <div class="pro_value">{{curProgram.cartoonProprietors}}</div>
              <div class="pro_name">介质类型</div>
              <div class="pro_value">{{curProgram.cartoonMediatype}}</div>
            </div>
            <div class="pro_line">
              <div class="pro_name">单集平均时长</div>
              <div class="pro_value">{{curProgram.cartoonAveragetime}}</div>
              <div class="pro_name">总时长</div>
              <div class="pro_value">{{curProgram.cartoonSumvideotime}}</div>
            </div>
            <div class="pro_line">
              <div class="pro_name">授权地区</div>
              <div class="pro_value">{{curProgram.cartoonProducingarea}}</div>
              <div class="pro_name">排行ID</div>
              <div class="pro_value">{{curProgram.rankId}}</div>
            </div>
            <div class="pro_line">
              <div class="pro_name">导演</div>
              <div class="pro_value">{{curProgram.rankId}}</div>
              <div class="pro_name">主演</div>
              <div class="pro_value">{{curProgram.rankId}}</div>
            </div>
            <div class="pro_line">
              <div class="pro_name">年份</div>
              <div class="pro_value">{{curProgram.rankId}}</div>
              <div class="pro_name">语言</div>
              <div class="pro_value">{{curProgram.rankId}}</div>
            </div>
            <div class="pro_line">
              <div class="pro_name">地区</div>
              <div class="pro_value">{{curProgram.cartoonProducingarea}}</div>
              <div class="pro_name">是否上线</div>
              <div class="pro_value">{{booleanUp[curProgram.booleanUp]}}</div>
            </div>
            <div class="pro_line">
              <div class="pro_name">卡通介绍</div>
              <div class="pro_value">{{''+curProgram.cartoonIntroduction}}</div>
            </div>
          </div>
        </el-tab-pane>
        <!--
            节目集下面的单集列表
            单集下面的视频源信息
        -->
        <el-tab-pane label="节目信息" name="second">
          <el-button @click="handleAdd()" type="text" size="small">新增</el-button>

          <el-popover
            placement="top"
            width="350"
            trigger="click"
            :style="{'float':'right','margin':'0 10px 0 0'}"
          >
            <el-button
              v-if="isAuth('system:series:insert')"
              :style="{'float':'right','margin':'0 10px 0 0'}"
              size="mini"
              type="warning"
              plain
              @click="handleBatchDelP(selectedIDs,seriesListData)"
            >批量删除</el-button>
            <self-button-batch-online
              @batchOnLine="videoBatchOnLine"
              :style="{'float':'right','margin':'0 10px 0 0'}"
            />
            <self-button-batch-free
              @batchIsFree="videoBatchIsFree"
              :style="{'float':'right','margin':'0 10px 0 0'}"
            />

            <el-button
              slot="reference"
              :style="{'float':'right','margin':'0 10px 0 0'}"
              size="mini"
              type="success"
              plain
            >批量操作</el-button>
          </el-popover>
          <el-table
            :data="seriesListData"
            v-loading="loadingProgram"
            ref="multipleTable"
            @selection-change="data=>handleSelectionChange(data,0)"
          >
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column align="center" prop="id" label="ID"></el-table-column>
            <el-table-column align="center" label="中文名">
              <template slot-scope="scope">
                <el-popover
                  placement="right"
                  width="1000"
                  trigger="click"
                  @show="showMove(scope.row.id)"
                >
                  <el-table :data="moveData" v-loading="loadingMove" ref="multipleTable">
                    <!-- <el-table-column prop="fileUrl" label="文件地址"></el-table-column> -->
                    <el-table-column prop="playUrl" label="播放地址"></el-table-column>
                    <!-- <el-table-column prop="definition" label="清晰度"></el-table-column>
                    <el-table-column prop="injectionPortal" label="注入平台"></el-table-column>
                    <el-table-column prop="injectionState" label="注入状态">
                      <template slot-scope="scope">{{inState[scope.row.injectionState]}}</template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="修改时间"></el-table-column>-->
                  </el-table>
                  <a :style="{'color':'#409eff'}" slot="reference">{{scope.row.videoCname}}</a>
                </el-popover>
              </template>
            </el-table-column>

            <el-table-column prop="videoEname" label="英文名"></el-table-column>
            <el-table-column label="CP/SP信息" v-if="curCspInfo">{{curCspInfo.cpCname}}</el-table-column>
            <!-- <el-table-column prop="createTime" label="修改时间"></el-table-column> -->
            <el-table-column prop="booleanUp" label="是否上架">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.booleanUp"
                  :active-value="2"
                  :inactive-value="0"
                  active-color="#13ce66"
                  @change="booleanUp=>changeOnLineVideo(booleanUp,scope.row)"
                  inactive-color="#ff4949"
                ></el-switch>
                {{online[scope.row.booleanUp]}}
              </template>
            </el-table-column>
            <el-table-column label="免费状态">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.isFree"
                  :active-value="1"
                  :inactive-value="0"
                  @change="booleanUp=>changeIsFreeVod(booleanUp,scope.row)"
                ></el-switch>
                {{isFree[scope.row.isFree]}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button @click="handleUpdate(scope.row)" type="text" size="small">编辑</el-button>
                <el-button @click="delListP(scope.row)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total2>0"
            :total="total2"
            :page.sync="currentPage"
            :limit.sync="pageSize"
            @pagination="getProgramListBySeriesId(curProgram.id)"
          />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <programForm></programForm>
    <pictureForm></pictureForm>
    <programInfoForm></programInfoForm>
    <programManageForm></programManageForm>
  </div>
</template>

<script>
//引入组件
import { Message, Loading } from "element-ui";
import programForm from "./programForm";
import { eventBus } from "@/common/eventBus";
import Pagination from "@/components/widget/Pagination";
import search from "@/components/widget/TableSearch"; //搜索框
import Online from "@/components/widget/OnlineBatches"; //批量上下架
import Free from "@/components/widget/FreeBatches"; //批量免费
import classify from "@/components/widget/ClassBatches"; //批量分类
import singleFree from "@/components/widget/BatchSingleFree"; //批量分类
import pictureForm from "./pictureMatchForm"; //节目集图片匹配
import programInfoForm from "./programInfoAdd"; //添加修改节目信息
import programManageForm from "./programManageForm"; //内容导入

export default {
  name: "programList",
  inject: ["getMenuId"],
  provide() {
    return {
      setClassifyData: value => (this.classifyData = value),
      getClassifyData: () => {
        return this.classifyData;
      },
      getTagsData: () => {
        return this.tagsData;
      }
    };
  },
  //挂载组件
  components: {
    programForm, //添加节目集
    Pagination, //分页
    pictureForm, //节目集图片匹配
    programInfoForm, //添加修改节目信息
    programManageForm, //内容导入
    singleFree,
    "self-button-search": search,
    "self-button-batch-online": Online,
    "self-button-batch-free": Free,
    "self-button-batch-class": classify
  },
  data() {
    return {
      isSearchBtn: true,
      value: "",
      seriesIds: "", //所选id
      isCheckCopyright: 0, //是否筛选版权过期数据
      isBatchSearch: 0, ///是否可搜索
      searchConfig: { searchValue: "" }, //查询配置
      form: {}, //表单
      dialog: false,
      menuId: this.getMenuId(),
      breadcrumb: [],
      breadcrumb_child: [],
      activeName: "first",
      dialogVisible: false,
      dialogVisible2: false,
      currentPage: 1, //分页当前页码
      pageSize: 10,
      total: 1,
      total2: 0,
      classifyData: [],
      curProgram: {
        iconPic: {},
        labelPic: {},
        detailPic: {}
      },
      curProductId: "",
      programData: [],
      seriesListData: [],
      tagsData: [],
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      classData: {},
      programDataList: [],
      form: "",
      program: {},
      search: "",
      selectedIDs: [],
      loadingProgramList: true,
      loadingProgram: true,
      loadingMove: true,
      tableHeight: undefined,
      formLabelWidth: "120px",
      moveData: [],
      curCspInfo: {},
      curTypeInfoList: [],
      userPermission: {
        select: false,
        delete: false,
        insert: false,
        update: false
      },
      defaultProps: {
        children: "childrenList",
        label: "typeCname",
        value: "id",
        checkStrictly: true,
        expandTrigger: "hover",
        emitPath: false
      },
      inState: {
        "0": "未注入",
        "1": "注入中",
        "2": "注入成功",
        "3": "注入失败"
      },
      isFree: {
        "0": "免费",
        "1": "收费"
      },
      booleanUp: {
        "0": "未上线",
        "1": "测试",
        "2": "上线"
      },
      online: {
        "0": "下架",
        "2": "上架"
      },
      isSearch: {
        0: "不可搜",
        1: "可搜"
      },
      booleanUpValue: "",
      search: "",
      formLabelWidth: "120px",
      formprogramInsert: {
        videoCname: "",
        videoEname: ""
      }
    };
  },
  watch: {
    isCheckCopyright(val) {
      this.isCheckCopyright = val;
      this.getTypeInfo();
    }
    // isBatchSearch(val) {
    //   this.isBatchSearch = val;
    //   this.setBatchSearch();
    // }
  },

  created() {
    this.selectAllCartoonSimpleInfo();
    this.getClassifyList();
    this.getTagList();
    eventBus.$on("refreshProgramList", () => {
      this.getTypeInfo(this.curProductId);
    });
    eventBus.$on("refreshProgramList2", e => {
      this.getProgramListBySeriesId(this.curProgram.id);
    });
  },
  mounted() {
    if (this.isAuth("system:series:list")) {
      this.tableHeight =
        window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 200;
    }
    this.loadingProgramList = true;
  },
  destroyed() {
    eventBus.$off(["refreshProgramList", "refreshProgramList2"]);
  },
  methods: {
    setBatchSearch(val) {
      let params;
      if (this.selectedIDs.length < 1) {
        let flag = val.more1;
        let seriesIds = val.id;
        params = {
          searchFlag: flag,
          seriesIds: seriesIds
        };
      } else {
        params = {
          searchFlag: val,
          seriesIds: this.selectedIDs
        };
      }
      this.$store
        .dispatch(
          "axios_set_batchUpdateSearchFlag",
          Object.assign(params, this.search)
        )
        .then(res => {
          if (res.data.errorCode == "1000") {
            this.$message.success("设置成功");
            this.getTypeInfo();
          } else {
            this.$message.error(res.data.errorMsg, "未生效");
          }
        })
        .catch(err => {
          this.$message.error("设置失败");
        });
      // } else {
      //   this.$message.warning("请勾选内容");
      // }
    },
    handleExport() {
      // if()
      const loadOption = {
        text: "导出中",
        fullscreen: true,
        lock: true,
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      };
      let loadingInstance1 = Loading.service(loadOption);
      this.$store
        .dispatch(
          "axios_get_export",
          Object.assign(
            {
              typeId: this.curProductId,
              isCheckCopyright: this.isCheckCopyright,
              seriesIds: this.selectedIDs
            },
            this.search
          )
        )
        .then(res => {
          loadingInstance1 = Loading.service({ fullscreen: true });
          this.$message.success("导出成功");
          loadingInstance1.close();
        })
        .catch(err => {
          this.$message.error("导出失败");
          loadingInstance1.close();
        });
    },
    msgBox(msg) {
      this.$notify({
        title: "警告",
        message: msg,
        type: "warning"
      });
    },
    submitRank(rankId, contentId) {
      this.$store
        .dispatch("axios_update_seriesRankId", {
          rankId: rankId,
          contentId: contentId,
          typeId: this.curProductId
        })
        .then(res => {
          if (res.data.errorCode == "1000") {
            this.$message.success("修改成功");
          } else {
            this.$message.error("修改失败,请联系管理员");
          }
        })
        .catch(err => {
          this.$message.error("修改失败");
        });
    },
    handleCommand(command, index) {
      if (command == "add") {
        this.addProgramSingle(this.programData[index]);
      } else if (command == "edit") {
        this.handleEdit(index, this.programData);
      } else if (command == "view") {
        this.detailList(this.programData[index]);
      } else if (command == "del") {
        this.delList(this.programData[index]);
      }
    },
    handleSelectionChange(val, type) {
      console.log(val);
      this.selectVal = val.length;
      this.multipleSelection = val;

      let ids = [];
      this.multipleSelection.map(item => {
        ids.push(item.id);
      });
      let seriesList = [];
      if (type) {
        val.forEach(element => {
          seriesList.push(element.cspInfo.id);
        });
      }

      console.log(seriesList);
      this.seriesIds = seriesList.join(",");
      this.selectedIDs = ids.join(",");
      console.log("sid:" + this.selectedIDs);
      if (this.selectedIDs.length > 0) {
        this.isDisabled = false;
      }
    },

    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    selectAllCartoonSimpleInfo() {
      this.$store
        .dispatch("axios_get_selectAllCartoonSimpleInfo", {
          pageSize: 10000
        })
        .then(res => {
          this.programDataList = res.data.data.records;
        })
        .catch();
    },
    // 批量删除
    handleBatchDel(ids, arr) {
      let idsList = ids.split(",");
      console.log(idsList);
      //  var data = new Array();
      //   ids.forEach(i=>{
      //     console.log(i)
      //     arr.forEach(j=>{
      //       (j.booleanUp==2)
      //         data.push(j.id)
      //         console.log(data);

      //     })
      //   });
      // if (data.booleanUp == 0) {

      let names = [],
        newId = [];

      idsList.forEach((id, index) => {
        arr.forEach(d => {
          if (id == d.id && d.booleanUp == 0) {
            names.push(d.cartoonCname);
            newId.push(d.id);
          }
        });
      });
      console.log("可删" + newId);
      this.$confirm(
        "确定删除已下架的：" + names.join() + "吗, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$store
            .dispatch("axios_del_seriesDel", {
              ids: newId.join()
            })
            .then(response => {
              if (response.data.errorCode == "1000") {
                eventBus.$emit("refreshProgramList");
                this.$message.success("批量操作成功！");
              } else {
                this.$message.error("批量操作失败，请联系管理员");
              }
            })
            .catch(err => {
              this.$message.error("批量操作失败，请联系管理员");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消该操作！"
          });
        });
    },
    delList(data) {
      if (data.booleanUp == 0) {
        this.$confirm("确定删除吗, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$store
              .dispatch("axios_del_seriesDel", { ids: data.id })
              .then(rs => {
                if (rs.data.errorCode == "1000") {
                  this.$message.success("删除成功");
                } else if (rs.data.errorCode == "1001") {
                  this.$message.error(rs.data.data[0]);
                } else {
                  this.$message.error("删除失败");
                }
                eventBus.$emit("refreshProgramList");
              })
              .catch(er => {
                this.$message.error("删除失败");
              });
            this.dialogVisible2 = false;
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消该操作！"
            });
          });
      } else {
        this.$message.error("当前为上架状态，不可删除！");
      }
    },
    //节目批量删除
    handleBatchDelP(ids, arr) {
      let idsList = ids.split(",");
      console.log(idsList);
      let names = [],
        newId = [];

      idsList.forEach((id, index) => {
        arr.forEach(d => {
          if (id == d.id && d.booleanUp == 0) {
            names.push(d.cartoonCname);
            newId.push(d.id);
          }
        });
      });
      console.log("可删" + newId);
      this.$confirm(
        "确定删除已下架的：" + names.join() + "吗, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$store
            .dispatch("axios_del_programDel", {
              ids: newId.join()
            })
            .then(response => {
              if (response.data.errorCode == "1000") {
                eventBus.$emit("refreshProgramList2");
                this.$message.success("批量操作成功！");
              } else {
                this.$message.error("批量操作失败，请联系管理员");
              }
            })
            .catch(err => {
              this.$message.error("批量操作失败，请联系管理员");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消该操作！"
          });
        });
    },
    delListP(data) {
      if (data.booleanUp == 0) {
        this.$confirm("确定删除吗, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$store
              .dispatch("axios_del_programDel", { ids: data.id })
              .then(rs => {
                this.$message.success("删除成功");
                eventBus.$emit("refreshProgramList2");
              })
              .catch(er => {
                this.$message.error("删除失败");
              });
            this.dialogVisible2 = false;
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消该操作！"
            });
          });
      } else {
        this.$message.error("当前为上架状态，不可删除！");
      }
    },
    batchUpdateClass(data) {
      this.$store
        .dispatch("axios_update_tag", {
          contentId: this.selectedIDs,
          typeParentPath: data.typeParentPath || [],
          tagParentPath: data.tagParentPath || []
        })
        .then(response => {
          if (response.data.errorCode == "1000") {
            eventBus.$emit("refreshProgramList");
            this.$message.success("批量操作成功！");
          } else {
            this.$message.error("批量操作失败，请联系管理员");
          }
        })
        .catch(err => {
          this.$message.error("批量操作失败，请联系管理员");
        });
    }, //批量单集免费
    batchUpdateClass(data) {
      this.$store
        .dispatch("axios_update_tag", {
          contentId: this.selectedIDs,
          typeParentPath: data.typeParentPath || [],
          tagParentPath: data.tagParentPath || []
        })
        .then(response => {
          if (response.data.errorCode == "1000") {
            eventBus.$emit("refreshProgramList");
            this.$message.success("批量操作成功！");
          } else {
            this.$message.error("批量操作失败，请联系管理员");
          }
        })
        .catch(err => {
          this.$message.error("批量操作失败，请联系管理员");
        });
    },
    batchSingleFree(action) {
      if (this.selectedIDs.length > 0) {
        this.$store
          .dispatch("axios_update_seriesIsFree", {
            videoNum: action,
            seriesId: this.selectedIDs,
            isFree: 0
          })
          .then(response => {
            if (response.data.errorCode == "1000") {
              this.$message.success("批量操作成功！");
              eventBus.$emit("refreshProgramList");
            } else {
              this.$message.error("批量操作失败，请联系管理员");
            }
          })
          .catch(err => {
            this.$message.error("批量操作失败，请联系管理员");
          });
      } else {
        this.$message.warning("请勾选内容");
      }
    },

    batchIsFree(action) {
      if (this.selectedIDs.length > 0) {
        this.$store
          .dispatch("axios_update_seriesIsFree", {
            seriesId: this.selectedIDs,
            isFree: action
          })
          .then(response => {
            if (response.data.errorCode == "1000") {
              this.$message.success("批量操作成功！");
              eventBus.$emit("refreshProgramList");
            } else {
              this.$message.error("批量操作失败，请联系管理员");
            }
          })
          .catch(err => {
            this.$message.error("批量操作失败，请联系管理员");
          });
      } else {
        this.$message.warning("请勾选内容");
      }
    },

    videoBatchIsFree(action) {
      if (this.selectedIDs.length > 0) {
        this.$store
          .dispatch("axios_update_seriesIsFree", {
            videoId: this.selectedIDs,
            isFree: action
          })
          .then(response => {
            if (response.data.errorCode == "1000") {
              this.$message.success("批量操作成功！");
              eventBus.$emit("refreshProgramList2");
            } else {
              this.$message.error("批量操作失败，请联系管理员");
            }
          })
          .catch(err => {
            this.$message.error("批量操作失败，请联系管理员");
          });
      } else {
        this.$message.warning("请勾选内容");
      }
    },

    //批量操作
    batchOnLine(line, booleanUpAll) {
      if (this.selectedIDs.length > 0) {
        // this.dialogVisibleAll=true;
        this.$store
          .dispatch("axios_update_BooleanUp", {
            seriesId: this.selectedIDs,
            booleanUp: line,
            booleanUpAll: booleanUpAll //0部分，1全部
          })
          .then(response => {
            if (response.data.errorCode == "1000") {
              this.$message.success("批量操作成功！");
              eventBus.$emit("refreshProgramList");
            } else {
              this.$message.error("批量操作失败，请联系管理员");
            }
          })
          .catch(error => {});
      } else {
        this.$message.warning("请勾选节目");
      }
    },

    videoBatchOnLine(line, booleanUpAll) {
      if (this.selectedIDs.length > 0) {
        this.$store
          .dispatch("axios_update_BooleanUp", {
            videoId: this.selectedIDs,
            booleanUp: line,
            booleanUpAll: booleanUpAll //0部分，1全部
          })
          .then(response => {
            if (response.data.errorCode == "1000") {
              this.$message.success("批量操作成功！");
              eventBus.$emit("refreshProgramList2");
            } else {
              this.$message.error("批量操作失败，请联系管理员");
            }
          })
          .catch(error => {});
      } else {
        this.$message.warning("请勾选节目");
      }
    },
    changeIsFreeVod(isFree, series) {
      this.$store
        .dispatch("axios_update_seriesIsFree", {
          videoId: series.id,
          isFree: isFree
        })
        .then()
        .catch();
    },
    //节目是否免费 seriesId,  videoId, isFree
    changeIsFree(isFree, series) {
      this.$store
        .dispatch("axios_update_seriesIsFree", {
          seriesId: series.id,
          isFree: isFree
        })
        .then()
        .catch();
    },
    //节目上下架
    changeOnLineVideo(booleanUp, video) {
      this.$store
        .dispatch("axios_update_BooleanUp", {
          videoId: video.id,
          booleanUp: booleanUp
        })
        .then(response => {})
        .catch(err => {});
    },
    //节目集上下架
    changeOnLine(booleanUp, game) {
      this.$store
        .dispatch("axios_update_BooleanUp", {
          seriesId: game.id,
          booleanUp: booleanUp
        })
        .then(response => {})
        .catch(err => {});
    },
    //是否可搜索
    changeOnSearch() {},
    showMove(id) {
      this.getMovieListByProgramId(id);
    },
    nodeClick(d, n, o) {
      this.loading = true;
      this.currentPage = 1;
      this.curProductId = d.id;
      this.search = {};
      this.getTypeInfo(d.id);
      this.findRoad(d.id);
    },
    findRoad(id) {
      this.breadcrumb = [];
      this.classifyData.forEach(item => {
        if (item.id == id) {
          this.breadcrumb.push(item.typeCname);
        } else {
          item &&
            item.hasOwnProperty("childrenList") &&
            item.childrenList.forEach(item_first => {
              if (item_first.id == id) {
                this.breadcrumb.push(item.typeCname);
                this.breadcrumb.push(item_first.typeCname);
              } else {
                item_first &&
                  item_first.hasOwnProperty("childrenList") &&
                  item_first.childrenList.forEach(item_second => {
                    if (item_second.id == id) {
                      this.breadcrumb.push(item.typeCname);
                      this.breadcrumb.push(item_first.typeCname);
                      this.breadcrumb.push(item_second.typeCname);
                    } else {
                      item_second &&
                        item_second.hasOwnProperty("childrenList") &&
                        item_second.childrenList.forEach(item_third => {
                          if (item_third.id == id) {
                            this.breadcrumb.push(item.typeCname);
                            this.breadcrumb.push(item_first.typeCname);
                            this.breadcrumb.push(item_second.typeCname);
                            this.breadcrumb.push(item_third.typeCname);
                          }
                        });
                    }
                  });
              }
            });
        }
      });
    },
    formateClass(array) {
      let classify = [];
      array.forEach(item => {
        classify.push(item.typeCname);
      });
      return classify.join();
    },
    // axios_get_typeInfo
    getClassifyList() {
      this.menuId = this.getMenuId();
      this.$store
        .dispatch("axios_get_classify", {
          menuId: this.menuId
        })
        .then(res => {
          if (res != "undefined") {
            this.classifyData = res.data.data;
            this.btns = res.data.data.btns;
            if (res.data.data.length > 0) {
              this.curProductId = this.classifyData[0].id;
              this.getTypeInfo(this.curProductId);

              // this.getTypeInfo(this.classifyData[0].id);
            }
            // this.checkPermission();
          }
          this.loadingProgramList = false;
        })
        .catch(err => {
          this.loadingProgramList = false;
          // this.userData = testData.userList.data.records;
          // this.total = testData.userList.data.total;
        });
    },
    addProgramSingle(data) {
      this.program = {};
      this.program.cartoonId = data.id;
      this.dialogVisible2 = true;
    },
    onSubmitProgram() {
      this.$store
        .dispatch("axios_add_batchInsert", this.program)
        .then(rs => {
          if (rs.data.errorCode == "1000") {
            this.$message.success("添加成功");
          }else{
              this.$message.error(rs.data.errorMsg);
          }
        })
        .catch(er => {
          this.$message.error("添加成功");
        });
      this.dialogVisible2 = false;
    },
    detailList(data) {
      this.activeName = "first";
      this.breadcrumb_child = [];
      this.dialogVisible = true;
      this.curProgram = data;
      if (this.curProgram.iconPic == null) {
        this.curProgram.iconPic = {};
      }
      if (this.curProgram.labelPic == null) {
        this.curProgram.labelPic = {};
      }
      if (this.curProgram.detailPic == null) {
        this.curProgram.detailPic = {};
      }
      this.curCspInfo = data.cspInfo;
      this.curTypeInfoList = data.typeInfoList;
      this.breadcrumb_child = this.breadcrumb_child.concat(this.breadcrumb);
      this.breadcrumb_child.push(data.cartoonCname);
    },
    getTypeInfoBySearch(curProductId, searchKeys) {
      this.search = JSON.parse(JSON.stringify(searchKeys));
      this.getTypeInfo(curProductId);
    },
    getTypeInfo(id) {
      this.loadingProgramList = true;
      this.$store
        .dispatch(
          "axios_get_seriesList",
          Object.assign(
            {
              typeId: id,
              pageNum: this.currentPage,
              pageSize: this.pageSize,
              isCheckCopyright: this.isCheckCopyright
            },
            this.search
          )
        )
        .then(rs => {
          this.programData = rs.data.data.list.records;
          this.loadingProgramList = false;
          this.total = rs.data.data.list.total;
          console.log(rs.data.data.list.records);
          // this.programData.forEach(item => {
          //   if (item.copyrightWarning == 1) {
          //     this.msgBox(item.cartoonCname+'即将到期')
          //   }
          // });
        })
        .catch(er => {
          this.loadingProgramList = false;
        });
    },

    getTagList() {
      this.$store
        .dispatch("axios_get_productTagList")
        .then(rs => {
          this.tagsData = this.filterDataChildren(rs.data.data);
        })
        .catch(err => {});
    },
    filterDataChildren(data) {
      data.forEach(element => {
        if (element.childrenList.length > 0) {
          element.childrenList.forEach(i => {
            if (i.childrenList.length > 0) {
              i.childrenList.forEach(x => {
                if (x.childrenList > 0) {
                  x.childrenList.forEach(y => {
                    if (y.childrenList.length <= 0) {
                      delete y.childrenList;
                    }
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
      return data;
    },
    getProgramListBySeriesId(id) {
      this.$store
        .dispatch("axios_get_programListBySeriesId", {
          seriesId: id,
          pageNum: this.currentPage,
          pageSize: this.pageSize
          // pageSize: 10000
        })
        .then(rs => {
          this.dialogVisible = true;
          this.seriesListData = rs.data.data.records;
          this.total2 = rs.data.data.total;
          this.loadingProgram = false;
        })
        .catch(er => {
          this.loadingProgram = false;
        });
    },
    getMovieListByProgramId(id) {
      this.$store
        .dispatch("axios_get_movieListByProgramId", {
          programId: id
        })
        .then(rs => {
          this.dialogVisible = true;
          this.moveData = rs.data.data;
          this.loadingMove = false;
        })
        .catch(er => {
          this.loadingMove = false;
        });
    },
    handleUpdate(rows) {
      eventBus.$emit("editProgramInfo", rows);
    },
    handleAdd() {
      eventBus.$emit("addProgramInfo", this.curProgram.id);
    },
    handleClick(tab) {
      if (tab.name == "first") {
      } else if (tab.name == "second") {
        this.getProgramListBySeriesId(this.curProgram.id);
      } else if ((tab.name = "third")) {
        this.getMovieListByProgramId();
      }
    },
    handleCreate() {
      eventBus.$emit("addProgram");
      eventBus.$emit("refreshProgramList");
    },
    handlePicture() {
      eventBus.$emit("pictureMatch");
    },
    //内容导入
    handleContent() {
      eventBus.$emit("programManage");
      eventBus.$emit("refreshProgramList");
    },
    //重新发送过期片单的信息 axios_get_checkCopyrightPeriod
    handleEmail() {
      this.$store
        .dispatch("axios_get_checkCopyrightPeriod")
        .then(res => {
          this.$message.success("操作成功");
        })
        .catch(err => {
          this.$message.error("操作失败");
        });
    },
    handleEdit(index, row) {
      eventBus.$emit("editProgram", row[index]);
    }
    // handleClose(done) {
    //   this.$confirm("确认关闭？")
    //     .then(_ => {
    //       done();
    //     })
    //     .catch(_ => {});
    // }
  }
};
</script>

<style lang="scss" scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}

.el-tree-node .el-tree-node__content .el-tree-node__label {
  font-size: 34px;
}
.searchBtn {
  width: 20vh;
  float: left;
  margin-right: 10px;
}
.btn_area {
  height: 8vh;
  padding: 15px 10px 10px 5px;
}
.add_btn {
  margin: 10px 0 0 10px;
  width: 100%;
  float: left;
  border: 1px solid red;
}
.btn {
  margin-top: 20px;
  text-align: center;
}
.el-input--mini .el-input__inner {
  width: 100px;
}

.column_tree {
  width: 15%;
  float: left;
  margin-right: 15px;
}
.el-tree {
  margin-right: 15px;
  height: 70vh;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(235, 235, 235);
  border-image: initial;
  transition: all 0.2s ease 0s;
  overflow: auto;
  padding: 20px;
}
.column_detail {
  width: 83%;
  height: 500px;
  float: left;
}
.product_title {
  border-width: 1px;
  border-style: solid;
  border-color: rgb(235, 235, 235);
  border-image: initial;
  transition: all 0.2s ease 0s;
  line-height: 40px;
  text-align: center;
  font-family: SFUIDisplay-Regular, sans-serif;
  font-size: 17px;
  color: #ccc;
  background-color: rgb(84, 92, 100);
}
.program_content {
  width: 100%;
  height: 500px;
}
.pro_name {
  float: left;
  width: 15%;
  line-height: 50px;
  height: 50px;
  text-align: right;
  font-weight: bold;
}

.pro_value {
  float: left;
  width: 20%;
  line-height: 50px;
  height: 50px;
  text-align: center;
}
.pro_line {
  width: 100%;
  height: 50px;
}

.dialog-footer {
  text-align: center;
}

.header-search-select {
  font-size: 18px;
  transition: width 0.2s;
  overflow: hidden;
  background: transparent;
  border-radius: 0;
  vertical-align: middle;
  width: 210px;
  line-height: 40px;
  margin-left: 10px;

  /deep/ .el-input__inner {
    border-radius: 0;
    border: 0;
    padding-left: 0;
    padding-right: 0;
    box-shadow: none !important;
    border-bottom: 1px solid #d9d9d9;
    vertical-align: middle;
  }
}
.filterDiv {
  margin: 0 auto;
  width: 50%;
}
</style>

