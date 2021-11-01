<!--
 * @Author: your name
 * @Date: 2021-09-01 17:59:11
 * @LastEditTime: 2021-09-07 16:46:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tvjoy-web\src\components\search\searchItem.vue
-->
<template>
    <div class="itemCard">
        <img class="leftPic" :src="searchData.contentPic" alt="">
        <div class="rightCard">
            <h3 class="cartoonName">{{searchData.contentName}}</h3>
            <el-tag type="info" v-for="(item,index) in searchData.tagCname" :key="index">{{item.typeCname}}</el-tag>
            <p class="description">{{searchData.detailedDescription}}</p>
            <anthology :curIndex="preIndex" :smallNum='searchData.cartoonSumvideonum' :searchCartoonId="searchData.contentId"></anthology>
        </div>
    </div>
</template>

<script>
import anthology from '@/components/search/anthology.vue';
    export default {
        name:'searchItem',
        components: {
            anthology
        },
        props: ['searchData','preIndex'],
        mounted () {
            this.searchData.contentPic=(configs.pic_BASEURL+this.searchData.contentPic);
            // console.log(this.searchData);
        },
    }
</script>

<style scoped>
.itemCard{
    width: 100%;
    height: 285px;
    /* background: pink; */
    margin-top: 40px;
}
.leftPic{
    height: 100%;
    width:215px;
    /* background: purple; */
    float: left;
}
.rightCard{
    margin-left: 30px;
    width: calc(100% - 30px - 215px);
    float: left;
}
.cartoonName{
    font-size: 22px;
    color: #333;
    margin: 0;
    line-height: 22px;
    margin-bottom: 20px;
}
.description{
    width: 943px;
    font-size: 14px;
    color: #999999;
    overflow:hidden; 
    text-overflow:ellipsis;
    display:-webkit-box; 
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2; 
    margin-bottom: 19px;
}
.el-tag.el-tag--info{
    background-color: rgba(0, 0, 0, 0.03);
    /* border-color: #e9e9eb; */
    border: none;
    color: #666;
    margin-right: 8px;
}
</style>