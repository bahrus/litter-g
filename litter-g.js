import { observeCssSelector } from 'xtal-latx/observeCssSelector.js';
import { define } from 'xtal-latx/define.js';
export class LitterG extends observeCssSelector(HTMLElement) {
    static get is() { return 'litter-g'; }
    insertListener(e) {
        if (e.animationName === LitterG.is) {
            const target = e.target;
            setTimeout(() => {
                this.registerScript(target);
            }, 0);
        }
    }
    commitProps(props, target) {
        props.forEach(prop => {
            const initVal = target[prop];
            Object.defineProperty(target, prop, {
                get: function () {
                    return this['_' + prop];
                },
                set: function (val) {
                    this['_' + prop] = val;
                    if (this.renderer && this.input)
                        this.renderer(this.input, target);
                },
                enumerable: true,
                configurable: true,
            });
            target[prop] = initVal;
        });
    }
    addProps(target, scriptInfo) {
        if (target.dataset.addedProps)
            return;
        this.commitProps(scriptInfo.args.concat('render'), target);
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
        if (!target.firstElementChild) {
            setTimeout(() => {
                this.registerScript(target);
            }, 50);
            return;
        }
        const srcS = target.firstElementChild;
        if (srcS.localName !== 'script')
            throw "Expecting script child";
        const script = document.createElement('script');
        let importPaths = `
        import {html, render} from 'https://cdn.jsdelivr.net/npm/lit-html/lit-html.js';
        import {repeat} from 'https://cdn.jsdelivr.net/npm/lit-html/lib/repeat.js';
`;
        const importAttr = this.getAttribute('import');
        if (importAttr)
            importPaths = self[importAttr];
        const count = LitterG._count++;
        const scriptInfo = this.getScript(srcS);
        const args = scriptInfo.args.join(',');
        const text = /* js */ `
${importPaths}
const litterG = customElements.get('litter-g');
const litter = (${args}) => ${scriptInfo.body};
litterG['fn_' + ${count}] = function(${args}, target){

    render(litter(${args}), target);
}
`;
        script.type = 'module';
        script.innerHTML = text;
        document.head.appendChild(script);
        this.attachRenderer(target, count, scriptInfo);
    }
    attachRenderer(target, count, scriptInfo) {
        const renderer = LitterG['fn_' + count];
        if (renderer === undefined) {
            setTimeout(() => {
                this.attachRenderer(target, count, scriptInfo);
            }, 10);
            return;
        }
        target.renderer = renderer;
        this.addProps(target, scriptInfo);
    }
    connectedCallback() {
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