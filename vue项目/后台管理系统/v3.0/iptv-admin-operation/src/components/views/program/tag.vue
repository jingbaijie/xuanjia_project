<template>
  <el-dialog
    width="35vw"
    height="50"
    v-dialogDrag
    ref="dialog__wrapper"
    title="关联标签"
    :visible.sync="dialogTag"
  >
    <keySearch @searchData="getSearchVal"></keySearch>
    <!-- <el-table
      :data="tagData"
      @selection-change="data => handleSelectionChange(data)"
      ref="tagData"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="typeCname" label="标签名"></el-table-column>
      <el-table-column prop="typeEname" label="英文名"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="more1" label="更新时间"></el-table-column>
    </el-table> -->
    <el-form :inline="true" :model="tagForm" class="demo-form-inline">
      <el-form-item label="标签">
        <!-- <el-input v-model="tagForm.name" placeholder="标签"></el-input> -->
        <el-cascader
          v-model="tagForm.ids"
          placeholder="搜索"
          :options="tagList"
          :props="{
            checkStrictly: true,
            multiple: true,
            children: 'childrenList',
            label: 'typeCname',
            value: 'id'
          }"
          filterable
          size="medium"
        ></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="setTag()">关联标签</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { Message, Loading } from "element-ui";
import { eventBus } from "@/common/eventBus";
import keySearch from "@/components/widget/keySearch";
export default {
  name: "tag",
  components: {
    keySearch
  },
  inject: ["getTagsData"],
  data() {
    return {
      tagForm: { ids: "" },
      searchVal: "",
      tagList: getTagsData,
      tagData: [],
      dialogTag: false,
      action: undefined,
      cartoonIds: "",
      selectedIDs: ""
    };
  },
  created() {},
  mounted() {
    eventBus.$on("tag", v => {
      this.dialogTag = true;
      this.action = v.type;
      this.cartoonIds = v.cartoonIds;
      this.getTagList();
    });
  },
  methods: {
    handleSelectionChange(val) {
      let ids = [];
      val.map(item => {
        ids.push(item.id);
      });
      this.selectedIDs = ids.join(",");
    },
    getSearchVal(val) {
      this.searchVal = val;
      this.getTagList();
    },
    getTagList() {
      this.$store
        .dispatch("axios_get_tagListNoPage", {
          searchValue: this.searchVal
        })
        .then(rs => {
          this.tagData = rs.data.data.list;
        })
        .catch(er => {});
    },
    //0追加  1覆盖
    setTag() {
      let api;
      if (this.action == 1) {
        api = "axios_set_coverTag";
      } else {
        api = "axios_get_addTag";
      }
      this.$store
        .dispatch(api, {
          tagIds: this.selectedIDs,
          cartoonIds: this.cartoonIds
        })
        .then(response => {
          if (response.data.errorCode == "1000") {
            this.$message.success("关联成功");
          } else {
            this.$message.error(response.data.errorMsg);
          }
        })
        .catch(er => {});
    }
  }
};
</script>

