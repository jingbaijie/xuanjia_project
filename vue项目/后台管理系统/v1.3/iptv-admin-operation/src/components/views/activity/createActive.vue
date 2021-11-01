
<template>
  <div class="theme_activ">
    <div class="theme">
      <activeView ref="renderView"></activeView>
    </div>
    <div class="theme_info">
      <el-form label-position="left">
        <el-button
          @click="goBack"
          type="text"
          icon="el-icon-arrow-left"
          :style="{color:'#409EFF'}"
        >上一页</el-button>
        <el-button style="float: right;margin-right:20px" type="text" @click="saveActive()">保 存</el-button>
        <el-divider>
          <i>活动信息</i>
        </el-divider>

        <el-form-item style="margin-top:20px;margin-left:20px;" label-width="81px">
          <el-button
            type="primary"
            @click="resetForm('activeInfo',false)"
            v-if="!activeData.activityCname"
            size="small"
            circle
          >新建</el-button>
        </el-form-item>

        <el-form-item
          v-if="activeData.activityCname"
          :label=" `活动名：${activeData.activityCname}`"
          style="color:#409EFF;margin-top:20px;margin-left:20px;"
          label-width="170px"
        >
          <el-button type="warning" @click="resetForm('activeInfo',true)" circle size="mini">编辑</el-button>
        </el-form-item>

        <el-divider>
          <i class="el-icon-connection">活动页面</i>
        </el-divider>

        <el-form-item style="margin-top:20px;margin-left:20px;" label-width="81px">
          <el-button
            type="primary"
            @click="editPageInfo('activePageInfo',false)"
            size="small"
            circle
          >新增</el-button>
        </el-form-item>

        <el-form-item
          style="margin-top:20px;margin-left:20px"
          v-for="(item,index) in activePageInfoList"
          :key="item.pageEname"
          :label="`页面名：${item.pageCname}`"
          label-width="150px"
        >
          <el-button
            type="success"
            @click="editPageInfo('activePageInfo',true,item)"
            size="mini"
            circle
          >查看</el-button>
          <el-button type="info" @click="delPageInfo(item,index)" size="mini" circle>删除</el-button>

          <div
            :style="{'margin-left':'-138px' }"
            :key="focu.focusCName"
            v-for="(focu,index) in item.fn.focus"
          >
            <div class="fn_title">
              焦点功能
              <el-button
                style="margin:2px 0 0 51px"
                type="warning"
                @click="editFn(1,focu,item)"
                size="mini"
                circle
              >编辑</el-button>
              <el-button
                style="margin:2px 0 0 9px"
                type="info"
                @click="delPageFocus(item.fn.focus,index)"
                size="mini"
                circle
              >删除</el-button>
            </div>
            <span class="fn_name_title">{{`焦点名 ${focu.focusCName}`}}</span>
            <div :key="recomend.uid" v-for="recomend in focu.recomendPic">
              <el-checkbox v-model="recomend.checked">{{`未选中图：${recomend.picCname}`}}</el-checkbox>
              <div>
                X ：
                <el-input-number
                  size="mini"
                  @change="val=>changePisition(val,recomend,false)"
                  v-model="recomend.xValue"
                ></el-input-number>
              </div>
              <div>
                Y ：
                <el-input-number
                  size="mini"
                  @change="val=>changePisition(val,recomend,true)"
                  v-model="recomend.yValue"
                ></el-input-number>
              </div>
            </div>

            <div :key="recomendLabel.uid" v-for="recomendLabel in focu.recomendLabelPic">
              <el-checkbox v-model="recomendLabel.checked">{{`选中图：${recomendLabel.picCname}`}}</el-checkbox>
              <div>
                X ：
                <el-input-number
                  size="mini"
                  @change="val=>changePisition(val,recomendLabel,false)"
                  v-model="recomendLabel.xValue"
                ></el-input-number>
              </div>
              <div>
                Y ：
                <el-input-number
                  size="mini"
                  @change="val=>changePisition(val,recomendLabel,true)"
                  v-model="recomendLabel.yValue"
                ></el-input-number>
              </div>
            </div>
            <div :key="recommendShow.uid" v-for="recommendShow in focu.recommendShowPic">
              <el-checkbox v-model="recommendShow.checked">{{`选中展示图：${recommendShow.picCname}`}}</el-checkbox>
              <div>
                X ：
                <el-input-number
                  size="mini"
                  @change="val=>changePisition(val,recommendShow,false)"
                  v-model="recommendShow.xValue"
                ></el-input-number>
              </div>
              <div>
                Y ：
                <el-input-number
                  size="mini"
                  @change="val=>changePisition(val,recommendShow,true)"
                  v-model="recommendShow.yValue"
                ></el-input-number>
              </div>
            </div>
            <el-divider>
              <i class="el-icon-s-grid"></i>
            </el-divider>
          </div>

          <div v-if="item.fn.list" :style="{'margin-left':'-138px' }">
            <div class="fn_title">
              榜单功能
              <el-button
                style="margin:2px 0 0 51px"
                type="warning"
                @click="editFn(2,item.fn.list,item)"
                size="mini"
                circle
              >编辑</el-button>
              <el-button
                style="margin:2px 0 0 9px"
                type="info"
                @click="item.fn.list=undefined, delPageList()"
                size="mini"
                circle
              >删除</el-button>
            </div>
            <el-checkbox v-model="item.fn.list.checked">
              <span class="fn_name_title">{{`${listType[item.fn.list.type]}`}}</span>
            </el-checkbox>
            <div>
              X ：
              <el-input-number size="mini" v-model="item.fn.list.xValue"></el-input-number>
            </div>
            <div>
              Y ：
              <el-input-number size="mini" v-model="item.fn.list.yValue"></el-input-number>
            </div>
            <div>
              宽 ：
              <el-input-number size="mini" v-model="item.fn.list.picW"></el-input-number>
            </div>
            <div>
              高 ：
              <el-input-number size="mini" v-model="item.fn.list.picH"></el-input-number>
            </div>
            <el-divider>
              <i class="el-icon-medal-1"></i>
            </el-divider>
          </div>

          <div v-if="item.fn.inputPhone" :style="{'margin-left':'-138px' }">
            <div class="fn_title">
              手机功能
              <el-button
                style="margin:2px 0 0 51px"
                type="warning"
                @click="editFn(3,item.fn.inputPhone,item)"
                size="mini"
                circle
              >编辑</el-button>
              <el-button
                style="margin:2px 0 0 9px"
                type="info"
                @click="item.fn.inputPhone=undefined, delPageList()"
                size="mini"
                circle
              >删除</el-button>
            </div>
            <el-checkbox v-model="item.fn.inputPhone.phone.checked">{{`输入框`}}</el-checkbox>
            <div>
              X ：
              <el-input-number size="mini" v-model="item.fn.inputPhone.phone.xValue"></el-input-number>
            </div>
            <div>
              Y ：
              <el-input-number size="mini" v-model="item.fn.inputPhone.phone.yValue"></el-input-number>
            </div>
            <div>
              宽 ：
              <el-input-number size="mini" v-model="item.fn.inputPhone.phone.picW"></el-input-number>
            </div>
            <div>
              高 ：
              <el-input-number size="mini" v-model="item.fn.inputPhone.phone.picH"></el-input-number>
            </div>

            <el-checkbox v-model="item.fn.inputPhone.tip.checked">{{`提示框`}}</el-checkbox>
            <div>
              X ：
              <el-input-number size="mini" v-model="item.fn.inputPhone.tip.xValue"></el-input-number>
            </div>
            <div>
              Y ：
              <el-input-number size="mini" v-model="item.fn.inputPhone.tip.yValue"></el-input-number>
            </div>
            <div>
              宽 ：
              <el-input-number size="mini" v-model="item.fn.inputPhone.tip.picW"></el-input-number>
            </div>
            <div>
              高 ：
              <el-input-number size="mini" v-model="item.fn.inputPhone.tip.picH"></el-input-number>
            </div>
            <el-divider>
              <i class="el-icon-mobile-phone"></i>
            </el-divider>
          </div>
          <div
            :style="{'margin-left':'-138px' }"
            :key="ex.limit+parseInt(Math.random()*1000)"
            v-for="(ex,i) in item.fn.exChange"
          >
            <div class="fn_title">
              兑换功能
              <el-button
                style="margin:2px 0 0 51px"
                type="warning"
                @click="editFn(4,ex,item)"
                size="mini"
                circle
              >编辑</el-button>
              <el-button
                style="margin:2px 0 0 9px"
                type="info"
                @click="delPageExChange(item.fn.exChange,i)"
                size="mini"
                circle
              >删除</el-button>
            </div>
            <span class="fn_name_title">{{`焦点ID:${ex.belongFocus} 限制数:${ex.limit}` }}</span>
            <el-divider>
              <i class="el-icon-present"></i>
            </el-divider>
          </div>
        </el-form-item>
      </el-form>
      <el-divider>
        <i class="el-icon-upload"></i>
      </el-divider>
      <div class="dialog-footer">
        <el-button type="primary" plain @click="saveActive()">保存</el-button>
      </div>
    </div>
    <!-- </el-card> -->
    <div class="theme_config">
      <!-- <transition name="fade-transform" mode="out-in"> -->
      <!--1渲染一个'元组件'为动态组件，根据is的值来决定那个组件被渲染-->
      <component
        v-if="refreshForm"
        :is="tabView"
        :actionType="actionType"
        @addActivePage="addActivePage"
        :fnType="fnType"
      ></component>
      <!-- </transition> -->
    </div>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import activeInfo from "./activeInfo"; //活动信息 新建or编辑活动
