<template>
  <div>
    <el-row>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <p>产品/分类</p>
          <el-tree
            :data="classifyData"
            node-key="id"
            :expand-on-click-node="false"
            :props="defaultProps"
            @node-click="nodeClick"
            accordion
          ></el-tree>
        </div>
      </el-col>
      <el-col :span="20">
        <div class>
          <div :style="{ 'line-height': '50px', height: '50px' }">
            <el-button
              v-if="isAuth('system:type:insert')"
              :style="{ float: 'right', margin: '0 70px 0 0' }"
              size="mini"
              type="primary"
              plain
              @click="handleCreate()"
              >新增</el-button
            >
            <el-button
              :style="{ float: 'right', margin: '0 70px 0 0' }"
              size="mini"
              type="primary"
              plain
              @click="handleDel()"
              >删除</el-button
            >
            <el-breadcrumb separator-class="el-icon-d-arrow-right">
              <el-breadcrumb-item
                :key="index"
                v-for="(item, index) in breadcrumb"
                >{{ item }}</el-breadcrumb-item
              >
            </el-breadcrumb>
          </div>
          <el-table
            v-if="isAuth('system:game:list')"
            :data="classData"
            ref="multipleTable"
            :height="tableHeight"
          >
            <el-table-column
              prop="id"
              align="center"
              label="分类ID"
            ></el-table-column>
            <el-table-column align="center" label="父级分类">
              <template slot-scope="scope">{{
                scope.row.parent && scope.row.parent.typeCname
              }}</template></el-table-column
            >
            <el-table-column
              prop="typeCname"
              align="center"
              label="分类名称"
            ></el-table-column>

            <el-table-column label="分类图片">
              <template slot-scope="scope">
                <img
                  :style="{ width: '50px' }"
                  v-if="scope.row.detailPic"
                  :src="imagesBaseUrl + scope.row.detailPic.picPath"
                />
              </template>
            </el-table-column>
            <el-table-column label="详情图">
              <template slot-scope="scope">
                <img
                  :style="{ width: '50px' }"
                  v-if="scope.row.detailPic"
                  :src="imagesBaseUrl + scope.row.detailPic.picPath"
                />
              </template>
            </el-table-column>
            <el-table-column label="缩略图">
              <template slot-scope="scope">
                <img
                  :style="{ width: '50px' }"
                  v-if="scope.row.detailPic"
                  :src="imagesBaseUrl + scope.row.detailPic.picPath"
                />
              </template>
            </el-table-column>
            <el-table-column prop="rankId" align="center" label="排行">
            </el-table-column>

            <el-table-column align="center" label="操作" width="160">
              <template slot-scope="scope">
                <el-button
                  v-if="isAuth('system:game:update')"
                  type="text"
                  @click="handleEdit(scope.$index, classData)"
                  >编 辑</el-button
                >
                <el-button @click="handleDel(scope.row)" type="text"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <classifyForm></classifyForm>
    <div v-if="!isAuth('system:type:list')" class="msg">
      暂无权限
    </div>
  </div>
</template>

<script>
import { Message, Loading } from "element-ui";
import { eventBus } from "@/common/eventBus";
import defaultFocus from "@/assets/images/add2.jpg";
import classifyForm from "./classifyForm";

