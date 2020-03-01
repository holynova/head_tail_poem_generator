const fs = require('fs')
const path = require('path')
const promisify = require('util').promisify
const log = console.log.bind(console)
const dayjs = require('dayjs')

const fileUtil = {
  readFile: promisify(fs.readFile),
  writeFile: promisify(fs.writeFile),
  mkdir: promisify(fs.mkdir),
}

class PreProcessor {
  constructor(config) {
    let defaultConfig = {
      outputDir: './output',
      outputExt: '.json',
      outputFileName: '',
      outputFileNamePrefix: 'result',
    }
    let all = { ...defaultConfig, ...config }

    this.dataFileName = all.dataFileName
    this.outputDir = all.outputDir
    this.outputExt = all.outputExt
    this.outputFileName = all.outputFileName
    this.outputFileNamePrefix = all.outputFileNamePrefix

    this.saveToFile = this.saveToFile.bind(this)
    this.getOutputFileName = this.getOutputFileName.bind(this)
    this.dataToStr = this.dataToStr.bind(this)
  }

  dataToStr(data) {
    let str = data
    if (typeof data === 'object') {
      str = JSON.stringify(data, null, 2)
    } else if (typeof data === 'string') {
      str = data
    } else {
      throw new Error(`filetype error ${typeof data}`)
    }
    return str
  }

  getOutputFileName() {
    let fileName = ''
    if (this.outputFileName) {
      fileName = this.outputFileName + this.outputExt
    } else {
      let now = dayjs(new Date()).format('_YYYYMMDD_HHmmss_SSS')
      fileName = this.outputFileNamePrefix + now + this.outputExt
    }
    // let now = new Date().getTime()

    let fullName = path.join(this.outputDir, fileName)
    return fullName
  }

  saveToFile(data) {
    //===============================
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir)
    }
    // save(str, dir)
    let filename = this.getOutputFileName()
    let dataStr = this.dataToStr(data)
    fileUtil.writeFile(filename, dataStr)
    return filename;
  }


  async go() {
    // let [] = await this.readAndGet
    let p1 = fileUtil.readFile('gushi.json')
    let p2 = fileUtil.readFile('tangshi.json')
    Promise.all([p1, p2])
      .then(([file1, file2]) => {
        let arr = [...JSON.parse(file1), ...JSON.parse(file2)]
        log({ arrLen: arr.length })
        return arr
      }).then(poems => {
        let poemDict = {}
        let headWordDict = {}
        let tailWordDict = {}
        poems.forEach((p, i) => {
          let id = `poem_${i}`
          poemDict[id] = p
          // const puncReg = /[<>《》！*\(\^\)\$%~!@#…&%￥—\+=、。，？；‘’“”：·`]/g;
          const puncReg = /[！。？；·`]/g;
          let lines = p.content
            .replace(/\(.+?\)/g, '')//干掉括号内文字
            .split(puncReg)
            .filter(item => item)
          lines.forEach(line => {
            let head = line.substring(0, 1)
            let tail = line.substring(line.length - 1, line.length)
            let lineItem = { line, poemId: id }

            let headValue = headWordDict[head]
            headWordDict[head] = headValue ? [...headValue, lineItem] : [lineItem]

            let tailValue = tailWordDict[tail]
            tailWordDict[tail] = tailValue ? [...tailValue, lineItem] : [lineItem]
          })
        })

        // 存储3本字典
        let resultFileName = this.saveToFile({ poemDict, headWordDict, tailWordDict })
        log('存储完成' + resultFileName)

      })
  }

}

let p = new PreProcessor({})
p.go()

// const main = () => {
//   // fs.readSync()
//   let p1 = fileUtil.readFile('gushi.json')
//   let p2 = fileUtil.readFile('tangshi.json')
//   Promise.all([p1, p2])
//     .then(([file1, file2]) => {
//       let arr = [...JSON.parse(file1), ...JSON.parse(file2)]
//       log({ arrLen: arr.length })
//       return arr
//     }).then(poems => {
//       let poemDict = {}
//       let headWordDict = {}
//       let tailWordDict = {}
//       poems.forEach((p, i) => {
//         let id = `poem_${i}`
//         poemDict[id] = p
//         // const puncReg = /[<>《》！*\(\^\)\$%~!@#…&%￥—\+=、。，？；‘’“”：·`]/g;
//         const puncReg = /[！。？；·`]/g;
//         let lines = p.content.split(puncReg).filter(item => item)
//         lines.forEach(line => {
//           let head = line.substring(0, 1)
//           let tail = line.substring(-1, line.length)
//           let lineItem = { line, poemId: id }

//           let headValue = headWordDict[head]
//           headWordDict[head] = headValue ? [...headValue, lineItem] : [lineItem]

//           let tailValue = tailWordDict[tail]
//           tailWordDict[tail] = tailValue ? [...tailValue, lineItem] : [lineItem]
//         })
//       })

//       // 存储3本字典


//     })
// };

// const saveToFile = () => {

// }
// main()