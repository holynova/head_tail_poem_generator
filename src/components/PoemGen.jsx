import React, { useState } from 'react'
function PoemGen() {
  let [size, setSize] = useState(5)
  let [position, setPosition] = useState('HEAD')
  let [keyWord, setKeyWord] = useState('爱我中华')

  const onKeyWordChange = (e) => {
    let word = e.target.value
    if (word.length > size) {
      word = word.substring(0, size)
    }
    setKeyWord(word)
  }

  return (
    <div>
      <h1>藏头诗生成器</h1>
      <div className="form-item">
        <span>类型</span>
        <input name='size' type='radio'></input>五言绝句
        <input name='size' type='radio'></input>七言律诗
      </div>

      <div className="form-item">
        <span>类型</span>
        <input name='size' type='radio'></input>藏头
        <input name='size' type='radio'></input>藏尾
      </div>
      <div className="form-item">
        <input value={keyWord} onInput={onKeyWordChange} ></input>
      </div>

    </div>)
}

export default PoemGen