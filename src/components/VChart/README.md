# 图表模块

## 文件结构
- `mixins` 图表模块 mixin 类型模块存放目录
  - `charts.js` 图表基础业务逻辑，包含通用 `props`、内部变量、图表实例管理及相关生命周期处理
- `types` 图表类型模块存放目录
  - `line.js` 折线图模块
- `helper.js` 图表辅助模块，该模块主要复杂图表常规功能模块的注册与管理，同时为不同模块提供统一的 `Echarts` 模块对象
- `index.js` 模块主文件，图表类型需要在这里定义后才可以直接用 `type` 指定
- `index.scss` 模块样式文件
- `theme.js` 模块主题定义文件

## 注意事项
- 该模块使用 `Echarts V5` 且要求使用按需加载的方式开发，因此不允许在本模块直接用以下方式全量引入
  ```ts
  import * as echarts from 'echarts';
  ```
  正确的开发方式请参照 `line.js` 模块，单独引入需要的模块并用 `Echarts.use` 注册模块
- 全局的设置优先考虑修改 `theme.js`，尽量避免到处写配置的情况出现

## 内部变量
- `this.$chart` Echart 实例
- `this.$refs.content` Echart 实例挂载节点