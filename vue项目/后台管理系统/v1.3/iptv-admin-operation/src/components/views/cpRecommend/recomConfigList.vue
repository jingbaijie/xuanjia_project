<template>
  <div>
    <el-card class="box-card" :style="{'overflow-y':'auto'}">
      <div slot="header" class="clearfix">
        <span>推荐列表</span>
        <el-button
          style="float:right;padding: 11px;border-left:1px solid #eee"
          type="text"
          @click="onSubmit()"
        >提 交</el-button>
        <el-button style="float: right;padding: 11px" type="text" @click="resetForm()">新 增</el-button>
      </div>
      <el-form :model="form" style="max-height:600px;overflow-y:auto">
        <div class="recom_item" :key="'a'+index" v-for="(recoms,index) in recommendList">
          <el-card :style=" {'margin-top':'15px'}" :body-style="{ padding: '8px', cursor:'pointer' }" shadow="hover">
          <el-form-item class="el_title recom_title" label="归属类型:">
            <span class="recom_title">{{recoms.typeId.label}}</span>
            <el-button
              style="float: right;padding: 11px"
              type="text"
              @click="editRecomList(recoms,index)"
            >编辑</el-button>
          </el-form-item>

          <div :key="'b'+i" v-for="(recom,i) in recoms.recomList">
            <el-form-item class="el_title" label="推荐图片">
              <el-checkbox
                v-model="recom.checked"
                :checked="isActionType"
                :label="beautySub(recom.name,8)"
                @change="(value)=>changeLabel(value,recom)"
              ></el-checkbox>
              <el-button
                style="float: right;padding: 11px"
                type="text"
                @click="deleteEl(index,i,false,recom)"
              >刪除</el-button>
            </el-form-item>
          </div>
          <div :key="'c'+x" v-for="(lab,x) in recoms.labelList" :style="{'clear':'both'}">
            <el-form-item class="el_title" label="标签图片">
              <el-checkbox
                v-model="lab.checked"
                :checked="isActionType"
                :label="beautySub(lab.name,8)"
                @change="(value)=>changeLabel(value,lab)"
              ></el-checkbox>
              <el-button
                style="float: right;padding: 11px"
                type="text"
                @click="deleteLabel(index,x,false,lab)"
              >刪除</el-button>
            </el-form-item>
          </div>
          <div :key="'d'+y" v-for="(show,y) in recoms.showList">
            <el-form-item class="el_title" label="显示图片">
              <el-checkbox
                v-model="show.checked"
                :checked="isActionType"
                :label="beautySub(show.name,8)"
                @change="(value)=>changeLabel(value,show)"
              ></el-checkbox>
              <el-button
                style="float: right;padding: 11px"
                type="text"
                @click="deleteShow(index,y,false,show)"
              >刪除</el-button>
            </el-form-item>
          </div>
          <el-form-item class="el_title" label="排行ID">
            <el-input-number size="small" v-model="recoms.rankId"></el-input-number>
          </el-form-item>
            </el-card>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
