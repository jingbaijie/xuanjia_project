<template>
    <div class="home">
        <!--logo-->
        <div class="home-logoPack">
            <van-image class="home-logoPack-logo" :src="require('./../../images/logo.png')"/>
            <div class="home-logoPack-wcnjh">
                <van-image class="home-logoPack-wcnjh-Icon" :src="require('../../images/home/wcnjhIcon.png')"></van-image>
                <div class="home-logoPack-wcnjh-text" @click="toJuveniles"> 未成年人监护工程</div>
            </div>
        </div>
        <!--搜索-->
        <div class="home-searchPack">
           <!-- <van-search placeholder="蛋计划" shape="round" left-icon="" :right-icon="require('../../images/home/searchIcon.png')" v-model="val"  @search="toSearch" />-->
            <van-search
                    v-model="val"
                    left-icon=""
                    shape="round"
                    placeholder="蛋计划"
                    @search="toSearch"
            >
                <template #right-icon >
                    <van-image class="searchIcon" :src="require('../../images/home/searchIcon.png')"  @click="toSearch"></van-image>
                </template>
            </van-search>
            <van-image class="home-searchPack-histroyIcon" :src="require('../../images/home/historyIcon.png')" @click="toPersonal"></van-image>

            <van-image class="home-searchPack-userIcon" v-if="userIcon" @click="login" :src="userIcon"></van-image>
            <van-image v-else class="home-searchPack-userIcon" :src="require('../../images/home/userIcon.png')" @click="login"></van-image>
        </div>
        <!--幻灯片-->
        <swiper class="my-swipe" indicator-color="white" :options="swiperOptions" v-if="commonPageInfo.recommend_1.length">
            <swiper-slide v-for="recommend in commonPageInfo.recommend_1" :key="recommend.id">
                <van-image :lazy-load="false" :show-loading="false" class="my-swipe-slide" :src="formatPic(recommend.recommendPic.picPath)"  @click="onClickRec(recommend.recommendDisplayType,recommend.recommendDisplayValue)" />
            </swiper-slide>
        </swiper>
        <!--分类-->
        <van-tabs line-width="0" line-height="0"  @click="tabClick">
            <van-tab
                    v-for="(item, index) in tabData"
                    :name="item.id"
                    :title="item.typeCname"
                    :key="index"
            />
        </van-tabs>
        <!--卡通人物-->
        <div class="home-carT">
            <div v-for="recommend in commonPageInfo.recommend_2.slice(0, 5)" :key="recommend.id" class="home-carT-carTList">
                <van-image class="home-carT-img" :src="formatPic(recommend.recommendPic.picPath)"  @click="onClickRec(recommend.recommendDisplayType,recommend.recommendDisplayValue)"></van-image>
                <div class="home-carT-title">{{recommend.recommendPic.picCname}}</div>
            </div>
        </div>

        <!--分割-->
        <div class="splitLine"></div>
        <!--正在热播-->
        <div class="home-rec" v-if="commonPageInfo.recommend_3.length">
            <div class="home-rec-title">
                <van-image class="home-rec-title-img" :src="formatPic(commonPageInfo.recommend_3[0].recommendPic.picPath)"></van-image>
                <div class="home-rec-title-name">{{commonPageInfo.recommend_3[0].more1}}</div>
                <van-image class="home-rec-title-heat" :src="formatPic(commonPageInfo.recommend_3[0].recommendLabelpic.picPath)"></van-image>
            </div>
            <div class="home-rec-contentPack">
                <div class="home-rec-contentPack-each" v-for="recommend in commonPageInfo.recommend_3.slice(1)" :key="recommend.id">
                    <van-image class="home-rec-contentPack-each-img" :src="formatPic(recommend.recommendPic.picPath)" @click="onClickRec(recommend.recommendDisplayType,recommend.recommendDisplayValue)"></van-image>
                    <div class="home-rec-contentPack-each-name">{{recommend.recommendDisplayName}}</div>
                    <div class="home-rec-contentPack-each-desc">{{recommend.detailedDescription}}</div>
                </div>

            </div>
        </div>
        <!--分割-->
        <div class="splitLine"></div>
        <!--精品动画-->
        <div class="home-rec" v-if="commonPageInfo.recommend_4.length">
            <div class="home-rec-title">
                <van-image class="home-rec-title-img" :src="formatPic(commonPageInfo.recommend_4[0].recommendPic.picPath)"></van-image>
                <div class="home-rec-title-name">{{commonPageInfo.recommend_4[0].more1}}</div>
            </div>
            <div class="home-rec-jpdh">
                <div class="home-rec-jpdh-each" v-for="recommend in commonPageInfo.recommend_4.slice(1)" :key="recommend.id">
                    <van-image class="home-rec-jpdh-each-img" :src="formatPic(recommend.recommendPic.picPath)" @click="onClickRec(recommend.recommendDisplayType,recommend.recommendDisplayValue)"></van-image>
                    <div class="home-rec-jpdh-each-name">{{recommend.recommendDisplayName}}</div>
                    <div class="home-rec-jpdh-each-desc">{{recommend.detailedDescription}}</div>
                </div>

            </div>
        </div>
        <!--分割-->
        <div class="splitLine"></div>
        <!--[自制]陪伴孩子快乐成长-->
        <div class="home-rec" v-if="commonPageInfo.recommend_5.length">
            <div class="home-rec-title">
                <van-image class="home-rec-title-img" :src="formatPic(commonPageInfo.recommend_5[0].recommendPic.picPath)"></van-image>
                <div class="home-rec-title-name">{{commonPageInfo.recommend_5[0].more1}}</div>
            </div>
            <div class="home-rec-contentPack">
                <div class="home-rec-contentPack-each" v-for="recommend in commonPageInfo.recommend_5.slice(1)" :key="recommend.id">
                    <van-image class="home-rec-contentPack-each-img" :src="formatPic(recommend.recommendPic.picPath)" @click="onClickRec(recommend.recommendDisplayType,recommend.recommendDisplayValue)"></van-image>
                    <div class="home-rec-contentPack-each-name">{{recommend.recommendDisplayName}}</div>
                    <div class="home-rec-contentPack-each-desc">{{recommend.detailedDescription}}</div>
                </div>

            </div>
        </div>
        <!--分割-->
        <div class="splitLine"></div>
        <!--[益智早教]成长好时光-->
        <div class="home-rec" v-if="commonPageInfo.recommend_6.length">
            <div class="home-rec-title">
                <van-image class="home-rec-title-img" :src="formatPic(commonPageInfo.recommend_6[0].recommendPic.picPath)"></van-image>
                <div class="home-rec-title-name">{{commonPageInfo.recommend_6[0].more1}}</div>
            </div>
            <div class="home-rec-jpdh">
                <div class="home-rec-jpdh-each" v-for="recommend in commonPageInfo.recommend_6.slice(1)" :key="recommend.id">
                    <van-image class="home-rec-jpdh-each-img" :src="formatPic(recommend.recommendPic.picPath)" @click="onClickRec(recommend.recommendDisplayType,recommend.recommendDisplayValue)"></van-image>
                    <div class="home-rec-jpdh-each-name">{{recommend.recommendDisplayName}}</div>
                    <div class="home-rec-jpdh-each-desc">{{recommend.detailedDescription}}</div>
                </div>

            </div>
            <!--广告-->
            <div class="home-rec-poster"  v-if="commonPageInfo.recommend_7.length">
                <van-image class="home-rec-poster-img" :src="formatPic(commonPageInfo.recommend_7[1].recommendPic.picPath)" @click="onClickRec(commonPageInfo.recommend_7[1].recommendDisplayType,commonPageInfo.recommend_7[1].recommendDisplayValue)"></van-image>
            </div>
        </div>
        <!--分割-->
        <div class="splitLine"></div>
        <!--可可爱爱小萌宠-->
        <div class="home-rec" v-if="commonPageInfo.recommend_8.length">
            <div class="home-rec-title">
                <van-image class="home-rec-title-img" :src="formatPic(commonPageInfo.recommend_8[0].recommendPic.picPath)"></van-image>
                <div class="home-rec-title-name">{{commonPageInfo.recommend_8[0].more1}}</div>
            </div>
            <div class="home-rec-contentPack">
                <div class="home-rec-contentPack-each" v-for="recommend in commonPageInfo.recommend_8.slice(1)" :key="recommend.id">
                    <van-image class="home-rec-contentPack-each-img" :src="formatPic(recommend.recommendPic.picPath)" @click="onClickRec(recommend.recommendDisplayType,recommend.recommendDisplayValue)"></van-image>
                    <div class="home-rec-contentPack-each-name">{{recommend.recommendDisplayName}}</div>
                    <div class="home-rec-contentPack-each-desc">{{recommend.detailedDescription}}</div>
                </div>

            </div>
        </div>
        <!--分割-->
        <div class="splitLine"></div>
        <!--[芭蕾]孩子的气质从现在培养-->
        <div class="home-rec" v-if="commonPageInfo.recommend_9.length">
            <div class="home-rec-title">
                <van-image class="home-rec-title-img" :src="formatPic(commonPageInfo.recommend_9[0].recommendPic.picPath)"></van-image>
                <div class="home-rec-title-name">{{commonPageInfo.recommend_9[0].more1}}</div>
            </div>
            <div class="home-rec-jpdh">
                <div class="home-rec-jpdh-each" v-for="recommend in commonPageInfo.recommend_9.slice(1)" :key="recommend.id">
                    <van-image class="home-rec-jpdh-each-img" :src="formatPic(recommend.recommendPic.picPath)" @click="onClickRec(recommend.recommendDisplayType,recommend.recommendDisplayValue)"></van-image>
                    <div class="home-rec-jpdh-each-name">{{recommend.recommendDisplayName}}</div>
                    <div class="home-rec-jpdh-each-desc">{{recommend.detailedDescription}}</div>
                </div>

            </div>
        </div>
        <!--分割-->
        <div class="splitLine"></div>
        <!--[专区]蛋计划系列-->
        <div class="home-rec" v-if="commonPageInfo.recommend_10.length">
            <div class="home-rec-title">
                <van-image class="home-rec-title-img" :src="formatPic(commonPageInfo.recommend_10[0].recommendPic.picPath)"></van-image>
                <div class="home-rec-title-name">{{commonPageInfo.recommend_10[0].more1}}</div>
            </div>
            <div class="home-rec-jpdh">
                <div class="home-rec-jpdh-each" v-for="recommend in commonPageInfo.recommend_10.slice(1)" :key="recommend.id">
                    <van-image class="home-rec-jpdh-each-img" :src="formatPic(recommend.recommendPic.picPath)" @click="onClickRec(recommend.recommendDisplayType,recommend.recommendDisplayValue)"></van-image>
                    <div class="home-rec-jpdh-each-name">{{recommend.recommendDisplayName}}</div>
                    <div class="home-rec-jpdh-each-desc">{{recommend.detailedDescription}}</div>
                </div>

            </div>
        </div>
        <!--底部-->
        <foot></foot>

    </div>

