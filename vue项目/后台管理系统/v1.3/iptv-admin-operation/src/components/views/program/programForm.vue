<template>
  <div>
    <el-dialog
      width="35vw"
      height="50"
      v-dialogDrag
      ref="dialog__wrapper"
      title="添加节目集"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" ref="form" :rules="rules"  style="max-height:500px;overflow-y:auto">
        <el-form-item label="归属类型" :label-width="formLabelWidth">
          <el-cascader
            v-model="form.typeParentPath"
            placeholder="搜索"
            :options="parentData"
            :props="{multiple: true,children:'childrenList',label:'typeCname',value:'id'}"
            filterable
            size="medium"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="节目名称" prop="cartoonCname" :label-width="formLabelWidth">
          <el-input type="text" v-model="form.cartoonCname"></el-input>
        </el-form-item>
        <el-form-item label="节目标签" :label-width="formLabelWidth">
          <el-cascader
            v-model="form.tagParentPath"
            filterable
            :options="tagsData"
            :props="{multiple: true,children:'childrenList',label:'typeCname',value:'id'}"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="CP/SP信息" prop="cspInfo" :label-width="formLabelWidth">
          <el-select v-model="form.cspInfo.id" placeholder="请选择">
            <el-option v-for="item in cpData" :key="item.id" :label="item.cpCname" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="英文名称" :label-width="formLabelWidth">
          <el-input type="text" v-model="form.cartoonEname"></el-input>
        </el-form-item>
        <el-form-item label="标签图片" :label-width="formLabelWidth">
          <el-popover placement="right" width="535" trigger="hover">
            <img class="flagImage" slot="reference" :src="labelPicUrl" />
            <image_choice @getSelectImage="img => setImg(img,0)"></image_choice>
          </el-popover>
        </el-form-item>
        <el-form-item label="详情图片" :label-width="formLabelWidth">
          <el-popover placement="right" width="535" trigger="hover">
            <img class="flagImage" slot="reference" :src="detailPicUrl" />
            <image_choice @getSelectImage="img => setImg(img,1)"></image_choice>
          </el-popover>
        </el-form-item>
        <el-form-item label="卡通图" :label-width="formLabelWidth">
          <el-popover placement="right" width="535" trigger="hover">
            <img class="flagImage" slot="reference" :src="iconPicUrl" />
            <image_choice @getSelectImage="img => setImg(img,2)"></image_choice>
          </el-popover>
        </el-form-item>
        <el-form-item label="版权开始时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.cartoonProprietorsStarttime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="版权结束时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.cartoonProprietorsEndtime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="视频集数" :label-width="formLabelWidth">
          <el-input-number type="text" v-model="form.cartoonSumvideonum"></el-input-number>
        </el-form-item>
        <el-form-item label="版权方" :label-width="formLabelWidth">
          <el-input type="text" v-model="form.cartoonProprietors"></el-input>
        </el-form-item>
        <el-form-item label="介质类型" :label-width="formLabelWidth">
          <el-input type="text" v-model="form.cartoonMediatype"></el-input>
        </el-form-item>
        <el-form-item label="单集平均时长" :label-width="formLabelWidth">
          <el-input-number type="text" v-model="form.cartoonAveragetime"></el-input-number>
        </el-form-item>
        <el-form-item label="总时长" :label-width="formLabelWidth">
          <el-input-number type="text" v-model="form.cartoonSumvideotime"></el-input-number>
        </el-form-item>
        <el-form-item label="卡通介绍" :label-width="formLabelWidth">
          <el-input
            v-model="form.cartoonIntroduction"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="导演" :label-width="formLabelWidth">
          <el-input type="text" v-model="form.actorDisplay"></el-input>
        </el-form-item>
        <el-form-item label="主演" :label-width="formLabelWidth">
          <el-input type="text" v-model="form.writerDisplay"></el-input>
        </el-form-item>
        <el-form-item label="年份" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.cartoonYears"
            value-format="yyyy"
            type="year"
            placeholder="选择年"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="语言" :label-width="formLabelWidth">
          <el-input type="text" v-model="form.language"></el-input>
        </el-form-item>
        <el-form-item label="地区" :label-width="formLabelWidth">
          <el-input type="text" v-model="form.cartoonProducingarea"></el-input>
        </el-form-item>
        <el-form-item label="排行ID" :label-width="formLabelWidth">
          <el-input-number v-model="form.rankId" :min="0" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="是否上架" :label-width="formLabelWidth">
          <el-switch
            v-model="form.booleanUp"
            :active-value="2"
            :inactive-value="0"
            active-color="#13ce66"
          ></el-switch>
        </el-form-item>
        <el-form-item label="是否免费" :label-width="formLabelWidth">
          <el-switch v-model="form.isFree" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="more1" :label-width="formLabelWidth">
          <el-input type="text" v-model="form.more1"></el-input>
        </el-form-item>
        <el-form-item label="more2" :label-width="formLabelWidth">
          <el-input type="text" v-model="form.more2"></el-input>
        </el-form-item>
        <el-form-item label="more3" :label-width="formLabelWidth">
          <el-input type="text" v-model="form.more3"></el-input>
        </el-form-item>
        <el-form-item label="more4" :label-width="formLabelWidth">
          <el-input type="text" v-model="form.more4"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" >
        <el-button type="primary" @click="onSubmit('form')">提 交</el-button>
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
      searchKeyWord: "",
      iconView: false,
      dialogFormVisible: false,
      action: "",
      menuId: "",
      detailPicUrl: defaultFocus,
      labelPicUrl: defaultFocus,
      iconPicUrl: defaultFocus,
      typeValue: "",
      formLabelWidth: "120px",
      value: [1, 4],
      parentData: [],
      tagsData: [],
      preBtn: true,
      nextBtn: false,
      pageTotle: 0,
      currentPage: 1,
      form: {
        cspInfo: { id: "" }
      },
      dialogFormVisible: false,
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      action: "",
      cpData: [],
      booleanUp: [
        {
          id: "0",
          name: "未上线"
        },
        {
          id: "1",
          name: "测试"
        },
        {
          id: "2",
          name: "上线"
        }
      ],
      imgData: [],
      rules: {
        cartoonCname: [{ required: true, message: "必填项", trigger: "blur" }],
        cspInfo: [{ required: true, message: "必填项", trigger: "blur" }]
      },
      props: {
        multiple: true,
        lazy: true,
        lazyLoad: (node, resolve) => {
          const { level } = node;
          if (level == 0) {
            const nodes = this.parentData.map(item => ({
              value: item.id,
              label: item.typeCname,
              leaf: level >= 1
            }));
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(nodes);
          } else if (level == 1) {
            this.$store
              .dispatch("axios_get_tagList", {
                productId: node.value,
                pageNum: 1,
                pageSize: 100
              })
              .then(res => {
                const nodes2 = res.data.data.list.records.map(item => ({
                  value: item.id,
                  label: item.typeCname,
                  leaf: level >= 1
                }));
                resolve(nodes2);
              });
          }
        }
      }
    };
  },
  inject: ["getClassifyData", "getMenuId", "getTagsData"],
  beforeCreate() {},
  components: { image_choice },
  computed: {
    //获取标签

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
    },
    filterData() {
      let fdata = this.getClassifyData();
      fdata.forEach(element => {
        if (
          element.childrenList instanceof Array &&
          element.childrenList.length > 0
        ) {
          element.childrenList.forEach(i => {
            if (i.childrenList instanceof Array && i.childrenList.length > 0) {
              i.childrenList.forEach(x => {
                if (
                  x.childrenList instanceof Array &&
                  x.childrenList.length > 0
                ) {
                  x.childrenList.forEach(y => {
                    delete y.childrenList;
                  });
                } else {
                  delete x.childrenList;
                }
              });
            } else {
              delete i.childrenList;
            }
          });
        } else {
          delete element.childrenList;
        }
      });
      return fdata;
    }
  },
  methods: {
    setImg(item, type) {
      if (type == 0) {
        this.labelPicUrl = this.imagesBaseUrl + item.picPath;
        this.form["labelPic"] = {};
        this.form["labelPic"].id = item.id;
      } else if (type == 1) {
        this.detailPicUrl = this.imagesBaseUrl + item.picPath;
        this.form["detailPic"] = {};
        this.form["detailPic"].id = item.id;
      } else {
        this.iconPicUrl = this.imagesBaseUrl + item.picPath;
        this.form["iconPic"] = {};
        this.form["iconPic"].id = item.id;
      }
    },

    showIconPanel(arg) {
      this.iconView = arg;
    },
    addProgram(action) {
      this.dialogFormVisible = true;
      this.parentData = this.getClassifyData();
      this.tagsData = this.getTagsData();
      this.form = {
        cspInfo: {
          id: ""
        }
      };
      this.detailPicUrl = defaultFocus;
      this.labelPicUrl = defaultFocus;
      this.iconPicUrl = defaultFocus;
    },
    editProgram(Classify) {
      this.dialogFormVisible = true;
      this.parentData = this.getClassifyData();
      this.tagsData = this.getTagsData();
      this.form = Classify;
      Classify.cspInfo ? "" : (this.form.cspInfo = { id: "" });
      Classify.detailPic
        ? (this.detailPicUrl = this.imagesBaseUrl + Classify.detailPic.picPath)
        : (this.detailPicUrl = defaultFocus);
      Classify.labelPic
        ? (this.labelPicUrl = this.imagesBaseUrl + Classify.labelPic.picPath)
        : (this.labelPicUrl = defaultFocus);
      Classify.iconPic
        ? (this.iconPicUrl = this.imagesBaseUrl + Classify.iconPic.picPath)
        : (this.iconPicUrl = defaultFocus);
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.action == "add") {
            this.form.cspInfo = { id: this.form.cspInfo.id };
            let vi = "";
            this.form.visible ? (vi = "1") : (vi = "0");
            this.$store
              .dispatch("axios_add_seriesList", this.form)
              .then(res => {
                if (res.data.errorCode == "1000") {
                  eventBus.$emit("refreshProgramList");
                  this.$message.success("添加成功");
                } else {
                  this.$message.error(res.data.errorMsg);
                }
              })
              .catch(err => {
                this.$message.error("添加失败");
              });
          } else {
            this.form.cspInfo = { id: this.form.cspInfo.id };
            this.$store
              .dispatch("axios_edit_seriesList", this.form)
              .then(res => {
                if (res.data.errorCode == "1000") {
                  eventBus.$emit("refreshProgramList");
                  this.$message.success("修改成功");
                } else {
                  this.$message.error(res.data.errorMsg);
                }
              })
              .catch(err => {
                this.$message.error("修改成功");
              });
          }
          this.dialogFormVisible = false;
        } else {
          return false;
        }
      });
    },
    handleNodeClick(data, node, el) {
      this.form.parentId = data.id;
      this.mtBtn = data.menuName;
    }
  },
  created() {
    this.getTagList;
    this.getCpList;
  },
  mounted() {
    eventBus.$on("addProgram", v => {
      this.action = "add";
      this.addProgram(v);
      this.parentData = this.filterData;
    });
    eventBus.$on("editProgram", v => {
      this.action = "edit";
      this.editProgram(v);
      this.parentData = this.filterData;
    });
  },
  beforeDestroy() {
    eventBus.$off(["addProgram", "editProgram"]);
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

ul li {
  list-style-type: none;
  float: left;
  margin-left: 10px;
  margin-top: 10px;
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
</style>




