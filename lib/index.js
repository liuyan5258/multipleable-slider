import assign from './assign'

class slider {
  constructor() {
    this.config = {
      parentContainer: '.slider-container',
      sliderChildrens: ['.slider-wrap'],
      sliderBtnNode: '',
      isShowBtns: true,
      isAutoPlay: true,
      delayTime: 500,
      interval: 5000,
      distance: 3,
      direction: 'left',
      callback: () => {}
    }
    this.currentIndex = 1
    this.length = null
    this.timer = null
    this.x = null
    this.y = null
    this.minX = null
    this.direction = null
    this.isSwipping = null
  }

  getNode(elm) {
    return typeof elm === 'string' ? document.querySelector(elm) : elm
  }

  getclientWidth(elm) {
    return this.getNode(elm).clientWidth
  }

  getMinX(elm) {
    return this.getclientWidth(elm) / (this.config.distance * this.length)
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

        // 解决头尾空白补缺问题
        if ((self.currentIndex > self.length - 2) || self.currentIndex < 1) return

        const pos = self.calculatePos(e)
        if (pos.absX < self.minX && pos.absY < self.minX) {
          return
        }
        self.direction = pos.deltaX > 0 ? 'left' : 'right'

        if (pos.absX > pos.absY) {
          e.preventDefault()
          if (config.isAutoPlay) clearInterval(self.timer)
          const sliderW = self.getclientWidth(config.parentContainer)
          config.sliderChildrens.forEach((item) => {
            const node = self.getNode(item)
            const w = self.getclientWidth(item) / self.length
            self.translate(node, -(self.currentIndex * w) - (pos.deltaX * (w / sliderW)))
          })
        }

        self.isSwipping = true
      },

      onEnd(e) {
        e.preventDefault()

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
            const w = self.getclientWidth(item) / self.length
            self.translate(node, -w, 0)
          })
          self.currentIndex = 1
        }
        if (self.currentIndex === 0) {
          config.sliderChildrens.forEach((item) => {
            const node = self.getNode(item)
            const w = (self.getclientWidth(item) / self.length) * (self.length - 2)
            self.translate(node, -w, 0)
          })
          self.currentIndex = self.length - 2
        }
        
        const btnStr = config.sliderBtnNode
        if (btnStr) {
          document.querySelector(btnStr + ' .active').classList.remove('active')
          const sliderBtns = document.querySelectorAll(btnStr + ' li')
          sliderBtns[self.currentIndex - 1].classList.add('active')
        }

        self.config.callback()
      }
    }

    const sliderContainer = self.getNode(config.parentContainer)
    const firstSlider = self.getNode(config.sliderChildrens[0])
    sliderContainer.addEventListener('touchstart', touchEvent.onStart)
    sliderContainer.addEventListener('touchmove', touchEvent.onMove)
    sliderContainer.addEventListener('touchend', touchEvent.onEnd)
    firstSlider.addEventListener('webkitTransitionEnd', touchEvent.onTransitionEnd)
  }

  prevImage() {
    const self = this
    const config = self.config
    config.sliderChildrens.forEach((item) => {
      const node = self.getNode(item)
      const w = self.getclientWidth(item) / self.length
      self.translate(node, -(self.currentIndex + 1) * w, config.delayTime)
    })
    if (this.currentIndex < this.length - 1) {
      this.currentIndex++
    }
  }

  nextImage() {
    const self = this
    const config = self.config
    config.sliderChildrens.forEach((item) => {
      const node = self.getNode(item)
      const w = self.getclientWidth(item) / self.length
      self.translate(node, -(self.currentIndex - 1) * w, config.delayTime)
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

  init(userConfig) {
    const self = this
    const config = assign({}, this.config, userConfig)
    const len = this.getNode(config.sliderChildrens[0]).children.length
    this.config = config
    this.length = len
    let minX = null
    config.sliderChildrens.forEach((item) => {
      const node = self.getNode(item)
      const w = self.getclientWidth(node)
      node.parentNode.style.width = w + 'px'
      node.style.width = (len * w) + 'px'
      node.style.webkitTransform = 'translate3d(-' + w + 'px, 0, 0)'
      node.style.transform = 'translate3d(-' + w + 'px, 0, 0)'
      const xMin = self.getMinX(node)
      minX = (minX && (xMin > minX ? minX : xMin)) || xMin
    })
    this.minX = minX

    if (config.isAutoPlay) {
      self.timer = setInterval(() => {
        self.direction = config.direction
        self.play()
      }, config.interval)
    }
    this.bind()
  }
}

export default slider
