<template>
  <div>
    <el-card class="box-card" :style="{ 'overflow-y': 'auto' }">
      <div slot="header" class="clearfix">
        <span>推荐列表</span>
        <el-button
          style="float:right;padding: 11px;border-left:1px solid #eee"
          type="text"
          @click="onSubmit()"
          >提 交</el-button
        >
        <el-button
          style="float: right;padding: 11px"
          type="text"
          @click="resetForm()"
          >新 增</el-button
        >
      </div>
      <el-form :model="form" style="max-height:600px;overflow-y:auto">
        <div
          class="recom_item"
          :key="'a' + index"
          v-for="(recoms, index) in recommendList"
        >
          <el-card
            :style="{ 'margin-top': '15px' }"
            :body-style="{ padding: '8px', cursor: 'pointer' }"
            shadow="hover"
          >
            <el-form-item class="el_title recom_title" label="归属类型:">
              <span class="recom_title">{{ recoms.typeId.label }}</span>
              <el-button
                style="float: right;padding: 11px"
                type="text"
                @click="editRecomList(recoms, index)"
                >编辑</el-button
              >
            </el-form-item>
            <el-form-item class="el_title" label="排行ID">
              <el-input-number
                size="small"
                v-model="recoms.rankId"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="上" label-width="20px" style="float:left">
              <el-input-number
                v-model="recoms.movetop"
                :min="0"
                controls-position="right"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="下" label-width="20px" style="float:left">
              <el-input-number
                v-model="recoms.movedown"
                controls-position="right"
                :min="0"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="左" label-width="20px" style="float:left">
              <el-input-number
                v-model="recoms.moveleft"
                :min="0"
                controls-position="right"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="右" label-width="20px" style="float:left">
              <el-input-number
                v-model="recoms.moveright"
                controls-position="right"
                :min="0"
              ></el-input-number>
            </el-form-item>
            <div :key="'b' + i" v-for="(recom, i) in recoms.recomList">
              <el-form-item class="el_title" label="推荐图片">
                <el-checkbox
                  v-model="recom.checked"
                  :checked="isActionType"
                  :label="beautySub(recom.name, 8)"
                  @change="value => changeLabel(value, recom)"
                ></el-checkbox>
                <el-button
                  style="float: right;padding: 11px"
                  type="text"
                  @click="deleteEl(index, i, false, recom)"
                  >刪除</el-button
                >
              </el-form-item>
              <el-form-item label="X" label-width="30px" style="float:left">
                <el-input-number
                  v-model="recom.xValue"
                  @change="x => handleChangeX(x, recom)"
                  :min="-1280"
                  :max="1280"
                  controls-position="right"
                  :disabled="!recom.checked"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="Y" label-width="30px" style="float:left">
                <el-input-number
                  v-model="recom.yValue"
                  @change="y => handleChangeY(y, recom)"
                  controls-position="right"
                  :min="-720"
                  :max="720"
                  :disabled="!recom.checked"
                ></el-input-number>
              </el-form-item>
            </div>
            <div
              :key="'c' + x"
              v-for="(lab, x) in recoms.labelList"
              :style="{ clear: 'both' }"
            >
              <el-form-item class="el_title" label="标签图片">
                <el-checkbox
                  v-model="lab.checked"
                  :checked="isActionType"
                  :label="beautySub(lab.name, 8)"
                  @change="value => changeLabel(value, lab)"
                ></el-checkbox>
                <el-button
                  style="float: right;padding: 11px"
                  type="text"
                  @click="deleteLabel(index, x, false, lab)"
                  >刪除</el-button
                >
              </el-form-item>
              <el-form-item label="X" label-width="30px" style="float:left">
                <el-input-number
                  v-model="lab.xValue"
                  @change="x => handleChangeX(x, lab)"
                  controls-position="right"
                  :min="-1280"
                  :max="1280"
                  :disabled="!lab.checked"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="Y" label-width="30px" style="float:left">
                <el-input-number
                  v-model="lab.yValue"
                  controls-position="right"
                  @change="y => handleChangeY(y, lab)"
                  :min="-720"
                  :max="720"
                  :disabled="!lab.checked"
                ></el-input-number>
              </el-form-item>
            </div>
            <div
              :key="'e' + x"
              v-for="(corner, x) in recoms.cornerList"
              :style="{ clear: 'both' }"
            >
              <el-form-item class="el_title" label="角标图片">
                <el-checkbox
                  v-model="corner.checked"
                  :checked="isActionType"
                  :label="beautySub(corner.name, 8)"
                  @change="value => changeLabel(value, corner)"
                ></el-checkbox>
                <el-button
                  style="float: right;padding: 11px"
                  type="text"
                  @click="deleteCorner(index, x, false, corner)"
                  >刪除</el-button
                >
              </el-form-item>
              <el-form-item label="X" label-width="30px" style="float:left">
                <el-input-number
                  v-model="corner.xValue"
                  @change="x => handleChangeX(x, corner)"
                  controls-position="right"
                  :min="-1280"
                  :max="1280"
                  :disabled="!corner.checked"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="Y" label-width="30px" style="float:left">
                <el-input-number
                  v-model="corner.yValue"
                  controls-position="right"
                  @change="y => handleChangeY(y, corner)"
                  :min="-720"
                  :max="720"
                  :disabled="!corner.checked"
                ></el-input-number>
              </el-form-item>
            </div>
            <div :key="'d' + y" v-for="(show, y) in recoms.showList">
              <el-form-item class="el_title" label="显示图片">
                <el-checkbox
                  v-model="show.checked"
                  :checked="isActionType"
                  :label="beautySub(show.name, 8)"
                  @change="value => changeLabel(value, show)"
                ></el-checkbox>
                <el-button
                  style="float: right;padding: 11px"
                  type="text"
                  @click="deleteShow(index, y, false, show)"
                  >刪除</el-button
                >
              </el-form-item>
              <el-form-item label="x" label-width="30px" style="float:left">
                <el-input-number
                  v-model="show.xValue"
                  controls-position="right"
                  @change="x => handleChangeX(x, show)"
                  :min="-1280"
                  :max="1280"
                  :disabled="!show.checked"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="y" label-width="30px" style="float:left">
                <el-input-number
                  v-model="show.yValue"
                  controls-position="right"
                  @change="y => handleChangeY(y, show)"
                  :min="-720"
                  :max="720"
                  :disabled="!show.checked"
                ></el-input-number>
              </el-form-item>
            </div>
            <div :key="'s' + index" v-for="(hide, y) in recoms.hideList">
              <el-form-item class="el_title" label="显示图片">
                <el-checkbox
                  v-model="hide.checked"
                  :checked="isActionType"
                  :label="beautySub(hide.name, 8)"
                  @change="value => changeLabel(value, hide)"
                ></el-checkbox>
                <el-button
                  style="float: right;padding: 11px"
                  type="text"
                  @click="deleteHide(index, y, false, hide)"
                  >刪除</el-button
                >
              </el-form-item>
              <el-form-item label="X" label-width="30px" style="float:left">
                <el-input-number
                  v-model="hide.xValue"
                  controls-position="right"
                  @change="x => handleChangeX(x, hide)"
                  :min="-1280"
                  :max="1280"
                  :disabled="!hide.checked"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="Y" label-width="30px" style="float:left">
                <el-input-number
                  v-model="hide.yValue"
                  controls-position="right"
                  @change="y => handleChangeY(y, hide)"
                  :min="-720"
                  :max="720"
                  :disabled="!hide.checked"
                ></el-input-number>
              </el-form-item>
            </div>
          </el-card>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