export default {
  name: "classifyList",
  provide() {
    return {
      setClassifyData: value => (this.classifyData = value),
      getClassifyData: () => {
        return this.classifyData;
      }
    };
  },
  inject: ["getMenuId"],
  data() {
    return {
      delTypeId: "",
      menuId: this.getMenuId(),
      showVlaue: { "0": "禁用", "1": "启用" },
      currentPage: 1, //分页当前页码
      pageSize: 10,
      total: 1,
      classifyData: [],
      userData: [],
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      detailPic: defaultFocus,
      labelPic: defaultFocus,
      iconPic: defaultFocus,
      classData: [],
      form: {
        parent: { typeCname: "" }
      },
      breadcrumb: [],
      search: "",
      loading: true,
      tableHeight: undefined,
      formLabelWidth: "120px",
      userPermission: {
        select: false,
        delete: false,
        insert: false,
        update: false
      },
      defaultProps: {
        children: "childrenList",
        label: "typeCname",
        value: "id",
        checkStrictly: true,
        expandTrigger: "hover",
        emitPath: false
      }
    };
  },

  created() {
    console.log("type insert : ", this.isAuth("system:type:insert"));
    console.log("type edit : ", this.isAuth("system:type:update"));
    console.log("type list : ", this.isAuth("system:type:list"));
    console.log("type delete : ", this.isAuth("system:type:delete"));
    this.getClassifyList(this.currentPage, this.pageSize);
  },
  mounted() {
    eventBus.$on("refreshClassify", () => {
      this.getClassifyList(this.currentPage, this.pageSize);
    });
  },
  destroyed() {
    eventBus.$off(["refreshClassify"]);
  },
  computed: {
    checkPermission() {
      // btnPermission.forEach((item,index)=>{
      //     if(item.perms === "system:user:list"){
      //       this.userPermission.select = true;
      //     }else if(item.perms === "system:user:delete"){
      //       this.userPermission.delete = true;
      //     }else if(item.perms === "system:user:insert"){
      //       this.userPermission.insert = true;
      //     }else if(item.perms === "system:user:update"){
      //       this.userPermission.update = true;
      //     }
      // })
    }
  },
  methods: {
    // axios_get_typeInfo
    getClassifyList(pageNum, pageSize) {
      this.$store
        .dispatch("axios_get_classify", {
          menuId: this.menuId,
          pageNum: pageNum,
          pageSize: pageSize
        })
        .then(res => {
          if (res != "undefined") {
            this.classifyData = res.data.data;
            this.btns = res.data.data.btns;
            if (res.data.data.length > 0) {
              his.curProductId = this.classifyData[0].id;
              this.getTypeInfo(this.curProductId);
              //  this.getTypeInfo(this.classifyData[0].id);
            }
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    getTypeInfo(id) {
      this.$store
        .dispatch("axios_get_typeInfo", {
          typeId: id
        })
        .then(rs => {
          // debugger;
          this.classData = [rs.data.data.info];

          // this.detailPic =
          //   this.form.detailPic == null
          //     ? defaultFocus
          //     : this.form.detailPic.picPath;
          // this.iconPic =
          //   this.form.detailPic == null
          //     ? defaultFocus
          //     : this.form.detailPic.picPath;
          // this.labelPic =
          //   this.form.detailPic == null
          //     ? defaultFocus
          //     : this.form.detailPic.picPath;
          // this.form.iconPic == null
          //   ? (this.iconPic = {})
          //   : (this.iconPic = this.form.iconPic.picPath);
          // this.form.labelPic == null
          //   ? (this.labelPic = {})
          //   : (this.labelPic = this.form.labelPic.picPath);
        })
        .catch(er => {});
    },
    nodeClick(d, n, o) {
      this.currentPage = 1;
      this.getTypeInfo(d.id);
      this.findRoad(d.id);
      this.delTypeId = d.id;
      console.log(this.delTypeId);
    },
    findRoad(id) {
      this.breadcrumb = [];
      this.classifyData.forEach(item => {
        if (item.id == id) {
          this.breadcrumb.push(item.typeCname);
        } else {
          item.childrenList.forEach(item_first => {
            if (item_first.id == id) {
              this.breadcrumb.push(item.typeCname);
              this.breadcrumb.push(item_first.typeCname);
            } else {
              item_first.childrenList.forEach(item_second => {
                if (item_second.id == id) {
                  this.breadcrumb.push(item.typeCname);
                  this.breadcrumb.push(item_first.typeCname);
                  this.breadcrumb.push(item_second.typeCname);
                } else {
                  item_second.childrenList.forEach(item_third => {
                    if (item_third.id == id) {
                      this.breadcrumb.push(item.typeCname);
                      this.breadcrumb.push(item_first.typeCname);
                      this.breadcrumb.push(item_second.typeCname);
                      this.breadcrumb.push(item_third.typeCname);
                    }
                  });
                }
              });
            }
          });
        }
      });
    },
    handleCreate() {
      eventBus.$emit("addClassify");
    },
    handleEdit(index, row) {
      eventBus.$emit("editClassify", row[index]);
    },
    handleDel() {
      console.log("del");
      this.$store
        .dispatch("axios_del_typeInfo", { ids: this.delTypeId })
        .then(res => {
          if (res.data.errorCode == "1000") {
            this.$message.success("删除成功");
            eventBus.$emit("refreshClassify");
          } else if (res.data.errorCode == "1013") {
            this.$message.error(res.data.errorMsg);
          } else {
            this.$message.error("删除失败" + res.data.errorMsg);
          }
        })
        .catch(err => {
          this.$message.error("删除失败");
        });
    }
  },
  components: {
    classifyForm: classifyForm
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-form-item__label {
  font-weight: bold;
}

.product_title {
  border-width: 1px;
  border-style: solid;
  border-color: rgb(235, 235, 235);
  border-image: initial;
  transition: all 0.2s ease 0s;
  line-height: 40px;
  text-align: center;
  font-family: SFUIDisplay-Regular, sans-serif;
  font-size: 17px;
  color: #ccc;
  background-color: rgb(84, 92, 100);
}
.pic_icon {
  width: 100px;
}
.searchBtn {
  width: 20vh;
  float: left;
  margin-right: 10px;
}
.btn_area {
  height: 8vh;
  padding: 15px 10px 10px 5px;
}
.add_btn {
  margin: 10px 0 0 10px;
  width: 100%;
  float: left;
}

.el-input--mini .el-input__inner {
  width: 100px;
}

.column_tree {
  width: 18%;
  float: left;
  margin-right: 15px;
}
.el-tree {
  margin-right: 15px;
  height: 70vh;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(235, 235, 235);
  border-image: initial;
  transition: all 0.2s ease 0s;
  overflow: auto;
  padding: 20px;
}
.column_detail {
  width: 70%;
  float: left;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 50px 0 0 40px;
}
</style>
