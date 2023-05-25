import { GridComponent, TitleComponent, TooltipComponent, LegendComponent, DataZoomComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import * as Echarts from 'echarts/core'
import BaseTheme from './theme'
import { ToolboxComponent } from 'echarts/components'
/** 主题名称 */
const ThemeName = 'Q'
export { ThemeName }

/** 注册基本组件与主题 */
Echarts.use([GridComponent, CanvasRenderer, TitleComponent, TooltipComponent, LegendComponent, DataZoomComponent, ToolboxComponent])
Echarts.registerTheme(ThemeName, BaseTheme)

/** Echart 模块对象 */
export default Echarts