import activeView from "./activeView"; //活动页面内容展示
import activePageInfo from "./activePageInfo"; //活动页面信息
import activePageFn from "./activePageFn"; //页面功能

export default {
  name: "createActive",
  components: {
    activeView, //活动页面内容展示
    activeInfo, //活动信息 新建or编辑活动
    activePageInfo, //活动页面信息
    activePageFn //页面功能
  },
  data() {
    return {
      xValue: 0,
      yValue: 0,
      activeData: {}, //活动信息
      activePageInfoList: [],
      pageInfo: {},
      actionType: false,
      tabView: "activeInfo", //新建活动信息
      refreshForm: true,
      listType: { "1": "积分榜", "2": "排行榜" },
      hasParentPage: false, //是否有父页面
      editData: undefined,
      formLabelWidth: "120px",
      fnType: 0
    };
  },
  props: ["activeId"],
  provide() {
    return {
      checkUniquPageParent: () => {
        return this.hasParentPage;
      },
      setUniquPageParent: value => (this.hasParentPage = value),
      /**
       * 注入活动信息数据
       */
      setActiveData: value => ((this.activeData = value), (this.tabView = "")),
      getActiveData: () => {
        return this.activeData;
      },
      /**
       * 注入活动页面信息数据
       */
      getPageInfo: () => {
        return this.pageInfo;
      },
      getPageInfoList: () => {
        return this.activePageInfoList;
      },

      getPageFocus: () => {
        return this.pageInfo.fn.focus;
      },

      setTabView: value => (this.tabView = value),

      getEditData: () => {
        return this.editData;
      },
      setEditData: value => (this.editData = value),
      reload: this.reLoadForm,
      /**
       *  注入页面功能数据
       *  focus 埋点
       *  list 榜单
       *  inputPhone 手机框
       *  exChange 奖品
       */
      setFocus: value => this.addPageFocus(value),
      setList: value => this.addPageList(value),
      setInputPhone: value => this.addInputPhone(value),
      setExChange: value => this.addExChange(value),
      setActionType: value => (this.actionType = value)
    };
  },
  computed: {
    //编辑格式化数据
    formatEditActiveData() {
      this.activeData.activityPages.forEach(page => {
        page.fn = {};
        page.activityPageConfigs.forEach(config => {
          page.fn[config.attrKey] = JSON.parse(config.attrJson);
        });
        delete page.activityPageConfigs;
        this.addActivePage(page);
      });
      return this.activeData;
    },
    //提交格式化数据
    formatActiveData() {
      this.activeData.activityPages.forEach(page => {
        page.activityPageConfigs = [];
        if (page.fn.focus) {
          page.activityPageConfigs.push({
            attrJson: page.fn.focus,
            attrKey: "focus",
            pageId: page.id
          });
        }
        if (page.fn.exChange) {
          page.activityPageConfigs.push({
            attrJson: page.fn.exChange,
            attrKey: "exChange",
            pageId: page.id
          });
        }
        if (page.fn.list) {
          page.activityPageConfigs.push({
            attrJson: page.fn.list,
            attrKey: "list",
            pageId: page.id
          });
        }
        if (page.fn.inputPhone) {
          page.activityPageConfigs.push({
            attrJson: page.fn.inputPhone,
            attrKey: "inputPhone",
            pageId: page.id
          });
        }
      });
      return this.activeData;
    }
  },
  methods: {
    /**
     * val:
     * pic:
     * position:
     */
    changePisition(val, pic, position) {
      if (position) {
        pic.yValue = val;
      } else {
        pic.xValue = val;
      }
    },
    /**
     * 获取焦点name
     * @id:兑换焦点id
     */
    getFocusName(id) {
      let name = "";
      this.pageInfo.fn.focus.forEach(item => {
        if (item.focusId == id) name = item.focusCName;
      });
      return name;
    },

    /**
     *  提交接收活动页面
     */
    addActivePage(data) {
      this.tabView = "";
      this.activePageInfoList.unshift(data);
      this.activePageInfoList = this.filterPageList(this.activePageInfoList);
      // this.activePageInfoList.forEach(item => {
      //   item.isMainPage ? (this.hasParentPage = true) : ""; //是否为一级页面(首页)
      // });
    },

    /**
     *
     * 新增||编辑活动页面
     * @param {*} page  activePageInfo  页面
     * @param {*} actionType 操作类型
     * @param {*} row activePageInfoList
     */
    editPageInfo(page, actionType, row) {
      this.actionType = actionType;
      this.$refs.renderView.resetView(); //调用页面内容子组件
      this.tabView = page; //加载组件
      this.reLoadForm();
      //查看
      if (actionType) {
        this.pageInfo = row;
        this.$refs.renderView.renderViewImg();
      } else {
        this.editData = undefined;
      }
    },
    /**活动页面删除
     * @index：删除的位置
     */
    delPageInfo(index) {
      this.activePageInfoList.splice(index, 1);
      this.editPageInfo("activePageInfo", false);
    },
    /**
     * 添加焦点
     */
    addPageFocus(value) {
      this.reLoadForm();
      this.$refs.renderView.resetView(); //调用页面内容子组件
      this.pageInfo.fn.focus.unshift(value);
      this.$refs.renderView.renderViewImg();
    },
    /**
     * 焦点--删除
     */
    delPageFocus(focus, index) {
      this.$refs.renderView.resetView();
      this.reLoadForm();
      focus.splice(index, 1);
      this.$refs.renderView.renderViewImg();
    },
    /**
     * 榜单
     */
    addPageList(value) {
      this.reLoadForm();
      this.$refs.renderView.resetView();
      this.pageInfo.fn.list = value;
      this.$refs.renderView.renderViewImg();
    },

    /**
     * 手机输入功能
     */
    addInputPhone(value) {
      this.$refs.renderView.resetView();
      this.pageInfo.fn.inputPhone = value;
      this.$refs.renderView.renderViewImg();
    },
    /**
     * 兑换功能
     */
    addExChange(value) {
      this.pageInfo.fn.exChange.unshift(value); //unshift()向数组的开头添加一个或更多元素,并返回新的长度
    },

    /**
     * 兑换--删除
     */
    delPageExChange(ex, i) {
      ex.splice(i, 1);
    },
    /**
     * 手机、榜单--删除
     */
    delPageList() {
      this.$refs.renderView.resetView();
      this.$refs.renderView.renderViewImg();
    },
    /**
     * 活动信息新增or编辑
     * @param {*} page  activeInfo 活动信息页面
     * @param {*} actionType    新增or编辑
     */
    resetForm(page, actionType) {
      this.actionType = actionType;
      this.tabView = page;
      this.reLoadForm();
    },
    /**
     * 活动页面功能编辑
     * @param {*} fnType  焦点 榜单 手机 兑换
     * @param {*} data    编辑功能数据
     * @param {*} page     当前页面编辑的数据
     */
    editFn(fnType, data, page) {
      this.pageInfo = page;
      this.reLoadForm();
      this.actionType = true;
      this.tabView = "activePageFn";
      this.editData = data;
      this.fnType = fnType;
      // this.$nextTick(()=>{
      //   this.$refs.childenComponent.setFnType(fnType);
      // })
    },
    // 返回上一页
    goBack() {
      this.$emit("changeView", "activeList");
    },
    /**************
     * 渲染页面
     */
    reLoadForm() {
      this.refreshForm = false;
      this.$nextTick(function() {
        this.refreshForm = true;
      });
    },
    /**
     * 过滤页面信息
     */
    filterPageList(list) {
      let hash = {};
      let arr = list.reduce(function(item, next) {
        hash[next.pageEname]
          ? ""
          : (hash[next.pageEname] = true && item.unshift(next));
        return item;
      }, []);
      return arr;
    },
    /**
     * 保存操作
     * this.activeData.activityPages 活动页面信息
     */
    saveActive() {
      this.activeData.activityPages = this.activePageInfoList;

      let actionUrl;
      this.activeId
        ? (actionUrl = "axios_edit_active")
        : (actionUrl = "axios_add_active");
      this.$store
        .dispatch(actionUrl, this.formatActiveData)
        .then(res => {
          if (res.data.errorCode == "1000") {
            this.$message.success("添加成功");
            this.$emit("refreshActive");
          } else {
            this.$message.error(res.data.errorMsg);
          }
        })
        .catch(err => {
          this.$message.error("添加失败");
        });
    },
    deteleObject(obj) {
      var uniques = [];
      var stringify = {};
      for (var i = 0; i < obj.length; i++) {
        var keys = Object.keys(obj[i]);
        keys.sort(function(a, b) {
          return Number(a) - Number(b);
        });
        var str = "";
        for (var j = 0; j < keys.length; j++) {
          str += JSON.stringify(keys[j]);
          str += JSON.stringify(obj[i][keys[j]]);
        }
        if (!stringify.hasOwnProperty(str)) {
          //判断对象自身属性中是否有指定属性 没有的话
          uniques.push(obj[i]);
          stringify[str] = true;
        }
      }
      uniques = uniques;
      return uniques;
    }
  },
  mounted() {
    if (this.activeId) {
      this.$store
        .dispatch("axios_get_active_by_id", { activityId: this.activeId })
        .then(res => {
          this.activeData = res.data.data;
          this.activeData = this.formatEditActiveData;
          // console.log('编辑活动  axios_get_active_by_id ================>>>>>>>>>>>>> '+JSON.stringify(this.activePageInfoList));
          this.resetForm("activeInfo", true);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.dialog-footer {
  text-align: center;
}

.theme_activ {
  display: flex;
}

.theme {
  margin-top: 2%;
  width: 640px;
  min-width: 640px;
  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  float: left;
}

.theme_info {
  width: 300px;
  min-width: 300px;
  max-height: 80vh;
  overflow: auto;
  float: left;
  padding-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
  border-left: 2px dashed #eee;
  border-right: 2px dashed #eee;
}
.theme_config {
  width: 400px;
  overflow: auto;
  min-width: 240px;
  max-height: 80vh;
  float: left;
  padding-top: 10px;
}
.add_btn {
  margin: 10px 0 0 10px;
  float: left;
}

.el-input--mini .el-input__inner {
  width: 100px;
}
.fn_title {
  font-size: 20px;
  color: #409eff;
}
.fn_name_title {
  color: red;
}
</style>
