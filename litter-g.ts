import {observeCssSelector} from 'xtal-latx/observeCssSelector.js';
import {define} from 'xtal-latx/define.js'
export interface IScriptInfo{
    args: string[],
    body: string,
}
export class LitterG extends observeCssSelector(HTMLElement){
    static get is(){return 'litter-g';}
    static _count = 0;
    _connected!: boolean;
    insertListener(e: any){
        if (e.animationName === LitterG.is) {
            const target = e.target;
            setTimeout(() =>{
                this.registerScript(target);
            }, 0)
        }
    }
    defGenProp(target: HTMLElement, prop: string){}

    commitProps(props: string[], target: HTMLElement){
        props.forEach(prop =>{
            const initVal = (<any>target)[prop];
            //TODO:  move default case into litter-gz
            switch(prop){
                case 'render':
                case 'input':
                case 'target':
                    Object.defineProperty(target, prop, {
                        get: function () {
                            return this['_' + prop];
                        },
                        set: function (val) {
                            this['_' + prop] = val;
                            if(this.input && this.renderer && !this.hasAttribute('disabled')) this.renderer(this.input, this.target || target);
                        },
                        enumerable: true,
                        configurable: true,
                    });
                    break;
                default:
                    this.defGenProp(target, prop);
            }

            if(initVal !== undefined)  (<any>target)[prop] = initVal;
            
        });
    }
    addProps(target: any, scriptInfo: IScriptInfo){
        if(target.dataset.addedProps) return;
        this.commitProps(scriptInfo.args.concat('render', 'input', 'target'), target);
        target.dataset.addedProps = 'true';
        if(!target.input){
            const inp = target.dataset.input;
            if(inp){
                target.input = JSON.parse(inp);
            }
        }

    }
    getScript(srcScript: HTMLScriptElement): IScriptInfo{
        return {
            args: ['input'],
            body: srcScript.innerHTML,
        };
    }
    registerScript(target: HTMLElement){
        
        if(!target.firstElementChild){
            setTimeout(() =>{
                this.registerScript(target);
            }, 50);
            return;
        }
        const srcS = target.firstElementChild as HTMLScriptElement;
        if(srcS!.localName !== 'script') throw "Expecting script child";
        
        const script = document.createElement('script');
        const base = 'https://cdn.jsdelivr.net/npm/lit-html/';
        let importPaths = `
        import {html, render} from '${base}lit-html.js';
        import {repeat} from '${base}lib/repeat.js';
`;
        const importAttr = this.getAttribute('import');
        if(importAttr !== null) importPaths = (<any>self)[importAttr];
        const count = LitterG._count++;
        const scriptInfo = this.getScript(srcS);
        const args = scriptInfo.args.length > 1 ?  '{' + scriptInfo.args.join(',') + '}' : 'input';
        const text = /* js */`
${importPaths}
const litterG = customElements.get('litter-g');
const litter = (${args}) => ${scriptInfo.body};
litterG['fn_' + ${count}] = function(input, target){
    render(litter(input), target);
}
`;

        script.type = 'module';
        script.innerHTML = text;
        document.head.appendChild(script);
        this.attachRenderer(target, count, scriptInfo);
    }
    attachRenderer(target: any, count: number, scriptInfo: IScriptInfo){
        const renderer = (<any>LitterG)['fn_' + count];
        if(renderer === undefined){
            setTimeout(() => {
                this.attachRenderer(target, count, scriptInfo);
            }, 10);
            return;
        }
        target.renderer = renderer;
        this.addProps(target, scriptInfo);
    }
    connectedCallback(){
        this.style.display = 'none';
        this._connected = true;
        this.onPropsChange();
    }
    onPropsChange(){
        if(!this._connected) return;
        this.addCSSListener(LitterG.is, '[data-lit]', this.insertListener);
    }


}
define(LitterG);