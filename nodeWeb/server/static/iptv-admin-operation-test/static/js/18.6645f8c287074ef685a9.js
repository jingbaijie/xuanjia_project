webpackJsonp([18],{"669Y":function(e,t){},bVcm:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});o("zL8q");var p=o("nfHz"),i=o("RcBM"),c={data:function(){return{formLabelWidth:"120px",cpspConfigForm:{id:"",booleanUp:"",cpCname:"",cpCode:"",cpEname:"",cpEndtime:"",cpIntroduction:"",cpPhone:"",cpProductAddress:"",cpProductName:"",cpStarttime:"",cpType:"",cpUptime:""},dialogFormCPSP:!1,rules:{cpCname:[{required:!0,message:"请输入中文主题名称",trigger:"blur"}],cpEname:[{required:!0,message:"请输入英文主题名称",trigger:"blur"}]}}},created:function(){var e=this;p.a.$on("addcpsp",function(){e.addcpsp()}),p.a.$on("editcpsp",function(t){e.editcpsp(t)})},methods:{addcpsp:function(){this.dialogFormCPSP=!0,this.cpspConfigForm.booleanUp="",this.cpspConfigForm.cpCname="",this.cpspConfigForm.cpCode="",this.cpspConfigForm.cpEname="",this.cpspConfigForm.cpEndtime="",this.cpspConfigForm.cpIntroduction="",this.cpspConfigForm.cpPhone="",this.cpspConfigForm.cpProductAddress="",this.cpspConfigForm.cpProductName="",this.cpspConfigForm.cpStarttime="",this.cpspConfigForm.cpType="",this.cpspConfigForm.cpUptime=""},editcpsp:function(e){this.dialogFormCPSP=!0,this.cpspConfigForm.id=e.id,this.cpspConfigForm.booleanUp=e.booleanUp,this.cpspConfigForm.cpCname=e.cpCname,this.cpspConfigForm.cpCode=e.cpCode,this.cpspConfigForm.cpEname=e.cpEname,this.cpspConfigForm.cpEndtime=e.cpEndtime,this.cpspConfigForm.cpIntroduction=e.cpIntroduction,this.cpspConfigForm.cpPhone=e.cpPhone,this.cpspConfigForm.cpProductAddress=e.cpProductAddress,this.cpspConfigForm.cpProductName=e.cpProductName,this.cpspConfigForm.cpStarttime=e.cpStarttime,this.cpspConfigForm.cpType=e.cpType,this.cpspConfigForm.cpUptime=e.cpUptime},onSubmit:function(e){var t=this;this.$refs[e].validate(function(e){if(!e)return!1;var o=void 0;o=t.cpspConfigForm.id?"axios_update_cpDetail":"axios_add_cpDetail",t.$store.dispatch(o,{id:t.cpspConfigForm.id||void 0,booleanUp:t.cpspConfigForm.booleanUp,cpCname:t.cpspConfigForm.cpCname,cpCode:t.cpspConfigForm.cpCode,cpEname:t.cpspConfigForm.cpEname,cpEndtime:t.cpspConfigForm.cpEndtime,cpIntroduction:t.cpspConfigForm.cpIntroduction,cpPhone:t.cpspConfigForm.cpPhone,cpProductAddress:t.cpspConfigForm.cpProductAddress,cpProductName:t.cpspConfigForm.cpProductName,cpStarttime:t.cpspConfigForm.cpStarttime,cpType:t.cpspConfigForm.cpType,cpUptime:t.cpspConfigForm.cpUptime}).then(function(e){"1000"==e.data.errorCode?(t.$message.success("操作成功"),t.$emit("refreshList")):t.$message.error("操作失败")}).catch(function(e){t.$message.error("操作失败")}),t.dialogFormCPSP=!1})}},beforeDestroy:function(){p.a.$off(["addTheme","editTheme","refreshList"])}},n={render:function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",[o("el-dialog",{directives:[{name:"dialogDrag",rawName:"v-dialogDrag"}],ref:"dialog__wrapper",attrs:{width:"50vw",height:"50",title:e.cpspConfigForm.id?"编辑":"新增",visible:e.dialogFormCPSP},on:{"update:visible":function(t){e.dialogFormCPSP=t}}},[o("el-form",{ref:"cpspConfigForm",attrs:{model:e.cpspConfigForm,rules:e.rules}},[o("el-form-item",{attrs:{label:"名称",prop:"cpCname","label-width":e.formLabelWidth}},[o("el-input",{attrs:{type:"text"},model:{value:e.cpspConfigForm.cpCname,callback:function(t){e.$set(e.cpspConfigForm,"cpCname",t)},expression:"cpspConfigForm.cpCname"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"类型",prop:"booleanUp","label-width":e.formLabelWidth}},[o("el-radio",{attrs:{label:"0"},model:{value:e.cpspConfigForm.booleanUp,callback:function(t){e.$set(e.cpspConfigForm,"booleanUp",t)},expression:"cpspConfigForm.booleanUp"}},[e._v("cp")]),e._v(" "),o("el-radio",{attrs:{label:"1"},model:{value:e.cpspConfigForm.booleanUp,callback:function(t){e.$set(e.cpspConfigForm,"booleanUp",t)},expression:"cpspConfigForm.booleanUp"}},[e._v("sp")])],1),e._v(" "),o("el-form-item",{attrs:{label:"英文名称",prop:"cpEname","label-width":e.formLabelWidth}},[o("el-input",{attrs:{type:"text"},model:{value:e.cpspConfigForm.cpEname,callback:function(t){e.$set(e.cpspConfigForm,"cpEname",t)},expression:"cpspConfigForm.cpEname"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"cpCode",prop:"cpCode","label-width":e.formLabelWidth}},[o("el-input",{attrs:{type:"text"},model:{value:e.cpspConfigForm.cpCode,callback:function(t){e.$set(e.cpspConfigForm,"cpCode",t)},expression:"cpspConfigForm.cpCode"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"开始时间","label-width":e.formLabelWidth}},[o("el-date-picker",{attrs:{"value-format":"yyyy-MM-dd",type:"date",placeholder:"选择日期"},model:{value:e.cpspConfigForm.cpStarttime,callback:function(t){e.$set(e.cpspConfigForm,"cpStarttime",t)},expression:"cpspConfigForm.cpStarttime"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"结束时间","label-width":e.formLabelWidth}},[o("el-date-picker",{attrs:{"value-format":"yyyy-MM-dd",type:"date",placeholder:"选择日期"},model:{value:e.cpspConfigForm.cpEndtime,callback:function(t){e.$set(e.cpspConfigForm,"cpEndtime",t)},expression:"cpspConfigForm.cpEndtime"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"说明",prop:"cpIntroduction","label-width":e.formLabelWidth}},[o("el-input",{attrs:{type:"text"},model:{value:e.cpspConfigForm.cpIntroduction,callback:function(t){e.$set(e.cpspConfigForm,"cpIntroduction",t)},expression:"cpspConfigForm.cpIntroduction"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"cpPhone",prop:"cpPhone","label-width":e.formLabelWidth}},[o("el-input",{attrs:{type:"text"},model:{value:e.cpspConfigForm.cpPhone,callback:function(t){e.$set(e.cpspConfigForm,"cpPhone",t)},expression:"cpspConfigForm.cpPhone"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"cpProductName",prop:"cpProductName","label-width":e.formLabelWidth}},[o("el-input",{attrs:{type:"text"},model:{value:e.cpspConfigForm.cpProductName,callback:function(t){e.$set(e.cpspConfigForm,"cpProductName",t)},expression:"cpspConfigForm.cpProductName"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"cpProductAddress",prop:"cpProductAddress","label-width":e.formLabelWidth}},[o("el-input",{attrs:{type:"text"},model:{value:e.cpspConfigForm.cpProductAddress,callback:function(t){e.$set(e.cpspConfigForm,"cpProductAddress",t)},expression:"cpspConfigForm.cpProductAddress"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"cpUptime",prop:"cpUptime","label-width":e.formLabelWidth}},[o("el-input",{attrs:{type:"text"},model:{value:e.cpspConfigForm.cpUptime,callback:function(t){e.$set(e.cpspConfigForm,"cpUptime",t)},expression:"cpspConfigForm.cpUptime"}})],1)],1),e._v(" "),o("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[o("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.onSubmit("cpspConfigForm")}}},[e._v("提 交")])],1)],1)],1)},staticRenderFns:[]};var a,r=o("VU/8")(c,n,!1,function(e){o("669Y")},"data-v-752c8714",null).exports,s=(a=0,function(e,t){clearTimeout(a),a=setTimeout(e,t)}),l={name:"cpDetailList",inject:["getMenuId"],components:{Pagination:i.a,configcpspInfo:r},data:function(){return{searchValue:"",cpType:{0:"CP",1:"SP"},currentPage:1,pageSize:10,total:1,menuId:this.getMenuId(),cpData:[],loading:!0,tableHeight:void 0}},watch:{searchValue:function(){var e=this;s(function(){e.getCpList()},300)}},created:function(){this.getCpList()},mounted:function(){this.tableHeight=window.innerHeight-this.$refs.multipleTable.$el.offsetTop-200},methods:{getCpList:function(){var e=this;this.$store.dispatch("axios_get_cpDetail",{searchValue:this.searchValue,menuId:this.menuId,pageNum:this.currentPage,pageSize:this.pageSize}).then(function(t){"undefined"!=t&&(e.cpData=t.data.data.list.records,e.total=t.data.data.list.total),e.loading=!1}).catch(function(t){e.loading=!1})},handleDel:function(e,t){var o=this;console.log(t),this.$confirm("确定删除吗, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){o.$store.dispatch("axios_del_cpDetail",{ids:t[e].id}).then(function(e){"1000"==e.data.errorCode?(o.getCpList(),o.$message.success("删除操作成功！")):o.$message.error("删除操作失败，请联系管理员")}).catch(function(e){o.$message.error("批量操作失败，请联系管理员")})}).catch(function(){o.$message({type:"info",message:"已取消该操作！"})})},handleCreate:function(){p.a.$emit("addcpsp")},handleEdit:function(e,t){p.a.$emit("editcpsp",t[e])}}},m={render:function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",[o("div",{staticStyle:{}},[o("el-input",{staticClass:"searchInput",attrs:{placeholder:"根据名称或者id"},model:{value:e.searchValue,callback:function(t){e.searchValue=t},expression:"searchValue"}}),e._v(" "),o("el-button",{style:{float:"right",margin:"0 10px 0 0"},attrs:{type:"warning",plain:""},on:{click:e.handleCreate}},[e._v("新增")])],1),e._v(" "),o("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"multipleTable",staticStyle:{width:"100%"},attrs:{data:e.cpData,height:e.tableHeight}},[o("el-table-column",{attrs:{align:"center",prop:"cpCname",label:"名称"}}),e._v(" "),o("el-table-column",{attrs:{align:"center",prop:"cpType",label:"类型"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(e.cpType[t.row.cpType]))]}}])}),e._v(" "),o("el-table-column",{attrs:{align:"center",prop:"cpCode",label:"CPCODE"}}),e._v(" "),o("el-table-column",{attrs:{align:"center",prop:"createTime",label:"创建时间"}}),e._v(" "),o("el-table-column",{attrs:{align:"center",label:"操作",width:"160"},scopedSlots:e._u([{key:"default",fn:function(t){return[o("el-button",{attrs:{type:"text"},on:{click:function(o){return e.handleDel(t.$index,e.cpData)}}},[e._v("删除")]),e._v(" "),o("el-button",{attrs:{type:"text"},on:{click:function(o){return e.handleEdit(t.$index,e.cpData)}}},[e._v("设 置")])]}}])})],1),e._v(" "),o("pagination",{directives:[{name:"show",rawName:"v-show",value:e.total>0,expression:"total>0"}],attrs:{total:e.total,page:e.currentPage,limit:e.pageSize},on:{"update:page":function(t){e.currentPage=t},"update:limit":function(t){e.pageSize=t},pagination:e.getCpList}}),e._v(" "),o("configcpspInfo",{on:{refreshList:e.getCpList}})],1)},staticRenderFns:[]};var d=o("VU/8")(l,m,!1,function(e){o("g/+c")},"data-v-d8375b68",null);t.default=d.exports},"g/+c":function(e,t){}});