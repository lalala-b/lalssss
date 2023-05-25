<template>
  <div class="C-video-comment">
    <Wrap class="word-cloud-chart">
      <Title title="评论热词" class="p-0" icon="iconfire-fill" />
      <div id="chart2" class="word-cloud-bg" />
    </Wrap>
    <Wrap v-loading="!data" class="comment-data">
      <CommentData />
    </Wrap>
  </div>
</template>
<script>
import Js2WordCloud from 'js2wordcloud'
import CommentData from './comment-data.vue'
import { Title } from 'components'

export default {
  components: {
    CommentData,
    Title
  },
  props: {
    reviewHotWord: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    data() {
      return this.$response.reviewData
    }
  },
  watch: {
    reviewHotWord() {
      this.wordCloud()
    }
  },
  inject: ['$response'],
  methods: {
    // 生成词云
    wordCloud() {
      if (!this.reviewHotWord) {
        return
      }
      var wc = new Js2WordCloud(document.getElementById('chart2'))
      const list = []
      // for (let i = 1; i < 50; i++) {
      //   list.push([`小白${i}`, 7 * i - 4])
      // }
      for (let i = 0; i < this.reviewHotWord.length; i++) {
        const element = this.reviewHotWord[i]
        list.push([element.word, element.weight - 0])
      }
      const option = {

        fontSizeFactor: 5,
        rotateRatio: 0,
        tooltip: {
          show: true,
          formatter: function(item) {
            return item[0]
          }
        },
        maxFontSize: 80,
        minFontSize: 24,
        color: 'random-light',
        backgroundColor: 'rgba(0,0,0,.0)',
        list
      }
      wc.setOption(option)
      window.onresize = function() {
        wc.setOption(option)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .C-video-comment {
    display: flex;
    height: 100%;
    background: #fff;
    .word-cloud-chart {
      flex: 1;
      height: 500px;
      // background: url('../../assets/view/Dashboard_WordCloud_bg.png');
      // background-size: 100% 100%;
      position: relative;
      .word-cloud-bg {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
      }
    }
    .comment-data {
      flex: 2;
      // margin-left: 15px;
      min-height: 200px;
      // margin-left: 15px;
    }
  }
</style>
