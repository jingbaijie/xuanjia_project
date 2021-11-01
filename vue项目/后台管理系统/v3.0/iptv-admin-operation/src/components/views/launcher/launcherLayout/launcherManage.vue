<template>
  <div class="app-container">
    <!-- 主题数据 -->
    <el-page-header @back="$router.back(-1)" content="launcher编排管理">
    </el-page-header>
    <el-row :gutter="20" class="skinForm">
      <!--页面数据-->
      <el-col :span="3" :xs="24" class="themeTree">
        <div class="head-container">
          <el-scrollbar>
            <el-tree
              :data="deptOptions"
              :props="defaultProps"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="tree"
              :default-expand-all="true"
              @node-click="handleNodeClick"
            />
          </el-scrollbar>
        </div>
      </el-col>
      <!--页面数据-->
      <div class="pages">
        <el-col :span="21" :xs="24" v-if="this.queryParams.id || isShowPage">
          <div class="btn_area">
            <el-button
              :style="{ float: 'right' }"
              size="mini"
              type="primary"
              plain
              @click="handleCreate()"
              >增加推荐</el-button
            >
            <el-tooltip
              v-if="isShowCustom"
              class="item"
              effect="dark"
              content="收起自定义字段"
              placement="top"
            >
              <el-button
                :style="{ float: 'right', margin: '0 20px 0 0' }"
                size="mini"
                type="primary"
                plain
                circle
                icon="el-icon-caret-top"
                @click="handleHiddenCustom()"
              />
            </el-tooltip>
            <el-tooltip
              v-else
              class="item"
              effect="dark"
              content="展开自定义字段"
              placement="top"
            >
              <el-button
                :style="{ float: 'right', margin: '0 20px 0 0' }"
                size="mini"
                type="primary"
                plain
                circle
                icon="el-icon-caret-bottom"
                @click="handleHiddenCustom()"
              />
            </el-tooltip>
          </div>
          <el-form
            :model="form"
            ref="form"
            :rules="pageRules"
            label-width="140px"
          >
            <el-row :gutter="20" style="margin-left: 2.7%">
              <el-col :span="12" :xs="24">
                <el-form-item
                  label="中文名称"
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
                <el-form-item label="背景图片" :label-width="formLabelWidth">
                  <el-popover placement="right" width="535" trigger="hover">
                    <img
                      class="flagImage"
                      slot="reference"
                      :src="themeBigimg"
                      alt
                    />
                    <image_choice
                      @getSelectImage="img => setImg(img, 0)"
                    ></image_choice>
                  </el-popover>
                </el-form-item>
              </el-col>
              <el-col :span="12" :xs="24">
                <el-form-item
                  label="页面宽度"
                  prop="cname"
                  :label-width="formLabelWidth"
                >
                  <el-input
                    v-model="form.pageWidth"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="页面高度"
                  prop="ename"
                  :label-width="formLabelWidth"
                >
                  <el-input
                    v-model="form.pageHeight"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-form
            style="margin-left: 1.25%"
            :rules="customRules"
            :model="CustomForm"
            ref="CustomForm"
            label-width="140px"
          >
            <el-form-item
              label="自定义字段"
              v-if="isShowCustom"
              prop="configKey"
            >
              <el-select
                style="margin-bottom: 15px"
                v-model="CustomForm.configKey"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in configData"
                  :key="item.id"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
              <el-input
                prop="configKey"
                v-model="CustomForm.configValue"
                autocomplete="off"
              />
              <el-button
                type="primary"
                style="margin-left: 20px"
                size="mini"
                plain
                @click="onSubmitCustom('CustomForm')"
                >添 加</el-button
              >
            </el-form-item>
          </el-form>
          <el-table
            :data="CustomData"
            border
            style="width: 90%; margin-left: 5%"
            v-if="isShowCustom"
          >
            <el-table-column
              prop="configKey"
              label="属性名"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="configValue"
              label="属性值"
              align="center"
            ></el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  plain
                  v-if="scope.row.id"
                  @click="delCustom(scope.row)"
                  >删除</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  plain
                  v-else
                  @click="removeCustom(scope.$index)"
                  >移除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 10px">
            <div
              v-for="(v, index) in pagesData"
              :key="index"
              :style="{
                width: v.width + 'px',
                height: v.height + 60 + 'px',
                'margin-left': '5%'
              }"
            >
              <div class="title">
                <img
                  style="width: 50%; height: 25px; margin-top: 7px"
                  v-if="v.titlePic"
                  :src="imagesBaseUrl + v.titlePic.picPath"
                  alt=""
                />
                <span v-else style="font-size: 14px">{{ v.cname }}</span>
                <div style="float: right">
                  <el-button
                    size="mini"
                    type="primary"
                    plain
                    @click="handleTitleAttribute(v)"
                    >属性</el-button
                  >
                  <el-button
                    size="mini"
                    type="primary"
                    plain
                    @click="handleNextCreate(index)"
                    >增加</el-button
                  >
                  <el-button
                    size="mini"
                    type="primary"
                    plain
                    v-if="index !== 0"
                    @click="handleMoveUp(index)"
                    >上移</el-button
                  >
                  <el-button
                    size="mini"
                    type="primary"
                    plain
                    v-if="index !== pagesData.length - 1"
                    @click="handleMoveDown(index)"
                    >下移</el-button
                  >
                  <el-button
                    size="mini"
                    type="danger"
                    plain
                    v-if="v.id"
                    @click="handleDelete(v.id)"
                    >删除</el-button
                  >
                  <el-button
                    size="mini"
                    type="primary"
                    plain
                    v-else
                    @click="handleRemove(index)"
                    >移除</el-button
                  >
                  <el-button
                    style="margin: 0 0 0 10px"
                    size="mini"
                    type="success"
                    plain
                    @click="handleSwitch(index, v.id)"
                    >切换模板</el-button
                  >
                </div>
              </div>
              <div
                :style="{
                  width: v.width + 'px',
                  height: v.height + 'px',
                  position: 'relative',
                  border: '1px solid #ccc'
                }"
              >
                <div
                  v-for="(page, index1) in v.launcherComponentRooms"
                  :key="index1"
                  :style="{
                    width: page.width + 'px',
                    height: page.height + 'px',
                    position: 'absolute',
                    border: '1px solid #ccc',
                    top: page.yValue + 'px',
                    left: page.xValue + 'px'
                  }"
                >
                  <img
                    :style="{
                      width: page.width + 'px',
                      height: page.height + 'px'
                    }"
                    :src="
                      page.recommendPic
                        ? imagesBaseUrl + page.recommendPic.picPath
                        : ''
                    "
                    alt
                  />
                  <el-button
                    class="attribute"
                    type="success"
                    size="mini"
                    circle
                    @click="handleAttribute(page)"
                    >属性</el-button
                  >
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </div>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        size="mini"
        @click="onPagesSubmit('form')"
        style="margin-top: 20px"
        v-if="this.queryParams.id || isShowPage"
        >更新</el-button
      >
    </div>
    <recommended ref="addRecommended" />
    <editAttribute />
    <previewPage ref="previewPage" />
    <editComponent ref="editComponent" />
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import recommended from "./addRecommended";
import editAttribute from "./editAttribute";
import previewPage from "./previewPage";
import defaultFocus from "@/assets/images/add2.jpg";
import image_choice from "@/components/widget/ImageChoiceWidget";
import editComponent from "./editComponent";
export default {
  name: "pageManage",
  data() {
    return {
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      formLabelWidth: "100px",
      isShow: true,
      isShowPage: false,
      isShowCustom: true,
      themeBigimg: defaultFocus,
      pageBigimg: defaultFocus,
      configData: [],
      deptOptions: [],
      CustomData: [],
      defaultProps: {
        children: "pages",
        label: "cname"
      },
      themeForm: {},
      CustomForm: {},
      form: {
        pageComponents: []
      },
      pagesData: [],
      themeRules: {
        cname: [{ required: true, message: "必填项", trigger: "blur" }],
        ename: [{ required: true, message: "必填项", trigger: "blur" }]
      },
      pageRules: {
        cname: [{ required: true, message: "必填项", trigger: "blur" }],
        ename: [{ required: true, message: "必填项", trigger: "blur" }]
      },
      customRules: {
        configKey: [{ required: true, message: "必填项", trigger: "blur" }]
      },
      queryParams: {
        launcherId: "",
        id: ""
      },
      launcherDataId: ""
    };
  },
  components: {
    recommended,
    editAttribute,
    previewPage,
    defaultFocus,
    image_choice,
    editComponent
  },
  created() {
    this.getConfigData();
  },
  mounted() {
    this.launcherDataId = this.$route.query.id;
    this.getTree();
    // this.getLauncherById();
    // this.getPagesTree();
  },
  beforeDestroy() {
    eventBus.$off(["recommended", "editComponent", "pageComponents"]);
  },
  methods: {
    getTree() {
      this.$store
        .dispatch("axios_get_pagesByLauncherId", {
          launcherId: this.launcherDataId
        })
        .then(res => {
          this.deptOptions = res.data.data;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    getLauncherPage(id) {
      this.$store
        .dispatch("axios_get_launcherPageById", {
          pageId: id
        })
        .then(res => {
          this.form = res.data.data;
          if (this.form.pageBackImg) {
            this.pageBigimg =
              this.imagesBaseUrl + this.form.pageBackImg.picPath;
          }
          this.pagesData = res.data.data.launcherComponents;

          this.CustomData = res.data.data.records[0].launcherPageConfig;
          //   for (let i = 0; i < this.pagesData.length; i++) {
          //     this.pagesData[i].rankId = i;
          //   }
          //   this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // getLauncherById() {
    //   this.$store
    //     .dispatch("axios_get_launcherById", {
    //       launcherId: this.launcherDataId
    //     })
    //     .then(res => {
    //       this.deptOptions = res.data.data.records;
    //       this.loading = false;
    //     })
    //     .catch(err => {
    //       this.loading = false;
    //     });
    // },
    // 根据所传条件获取左侧页面树
    getPagesTree() {
      this.$store
        .dispatch("axios_get_launcherById", {
          id: this.queryParams.launcherId
        })
        .then(res => {
          this.deptOptions = res.data.data.records;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 根据所传条件主题id及页面id获取所有页面信息
    // getThemePages() {
    //   this.$store
    //     .dispatch("axios_get_pages", {
    //       id: this.queryParams.id
    //     })
    //     .then(res => {
    //       this.form = res.data.data.records[0];
    //       if (this.form.pageBackImg) {
    //         this.pageBigimg =
    //           this.imagesBaseUrl + this.form.pageBackImg.picPath;
    //       }
    //       this.pagesData = res.data.data.records[0].pageComponents;
    //       this.CustomData = res.data.data.records[0].pageConfigs;
    //       for (let i = 0; i < this.pagesData.length; i++) {
    //         this.pagesData[i].rankId = i;
    //       }
    //       this.loading = false;
    //     })
    //     .catch(err => {
    //       this.loading = false;
    //     });
    // },
    // 获取自定义字段属性名下拉框
    getConfigData() {
      this.$store
        .dispatch("axios_get_selectDictDataByType", {
          dictType: "pageConfig"
        })
        .then(res => {
          this.configData = res.data.data;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },

    setImg(item, type) {
      if (type == 0) {
        this.themeBigimg = this.imagesBaseUrl + item.picPath;
        this.themeForm.pageBigimg = item.id;
      } else if (type == 1) {
        this.pageBigimg = this.imagesBaseUrl + item.picPath;
        this.form.pageBgimgId = item.id;
      }
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.themeCname.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      if (data.id) {
        this.queryParams.id = data.id;
      }
      this.pagesData = [];
      this.pageBigimg = defaultFocus;
      this.isShowCustom = true;
      this.getLauncherPage(data.id);
      //   if (this.queryParams.id != "") {
      //     this.getThemePages();
      //   }
    },
    // 收起
    handleHidden() {
      this.isShow = !this.isShow;
    },
    // 收起自定义字段
    handleHiddenCustom() {
      this.isShowCustom = !this.isShowCustom;
    },
    // 添加页面
    handleCreatePage() {
      if (this.queryParams.launcherId != "") {
        this.isShowPage = true;
        this.form = {};
        this.pageBigimg = defaultFocus;
        this.pagesData = [];
        this.queryParams.id = "";
      } else {
        this.$message.error("请先添加主题！");
      }
    },
    // 预览
    handlePreview() {
      if (this.queryParams.id) {
        this.$refs.previewPage.init(this.pagesData);
      } else {
        this.$message.error("请先选择页面！");
      }
    },
    // 移除自定义字段
    removeCustom(index) {
      this.CustomData.splice(index, 1);
    },
    // 删除自定义字段
    delCustom(row) {
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("axios_delete_pageConfig", {
              id: row.id
            })
            .then(res => {
              if (res.data.errorCode == "1000") {
                this.$message.success("删除操作成功！");
                this.getThemePages();
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
    // 添加自定义字段
    onSubmitCustom(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.CustomData == undefined) {
            this.CustomData = [];
          }
          this.CustomData.push(Object.assign(this.CustomForm, {}));
        }
      });
      this.form.pageConfigs = this.CustomData;
    },
    // 增加推荐
    handleCreate() {
      this.$refs.addRecommended.init();
      eventBus.$off("recommended");
      eventBus.$on("recommended", data => {
        data.recommendId = data.id;
        data.rankId = this.pagesData.length;
        delete data.id;
        data.componentRooms.forEach(e => {
          delete e.id;
          delete e.componentId;
        });
        this.pagesData.push(data);
      });
    },
    // 修改组件属性
    handleTitleAttribute(row) {
      this.$refs.editComponent.init(row);
      eventBus.$off("editComponent");
      eventBus.$on("editComponent", data => {
        row = data;
      });
    },
    // 当前推荐下增加推荐
    handleNextCreate(index) {
      this.$refs.addRecommended.init();
      eventBus.$off("recommended");
      eventBus.$on("recommended", data => {
        data.recommendId = data.id;
        data.rankId = index;
        delete data.id;
        data.componentRooms.forEach(e => {
          delete e.id;
          delete e.componentId;
        });
        this.pagesData.splice(index + 1, 0, data);
      });
    },
    // 切换模板
    handleSwitch(index, id) {
      this.$refs.addRecommended.init();
      eventBus.$off("recommended");
      eventBus.$on("recommended", data => {
        data.recommendId = data.id;
        data.id = id;
        data.rankId = index;
        data.componentRooms.forEach(e => {
          delete e.id;
          delete e.componentId;
        });
        this.pagesData.splice(index, 1, data);
      });
      this.$store
        .dispatch("axios_delete_component", {
          id: id,
          changeComponent: 1
        })
        .then(res => {
          if (res.data.errorCode != "1000") {
            this.$message.error(res.data.errorMsg);
            this.getThemePages();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 上移
    handleMoveUp(index) {
      let newArr = this.swapItems(this.pagesData, index, index - 1);
      for (let i = 0; i < newArr.length; i++) {
        newArr[i].rankId = i;
      }
      this.pagesData = newArr;
    },
    // 下移
    handleMoveDown(index) {
      let newArr = this.swapItems(this.pagesData, index, index + 1);
      for (let i = 0; i < newArr.length; i++) {
        newArr[i].rankId = i;
      }
      this.pagesData = newArr;
    },
    swapItems(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    },
    // 移除
    handleRemove(index) {
      this.pagesData.splice(index, 1);
    },
    // 删除
    handleDelete(id) {
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("axios_delete_component", {
              id: id
            })
            .then(res => {
              if (res.data.errorCode == "1000") {
                this.$message.success("删除操作成功！");
                this.getThemePages();
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
    // 设置属性
    handleAttribute(row) {
      eventBus.$emit("editAttribute", row);
      eventBus.$off("pageComponents");
      eventBus.$on("pageComponents", data => {
        row = data;
      });
    },
    // 提交主题信息
    onThemeSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let actionUrl;
          this.themeForm.id
            ? (actionUrl = "axios_update_Theme")
            : (actionUrl = "axios_add_Theme");
          this.$store
            .dispatch(actionUrl, this.themeForm)
            .then(response => {
              if (response.data.errorCode == "1000") {
                this.$message.success("操作成功");
                eventBus.$emit("refreshThemeList");
                eventBus.$on("getThemeList", v => {
                  this.queryParams.launcherId = v[v.length - 1].id;
                  this.getPagesTree();
                });
              } else {
                this.$message.error(response.data.errorMsg);
              }
            })
            .catch(err => {
              this.$message.error("操作失败");
            });
          this.dialogFormVisible = false;
        } else {
          return false;
        }
      });
    },
    // 提交单页面信息
    onPagesSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //   let actionUrl;
          //   this.form.id
          //     ? (actionUrl = "axios_update_pages")
          //     : (actionUrl = "axios_add_pages");
          this.form.pageComponents = this.pagesData;
          this.form.launcherId = this.queryParams.launcherId;
          this.$store
            .dispatch("axios_update_launcher", this.form)
            .then(response => {
              if (response.data.errorCode == "1000") {
                this.$message.success("操作成功");
                this.getPagesTree();
                if (this.queryParams.id == "") {
                  this.isShowPage = false;
                } else {
                  this.getThemePages();
                }
              } else {
                this.$message.error(response.data.errorMsg);
              }
            })
            .catch(err => {
              this.$message.error("操作失败");
            });
          this.dialogFormVisible = false;
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.btn_area {
  height: 8vh;
  padding: 15px 10px 10px 5px;
}
.add_btn {
  margin: 10px 0 0 10px;
  width: 100%;
  float: left;
}
.flagImage {
  width: 50px;
}
::v-deep .el-scrollbar__wrap {
  overflow-x: hidden;
}
.el-tree > .el-tree-node {
  height: 400px;
  min-width: 100%;
}
.el-input {
  width: 200px;
}
.dialog-footer {
  text-align: center;
}
.themeForm {
  width: 99%;
  //   height: 200px;
  padding-top: 30px;
  margin-left: 5px !important;
  border: 1px solid #ccc;
}
.skinForm {
  width: 99%;
  margin: 20px 0 0 5px !important;
  border-top: 1px solid #ccc;
}
.themeTree {
  padding-top: 10px;
}
.attribute {
  position: absolute;
  z-index: 999;
  right: 0;
  top: 0;
}
.pages {
  //   height: 650px;
  overflow: auto;
}
.title {
  width: 100%;
  height: 40px;
  line-height: 40px;
  margin-bottom: 12px;
}
</style>