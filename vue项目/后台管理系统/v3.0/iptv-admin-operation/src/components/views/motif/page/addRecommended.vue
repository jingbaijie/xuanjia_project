<template>
  <div>
    <el-dialog
      width="57vw"
      v-dialogDrag
      ref="dialog__wrapper"
      title="添加推荐"
      :visible.sync="dialogFormVisible"
    >
      <div class="btn_area">
        <keySearch
          @searchData="getSearchVal"
          plecegilder="请输入推荐名"
        ></keySearch>
      </div>

      <div class="dialog">
        <el-row class="templateHead">
          <el-col :span="4" :xs="24" class="templateTable">
            <h4>推荐名称</h4>
          </el-col>
          <el-col :span="20" :xs="24">
            <h4>推荐样式</h4>
          </el-col>
        </el-row>
        <el-row
          v-for="(item, index) in templateData"
          :key="index"
          class="template"
        >
          <el-col :span="4" :xs="24" class="templateTable templateContent">
            <div style="margin-top: 50%">
              <h4>{{ item.cname }}</h4>
              <el-button type="text" @click="handleChange(item)"
                >选择</el-button
              >
            </div>
          </el-col>
          <el-col :span="20" :xs="24">
            <img
              style="width: 100%; height: 230px"
              v-if="item.previewPic"
              :src="imagesBaseUrl + item.previewPic.picPath"
              alt=""
            />
          </el-col>
        </el-row>
      </div>
      <pagination
        :total="total"
        :page.sync="pageNum"
        :limit.sync="pageSize"
        @pagination="getComponent"
      />
    </el-dialog>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import Pagination from "@/components/widget/Pagination";
import keySearch from "@/components/widget/keySearch";
export default {
  name: "addRecommended",
  components: { Pagination, keySearch },
  data() {
    return {
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      total: 0,
      // 显示搜索条件
      showSearch: true,
      searchVal: "",
      pageNum: 1,
      pageSize: 10,
      templateData: [],
      dialogFormVisible: false,
    };
  },
  created() {
    this.getComponent();
  },
  methods: {
    init() {
      this.dialogFormVisible = true;
    },
    getSearchVal(val) {
      this.searchVal = val;
      this.getComponent();
    },
    handleChange(row) {
      // 获取组件详情信息
      this.$store
        .dispatch("axios_get_componentById", { id: row.id })
        .then((res) => {
          this.$message.success("添加成功！");
          eventBus.$emit("recommended", res.data.data[0]);
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    getComponent() {
      this.$store
        .dispatch("axios_get_componentList", {
          cname: this.searchVal,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        })
        .then((res) => {
          this.templateData = res.data.data.records;
          this.total = res.data.data.total;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog {
  height: 600px;
  overflow: auto;
}
.templateHead {
  width: 99%;
  margin-left: 10px !important;
  border: 1px solid #ccc;
  text-align: center;
}
.template {
  width: 99%;
  margin-left: 10px !important;
  border: 1px solid #ccc;
  border-top: none;
  text-align: center;
}
.templateTable {
  border-right: 1px solid #ccc;
}
.templateContent {
  height: 240px;
}
.btn_area {
  margin-left: 10px !important;
  height: 60px;
}
</style>
