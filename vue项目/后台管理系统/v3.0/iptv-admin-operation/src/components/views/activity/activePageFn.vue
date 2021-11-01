<template>
  <div>
    <!-- 
      fn: {
      focus: [{
        focusId: "2",
        focusCName: "保存手机号焦点 ",
        focusType: "0/1/2/3",
        jumpPage: "actiPageId",
        freeType: "0/1/2/3",
        recomendPic: [{
          url:"",
          xValue:"",
          yValue:""
        }],
        recomendLabelPic: [{
          url:"",
          xValue:"",
          yValue:""
        }],
        recommendShowPic: [{
          url:"",
          xValue:"",
          yValue:""
        }]
    }],
    list: {
        type: "1/2",//榜单类型，积分榜/排行版
        width: "",//宽度
        height: "",//高度
        top: "",//top 值
        left: "",//left 值
        color: "red",//字体颜色
        fontSize: "12px"//字体大小
    },
    inputPhone: {
        phone: {//手机输入框
          width: "",
          height: "",
          top: "",
          left: "",
          color: "red",
          fontSize: "12px"
        },
        tip: {//输入提示框号                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
          width: "",
          height: "",
          top: "",
          left: "",
          color: "red",
          fontSize: "12px"
        }
    },
    exChange: [{  //兑换奖品
        limit: "",//兑换限制
        belongFocus: "focusId"  //归属活动 ID
      }]
  }
    -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>页面添加功能</span>
        <el-button
          v-if="!getEditData()"
          style="float: right; padding: 3px 0"
          type="text"
          @click="onSubmit('form')"
          >提 交</el-button
        >
      </div>
      <el-form :model="form" ref="form">
        <el-form-item
          v-if="form.id"
          label="页面ID"
          prop="id"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.id"
            :disabled="true"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="功能" :label-width="formLabelWidth">
          <el-select v-model="value" clearable placeholder="请选择">
            <el-option
              v-for="item in fnOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <div v-if="value == 1">
          <focus ref="childSubmit" :actionType="actionType" />
        </div>
        <div v-else-if="value == 2">
          <list ref="childSubmit" :actionType="actionType" />
        </div>
        <div v-else-if="value == 3">
          <inputPhone ref="childSubmit" :actionType="actionType" />
        </div>
        <div v-else-if="value == 4">
          <exChange ref="childSubmit" :actionType="actionType" />
        </div>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { eventBus } from "@/common/eventBus";
import focus from "./activePageFnKids/focus";
import list from "./activePageFnKids/list";
import exChange from "./activePageFnKids/exChange";
import inputPhone from "./activePageFnKids/inputPhone";

export default {
  name: "activePageFn",
  props: ["actionType", "setTabView", "fnType"],
  inject: [
    "getPageInfo",
    "setTabView",
    "setFocus",
    "setList",
    "setInputPhone",
    "setExChange",
    "getEditData"
  ],
  components: { focus, list, inputPhone, exChange },
  data() {
    return {
      fnOptions: [
        {
          label: "焦点功能",
          value: 1
        },
        {
          label: "榜单功能",
          value: 2
        },
        {
          label: "手机输入功能",
          value: 3
        },
        {
          label: "兑换功能",
          value: 4
        }
      ],
      value: undefined,
      formLabelWidth: "120px"
    };
  },
  created() {
    if (this.actionType) {
      this.form = this.getPageInfo();
      this.value = this.fnType;
    }
  },
  methods: {
    setFnType(type) {
      this.value = type;
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$refs.childSubmit.onSubmit("form");
          this.setTabView("activePageInfo");
        } else {
          this.$message.warning("信息未填写完整！");
        }
      });
    }
  },
  destroyed() {
    eventBus.$off(["editFocus"]);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-input {
  width: 80%;
}
.dialog-footer {
  text-align: center;
}
</style>
