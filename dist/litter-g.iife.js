
    //@ts-check
    (function () {
    function define(custEl) {
    let tagName = custEl.is;
    if (customElements.get(tagName)) {
        console.warn('Already registered ' + tagName);
        return;
    }
    customElements.define(tagName, custEl);
}
function getHost(el) {
    let parent = el;
    while (parent = (parent.parentNode)) {
        if (parent.nodeType === 11) {
            return parent['host'];
        }
        else if (parent.tagName === 'BODY') {
            return null;
        }
    }
    return null;
}
function observeCssSelector(superClass) {
    const eventNames = ["animationstart", "MSAnimationStart", "webkitAnimationStart"];
    return class extends superClass {
        addCSSListener(id, targetSelector, insertListener) {
            // See https://davidwalsh.name/detect-node-insertion
            if (this._boundInsertListener)
                return;
            const styleInner = /* css */ `
            @keyframes ${id} {
                from {
                    opacity: 0.99;
                }
                to {
                    opacity: 1;
                }
            }
    
            ${targetSelector}{
                animation-duration: 0.001s;
                animation-name: ${id};
            }
            `;
            const style = document.createElement('style');
            style.innerHTML = styleInner;
            const host = getHost(this);
            if (host !== null) {
                host.shadowRoot.appendChild(style);
            }
            else {
                document.body.appendChild(style);
            }
            this._boundInsertListener = insertListener.bind(this);
            const container = host ? host.shadowRoot : document;
            eventNames.forEach(name => {
                container.addEventListener(name, this._boundInsertListener, false);
            });
            // container.addEventListener("animationstart", this._boundInsertListener, false); // standard + firefox
            // container.addEventListener("MSAnimationStart", this._boundInsertListener, false); // IE
            // container.addEventListener("webkitAnimationStart", this._boundInsertListener, false); // Chrome + Safari
        }
        disconnectedCallback() {
            if (this._boundInsertListener) {
                const host = getHost(this);
                const container = host ? host.shadowRoot : document;
                eventNames.forEach(name => {
                    container.removeEventListener(name, this._boundInsertListener);
                });
                // document.removeEventListener("animationstart", this._boundInsertListener); // standard + firefox
                // document.removeEventListener("MSAnimationStart", this._boundInsertListener); // IE
                // document.removeEventListener("webkitAnimationStart", this._boundInsertListener); // Chrome + Safari
            }
            if (super.disconnectedCallback !== undefined)
                super.disconnectedCallback();
        }
    };
}
function attachScriptFn(tagName, target, prop, body, imports) {
    const constructor = customElements.get(tagName);
    const count = constructor._count++;
    const script = document.createElement('script');
    if (supportsStaticImport()) {
        script.type = 'module';
    }
    script.innerHTML = `
${imports}
(function () {
${body}
const constructor = customElements.get('${tagName}');
constructor['fn_' + ${count}] = __fn;
})();
`;
    document.head.appendChild(script);
    attachFn(constructor, count, target, prop);
}
function supportsStaticImport() {
    const script = document.createElement('script');
    return 'noModule' in script;
}
function attachFn(constructor, count, target, prop) {
    const Fn = constructor['fn_' + count];
    if (Fn === undefined) {
        setTimeout(() => {
            attachFn(constructor, count, target, prop);
        }, 10);
        return;
    }
    target[prop] = Fn;
}
function getDynScript(el, callBack) {
    el._script = el.querySelector('script');
    if (!el._script) {
        setTimeout(() => {
            getDynScript(el, callBack);
        }, 10);
        return;
    }
    callBack();
}
class LitterG extends observeCssSelector(HTMLElement) {
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
    })();  
        