<template>
  <div>
    <el-dialog
      width="35vw"
      v-dialogDrag
      ref="dialog__wrapper"
      :title="this.form.id?'编辑':'新增'"
      :visible.sync="dialogFormVisible"
    >
      <el-form ref="form" :model="form" :rules="rules"  style="max-height:500px;overflow-y:auto">
        <el-form-item label="角色名" prop="rname" :label-width="formLabelWidth">
          <el-input v-model="form.rname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色权限" :label-width="formLabelWidth">
          <el-input v-model="form.rval" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="form.rdesc" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单权限" :label-width="formLabelWidth">
          <el-tree
            :data="menuData"
            accordion
            show-checkbox
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" :style="{'text-align':'center'}">
        <el-button type="primary" @click="onSubmit('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
export default {
  name: "roleForm",
  data() {
    /**
     *  自定义表单验证规则
     *  验证重复的角色名
     */
    const validatorRname = (rule, value, callback) => {
      //编辑状态下，编辑的角色等于老名字 不去校验
      if (this.form.id && this.editCurRname == this.form.rname) {
        callback();
      } else {
        this.$store
          .dispatch("axios_check_rolename", {
            rname: value
          })
          .then(res => {
            if (res.data.data.isExisted) {
              callback(new Error("已存在"));
            } else {
              callback();
            }
          })
      }
    };
    return {
      form: {
        //初始化表单数据
        id: "",
        rname: "",
        rdesc: "",
        rval: "",
        menuIds: []
      },

      rules: {
        //表单字段验证规则
        rname: [
          { required: true, message: "非空", trigger: "blur" },
          { validator: validatorRname, trigger: "blur" }
        ]
      },

      menuData: [], //菜单权限tree数据
      defaultProps: {
        //设置el-tree 显示菜单名和菜单ID
        children: "children",
        label: "menuName"
      },
      formLabelWidth: "120px",
      dialogFormVisible: false,
      editCurRname: ""
    };
  },
  created() {
    this.getMenuId();
    eventBus.$on("addRole", () => {
      this.addRole();
    });
    eventBus.$on("editRole", role => {
      this.editRole(role);
    });
  },
  //  销毁EventBug事件中转
  beforeDestroy() {
    
    eventBus.$off(["editRole", "addRole"]);
  },
  methods: {
    /**
     * 获取菜单 设置权限
     */
    getMenuId() {
      this.$store
        .dispatch("axios_get_menu")
        .then(res => {
          this.menuData = res.data.data.list;
        })
        .catch(err => {});
    },
    /**
     * 新增，重置菜单tree选中状态
     */
    resetChecked() {
      this.$refs.tree.setCheckedKeys([]);
    },
    /**
     * 编辑，回显，设置选中状态
     */
    setCheckedKeys(ids) {
      this.$refs.tree.setCheckedKeys(ids);
    },
    /**
     * 添加角色
     */
    addRole() {
      this.form.id = "";
      this.form.rname = "";
      this.form.rdesc = "";
      this.form.rval = "";
      this.editCurRname = "";
      this.dialogFormVisible = true;
      this.$nextTick(function() {
        this.resetChecked();
      });
    },
    /**
     *
     * 编辑角色
     */
    editRole(v) {
      this.form.id = v.id;
      this.form.rname = v.rname;
      this.form.rdesc = v.rdesc;
      this.form.rval = v.rval;
      this.editCurRname = v.rname;
      this.dialogFormVisible = true;
      this.$nextTick(function() {
        this.setCheckedKeys(v.menuIds);
      });
    },

    /**
     *
     * 表单提交
     *
     */
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let checkey = this.$refs.tree
            .getCheckedKeys()
            .concat(this.$refs.tree.getHalfCheckedKeys());
          let actionUrl;
          this.form.id
            ? (actionUrl = "axios_edit_role")
            : (actionUrl = "axios_add_role");
          this.$store
            .dispatch(actionUrl, {
              id: this.form.id || undefined,
              rname: this.form.rname,
              rdesc: this.form.rdesc,
              rval: this.form.rval,
              menuIds: checkey
            })
            .then(response => {
              if (response.data.errorCode == "1000") {
                this.$message.success("操作成功");
                eventBus.$emit("refreshRole");
              } else {
                this.$message.error("操作失败");
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
<style scoped>
.el-input {
  width: 80%;
}
</style>
