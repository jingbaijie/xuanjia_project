webpackJsonp([20],{Y8YX:function(t,e){},Z8Z3:function(t,e){},dFOl:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=a("nfHz"),i={name:"indexPageForm",data:function(){return{isShow:!1,dialogForm:!1,action:"",activeData:[],form:{configName:"",configKey:"",configValue:"",remark:"",id:""},formLabelWidth:"120px",titleE:{New:"新建",Edit:"编辑"},rules:{configName:[{required:!0,message:"必填项",trigger:"blur"}]}}},mounted:function(){var t=this;o.a.$on("editInfo",function(e,a){t.editInfo(e,a),a?(t.form=a,t.id=a.id,console.log(t.id)):t.form={configName:"",configKey:"",configValue:"",remark:""},console.log(e)})},methods:{editInfo:function(t,e){1==t?(this.action="Edit",this.dialogForm=!0,this.isShow=!1):(this.dialogForm=!0,this.isShow=!0)},onSubmit:function(t){var e=this;this.$refs[t].validate(function(t){e.$store.dispatch("axios_update_configById",e.form).then(function(t){e.$message.success("设置成功")}).catch(function(t){e.$message.error("设置失败")}),e.dialogForm=!1})}},beforeDestroy:function(){o.a.$off("editGift")}},n={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("el-dialog",{directives:[{name:"dialogDrag",rawName:"v-dialogDrag"}],ref:"dialog__wrapper",attrs:{title:t.titleE[t.action],visible:t.dialogForm},on:{"update:visible":function(e){t.dialogForm=e}}},[a("el-form",{ref:"form",attrs:{model:t.form,rules:t.rules}},[a("el-form-item",{attrs:{label:"参数名称",prop:"configName","label-width":t.formLabelWidth}},[a("el-input",{attrs:{autocomplete:"off"},model:{value:t.form.configName,callback:function(e){t.$set(t.form,"configName",e)},expression:"form.configName"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"参数键名","label-width":t.formLabelWidth}},[a("el-input",{attrs:{disabled:!0,autocomplete:"off"},model:{value:t.form.configKey,callback:function(e){t.$set(t.form,"configKey",e)},expression:"form.configKey"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"参数键值","label-width":t.formLabelWidth}},[a("el-input",{attrs:{autocomplete:"off"},model:{value:t.form.configValue,callback:function(e){t.$set(t.form,"configValue",e)},expression:"form.configValue"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"备注","label-width":t.formLabelWidth}},[a("el-input",{attrs:{autocomplete:"off"},model:{value:t.form.remark,callback:function(e){t.$set(t.form,"remark",e)},expression:"form.remark"}})],1)],1),t._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary",disabled:t.isShow},on:{click:function(e){return t.onSubmit("form")}}},[t._v("确 定")])],1)],1)],1)},staticRenderFns:[]};var r={data:function(){return{cardData:[],paramData:[],configInfo:{}}},components:{configIndevPage:a("VU/8")(i,n,!1,function(t){a("Z8Z3")},"data-v-a6c8ae4c",null).exports},created:function(){var t=this;this.$nextTick(function(){t.paramData.push({type:"开机图"}),t.paramData.push({type:"推出拦截页面"}),t.paramData.push({type:"首页跑马灯配置"})}),this.getMediaInfo()},mounted:function(){},methods:{setCardDate:function(t){this.cardData=[{type:"节目集",explain:t.booleanUp},{type:"节目",explain:t.program},{type:"版权到期节目集",explain:t.outOfDate},{type:"已上架节目集",explain:t.series}]},getConfigInfo:function(t,e){var a=void 0;switch(t){case"开机图":a="ANDROID_BOOT_IMG";break;case"推出拦截页面":a="EXIT_INTERCEPT_PAGE";break;case"首页跑马灯配置":a="ROLL_TEXT_INDEX";break;default:a=""}this.$store.dispatch("axios_config_detailByKey",{configKey:a}).then(function(t){o.a.$emit("editInfo",e,t.data.data)}).catch(function(t){})},handleCheck:function(t){this.getConfigInfo(this.paramData[t].type,0)},handleEdit:function(t){this.getConfigInfo(this.paramData[t].type,1)},getMediaInfo:function(){var t=this;this.$store.dispatch("axios_get_mediaInfo").then(function(e){t.tableData=e.data.data,t.setCardDate(t.tableData),console.log(t.tableData)}).catch(function(t){})}}},l={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-row",{attrs:{gutter:30}},[a("el-col",{attrs:{span:12}},[a("div",{staticClass:"grid-content bg-purple"},[a("el-card",{staticClass:"box-card"},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("span",[t._v("片单数据")])]),t._v(" "),a("div",[a("el-table",{staticStyle:{width:"100%"},attrs:{data:t.cardData}},[a("el-table-column",{attrs:{prop:"type",label:"类型"}}),t._v(" "),a("el-table-column",{attrs:{prop:"explain",label:"说明"}})],1)],1)])],1)]),t._v(" "),a("el-col",{attrs:{span:12}},[a("div",{staticClass:"grid-content bg-purple"},[a("el-card",{staticClass:"box-card"},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("span",[t._v("参数设置")])]),t._v(" "),a("div",[a("el-table",{staticStyle:{width:"100%"},attrs:{data:t.paramData}},[a("el-table-column",{attrs:{prop:"type",label:"类型"}}),t._v(" "),a("el-table-column",{attrs:{align:"center",label:"操作",width:"160"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{attrs:{type:"text"},on:{click:function(a){return t.handleCheck(e.$index,t.paramData)}}},[t._v("查 看")]),t._v(" "),a("el-button",{attrs:{type:"text"},on:{click:function(a){return t.handleEdit(e.$index,t.paramData)}}},[t._v("设 置")])]}}])})],1),t._v(" "),a("configIndevPage")],1)])],1)])],1)},staticRenderFns:[]};var s=a("VU/8")(r,l,!1,function(t){a("Y8YX")},"data-v-5a689a71",null);e.default=s.exports}});