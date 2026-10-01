# 团团找朋友 · 互动电子绘本（食物主题）

一本**完全用代码绘制**的儿童互动电子绘本（4–6 岁）：canvas 蜡笔质感插画、真实可拖拽翻页、
点击食物有动画和音效、每页温暖真人感离线朗读（edge-tts）。

> 这是用 [interactive-picture-book skill](https://github.com/YaoSiyuan43/storybook-cloud) 做出来的**第二个案例**，
> 主题换成了「食物」——证明这套方法可以快速复用到完全不同的题材。

## 故事

砧板上有只肚子空空的小饺子**团团**，它觉得孤单。滚呀滚，它遇见了**红番茄、黄玉米、绿青菜、
蹦蹦虾、嫩嫩蛋**——大家一个个跳进它的肚子里，团团变得圆鼓鼓、香喷喷。热气腾腾的蒸笼里，
它们成了饺子一家，围坐团圆饭桌。团团明白了：**最好吃的味道，是和朋友在一起。**

认知小环节：**认识颜色**（红/黄/绿）、**数数**（玉米粒、蒸笼里的饺子 1–5）、
**分享与合作**的道理。

## 在线打开

**https://yaosiyuan43.github.io/dumpling-book/**（手机/电脑皆可）

## 本地运行

```bash
python3 -m http.server 8777 --bind 127.0.0.1   # 打开 http://127.0.0.1:8777/
```

重新生成配音（edge-tts，免费、无 key）：

```bash
python3 -m venv .ttsenv && .ttsenv/bin/pip install edge-tts
.ttsenv/bin/python tools/gen_audio.py
```

## 结构

和 skill 参考实现一致：`js/core.js`（引擎工具）、`js/kitchen.js`（厨房背景画师）、
`js/characters.js`（食物角色）、`js/audio.js`（音效+朗读）、`js/scenes-a…d.js`（每页内容）、
`js/book.js`（翻页引擎）、`audio/`（朗读 mp3）、`tools/gen_audio.py`（配音生成）。

© 花椒绘本工作室。配音由 edge-tts（微软神经语音）生成。
