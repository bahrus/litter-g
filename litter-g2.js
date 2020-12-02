import { XtalDeco } from 'xtal-deco/xtal-deco.js';
import { define } from 'trans-render/define.js';
const input = 'input';
const _target = '_target';
const _renderer = '_renderer';
export class LitterG2 extends XtalDeco {
    constructor() {
        super(...arguments);
        this.init = ({ self }) => {
            const scriptEl = self.querySelector('script');
            if (scriptEl == null) {
                setTimeout(() => {
                    this.init(self);
                }, 16);
                return;
            }
            console.log(scriptEl);
        };
        this.actions = [];
        this.on = {};
        this._addedProps = false;
    }
    parseMultiVariateScript(srcScript, ignore) {
        const split = srcScript.innerHTML.split('//render');
        const len = split.length;
        const renderScript = len === 2 ? split[1] : split[0];
        const actionScript = len === 2 ? split[0] : '';
        const inner = renderScript.trim();
        if (inner.startsWith('(') || inner.startsWith(ignore)) {
            //assume multivariate function scenario
            const iFatArrowPos = inner.indexOf('=>');
            const c2del = ['(', ')', '{', '}'];
            let lhs = inner.substr(0, iFatArrowPos).replace(ignore, '').trim();
            c2del.forEach(t => lhs = lhs.replace(t, ''));
            const rhs = inner.substr(iFatArrowPos + 2);
            return {
                args: lhs.split(',').map(s => s.trim()),
                render: rhs,
                handlers: actionScript
            };
        }
        else {
            //Not multivariate
            return {
                args: [input],
                render: split[split.length - 1],
                handlers: split.length > 1 ? split[0] : ''
            };
        }
    }
    registerScript(target) {
        let importPaths = `
const {html, render, repeat, asyncAppend, asyncReplace, cache, classMap, guard, ifDefined, styleMap, unsafeHTML, until} = customElements.get('litter-g').exports;
`;
        const importAttr = this.getAttribute('import');
        if (importAttr !== null)
            importPaths = self[importAttr];
        const count = LitterG2._count++;
        const scriptInfo = this.parseMultiVariateScript(target, 'tr = ');
        const args = scriptInfo.args.length > 1 ? '{' + scriptInfo.args.join(',') + '}' : input;
        const text = /* js */ `
${scriptInfo.handlers}
const litter = (${args}) => ${scriptInfo.render};
const __fn = function(input, target){
    render(litter(input), target);
}    
`;
        this.addProps(scriptInfo);
        attachScriptFn(LitterG.is, target, _renderer, text, importPaths);
    }
    addProps(scriptInfo) {
        if (this._addedProps)
            return;
        this.commitProps(scriptInfo.args.concat(_renderer, _input, _target), target);
        target.dataset.addedProps = 'true';
        if (!target._input) {
            const inp = target.dataset.input;
            if (inp) {
                target._input = JSON.parse(inp);
            }
        }
    }
    commitProps(props, target) {
        props.forEach(prop => {
            const initVal = target[prop];
            //TODO:  move default case into litter-gz
            const localSym = Symbol(prop.toString());
            switch (prop) {
                case _renderer:
                case _input:
                case _target:
                    Object.defineProperty(target, prop, {
                        get: function () {
                            return this[localSym];
                        },
                        set: function (val) {
                            this[localSym] = val;
                            if (this._input && this._renderer && !this.hasAttribute('disabled'))
                                this._renderer(this._input, this._target || target);
                        },
                        enumerable: true,
                        configurable: true,
                    });
                    break;
                default:
                    this.defGenProp(target, prop);
            }
            if (initVal !== undefined)
                target[prop] = initVal;
        });
    }
    get input() {
        return this._input;
    }
    set input(val) {
        this._input = val;
        this.render();
    }
    get target() {
        return this._target;
    }
    set target(val) {
        this._target = val;
        this.render();
    }
    get renderer() {
        return this._renderer;
    }
    set renderer(val) {
        this._renderer = val;
        this.render();
    }
    render() {
        if (this._renderer !== undefined && this._target !== undefined)
            this._renderer(this._input, this._target);
    }
}
LitterG2.is = 'litter-g2';
LitterG2._count = 0;
define(LitterG2);
