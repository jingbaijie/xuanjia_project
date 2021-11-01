webpackJsonp([21],{QCBb:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});a("zL8q");var i=a("nfHz"),l=a("bOdI"),s=a.n(l),n=(a("oudX"),{name:"giftForm",inject:["getActiveData","getMenuId"],data:function(){var e;return e={contentType:[{value:0,contentType:"全部"},{value:1,contentType:"卡通"},{value:2,contentType:"游戏"}],titleE:{New:"新建",Edit:"编辑"},dialogFormVisible:!1,action:"",activeData:[],form:{},searchValue:"",formLabelWidth:"120px",imgData:[],currentPage:1,menuId:this.getMenuId(),listType:[{value:1,label:"黑名单"},{value:0,label:"白名单"}],userList:[]},s()(e,"titleE",{New:"新建",Edit:"编辑"}),s()(e,"rules",{userId:[{required:!0,message:"必填项",trigger:"blur"}]}),e},created:function(){this.loadUserData(this.currentPage)},methods:{bySearchValue:function(e){this.searchValue=e,this.loadUserData(this.currentPage)},loadUserData:function(e){var t=this;this.$store.dispatch("axios_get_userList",{pageNum:e,searchValue:this.searchValue}).then(function(e){t.userList=e.data.data.records})},loadScrollData:function(e){var t=this;e&&this.$store.dispatch("axios_get_userList",{pageNum:++this.currentPage,searchValue:this.searchValue}).then(function(e){t.userList=t.userList.concat(e.data.data.records)})},addGift:function(){this.action="New",this.dialogFormVisible=!0,this.form={}},editGift:function(e){this.form=e,this.action="Edit",this.dialogFormVisible=!0},onSubmit:function(e){var t=this;this.$refs[e].validate(function(e){if(!e)return!1;"New"==t.action?t.$store.dispatch("axios_add_blackList",t.form).then(function(e){t.$message.success("添加成功"),t.$emit("refreshBlack")}).catch(function(e){t.$message.error("添加失败")}):"Edit"==t.action&&t.$store.dispatch("axios_edit_blackList",t.form).then(function(e){t.$message.success("修改成功"),t.$emit("refreshBlack")}).catch(function(e){t.$message.error("修改失败")}),t.dialogFormVisible=!1})}},mounted:function(){var e=this;i.a.$on("addBlackList",function(t){e.addGift()}),i.a.$on("editBlackList",function(t){e.editGift(t)})},beforeDestroy:function(){i.a.$off(["addBlackList","editBlackList"])}}),o={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("el-dialog",{directives:[{name:"dialogDrag",rawName:"v-dialogDrag"}],ref:"dialog__wrapper",attrs:{title:e.titleE[e.action],visible:e.dialogFormVisible,width:"550px"},on:{"update:visible":function(t){e.dialogFormVisible=t}}},[a("el-form",{ref:"form",attrs:{model:e.form,rules:e.rules}},[a("el-form-item",{attrs:{label:"用户编号",prop:"userId","label-width":e.formLabelWidth}},[a("el-input",{attrs:{placeholder:"请输入"},model:{value:e.form.userId,callback:function(t){e.$set(e.form,"userId",t)},expression:"form.userId"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"名单类型","label-width":e.formLabelWidth}},[a("el-select",{attrs:{placeholder:"请选择"},model:{value:e.form.userType,callback:function(t){e.$set(e.form,"userType",t)},expression:"form.userType"}},e._l(e.listType,function(e){return a("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}),1)],1),e._v(" "),a("el-form-item",{attrs:{label:"内容类型","label-width":e.formLabelWidth}},[a("el-select",{attrs:{placeholder:"请选择"},model:{value:e.form.codeType,callback:function(t){e.$set(e.form,"codeType",t)},expression:"form.codeType"}},e._l(e.contentType,function(e){return a("el-option",{key:e.value,attrs:{label:e.contentType,value:e.value}})}),1)],1),e._v(" "),a("el-form-item",{attrs:{label:"生效时间","label-width":e.formLabelWidth}},[a("el-date-picker",{attrs:{"value-format":"yyyy-MM-dd",type:"date",placeholder:"选择日期"},model:{value:e.form.startTime,callback:function(t){e.$set(e.form,"startTime",t)},expression:"form.startTime"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"失效时间","label-width":e.formLabelWidth}},[a("el-date-picker",{attrs:{"value-format":"yyyy-MM-dd",type:"date",placeholder:"选择日期"},model:{value:e.form.endTime,callback:function(t){e.$set(e.form,"endTime",t)},expression:"form.endTime"}})],1)],1),e._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.onSubmit("form")}}},[e._v("确 定")])],1)],1)],1)},staticRenderFns:[]};var r=a("VU/8")(n,o,!1,function(e){a("wAo/")},"data-v-d960faa4",null).exports,c=a("VxYR"),u={name:"giftList",inject:["getMenuId"],components:{blackForm:r,Pagination:a("RcBM").a,keySearch:c.a},data:function(){return{contentType:{0:"全部",1:"卡通",2:"游戏"},listType:{1:"黑名单",0:"白名单"},imagesBaseUrl:window.configs.static_IMAGES_BASEURL,currentPage:1,pageSize:10,total:1,menuId:this.getMenuId(),giftList:[],activeData:[],search:"",loading:!0,tableHeight:void 0,prizeFrom:["活动","平台"]}},provide:function(){var e=this;return{setActioveData:function(t){e.activeData=t},getActiveData:function(){return e.activeData}}},created:function(){console.log("black insert : ",this.isAuth("system:black:insert")),console.log("black edit : ",this.isAuth("system:black:update")),console.log("black list : ",this.isAuth("system:black:list")),console.log("black delete : ",this.isAuth("system:black:delete")),this.getBlackList()},mounted:function(){this.isAuth("system:black:insert")&&(this.tableHeight=window.innerHeight-this.$refs.multipleTable.$el.offsetTop-200)},methods:{refreshBlack:function(){this.getBlackList()},getBlackList:function(e){var t=this;this.$store.dispatch("axios_get_blackList",{searchValue:e,menuId:this.menuId,pageNum:this.currentPage,pageSize:this.pageSize}).then(function(e){"undefined"!=e&&(t.giftList=e.data.data.list.records,t.total=e.data.data.list.total),t.loading=!1}).catch(function(e){t.loading=!1})},handleCreate:function(){i.a.$emit("addBlackList")},handleEdit:function(e,t){i.a.$emit("editBlackList",t[e],this.giftList)},handleDelete:function(e,t){var a=this;this.$confirm("此操作将永久删除该条数据, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){a.$store.dispatch("axios_del_blackList",{ids:t[e].id}).then(function(e){"1000"==e.data.errorCode?(a.refreshBlack(),a.$message({message:e.data.errorMsg,type:"success"})):a.$message({message:e.data.errorMsg,type:"warning"})}).catch(function(e){a.$message({message:"删除失败，服务器暂无响应！",type:"error"})})}).catch(function(){a.$message({type:"info",message:"已取消删除"})})},toggleSelection:function(e){var t=this;e?e.forEach(function(e){t.$refs.multipleTable.toggleRowSelection(e)}):this.$refs.multipleTable.clearSelection()},handleSelectionChange:function(e){this.multipleSelection=e}},destroyed:function(){i.a.$off(["editGift","addGift"])}},d={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("div",{staticClass:"btn_area"},[a("div",{staticClass:"add_btn"},[a("keySearch",{on:{searchData:e.getBlackList}}),e._v(" "),e.isAuth("system:black:insert")?a("el-button",{style:{float:"right",margin:"0 70px 0 0"},attrs:{size:"mini",type:"primary",plain:""},on:{click:function(t){return e.handleCreate()}}},[e._v("新增")]):e._e()],1)]),e._v(" "),e.isAuth("system:black:list")?a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"multipleTable",staticStyle:{width:"100%"},attrs:{data:e.giftList,height:e.tableHeight},on:{"selection-change":e.handleSelectionChange}},[a("el-table-column",{attrs:{type:"selection",width:"55"}}),e._v(" "),a("el-table-column",{attrs:{prop:"id",label:"主键"}}),e._v(" "),a("el-table-column",{attrs:{prop:"userId",label:"用户编号"}}),e._v(" "),a("el-table-column",{attrs:{prop:"codeType",label:"内容类型"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(e.contentType[t.row.codeType]))]}}],null,!1,897045023)}),e._v(" "),a("el-table-column",{attrs:{prop:"userType",label:"名单类型"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(e.listType[t.row.userType]))]}}],null,!1,1409393960)}),e._v(" "),a("el-table-column",{attrs:{prop:"startTime",label:"生效时间"}}),e._v(" "),a("el-table-column",{attrs:{prop:"endTime",label:"失效时间"}}),e._v(" "),a("el-table-column",{attrs:{prop:"createTime",label:"创建时间"}}),e._v(" "),a("el-table-column",{attrs:{prop:"filemTime",label:"修改时间"}}),e._v(" "),a("el-table-column",{attrs:{align:"center",label:"操作",width:"160"},scopedSlots:e._u([{key:"default",fn:function(t){return[e.isAuth("system:black:update")?a("el-button",{attrs:{plain:"",size:"mini",type:"warning"},on:{click:function(a){return e.handleEdit(t.$index,e.giftList)}}},[e._v("编 辑")]):e._e(),e._v(" "),e.isAuth("system:black:delete")?a("el-button",{attrs:{plain:"",size:"mini",type:"danger"},on:{click:function(a){return e.handleDelete(t.$index,e.giftList)}}},[e._v("删 除")]):e._e()]}}],null,!1,2224069839)})],1):e._e(),e._v(" "),a("blackForm",{on:{refreshBlack:e.getBlackList}}),e._v(" "),e.isAuth("system:black:list")?e._e():a("div",{staticClass:"msg"},[e._v("暂无权限")]),e._v(" "),e.isAuth("system:black:list")?a("pagination",{directives:[{name:"show",rawName:"v-show",value:e.total>0,expression:"total>0"}],attrs:{total:e.total,page:e.currentPage,limit:e.pageSize},on:{"update:page":function(t){e.currentPage=t},"update:limit":function(t){e.pageSize=t},pagination:function(t){return e.getBlackList()}}}):e._e()],1)},staticRenderFns:[]};var f=a("VU/8")(u,d,!1,function(e){a("YS2k")},"data-v-49cebaec",null);t.default=f.exports},YS2k:function(e,t){},"wAo/":function(e,t){}});