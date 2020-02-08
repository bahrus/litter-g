import { observeCssSelector } from 'xtal-element/observeCssSelector.js';
import { define } from 'trans-render/define.js';
import { attachScriptFn, getDynScript } from 'xtal-element/attachScriptFn.js';
const _input = '_input';
const _target = '_target';
const _renderer = '_renderer';
export class LitterG extends observeCssSelector(HTMLElement) {
    static get is() { return 'litter-g'; }
    insertListener(e) {
        if (e.animationName === LitterG.is) {
            const target = e.target;
            setTimeout(() => {
                getDynScript(target, () => {
                    this.registerScript(target);
                });
                //this.registerScript(target);
            }, 0);
        }
    }
    defGenProp(target, prop) { }
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
    addProps(target, scriptInfo) {
        if (target.dataset.addedProps)
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
    getScript(srcScript) {
        return {
            args: [_input],
            body: srcScript.innerHTML,
        };
    }
    registerScript(target) {
        const base = 'https://cdn.jsdelivr.net/npm/lit-html/';
        let importPaths = `
        import {html, render} from '${base}lit-html.js';
        import {repeat} from '${base}lib/repeat.js';
`;
        const importAttr = this.getAttribute('import');
        if (importAttr !== null)
            importPaths = self[importAttr];
        const count = LitterG._count++;
        const scriptInfo = this.getScript(target._script);
        const args = scriptInfo.args.length > 1 ? '{' + scriptInfo.args.join(',') + '}' : _input;
        const text = /* js */ `
const litterG = customElements.get('litter-g');
const litter = (${args}) => ${scriptInfo.body};
const __fn = function(input, target){
    render(litter(input), target);
}    
`;
        this.addProps(target, scriptInfo);
        attachScriptFn(LitterG.is, target, _renderer, text, importPaths);
    }
    connectedCallback() {
        this.style.display = 'none';
        this._connected = true;
        this.onPropsChange();
    }
    onPropsChange() {
        if (!this._connected)
            return;
        this.addCSSListener(LitterG.is, '[data-lit]', this.insertListener);
    }
}
LitterG._count = 0;
define(LitterG);
document.body.appendChild(document.createElement(LitterG.is));
