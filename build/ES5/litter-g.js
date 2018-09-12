import { observeCssSelector } from "./node_modules/xtal-latx/observeCssSelector.js";
import { define } from "./node_modules/xtal-latx/define.js";
export var LitterG =
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
      var _this = this;

      if (e.animationName === LitterG.is) {
        var target = e.target;
        setTimeout(function () {
          _this.registerScript(target);
        }, 0);
      }
    }
  }, {
    key: "defGenProp",
    value: function defGenProp(target, prop) {}
  }, {
    key: "commitProps",
    value: function commitProps(props, target) {
      var _this2 = this;

      props.forEach(function (prop) {
        var initVal = target[prop]; //TODO:  move default case into litter-gz

        switch (prop) {
          case 'render':
          case 'input':
            Object.defineProperty(target, prop, {
              get: function get() {
                return this['_' + prop];
              },
              set: function set(val) {
                this['_' + prop] = val;
                if (this.input && this.renderer) this.renderer(this.input, target);
              },
              enumerable: true,
              configurable: true
            });
            break;

          default:
            _this2.defGenProp(target, prop);

        }

        if (initVal !== undefined) target[prop] = initVal;
      });
    }
  }, {
    key: "addProps",
    value: function addProps(target, scriptInfo) {
      if (target.dataset.addedProps) return;
      this.commitProps(scriptInfo.args.concat('render', 'input'), target);
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
      var _this3 = this;

      if (!target.firstElementChild) {
        setTimeout(function () {
          _this3.registerScript(target);
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
      var _this4 = this;

      var renderer = LitterG['fn_' + count];

      if (renderer === undefined) {
        setTimeout(function () {
          _this4.attachRenderer(target, count, scriptInfo);
        }, 10);
        return;
      }

      target.renderer = renderer;
      this.addProps(target, scriptInfo);
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
define(LitterG); //# sourceMappingURL=litter-g.js.map