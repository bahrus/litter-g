import { observeCssSelector } from 'xtal-latx/observeCssSelector.js';
import { define } from 'xtal-latx/define.js';
import { attachScriptFn, getDynScript } from 'xtal-latx/attachScriptFn.js';
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
            switch (prop) {
                case 'renderer':
                case 'input':
                case 'target':
                    Object.defineProperty(target, prop, {
                        get: function () {
                            return this['_' + prop];
                        },
                        set: function (val) {
                            this['_' + prop] = val;
                            if (this.input && this.renderer && !this.hasAttribute('disabled'))
                                this.renderer(this.input, this.target || target);
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
        this.commitProps(scriptInfo.args.concat('renderer', 'input', 'target'), target);
        target.dataset.addedProps = 'true';
        if (!target.input) {
            const inp = target.dataset.input;
            if (inp) {
                target.input = JSON.parse(inp);
            }
        }
    }
    getScript(srcScript) {
        return {
            args: ['input'],
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
        const args = scriptInfo.args.length > 1 ? '{' + scriptInfo.args.join(',') + '}' : 'input';
        const text = /* js */ `
const litterG = customElements.get('litter-g');
const litter = (${args}) => ${scriptInfo.body};
const __fn = function(input, target){
    render(litter(input), target);
}    
`;
        this.addProps(target, scriptInfo);
        attachScriptFn(LitterG.is, target, 'renderer', text, importPaths);
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
//# sourceMappingURL=litter-g.js.map