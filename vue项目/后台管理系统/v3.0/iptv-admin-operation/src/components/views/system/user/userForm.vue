<template>
  <div>
    <el-dialog
      v-dialogDrag
      ref="dialog__wrapper"
      :title="this.form.id ? '编辑' : '新增'"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="昵称" :label-width="formLabelWidth">
          <el-input v-model="form.nick" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="uname" :label-width="formLabelWidth">
          <el-input v-model="form.uname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          v-if="!this.form.id"
          label="密码"
          prop="pwd"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.pwd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="form.roleId" placeholder="请选择">
            <el-option
              v-for="item in roleData"
              :key="item.id"
              :label="item.rname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
export default {
  name: "userForm",
  inject: ["getMenuId"],
  data() {
    const validatorEname = (rule, value, callback) => {
      if (this.form.id && this.editCurUname == this.form.uname) {
        callback();
      } else {
        this.$store
          .dispatch("axios_check_user", {
            uname: value
          })
          .then(res => {
            if (res.data.data.isExisted) {
              callback(new Error("已存在"));
            } else {
              callback();
            }
          });
      }
    };
    return {
      dialogFormVisible: false,
      form: {
        nick: "",
        uname: "",
        pwd: "",
        roleId: ""
      },
      editCurUname: "",
      menuId: this.getMenuId(),
      rules: {
        pwd: [{ required: true, message: "非空", trigger: "blur" }],
        uname: [
          { required: true, message: "非空", trigger: "blur" },
          { validator: validatorEname, trigger: "blur" }
        ]
      },
      formLabelWidth: "120px",
      roleData: [{ id: "", rname: "" }]
    };
  },
  created() {
    this.getRole();
    eventBus.$on("addUser", () => {
      this.addUser();
    });
    eventBus.$on("editUser", user => {
      this.editUser(user);
    });
  },
  beforeDestroy() {
    eventBus.$off(["addUser", "editUser"]);
  },
  methods: {
    getRole() {
      this.$store
        .dispatch("axios_get_role", {
          menuId: this.menuId
        })
        .then(res => {
          this.roleData = res.data.data.list.records;
        });
    },
    addUser() {
      this.dialogFormVisible = true;
      this.form.id = "";
      this.form.nick = "";
      this.form.uname = "";
      this.form.pwd = "";
      this.form.roleId = "";
    },
    editUser(v) {
      this.dialogFormVisible = true;

      this.form.id = v.id;
      this.form.nick = v.nickname;
      this.form.uname = v.username;
      this.form.pwd = v.password;
      this.form.roleId = v.roleId;
      this.editCurUname = v.username;
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let actionUrl;
          this.form.id
            ? (actionUrl = "axios_edit_user")
            : (actionUrl = "axios_add_user");

          this.$store
            .dispatch(actionUrl, {
              id: this.form.id || undefined,
              nickname: this.form.nick,
              username: this.form.uname,
              password: this.form.pwd || undefined,
              roleId: this.form.roleId
            })
            .then(response => {
              if (response.data.errorCode == "1000") {
                this.$message.success("操作成功");
                eventBus.$emit("refreshUser");
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
</style>
