<script>
export default {
  name: 'Nitice',
  functional: true,
  render(h, context) {
    return (
      <div class='notice'>
        <h3 data-bold>乾数据将获得以下权限</h3>
        <p>获得您的昵称、头像、性别；</p>
        <p>获得您数据报表权限</p>
        <p>
          授权后表示您已同意
          <a underline='false' href='/agreement.html' target='_blank'>乾数据协议</a>
        </p>
      </div>
    )
  }
}
</script>

<style lang="scss" scoped>
  .notice {
    padding: 16px;
    background: #F0F0F0;
    > h3 {
      font-size: 14px;
      font-weight: 500;
      color: #272727;
      line-height: 20px;
      margin-bottom: 8px;
    }
    > p {
      line-height: 16px;
      font-size: 12px;
      a {
        color: $--color-primary;
      }
    }
  }
</style>
