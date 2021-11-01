<template>
  <div class="noTextSelect">
    <!-- 轮播图 -->
    <el-row class = "lunbo">
      <el-col :span="24">
          <el-carousel direction="vertical" :autoplay="true" :interval=5000>
              <el-carousel-item v-for="item in commpageInfo.recommend_1" :key="item.id" v-bind:label="item.recommendDisplayName">
                  <img @click="clickJump(item)" class="lunboImg" :src="imgUrl+item.recommendPic.picPath" alt="">
              </el-carousel-item>
          </el-carousel>
      </el-col>
    </el-row>
    <!-- 全部内容导航 -->
    <el-row class = "mainDown allCon">
        <el-col :span="24">
          <div class="allConOne">
            <img class = "allConBg1" :src="imgUrl+(commpageInfo.recommend_2&&commpageInfo.recommend_2[0]&&commpageInfo.recommend_2[0].recommendPic.picPath)" alt="">
            <div class = "allConTextDiv">
              <span @click="toAllContent(0)">全部</span>
            </div>
          </div>
          <div class="allConTwo">
            <img class = "allConBg2" :src="imgUrl+(commpageInfo.recommend_2&&commpageInfo.recommend_2[1]&&commpageInfo.recommend_2[1].recommendPic.picPath)" alt="">
            <div class = "allConTextDiv">
              <span @click="toAllContent(1)">兴趣课堂</span>
              <span @click="toAllContent(2)">自制内容</span>
              <span @click="toAllContent(3)">最近上线</span>
            </div>
          </div>
          <div class="allConThree">
            <img class = "allConBg3" :src="imgUrl+(commpageInfo.recommend_2&&commpageInfo.recommend_2[2]&&commpageInfo.recommend_2[2].recommendPic.picPath)" alt="">
            <div class = "allConTextDiv">
              <span @click="toAllContent(4)">男宝宝爱看</span>
              <span @click="toAllContent(5)">女宝宝爱看</span>
            </div>
          </div>
          <div class="allConFour">
            <img class = "allConBg4" :src="imgUrl+(commpageInfo.recommend_2&&commpageInfo.recommend_2[3]&&commpageInfo.recommend_2[3].recommendPic.picPath)" alt="">
            <div class = "allConTextDiv">
              <span @click="toAllContent(6)">早教启蒙</span>
              <span @click="toAllContent(7)">精彩国漫</span>
              <span @click="toAllContent(8)">热门推荐</span>
            </div>
          </div>
        </el-col>
    </el-row>
    <!-- 最新上线 -->
    <el-row class = "mainDown newUp rollPart">
        <el-row class = "mainDownBoxTitle">
          <el-col :span="24">
            <img class="rollPartTitleImg" v-if="(commpageInfo.recommend_3&&commpageInfo.recommend_3[0]&&commpageInfo.recommend_3[0].recommendPic)" :src="imgUrl+(commpageInfo.recommend_3&&commpageInfo.recommend_3[0]&&commpageInfo.recommend_3[0].recommendPic.picPath)" alt="">
            <span class="rollPartTitleText">{{commpageInfo.recommend_3&&commpageInfo.recommend_3[0]&&commpageInfo.recommend_3[0].more1}}</span>
          </el-col>
        </el-row>
        <el-col :span="24">
          <div class="rollPartDiv" v-for="rec3 in (commpageInfo.recommend_3&&commpageInfo.recommend_3.slice(1,9))" :key="rec3.id">
            <img @click="clickJump(rec3)" class="rollPartImg" :src="imgUrl+rec3.recommendPic.picPath" alt="">
            <div @click="clickJump(rec3)" class="rollPartTitle" :title="rec3.more1">{{ rec3.more1 }}</div>
          </div>
        </el-col>
    </el-row>
    <!-- 正在热播 -->
    <el-row class = "mainDown hotView fourPart">
        <el-row class = "mainDownBoxTitle">
          <el-col :span="24">
            <img class="fourPartTitleImg hotViewTitleImg" v-if="(commpageInfo.recommend_4&&commpageInfo.recommend_4[0].recommendPic)" :src="imgUrl+(commpageInfo.recommend_4&&commpageInfo.recommend_4[0].recommendPic.picPath)" alt="">
            <span class="fourPartTitleText">{{ (commpageInfo.recommend_4&&commpageInfo.recommend_4[0].more1) }}</span>
            <img class="fourPartTitleImg hotViewTitleImg" v-if="(commpageInfo.recommend_4&&commpageInfo.recommend_4[0].recommendLabelpic)" :src="imgUrl+(commpageInfo.recommend_4&&commpageInfo.recommend_4[0].recommendLabelpic.picPath)" alt="">
          </el-col>
        </el-row>
        <el-col :span="24">
          <div class="fourPartSingle" v-for="(rec4) in (commpageInfo.recommend_4&&commpageInfo.recommend_4.slice(1,5))" :key="rec4.id">
            <img @click="clickJump(rec4)" class="fourPartImg" :src="imgUrl+rec4.recommendPic.picPath" alt="">
            <div class="mainCartoonTitle" :title="rec4.recommendDisplayName">{{ rec4.recommendDisplayName }}</div>
            <div class="mainCartoonCon" :title="rec4.detailedDescription">{{ rec4.detailedDescription }}</div>
          </div>
        </el-col>
    </el-row>
    <!-- 精品动画 -->
    <el-row class = "mainDown boutiqueCar fourPart">
        <el-row class = "mainDownBoxTitle">
          <el-col :span="24">
            <img class="fourPartTitleImg boutiqueCarTitleImg" v-if="(commpageInfo.recommend_5&&commpageInfo.recommend_5[0].recommendPic)" :src="imgUrl+(commpageInfo.recommend_5&&commpageInfo.recommend_5[0].recommendPic.picPath)" alt="">
            <span class="fourPartTitleText">{{ commpageInfo.recommend_5&&commpageInfo.recommend_5[0].more1 }}</span>
            <img class="fourPartTitleImg boutiqueCarTitleImg" v-if="(commpageInfo.recommend_5&&commpageInfo.recommend_5[0].recommendLabelpic)" :src="imgUrl+(commpageInfo.recommend_5&&commpageInfo.recommend_5[0].recommendLabelpic.picPath)" alt="">
          </el-col>
        </el-row>
        <el-col :span="24">
          <div class="fourPartSingle" v-for="rec5 in (commpageInfo.recommend_5&&commpageInfo.recommend_5.slice(1,5))" :key="rec5.id">
            <img @click="clickJump(rec5)" class="fourPartImg" :src="imgUrl+rec5.recommendPic.picPath" alt="">
            <div class="mainCartoonTitle" :title="rec5.recommendDisplayName">{{ rec5.recommendDisplayName }}</div>
            <div class="mainCartoonCon" :title="rec5.detailedDescription">{{ rec5.detailedDescription }}</div>
          </div> 
        </el-col>
    </el-row>
    <el-row class = "mainDown onePart" v-if="(commpageInfo.recommend_6&&commpageInfo.recommend_6[1])">
      <el-col :span="24">
        <img class="onePartImg" @click="clickJump(commpageInfo.recommend_6[1])" :src="imgUrl+commpageInfo.recommend_6[1].recommendPic.picPath" alt="">
      </el-col>
    </el-row>
    <!-- 成长好时光 -->
    <el-row class = "mainDown growTime sixPart">
        <el-row class = "mainDownBoxTitle">
          <img class="sixPartTitleImg growTimeTitleImg" v-if="(commpageInfo.recommend_7&&commpageInfo.recommend_7[0].recommendPic)" :src="imgUrl+(commpageInfo.recommend_7&&commpageInfo.recommend_7[0].recommendPic.picPath)" alt="">
          <span class="sixPartTitleText">{{ commpageInfo.recommend_7&&commpageInfo.recommend_7[0].more1 }}</span>
          <img class="sixPartTitleImg growTimeTitleImg" v-if="(commpageInfo.recommend_7&&commpageInfo.recommend_7[0].recommendLabelpic)" :src="imgUrl+(commpageInfo.recommend_7&&commpageInfo.recommend_7[0].recommendLabelpic.picPath)" alt="">
        </el-row>
        <el-col :span="24">
          <div class="sixPartSingle" v-for="rec7 in (commpageInfo.recommend_7&&commpageInfo.recommend_7.slice(1,8))" :key="rec7.id">
            <img class="sixPartImg" @click="clickJump(rec7)" :src="imgUrl+rec7.recommendPic.picPath" alt="">
            <div class="mainCartoonTitle" :title="rec7.recommendDisplayName">{{ rec7.recommendDisplayName }}</div>
            <div class="mainCartoonCon" :title="rec7.detailedDescription">{{ rec7.detailedDescription }}</div>
          </div>
        </el-col>
    </el-row>
    <!-- 陪伴孩子快乐成长 -->
    <el-row class = "mainDown withChild fourPart">
        <el-row class = "mainDownBoxTitle">
          <el-col :span="24">
            <img class="fourPartTitleImg withChildTitleImg" v-if="(commpageInfo.recommend_8&&commpageInfo.recommend_8[0].recommendPic)" :src="imgUrl+(commpageInfo.recommend_8&&commpageInfo.recommend_8[0].recommendPic.picPath)" alt="">
            <span class="fourPartTitleText">{{ commpageInfo.recommend_8&&commpageInfo.recommend_8[0].more1 }}</span>
            <img class="fourPartTitleImg withChildTitleImg" v-if="(commpageInfo.recommend_8&&commpageInfo.recommend_8[0].recommendLabelpic)" :src="imgUrl+(commpageInfo.recommend_8&&commpageInfo.recommend_8[0].recommendLabelpic.picPath)" alt="">
          </el-col>
        </el-row>
        <el-col :span="24">
          <div class="fourPartSingle" v-for="rec8 in (commpageInfo.recommend_8&&commpageInfo.recommend_8.slice(1,5))" :key="rec8.id">
            <img @click="clickJump(rec8)" class="fourPartImg" :src="imgUrl+rec8.recommendPic.picPath" alt="">
            <div class="mainCartoonTitle" :title="rec8.recommendDisplayName">{{ rec8.recommendDisplayName }}</div>
            <div class="mainCartoonCon" :title="rec8.detailedDescription">{{ rec8.detailedDescription }}</div>
          </div>
        </el-col>
    </el-row>
    <!-- 可可爱爱小萌宠 -->
    <el-row class = "mainDown cutePet fourPart">
        <el-row class = "mainDownBoxTitle">
          <el-col :span="24">
            <img class="fourPartTitleImg cutePetTitleImg" v-if="(commpageInfo.recommend_9&&commpageInfo.recommend_9[0].recommendPic)" :src="imgUrl+(commpageInfo.recommend_9&&commpageInfo.recommend_9[0].recommendPic.picPath)" alt="">
            <span class="fourPartTitleText">{{ commpageInfo.recommend_9&&commpageInfo.recommend_9[0].more1 }}</span>
            <img class="fourPartTitleImg cutePetTitleImg" v-if="(commpageInfo.recommend_9&&commpageInfo.recommend_9[0].recommendLabelpic)" :src="imgUrl+(commpageInfo.recommend_9&&commpageInfo.recommend_9[0].recommendLabelpic.picPath)" alt="">
          </el-col>
        </el-row>
        <el-col :span="24">
          <div class="fourPartSingle" v-for="rec9 in (commpageInfo.recommend_9&&commpageInfo.recommend_9.slice(1,5))" :key="rec9.id">
            <img @click="clickJump(rec9)"  class="fourPartImg" :src="imgUrl+rec9.recommendPic.picPath" alt="">
            <div class="mainCartoonTitle" :title="rec9.recommendDisplayName">{{ rec9.recommendDisplayName }}</div>
            <div class="mainCartoonCon" :title="rec9.detailedDescription">{{ rec9.detailedDescription }}</div>
          </div>
        </el-col>
    </el-row>
    <el-row class = "mainDown twoPart" v-if="(commpageInfo.recommend_10&&commpageInfo.recommend_10[1]&&commpageInfo.recommend_10[2])">
      <el-col :span="24">
        <img class="twoPartImg" @click="clickJump(commpageInfo.recommend_10[1])" :src="imgUrl+commpageInfo.recommend_10[1].recommendPic.picPath" alt="">
        <img class="twoPartImg" @click="clickJump(commpageInfo.recommend_10[2])" :src="imgUrl+commpageInfo.recommend_10[2].recommendPic.picPath" alt="">
      </el-col>
    </el-row>
    <!-- 蛋计划系列 -->
    <el-row class = "mainDown eggSeries sixPart" v-if="commpageInfo.recommend_11">
        <el-row class = "mainDownBoxTitle">
         <el-col :span="24">
            <img class="sixPartTitleImg eggSeriesTitleImg" v-if="(commpageInfo.recommend_11[0]&&commpageInfo.recommend_11[0].recommendPic)" :src="imgUrl+(commpageInfo.recommend_11[0]&&commpageInfo.recommend_11[0].recommendPic.picPath)" alt="">
            <span class="sixPartTitleText">{{ commpageInfo.recommend_11[0].more1 }}</span>
            <img class="sixPartTitleImg eggSeriesTitleImg" v-if="(commpageInfo.recommend_11[0]&&commpageInfo.recommend_11[0].recommendLabelpic)" :src="imgUrl+(commpageInfo.recommend_11[0]&&commpageInfo.recommend_11[0].recommendLabelpic.picPath)" alt="">
          </el-col>
        </el-row>
        <el-col :span="24">
          <div class="sixPartSingle" v-for="rec11 in commpageInfo.recommend_11.slice(1,8)" :key="rec11.id">
            <img class="sixPartImg" @click="clickJump(rec11)" :src="imgUrl+rec11.recommendPic.picPath" alt="">
            <div class="mainCartoonTitle" :title="rec11.recommendDisplayName">{{ rec11.recommendDisplayName }}</div>
            <div class="mainCartoonCon" :title="rec11.detailedDescription">{{ rec11.detailedDescription }}</div>
          </div>
        </el-col>
    </el-row>
    <!-- 孩子的气质从现在开始培养 -->
    <el-row class = "mainDown buildQiZhi sixPart" v-if="commpageInfo.recommend_12">
        <el-row class = "mainDownBoxTitle">
          <el-col :span="24">
            <img class="sixPartTitleImg buildQiZhiTitleImg" v-if="(commpageInfo.recommend_12[0]&&commpageInfo.recommend_12[0].recommendPic)" :src="imgUrl+(commpageInfo.recommend_12[0]&&commpageInfo.recommend_12[0].recommendPic.picPath)" alt="">
            <span class="sixPartTitleText">{{ commpageInfo.recommend_12[0].more1 }}</span>
            <img class="sixPartTitleImg buildQiZhiTitleImg" v-if="(commpageInfo.recommend_12[0]&&commpageInfo.recommend_12[0].recommendLabelpic)" :src="imgUrl+(commpageInfo.recommend_12[0]&&commpageInfo.recommend_12[0].recommendLabelpic.picPath)" alt="">
          </el-col>
        </el-row>
        <el-col :span="24">
          <div class = "sixPartSingle" v-for="rec12 in commpageInfo.recommend_12.slice(1,8)" :key="rec12.id">
            <img class="sixPartImg" @click="clickJump(rec12)" :src="imgUrl+rec12.recommendPic.picPath" alt="">
            <div class="mainCartoonTitle" :title="rec12.recommendDisplayName">{{ rec12.recommendDisplayName }}</div>
            <div class="mainCartoonCon" :title="rec12.detailedDescription">{{ rec12.detailedDescription }}</div>
          </div>
        </el-col>
    </el-row>
    <!-- 欢乐多多 -->
    <el-row class = "mainDown happyALot sixPart" v-if="commpageInfo.recommend_13">
        <el-row class = "mainDownBoxTitle">
          <el-col :span="24">
            <img class="sixPartTitleImg happyALotTitleImg" v-if="(commpageInfo.recommend_13[0]&&commpageInfo.recommend_13[0].recommendPic)" :src="imgUrl+(commpageInfo.recommend_13[0]&&commpageInfo.recommend_13[0].recommendPic.picPath)" alt="">
            <span class="sixPartTitleText">{{ commpageInfo.recommend_13[0].more1 }}</span>
            <img class="sixPartTitleImg happyALotTitleImg" v-if="(commpageInfo.recommend_13[0]&&commpageInfo.recommend_13[0].recommendLabelpic)" :src="imgUrl+(commpageInfo.recommend_13[0]&&commpageInfo.recommend_13[0].recommendLabelpic.picPath)" alt="">
          </el-col>
        </el-row>
        <el-col :span="24">
          <div class = "sixPartSingle" v-for="rec13 in commpageInfo.recommend_13.slice(1,8)" :key="rec13.id">
            <img class="sixPartImg" @click="clickJump(rec13)" :src="imgUrl+rec13.recommendPic.picPath" alt="">
            <div class="mainCartoonTitle" :title="rec13.recommendDisplayName">{{ rec13.recommendDisplayName }}</div>
            <div class="mainCartoonCon" :title="rec13.detailedDescription">{{ rec13.detailedDescription }}</div>
          </div>
        </el-col>
    </el-row>
  </div>
