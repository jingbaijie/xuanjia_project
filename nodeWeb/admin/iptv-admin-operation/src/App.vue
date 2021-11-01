<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view v-if="isRouterAlive"></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      isRouterAlive: true
    };
  },
  provide() {
    return {
      reload: this.reload
    };
  },
  watch: {
    $route: function(val) {
      this.doInit();
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    },
    replaceUrl(name, query, delParams, onComplete, onAbort) {
      let index = 0;
      let url = name;
      if (query) {
        for (let key in query) {
          if (
            key &&
            key !== delParams &&
            (query["" + key] || query["" + key] === 0)
          ) {
            url += index === 0 ? "?" : "&";
            url += key + "=" + query["" + key];
            index++;
          }
        }
      }
      return this.$router.replace(url, onComplete, onAbort);
    },
    doInit() {
    }
  },
  created() {},
  mounted() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {}
};
</script>

<style scoped>
#app {
  width: 100%;
  height: 100%;
  display: flex;
  z-index: -1;
  /* justify-content: center;
  align-items: center;
  overflow: hidden; */
}
.cash {
  position: fixed;
  top:0px;
  width: 100%;
  height: 100%;
  z-index: 0;
}
/* div{
  border:1px solid red
} */

/*
vue-particles
color: String类型。默认'#dedede'。粒子颜色。
particleOpacity: Number类型。默认0.7。粒子透明度。
particlesNumber: Number类型。默认80。粒子数量。
shapeType: String类型。默认'circle'。可用的粒子外观类型有："circle","edge","triangle", "polygon","star"。
particleSize: Number类型。默认80。单个粒子大小。
linesColor: String类型。默认'#dedede'。线条颜色。
linesWidth: Number类型。默认1。线条宽度。
lineLinked: 布尔类型。默认true。连接线是否可用。
lineOpacity: Number类型。默认0.4。线条透明度。
linesDistance: Number类型。默认150。线条距离。
moveSpeed: Number类型。默认3。粒子运动速度。
hoverEffect: 布尔类型。默认true。是否有hover特效。
hoverMode: String类型。默认true。可用的hover模式有: "grab", "repulse", "bubble"。
clickEffect: 布尔类型。默认true。是否有click特效。
clickMode: String类型。默认true。可用的click模式有: "push", "remove", "repulse", "bubble" */
</style>
