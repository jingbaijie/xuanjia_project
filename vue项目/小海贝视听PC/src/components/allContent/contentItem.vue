<!--
 * @Author: your name
 * @Date: 2021-09-01 15:08:10
<<<<<<< HEAD
 * @LastEditTime: 2021-09-13 17:39:33
=======
 * @LastEditTime: 2021-09-15 11:41:17
>>>>>>> 58445ec4de76184db577ad7476542a8ed5723abe
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tvjoy-web\src\components\allContent\mytabs.vue
-->
<template>
    <div class="contentItem">
        <img @click="jumpToCartoon(itemData)" class="itemPic" :src="itemData.iconPic&&(imgUrl+itemData.iconPic.picPath)" alt="">
        <h4 class="itemTitle" :title="itemData.contentCname">{{itemData.contentCname}}</h4>
        <p class="itemDescription" :title="itemData.more4">{{itemData.more4}}</p>
    </div>
</template>

<script>

    export default {
        name:'contentItem',
        data() {
            return {
                imgUrl: window.configs.pic_BASEURL
            }
        },
        props:['itemData'],
        components: {
        },
        methods: {
            jumpToCartoon(recJson) {
                let cartoonId = recJson.contentId;
                this.$router.push({name: 'videoDetail',params: {cartoonId: cartoonId}})
            }
        },
        mounted () {
        },
    }
</script>

<style scoped>
.contentItem{
    padding-left: 5px;
    padding-top: 10px;
    margin-right:16px ;
    width: 215px;
    float: left;
    margin-bottom: 30px;
    cursor: pointer;
}
.contentItem:hover{
    transform: scale(1.03);
}
.itemPic{
    width: 215px;
    height: 285px;
    /* background: red; */
    transition-duration: .5s;
}
.itemPic:hover{
    transform: scale(1.05, 1.05);
    -webkit-transform: scale(1.05, 1.05);
    -moz-transform: scale(1.05, 1.05);
    -o-transform: scale(1.05, 1.05);
}
.itemTitle{
    font-size: 16px;
    color: #111;
    margin-top: 9px;
    /* height: 20px; */
    /* line-height: 20px; */
    margin-bottom: 7px;
    width: 100%;
    overflow:hidden; 
    text-overflow:ellipsis; 
    white-space:nowrap; 
}
.itemDescription{
    font-size: 15px;
    color: #999;
    /* height: max-content; */
    /* line-height: 15px; */
    margin: 0;
    overflow:hidden; 
    text-overflow:ellipsis; 
    white-space:nowrap; 
}
</style>