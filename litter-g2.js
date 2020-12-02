import { XtalDeco } from 'xtal-deco/xtal-deco.js';
import { define } from 'trans-render/define.js';
export class LitterG2 extends XtalDeco {
    constructor() {
        super(...arguments);
        this.init = ({ self }) => {
            const scriptEl = self.querySelector('script');
            console.log(scriptEl);
        };
        this.actions = [];
        this.on = {};
    }
}
LitterG2.is = 'litter-g2';
define(LitterG2);
