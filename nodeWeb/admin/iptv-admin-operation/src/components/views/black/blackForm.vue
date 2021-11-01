<template>
  <div>
    <el-dialog
      v-dialogDrag
      ref="dialog__wrapper"
      :title="titleE[action]"
      :visible.sync="dialogFormVisible"
      width="550px"
    >
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="用户编号" prop="userId" :label-width="formLabelWidth">
          <!-- <el-select
            v-selectScroll="loadScrollData"
            :filter-method="bySearchValue"
            filterable
            v-model="form.userId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.userId"
              :value="item.userId"
            ></el-option>
          </el-select>-->
          <el-input v-model="form.userId" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="名单类型" :label-width="formLabelWidth">
          <el-select v-model="form.userType" placeholder="请选择">
            <el-option
              v-for="item in listType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容类型" :label-width="formLabelWidth">
          <el-select v-model="form.codeType" placeholder="请选择">
            <el-option
              v-for="item in contentType"
              :key="item.value"
              :label="item.contentType"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生效时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.startTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="失效时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.endTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="onSubmit('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import defaultFocus from "@/assets/images/add2.jpg";
export default {
  name: "giftForm",
  inject: ["getActiveData", "getMenuId"],
  data() {
    return {
      contentType: [
        { value: 0, contentType: "全部" },
        { value: 1, contentType: "卡通" },
        { value: 2, contentType: "游戏" }
      ],
      titleE: {
        New: "新建",
        Edit: "编辑"
      },
      dialogFormVisible: false,
      action: "",
      activeData: [],
      form: {},
      searchValue: "",
      formLabelWidth: "120px",
      imgData: [],
      currentPage: 1,
      menuId: this.getMenuId(),
      listType: [
        { value: 1, label: "黑名单" },
        { value: 0, label: "白名单" }
      ],
      userList: [],
      titleE: {
        New: "新建",
        Edit: "编辑"
      },
      rules: {
        userId: [{ required: true, message: "必填项", trigger: "blur" }]
      }
    };
  },
  created() {
    this.loadUserData(this.currentPage);
  },
  methods: {
    bySearchValue(val) {
      this.searchValue = val;
      this.loadUserData(this.currentPage);
    },
    loadUserData(pageIndex) {
      this.$store
        .dispatch("axios_get_userList", {
          pageNum: pageIndex,
          searchValue: this.searchValue
        })
        .then(res => {
          this.userList = res.data.data.records;
        });
    },
    loadScrollData(scrollDown) {
      if (scrollDown) {
        this.$store
          .dispatch("axios_get_userList", {
            pageNum: ++this.currentPage,
            searchValue: this.searchValue
          })
          .then(res => {
            this.userList = this.userList.concat(res.data.data.records);
          });
      }
    },
    addGift() {
      this.action = "New";
      this.dialogFormVisible = true;
      this.form = {};
    },
    editGift(v) {
      this.form = v;
      this.action = "Edit";
      this.dialogFormVisible = true;
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.action == "New") {
            this.$store
              .dispatch("axios_add_blackList", this.form)
              .then(res => {
                if (res.data.errorCode == "1000") {
                  this.$message.success("添加成功");
                  this.$emit("refreshBlack");
                } else {
                  this.$message.error(res.data.errorMsg);
                }
              })
              .catch(err => {
                this.$message.error("添加失败");
              });
          } else if (this.action == "Edit") {
            this.$store
              .dispatch("axios_edit_blackList", this.form)
              .then(res => {
                this.$message.success("修改成功");
                this.$emit("refreshBlack");
              })
              .catch(err => {
                this.$message.error("修改失败");
              });
          }
          this.dialogFormVisible = false;
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    eventBus.$on("addBlackList", v => {
      this.addGift();
    });
    eventBus.$on("editBlackList", v => {
      this.editGift(v);
    });
  },
  beforeDestroy() {
    eventBus.$off(["addBlackList", "editBlackList"]);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-select {
  width: 40%;
}
.el-input {
  width: 80%;
}
.el-checkbox {
  padding-left: 10px;
}

.dialog-footer {
  text-align: center;
}

.el-dropdown {
  vertical-align: top;
  width: 100px;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  width: 50x;
  font-size: 12px;
}

.flagImage {
  width: 50px;
}
ul li img {
  width: 128px;
  height: 72px;
}
.selectImg {
  width: 100%;
  height: 400px;
  white-space: nowrap;
}
.prize_pic ul li {
  list-style-type: none;
  float: left;
  margin-left: 10px;
  margin-top: 10px;
}
</style>
