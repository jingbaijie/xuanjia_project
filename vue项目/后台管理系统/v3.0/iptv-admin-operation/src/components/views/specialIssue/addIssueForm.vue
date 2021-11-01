<template>
  <div>
    <el-page-header @back="handleGoBack" content=""> </el-page-header>
    <el-card class="box-card">
      <div slot="header">
        <span>专辑基本信息</span>
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
                  @getSelectImage="img => setImg(img)"
                ></image_choice> </el-popover></el-form-item
          ></el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" size="mini" @click="submitElement()">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header">
        <span>详情</span>
        <el-button
          :style="{ float: 'right', margin: '0 5px 5px' }"
          type="primary"
          size="mini"
          @click="handleAdd()"
          >添加内容</el-button
        >
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column
          prop="recommendTrackName"
          label="埋点名称"
        ></el-table-column>
        <el-table-column label="跳转类型">
          <template slot-scope="scope">
            {{ recommendDisplayType[scope.row.recommendDisplayType] }}
          </template>
        </el-table-column>
        <el-table-column prop="recommendDisplayValue" label="跳转内容ID"> </el-table-column>
        <el-table-column
          prop="recommendDisplayName"
          label="跳转内容名称"
        ></el-table-column>

        <el-table-column label="显示图片">
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.componentRoomConfigs" :key="index">
              <img
                :style="{ width: '50px' }"
                v-if="item.picType == 2"
                :src="imagesBaseUrl + item.recommendConfigPics.picPath"
                alt
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="标签图片">
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.componentRoomConfigs" :key="index">
              <img
                :style="{ width: '50px' }"
                v-if="item.picType == 1"
                :src="imagesBaseUrl + item.recommendConfigPics.picPath"
                alt
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="焦点图片">
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.componentRoomConfigs" :key="index">
              <img
                :style="{ width: '50px' }"
                v-if="item.picType == 4"
                :src="imagesBaseUrl + item.recommendConfigPics.picPath"
                alt
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="隐藏图片">
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.componentRoomConfigs" :key="index">
              <img
                :style="{ width: '50px' }"
                v-if="item.picType == 3"
                :src="imagesBaseUrl + item.recommendConfigPics.picPath"
                alt
              />
            </div>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row, scope.$index)" type="text" size="small"
              >更新</el-button
            >
            <el-button @click="handleDel(scope.row)" type="text" size="small"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <configForm />
  </div>
</template>

<script>
import { Message } from "element-ui";
import { eventBus } from "@/common/eventBus";
import defaultFocus from "@/assets/images/1038275mi7nbetip71bf81.jpg";
import image_choice from "@/components/widget/ImageChoiceWidget";
import configForm from "./configForm";
export default {
  name: "addIssue",
  data() {
    return {
      tableHeight: "280px",
      tableData: [],
      comId: "",
      countPage: "",
      currentPage: 1,
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      bgPicUrl: defaultFocus,
      formLabelWidth: "120px",
      action: "", //操作状态
      pageForm: {},
      pageRules: {
        cname: [{ required: true, message: "必填", trigger: "blur" }]
      },
      templateList: [],
      enameData: [],
      prefix: "",
      prefixEname: "",
      recommendDisplayType: {
        0: "游戏",
        1: "卡通",
        2: "视频",
        3: "跳转指定地址",
        4: "通用页面id",
        5: "活动id",
        6: "专题",
        7: "分类内容",
        8: "收藏",
        9: "历史记录",
        88: "其它",
        11: "专辑"       
      },
    };
  },
  components: { image_choice, configForm },
  inject: ["getModel"],
  created() {
    this.getEnameData();
    let v = this.getModel();
    if (v.action == "edit") {
      this.action = "edit";
      this.pageForm = v.modelData;
      this.pageForm.pageUrl = Number(v.modelData.pageUrl);
    } else {
      this.action = "add";
    }
    this.comId = v.modelData.id;
  },

  mounted() {
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
  computed: {},
  methods: {
    setImg(item) {
      this.bgPicUrl = this.imagesBaseUrl + item.picPath;
      this.pageForm["bgPic"] = {};
      this.pageForm["bgPic"].id = item.id;
      this.pageForm["bgPic"].picPath = item.picPath;
      this.pageForm.pageBgimgId = item.id;
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
              let data = JSON.parse(JSON.stringify(this.pageForm.pageComponents[0].componentRooms));
              data.forEach(item => {
                this.tableData.push(item);
              });
            }
          }
        })
        .catch(err => {});
    },

    handleGoBack() {
      eventBus.$emit("issueList");
    },
    handleAdd(){
      eventBus.$emit("addConfigForm");
      eventBus.$off("componentRoomConfigs");
      eventBus.$on("componentRoomConfigs", (data) => {
        this.tableData.push(data);
      });
    },
    handleEdit(row, index) {
      eventBus.$emit("editConfigForm", row);
      eventBus.$off("componentRoomConfigs");
      eventBus.$on("componentRoomConfigs", (data) => {
        this.tableData.splice(index, 1, data);
      });
    },
    // 删除专辑元素
    handleDel(item) {
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
                this.tableData.forEach((i, index) => {
                  if (item.id == i.id) {
                    this.tableData.splice(index, 1);
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

    submitElement() {
      let params = {
        id: this.comId || "",
        cname: this.pageForm.cname,
        ename: this.prefix + "_" + this.pageForm.ename,
        pageUrl: this.pageForm.pageUrl,
        themeId: 3,
        pageHeight: this.pageForm.pageHeight,
        pageWidth: 1280,
        pageType: 2,
        pageBgimgId: this.pageForm.pageBgimgId || "",
        pageComponents: [
          {
            componentRooms: this.tableData
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
            eventBus.$emit("issueList");
          } else {
            this.$message.error(res.data.errorMsg);
          }
        })
        .catch(err => {});
    }
  },
  beforeDestroy() {}
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




