<!--
 * @Author: your name
 * @Date: 2021-09-01 11:31:53
 * @LastEditTime: 2021-09-15 11:45:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tvjoy-web\src\components\personalCenter\dayItem.vue
-->
<template>
  <div v-if="recordsarr.length>0">
    <h2 class="title">{{titlekey}}</h2>
    <div class="playCard">
      <div
        class="playItem"
        v-for="item in recordsarr"
        :key="item.contentId"
      >
        <img
          class="playItemImg"
          @click="jumpToCartoon(item)"
          :src="imgUrl+item.more4"
          alt=""
        />
        <p class="playTitle">{{item.mediaName}}</p>
        <!-- <div class="playTime">
          <img
            class="smallTv"
            src="@/assets/images/personCenter/smallTv.png"
            alt=""
          />
          <p class="timep">观看到<span>{{item.watchEndTime?item.watchEndTime:0}}%</span></p>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:'dayItem',
  props: ['recordsarr','titlekey'],
  data(){
    return{
      imgUrl: window.configs.pic_BASEURL
    }
  },
  methods: {
    jumpToCartoon(carJson){
      this.$router.push({name: 'videoDetail',params: {cartoonId: carJson.contentId,videoId: carJson.videoId}});
    }
  }
};
</script>

<style scoped>
.playItemImg{
width: 220px; height: 124px; border-radius: 10px
}
.title{
    margin-top: 16px;
    height: 30px;
    line-height: 30px;
    font-size: 30px;
}
.playCard{
    margin-left: -21px;
    overflow: hidden;
}
.playItem{
    margin-left: 21px;
    float: left;
    margin-bottom: 45px;
}
.playTitle{
    margin: 0;
    font-size: 15px;
    height: 20px;
    line-height: 20px;
    margin-top: 15px;
    color: #333;
}
.playTime p{
    /* display: flex; */
    float: left;
    font-size: 13px;
}
.playTime p span{
    color:#2FB5CE;
    padding-left: 10px;
}
.smallTv{
     float:left;display:block;margin-top:14px;margin-right:5px
}
</style>