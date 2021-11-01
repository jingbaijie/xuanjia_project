<template>
  <div class="aside-container">
    <!-- <div class="sidebar-logo">{{title}}</div> -->
    <div class="aside-container_body">
      <el-scrollbar
        style="height:100%"
        wrap-class="scrollbar-wrapper"
        wrap-style="color:red;"
        view-style="font-weight: bold;"
        view-class="view-box"
        :native="false"
      >
        <el-menu
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          default-active="0"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409eff"
        >
          <div class="sidebar-logo">{{title}}</div>
          <el-submenu :key="d.id" :index="d.id + ''" v-for="d in menuData">
            <template slot="title">
              <em :class="d.icon" />
              <span slot="title">{{ d.menuName }}</span>
            </template>
            <el-menu-item
              :key="c.id"
              v-for="c in d.children"
              @click="addTab(c)"
              :index="c.id + ''"
              style="text-align: center;"
              >{{ c.menuName }}</el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-scrollbar>
    </div>
    <div class="btn_menu">
      <el-button
        v-if="isCollapse"
        @click="emitCollapse(isCollapse)"
        icon="el-icon-s-unfold"
      ></el-button>
      <el-button
        v-else
        @click="emitCollapse(isCollapse)"
        icon="el-icon-s-fold"
      ></el-button>
    </div>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import Cookies from "js-cookie";
export default {
  name: "navBar",
  data() {
    return {
      menuData: {},
      isCollapse: false,
      screenWidth: document.body.clientWidth,
      minScreenWidth: 1000,
      pagedefault: "",
      title: ""
    };
  },
  watch: {
    $route() {
      if (this.$route.meta.parentPath) {
        this.pagedefault = this.$route.meta.parentPath; // 实现路由切换
      }
    },
    screenWidth(val, oldVal) {
      if (val < this.minScreenWidth) {
        this.emitCollapse(false);
      }
    }
  },
  methods: {
    getSystemConfigByKey(){
      this.$store
        .dispatch("axios_get_systemConfigByKey", {
          key: "system_title",
        })
        .then((res) => {
          this.title = res.data.data.configValue;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        }); 
    },
    initNav() {
      this.$store;
      let key = Cookies.get("child_module");
      this.$store
        .dispatch("axios_load_navbar", { platformKey: key })
        .then(res => {
          this.menuData = this.filterMenu(res.data.data.menus);
          sessionStorage.setItem("permissions", res.data.data.perms.join());
        })
        .catch(err => {});
    },
    emitCollapse(v) {
      this.isCollapse = v ? false : true;
    },
    addTab(menuItem) {
      let actionName = menuItem.url.split("/");
      sessionStorage.setItem("cacheTabView", JSON.stringify(actionName));
      if (
        JSON.stringify(this.$router.options.routes).indexOf(
          "/" + actionName[0]
        ) >= 0
      ) {
        eventBus.$emit("addTab", {
          title: menuItem.menuName,
          menuId: menuItem.id,
          content: actionName[actionName.length - 1]
        });
      } else {
        this.$message.warning("暂无此功能");
      }
    },
    filterMenu(fdata) {
      return fdata
        .filter(items => items.visible == 0)
        .map(item => {
          item = Object.assign({}, item);
          if (item.children) {
            item.children = this.filterMenu(item.children);
          }
          return item;
        });
    }
  },
  created() {
    this.initNav();
    this.getSystemConfigByKey();
  },
  mounted() {
    this.$nextTick(() => {
      window.onresize = () => {
        this.screenWidth = document.body.clientWidth;
      };
    });
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}
.aside-container_body {
  height: 90vh;
  background-color: rgb(84, 92, 100);
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 201px;
}
.btn_menu {
  text-align: right;
}
.el-button {
  width: 100%;
}
.sidebar-logo {
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: rgb(84, 92, 100);
  text-align: center;
  overflow: hidden;
  color: #fff;
  font-size: 15px;
}
</style>
