import {observeCssSelector} from 'xtal-latx/observeCssSelector.js';
import {define} from 'xtal-latx/define.js'

export class LitterG extends observeCssSelector(HTMLElement){
    static get is(){return 'litter-g';}
    _connected!: boolean;
    insertListener(e: any){
        if (e.animationName === LitterG.is) {
            const scriptTag = e.target.previousElement;
            if(scriptTag === null || scriptTag.localName !== 'script') throw 'Element must be preceded by Script';

        }
    }
    registerScript(){
        
    }
    connectedCallback(){
        this._connected = true;
        this.onPropsChange();
    }
    onPropsChange(){
        if(!this._connected) return;
        this.addCSSListener(LitterG.is, '[data-litter-g]', this.insertListener);
    }


}
define(LitterG);