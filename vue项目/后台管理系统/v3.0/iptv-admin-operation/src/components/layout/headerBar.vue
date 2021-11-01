<template>
  <div class="header-container">
    <el-row :gutter="20">
      <el-col :span="17">
        <div class="tab_page">
          <el-tabs
            v-model="editableTabsValue"
            type="card"
            closable
            @tab-click="tabChange"
            @tab-remove="removeTab"
          >
            <el-tab-pane
              :key="index"
              v-for="(item,index) in editableTabs"
              :label="item.title"
              :name="item.name"
              :contented="item.content"
            ></el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="right-menu">
          <div style="width:100px;height:50px;position:absolute;right: 120px">{{ "欢迎：" + userName }}</div>

          <el-dropdown class="avatar-container" trigger="click">
            <div class="avatar-wrapper">
              <img src="../../assets/images/haha.gif" class="user-avatar" alt />
              <em class="el-icon-caret-bottom" />
            </div>
            <el-dropdown-menu slot="dropdown" class="user-dropdown">
              <router-link to="/">
                <el-dropdown-item>主 页</el-dropdown-item>
              </router-link>
              <el-dropdown-item divided>
                <span style="display:block;" @click="handleRedisflushdb">清缓存</span>
              </el-dropdown-item>
              <!-- <el-dropdown-item divided>
                <span style="display:block;" @click="revisePwd">修改密码</span>
              </el-dropdown-item> -->
              <el-dropdown-item divided>
                <span style="display:block;" @click="logout">注 销</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <revisePwdForm :userName="nickName"></revisePwdForm>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { eventBus } from "@/common/eventBus";
