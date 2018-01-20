# Slider

> Start from [rollup-starter-project](https://github.com/rollup/rollup-starter-project)

## Demo

![multipleable-slider](http://os8ri8oj4.bkt.clouddn.com/slider.gif)

## Usage

```shell
npm i --save-dev multipleable-slider
# 如果无法下载，请尝试
npm --registry=https://registry.npm.taobao.org install --save-dev multipleable-slider
```

```js
import slider from 'multipleable-slider'

new slider({
  parentContainer: '.m-slider2',
  sliderChildrens: ['.carouse-news ul'],
  sliderBtnNode: '.carouse-dots',
  isAutoPlay: true,
  distance: 0.2
})
```

## APIs

|Property|Type|Default|Description|
|:-------|:---|:------|:----------|
|parentContainer|String|'.slider-container'|Target element to listen touch events on. |
|sliderChildrens|String[]|['.slider-wrap']|CSS class name of slide, parentContainer can control two slider, For example ['.slider-wrap1', '.slider-wrap2']
|sliderBtnNode|String||String with CSS selector or HTML element of the container with pagination. If empty disply none|
|isAutoPlay|boolean|false|Whether to turn on autoplay|
|delayTime|number|500|Delay between transitions (in ms)|
|interval|number|5000|Auto-play interval|
|distance|float|0.3|Threshold value in (0 ~ 1). If "touch distance" will be lower than (parentContainer.clientWidth * distance) then slider will not move|
|direction|String|'left'|Auto play direction, currently only supports left|
|isLoopPlay|boolean|true|Whether to loop|  


|参数|类型|默认值|说明|
|:--|:---|:---|:---|
|parentContainer|String|'.slider-container'|slider控制器容器，监听slider的touch事件|
|sliderChildrens|String[]|['.slider-wrap']|轮播图容器，数组类型，一个控制器可以控制多个轮播，比如['.slider-wrap1', '.slider-wrap2']|
|sliderBtnNode|String||轮播导航，没有或为空则不显示|
|isAutoPlay|boolean|false|是否自动播放，true: 自动播放 false: 不自动播放|
|delayTime|number|500|滑动一屏的过渡时间|
|interval|number|5000|自动播放的间隔|
|distance|float|0.3|滑动阈值比例，如果滑动距离低于parentContainer的宽度的0.3倍，则不移动|
|direction|String|'left'|自动播放的方向，目前只支持left|
|isLoopPlay|boolean|true|是否循环播放，true: 循环播放 false: 不循环播放| 
