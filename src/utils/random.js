export default {
  choose(arr) {
    if (Array.isArray(arr) && arr.length > 0) {
      let randomIndex = Math.floor(Math.random() * arr.length)
      return arr[randomIndex]
    } else {
      return null
    }
  }
}