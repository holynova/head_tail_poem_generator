import React, { useState } from 'react'
import './PoemGen.scss'

import poemDict from '../assets/poemDict.js'
import headWordDict from '../assets/headWordDict.js'
import tailWordDict from '../assets/tailWordDict.js'
import random from '../utils/random'
import { log } from '../utils/debug'

function PoemGen() {
  let [size, setSize] = useState(999)
  let [position, setPosition] = useState('HEAD')
  let [keyWord, setKeyWord] = useState('清风明月水落石出')
  let [rows, setRows] = useState([])

  const onKeyWordChange = (e) => {
    let word = e.target.value
    if (word.length > size) {
      word = word.substring(0, size)
    }
    setKeyWord(word)
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

  const composePoem = () => {
    let res = []
    keyWord
      .split('')
      .forEach(char => {
        let dict = position === 'TAIL' ? tailWordDict : headWordDict
        let found = dict[char]
        let rowData = found ? genRandomRowData(found) : { line: '翻遍字典没找到, 你快过来自己编' }
        res.push(rowData)
      })
    setRows(res)
  }

  const onChangeRow = index => {
    setRows(prevRows => {
      // log({ prevRows, index })
      let row = genRandomRowData(prevRows[index].alter)
      // // let newRows = prevRows.splice()
      prevRows[index] = row
      return [...prevRows]
    })
  }

  const genRow = (row, index) => {
    let [head, ...rest] = row.line.split('')
    let getSource = (row) => {
      if (row && row.poemId) {
        let poem = poemDict[row.poemId]
        return `---[${poem.dynasty}] ${poem.author || '佚名'} <${poem.title}>`
      } else {
        return null
      }
    }
    return (
      <div className='poem-row' key={row.line} >
        <span className="head">{head}</span>
        <span className="rest">{rest.join('')}</span>
        <span className='source' >{getSource(row)}</span>
        {
          row.count > 1 ? <button onClick={() => { onChangeRow(index) }} >{`换一个(共${row.count}首)`}</button> : null
        }
        {/* <span className='alter' ></span> */}

      </div>
    )


  }
  return (
    <div className='PoemGen' >
      <h1>藏头诗生成器</h1>
      <div>
        <div className="form-item">
          <span>类型</span>
          <input name='size' type='radio'></input>五言绝句
        <input name='size' type='radio'></input>七言律诗
      </div>

        <div className="form-item">
          <span>类型</span>
          <input name='type' type='radio'></input>藏头
        <input name='type' type='radio'></input>藏尾
      </div>
        <div className="form-item">
          <input value={keyWord} onInput={onKeyWordChange} ></input>
        </div>
        <button onClick={composePoem} >开始作诗</button>
      </div>

      <div className='result'>
        {rows.map((row, index) => genRow(row, index))}
      </div>
      <pre>
        {JSON.stringify(rows, null, 2)}
      </pre>

    </div>)
}

export default PoemGen