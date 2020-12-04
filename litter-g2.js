import { XtalDeco } from 'xtal-deco/xtal-deco.js';
import { define } from 'trans-render/define.js';
import { attachScriptFn } from 'xtal-element/attachScriptFn.js';
import { destruct } from 'xtal-element/destruct.js';
import { html, render } from 'lit-html/lit-html.js';
import { repeat } from 'lit-html/directives/repeat.js';
import { asyncAppend } from 'lit-html/directives/async-append.js';
import { asyncReplace } from 'lit-html/directives/async-replace.js';
import { cache } from 'lit-html/directives/cache.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { guard } from 'lit-html/directives/guard.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { styleMap } from 'lit-html/directives/style-map.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { until } from 'lit-html/directives/until.js';
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
            this.registerScript(scriptEl, self);
            this.target = self;
        };
        this.actions = [];
        this.on = {};
        this._addedProps = false;
    }
    static get observedAttributes() {
        return ['input'];
    }
    static get exports() {
        return {
            html, render, repeat, asyncAppend, asyncReplace, cache, classMap, guard, ifDefined, styleMap, unsafeHTML, until
        };
    }
    attributeChangedCallback(name, oldVal, newVal) {
        this.input = JSON.parse(newVal);
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
    registerScript(target, targetEl) {
        let importPaths = `
const {html, render, repeat, asyncAppend, asyncReplace, cache, classMap, guard, ifDefined, styleMap, unsafeHTML, until} = customElements.get('litter-g2').exports;
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
        attachScriptFn(LitterG2.is, targetEl, (fn) => { this.renderer = fn; }, text, importPaths);
    }
    addProps(scriptInfo) {
        if (this._addedProps)
            return;
        scriptInfo.args.forEach(prop => {
        });
        this._addedProps = true;
    }
    commitProps(props, target) {
        props.forEach(prop => {
            this.defGenProp(target, prop);
        });
        //if(initVal !== undefined)  (<any>target)[prop] = initVal;
        //});
    }
    defGenProp(target, prop) {
        destruct(target, prop);
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
