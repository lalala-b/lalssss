import { initGlobalState } from 'qiankun'
import store from '../store'

const state = {
  isLogin: store.state.user.isLogin
}
const { onGlobalStateChange, setGlobalState } = initGlobalState()
// onGlobalStateChange((value, prev) => {
//   console.log('globalState------', value, prev)
// })

setGlobalState(state)

