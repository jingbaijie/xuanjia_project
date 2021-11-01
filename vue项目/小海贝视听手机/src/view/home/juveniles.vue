<template>
    <div class="juvenilesPage">
        <!--头部-->
        <Header @searchData="onSearchData" @getContents="toSearch" placeholder="请输入关键字"></Header>
        <!--内容-->
        <van-image class="juvenilesPage-img" :src="require('./../../images/home/juveniles.png')"/>
        <div class="juvenilesPage-content">
            <div class="juvenilesPage-content-title" >实行未成年人防沉迷措施依据：</div>
            <div class="juvenilesPage-content-desc">
                1、根据2010年8月1日实施的《网络游戏管理暂行办法》，网络游戏用户需使用有效身份证件进行实名注册。为保证流畅游戏体验，享受健康游戏生活，请广大炫佳  游戏的玩家尽快实名注册。
                2、“网络游戏未成年人家长监护工程” 是一项由文化部指导，网络游戏企业自主发起并参与实施，旨在加强家长对未成年人参与网络游戏的监护，引导未成年人健康、绿色参与网络游戏，构建和谐家庭关系的行业自律行动。 它提供了一种切实可行的方法，一种家长实施监控的管道，使家长纠正部分未成年子女沉迷游戏的行为成为可能。该项社会公益行动充分反映了中国网络游戏行业高度的社会责任感，对未成年玩家合法权益的关注及对用实际行动营造和谐社会的愿望。
                3、“家长监护机制”是炫佳游戏在这一公益行动中，针对目前未成年人缺乏自控及自律能力，容易陷入沉迷；少数监护人缺少时间照顾孩子，不能及时监督孩子游戏时间的现状，而推出的一种可由家长实施监控，纠正部分未成年子女沉迷游戏的保护机制。
                4、保护未成年人身心健康，未满18岁的用户将受到防沉迷系统的限制： 游戏过程，会提示您的累计在线时间。 累计游戏时间超过3小时，游戏收益（经验，金钱）减半。 累计游戏时间超过5小时，游戏收益为0。
            </div>
            <div class="juvenilesPage-content-title">供申请监护方式：</div>
            <div class="juvenilesPage-content-desc">
                A.屏蔽账号：根据监护人意愿屏蔽相关游戏应用登陆。
                B.与客服人员协商解决等多种方式。
            </div>
            <div class="juvenilesPage-content-title">其他要求：</div>
            <div class="juvenilesPage-content-desc">
                1.申请人应提交较完备的申请材料，对未提供的信息要及时补充；可请熟知电脑、互联网、游戏的人员进行协助，以便提供详实资料；
                2.申请人应保证提交的信息真实有效；对于提供虚假信息或伪造证件，我司将保留进一步追究法律责任的权利。
            </div>
        </div>
    </div>

</template>

<script>
    import Header from "../components/header";
    import { Image} from 'vant';
    import {getSearchContents} from "../../api/api";

    export default {
        components:{
            Header,
            [Image.name]: Image,
        },
        data(){
            return{
                val:""
            }
        },
        methods:{
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
        }
    }
</script>
<style lang="less">
    .juvenilesPage{
        &-content{
            padding: 0px 30px 30px 30px;
            &-title{
                font-size: 26px;
                font-weight: bold;
                color: #333333;
                line-height: 46px;
                padding-top: 30px;
            }
            &-desc{
                font-size: 25px;
                color: #666666;
                line-height: 36px;
            }

        }
    }

</style>
