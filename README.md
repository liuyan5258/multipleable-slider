# Slider

> Start from [rollup-starter-project](https://github.com/rollup/rollup-starter-project)

## Usage

```
npm i --save-dev mutipleable-slider

import slider from 'mutipleable-slider'

new SLIDER({
  parentContainer: '.m-slider2',
  sliderChildrens: ['.carouse-news ul'],
  sliderBtnNode: '.carouse-dots',
  isAutoPlay: true,
  distance: 10
})
```

## APIs

```
this.config = {
  parentContainer: '.slider-container',  // slider控制器容器
  sliderChildrens: ['.slider-wrap'],  // 轮播图容器，数组类型，一个控制器可以控制多个轮播
  sliderBtnNode: '.slider-dot',  // 轮播图播放小圆点，没有或为空则不显示轮播状态
  isAutoPlay: true,  // 是否自动播放，默认是不自动轮播
  delayTime: 500,  // 滑动一屏的过渡时间
  interval: 5000,  // 自动播放的间隔
  distance: 0.3,  // 滑动阈值比例
  direction: 'left',  // 自动播放的方向，目前只支持left
  isLoopPlay: false, // 是否循环播放，默认是循环播放
  callback: () => {}  // 每次轮播动画结束后的回调
}
```

