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
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-select v-model="form.activityId" placeholder="请选择">
            <el-option
              v-for="item in activeData"
              :key="item.id"
              :label="item.activityCname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="奖品名称" prop="prizeCname" :label-width="formLabelWidth">
          <el-input v-model="form.prizeCname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="奖品价格" :label-width="formLabelWidth">
          <el-input v-model="form.prizePrice" type autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="奖品数量" :label-width="formLabelWidth">
          <el-input-number size="mini" v-model="form.prizeTotalNum" :min="0"></el-input-number>
        </el-form-item>

        <el-form-item label="奖品排行" :label-width="formLabelWidth">
          <el-input-number size="mini" v-model="form.rankId" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="奖品图片" :label-width="formLabelWidth">
          <el-popover placement="right" width="535" trigger="hover">
            <img class="flagImage" slot="reference" :src="activeImg" />
            <image_choice @getSelectImage="img => setImg(img,0)"></image_choice>
          </el-popover>
        </el-form-item>
        <el-form-item label="奖品来源" :label-width="formLabelWidth">
          <el-select v-model="form.prizeFrom" placeholder="请选择">
            <el-option v-for="item in prizeFrom" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="奖品百分比" :label-width="formLabelWidth">
          <el-input-number size="mini" v-model="form.prizePercentage" :min="0" :step="1"></el-input-number>
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
import defaultFocus from "@/assets/images/add2.jpg";
import image_choice from "@/components/widget/ImageChoiceWidget";

export default {
  name: "giftForm",
  props: ["menuId"],
  inject: ["getActiveData"],
  data() {
    return {
      preBtn: true,
      nextBtn: false,
      pageTotle: 0,
      currentPage: 1,
      dialogFormVisible: false,
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      action: "",
      activeData: [],
      prizeFrom: [
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
        prizeCname: "",
        prizeTotalNum: "",
        prizeRemainNum: "",
        prizePicId: "",
        prizePrice: "",
        prizeFrom: "",
        activityId: "",
        rankId: "0",
        prizeType: "",
        prizePercentage: 0
      },
      formLabelWidth: "120px",
      activeImg: defaultFocus,
      imgData: [],
      titleE: {
        New: "新建",
        Edit: "编辑"
      },
      rules: {
        prizeCname: [{ required: true, message: "必填项", trigger: "blur" }]
      }
    };
  },
  components: { image_choice },
  created() {
    this.getImages();
  },
  methods: {
    lastPage() {
      if (this.currentPage == 1) {
        this.preBtn = true;
      } else {
        this.currentPage--;
        this.preBtn = false;
      }
      this.getImages();
    },
    nextPage() {
      this.currentPage++;
      if (this.currentPage == 1) {
        this.preBtn = true;
      } else {
        this.preBtn = false;
      }
      this.getImages();
    },
    chageTab(tab) {
      this.preBtn = true;
      this.currentPage = 1;
      this.levelId = tab.index;
      this.getImages(tab);
    },
    setImg(item) {
      this.activeImg = this.imagesBaseUrl + item.picPath;
      this.form.prizePicId = item.id;
    },
    getImages(tab) {
      let formateData = {
        levelId: this.levelId,
        pageNum: this.currentPage,
        pageSize: 12,
        temp: 0
      };
      if (this.levelId == 0) {
        delete formateData.levelId;
      }
      this.$store
        .dispatch("axios_get_pic_resouce", formateData)
        .then(rs => {
          this.imgData = rs.data.data.records;
        })
        .catch(err => {});
    },
    addGift() {
      this.action = "New";
      this.dialogFormVisible = true;
      this.form = {
        prizeCname: "",
        prizeTotalNum: "",
        prizeRemainNum: "",
        prizePicId: "",
        prizePrice: "",
        prizeFrom: "",
        activityId: "",
        rankId: "0",
        prizeType: "",
        prizePercentage: 0
      };
      this.activeImg = defaultFocus;
    },
    editGift(v, a) {
      this.form = v;
      this.activeImg = this.imagesBaseUrl + v.picUrl;
      this.action = "Edit";
      this.dialogFormVisible = true;
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.action == "New") {
            this.$store
              .dispatch("axios_add_prize", this.form)
              .then(res => {
                if (res.data.errorCode == "1000") {
                  this.$message.success("添加成功");
                  eventBus.$emit("refreshGift");
                } else {
                  this.$message.error(res.data.errorMsg);
                }
              })
              .catch(err => {
                this.$message.error("添加失败");
              });
          } else if (this.action == "Edit") {
            this.$store
              .dispatch("axios_edit_prize", this.form)
              .then(res => {
                if (res.data.errorCode == "1000") {
                  this.$message.success("修改成功");
                  eventBus.$emit("refreshGift");
                } else {
                  this.$message.error(res.data.errorMsg);
                }
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
    eventBus.$on("addGift", v => {
      this.activeData = v;
      this.addGift();
    });
    eventBus.$on("editGift", (v, a) => {
      this.activeData = a;
      this.editGift(v, a);
    });
  },
  beforeDestroy() {
    eventBus.$off("addGift");
    eventBus.$off("editGift");
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
