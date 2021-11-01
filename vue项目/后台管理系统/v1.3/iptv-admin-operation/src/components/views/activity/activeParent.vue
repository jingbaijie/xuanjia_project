<template>
  <div>
    <transition name="fade-transform" mode="out-in">
      <!-- 切换活动列表和活动配置模板组件 -->
      <component 
      :is="currentTabComponent" 
      :activeId='activeId'
      @changeView="changeView"
      @refreshActive="refreshActive"
       >
      </component>
    </transition>
  </div>
</template>

<script>

import activeList from "./activeList";
import createActive from "./createActive"

export default {
  name: "activeParent",
  inject: ["getMenuId"],
  data() {
    return {
      currentTabComponent:"activeList",
      actionType: {
        contentId: "",
        action: ""
      },
      activeId:'',
      menuId: this.getMenuId(),
    };
  },
  components: {
    createActive,
    activeList
  },
  provide() {
    return {
      setContentId: value => (this.actionType = value),
      getContentId: () => {
        return this.actionType;
      }
    };
  },
  watch: {
    $route: function(x, a) {

    }
  },
  methods:{
    changeView(view,data=""){
      this.activeId=data.id;
      this.currentTabComponent=view
    },
    refreshActive(){
      this.currentTabComponent='activeList'
    }
  },
  mounted() {

  },
  
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
