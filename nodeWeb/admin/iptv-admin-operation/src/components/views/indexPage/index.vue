
<template>
  <el-row :gutter="30">
    <el-col :span="12">
      <div class="grid-content bg-purple">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>片单数据</span>
          </div>
          <div>
            <el-table :data="cardData" style="width: 100%">
              <el-table-column prop="type" label="类型"></el-table-column>
              <el-table-column prop="explain" label="说明"></el-table-column>
            </el-table>
          </div>
        </el-card>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="grid-content bg-purple">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>参数设置</span>
          </div>
          <div>
            <el-table :data="paramData" style="width: 100%">
              <el-table-column prop="type" label="类型"></el-table-column>
              <el-table-column align="center" label="操作" width="160">
                <template slot-scope="scope">
                  <el-button type="text" @click="handleCheck(scope.$index, paramData)">查 看</el-button>
                  <el-button type="text" @click="handleEdit(scope.$index, paramData)">设 置</el-button>
                </template>
              </el-table-column>
            </el-table>
            <configIndevPage @getMediaInfo="getMediaInfo"></configIndevPage>
          </div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import { eventBus } from "@/common/eventBus";
import configIndevPage from "./configIndevPage";
export default {
  data() {
    return {
      cardData: [],
      paramData: [],
      configInfo: {}
    };
  },
  components: {
    configIndevPage
  },
  created() {
    this.$nextTick(() => {
      this.paramData.push({ type: "开机图" });
      this.paramData.push({ type: "推出拦截页面" });
      this.paramData.push({ type: "首页跑马灯配置" });
    });
    // this.getConfigDetailByKey();
    this.getMediaInfo();
  },
  mounted() {},
  methods: {
    setCardDate(data) {
      this.cardData = [
        {
          type: "节目集",
          explain: data.booleanUp
        },
        {
          type: "节目",
          explain: data.program
        },
        {
          type: "版权到期节目集",
          explain: data.outOfDate
        },
        {
          type: "已上架节目集",
          explain: data.series
        }
      ];
    },
   
    getConfigInfo(k,num) {
      let key;
      switch (k) {
        case "开机图":
          key = "ANDROID_BOOT_IMG";
          break;
        case "推出拦截页面":
          key = "EXIT_INTERCEPT_PAGE";
          break;
        case "首页跑马灯配置":
          key = "ROLL_TEXT_INDEX";
          break;
        default:
          key = "";
          break;
      }
      this.$store
        .dispatch("axios_config_detailByKey", {
          configKey: key
        })
        .then(res => {
            eventBus.$emit("editInfo", num, res.data.data);
        })
        .catch(err => {});
    },
    handleCheck(row) {
      this.getConfigInfo(this.paramData[row].type,0);
      // eventBus.$emit("getInfo", 1, this.paramData[row].type,this.configInfo);
    },
    handleEdit(row) {
      this.getConfigInfo(this.paramData[row].type,1);
   
     
    },
    getMediaInfo() {
      this.$store
        .dispatch("axios_get_mediaInfo")
        .then(res => {
          this.tableData = res.data.data;
          this.setCardDate(this.tableData);
          console.log(this.tableData);
        })
        .catch(err => {});
    }
  }
};
</script>
<style lang='scss' scoped>
$boder: 1px solid slategray;
table {
  border: $boder;
}
</style>