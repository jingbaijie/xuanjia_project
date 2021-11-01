<template>
  <div>
    <el-dialog
      width="45%"
      height="50"
      v-dialogDrag
      ref="dialog__wrapper"
      title="节目集图片匹配"
      :visible.sync="dialogPictureMatchForm"
    >
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item
          label="匹配规则 :"
          prop="matchRule"
          :label-width="formLabelWidth"
        >
          <el-radio-group v-model="form.matchRule" @change="sourceRule()">
            <el-radio label="1">节目集中文名称</el-radio>
            <el-radio label="0">节目集英文名称</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="匹配范围 :"
          prop="matchRange"
          :label-width="formLabelWidth"
        >
          <el-radio-group v-model="form.matchRange" @change="sourceRange()">
            <el-radio label="1">全部替换</el-radio>
            <el-radio label="0">只匹配缺失图片的节目集</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="匹配图库类型 :"
          prop="matchRange"
          :label-width="formLabelWidth"
        >
          <el-radio-group v-model="form.levelId" @change="sourceRange()">
            <el-radio label="iconPicW">详情图</el-radio>
            <el-radio label="labelPicW">标签图</el-radio>
            <el-radio label="detailPicW">卡通图</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="匹配图片尺寸 :" :label-width="formLabelWidth">
          <el-input v-model="picSize" placeholder="请输入图片尺寸"></el-input>
        </el-form-item>
        <el-form-item label="更新节目子集 :" :label-width="formLabelWidth">
          <el-radio-group v-model="form.isMatchedProgramPic" @change="sourceRange()">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <p>匹配说明：</p>
        <p>1.请先使用批量上传图片功能，上传图片到服务器；</p>
        <p>2.图片的名称必须是节目集的中文或者英文名称；</p>
        <p>3.文件名称不要使用特殊符号，会导致匹配不成功。</p>
        <div style="text-align:right">
          <el-button type="primary" @click="onSubmit('form')">提交</el-button>
          <!-- <el-button>取消</el-button> -->
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import defaultFocus from "@/assets/images/add2.jpg";
import image_choice from "@/components/widget/ImageChoiceWidget";

export default {
  name: "programForm",
  data() {
    return {
      dialogPictureMatchForm: false,
      form: {
        matchRule: "",
        matchRange: ""
      },
      formLabelWidth: "120px",
      picSize: "",
      rules: {
        matchRule: [
          { required: true, message: "请选择匹配规则", trigger: "change" }
        ],
        matchRange: [
          { required: true, message: "请选择匹配范围", trigger: "change" }
        ]
      },
      props: {}
    };
  },
  //   inject: ["getClassifyData", "getMenuId", "getTagsData"],
  beforeCreate() {},
  components: { image_choice },
  computed: {},
  methods: {
    onSubmit(formName) {
      var param = {
        isMatchedByCName: this.form.matchRule,
        isMatchedAll: this.form.matchRange,
        levelId: this.form.levelId,
        isMatchedProgramPic:this.form.isMatchedProgramPic
      };
      var a = this.form.levelId;
      param[a] = this.picSize;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store
            .dispatch("axios_get_autoMatchPic", param)
            .then(res => {
              if (res.data.errorCode == "1000") {
                this.$message.success("匹配完成");
                this.$clear.axios_clearCache();
                eventBus.$emit("getTypeInfo");
              } else {
                this.$message.error("匹配失败");
              }
            })
            .catch(err => {
              this.$message.error("匹配失败");
            });
        }
        this.dialogPictureMatchForm = false;
      });
    },
    pictureMatch() {
      this.dialogPictureMatchForm = true;
    },
    sourceRule() {
      console.log(this.form.matchRule);
    },
    sourceRange() {
      console.log(this.form.matchRange);
    }
  },
  created() {},
  mounted() {
    eventBus.$on("pictureMatch", v => {
      this.pictureMatch();
    });
  },
  beforeDestroy() {
    eventBus.$off(["pictureMatch"]);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
p {
  color: red;
}
/deep/ .el-dialog__body {
  padding: 30px 50px;
}
</style>




