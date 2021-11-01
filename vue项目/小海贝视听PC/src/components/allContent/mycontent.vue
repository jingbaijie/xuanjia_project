<!--
 * @Author: your name
 * @Date: 2021-09-01 15:08:10
 * @LastEditTime: 2021-09-07 15:40:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tvjoy-web\src\components\allContent\mytabs.vue
-->
<template>
    <div class="mycontent">
        <content-item v-for="(item,index) in showContent" :itemData='item' :key="index"></content-item>
    </div>
</template>

<script>
import contentItem from '@/components/allContent/contentItem.vue'

    export default {
        name:'mycontent',
        data() {
            return {
                
            }
        },
        props:['showContent'],
        // watch: {
        //     showContent(newValue, oldValue) {
        //         this.showContent=newValue;
        //     }
        // },
        components: {
            contentItem,
        },
        methods: {
            jumpToCartoon(cartoonId) {
                this.$router.push({name: 'videoDetail',params: {cartoonId: cartoonId}})
            }
        },
        mounted () {
        },
        
    }
</script>

<style scoped>
.mycontent{
    margin-top: 45px;
    width: 88%;
    margin-left: 7.5%;
    overflow: hidden;
}
</style>