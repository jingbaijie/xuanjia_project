<!--
 * @Author: your name
 * @Date: 2021-09-01 17:47:55
 * @LastEditTime: 2021-09-15 14:19:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tvjoy-web\src\components\pages\search.vue
-->
<template>
    <div>
         <div class="content" v-show="searchData.length!=0">
            <search-item v-for="(item,index) in searchData" :preIndex="index" :key="item.contentId" :searchData='item'></search-item>
            <pagination class="searchPag" @changePage='changePage' :paginationData='paginationData'></pagination>
        </div>
        <div class="sorry" v-show="searchData.length==0">
            <img src="@/assets/images/search/sorry.png" alt="">
            <p style="font-size:18px;color:#999999">抱歉，没有找到相关视频</p>
        </div>
    </div>
</template>

<script>
import searchItem from '@/components/search/searchItem.vue';
import pagination from '@/components/common/pagination.vue'

    export default {
        name:'search',
        components: {
            searchItem,
            pagination,
            
        },
        data() {
            return {
                searchKey:'',
                searchData:[],
                paginationData:{},
            }
        },
        methods: {
            //请求其他页
            changePage(e){
                // console.log(e)
                this.getData({pageNum:e})
            },
            getData(data) {
                //处理数据
                // this.$store.dispatch('getSearchResult',{searchValue:this.searchKey}).then(res=>{
                //     let searchObj={};
                //     if(res.data.errorCode==1000){
                //         for (let i = 0 ;i<res.data.data.length;i++){
                //             if(!searchObj[res.data.data[i].contentId]){
                //                 searchObj[res.data.data[i].contentId]=res.data.data[i];
                //                 this.searchData.push(res.data.data[i]);
                //             }else{
                //                 searchObj[res.data.data[i].contentId]["tagCname"]+=('_'+res.data.data[i]["tagCname"]);
                //                 for (let j = 0; j<this.searchData.length;j++){
                //                     if(this.searchData[j].contentId==res.data.data[i].contentId){
                //                         this.searchData[j].tagCname=searchObj[res.data.data[i].contentId]["tagCname"];
                //                     }
                //                 }
                //             }
                //         }
                //     };
                // })
                var params={
                    searchValue:this.searchKey
                }
                if(data){
                    for (let key in data){
                        params[key]=data[key];
                    }
                }
                 this.$store.dispatch('getSearchResult',params).then(res=>{
                    if(res.data.errorCode==1000){
                        this.searchData=res.data.data.records;
                        this.paginationData=res.data.data;
                    }
                })
            }
        },
        created () {
            this.searchKey=this.$route.params.searchValue;
            if(!this.searchKey){
                this.searchKey=this.$store.state.searchKey;
            }
            //获取数据
            this.getData();
        },
    }
</script>

<style scoped>
.content{
    width: 62.5%;
    margin-left: 18.75%;
    height: 100%;
    /* background: red; */
}
.sorry{
    width: 100vw;
    text-align: center;
    height: calc(100vh - 100px);
}
.sorry img{
    margin-top: 30px;
}
.searchPag{
    margin-top: 40px;
}
</style>