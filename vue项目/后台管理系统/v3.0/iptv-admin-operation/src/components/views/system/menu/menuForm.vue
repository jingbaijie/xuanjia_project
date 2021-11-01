<template>
  <div>
    <el-dialog
      width="50vw"
      v-dialogDrag
      ref="dialog__wrapper"
      :title="this.form.menuId?'编辑':'新增'"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item
          v-if="form.menuType!==1"
          label="上级菜单"
          :label-width="formLabelWidth"
          :style="{'text-align':'center','width':'60%'}"
        >
          <div class="block">
            <el-cascader
              :options="datas"
              :props=" defaultProps"
              v-model="form.parentId"
              :show-all-levels="false"
              clearable
            ></el-cascader>
          </div>
        </el-form-item>
        <el-form-item label="菜单类型" :label-width="formLabelWidth">
          <el-radio-group v-model="form.menuType" style="padding-left:30px">
            <el-radio :label="1">目录</el-radio>
            <el-radio :label="2">菜单</el-radio>
            <el-radio :label="3">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName" :label-width="formLabelWidth">
          <el-input v-model="form.menuName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="form.menuType==2" label="请求地址" :label-width="formLabelWidth">
          <el-input v-model="form.url" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="form.menuType!==1" label="权限标识" :label-width="formLabelWidth">
          <el-input v-model="form.perms" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="显示排序" :label-width="formLabelWidth">
          <el-input v-model="form.orderNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="form.menuType==1" label="图标" :label-width="formLabelWidth">
          <!-- <el-transfer v-model="form.icon" :data="data"></el-transfer> -->
          <!-- <el-input v-model="form.icon" autocomplete="off"></el-input> -->
          <el-popover placement="right" width="350" trigger="hover">
            <el-button
              slot="reference"
              style="margin-left:20px"
              size="medium"
              :icon="form.icon"
              type="info"
              circle
            ></el-button>
            <transition name="fade-transform" mode="out-in">
              <icon_choice></icon_choice>
            </transition>
          </el-popover>
        </el-form-item>
        <el-form-item label="菜单描述" :label-width="formLabelWidth">
          <el-input v-model="form.remark" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否隐藏" :label-width="formLabelWidth">
          <el-checkbox v-model="form.visible">隐藏</el-checkbox>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button type="primary" @click="onSubmit('form')">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import icon_choice from "@/components/widget/IconChoiceWidget";

export default {
  name: "menuForm",
  data() {
    return {
      iconView: false,
      dialogFormVisible: false,
      action: "",
      form: {
        menuId: "",
        menuName: "",
        parentId: "",
        url: "",
        menuType: 1,
        orderNum: "",
        visible: false,
        perms: "",
        icon: "el-icon-circle-plus-outline",
        remark: ""
      },
      typeChange: {
        M: 1,
        C: 2,
        F: 3,
        "1": "M",
        "2": "C",
        "3": "F"
      },
      formLabelWidth: "120px",
      value: [1, 4],
      defaultProps: {
        children: "children",
        label: "menuName",
        value: "id",
        checkStrictly: true,
        expandTrigger: "hover",
        emitPath: false
      },
      datas: [],
      rules: {
        menuName: [{ required: true, message: "必填项", trigger: "blur" }]
      }
    };
  },

  computed: {},
  methods: {
    //获取上级菜单
    parseJson() {
      this.$store.dispatch("axios_load_navbar").then(res => {
        this.datas = res.data.data.menus;
      });
    },
    addMenu() {
      this.form.menuId = "";
      this.form.menuName = "";
      this.form.parentId = "";
      this.form.orderNum = "";
      this.form.url = "";
      this.form.menuType = 1;
      this.form.visible = false;
      this.form.perms = "";
      this.form.icon = "el-icon-circle-plus-outline";
      this.form.remark = "";
      this.dialogFormVisible = true;
    },
    editMenu(menu) {
      this.dialogFormVisible = true;
      this.form.menuType = this.typeChange[menu.menuType];
      if (this.form.menuType == 1) {
        this.form.icon = menu.icon;
      } else if (this.form.menuType == 2) {
        this.form.url = menu.url;
        this.form.perms = menu.perms;
      } else if (this.form.menuType == 3) {
        this.form.perms = menu.perms;
      }
      this.form.menuId = menu.id;
      this.form.menuName = menu.menuName;
      this.form.parentId = menu.parentId;
      this.form.orderNum = menu.orderNum;
      this.form.visible = menu.visible == "0" ? false : true;
      this.form.remark = menu.remark;
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let actionUrl;
          this.form.menuId
            ? (actionUrl = "axios_edit_menu")
            : (actionUrl = "axios_add_menu");
          if (this.form.menuType == 1) {
            this.form.parentId = 0;
          }
          this.$store
            .dispatch(actionUrl, {
              id: this.form.menuId || undefined,
              menuName: this.form.menuName,
              parentId: this.form.parentId,
              orderNum: this.form.orderNum,
              url: this.form.url,
              menuType: this.typeChange[this.form.menuType],
              visible: this.form.visible ? "1" : "0",
              perms: this.form.perms,
              icon: this.form.icon,
              remark: this.form.remark
            })
            .then(response => {
              if (response.data.errorCode == "1000") {
                this.$message.success("操作成功");
                this.$emit("menuList");
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
  },
  created() {
    eventBus.$on("addMenu", v => {
      this.addMenu(v);
    });
    eventBus.$on("editMenuXXXXX", v => {
      this.editMenu(v);
    });
    eventBus.$on("selIcon", v => {
      this.form.icon = v;
    });
    this.parseJson();
  },
  beforeDestroy() {
    eventBus.$off("addMenu");
    eventBus.$off("editMenuXXXXX");
    eventBus.$off("selIcon");
  },
  components: {
    icon_choice
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  scoped>
.el-input {
  width: 80%;
}
.el-checkbox {
  margin-left: 25px;
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
