var arr = {"保护身体，消灭细菌怪":"http://172.31.183.147:8090/iptv-web/HD/index.html?action=loginPortal_6_53",
"小伶玩具2-芭比娃娃系列":"http://172.31.183.147:8090/iptv-web/HD/index.html?action=loginPortal_1_90",
"小伶玩具2-萌宠大作战":"http://172.31.183.147:8090/iptv-web/HD/index.html?action=loginPortal_1_94",
"汪汪队系列":"http://172.31.183.147:8090/iptv-web/HD/index.html?action=loginPortal_1_99",
"小伶玩具1-小猪佩奇系列":"http://172.31.183.147:8090/iptv-web/HD/index.html?action=loginPortal_1_123",
"奥特曼系列":"http://172.31.183.147:8090/iptv-web/HD/index.html?action=loginPortal_1_182",
"萌鸡小学堂":"http://172.31.183.147:8090/iptv-web/HD/index.html?action=loginPortal_1_171",
"嘟拉动物故事":"http://172.31.183.147:8090/iptv-web/HD/index.html?action=loginPortal_1_184",
"西游记的故事":"http://172.31.183.147:8090/iptv-web/HD/index.html?action=loginPortal_1_217",
"小小画家熊小米":"http://172.31.183.147:8090/iptv-web/HD/index.html?action=loginPortal_1_219",
"超级飞侠大百科第3季":"http://172.31.183.147:8090/iptv-web/HD/index.html?action=loginPortal_1_170"}





ajax.init({
    url: AjaxConfig.interfaceUrl + "findCommonPageInfo",
    method: "get",
    params: {
        contentName : "operationPage",
        time : new Date().getTime()
    },
   
    success: function (json) {
        var divBox = document.createElement("div");
        for(var key in json.data.recommend_1){
    
            var div = '<div class="gameName" ><a  href="'+ json.data.recommend_1[key].recommendDisplayValue +'">'+ json.data.recommend_1[key].recommendTrackName + ":" + json.data.recommend_1[key].recommendDisplayValue +'</a></div>'
        divBox.innerHTML += div;
        }
        document.body.appendChild(divBox);
        
    },
    fail: function (status) {
        
        callback && callback(status);
    }
})

