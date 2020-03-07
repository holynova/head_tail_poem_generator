import { Radio, Button, Input } from 'antd'
import React, { useCallback, useState } from 'react'
import headWordDict from '../assets/headWordDict.js'
import poemDict from '../assets/poemDict.js'
import tailWordDict from '../assets/tailWordDict.js'
import { log } from '../utils/debug'
import random from '../utils/random'
import './PoemGen.scss'


function PoemGen() {
  let [size, setSize] = useState(7)
  let [position, setPosition] = useState('HEAD')
  let [keyWord, setKeyWord] = useState('清风明月水落石出')
  let [rows, setRows] = useState([])


  const onKeyWordChange = (e) => {
    let word = e.target.value
    // log('word', word)
    // if (word.length > size) {
    //   word = word.substring(0, size)
    // }
    setKeyWord(word)
    // composePoem(word)
  }
  const genRandomRowData = (resultList) => {
    let count = resultList.length
    let randomIndex = random.between(0, count)
    let row = resultList[randomIndex]
    // let row = random.choose(found)
    return {
      ...row,
      alter: resultList,
      count,
      index: randomIndex
    }
  }


  const composePoem = useCallback((word = '', length = 7) => {
    let res = []
    let input = word.trim()
    if (!input) {
      return
    }
    log('compose', { word, input, length })
    // log('keyWord', keyWord)
    input
      .split('')
      .forEach(char => {
        let dict = position === 'TAIL' ? tailWordDict : headWordDict
        let found = dict[char]
        let lengthDict = {}
        // let countDict = {}
        const notFoundData = { line: '翻遍字典没找到，你快过来自己编' }
        if (!found) {
          res.push(notFoundData)

        } else {
          found.forEach(item => {
            let len = (item.line.length - 1) / 2
            let current = lengthDict[len]
            lengthDict[len] = current ? [...current, item] : [item]
          })
          let results = lengthDict[length]
          let rowData = results ? genRandomRowData(results) : notFoundData
          res.push(rowData)
        }

      })
    setRows(res)
  }, [position])

  const onChangeRow = index => {
    setRows(prevRows => {
      // log({ prevRows, index })
      // const { index: prevIndex } = prevRows
      const { alter, index: prevIndex } = prevRows[index]
      let i = 0
      let row = null
      do {
        row = genRandomRowData(alter)
        if (i++ > 999) {
          break
        }
      } while (row.index === prevIndex)
      // // let newRows = prevRows.splice()
      prevRows[index] = row
      return [...prevRows]
    })
  }

  const renderRow = (row, index) => {

    let charList = row.line.split('')
    let tail = charList.pop()
    let head = charList.shift()
    let middle = charList.join('')
    let getSource = (row) => {
      if (row && row.poemId) {
        let poem = poemDict[row.poemId]
        return `---[${poem.dynasty}] ${poem.author || '佚名'} <${poem.title}>`
      } else {
        return null
      }
    }
    return (
      <div className='poem-row' key={index} >
        <span className={`head ${position === "HEAD" ? "highlight" : ""}`}>{head}</span>
        <span className="rest">{middle}</span>
        <span className={`head ${position === "TAIL" ? "highlight" : ""}`}>{tail}</span>

        <span className='source' >{getSource(row)}</span>
        {
          row.count > 1 ? (
            <span className='change-button' onClick={() => { onChangeRow(index) }} >{`换一个(共${row.count}首)`}
            </span>)
            : null
        }
        {/* <span className='alter' ></span> */}

      </div>
    )
  }

  // useEffect(() => {
  //   composePoem(keyWord, 7)
  // }, [composePoem, keyWord])

  return (
    <div className='PoemGen' >
      <h1>藏头诗生成器</h1>
      <div>
        <div className="form-item">
          <Radio.Group defaultValue={size} buttonStyle="solid" onChange={(e) => setSize(e.target.value)} >
            <Radio.Button value={7}>七言律诗</Radio.Button>
            <Radio.Button value={5}>五言绝句</Radio.Button>
          </Radio.Group>
        </div>

        <div className="form-item">
          <Radio.Group defaultValue={position} buttonStyle="solid" onChange={(e) => setPosition(e.target.value)} >
            <Radio.Button value="HEAD">藏头</Radio.Button>
            <Radio.Button value="TAIL">藏尾</Radio.Button>
          </Radio.Group>
        </div>
        <div className="form-item">
          <Input value={keyWord} onChange={onKeyWordChange} ></Input>
        </div>
        <Button onClick={() => composePoem(keyWord, size)} >试试运气</Button>
      </div>

      <div className='result'>
        <div className="title">{keyWord}</div>
        <div className="author">李白</div>
        {rows.map((row, index) => renderRow(row, index))}
      </div>
      {/* <pre>
        {JSON.stringify({ size, keyWord, position }, null, 2)}
      </pre> */}

    </div>)
}

export default PoemGen