</template>
<script>
export default{
  name: 'mainPage',
  componnents: {},
  data () {
    return {
      imgUrl: window.configs.pic_BASEURL,
      pageEName: 'mainPage_PC',
      commpageInfo: ''
    }
  },
  methods: {
    getCommPageInfo(ename){
      let _this = this;
      if(ename){
        this.pageEName = ename
      }
      this.$store.dispatch('getCommpageInfo',{contentName: this.pageEName}).then(res => {
        if(res && res.data && res.data.data){
          _this.commpageInfo = res.data.data;
        }
      });
    },
    clickJump(recJson){
      let cartoonId = recJson.recommendDisplayValue;
      this.$router.push({name: 'videoDetail',params: {cartoonId: cartoonId}});
    },
    toAllContent(typeI){
      var typeId = 1;
      switch(typeI){
        case 0:
          typeId = 13;
          break;
        case 1:
          typeId = 2;
          break;
        case 2:
          typeId = 3;
          break;
        case 3:
          typeId = 9;
          break;
        case 4:
          typeId = 6;
          break;
        case 5:
          typeId = 8;
          break;
        case 6:
          typeId = 7;
          break;
        case 7:
          typeId = 4;
          break;
        case 8:
          typeId = 5;
          break;
        default:
          typeId = 10;
          break;
      }
      this.$router.push({name: 'allContent',params: {typeId: typeId}});
    }
  },
  created() {
    this.getCommPageInfo();
  }
}
</script>
<style>
  .noTextSelect{
    width: 1920px;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
/* 栅格内容 */
  .el-row{
    margin: 0;
    padding: 0;
  }
  .mainDown{
    padding-left: 145px;
    padding-right: 145px;
    font-family: Source Han Sans CN;
  }
  .mainDown .mainCartoonTitle{
    height: 16px;
    line-height: 16px;
    margin-top: 14px;
    text-align: left;
    font-weight: 400;
    color: #111111;
    font-size: 16px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .mainDown .mainCartoonCon{
    height: 15px;
    line-height: 15px;
    margin-top: 14px;
    text-align: left;
    font-weight: 400;
    color: #999999;
    font-size: 15px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .mainDown .el-col{
    position: relative;
  }
  /* 走马灯 */
  .lunbo{
    width: 1920px;
    height: 470px;
  }
  .lunbo .el-carousel__container{
    width: 1920px;
    height: 470px;
  }
  .el-carousel__indicators--vertical{
    top: 0;
  }
  .el-carousel__indicators{
    width: 300px;
    height: 470px;
    left: 1474px;
    background: rgba(0, 0, 0, 0.5);
  }
  .el-carousel__indicators .is-active{
    background: rgba(78, 178, 255, 0.5);
  }
  .el-carousel__indicators--labels .el-carousel__indicator {
    padding: 0;
    width: 300px;
    height: 78.5px;
    line-height: 78.5px;
  }
  .el-carousel__indicator--vertical .el-carousel__button{
    width: 100%;
    height: 100%;
    background-color:rgba(0, 0, 0, 0);
  }
  .el-carousel__indicators--labels .el-carousel__button{
    width: 100%;
    height: 100%;
    background-color:rgba(0, 0, 0, 0);
  }
  .el-carousel__button{
    text-align: left;
  }
  .el-carousel__button span{
    color: #FFFFFF;
    font-size: 20px;
  }
  .lunboImg{
    width: 100%;
    height: 100%;
  }
  .allCon{
    width: 1920px;
    margin-top: 10px;
  }
  .allConTextDiv span{
    color: #FFFFFF;
    font-size: 18px;
    font-weight: 400;
    display:inline-block;
  }
  .allConTextDiv span:hover{
    color: #ffff6d;
  }
  .allCon .allConOne{
    width: 184px;
    height: 96px;
    float: left;
    position: relative;
    margin-top: 6px;
  }
  .allCon .allConOne .allConBg1{
    width: 184px;
    height: 96px;
  }
  .allCon .allConOne .allConTextDiv{
    width: 184px;
    height: 96px;
    position: absolute;
    top: 0;
    left: 0;
    text-align: center;
    line-height: 96px;
  }
  .allCon .allConOne .allConTextDiv span{
    margin-left: 45px;
  }
  .allCon .allConTwo{
    width: 452px;
    height: 103px;
    float: left;
    margin-left: 6px;
    position: relative;
  }
  .allCon .allConTwo .allConBg2{
    width: 452px;
    height: 103px;
  }
  .allCon .allConTwo .allConTextDiv{
    width: 452px;
    height: 103px;
    position: absolute;
    top: 0;
    left: 0;
    text-align: center;
    line-height: 120px;
  }
  .allCon .allConTwo .allConTextDiv span:nth-child(1){
    margin-left: 70px;
  }
  .allCon .allConTwo .allConTextDiv span:nth-child(2){
    margin-left: 45px;
  }
  .allCon .allConTwo .allConTextDiv span:nth-child(3){
    margin-left: 44px;
  }
  .allCon .allConThree{
    width: 446px;
    height: 97px;
    float: left;
    position: relative;
    margin-top: 5px;
    margin-left: 6px;
  }
  .allCon .allConThree .allConBg3{
    width: 446px;
    height: 97px;
  }
  .allCon .allConThree .allConTextDiv{
    width: 446px;
    height: 97px;
    position: absolute;
    top: 0;
    left: 0;
    text-align: center;
    line-height: 107px;
  }
  .allCon .allConThree .allConTextDiv span:nth-child(1){
    margin-left: 100px;
  }
  .allCon .allConThree .allConTextDiv span:nth-child(2){
    margin-left: 45px;
  }
  .allCon .allConFour{
    width: 528px;
    height: 97px;
    float: left;
    margin-top: 5px;
    margin-left: 6px;
    position: relative;
  }
  .allCon .allConFour .allConBg4{
    width: 528px;
    height: 97px;
  }
  .allCon .allConFour .allConTextDiv{
    width: 528px;
    height: 97px;
    position: absolute;
    top: 0;
    left: 0;
    text-align: center;
    line-height: 107px;
  }
  .allCon .allConFour .allConTextDiv span:nth-child(1){
    margin-left: 90px;
  }
  .allCon .allConFour .allConTextDiv span:nth-child(2){
    margin-left: 80px;
  }
  .allCon .allConFour .allConTextDiv span:nth-child(2){
    margin-left: 45px;
  }
  .allCon .allConFour .allConTextDiv span:nth-child(3){
    margin-left: 44px;
  }
  .rollPart{
    width: 1920px;
    margin-top: 50px;
  }
  .rollPart .mainDownBoxTitle{
    margin: 0;
  }
  .rollPart .rollPartTitleImg{
    width: 27px;
    height: 31px;
    float: left;
    margin-top: 11px;
  }
  .rollPart .rollPartTitleText{
    height: 100%;
    margin-left: 12px;
    margin-right: 12px;
  }
  .rollPart .rollPartDiv{
    width: 130px;
    height: 160px;
    float: left;
    margin-left: 70px;
    margin-top: 29px;
  }
  .rollPart .rollPartDiv .rollPartImg{
    width: 130px;
    height: 133px;
    transition-duration: .5s;
  }
  .rollPart .rollPartDiv .rollPartImg:hover{
    transform: scale(1.05, 1.05);
    -webkit-transform: scale(1.05, 1.05);
    -moz-transform: scale(1.05, 1.05);
    -o-transform: scale(1.05, 1.05);
  }
  .rollPart .rollPartDiv .rollPartTitle{
    height: 30px;
    font-size: 16px;
    font-weight: 400;
    color: #111111;
    line-height: 30px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    text-align: center;
  }
  .mainDownBoxTitle{
    height: 50px;
    margin-top: 40px;
    margin-bottom: 20px;
    text-align: left;
    font-size: 30px;
    font-weight: bold;
    color: #333333;
    line-height: 50px;
  }
  .fourPart{
    width: 1920px;
  }
  .fourPart .fourPartTitleImg{
    float: left;
  }
  .fourPart .fourPartTitleText{
    height: 100%;
    display: inline-block;
    float: left;
    margin-left: 12px;
    margin-right: 12px;
  }
  .fourPart .fourPartSingle{
    width: 392px;
    height: 270px;
    float: left;
    margin-left: 20px;
  }
  .fourPart .fourPartSingle:nth-child(1){
    margin-left: 0;
  }
  .fourPartImg{
    width: 392px;
    height: 210px;
    border-radius: 8px;
    transition-duration: .5s;
  }
  .fourPartImg:hover{
    transform: scale(1.05, 1.05);
    -webkit-transform: scale(1.05, 1.05);
    -moz-transform: scale(1.05, 1.05);
    -o-transform: scale(1.05, 1.05);
  }
  .onePart{
    width: 1920px;
    margin-top: 24px;
  }
  .onePart .onePartImg{
    width: 1630px;
    height: 120px;
    border-radius: 8px;
    transition-duration: .5s;
  }
  .onePart .onePartImg:hover{
    transform: scale(1.05, 1.05);
    -webkit-transform: scale(1.05, 1.05);
    -moz-transform: scale(1.05, 1.05);
    -o-transform: scale(1.05, 1.05);
  }
  .hotView .hotViewTitleImg{
    width: 29px;
    height: 27px;
    margin-top: 11px;
  }
  .boutiqueCar .boutiqueCarTitleImg{
    width: 34px;
    height: 27px;
    margin-top: 12px;
  }
  .withChild .withChildTitleImg{
    width: 25px;
    height: 27px;
    margin-top: 12px;
  }
  .sixPart{
    width: 1920px;
  }
  .sixPart .sixPartTitleImg{
    float: left;
  }
  .sixPart .sixPartTitleText{
    float: left;
    margin-left: 12px;
    margin-right: 12px;
  }
  .sixPart .sixPartSingle{
    float: left;
    width: 215px;
    height: 360px;
    margin-left: 20px;
  }
  .sixPart .sixPartSingle:nth-child(1){
    margin-left: 0;
  }
  .sixPart .sixPartSingle .sixPartImg{
    width: 215px;
    height: 299px;
    border-radius: 8px;
    transition-duration: .5s;
  }
  .sixPart .sixPartSingle .sixPartImg:hover{
    transform: scale(1.05, 1.05);
    -webkit-transform: scale(1.05, 1.05);
    -moz-transform: scale(1.05, 1.05);
    -o-transform: scale(1.05, 1.05);
  }
  .twoPart{
    width: 1920px;
    margin-top: 24px;
  }
  .twoPart .twoPartImg{
    width: 805px;
    height: 120px;
    float: left;
    border-radius: 8px;
    transition-duration: .5s;
  }
  .twoPart .twoPartImg:hover{
    transform: scale(1.02, 1.02);
    -webkit-transform: scale(1.02, 1.02);
    -moz-transform: scale(1.02, 1.02);
    -o-transform: scale(1.02, 1.02);
  }
  .twoPart .twoPartImg:nth-child(2){
    margin-left: 19px;
  }
  .growTime .growTimeTitleImg{
    width: 33px;
    height: 20px;
    margin-top: 18px;
  }
  .cutePet .cutePetTitleImg{
    width: 26px;
    height: 26px;
    margin-top: 12px;
  }
  .eggSeries .eggSeriesTitleImg{
    width: 25px;
    height: 31px;
    margin-top: 9px;
  }
  .buildQiZhi .buildQiZhiTitleImg{
    width: 28px;
    height: 32px;
    margin-top: 9px;
  }
  .happyALot .happyALotTitleImg{
    width: 22px;
    height: 28px;
    margin-top: 10px;
  }
</style>
