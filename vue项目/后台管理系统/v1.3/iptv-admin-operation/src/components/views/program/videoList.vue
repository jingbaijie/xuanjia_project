<template>
  <el-table :data="moveData" v-loading="loadingMove" ref="multipleTable">
    <el-table-column prop="fileUrl" label="文件地址"></el-table-column>
    <el-table-column prop="playUrl" label="播放地址"></el-table-column>
    <el-table-column prop="definition" label="清晰度"></el-table-column>
    <el-table-column prop="injectionPortal" label="注入平台"></el-table-column>
    <el-table-column prop="injectionState" label="注入状态">
      <template slot-scope="scope">{{inState[scope.row.injectionState]}}</template>
    </el-table-column>
    <el-table-column prop="createTime" label="修改时间"></el-table-column>
  </el-table>
</template>

<script>
import { Message, Loading } from "element-ui";

export default {
  name: "programList",
  props:["programId"],
  data() {
    return {
      breadcrumb: [],
      breadcrumb_child: [],
      activeName: "first",
      dialogVisible: false,
      currentPage: 1, //分页当前页码
      pageSize: 10,
      total: 1,
      classifyData: [],
      curProgram: {
        iconPic: {},
        labelPic: {},
        detailPic: {}
      },
      programData: [],
      seriesListData: [],
      classData: {},
      form: "",
      search: "",
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
        "1": "测试",
        "2": "上线"
      },
      online: {
        "0": "下架",
        "2": "上架"
      },
      booleanUpValue: ""
    };
  },
  created() {
    this.getMovieListByProgramId(this.programId);
   
  },
  mounted() {
    this.tableHeight =
      window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 200;
  },
  methods: {
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

  },
};
</script>

