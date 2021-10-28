<template>
  <div class="headerBox">
    <div class="leftPart">
      <img src="../assets/image/logo.png" alt class="logo" />
      <div class="leftText">
        <span>TVJOY</span>
        <span>博客系统</span>
      </div>
    </div>
    <div class="rightPart">
      <a href>博客列表</a>
      <a href>添加博客</a>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.headerBox {
  width: 100%;
  height: 80px;
  background: #41b883;
  padding-left: 20px;
  padding-right: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .leftPart {
    height: 100%;
    display: flex;
    align-items: center;
    .logo {
      width: 52px;
      height: 50px;
      margin-right: 10px;
    }
    .leftText {
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: #ffffff;
      & span:nth-child(1) {
        opacity: 0.6;
      }
      & span:nth-child(2) {
        font-size: 20px;
      }
    }
  }
  .rightPart {
    font-size: 20px;
    display: flex;
    a {
      text-decoration: none;
      color: #ffffff;
      padding: 6px 15px;
      box-sizing: border-box;
      border-radius: 5px;
      margin-left: 5px;
      &:hover {
        background: #ffffff;
        color: #41b883;
      }
    }
  }
}
</style>