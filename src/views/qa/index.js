import request from '@/http'
/* eslint-disable eqeqeq */
window.onload = () => {
  if (!localStorage.getItem('openqa')) return

  let recordList = []
  let recordParams = {
    actions: []
  }

  const formatElement = (element) => {
    if (element[element.length - 1] === '>') {
      return element.substr(0, element.length - 1)
    }

    return element
  }

  const getPath = (el) => {
    let e = el

    window.event ? window.event.cancelBubble = true : e.stopPropagation() //  阻止冒泡
    let domPath = Array([])
    let domText = '' // 元素文本
    if (e.innerText) {
      domText = e.innerText
    } else {
      domText = e.nodeName.toLocaleLowerCase()
    }
    const domTime = new Date().getTime() // 点击时间
    // 判断是否存在ID
    if (e.id) {
      domPath.unshift('#' + e.id.toLocaleLowerCase())
    } else {
      // 循环匹配元素
      while (e.nodeName.toLowerCase() !== 'html') {
        if (e.id) {
          // 判断是否存在ID
          domPath.unshift('#' + e.id.toLocaleLowerCase())
          // 一直找到app
          if (e.id.toLocaleLowerCase() === 'app') {
            break
          }
        } else if (e.tagName.toLocaleLowerCase() == 'body') {
          // 判断是否是BODY元素
          domPath.unshift(e.tagName.toLocaleLowerCase())
        } else {
          // 遍历获取元素顺序
          for (let i = 0; i < e.parentNode.childElementCount; i++) {
            if (e.parentNode.children[i] == e) {
              domPath.unshift(e.tagName.toLocaleLowerCase() + ':nth-child(' + (i + 1) + ')')
            }
          }
        }
        e = e.parentNode
      }
      // domPath.unshift('html');
      domPath = domPath.toString().replaceAll(',', '>')
    }

    // 5ms以上有意义 不重复
    if (domTime - ((recordList[recordList.length - 1] || {}).domTime || 0) <= 5) {
      return
    }
    // 添加到点击记录
    recordList.push({
      'text': domText,
      'path': domPath,
      'time': domTime
    })

    // console.log('元素文本: ' + domText + '   路径: ' + domPath + '   时间: ' + domTime)

    // 返回结果
    return {
      'text': domText,
      'path': domPath,
      'time': domTime
    }
  }

  let isRecord = false

  var clickTimer = null

  window.addEventListener('mouseup', (e) => {
    // clearTimeout(clickTimer)

    // clickTimer = setTimeout(() => {
    if (!isRecord) return

    if (!getPath(e.path[0])) return
    console.info('--a-a-a-a-', e)
    const elementValue = Array.isArray(getPath(e.path[0]).path) ? getPath(e.path[0]).path[0] : getPath(e.path[0]).path

    // 说明不是第一个动作，除第一个之外，其余动作添加sleep延时
    if (recordParams.actions.length >= 1) {
      recordParams.actions.push({
        'action': 'sleep',
        'isSleep': true,
        'value': '',
        'sleep': getPath(e.path[0]).time - recordParams.actions[recordParams.actions.length - 1].id,
        'id': getPath(e.path[0]).time,
        'method': '',
        'elementValue': ''
      })
    }

    recordParams.actions.push({
      'action': 'click',
      'isSleep': false,
      'value': '',
      'sleep': 0,
      'id': getPath(e.path[0]).time,
      'method': 'css',
      'elementValue': formatElement(elementValue)
    })
    // }, 500)
  })

  window.addEventListener('keyup', (e) => {
    if (!isRecord) return

    if (!getPath(e.path[0])) return

    // 只处理回车和esc
    if (e.key === 'Enter' || e.key === 'Escape') {
      const elementValue = Array.isArray(getPath(e.path[0]).path) ? getPath(e.path[0]).path[0] : getPath(e.path[0]).path

      // 说明不是第一个动作，除第一个之外，其余动作添加sleep延时
      if (recordParams.actions.length >= 1) {
        recordParams.actions.push({
          'action': 'sleep',
          'isSleep': true,
          'value': '',
          'sleep': getPath(e.path[0]).time - recordParams.actions[recordParams.actions.length - 1].id,
          'id': getPath(e.path[0]).time,
          'method': '',
          'elementValue': ''
        })
      }

      recordParams.actions.push({
        'action': e.key === 'Enter' ? 'enter' : 'esc',
        'isSleep': false,
        'value': '',
        'sleep': 0,
        'id': getPath(e.path[0]).time,
        'method': 'css',
        'elementValue': elementValue
      })
    }
  })

  // window.addEventListener('dblclick', (e) => {
  //   clearTimeout(clickTimer)
  //   console.info('--s-s-s-s-')
  // })

  window.addEventListener('input', (e) => {
    if (!isRecord) return

    if (!getPath(e.path[0])) return

    const elementValue = Array.isArray(getPath(e.path[0]).path) ? getPath(e.path[0]).path[0] : getPath(e.path[0]).path

    // 说明不是第一个动作，除第一个之外，其余动作添加sleep延时
    if (recordParams.actions.length >= 1) {
      recordParams.actions.push({
        'action': 'sleep',
        'isSleep': true,
        'value': '',
        'sleep': getPath(e.path[0]).time - recordParams.actions[recordParams.actions.length - 1].id,
        'id': getPath(e.path[0]).time,
        'method': '',
        'elementValue': ''
      })
    }

    recordParams.actions.push({
      'action': 'send_keys',
      'isSleep': false,
      'value': e.target.value,
      'sleep': 0,
      'id': getPath(e.path[0]).time,
      'method': 'css',
      'elementValue': formatElement(elementValue)
    })
  })

  const qaDom = `<div style="position: fixed ;bottom: 20px; right: 20px; z-index: 9999; ">
  <div style="
    position: absolute;
    top: -130px;
    right: 0;
    font-size: 16px;
  ">
    <div id="qa-name-input-box">
      <span>录制名称：</span>
      <input id="qa-name-input" />
    </div>
    <div id="qa-request-input-box">
      <span>发送接口地址：</span>
      <input id="qa-request-input" />
    </div>
    <div>
      <div id="qa-open-button" style="
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #fff;
        border: 1px solid #dcdfe6;
        color: #606266;
        -webkit-appearance: none;
        text-align: center;
        box-sizing: border-box;
        outline: none;
        margin: 0;
        transition: .1s;
        font-weight: 500;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        padding: 6px 10px;
        font-size: 14px;
        border-radius: 4px;
        color: #fff;
        background-color: #409eff;
        border-color: #409eff;
        margin-top: 10px;
      ">
        开启
      </div>

      <div id="qa-close-button" style="
        display: none;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #fff;
        border: 1px solid #dcdfe6;
        color: #606266;
        -webkit-appearance: none;
        text-align: center;
        box-sizing: border-box;
        outline: none;
        margin: 0;
        transition: .1s;
        font-weight: 500;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        padding: 6px 10px;
        font-size: 12px;
        border-radius: 4px;
        color: #fff;
        background-color: #f56c6c;
        border-color: #f56c6c;
        margin-top: 10px;
      ">
        关闭
      </div>
    </div>
  </div>
  </div>`
  const x = document.createElement('div')
  x.innerHTML = qaDom
  document.getElementsByTagName('body')[0].appendChild(x)

  const openDom = document.getElementById('qa-open-button')
  const closeDom = document.getElementById('qa-close-button')

  openDom.onclick = () => {
    // console.info('-=1111', Math.random())
    const nameDom = document.getElementById('qa-name-input')
    const requestDom = document.getElementById('qa-request-input')

    const nameBoxDom = document.getElementById('qa-name-input-box')
    const requestBoxDom = document.getElementById('qa-request-input-box')

    console.info('----', nameDom.value, requestDom)
    if (!nameDom.value || !requestDom.value) {
      alert('请先输入录制名称及接口')
      return
    }

    recordParams.taskName = nameDom.value
    recordParams.path = location.href

    openDom.style.display = 'none'
    closeDom.style.display = 'inline-block'

    nameBoxDom.style.display = 'none'
    requestBoxDom.style.display = 'none'

    isRecord = true
  }

  closeDom.onclick = () => {
    const requestDom = document.getElementById('qa-request-input')
    const nameBoxDom = document.getElementById('qa-name-input-box')
    const requestBoxDom = document.getElementById('qa-request-input-box')

    closeDom.style.display = 'none'
    openDom.style.display = 'inline-block'

    nameBoxDom.style.display = 'block'
    requestBoxDom.style.display = 'block'

    isRecord = false

    recordParams.actions = recordParams.actions.slice(0, recordParams.actions.length - 1)

    const finalActions = []
    let lastCss = ''
    let lastIndex = 0;

    (recordParams.actions || []).forEach((item, index) => {
      // 处理输入情况
      if (item.action === 'send_keys') {
        // 第一次输入，记录当前索引，且记录对应的css名
        if (!lastCss) {
          lastCss = item.findElement[0].elementValue
          lastIndex = index
        } else {
          // todo 多输入框tab切换时重复入栈问题
          // 判断是否相等 ， 相等且索引差值小于2  说明是相邻的输入事件，可以合并，即重新覆盖lastIndex 直至找到最后一个相邻
          if (item.findElement[0].elementValue === lastCss && index - lastIndex <= 2) {
            lastIndex = index
            lastCss = item.findElement[0].elementValue

            // 相当于最后2步之内是输入 ，算是最后一次输入了，直接入栈最后一次即可
            if (lastIndex >= recordParams.actions.length - 2) {
              finalActions.push(item)
            }
          } else {
            // 不相同说明不是继续输入 直接将上次最后一次输入 入栈 同时更新css和index
            finalActions.push(recordParams.actions[lastIndex])

            lastCss = item.findElement[0].elementValue
            lastIndex = index

            // 相当于最后2步之内是输入 ，算是最后一次输入了，直接入栈最后一次即可
            if (lastIndex >= recordParams.actions.length - 2) {
              finalActions.push(item)
            }
          }
        }
      } else {
        // 去除多余sleep
        if (item.action === 'sleep' && finalActions[finalActions.length - 1].action === 'sleep') {
          return
        }

        if (lastCss && item.action !== 'sleep') {
          finalActions.push(recordParams.actions[lastIndex])
          lastIndex = 0
          lastCss = ''
        }
        finalActions.push(item)
      }
    })

    // 为加入容错，遍历actions 将所有sendkey前都加入清空事件
    const sendKeyIndexArr = []
    finalActions.forEach((item, index) => {
      if (item.action === 'send_keys') {
        sendKeyIndexArr.push(index)
      }
    })
    sendKeyIndexArr.forEach(item => {
      finalActions[item] = [{
        'action': 'clear',
        'isSleep': false,
        'value': '',
        'sleep': 0,
        'id': finalActions[item].id,
        'method': 'css',
        'elementValue': finalActions[item].findElement[0].elementValue
      }, finalActions[item]]
    })

    finalActions.flat(Infinity)

    recordParams.actions = finalActions.flat(Infinity)

    request.post(requestDom.value, recordParams).then(() => {
      recordList = []
      recordParams = {
        actions: []
      }
    }).catch(err => {
      recordList = []
      recordParams = {
        actions: []
      }
    })
  }
}
