<template>
  <div class="mainContent">
    <div class="title_date">
      <h2 class="title">{{itemObj.title}}</h2>
      <div class="date">{{itemObj.posttime}}</div>
    </div>
    <div class="textContent">{{itemObj.description}}</div>
    <div class="sort_author">
      <div class="sort">
        所属分类：
        <span>{{itemObj.classid}}</span>
      </div>
      <div class="author">
        作者：
        <span>{{itemObj.rating}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    itemObj: {
      type: Object,
      default: function() {
        return {};
      }
    }
  }
};
</script>

<style lang="less" scoped>
.mainContent {
  margin-bottom: 20px;
  .title_date {
    display: flex;
    justify-content: space-between;
    .title {
      font-size: 25px;
    }
    .date {
      color: #888;
      font-size: 16px;
    }
  }
  .textContent {
    padding: 10px;
    box-sizing: border-box;
    background: #f6f6f6;
    color: #333;
    font-size: 16px;
    letter-spacing: 0.5px;
    line-height: 1.5;
    border-radius: 5px;
    margin: 10px 0px;
  }
  .sort_author {
    display: flex;
    justify-content: space-between;
    color: #aaaaaa;
    font-size: 12px;
    span {
      font-size: 14px;
      color: #666;
    }
  }
}
</style>