<!--
 * @Author: your name
 * @Date: 2021-08-31 14:00:45
 * @LastEditTime: 2021-09-07 15:40:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tvjoy-web\src\components\pages\allContent.vue
-->
<template>
    <div class="content">
        <mytabs :tabsData="tabsData" :typeId="typeId" @getTypeContent='getTypeContentClick'></mytabs>
        <mycontent :showContent='showContent'></mycontent>
        <pagination :paginationData='paginationData' @changePage='changePage'></pagination>
    </div>
</template>
<script>
import mytabs from '@/components/allContent/mytabs.vue'
import mycontent from '@/components/allContent/mycontent.vue'
import pagination from '@/components/common/pagination.vue'

export default{
  name: 'allContent',
  data () {
    return {
      tabsData:[],
      showContent:[],
      paginationData:{},
      typeId:0,
      pageNum:1
    }
  },
  components: {
    mytabs,
    mycontent,
    pagination
  },
  methods: {
    //获取大分类
    getAllData(typeId){
      this.$store.dispatch('getTypesFromParentId',{parentId:1}).then(res=>{
        if(res.data.errorCode==1000){
          res.data.data = res.data.data.sort((a,b)=>{
            return a.rankId - b.rankId;
          });
          this.tabsData=res.data.data;
          if(!typeId){
            this.getTypeContentClick(res.data.data[0].id,this.pageNum);
          }else{
            this.getTypeContentClick(typeId,this.pageNum);
          }
          
        }
      })
    },
    //点击大分类触发
    getTypeContentClick(id,pageNum){
        let params = {
          typeId:id,
          pageSize:14,
          pageNum: pageNum || 1
        };
        this.typeId=id;
        this.getTypeContent(params);
    },
    //获取内容
    getTypeContent(params){
      this.$store.dispatch('getContentsByTypeId',params).then(res=>{
        if(res.data.errorCode==1000){
          this.showContent=res.data.data.records;
          this.paginationData=res.data.data
        }
      })
      localStorage.setItem('typeId',params.typeId);
    },
    //分页请求
    changePage(e){
      let params = {
        typeId:this.typeId,
        pageSize:14,
        pageNum:e
      };
      this.getTypeContent(params);
      this.pageNum = params.pageNum;
      localStorage.setItem('pageNum',params.pageNum);
    },
  },
  created () {
    this.typeId = this.$route.params.typeId?this.$route.params.typeId:(localStorage.getItem('typeId')||13);
    this.pageNum = (!this.$route.params.typeId&&localStorage.getItem('pageNum')) || 1;
    this.getAllData(this.typeId);
  },
}
</script>
