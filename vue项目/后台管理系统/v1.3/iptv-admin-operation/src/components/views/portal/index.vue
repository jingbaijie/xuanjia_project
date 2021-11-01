<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card class="cardWrap">
          <el-row type="flex" justify="end" :style="{ margin: '0 145px 20px 0' }">
            <el-date-picker
              v-model="date"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              @change="dataChange"
            ></el-date-picker>
          </el-row>
          <el-row>
            <el-col
              :lg="{ span: 6, offset: 2 }"
              :md="{ span: 7 }"
              :sm="{ span: 8 }"
              :xs="{ span: 24 }"
            >
              <el-card class="count">
                <div>设备数量</div>
                <v-countup
                  :start-value="start"
                  :endVal="end0"
                  :duration="duration"
                  :mainStyle="mainStyle"
                  :countStyle="countStyle"
                ></v-countup>
              </el-card>
            </el-col>
            <el-col
              :lg="{ span: 6, offset: 1 }"
              :md="{ span: 7 }"
              :sm="{ span: 8 }"
              :xs="{ span: 24 }"
            >
              <el-card class="count">
                <div>升级成功数</div>
                <v-countup
                  :start-value="start"
                  :endVal="end1"
                  :duration="duration"
                  :mainStyle="mainStyle"
                  :countStyle="countStyle"
                ></v-countup>
              </el-card>
            </el-col>
            <el-col
              :lg="{ span: 6, offset: 1 }"
              :md="{ span: 7 }"
              :sm="{ span: 8 }"
              :xs="{ span: 24 }"
            >
              <el-card class="count">
                <div>升级失败数</div>
                <v-countup
                  :start-value="start"
                  :endVal="end2"
                  :duration="duration"
                  :mainStyle="mainStyle"
                  :countStyle="countStyle"
                ></v-countup>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { eventBus } from "@/common/eventBus";
import VCountup from "v-countup";
export default {
  data() {
    return {
      mainStyle: {
        fontWeight: "900"
      },
      countStyle: {
        fontSize: "50px",
        color: "#E4CED5",
        fontWeight: "900"
      },
      pageName: "整体情况",
      /** 时间选择器 */
      date: "",
      /** 数字渐变 */
      start: 0, // 开始数字
      end0: 0, // 结束数字
      end1: 0,
      end2: 0,
      duration: 1
    };
  },
  components: {
    VCountup
  },
  created() {
    this.getSuNum();
  },
  methods: {
    dataChange(e) {
      //console.log(e);
      // 搜索
    },
    // 升级成功数
    getSuNum() {
      // 总数?is_effective=1
      this.$store
        .dispatch("axios_query_numList", {
          is_effective: 1
        })
        .then(res => {
          this.end0 = Number(res.data.data);
        });
      // 成功
      this.$store
        .dispatch("axios_query_updatedDeviceNum", {
          successFlag: 0
        })
        .then(res => {
          ////console.log(res, 678)
          this.end1 =Number(res.data.data);
        });
      // 失败
      this.$store
        .dispatch("axios_query_updatedDeviceNum", {
          successFlag: 1
        })
        .then(res => {
          ////console.log(res, 789)
          this.end2 = Number(res.data.data);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
}
.row-date {
  justify-content: end;
}
.cardWrap {
  .count {
    min-width: 170px;
    margin: 0 40px 0 40px;
    text-align: center;
    //background-color: #409eff;
    background-image: linear-gradient(to bottom right, #9cecfb, #0052d4);
    min-height: 150px;
    line-height: 2;
    font-weight: 100;
    font-family: "Quartz";
    font-size: 20px;
    color: #fff;
    border-radius: 8px;
    .countup {
      font-size: 50px;
      font-weight: 500;
      font-family: "Quartz";
    }
  }
}
</style>
