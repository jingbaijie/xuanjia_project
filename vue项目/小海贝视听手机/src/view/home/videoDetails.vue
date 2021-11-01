<template>
    <div class="videoPage">
        <!--公共头部-->
        <Header @searchData="onSearchData" @getContents="toSearch"></Header>
        <!--视频-->
        <div class="videoPage-info" >

            <!--<video id="my-player" controls v-if="videoInfo.length > 0" >
                <source :src="videoInfo[0].movieDetails[0].playUrl" type="video/mp4">
            </video>-->
            <video-player  class="video-player vjs-custom-skin"
                           ref="videoPlayer"
                           :playsinline="true"
                           :options="playerOptions"

            ></video-player>
            <div class="videoPage-info-name">
                <div class="videoPage-info-name-title" >{{cartoonDetail.cartoonCname}}</div>
                <div class="videoPage-info-name-desc" @click="showSummary">简介></div>
            </div>
            <div class="videoPage-info-key" v-for="(item, index) in cartoonDetail.tagInfoList" :key="index">
                <template v-if="index != 0"> · </template>
                {{item.typeCname }}
            </div>
            <div class="videoPage-info-introduction" v-show="summaryShown">
                <span>{{cartoonDetail.cartoonIntroduction}}</span>
                <span class="videoPage-info-introduction-retract" @click="hideSummary">[收起]</span>
            </div>
        </div>

        <!--选集-->
 <!--       <div class="videoPage-setNum" v-if="videoList.length <= 10">
            <div class="videoPage-setNum-list" v-for="(video, index) in videoList" :key="video.id" @click="toVideoDetails(video.cartoonId,video.videoNumber)">{{index + 1}}</div>
        </div>
        <div class="videoPage-setNum" v-else>
            <div class="videoPage-setNum-list" v-for="(video, index) in videoList.slice(0, 9)" :key="index" @click="toVideoDetails(video.cartoonId,video.videoNumber)">{{index + 1}}</div>
            <div class="videoPage-setNum-list" @click="show = true">...</div>
        </div>

        <van-action-sheet v-model="show" :title="cartoonDetail.cartoonCname">
            <div class="videoPage-setNum">
                <div class="videoPage-setNum-list" v-for="(video, index) in videoList" :key="index" @click="toVideoDetails(video.cartoonId,video.videoNumber)">{{ index + 1}}</div>
            </div>
        </van-action-sheet>-->
        <van-tabs line-width="0" line-height="0" title-active-color="#00BBBF" color="#ffffff"  @click="selectNumber" v-model="videoNumber" >
            <van-tab class="videoPage-setNum-list" v-for="(video, index) in videoList" :key="index"  :title="(index + 1)+''" :name="index" >
            </van-tab>
        </van-tabs>

        <!--分割线-->
        <div class="splitLine"><div class="splitLine-line"></div></div>
        <!--正在热播-->
        <div class="videoPage-rec" v-if="commonPageInfo.recommend_1.length">
            <div class="videoPage-rec-title">
                <van-image class="videoPage-rec-title-img" :src="formatPic(commonPageInfo.recommend_1[0].recommendPic.picPath)"></van-image>
                <div class="videoPage-rec-title-name">{{commonPageInfo.recommend_1[0].more1}}</div>
            </div>
            <div class="videoPage-rec-contentPack">
                <div class="videoPage-rec-contentPack-each" v-for="recommend in commonPageInfo.recommend_1.slice(1)" :key="recommend.id">
                    <van-image class="videoPage-rec-contentPack-each-img" :src="formatPic(recommend.recommendPic.picPath)" @click="onClickRec(recommend.recommendDisplayValue,'01')"></van-image>
                    <div class="videoPage-rec-contentPack-each-name">{{recommend.recommendDisplayName}}</div>
                    <div class="videoPage-rec-contentPack-each-desc">{{recommend.detailedDescription}}</div>
                </div>

            </div>
        </div>

        <!--底部-->
        <foot></foot>
    </div>
</template>

