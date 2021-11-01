<!--
 * @Author: your name
 * @Date: 2021-08-31 14:10:28
 * @LastEditTime: 2021-09-07 15:40:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tvjoy-web\src\components\personalCenter\pcRight.vue
-->
<template>
    <div style='width:64%'>
        <div class="nullHistory" v-if="!showHistory">
            <img class="nullHistoryImg" src="@/assets/images/personCenter/nullHistory.png" alt="">
            <p>你还没有任何观看记录，快去看精彩视频吧~</p>
        </div>
        <el-scrollbar v-if="showHistory">
            <div class="dayTime">
                <day-item v-for="(item,key) in dateData" :key="key" :recordsarr='item' :titlekey="key"></day-item>
            </div>
        </el-scrollbar>
    </div>
</template>

<script>
import dayItem from '@/components/personalCenter/dayItem.vue'
    export default {
        name:'playHistory',
        components: {
            dayItem,
        },
        data(){
            return {
                dateData:{
                    '当天':[],
                    '一周':[],
                    '一月':[],
                },
                showHistory:true,
            }
        },
        methods:{
            //判断时间
            /**
             * type分为当日 一周 一月
             */
            timeRange(type){
                if(type){
                    if(type=='day'){
                        var date = new Date().toLocaleDateString();
                        date = date.split('/').join('-');
                        var oneday = date+ " 00:00:00";
                        var onedayend = date+ " 23:59:59";
                        var startday = new Date(oneday).getTime();
                        var endday = new Date(onedayend).getTime();
                        return {startday,endday}
                    }else if(type=='week'){
                        var date = new Date();
                        var oneday = new Date((date.getTime()-7*86400000));
                        var endday = new Date((date.getTime()));
                        var startday = oneday.getTime();
                        var endday = endday.getTime();
                        return {startday,endday}
                    }else if(type=='month'){
                        var date = new Date();
                        var oneday = new Date((date.getTime()-30*86400000));
                        var endday = new Date((date.getTime()-86400000));
                        var startday = oneday.getTime();
                        var endday = endday.getTime();
                        return {startday,endday}
                    }
                }
                
            }
        },
        mounted () {
        },
        created () {
            //请求历史记录并且进行分类
            this.$store.dispatch('getViewHistory',{userId:this.$store.state.userInfo.id}).then(res=>{
                var records = res.data.data.records;
                if(records.length==0){
                    this.showHistory=false;
                }else{
                    this.showHistory=true;
                }
                if(res.data.errorCode==1000){
                    let day = this.timeRange('day');
                    let week = this.timeRange('week');
                    let month = this.timeRange('month');
                    for (let i = 0 ; i < records.length; i++){
                        records[i].mediaPic=configs.pic_BASEURL+records[i].mediaPic;
                        var date = new Date(records[i].createTime).getTime();
                        if (day.startday <= date && date<=day.endday){
                            this.dateData['当天'].push(records[i]);
                        }else if( week.startday<=date&&week.endday>date){
                            this.dateData['一周'].push(records[i]);
                        }else if( month.startday<=date && month.endday>date){
                            this.dateData['一月'].push(records[i]);
                        }else{
                            
                        }
                    }
                }
            });
        },
    }
    
</script>

<style scoped>
.dayTime{
    width: 100%;
    /* overflow: hidden; */
    height: 650px;
    /* overflow-y: scroll; */
}
/* .el-scrollbar__wrap {
  overflow-x: hidden;
} */
.nullHistory{
    margin-top: 67px;
    margin-left: 534px;
}
.nullHistoryImg{
    width: 201px;
    height: 300px;
}
.nullHistory p{
    margin-left: -55px;
    font-size: 18px;
    color: #999;
}
</style>