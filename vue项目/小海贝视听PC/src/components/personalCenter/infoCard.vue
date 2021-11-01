<!--
 * @Author: your name
 * @Date: 2021-08-31 16:26:11
 * @LastEditTime: 2021-09-15 11:36:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tvjoy-web\src\components\personalCenter\infoCard.vue
-->
<template>
    <div>
        <div class="content">
            <div class="label">{{infoData.title}}</div>
            <div class="infoContent" style="width:60%;text-align:left">
                <span v-if="infoData.type=='span'">{{userInfo.name}}</span>
                <img class="changeHeadrimg" v-if="infoData.type=='img'" style="margin-top:20px;border-radius:50%" :src="userInfo.headerImg==''?'/static/img/defaultHeader.401ed54.png':userInfo.headerImg" alt="">
            </div>
            <el-button class="eltext" type="text" @click='handler()'>{{infoData.msg}}</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name:"infoCard",
        props:['infoData'],
        data() {
            return {
                info: {},
            }
        },
        inject:['userInfo'],
        methods: {
            handler() {
                this.$emit('changeInfo');
            }
        },
        created () {
            // this.info=this.$store.state.userInfo;
            // console.log(this.infoData)
        },
    }
</script>

<style scoped>
.content{
    width: 100%;
    display: flex;
    height: 130px;
    line-height: 100px;
    justify-content: space-between;
    border-bottom: solid 1px #D8D8D8;
}
.label{
    line-height:130px;
    font-size: 18px;
}
.infoContent{
    width:60%;line-height:130px;text-align:left;
    font-size: 18px;
}
.changeHeadrimg{
    width: 90px;
    height: 90px;
}
.eltext{
    font-size: 18px;
}
</style>