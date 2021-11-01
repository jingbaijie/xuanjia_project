<template>
  <div class="theme">
    <div class="btn_area">
      <div class="add_btn">
        <!-- 条件查询 -->
        <el-form
          :model="queryThemeList"
          ref="queryForm"
          :inline="true"
          v-show="showSearch"
          label-width="120px"
        >
          <el-form-item label="频道选择" prop="themeType">
            <el-select
              v-model="queryThemeList.themeType"
              placeholder="请选择"
              clearable
              filterable
              size="small"
              style="width: 200px"
            >
              <el-option
                v-for="item in channelList"
                :key="item.id"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="主题名称" prop="cname">
            <el-input
              v-model="queryThemeList.cname"
              placeholder="请输入"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item style="margin-left: 20px">
            <el-button
              icon="el-icon-refresh"
              size="mini"
              @click="resetQuery('queryForm')"
              >重 置</el-button
            >
            <el-button
              style="margin-left: 20px"
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜 索</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="themeDialog">
      <div style="margin-bottom: 50px">
        <div class="channel">
          <span
            style="display: inline-block; margin-bottom: 20px; margin-left: 45%"
            >主题</span
          >
          <el-button
            style="float: right"
            type="primary"
            size="mini"
            @click="handleAddTheme()"
            >添加主题</el-button
          >
        </div>
        <ul class="dialog">
          <li v-for="(item, index) in themeList" :key="index">
            <el-card class="themeView">
              <div style="width: 500px; height: 340px">
                <img
                  v-if="item.themeBackPic"
                  :src="imagesBaseUrl + item.themeBackPic.picPath"
                  style="width: 100%; height: 320px; margin: 0 0 10px 0"
                  alt
                />
                <div
                  style="
                    width: 100%;
                    height: 30px;
                    display: flex;
                    position: relative;
                  "
                >
                  <span style="display: inline-block; line-height: 30px">
                    {{ item.cname }}
                  </span>
                  <div
                    style="
                      width: 44%;
                      height: 30px;
                      position: absolute;
                      right: 0;
                    "
                  >
                    <el-button
                      type="primary"
                      size="mini"
                      plain
                      @click="handleChange(item)"
                      >皮 肤</el-button
                    >
                    <el-button
                      type="primary"
                      size="mini"
                      plain
                      @click="handleEditTheme(item)"
                      >编 辑</el-button
                    >
                    <el-button
                      v-if="item.enabled == 0"
                      type="success"
                      size="mini"
                      plain
                      @click="handleEnable(item)"
                      >启 用</el-button
                    >
                    <el-button v-if="item.enabled == 1" size="mini"
                      >已启用</el-button
                    >
                  </div>
                </div>
              </div>
            </el-card>
          </li>
        </ul>
      </div>
      <div>
        <div class="channel">
          <span
            style="display: inline-block; margin-bottom: 20px; margin-left: 45%"
            >皮肤</span
          >
          <el-button
            style="float: right"
            type="primary"
            size="mini"
            @click="handleAddSkin"
            >添加皮肤</el-button
          >
        </div>
        <ul class="skinDialog">
          <li v-for="(item, index) in skinData" :key="index">
            <el-card class="skinView">
              <div style="width: 100%; height: 200px">
                <img
                  v-if="item.themeSkinBackPic"
                  :src="imagesBaseUrl + item.themeSkinBackPic.picPath"
                  style="width: 100%; height: 200px; margin: 0 0 10px 0"
                  alt
                />
                <div style="width: 100%; height: 30px">
                  <span
                    v-if="item.enabled == 1"
                    style="
                      display: inline-block;
                      line-height: 30px;
                      margin-left: 20px;
                    "
                    >√</span
                  >
                  <el-button
                    type="primary"
                    size="mini"
                    plain
                    @click="handleEditSkin(item)"
                    style="float: right"
                    >编辑</el-button
                  >
                  <el-button
                    v-if="item.enabled == 0"
                    type="success"
                    size="mini"
                    plain
                    @click="handleSwitch(item)"
                    style="float: right; margin-right: 10px"
                    >切换</el-button
                  >
                </div>
              </div>
            </el-card>
            <span
              style="
                display: inline-block;
                width: 80%;
                margin-top: 10px;
                text-align: center;
              "
              >{{ item.cname }}</span
            >
          </li>
        </ul>
        <pagination
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getSkinList"
        />
      </div>
    </div>
    <addSkin :themeList="themeList" />
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import Pagination from "@/components/widget/Pagination";
import addSkin from "./addSkin";
export default {
  name: "allThemeManage",
  data() {
    return {
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      // 显示搜索条件
      showSearch: true,
      total: 0,
      skinData: [],
      channelList: [],
      themeList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        themeId: "",
      },
      queryThemeList: {
        cname: "",
        themeType: "",
      },
    };
  },
  components: { Pagination, addSkin },
  created() {
    this.getThemeList();
    this.getSkinList();
    eventBus.$on("refreshSkin", () => {
      this.getSkinList();
    });
    eventBus.$on("refreshThemeList", () => {
      this.getThemeList();
    });
  },
  destroyed() {
    eventBus.$off(["refreshSkin", "refreshThemeList"]);
  },
  mounted() {
      this.$store
      .dispatch("axios_get_selectDictDataByType",{
        dictType: "channel_type",
      })
      .then((res) => {
        this.channelList = res.data.data;
        this.loading = false;
      })
      .catch((err) => {
        this.loading = false;
      });
  },
  methods: {
    getThemeList() {
      this.$store
        .dispatch("axios_get_ThemeList", this.queryThemeList)
        .then((res) => {
          this.themeList = res.data.data;
          eventBus.$emit("getThemeList",this.themeList);
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    getSkinList() {
      this.$store
        .dispatch("axios_get_themeskin", this.queryParams)
        .then((res) => {
          this.skinData = res.data.data.records;
          this.total = res.data.data.total;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getThemeList();
    },
    /** 重置按钮操作 */
    resetQuery(formName) {
      this.$refs[formName].resetFields();
      this.handleQuery();
    },

    /** 添加主题按钮操作 */
    handleAddTheme() {
      eventBus.$emit("createPage");
    },

    /** 管理按钮操作 */
    handleEditTheme(row) {
      eventBus.$emit("editPage",row.id);
    },
    /** 展示对应主题下的皮肤列表 */
    handleChange(row) {
      this.queryParams.themeId = row.id;
      this.$store
        .dispatch("axios_get_themeskin", this.queryParams)
        .then((res) => {
          this.skinData = res.data.data.records;
          this.total = res.data.data.total;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },

    /** 启用按钮操作 */
    handleEnable(row) {
      this.$store
        .dispatch("axios_update_currentTheme", {
          id: row.id,
        })
        .then((res) => {
          if (res.data.errorCode == "1000") {
            this.$message.success("操作成功！");
            this.getThemeList();
          } else {
            this.$message.error(res.data.errorMsg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    /** 编辑皮肤按钮操作 */
    handleEditSkin(row) {
      eventBus.$emit("editSkin", row);
    },
    /** 切换皮肤按钮操作 */
    handleSwitch(row) {
      this.$store
        .dispatch("axios_update_currentThemeSkin", {
          id: row.id,
          themeId: row.themeId,
        })
        .then((res) => {
          if (res.data.errorCode == "1000") {
            this.$message.success("操作成功！");
            this.getThemeList();
            this.getSkinList();
          } else {
            this.$message.error(res.data.errorMsg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /** 添加皮肤按钮操作 */
    handleAddSkin() {
      eventBus.$emit("addSkin");
    },
  },
};
</script>

<style lang="scss" scoped>
.btn_area {
  height: 4vh;
  width: 90%;
}
.add_btn {
  margin: 40px 0 0 0;
  width: 100%;
  float: left;
}
.theme {
  padding-left: 5%;
}
.channel {
  margin-bottom: 40px;
  width: 91%;
  border-bottom: 1px dashed rgb(64, 65, 150);
}
.themeDialog {
  width: 100%;
  height: 600px;
  overflow: auto;
}
.dialog {
  width: 91%;
  overflow-x: auto;
  list-style: none;
  display: flex;
}
.dialog li {
  float: left;
  height: 420px;
}
.themeView {
  width: 97%;
  height: 100%;
  padding: 10px;
  margin-right: 20px;
  font-family: "Courier New", Courier, monospace;
}
.skinView {
  width: 80%;
  height: 80%;
  padding: 5px;
  font-family: "Courier New", Courier, monospace;
}
.skinDialog {
  width: 96%;
  overflow-y: auto;
  list-style: none;
  li {
    float: left;
    width: 25%;
    height: 360px;
    margin-bottom: -25px;
  }
}
</style>