<script>
    import { Row,ActionSheet} from 'vant';
    import Header from "../components/header";
    import foot from "../components/foot";
    import pic from '@/api/pic';
    import {getSearchContents,getCommonPageInfo,getVideoList,getCartoonDetail,setInsert} from "../../api/api";
    import { videoPlayer } from 'vue-video-player';
    import Cookie from "js-cookie";



    export default {
        components: {
            Header,
            [Row.name]: Row,
            [ActionSheet.name]: ActionSheet,
            foot,
            videoPlayer,
        },
        data() {
            return {
                summaryShown: false, //是否显示简介,默认不显示
                commonPageInfo:{
                    recommend_1:[],
                },
                videoInfo: {},
                videoList:[],
                cartoonDetail: {},
                show:false,
                actions: [{ name: '选项一' }, { name: '选项二' }, { name: '选项三' }],
                val: "",
                videoNumber:0,
                playerOptions : {
                    playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                    autoplay: true, //如果true,浏览器准备好时开始回放。
                    muted: false, // 默认情况下将会消除任何音频。
                    loop: false, // 导致视频一结束就重新开始。
                    preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                    language: 'zh-CN',
                    aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                    fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                    sources: [{
                        type: "video/mp4",
                        src:"http://112.25.69.62:8092/video/xhbjbhrcwpxl/xhbjbhrcwpxl01.mp4",
                    }],
                    poster: "http://192.168.2.251:18080/pic/main/20210903/20210903013355227_deh93.png",
                    //width: document.documentElement.clientWidth, //播放器宽度
                    notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                    controlBar: {
                        currentTimeDisplay: true,
                        timeDivider: true,
                        durationDisplay: true,
                        remainingTimeDisplay: true,
                        fullscreenToggle: true  //全屏按钮
                    }
                }
            }
        },
        mounted() {
            this.getCommonPageInfo();
            this.getVideoInfo();
            this.getVideoList();
            this.getCartoonDetail();
            this.videoNumber = this.$route.query.videoNumber -1;
        },
        methods: {
            /*显示简介*/
            showSummary() {
                this.summaryShown = true;
            },
            /*隐藏简介*/
            hideSummary() {
                this.summaryShown = false;
            },
            /*集数列表*/
            onSelect(item){
                this.show = false;
                Toast(item.name);
            },

            /*搜索框文字变化的事件*/
            onSearchData(val) {
                this.val = val;
            },
            toSearch(){
                this.$router.push({
                    path: "/search",
                    query: { "val": this.val },
                });
            },
            /*图片地址*/
            formatPic(url) {
                return pic.formatPic(url);
            },
            /*通用页面信息*/
            getCommonPageInfo(){
                getCommonPageInfo({
                    contentName:'cartoonDetail_Phone',
                    contentId:'',
                    isRecommend:''
                }).then(res => {
                    if(res.data){
                        this.commonPageInfo = res.data.data;
                    }
                })

            },
            /*视频列表*/
            getVideoInfo(cartoonId,videoNumber){
                getVideoList({
                    cartoonId:cartoonId || this.$route.query.cartoonId,
                    videoNumber:videoNumber || this.$route.query.videoNumber
                }).then(res => {
                    if(res.data){
                        this.videoInfo = res.data.data;
                        this.playerOptions['sources'][0]['src'] = this.videoInfo[0].movieDetails[0].playUrl;
                        //this.playerOptions.sources[0].src = this.videoInfo[0].movieDetails[0].playUrl;
                        this.setInsert(this.videoInfo[0].cartoonId,this.videoInfo[0].id);

                    }
                })
            },
            /*视频列表*/
            getVideoList(cartoonId){
                getVideoList({
                    cartoonId:cartoonId || this.$route.query.cartoonId
                }).then(res => {
                    if(res.data){
                        this.videoList = res.data.data;

                    }
                })
            },
            /*卡通详情*/
            getCartoonDetail(cartoonId){
                getCartoonDetail({
                    id:cartoonId || this.$route.query.cartoonId,
                }).then(res => {
                    if(res.data){
                        this.cartoonDetail = res.data.data;

                    }
                })
            },
            /*选集*/
            toVideoDetails(cartoonId,videoNumber){
                this.getVideoInfo(cartoonId,videoNumber);
            },
            /*播放推荐片单*/
            onClickRec(cartoonId,videoNumber){
                this.getVideoInfo(cartoonId,videoNumber);
                this.getVideoList(cartoonId);
                this.getCartoonDetail(cartoonId);
            },
            /*存播放记录*/
            setInsert(cartoonId,videoId){
                setInsert({
                    userId:Cookie.get('userId'),
                    contentId:cartoonId || this.$route.query.cartoonId,
                    contentType:1,
                    playType:0,
                    videoId:videoId,
                }).then(res => {
                    if(res.data){

                    }
                })

            },
            /*选中集数*/
            selectNumber(index){
                this.toVideoDetails(this.videoList[index].cartoonId,this.videoList[index].videoNumber)
            }
        }
    };
