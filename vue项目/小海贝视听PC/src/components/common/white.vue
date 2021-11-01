<!--
 * @Author: your name
 * @Date: 2021-09-06 16:08:40
 * @LastEditTime: 2021-09-08 13:41:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tvjoy-web\src\components\common\white.vue
-->
<template>
    <div>

    </div>
</template>

<script>
    export default {
        created () {
            if(this.$route.params.type=='search'){
                this.$router.replace({
                    name:'search',
                    params:this.$route.params
                });
            }else if(this.$route.params.type=='person'){
                this.$router.replace({
                    name:'personalCenter',
                    params:this.$route.params
                })
            }else if(this.$route.params.type=='allConToHot'){
                this.$router.replace({name:'allContent',params: {typeId: 5}});
            }
            
        },
    }
</script>

<style scoped>

</style>