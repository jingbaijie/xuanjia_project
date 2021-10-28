<template>
  <div id="mainBox">
    <BlogItem v-for="item in contentArr" :key="item.id" v-bind:itemObj="item" />
  </div>
</template>

<script>
import BlogItem from "@/components/blogItem.vue";
import axios from "axios";
export default {
  data() {
    return {
      contentArr: [
        {
          id: 1,
          title: "红楼梦",
          date: new Date(),
          content:
            "《红楼梦》是一部百科全书式的长篇小说。以宝黛爱情悲剧为主线，以四大家族的荣辱兴衰为背景，描绘出18世纪中国封建社会的方方面面，以及封建专制下新兴资本主义民主思想的萌动。结构宏大、情节委婉、细节精致，人物形象栩栩如生，声口毕现，堪称中国古代小说中的经典。",
          sort: "古典文学",
          author: "曹雪芹"
        },
        {
          id: 2,
          title: "周生如故",
          date: new Date(),
          content:
            "年少成名、战功赫赫的小南辰王周生辰，立志一生效忠国家，其严谨作风和谦逊为人为世人所称道。名门漼氏独女漼时宜出生便被指腹为婚为未来太子妃，因与王府是世交，便被长辈送到王府学艺。漼时宜善良可爱、活泼聪慧的个性，在王府深得众人喜爱，学艺精进也很快，是王府的开心果。点滴相处中,漼时宜钦佩周生辰远大的志向和儒雅的品格，不知不觉中爱上了这位将军。无论是守在王府等待捷报，还是与周生辰并肩作战，漼时宜都是周生辰最坚强的后盾和最温暖的支撑。两人情感迅速升温，但依然发乎情止乎礼。边关再度告急，周生辰义不容辞领兵出战，而漼时宜却须担负起家族声誉的责任与太子完婚。奋勇抗敌的周生辰遭奸人所害，留下唯一给漼时宜的临终遗言之后与世长辞。漼时宜悲痛万分，从城墙一跃而下殉情而亡。",
          sort: "小说",
          author: "墨宝非宝"
        }
      ]
    };
  },
  components: {
    BlogItem
  },
  created() {
    axios({
      url: "https://ku.qingnian8.com/dataApi/qingKu/getList.php"
    }).then(res => {
      this.contentArr=res.data;
    });
  }
};
</script>

<style lang="less" scoped>
#mainBox {
  width: 100%;
  min-height: 900px;
  padding: 50px 30px;
  box-sizing: border-box;
}
</style>