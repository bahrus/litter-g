import { observeCssSelector } from "./node_modules/xtal-latx/observeCssSelector.js";
import { define } from "./node_modules/xtal-latx/define.js";
import { attachScriptFn, getDynScript } from "./node_modules/xtal-latx/attachScriptFn.js";
export var LitterG =
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
      var _this = this;

      if (e.animationName === LitterG.is) {
        var target = e.target;
        setTimeout(function () {
          getDynScript(target, function () {
            _this.registerScript(target);
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
      var _this2 = this;

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
            _this2.defGenProp(target, prop);

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
define(LitterG); //# sourceMappingURL=litter-g.js.map