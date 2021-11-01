webpackJsonp([15],{OA26:function(e,t){},QiTG:function(e,t){},jBYH:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a("woOf"),r=a.n(n),o=a("nfHz"),s={name:"upgrade",data:function(){return{form:{sn_num:"",factory_name:"",system_version:""},tableData:[],upgradeTable:[]}},created:function(){var e=this;this.getTableList({}),o.a.$on("initAddDevice",function(){e.tableData.forEach(function(t){e.$refs.multipleTable.toggleRowSelection(t,!1)})})},beforeDestroy:function(){o.a.$off("initAddDevice")},methods:{resetForm:function(e){this.$refs[e].resetFields(),this.getTableList({})},search:function(){var e={sn_num:this.form.sn_num,factory_name:this.form.factory_name,system_version:this.form.system_version,pageSize:1e5,pageNum:1};this.getTableList(e)},handleConfirm:function(){this.$store.state.upgradeTable=this.upgradeTable,this.$store.state.isComponent="upgrade"},getTableList:function(e){var t=this;this.$store.dispatch("axios_get_device",r()(e,{pageSize:1e5,pageNum:1})).then(function(e){t.tableData=e.data.data,t.total=Number(e.data.dateSize)||9999})},handleSelectionChange:function(e){this.upgradeTable=e},goBack:function(){this.$store.state.isComponent="upgrade"}}},i={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("el-page-header",{attrs:{content:"添加设备"},on:{back:e.goBack}}),e._v(" "),a("el-row",{style:{margin:"20px 0 0 10px"}},[a("el-form",{ref:"form",attrs:{inline:!0,model:e.form,"label-width":"100px","label-position":"left"}},[a("el-form-item",{attrs:{label:"SN编号:",prop:"sn_num"}},[a("el-input",{attrs:{placeholder:"请输入搜索条件",size:"small"},model:{value:e.form.sn_num,callback:function(t){e.$set(e.form,"sn_num",t)},expression:"form.sn_num"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"厂商名称:",prop:"factory_name"}},[a("el-input",{attrs:{placeholder:"请输入搜索条件",size:"small"},model:{value:e.form.factory_name,callback:function(t){e.$set(e.form,"factory_name",t)},expression:"form.factory_name"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"盒子版本:",prop:"system_version"}},[a("el-input",{attrs:{placeholder:"请输入搜索条件",size:"small"},model:{value:e.form.system_version,callback:function(t){e.$set(e.form,"system_version",t)},expression:"form.system_version"}})],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{size:"small"},on:{click:function(t){return e.resetForm("form")}}},[e._v("重置")]),e._v(" "),a("el-button",{attrs:{type:"primary",size:"small"},on:{click:e.search}},[e._v("搜索")])],1)],1)],1),e._v(" "),a("el-row",[a("el-table",{ref:"multipleTable",attrs:{data:e.tableData},on:{"selection-change":e.handleSelectionChange}},[a("el-table-column",{attrs:{type:"selection"}}),e._v(" "),a("el-table-column",{attrs:{prop:"id",label:"设备ID"}}),e._v(" "),a("el-table-column",{attrs:{prop:"sn_num",label:"SN-编号"}}),e._v(" "),a("el-table-column",{attrs:{prop:"factory_cname",label:"厂商名称"}}),e._v(" "),a("el-table-column",{attrs:{prop:"firmware_version",label:"硬件版本"}}),e._v(" "),a("el-table-column",{attrs:{prop:"software_version",label:"软件版本"}})],1)],1),e._v(" "),a("el-row",{style:{marginTop:"10px"},attrs:{type:"flex",justify:"end"}},[a("el-button",{attrs:{type:"primary",size:"mini"},on:{click:e.handleConfirm}},[e._v("添加设备")])],1)],1)},staticRenderFns:[]};var l={name:"addDevice",data:function(){return{}},created:function(){},methods:{confirmUpdate:function(){var e=this;if(this.$store.state.upgradeTable.length<1)this.$message("请先添加设备");else{var t="";this.$store.state.upgradeTable.forEach(function(e,a){t+=0==a?e.id:"_"+e.id});var a={device_ids:t,update_type:this.$route.params.updateType,version_id:this.$route.params.id};this.$store.dispatch("axios_add_apkUpdateInfo",a).then(function(t){"1000"==t.data.errorCode?(e.$message.success("添加升级计划成功!"),0==e.$route.params.isActive&&e.$store.dispatch("axios_update_updateIsActive",{id:e.$route.params.id}).then(function(e){}).catch(function(e){}),e.goBack()):e.$message.error("添加升级计划失败!")}).catch(function(t){e.$message.error("添加升级计划失败!")})}},handleDelete:function(e){this.$store.state.upgradeTable.splice(e,1)},addDevice:function(){o.a.$emit("initAddDevice"),this.$store.state.isComponent="addDevice"},goBack:function(){this.$router.go(-1)}}},c={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("el-page-header",{attrs:{content:"升级计划"},on:{back:e.goBack}}),e._v(" "),a("el-row",{attrs:{type:"flex",justify:"end"}},[a("el-button",{attrs:{size:"mini",type:"primary"},on:{click:e.addDevice}},[e._v("添加设备")]),e._v(" "),a("el-button",{attrs:{size:"mini",type:"primary"}},[e._v("导入设备")])],1),e._v(" "),a("el-row",[a("el-table",{attrs:{data:e.$store.state.upgradeTable,"max-height":410}},[a("el-table-column",{attrs:{prop:"id",label:"设备ID"}}),e._v(" "),a("el-table-column",{attrs:{prop:"sn_num",label:"SN-编号"}}),e._v(" "),a("el-table-column",{attrs:{prop:"factory_cname",label:"厂商名称"}}),e._v(" "),a("el-table-column",{attrs:{prop:"firmware_version",label:"硬件版本"}}),e._v(" "),a("el-table-column",{attrs:{prop:"software_version",label:"软件版本"}}),e._v(" "),a("el-table-column",{attrs:{prop:"system_version",label:"盒子类型"}}),e._v(" "),a("el-table-column",{attrs:{prop:"midVersion",label:"在线状态"}}),e._v(" "),a("el-table-column",{attrs:{prop:"operation",label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{plain:"",size:"mini",type:"danger"},on:{click:function(a){return e.handleDelete(t.$index)}}},[e._v("移除")])]}}])})],1)],1),e._v(" "),a("el-row",{attrs:{type:"flex",justify:"end"}},[a("el-button",{attrs:{size:"mini",type:"primary"},on:{click:e.confirmUpdate}},[e._v("升级")])],1)],1)},staticRenderFns:[]};var u={components:{addDevice:a("VU/8")(s,i,!1,function(e){a("QiTG")},null,null).exports,upgrade:a("VU/8")(l,c,!1,function(e){a("OA26")},"data-v-057a8c9f",null).exports},data:function(){return{isComponent:"upgrade",tableData:[]}},created:function(){var e=this;o.a.$on("startVersion",function(){e.isShowModal=!0})},methods:{handleDelete:function(){}}},m={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",[t("transition",{attrs:{name:"fade-transform",mode:"out-in"}},[t("keep-alive",[t(this.$store.state.isComponent,{tag:"component"})],1)],1)],1)},staticRenderFns:[]};var p=a("VU/8")(u,m,!1,function(e){a("ynzN")},"data-v-6fb3dd34",null);t.default=p.exports},ynzN:function(e,t){}});