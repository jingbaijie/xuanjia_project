<template>
  <div>
    <el-dialog
      width="50vw"
      v-dialogDrag
      ref="dialog__wrapper"
      title="添加游戏"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        style="max-height:500px;overflow-y:auto"
      >
        <el-form-item label="归属类型" :label-width="formLabelWidth">
          <el-cascader
            v-model="form.typeParentPath"
            placeholder="搜索"
            :options="typeData"
            :props="{
              multiple: true,
              children: 'childrenList',
              label: 'typeCname',
              value: 'id'
            }"
            filterable
            size="medium"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="游戏名称"
          prop="gameCname"
          :label-width="formLabelWidth"
        >
          <el-input type="text" v-model="form.gameCname"></el-input>
        </el-form-item>
        <el-form-item label="游戏标签" :label-width="formLabelWidth">
          <el-cascader
            v-model="form.tagParentPath"
            filterable
            :options="tagsData"
            :props="{
              multiple: true,
              children: 'childrenList',
              label: 'typeCname',
              value: 'id'
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="英文名称"
          prop="gameEname"
          :label-width="formLabelWidth"
        >
          <el-input type="text" v-model="form.gameEname"></el-input>
        </el-form-item>
        <el-form-item
          label="CP/SP信息"
          prop="cspInfo.id"
          :label-width="formLabelWidth"
        >
          <el-select v-model="form.cspInfo.id" placeholder="请选择">
            <el-option
              v-for="item in cpData"
              :key="item.id"
              :label="item.cpCname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="游戏介绍" :label-width="formLabelWidth">
          <el-input
            v-model="form.gameIntrolduction"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="jad地址" :label-width="formLabelWidth">
          <!-- <el-input type="text" v-model="form.jadFile"></el-input> -->
          <el-upload
            :action="api + 'content/gameManage/uploadGamesFile'"
            :headers="headerObj"
            :on-success="addSuccess"
            :file-list="form.jadFile"
            name="jadFile"
            ref="upload"
            show-file-list
          >
            <el-button plain icon="el-icon-upload" size="small" type="primary"
              >点击上传</el-button
            >
            <span>{{ jadFile }}</span>
          </el-upload>
        </el-form-item>
        <el-form-item label="jar地址" :label-width="formLabelWidth">
          <!-- <el-input type="text" v-model="form.jarFile"></el-input> -->
          <el-upload
            :action="api + 'content/gameManage/uploadGamesFile'"
            :headers="headerObj"
            :on-success="addSuccess2"
            :file-list="form.jarFile"
            name="jarFile"
            ref="upload"
            show-file-list
          >
            <el-button plain icon="el-icon-upload" size="small" type="primary"
              >点击上传</el-button
            >
            <span>{{ jarFile }}</span>
          </el-upload>
        </el-form-item>
        <el-form-item label="H5地址" :label-width="formLabelWidth">
          <el-input type="text" v-model="form.otherUrl"></el-input>
        </el-form-item>
        <el-form-item label="标签图片" :label-width="formLabelWidth">
          <el-popover placement="right" width="535" trigger="hover">
            <img class="flagImage" slot="reference" :src="labelPicUrl" alt />
            <image_choice
              @getSelectImage="img => showAttr(img, 0)"
            ></image_choice>
          </el-popover>
        </el-form-item>
        <el-form-item label="详情图片" :label-width="formLabelWidth">
          <el-popover placement="right" width="535" trigger="hover">
            <img class="flagImage" slot="reference" :src="detailPicUrl" alt />
            <image_choice
              @getSelectImage="img => showAttr(img, 1)"
            ></image_choice>
          </el-popover>
        </el-form-item>
        <el-form-item label="全部内容页图" :label-width="formLabelWidth">
          <el-popover placement="right" width="535" trigger="hover">
            <img class="flagImage" slot="reference" :src="iconPicUrl" alt />
            <image_choice
              @getSelectImage="img => showAttr(img, 2)"
            ></image_choice>
          </el-popover>
        </el-form-item>
        <el-form-item label="背景图" :label-width="formLabelWidth">
          <el-popover placement="right" width="535" trigger="hover">
            <img class="flagImage" slot="reference" :src="bgPicUrl" alt />
            <image_choice
              @getSelectImage="img => showAttr(img, 3)"
            ></image_choice>
          </el-popover>
        </el-form-item>

        <el-form-item label="排行ID" :label-width="formLabelWidth">
          <el-input-number
            v-model="form.rankId"
            :min="0"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          label="上架状态"
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
          label="免费状态"
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
        <el-button type="primary" @click="onSubmit('form')">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import defaultFocus from "@/assets/images/add2.jpg";
