webpackJsonp([14],{"5RdI":function(t,e){},QtnF:function(t,e){},cN5c:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=i("zL8q"),s=i("nfHz"),o=i("VxYR"),n={name:"giftForm",props:["menuId"],data:function(){return{dialogFormVisible:!1,action:"",statusType:[{id:"0",name:"活动"},{id:"1",name:"平台"}],form:{dictName:"",dictType:"",status:0,remark:""},formLabelWidth:"120px",titleE:{New:"新增",Edit:"编辑"},rules:{dictName:[{required:!0,message:"必填项",trigger:"blur"}]}}},methods:{addDict:function(){this.action="New",this.dialogFormVisible=!0,this.form={status:0}},editDict:function(t){this.form=t,this.action="Edit",this.dialogFormVisible=!0},onSubmit:function(t){var e=this;this.$refs[t].validate(function(t){if(!t)return!1;e.form.status?e.form.status=1:e.form.status=0,"New"==e.action?e.$store.dispatch("axios_add_dictTypeList",e.form).then(function(t){e.$message.success("添加成功"),s.a.$emit("refreshDict")}).catch(function(t){e.$message.error("添加失败")}):"Edit"==e.action&&e.$store.dispatch("axios_edit_dictTypeList",e.form).then(function(t){e.$message.success("修改成功"),s.a.$emit("refreshDict")}).catch(function(t){e.$message.error("修改失败")}),e.dialogFormVisible=!1})}},mounted:function(){var t=this;s.a.$on("addDictType",function(e){t.addDict()}),s.a.$on("editDictType",function(e){t.editDict(e)})},beforeDestroy:function(){s.a.$off("addDictType"),s.a.$off("editDictType")}},l={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("el-dialog",{directives:[{name:"dialogDrag",rawName:"v-dialogDrag"}],ref:"dialog__wrapper",attrs:{title:t.titleE[t.action],visible:t.dialogFormVisible},on:{"update:visible":function(e){t.dialogFormVisible=e}}},[i("el-form",{ref:"form",attrs:{model:t.form,rules:t.rules}},[i("el-form-item",{attrs:{label:"字典名称",prop:"dictName","label-width":t.formLabelWidth}},[i("el-input",{attrs:{autocomplete:"off"},model:{value:t.form.dictName,callback:function(e){t.$set(t.form,"dictName",e)},expression:"form.dictName"}})],1),t._v(" "),i("el-form-item",{attrs:{label:"字典类型","label-width":t.formLabelWidth}},[i("el-input",{attrs:{autocomplete:"off"},model:{value:t.form.dictType,callback:function(e){t.$set(t.form,"dictType",e)},expression:"form.dictType"}})],1),t._v(" "),i("el-form-item",{attrs:{label:"状态","label-width":t.formLabelWidth}},[i("el-switch",{style:{"margin-left":"20px"},attrs:{"active-value":1,"inactive-value":0},model:{value:t.form.status,callback:function(e){t.$set(t.form,"status",e)},expression:"form.status"}})],1),t._v(" "),i("el-form-item",{attrs:{label:"备注","label-width":t.formLabelWidth}},[i("el-input",{attrs:{type:"",autocomplete:"off"},model:{value:t.form.remark,callback:function(e){t.$set(t.form,"remark",e)},expression:"form.remark"}})],1)],1),t._v(" "),i("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{attrs:{type:"primary"},on:{click:function(e){return t.onSubmit("form")}}},[t._v("确 定")])],1)],1)],1)},staticRenderFns:[]};var r={name:"giftForm",inject:["getMenuId"],data:function(){return{dialogFormVisible:!1,menuId:this.getMenuId(),action:"",form:{},formLabelWidth:"120px",imgData:[],titleE:{New:"新建",Edit:"编辑"},rules:{dictLabel:[{required:!0,message:"请填写字典名称",trigger:"blur"}],dictValue:[{required:!0,message:"请填写字典键值",trigger:"blur"}]}}},created:function(){},methods:{addGift:function(t){this.action="New",this.dialogFormVisible=!0,this.form={dictType:t}},editGift:function(t,e){this.form=t,this.action="Edit",this.dialogFormVisible=!0},onSubmit:function(){var t=this;"New"==this.action?this.$store.dispatch("axios_add_dictDataList",this.form).then(function(e){t.$message.success("添加成功"),s.a.$emit("refreshDetail")}).catch(function(e){t.$message.error("添加失败")}):"Edit"==this.action&&this.$store.dispatch("axios_edit_dictDataList",this.form).then(function(e){t.$message.success("修改成功"),s.a.$emit("refreshDetail")}).catch(function(e){t.$message.error("修改失败")}),this.dialogFormVisible=!1}},mounted:function(){var t=this;s.a.$on("addDictData",function(e){t.addGift(e)}),s.a.$on("editDictData",function(e){t.editGift(e)})},beforeDestroy:function(){s.a.$off("addGift"),s.a.$off("editGift")}},c={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("el-dialog",{directives:[{name:"dialogDrag",rawName:"v-dialogDrag"}],ref:"dialog__wrapper",attrs:{title:t.titleE[t.action],visible:t.dialogFormVisible},on:{"update:visible":function(e){t.dialogFormVisible=e}}},[i("el-form",{ref:"form",attrs:{model:t.form,rules:t.rules}},[i("el-form-item",{attrs:{label:"字典类型",prop:"dictType","label-width":t.formLabelWidth}},[i("el-input",{attrs:{disabled:!0,autocomplete:"off"},model:{value:t.form.dictType,callback:function(e){t.$set(t.form,"dictType",e)},expression:"form.dictType"}})],1),t._v(" "),i("el-form-item",{attrs:{label:"字典名称",prop:"dictLabel","label-width":t.formLabelWidth}},[i("el-input",{attrs:{autocomplete:"off"},model:{value:t.form.dictLabel,callback:function(e){t.$set(t.form,"dictLabel",e)},expression:"form.dictLabel"}})],1),t._v(" "),i("el-form-item",{attrs:{label:"字典键值",prop:"dictValue","label-width":t.formLabelWidth}},[i("el-input",{attrs:{autocomplete:"off"},model:{value:t.form.dictValue,callback:function(e){t.$set(t.form,"dictValue",e)},expression:"form.dictValue"}})],1),t._v(" "),i("el-form-item",{attrs:{label:"字典排序","label-width":t.formLabelWidth}},[i("el-input",{attrs:{autocomplete:"off"},model:{value:t.form.dictSort,callback:function(e){t.$set(t.form,"dictSort",e)},expression:"form.dictSort"}})],1),t._v(" "),i("el-form-item",{attrs:{label:"状态","label-width":t.formLabelWidth}},[i("el-switch",{style:{"margin-left":"20px"},attrs:{"active-value":1,"inactive-value":0},model:{value:t.form.status,callback:function(e){t.$set(t.form,"status",e)},expression:"form.status"}})],1),t._v(" "),i("el-form-item",{attrs:{label:"是否默认","label-width":t.formLabelWidth}},[i("el-switch",{style:{"margin-left":"20px"},attrs:{"active-value":1,"inactive-value":0},model:{value:t.form.isDefault,callback:function(e){t.$set(t.form,"isDefault",e)},expression:"form.isDefault"}})],1),t._v(" "),i("el-form-item",{attrs:{label:"备注","label-width":t.formLabelWidth}},[i("el-input",{attrs:{autocomplete:"off"},model:{value:t.form.remark,callback:function(e){t.$set(t.form,"remark",e)},expression:"form.remark"}})],1)],1),t._v(" "),i("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{attrs:{type:"primary"},on:{click:function(e){return t.onSubmit()}}},[t._v("确 定")])],1)],1)],1)},staticRenderFns:[]};var d={name:"dictList",inject:["getMenuId"],components:{dictionaryForm:i("VU/8")(n,l,!1,function(t){i("QtnF")},"data-v-f4bad830",null).exports,dictionaryDataForm:i("VU/8")(r,c,!1,function(t){i("lbem")},"data-v-592fee79",null).exports,Pagination:i("RcBM").a,keySearch:o.a},data:function(){return{total:0,currentPage:1,pageSize:10,menuId:this.getMenuId(),dialogVisible:!1,dictTypeList:[],dictDataList:[],curDictType:"",search:"",loading:!0,tableHeight:void 0,curIndex:"",curData:"",dictionaryState:{0:"不可用",1:"可用"}}},provide:function(){return{}},created:function(){var t=this;console.log("dict insert : ",this.isAuth("system:dict:insert")),console.log("dict edit : ",this.isAuth("system:dict:update")),console.log("dict list : ",this.isAuth("system:dict:list")),console.log("dict delete : ",this.isAuth("system:dict:delete")),this.getDictList(),s.a.$on("refreshDict",function(){t.getDictList()}),s.a.$on("refreshDetail",function(){t.showDetail(t.curIndex,t.curData)})},mounted:function(){this.isAuth("system:dict:insert")&&(this.tableHeight=window.innerHeight-this.$refs.multipleTable.$el.offsetTop-200)},methods:{showDetail:function(t,e){var i=this;this.curIndex=t,this.curData=e,this.$store.dispatch("axios_get_dictDataList",{menuId:this.menuId,pageSize:100,dictType:e[t].dictType}).then(function(a){i.curDictType=e[t].dictType,i.dictDataList=a.data.data.list.records}).catch(function(t){}),this.dialogVisible=!0},getDictList:function(t){var e=this;this.$store.dispatch("axios_get_dictTypeList",{searchValue:t,menuId:this.menuId,pageNum:this.currentPage,pageSize:this.pageSize}).then(function(t){"undefined"!=t&&(e.dictTypeList=t.data.data.list.records,e.total=t.data.data.list.total),e.loading=!1}).catch(function(t){e.loading=!1})},handleCreate:function(){s.a.$emit("addDictType")},handleCreate2:function(){s.a.$emit("addDictData",this.curDictType)},handleEdit:function(t,e){s.a.$emit("editDictType",e[t])},handleEdit2:function(t,e){e[t].dictType=this.curDictType,s.a.$emit("editDictData",e[t])},handleDelete:function(t,e){var i=this;this.$confirm("此操作将永久删除该条数据, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){i.$store.dispatch("axios_del_dictTypeList",{ids:e[t].id}).then(function(s){"1000"==s.data.errorCode?(Object(a.Message)({message:s.data.errorMsg,type:"success"}),e.splice(t,1),i.getDictList()):Object(a.Message)({message:s.data.errorMsg,type:"warning"})}).catch(function(t){Object(a.Message)({message:"删除失败，服务器暂无响应！",type:"error"})})}).catch(function(){i.$message({type:"info",message:"已取消删除"})})},handleDelete2:function(t,e){var i=this;this.$confirm("此操作将永久删除该条数据, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){i.$store.dispatch("axios_del_dictDataList",{ids:e[t].id}).then(function(s){"1000"==s.data.errorCode?(Object(a.Message)({message:s.data.errorMsg,type:"success"}),i.showDetail(t,e)):Object(a.Message)({message:s.data.errorMsg,type:"warning"})}).catch(function(t){Object(a.Message)({message:"删除失败，服务器暂无响应！",type:"error"})})}).catch(function(){i.$message({type:"info",message:"已取消删除"})})},toggleSelection:function(t){var e=this;t?t.forEach(function(t){e.$refs.multipleTable.toggleRowSelection(t)}):this.$refs.multipleTable.clearSelection()},handleSelectionChange:function(t){this.multipleSelection=t}},destroyed:function(){s.a.$off(["editGift","addGift","refreshDict"])}},u={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("div",{staticClass:"btn_area"},[i("div",{staticClass:"add_btn"},[i("keySearch",{on:{searchData:t.getDictList}}),t._v(" "),t.isAuth("system:dict:insert")?i("el-button",{style:{float:"right",margin:"0 70px 0 0"},attrs:{type:"warning",plain:""},on:{click:function(e){return t.handleCreate()}}},[t._v("新增")]):t._e()],1)]),t._v(" "),t.isAuth("system:dict:list")?i("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],ref:"multipleTable",staticStyle:{width:"100%"},attrs:{data:t.dictTypeList,height:t.tableHeight},on:{"selection-change":t.handleSelectionChange}},[i("el-table-column",{attrs:{type:"selection",width:"55"}}),t._v(" "),i("el-table-column",{attrs:{prop:"id",label:"主键"}}),t._v(" "),i("el-table-column",{attrs:{prop:"dictName",label:"字典名称"}}),t._v(" "),i("el-table-column",{attrs:{prop:"dictType",label:"字典类型"}}),t._v(" "),i("el-table-column",{attrs:{prop:"status",label:"状态"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(t._s(t.dictionaryState[e.row.status]))]}}],null,!1,1951433952)}),t._v(" "),i("el-table-column",{attrs:{prop:"createTime",label:"创建时间"}}),t._v(" "),i("el-table-column",{attrs:{prop:"remark",label:"备注"}}),t._v(" "),i("el-table-column",{attrs:{align:"center",label:"操作",width:"260"},scopedSlots:t._u([{key:"default",fn:function(e){return[t.isAuth("system:dict:list")?i("el-button",{attrs:{plain:"",size:"mini",type:"primary"},on:{click:function(i){return t.showDetail(e.$index,t.dictTypeList)}}},[t._v("查 看")]):t._e(),t._v(" "),t.isAuth("system:dict:update")?i("el-button",{attrs:{plain:"",size:"mini",type:"warning"},on:{click:function(i){return t.handleEdit(e.$index,t.dictTypeList)}}},[t._v("编 辑")]):t._e(),t._v(" "),t.isAuth("system:dict:delete")?i("el-button",{attrs:{plain:"",size:"mini",type:"danger"},on:{click:function(i){return t.handleDelete(e.$index,t.dictTypeList)}}},[t._v("删 除")]):t._e()]}}],null,!1,2658138994)})],1):t._e(),t._v(" "),i("dictionaryForm"),t._v(" "),i("dictionaryDataForm"),t._v(" "),t.isAuth("system:dict:list")?t._e():i("div",{staticClass:"msg"},[t._v("暂无权限")]),t._v(" "),t.isAuth("system:dict:list")?i("pagination",{directives:[{name:"show",rawName:"v-show",value:t.total>0,expression:"total>0"}],attrs:{total:t.total,page:t.currentPage,limit:t.pageSize},on:{"update:page":function(e){t.currentPage=e},"update:limit":function(e){t.pageSize=e},pagination:function(e){return t.getDictList()}}}):t._e(),t._v(" "),i("el-dialog",{directives:[{name:"dialogDrag",rawName:"v-dialogDrag"}],attrs:{title:"字典数据",visible:t.dialogVisible,width:"80%"},on:{"update:visible":function(e){t.dialogVisible=e}}},[t.isAuth("system:dict:insert")?i("el-button",{style:{float:"right",margin:"0 70px 0 0"},attrs:{type:"warning",plain:""},on:{click:function(e){return t.handleCreate2()}}},[t._v("新增")]):t._e(),t._v(" "),t.isAuth("system:dict:list")?i("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],ref:"multipleTable",staticStyle:{width:"100%"},attrs:{data:t.dictDataList,height:t.tableHeight},on:{"selection-change":t.handleSelectionChange}},[i("el-table-column",{attrs:{type:"selection",width:"55"}}),t._v(" "),i("el-table-column",{attrs:{prop:"id",label:"字典主键"}}),t._v(" "),i("el-table-column",{attrs:{prop:"dictLabel",label:"字典键名"}}),t._v(" "),i("el-table-column",{attrs:{prop:"dictValue",label:"字典键值"}}),t._v(" "),i("el-table-column",{attrs:{prop:"dictSort",label:"字典排序"}}),t._v(" "),i("el-table-column",{attrs:{prop:"status",label:"状态"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(t._s(t.dictionaryState[e.row.status]))]}}],null,!1,1951433952)}),t._v(" "),i("el-table-column",{attrs:{prop:"remark",label:"备注"}}),t._v(" "),i("el-table-column",{attrs:{align:"center",label:"操作",width:"260"},scopedSlots:t._u([{key:"default",fn:function(e){return[t.isAuth("system:dict:update")?i("el-button",{attrs:{plain:"",size:"mini",type:"warning"},on:{click:function(i){return t.handleEdit2(e.$index,t.dictDataList)}}},[t._v("编 辑")]):t._e(),t._v(" "),t.isAuth("system:dict:delete")?i("el-button",{attrs:{plain:"",size:"mini",type:"danger"},on:{click:function(i){return t.handleDelete2(e.$index,t.dictDataList)}}},[t._v("删 除")]):t._e()]}}],null,!1,3579435279)})],1):t._e()],1)],1)},staticRenderFns:[]};var m=i("VU/8")(d,u,!1,function(t){i("5RdI")},"data-v-0fc68520",null);e.default=m.exports},lbem:function(t,e){}});