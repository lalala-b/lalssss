export const getAccountStatusName = (status) => {
  switch (status) {
    case 0:
      return '用户绑定中'
    case 1:
      return '已删除'
    case 2:
      return '从未绑定'
  }
}
export const getID = (row) => {
  if (row.uniqueId) return row.uniqueId
  if (row.eid) return row.eid
  if (row.getDataUrl) return row.getDataUrl
}
