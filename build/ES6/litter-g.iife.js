(function(){function getHost(el){let parent=el;while(parent=parent.parentNode){if(11===parent.nodeType){return parent.host}else if("BODY"===parent.tagName){return null}}return null}function observeCssSelector(superClass){const eventNames=["animationstart","MSAnimationStart","webkitAnimationStart"];return class extends superClass{addCSSListener(id,targetSelector,insertListener){if(this._boundInsertListener)return;const style=document.createElement("style");style.innerHTML=`
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
            `;const host=getHost(this);if(null!==host){host.shadowRoot.appendChild(style)}else{document.body.appendChild(style)}this._boundInsertListener=insertListener.bind(this);const container=host?host.shadowRoot:document;eventNames.forEach(name=>{container.addEventListener(name,this._boundInsertListener,!1)})}disconnectedCallback(){if(this._boundInsertListener){const host=getHost(this),container=host?host.shadowRoot:document;eventNames.forEach(name=>{container.removeEventListener(name,this._boundInsertListener)})}if(super.disconnectedCallback!==void 0)super.disconnectedCallback()}}}class LitterG extends observeCssSelector(HTMLElement){static get is(){return"litter-g"}insertListener(e){if(e.animationName===LitterG.is){const target=e.target;setTimeout(()=>{this.registerScript(target)},0)}}defGenProp(){}commitProps(props,target){props.forEach(prop=>{const initVal=target[prop];switch(prop){case"render":case"input":case"target":Object.defineProperty(target,prop,{get:function(){return this["_"+prop]},set:function(val){this["_"+prop]=val;if(this.input&&this.renderer&&!this.hasAttribute("disabled"))this.renderer(this.input,this.target||target)},enumerable:!0,configurable:!0});break;default:this.defGenProp(target,prop);}if(initVal!==void 0)target[prop]=initVal})}addProps(target,scriptInfo){if(target.dataset.addedProps)return;this.commitProps(scriptInfo.args.concat("render","input","target"),target);target.dataset.addedProps="true";if(!target.input){const inp=target.dataset.input;if(inp){target.input=JSON.parse(inp)}}}getScript(srcScript){return{args:["input"],body:srcScript.innerHTML}}registerScript(target){if(!target.firstElementChild){setTimeout(()=>{this.registerScript(target)},50);return}const srcS=target.firstElementChild;if("script"!==srcS.localName)throw"Expecting script child";const script=document.createElement("script"),base="https://cdn.jsdelivr.net/npm/lit-html/";let importPaths=`
        import {html, render} from '${base}lit-html.js';
        import {repeat} from '${base}lib/repeat.js';
`;const importAttr=this.getAttribute("import");if(importAttr)importPaths=self[importAttr];const count=LitterG._count++,scriptInfo=this.getScript(srcS),args=1<scriptInfo.args.length?"{"+scriptInfo.args.join(",")+"}":"input",text=`
${importPaths}
const litterG = customElements.get('litter-g');
const litter = (${args}) => ${scriptInfo.body};
litterG['fn_' + ${count}] = function(input, target){
    render(litter(input), target);
}
`;script.type="module";script.innerHTML=text;document.head.appendChild(script);this.attachRenderer(target,count,scriptInfo)}attachRenderer(target,count,scriptInfo){const renderer=LitterG["fn_"+count];if(renderer===void 0){setTimeout(()=>{this.attachRenderer(target,count,scriptInfo)},10);return}target.renderer=renderer;this.addProps(target,scriptInfo)}connectedCallback(){this.style.display="none";this._connected=!0;this.onPropsChange()}onPropsChange(){if(!this._connected)return;this.addCSSListener(LitterG.is,"[data-lit]",this.insertListener)}}LitterG._count=0;(function(custEl){let tagName=custEl.is;if(customElements.get(tagName)){console.warn("Already registered "+tagName);return}customElements.define(tagName,custEl)})(LitterG)})();