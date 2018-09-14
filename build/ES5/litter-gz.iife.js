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

  function _getScript(srcScript) {
    var inner = srcScript.innerHTML.trim();

    if (inner.startsWith('return')) {
      var iFatArrowPos = inner.indexOf('=>');
      var c2del = ['return', '(', ')', '{', '}'];
      var lhs = inner.substr(0, iFatArrowPos);
      c2del.forEach(function (t) {
        return lhs = lhs.replace(t, '');
      });
      var rhs = inner.substr(iFatArrowPos + 2);
      return {
        args: lhs.split(',').map(function (s) {
          return s.trim();
        }),
        body: rhs
      };
    } else {
      return null;
    }
  }

  function destruct(target, prop) {
    var megaProp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'input';
    Object.defineProperty(target, prop, {
      get: function get() {
        return this['_' + prop];
      },
      set: function set(val) {
        this['_' + prop] = val;

        if (this[megaProp]) {
          this[megaProp][prop] = val;
          this[megaProp] = Object.assign({}, this[megaProp]);
        } else {
          this[megaProp] = babelHelpers.defineProperty({}, prop, val);
        }
      },
      enumerable: true,
      configurable: true
    });
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
      key: "defGenProp",
      value: function defGenProp(target, prop) {}
    }, {
      key: "commitProps",
      value: function commitProps(props, target) {
        var _this4 = this;

        props.forEach(function (prop) {
          var initVal = target[prop]; //TODO:  move default case into litter-gz

          switch (prop) {
            case 'render':
            case 'input':
            case 'target':
              Object.defineProperty(target, prop, {
                get: function get() {
                  return this['_' + prop];
                },
                set: function set(val) {
                  this['_' + prop] = val;
                  if (this.input && this.renderer && !this.hasAttribute('disabled')) this.renderer(this.input, this.target || target);
                },
                enumerable: true,
                configurable: true
              });
              break;

            default:
              _this4.defGenProp(target, prop);

          }

          if (initVal !== undefined) target[prop] = initVal;
        });
      }
    }, {
      key: "addProps",
      value: function addProps(target, scriptInfo) {
        if (target.dataset.addedProps) return;
        this.commitProps(scriptInfo.args.concat('render', 'input', 'target'), target);
        target.dataset.addedProps = 'true';

        if (!target.input) {
          var inp = target.dataset.input;

          if (inp) {
            target.input = JSON.parse(inp);
          }
        }
      }
    }, {
      key: "getScript",
      value: function getScript(srcScript) {
        return {
          args: ['input'],
          body: srcScript.innerHTML
        };
      }
    }, {
      key: "registerScript",
      value: function registerScript(target) {
        var _this5 = this;

        if (!target.firstElementChild) {
          setTimeout(function () {
            _this5.registerScript(target);
          }, 50);
          return;
        }

        var srcS = target.firstElementChild;
        if (srcS.localName !== 'script') throw "Expecting script child";
        var script = document.createElement('script');
        var base = 'https://cdn.jsdelivr.net/npm/lit-html/';
        var importPaths = "\n        import {html, render} from '".concat(base, "lit-html.js';\n        import {repeat} from '").concat(base, "lib/repeat.js';\n");
        var importAttr = this.getAttribute('import');
        if (importAttr) importPaths = self[importAttr];
        var count = LitterG._count++;
        var scriptInfo = this.getScript(srcS);
        var args = scriptInfo.args.length > 1 ? '{' + scriptInfo.args.join(',') + '}' : 'input';
        var text =
        /* js */
        "\n".concat(importPaths, "\nconst litterG = customElements.get('litter-g');\nconst litter = (").concat(args, ") => ").concat(scriptInfo.body, ";\nlitterG['fn_' + ").concat(count, "] = function(input, target){\n    render(litter(input), target);\n}\n");
        script.type = 'module';
        script.innerHTML = text;
        document.head.appendChild(script);
        this.attachRenderer(target, count, scriptInfo);
      }
    }, {
      key: "attachRenderer",
      value: function attachRenderer(target, count, scriptInfo) {
        var _this6 = this;

        var renderer = LitterG['fn_' + count];

        if (renderer === undefined) {
          setTimeout(function () {
            _this6.attachRenderer(target, count, scriptInfo);
          }, 10);
          return;
        }

        target.renderer = renderer;
        this.addProps(target, scriptInfo);
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        this.style.display = 'none';
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

  var LitterGZ =
  /*#__PURE__*/
  function (_LitterG) {
    babelHelpers.inherits(LitterGZ, _LitterG);

    function LitterGZ() {
      babelHelpers.classCallCheck(this, LitterGZ);
      return babelHelpers.possibleConstructorReturn(this, (LitterGZ.__proto__ || Object.getPrototypeOf(LitterGZ)).apply(this, arguments));
    }

    babelHelpers.createClass(LitterGZ, [{
      key: "getScript",
      value: function getScript(srcScript) {
        var s = _getScript(srcScript);

        return s === null ? babelHelpers.get(LitterGZ.prototype.__proto__ || Object.getPrototypeOf(LitterGZ.prototype), "getScript", this).call(this, srcScript) : s;
      }
    }, {
      key: "defGenProp",
      value: function defGenProp(target, prop) {
        destruct(target, prop);
      }
    }], [{
      key: "is",
      get: function get() {
        return 'litter-gz';
      }
    }]);
    return LitterGZ;
  }(LitterG);

  define(LitterGZ);
})();