<template>
  <span>
    <el-button
      slot="reference"
     :style="{'float':'right','margin':'0 10px 0 0'}"
      size="mini"
      type="info"
      @click="showDialog"
      plain
    >批量免费</el-button>
    <el-dialog
      v-dialogDrag
      ref="dialog__wrapper"
      title="批量免费卡通集"
      width="250px"
      :visible.sync="dialogFormVisible"
    >
     <el-input v-model="freeNum" placeholder="请输入"></el-input>

      <div style="text-align:center">
        <el-button type="primary" size="mini"  @click="batchUpdate">确认</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script>
export default {
  name: "ClassBatches",
  props: ["classifyData", "tagsData", "selectedIDs"],
  data() {
    return {
      dialogFormVisible: false,
      freeNum: ""
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
      this.$confirm("确定免费吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$emit("batchSingleFree", this.freeNum);
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