export default {
  name: "recomConfigList",
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
      } else if (this.recommendList[index].cornerList.length > 0) {
        return true;
      } else if (this.recommendList[index].showList.length > 0) {
        return true;
      } else if (this.recommendList[index].hideList.length > 0) {
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
    deleteCorner(index, i, v, r) {
      this.recommendList[index].cornerList.splice(i, 1);
      if (!this.checkRecomList(index)) {
        this.recommendList.splice(index, 1);
      }
      this.changeLabel(v, r);
    },
    deleteShow(index, i, v, r) {
      this.recommendList[index].showList.splice(i, 1);
      this.changeLabel(v, r);
    },
    deleteHide(index, i, v, r) {
      this.recommendList[index].hideList.splice(i, 1);
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
        eventBus.$emit("setRecom", d);
      } else {
        d.checked = false;
        eventBus.$emit("removeRecom", d);
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
          typeName: "",
          id: "",
          rankId: "",
          details: []
        };
        p.typeId = item.typeId.value;
        p.name = item.typeId.label;
        p.typeName = item.typeId.label;
        p.rankId = item.typeId.rankId;
        if (item.typeId.id) {
          p.id = item.typeId.id;
        }

        let recomitem = {
          id: "",
          rankId: 0,
          recommendDisplayType: "",
          recommendDisplayName: "",
          recommendDisplayValue: "",
          commonPageId: "",
          recommendTrackName: "",
          animation: "",
          onfocus: 1,
          isFree: 1,
          movetop: "",
          movedown: "",
          moveleft: "",
          moveright: "",
          more1: "",
          more2: "",
          more3: "",
          more4: "",
          recommendPicInfo: []
        };
        if (item.id) {
          recomitem.id = item.id;
        }
        recomitem["rankId"] = item.rankId;
        recomitem.recommendDisplayType = item.recommendDisplayType;
        recomitem.recommendDisplayName = item.recommendDisplayName;
        recomitem.recommendDisplayValue = item.recommendDisplayValue;
        recomitem.commonPageId = item.commonPageId;
        recomitem.recommendTrackName = item.recommendTrackName;
        recomitem.animation = item.animation;
        recomitem.isFree = item.isFree;
        recomitem.onfocus = item.onfocus;
        recomitem.movetop = item.movetop;
        recomitem.movedown = item.movedown;
        recomitem.moveleft = item.moveleft;
        recomitem.moveright = item.moveright;
        recomitem.more1 = item.more1;
        recomitem.more2 = item.more2;
        recomitem.more3 = item.more3;
        recomitem.more4 = item.more4;
        let recommendPicInfoT = item.recomList.concat(
          item.showList,
          item.hideList,
          item.labelList,
          item.cornerList
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
        if(item.recomList){
          item.recomList.forEach((itemm, indexx) => {
            if (itemm.id == id) {
              itemm.xValue = l * 2;
              itemm.yValue = t * 2;
            }
          });
        }else{
          return;
        }
        if(item.labelList){
          item.labelList.forEach(itemm => {
            if (itemm.id == id) {
              itemm.xValue = l * 2;
              itemm.yValue = t * 2;
            }
          });
        }else{
          return;
        }
        if(item.cornerList){
          item.cornerList.forEach(itemm => {
            if (itemm.id == id) {
              itemm.xValue = l * 2;
              itemm.yValue = t * 2;
            }
          });
        }else{
          return;
        }
        if(item.showList){
          item.showList.forEach(itemm => {
            if (itemm.id == id) {
              itemm.xValue = l * 2;
              itemm.yValue = t * 2;
            }
        });
        }else{
          return;
        }
        if(item.hideList){
          item.hideList.forEach(itemm => {
            if (itemm.id == id) {
              itemm.xValue = l * 2;
              itemm.yValue = t * 2;
            }
        });
        }else{
          return;
        }
        
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
