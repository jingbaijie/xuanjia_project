<!--
 * @Author: your name
 * @Date: 2021-08-31 14:10:28
 * @LastEditTime: 2021-09-07 13:37:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tvjoy-web\src\components\personalCenter\pcRight.vue
-->
<template>
    <div class="description">
        <p class="title">个人资料</p>
        <info-card
        v-for="(item,index) in infoData"
        :key="index"
        @changeInfo='changeInfo(item)' 
        :infoData='item'></info-card>
        <!-- <change-header :isShow='123'></change-header> -->
        <component
        :is='changeCom'
        :isShow='updataHead'
        :changeData='changeData'
        @closeDialog='closeDialog'></component>
    </div>
</template>

<script>
import infoCard from '@/components/personalCenter/infoCard.vue';
import changeHeader from '@/components/personalCenter/changeHeader.vue';
    export default {
        name:'userInfo',
        components:{
            infoCard,
            changeHeader,
        },
        data(){
            return {
                isActive:1,
                updataHead:false,
                changeCom:'changeHeader',
                infoData:[
                    {title:'头像',type:'img',msg:'修改头像'},
                    {title:'昵称',type:'span',msg:'修改昵称'}
                ],
                changeData:{},
            }
        },
        props:['userInfo'],
        methods:{
            changeInfo(data){
                this.changeData=data;
                this.updataHead=true;
            },
            closeDialog(){
                this.updataHead=false;
            }
        }
    }
    
</script>

<style scoped>
.title{
    font-size: 30px;
    color: #333;
    /* float: left; */
    height: 30px;
    margin: 0;
    margin-bottom: 23px;
    width: 120px;
}
.description{
    width: 66%;
    margin-top: 66px;
}

</style>