import {XtalDeco} from 'xtal-deco/xtal-deco.js';
import {define} from 'trans-render/define.js';

export class LitterG2 extends XtalDeco {
    static is = 'litter-g2';

    init = ({self} : any) => {
        const scriptEl = self.querySelector('script');
        console.log(scriptEl)
    }
    actions = [];
    on = {};
}
define(LitterG2);