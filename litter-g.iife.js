
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
class LitterG extends observeCssSelector(HTMLElement) {
    static get is() { return 'litter-g'; }
    insertListener(e) {
        if (e.animationName === LitterG.is) {
            const target = e.target;
            setTimeout(() => {
                this.registerScript(target);
            }, 0);
        }
    }
    updateProps(props, target) {
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
            if (initVal !== undefined) {
            }
            else {
            }
        });
    }
    addProps(target) {
        if (target.dataset.addedProps)
            return;
        this.updateProps(['input', 'renderer'], target);
        target.dataset.addedProps = 'true';
        if (!target.input) {
            const inp = target.dataset.input;
            if (inp) {
                target.input = JSON.parse(inp);
            }
        }
    }
    registerScript(target) {
        this.addProps(target);
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
`;
        const importAttr = this.getAttribute('import');
        if (importAttr)
            importPaths = self[importAttr];
        const text = /* js */ `
${importPaths}
const litterG = customElements.get('litter-g');
const count = litterG._count++;

litterG['fn_' + count] = function(input, target){
    const litter = (name) => ${srcS.innerHTML};

    render(litter(input), target);
    
}
`;
        script.type = 'module';
        script.innerHTML = text;
        document.head.appendChild(script);
        this.attachRenderer(target);
    }
    attachRenderer(target) {
        const renderer = LitterG['fn_' + (LitterG._count - 1)];
        if (renderer === undefined) {
            setTimeout(() => {
                this.attachRenderer(target);
            }, 10);
            return;
        }
        target.renderer = renderer;
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
    })();  
        