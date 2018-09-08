//@ts-check
(function () {
  function define(custEl) {
    var tagName = custEl.is;

    if (customElements.get(tagName)) {
      console.warn('Already registered ' + tagName);
      return;
    }

    customElements.define(tagName, custEl);
  }

  function getHost(el) {
    var parent = el;

    while (parent = parent.parentNode) {
      if (parent.nodeType === 11) {
        return parent['host'];
      } else if (parent.tagName === 'BODY') {
        return null;
      }
    }

    return null;
  }

  function observeCssSelector(superClass) {
    var eventNames = ["animationstart", "MSAnimationStart", "webkitAnimationStart"];
    return (
      /*#__PURE__*/
      function (_superClass) {
        babelHelpers.inherits(_class, _superClass);

        function _class() {
          babelHelpers.classCallCheck(this, _class);
          return babelHelpers.possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
        }

        babelHelpers.createClass(_class, [{
          key: "addCSSListener",
          value: function addCSSListener(id, targetSelector, insertListener) {
            var _this = this;

            // See https://davidwalsh.name/detect-node-insertion
            if (this._boundInsertListener) return;
            var styleInner =
            /* css */
            "\n            @keyframes ".concat(id, " {\n                from {\n                    opacity: 0.99;\n                }\n                to {\n                    opacity: 1;\n                }\n            }\n    \n            ").concat(targetSelector, "{\n                animation-duration: 0.001s;\n                animation-name: ").concat(id, ";\n            }\n            ");
            var style = document.createElement('style');
            style.innerHTML = styleInner;
            var host = getHost(this);

            if (host !== null) {
              host.shadowRoot.appendChild(style);
            } else {
              document.body.appendChild(style);
            }

            this._boundInsertListener = insertListener.bind(this);
            var container = host ? host.shadowRoot : document;
            eventNames.forEach(function (name) {
              container.addEventListener(name, _this._boundInsertListener, false);
            }); // container.addEventListener("animationstart", this._boundInsertListener, false); // standard + firefox
            // container.addEventListener("MSAnimationStart", this._boundInsertListener, false); // IE
            // container.addEventListener("webkitAnimationStart", this._boundInsertListener, false); // Chrome + Safari
          }
        }, {
          key: "disconnectedCallback",
          value: function disconnectedCallback() {
            var _this2 = this;

            if (this._boundInsertListener) {
              var host = getHost(this);
              var container = host ? host.shadowRoot : document;
              eventNames.forEach(function (name) {
                container.removeEventListener(name, _this2._boundInsertListener);
              }); // document.removeEventListener("animationstart", this._boundInsertListener); // standard + firefox
              // document.removeEventListener("MSAnimationStart", this._boundInsertListener); // IE
              // document.removeEventListener("webkitAnimationStart", this._boundInsertListener); // Chrome + Safari
            }

            if (babelHelpers.get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), "disconnectedCallback", this) !== undefined) babelHelpers.get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), "disconnectedCallback", this).call(this);
          }
        }]);
        return _class;
      }(superClass)
    );
  }

  var LitterG =
  /*#__PURE__*/
  function (_observeCssSelector) {
    babelHelpers.inherits(LitterG, _observeCssSelector);

    function LitterG() {
      babelHelpers.classCallCheck(this, LitterG);
      return babelHelpers.possibleConstructorReturn(this, (LitterG.__proto__ || Object.getPrototypeOf(LitterG)).apply(this, arguments));
    }

    babelHelpers.createClass(LitterG, [{
      key: "insertListener",
      value: function insertListener(e) {
        var _this3 = this;

        if (e.animationName === LitterG.is) {
          var target = e.target;
          setTimeout(function () {
            _this3.registerScript(target);
          }, 0);
        }
      }
    }, {
      key: "updateProps",
      value: function updateProps(props, target) {
        props.forEach(function (prop) {
          var initVal = target[prop];
          Object.defineProperty(target, prop, {
            get: function get() {
              return this['_' + prop];
            },
            set: function set(val) {
              this['_' + prop] = val;
              if (this.renderer && this.input) this.renderer(this.input, target);
            },
            enumerable: true,
            configurable: true
          });
          target[prop] = initVal;

          if (initVal !== undefined) {} else {}
        });
      }
    }, {
      key: "addProps",
      value: function addProps(target) {
        if (target.dataset.addedProps) return;
        this.updateProps(['input', 'renderer'], target);
        target.dataset.addedProps = 'true';

        if (!target.input) {
          var inp = target.dataset.input;

          if (inp) {
            target.input = JSON.parse(inp);
          }
        }
      }
    }, {
      key: "registerScript",
      value: function registerScript(target) {
        var _this4 = this;

        this.addProps(target);

        if (!target.firstElementChild) {
          setTimeout(function () {
            _this4.registerScript(target);
          }, 50);
          return;
        }

        var srcS = target.firstElementChild;
        if (srcS.localName !== 'script') throw "Expecting script child";
        var script = document.createElement('script');
        var importPaths = "\n";
        var importAttr = this.getAttribute('import');
        if (importAttr) importPaths = self[importAttr];
        var text =
        /* js */
        "\n".concat(importPaths, "\nconst litterG = customElements.get('litter-g');\nconst count = litterG._count++;\n\nlitterG['fn_' + count] = function(input, target){\n    const litter = (name) => ").concat(srcS.innerHTML, ";\n\n    render(litter(input), target);\n    \n}\n");
        script.type = 'module';
        script.innerHTML = text;
        document.head.appendChild(script);
        this.attachRenderer(target);
      }
    }, {
      key: "attachRenderer",
      value: function attachRenderer(target) {
        var _this5 = this;

        var renderer = LitterG['fn_' + (LitterG._count - 1)];

        if (renderer === undefined) {
          setTimeout(function () {
            _this5.attachRenderer(target);
          }, 10);
          return;
        }

        target.renderer = renderer;
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        this._connected = true;
        this.onPropsChange();
      }
    }, {
      key: "onPropsChange",
      value: function onPropsChange() {
        if (!this._connected) return;
        this.addCSSListener(LitterG.is, '[data-lit]', this.insertListener);
      }
    }], [{
      key: "is",
      get: function get() {
        return 'litter-g';
      }
    }]);
    return LitterG;
  }(observeCssSelector(HTMLElement));

  LitterG._count = 0;
  define(LitterG);
})();