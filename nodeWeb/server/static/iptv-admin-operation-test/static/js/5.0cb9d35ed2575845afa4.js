webpackJsonp([5],{Aw69:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=a("woOf"),n=a.n(i),r=a("mvHQ"),l=a.n(r),o=(a("zL8q"),a("nfHz")),s=a("bOdI"),c=a.n(s),d=a("oudX"),h=a.n(d),u={name:"gameForm",data:function(){var e,t=this;return e={token:localStorage.getItem("token"),cpData:[],api:window.configs.axios_BASEURL,dialogFormVisible:!1,action:"",menuId:"",detailPicUrl:h.a,labelPicUrl:h.a,iconPicUrl:h.a,bgPicUrl:h.a,typeValue:"",formLabelWidth:"120px",value:[1,4],typeData:[],tagsData:[],preBtn:!0,nextBtn:!1,pageTotle:0,currentPage:1,form:{cspInfo:{id:""}},rules:{gameCname:[{required:!0,message:"必填项",trigger:"blur"}]}},c()(e,"dialogFormVisible",!1),c()(e,"imagesBaseUrl",window.configs.static_IMAGES_BASEURL),c()(e,"action",""),c()(e,"booleanUp",[{id:"0",name:"未上线"},{id:"1",name:"测试"},{id:"2",name:"上线"}]),c()(e,"props",{multiple:!0,lazy:!0,lazyLoad:function(e,a){var i=e.level;if(0==i){var n=t.typeData.map(function(e){return{value:e.id,label:e.typeCname,leaf:i>=1}});a(n)}else 1==i&&t.$store.dispatch("axios_get_tagList",{productId:e.value,pageNum:1,pageSize:1e4}).then(function(e){var t=e.data.data.list.records.map(function(e){return{value:e.id,label:e.typeCname,leaf:i>=1}});a(t)})}}),e},inject:["getClassifyData"],components:{image_choice:a("QoLB").a},created:function(){this.getTagList,this.getCpList},mounted:function(){var e=this;o.a.$on("addGame",function(t){e.action="add",e.addProgram(t),e.typeData=e.filterData}),o.a.$on("editGame",function(t){e.action="edit",e.editProgram(t),e.typeData=e.filterData})},beforeDestroy:function(){o.a.$off(["addGame","editGame"])},computed:{removeArr:function(e){var t=[];return e.map(function(e){return 0!==e.children.length?t.push(e):""}),t},filterData:function(){var e=this.getClassifyData();return e.forEach(function(e){e.childrenList instanceof Array&&e.childrenList.length>0?e.childrenList.forEach(function(e){e.childrenList instanceof Array&&e.childrenList.length>0?e.childrenList.forEach(function(e){e.childrenList instanceof Array&&e.childrenList.length>0?e.childrenList.forEach(function(e){delete e.childrenList}):delete e.childrenList}):delete e.childrenList}):delete e.childrenList}),e},getTagList:function(){var e=this;this.$store.dispatch("axios_get_productTagList").then(function(t){e.tagsData=e.filterDataChildren(t.data.data)}).catch(function(e){})},getCpList:function(){var e=this;this.$store.dispatch("axios_get_cp",{pageNum:1,pageSize:100}).then(function(t){"1000"==t.data.errorCode&&(e.cpData=t.data.data.list.records)})},getParentData:function(){return this.typeData}},methods:{addSuccess:function(e,t,a){this.form.jadUrl=e.data},addSuccess2:function(e,t,a){this.form.jarUrl=e.data},addPic:function(e,t){this.form.jadFile=t},addPic2:function(e,t){this.form.jarFile=t},filterDataChildren:function(e){return e.forEach(function(e){e.childrenList.length>0?e.childrenList.forEach(function(e){e.childrenList.length>0?e.childrenList.forEach(function(e){e.childrenList<=0&&delete e.childrenList}):delete e.childrenList}):delete e.childrenList}),e},showAttr:function(e,t){0==t?(this.labelPicUrl=this.imagesBaseUrl+e.picPath,this.form.labelPic={},this.form.labelPic.id=e.id):1==t?(this.detailPicUrl=this.imagesBaseUrl+e.picPath,this.form.detailPic={},this.form.detailPic.id=e.id):2==t?(this.iconPicUrl=this.imagesBaseUrl+e.picPath,this.form.iconPic={},this.form.iconPic.id=e.id):(this.bgPicUrl=this.imagesBaseUrl+e.picPath,this.form.backgroundPic={},this.form.backgroundPic.id=e.id)},addProgram:function(e){this.dialogFormVisible=!0,this.typeData=this.getClassifyData(),this.form={cspInfo:{id:""}},this.detailPicUrl=h.a,this.labelPicUrl=h.a,this.iconPicUrl=h.a},editProgram:function(e){this.dialogFormVisible=!0,this.typeData=this.getClassifyData(),this.form=e,!e.cspInfo&&(this.form.cspInfo={id:""}),e.detailPic?this.detailPicUrl=this.imagesBaseUrl+e.detailPic.picPath:this.detailPicUrl=h.a,e.labelPic?this.labelPicUrl=this.imagesBaseUrl+e.labelPic.picPath:this.labelPicUrl=h.a,e.iconPic?this.iconPicUrl=this.imagesBaseUrl+e.iconPic.picPath:this.iconPicUrl=h.a},onSubmit:function(e){var t=this;this.$refs[e].validate(function(e){if(!e)return!1;if(t.dialogFormVisible=!1,"add"==t.action){t.form.cspInfo={id:t.form.cspInfo.id};t.form.visible?"1":"0",t.$store.dispatch("axios_add_game",t.form).then(function(e){"1000"==e.data.errorCode?(t.$message.success("添加成功  "+l()(e.data.errorMsg)),o.a.$emit("refreshGameList")):t.$message.error("添加失败  "+l()(e.data.errorMsg))}).catch(function(e){t.$message.error("添加失败")})}else t.form.cspInfo={id:t.form.cspInfo.id},t.$store.dispatch("axios_edit_game",t.form).then(function(e){t.$message.success("修改成功"),o.a.$emit("refreshGameList")}).catch(function(e){t.$message.error("修改成功")})})}}},f={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("el-dialog",{directives:[{name:"dialogDrag",rawName:"v-dialogDrag"}],ref:"dialog__wrapper",attrs:{width:"50vw",height:"50",title:"添加游戏",visible:e.dialogFormVisible},on:{"update:visible":function(t){e.dialogFormVisible=t}}},[a("el-form",{ref:"form",attrs:{model:e.form,rules:e.rules}},[a("el-form-item",{attrs:{label:"归属类型","label-width":e.formLabelWidth}},[a("el-cascader",{attrs:{placeholder:"搜索",options:e.typeData,props:{multiple:!0,children:"childrenList",label:"typeCname",value:"id"},filterable:"",size:"medium"},model:{value:e.form.typeParentPath,callback:function(t){e.$set(e.form,"typeParentPath",t)},expression:"form.typeParentPath"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"游戏名称",prop:"gameCname","label-width":e.formLabelWidth}},[a("el-input",{attrs:{type:"text"},model:{value:e.form.gameCname,callback:function(t){e.$set(e.form,"gameCname",t)},expression:"form.gameCname"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"游戏标签","label-width":e.formLabelWidth}},[a("el-cascader",{attrs:{filterable:"",options:e.tagsData,props:{multiple:!0,children:"childrenList",label:"typeCname",value:"id"}},model:{value:e.form.tagParentPath,callback:function(t){e.$set(e.form,"tagParentPath",t)},expression:"form.tagParentPath"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"英文名称","label-width":e.formLabelWidth}},[a("el-input",{attrs:{type:"text"},model:{value:e.form.gameEname,callback:function(t){e.$set(e.form,"gameEname",t)},expression:"form.gameEname"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"CP/SP信息","label-width":e.formLabelWidth}},[a("el-select",{attrs:{placeholder:"请选择"},model:{value:e.form.cspInfo.id,callback:function(t){e.$set(e.form.cspInfo,"id",t)},expression:"form.cspInfo.id"}},e._l(e.cpData,function(e){return a("el-option",{key:e.id,attrs:{label:e.cpCname,value:e.id}})}),1)],1),e._v(" "),a("el-form-item",{attrs:{label:"游戏介绍","label-width":e.formLabelWidth}},[a("el-input",{attrs:{type:"textarea",rows:2,placeholder:"请输入内容"},model:{value:e.form.gameIntrolduction,callback:function(t){e.$set(e.form,"gameIntrolduction",t)},expression:"form.gameIntrolduction"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"jad地址","label-width":e.formLabelWidth}},[a("el-upload",{ref:"upload",attrs:{action:e.api+"/content/game/uploadGamesFile",headers:{"x-a-t":this.token},"on-success":e.addSuccess,"file-list":e.form.jadFile,name:"jadFile","show-file-list":""}},[a("el-button",{attrs:{plain:"",icon:"el-icon-upload",size:"small",type:"primary"}},[e._v("点击上传")])],1)],1),e._v(" "),a("el-form-item",{attrs:{label:"jar地址","label-width":e.formLabelWidth}},[a("el-upload",{ref:"upload",attrs:{action:e.api+"/content/game/uploadGamesFile",headers:{"x-a-t":this.token},"on-success":e.addSuccess2,"file-list":e.form.jarFile,name:"jarFile","show-file-list":""}},[a("el-button",{attrs:{plain:"",icon:"el-icon-upload",size:"small",type:"primary"}},[e._v("点击上传")])],1)],1),e._v(" "),a("el-form-item",{attrs:{label:"H5地址","label-width":e.formLabelWidth}},[a("el-input",{attrs:{type:"text"},model:{value:e.form.otherUrl,callback:function(t){e.$set(e.form,"otherUrl",t)},expression:"form.otherUrl"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"标签图片","label-width":e.formLabelWidth}},[a("el-popover",{attrs:{placement:"right",width:"535",trigger:"hover"}},[a("img",{staticClass:"flagImage",attrs:{slot:"reference",src:e.labelPicUrl},slot:"reference"}),e._v(" "),a("image_choice",{on:{getSelectImage:function(t){return e.showAttr(t,0)}}})],1)],1),e._v(" "),a("el-form-item",{attrs:{label:"详情图片","label-width":e.formLabelWidth}},[a("el-popover",{attrs:{placement:"right",width:"535",trigger:"hover"}},[a("img",{staticClass:"flagImage",attrs:{slot:"reference",src:e.detailPicUrl},slot:"reference"}),e._v(" "),a("image_choice",{on:{getSelectImage:function(t){return e.showAttr(t,1)}}})],1)],1),e._v(" "),a("el-form-item",{attrs:{label:"全部内容页图","label-width":e.formLabelWidth}},[a("el-popover",{attrs:{placement:"right",width:"535",trigger:"hover"}},[a("img",{staticClass:"flagImage",attrs:{slot:"reference",src:e.iconPicUrl},slot:"reference"}),e._v(" "),a("image_choice",{on:{getSelectImage:function(t){return e.showAttr(t,2)}}})],1)],1),e._v(" "),a("el-form-item",{attrs:{label:"背景图","label-width":e.formLabelWidth}},[a("el-popover",{attrs:{placement:"right",width:"535",trigger:"hover"}},[a("img",{staticClass:"flagImage",attrs:{slot:"reference",src:e.bgPicUrl},slot:"reference"}),e._v(" "),a("image_choice",{on:{getSelectImage:function(t){return e.showAttr(t,3)}}})],1)],1),e._v(" "),a("el-form-item",{attrs:{label:"排行ID","label-width":e.formLabelWidth}},[a("el-input-number",{attrs:{min:0,"controls-position":"right"},model:{value:e.form.rankId,callback:function(t){e.$set(e.form,"rankId",t)},expression:"form.rankId"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"上架状态","label-width":e.formLabelWidth}},[a("el-switch",{attrs:{"active-value":2,"inactive-value":0,"active-color":"#13ce66"},model:{value:e.form.booleanUp,callback:function(t){e.$set(e.form,"booleanUp",t)},expression:"form.booleanUp"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"免费状态","label-width":e.formLabelWidth}},[a("el-switch",{attrs:{"active-value":1,"inactive-value":0},model:{value:e.form.isFree,callback:function(t){e.$set(e.form,"isFree",t)},expression:"form.isFree"}})],1)],1),e._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.onSubmit("form")}}},[e._v("提 交")])],1)],1)],1)},staticRenderFns:[]};var m=a("VU/8")(u,f,!1,function(e){a("ex5b")},"data-v-6487c330",null).exports,p=a("RcBM"),g=a("ZPWI"),b=a("i9oJ"),v=a("KJ/r"),y=a("sjnz"),_={name:"gameList",inject:["getMenuId"],components:{gameForm:m,Pagination:p.a,"self-button-search":g.a,"self-button-batch-online":b.a,"self-button-batch-free":v.a,"self-button-batch-class":y.a},data:function(){return{menuId:this.getMenuId(),breadcrumb:[],breadcrumb_child:[],activeName:"first",dialogVisible:!1,currentPage:1,pageSize:10,total:1,tagsData:[],classifyData:[],curProgram:{iconPic:{},labelPic:{},detailPic:{}},imagesBaseUrl:window.configs.static_IMAGES_BASEURL,programData:[],seriesListData:[],curProductId:"",form:"",search:"",selectedIDs:[],loadingProgramList:!0,loadingProgram:!0,loadingMove:!0,tableHeight:void 0,formLabelWidth:"120px",moveData:[],curCspInfo:{},curTypeInfoList:[],userPermission:{select:!1,delete:!1,insert:!1,update:!1},defaultProps:{children:"childrenList",label:"typeCname",value:"id",checkStrictly:!0,expandTrigger:"hover",emitPath:!1},inState:{0:"未注入",1:"注入中",2:"注入成功",3:"注入失败"},isFree:{0:"免费",1:"收费"},booleanUp:{0:"未上线",2:"上线"},online:{0:"下架",2:"上架"},booleanUpValue:""}},provide:function(){var e=this;return{setClassifyData:function(t){return e.classifyData=t},getClassifyData:function(){return e.classifyData},getTagsData:function(){return e.tagsData}}},created:function(){var e=this;console.log("game insert : ",this.isAuth("system:game:insert")),console.log("game edit : ",this.isAuth("system:game:update")),console.log("game list : ",this.isAuth("system:game:list")),console.log("game delete : ",this.isAuth("system:game:delete")),this.getClassifyList(),this.getTagList(),o.a.$on("refreshGameList",function(){console.log("refreshGame"),e.getTypeInfo(e.curProductId)})},mounted:function(){this.isAuth("system:game:list")&&(this.tableHeight=window.innerHeight-this.$refs.multipleTable.$el.offsetTop-200)},destroyed:function(){o.a.$off(["refreshGameList"])},methods:{getTagList:function(){var e=this;this.$store.dispatch("axios_get_productTagList").then(function(t){e.tagsData=e.filterDataChildren(t.data.data)}).catch(function(e){})},filterDataChildren:function(e){return e.forEach(function(e){e.childrenList.length>0?e.childrenList.forEach(function(e){e.childrenList.length>0?e.childrenList.forEach(function(e){e.childrenList>0?e.childrenList.forEach(function(e){e.childrenList.length<=0&&delete e.childrenList}):delete e.childrenList}):delete e.childrenList}):delete e.childrenList}),e},batchUpdateClass:function(e){var t=this;this.$store.dispatch("axios_update_game_tag",{contentId:this.selectedIDs.join(),typeParentPath:e.typeParentPath||[],tagParentPath:e.tagParentPath||[]}).then(function(e){"1000"==e.data.errorCode?(o.a.$emit("refreshGameList"),t.$message.success("批量操作成功！")):t.$message.error("批量操作失败，请联系管理员")}).catch(function(e){t.$message.error("批量操作失败，请联系管理员")})},batchIsFree:function(e){var t=this;this.selectedIDs.length>0?this.$store.dispatch("axios_update_gameIsFree",{gameId:this.selectedIDs.join(),isFree:e}).then(function(e){"1000"==e.data.errorCode?(t.$message.success("批量操作成功！"),o.a.$emit("refreshGameList")):t.$message.error("批量操作失败，请联系管理员")}).catch(function(e){t.$message.error("批量操作失败，请联系管理员")}):this.$message.warning("请勾选内容")},batchOnLine:function(e){var t=this;this.selectedIDs.length>0?this.$store.dispatch("axios_update_GameBooleanUp",{gameId:this.selectedIDs.join(),booleanUp:e}).then(function(e){"1000"==e.data.errorCode?(t.$message.success("批量操作成功！"),o.a.$emit("refreshGameList")):t.$message.error("批量操作失败，请联系管理员")}):this.$message.warning("请勾选节目")},changeIsFree:function(e,t){this.$store.dispatch("axios_update_gameIsFree",{gameId:t.id,isFree:e})},changeOnLine:function(e,t){this.$store.dispatch("axios_update_GameBooleanUp",{gameId:t.id,booleanUp:e})},showMove:function(e){this.getMovieListByProgramId(e)},findRoad:function(e){var t=this;this.breadcrumb=[],this.classifyData instanceof Array&&this.classifyData.forEach(function(a){a.id==e?t.breadcrumb.push(a.typeCname):a instanceof Array&&a.childrenList.forEach(function(i){i.id==e?(t.breadcrumb.push(a.typeCname),t.breadcrumb.push(i.typeCname)):i instanceof Array&&i.childrenList.forEach(function(n){n.id==e?(t.breadcrumb.push(a.typeCname),t.breadcrumb.push(i.typeCname),t.breadcrumb.push(n.typeCname)):n instanceof Array&&n.childrenList.forEach(function(r){r.id==e&&(t.breadcrumb.push(a.typeCname),t.breadcrumb.push(i.typeCname),t.breadcrumb.push(n.typeCname),t.breadcrumb.push(r.typeCname))})})})})},formateClass:function(e){var t=[];return e.forEach(function(e){t.push(e.typeCname)}),t.join()},getClassifyList:function(){var e=this;this.menuId=this.getMenuId(),this.$store.dispatch("axios_get_classify",{menuId:this.menuId}).then(function(t){"undefined"!=t&&(e.classifyData=t.data.data,e.btns=t.data.data.btns,t.data.data.length>0&&(his.curProductId=e.classifyData[0].id,e.getTypeInfo(e.curProductId))),e.loadingProgramList=!1}).catch(function(t){e.loadingProgramList=!1})},detailList:function(e){this.activeName="first",this.breadcrumb_child=[],this.dialogVisible=!0,this.curProgram=e,this.curCspInfo=e.cspInfo,this.curTypeInfoList=e.typeInfoList,this.breadcrumb_child=this.breadcrumb_child.concat(this.breadcrumb),this.breadcrumb_child.push(e.cartoonCname)},getTypeInfoBySearch:function(e,t){this.search=JSON.parse(l()(t)),this.getTypeInfo(e)},getTypeInfo:function(e){var t=this;this.loadingProgramList=!0,console.log(l()(this.search)),this.$store.dispatch("axios_get_gameList",n()({typeId:e,pageNum:this.currentPage,pageSize:this.pageSize},this.search)).then(function(e){t.loadingProgramList=!1,t.programData=e.data.data.list.records,t.total=e.data.data.list.total}).catch(function(e){t.loadingProgramList=!1})},nodeClick:function(e){this.loading=!0,this.currentPage=1,this.curProductId=e.id,this.search={},this.getTypeInfo(e.id),this.findRoad(e.id)},getProgramListBySeriesId:function(e){var t=this;this.$store.dispatch("axios_get_programListBySeriesId",{seriesId:e}).then(function(e){t.dialogVisible=!0,t.seriesListData=e.data.data.records,t.loadingProgram=!1}).catch(function(e){t.loadingProgram=!1})},getMovieListByProgramId:function(e){var t=this;this.$store.dispatch("axios_get_movieListByProgramId",{programId:e}).then(function(e){t.dialogVisible=!0,t.moveData=e.data.data,t.loadingMove=!1}).catch(function(e){t.loadingMove=!1})},getLabelList:function(){},handleClick:function(e){"first"==e.name||("second"==e.name?this.getProgramListBySeriesId(this.curProgram.id):(e.name="third")&&this.getMovieListByProgramId())},handleCreate:function(){o.a.$emit("addGame")},handleEdit:function(e,t){o.a.$emit("editGame",t[e])},handleSelectionChange:function(e){this.multipleSelection=e;var t=[];this.multipleSelection.map(function(e){t.push(e.id)}),this.selectedIDs=t},handleClose:function(e){this.$confirm("确认关闭？").then(function(t){e()}).catch(function(e){})}}},P={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("el-row",[a("el-col",{attrs:{span:4}},[a("div",{staticClass:"grid-content bg-purple"},[a("p",[e._v("产品/游戏")]),e._v(" "),a("el-tree",{attrs:{data:e.classifyData,"node-key":"id","expand-on-click-node":!1,props:e.defaultProps,"highlight-current":!0,accordion:""},on:{"node-click":e.nodeClick}})],1)]),e._v(" "),a("el-col",{attrs:{span:20}},[a("div",{},[a("div",{style:{"line-height":"50px",height:"50px",margin:"20px 0 0 0"}},[e.isAuth("system:game:insert")?a("el-button",{style:{float:"right",margin:"0 70px 0 0"},attrs:{size:"mini",type:"primary",plain:""},on:{click:function(t){return e.handleCreate()}}},[e._v("新增")]):e._e(),e._v(" "),a("self-button-batch-online",{on:{batchOnLine:e.batchOnLine}}),e._v(" "),a("self-button-batch-free",{on:{batchIsFree:e.batchIsFree}}),e._v(" "),a("self-button-batch-class",{attrs:{tagsData:e.tagsData,classifyData:e.classifyData,selectedIDs:e.selectedIDs},on:{batchUpdateClass:e.batchUpdateClass}}),e._v(" "),a("self-button-search",{on:{getTypeInfo:function(t){return e.getTypeInfoBySearch(e.curProductId,t)}}})],1),e._v(" "),e.isAuth("system:game:list")?a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loadingProgramList,expression:"loadingProgramList"}],ref:"multipleTable",attrs:{data:e.programData,height:e.tableHeight},on:{"selection-change":e.handleSelectionChange}},[a("el-table-column",{attrs:{type:"selection",width:"55"}}),e._v(" "),a("el-table-column",{attrs:{prop:"id",align:"center",width:"40",label:"ID"}}),e._v(" "),a("el-table-column",{attrs:{prop:"gameCname",align:"center",label:"中文名称"}}),e._v(" "),a("el-table-column",{attrs:{prop:"gameEname",label:"英文名称"}}),e._v(" "),a("el-table-column",{attrs:{prop:"typeInfoList",label:"分类名称",width:"90"},scopedSlots:e._u([{key:"default",fn:function(t){return[t.row.typeInfoList.length>0?a("el-popover",{attrs:{placement:"top-start",width:"200",trigger:"hover"}},[e._l(t.row.typeInfoList,function(t,i){return a("el-tag",{key:i,style:{margin:"0 0 5px 5px"},attrs:{type:"success"}},[e._v(e._s(t.typeCname))])}),e._v(" "),a("el-button",{attrs:{slot:"reference",size:"mini"},slot:"reference"},[e._v(e._s(t.row.typeInfoList[0].typeCname))])],2):e._e()]}}],null,!1,2515851730)}),e._v(" "),a("el-table-column",{attrs:{prop:"cspInfo.cpCname",label:"CP/SP信息"}}),e._v(" "),a("el-table-column",{attrs:{prop:"jadUrl",label:"jad地址"}}),e._v(" "),a("el-table-column",{attrs:{prop:"jarUrl",label:"jar地址"}}),e._v(" "),a("el-table-column",{attrs:{prop:"otherUrl",label:"h5地址"}}),e._v(" "),a("el-table-column",{attrs:{align:"center",label:"是否上架",width:"100"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-switch",{attrs:{"active-value":2,"inactive-value":0,"active-color":"#13ce66"},on:{change:function(a){return e.changeOnLine(a,t.row)}},model:{value:t.row.booleanUp,callback:function(a){e.$set(t.row,"booleanUp",a)},expression:"scope.row.booleanUp"}}),e._v("\n          "+e._s(e.online[t.row.booleanUp])+"\n        ")]}}],null,!1,722933725)}),e._v(" "),a("el-table-column",{attrs:{align:"center",label:"免费状态",width:"100"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-switch",{attrs:{"active-value":1,"inactive-value":0},on:{change:function(a){return e.changeIsFree(a,t.row)}},model:{value:t.row.isFree,callback:function(a){e.$set(t.row,"isFree",a)},expression:"scope.row.isFree"}}),e._v("\n          "+e._s(e.isFree[t.row.isFree])+"\n        ")]}}],null,!1,2750056403)}),e._v(" "),a("el-table-column",{attrs:{align:"center",label:"操作",width:"160"},scopedSlots:e._u([{key:"default",fn:function(t){return[e.isAuth("system:game:update")?a("el-button",{attrs:{type:"text"},on:{click:function(a){return e.handleEdit(t.$index,e.programData)}}},[e._v("编 辑")]):e._e()]}}],null,!1,3274103118)})],1):e._e(),e._v(" "),e.isAuth("system:game:list")?e._e():a("div",{staticClass:"msg"},[e._v("\n    暂无权限\n  ")]),e._v(" "),e.isAuth("system:game:list")?a("pagination",{directives:[{name:"show",rawName:"v-show",value:e.total>0,expression:"total>0"}],attrs:{total:e.total,page:e.currentPage,limit:e.pageSize},on:{"update:page":function(t){e.currentPage=t},"update:limit":function(t){e.pageSize=t},pagination:function(t){return e.getTypeInfo(e.curProductId)}}}):e._e()],1)])],1),e._v(" "),a("gameForm")],1)},staticRenderFns:[]};var L=a("VU/8")(_,P,!1,function(e){a("cDwO")},"data-v-47c26ebc",null);t.default=L.exports},"KJ/r":function(e,t,a){"use strict";a("lzQ2");var i={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-popover",{attrs:{placement:"top",width:"170",trigger:"click"}},[a("el-button",{style:{float:"right",margin:"0 10px 0 0"},attrs:{size:"mini",type:"info",plain:""},on:{click:function(t){return e.batchIsFree(0)}}},[e._v("免费")]),e._v(" "),a("el-button",{style:{float:"right",margin:"0 10px 0 0"},attrs:{size:"mini",type:"primary",plain:""},on:{click:function(t){return e.batchIsFree(1)}}},[e._v("收费")]),e._v(" "),a("el-button",{style:{float:"right",margin:"0 10px 0 0"},attrs:{slot:"reference",size:"mini",type:"primary",plain:""},slot:"reference"},[e._v("批量免费")])],1)},staticRenderFns:[]},n=a("VU/8")({name:"Pagination",methods:{batchIsFree:function(e){var t=this;this.$confirm("确定全部修改吗?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){t.$emit("batchIsFree",e)}).catch(function(){t.$message({type:"info",message:"已取消操作"})})}}},i,!1,null,null,null);t.a=n.exports},Tuci:function(e,t){},ZPWI:function(e,t,a){"use strict";var i={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("el-button",{style:{float:"right",margin:"0 30px 0 0"},attrs:{icon:"el-icon-search",size:"mini",circle:""},on:{click:e.clickSearch}}),e._v(" "),a("el-input",{staticClass:"header-search-select",style:{float:"right"},attrs:{placeholder:"搜索节目名"},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.onSubmitSearch(t)}},model:{value:e.searchConfig.searchValue,callback:function(t){e.$set(e.searchConfig,"searchValue",t)},expression:"searchConfig.searchValue"}}),e._v(" "),a("el-drawer",{attrs:{size:"50%",visible:e.dialog,direction:"ttb"},on:{"update:visible":function(t){e.dialog=t}}},[a("div",{staticClass:"dialog-footer"},[a("el-button",{attrs:{type:"primary",size:"mini",icon:"el-icon-search"},on:{click:function(t){return e.onSubmitSearch()}}},[e._v("搜 索")])],1),e._v(" "),a("div",{staticClass:"filterDiv"},[a("el-form",{attrs:{model:e.searchConfig,inline:!0}},[a("el-form-item",{attrs:{label:"版权开始时间","label-width":"120px"}},[a("el-date-picker",{attrs:{"value-format":"yyyy-MM-dd",type:"date",placeholder:"选择日期"},model:{value:e.searchConfig.startTime,callback:function(t){e.$set(e.searchConfig,"startTime",t)},expression:"searchConfig.startTime"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"版权结束时间","label-width":"120px"}},[a("el-date-picker",{attrs:{"value-format":"yyyy-MM-dd",type:"date",placeholder:"选择日期"},model:{value:e.searchConfig.endTime,callback:function(t){e.$set(e.searchConfig,"endTime",t)},expression:"searchConfig.endTime"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"支持中文名，英文名","label-width":"160px"}},[a("el-input",{attrs:{placeholder:"输入关键字"},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.onSubmitSearch(t)}},model:{value:e.searchConfig.searchValue,callback:function(t){e.$set(e.searchConfig,"searchValue",t)},expression:"searchConfig.searchValue"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"是否免费","label-width":"120px"}},[a("el-select",{attrs:{placeholder:"请选择"},model:{value:e.searchConfig.booleanFree,callback:function(t){e.$set(e.searchConfig,"booleanFree",t)},expression:"searchConfig.booleanFree"}},e._l(e.booleanFree,function(e){return a("el-option",{key:e.id,attrs:{label:e.name,value:e.id}})}),1)],1),e._v(" "),a("el-form-item",{attrs:{label:"是否上架","label-width":"120px"}},[a("el-select",{attrs:{placeholder:"请选择"},model:{value:e.searchConfig.booleanUp,callback:function(t){e.$set(e.searchConfig,"booleanUp",t)},expression:"searchConfig.booleanUp"}},e._l(e.booleanUp,function(e){return a("el-option",{key:e.id,attrs:{label:e.name,value:e.id}})}),1)],1)],1)],1)])],1)},staticRenderFns:[]};var n=a("VU/8")({data:function(){return{dialog:!1,searchConfig:{searchValue:"",booleanUp:"",booleanFree:"",startTime:"",endTime:""},booleanFree:[{name:"无",id:""},{name:"免费",id:0},{name:"收费",id:1}],booleanUp:[{name:"无",id:""},{name:"下架",id:0},{name:"上架",id:2}]}},methods:{clickSearch:function(){this.dialog=!0},onSubmitSearch:function(){this.dialog=!1,this.$emit("getTypeInfo",this.searchConfig)}},computed:{getSearchValue:function(){return this.searchConfig.searchValue}},watch:{dialog:function(e){e?(this.searchConfig.booleanFree="",this.searchConfig.booleanUp=""):(this.searchConfig.booleanFree="",this.searchConfig.booleanUp="",this.searchConfig.startTime="",this.searchConfig.endTime="")},getSearchValue:function(e){this.searchConfig.searchValue=e,this.$emit("getTypeInfo",this.searchConfig)}}},i,!1,function(e){a("Tuci")},"data-v-ca00ab92",null);t.a=n.exports},cDwO:function(e,t){},ex5b:function(e,t){},i9oJ:function(e,t,a){"use strict";var i={name:"OnlineBatches",data:function(){return{dialogVisible:!1,radio:1,form:{booleanUpAll:1},booleanUpAll:1,rules:{booleanUpAll:[{required:!0,message:"请选择范围",trigger:"blur"}]}}},methods:{All:function(e){this.booleanUpAll=e},switchOnline:function(e){this.action=e,this.dialogVisible=!0},onSubmit:function(e){var t=this;this.$refs[e].validate(function(e){if(!e)return console.log("error submit!!"),!1;t.$emit("batchOnLine",t.action,t.booleanUpAll),t.dialogVisible=!1})}}},n={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("el-popover",{attrs:{placement:"top",width:"190",trigger:"click"}},[a("el-button",{style:{float:"right",margin:"0 10px 0 0"},attrs:{size:"mini",type:"info",plain:""},on:{click:function(t){return e.switchOnline(0)}}},[e._v("下架")]),e._v(" "),a("el-button",{style:{float:"right",margin:"0 10px 0 0"},attrs:{size:"mini",type:"success",plain:""},on:{click:function(t){return e.switchOnline(2)}}},[e._v("上架")]),e._v(" "),a("el-button",{style:{float:"right",margin:"0 10px 0 0"},attrs:{slot:"reference",size:"mini",type:"success",plain:""},slot:"reference"},[e._v("批量上架")])],1),e._v(" "),a("el-dialog",{attrs:{title:"操作",visible:e.dialogVisible,"modal-append-to-body":!1},on:{"update:visible":function(t){e.dialogVisible=t}}},[a("span",[e._v("请选择为接下来勾选的节目子集选择全部上架或部分上架")]),e._v(" "),a("el-form",{ref:"form",attrs:{rules:e.rules,model:e.form,"label-width":"80px"}},[a("el-form-item",{attrs:{label:"范围",prop:"booleanUpAll"}},[a("el-radio-group",{on:{change:e.All},model:{value:e.form.booleanUpAll,callback:function(t){e.$set(e.form,"booleanUpAll",t)},expression:"form.booleanUpAll"}},[a("el-radio",{attrs:{label:1}},[e._v("全部")]),e._v(" "),a("el-radio",{attrs:{label:0}},[e._v("部分")])],1)],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.onSubmit("form")}}},[e._v("立即创建")]),e._v(" "),a("el-button",{on:{click:function(t){e.dialogVisible=!1}}},[e._v("取消")])],1)],1)],1)],1)},staticRenderFns:[]},r=a("VU/8")(i,n,!1,null,null,null);t.a=r.exports},sjnz:function(e,t,a){"use strict";var i={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("span",[a("el-button",{style:{float:"right",margin:"0 10px 0 0"},attrs:{slot:"reference",size:"mini",type:"info",plain:""},on:{click:e.showDialog},slot:"reference"},[e._v("批量分类")]),e._v(" "),a("el-dialog",{directives:[{name:"dialogDrag",rawName:"v-dialogDrag"}],ref:"dialog__wrapper",attrs:{title:"批量选择分类标签",width:"250px",visible:e.dialogFormVisible},on:{"update:visible":function(t){e.dialogFormVisible=t}}},[a("el-cascader",{attrs:{"collapse-tags":"",placeholder:"分类",options:e.filterData,props:{multiple:!0,children:"childrenList",label:"typeCname",value:"id"},filterable:"",size:"medium"},model:{value:e.form.typeParentPath,callback:function(t){e.$set(e.form,"typeParentPath",t)},expression:"form.typeParentPath"}}),e._v(" "),a("el-cascader",{attrs:{placeholder:"标签",options:e.tagsData,filterable:"",props:{multiple:!0,children:"childrenList",label:"typeCname",value:"id"}},model:{value:e.form.tagParentPath,callback:function(t){e.$set(e.form,"tagParentPath",t)},expression:"form.tagParentPath"}}),e._v(" "),a("div",{staticStyle:{"text-align":"center"}},[a("el-button",{attrs:{type:"warning",size:"mini",icon:"el-icon-edit"},on:{click:e.batchUpdate}})],1)],1)],1)},staticRenderFns:[]},n=a("VU/8")({name:"ClassBatches",props:["classifyData","tagsData","selectedIDs"],data:function(){return{dialogFormVisible:!1,form:{}}},computed:{filterData:function(){var e=this.classifyData;return e.forEach(function(e){e.childrenList.length>0?e.childrenList.forEach(function(e){e.childrenList.length>0?e.childrenList.forEach(function(e){e.childrenList.length>0?e.childrenList.forEach(function(e){delete e.childrenList}):delete e.childrenList}):delete e.childrenList}):delete e.childrenList}),e}},methods:{batchUpdate:function(){var e=this;this.$confirm("确定全部修改吗?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){e.$emit("batchUpdateClass",e.form),e.dialogFormVisible=!1}).catch(function(){e.$message({type:"info",message:"已取消操作"})})},showDialog:function(){this.selectedIDs.length>0?this.dialogFormVisible=!0:this.$message({type:"warning",message:"请勾选"})}}},i,!1,null,null,null);t.a=n.exports}});