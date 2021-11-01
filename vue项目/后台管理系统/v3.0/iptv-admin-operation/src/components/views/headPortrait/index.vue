<template>
  <div>
    <div class="btn_area">
      <el-form :inline="true" :model="form" ref="form" class="demo-form-inline">
        <el-form-item label="昵称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="用户头像/昵称名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="typeId">
          <el-select v-model="form.typeId" placeholder="请选择">
            <el-option label="头像数据" :value="1"></el-option>
            <el-option label="昵称数据" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否上线" prop="booleanUp">
          <el-select v-model="form.booleanUp" placeholder="请选择">
            <el-option label="未上线" :value="0"></el-option>
            <el-option label="上线" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getAvatar">查询</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="add_btn">
        <el-button
          :style="{ float: 'right', margin: '0 70px 0 0' }"
          size="mini"
          type="primary"
          plain
          @click="handleCreate()"
          >新增</el-button
        >
        <el-button
          :style="{ float: 'right', margin: '0 10px 0 0' }"
          size="mini"
          type="warning"
          plain
          @click="handleMatch()"
          >图片匹配</el-button
        >
      </div>
    </div>
    <el-table
      v-loading="loading"
      :data="avatarList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      ref="multipleTable"
      :height="tableHeight"
    >
      <el-table-column prop="id" label="编号"></el-table-column>

      <el-table-column prop="name" label="头像/昵称"></el-table-column>
      <el-table-column label="typeId">
        <template slot-scope="scope">
          {{ type[scope.row.typeId] }}
        </template>
      </el-table-column>
      <el-table-column label="头像图片地址">
        <template slot-scope="scope">
          <img
            :style="{ width: '50px' }"
            v-if="scope.row.avatarPic"
            :src="imagesBaseUrl + scope.row.avatarPic.picPath"
          />
        </template>
      </el-table-column>

      <el-table-column label="是否上线">
        <!-- <template slot-scope="scope">
          {{ booleanUpType[scope.row.booleanUp] }}
        </template> -->
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
              @change="booleanUp => changeOnLine(booleanUp, scope.row)"
            ></el-switch>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="260">
        <template slot-scope="scope">
          <el-button
            plain
            size="mini"
            type="warning"
            @click="handleEdit(scope.$index, avatarList)"
            >编辑</el-button
          >

          <el-button
            plain
            size="mini"
            type="warning"
            @click="handleDelete(scope.$index, avatarList)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="msg">暂无权限</div> -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="currentPage"
      :limit.sync="pageSize"
      @pagination="getAvatar()"
    />
    <configForm></configForm>
    <matchForm ref="match"></matchForm>
  </div>
</template>
<script>
import { Message, Loading } from "element-ui";
import { eventBus } from "@/common/eventBus";
import Pagination from "@/components/widget/Pagination";
import keySearch from "@/components/widget/keySearch";
import configForm from "./editForm";
import matchForm from "./matchForm";
export default {
  name: "avatarList",
  components: {
    Pagination,
    keySearch,
    configForm,
    matchForm
  },
  data() {
    return {
      form: {},
      online: {
        "0": "下架",
        "2": "上架"
      },
      type: { "1": "头像数据", "2": "昵称数据" },
      booleanUpType: { "0": "未上线", "2": "上线" },
      currentPage: 1, //分页当前页码
      pageSize: 10,
      total: 1,
      searchVal: "",
      loading: true,
      tableHeight: undefined,
      avatarList: [],
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL
    };
  },

  created() {},
  mounted() {
    this.getAvatar();
  },
  destroyed() {},
  methods: {
    getAvatar() {
      this.$store
        .dispatch(
          "axios_get_userAvatar",
          Object.assign(this.form, {
            pageNum: this.currentPage,
            pageSize: this.pageSize
          })
        )
        .then(res => {
          if (res != "undefined") {
            this.avatarList = res.data.data.records;
            this.total = res.data.data.total;
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },

    handleCreate() {
      eventBus.$emit("addAvatar");
    },
    handleEdit(index, rows) {
      eventBus.$emit("editAvatar", rows[index]);
    },
    handleMatch() {
      this.$refs.match.configInfo();
    },
    changeOnLine(booleanUp, item) {
      this.$store
        .dispatch("axios_edit_userAvatarUpdateBooleanUp", {
          ids: item.id,
          booleanUp: booleanUp
        })
        .then(response => {
          if (response.data.errorCode == "1000") {
            this.$message.success("操作成功！");
          } else {
            booleanUp == 0 ? (booleanUp = 2) : (booleanUp = 0);
            this.$message.error(response.data.errorMsg);
          }
          this.getAvatar();
        })
        .catch(err => {
          this.$message.error("操作失败，请联系管理员");
        });
    },
    handleDelete(index, rows) {
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("axios_del_teacher", {
              ids: rows[index].id
            })
            .then(res => {
              if (res.data.errorCode == "1000") {
                Message({ message: res.data.errorMsg, type: "success" });
                this.getAvatar();
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
    resetForm(form) {
      this.$refs["form"].resetFields();
      this.getAvatar();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  },
  destroyed() {
    eventBus.$off(["editTeacher", "addTeacher"]);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
}

.el-input--mini .el-input__inner {
  width: 100px;
}
.el-pagination {
  text-align: center;
}
.pading_area {
  margin-top: 25px;
}
</style>
