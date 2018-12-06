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
          return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(_class).apply(this, arguments));
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

            if (babelHelpers.get(babelHelpers.getPrototypeOf(_class.prototype), "disconnectedCallback", this) !== undefined) babelHelpers.get(babelHelpers.getPrototypeOf(_class.prototype), "disconnectedCallback", this).call(this);
          }
        }]);
        return _class;
      }(superClass)
    );
  }

  function attachScriptFn(tagName, target, prop, body, imports) {
    var constructor = customElements.get(tagName);
    var count = constructor._count++;
    var script = document.createElement('script');

    if (supportsStaticImport()) {
      script.type = 'module';
    }

    script.innerHTML = "\n".concat(imports, "\n(function () {\n").concat(body, "\nconst constructor = customElements.get('").concat(tagName, "');\nconstructor['fn_' + ").concat(count, "] = __fn;\n})();\n");
    document.head.appendChild(script);
    attachFn(constructor, count, target, prop);
  }

  function supportsStaticImport() {
    var script = document.createElement('script');
    return 'noModule' in script;
  }

  function attachFn(constructor, count, target, prop) {
    var Fn = constructor['fn_' + count];

    if (Fn === undefined) {
      setTimeout(function () {
        attachFn(constructor, count, target, prop);
      }, 10);
      return;
    }

    target[prop] = Fn;
  }

  function getDynScript(el, callBack) {
    el._script = el.querySelector('script');

    if (!el._script) {
      setTimeout(function () {
        getDynScript(el, callBack);
      }, 10);
      return;
    }

    callBack();
  }

  var LitterG =
  /*#__PURE__*/
  function (_observeCssSelector) {
    babelHelpers.inherits(LitterG, _observeCssSelector);

    function LitterG() {
      babelHelpers.classCallCheck(this, LitterG);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(LitterG).apply(this, arguments));
    }

    babelHelpers.createClass(LitterG, [{
      key: "insertListener",
      value: function insertListener(e) {
        var _this3 = this;

        if (e.animationName === LitterG.is) {
          var target = e.target;
          setTimeout(function () {
            getDynScript(target, function () {
              _this3.registerScript(target);
            }); //this.registerScript(target);
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
            case 'renderer':
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
        this.commitProps(scriptInfo.args.concat('renderer', 'input', 'target'), target);
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
        var base = 'https://cdn.jsdelivr.net/npm/lit-html/';
        var importPaths = "\n        import {html, render} from '".concat(base, "lit-html.js';\n        import {repeat} from '").concat(base, "lib/repeat.js';\n");
        var importAttr = this.getAttribute('import');
        if (importAttr !== null) importPaths = self[importAttr];
        var count = LitterG._count++;
        var scriptInfo = this.getScript(target._script);
        var args = scriptInfo.args.length > 1 ? '{' + scriptInfo.args.join(',') + '}' : 'input';
        var text =
        /* js */
        "\nconst litterG = customElements.get('litter-g');\nconst litter = (".concat(args, ") => ").concat(scriptInfo.body, ";\nconst __fn = function(input, target){\n    render(litter(input), target);\n}    \n");
        this.addProps(target, scriptInfo);
        attachScriptFn(LitterG.is, target, 'renderer', text, importPaths);
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
})();