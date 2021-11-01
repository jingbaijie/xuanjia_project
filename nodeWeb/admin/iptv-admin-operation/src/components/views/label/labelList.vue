<template>
  <div>
    <el-row>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <p>产品/标签</p>
          <el-tree
            :data="classifyData"
            node-key="id"
            :expand-on-click-node="false"
            :props="defaultProps"
            @node-click="nodeClick"
          ></el-tree>
        </div>
      </el-col>
      <el-col :span="20">
        <div>
          <keySearch @searchData="searchDate"></keySearch>
          <el-button
            v-if="isAuth('system:tag:insert')"
            :style="{'float':'right','margin':'20px 70px 0 0'}"
            size="mini"
            type="primary"
            plain
            @click="handleCreate()"
          >新增</el-button>
          <el-breadcrumb
            :style="{'margin':'20px 0 50px 30px','font-size':'18px'}"
            separator-class="el-icon-arrow-right"
          >
            <el-breadcrumb-item>{{curProductName}}</el-breadcrumb-item>
          </el-breadcrumb>

          <el-table
            v-if="isAuth('system:tag:list')"
            :data="labelData"
            v-loading="loading"
            ref="multipleTable"
            :height="tableHeight"
          >
            <el-table-column align="center" prop="typeCname" label="标签名称">
              <template slot-scope="scope">
                <a
                  @click="getDetailList(scope.row.id)"
                  :style="{'color':' #409EFF','cursor':'pointer'}"
                >{{scope.row.typeCname}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
            <el-table-column label="详情图">
              <template slot-scope="scope">
                <img
                  :style="{'width':'50px'}"
                  v-if="scope.row.detailPic"
                  :src="imagesBaseUrl+scope.row.detailPic.picPath"
                />
              </template>
            </el-table-column>
            <el-table-column label="标签图">
              <template slot-scope="scope">
                <img
                  :style="{'width':'50px'}"
                  v-if="scope.row.labelPic"
                  :src="imagesBaseUrl+scope.row.labelPic.picPath"
                />
              </template>
            </el-table-column>
            <el-table-column label="图标">
              <template slot-scope="scope">
                <img
                  :style="{'width':'50px'}"
                  v-if="scope.row.iconPic"
                  :src="imagesBaseUrl+scope.row.iconPic.picPath"
                />
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="300">
              <template slot-scope="scope">
                <el-button
                  v-if="isAuth('system:tag:update')"
                  plain
                  size="mini"
                  type="warning"
                  @click="handleEdit(scope.$index, labelData)"
                >编 辑</el-button>
                <el-button
                  v-if="isAuth('system:tag:delete')"
                  plain
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, labelData)"
                >删 除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="!isAuth('system:tag:list')" class="msg">暂无权限</div>
          <pagination
            v-if="isAuth('system:tag:list')"
            v-show="total>0"
            :total="total"
            :page.sync="currentPage"
            :limit.sync="pageSize"
            @pagination="getTypeInfo(curProductId)"
          />
        </div>
      </el-col>
    </el-row>
    <el-dialog title="标签内容" :visible.sync="dialogVisible" width="80%">
      <el-table :data="detailData" v-loading="loading" ref="multipleTable">
        <el-table-column prop="cartoonCname" label="中文名称"></el-table-column>
        <el-table-column prop="cartoonEname" label="英文名称"></el-table-column>
        <el-table-column prop="typeInfoList" label="分类名称">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              v-if="scope.row.typeInfoList !=null"
            >
              <el-tag
                :style="{'margin':'0 0 5px 5px'}"
                :key="index"
                v-for="(item,index) in scope.row.typeInfoList"
              >{{item.typeCname}}</el-tag>
              <el-button size="mini" slot="reference">{{scope.row.typeInfoList[0].typeCname}}</el-button>
            </el-popover>
            <!-- {{formateClass(scope.row.typeInfoList)}} -->
          </template>
        </el-table-column>
        <el-table-column prop="cspInfo.cpCname" label="CP/SP信息"></el-table-column>
        <el-table-column prop="cartoonProprietorsStarttime" label="版权开始时间"></el-table-column>
        <el-table-column prop="cartoonProprietorsEndtime" label="版权结束时间"></el-table-column>
        <el-table-column prop="cartoonProprietors" label="版权方"></el-table-column>
        <el-table-column prop="cartoonSumvideonum" label="总集数"></el-table-column>
        <el-table-column prop="booleanUp" label="是否上架"></el-table-column>
        <el-table-column label="图片">
          <template slot-scope="scope">
            <img
              :style="{'width':'50px'}"
              v-if="scope.row.iconPic"
              :src="imagesBaseUrl+scope.row.iconPic.picPath"
            />
          </template>
        </el-table-column>
        <el-table-column prop="productInfoList" label="产品名称">
          <template slot-scope="scope">{{formateClass(scope.row.productInfoList)}}</template>
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <labelForm @refreshLabel="refreshLabel">
      <template slot-scope="abc">
        <div>{{abc.bbbbb }}</div>
      </template>
    </labelForm>
  </div>
