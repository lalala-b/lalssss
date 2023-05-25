/*
 * @Author: Linjie
 * @Description:
 * @Date: 2020-12-16 15:58:26
 * @LastEditTime: 2020-12-30 16:47:35
 * @LastEditors: Linjie
 */
const getters = {
  avatar: state => state.user.userInfo.image,
  name: state => state.user.userInfo.name,
  realname: state => state.user.userInfo.realname,
  id: state => state.user.userInfo.id,
  isLogin: state => state.user.isLogin,
  user: state => state.user,
  permissionRoutes: state => state.permission.routes,
  userid: state => state.user.userInfo.userid,
  sidebar: state => state.app.sidebar
}
export default getters
