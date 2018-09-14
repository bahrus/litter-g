import { LitterG } from './litter-g.js';
import { define } from "./node_modules/xtal-latx/define.js";
import { getScript as _getScript, destruct } from "./node_modules/xtal-latx/destruct.js";
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
define(LitterGZ); //# sourceMappingURL=litter-gz.js.map