import image_choice from "@/components/widget/ImageChoiceWidget";
import axios from "@/common/axios";
export default {
  name: "gameForm",
  data() {
    return {
      headerObj: {
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      token: localStorage.getItem("token"),
      cpData: [],
      api: window.configs.axios_BASEURL,
      dialogFormVisible: false,
      action: "",
      menuId: "",
      detailPicUrl: defaultFocus,
      labelPicUrl: defaultFocus,
      iconPicUrl: defaultFocus,
      bgPicUrl: defaultFocus,
      typeValue: "",
      formLabelWidth: "120px",
      value: [1, 4],
      typeData: [],
      tagsData: [],
      preBtn: true,
      nextBtn: false,
      pageTotle: 0,
      currentPage: 1,
      form: {
        cspInfo: {
          id: ""
        },
        isFree: 0
      },
      jadFile: "",
      jarFile: "",
      rules: {
        gameCname: [{ required: true, message: "必填项", trigger: "blur" }],
        gameEname: [{ required: true, message: "必填项", trigger: "blur" }],
        "cspInfo.id": [{ required: true, message: "必填项", trigger: "blur" }],
        booleanUp: [{ required: true, message: "必填项", trigger: "blur" }],
        isFree: [{ required: true, message: "必填项", trigger: "blur" }]
      },
      dialogFormVisible: false,
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      action: "",
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
      props: {
        multiple: true,
        lazy: true,
        lazyLoad: (node, resolve) => {
          const { level } = node;
          if (level == 0) {
            const nodes = this.typeData.map(item => ({
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
                pageSize: 10000
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
  inject: ["getClassifyData"],
  components: { image_choice },
  created() {
    this.getTagList;
    this.getCpList;
  },
  mounted() {
    eventBus.$on("addGame", v => {
      this.action = "add";
      this.addProgram(v);
      this.typeData = this.filterData;
    });
    eventBus.$on("editGame", v => {
      this.action = "edit";
      this.editProgram(v);
      this.typeData = this.filterData;
    });
  },

  beforeDestroy() {
    eventBus.$off(["addGame", "editGame"]);
  },
  computed: {
    removeArr(arry) {
      var newArr = [];
      arry.map(item => (item.children.length !== 0 ? newArr.push(item) : ""));
      return newArr;
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
    },
    //获取游戏标签
    getTagList() {
      this.$store
        .dispatch("axios_get_productTagList")
        .then(rs => {
          this.tagsData = this.filterDataChildren(rs.data.data);
        })
        .catch(err => {});
    },
    //获取CpSp信息
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
    getParentData() {
      return this.typeData;
    }
  },
  methods: {
    // beforeUpload(file) {
    //   axios
    //     .post(this.api + "content/game/uploadGamesFile", { file: file })
    //     .then(response => {});
    // },
    addSuccess(response, file, fileList) {
      this.jadFile = "";
      this.form.jadUrl = response.data;
    },
    addSuccess2(response, file, fileList) {
      this.jarFile = "";
      this.form.jarUrl = response.data;
    },
    addPic(file, fileList) {
      this.form.jadFile = fileList;
    },
    addPic2(file, fileList) {
      this.form.jarFile = fileList;
    },
    filterDataChildren(data) {
      data.forEach(element => {
        if (element.childrenList.length > 0) {
          element.childrenList.forEach(i => {
            if (i.childrenList.length > 0) {
              i.childrenList.forEach(x => {
                if (x.childrenList <= 0) {
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
      return data;
    },
    //设置图片
    showAttr(item, type) {
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
        this.bgPicUrl = this.imagesBaseUrl + item.picPath;
        this.form["backgroundPic"] = {};
        this.form["backgroundPic"].id = item.id;
      }
    },
    addProgram(action) {
      this.dialogFormVisible = true;
      this.typeData = this.getClassifyData();
      this.form = {
        cspInfo: {
          id: ""
        },
        jarFile: [],
        jadFile: [],
        isFree: 0
      };
      this.detailPicUrl = defaultFocus;
      this.labelPicUrl = defaultFocus;
      this.iconPicUrl = defaultFocus;
      this.bgPicUrl = defaultFocus;
    },
    editProgram(Classify) {
      this.dialogFormVisible = true;
      this.typeData = this.getClassifyData();
      let item = JSON.parse(JSON.stringify(Classify));
      this.form = item;
      this.form.jarFile = [];
      this.form.jadFile = [];
      this.form.jarUrl ? (this.jarFile = this.form.jarUrl) : "";
      this.form.jadUrl ? (this.jadFile = this.form.jadUrl) : "";
      item.cspInfo ? "" : (this.form.cspInfo = { id: "" });
      item.detailPic
        ? (this.detailPicUrl = this.imagesBaseUrl + item.detailPic.picPath)
        : (this.detailPicUrl = defaultFocus);
      item.labelPic
        ? (this.labelPicUrl = this.imagesBaseUrl + item.labelPic.picPath)
        : (this.labelPicUrl = defaultFocus);
      item.iconPic
        ? (this.iconPicUrl = this.imagesBaseUrl + item.iconPic.picPath)
        : (this.iconPicUrl = defaultFocus);
      item.backgroundPic
        ? (this.bgPicUrl = this.imagesBaseUrl + item.backgroundPic.picPath)
        : (this.bgPicUrl = defaultFocus);
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          // if (this.form.tagsInfoList) {
          //   this.form.tagParentPath = this.form.tagsInfoList;
          // }
          if (this.action == "add") {
            this.form.cspInfo = { id: this.form.cspInfo.id };
            let visible = "";
            this.form.visible ? (visible = "1") : (visible = "0");
            this.$store
              .dispatch("axios_add_game", this.form)
              .then(res => {
                if (res.data.errorCode == "1000") {
                  this.$message.success(
                    "添加成功  " + JSON.stringify(res.data.errorMsg)
                  );
                  eventBus.$emit("refreshGameList");
                } else {
                  this.$message.error(
                    "添加失败  " + JSON.stringify(res.data.errorMsg)
                  );
                }
              })
              .catch(err => {
                this.$message.error("添加失败");
              });
          } else {
            this.form.cspInfo = { id: this.form.cspInfo.id };
            this.$store
              .dispatch("axios_edit_game", this.form)
              .then(res => {
                this.$message.success("修改成功");
                eventBus.$emit("refreshGameList");
              })
              .catch(err => {
                this.$message.error("修改成功");
              });
          }
        } else {
          return false;
        }
      });
    }
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