</script>

<style lang="less">
    .videoPage .vjs-control-bar{
        font-size: 30px;
    }
    .videoPage .van-tab{
        width: 116px;
        height: 113px;
        line-height: 113px;
        text-align: center;
        background: #F5F5F5;
        margin-top: 30px;
        margin-right: 0.3rem;
    }
    .videoPage .van-tabs--line .van-tabs__wrap {
        height: 200px;
    }
    .videoPage .video-js .vjs-icon-placeholder {
        width: 100%;
        height: 100%;
        display: block;
    }
    .videoPage .video-js .vjs-big-play-button {
        line-height: 70px;
        height: 70px;
        top: 160px;
        left: 330px;
    }

    .videoPage{
        width: 100%;
        background-color: #ffffff;
        /*视频详情*/
        &-info{
            width: 750px;
            margin-top: 89px;
            video{
                width: 750px;
                height: 340px;
            }
            &-name{
                display: flex;
                justify-content: space-between;
                padding: 40px 30px 20px 30px;

                &-title{
                    width: 700px;
                    font-size: 36px;
                    font-weight: 500;
                    color: #333333;
                    line-height: 48px;
                    overflow: hidden;
                    overflow:hidden;
                    text-overflow:ellipsis;
                    white-space:nowrap;
                }
                &-desc{
                    width: 80px;
                    font-size: 24px;
                    font-weight: 400;
                    color: #999999;
                    line-height: 48px;
                }

            }
            &-key{
                width: 345px;
                height: 48px;
                font-size: 24px;
                font-weight: 400;
                color: #999999;
                line-height: 48px;
                padding-left: 30px;
            }
            &-introduction{
                position: fixed;
                top: 600px;
                bottom: 0;
                width: 100%;
                background-color: #fff;
                padding-left: 30px;
                z-index: 200;
                &-retract{
                    padding-left: 20px;
                    color: #999999;
                }
            }

        }
        /*选集*/
        &-setNum{
            display: flex;
            flex-wrap: wrap;
            margin: 0px 0px 30px 30px;
            &-list{
                width: 116px;
                height: 113px;
                line-height: 113px;
                text-align: center;
                background: #F5F5F5;
                margin-top: 30px;
                margin-right: 0.3rem;

            }
        }

        /*正在热播*/
        &-rec {
            padding: 0px 30px;

            &-title {
                padding: 30px 0px;
                display: flex;
                align-items: center;

                &-img {
                    width: 8px;
                    height: 30px;
                }

                &-name {
                    font-size: 30px;
                    font-weight: 500;
                    color: #333333FF;
                    line-height: 32px;
                    padding-left: 30px;
                }

                &-heat {
                    width: 35px;
                    height: 30px;
                    margin-left: 3px;
                    margin-bottom: 25px;
                }
            }

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
        }

    }
    /*集数列表内容*/
    .content {
        padding: 16px 16px 160px;
    }
    .van-popup{
        height: 809px;
    }
    .van-action-sheet__header{
        text-align: left;
        padding-left: 30px;
    }
    /*分割线*/
    .splitLine{
        width: 100%;
        display: flex;
        justify-content: center;

        &-line{
            width: 690px;
            height: 1px;
            background: #EEEEEE;
        }
    }


</style>
