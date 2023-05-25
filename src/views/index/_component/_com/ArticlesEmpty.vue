<template>
  <a class="empty flex flex-dir-col">
    <div class="empty-img">
      <img src="../../_src/empty.png" alt="">
    </div>
    <h2 class="empty-text">作者赶稿中，敬请期待，点击查看更多可阅读往期文章</h2>
  </a>
</template>

<style lang="scss" scoped>
  .empty {
    &-img {
      position: relative;
      overflow: hidden;
      width: 100%;
      padding-bottom: 54%;
      border-radius: 10px;
      box-shadow: 0 8px 12px rgba(56, 123, 193, .1);
      background: #fff;
      img {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 45.6%;
        height: 74.4%;
        transform: translate(-50%, -50%);
        object-fit: cover;
      }
    }
    &-text {
      margin-top: 18px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      color: #AFAFAF;
      line-height: 24px;
    }
  }
</style>