import revisePwdForm from "./revisePwd";
import axios from "@/common/axios";
import routers from "@/router/routers";
export default {
  name: "headerBar",
  components: {
    revisePwdForm
  },
  data() {
    return {
      editableTabsValue: "0",
      editableTabs: [],
      tabIndex: 0,
      indexObj: {},
      nickName: "",
      userName: "",
      head: {
        "x-a-t": localStorage.getItem("token")
      },
      isCollapse: this.$store.state.isCollapse,
      cacheMenuArr: [],
      baseUrl: window.configs.lead_BASEURL
    };
  },
  created() {
      this.userName = localStorage.getItem("userName");
    this.nickName = localStorage.getItem("userNick");
    let cacheMenuArr =
      sessionStorage.getItem("cacheMenuArr") &&
      JSON.parse(sessionStorage.getItem("cacheMenuArr"));

    if (cacheMenuArr && cacheMenuArr.length > 0) {
      this.tabIndex = cacheMenuArr.length;
      //去重
      var newArr = [];
      var arrId = [];
      for (let item of cacheMenuArr) {
        if (arrId.indexOf(item["menuId"]) == -1) {
          arrId.push(item["menuId"]);
          newArr.push(item);
        }
      }
      cacheMenuArr = newArr;
      //去除掉路由中不存在的tab
      for (let item in cacheMenuArr) {
        if (JSON.stringify(routers).indexOf(cacheMenuArr[item].content) == -1) {
          cacheMenuArr.splice(item, 1);
          continue;
        }
        this.indexObj[cacheMenuArr[item].content] = item;
        cacheMenuArr[item].name = item;
      }
      this.editableTabs = cacheMenuArr;
      this.editableTabsValue =
        this.indexObj[JSON.parse(sessionStorage.getItem("cacheTabView"))] || 0;
    }
    this.getUserInfo();
    eventBus.$on("addTab", v => {
      this.addTab(v);
    });
  },
  methods: {
    handleRedisflushdb(args, method) {
      // axios
      //   .post("http://192.168.2.204:9527/nodeApi/redisflushdb")
      //   .then(response => {
      //     this.$message.success("已清除缓存");
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   });

      var url = this.baseUrl;
      // if (method && method.toLocaleUpperCase() == "POST") {
      var params = {
        log: typeof args == "object" ? JSON.stringify(args) : args
      };
      if (!args) {
        return;
      }
      var oAjax = null;
      try {
        oAjax = new XMLHttpRequest();
      } catch (e) {
        oAjax = new ActiveXObject("Microsoft.XMLHTTP");
      }
      oAjax.open("POST", url, true);
      oAjax.withCredentials = false;
      oAjax.send(JSON.stringify(params));
      oAjax.onreadystatechange = function() {
        /*/当状态为4的时候，执行以下操作*/
        if (oAjax.readyState == 4) {
          if (oAjax.status == 200) {
            // success && success(eval("(" + oAjax.responseText + ")"));
              this.$message.success("清除成功");
          } else {
            // fail && fail(status);
             this.$message.success("清除失败");
          }
        }
      };
      // this.$message.success("清除成功");

      // }
    },
    tabChange(tab) {
      this.tabView = tab.$attrs.contented;
      this.menuId = tab.$attrs.menuId;
      eventBus.$emit("showView", {
        view: this.tabView,
        menuId: this.menuId
      });
      sessionStorage.setItem("cacheTabView", JSON.stringify(this.tabView));
    },
    addTab(menuItem) {
      this.editableTabs.forEach(item => {
        if (item.menuId == menuItem.menuId) {
          this.already = true;
        }
      });
      if (!this.already) {
        let newTabName = ++this.tabIndex + "";
        menuItem.name = newTabName;
        this.editableTabs.push(menuItem);
        this.editableTabsValue = menuItem.name;
        this.tabView = menuItem.content;
        this.menuId = menuItem.menuId;
        this.indexObj[menuItem.content] = newTabName;
        this.cacheMenuArr =
          (sessionStorage.getItem("cacheMenuArr") &&
            JSON.parse(sessionStorage.getItem("cacheMenuArr"))) ||
          [];
        this.cacheMenuArr.push(menuItem);
        sessionStorage.setItem(
          "cacheMenuArr",
          JSON.stringify(this.cacheMenuArr)
        );
        sessionStorage.setItem("cacheTabView", JSON.stringify(this.tabView));
      } else {
        this.editableTabsValue = this.indexObj[menuItem.content];
        this.menuId = menuItem.menuId;
        this.tabView = menuItem.content;
        this.already = false;
      }
      eventBus.$emit("showView", {
        view: this.tabView,
        menuId: this.menuId
      });
    },

    removeTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
              this.tabView = nextTab.content;
              sessionStorage.setItem(
                "cacheTabView",
                JSON.stringify(this.tabView)
              );
            } else {
              this.tabView = "masterPage";
            }
            eventBus.$emit("showView", {
              view: this.tabView,
              menuId: this.menuId
            });
          }
        });
      }
      this.editableTabsValue = activeName;
      this.$store.commit(
        "del_cache_view",
        this.editableTabs.find(obj => {
          return obj.name === targetName;
        }).content
      );
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      sessionStorage.setItem("cacheMenuArr", JSON.stringify(this.editableTabs));
    },
    revisePwd() {
      eventBus.$emit("showRevisePwdForm");
    },
    getUserInfo() {
      this.$store
        .dispatch("axios_get_userInfo")
        .then(res => {
          this.nickName = res.data.data.uname;
          this.userName = res.data.data.nick;
        })
        .catch(err => {});
    },
    emitCollapse(v) {
      this.isCollapse = v ? false : true;
      this.$store.state.isCollapse = this.isCollapse;
    },
    async logout() {
      this.$store.dispatch("axios_user_logout").then(res => {
        sessionStorage.removeItem("token");
        this.$router.push(`/login`);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
a {
  text-decoration: none;
}
.header-logo {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  margin: -5px 0 0 15px;
  float: left;
}
.router-link-active {
  text-decoration: none;
}
.el-header {
  padding: 0;
  height: 50px;
}
.header-container {
  width: auto;
  height: 50px;
  font-size: 24px;
  color: #cccccc;
}

.tab_page {
  width: auto;
  max-width: 95%;
  float: left;
  height: 60px;
  margin: 20px 15px 10px 0px;
}
.el-dropdown-menu .el-popper .user-dropdown {
  top: 44px;
  left: 900px;
}
.right-menu {
  float: right;
  white-space: nowrap;
  height: 100%;
  line-height: 50px;
  font-size: 18px;
  &:focus {
    outline: none;
  }

  .right-menu-item {
    display: inline-block;
    padding: 0 8px;
    height: 100%;
    font-size: 18px;
    color: #5a5e66;
    vertical-align: text-bottom;

    &.hover-effect {
      cursor: pointer;
      transition: background 0.3s;
      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
  }
  .avatar-container {
    position: absolute;
    right: 40px;
    .avatar-wrapper {
      margin-top: 5px;
      position: relative;

      .user-avatar {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }

      .el-icon-caret-bottom {
        cursor: pointer;
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>
