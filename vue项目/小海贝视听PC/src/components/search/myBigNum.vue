<!--
 * @Author: your name
 * @Date: 2021-09-02 14:07:08
 * @LastEditTime: 2021-09-07 14:18:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tvjoy-web\src\components\search\myBigNum.vue
-->
<template>
  <div>
    <div class="btnGroup">
      <template v-for="(item, index) in showNumArry">
        <el-button
          plain
          v-if="item.type == 'num'"
          :class="(index==0&&allCurIndex==0)?'activeOne':''"
          :key="index"
          @click="setNum(item.msg)"
          >{{ item.msg }}</el-button>
          <el-popover
            placement="right-start"
            :key='index'
            v-if="item.type=='all'"
            width="300"
            trigger="hover"
            :close-delay='1000'>
            <a href="" @click.prevent="setNum(citem)" class="toolMsg" v-for="(citem,cindex) in numArry" :key="cindex">{{citem}}</a>
            <el-button plain slot="reference">{{item.msg}}</el-button>
        </el-popover>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "myBigNum",
  props: ["total","allCurIndex"],
  data() {
    return {
      numArry: [],
      showActiveOne: true
    };
  },
  watch: {
      total(newValue, oldValue) {
          this.createNum(newValue)
      }
  },
  methods: {
    setNum(item) {
        document.getElementsByClassName("el-button--default")[0].className = document.getElementsByClassName("el-button--default")[0].className.replace("activeOne","")
        this.$emit('clickBigNum',item);
    },
    createNum(cnum){
        // console.log(this.total);
        this.numArry=[];
        var num = Math.ceil(cnum / 20);
        for (let i = 0; i < num; i++) {
        var start = i * 20;
        var end = (i + 1) * 20<=this.total?(i+1)*20:this.total;
        if (i == 0) {
            start = 1;
        } else if (i == num - 1 && end > cnum) {
            end = cnum;
        }
        var string = start + "-" + end;
        this.numArry.push(string);
        }
    }
    
  },
  computed: {
    showNumArry() {
      var arr = [];
      for (var i = 0; i < this.numArry.length; i++) {
        if (i < 8) {
          arr.push({ msg: this.numArry[i], type: "num" });
        }
      }
      if (this.numArry.length > 8) {
        arr[7] = { msg: "全部", type: "all" };
      }
      // console.log(arr)
      return arr;
    },
  },
  mounted() {
    this.createNum(this.total)
  }
};
</script>

<style scoped>
.toolMsg{
    margin-right: 20px;
    float: left;
    font-size: 13px;
    min-width: 50px;
    line-height: 24px;
}
.el-button {
  width: 104px;
  height: 30px;
  line-height: 0px;
}
.btnGroup {
  width: max-content;
}

.el-popover__reference{
  margin-left: 10px;
}
a {
    text-decoration: none;
    color: inherit;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    -webkit-appearance: none;
    -webkit-text-size-adjust: none;
    -webkit-tap-highlight-color: green;
    -webkit-touch-callout: none;
    border-bottom: none;
}
.el-button--default:hover{
    border-color: #26C3DD !important;
    color: #26C3DD !important;
}
.btnGroup .activeOne{
  border-color: #26C3DD !important;
  color: #26C3DD !important;
}
</style>