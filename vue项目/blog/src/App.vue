<template>
  <div id="app">
    <Header />
    <MainContent/>
    <Footer />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import MainContent from "@/components/Content.vue";
import Footer from "@/components/Footer.vue";
export default {
  components: {
    Header,
    MainContent,
    Footer
  }
};
</script>

<style lang="less">
* {
  padding: 0px;
  margin: 0px;
  list-style: none;
}
#app {
  width: 1200px;
  margin: 0 auto;
  border: 1px solid #41b883;
}
</style>
