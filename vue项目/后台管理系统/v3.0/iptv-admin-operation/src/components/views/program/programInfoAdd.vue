<template>
  <div>
    <el-dialog
      width="35vw"
      height="50"
      v-dialogDrag
      ref="dialog__wrapper"
      :title="titleE[action]"
      :visible.sync="dialogProgramInfo"
    >
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item
          label="中文名称"
          prop="videoCname"
          :label-width="formLabelWidth"
        >
          <el-input type="text" v-model="form.videoCname"></el-input>
        </el-form-item>
        <el-form-item
          label="英文名称"
          prop="videoEname"
          :label-width="formLabelWidth"
        >
          <el-input type="text" v-model="form.videoEname"></el-input>
        </el-form-item>
        <!-- <el-form-item label="修改时间" prop="videoSumtime" :label-width="formLabelWidth">
          <el-input type="text" v-model="form.videoSumtime"></el-input>
        </el-form-item>-->
        <el-form-item label="排行ID" :label-width="formLabelWidth">
          <el-input-number
            v-model="form.rankId"
            :min="0"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          label="时长"
          prop="videoTime"
          :label-width="formLabelWidth"
        >
          <el-input type="text" v-model="form.videoTime"></el-input>
        </el-form-item>
        <el-form-item label="标签图" :label-width="formLabelWidth">
          <el-popover placement="right" width="535" trigger="hover">
            <img class="flagImage" slot="reference" :src="labelPicUrl" />
            <image_choice
              @getSelectImage="img => setImg(img, 0)"
            ></image_choice>
          </el-popover>
        </el-form-item>
        <el-form-item label="详情图" :label-width="formLabelWidth">
          <el-popover placement="right" width="535" trigger="hover">
            <img class="flagImage" slot="reference" :src="detailPicUrl" />
            <image_choice
              @getSelectImage="img => setImg(img, 1)"
            ></image_choice>
          </el-popover>
        </el-form-item>
        <el-form-item label="卡通图" :label-width="formLabelWidth">
          <el-popover placement="right" width="535" trigger="hover">
            <img class="flagImage" slot="reference" :src="iconPicUrl" />
            <image_choice
              @getSelectImage="img => setImg(img, 2)"
            ></image_choice>
          </el-popover>
        </el-form-item>
        <el-form-item label="详情大图" :label-width="formLabelWidth">
          <el-popover placement="right" width="535" trigger="hover">
            <img class="flagImage" slot="reference" :src="flagPicUrl" />
            <image_choice
              @getSelectImage="img => setImg(img, 3)"
            ></image_choice>
          </el-popover>
        </el-form-item>

        <!-- <el-form-item label="CP/SP信息" :label-width="formLabelWidth">
          <el-select v-model="form.cspInfo" placeholder="请选择">
            <el-option v-for="item in cpData" :key="item.id" :label="item.cpCname" :value="item.id"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item
          label="是否上架"
          prop="booleanUp"
          :label-width="formLabelWidth"
        >
          <el-switch
            v-model="form.booleanUp"
            :active-value="2"
            :inactive-value="0"
            active-color="#13ce66"
          ></el-switch>
        </el-form-item>
        <el-form-item
          label="是否免费"
          prop="isFree"
          :label-width="formLabelWidth"
        >
          <el-switch
            v-model="form.isFree"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="onSubmit('form')">提交</el-button>
        <!-- <el-button>取消</el-button> -->
      </div>
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
      cartoonId: "",
      dialogProgramInfo: false,
      formLabelWidth: "120px",
      pageTotle: 0,
      id: "",
      currentPage: 1,
      titleE: {
        add: "添加",
        edit: "编辑"
      },
      iconPicUrl: defaultFocus,
      labelPicUrl: defaultFocus,
      flagPicUrl: defaultFocus,
      detailPicUrl: defaultFocus,
      form: {
        videoCname: "",
        videoEname: "",
        videoTime: "",
        rankId: "",
        booleanUp: "",
        isFree: ""
      },
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      action: "",
      rules: {
        videoCname: [
          { required: true, message: "请输入中文名", trigger: "blur" }
        ],
        videoEname: [
          { required: true, message: "请输入英文名", trigger: "blur" }
        ]
      }
    };
  },
  //   inject: ["getClassifyData", "getMenuId"],
  beforeCreate() {},
  components: { image_choice },
  computed: {
    //获取CP信息
    getCpList() {
      this.$store
        .dispatch("axios_get_cp", {
          pageNum: 1,
          pageSize: 100
        })
        .then(res => {
          if (res.data.errorCode == "1000") {
            this.cpData = res.data.data.list.records;
          }
        });
    }
  },
  methods: {
    addProgram() {
      this.form.id = "";
      this.form.videoCname = "";
      this.form.videoEname = "";
      this.form.videoTime = "";
      this.form.rankId = "";
      this.form.booleanUp = "";
      this.form.isFree = "";
      this.labelPicUrl = defaultFocus;
      this.iconPicUrl = defaultFocus;
      this.flagPicUrl = defaultFocus;
      this.detailPicUrl = defaultFocus;
    },
    editProgram(v) {
      // this.form.id = v.id;
      // this.form.videoCname = v.videoCname;
      // this.form.videoEname = v.videoEname;
      // this.form.videoTime = v.videoTime;
      // this.form.rankId = v.rankId;
      // this.form.booleanUp = v.booleanUp;
      // this.form.isFree = v.isFree;

      this.form = v;
      v.detailPic
        ? (this.detailPicUrl = this.imagesBaseUrl + v.detailPic.picPath)
        : (this.detailPicUrl = defaultFocus);
      v.labelPic
        ? (this.labelPicUrl = this.imagesBaseUrl + v.labelPic.picPath)
        : (this.labelPicUrl = defaultFocus);
      v.iconPic
        ? (this.iconPicUrl = this.imagesBaseUrl + v.iconPic.picPath)
        : (this.iconPicUrl = defaultFocus);
      v.flagPic
        ? (this.flagPicUrl = this.imagesBaseUrl + v.flagPic.picPath)
        : (this.flagPicUrl = defaultFocus);
    },
    setImg(item, type) {
      if (type == 0) {
        this.labelPicUrl = this.imagesBaseUrl + item.picPath;
        this.form["labelPic"] = {};
        this.form["labelPic"].id = item.id;
      } else if (type == 1) {
        this.detailPicUrl = this.imagesBaseUrl + item.picPath;
        this.form["detailPic"] = {};
        this.form["detailPic"].id = item.id;
      } else if (type == 2) {
        this.iconPicUrl = this.imagesBaseUrl + item.picPath;
        this.form["iconPic"] = {};
        this.form["iconPic"].id = item.id;
      } else {
        this.flagPicUrl = this.imagesBaseUrl + item.picPath;
        this.form["flagPic"] = {};
        this.form["flagPic"].id = item.id;
      }
    },
    onSubmit(fromName) {
      this.$refs[fromName].validate(valid => {
        if (valid) {
          let actionUrl;
          this.form.id
            ? (actionUrl = "axios_get_programUpdate")
            : (actionUrl = "axios_get_programInsert");

          this.$store
            .dispatch(actionUrl, this.form)
            .then(response => {
              if (response.data.errorCode == "1000") {
                this.$message.success("操作成功");
                this.$clear.axios_clearCache();
                eventBus.$emit("refreshProgramList2");
              } else {
                this.$message.error(response.data.errorMsg);
              }
            })
            .catch(err => {
              this.$message.error("操作失败");
            });
          this.dialogProgramInfo = false;
        } else {
          return false;
        }
      });
    }
  },
  created() {
    this.getCpList;
  },
  mounted() {
    eventBus.$on("addProgramInfo", v => {
      console.log("卡通ID:" + v);
      this.cartoonId = v;
      this.action = "add";
      this.addProgram();
      this.dialogProgramInfo = true;
    });
    eventBus.$on("editProgramInfo", v => {
      this.action = "edit";
      this.editProgram(v);
      this.dialogProgramInfo = true;
      this.id = v.id;
    });
  },
  beforeDestroy() {
    eventBus.$off(["addProgramInfo", "editProgramInfo"]);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  scoped>
.el-textarea {
  width: 85%;
}
.el-input {
  width: 85%;
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
.flagImage {
  width: 50px;
}

/* ul li {
  list-style-type: none;
  float: left;
  margin-left: 10px;
  margin-top: 10px;
} */

ul li img {
  width: 128px;
  height: 72px;
}

.selectImg {
  width: 100%;
  height: 400px;
  white-space: nowrap;
}
</style>