</template>

<script>
    import { Image,Search,Tab, Tabs  } from 'vant';
    import { Swiper as SwiperClass, Autoplay } from 'swiper'
    import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter'
    import foot from '../components/foot';
    import {getCommonPageInfo} from "@/api/api";
    import pic from '@/api/pic';
    import Cookie from "js-cookie";
    import {getTypesByParentId} from "../../api/api";
    SwiperClass.use([Autoplay]);
    const { Swiper, SwiperSlide } = getAwesomeSwiper(SwiperClass)

    export default {
        components: {
            [Image.name]: Image,
            [Search.name]: Search ,
            [Tab.name]: Tab,
            [Tabs.name]: Tabs,
            Swiper,
            SwiperSlide,
            foot,
        },
        data() {
            return {
                swiperOptions: {
                    slidesPerView: 'auto',
                    centeredSlides: true,
                    loop: true,
                    autoplay: {
                        delay: 5000,
                        disableOnInteraction: false
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true
                    }
                },
                commonPageInfo:{
                    recommend_1: [],
                    recommend_2: [],
                    recommend_3: [],
                    recommend_4: [],
                    recommend_5: [],
                    recommend_6: [],
                    recommend_7: [],
                    recommend_8: [],
                    recommend_9: [],
                    recommend_10: [],
                },
                tabData:[],
                val:"",
                userIcon : "",
                userId : "",
            }
        },
        mounted() {
            this.getCommonPageInfo();
            this.getTypes();
            this.userIcon = Cookie.get('userIcon') || "";
        },
        methods: {
            /*通用页面信息*/
            getCommonPageInfo(){
                getCommonPageInfo({
                    contentName:'mainPage_phone',
                    contentId:'',
                    isRecommend:''
                }).then(res => {
                    window.console.log(res.data.data);
                    if(res.data){
                        this.commonPageInfo = res.data.data;
                    }
                })

            },
            /*图片地址*/
            formatPic(url) {
                return pic.formatPic(url);
            },
            /*幻灯片跳转卡通详情*/
            onClickRec(type,id){
                console.log(type + id);
                this.$router.push('/videoDetails?cartoonId=' + id +'&videoNumber=01');
            },
            /*全部分类ID*/
            getTypes() {
                getTypesByParentId({
                    parentId: 1,
                })
                    .then((res) => {
                        if(res.data.errorCode == 1000){
                            this.tabData = res.data.data;
                        }
                    })
                    .catch((error) => {
                        window.console.log(error);
                    });
            },
            tabClick(id) {
                this.$router.push({path:'contentAll',query: {'typeId':id}});
            },
            /*搜索*/
            toSearch(){
                this.$router.push({
                    path: "/search",
                    query: {val:this.val }
                });
            },
            /*已登录播放记录*/
            toPersonal(){
                if(this.userIcon != ""){
                    /*this.$router.push("/personalCenter?active=0");*/
                    this.$router.push({
                        name: 'personalCenter', params:{active: 0}
                    });
                }else {
                    this.$router.push("/login");
                }
            },
            /*未登录跳登录 已登录跳个人中心*/
            login(){
                if(this.userIcon != ""){
                    /*this.$router.push("/personalCenter?active=1");*/
                    this.$router.push({
                        name: 'personalCenter', params:{active: 1}
                    });
                }else {
                    this.$router.push("/login");
                }

            },
            /*未成年监护*/
            toJuveniles(){
                this.$router.push("/juveniles");
            }


        }
    };
