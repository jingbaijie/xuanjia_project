webpackJsonp([24],{F6ch:function(t,e){},Uu9M:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});a("zL8q");var i=a("nfHz"),l=a("VxYR"),r=a("RcBM"),n=a("bOdI"),s=a.n(n),o=a("QoLB"),c=a("oudX"),d=a.n(c),u={name:"classifyForm",props:["lists"],data:function(){var t;return t={iconView:!1,dialogFormVisible:!1,mtBtn:"-根目录-",action:"",menuId:"",detailPicUrl:d.a,labelPicUrl:d.a,iconPicUrl:d.a,form:{},formLabelWidth:"120px",value:[1,4],parentData:[],preBtn:!0,nextBtn:!1,pageTotle:0,currentPage:1},s()(t,"dialogFormVisible",!1),s()(t,"imagesBaseUrl",window.configs.static_IMAGES_BASEURL),s()(t,"action",""),s()(t,"imgData",[]),s()(t,"rules",{typeCname:[{required:!0,message:"必填项",trigger:"blur"}]}),t},inject:["getClassifyData"],components:{image_choice:o.a},methods:{addClassify:function(){this.dialogFormVisible=!0,this.parentData=this.getClassifyData(),this.form={},this.detailPicUrl=d.a,this.labelPicUrl=d.a,this.iconPicUrl=d.a},editClassify:function(t){this.dialogFormVisible=!0,this.parentData=this.getClassifyData(),this.form=t,this.form.parentId=t.parent.id,t.detailPic?this.detailPicUrl=this.imagesBaseUrl+t.detailPic.picPath:this.detailPicUrl=d.a,t.labelPic?this.labelPicUrl=this.imagesBaseUrl+t.labelPic.picPath:this.labelPicUrl=d.a,t.iconPic?this.iconPicUrl=this.imagesBaseUrl+t.iconPic.picPath:this.iconPicUrl=d.a},setImg:function(t,e){0==e?(this.labelPicUrl=this.imagesBaseUrl+t.picPath,this.form.labelPic=t):1==e?(this.detailPicUrl=this.imagesBaseUrl+t.picPath,this.form.detailPic=t):(this.iconPicUrl=this.imagesBaseUrl+t.picPath,this.form.iconPic=t)},onSubmit:function(t){var e=this;this.$refs[t].validate(function(t){if(!t)return!1;"add"==e.action?(e.form.parent={},e.form.parent.id=e.form.parentId,e.$store.dispatch("axios_add_labelContent",e.form).then(function(t){e.$message.success("添加成功"),e.$emit("refreshLabel")}).catch(function(t){e.$message.error("添加失败")})):e.$store.dispatch("axios_edit_labelContent",e.form).then(function(t){e.$message.success("修改成功"),e.$emit("refreshLabel")}).catch(function(t){e.$message.error("修改失败")}),e.dialogFormVisible=!1})}},mounted:function(){var t=this;i.a.$on("addLabel",function(){t.action="add",t.addClassify()}),i.a.$on("editLabel",function(e){t.action="edit",t.editClassify(e)})},beforeDestroy:function(){i.a.$off(["addLabel","editLabel"])}},f={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("el-dialog",{directives:[{name:"dialogDrag",rawName:"v-dialogDrag"}],ref:"dialog__wrapper",attrs:{width:"40vw",title:"添加标签",visible:t.dialogFormVisible},on:{"update:visible":function(e){t.dialogFormVisible=e}}},[a("el-form",{ref:"form",attrs:{model:t.form,rules:t.rules}},[a("el-form-item",{attrs:{label:"标签名称",prop:"typeCname","label-width":t.formLabelWidth}},[a("el-input",{attrs:{type:"text"},model:{value:t.form.typeCname,callback:function(e){t.$set(t.form,"typeCname",e)},expression:"form.typeCname"}})],1),t._v(" "),a("el-form-item",{style:{width:"60%"},attrs:{label:"产品名称","label-width":t.formLabelWidth}},[a("div",{staticClass:"block"},[a("el-select",{attrs:{placeholder:"请选择"},model:{value:t.form.parentId,callback:function(e){t.$set(t.form,"parentId",e)},expression:"form.parentId"}},t._l(t.parentData,function(t){return a("el-option",{key:t.id,attrs:{label:t.typeCname,value:t.id}})}),1)],1)]),t._v(" "),a("el-form-item",{attrs:{label:"标签图片","label-width":t.formLabelWidth}},[a("el-popover",{attrs:{placement:"right",width:"535",trigger:"hover"}},[a("img",{staticClass:"flagImage",attrs:{slot:"reference",src:t.labelPicUrl},slot:"reference"}),t._v(" "),a("image_choice",{on:{getSelectImage:function(e){return t.setImg(e,0)}}})],1)],1),t._v(" "),a("el-form-item",{attrs:{label:"详情图片","label-width":t.formLabelWidth}},[a("el-popover",{attrs:{placement:"right",width:"535",trigger:"hover"}},[a("img",{staticClass:"flagImage",attrs:{slot:"reference",src:t.detailPicUrl},slot:"reference"}),t._v(" "),a("image_choice",{on:{getSelectImage:function(e){return t.setImg(e,1)}}})],1)],1),t._v(" "),a("el-form-item",{attrs:{label:"图标","label-width":t.formLabelWidth}},[a("el-popover",{attrs:{placement:"right",width:"535",trigger:"hover"}},[a("img",{staticClass:"flagImage",attrs:{slot:"reference",src:t.iconPicUrl},slot:"reference"}),t._v(" "),a("image_choice",{on:{getSelectImage:function(e){return t.setImg(e,2)}}})],1)],1),t._v(" "),a("el-form-item",{attrs:{label:"排行ID","label-width":t.formLabelWidth}},[a("el-input-number",{attrs:{min:0,"controls-position":"right"},model:{value:t.form.rankId,callback:function(e){t.$set(t.form,"rankId",e)},expression:"form.rankId"}})],1)],1),t._v(" "),t._t("default",null,{bbbbb:t.lists}),t._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:function(e){return t.onSubmit("form")}}},[t._v("提 交")])],1)],2)],1)},staticRenderFns:[]};var m={name:"labelList",components:{labelForm:a("VU/8")(u,f,!1,function(t){a("XJAU")},"data-v-35689e86",null).exports,Pagination:r.a,keySearch:l.a},data:function(){return{menuId:this.getMenuId(),dialogVisible:!1,showVlaue:{0:"禁用",1:"启用"},currentPage:1,pageSize:10,radio:1,total:1,imagesBaseUrl:window.configs.static_IMAGES_BASEURL,detailData:[],classifyData:[],curProductId:"",curProductName:"",labelData:[],searchVal:"",loading:!0,tableHeight:void 0,formLabelWidth:"120px",userPermission:{select:!1,delete:!1,insert:!1,update:!1},defaultProps:{children:"childrenList",label:"typeCname",value:"id",checkStrictly:!0,expandTrigger:"hover",emitPath:!1}}},provide:function(){var t=this;return{setClassifyData:function(e){return t.classifyData=e},getClassifyData:function(){return t.classifyData}}},inject:["getMenuId"],created:function(){console.log("tag insert : ",this.isAuth("system:tag:insert")),console.log("tag edit : ",this.isAuth("system:tag:update")),console.log("tag list : ",this.isAuth("system:tag:list")),console.log("tag delete : ",this.isAuth("system:tag:delete")),this.getProductList()},mounted:function(){this.isAuth("system:tag:list")&&(this.tableHeight=window.innerHeight-this.$refs.multipleTable.$el.offsetTop-200+"")},methods:{searchDate:function(t){this.searchVal=t,this.getTypeInfo(this.curProductId)},refreshLabel:function(){this.getTypeInfo(this.curProductId)},formateClass:function(t){var e=[];return t.forEach(function(t){e.push(t.typeCname)}),e.join()},getProductList:function(){var t=this;this.$store.dispatch("axios_get_productList",{menuId:this.menuId}).then(function(e){"undefined"!=e&&(t.classifyData=e.data.data,e.data.data.length>0&&(t.curProductId=t.classifyData[0].id,t.getTypeInfo(t.curProductId))),t.loading=!1}).catch(function(e){t.loading=!1})},getTypeInfo:function(t){var e=this;this.$store.dispatch("axios_get_tagList",{searchValue:this.searchVal,productId:t,pageNum:this.currentPage,pageSize:this.pageSize}).then(function(t){e.loading=!1,e.labelData=t.data.data.list.records,e.btns=t.data.data.btns,e.total=t.data.data.list.total}).catch(function(t){e.loading=!1})},getDetailList:function(t){var e=this;this.$store.dispatch("axios_get_labelContent",{typeId:t,contentType:"1"}).then(function(t){e.dialogVisible=!0,e.detailData=t.data.data.records}).catch(function(t){})},nodeClick:function(t,e,a){this.loading=!0,this.currentPage=1,this.curProductId=t.id,this.curProductName=t.typeCname,this.getTypeInfo(t.id)},handleCreate:function(){i.a.$emit("addLabel")},handleEdit:function(t,e){i.a.$emit("editLabel",e[t])},handleDelete:function(t,e){var a=this;this.$confirm("此操作将永久删除该条数据, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){a.$store.dispatch("axios_del_labelContent",{ids:e[t].id}).then(function(t){"1000"==t.data.errorCode?(a.refreshLabel(a.curProductId),a.$message({message:t.data.errorMsg,type:"success"})):a.$message({message:t.data.errorMsg,type:"warning"})}).catch(function(t){})}).catch(function(){a.$message({type:"info",message:"已取消删除"})})},toggleSelection:function(t){var e=this;t?t.forEach(function(t){e.$refs.multipleTable.toggleRowSelection(t)}):this.$refs.multipleTable.clearSelection()},handleSelectionChange:function(t){this.multipleSelection=t}}},p={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("el-row",[a("el-col",{attrs:{span:4}},[a("div",{staticClass:"grid-content bg-purple"},[a("p",[t._v("产品/标签")]),t._v(" "),a("el-tree",{attrs:{data:t.classifyData,"node-key":"id","expand-on-click-node":!1,props:t.defaultProps},on:{"node-click":t.nodeClick}})],1)]),t._v(" "),a("el-col",{attrs:{span:20}},[a("div",[a("keySearch",{on:{searchData:t.searchDate}}),t._v(" "),t.isAuth("system:tag:insert")?a("el-button",{style:{float:"right",margin:"20px 70px 0 0"},attrs:{size:"mini",type:"primary",plain:""},on:{click:function(e){return t.handleCreate()}}},[t._v("新增")]):t._e(),t._v(" "),a("el-breadcrumb",{style:{margin:"20px 0 50px 30px","font-size":"18px"},attrs:{"separator-class":"el-icon-arrow-right"}},[a("el-breadcrumb-item",[t._v(t._s(t.curProductName))])],1),t._v(" "),t.isAuth("system:tag:list")?a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],ref:"multipleTable",attrs:{data:t.labelData,height:t.tableHeight}},[a("el-table-column",{attrs:{align:"center",prop:"typeCname",label:"标签名称"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("a",{style:{color:" #409EFF",cursor:"pointer"},on:{click:function(a){return t.getDetailList(e.row.id)}}},[t._v(t._s(e.row.typeCname))])]}}],null,!1,2581817671)}),t._v(" "),a("el-table-column",{attrs:{prop:"createTime",label:"创建时间"}}),t._v(" "),a("el-table-column",{attrs:{label:"详情图"},scopedSlots:t._u([{key:"default",fn:function(e){return[e.row.detailPic?a("img",{style:{width:"50px"},attrs:{src:t.imagesBaseUrl+e.row.detailPic.picPath}}):t._e()]}}],null,!1,2913518360)}),t._v(" "),a("el-table-column",{attrs:{label:"标签图"},scopedSlots:t._u([{key:"default",fn:function(e){return[e.row.labelPic?a("img",{style:{width:"50px"},attrs:{src:t.imagesBaseUrl+e.row.labelPic.picPath}}):t._e()]}}],null,!1,2392934424)}),t._v(" "),a("el-table-column",{attrs:{label:"图标"},scopedSlots:t._u([{key:"default",fn:function(e){return[e.row.iconPic?a("img",{style:{width:"50px"},attrs:{src:t.imagesBaseUrl+e.row.iconPic.picPath}}):t._e()]}}],null,!1,4047160536)}),t._v(" "),a("el-table-column",{attrs:{align:"center",label:"操作",width:"300"},scopedSlots:t._u([{key:"default",fn:function(e){return[t.isAuth("system:tag:update")?a("el-button",{attrs:{plain:"",size:"mini",type:"warning"},on:{click:function(a){return t.handleEdit(e.$index,t.labelData)}}},[t._v("编 辑")]):t._e(),t._v(" "),t.isAuth("system:tag:delete")?a("el-button",{attrs:{plain:"",size:"mini",type:"danger"},on:{click:function(a){return t.handleDelete(e.$index,t.labelData)}}},[t._v("删 除")]):t._e()]}}],null,!1,1733417391)})],1):t._e(),t._v(" "),t.isAuth("system:tag:list")?t._e():a("div",{staticClass:"msg"},[t._v("暂无权限")]),t._v(" "),t.isAuth("system:tag:list")?a("pagination",{directives:[{name:"show",rawName:"v-show",value:t.total>0,expression:"total>0"}],attrs:{total:t.total,page:t.currentPage,limit:t.pageSize},on:{"update:page":function(e){t.currentPage=e},"update:limit":function(e){t.pageSize=e},pagination:function(e){return t.getTypeInfo(t.curProductId)}}}):t._e()],1)])],1),t._v(" "),a("el-dialog",{attrs:{title:"标签内容",visible:t.dialogVisible,width:"80%"},on:{"update:visible":function(e){t.dialogVisible=e}}},[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],ref:"multipleTable",attrs:{data:t.detailData}},[a("el-table-column",{attrs:{prop:"cartoonCname",label:"中文名称"}}),t._v(" "),a("el-table-column",{attrs:{prop:"cartoonEname",label:"英文名称"}}),t._v(" "),a("el-table-column",{attrs:{prop:"typeInfoList",label:"分类名称"},scopedSlots:t._u([{key:"default",fn:function(e){return[null!=e.row.typeInfoList?a("el-popover",{attrs:{placement:"top-start",width:"200",trigger:"hover"}},[t._l(e.row.typeInfoList,function(e,i){return a("el-tag",{key:i,style:{margin:"0 0 5px 5px"}},[t._v(t._s(e.typeCname))])}),t._v(" "),a("el-button",{attrs:{slot:"reference",size:"mini"},slot:"reference"},[t._v(t._s(e.row.typeInfoList[0].typeCname))])],2):t._e()]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"cspInfo.cpCname",label:"CP/SP信息"}}),t._v(" "),a("el-table-column",{attrs:{prop:"cartoonProprietorsStarttime",label:"版权开始时间"}}),t._v(" "),a("el-table-column",{attrs:{prop:"cartoonProprietorsEndtime",label:"版权结束时间"}}),t._v(" "),a("el-table-column",{attrs:{prop:"cartoonProprietors",label:"版权方"}}),t._v(" "),a("el-table-column",{attrs:{prop:"cartoonSumvideonum",label:"总集数"}}),t._v(" "),a("el-table-column",{attrs:{prop:"booleanUp",label:"是否上架"}}),t._v(" "),a("el-table-column",{attrs:{label:"图片"},scopedSlots:t._u([{key:"default",fn:function(e){return[e.row.iconPic?a("img",{style:{width:"50px"},attrs:{src:t.imagesBaseUrl+e.row.iconPic.picPath}}):t._e()]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"productInfoList",label:"产品名称"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(t._s(t.formateClass(e.row.productInfoList)))]}}])})],1),t._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:function(e){t.dialogVisible=!1}}},[t._v("确 定")])],1)],1),t._v(" "),a("labelForm",{on:{refreshLabel:t.refreshLabel},scopedSlots:t._u([{key:"default",fn:function(e){return[a("div",[t._v(t._s(e.bbbbb))])]}}])})],1)},staticRenderFns:[]};var h=a("VU/8")(m,p,!1,function(t){a("F6ch")},"data-v-7a8130f2",null);e.default=h.exports},XJAU:function(t,e){}});