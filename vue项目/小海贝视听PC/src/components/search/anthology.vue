<!--
 * @Author: your name
 * @Date: 2021-09-02 17:58:22
 * @LastEditTime: 2021-09-15 17:25:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tvjoy-web\src\components\search\anthology.vue
-->
<template>
    <div>
        <my-big-num class="mybig" :allCurIndex="curIndex" :total='smallNum' @clickBigNum='clickBigNum'></my-big-num>
        <div class="numTotal">
            <el-button type="info" plain v-for="(item,index) in showNumArr" :key="index" @click="jumpToCartoon(item)">{{item}}</el-button>
        </div>
    </div>
</template>

<script>
import myBigNum from '@/components/search/myBigNum.vue'
    export default {
        name:'anthology',
        props:['smallNum','searchCartoonId','curIndex'],
        data() {
            return {
                total: 172,
                numStart:0,
                numEnd:20,
                smallNumArr:[],
                showNumArr:[],
            }
        },
        created () {
            for(let i = 1;i < this.smallNum+1;i++){
                // console.log(i)
                this.smallNumArr.push(i);
            };
            // console.log(this.smallNumArr)
            var smallEnd=this.smallNum>20?20:this.smallNum;
            this.clickBigNum(`1-${smallEnd}`);
        },
        methods: {
            clickBigNum(item='1-20'){
                //截取数据
                var numarr = item.split('-');
                // console.log(numarr)
                this.numStart=numarr[0];
                this.numEnd=numarr[1];
                if(this.numStart==1){
                    this.showNumArr=this.smallNumArr.slice(this.numStart-1,this.numEnd);
                }else{
                    this.showNumArr=this.smallNumArr.slice(this.numStart,this.numEnd);
                }
            },
            jumpToCartoon(videoIndex){
                this.$router.push({name: 'videoDetail',params: {cartoonId: this.searchCartoonId,videoIndex: videoIndex-1}})
            }
        },
        components: {
            myBigNum,
        },
    }
</script>

<style scoped>
.el-button{
    width: 64px;
    height: 50px;
    margin-top: 16px;
    margin-left: 0px;
    margin-right: 14px;
    border: none;
}
.numTotal{
    width: 800px;
}
.el-button--info.is-plain:focus, .el-button--info.is-plain:hover{
    background-color: #26C3DD  ;
}

</style>
