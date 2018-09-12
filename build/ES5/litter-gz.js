import { LitterG } from './litter-g.js';
import { define } from "./node_modules/xtal-latx/define.js";
export var LitterGZ =
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
      var inner = srcScript.innerHTML.trim();

      if (inner.startsWith('return')) {
        var iFatArrowPos = inner.indexOf('=>');
        var lhs = inner.substr(0, iFatArrowPos).replace('return', '').replace('(', '').replace(')', '').replace('{', '').replace('}', '');
        var rhs = inner.substr(iFatArrowPos + 2);
        return {
          args: lhs.split(',').map(function (s) {
            return s.trim();
          }),
          body: rhs
        };
      } else {
        return babelHelpers.get(LitterGZ.prototype.__proto__ || Object.getPrototypeOf(LitterGZ.prototype), "getScript", this).call(this, srcScript);
      }
    }
  }, {
    key: "defGenProp",
    value: function defGenProp(target, prop) {
      Object.defineProperty(target, prop, {
        get: function get() {
          return this['_' + prop];
        },
        set: function set(val) {
          this['_' + prop] = val; //TODO:  add debouncing

          if (this.input) {
            this.input[prop] = val;
            this.input = Object.assign({}, this.input);
          } else {
            this.input = babelHelpers.defineProperty({}, prop, val);
          }
        },
        enumerable: true,
        configurable: true
      });
    }
  }], [{
    key: "is",
    get: function get() {
      return 'litter-gz';
    }
  }]);
  return LitterGZ;
}(LitterG);
define(LitterGZ); //# sourceMappingURL=litter-gz.js.map