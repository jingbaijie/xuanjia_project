<!--
 * @Author: your name
 * @Date: 2021-09-02 11:01:35
 * @LastEditTime: 2021-09-07 15:19:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tvjoy-web\src\components\common\pagination.vue
-->
<template>
    <div>
        <div class="block">
            <el-pagination
                layout="prev, pager, next"
                :total="Data.total"
                :page-size="Data.size"
                :current-page.sync="curPage"
                @current-change='handlerChange'>
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name:'pagination',
        props:['paginationData'],
        data() {
            return {
                Data: {},
                curPage:1
            }
        },
        watch: {
            paginationData(newValue, oldValue) {
                this.Data=newValue;
                this.curPage=newValue.current;
            }
        },
        computed: {
            paginationData1() {
                
            }
        },
        methods: {
            handlerChange(e) {
                this.$emit('changePage',e)
            }
        },
        created () {
        },
    }
</script>

<style scoped>
.block{
    /* position:absolute; */
    
}
.el-pagination{
    text-align: center;
}
</style>