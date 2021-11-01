<template>
  <span>
    <el-button
      slot="reference"
     :style="{'float':'right','margin':'0 10px 0 0'}"
      size="mini"
      type="info"
      @click="showDialog"
      plain
    >批量分类</el-button>
    <el-dialog
      v-dialogDrag
      ref="dialog__wrapper"
      title="批量选择分类标签"
      width="250px"
      :visible.sync="dialogFormVisible"
    >
      <el-cascader
        collapse-tags
        v-model="form.typeParentPath"
        placeholder="分类"
        :options="filterData"
        :props="{multiple: true,children:'childrenList',label:'typeCname',value:'id'}"
        filterable
        size="medium"
      ></el-cascader>

      <!-- <el-cascader
        v-model="form.tagParentPath"
        placeholder="标签"
        :options="tagsData"
        filterable
        :props="{multiple: true,children:'childrenList',label:'typeCname',value:'id'}"
      ></el-cascader> -->
      <div style="text-align:center">
        <el-button type="warning" size="mini" icon="el-icon-edit" @click="batchUpdate"></el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script>
export default {
  name: "ClassBatches",
  props: ["classifyData", "selectedIDs"],
  data() {
    return {
      dialogFormVisible: false,
      form: {}
    };
  },
  computed: {
    filterData() {
      let fdata = this.classifyData;
      fdata.forEach(element => {
        if (element.childrenList.length > 0) {
          element.childrenList.forEach(i => {
            if (i.childrenList.length > 0) {
              i.childrenList.forEach(x => {
                if (x.childrenList.length > 0) {
                  x.childrenList.forEach(y => {
                    delete y.childrenList;
                  });
                } else {
                  delete x.childrenList;
                }
              });
            } else {
              delete i.childrenList;
            }
          });
        } else {
          delete element.childrenList;
        }
      });
      return fdata;
    }
  },
  methods: {
    batchUpdate() {
      this.$confirm("确定全部修改吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$emit("batchUpdateClass", this.form);
          this.dialogFormVisible = false;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    showDialog() {
      let c = this.selectedIDs
      if (c.length>0) {
        this.dialogFormVisible = true;
      } else {
        this.$message({
          type: "warning",
          message: "请勾选"
        });
      }
    }
  }
};
</script>
