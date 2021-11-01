<template>
  <div>
    <el-dialog
      v-dialogDrag
      width="35vw"
      ref="dialog__wrapper"
      :title="titleE[action]"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="字典名称" prop="dictName" :label-width="formLabelWidth">
          <el-input v-model="form.dictName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="字典类型" :label-width="formLabelWidth">
          <el-input v-model="form.dictType" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
            :style="{'margin-left':'20px'}"
          ></el-switch>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.remark" type autocomplete="off"></el-input>
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
export default {
  name: "giftForm",
  props: ["menuId"],
  data() {
    return {
      dialogFormVisible: false,
      action: "",
      statusType: [
        {
          id: "0",
          name: "活动"
        },
        {
          id: "1",
          name: "平台"
        }
      ],
      form: {
        dictName: "",
        dictType: "",
        status: 0,
        remark: ""
      },
      formLabelWidth: "120px",
      titleE: {
        New: "新增",
        Edit: "编辑"
      },
      rules: {
        dictName: [{ required: true, message: "必填项", trigger: "blur" }]
      }
    };
  },
  // computed:{
  //   getStatus(){
  //     return this.form.status
  //     }
  // },
  // watch:{
  //   getStatus:{
  //     handler(old,newVal){
  //       console.log('old'+old+' :  '+typeof old);
  //       console.log('new'+newVal+' :  '+typeof old);
  //     }
  //   }
  // },
  methods: {
    addDict() {
      this.action = "New";
      this.dialogFormVisible = true;
      this.form = {
        status: 0
      };
    },
    editDict(v) {
      this.form = v;
      this.action = "Edit";
      this.dialogFormVisible = true;
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.status ? (this.form.status = 1) : (this.form.status = 0);
          if (this.action == "New") {
            this.$store
              .dispatch("axios_add_dictTypeList", this.form)
              .then(res => {
                if (res.data.errorCode == "1000") {
                  this.$message.success("添加成功");
                  eventBus.$emit("refreshDict");
                } else {
                  this.$message.error(res.data.errorMsg);
                }
              })
              .catch(err => {
                this.$message.error(res.data.errorMsg);
              });
          } else if (this.action == "Edit") {
            this.$store
              .dispatch("axios_edit_dictTypeList", this.form)
              .then(res => {
                if (res.data.errorCode == "1000") {
                  this.$message.success("修改成功");
                  eventBus.$emit("refreshDict");
                } else {
                  this.$message.error(res.data.errorMsg);
                }
              })
              .catch(err => {
                this.$message.error(res.data.errorMsg);
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
    eventBus.$on("addDictType", v => {
      this.addDict();
    });
    eventBus.$on("editDictType", v => {
      this.editDict(v);
    });
  },
  beforeDestroy() {
    eventBus.$off("addDictType");
    eventBus.$off("editDictType");
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
