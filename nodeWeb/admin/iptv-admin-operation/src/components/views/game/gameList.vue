<template>
  <div>
    <el-row>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <p>产品/游戏</p>
          <el-tree
            :data="classifyData"
            node-key="id"
            :expand-on-click-node="false"
            :props="defaultProps"
            @node-click="nodeClick"
            :highlight-current="true"
            accordion
          ></el-tree>
        </div>
      </el-col>
      <el-col :span="20">
        <div class>
      <div :style="{'line-height':'50px','height':'50px','margin':'20px 0 0 0'}">
        <el-button
          v-if="isAuth('system:game:insert')"
          :style="{'float':'right','margin':'0 70px 0 0'}"
          size="mini"
          type="primary"
          plain
          @click="handleCreate()"
        >新增</el-button>
        <self-button-batch-online @batchOnLine="batchOnLine" />
        <self-button-batch-free @batchIsFree="batchIsFree" />
        <self-button-batch-class
          :tagsData="tagsData"
          :classifyData="classifyData"
          :selectedIDs='selectedIDs'
          @batchUpdateClass="batchUpdateClass"
        />
        <self-button-search @getTypeInfo="keys=>getTypeInfoBySearch(curProductId,keys)" />

        <!-- <el-breadcrumb
          :style="{'margin':'10px 0 20px 20px'}"
          separator-class="el-icon-d-arrow-right"
        >
          <el-breadcrumb-item :key="index" v-for="(item,index) in breadcrumb">{{item}}</el-breadcrumb-item>
        </el-breadcrumb> -->
      </div>
      <el-table
        v-if="isAuth('system:game:list')"
        :data="programData"
        v-loading="loadingProgramList"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        :height="tableHeight"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" align="center" width="40" label="ID"></el-table-column>
        <el-table-column prop="gameCname" align="center" label="中文名称"></el-table-column>
        <el-table-column prop="gameEname" label="英文名称"></el-table-column>
        <el-table-column prop="typeInfoList" label="分类名称" width="90">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              v-if="scope.row.typeInfoList.length > 0 "
            >
              <el-tag
                :style="{'margin':'0 0 5px 5px'}"
                :key="index"
                type="success"
                v-for="(item,index) in scope.row.typeInfoList"
              >{{item.typeCname}}</el-tag>
              <el-button size="mini" slot="reference">{{scope.row.typeInfoList[0].typeCname}}</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="cspInfo.cpCname" label="CP/SP信息"></el-table-column>
        <el-table-column prop="jadUrl" label="jad地址"></el-table-column>
        <el-table-column prop="jarUrl" label="jar地址"></el-table-column>
        <el-table-column prop="otherUrl" label="h5地址"></el-table-column>
        <!-- <el-table-column label="图片"></el-table-column> -->
        <el-table-column align="center" label="是否上架" width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.booleanUp"
              :active-value="2"
              :inactive-value="0"
              active-color="#13ce66"
              @change="booleanUp=>changeOnLine(booleanUp,scope.row)"
            ></el-switch>
            {{online[scope.row.booleanUp]}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="免费状态" width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isFree"
              :active-value="1"
              :inactive-value="0"
              @change="booleanUp=>changeIsFree(booleanUp,scope.row)"
            ></el-switch>
            {{isFree[scope.row.isFree]}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="160">
          <template slot-scope="scope">
            <el-button
              v-if="isAuth('system:game:update')"
              type="text"
              @click="handleEdit(scope.$index, programData)"
            >编 辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="!isAuth('system:game:list')" class="msg">
      暂无权限
    </div>
      <pagination
       v-if="isAuth('system:game:list')"
        v-show="total>0"
        :total="total"
        :page.sync="currentPage"
        :limit.sync="pageSize"
        @pagination="getTypeInfo(curProductId)"
      />
    </div>
      </el-col>
    </el-row>
    <gameForm></gameForm>
  </div>
</template>

<script>
import { Message, Loading } from "element-ui";
import { eventBus } from "@/common/eventBus";
import gameForm from "./gameForm";
import Pagination from "@/components/widget/Pagination";
import search from "@/components/widget/TableSearch";
import Online from "@/components/widget/OnlineBatches";
import Free from "@/components/widget/FreeBatches";
import classify from "@/components/widget/ClassBatches";

export default {
  name: "gameList",
  inject: ["getMenuId"],
  components: {
    gameForm,
    Pagination,
    "self-button-search": search,
    "self-button-batch-online": Online,
    "self-button-batch-free": Free,
    "self-button-batch-class": classify
  },
  data() {
    return {
      menuId: this.getMenuId(),
      breadcrumb: [],
      breadcrumb_child: [],
      activeName: "first",
      dialogVisible: false,
      currentPage: 1, //分页当前页码
      pageSize: 10,
      total: 1,
      tagsData: [],
      classifyData: [],
      curProgram: {
        iconPic: {},
        labelPic: {},
        detailPic: {}
      },
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      programData: [],
      seriesListData: [],
      curProductId: "",
      form: "",
      search: "",
      selectedIDs: [],
      loadingProgramList: true,
      loadingProgram: true,
      loadingMove: true,
      tableHeight: undefined,
      formLabelWidth: "120px",
      moveData: [],
      curCspInfo: {},
      curTypeInfoList: [],
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
      },
      inState: {
        "0": "未注入",
        "1": "注入中",
        "2": "注入成功",
        "3": "注入失败"
      },
      isFree: {
        "0": "免费",
        "1": "收费"
      },
      booleanUp: {
        "0": "未上线",
        "2": "上线"
      },
      online: {
        "0": "下架",
        "2": "上架"
      },
      booleanUpValue: ""
    };
  },
  provide() {
    return {
      setClassifyData: value => (this.classifyData = value),
      getClassifyData: () => {
        return this.classifyData;
      },
      getTagsData: () => {
        return this.tagsData;
      }
    };
  },

  created() {
    console.log("game insert : ", this.isAuth("system:game:insert"));
    console.log("game edit : ", this.isAuth("system:game:update"));
    console.log("game list : ", this.isAuth("system:game:list"));
    console.log("game delete : ", this.isAuth("system:game:delete"));

    this.getClassifyList();
    this.getTagList();
    eventBus.$on("refreshGameList", () => {
      console.log('refreshGame');
      this.getTypeInfo(this.curProductId);
    });
  },
  mounted() {
    if (this.isAuth("system:game:list")) {
      this.tableHeight =
        window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 200;
    }
  },
  destroyed() {
    eventBus.$off(["refreshGameList"]);
  },
 
  methods: {
    getTagList() {
      this.$store
        .dispatch("axios_get_productTagList")
        .then(rs => {
          this.tagsData = this.filterDataChildren(rs.data.data);
        })
        .catch(err => {});
    },
    filterDataChildren(data) {
      data.forEach(element => {
        if (element.childrenList.length > 0) {
          element.childrenList.forEach(i => {
            if (i.childrenList.length > 0) {
              i.childrenList.forEach(x => {
                if (x.childrenList > 0) {
                  x.childrenList.forEach(y => {
                    if (y.childrenList.length <= 0) {
                      delete y.childrenList;
                    }
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
      return data;
    },
    batchUpdateClass(data) {
      this.$store
        .dispatch("axios_update_game_tag", {
          contentId: this.selectedIDs.join(),
          typeParentPath: data.typeParentPath || [],
          tagParentPath: data.tagParentPath || []
        })
        .then(response => {
          if (response.data.errorCode == "1000") {
            eventBus.$emit("refreshGameList");
            this.$message.success("批量操作成功！");
          } else {
            this.$message.error("批量操作失败，请联系管理员");
          }
        })
        .catch(err => {
          this.$message.error("批量操作失败，请联系管理员");
        });
    },
    batchIsFree(action) {
      if (this.selectedIDs.length > 0) {
        this.$store
          .dispatch("axios_update_gameIsFree", {
            gameId: this.selectedIDs.join(),
            isFree: action
          })
          .then(response => {
            if (response.data.errorCode == "1000") {
              this.$message.success("批量操作成功！");
              eventBus.$emit("refreshGameList");
            } else {
              this.$message.error("批量操作失败，请联系管理员");
            }
          })
          .catch(err => {
            this.$message.error("批量操作失败，请联系管理员");
          });
      } else {
        this.$message.warning("请勾选内容");
      }
    },
    batchOnLine(line) {
      if (this.selectedIDs.length > 0) {
        this.$store
          .dispatch("axios_update_GameBooleanUp", {
            gameId: this.selectedIDs.join(),
            booleanUp: line
          })
          .then(response => {
            if (response.data.errorCode == "1000") {
              this.$message.success("批量操作成功！");
              eventBus.$emit("refreshGameList");
            } else {
              this.$message.error("批量操作失败，请联系管理员");
            }
          })
      } else {
        this.$message.warning("请勾选节目");
      }
    },

    changeIsFree(isFree, game) {
      this.$store.dispatch("axios_update_gameIsFree", {
        gameId: game.id,
        isFree: isFree
      });
    },
    changeOnLine(booleanUp, game) {
      this.$store.dispatch("axios_update_GameBooleanUp", {
        gameId: game.id,
        booleanUp: booleanUp
      });
    },
    showMove(id) {
      this.getMovieListByProgramId(id);
    },
    findRoad(id) {
      this.breadcrumb = [];
      this.classifyData instanceof Array &&
        this.classifyData.forEach(item => {
          if (item.id == id) {
            this.breadcrumb.push(item.typeCname);
          } else {
            item instanceof Array &&
              item.childrenList.forEach(item_first => {
                if (item_first.id == id) {
                  this.breadcrumb.push(item.typeCname);
                  this.breadcrumb.push(item_first.typeCname);
                } else {
                  item_first instanceof Array &&
                    item_first.childrenList.forEach(item_second => {
                      if (item_second.id == id) {
                        this.breadcrumb.push(item.typeCname);
                        this.breadcrumb.push(item_first.typeCname);
                        this.breadcrumb.push(item_second.typeCname);
                      } else {
                        item_second instanceof Array &&
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
    formateClass(array) {
      let classify = [];
      array.forEach(item => {
        classify.push(item.typeCname);
      });
      return classify.join();
    },
    // axios_get_typeInfo
    getClassifyList() {
      this.menuId = this.getMenuId();
      this.$store
        .dispatch("axios_get_classify", {
          menuId: this.menuId
        })
        .then(res => {
          if (res != "undefined") {
            this.classifyData = res.data.data;
            this.btns = res.data.data.btns;
            if(res.data.data.length>0){
              his.curProductId=this.classifyData[0].id
              this.getTypeInfo(this.curProductId);
              //  this.getTypeInfo(this.classifyData[0].id);
            }
            // this.checkPermission();
          }
          this.loadingProgramList = false;
        })
        .catch(err => {
          this.loadingProgramList = false;
          // this.userData = testData.userList.data.records;
          // this.total = testData.userList.data.total;
        });
    },
    detailList(data) {
      this.activeName = "first";
      this.breadcrumb_child = [];
      this.dialogVisible = true;
      this.curProgram = data;
      this.curCspInfo = data.cspInfo;
      this.curTypeInfoList = data.typeInfoList;
      this.breadcrumb_child = this.breadcrumb_child.concat(this.breadcrumb);
      this.breadcrumb_child.push(data.cartoonCname);
    },
    getTypeInfoBySearch(curProductId,searchKeys){
      //深度拷贝对象
      this.search=JSON.parse(JSON.stringify(searchKeys))
      this.getTypeInfo(curProductId);
    },
    getTypeInfo(id) {
      this.loadingProgramList = true;
      console.log(JSON.stringify(this.search));
      this.$store
        .dispatch(
          "axios_get_gameList",
          Object.assign(
            {
              typeId: id,
              pageNum: this.currentPage,
              pageSize: this.pageSize
            },
            this.search
          )
        )
        .then(rs => {
          this.loadingProgramList = false;
          this.programData = rs.data.data.list.records;
          this.total = rs.data.data.list.total;
        })
        .catch(er => {
          this.loadingProgramList = false;
        });
    },
    nodeClick(d) {
      this.loading = true;
      this.currentPage=1;
      this.curProductId = d.id;
      this.search={};
      this.getTypeInfo(d.id);
      this.findRoad(d.id);
    },
    getProgramListBySeriesId(id) {
      this.$store
        .dispatch("axios_get_programListBySeriesId", {
          seriesId: id
        })
        .then(rs => {
          this.dialogVisible = true;
          this.seriesListData = rs.data.data.records;
          this.loadingProgram = false;
        })
        .catch(er => {
          this.loadingProgram = false;
        });
    },
    getMovieListByProgramId(id) {
      this.$store
        .dispatch("axios_get_movieListByProgramId", {
          programId: id
        })
        .then(rs => {
          this.dialogVisible = true;
          this.moveData = rs.data.data;
          this.loadingMove = false;
        })
        .catch(er => {
          this.loadingMove = false;
        });
    },
    getLabelList() {},
    handleClick(tab) {
      if (tab.name == "first") {
      } else if (tab.name == "second") {
        this.getProgramListBySeriesId(this.curProgram.id);
      } else if ((tab.name = "third")) {
        this.getMovieListByProgramId();
      }
    },
    handleCreate() {
      eventBus.$emit("addGame");
    },
    handleEdit(index, row) {
      eventBus.$emit("editGame", row[index]);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      let ids = [];
      this.multipleSelection.map(item => {
        ids.push(item.id);
      });
      this.selectedIDs = ids;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }
};
</script>

<style scoped>
.el-tree-node .el-tree-node__content .el-tree-node__label {
  font-size: 34px;
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
.btn {
  margin-top: 20px;
  text-align: center;
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
  width: 83%;
  height: 500px;
  float: left;
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
.program_content {
  width: 100%;
  height: 500px;
}
.pro_name {
  float: left;
  width: 15%;
  line-height: 50px;
  height: 50px;
  text-align: right;
  font-weight: bold;
}

.pro_value {
  float: left;
  width: 20%;
  line-height: 50px;
  height: 50px;
  text-align: center;
}
.pro_line {
  width: 100%;
  height: 50px;
}
</style>