export default {
  name: "recome_config_list",
  props: ["actionType"],
  inject: ["setDetailAction", "getDetailAction"],
  data() {
    return {
      form: {},
      recommendList: [],
      submitList: [],
      isActionType: true
    };
  },
  computed: {},
  methods: {
    editRecomList(recom, index) {
      this.setDetailAction("edit");
      eventBus.$emit("editRecomList", recom, index);
    },
    checkRecomList(index) {
      if (this.recommendList[index].recomList.length > 0) {
        return true;
      } else if (this.recommendList[index].labelList.length > 0) {
        return true;
      } else if (this.recommendList[index].showList.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    deleteEl(index, i, v, r) {
      this.recommendList[index].recomList.splice(i, 1);
      if (!this.checkRecomList(index)) {
        this.recommendList.splice(index, 1);
      }
      this.changeLabel(v, r);
    },
    deleteLabel(index, i, v, r) {
      this.recommendList[index].labelList.splice(i, 1);
      if (!this.checkRecomList(index)) {
        this.recommendList.splice(index, 1);
      }
      this.changeLabel(v, r);
    },
    deleteShow(index, i, v, r) {
      this.recommendList[index].showList.splice(i, 1);
      this.changeLabel(v, r);
    },
    handleChangeX(value, item) {
      eventBus.$emit("updatePositionX", item.id, value);
    },
    handleChangeY(value, item) {
      eventBus.$emit("updatePositionY", item.id, value);
    },
    changeLabel(v, d) {
      if (v) {
        d.checked = true;
        eventBus.$emit("setRecom", d)
      } else {
        d.checked = false;
        eventBus.$emit("removeRecom", d)
      }
    },
    beautySub(str, len) {
      if (typeof str == "string") {
        let reg = /[\u4e00-\u9fa5]/g,
          slice = str.substring(0, len),
          chineseCharNum = ~~(slice.match(reg) && slice.match(reg).length),
          realen = slice.length * 2 - chineseCharNum;
        return str.substr(0, realen) + (realen < str.length ? "..." : "");
      }
    },
    onSubmit() {
      var sublist = [];
      this.recommendList.forEach((item, index) => {
        let p = {
          typeId: "",
          name: "",
          typeName:"",
          id: "",
          rankId:'',
          details: []
        };
        p.typeId = item.typeId.value;
        p.name = item.typeId.label;
        p.typeName = item.typeId.label;
        p.rankId=item.typeId.rankId
        if (item.typeId.id) {
          p.id = item.typeId.id;
        }

        let recomitem = { 
          id: "",
          rankId:0,
          recommendDisplayType: "",
          recommendDisplayName: "",
          recommendDisplayValue: "",
          commonPageId: '',
          recommendPicInfo: []
        };
        if (item.id) {
          recomitem.id = item.id;
        }
        recomitem['rankId']= item.rankId;
        recomitem.recommendDisplayType = item.recommendDisplayType;
        recomitem.recommendDisplayName = item.recommendDisplayName;
        recomitem.recommendDisplayValue = item.recommendDisplayValue;
        recomitem.commonPageId= item.commonPageId;
        recomitem.recommendTrackName = item.recommendTrackName;
        let recommendPicInfoT = item.recomList.concat(
          item.showList,
          item.hideList,
          item.labelList
        );
        let tempRecomList = [];
        recommendPicInfoT.forEach((f, x) => {
          if (f.checked == undefined || f.checked == false) {
            recommendPicInfoT.splice(x, 1);
          } else {
            let elementPic = {};
            elementPic = f;
            tempRecomList.push(elementPic);
          }
        });
        if (tempRecomList.length > 0) {
          recomitem.recommendPicInfo = tempRecomList;
          p.details.push(recomitem);
          sublist.push(p);
        }
      });
      eventBus.$emit("submitRecomeList", sublist);
    },
    resetForm() {
      eventBus.$emit("createNew");
    }
  },
  created() {
    if (this.actionType == "edit") {
      if (this.getDetailAction() == "add") {
        this.isActionType = false;
      } else {
        this.isActionType = true;
      }
    } else {
      this.isActionType = false;
    }
    this.recommendList = this.$store.state.recommendList;
    eventBus.$on("elmousemove", (id, l, t) => {
      this.recommendList.forEach((item, index) => {
        item.recomList.forEach((itemm, indexx) => {
          if (itemm.id == id) {
            itemm.xValue = l * 2;
            itemm.yValue = t * 2;
          }
        });
        item.labelList.forEach(itemm => {
          if (itemm.id == id) {
            itemm.xValue = l * 2;
            itemm.yValue = t * 2;
          }
        });
        item.showList.forEach(itemm => {
          if (itemm.id == id) {
            itemm.xValue = l * 2;
            itemm.yValue = t * 2;
          }
        });
        item.hideList.forEach(itemm => {
          if (itemm.id == id) {
            itemm.xValue = l * 2;
            itemm.yValue = t * 2;
          }
        });
      });
    });
  },
  destroyed() {
    eventBus.$off(["elmousemove"]);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.removeItem {
  color: #409eff;
  font-weight: lighter;
  box-sizing: border-box;
}

.recom_title {
  font-size: 25px;
}
.el-input-number {
  width: 130px;
}
.el_title {
  clear: both;
}
.recom_item {
  width: 100%;
}
.el-input {
  width: 80px;
}

.box-card {
  padding: 10px;
}
.el-form-item {
  margin-bottom: 5px;
}
</style>
