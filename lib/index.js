import assign from './assign'

class Slider {
  constructor(userConfig) {
    const config = assign({}, {
      parentContainer: '.slider-container',
      sliderChildrens: ['.slider-wrap'],
      sliderBtnNode: '',
      isAutoPlay: false,
      delayTime: 500,
      interval: 5000,
      distance: 0.3,
      direction: 'left',
      isLoopPlay: true,
      callback: () => {}
    }, userConfig)
    this.config = config
    this.parent = typeof config.parentContainer === 'string' ? document.querySelector(config.parentContainer) : config.parentContainer
    this.parentWidth = this.parent.clientWidth
    this.currentIndex = 1
    const len = this.getNode(config.sliderChildrens[0]).children.length
    this.length = len
    this.timer = null
    this.x = null
    this.y = null
    this.direction = null
    this.isSwipping = null
    config.sliderChildrens.forEach((item) => {
      const node = this.getNode(item)
      const w = this.getClientWidth(node)
      // 外层设置为一个元素的宽度
      node.parentNode.style.width = w + 'px'
      // 要滑动的元素的整体宽度
      node.style.width = (len * w) + 'px'
      node.style.webkitTransform = 'translate3d(-' + w + 'px, 0, 0)'
      node.style.transform = 'translate3d(-' + w + 'px, 0, 0)'
    })
    // 滑动阈值
    this.minX = this.parent.clientWidth * this.config.distance

    if (config.isAutoPlay) {
      this.timer = setInterval(() => {
        this.direction = config.direction
        this.play()
      }, config.interval)
    }
    this.bind()
  }

  getNode(elm) {
    return typeof elm === 'string' ? this.parent.querySelector(elm) : elm
  }

  getClientWidth(elm) {
    return this.getNode(elm).clientWidth
  }

  getMinX(elm) {
    return this.getClientWidth(elm) / (this.config.distance * this.length)
  }

  calculatePos(e) {
    const x = e.changedTouches[0].clientX
    const y = e.changedTouches[0].clientY
    const xd = this.x - x
    const yd = this.y - y
    const axd = Math.abs(xd)
    const ayd = Math.abs(yd)

    return {
      deltaX: xd,
      deltaY: yd,
      absX: axd,
      absY: ayd
    }
  }

  translate(elm, dist, speed) {
    const el = elm.style
    el.webkitTransition = `-webkit-transform ${speed}ms ease-out`
    el.transition = `transform ${speed}ms ease-out`
    el.webkitTransform = `translate3d(${dist}px, 0, 0)`
    el.transform = `translate3d(${dist}px, 0, 0)`
  }

  bind() {
    const self = this
    const config = this.config
    const touchEvent = {
      onStart(e) {
        if (e.touches.length > 1) {
          return
        }
        const point = e.touches[0]
        self.x = point.clientX
        self.y = point.clientY
      },

      onMove(e) {
        if (!self.x || !self.y || e.touches.length > 1) {
          return
        }
        if (navigator.userAgent.match(/android/ig)) {
          e.preventDefault()
        }
        // 解决头尾空白补缺问题
        if ((self.currentIndex > self.length - 2) || self.currentIndex < 1) return

        const pos = self.calculatePos(e)
        if (pos.absX < self.minX && pos.absY < self.minX) {
          return
        }
        self.direction = pos.deltaX > 0 ? 'left' : 'right'

        if (pos.absX > pos.absY) {
          if (config.isAutoPlay) clearInterval(self.timer)
          const sliderW = self.parentWidth
          config.sliderChildrens.forEach((item) => {
            const node = self.getNode(item)
            const w = self.getClientWidth(item) / self.length
            self.translate(node, -(self.currentIndex * w) - (pos.deltaX * (w / sliderW)))
          })
        }

        self.isSwipping = true
      },

      onEnd() {
        // 解决头尾空白补缺问题
        if ((self.currentIndex > self.length - 2) || self.currentIndex < 1) return
        if (!self.isSwipping) return
        self.play(self.direction)

        if (config.isAutoPlay) {
          self.timer = setInterval(() => {
            self.direction = config.direction
            self.play()
          }, config.interval)
        }
      },

      onTransitionEnd() {
        self.isSwipping = false
        if (self.currentIndex === self.length - 1) {
          config.sliderChildrens.forEach((item) => {
            const node = self.getNode(item)
            const w = self.getClientWidth(item) / self.length
            self.translate(node, -w, 0)
          })
          self.currentIndex = 1
        }
        if (self.currentIndex === 0) {
          config.sliderChildrens.forEach((item) => {
            const node = self.getNode(item)
            const w = (self.getClientWidth(item) / self.length) * (self.length - 2)
            self.translate(node, -w, 0)
          })
          self.currentIndex = self.length - 2
        }
        
        const btnStr = config.sliderBtnNode
        if (btnStr) {
          self.parent.querySelector(btnStr + ' .active').classList.remove('active')
          const sliderBtns = self.parent.querySelectorAll(btnStr + ' li')
          sliderBtns[self.currentIndex - 1].classList.add('active')
        }

        self.config.callback(self.currentIndex)
      }
    }

    const sliderContainer = this.parent
    const firstSlider = this.getNode(config.sliderChildrens[0])
    sliderContainer.addEventListener('touchstart', touchEvent.onStart, { passive: true })
    // 在最新版本的谷歌中会有错误提示：Unable to preventDefault inside passive event listener invocation.
    // 原来在新版chrome，给这个preventDefault返回了naive，不再是清除浏览器默认行为了
    // 解决方法：把{passive: true}改为{passive: false}
    sliderContainer.addEventListener('touchmove', touchEvent.onMove, { passive: false })
    sliderContainer.addEventListener('touchend', touchEvent.onEnd, { passive: true })
    firstSlider.addEventListener('webkitTransitionEnd', touchEvent.onTransitionEnd)
  }

  prevImage() {
    const config = this.config
    // 阻止循环轮播
    if (!config.isLoopPlay && this.currentIndex === this.length - 2) {
      this.currentIndex--
    }
    config.sliderChildrens.forEach((item) => {
      const node = this.getNode(item)
      const w = this.getClientWidth(item) / this.length
      this.translate(node, -(this.currentIndex + 1) * w, config.delayTime)
    })
    if (this.currentIndex < this.length - 1) {
      this.currentIndex++
    }
  }

  nextImage() {
    const config = this.config
    // 阻止循环轮播
    if (!config.isLoopPlay && this.currentIndex === 1) {
      this.currentIndex++
    }
    config.sliderChildrens.forEach((item) => {
      const node = this.getNode(item)
      const w = this.getClientWidth(item) / this.length
      this.translate(node, -(this.currentIndex - 1) * w, config.delayTime)
    })
    if (this.currentIndex > 0) {
      this.currentIndex--
    }
  }

  play() {
    if (this.direction === 'left') {
      this.prevImage()
    } else {
      this.nextImage()
    }
  }
}

export default Slider