</script>

<style lang="less">

    html{
        background-color: #ffffff;
    }
    .van-tab{
        font-size: 30px;
        font-weight: 400;
    }
    .van-tab--active {
        font-size: 36px;
        font-weight: bold;
    }
    .splitLine{
        width: 100%;
        height: 8px;
        background-color: #E5E5E5FF;
    }
    .searchIcon{
        width: 28px;
        height: 28px;
    }
    /*图片*/
    .van-image__img{
        border-radius: 5px;
    }
    .home{
        width: 100%;
        background-color: #ffffff;
        /*logo*/
        &-logoPack{
            display: flex;
            justify-content: space-between;
            margin: 20px 31px 14px 31px;
            &-logo{
                width: 154px;
                height: 74px;
            }
            &-wcnjh{
                display: flex;
                align-items: center;
                &-Icon{
                    width: 26px;
                    height: 23px;
                }
                &-text{
                    font-size: 24px;
                    color: #999999FF;
                    margin-left: 2px;
                }
            }
        }
        /*搜索*/
        &-searchPack{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-left: 30px;
            padding-right: 30px;
            .van-search{
                width: 578px;
                padding: 0px;
            }
            &-histroyIcon{
                width: 31px;
                height: 31px;
            }
            &-userIcon{
                width: 26px;
                height: 30px;
            }

        }

        /*幻灯片*/
        .swiper-slide {
            width: 85%;
            box-sizing: border-box;
            padding-top: 35px;
        }
        .my-swipe-slide img{
            border-radius: 0.2rem;
            transform-origin: 50% 50%;
            transition: all 500ms;
            transform: scale(0.9);
        }
        .swiper-slide-active .my-swipe-slide img{
            transform: scale(1);
        }

        /*卡通*/
        &-carT{
            display: flex;
            justify-content: center;
            padding-top: 10px;
            padding-bottom: 30px;
            &-carTList{
                margin: 0px 20px;
            }
            &-img{
                width: 96px;
                height: 96px;
            }
            &-title{
                width: 100px;
                font-size: 20px;
                font-weight: 400;
                color: #333333;
                line-height: 40px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                text-align: center;
            }
        }
        /*推荐类型列表*/
        &-rec{
            padding: 0px 30px;
            &-title{
                padding: 30px 0px;
                display: flex;
                align-items: center;
                &-img{
                    width: 8px;
                    height: 30px;
                }
                &-name{
                    font-size: 30px;
                    font-weight: 500;
                    color: #333333FF;
                    line-height: 32px;
                    padding-left: 30px;
                }
                &-heat{
                    width: 35px;
                    height: 30px;
                    margin-left: 3px;
                    margin-bottom: 25px;
                }
            }
            /*正在热播 横图*/
            &-contentPack{
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                &-each{
                    margin: 1px;
                    &-img{
                        width: 336px;
                        height: 180px;
                    }
                    &-name{
                        width: 310px;
                        font-size: 24px;
                        font-weight: 400;
                        color: #333333;
                        height: 50px;
                        line-height: 50px;
                        overflow:hidden;
                        text-overflow:ellipsis;
                        white-space:nowrap;
                    }
                    &-desc{
                        width: 240px;
                        font-family: Source Han Sans CN;
                        font-size: 22px;
                        font-weight: 400;
                        color: #999999;
                        height: 50px;
                        line-height: 30px;
                        overflow:hidden;
                        text-overflow:ellipsis;
                        white-space:nowrap;
                    }
                }
            }
            /*精品动画 竖图*/
            &-jpdh{
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                &-each{
                    margin: 1px;
                    &-img{
                        width: 215px;
                        height: 299px;
                    }
                    &-name{
                        width: 190px;
                        font-size: 24px;
                        font-weight: 400;
                        color: #333333;
                        height: 50px;
                        line-height: 50px;
                        overflow:hidden;
                        text-overflow:ellipsis;
                        white-space:nowrap;
                    }
                    &-desc{
                        width: 197px;
                        font-family: Source Han Sans CN;
                        font-size: 22px;
                        font-weight: 400;
                        color: #999999;
                        height: 50px;
                        line-height: 30px;
                        overflow:hidden;
                        text-overflow:ellipsis;
                        white-space:nowrap;
                    }
                }

            }
            /*广告*/
            &-poster{
                padding: 30px 0px;
                &-img{
                    width: 690px;
                    height: 110px;
                    img{
                        border-radius: 8px;
                    }
                }

            }
        }

    }

</style>