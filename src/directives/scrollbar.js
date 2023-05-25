import Vue from 'vue'

function insertAfter(newElement, targentElement) {
  var parent = targentElement.parentNode
  if (parent.lastChild === targentElement) {
    parent.appendChild(newElement)
  } else {
    parent.insertBefore(newElement, targentElement.nextSibling)
  }
}

export default function install() {
  Vue.directive('scrollbar', {
    bind(el, binding) {
      if (el.querySelector) {
        let count = 0
        const header = el.querySelector('.el-table__header-wrapper')

        const body = el.querySelector('.el-table__body-wrapper')
        const checkLoading = setInterval(() => {
          const loading = el.parentNode.querySelector('.el-loading-mask')

          if (((loading || {}).style || {}).display === 'none') {
            clearInterval(checkLoading)

            const headerPosition = header.currentStyle ? header.currentStyle.position : window.getComputedStyle(header, null)['position']
            const headerTop = header.currentStyle ? header.currentStyle.top : window.getComputedStyle(header, null)['top']
            const headerZIndex = header.currentStyle ? header.currentStyle.zIndex : window.getComputedStyle(header, null)['zIndex']

            const headerScroll = header.childNodes[0]

            // 需要滑动
            if (headerScroll.offsetWidth > header.offsetWidth) {
              const ratio = header.offsetWidth / headerScroll.offsetWidth
              const scrollBox = document.createElement('div')
              const scrollBar = document.createElement('div')
              scrollBar.style.width = `${100 * ratio}%`
              scrollBar.style.height = '8px'
              scrollBar.style.background = '#7d7d7d'
              scrollBar.style.borderRadius = '14px'
              scrollBar.style.position = 'absolute'
              scrollBar.style.left = 0
              scrollBar.style.transition = `all .05s`
              scrollBox.appendChild(scrollBar)

              if (headerPosition) {
                scrollBox.style.position = headerPosition
                scrollBox.style.top = `${header.offsetHeight - Math.abs(parseInt(headerTop)) - 1}px`
              }

              scrollBox.style.height = '0px'
              scrollBox.style.textAlign = 'left'
              scrollBox.style.zIndex = headerZIndex

              insertAfter(scrollBox, header)

              body.addEventListener('scroll', (e) => {
                scrollBar.style.left = `${e.target.scrollLeft * ratio}px`
              })

              scrollBar.addEventListener('click', (e) => {
                e.stopPropagation()
              })

              let touch = false
              let startEventX = 0
              let startLeft = 0

              scrollBar.addEventListener('mousedown', (e) => {
                touch = true
                startEventX = e.clientX
                startLeft = scrollBar.offsetLeft
              })

              window.addEventListener('mousemove', (e) => {
                if (touch) {
                  body.scrollTo((e.clientX - startEventX + startLeft) / ratio, body.offsetTop)
                }
              })

              window.addEventListener('mouseup', (e) => {
                touch = false
              })

              // 点击空白处滑动table
              scrollBox.addEventListener('click', (e) => {
                e.stopPropagation()
                const scrollBarWidth = ratio * header.offsetWidth
                if (e.offsetX > scrollBarWidth) {
                  body.scrollTo((e.offsetX - scrollBarWidth) / ratio, body.offsetTop)
                } else {
                  body.scrollTo(e.offsetX / ratio, body.offsetTop)
                }
              })
            }
          } else {
            count++
            if (count > 200) {
              clearInterval(checkLoading)
            }
          }
        }, 100)
      }
    }
  })
}
