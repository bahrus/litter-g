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
      var _this2 = this;

      this.addProps(target);

      if (!target.firstElementChild) {
        setTimeout(function () {
          _this2.registerScript(target);
        }, 50);
        return;
      }

      var srcS = target.firstElementChild;
      if (srcS.localName !== 'script') throw "Expecting script child";
      var script = document.createElement('script');
      var importPaths = "\n        import {html, render} from 'https://cdn.jsdelivr.net/npm/lit-html/lit-html.js';\n        import {repeat} from 'https://cdn.jsdelivr.net/npm/lit-html/lib/repeat.js';\n";
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
      var _this3 = this;

      var renderer = LitterG['fn_' + (LitterG._count - 1)];

      if (renderer === undefined) {
        setTimeout(function () {
          _this3.attachRenderer(target);
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
define(LitterG); //# sourceMappingURL=litter-g.js.map