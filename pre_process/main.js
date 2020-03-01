const fs = require('fs')
const path = require('path')
const promisify = require('util').promisify
const log = console.log.bind(console)

const fileUtil = {
  readFile: promisify(fs.readFile),
  writeFile: promisify(fs.writeFile),
  mkdir: promisify(fs.mkdir),
}

const main = () => {
  // fs.readSync()
  let p1 = fileUtil.readFile('gushi.json')
  let p2 = fileUtil.readFile('tangshi.json')
  Promise.all([p1, p2])
    .then(([file1, file2]) => {
      let arr = [...JSON.parse(file1), ...JSON.parse(file2)]
      log({ arrLen: arr.length })
      return arr
    })

};
main()