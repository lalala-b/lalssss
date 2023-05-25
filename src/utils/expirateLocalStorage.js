// 设置LocalStorage数据，包括过期时间（设置分钟）
export const setLocalStorageWithExpiration = (key, value, expirationInMinutes) => {
  const expirationDate = new Date().getTime() + (expirationInMinutes * 60 * 1000)
  const item = {
    value: value,
    expiration: expirationDate
  }
  localStorage.setItem(key, JSON.stringify(item))
}

// 获取LocalStorage数据，并检查过期时间
export const getLocalStorageWithExpiration = (key) => {
  const item = JSON.parse(localStorage.getItem(key))
  if (!item) {
    return null
  }
  if (new Date().getTime() > item.expiration) {
    localStorage.removeItem(key)
    return null
  }
  return item.value
}