</template>

<script>
import { Loading } from "element-ui";
import { eventBus } from "@/common/eventBus";
import keySearch from "@/components/widget/keySearch";
import Pagination from "@/components/widget/Pagination";
import labelForm from "./labelForm";

export default {
  name: "labelList",
  components: {
    labelForm,
    Pagination,
    keySearch
  },
  data() {
    return {
      menuId: this.getMenuId(),
      dialogVisible: false,
      showVlaue: { "0": "禁用", "1": "启用" },
      currentPage: 1, //分页当前页码
      pageSize: 10,
      radio: 1,
      total: 1,
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      detailData: [],
      classifyData: [],
      curProductId: "",
      curProductName: "",
      labelData: [],
      searchVal: "",
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
  provide() {
    return {
      setClassifyData: value => (this.classifyData = value),
      getClassifyData: () => {
        return this.classifyData;
      }
    };
  },
  inject: ["getMenuId"],
  created() {
    console.log("tag insert : ", this.isAuth("system:tag:insert"));
    console.log("tag edit : ", this.isAuth("system:tag:update"));
    console.log("tag list : ", this.isAuth("system:tag:list"));
    console.log("tag delete : ", this.isAuth("system:tag:delete"));
    this.getProductList();
  },
  mounted() {
    if (this.isAuth("system:tag:list")) {
      this.tableHeight =
        window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 200 + "";
    }
  },
  methods: {
    searchDate(val){
      this.searchVal=val;
      this.getTypeInfo(this.curProductId);
    },
    refreshLabel() {
      this.getTypeInfo(this.curProductId);
    },
    formateClass(array) {
      let classify = [];
      array.forEach(item => {
        classify.push(item.typeCname);
      });
      return classify.join();
    },
    getProductList() {
      this.$store
        .dispatch("axios_get_productList", {
          menuId: this.menuId
        })
        .then(res => {
          if (res != "undefined") {
            this.classifyData = res.data.data;
            if (res.data.data.length > 0) {
              this.curProductId = this.classifyData[0].id;
              this.getTypeInfo(this.curProductId);

              // this.getTypeInfo(this.classifyData[0].id);
            }
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    //根据产品ID获取标签列表
    getTypeInfo(id) {
      this.$store
        .dispatch("axios_get_tagList", {
          searchValue: this.searchVal,
          productId: id,
          pageNum: this.currentPage,
          pageSize: this.pageSize
        })
        .then(res => {
          this.loading = false;
          this.labelData = res.data.data.list.records;
          this.btns = res.data.data.btns;
          this.total = res.data.data.list.total;
        })
        .catch(er => {
          this.loading = false;
        });
    },
    //根据标签ID获取标签下的内容
    getDetailList(id) {
      this.$store
        .dispatch("axios_get_labelContent", {
          typeId: id,
          contentType: "1"
        })
        .then(rs => {
          this.dialogVisible = true;
          this.detailData = rs.data.data.records;
        })
        .catch(er => {});
    },
    nodeClick(d, n, o) {
      this.loading = true;
      this.currentPage = 1;
      this.curProductId = d.id;
      this.curProductName = d.typeCname;
      this.getTypeInfo(d.id);
    },
    handleCreate() {
      eventBus.$emit("addLabel");
    },
    handleEdit(index, data) {
      eventBus.$emit("editLabel", data[index]);
    },
    handleDelete(index, data) {
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("axios_del_labelContent", {
              ids: data[index].id
            })
            .then(req => {
              if (req.data.errorCode == "1000") {
                this.refreshLabel(this.curProductId);
                this.$message({ message: req.data.errorMsg, type: "success" });
              } else {
                this.$message({ message: req.data.errorMsg, type: "warning" });
              }
            })
            .catch(err => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
  width: 15%;
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
  width: 80%;
  height: 500px;
  float: left;
}
</style>
