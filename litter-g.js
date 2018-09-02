import { observeCssSelector } from 'xtal-latx/observeCssSelector.js';
import { define } from 'xtal-latx/define.js';
export class LitterG extends observeCssSelector(HTMLElement) {
    static get is() { return 'litter-g'; }
    insertListener(e) {
        console.log('i am here 2');
        if (e.animationName === LitterG.is) {
            console.log('i am here');
        }
    }
    connectedCallback() {
        this._connected = true;
        this.onPropsChange();
    }
    onPropsChange() {
        if (!this._connected)
            return;
        this.addCSSListener(LitterG.is, '[data-litter-g]', this.insertListener);
    }
}
define(LitterG);
//# sourceMappingURL=litter-g.js.map