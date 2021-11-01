webpackJsonp([17],{"6UXL":function(e,t){},B6TJ:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=i("nfHz"),a=i("zL8q"),o={name:"roleForm",data:function(){var e=this;return{form:{id:"",rname:"",rdesc:"",rval:"",menuIds:[]},rules:{rname:[{required:!0,message:"非空",trigger:"blur"},{validator:function(t,i,r){e.form.id&&e.editCurRname==e.form.rname?r():e.$store.dispatch("axios_check_rolename",{rname:i}).then(function(e){e.data.data.isExisted?r(new Error("已存在")):r()})},trigger:"blur"}]},menuData:[],defaultProps:{children:"children",label:"menuName"},formLabelWidth:"120px",dialogFormVisible:!1,editCurRname:""}},created:function(){var e=this;this.getMenuId(),r.a.$on("addRole",function(){e.addRole()}),r.a.$on("editRole",function(t){e.editRole(t)})},beforeDestroy:function(){r.a.$off(["editRole","addRole"])},methods:{getMenuId:function(){var e=this;this.$store.dispatch("axios_get_menu").then(function(t){e.menuData=t.data.data.list}).catch(function(e){})},resetChecked:function(){this.$refs.tree.setCheckedKeys([])},setCheckedKeys:function(e){this.$refs.tree.setCheckedKeys(e)},addRole:function(){this.form.id="",this.form.rname="",this.form.rdesc="",this.form.rval="",this.editCurRname="",this.dialogFormVisible=!0,this.$nextTick(function(){this.resetChecked()})},editRole:function(e){this.form.id=e.id,this.form.rname=e.rname,this.form.rdesc=e.rdesc,this.form.rval=e.rval,this.editCurRname=e.rname,this.dialogFormVisible=!0,this.$nextTick(function(){this.setCheckedKeys(e.menuIds)})},onSubmit:function(e){var t=this;this.$refs[e].validate(function(e){if(!e)return!1;var i=t.$refs.tree.getCheckedKeys().concat(t.$refs.tree.getHalfCheckedKeys()),a=void 0;a=t.form.id?"axios_edit_role":"axios_add_role",t.$store.dispatch(a,{id:t.form.id||void 0,rname:t.form.rname,rdesc:t.form.rdesc,rval:t.form.rval,menuIds:i}).then(function(e){"1000"==e.data.errorCode?(t.$message.success("操作成功"),r.a.$emit("refreshRole")):t.$message.error("操作失败")}).catch(function(e){t.$message.error("操作失败")}),t.dialogFormVisible=!1})}}},s={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",[i("el-dialog",{directives:[{name:"dialogDrag",rawName:"v-dialogDrag"}],ref:"dialog__wrapper",attrs:{width:"35vw",title:this.form.id?"编辑":"新增",visible:e.dialogFormVisible},on:{"update:visible":function(t){e.dialogFormVisible=t}}},[i("el-form",{ref:"form",attrs:{model:e.form,rules:e.rules}},[i("el-form-item",{attrs:{label:"角色名",prop:"rname","label-width":e.formLabelWidth}},[i("el-input",{attrs:{autocomplete:"off"},model:{value:e.form.rname,callback:function(t){e.$set(e.form,"rname",t)},expression:"form.rname"}})],1),e._v(" "),i("el-form-item",{attrs:{label:"角色权限","label-width":e.formLabelWidth}},[i("el-input",{attrs:{autocomplete:"off"},model:{value:e.form.rval,callback:function(t){e.$set(e.form,"rval",t)},expression:"form.rval"}})],1),e._v(" "),i("el-form-item",{attrs:{label:"描述","label-width":e.formLabelWidth}},[i("el-input",{attrs:{autocomplete:"off"},model:{value:e.form.rdesc,callback:function(t){e.$set(e.form,"rdesc",t)},expression:"form.rdesc"}})],1),e._v(" "),i("el-form-item",{attrs:{label:"菜单权限","label-width":e.formLabelWidth}},[i("el-tree",{ref:"tree",attrs:{data:e.menuData,accordion:"","show-checkbox":"","node-key":"id","highlight-current":"",props:e.defaultProps}})],1)],1),e._v(" "),i("div",{staticClass:"dialog-footer",style:{"text-align":"center"},attrs:{slot:"footer"},slot:"footer"},[i("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.onSubmit("form")}}},[e._v("确 定")])],1)],1)],1)},staticRenderFns:[]};var n={name:"roleList",inject:["getMenuId"],data:function(){return{currentPage:1,pageSize:10,total:1,roleData:[],search:"",tableHeight:void 0,menuId:this.getMenuId(),loading:!0}},components:{roleForm:i("VU/8")(o,s,!1,function(e){i("6UXL")},"data-v-9669a840",null).exports,Pagination:i("RcBM").a},created:function(){var e=this;this.getRoleList(),r.a.$on("refreshRole",function(){e.getRoleList()})},mounted:function(){console.log("role insert : ",this.isAuth("system:role:insert")),console.log("role edit : ",this.isAuth("system:role:update")),console.log("role list : ",this.isAuth("system:role:list")),console.log("role delete : ",this.isAuth("system:role:delete")),this.isAuth("system:role:list")&&(this.tableHeight=window.innerHeight-this.$refs.multipleTable.$el.offsetTop-200)},destroyed:function(){r.a.$off(["refreshRole"])},methods:{checkPermission:function(e){this.userPermission.select=e.find(function(e){return"system:role:list"===e.perms}),this.userPermission.delete=e.find(function(e){return"system:role:delete"===e.perms}),this.userPermission.update=e.find(function(e){return"system:role:update"===e.perms}),this.userPermission.insert=e.find(function(e){return"system:role:insert"===e.perms})},getRoleList:function(){var e=this;this.$store.dispatch("axios_get_role",{menuId:this.menuId,pageNum:this.currentPage,pageSize:this.pageSize}).then(function(t){e.roleData=t.data.data.list.records,e.total=t.data.data.list.total,e.loading=!1}).catch(function(t){e.loading=!1})},handleCreate:function(){r.a.$emit("addRole")},handleEdit:function(e,t){r.a.$emit("editRole",t[e])},handleDelete:function(e,t){var i=this;this.$confirm("此操作将永久删除该条数据, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){i.$store.dispatch("axios_del_role",{roleIds:t[e].id}).then(function(e){"1000"==e.data.errorCode?(Object(a.Message)({message:e.data.errorMsg,type:"success"}),i.getRoleList()):Object(a.Message)({message:e.data.errorMsg,type:"warning"})}).catch(function(e){Object(a.Message)({message:"删除失败，服务器暂无响应！",type:"error"})})}).catch(function(){i.$message({type:"info",message:"已取消删除"})})},toggleSelection:function(e){var t=this;e?e.forEach(function(e){t.$refs.multipleTable.toggleRowSelection(e)}):this.$refs.multipleTable.clearSelection()},handleSelectionChange:function(e){this.multipleSelection=e}}},l={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",[i("div",{staticClass:"btn_area"},[i("div",{staticClass:"add_btn"},[i("div",{staticClass:"searchBtn"}),e._v(" "),e.isAuth("system:role:insert")?i("el-button",{style:{float:"right",margin:"0 70px 0 0"},attrs:{size:"mini",type:"primary",plain:""},on:{click:function(t){return e.handleCreate()}}},[e._v("新增")]):e._e()],1)]),e._v(" "),e.isAuth("system:role:list")?i("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"multipleTable",staticStyle:{width:"100%"},attrs:{data:e.roleData,height:e.tableHeight},on:{"selection-change":e.handleSelectionChange}},[i("el-table-column",{attrs:{type:"selection",width:"55"}}),e._v(" "),i("el-table-column",{attrs:{label:"角色名称",prop:"rname"}}),e._v(" "),i("el-table-column",{attrs:{label:"权限",prop:"rval"}}),e._v(" "),i("el-table-column",{attrs:{label:"角色描述",prop:"rdesc"}}),e._v(" "),i("el-table-column",{attrs:{label:"创建时间",prop:"createTime"}}),e._v(" "),i("el-table-column",{attrs:{align:"center",label:"操作",width:"160"},scopedSlots:e._u([{key:"default",fn:function(t){return[e.isAuth("system:role:update")?i("el-button",{attrs:{plain:"",size:"mini",type:"warning"},on:{click:function(i){return e.handleEdit(t.$index,e.roleData)}}},[e._v("编 辑")]):e._e(),e._v(" "),e.isAuth("system:role:delete")?i("el-button",{attrs:{plain:"",size:"mini",type:"danger"},on:{click:function(i){return e.handleDelete(t.$index,e.roleData)}}},[e._v("删 除")]):e._e()]}}],null,!1,4131526287)})],1):e._e(),e._v(" "),e.isAuth("system:role:list")?e._e():i("div",{staticClass:"msg"},[e._v("\n    暂无权限\n  ")]),e._v(" "),e.isAuth("system:role:list")?i("pagination",{directives:[{name:"show",rawName:"v-show",value:e.total>0,expression:"total>0"}],attrs:{total:e.total,page:e.currentPage,limit:e.pageSize},on:{"update:page":function(t){e.currentPage=t},"update:limit":function(t){e.pageSize=t},pagination:e.getRoleList}}):e._e(),e._v(" "),i("roleForm")],1)},staticRenderFns:[]};var d=i("VU/8")(n,l,!1,function(e){i("xq1P")},"data-v-7bb1d522",null);t.default=d.exports},xq1P:function(e,t){}});