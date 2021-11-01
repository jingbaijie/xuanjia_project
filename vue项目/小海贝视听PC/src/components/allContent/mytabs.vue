<!--
 * @Author: your name
 * @Date: 2021-09-01 15:08:10
 * @LastEditTime: 2021-09-07 11:14:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tvjoy-web\src\components\allContent\mytabs.vue
-->
<template>
    <div class="mytabs">
         <div class="mytabsContent">
             <div class="mytabsItem" :class="{'active':typeId==item.id}" v-for="(item,index) in tabsData" :key="item.id" @click="changeType(index,item.id)" ref="mytabsItem">
                 {{item.typeCname}}
             </div>
         </div>
    </div>
</template>

<script>
    export default {
        name:'mytabs',
        data() {
            return {
            }
        },
        props:['tabsData','typeId'],
        methods: {
            changeType(index,id) {
                //样式处理
                for(let i = 0; i<this.$refs.mytabsItem.length;i++){
                    this.$refs.mytabsItem[i].className='mytabsItem';
                    if(i == index){
                        this.$refs.mytabsItem[i].className='mytabsItem active';
                    }
                }
                //数据请求
                this.$emit('getTypeContent',id);
            }
        },
        // mounted () {
        //     for(let i = 0; i<this.$refs.mytabsItem.length;i++){
        //             this.$refs.mytabsItem[i].className='mytabsItem';
        //             if(i == 0){
        //                 this.$refs.mytabsItem[i].className='mytabsItem active';
        //             }
        //     };
        // },
    }
</script>

<style scoped>
.mytabs{
    width: 100%;
    height: 70px;
    background: #F8F8F8;
}
.mytabsContent{
    margin-left: 145px;
    height: 100%;
}
.mytabsItem{
    line-height: 70px;
    font-size: 18px;
    color: #333;
    float: left;
    margin-left: 57px;
    cursor: pointer;
}
.mytabsItem:hover{
    color: #00BBBF;
}
.active::after{
    content: '';
    position: absolute;
    width: 20px;
    height: 5px;
    background: #26C3DD;
    right: 0;
    left: 0;
    margin: auto;
    bottom: 0;
    border-radius: 3px;
}
.mytabsItem:first-child{
    margin-left: 0px;
}
.active{
    position: relative;
    color: #26C3DD;
    
}
</style>