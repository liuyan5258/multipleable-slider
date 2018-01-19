(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.SLIDER = factory());
}(this, function () { 'use strict';

  var assign = Object.assign || function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (args[0] === null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }
    var target = Object(args[0]);
    for (var index = 1; index < args.length; index++) {
      var source = args[index];
      if (source != null) {
        /* eslint-disable no-restricted-syntax */
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
        /* eslint-enable no-restricted-syntax */
      }
    }
    return target;
  };

  var asyncGenerator = function () {
    function AwaitValue(value) {
      this.value = value;
    }

    function AsyncGenerator(gen) {
      var front, back;

      function send(key, arg) {
        return new Promise(function (resolve, reject) {
          var request = {
            key: key,
            arg: arg,
            resolve: resolve,
            reject: reject,
            next: null
          };

          if (back) {
            back = back.next = request;
          } else {
            front = back = request;
            resume(key, arg);
          }
        });
      }

      function resume(key, arg) {
        try {
          var result = gen[key](arg);
          var value = result.value;

          if (value instanceof AwaitValue) {
            Promise.resolve(value.value).then(function (arg) {
              resume("next", arg);
            }, function (arg) {
              resume("throw", arg);
            });
          } else {
            settle(result.done ? "return" : "normal", result.value);
          }
        } catch (err) {
          settle("throw", err);
        }
      }

      function settle(type, value) {
        switch (type) {
          case "return":
            front.resolve({
              value: value,
              done: true
            });
            break;

          case "throw":
            front.reject(value);
            break;

          default:
            front.resolve({
              value: value,
              done: false
            });
            break;
        }

        front = front.next;

        if (front) {
          resume(front.key, front.arg);
        } else {
          back = null;
        }
      }

      this._invoke = send;

      if (typeof gen.return !== "function") {
        this.return = undefined;
      }
    }

    if (typeof Symbol === "function" && Symbol.asyncIterator) {
      AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
        return this;
      };
    }

    AsyncGenerator.prototype.next = function (arg) {
      return this._invoke("next", arg);
    };

    AsyncGenerator.prototype.throw = function (arg) {
      return this._invoke("throw", arg);
    };

    AsyncGenerator.prototype.return = function (arg) {
      return this._invoke("return", arg);
    };

    return {
      wrap: function (fn) {
        return function () {
          return new AsyncGenerator(fn.apply(this, arguments));
        };
      },
      await: function (value) {
        return new AwaitValue(value);
      }
    };
  }();

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var Slider = function () {
    function Slider(userConfig) {
      var _this = this;

      classCallCheck(this, Slider);

      var config = assign({}, {
        parentContainer: '.slider-container',
        sliderChildrens: ['.slider-wrap'],
        sliderBtnNode: '',
        isAutoPlay: false,
        delayTime: 500,
        interval: 5000,
        distance: 0.3,
        direction: 'left',
        isLoopPlay: true,
        callback: function callback() {}
      }, userConfig);
      this.config = config;
      this.parent = typeof config.parentContainer === 'string' ? document.querySelector(config.parentContainer) : config.parentContainer;
      this.parentWidth = this.parent.clientWidth;
      this.currentIndex = 1;
      var len = this.getNode(config.sliderChildrens[0]).children.length;
      this.length = len;
      this.timer = null;
      this.x = null;
      this.y = null;
      this.direction = null;
      this.isSwipping = null;
      config.sliderChildrens.forEach(function (item) {
        var node = _this.getNode(item);
        var w = _this.getClientWidth(node);
        // 外层设置为一个元素的宽度
        node.parentNode.style.width = w + 'px';
        // 要滑动的元素的整体宽度
        node.style.width = len * w + 'px';
        node.style.webkitTransform = 'translate3d(-' + w + 'px, 0, 0)';
        node.style.transform = 'translate3d(-' + w + 'px, 0, 0)';
      });
      // 滑动阈值
      this.minX = this.parent.clientWidth * this.config.distance;

      if (config.isAutoPlay) {
        this.timer = setInterval(function () {
          _this.direction = config.direction;
          _this.play();
        }, config.interval);
      }
      this.bind();
    }

    createClass(Slider, [{
      key: 'getNode',
      value: function getNode(elm) {
        return typeof elm === 'string' ? this.parent.querySelector(elm) : elm;
      }
    }, {
      key: 'getClientWidth',
      value: function getClientWidth(elm) {
        return this.getNode(elm).clientWidth;
      }
    }, {
      key: 'getMinX',
      value: function getMinX(elm) {
        return this.getClientWidth(elm) / (this.config.distance * this.length);
      }
    }, {
      key: 'calculatePos',
      value: function calculatePos(e) {
        var x = e.changedTouches[0].clientX;
        var y = e.changedTouches[0].clientY;
        var xd = this.x - x;
        var yd = this.y - y;
        var axd = Math.abs(xd);
        var ayd = Math.abs(yd);

        return {
          deltaX: xd,
          deltaY: yd,
          absX: axd,
          absY: ayd
        };
      }
    }, {
      key: 'translate',
      value: function translate(elm, dist, speed) {
        var el = elm.style;
        el.webkitTransition = '-webkit-transform ' + speed + 'ms ease-out';
        el.transition = 'transform ' + speed + 'ms ease-out';
        el.webkitTransform = 'translate3d(' + dist + 'px, 0, 0)';
        el.transform = 'translate3d(' + dist + 'px, 0, 0)';
      }
    }, {
      key: 'bind',
      value: function bind() {
        var self = this;
        var config = this.config;
        var touchEvent = {
          onStart: function onStart(e) {
            if (e.touches.length > 1) {
              return;
            }
            var point = e.touches[0];
            self.x = point.clientX;
            self.y = point.clientY;
          },
          onMove: function onMove(e) {
            if (!self.x || !self.y || e.touches.length > 1) {
              return;
            }
            if (navigator.userAgent.match(/android/ig)) {
              e.preventDefault();
            }
            // 解决头尾空白补缺问题
            if (self.currentIndex > self.length - 2 || self.currentIndex < 1) return;

            var pos = self.calculatePos(e);
            if (pos.absX < self.minX && pos.absY < self.minX) {
              return;
            }
            self.direction = pos.deltaX > 0 ? 'left' : 'right';

            if (pos.absX > pos.absY) {
              if (config.isAutoPlay) clearInterval(self.timer);
              var sliderW = self.parentWidth;
              config.sliderChildrens.forEach(function (item) {
                var node = self.getNode(item);
                var w = self.getClientWidth(item) / self.length;
                self.translate(node, -(self.currentIndex * w) - pos.deltaX * (w / sliderW));
              });
            }

            self.isSwipping = true;
          },
          onEnd: function onEnd() {
            // 解决头尾空白补缺问题
            if (self.currentIndex > self.length - 2 || self.currentIndex < 1) return;
            if (!self.isSwipping) return;
            self.play(self.direction);

            if (config.isAutoPlay) {
              self.timer = setInterval(function () {
                self.direction = config.direction;
                self.play();
              }, config.interval);
            }
          },
          onTransitionEnd: function onTransitionEnd() {
            self.isSwipping = false;
            if (self.currentIndex === self.length - 1) {
              config.sliderChildrens.forEach(function (item) {
                var node = self.getNode(item);
                var w = self.getClientWidth(item) / self.length;
                self.translate(node, -w, 0);
              });
              self.currentIndex = 1;
            }
            if (self.currentIndex === 0) {
              config.sliderChildrens.forEach(function (item) {
                var node = self.getNode(item);
                var w = self.getClientWidth(item) / self.length * (self.length - 2);
                self.translate(node, -w, 0);
              });
              self.currentIndex = self.length - 2;
            }

            var btnStr = config.sliderBtnNode;
            if (btnStr) {
              self.parent.querySelector(btnStr + ' .active').classList.remove('active');
              var sliderBtns = self.parent.querySelectorAll(btnStr + ' li');
              sliderBtns[self.currentIndex - 1].classList.add('active');
            }

            self.config.callback(self.currentIndex);
          }
        };

        var sliderContainer = this.parent;
        var firstSlider = this.getNode(config.sliderChildrens[0]);
        sliderContainer.addEventListener('touchstart', touchEvent.onStart, { passive: true });
        // 在最新版本的谷歌中会有错误提示：Unable to preventDefault inside passive event listener invocation.
        // 原来在新版chrome，给这个preventDefault返回了naive，不再是清除浏览器默认行为了
        // 解决方法：把{passive: true}改为{passive: false}
        sliderContainer.addEventListener('touchmove', touchEvent.onMove, { passive: false });
        sliderContainer.addEventListener('touchend', touchEvent.onEnd, { passive: true });
        firstSlider.addEventListener('webkitTransitionEnd', touchEvent.onTransitionEnd);
      }
    }, {
      key: 'prevImage',
      value: function prevImage() {
        var _this2 = this;

        var config = this.config;
        // 阻止循环轮播
        if (!config.isLoopPlay && this.currentIndex === this.length - 2) {
          this.currentIndex--;
        }
        config.sliderChildrens.forEach(function (item) {
          var node = _this2.getNode(item);
          var w = _this2.getClientWidth(item) / _this2.length;
          _this2.translate(node, -(_this2.currentIndex + 1) * w, config.delayTime);
        });
        if (this.currentIndex < this.length - 1) {
          this.currentIndex++;
        }
      }
    }, {
      key: 'nextImage',
      value: function nextImage() {
        var _this3 = this;

        var config = this.config;
        // 阻止循环轮播
        if (!config.isLoopPlay && this.currentIndex === 1) {
          this.currentIndex++;
        }
        config.sliderChildrens.forEach(function (item) {
          var node = _this3.getNode(item);
          var w = _this3.getClientWidth(item) / _this3.length;
          _this3.translate(node, -(_this3.currentIndex - 1) * w, config.delayTime);
        });
        if (this.currentIndex > 0) {
          this.currentIndex--;
        }
      }
    }, {
      key: 'play',
      value: function play() {
        if (this.direction === 'left') {
          this.prevImage();
        } else {
          this.nextImage();
        }
      }
    }]);
    return Slider;
  }();

  return Slider;

}));
//# sourceMappingURL=slider.js.map