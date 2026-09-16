# 藏头诗生成器

输入一段中文，选择藏头或藏尾，并在五言、七言选项间切换，用已有诗句组合出一首诗。

[在线体验](https://holynova.github.io/head_tail_poem_generator/)

![藏头诗生成器的选项、输入框与诗句结果](screenshot.png)

## 使用

1. 选择五言或七言，以及藏头 / 藏尾。
2. 输入希望嵌入诗句的文字，点击“试试运气”。
3. 查看组合结果；需要不同组合时再次尝试。

## 开发

这是 React 16、Webpack 4 与 node-sass 4 的历史项目。现有脚本如下；旧依赖可能无法直接在当前 Node.js 上安装，需要先处理工具链兼容性。

```bash
npm ci
npm start
```

生产构建使用 `npm run build`，输出到 `build/`。只想体验功能时，可先打开在线版本。

## 代码入口

- [src/components/PoemGen.jsx](src/components/PoemGen.jsx)：选项、诗句组合与结果展示。
- [src/utils/](src/utils/)：辅助逻辑。
- [pre_process/](pre_process/)：诗句数据预处理。
- [README.old.md](README.old.md)：历史说明。
