import React, { useState } from 'react'
import './PoemGen.scss'

import poemDict from '../assets/poemDict.js'
import headWordDict from '../assets/headWordDict.js'
import tailWordDict from '../assets/tailWordDict.js'
import random from '../utils/random'

function PoemGen() {
  let [size, setSize] = useState(999)
  let [position, setPosition] = useState('HEAD')
  let [keyWord, setKeyWord] = useState('爱我中华')
  let [rows, setRows] = useState([])

  const onKeyWordChange = (e) => {
    let word = e.target.value
    if (word.length > size) {
      word = word.substring(0, size)
    }
    setKeyWord(word)
  }


  const composePoem = () => {
    let lines = []
    keyWord.split('').forEach(word => {
      if (position === 'HEAD') {
        let found = headWordDict[word]
        if (found) {
          let count = found.length
          let row = random.choose(found)
          lines.push(row)
        } else {
          lines.push({ line: 'not found' })
        }
      }
    })
    setRows(lines)
  }
  const genRow = row => {
    let [head, ...rest] = row.line.split('')
    let getSource = (row) => {
      if (row && row.poemId) {
        let poem = poemDict[row.poemId]
        return `---出自[${poem.dynasty}] ${poem.author} <${poem.title}>`
      } else {
        return null
      }
    }
    return (
      <div className='poem-row' key={row.line} >
        <span className="head">{head}</span>
        <span className="rest">{rest.join('')}</span>
        <span className='source' >{getSource(row)}</span>
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
        {rows.map(row => genRow(row))}
      </div>

    </div>)
}

export default PoemGen