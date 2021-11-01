export default {
    //清缓存
    axios_(url) {
        //var url = window.configs.lead_BASEURL + "/nodeApi/redisflushdb";
        url = url || "";
        if (!url) { alert("清缓存地址不存在"); }
        // if (method && method.toLocaleUpperCase() == "POST") {
        var params = {
            // log: typeof args == "object" ? JSON.stringify(args) : args
        };
        // if (!args) {
        //     return;
        // }
        var oAjax = null;
        try {
            oAjax = new XMLHttpRequest();
        } catch (e) {
            oAjax = new ActiveXObject("Microsoft.XMLHTTP");
        }
        oAjax.open("POST", url, true);
        oAjax.withCredentials = false;
        oAjax.send(null);
        oAjax.onreadystatechange = function() {
            /*/当状态为4的时候，执行以下操作*/
            if (oAjax.readyState == 4) {
                if (oAjax.status == 200) {
                    // success && success(eval("(" + oAjax.responseText + ")"));
                    alert("缓存清除成功")
                        // this.$message.success("清除成功");
                } else {
                    // fail && fail(status);
                    alert("缓存清除成功")
                        // this.$message.success("清除失败");
                }
            }
        }
    },
    axios_clearCache(args, method, param) {
        var url = window.configs.lead_BASEURL;
        this.axios_(url);
    },
    axios_clearRecom(param) {
        var url = window.configs.recom_BASEURL + "/recommender/movie/updateConfigedMovie?contentId" + param;
        this.axios_(url);
    },

}