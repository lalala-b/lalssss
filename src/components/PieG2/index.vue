<template>
  <div id="container" />
</template>
<script>
import {
  defineComponent,
  reactive,
  toRefs,
  watch
} from '@vue/composition-api'
import { Chart } from '@antv/g2'
export default defineComponent({
  props: {
    dataList: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  setup(props) {
    const states = reactive({
      isEmpty: false,
      allHasData: false,
      OnlyPie: false,
      OnlyAccountedForList: false,
      otherValue: 0,
      otherOffsetAngle: 0
    })
    watch(
      () => props.dataList,
      (val) => {
        if (val) {
          states.isEmpty = !!(
            props.dataList &&
            ((props.dataList.pieData && props.dataList.pieData.length) ||
              (props.dataList.barData && props.dataList.barData.length))
          )
          states.allHasData = !!(
            props.dataList &&
            props.dataList.pieData &&
            props.dataList.pieData.length &&
            props.dataList.barData &&
            props.dataList.barData.length
          )
          states.OnlyPie = !!(
            props.dataList &&
            props.dataList.pieData &&
            props.dataList.pieData.length &&
            !(props.dataList.barData && props.dataList.barData.length)
          )
          states.OnlyAccountedForList = !!(
            props.dataList &&
            !(props.dataList.pieData && props.dataList.pieData.length) &&
            props.dataList.barData &&
            props.dataList.barData.length
          )
          const data = props.dataList.pieData
          const other = props.dataList.barData
          states.otherValue = (data.find((item) => item.type === '其他') || {})
            .value
          const otherRatio = states.otherValue / 100 // Other 的占比
          states.otherOffsetAngle = otherRatio * Math.PI // other 占的角度的一半
          document.getElementById('container').innerHTML = ''
          initComponent(data, other)
        }
      },
      {
        deep: true
      }
    )
    const initComponent = (data, other) => {
      const chart = new Chart({
        container: 'container',
        autoFit: true,
        height: 340,
        padding: states.allHasData ? [20, 0, 20, 20] : [0, 0, 0, 0]
      })

      chart.legend(false)
      chart.tooltip({
        showMarkers: false
      })

      const view1 = chart.createView({
        region: {
          start: {
            x: states.OnlyPie ? 0.2 : 0,
            y: 0
          },
          end: {
            x: states.OnlyPie ? 0.8 : 0.5,
            y: 1
          }
        }
      })
      view1.coordinate('theta', {
        radius: 0.7,
        startAngle: 0 + states.otherOffsetAngle,
        endAngle: Math.PI * 2 + states.otherOffsetAngle
      })
      view1.data(data)
      view1.interaction('element-highlight')
      view1
        .interval()
        .adjust('stack')
        .position('value')
        .color('type', ['#5A8EF9', '#5AD8A6', '#5D7093'])
        .tooltip('type*value', (type, value) => {
          return {
            title: '不同业务类型投放金额占比与等级占比',
            name: type,
            value: value + '%'
          }
        })
        .label('value', function() {
          return {
            content: (obj) => {
              var data = obj.data
              if (Number(obj.data) > 10000) {
                data = (Number(obj.data) / 10000).toFixed(2)
                return obj.type + '\n' + data + '万' + '\n' + obj.value + '%'
              } else {
                return obj.type + '\n' + data + '\n' + obj.value + '%'
              }
            }
          }
        })

      const view2 = chart.createView({
        region: {
          start: {
            x: states.OnlyAccountedForList ? 0.2 : 0.5,
            y: 0.1
          },
          end: {
            x: states.OnlyAccountedForList ? 0.8 : 1,
            y: 0.9
          }
        }
      })
      view2.axis(false)
      view2.data(other)
      view2.interaction('element-highlight')
      const colors = ['#5B8FF9', '#5AD8A6', '#F5BD17', '#E8684A', '#5D7093', '#6CC7EC', '#9270CA', '#259A99', '#FF9D4D', '#FE99C3', '#91CC75']
      view2
        .interval()
        .adjust('stack')
        .position('value')
        .color('type', colors)
        .tooltip('type*value', (type, value) => {
          return {
            title: '不同业务类型投放金额占比与等级占比',
            name: type,
            value: value + '%'
          }
        })
        .label('value', {
          position: 'right',
          offsetX: 5,
          offsetY: 10,
          content: (obj) => {
              var data = obj.data
              if (Number(obj.data) > 10000) {
                data = (Number(obj.data) / 10000).toFixed(2)
                return obj.type + '\n' + data + '万' + '\n' + obj.value + '%'
              } else {
                return obj.type + '\n' + data + '\n' + obj.value + '%'
              }
            }
        })
      chart.render()
      if (states.allHasData) {
        drawLinkArea(chart, view1, view2)
        chart.on('afterpaint', function() {
          drawLinkArea(chart, view1, view2)
        })
      }
    }
    /* ---------绘制连接区间-----------*/
    const drawLinkArea = (chart, view1, view2) => {
      const canvas = chart.getCanvas()
      const container = chart.backgroundGroup
      const view1_coord = view1.getCoordinate()
      const center = view1_coord.getCenter()
      const radius = view1_coord.getRadius()
      const interval_geom = view2.geometries[0]
      const interval_container = interval_geom.container
      const interval_bbox = interval_container.getBBox()
      const view2_coord = view2.getCoordinate()
      // area points
      const pie_start1 = {
        x: center.x + Math.cos(Math.PI * 2 - states.otherOffsetAngle) * radius,
        y: center.y + Math.sin(Math.PI * 2 - states.otherOffsetAngle) * radius
      }
      const pie_start2 = {
        x: center.x + Math.cos(states.otherOffsetAngle) * radius,
        y: center.y + Math.sin(states.otherOffsetAngle) * radius
      }
      const interval_end1 = {
        x: interval_bbox.minX,
        y: view2_coord.end.y
      }
      const interval_end2 = {
        x: interval_bbox.minX,
        y: view2_coord.start.y
      }
      const path = [
        ['M', pie_start1.x, pie_start1.y],
        ['L', pie_start2.x, pie_start2.y],
        ['L', interval_end2.x, interval_end2.y],
        ['L', interval_end1.x, interval_end1.y],
        ['Z']
      ]
      container.addShape('path', {
        attrs: {
          path,
          fill: '#e9f4fe'
        }
      })
      canvas.draw()
    }
    return {
      ...toRefs(states)
    }
  }
})
</script>
<style lang="scss" scoped>
</style>
