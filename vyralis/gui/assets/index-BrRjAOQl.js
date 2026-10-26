var U_=Object.defineProperty;var F_=(t,e,n)=>e in t?U_(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var ze=(t,e,n)=>F_(t,typeof e!="symbol"?e+"":e,n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();function k_(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var km={exports:{}},jl={},Om={exports:{}},Be={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Wa=Symbol.for("react.element"),O_=Symbol.for("react.portal"),B_=Symbol.for("react.fragment"),z_=Symbol.for("react.strict_mode"),V_=Symbol.for("react.profiler"),H_=Symbol.for("react.provider"),G_=Symbol.for("react.context"),W_=Symbol.for("react.forward_ref"),j_=Symbol.for("react.suspense"),X_=Symbol.for("react.memo"),$_=Symbol.for("react.lazy"),wh=Symbol.iterator;function Y_(t){return t===null||typeof t!="object"?null:(t=wh&&t[wh]||t["@@iterator"],typeof t=="function"?t:null)}var Bm={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},zm=Object.assign,Vm={};function Hs(t,e,n){this.props=t,this.context=e,this.refs=Vm,this.updater=n||Bm}Hs.prototype.isReactComponent={};Hs.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};Hs.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function Hm(){}Hm.prototype=Hs.prototype;function lf(t,e,n){this.props=t,this.context=e,this.refs=Vm,this.updater=n||Bm}var cf=lf.prototype=new Hm;cf.constructor=lf;zm(cf,Hs.prototype);cf.isPureReactComponent=!0;var Th=Array.isArray,Gm=Object.prototype.hasOwnProperty,uf={current:null},Wm={key:!0,ref:!0,__self:!0,__source:!0};function jm(t,e,n){var i,r={},s=null,a=null;if(e!=null)for(i in e.ref!==void 0&&(a=e.ref),e.key!==void 0&&(s=""+e.key),e)Gm.call(e,i)&&!Wm.hasOwnProperty(i)&&(r[i]=e[i]);var o=arguments.length-2;if(o===1)r.children=n;else if(1<o){for(var l=Array(o),c=0;c<o;c++)l[c]=arguments[c+2];r.children=l}if(t&&t.defaultProps)for(i in o=t.defaultProps,o)r[i]===void 0&&(r[i]=o[i]);return{$$typeof:Wa,type:t,key:s,ref:a,props:r,_owner:uf.current}}function q_(t,e){return{$$typeof:Wa,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function df(t){return typeof t=="object"&&t!==null&&t.$$typeof===Wa}function K_(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var Ah=/\/+/g;function mc(t,e){return typeof t=="object"&&t!==null&&t.key!=null?K_(""+t.key):e.toString(36)}function Yo(t,e,n,i,r){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var a=!1;if(t===null)a=!0;else switch(s){case"string":case"number":a=!0;break;case"object":switch(t.$$typeof){case Wa:case O_:a=!0}}if(a)return a=t,r=r(a),t=i===""?"."+mc(a,0):i,Th(r)?(n="",t!=null&&(n=t.replace(Ah,"$&/")+"/"),Yo(r,e,n,"",function(c){return c})):r!=null&&(df(r)&&(r=q_(r,n+(!r.key||a&&a.key===r.key?"":(""+r.key).replace(Ah,"$&/")+"/")+t)),e.push(r)),1;if(a=0,i=i===""?".":i+":",Th(t))for(var o=0;o<t.length;o++){s=t[o];var l=i+mc(s,o);a+=Yo(s,e,n,l,r)}else if(l=Y_(t),typeof l=="function")for(t=l.call(t),o=0;!(s=t.next()).done;)s=s.value,l=i+mc(s,o++),a+=Yo(s,e,n,l,r);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return a}function no(t,e,n){if(t==null)return t;var i=[],r=0;return Yo(t,i,"","",function(s){return e.call(n,s,r++)}),i}function Z_(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var en={current:null},qo={transition:null},Q_={ReactCurrentDispatcher:en,ReactCurrentBatchConfig:qo,ReactCurrentOwner:uf};function Xm(){throw Error("act(...) is not supported in production builds of React.")}Be.Children={map:no,forEach:function(t,e,n){no(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return no(t,function(){e++}),e},toArray:function(t){return no(t,function(e){return e})||[]},only:function(t){if(!df(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};Be.Component=Hs;Be.Fragment=B_;Be.Profiler=V_;Be.PureComponent=lf;Be.StrictMode=z_;Be.Suspense=j_;Be.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Q_;Be.act=Xm;Be.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var i=zm({},t.props),r=t.key,s=t.ref,a=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,a=uf.current),e.key!==void 0&&(r=""+e.key),t.type&&t.type.defaultProps)var o=t.type.defaultProps;for(l in e)Gm.call(e,l)&&!Wm.hasOwnProperty(l)&&(i[l]=e[l]===void 0&&o!==void 0?o[l]:e[l])}var l=arguments.length-2;if(l===1)i.children=n;else if(1<l){o=Array(l);for(var c=0;c<l;c++)o[c]=arguments[c+2];i.children=o}return{$$typeof:Wa,type:t.type,key:r,ref:s,props:i,_owner:a}};Be.createContext=function(t){return t={$$typeof:G_,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:H_,_context:t},t.Consumer=t};Be.createElement=jm;Be.createFactory=function(t){var e=jm.bind(null,t);return e.type=t,e};Be.createRef=function(){return{current:null}};Be.forwardRef=function(t){return{$$typeof:W_,render:t}};Be.isValidElement=df;Be.lazy=function(t){return{$$typeof:$_,_payload:{_status:-1,_result:t},_init:Z_}};Be.memo=function(t,e){return{$$typeof:X_,type:t,compare:e===void 0?null:e}};Be.startTransition=function(t){var e=qo.transition;qo.transition={};try{t()}finally{qo.transition=e}};Be.unstable_act=Xm;Be.useCallback=function(t,e){return en.current.useCallback(t,e)};Be.useContext=function(t){return en.current.useContext(t)};Be.useDebugValue=function(){};Be.useDeferredValue=function(t){return en.current.useDeferredValue(t)};Be.useEffect=function(t,e){return en.current.useEffect(t,e)};Be.useId=function(){return en.current.useId()};Be.useImperativeHandle=function(t,e,n){return en.current.useImperativeHandle(t,e,n)};Be.useInsertionEffect=function(t,e){return en.current.useInsertionEffect(t,e)};Be.useLayoutEffect=function(t,e){return en.current.useLayoutEffect(t,e)};Be.useMemo=function(t,e){return en.current.useMemo(t,e)};Be.useReducer=function(t,e,n){return en.current.useReducer(t,e,n)};Be.useRef=function(t){return en.current.useRef(t)};Be.useState=function(t){return en.current.useState(t)};Be.useSyncExternalStore=function(t,e,n){return en.current.useSyncExternalStore(t,e,n)};Be.useTransition=function(){return en.current.useTransition()};Be.version="18.3.1";Om.exports=Be;var xe=Om.exports;const J_=k_(xe);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var e0=xe,t0=Symbol.for("react.element"),n0=Symbol.for("react.fragment"),i0=Object.prototype.hasOwnProperty,r0=e0.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,s0={key:!0,ref:!0,__self:!0,__source:!0};function $m(t,e,n){var i,r={},s=null,a=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(a=e.ref);for(i in e)i0.call(e,i)&&!s0.hasOwnProperty(i)&&(r[i]=e[i]);if(t&&t.defaultProps)for(i in e=t.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:t0,type:t,key:s,ref:a,props:r,_owner:r0.current}}jl.Fragment=n0;jl.jsx=$m;jl.jsxs=$m;km.exports=jl;var w=km.exports,Su={},Ym={exports:{}},Sn={},qm={exports:{}},Km={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(N,q){var Q=N.length;N.push(q);e:for(;0<Q;){var se=Q-1>>>1,Te=N[se];if(0<r(Te,q))N[se]=q,N[Q]=Te,Q=se;else break e}}function n(N){return N.length===0?null:N[0]}function i(N){if(N.length===0)return null;var q=N[0],Q=N.pop();if(Q!==q){N[0]=Q;e:for(var se=0,Te=N.length,He=Te>>>1;se<He;){var j=2*(se+1)-1,ne=N[j],de=j+1,le=N[de];if(0>r(ne,Q))de<Te&&0>r(le,ne)?(N[se]=le,N[de]=Q,se=de):(N[se]=ne,N[j]=Q,se=j);else if(de<Te&&0>r(le,Q))N[se]=le,N[de]=Q,se=de;else break e}}return q}function r(N,q){var Q=N.sortIndex-q.sortIndex;return Q!==0?Q:N.id-q.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var a=Date,o=a.now();t.unstable_now=function(){return a.now()-o}}var l=[],c=[],d=1,h=null,f=3,p=!1,_=!1,y=!1,m=typeof setTimeout=="function"?setTimeout:null,u=typeof clearTimeout=="function"?clearTimeout:null,g=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function v(N){for(var q=n(c);q!==null;){if(q.callback===null)i(c);else if(q.startTime<=N)i(c),q.sortIndex=q.expirationTime,e(l,q);else break;q=n(c)}}function E(N){if(y=!1,v(N),!_)if(n(l)!==null)_=!0,V(b);else{var q=n(c);q!==null&&J(E,q.startTime-N)}}function b(N,q){_=!1,y&&(y=!1,u(P),P=-1),p=!0;var Q=f;try{for(v(q),h=n(l);h!==null&&(!(h.expirationTime>q)||N&&!A());){var se=h.callback;if(typeof se=="function"){h.callback=null,f=h.priorityLevel;var Te=se(h.expirationTime<=q);q=t.unstable_now(),typeof Te=="function"?h.callback=Te:h===n(l)&&i(l),v(q)}else i(l);h=n(l)}if(h!==null)var He=!0;else{var j=n(c);j!==null&&J(E,j.startTime-q),He=!1}return He}finally{h=null,f=Q,p=!1}}var S=!1,C=null,P=-1,X=5,x=-1;function A(){return!(t.unstable_now()-x<X)}function G(){if(C!==null){var N=t.unstable_now();x=N;var q=!0;try{q=C(!0,N)}finally{q?z():(S=!1,C=null)}}else S=!1}var z;if(typeof g=="function")z=function(){g(G)};else if(typeof MessageChannel<"u"){var W=new MessageChannel,Z=W.port2;W.port1.onmessage=G,z=function(){Z.postMessage(null)}}else z=function(){m(G,0)};function V(N){C=N,S||(S=!0,z())}function J(N,q){P=m(function(){N(t.unstable_now())},q)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(N){N.callback=null},t.unstable_continueExecution=function(){_||p||(_=!0,V(b))},t.unstable_forceFrameRate=function(N){0>N||125<N?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):X=0<N?Math.floor(1e3/N):5},t.unstable_getCurrentPriorityLevel=function(){return f},t.unstable_getFirstCallbackNode=function(){return n(l)},t.unstable_next=function(N){switch(f){case 1:case 2:case 3:var q=3;break;default:q=f}var Q=f;f=q;try{return N()}finally{f=Q}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(N,q){switch(N){case 1:case 2:case 3:case 4:case 5:break;default:N=3}var Q=f;f=N;try{return q()}finally{f=Q}},t.unstable_scheduleCallback=function(N,q,Q){var se=t.unstable_now();switch(typeof Q=="object"&&Q!==null?(Q=Q.delay,Q=typeof Q=="number"&&0<Q?se+Q:se):Q=se,N){case 1:var Te=-1;break;case 2:Te=250;break;case 5:Te=1073741823;break;case 4:Te=1e4;break;default:Te=5e3}return Te=Q+Te,N={id:d++,callback:q,priorityLevel:N,startTime:Q,expirationTime:Te,sortIndex:-1},Q>se?(N.sortIndex=Q,e(c,N),n(l)===null&&N===n(c)&&(y?(u(P),P=-1):y=!0,J(E,Q-se))):(N.sortIndex=Te,e(l,N),_||p||(_=!0,V(b))),N},t.unstable_shouldYield=A,t.unstable_wrapCallback=function(N){var q=f;return function(){var Q=f;f=q;try{return N.apply(this,arguments)}finally{f=Q}}}})(Km);qm.exports=Km;var a0=qm.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var o0=xe,yn=a0;function te(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Zm=new Set,Ta={};function Fr(t,e){Ps(t,e),Ps(t+"Capture",e)}function Ps(t,e){for(Ta[t]=e,t=0;t<e.length;t++)Zm.add(e[t])}var Si=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Mu=Object.prototype.hasOwnProperty,l0=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Ch={},Rh={};function c0(t){return Mu.call(Rh,t)?!0:Mu.call(Ch,t)?!1:l0.test(t)?Rh[t]=!0:(Ch[t]=!0,!1)}function u0(t,e,n,i){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function d0(t,e,n,i){if(e===null||typeof e>"u"||u0(t,e,n,i))return!0;if(i)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function tn(t,e,n,i,r,s,a){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=a}var Vt={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){Vt[t]=new tn(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];Vt[e]=new tn(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){Vt[t]=new tn(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){Vt[t]=new tn(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){Vt[t]=new tn(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){Vt[t]=new tn(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){Vt[t]=new tn(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){Vt[t]=new tn(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){Vt[t]=new tn(t,5,!1,t.toLowerCase(),null,!1,!1)});var ff=/[\-:]([a-z])/g;function hf(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(ff,hf);Vt[e]=new tn(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(ff,hf);Vt[e]=new tn(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(ff,hf);Vt[e]=new tn(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){Vt[t]=new tn(t,1,!1,t.toLowerCase(),null,!1,!1)});Vt.xlinkHref=new tn("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){Vt[t]=new tn(t,1,!1,t.toLowerCase(),null,!0,!0)});function pf(t,e,n,i){var r=Vt.hasOwnProperty(e)?Vt[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(d0(e,n,r,i)&&(n=null),i||r===null?c0(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):r.mustUseProperty?t[r.propertyName]=n===null?r.type===3?!1:"":n:(e=r.attributeName,i=r.attributeNamespace,n===null?t.removeAttribute(e):(r=r.type,n=r===3||r===4&&n===!0?"":""+n,i?t.setAttributeNS(i,e,n):t.setAttribute(e,n))))}var Ci=o0.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,io=Symbol.for("react.element"),os=Symbol.for("react.portal"),ls=Symbol.for("react.fragment"),mf=Symbol.for("react.strict_mode"),Eu=Symbol.for("react.profiler"),Qm=Symbol.for("react.provider"),Jm=Symbol.for("react.context"),gf=Symbol.for("react.forward_ref"),wu=Symbol.for("react.suspense"),Tu=Symbol.for("react.suspense_list"),vf=Symbol.for("react.memo"),ki=Symbol.for("react.lazy"),eg=Symbol.for("react.offscreen"),Ph=Symbol.iterator;function $s(t){return t===null||typeof t!="object"?null:(t=Ph&&t[Ph]||t["@@iterator"],typeof t=="function"?t:null)}var St=Object.assign,gc;function da(t){if(gc===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);gc=e&&e[1]||""}return`
`+gc+t}var vc=!1;function _c(t,e){if(!t||vc)return"";vc=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(c){var i=c}Reflect.construct(t,[],e)}else{try{e.call()}catch(c){i=c}t.call(e.prototype)}else{try{throw Error()}catch(c){i=c}t()}}catch(c){if(c&&i&&typeof c.stack=="string"){for(var r=c.stack.split(`
`),s=i.stack.split(`
`),a=r.length-1,o=s.length-1;1<=a&&0<=o&&r[a]!==s[o];)o--;for(;1<=a&&0<=o;a--,o--)if(r[a]!==s[o]){if(a!==1||o!==1)do if(a--,o--,0>o||r[a]!==s[o]){var l=`
`+r[a].replace(" at new "," at ");return t.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",t.displayName)),l}while(1<=a&&0<=o);break}}}finally{vc=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?da(t):""}function f0(t){switch(t.tag){case 5:return da(t.type);case 16:return da("Lazy");case 13:return da("Suspense");case 19:return da("SuspenseList");case 0:case 2:case 15:return t=_c(t.type,!1),t;case 11:return t=_c(t.type.render,!1),t;case 1:return t=_c(t.type,!0),t;default:return""}}function Au(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case ls:return"Fragment";case os:return"Portal";case Eu:return"Profiler";case mf:return"StrictMode";case wu:return"Suspense";case Tu:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case Jm:return(t.displayName||"Context")+".Consumer";case Qm:return(t._context.displayName||"Context")+".Provider";case gf:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case vf:return e=t.displayName||null,e!==null?e:Au(t.type)||"Memo";case ki:e=t._payload,t=t._init;try{return Au(t(e))}catch{}}return null}function h0(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Au(e);case 8:return e===mf?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function tr(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function tg(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function p0(t){var e=tg(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),i=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var r=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return r.call(this)},set:function(a){i=""+a,s.call(this,a)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return i},setValue:function(a){i=""+a},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function ro(t){t._valueTracker||(t._valueTracker=p0(t))}function ng(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),i="";return t&&(i=tg(t)?t.checked?"true":"false":t.value),t=i,t!==n?(e.setValue(t),!0):!1}function hl(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function Cu(t,e){var n=e.checked;return St({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function bh(t,e){var n=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;n=tr(e.value!=null?e.value:n),t._wrapperState={initialChecked:i,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function ig(t,e){e=e.checked,e!=null&&pf(t,"checked",e,!1)}function Ru(t,e){ig(t,e);var n=tr(e.value),i=e.type;if(n!=null)i==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(i==="submit"||i==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?Pu(t,e.type,n):e.hasOwnProperty("defaultValue")&&Pu(t,e.type,tr(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function Lh(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function Pu(t,e,n){(e!=="number"||hl(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var fa=Array.isArray;function ys(t,e,n,i){if(t=t.options,e){e={};for(var r=0;r<n.length;r++)e["$"+n[r]]=!0;for(n=0;n<t.length;n++)r=e.hasOwnProperty("$"+t[n].value),t[n].selected!==r&&(t[n].selected=r),r&&i&&(t[n].defaultSelected=!0)}else{for(n=""+tr(n),e=null,r=0;r<t.length;r++){if(t[r].value===n){t[r].selected=!0,i&&(t[r].defaultSelected=!0);return}e!==null||t[r].disabled||(e=t[r])}e!==null&&(e.selected=!0)}}function bu(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(te(91));return St({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function Nh(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(te(92));if(fa(n)){if(1<n.length)throw Error(te(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:tr(n)}}function rg(t,e){var n=tr(e.value),i=tr(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),i!=null&&(t.defaultValue=""+i)}function Dh(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function sg(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Lu(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?sg(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var so,ag=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,i,r){MSApp.execUnsafeLocalFunction(function(){return t(e,n,i,r)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(so=so||document.createElement("div"),so.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=so.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function Aa(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var ga={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},m0=["Webkit","ms","Moz","O"];Object.keys(ga).forEach(function(t){m0.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),ga[e]=ga[t]})});function og(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||ga.hasOwnProperty(t)&&ga[t]?(""+e).trim():e+"px"}function lg(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var i=n.indexOf("--")===0,r=og(n,e[n],i);n==="float"&&(n="cssFloat"),i?t.setProperty(n,r):t[n]=r}}var g0=St({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Nu(t,e){if(e){if(g0[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(te(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(te(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(te(61))}if(e.style!=null&&typeof e.style!="object")throw Error(te(62))}}function Du(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Iu=null;function _f(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Uu=null,Ss=null,Ms=null;function Ih(t){if(t=$a(t)){if(typeof Uu!="function")throw Error(te(280));var e=t.stateNode;e&&(e=Kl(e),Uu(t.stateNode,t.type,e))}}function cg(t){Ss?Ms?Ms.push(t):Ms=[t]:Ss=t}function ug(){if(Ss){var t=Ss,e=Ms;if(Ms=Ss=null,Ih(t),e)for(t=0;t<e.length;t++)Ih(e[t])}}function dg(t,e){return t(e)}function fg(){}var xc=!1;function hg(t,e,n){if(xc)return t(e,n);xc=!0;try{return dg(t,e,n)}finally{xc=!1,(Ss!==null||Ms!==null)&&(fg(),ug())}}function Ca(t,e){var n=t.stateNode;if(n===null)return null;var i=Kl(n);if(i===null)return null;n=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(t=t.type,i=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!i;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(te(231,e,typeof n));return n}var Fu=!1;if(Si)try{var Ys={};Object.defineProperty(Ys,"passive",{get:function(){Fu=!0}}),window.addEventListener("test",Ys,Ys),window.removeEventListener("test",Ys,Ys)}catch{Fu=!1}function v0(t,e,n,i,r,s,a,o,l){var c=Array.prototype.slice.call(arguments,3);try{e.apply(n,c)}catch(d){this.onError(d)}}var va=!1,pl=null,ml=!1,ku=null,_0={onError:function(t){va=!0,pl=t}};function x0(t,e,n,i,r,s,a,o,l){va=!1,pl=null,v0.apply(_0,arguments)}function y0(t,e,n,i,r,s,a,o,l){if(x0.apply(this,arguments),va){if(va){var c=pl;va=!1,pl=null}else throw Error(te(198));ml||(ml=!0,ku=c)}}function kr(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function pg(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function Uh(t){if(kr(t)!==t)throw Error(te(188))}function S0(t){var e=t.alternate;if(!e){if(e=kr(t),e===null)throw Error(te(188));return e!==t?null:t}for(var n=t,i=e;;){var r=n.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){n=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===n)return Uh(r),t;if(s===i)return Uh(r),e;s=s.sibling}throw Error(te(188))}if(n.return!==i.return)n=r,i=s;else{for(var a=!1,o=r.child;o;){if(o===n){a=!0,n=r,i=s;break}if(o===i){a=!0,i=r,n=s;break}o=o.sibling}if(!a){for(o=s.child;o;){if(o===n){a=!0,n=s,i=r;break}if(o===i){a=!0,i=s,n=r;break}o=o.sibling}if(!a)throw Error(te(189))}}if(n.alternate!==i)throw Error(te(190))}if(n.tag!==3)throw Error(te(188));return n.stateNode.current===n?t:e}function mg(t){return t=S0(t),t!==null?gg(t):null}function gg(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=gg(t);if(e!==null)return e;t=t.sibling}return null}var vg=yn.unstable_scheduleCallback,Fh=yn.unstable_cancelCallback,M0=yn.unstable_shouldYield,E0=yn.unstable_requestPaint,Tt=yn.unstable_now,w0=yn.unstable_getCurrentPriorityLevel,xf=yn.unstable_ImmediatePriority,_g=yn.unstable_UserBlockingPriority,gl=yn.unstable_NormalPriority,T0=yn.unstable_LowPriority,xg=yn.unstable_IdlePriority,Xl=null,ii=null;function A0(t){if(ii&&typeof ii.onCommitFiberRoot=="function")try{ii.onCommitFiberRoot(Xl,t,void 0,(t.current.flags&128)===128)}catch{}}var jn=Math.clz32?Math.clz32:P0,C0=Math.log,R0=Math.LN2;function P0(t){return t>>>=0,t===0?32:31-(C0(t)/R0|0)|0}var ao=64,oo=4194304;function ha(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function vl(t,e){var n=t.pendingLanes;if(n===0)return 0;var i=0,r=t.suspendedLanes,s=t.pingedLanes,a=n&268435455;if(a!==0){var o=a&~r;o!==0?i=ha(o):(s&=a,s!==0&&(i=ha(s)))}else a=n&~r,a!==0?i=ha(a):s!==0&&(i=ha(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=i;0<e;)n=31-jn(e),r=1<<n,i|=t[n],e&=~r;return i}function b0(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function L0(t,e){for(var n=t.suspendedLanes,i=t.pingedLanes,r=t.expirationTimes,s=t.pendingLanes;0<s;){var a=31-jn(s),o=1<<a,l=r[a];l===-1?(!(o&n)||o&i)&&(r[a]=b0(o,e)):l<=e&&(t.expiredLanes|=o),s&=~o}}function Ou(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function yg(){var t=ao;return ao<<=1,!(ao&4194240)&&(ao=64),t}function yc(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function ja(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-jn(e),t[e]=n}function N0(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var i=t.eventTimes;for(t=t.expirationTimes;0<n;){var r=31-jn(n),s=1<<r;e[r]=0,i[r]=-1,t[r]=-1,n&=~s}}function yf(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var i=31-jn(n),r=1<<i;r&e|t[i]&e&&(t[i]|=e),n&=~r}}var st=0;function Sg(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var Mg,Sf,Eg,wg,Tg,Bu=!1,lo=[],Wi=null,ji=null,Xi=null,Ra=new Map,Pa=new Map,Bi=[],D0="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function kh(t,e){switch(t){case"focusin":case"focusout":Wi=null;break;case"dragenter":case"dragleave":ji=null;break;case"mouseover":case"mouseout":Xi=null;break;case"pointerover":case"pointerout":Ra.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":Pa.delete(e.pointerId)}}function qs(t,e,n,i,r,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=$a(e),e!==null&&Sf(e)),t):(t.eventSystemFlags|=i,e=t.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),t)}function I0(t,e,n,i,r){switch(e){case"focusin":return Wi=qs(Wi,t,e,n,i,r),!0;case"dragenter":return ji=qs(ji,t,e,n,i,r),!0;case"mouseover":return Xi=qs(Xi,t,e,n,i,r),!0;case"pointerover":var s=r.pointerId;return Ra.set(s,qs(Ra.get(s)||null,t,e,n,i,r)),!0;case"gotpointercapture":return s=r.pointerId,Pa.set(s,qs(Pa.get(s)||null,t,e,n,i,r)),!0}return!1}function Ag(t){var e=Sr(t.target);if(e!==null){var n=kr(e);if(n!==null){if(e=n.tag,e===13){if(e=pg(n),e!==null){t.blockedOn=e,Tg(t.priority,function(){Eg(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Ko(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=zu(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var i=new n.constructor(n.type,n);Iu=i,n.target.dispatchEvent(i),Iu=null}else return e=$a(n),e!==null&&Sf(e),t.blockedOn=n,!1;e.shift()}return!0}function Oh(t,e,n){Ko(t)&&n.delete(e)}function U0(){Bu=!1,Wi!==null&&Ko(Wi)&&(Wi=null),ji!==null&&Ko(ji)&&(ji=null),Xi!==null&&Ko(Xi)&&(Xi=null),Ra.forEach(Oh),Pa.forEach(Oh)}function Ks(t,e){t.blockedOn===e&&(t.blockedOn=null,Bu||(Bu=!0,yn.unstable_scheduleCallback(yn.unstable_NormalPriority,U0)))}function ba(t){function e(r){return Ks(r,t)}if(0<lo.length){Ks(lo[0],t);for(var n=1;n<lo.length;n++){var i=lo[n];i.blockedOn===t&&(i.blockedOn=null)}}for(Wi!==null&&Ks(Wi,t),ji!==null&&Ks(ji,t),Xi!==null&&Ks(Xi,t),Ra.forEach(e),Pa.forEach(e),n=0;n<Bi.length;n++)i=Bi[n],i.blockedOn===t&&(i.blockedOn=null);for(;0<Bi.length&&(n=Bi[0],n.blockedOn===null);)Ag(n),n.blockedOn===null&&Bi.shift()}var Es=Ci.ReactCurrentBatchConfig,_l=!0;function F0(t,e,n,i){var r=st,s=Es.transition;Es.transition=null;try{st=1,Mf(t,e,n,i)}finally{st=r,Es.transition=s}}function k0(t,e,n,i){var r=st,s=Es.transition;Es.transition=null;try{st=4,Mf(t,e,n,i)}finally{st=r,Es.transition=s}}function Mf(t,e,n,i){if(_l){var r=zu(t,e,n,i);if(r===null)bc(t,e,i,xl,n),kh(t,i);else if(I0(r,t,e,n,i))i.stopPropagation();else if(kh(t,i),e&4&&-1<D0.indexOf(t)){for(;r!==null;){var s=$a(r);if(s!==null&&Mg(s),s=zu(t,e,n,i),s===null&&bc(t,e,i,xl,n),s===r)break;r=s}r!==null&&i.stopPropagation()}else bc(t,e,i,null,n)}}var xl=null;function zu(t,e,n,i){if(xl=null,t=_f(i),t=Sr(t),t!==null)if(e=kr(t),e===null)t=null;else if(n=e.tag,n===13){if(t=pg(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return xl=t,null}function Cg(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(w0()){case xf:return 1;case _g:return 4;case gl:case T0:return 16;case xg:return 536870912;default:return 16}default:return 16}}var Hi=null,Ef=null,Zo=null;function Rg(){if(Zo)return Zo;var t,e=Ef,n=e.length,i,r="value"in Hi?Hi.value:Hi.textContent,s=r.length;for(t=0;t<n&&e[t]===r[t];t++);var a=n-t;for(i=1;i<=a&&e[n-i]===r[s-i];i++);return Zo=r.slice(t,1<i?1-i:void 0)}function Qo(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function co(){return!0}function Bh(){return!1}function Mn(t){function e(n,i,r,s,a){this._reactName=n,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=a,this.currentTarget=null;for(var o in t)t.hasOwnProperty(o)&&(n=t[o],this[o]=n?n(s):s[o]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?co:Bh,this.isPropagationStopped=Bh,this}return St(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=co)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=co)},persist:function(){},isPersistent:co}),e}var Gs={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},wf=Mn(Gs),Xa=St({},Gs,{view:0,detail:0}),O0=Mn(Xa),Sc,Mc,Zs,$l=St({},Xa,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Tf,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==Zs&&(Zs&&t.type==="mousemove"?(Sc=t.screenX-Zs.screenX,Mc=t.screenY-Zs.screenY):Mc=Sc=0,Zs=t),Sc)},movementY:function(t){return"movementY"in t?t.movementY:Mc}}),zh=Mn($l),B0=St({},$l,{dataTransfer:0}),z0=Mn(B0),V0=St({},Xa,{relatedTarget:0}),Ec=Mn(V0),H0=St({},Gs,{animationName:0,elapsedTime:0,pseudoElement:0}),G0=Mn(H0),W0=St({},Gs,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),j0=Mn(W0),X0=St({},Gs,{data:0}),Vh=Mn(X0),$0={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Y0={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},q0={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function K0(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=q0[t])?!!e[t]:!1}function Tf(){return K0}var Z0=St({},Xa,{key:function(t){if(t.key){var e=$0[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=Qo(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?Y0[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Tf,charCode:function(t){return t.type==="keypress"?Qo(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Qo(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),Q0=Mn(Z0),J0=St({},$l,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Hh=Mn(J0),ex=St({},Xa,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Tf}),tx=Mn(ex),nx=St({},Gs,{propertyName:0,elapsedTime:0,pseudoElement:0}),ix=Mn(nx),rx=St({},$l,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),sx=Mn(rx),ax=[9,13,27,32],Af=Si&&"CompositionEvent"in window,_a=null;Si&&"documentMode"in document&&(_a=document.documentMode);var ox=Si&&"TextEvent"in window&&!_a,Pg=Si&&(!Af||_a&&8<_a&&11>=_a),Gh=" ",Wh=!1;function bg(t,e){switch(t){case"keyup":return ax.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Lg(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var cs=!1;function lx(t,e){switch(t){case"compositionend":return Lg(e);case"keypress":return e.which!==32?null:(Wh=!0,Gh);case"textInput":return t=e.data,t===Gh&&Wh?null:t;default:return null}}function cx(t,e){if(cs)return t==="compositionend"||!Af&&bg(t,e)?(t=Rg(),Zo=Ef=Hi=null,cs=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return Pg&&e.locale!=="ko"?null:e.data;default:return null}}var ux={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function jh(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!ux[t.type]:e==="textarea"}function Ng(t,e,n,i){cg(i),e=yl(e,"onChange"),0<e.length&&(n=new wf("onChange","change",null,n,i),t.push({event:n,listeners:e}))}var xa=null,La=null;function dx(t){Gg(t,0)}function Yl(t){var e=fs(t);if(ng(e))return t}function fx(t,e){if(t==="change")return e}var Dg=!1;if(Si){var wc;if(Si){var Tc="oninput"in document;if(!Tc){var Xh=document.createElement("div");Xh.setAttribute("oninput","return;"),Tc=typeof Xh.oninput=="function"}wc=Tc}else wc=!1;Dg=wc&&(!document.documentMode||9<document.documentMode)}function $h(){xa&&(xa.detachEvent("onpropertychange",Ig),La=xa=null)}function Ig(t){if(t.propertyName==="value"&&Yl(La)){var e=[];Ng(e,La,t,_f(t)),hg(dx,e)}}function hx(t,e,n){t==="focusin"?($h(),xa=e,La=n,xa.attachEvent("onpropertychange",Ig)):t==="focusout"&&$h()}function px(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Yl(La)}function mx(t,e){if(t==="click")return Yl(e)}function gx(t,e){if(t==="input"||t==="change")return Yl(e)}function vx(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var Yn=typeof Object.is=="function"?Object.is:vx;function Na(t,e){if(Yn(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),i=Object.keys(e);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var r=n[i];if(!Mu.call(e,r)||!Yn(t[r],e[r]))return!1}return!0}function Yh(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function qh(t,e){var n=Yh(t);t=0;for(var i;n;){if(n.nodeType===3){if(i=t+n.textContent.length,t<=e&&i>=e)return{node:n,offset:e-t};t=i}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Yh(n)}}function Ug(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?Ug(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function Fg(){for(var t=window,e=hl();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=hl(t.document)}return e}function Cf(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function _x(t){var e=Fg(),n=t.focusedElem,i=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&Ug(n.ownerDocument.documentElement,n)){if(i!==null&&Cf(n)){if(e=i.start,t=i.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var r=n.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!t.extend&&s>i&&(r=i,i=s,s=r),r=qh(n,s);var a=qh(n,i);r&&a&&(t.rangeCount!==1||t.anchorNode!==r.node||t.anchorOffset!==r.offset||t.focusNode!==a.node||t.focusOffset!==a.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),t.removeAllRanges(),s>i?(t.addRange(e),t.extend(a.node,a.offset)):(e.setEnd(a.node,a.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var xx=Si&&"documentMode"in document&&11>=document.documentMode,us=null,Vu=null,ya=null,Hu=!1;function Kh(t,e,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Hu||us==null||us!==hl(i)||(i=us,"selectionStart"in i&&Cf(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),ya&&Na(ya,i)||(ya=i,i=yl(Vu,"onSelect"),0<i.length&&(e=new wf("onSelect","select",null,e,n),t.push({event:e,listeners:i}),e.target=us)))}function uo(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var ds={animationend:uo("Animation","AnimationEnd"),animationiteration:uo("Animation","AnimationIteration"),animationstart:uo("Animation","AnimationStart"),transitionend:uo("Transition","TransitionEnd")},Ac={},kg={};Si&&(kg=document.createElement("div").style,"AnimationEvent"in window||(delete ds.animationend.animation,delete ds.animationiteration.animation,delete ds.animationstart.animation),"TransitionEvent"in window||delete ds.transitionend.transition);function ql(t){if(Ac[t])return Ac[t];if(!ds[t])return t;var e=ds[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in kg)return Ac[t]=e[n];return t}var Og=ql("animationend"),Bg=ql("animationiteration"),zg=ql("animationstart"),Vg=ql("transitionend"),Hg=new Map,Zh="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function rr(t,e){Hg.set(t,e),Fr(e,[t])}for(var Cc=0;Cc<Zh.length;Cc++){var Rc=Zh[Cc],yx=Rc.toLowerCase(),Sx=Rc[0].toUpperCase()+Rc.slice(1);rr(yx,"on"+Sx)}rr(Og,"onAnimationEnd");rr(Bg,"onAnimationIteration");rr(zg,"onAnimationStart");rr("dblclick","onDoubleClick");rr("focusin","onFocus");rr("focusout","onBlur");rr(Vg,"onTransitionEnd");Ps("onMouseEnter",["mouseout","mouseover"]);Ps("onMouseLeave",["mouseout","mouseover"]);Ps("onPointerEnter",["pointerout","pointerover"]);Ps("onPointerLeave",["pointerout","pointerover"]);Fr("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Fr("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Fr("onBeforeInput",["compositionend","keypress","textInput","paste"]);Fr("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Fr("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Fr("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var pa="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Mx=new Set("cancel close invalid load scroll toggle".split(" ").concat(pa));function Qh(t,e,n){var i=t.type||"unknown-event";t.currentTarget=n,y0(i,e,void 0,t),t.currentTarget=null}function Gg(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var i=t[n],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var a=i.length-1;0<=a;a--){var o=i[a],l=o.instance,c=o.currentTarget;if(o=o.listener,l!==s&&r.isPropagationStopped())break e;Qh(r,o,c),s=l}else for(a=0;a<i.length;a++){if(o=i[a],l=o.instance,c=o.currentTarget,o=o.listener,l!==s&&r.isPropagationStopped())break e;Qh(r,o,c),s=l}}}if(ml)throw t=ku,ml=!1,ku=null,t}function ht(t,e){var n=e[$u];n===void 0&&(n=e[$u]=new Set);var i=t+"__bubble";n.has(i)||(Wg(e,t,2,!1),n.add(i))}function Pc(t,e,n){var i=0;e&&(i|=4),Wg(n,t,i,e)}var fo="_reactListening"+Math.random().toString(36).slice(2);function Da(t){if(!t[fo]){t[fo]=!0,Zm.forEach(function(n){n!=="selectionchange"&&(Mx.has(n)||Pc(n,!1,t),Pc(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[fo]||(e[fo]=!0,Pc("selectionchange",!1,e))}}function Wg(t,e,n,i){switch(Cg(e)){case 1:var r=F0;break;case 4:r=k0;break;default:r=Mf}n=r.bind(null,e,n,t),r=void 0,!Fu||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?t.addEventListener(e,n,{capture:!0,passive:r}):t.addEventListener(e,n,!0):r!==void 0?t.addEventListener(e,n,{passive:r}):t.addEventListener(e,n,!1)}function bc(t,e,n,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var a=i.tag;if(a===3||a===4){var o=i.stateNode.containerInfo;if(o===r||o.nodeType===8&&o.parentNode===r)break;if(a===4)for(a=i.return;a!==null;){var l=a.tag;if((l===3||l===4)&&(l=a.stateNode.containerInfo,l===r||l.nodeType===8&&l.parentNode===r))return;a=a.return}for(;o!==null;){if(a=Sr(o),a===null)return;if(l=a.tag,l===5||l===6){i=s=a;continue e}o=o.parentNode}}i=i.return}hg(function(){var c=s,d=_f(n),h=[];e:{var f=Hg.get(t);if(f!==void 0){var p=wf,_=t;switch(t){case"keypress":if(Qo(n)===0)break e;case"keydown":case"keyup":p=Q0;break;case"focusin":_="focus",p=Ec;break;case"focusout":_="blur",p=Ec;break;case"beforeblur":case"afterblur":p=Ec;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=zh;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=z0;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=tx;break;case Og:case Bg:case zg:p=G0;break;case Vg:p=ix;break;case"scroll":p=O0;break;case"wheel":p=sx;break;case"copy":case"cut":case"paste":p=j0;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=Hh}var y=(e&4)!==0,m=!y&&t==="scroll",u=y?f!==null?f+"Capture":null:f;y=[];for(var g=c,v;g!==null;){v=g;var E=v.stateNode;if(v.tag===5&&E!==null&&(v=E,u!==null&&(E=Ca(g,u),E!=null&&y.push(Ia(g,E,v)))),m)break;g=g.return}0<y.length&&(f=new p(f,_,null,n,d),h.push({event:f,listeners:y}))}}if(!(e&7)){e:{if(f=t==="mouseover"||t==="pointerover",p=t==="mouseout"||t==="pointerout",f&&n!==Iu&&(_=n.relatedTarget||n.fromElement)&&(Sr(_)||_[Mi]))break e;if((p||f)&&(f=d.window===d?d:(f=d.ownerDocument)?f.defaultView||f.parentWindow:window,p?(_=n.relatedTarget||n.toElement,p=c,_=_?Sr(_):null,_!==null&&(m=kr(_),_!==m||_.tag!==5&&_.tag!==6)&&(_=null)):(p=null,_=c),p!==_)){if(y=zh,E="onMouseLeave",u="onMouseEnter",g="mouse",(t==="pointerout"||t==="pointerover")&&(y=Hh,E="onPointerLeave",u="onPointerEnter",g="pointer"),m=p==null?f:fs(p),v=_==null?f:fs(_),f=new y(E,g+"leave",p,n,d),f.target=m,f.relatedTarget=v,E=null,Sr(d)===c&&(y=new y(u,g+"enter",_,n,d),y.target=v,y.relatedTarget=m,E=y),m=E,p&&_)t:{for(y=p,u=_,g=0,v=y;v;v=Vr(v))g++;for(v=0,E=u;E;E=Vr(E))v++;for(;0<g-v;)y=Vr(y),g--;for(;0<v-g;)u=Vr(u),v--;for(;g--;){if(y===u||u!==null&&y===u.alternate)break t;y=Vr(y),u=Vr(u)}y=null}else y=null;p!==null&&Jh(h,f,p,y,!1),_!==null&&m!==null&&Jh(h,m,_,y,!0)}}e:{if(f=c?fs(c):window,p=f.nodeName&&f.nodeName.toLowerCase(),p==="select"||p==="input"&&f.type==="file")var b=fx;else if(jh(f))if(Dg)b=gx;else{b=px;var S=hx}else(p=f.nodeName)&&p.toLowerCase()==="input"&&(f.type==="checkbox"||f.type==="radio")&&(b=mx);if(b&&(b=b(t,c))){Ng(h,b,n,d);break e}S&&S(t,f,c),t==="focusout"&&(S=f._wrapperState)&&S.controlled&&f.type==="number"&&Pu(f,"number",f.value)}switch(S=c?fs(c):window,t){case"focusin":(jh(S)||S.contentEditable==="true")&&(us=S,Vu=c,ya=null);break;case"focusout":ya=Vu=us=null;break;case"mousedown":Hu=!0;break;case"contextmenu":case"mouseup":case"dragend":Hu=!1,Kh(h,n,d);break;case"selectionchange":if(xx)break;case"keydown":case"keyup":Kh(h,n,d)}var C;if(Af)e:{switch(t){case"compositionstart":var P="onCompositionStart";break e;case"compositionend":P="onCompositionEnd";break e;case"compositionupdate":P="onCompositionUpdate";break e}P=void 0}else cs?bg(t,n)&&(P="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(P="onCompositionStart");P&&(Pg&&n.locale!=="ko"&&(cs||P!=="onCompositionStart"?P==="onCompositionEnd"&&cs&&(C=Rg()):(Hi=d,Ef="value"in Hi?Hi.value:Hi.textContent,cs=!0)),S=yl(c,P),0<S.length&&(P=new Vh(P,t,null,n,d),h.push({event:P,listeners:S}),C?P.data=C:(C=Lg(n),C!==null&&(P.data=C)))),(C=ox?lx(t,n):cx(t,n))&&(c=yl(c,"onBeforeInput"),0<c.length&&(d=new Vh("onBeforeInput","beforeinput",null,n,d),h.push({event:d,listeners:c}),d.data=C))}Gg(h,e)})}function Ia(t,e,n){return{instance:t,listener:e,currentTarget:n}}function yl(t,e){for(var n=e+"Capture",i=[];t!==null;){var r=t,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=Ca(t,n),s!=null&&i.unshift(Ia(t,s,r)),s=Ca(t,e),s!=null&&i.push(Ia(t,s,r))),t=t.return}return i}function Vr(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function Jh(t,e,n,i,r){for(var s=e._reactName,a=[];n!==null&&n!==i;){var o=n,l=o.alternate,c=o.stateNode;if(l!==null&&l===i)break;o.tag===5&&c!==null&&(o=c,r?(l=Ca(n,s),l!=null&&a.unshift(Ia(n,l,o))):r||(l=Ca(n,s),l!=null&&a.push(Ia(n,l,o)))),n=n.return}a.length!==0&&t.push({event:e,listeners:a})}var Ex=/\r\n?/g,wx=/\u0000|\uFFFD/g;function ep(t){return(typeof t=="string"?t:""+t).replace(Ex,`
`).replace(wx,"")}function ho(t,e,n){if(e=ep(e),ep(t)!==e&&n)throw Error(te(425))}function Sl(){}var Gu=null,Wu=null;function ju(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var Xu=typeof setTimeout=="function"?setTimeout:void 0,Tx=typeof clearTimeout=="function"?clearTimeout:void 0,tp=typeof Promise=="function"?Promise:void 0,Ax=typeof queueMicrotask=="function"?queueMicrotask:typeof tp<"u"?function(t){return tp.resolve(null).then(t).catch(Cx)}:Xu;function Cx(t){setTimeout(function(){throw t})}function Lc(t,e){var n=e,i=0;do{var r=n.nextSibling;if(t.removeChild(n),r&&r.nodeType===8)if(n=r.data,n==="/$"){if(i===0){t.removeChild(r),ba(e);return}i--}else n!=="$"&&n!=="$?"&&n!=="$!"||i++;n=r}while(n);ba(e)}function $i(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function np(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var Ws=Math.random().toString(36).slice(2),Jn="__reactFiber$"+Ws,Ua="__reactProps$"+Ws,Mi="__reactContainer$"+Ws,$u="__reactEvents$"+Ws,Rx="__reactListeners$"+Ws,Px="__reactHandles$"+Ws;function Sr(t){var e=t[Jn];if(e)return e;for(var n=t.parentNode;n;){if(e=n[Mi]||n[Jn]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=np(t);t!==null;){if(n=t[Jn])return n;t=np(t)}return e}t=n,n=t.parentNode}return null}function $a(t){return t=t[Jn]||t[Mi],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function fs(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(te(33))}function Kl(t){return t[Ua]||null}var Yu=[],hs=-1;function sr(t){return{current:t}}function mt(t){0>hs||(t.current=Yu[hs],Yu[hs]=null,hs--)}function ut(t,e){hs++,Yu[hs]=t.current,t.current=e}var nr={},Yt=sr(nr),ln=sr(!1),Pr=nr;function bs(t,e){var n=t.type.contextTypes;if(!n)return nr;var i=t.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in n)r[s]=e[s];return i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=r),r}function cn(t){return t=t.childContextTypes,t!=null}function Ml(){mt(ln),mt(Yt)}function ip(t,e,n){if(Yt.current!==nr)throw Error(te(168));ut(Yt,e),ut(ln,n)}function jg(t,e,n){var i=t.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return n;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(te(108,h0(t)||"Unknown",r));return St({},n,i)}function El(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||nr,Pr=Yt.current,ut(Yt,t),ut(ln,ln.current),!0}function rp(t,e,n){var i=t.stateNode;if(!i)throw Error(te(169));n?(t=jg(t,e,Pr),i.__reactInternalMemoizedMergedChildContext=t,mt(ln),mt(Yt),ut(Yt,t)):mt(ln),ut(ln,n)}var pi=null,Zl=!1,Nc=!1;function Xg(t){pi===null?pi=[t]:pi.push(t)}function bx(t){Zl=!0,Xg(t)}function ar(){if(!Nc&&pi!==null){Nc=!0;var t=0,e=st;try{var n=pi;for(st=1;t<n.length;t++){var i=n[t];do i=i(!0);while(i!==null)}pi=null,Zl=!1}catch(r){throw pi!==null&&(pi=pi.slice(t+1)),vg(xf,ar),r}finally{st=e,Nc=!1}}return null}var ps=[],ms=0,wl=null,Tl=0,Tn=[],An=0,br=null,gi=1,vi="";function mr(t,e){ps[ms++]=Tl,ps[ms++]=wl,wl=t,Tl=e}function $g(t,e,n){Tn[An++]=gi,Tn[An++]=vi,Tn[An++]=br,br=t;var i=gi;t=vi;var r=32-jn(i)-1;i&=~(1<<r),n+=1;var s=32-jn(e)+r;if(30<s){var a=r-r%5;s=(i&(1<<a)-1).toString(32),i>>=a,r-=a,gi=1<<32-jn(e)+r|n<<r|i,vi=s+t}else gi=1<<s|n<<r|i,vi=t}function Rf(t){t.return!==null&&(mr(t,1),$g(t,1,0))}function Pf(t){for(;t===wl;)wl=ps[--ms],ps[ms]=null,Tl=ps[--ms],ps[ms]=null;for(;t===br;)br=Tn[--An],Tn[An]=null,vi=Tn[--An],Tn[An]=null,gi=Tn[--An],Tn[An]=null}var xn=null,_n=null,gt=!1,Hn=null;function Yg(t,e){var n=bn(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function sp(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,xn=t,_n=$i(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,xn=t,_n=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=br!==null?{id:gi,overflow:vi}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=bn(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,xn=t,_n=null,!0):!1;default:return!1}}function qu(t){return(t.mode&1)!==0&&(t.flags&128)===0}function Ku(t){if(gt){var e=_n;if(e){var n=e;if(!sp(t,e)){if(qu(t))throw Error(te(418));e=$i(n.nextSibling);var i=xn;e&&sp(t,e)?Yg(i,n):(t.flags=t.flags&-4097|2,gt=!1,xn=t)}}else{if(qu(t))throw Error(te(418));t.flags=t.flags&-4097|2,gt=!1,xn=t}}}function ap(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;xn=t}function po(t){if(t!==xn)return!1;if(!gt)return ap(t),gt=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!ju(t.type,t.memoizedProps)),e&&(e=_n)){if(qu(t))throw qg(),Error(te(418));for(;e;)Yg(t,e),e=$i(e.nextSibling)}if(ap(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(te(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){_n=$i(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}_n=null}}else _n=xn?$i(t.stateNode.nextSibling):null;return!0}function qg(){for(var t=_n;t;)t=$i(t.nextSibling)}function Ls(){_n=xn=null,gt=!1}function bf(t){Hn===null?Hn=[t]:Hn.push(t)}var Lx=Ci.ReactCurrentBatchConfig;function Qs(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(te(309));var i=n.stateNode}if(!i)throw Error(te(147,t));var r=i,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(a){var o=r.refs;a===null?delete o[s]:o[s]=a},e._stringRef=s,e)}if(typeof t!="string")throw Error(te(284));if(!n._owner)throw Error(te(290,t))}return t}function mo(t,e){throw t=Object.prototype.toString.call(e),Error(te(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function op(t){var e=t._init;return e(t._payload)}function Kg(t){function e(u,g){if(t){var v=u.deletions;v===null?(u.deletions=[g],u.flags|=16):v.push(g)}}function n(u,g){if(!t)return null;for(;g!==null;)e(u,g),g=g.sibling;return null}function i(u,g){for(u=new Map;g!==null;)g.key!==null?u.set(g.key,g):u.set(g.index,g),g=g.sibling;return u}function r(u,g){return u=Zi(u,g),u.index=0,u.sibling=null,u}function s(u,g,v){return u.index=v,t?(v=u.alternate,v!==null?(v=v.index,v<g?(u.flags|=2,g):v):(u.flags|=2,g)):(u.flags|=1048576,g)}function a(u){return t&&u.alternate===null&&(u.flags|=2),u}function o(u,g,v,E){return g===null||g.tag!==6?(g=Bc(v,u.mode,E),g.return=u,g):(g=r(g,v),g.return=u,g)}function l(u,g,v,E){var b=v.type;return b===ls?d(u,g,v.props.children,E,v.key):g!==null&&(g.elementType===b||typeof b=="object"&&b!==null&&b.$$typeof===ki&&op(b)===g.type)?(E=r(g,v.props),E.ref=Qs(u,g,v),E.return=u,E):(E=sl(v.type,v.key,v.props,null,u.mode,E),E.ref=Qs(u,g,v),E.return=u,E)}function c(u,g,v,E){return g===null||g.tag!==4||g.stateNode.containerInfo!==v.containerInfo||g.stateNode.implementation!==v.implementation?(g=zc(v,u.mode,E),g.return=u,g):(g=r(g,v.children||[]),g.return=u,g)}function d(u,g,v,E,b){return g===null||g.tag!==7?(g=Rr(v,u.mode,E,b),g.return=u,g):(g=r(g,v),g.return=u,g)}function h(u,g,v){if(typeof g=="string"&&g!==""||typeof g=="number")return g=Bc(""+g,u.mode,v),g.return=u,g;if(typeof g=="object"&&g!==null){switch(g.$$typeof){case io:return v=sl(g.type,g.key,g.props,null,u.mode,v),v.ref=Qs(u,null,g),v.return=u,v;case os:return g=zc(g,u.mode,v),g.return=u,g;case ki:var E=g._init;return h(u,E(g._payload),v)}if(fa(g)||$s(g))return g=Rr(g,u.mode,v,null),g.return=u,g;mo(u,g)}return null}function f(u,g,v,E){var b=g!==null?g.key:null;if(typeof v=="string"&&v!==""||typeof v=="number")return b!==null?null:o(u,g,""+v,E);if(typeof v=="object"&&v!==null){switch(v.$$typeof){case io:return v.key===b?l(u,g,v,E):null;case os:return v.key===b?c(u,g,v,E):null;case ki:return b=v._init,f(u,g,b(v._payload),E)}if(fa(v)||$s(v))return b!==null?null:d(u,g,v,E,null);mo(u,v)}return null}function p(u,g,v,E,b){if(typeof E=="string"&&E!==""||typeof E=="number")return u=u.get(v)||null,o(g,u,""+E,b);if(typeof E=="object"&&E!==null){switch(E.$$typeof){case io:return u=u.get(E.key===null?v:E.key)||null,l(g,u,E,b);case os:return u=u.get(E.key===null?v:E.key)||null,c(g,u,E,b);case ki:var S=E._init;return p(u,g,v,S(E._payload),b)}if(fa(E)||$s(E))return u=u.get(v)||null,d(g,u,E,b,null);mo(g,E)}return null}function _(u,g,v,E){for(var b=null,S=null,C=g,P=g=0,X=null;C!==null&&P<v.length;P++){C.index>P?(X=C,C=null):X=C.sibling;var x=f(u,C,v[P],E);if(x===null){C===null&&(C=X);break}t&&C&&x.alternate===null&&e(u,C),g=s(x,g,P),S===null?b=x:S.sibling=x,S=x,C=X}if(P===v.length)return n(u,C),gt&&mr(u,P),b;if(C===null){for(;P<v.length;P++)C=h(u,v[P],E),C!==null&&(g=s(C,g,P),S===null?b=C:S.sibling=C,S=C);return gt&&mr(u,P),b}for(C=i(u,C);P<v.length;P++)X=p(C,u,P,v[P],E),X!==null&&(t&&X.alternate!==null&&C.delete(X.key===null?P:X.key),g=s(X,g,P),S===null?b=X:S.sibling=X,S=X);return t&&C.forEach(function(A){return e(u,A)}),gt&&mr(u,P),b}function y(u,g,v,E){var b=$s(v);if(typeof b!="function")throw Error(te(150));if(v=b.call(v),v==null)throw Error(te(151));for(var S=b=null,C=g,P=g=0,X=null,x=v.next();C!==null&&!x.done;P++,x=v.next()){C.index>P?(X=C,C=null):X=C.sibling;var A=f(u,C,x.value,E);if(A===null){C===null&&(C=X);break}t&&C&&A.alternate===null&&e(u,C),g=s(A,g,P),S===null?b=A:S.sibling=A,S=A,C=X}if(x.done)return n(u,C),gt&&mr(u,P),b;if(C===null){for(;!x.done;P++,x=v.next())x=h(u,x.value,E),x!==null&&(g=s(x,g,P),S===null?b=x:S.sibling=x,S=x);return gt&&mr(u,P),b}for(C=i(u,C);!x.done;P++,x=v.next())x=p(C,u,P,x.value,E),x!==null&&(t&&x.alternate!==null&&C.delete(x.key===null?P:x.key),g=s(x,g,P),S===null?b=x:S.sibling=x,S=x);return t&&C.forEach(function(G){return e(u,G)}),gt&&mr(u,P),b}function m(u,g,v,E){if(typeof v=="object"&&v!==null&&v.type===ls&&v.key===null&&(v=v.props.children),typeof v=="object"&&v!==null){switch(v.$$typeof){case io:e:{for(var b=v.key,S=g;S!==null;){if(S.key===b){if(b=v.type,b===ls){if(S.tag===7){n(u,S.sibling),g=r(S,v.props.children),g.return=u,u=g;break e}}else if(S.elementType===b||typeof b=="object"&&b!==null&&b.$$typeof===ki&&op(b)===S.type){n(u,S.sibling),g=r(S,v.props),g.ref=Qs(u,S,v),g.return=u,u=g;break e}n(u,S);break}else e(u,S);S=S.sibling}v.type===ls?(g=Rr(v.props.children,u.mode,E,v.key),g.return=u,u=g):(E=sl(v.type,v.key,v.props,null,u.mode,E),E.ref=Qs(u,g,v),E.return=u,u=E)}return a(u);case os:e:{for(S=v.key;g!==null;){if(g.key===S)if(g.tag===4&&g.stateNode.containerInfo===v.containerInfo&&g.stateNode.implementation===v.implementation){n(u,g.sibling),g=r(g,v.children||[]),g.return=u,u=g;break e}else{n(u,g);break}else e(u,g);g=g.sibling}g=zc(v,u.mode,E),g.return=u,u=g}return a(u);case ki:return S=v._init,m(u,g,S(v._payload),E)}if(fa(v))return _(u,g,v,E);if($s(v))return y(u,g,v,E);mo(u,v)}return typeof v=="string"&&v!==""||typeof v=="number"?(v=""+v,g!==null&&g.tag===6?(n(u,g.sibling),g=r(g,v),g.return=u,u=g):(n(u,g),g=Bc(v,u.mode,E),g.return=u,u=g),a(u)):n(u,g)}return m}var Ns=Kg(!0),Zg=Kg(!1),Al=sr(null),Cl=null,gs=null,Lf=null;function Nf(){Lf=gs=Cl=null}function Df(t){var e=Al.current;mt(Al),t._currentValue=e}function Zu(t,e,n){for(;t!==null;){var i=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),t===n)break;t=t.return}}function ws(t,e){Cl=t,Lf=gs=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(on=!0),t.firstContext=null)}function Dn(t){var e=t._currentValue;if(Lf!==t)if(t={context:t,memoizedValue:e,next:null},gs===null){if(Cl===null)throw Error(te(308));gs=t,Cl.dependencies={lanes:0,firstContext:t}}else gs=gs.next=t;return e}var Mr=null;function If(t){Mr===null?Mr=[t]:Mr.push(t)}function Qg(t,e,n,i){var r=e.interleaved;return r===null?(n.next=n,If(e)):(n.next=r.next,r.next=n),e.interleaved=n,Ei(t,i)}function Ei(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var Oi=!1;function Uf(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Jg(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function yi(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function Yi(t,e,n){var i=t.updateQueue;if(i===null)return null;if(i=i.shared,Ye&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,Ei(t,n)}return r=i.interleaved,r===null?(e.next=e,If(i)):(e.next=r.next,r.next=e),i.interleaved=e,Ei(t,n)}function Jo(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,yf(t,n)}}function lp(t,e){var n=t.updateQueue,i=t.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var r=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var a={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?r=s=a:s=s.next=a,n=n.next}while(n!==null);s===null?r=s=e:s=s.next=e}else r=s=e;n={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function Rl(t,e,n,i){var r=t.updateQueue;Oi=!1;var s=r.firstBaseUpdate,a=r.lastBaseUpdate,o=r.shared.pending;if(o!==null){r.shared.pending=null;var l=o,c=l.next;l.next=null,a===null?s=c:a.next=c,a=l;var d=t.alternate;d!==null&&(d=d.updateQueue,o=d.lastBaseUpdate,o!==a&&(o===null?d.firstBaseUpdate=c:o.next=c,d.lastBaseUpdate=l))}if(s!==null){var h=r.baseState;a=0,d=c=l=null,o=s;do{var f=o.lane,p=o.eventTime;if((i&f)===f){d!==null&&(d=d.next={eventTime:p,lane:0,tag:o.tag,payload:o.payload,callback:o.callback,next:null});e:{var _=t,y=o;switch(f=e,p=n,y.tag){case 1:if(_=y.payload,typeof _=="function"){h=_.call(p,h,f);break e}h=_;break e;case 3:_.flags=_.flags&-65537|128;case 0:if(_=y.payload,f=typeof _=="function"?_.call(p,h,f):_,f==null)break e;h=St({},h,f);break e;case 2:Oi=!0}}o.callback!==null&&o.lane!==0&&(t.flags|=64,f=r.effects,f===null?r.effects=[o]:f.push(o))}else p={eventTime:p,lane:f,tag:o.tag,payload:o.payload,callback:o.callback,next:null},d===null?(c=d=p,l=h):d=d.next=p,a|=f;if(o=o.next,o===null){if(o=r.shared.pending,o===null)break;f=o,o=f.next,f.next=null,r.lastBaseUpdate=f,r.shared.pending=null}}while(!0);if(d===null&&(l=h),r.baseState=l,r.firstBaseUpdate=c,r.lastBaseUpdate=d,e=r.shared.interleaved,e!==null){r=e;do a|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);Nr|=a,t.lanes=a,t.memoizedState=h}}function cp(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var i=t[e],r=i.callback;if(r!==null){if(i.callback=null,i=n,typeof r!="function")throw Error(te(191,r));r.call(i)}}}var Ya={},ri=sr(Ya),Fa=sr(Ya),ka=sr(Ya);function Er(t){if(t===Ya)throw Error(te(174));return t}function Ff(t,e){switch(ut(ka,e),ut(Fa,t),ut(ri,Ya),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:Lu(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=Lu(e,t)}mt(ri),ut(ri,e)}function Ds(){mt(ri),mt(Fa),mt(ka)}function ev(t){Er(ka.current);var e=Er(ri.current),n=Lu(e,t.type);e!==n&&(ut(Fa,t),ut(ri,n))}function kf(t){Fa.current===t&&(mt(ri),mt(Fa))}var vt=sr(0);function Pl(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var Dc=[];function Of(){for(var t=0;t<Dc.length;t++)Dc[t]._workInProgressVersionPrimary=null;Dc.length=0}var el=Ci.ReactCurrentDispatcher,Ic=Ci.ReactCurrentBatchConfig,Lr=0,xt=null,bt=null,Ut=null,bl=!1,Sa=!1,Oa=0,Nx=0;function Ht(){throw Error(te(321))}function Bf(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!Yn(t[n],e[n]))return!1;return!0}function zf(t,e,n,i,r,s){if(Lr=s,xt=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,el.current=t===null||t.memoizedState===null?Fx:kx,t=n(i,r),Sa){s=0;do{if(Sa=!1,Oa=0,25<=s)throw Error(te(301));s+=1,Ut=bt=null,e.updateQueue=null,el.current=Ox,t=n(i,r)}while(Sa)}if(el.current=Ll,e=bt!==null&&bt.next!==null,Lr=0,Ut=bt=xt=null,bl=!1,e)throw Error(te(300));return t}function Vf(){var t=Oa!==0;return Oa=0,t}function Kn(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Ut===null?xt.memoizedState=Ut=t:Ut=Ut.next=t,Ut}function In(){if(bt===null){var t=xt.alternate;t=t!==null?t.memoizedState:null}else t=bt.next;var e=Ut===null?xt.memoizedState:Ut.next;if(e!==null)Ut=e,bt=t;else{if(t===null)throw Error(te(310));bt=t,t={memoizedState:bt.memoizedState,baseState:bt.baseState,baseQueue:bt.baseQueue,queue:bt.queue,next:null},Ut===null?xt.memoizedState=Ut=t:Ut=Ut.next=t}return Ut}function Ba(t,e){return typeof e=="function"?e(t):e}function Uc(t){var e=In(),n=e.queue;if(n===null)throw Error(te(311));n.lastRenderedReducer=t;var i=bt,r=i.baseQueue,s=n.pending;if(s!==null){if(r!==null){var a=r.next;r.next=s.next,s.next=a}i.baseQueue=r=s,n.pending=null}if(r!==null){s=r.next,i=i.baseState;var o=a=null,l=null,c=s;do{var d=c.lane;if((Lr&d)===d)l!==null&&(l=l.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),i=c.hasEagerState?c.eagerState:t(i,c.action);else{var h={lane:d,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};l===null?(o=l=h,a=i):l=l.next=h,xt.lanes|=d,Nr|=d}c=c.next}while(c!==null&&c!==s);l===null?a=i:l.next=o,Yn(i,e.memoizedState)||(on=!0),e.memoizedState=i,e.baseState=a,e.baseQueue=l,n.lastRenderedState=i}if(t=n.interleaved,t!==null){r=t;do s=r.lane,xt.lanes|=s,Nr|=s,r=r.next;while(r!==t)}else r===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function Fc(t){var e=In(),n=e.queue;if(n===null)throw Error(te(311));n.lastRenderedReducer=t;var i=n.dispatch,r=n.pending,s=e.memoizedState;if(r!==null){n.pending=null;var a=r=r.next;do s=t(s,a.action),a=a.next;while(a!==r);Yn(s,e.memoizedState)||(on=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,i]}function tv(){}function nv(t,e){var n=xt,i=In(),r=e(),s=!Yn(i.memoizedState,r);if(s&&(i.memoizedState=r,on=!0),i=i.queue,Hf(sv.bind(null,n,i,t),[t]),i.getSnapshot!==e||s||Ut!==null&&Ut.memoizedState.tag&1){if(n.flags|=2048,za(9,rv.bind(null,n,i,r,e),void 0,null),kt===null)throw Error(te(349));Lr&30||iv(n,e,r)}return r}function iv(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=xt.updateQueue,e===null?(e={lastEffect:null,stores:null},xt.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function rv(t,e,n,i){e.value=n,e.getSnapshot=i,av(e)&&ov(t)}function sv(t,e,n){return n(function(){av(e)&&ov(t)})}function av(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!Yn(t,n)}catch{return!0}}function ov(t){var e=Ei(t,1);e!==null&&Xn(e,t,1,-1)}function up(t){var e=Kn();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ba,lastRenderedState:t},e.queue=t,t=t.dispatch=Ux.bind(null,xt,t),[e.memoizedState,t]}function za(t,e,n,i){return t={tag:t,create:e,destroy:n,deps:i,next:null},e=xt.updateQueue,e===null?(e={lastEffect:null,stores:null},xt.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(i=n.next,n.next=t,t.next=i,e.lastEffect=t)),t}function lv(){return In().memoizedState}function tl(t,e,n,i){var r=Kn();xt.flags|=t,r.memoizedState=za(1|e,n,void 0,i===void 0?null:i)}function Ql(t,e,n,i){var r=In();i=i===void 0?null:i;var s=void 0;if(bt!==null){var a=bt.memoizedState;if(s=a.destroy,i!==null&&Bf(i,a.deps)){r.memoizedState=za(e,n,s,i);return}}xt.flags|=t,r.memoizedState=za(1|e,n,s,i)}function dp(t,e){return tl(8390656,8,t,e)}function Hf(t,e){return Ql(2048,8,t,e)}function cv(t,e){return Ql(4,2,t,e)}function uv(t,e){return Ql(4,4,t,e)}function dv(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function fv(t,e,n){return n=n!=null?n.concat([t]):null,Ql(4,4,dv.bind(null,e,t),n)}function Gf(){}function hv(t,e){var n=In();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Bf(e,i[1])?i[0]:(n.memoizedState=[t,e],t)}function pv(t,e){var n=In();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Bf(e,i[1])?i[0]:(t=t(),n.memoizedState=[t,e],t)}function mv(t,e,n){return Lr&21?(Yn(n,e)||(n=yg(),xt.lanes|=n,Nr|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,on=!0),t.memoizedState=n)}function Dx(t,e){var n=st;st=n!==0&&4>n?n:4,t(!0);var i=Ic.transition;Ic.transition={};try{t(!1),e()}finally{st=n,Ic.transition=i}}function gv(){return In().memoizedState}function Ix(t,e,n){var i=Ki(t);if(n={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null},vv(t))_v(e,n);else if(n=Qg(t,e,n,i),n!==null){var r=Qt();Xn(n,t,i,r),xv(n,e,i)}}function Ux(t,e,n){var i=Ki(t),r={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null};if(vv(t))_v(e,r);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var a=e.lastRenderedState,o=s(a,n);if(r.hasEagerState=!0,r.eagerState=o,Yn(o,a)){var l=e.interleaved;l===null?(r.next=r,If(e)):(r.next=l.next,l.next=r),e.interleaved=r;return}}catch{}finally{}n=Qg(t,e,r,i),n!==null&&(r=Qt(),Xn(n,t,i,r),xv(n,e,i))}}function vv(t){var e=t.alternate;return t===xt||e!==null&&e===xt}function _v(t,e){Sa=bl=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function xv(t,e,n){if(n&4194240){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,yf(t,n)}}var Ll={readContext:Dn,useCallback:Ht,useContext:Ht,useEffect:Ht,useImperativeHandle:Ht,useInsertionEffect:Ht,useLayoutEffect:Ht,useMemo:Ht,useReducer:Ht,useRef:Ht,useState:Ht,useDebugValue:Ht,useDeferredValue:Ht,useTransition:Ht,useMutableSource:Ht,useSyncExternalStore:Ht,useId:Ht,unstable_isNewReconciler:!1},Fx={readContext:Dn,useCallback:function(t,e){return Kn().memoizedState=[t,e===void 0?null:e],t},useContext:Dn,useEffect:dp,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,tl(4194308,4,dv.bind(null,e,t),n)},useLayoutEffect:function(t,e){return tl(4194308,4,t,e)},useInsertionEffect:function(t,e){return tl(4,2,t,e)},useMemo:function(t,e){var n=Kn();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var i=Kn();return e=n!==void 0?n(e):e,i.memoizedState=i.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},i.queue=t,t=t.dispatch=Ix.bind(null,xt,t),[i.memoizedState,t]},useRef:function(t){var e=Kn();return t={current:t},e.memoizedState=t},useState:up,useDebugValue:Gf,useDeferredValue:function(t){return Kn().memoizedState=t},useTransition:function(){var t=up(!1),e=t[0];return t=Dx.bind(null,t[1]),Kn().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var i=xt,r=Kn();if(gt){if(n===void 0)throw Error(te(407));n=n()}else{if(n=e(),kt===null)throw Error(te(349));Lr&30||iv(i,e,n)}r.memoizedState=n;var s={value:n,getSnapshot:e};return r.queue=s,dp(sv.bind(null,i,s,t),[t]),i.flags|=2048,za(9,rv.bind(null,i,s,n,e),void 0,null),n},useId:function(){var t=Kn(),e=kt.identifierPrefix;if(gt){var n=vi,i=gi;n=(i&~(1<<32-jn(i)-1)).toString(32)+n,e=":"+e+"R"+n,n=Oa++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=Nx++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},kx={readContext:Dn,useCallback:hv,useContext:Dn,useEffect:Hf,useImperativeHandle:fv,useInsertionEffect:cv,useLayoutEffect:uv,useMemo:pv,useReducer:Uc,useRef:lv,useState:function(){return Uc(Ba)},useDebugValue:Gf,useDeferredValue:function(t){var e=In();return mv(e,bt.memoizedState,t)},useTransition:function(){var t=Uc(Ba)[0],e=In().memoizedState;return[t,e]},useMutableSource:tv,useSyncExternalStore:nv,useId:gv,unstable_isNewReconciler:!1},Ox={readContext:Dn,useCallback:hv,useContext:Dn,useEffect:Hf,useImperativeHandle:fv,useInsertionEffect:cv,useLayoutEffect:uv,useMemo:pv,useReducer:Fc,useRef:lv,useState:function(){return Fc(Ba)},useDebugValue:Gf,useDeferredValue:function(t){var e=In();return bt===null?e.memoizedState=t:mv(e,bt.memoizedState,t)},useTransition:function(){var t=Fc(Ba)[0],e=In().memoizedState;return[t,e]},useMutableSource:tv,useSyncExternalStore:nv,useId:gv,unstable_isNewReconciler:!1};function zn(t,e){if(t&&t.defaultProps){e=St({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function Qu(t,e,n,i){e=t.memoizedState,n=n(i,e),n=n==null?e:St({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var Jl={isMounted:function(t){return(t=t._reactInternals)?kr(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var i=Qt(),r=Ki(t),s=yi(i,r);s.payload=e,n!=null&&(s.callback=n),e=Yi(t,s,r),e!==null&&(Xn(e,t,r,i),Jo(e,t,r))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var i=Qt(),r=Ki(t),s=yi(i,r);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=Yi(t,s,r),e!==null&&(Xn(e,t,r,i),Jo(e,t,r))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=Qt(),i=Ki(t),r=yi(n,i);r.tag=2,e!=null&&(r.callback=e),e=Yi(t,r,i),e!==null&&(Xn(e,t,i,n),Jo(e,t,i))}};function fp(t,e,n,i,r,s,a){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(i,s,a):e.prototype&&e.prototype.isPureReactComponent?!Na(n,i)||!Na(r,s):!0}function yv(t,e,n){var i=!1,r=nr,s=e.contextType;return typeof s=="object"&&s!==null?s=Dn(s):(r=cn(e)?Pr:Yt.current,i=e.contextTypes,s=(i=i!=null)?bs(t,r):nr),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=Jl,t.stateNode=e,e._reactInternals=t,i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=r,t.__reactInternalMemoizedMaskedChildContext=s),e}function hp(t,e,n,i){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,i),e.state!==t&&Jl.enqueueReplaceState(e,e.state,null)}function Ju(t,e,n,i){var r=t.stateNode;r.props=n,r.state=t.memoizedState,r.refs={},Uf(t);var s=e.contextType;typeof s=="object"&&s!==null?r.context=Dn(s):(s=cn(e)?Pr:Yt.current,r.context=bs(t,s)),r.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(Qu(t,e,s,n),r.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&Jl.enqueueReplaceState(r,r.state,null),Rl(t,n,r,i),r.state=t.memoizedState),typeof r.componentDidMount=="function"&&(t.flags|=4194308)}function Is(t,e){try{var n="",i=e;do n+=f0(i),i=i.return;while(i);var r=n}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:r,digest:null}}function kc(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function ed(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var Bx=typeof WeakMap=="function"?WeakMap:Map;function Sv(t,e,n){n=yi(-1,n),n.tag=3,n.payload={element:null};var i=e.value;return n.callback=function(){Dl||(Dl=!0,ud=i),ed(t,e)},n}function Mv(t,e,n){n=yi(-1,n),n.tag=3;var i=t.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;n.payload=function(){return i(r)},n.callback=function(){ed(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){ed(t,e),typeof i!="function"&&(qi===null?qi=new Set([this]):qi.add(this));var a=e.stack;this.componentDidCatch(e.value,{componentStack:a!==null?a:""})}),n}function pp(t,e,n){var i=t.pingCache;if(i===null){i=t.pingCache=new Bx;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(n)||(r.add(n),t=Jx.bind(null,t,e,n),e.then(t,t))}function mp(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function gp(t,e,n,i,r){return t.mode&1?(t.flags|=65536,t.lanes=r,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=yi(-1,1),e.tag=2,Yi(n,e,1))),n.lanes|=1),t)}var zx=Ci.ReactCurrentOwner,on=!1;function Zt(t,e,n,i){e.child=t===null?Zg(e,null,n,i):Ns(e,t.child,n,i)}function vp(t,e,n,i,r){n=n.render;var s=e.ref;return ws(e,r),i=zf(t,e,n,i,s,r),n=Vf(),t!==null&&!on?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,wi(t,e,r)):(gt&&n&&Rf(e),e.flags|=1,Zt(t,e,i,r),e.child)}function _p(t,e,n,i,r){if(t===null){var s=n.type;return typeof s=="function"&&!Zf(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,Ev(t,e,s,i,r)):(t=sl(n.type,null,i,e,e.mode,r),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&r)){var a=s.memoizedProps;if(n=n.compare,n=n!==null?n:Na,n(a,i)&&t.ref===e.ref)return wi(t,e,r)}return e.flags|=1,t=Zi(s,i),t.ref=e.ref,t.return=e,e.child=t}function Ev(t,e,n,i,r){if(t!==null){var s=t.memoizedProps;if(Na(s,i)&&t.ref===e.ref)if(on=!1,e.pendingProps=i=s,(t.lanes&r)!==0)t.flags&131072&&(on=!0);else return e.lanes=t.lanes,wi(t,e,r)}return td(t,e,n,i,r)}function wv(t,e,n){var i=e.pendingProps,r=i.children,s=t!==null?t.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},ut(_s,vn),vn|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,ut(_s,vn),vn|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:n,ut(_s,vn),vn|=i}else s!==null?(i=s.baseLanes|n,e.memoizedState=null):i=n,ut(_s,vn),vn|=i;return Zt(t,e,r,n),e.child}function Tv(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function td(t,e,n,i,r){var s=cn(n)?Pr:Yt.current;return s=bs(e,s),ws(e,r),n=zf(t,e,n,i,s,r),i=Vf(),t!==null&&!on?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,wi(t,e,r)):(gt&&i&&Rf(e),e.flags|=1,Zt(t,e,n,r),e.child)}function xp(t,e,n,i,r){if(cn(n)){var s=!0;El(e)}else s=!1;if(ws(e,r),e.stateNode===null)nl(t,e),yv(e,n,i),Ju(e,n,i,r),i=!0;else if(t===null){var a=e.stateNode,o=e.memoizedProps;a.props=o;var l=a.context,c=n.contextType;typeof c=="object"&&c!==null?c=Dn(c):(c=cn(n)?Pr:Yt.current,c=bs(e,c));var d=n.getDerivedStateFromProps,h=typeof d=="function"||typeof a.getSnapshotBeforeUpdate=="function";h||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==i||l!==c)&&hp(e,a,i,c),Oi=!1;var f=e.memoizedState;a.state=f,Rl(e,i,a,r),l=e.memoizedState,o!==i||f!==l||ln.current||Oi?(typeof d=="function"&&(Qu(e,n,d,i),l=e.memoizedState),(o=Oi||fp(e,n,o,i,f,l,c))?(h||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount=="function"&&(e.flags|=4194308)):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=l),a.props=i,a.state=l,a.context=c,i=o):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{a=e.stateNode,Jg(t,e),o=e.memoizedProps,c=e.type===e.elementType?o:zn(e.type,o),a.props=c,h=e.pendingProps,f=a.context,l=n.contextType,typeof l=="object"&&l!==null?l=Dn(l):(l=cn(n)?Pr:Yt.current,l=bs(e,l));var p=n.getDerivedStateFromProps;(d=typeof p=="function"||typeof a.getSnapshotBeforeUpdate=="function")||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==h||f!==l)&&hp(e,a,i,l),Oi=!1,f=e.memoizedState,a.state=f,Rl(e,i,a,r);var _=e.memoizedState;o!==h||f!==_||ln.current||Oi?(typeof p=="function"&&(Qu(e,n,p,i),_=e.memoizedState),(c=Oi||fp(e,n,c,i,f,_,l)||!1)?(d||typeof a.UNSAFE_componentWillUpdate!="function"&&typeof a.componentWillUpdate!="function"||(typeof a.componentWillUpdate=="function"&&a.componentWillUpdate(i,_,l),typeof a.UNSAFE_componentWillUpdate=="function"&&a.UNSAFE_componentWillUpdate(i,_,l)),typeof a.componentDidUpdate=="function"&&(e.flags|=4),typeof a.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof a.componentDidUpdate!="function"||o===t.memoizedProps&&f===t.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===t.memoizedProps&&f===t.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=_),a.props=i,a.state=_,a.context=l,i=c):(typeof a.componentDidUpdate!="function"||o===t.memoizedProps&&f===t.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===t.memoizedProps&&f===t.memoizedState||(e.flags|=1024),i=!1)}return nd(t,e,n,i,s,r)}function nd(t,e,n,i,r,s){Tv(t,e);var a=(e.flags&128)!==0;if(!i&&!a)return r&&rp(e,n,!1),wi(t,e,s);i=e.stateNode,zx.current=e;var o=a&&typeof n.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,t!==null&&a?(e.child=Ns(e,t.child,null,s),e.child=Ns(e,null,o,s)):Zt(t,e,o,s),e.memoizedState=i.state,r&&rp(e,n,!0),e.child}function Av(t){var e=t.stateNode;e.pendingContext?ip(t,e.pendingContext,e.pendingContext!==e.context):e.context&&ip(t,e.context,!1),Ff(t,e.containerInfo)}function yp(t,e,n,i,r){return Ls(),bf(r),e.flags|=256,Zt(t,e,n,i),e.child}var id={dehydrated:null,treeContext:null,retryLane:0};function rd(t){return{baseLanes:t,cachePool:null,transitions:null}}function Cv(t,e,n){var i=e.pendingProps,r=vt.current,s=!1,a=(e.flags&128)!==0,o;if((o=a)||(o=t!==null&&t.memoizedState===null?!1:(r&2)!==0),o?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(r|=1),ut(vt,r&1),t===null)return Ku(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(a=i.children,t=i.fallback,s?(i=e.mode,s=e.child,a={mode:"hidden",children:a},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=a):s=nc(a,i,0,null),t=Rr(t,i,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=rd(n),e.memoizedState=id,t):Wf(e,a));if(r=t.memoizedState,r!==null&&(o=r.dehydrated,o!==null))return Vx(t,e,a,i,o,r,n);if(s){s=i.fallback,a=e.mode,r=t.child,o=r.sibling;var l={mode:"hidden",children:i.children};return!(a&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=l,e.deletions=null):(i=Zi(r,l),i.subtreeFlags=r.subtreeFlags&14680064),o!==null?s=Zi(o,s):(s=Rr(s,a,n,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,a=t.child.memoizedState,a=a===null?rd(n):{baseLanes:a.baseLanes|n,cachePool:null,transitions:a.transitions},s.memoizedState=a,s.childLanes=t.childLanes&~n,e.memoizedState=id,i}return s=t.child,t=s.sibling,i=Zi(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=n),i.return=e,i.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=i,e.memoizedState=null,i}function Wf(t,e){return e=nc({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function go(t,e,n,i){return i!==null&&bf(i),Ns(e,t.child,null,n),t=Wf(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function Vx(t,e,n,i,r,s,a){if(n)return e.flags&256?(e.flags&=-257,i=kc(Error(te(422))),go(t,e,a,i)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=nc({mode:"visible",children:i.children},r,0,null),s=Rr(s,r,a,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&Ns(e,t.child,null,a),e.child.memoizedState=rd(a),e.memoizedState=id,s);if(!(e.mode&1))return go(t,e,a,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var o=i.dgst;return i=o,s=Error(te(419)),i=kc(s,i,void 0),go(t,e,a,i)}if(o=(a&t.childLanes)!==0,on||o){if(i=kt,i!==null){switch(a&-a){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|a)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,Ei(t,r),Xn(i,t,r,-1))}return Kf(),i=kc(Error(te(421))),go(t,e,a,i)}return r.data==="$?"?(e.flags|=128,e.child=t.child,e=ey.bind(null,t),r._reactRetry=e,null):(t=s.treeContext,_n=$i(r.nextSibling),xn=e,gt=!0,Hn=null,t!==null&&(Tn[An++]=gi,Tn[An++]=vi,Tn[An++]=br,gi=t.id,vi=t.overflow,br=e),e=Wf(e,i.children),e.flags|=4096,e)}function Sp(t,e,n){t.lanes|=e;var i=t.alternate;i!==null&&(i.lanes|=e),Zu(t.return,e,n)}function Oc(t,e,n,i,r){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=n,s.tailMode=r)}function Rv(t,e,n){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if(Zt(t,e,i.children,n),i=vt.current,i&2)i=i&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&Sp(t,n,e);else if(t.tag===19)Sp(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}i&=1}if(ut(vt,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(n=e.child,r=null;n!==null;)t=n.alternate,t!==null&&Pl(t)===null&&(r=n),n=n.sibling;n=r,n===null?(r=e.child,e.child=null):(r=n.sibling,n.sibling=null),Oc(e,!1,r,n,s);break;case"backwards":for(n=null,r=e.child,e.child=null;r!==null;){if(t=r.alternate,t!==null&&Pl(t)===null){e.child=r;break}t=r.sibling,r.sibling=n,n=r,r=t}Oc(e,!0,n,null,s);break;case"together":Oc(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function nl(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function wi(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),Nr|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(te(153));if(e.child!==null){for(t=e.child,n=Zi(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=Zi(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function Hx(t,e,n){switch(e.tag){case 3:Av(e),Ls();break;case 5:ev(e);break;case 1:cn(e.type)&&El(e);break;case 4:Ff(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;ut(Al,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(ut(vt,vt.current&1),e.flags|=128,null):n&e.child.childLanes?Cv(t,e,n):(ut(vt,vt.current&1),t=wi(t,e,n),t!==null?t.sibling:null);ut(vt,vt.current&1);break;case 19:if(i=(n&e.childLanes)!==0,t.flags&128){if(i)return Rv(t,e,n);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),ut(vt,vt.current),i)break;return null;case 22:case 23:return e.lanes=0,wv(t,e,n)}return wi(t,e,n)}var Pv,sd,bv,Lv;Pv=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};sd=function(){};bv=function(t,e,n,i){var r=t.memoizedProps;if(r!==i){t=e.stateNode,Er(ri.current);var s=null;switch(n){case"input":r=Cu(t,r),i=Cu(t,i),s=[];break;case"select":r=St({},r,{value:void 0}),i=St({},i,{value:void 0}),s=[];break;case"textarea":r=bu(t,r),i=bu(t,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(t.onclick=Sl)}Nu(n,i);var a;n=null;for(c in r)if(!i.hasOwnProperty(c)&&r.hasOwnProperty(c)&&r[c]!=null)if(c==="style"){var o=r[c];for(a in o)o.hasOwnProperty(a)&&(n||(n={}),n[a]="")}else c!=="dangerouslySetInnerHTML"&&c!=="children"&&c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(Ta.hasOwnProperty(c)?s||(s=[]):(s=s||[]).push(c,null));for(c in i){var l=i[c];if(o=r?.[c],i.hasOwnProperty(c)&&l!==o&&(l!=null||o!=null))if(c==="style")if(o){for(a in o)!o.hasOwnProperty(a)||l&&l.hasOwnProperty(a)||(n||(n={}),n[a]="");for(a in l)l.hasOwnProperty(a)&&o[a]!==l[a]&&(n||(n={}),n[a]=l[a])}else n||(s||(s=[]),s.push(c,n)),n=l;else c==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,o=o?o.__html:void 0,l!=null&&o!==l&&(s=s||[]).push(c,l)):c==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(c,""+l):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&(Ta.hasOwnProperty(c)?(l!=null&&c==="onScroll"&&ht("scroll",t),s||o===l||(s=[])):(s=s||[]).push(c,l))}n&&(s=s||[]).push("style",n);var c=s;(e.updateQueue=c)&&(e.flags|=4)}};Lv=function(t,e,n,i){n!==i&&(e.flags|=4)};function Js(t,e){if(!gt)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:i.sibling=null}}function Gt(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,i=0;if(e)for(var r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=t,r=r.sibling;else for(r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=t,r=r.sibling;return t.subtreeFlags|=i,t.childLanes=n,e}function Gx(t,e,n){var i=e.pendingProps;switch(Pf(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Gt(e),null;case 1:return cn(e.type)&&Ml(),Gt(e),null;case 3:return i=e.stateNode,Ds(),mt(ln),mt(Yt),Of(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(t===null||t.child===null)&&(po(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,Hn!==null&&(hd(Hn),Hn=null))),sd(t,e),Gt(e),null;case 5:kf(e);var r=Er(ka.current);if(n=e.type,t!==null&&e.stateNode!=null)bv(t,e,n,i,r),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(te(166));return Gt(e),null}if(t=Er(ri.current),po(e)){i=e.stateNode,n=e.type;var s=e.memoizedProps;switch(i[Jn]=e,i[Ua]=s,t=(e.mode&1)!==0,n){case"dialog":ht("cancel",i),ht("close",i);break;case"iframe":case"object":case"embed":ht("load",i);break;case"video":case"audio":for(r=0;r<pa.length;r++)ht(pa[r],i);break;case"source":ht("error",i);break;case"img":case"image":case"link":ht("error",i),ht("load",i);break;case"details":ht("toggle",i);break;case"input":bh(i,s),ht("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},ht("invalid",i);break;case"textarea":Nh(i,s),ht("invalid",i)}Nu(n,s),r=null;for(var a in s)if(s.hasOwnProperty(a)){var o=s[a];a==="children"?typeof o=="string"?i.textContent!==o&&(s.suppressHydrationWarning!==!0&&ho(i.textContent,o,t),r=["children",o]):typeof o=="number"&&i.textContent!==""+o&&(s.suppressHydrationWarning!==!0&&ho(i.textContent,o,t),r=["children",""+o]):Ta.hasOwnProperty(a)&&o!=null&&a==="onScroll"&&ht("scroll",i)}switch(n){case"input":ro(i),Lh(i,s,!0);break;case"textarea":ro(i),Dh(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=Sl)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{a=r.nodeType===9?r:r.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=sg(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=a.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof i.is=="string"?t=a.createElement(n,{is:i.is}):(t=a.createElement(n),n==="select"&&(a=t,i.multiple?a.multiple=!0:i.size&&(a.size=i.size))):t=a.createElementNS(t,n),t[Jn]=e,t[Ua]=i,Pv(t,e,!1,!1),e.stateNode=t;e:{switch(a=Du(n,i),n){case"dialog":ht("cancel",t),ht("close",t),r=i;break;case"iframe":case"object":case"embed":ht("load",t),r=i;break;case"video":case"audio":for(r=0;r<pa.length;r++)ht(pa[r],t);r=i;break;case"source":ht("error",t),r=i;break;case"img":case"image":case"link":ht("error",t),ht("load",t),r=i;break;case"details":ht("toggle",t),r=i;break;case"input":bh(t,i),r=Cu(t,i),ht("invalid",t);break;case"option":r=i;break;case"select":t._wrapperState={wasMultiple:!!i.multiple},r=St({},i,{value:void 0}),ht("invalid",t);break;case"textarea":Nh(t,i),r=bu(t,i),ht("invalid",t);break;default:r=i}Nu(n,r),o=r;for(s in o)if(o.hasOwnProperty(s)){var l=o[s];s==="style"?lg(t,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&ag(t,l)):s==="children"?typeof l=="string"?(n!=="textarea"||l!=="")&&Aa(t,l):typeof l=="number"&&Aa(t,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(Ta.hasOwnProperty(s)?l!=null&&s==="onScroll"&&ht("scroll",t):l!=null&&pf(t,s,l,a))}switch(n){case"input":ro(t),Lh(t,i,!1);break;case"textarea":ro(t),Dh(t);break;case"option":i.value!=null&&t.setAttribute("value",""+tr(i.value));break;case"select":t.multiple=!!i.multiple,s=i.value,s!=null?ys(t,!!i.multiple,s,!1):i.defaultValue!=null&&ys(t,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(t.onclick=Sl)}switch(n){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return Gt(e),null;case 6:if(t&&e.stateNode!=null)Lv(t,e,t.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(te(166));if(n=Er(ka.current),Er(ri.current),po(e)){if(i=e.stateNode,n=e.memoizedProps,i[Jn]=e,(s=i.nodeValue!==n)&&(t=xn,t!==null))switch(t.tag){case 3:ho(i.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&ho(i.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else i=(n.nodeType===9?n:n.ownerDocument).createTextNode(i),i[Jn]=e,e.stateNode=i}return Gt(e),null;case 13:if(mt(vt),i=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(gt&&_n!==null&&e.mode&1&&!(e.flags&128))qg(),Ls(),e.flags|=98560,s=!1;else if(s=po(e),i!==null&&i.dehydrated!==null){if(t===null){if(!s)throw Error(te(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(te(317));s[Jn]=e}else Ls(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;Gt(e),s=!1}else Hn!==null&&(hd(Hn),Hn=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(i=i!==null,i!==(t!==null&&t.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(t===null||vt.current&1?Lt===0&&(Lt=3):Kf())),e.updateQueue!==null&&(e.flags|=4),Gt(e),null);case 4:return Ds(),sd(t,e),t===null&&Da(e.stateNode.containerInfo),Gt(e),null;case 10:return Df(e.type._context),Gt(e),null;case 17:return cn(e.type)&&Ml(),Gt(e),null;case 19:if(mt(vt),s=e.memoizedState,s===null)return Gt(e),null;if(i=(e.flags&128)!==0,a=s.rendering,a===null)if(i)Js(s,!1);else{if(Lt!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(a=Pl(t),a!==null){for(e.flags|=128,Js(s,!1),i=a.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=n,n=e.child;n!==null;)s=n,t=i,s.flags&=14680066,a=s.alternate,a===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=a.childLanes,s.lanes=a.lanes,s.child=a.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=a.memoizedProps,s.memoizedState=a.memoizedState,s.updateQueue=a.updateQueue,s.type=a.type,t=a.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return ut(vt,vt.current&1|2),e.child}t=t.sibling}s.tail!==null&&Tt()>Us&&(e.flags|=128,i=!0,Js(s,!1),e.lanes=4194304)}else{if(!i)if(t=Pl(a),t!==null){if(e.flags|=128,i=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),Js(s,!0),s.tail===null&&s.tailMode==="hidden"&&!a.alternate&&!gt)return Gt(e),null}else 2*Tt()-s.renderingStartTime>Us&&n!==1073741824&&(e.flags|=128,i=!0,Js(s,!1),e.lanes=4194304);s.isBackwards?(a.sibling=e.child,e.child=a):(n=s.last,n!==null?n.sibling=a:e.child=a,s.last=a)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=Tt(),e.sibling=null,n=vt.current,ut(vt,i?n&1|2:n&1),e):(Gt(e),null);case 22:case 23:return qf(),i=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?vn&1073741824&&(Gt(e),e.subtreeFlags&6&&(e.flags|=8192)):Gt(e),null;case 24:return null;case 25:return null}throw Error(te(156,e.tag))}function Wx(t,e){switch(Pf(e),e.tag){case 1:return cn(e.type)&&Ml(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return Ds(),mt(ln),mt(Yt),Of(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return kf(e),null;case 13:if(mt(vt),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(te(340));Ls()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return mt(vt),null;case 4:return Ds(),null;case 10:return Df(e.type._context),null;case 22:case 23:return qf(),null;case 24:return null;default:return null}}var vo=!1,Xt=!1,jx=typeof WeakSet=="function"?WeakSet:Set,pe=null;function vs(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(i){Et(t,e,i)}else n.current=null}function ad(t,e,n){try{n()}catch(i){Et(t,e,i)}}var Mp=!1;function Xx(t,e){if(Gu=_l,t=Fg(),Cf(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var a=0,o=-1,l=-1,c=0,d=0,h=t,f=null;t:for(;;){for(var p;h!==n||r!==0&&h.nodeType!==3||(o=a+r),h!==s||i!==0&&h.nodeType!==3||(l=a+i),h.nodeType===3&&(a+=h.nodeValue.length),(p=h.firstChild)!==null;)f=h,h=p;for(;;){if(h===t)break t;if(f===n&&++c===r&&(o=a),f===s&&++d===i&&(l=a),(p=h.nextSibling)!==null)break;h=f,f=h.parentNode}h=p}n=o===-1||l===-1?null:{start:o,end:l}}else n=null}n=n||{start:0,end:0}}else n=null;for(Wu={focusedElem:t,selectionRange:n},_l=!1,pe=e;pe!==null;)if(e=pe,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,pe=t;else for(;pe!==null;){e=pe;try{var _=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(_!==null){var y=_.memoizedProps,m=_.memoizedState,u=e.stateNode,g=u.getSnapshotBeforeUpdate(e.elementType===e.type?y:zn(e.type,y),m);u.__reactInternalSnapshotBeforeUpdate=g}break;case 3:var v=e.stateNode.containerInfo;v.nodeType===1?v.textContent="":v.nodeType===9&&v.documentElement&&v.removeChild(v.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(te(163))}}catch(E){Et(e,e.return,E)}if(t=e.sibling,t!==null){t.return=e.return,pe=t;break}pe=e.return}return _=Mp,Mp=!1,_}function Ma(t,e,n){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&t)===t){var s=r.destroy;r.destroy=void 0,s!==void 0&&ad(e,n,s)}r=r.next}while(r!==i)}}function ec(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var i=n.create;n.destroy=i()}n=n.next}while(n!==e)}}function od(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function Nv(t){var e=t.alternate;e!==null&&(t.alternate=null,Nv(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[Jn],delete e[Ua],delete e[$u],delete e[Rx],delete e[Px])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function Dv(t){return t.tag===5||t.tag===3||t.tag===4}function Ep(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||Dv(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function ld(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=Sl));else if(i!==4&&(t=t.child,t!==null))for(ld(t,e,n),t=t.sibling;t!==null;)ld(t,e,n),t=t.sibling}function cd(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(i!==4&&(t=t.child,t!==null))for(cd(t,e,n),t=t.sibling;t!==null;)cd(t,e,n),t=t.sibling}var Bt=null,Vn=!1;function Pi(t,e,n){for(n=n.child;n!==null;)Iv(t,e,n),n=n.sibling}function Iv(t,e,n){if(ii&&typeof ii.onCommitFiberUnmount=="function")try{ii.onCommitFiberUnmount(Xl,n)}catch{}switch(n.tag){case 5:Xt||vs(n,e);case 6:var i=Bt,r=Vn;Bt=null,Pi(t,e,n),Bt=i,Vn=r,Bt!==null&&(Vn?(t=Bt,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):Bt.removeChild(n.stateNode));break;case 18:Bt!==null&&(Vn?(t=Bt,n=n.stateNode,t.nodeType===8?Lc(t.parentNode,n):t.nodeType===1&&Lc(t,n),ba(t)):Lc(Bt,n.stateNode));break;case 4:i=Bt,r=Vn,Bt=n.stateNode.containerInfo,Vn=!0,Pi(t,e,n),Bt=i,Vn=r;break;case 0:case 11:case 14:case 15:if(!Xt&&(i=n.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,a=s.destroy;s=s.tag,a!==void 0&&(s&2||s&4)&&ad(n,e,a),r=r.next}while(r!==i)}Pi(t,e,n);break;case 1:if(!Xt&&(vs(n,e),i=n.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=n.memoizedProps,i.state=n.memoizedState,i.componentWillUnmount()}catch(o){Et(n,e,o)}Pi(t,e,n);break;case 21:Pi(t,e,n);break;case 22:n.mode&1?(Xt=(i=Xt)||n.memoizedState!==null,Pi(t,e,n),Xt=i):Pi(t,e,n);break;default:Pi(t,e,n)}}function wp(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new jx),e.forEach(function(i){var r=ty.bind(null,t,i);n.has(i)||(n.add(i),i.then(r,r))})}}function Fn(t,e){var n=e.deletions;if(n!==null)for(var i=0;i<n.length;i++){var r=n[i];try{var s=t,a=e,o=a;e:for(;o!==null;){switch(o.tag){case 5:Bt=o.stateNode,Vn=!1;break e;case 3:Bt=o.stateNode.containerInfo,Vn=!0;break e;case 4:Bt=o.stateNode.containerInfo,Vn=!0;break e}o=o.return}if(Bt===null)throw Error(te(160));Iv(s,a,r),Bt=null,Vn=!1;var l=r.alternate;l!==null&&(l.return=null),r.return=null}catch(c){Et(r,e,c)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)Uv(e,t),e=e.sibling}function Uv(t,e){var n=t.alternate,i=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(Fn(e,t),qn(t),i&4){try{Ma(3,t,t.return),ec(3,t)}catch(y){Et(t,t.return,y)}try{Ma(5,t,t.return)}catch(y){Et(t,t.return,y)}}break;case 1:Fn(e,t),qn(t),i&512&&n!==null&&vs(n,n.return);break;case 5:if(Fn(e,t),qn(t),i&512&&n!==null&&vs(n,n.return),t.flags&32){var r=t.stateNode;try{Aa(r,"")}catch(y){Et(t,t.return,y)}}if(i&4&&(r=t.stateNode,r!=null)){var s=t.memoizedProps,a=n!==null?n.memoizedProps:s,o=t.type,l=t.updateQueue;if(t.updateQueue=null,l!==null)try{o==="input"&&s.type==="radio"&&s.name!=null&&ig(r,s),Du(o,a);var c=Du(o,s);for(a=0;a<l.length;a+=2){var d=l[a],h=l[a+1];d==="style"?lg(r,h):d==="dangerouslySetInnerHTML"?ag(r,h):d==="children"?Aa(r,h):pf(r,d,h,c)}switch(o){case"input":Ru(r,s);break;case"textarea":rg(r,s);break;case"select":var f=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var p=s.value;p!=null?ys(r,!!s.multiple,p,!1):f!==!!s.multiple&&(s.defaultValue!=null?ys(r,!!s.multiple,s.defaultValue,!0):ys(r,!!s.multiple,s.multiple?[]:"",!1))}r[Ua]=s}catch(y){Et(t,t.return,y)}}break;case 6:if(Fn(e,t),qn(t),i&4){if(t.stateNode===null)throw Error(te(162));r=t.stateNode,s=t.memoizedProps;try{r.nodeValue=s}catch(y){Et(t,t.return,y)}}break;case 3:if(Fn(e,t),qn(t),i&4&&n!==null&&n.memoizedState.isDehydrated)try{ba(e.containerInfo)}catch(y){Et(t,t.return,y)}break;case 4:Fn(e,t),qn(t);break;case 13:Fn(e,t),qn(t),r=t.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||($f=Tt())),i&4&&wp(t);break;case 22:if(d=n!==null&&n.memoizedState!==null,t.mode&1?(Xt=(c=Xt)||d,Fn(e,t),Xt=c):Fn(e,t),qn(t),i&8192){if(c=t.memoizedState!==null,(t.stateNode.isHidden=c)&&!d&&t.mode&1)for(pe=t,d=t.child;d!==null;){for(h=pe=d;pe!==null;){switch(f=pe,p=f.child,f.tag){case 0:case 11:case 14:case 15:Ma(4,f,f.return);break;case 1:vs(f,f.return);var _=f.stateNode;if(typeof _.componentWillUnmount=="function"){i=f,n=f.return;try{e=i,_.props=e.memoizedProps,_.state=e.memoizedState,_.componentWillUnmount()}catch(y){Et(i,n,y)}}break;case 5:vs(f,f.return);break;case 22:if(f.memoizedState!==null){Ap(h);continue}}p!==null?(p.return=f,pe=p):Ap(h)}d=d.sibling}e:for(d=null,h=t;;){if(h.tag===5){if(d===null){d=h;try{r=h.stateNode,c?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(o=h.stateNode,l=h.memoizedProps.style,a=l!=null&&l.hasOwnProperty("display")?l.display:null,o.style.display=og("display",a))}catch(y){Et(t,t.return,y)}}}else if(h.tag===6){if(d===null)try{h.stateNode.nodeValue=c?"":h.memoizedProps}catch(y){Et(t,t.return,y)}}else if((h.tag!==22&&h.tag!==23||h.memoizedState===null||h===t)&&h.child!==null){h.child.return=h,h=h.child;continue}if(h===t)break e;for(;h.sibling===null;){if(h.return===null||h.return===t)break e;d===h&&(d=null),h=h.return}d===h&&(d=null),h.sibling.return=h.return,h=h.sibling}}break;case 19:Fn(e,t),qn(t),i&4&&wp(t);break;case 21:break;default:Fn(e,t),qn(t)}}function qn(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(Dv(n)){var i=n;break e}n=n.return}throw Error(te(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(Aa(r,""),i.flags&=-33);var s=Ep(t);cd(t,s,r);break;case 3:case 4:var a=i.stateNode.containerInfo,o=Ep(t);ld(t,o,a);break;default:throw Error(te(161))}}catch(l){Et(t,t.return,l)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function $x(t,e,n){pe=t,Fv(t)}function Fv(t,e,n){for(var i=(t.mode&1)!==0;pe!==null;){var r=pe,s=r.child;if(r.tag===22&&i){var a=r.memoizedState!==null||vo;if(!a){var o=r.alternate,l=o!==null&&o.memoizedState!==null||Xt;o=vo;var c=Xt;if(vo=a,(Xt=l)&&!c)for(pe=r;pe!==null;)a=pe,l=a.child,a.tag===22&&a.memoizedState!==null?Cp(r):l!==null?(l.return=a,pe=l):Cp(r);for(;s!==null;)pe=s,Fv(s),s=s.sibling;pe=r,vo=o,Xt=c}Tp(t)}else r.subtreeFlags&8772&&s!==null?(s.return=r,pe=s):Tp(t)}}function Tp(t){for(;pe!==null;){var e=pe;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:Xt||ec(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!Xt)if(n===null)i.componentDidMount();else{var r=e.elementType===e.type?n.memoizedProps:zn(e.type,n.memoizedProps);i.componentDidUpdate(r,n.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&cp(e,s,i);break;case 3:var a=e.updateQueue;if(a!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}cp(e,a,n)}break;case 5:var o=e.stateNode;if(n===null&&e.flags&4){n=o;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&n.focus();break;case"img":l.src&&(n.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var c=e.alternate;if(c!==null){var d=c.memoizedState;if(d!==null){var h=d.dehydrated;h!==null&&ba(h)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(te(163))}Xt||e.flags&512&&od(e)}catch(f){Et(e,e.return,f)}}if(e===t){pe=null;break}if(n=e.sibling,n!==null){n.return=e.return,pe=n;break}pe=e.return}}function Ap(t){for(;pe!==null;){var e=pe;if(e===t){pe=null;break}var n=e.sibling;if(n!==null){n.return=e.return,pe=n;break}pe=e.return}}function Cp(t){for(;pe!==null;){var e=pe;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{ec(4,e)}catch(l){Et(e,n,l)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(l){Et(e,r,l)}}var s=e.return;try{od(e)}catch(l){Et(e,s,l)}break;case 5:var a=e.return;try{od(e)}catch(l){Et(e,a,l)}}}catch(l){Et(e,e.return,l)}if(e===t){pe=null;break}var o=e.sibling;if(o!==null){o.return=e.return,pe=o;break}pe=e.return}}var Yx=Math.ceil,Nl=Ci.ReactCurrentDispatcher,jf=Ci.ReactCurrentOwner,Nn=Ci.ReactCurrentBatchConfig,Ye=0,kt=null,Pt=null,zt=0,vn=0,_s=sr(0),Lt=0,Va=null,Nr=0,tc=0,Xf=0,Ea=null,sn=null,$f=0,Us=1/0,hi=null,Dl=!1,ud=null,qi=null,_o=!1,Gi=null,Il=0,wa=0,dd=null,il=-1,rl=0;function Qt(){return Ye&6?Tt():il!==-1?il:il=Tt()}function Ki(t){return t.mode&1?Ye&2&&zt!==0?zt&-zt:Lx.transition!==null?(rl===0&&(rl=yg()),rl):(t=st,t!==0||(t=window.event,t=t===void 0?16:Cg(t.type)),t):1}function Xn(t,e,n,i){if(50<wa)throw wa=0,dd=null,Error(te(185));ja(t,n,i),(!(Ye&2)||t!==kt)&&(t===kt&&(!(Ye&2)&&(tc|=n),Lt===4&&zi(t,zt)),un(t,i),n===1&&Ye===0&&!(e.mode&1)&&(Us=Tt()+500,Zl&&ar()))}function un(t,e){var n=t.callbackNode;L0(t,e);var i=vl(t,t===kt?zt:0);if(i===0)n!==null&&Fh(n),t.callbackNode=null,t.callbackPriority=0;else if(e=i&-i,t.callbackPriority!==e){if(n!=null&&Fh(n),e===1)t.tag===0?bx(Rp.bind(null,t)):Xg(Rp.bind(null,t)),Ax(function(){!(Ye&6)&&ar()}),n=null;else{switch(Sg(i)){case 1:n=xf;break;case 4:n=_g;break;case 16:n=gl;break;case 536870912:n=xg;break;default:n=gl}n=Wv(n,kv.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function kv(t,e){if(il=-1,rl=0,Ye&6)throw Error(te(327));var n=t.callbackNode;if(Ts()&&t.callbackNode!==n)return null;var i=vl(t,t===kt?zt:0);if(i===0)return null;if(i&30||i&t.expiredLanes||e)e=Ul(t,i);else{e=i;var r=Ye;Ye|=2;var s=Bv();(kt!==t||zt!==e)&&(hi=null,Us=Tt()+500,Cr(t,e));do try{Zx();break}catch(o){Ov(t,o)}while(!0);Nf(),Nl.current=s,Ye=r,Pt!==null?e=0:(kt=null,zt=0,e=Lt)}if(e!==0){if(e===2&&(r=Ou(t),r!==0&&(i=r,e=fd(t,r))),e===1)throw n=Va,Cr(t,0),zi(t,i),un(t,Tt()),n;if(e===6)zi(t,i);else{if(r=t.current.alternate,!(i&30)&&!qx(r)&&(e=Ul(t,i),e===2&&(s=Ou(t),s!==0&&(i=s,e=fd(t,s))),e===1))throw n=Va,Cr(t,0),zi(t,i),un(t,Tt()),n;switch(t.finishedWork=r,t.finishedLanes=i,e){case 0:case 1:throw Error(te(345));case 2:gr(t,sn,hi);break;case 3:if(zi(t,i),(i&130023424)===i&&(e=$f+500-Tt(),10<e)){if(vl(t,0)!==0)break;if(r=t.suspendedLanes,(r&i)!==i){Qt(),t.pingedLanes|=t.suspendedLanes&r;break}t.timeoutHandle=Xu(gr.bind(null,t,sn,hi),e);break}gr(t,sn,hi);break;case 4:if(zi(t,i),(i&4194240)===i)break;for(e=t.eventTimes,r=-1;0<i;){var a=31-jn(i);s=1<<a,a=e[a],a>r&&(r=a),i&=~s}if(i=r,i=Tt()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*Yx(i/1960))-i,10<i){t.timeoutHandle=Xu(gr.bind(null,t,sn,hi),i);break}gr(t,sn,hi);break;case 5:gr(t,sn,hi);break;default:throw Error(te(329))}}}return un(t,Tt()),t.callbackNode===n?kv.bind(null,t):null}function fd(t,e){var n=Ea;return t.current.memoizedState.isDehydrated&&(Cr(t,e).flags|=256),t=Ul(t,e),t!==2&&(e=sn,sn=n,e!==null&&hd(e)),t}function hd(t){sn===null?sn=t:sn.push.apply(sn,t)}function qx(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var i=0;i<n.length;i++){var r=n[i],s=r.getSnapshot;r=r.value;try{if(!Yn(s(),r))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function zi(t,e){for(e&=~Xf,e&=~tc,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-jn(e),i=1<<n;t[n]=-1,e&=~i}}function Rp(t){if(Ye&6)throw Error(te(327));Ts();var e=vl(t,0);if(!(e&1))return un(t,Tt()),null;var n=Ul(t,e);if(t.tag!==0&&n===2){var i=Ou(t);i!==0&&(e=i,n=fd(t,i))}if(n===1)throw n=Va,Cr(t,0),zi(t,e),un(t,Tt()),n;if(n===6)throw Error(te(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,gr(t,sn,hi),un(t,Tt()),null}function Yf(t,e){var n=Ye;Ye|=1;try{return t(e)}finally{Ye=n,Ye===0&&(Us=Tt()+500,Zl&&ar())}}function Dr(t){Gi!==null&&Gi.tag===0&&!(Ye&6)&&Ts();var e=Ye;Ye|=1;var n=Nn.transition,i=st;try{if(Nn.transition=null,st=1,t)return t()}finally{st=i,Nn.transition=n,Ye=e,!(Ye&6)&&ar()}}function qf(){vn=_s.current,mt(_s)}function Cr(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,Tx(n)),Pt!==null)for(n=Pt.return;n!==null;){var i=n;switch(Pf(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&Ml();break;case 3:Ds(),mt(ln),mt(Yt),Of();break;case 5:kf(i);break;case 4:Ds();break;case 13:mt(vt);break;case 19:mt(vt);break;case 10:Df(i.type._context);break;case 22:case 23:qf()}n=n.return}if(kt=t,Pt=t=Zi(t.current,null),zt=vn=e,Lt=0,Va=null,Xf=tc=Nr=0,sn=Ea=null,Mr!==null){for(e=0;e<Mr.length;e++)if(n=Mr[e],i=n.interleaved,i!==null){n.interleaved=null;var r=i.next,s=n.pending;if(s!==null){var a=s.next;s.next=r,i.next=a}n.pending=i}Mr=null}return t}function Ov(t,e){do{var n=Pt;try{if(Nf(),el.current=Ll,bl){for(var i=xt.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}bl=!1}if(Lr=0,Ut=bt=xt=null,Sa=!1,Oa=0,jf.current=null,n===null||n.return===null){Lt=1,Va=e,Pt=null;break}e:{var s=t,a=n.return,o=n,l=e;if(e=zt,o.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var c=l,d=o,h=d.tag;if(!(d.mode&1)&&(h===0||h===11||h===15)){var f=d.alternate;f?(d.updateQueue=f.updateQueue,d.memoizedState=f.memoizedState,d.lanes=f.lanes):(d.updateQueue=null,d.memoizedState=null)}var p=mp(a);if(p!==null){p.flags&=-257,gp(p,a,o,s,e),p.mode&1&&pp(s,c,e),e=p,l=c;var _=e.updateQueue;if(_===null){var y=new Set;y.add(l),e.updateQueue=y}else _.add(l);break e}else{if(!(e&1)){pp(s,c,e),Kf();break e}l=Error(te(426))}}else if(gt&&o.mode&1){var m=mp(a);if(m!==null){!(m.flags&65536)&&(m.flags|=256),gp(m,a,o,s,e),bf(Is(l,o));break e}}s=l=Is(l,o),Lt!==4&&(Lt=2),Ea===null?Ea=[s]:Ea.push(s),s=a;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var u=Sv(s,l,e);lp(s,u);break e;case 1:o=l;var g=s.type,v=s.stateNode;if(!(s.flags&128)&&(typeof g.getDerivedStateFromError=="function"||v!==null&&typeof v.componentDidCatch=="function"&&(qi===null||!qi.has(v)))){s.flags|=65536,e&=-e,s.lanes|=e;var E=Mv(s,o,e);lp(s,E);break e}}s=s.return}while(s!==null)}Vv(n)}catch(b){e=b,Pt===n&&n!==null&&(Pt=n=n.return);continue}break}while(!0)}function Bv(){var t=Nl.current;return Nl.current=Ll,t===null?Ll:t}function Kf(){(Lt===0||Lt===3||Lt===2)&&(Lt=4),kt===null||!(Nr&268435455)&&!(tc&268435455)||zi(kt,zt)}function Ul(t,e){var n=Ye;Ye|=2;var i=Bv();(kt!==t||zt!==e)&&(hi=null,Cr(t,e));do try{Kx();break}catch(r){Ov(t,r)}while(!0);if(Nf(),Ye=n,Nl.current=i,Pt!==null)throw Error(te(261));return kt=null,zt=0,Lt}function Kx(){for(;Pt!==null;)zv(Pt)}function Zx(){for(;Pt!==null&&!M0();)zv(Pt)}function zv(t){var e=Gv(t.alternate,t,vn);t.memoizedProps=t.pendingProps,e===null?Vv(t):Pt=e,jf.current=null}function Vv(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=Wx(n,e),n!==null){n.flags&=32767,Pt=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{Lt=6,Pt=null;return}}else if(n=Gx(n,e,vn),n!==null){Pt=n;return}if(e=e.sibling,e!==null){Pt=e;return}Pt=e=t}while(e!==null);Lt===0&&(Lt=5)}function gr(t,e,n){var i=st,r=Nn.transition;try{Nn.transition=null,st=1,Qx(t,e,n,i)}finally{Nn.transition=r,st=i}return null}function Qx(t,e,n,i){do Ts();while(Gi!==null);if(Ye&6)throw Error(te(327));n=t.finishedWork;var r=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(te(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(N0(t,s),t===kt&&(Pt=kt=null,zt=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||_o||(_o=!0,Wv(gl,function(){return Ts(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=Nn.transition,Nn.transition=null;var a=st;st=1;var o=Ye;Ye|=4,jf.current=null,Xx(t,n),Uv(n,t),_x(Wu),_l=!!Gu,Wu=Gu=null,t.current=n,$x(n),E0(),Ye=o,st=a,Nn.transition=s}else t.current=n;if(_o&&(_o=!1,Gi=t,Il=r),s=t.pendingLanes,s===0&&(qi=null),A0(n.stateNode),un(t,Tt()),e!==null)for(i=t.onRecoverableError,n=0;n<e.length;n++)r=e[n],i(r.value,{componentStack:r.stack,digest:r.digest});if(Dl)throw Dl=!1,t=ud,ud=null,t;return Il&1&&t.tag!==0&&Ts(),s=t.pendingLanes,s&1?t===dd?wa++:(wa=0,dd=t):wa=0,ar(),null}function Ts(){if(Gi!==null){var t=Sg(Il),e=Nn.transition,n=st;try{if(Nn.transition=null,st=16>t?16:t,Gi===null)var i=!1;else{if(t=Gi,Gi=null,Il=0,Ye&6)throw Error(te(331));var r=Ye;for(Ye|=4,pe=t.current;pe!==null;){var s=pe,a=s.child;if(pe.flags&16){var o=s.deletions;if(o!==null){for(var l=0;l<o.length;l++){var c=o[l];for(pe=c;pe!==null;){var d=pe;switch(d.tag){case 0:case 11:case 15:Ma(8,d,s)}var h=d.child;if(h!==null)h.return=d,pe=h;else for(;pe!==null;){d=pe;var f=d.sibling,p=d.return;if(Nv(d),d===c){pe=null;break}if(f!==null){f.return=p,pe=f;break}pe=p}}}var _=s.alternate;if(_!==null){var y=_.child;if(y!==null){_.child=null;do{var m=y.sibling;y.sibling=null,y=m}while(y!==null)}}pe=s}}if(s.subtreeFlags&2064&&a!==null)a.return=s,pe=a;else e:for(;pe!==null;){if(s=pe,s.flags&2048)switch(s.tag){case 0:case 11:case 15:Ma(9,s,s.return)}var u=s.sibling;if(u!==null){u.return=s.return,pe=u;break e}pe=s.return}}var g=t.current;for(pe=g;pe!==null;){a=pe;var v=a.child;if(a.subtreeFlags&2064&&v!==null)v.return=a,pe=v;else e:for(a=g;pe!==null;){if(o=pe,o.flags&2048)try{switch(o.tag){case 0:case 11:case 15:ec(9,o)}}catch(b){Et(o,o.return,b)}if(o===a){pe=null;break e}var E=o.sibling;if(E!==null){E.return=o.return,pe=E;break e}pe=o.return}}if(Ye=r,ar(),ii&&typeof ii.onPostCommitFiberRoot=="function")try{ii.onPostCommitFiberRoot(Xl,t)}catch{}i=!0}return i}finally{st=n,Nn.transition=e}}return!1}function Pp(t,e,n){e=Is(n,e),e=Sv(t,e,1),t=Yi(t,e,1),e=Qt(),t!==null&&(ja(t,1,e),un(t,e))}function Et(t,e,n){if(t.tag===3)Pp(t,t,n);else for(;e!==null;){if(e.tag===3){Pp(e,t,n);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(qi===null||!qi.has(i))){t=Is(n,t),t=Mv(e,t,1),e=Yi(e,t,1),t=Qt(),e!==null&&(ja(e,1,t),un(e,t));break}}e=e.return}}function Jx(t,e,n){var i=t.pingCache;i!==null&&i.delete(e),e=Qt(),t.pingedLanes|=t.suspendedLanes&n,kt===t&&(zt&n)===n&&(Lt===4||Lt===3&&(zt&130023424)===zt&&500>Tt()-$f?Cr(t,0):Xf|=n),un(t,e)}function Hv(t,e){e===0&&(t.mode&1?(e=oo,oo<<=1,!(oo&130023424)&&(oo=4194304)):e=1);var n=Qt();t=Ei(t,e),t!==null&&(ja(t,e,n),un(t,n))}function ey(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),Hv(t,n)}function ty(t,e){var n=0;switch(t.tag){case 13:var i=t.stateNode,r=t.memoizedState;r!==null&&(n=r.retryLane);break;case 19:i=t.stateNode;break;default:throw Error(te(314))}i!==null&&i.delete(e),Hv(t,n)}var Gv;Gv=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||ln.current)on=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return on=!1,Hx(t,e,n);on=!!(t.flags&131072)}else on=!1,gt&&e.flags&1048576&&$g(e,Tl,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;nl(t,e),t=e.pendingProps;var r=bs(e,Yt.current);ws(e,n),r=zf(null,e,i,t,r,n);var s=Vf();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,cn(i)?(s=!0,El(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,Uf(e),r.updater=Jl,e.stateNode=r,r._reactInternals=e,Ju(e,i,t,n),e=nd(null,e,i,!0,s,n)):(e.tag=0,gt&&s&&Rf(e),Zt(null,e,r,n),e=e.child),e;case 16:i=e.elementType;e:{switch(nl(t,e),t=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=iy(i),t=zn(i,t),r){case 0:e=td(null,e,i,t,n);break e;case 1:e=xp(null,e,i,t,n);break e;case 11:e=vp(null,e,i,t,n);break e;case 14:e=_p(null,e,i,zn(i.type,t),n);break e}throw Error(te(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:zn(i,r),td(t,e,i,r,n);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:zn(i,r),xp(t,e,i,r,n);case 3:e:{if(Av(e),t===null)throw Error(te(387));i=e.pendingProps,s=e.memoizedState,r=s.element,Jg(t,e),Rl(e,i,null,n);var a=e.memoizedState;if(i=a.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:a.cache,pendingSuspenseBoundaries:a.pendingSuspenseBoundaries,transitions:a.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=Is(Error(te(423)),e),e=yp(t,e,i,n,r);break e}else if(i!==r){r=Is(Error(te(424)),e),e=yp(t,e,i,n,r);break e}else for(_n=$i(e.stateNode.containerInfo.firstChild),xn=e,gt=!0,Hn=null,n=Zg(e,null,i,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Ls(),i===r){e=wi(t,e,n);break e}Zt(t,e,i,n)}e=e.child}return e;case 5:return ev(e),t===null&&Ku(e),i=e.type,r=e.pendingProps,s=t!==null?t.memoizedProps:null,a=r.children,ju(i,r)?a=null:s!==null&&ju(i,s)&&(e.flags|=32),Tv(t,e),Zt(t,e,a,n),e.child;case 6:return t===null&&Ku(e),null;case 13:return Cv(t,e,n);case 4:return Ff(e,e.stateNode.containerInfo),i=e.pendingProps,t===null?e.child=Ns(e,null,i,n):Zt(t,e,i,n),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:zn(i,r),vp(t,e,i,r,n);case 7:return Zt(t,e,e.pendingProps,n),e.child;case 8:return Zt(t,e,e.pendingProps.children,n),e.child;case 12:return Zt(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,a=r.value,ut(Al,i._currentValue),i._currentValue=a,s!==null)if(Yn(s.value,a)){if(s.children===r.children&&!ln.current){e=wi(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var o=s.dependencies;if(o!==null){a=s.child;for(var l=o.firstContext;l!==null;){if(l.context===i){if(s.tag===1){l=yi(-1,n&-n),l.tag=2;var c=s.updateQueue;if(c!==null){c=c.shared;var d=c.pending;d===null?l.next=l:(l.next=d.next,d.next=l),c.pending=l}}s.lanes|=n,l=s.alternate,l!==null&&(l.lanes|=n),Zu(s.return,n,e),o.lanes|=n;break}l=l.next}}else if(s.tag===10)a=s.type===e.type?null:s.child;else if(s.tag===18){if(a=s.return,a===null)throw Error(te(341));a.lanes|=n,o=a.alternate,o!==null&&(o.lanes|=n),Zu(a,n,e),a=s.sibling}else a=s.child;if(a!==null)a.return=s;else for(a=s;a!==null;){if(a===e){a=null;break}if(s=a.sibling,s!==null){s.return=a.return,a=s;break}a=a.return}s=a}Zt(t,e,r.children,n),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,ws(e,n),r=Dn(r),i=i(r),e.flags|=1,Zt(t,e,i,n),e.child;case 14:return i=e.type,r=zn(i,e.pendingProps),r=zn(i.type,r),_p(t,e,i,r,n);case 15:return Ev(t,e,e.type,e.pendingProps,n);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:zn(i,r),nl(t,e),e.tag=1,cn(i)?(t=!0,El(e)):t=!1,ws(e,n),yv(e,i,r),Ju(e,i,r,n),nd(null,e,i,!0,t,n);case 19:return Rv(t,e,n);case 22:return wv(t,e,n)}throw Error(te(156,e.tag))};function Wv(t,e){return vg(t,e)}function ny(t,e,n,i){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function bn(t,e,n,i){return new ny(t,e,n,i)}function Zf(t){return t=t.prototype,!(!t||!t.isReactComponent)}function iy(t){if(typeof t=="function")return Zf(t)?1:0;if(t!=null){if(t=t.$$typeof,t===gf)return 11;if(t===vf)return 14}return 2}function Zi(t,e){var n=t.alternate;return n===null?(n=bn(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function sl(t,e,n,i,r,s){var a=2;if(i=t,typeof t=="function")Zf(t)&&(a=1);else if(typeof t=="string")a=5;else e:switch(t){case ls:return Rr(n.children,r,s,e);case mf:a=8,r|=8;break;case Eu:return t=bn(12,n,e,r|2),t.elementType=Eu,t.lanes=s,t;case wu:return t=bn(13,n,e,r),t.elementType=wu,t.lanes=s,t;case Tu:return t=bn(19,n,e,r),t.elementType=Tu,t.lanes=s,t;case eg:return nc(n,r,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case Qm:a=10;break e;case Jm:a=9;break e;case gf:a=11;break e;case vf:a=14;break e;case ki:a=16,i=null;break e}throw Error(te(130,t==null?t:typeof t,""))}return e=bn(a,n,e,r),e.elementType=t,e.type=i,e.lanes=s,e}function Rr(t,e,n,i){return t=bn(7,t,i,e),t.lanes=n,t}function nc(t,e,n,i){return t=bn(22,t,i,e),t.elementType=eg,t.lanes=n,t.stateNode={isHidden:!1},t}function Bc(t,e,n){return t=bn(6,t,null,e),t.lanes=n,t}function zc(t,e,n){return e=bn(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function ry(t,e,n,i,r){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=yc(0),this.expirationTimes=yc(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=yc(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function Qf(t,e,n,i,r,s,a,o,l){return t=new ry(t,e,n,o,l),e===1?(e=1,s===!0&&(e|=8)):e=0,s=bn(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:i,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Uf(s),t}function sy(t,e,n){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:os,key:i==null?null:""+i,children:t,containerInfo:e,implementation:n}}function jv(t){if(!t)return nr;t=t._reactInternals;e:{if(kr(t)!==t||t.tag!==1)throw Error(te(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(cn(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(te(171))}if(t.tag===1){var n=t.type;if(cn(n))return jg(t,n,e)}return e}function Xv(t,e,n,i,r,s,a,o,l){return t=Qf(n,i,!0,t,r,s,a,o,l),t.context=jv(null),n=t.current,i=Qt(),r=Ki(n),s=yi(i,r),s.callback=e??null,Yi(n,s,r),t.current.lanes=r,ja(t,r,i),un(t,i),t}function ic(t,e,n,i){var r=e.current,s=Qt(),a=Ki(r);return n=jv(n),e.context===null?e.context=n:e.pendingContext=n,e=yi(s,a),e.payload={element:t},i=i===void 0?null:i,i!==null&&(e.callback=i),t=Yi(r,e,a),t!==null&&(Xn(t,r,a,s),Jo(t,r,a)),a}function Fl(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function bp(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function Jf(t,e){bp(t,e),(t=t.alternate)&&bp(t,e)}function ay(){return null}var $v=typeof reportError=="function"?reportError:function(t){console.error(t)};function eh(t){this._internalRoot=t}rc.prototype.render=eh.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(te(409));ic(t,e,null,null)};rc.prototype.unmount=eh.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;Dr(function(){ic(null,t,null,null)}),e[Mi]=null}};function rc(t){this._internalRoot=t}rc.prototype.unstable_scheduleHydration=function(t){if(t){var e=wg();t={blockedOn:null,target:t,priority:e};for(var n=0;n<Bi.length&&e!==0&&e<Bi[n].priority;n++);Bi.splice(n,0,t),n===0&&Ag(t)}};function th(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function sc(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function Lp(){}function oy(t,e,n,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var c=Fl(a);s.call(c)}}var a=Xv(e,i,t,0,null,!1,!1,"",Lp);return t._reactRootContainer=a,t[Mi]=a.current,Da(t.nodeType===8?t.parentNode:t),Dr(),a}for(;r=t.lastChild;)t.removeChild(r);if(typeof i=="function"){var o=i;i=function(){var c=Fl(l);o.call(c)}}var l=Qf(t,0,!1,null,null,!1,!1,"",Lp);return t._reactRootContainer=l,t[Mi]=l.current,Da(t.nodeType===8?t.parentNode:t),Dr(function(){ic(e,l,n,i)}),l}function ac(t,e,n,i,r){var s=n._reactRootContainer;if(s){var a=s;if(typeof r=="function"){var o=r;r=function(){var l=Fl(a);o.call(l)}}ic(e,a,t,r)}else a=oy(n,e,t,r,i);return Fl(a)}Mg=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=ha(e.pendingLanes);n!==0&&(yf(e,n|1),un(e,Tt()),!(Ye&6)&&(Us=Tt()+500,ar()))}break;case 13:Dr(function(){var i=Ei(t,1);if(i!==null){var r=Qt();Xn(i,t,1,r)}}),Jf(t,1)}};Sf=function(t){if(t.tag===13){var e=Ei(t,134217728);if(e!==null){var n=Qt();Xn(e,t,134217728,n)}Jf(t,134217728)}};Eg=function(t){if(t.tag===13){var e=Ki(t),n=Ei(t,e);if(n!==null){var i=Qt();Xn(n,t,e,i)}Jf(t,e)}};wg=function(){return st};Tg=function(t,e){var n=st;try{return st=t,e()}finally{st=n}};Uu=function(t,e,n){switch(e){case"input":if(Ru(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var i=n[e];if(i!==t&&i.form===t.form){var r=Kl(i);if(!r)throw Error(te(90));ng(i),Ru(i,r)}}}break;case"textarea":rg(t,n);break;case"select":e=n.value,e!=null&&ys(t,!!n.multiple,e,!1)}};dg=Yf;fg=Dr;var ly={usingClientEntryPoint:!1,Events:[$a,fs,Kl,cg,ug,Yf]},ea={findFiberByHostInstance:Sr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},cy={bundleType:ea.bundleType,version:ea.version,rendererPackageName:ea.rendererPackageName,rendererConfig:ea.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Ci.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=mg(t),t===null?null:t.stateNode},findFiberByHostInstance:ea.findFiberByHostInstance||ay,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var xo=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!xo.isDisabled&&xo.supportsFiber)try{Xl=xo.inject(cy),ii=xo}catch{}}Sn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=ly;Sn.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!th(e))throw Error(te(200));return sy(t,e,null,n)};Sn.createRoot=function(t,e){if(!th(t))throw Error(te(299));var n=!1,i="",r=$v;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=Qf(t,1,!1,null,null,n,!1,i,r),t[Mi]=e.current,Da(t.nodeType===8?t.parentNode:t),new eh(e)};Sn.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(te(188)):(t=Object.keys(t).join(","),Error(te(268,t)));return t=mg(e),t=t===null?null:t.stateNode,t};Sn.flushSync=function(t){return Dr(t)};Sn.hydrate=function(t,e,n){if(!sc(e))throw Error(te(200));return ac(null,t,e,!0,n)};Sn.hydrateRoot=function(t,e,n){if(!th(t))throw Error(te(405));var i=n!=null&&n.hydratedSources||null,r=!1,s="",a=$v;if(n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(a=n.onRecoverableError)),e=Xv(e,null,t,1,n??null,r,!1,s,a),t[Mi]=e.current,Da(t),i)for(t=0;t<i.length;t++)n=i[t],r=n._getVersion,r=r(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,r]:e.mutableSourceEagerHydrationData.push(n,r);return new rc(e)};Sn.render=function(t,e,n){if(!sc(e))throw Error(te(200));return ac(null,t,e,!1,n)};Sn.unmountComponentAtNode=function(t){if(!sc(t))throw Error(te(40));return t._reactRootContainer?(Dr(function(){ac(null,null,t,!1,function(){t._reactRootContainer=null,t[Mi]=null})}),!0):!1};Sn.unstable_batchedUpdates=Yf;Sn.unstable_renderSubtreeIntoContainer=function(t,e,n,i){if(!sc(n))throw Error(te(200));if(t==null||t._reactInternals===void 0)throw Error(te(38));return ac(t,e,n,!1,i)};Sn.version="18.3.1-next-f1338f8080-20240426";function Yv(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Yv)}catch(t){console.error(t)}}Yv(),Ym.exports=Sn;var uy=Ym.exports,Np=uy;Su.createRoot=Np.createRoot,Su.hydrateRoot=Np.hydrateRoot;const nh={connected:!1,status:null,settings:null,phase:"offline",agents:[],stream:[],toolCalls:[],skills:[],plugins:[],memories:[],tasks:[],tools:[],providers:[],hardware:null,notifications:[],confirmations:[],speakingText:"",listening:!1,pulses:[],memoryPulse:0,routeSwap:null,wiringActivity:{},lastError:""};let Ze=nh;const pd=new Set;function qv(){for(const t of pd)t()}function it(t){Ze={...Ze,...t},qv()}function dy(t){const e={...t,id:`${Date.now()}-${Math.random().toString(36).slice(2,8)}`,ts:t.ts??Date.now()/1e3};it({stream:[...Ze.stream,e].slice(-400)})}function bi(t,e="",n=1){it({pulses:[...Ze.pulses,{kind:t,label:e,at:Date.now(),strength:n}].slice(-24)})}function ta(t){it({wiringActivity:{...Ze.wiringActivity,[t]:Date.now()}})}const _e={subscribe(t){return pd.add(t),()=>pd.delete(t)},get(){return Ze},reset(){Ze={...nh},qv()},setStatus(t){it({status:t})},setSettings(t){it({settings:t,phase:t.voice_enabled?Ze.phase:"idle"})},setConnected(t){it({connected:t,phase:t?Ze.phase==="offline"?"idle":Ze.phase:"offline"})},setPhase(t){Ze.phase!==t&&it({phase:t})},setError(t){it({lastError:t})},setAgents(t){it({agents:t})},ingestAgents(t){Array.isArray(t.agents)&&it({agents:t.agents})},setSkills(t){it({skills:t})},setPlugins(t){it({plugins:t})},setMemories(t){it({memories:t})},setTasks(t){it({tasks:t})},setTools(t){it({tools:t})},setProviders(t){it({providers:t})},setHardware(t){const e=Ze.hardware,n=t.sensors??[];it({hardware:{cpuPercent:Number(t.cpu?.percent_total??e?.cpuPercent??0),perCore:t.cpu?.percent_per_core??e?.perCore??[],freqMhz:Number(t.cpu?.freq_mhz??e?.freqMhz??0),memoryPercent:Number(t.memory?.percent??e?.memoryPercent??0),memoryUsedGb:Number(t.memory?.used_gb??e?.memoryUsedGb??0),memoryTotalGb:Number(t.memory?.total_gb??e?.memoryTotalGb??0),disks:(t.disks??[]).filter(i=>!i.io).map(i=>({mountpoint:String(i.mountpoint??""),free_gb:Number(i.free_gb??0),percent:Number(i.percent??0)})),temps:n.filter(i=>i.category==="temperature").map(i=>({name:String(i.name),category:"temperature",value:Number(i.value),unit:String(i.unit??"C"),source:String(i.source??"")})),fans:n.filter(i=>i.category==="fan").map(i=>({name:String(i.name),category:"fan",value:Number(i.value),unit:String(i.unit??"RPM"),source:String(i.source??"")})),volts:n.filter(i=>i.category==="voltage").map(i=>({name:String(i.name),category:"voltage",value:Number(i.value),unit:String(i.unit??"V"),source:String(i.source??"")})),alerts:(t.alerts??[]).map(i=>({severity:String(i.severity??"warning"),message:String(i.message??""),advice:i.advice})),verdict:String(t.verdict?.verdict??e?.verdict??"unknown"),summary:String(t.summary??e?.summary??""),sources:t.sources??e?.sources??{}}})},setConfirmations(t){it({confirmations:t})},appendStream(t){dy(t)},clearStream(){it({stream:[]})},notify(t){it({notifications:[...Ze.notifications,t].slice(-50)})}};function fy(t){const e=t.payload??{};switch(t.type){case"agent.thought":case"agent.token":{if(t.type==="agent.token")return;const n=e.kind==="error"?"toolError":"thought";_e.appendStream({kind:n,text:String(e.text??""),agentId:t.agent_id??void 0,agentName:e.name,role:e.role});break}case"agent.spawned":{const n=e,i=Ze.agents.filter(r=>r.id!==n.id);_e.setAgents([...i,n]),_e.appendStream({kind:"system",text:`${n.name} joined as ${n.title??n.role}${e.parent?` under ${e.parent}`:""}`}),bi("spawn",n.name);break}case"agent.state":{_e.setAgents(Ze.agents.map(i=>i.id===e.id?{...i,status:String(e.status)}:i)),(String(e.status)==="thinking"||String(e.status)==="acting")&&Ze.phase!=="speaking"&&_e.setPhase("working"),String(e.status)==="idle"&&Ze.agents.every(i=>i.status==="idle")&&Ze.phase==="working"&&_e.setPhase("idle");break}case"agent.retired":{_e.setAgents(Ze.agents.filter(n=>n.id!==e.id)),_e.appendStream({kind:"system",text:`${e.name} retired`});break}case"agent.report":{const n=String(e.report??"");n&&_e.appendStream({kind:"assistant",text:n,agentId:t.agent_id??void 0,agentName:e.name,role:e.role}),_e.setAgents(Ze.agents.map(i=>i.id===e.id?{...i,status:"idle",model:i.model}:i)),e.kind||_e.setPhase("idle");break}case"team.formed":{_e.appendStream({kind:"system",text:`Team "${e.name}" formed with ${e.size} agents, led by ${e.head}`}),bi("team",String(e.name??""),1.4);break}case"plan":{_e.appendStream({kind:"system",text:`▸ ${e.title}${e.agent?` → ${e.agent}`:""}`}),bi("plan",String(e.title??""),.6);break}case"tool.call":{const n={id:`${Date.now()}-${Math.random().toString(36).slice(2,6)}`,tool:String(e.tool),agentName:Ze.agents.find(i=>i.id===t.agent_id)?.name,running:!0,ts:Date.now()/1e3};it({toolCalls:[...Ze.toolCalls,n].slice(-60)}),bi("tool",n.tool,1),ta(String(e.category??n.tool.split(".")[0]));break}case"tool.result":{const n=[...Ze.toolCalls];for(let i=n.length-1;i>=0;i-=1)if(n[i].tool===e.tool&&n[i].running){n[i]={...n[i],running:!1,ok:!!e.ok,durationMs:Number(e.duration_ms??0),error:String(e.error??"")};break}it({toolCalls:n}),ta(String(e.tool).split(".")[0]);break}case"tool.denied":{_e.appendStream({kind:"alert",text:`Blocked ${e.tool}: ${e.reason}`});break}case"permission.request":{_e.setConfirmations([...Ze.confirmations,{id:String(e.id),tool:String(e.tool),args:e.args??{},reason:String(e.reason??""),agent_name:e.agent_name}]),_e.setPhase("alert");break}case"permission.result":{_e.setConfirmations(Ze.confirmations.filter(n=>n.id!==e.id)),_e.setPhase("working");break}case"model.selected":{_e.setAgents(Ze.agents.map(n=>n.id===t.agent_id?{...n,model:String(e.model),provider_id:String(e.provider_id)}:n)),ta(String(e.provider_id??"model"));break}case"provider.failover":{const n=e.to?.model?String(e.to.model):String(e.model??"unknown");it({routeSwap:{to:n,at:Date.now()}}),_e.appendStream({kind:"quota",text:`Provider failover → ${n}${e.reason?` (${String(e.reason).slice(0,120)})`:""}`}),bi("failover",n,1.6);break}case"quota.update":{const n=e,i=Ze.providers.filter(r=>r.id!==n.id);_e.setProviders([...i,n]),ta("quota");break}case"quota.event":{if(e.kind==="manager_report"){const n=e.changes??[];for(const i of n)_e.appendStream({kind:"quota",text:`Overwatch: ${i}`})}else e.message&&_e.appendStream({kind:"quota",text:`${String(e.severity??"notice").toUpperCase()}: ${e.message}`});break}case"memory.write":{it({memoryPulse:Ze.memoryPulse+1}),bi("memory",String(e.kind??""),.8);break}case"hardware.sample":{const n=Ze.hardware,i=(e.temps??[]).map(s=>({name:String(s.name),category:"temperature",value:Number(s.value),unit:"C",source:"lhm"})),r=(e.fans??[]).map(s=>({name:String(s.name),category:"fan",value:Number(s.value),unit:"RPM",source:"lhm"}));it({hardware:{cpuPercent:Number(e.cpu_percent??0),perCore:n?.perCore??[],freqMhz:n?.freqMhz??0,memoryPercent:Number(e.memory_percent??0),memoryUsedGb:n?.memoryUsedGb??0,memoryTotalGb:n?.memoryTotalGb??0,disks:n?.disks??[],temps:i.length?i:n?.temps??[],fans:r.length?r:n?.fans??[],volts:n?.volts??[],alerts:(e.alerts??[]).map(s=>({severity:String(s.severity),message:String(s.message),advice:s.advice})),verdict:String(e.verdict??n?.verdict??"unknown"),summary:String(e.summary??n?.summary??""),sources:n?.sources??{}}});break}case"hardware.alert":{const n=String(e.severity??"warning");_e.appendStream({kind:"alert",text:`${n==="critical"?"CRITICAL":"WARNING"}: ${e.message}${e.advice?` — ${e.advice}`:""}`}),_e.notify({message:String(e.message),severity:n,ts:Date.now()/1e3}),bi("alert",String(e.sensor??""),n==="critical"?2:1.2),n==="critical"&&_e.setPhase("alert");break}case"plugin.installed":case"plugin.loaded":{const n=e,i=Ze.plugins.filter(r=>r.id!==n.id);_e.setPlugins([...i,n]),t.type==="plugin.installed"&&e.id&&(_e.appendStream({kind:"system",text:`Capability installed: ${n.name??e.id}${n.tools?.length?` (${n.tools.join(", ")})`:""}`}),bi("plugin",String(n.name??e.id),1.5));break}case"plugin.error":{_e.appendStream({kind:"alert",text:`Plugin ${e.id} failed: ${e.error}`});break}case"voice.speak.start":{_e.setPhase("speaking"),it({speakingText:String(e.text??"")});break}case"voice.speak.end":{it({speakingText:""}),Ze.phase==="speaking"&&_e.setPhase("idle");break}case"voice.listen.start":{it({listening:!0}),_e.setPhase("listening");break}case"voice.listen.end":{it({listening:!1});break}case"user.input":{_e.appendStream({kind:"user",text:String(e.text??"")}),_e.setPhase("thinking");break}case"browser.tab":case"browser.session":case"whatsapp.state":{ta("browser");break}case"error":{const n=String(e.message??e.error??"unknown error");_e.appendStream({kind:"alert",text:n}),_e.setError(n);break}case"log":{const n=String(e.level??"INFO");(n==="WARNING"||n==="ERROR")&&_e.appendStream({kind:"system",text:`${n}: ${e.message}`});break}}}function ke(t){return xe.useSyncExternalStore(_e.subscribe,()=>t(Ze),()=>t(nh))}const Dp="vyralis.token";function hy(){const e=new URLSearchParams(window.location.search).get("token");return e?(window.localStorage.setItem(Dp,e),e):window.localStorage.getItem(Dp)??""}let Ha=hy();function py(){return Ha}function my(){const t={"content-type":"application/json"};return Ha&&(t["x-vyralis-token"]=Ha),t}async function lt(t,e){const n=await fetch(t,{...e,headers:{...my(),...e?.headers??{}}});if(!n.ok){let i=`${n.status} ${n.statusText}`;try{const r=await n.json();r?.detail&&(i=typeof r.detail=="string"?r.detail:JSON.stringify(r.detail))}catch{}throw new Error(i)}if(n.status!==204)return await n.json()}const rt={status:()=>lt("/api/status"),tools:()=>lt("/api/tools"),skills:()=>lt("/api/skills"),plugins:()=>lt("/api/plugins"),tasks:()=>lt("/api/tasks"),memory:(t="")=>lt(`/api/memory?limit=80${t?`&query=${encodeURIComponent(t)}`:""}`),providers:()=>lt("/api/providers"),confirmations:()=>lt("/api/confirmations"),settings:()=>lt("/api/settings"),probe:()=>lt("/api/config/probe"),sendMessage:(t,e="chat")=>lt("/api/message",{method:"POST",body:JSON.stringify({text:t,channel:e,background:!0})}),stop:()=>lt("/api/stop",{method:"POST"}),resolveConfirmation:(t,e)=>lt(`/api/confirmations/${t}`,{method:"POST",body:JSON.stringify({approved:e})}),speak:t=>lt("/api/speech",{method:"POST",body:JSON.stringify({text:t})}),updateSettings:t=>lt("/api/settings",{method:"PATCH",body:JSON.stringify(t)}),addProvider:t=>lt("/api/providers",{method:"POST",body:JSON.stringify(t)}),updateProvider:(t,e)=>lt(`/api/providers/${t}`,{method:"PATCH",body:JSON.stringify(e)}),deleteProvider:t=>lt(`/api/providers/${t}`,{method:"DELETE"}),testProvider:t=>lt(`/api/providers/${t}/test`,{method:"POST"}),providerModels:t=>lt(`/api/providers/${t}/models`,{method:"POST"}),hardware:()=>lt("/api/hardware?processes=6&history=true"),retireAgent:t=>lt(`/api/agents/${t}/retire`,{method:"POST"}),runSkill:(t,e)=>lt(`/api/skills/${t}/run`,{method:"POST",body:JSON.stringify({inputs:e})}),forgetSkill:t=>lt(`/api/skills/${t}`,{method:"DELETE"}),forgetMemory:t=>lt(`/api/memory/${t}`,{method:"DELETE"}),reloadPlugin:t=>lt(`/api/plugins/${t}/reload`,{method:"POST"}),uninstallPlugin:t=>lt(`/api/plugins/${t}`,{method:"DELETE"})};function gy(){let t=null,e=!1,n=0,i;const r=()=>{if(e)return;const a=`${window.location.protocol==="https:"?"wss":"ws"}://${window.location.host}/ws${Ha?`?token=${encodeURIComponent(Ha)}`:""}`;t=new WebSocket(a),t.onopen=()=>{n=0,_e.setConnected(!0)},t.onmessage=o=>{try{const l=JSON.parse(o.data);if(l.type==="hello"){l.payload?.status&&_e.setStatus(l.payload.status),l.payload?.settings&&_e.setSettings(l.payload.settings),l.payload?.status?.providers&&_e.setProviders(l.payload.status.providers);return}if(l.type==="probe"){_e.setStatus(l.payload);return}fy(l)}catch{}},t.onclose=()=>{if(_e.setConnected(!1),e)return;n+=1;const o=Math.min(8e3,400*2**Math.min(n,5));i=window.setTimeout(r,o)},t.onerror=()=>{t?.close()}};return r(),{close:()=>{e=!0,i&&window.clearTimeout(i),t?.close()},send:(s,a)=>{t?.readyState===WebSocket.OPEN&&t.send(JSON.stringify({type:s,payload:a}))}}}const vy={main:"MAIN",manager:"OVERWATCH",head:"SQUAD LEAD",employee:"OPERATOR",specialist:"ANALYST"},_y={idle:"#4b6f8a",thinking:"#31E6FF",acting:"#7C5CFF",working:"#2ED573",waiting:"#F5A524",blocked:"#FF5470",retired:"#33404d"};function xy(t){switch(t){case"idle":return"STANDBY";case"listening":return"LISTENING";case"thinking":return"REASONING";case"working":return"EXECUTING";case"speaking":return"SPEAKING";case"alert":return"ATTENTION";default:return"OFFLINE"}}function yy(t){const e=Math.max(0,Math.floor(t)),n=Math.floor(e/3600),i=Math.floor(e%3600/60),r=e%60;return`${n.toString().padStart(2,"0")}:${i.toString().padStart(2,"0")}:${r.toString().padStart(2,"0")}`}function Sy({onTogglePanels:t,voiceEnabled:e,onToggleVoice:n}){const i=ke(p=>p.connected),r=ke(p=>p.status),s=ke(p=>p.phase),a=ke(p=>p.agents.length),o=ke(p=>p.status?.model.open_routes??0),l=ke(p=>p.status?.tools.count??0),c=r?.info.uptime_s??0,[d,h]=xe.useState(c);xe.useEffect(()=>{h(c)},[c]),xe.useEffect(()=>{const p=window.setInterval(()=>h(_=>_+1),1e3);return()=>window.clearInterval(p)},[]);const f=async()=>{try{await rt.stop()}catch{}};return w.jsxs("header",{className:"topbar",children:[w.jsxs("div",{className:"brand",children:[w.jsx("span",{className:"brand-mark","data-phase":s}),w.jsxs("div",{className:"brand-text",children:[w.jsx("strong",{children:"VYRALIS"}),w.jsx("span",{children:r?.info.tagline??"Sovereign Desktop Agent Runtime"})]})]}),w.jsxs("div",{className:"topbar-metrics",children:[w.jsx(mi,{label:"STATE",value:xy(s),accent:s}),w.jsx(mi,{label:"AGENTS",value:String(a)}),w.jsx(mi,{label:"ROUTES",value:String(o)}),w.jsx(mi,{label:"TOOLS",value:String(l)}),w.jsx(mi,{label:"UPTIME",value:yy(d)}),w.jsx(mi,{label:"LINK",value:i?"LIVE":"DOWN",accent:i?"idle":"alert"})]}),w.jsxs("div",{className:"topbar-actions",children:[w.jsx("button",{className:"chip",onClick:n,title:"Toggle spoken replies",children:e?"VOICE ON":"VOICE OFF"}),w.jsx("button",{className:"chip",onClick:f,title:"Stop all running agents",children:"HALT"}),w.jsx("button",{className:"chip chip-primary",onClick:t,title:"Open configuration panels",children:"PANELS"})]})]})}function mi({label:t,value:e,accent:n}){return w.jsxs("div",{className:`metric ${n?`accent-${n}`:""}`,children:[w.jsx("span",{className:"metric-label",children:t}),w.jsx("span",{className:"metric-value",children:e})]})}function My(){const t=ke(s=>s.agents),[e,n]=xe.useState(null),i=xe.useMemo(()=>[...t].sort((s,a)=>(a.rank??0)-(s.rank??0)),[t]),r=async s=>{try{await rt.retireAgent(s.id)}catch{}};return w.jsxs("section",{className:"rail",children:[w.jsxs("h2",{className:"panel-title",children:["Agents ",w.jsx("span",{className:"panel-count",children:i.length})]}),w.jsxs("div",{className:"rail-list",children:[i.map(s=>w.jsxs("article",{className:`agent-card ${e===s.id?"expanded":""}`,onClick:()=>n(e===s.id?null:s.id),children:[w.jsxs("div",{className:"agent-head",children:[w.jsx("span",{className:"agent-dot",style:{background:_y[s.status]??"#4b6f8a"},title:s.status}),w.jsx("span",{className:"agent-name",children:s.name}),w.jsxs("span",{className:"agent-rank",children:["R",s.rank]})]}),w.jsxs("div",{className:"agent-meta",children:[w.jsx("span",{children:vy[s.role]??s.role.toUpperCase()}),w.jsx("span",{className:"agent-model",children:s.model??"no model"})]}),e===s.id&&w.jsxs("div",{className:"agent-detail",children:[s.mandate&&w.jsx("p",{className:"agent-mandate",children:s.mandate}),w.jsxs("p",{className:"agent-grant",children:["grant: ",(s.grant??["all"]).slice(0,4).join(", "),(s.grant?.length??0)>4?` +${(s.grant?.length??0)-4}`:""]}),w.jsxs("p",{className:"agent-grant",children:["provider: ",s.provider_id??"auto"]}),s.role!=="main"&&w.jsx("button",{className:"chip chip-danger",onClick:a=>{a.stopPropagation(),r(s)},children:"RETIRE"})]})]},s.id)),i.length===0&&w.jsx("p",{className:"empty",children:"No agents yet."})]})]})}function Ey(){const t=ke(o=>o.hardware),e=ke(o=>o.providers),n=ke(o=>o.tasks),i=ke(o=>o.skills.length),r=ke(o=>o.plugins.length),s=xe.useMemo(()=>[...t?.temps??[]].sort((o,l)=>l.value-o.value).slice(0,4),[t]),a=(t?.fans??[]).slice(0,3);return w.jsxs("section",{className:"rail rail-right",children:[w.jsxs("h2",{className:"panel-title",children:["System ",w.jsx("span",{className:`verdict verdict-${t?.verdict??"unknown"}`,children:t?.verdict??"unknown"})]}),w.jsxs("div",{className:"gauge",children:[w.jsx(Ip,{label:"CPU",value:t?.cpuPercent??0,detail:`${Math.round(t?.freqMhz??0)} MHz`}),w.jsx(Ip,{label:"RAM",value:t?.memoryPercent??0,detail:`${(t?.memoryUsedGb??0).toFixed(1)}/${(t?.memoryTotalGb??0).toFixed(1)} GB`})]}),s.length>0&&w.jsx("div",{className:"sensors",children:s.map(o=>w.jsxs("div",{className:"sensor",children:[w.jsx("span",{className:"sensor-name",title:o.name,children:o.name.replace(/^.*?\//,"").slice(0,18)}),w.jsxs("span",{className:`sensor-value ${o.value>=85?"hot":o.value>=75?"warm":""}`,children:[Math.round(o.value),"°"]})]},o.name))}),a.length>0&&w.jsx("div",{className:"sensors",children:a.map(o=>w.jsxs("div",{className:"sensor",children:[w.jsx("span",{className:"sensor-name",title:o.name,children:o.name.replace(/^.*?\//,"").slice(0,18)}),w.jsxs("span",{className:"sensor-value",children:[Math.round(o.value)," rpm"]})]},o.name))}),(t?.disks??[]).slice(0,2).map(o=>w.jsxs("div",{className:"sensor",children:[w.jsx("span",{className:"sensor-name",title:o.mountpoint,children:o.mountpoint.length>16?`…${o.mountpoint.slice(-15)}`:o.mountpoint}),w.jsxs("span",{className:`sensor-value ${o.free_gb<5?"hot":""}`,children:[o.free_gb.toFixed(1)," GB free"]})]},o.mountpoint)),w.jsxs("h2",{className:"panel-title",children:["Model pool ",w.jsx("span",{className:"panel-count",children:e.length})]}),w.jsxs("div",{className:"pool",children:[e.map(o=>{const l=o.rpm?o.requests_minute/o.rpm:0,c=o.tpm?o.tokens_minute/o.tpm:0,d=Math.max(l,c);return w.jsxs("div",{className:"provider-row",children:[w.jsxs("div",{className:"provider-head",children:[w.jsx("span",{className:o.cooling?"dot hot":o.enabled?"dot ok":"dot off"}),w.jsx("span",{className:"provider-name",children:o.label||o.id}),w.jsx("span",{className:"provider-model",children:o.model||"—"})]}),w.jsx("div",{className:"bar",children:w.jsx("div",{className:`bar-fill ${d>.85?"hot":d>.6?"warm":""}`,style:{width:`${Math.min(100,d*100)}%`}})}),w.jsxs("div",{className:"provider-foot",children:[w.jsx("span",{children:o.tier}),w.jsxs("span",{children:[o.requests_minute,o.rpm?`/${o.rpm}`:""," rpm"]}),w.jsxs("span",{children:[o.tokens_minute,o.tpm?`/${o.tpm}`:""," tpm"]}),o.cooling&&w.jsxs("span",{className:"hot",children:["cooling ",Math.ceil(o.cooldown_seconds),"s"]})]})]},o.id)}),e.length===0&&w.jsx("p",{className:"empty",children:"No provider configured."})]}),w.jsxs("div",{className:"counters",children:[w.jsx(mi,{label:"TASKS",value:String(n.length)}),w.jsx(mi,{label:"SKILLS",value:String(i)}),w.jsx(mi,{label:"PLUGINS",value:String(r)})]}),(t?.alerts??[]).length>0&&w.jsx("div",{className:"alert-box",children:t?.alerts.slice(-3).map((o,l)=>w.jsx("p",{className:`alert-${o.severity}`,children:o.message},l))})]})}function Ip({label:t,value:e,detail:n}){const i=Math.max(0,Math.min(100,e));return w.jsxs("div",{className:"gauge-item",children:[w.jsx("div",{className:"gauge-ring",style:{"--value":`${i*3.6}deg`},children:w.jsxs("span",{children:[Math.round(i),"%"]})}),w.jsxs("div",{className:"gauge-meta",children:[w.jsx("strong",{children:t}),n&&w.jsx("span",{children:n})]})]})}function wy(t){switch(t.kind){case"user":return"▸";case"assistant":return"◆";case"thought":return"·";case"toolError":return"⚠";case"alert":return"⚠";case"quota":return"⇄";case"system":return"▪";default:return"·"}}function Ty({voice:t}){const e=ke(s=>s.stream),n=ke(s=>s.phase),i=ke(s=>s.speakingText),r=xe.useRef(null);return xe.useEffect(()=>{const s=r.current;s&&(s.scrollTop=s.scrollHeight)},[e.length]),w.jsxs("section",{className:"stream",children:[w.jsxs("div",{className:"stream-head",children:[w.jsx("h2",{className:"panel-title",children:"Transcript"}),i&&w.jsx("span",{className:"speaking-badge",children:"speaking"}),n==="thinking"&&w.jsx("span",{className:"thinking-badge",children:"reasoning…"})]}),w.jsxs("div",{className:"stream-body",ref:r,children:[e.map(s=>w.jsxs("div",{className:`stream-item kind-${s.kind}`,children:[w.jsx("span",{className:"stream-icon",children:wy(s)}),w.jsxs("div",{className:"stream-text",children:[s.agentName&&s.kind!=="user"&&w.jsx("span",{className:"stream-agent",children:s.agentName}),w.jsx("pre",{children:s.text})]})]},s.id)),t.interim&&w.jsxs("div",{className:"stream-item kind-user interim",children:[w.jsx("span",{className:"stream-icon",children:"▸"}),w.jsx("div",{className:"stream-text",children:w.jsx("pre",{children:t.interim})})]}),e.length===0&&w.jsx("p",{className:"empty center",children:"Speak, or type below. Vyralis can drive this machine and the browser it already has."})]})]})}function Ay({onSend:t,onMicDown:e,onMicUp:n,listening:i,sttSupported:r}){const[s,a]=xe.useState(""),[o,l]=xe.useState(!1),c=()=>{const d=s.trim();d&&(t(d),a(""))};return xe.useEffect(()=>{const d=p=>{const _=p.target;return!!(_&&(_.tagName==="INPUT"||_.tagName==="TEXTAREA"||_.isContentEditable))},h=p=>{p.code!=="Space"||d(p)||(p.preventDefault(),e())},f=p=>{p.code!=="Space"||d(p)||(p.preventDefault(),n())};return window.addEventListener("keydown",h),window.addEventListener("keyup",f),()=>{window.removeEventListener("keydown",h),window.removeEventListener("keyup",f)}},[e,n]),w.jsxs("div",{className:"composer",children:[w.jsx("button",{className:`orb ${i?"orb-live":""}`,onMouseDown:e,onMouseUp:n,onMouseLeave:()=>i&&n(),onTouchStart:d=>{d.preventDefault(),e()},onTouchEnd:d=>{d.preventDefault(),n()},title:r?"Hold to speak (or hold space)":"Speech recognition unavailable in this browser",disabled:!r,children:w.jsx("span",{className:"orb-core"})}),w.jsxs("div",{className:"composer-main",children:[w.jsx("button",{className:"chip",onClick:()=>l(d=>!d),children:o?"HIDE KEYBOARD":"TYPE INSTEAD"}),o&&w.jsxs("form",{className:"composer-form",onSubmit:d=>{d.preventDefault(),c()},children:[w.jsx("input",{value:s,autoFocus:!0,placeholder:"Type a request and press Enter…",onChange:d=>a(d.target.value)}),w.jsx("button",{className:"chip chip-primary",type:"submit",children:"SEND"})]}),!o&&w.jsx("span",{className:"composer-hint",children:"Hold the orb or the space bar to speak"})]})]})}function Cy({confirmation:t,onDecide:e}){return w.jsx("div",{className:"modal-backdrop",children:w.jsxs("div",{className:"modal",children:[w.jsx("h3",{children:"Approval required"}),w.jsxs("p",{className:"modal-sub",children:[t.agent_name?`${t.agent_name} wants`:"An agent wants"," to run"," ",w.jsx("code",{children:t.tool})]}),w.jsx("p",{className:"modal-reason",children:t.reason}),w.jsx("pre",{className:"modal-args",children:JSON.stringify(t.args,null,2)}),w.jsxs("div",{className:"modal-actions",children:[w.jsx("button",{className:"chip chip-danger",onClick:()=>e(!1),children:"DENY"}),w.jsx("button",{className:"chip chip-primary",onClick:()=>e(!0),children:"APPROVE"})]}),w.jsx("p",{className:"modal-foot",children:"Nothing runs until you answer. This request times out after 2 minutes."})]})})}function Ry(){const t=ke(s=>s.notifications),e=ke(s=>s.lastError),[n,i]=xe.useState(0),r=t.slice(-3);return r.length===0&&!e?null:w.jsxs("div",{className:"toasts",children:[r.map((s,a)=>w.jsx("div",{className:`toast toast-${s.severity}`,children:s.message},`${s.ts}-${a}`)),e&&w.jsx("div",{className:"toast toast-error",onClick:()=>i(n+1),children:e})]})}const Py=[{id:"capabilities",label:"Capabilities"},{id:"model",label:"Model pool"},{id:"memory",label:"Memory"},{id:"skills",label:"Skills"},{id:"plugins",label:"Plugins"},{id:"tasks",label:"Tasks"},{id:"settings",label:"Settings"}];function by({open:t,onClose:e}){const[n,i]=xe.useState("capabilities"),r=ke(S=>S.status),s=ke(S=>S.settings),a=ke(S=>S.tools),o=ke(S=>S.memories),l=ke(S=>S.skills),c=ke(S=>S.plugins),d=ke(S=>S.tasks),h=ke(S=>S.providers),[f,p]=xe.useState(""),[_,y]=xe.useState(""),[m,u]=xe.useState([]),[g,v]=xe.useState("");xe.useEffect(()=>{t&&(async()=>{try{u((await rt.probe()).missing_setup)}catch{u([])}try{_e.setTools((await rt.tools()).tools)}catch{}try{_e.setSkills((await rt.skills()).skills)}catch{}try{_e.setPlugins((await rt.plugins()).plugins)}catch{}try{_e.setTasks((await rt.tasks()).tasks)}catch{}try{_e.setMemories((await rt.memory()).memories)}catch{}try{const S=await rt.providers();_e.setProviders(S.providers)}catch{}})()},[t]);const E=xe.useMemo(()=>{const S=new Map;for(const C of a){const P=f.trim().toLowerCase();if(P&&!`${C.name} ${C.description}`.toLowerCase().includes(P))continue;const X=S.get(C.category)??[];X.push(C),S.set(C.category,X)}return[...S.entries()].sort((C,P)=>C[0].localeCompare(P[0]))},[a,f]);if(!t)return null;const b=async S=>{y(S);try{const C=await rt.memory(S);_e.setMemories(C.memories)}catch{}};return w.jsxs("div",{className:"drawer",children:[w.jsxs("div",{className:"drawer-head",children:[w.jsx("nav",{className:"tabs",children:Py.map(S=>w.jsx("button",{className:`tab ${n===S.id?"active":""}`,onClick:()=>i(S.id),children:S.label},S.id))}),w.jsx("button",{className:"chip",onClick:e,children:"CLOSE"})]}),g&&w.jsx("p",{className:"drawer-message",children:g}),w.jsxs("div",{className:"drawer-body",children:[n==="capabilities"&&w.jsxs(w.Fragment,{children:[w.jsxs("div",{className:"drawer-tools",children:[w.jsx("input",{className:"field",placeholder:"Filter capabilities…",value:f,onChange:S=>p(S.target.value)}),w.jsxs("span",{className:"hint",children:[a.length," tools registered"]})]}),E.map(([S,C])=>w.jsxs("section",{className:"tool-group",children:[w.jsxs("h4",{children:[S," ",w.jsx("span",{className:"panel-count",children:C.length})]}),C.map(P=>w.jsxs("div",{className:"tool-row",children:[w.jsx("code",{children:P.name}),w.jsx("span",{className:`perm perm-${P.permission}`,children:P.permission}),w.jsx("p",{children:P.description})]},P.name))]},S))]}),n==="model"&&w.jsxs(w.Fragment,{children:[w.jsx(Ny,{onDone:v}),w.jsx("div",{className:"provider-table",children:h.map(S=>w.jsxs("div",{className:"provider-card",children:[w.jsxs("div",{className:"provider-card-head",children:[w.jsx("strong",{children:S.label||S.id}),w.jsx("span",{className:"provider-model",children:S.model}),w.jsx("span",{className:`perm perm-${S.has_key?"safe":"destructive"}`,children:S.has_key?"key set":"no key"}),S.cooling&&w.jsxs("span",{className:"hot",children:["cooling ",Math.ceil(S.cooldown_seconds),"s"]})]}),w.jsx("p",{className:"provider-url",children:S.base_url}),w.jsxs("div",{className:"provider-stats",children:[w.jsxs("span",{children:[S.requests_minute,"/",S.rpm||"∞"," rpm"]}),w.jsxs("span",{children:[S.requests_day,"/",S.rpd||"∞"," rpd"]}),w.jsxs("span",{children:[S.tokens_minute,"/",S.tpm||"∞"," tpm"]}),w.jsxs("span",{children:[S.tokens_day,"/",S.tpd||"∞"," tpd"]}),w.jsxs("span",{children:["tier ",S.tier]}),w.jsxs("span",{children:["failures ",S.failures]})]}),S.blocked_reason&&w.jsx("p",{className:"hot",children:S.blocked_reason}),S.last_error&&w.jsxs("p",{className:"hint",children:["last error: ",S.last_error]}),w.jsxs("div",{className:"provider-actions",children:[w.jsx("button",{className:"chip",onClick:async()=>{const C=await rt.testProvider(S.id);v(C.ok?`${S.id}: replied "${C.reply}" using ${C.model}`:`${S.id}: ${C.error}`)},children:"TEST"}),w.jsx("button",{className:"chip",onClick:async()=>{await rt.updateProvider(S.id,{enabled:!S.enabled}),v(`${S.id} ${S.enabled?"disabled":"enabled"}`)},children:S.enabled?"DISABLE":"ENABLE"}),w.jsx("button",{className:"chip chip-danger",onClick:async()=>{await rt.deleteProvider(S.id),v(`${S.id} removed`)},children:"REMOVE"})]})]},S.id))})]}),n==="memory"&&w.jsxs(w.Fragment,{children:[w.jsxs("div",{className:"drawer-tools",children:[w.jsx("input",{className:"field",placeholder:"Search memory…",value:_,onChange:S=>void b(S.target.value)}),w.jsxs("span",{className:"hint",children:[r?.memory.memories??o.length," stored"]})]}),o.map(S=>w.jsxs("div",{className:"memory-row",children:[w.jsxs("div",{className:"memory-head",children:[w.jsx("span",{className:`kind kind-${S.kind}`,children:S.kind}),w.jsxs("span",{className:"hint",children:[S.scope,S.agent_id?` · ${S.agent_id}`:"",S.access_count?` · used ${S.access_count}×`:""]}),w.jsx("button",{className:"chip chip-danger",onClick:()=>void rt.forgetMemory(S.id),children:"FORGET"})]}),w.jsx("p",{children:S.content})]},S.id)),o.length===0&&w.jsx("p",{className:"empty",children:"Nothing stored yet."})]}),n==="skills"&&w.jsxs(w.Fragment,{children:[w.jsx("p",{className:"hint",children:"A skill is a recorded routine: the agent replays the actions directly instead of looking at the screen again. Stale skills are re-recorded the next time they fail."}),l.map(S=>w.jsxs("div",{className:"skill-row",children:[w.jsxs("div",{className:"skill-head",children:[w.jsx("strong",{children:S.name}),w.jsx("span",{className:S.stale?"hot":"ok",children:S.stale?"stale":`${Math.round(S.reliability*100)}% reliable`}),w.jsxs("span",{className:"hint",children:[S.step_count," steps · ",S.uses," runs"]})]}),w.jsx("p",{children:S.description}),Object.keys(S.parameters).length>0&&w.jsxs("p",{className:"hint",children:["inputs: ",Object.keys(S.parameters).join(", ")]}),w.jsxs("div",{className:"provider-actions",children:[w.jsx("button",{className:"chip",onClick:async()=>{const C={};for(const X of Object.keys(S.parameters)){const x=window.prompt(`Value for ${X}:`,"");if(x===null)return;C[X]=x}const P=await rt.runSkill(S.id,C);v(P.ok?`${S.name}: ${P.steps_run} steps in ${P.duration_ms} ms`:`${S.name} failed at step ${P.failed_at_step} (${P.failed_tool})`)},children:"RUN"}),w.jsx("button",{className:"chip chip-danger",onClick:async()=>{await rt.forgetSkill(S.id),v(`${S.name} forgotten`)},children:"FORGET"})]})]},S.id)),l.length===0&&w.jsx("p",{className:"empty",children:"No skills yet. Ask for a repetitive task; Vyralis records it and turns it into a direct action for next time."})]}),n==="plugins"&&w.jsxs(w.Fragment,{children:[w.jsx("p",{className:"hint",children:"Plugins are capabilities Vyralis wrote for itself. Installing one runs Python inside the runtime with the same rights as Vyralis, so installation is confirmed first."}),c.map(S=>w.jsxs("div",{className:"plugin-row",children:[w.jsxs("div",{className:"plugin-head",children:[w.jsx("strong",{children:S.name||S.id}),w.jsxs("span",{className:"hint",children:["v",S.version??"0.0.1"]}),S.generated&&w.jsx("span",{className:"kind",children:"self-written"}),w.jsx("span",{className:S.ok===!1?"hot":"ok",children:S.ok===!1?"error":"loaded"})]}),S.description&&w.jsx("p",{children:S.description}),S.tools&&S.tools.length>0&&w.jsxs("p",{className:"hint",children:["tools: ",S.tools.join(", ")]}),S.error&&w.jsx("p",{className:"hot",children:S.error}),w.jsxs("div",{className:"provider-actions",children:[w.jsx("button",{className:"chip",onClick:async()=>{try{const C=await rt.reloadPlugin(S.id);v(C.ok?`${S.id} reloaded`:`${S.id}: ${C.error}`)}catch(C){v(String(C))}},children:"RELOAD"}),w.jsx("button",{className:"chip chip-danger",onClick:async()=>{await rt.uninstallPlugin(S.id),v(`${S.id} uninstalled`)},children:"UNINSTALL"})]})]},S.id)),c.length===0&&w.jsx("p",{className:"empty",children:"No plugins installed yet."})]}),n==="tasks"&&w.jsxs(w.Fragment,{children:[d.map(S=>w.jsxs("div",{className:"task-row",children:[w.jsxs("div",{className:"task-head",children:[w.jsx("span",{className:`status status-${S.status}`,children:S.status}),w.jsx("strong",{children:S.title}),w.jsx("span",{className:"hint",children:S.agent_id??"unassigned"})]}),S.result&&w.jsx("pre",{className:"task-result",children:S.result.slice(0,900)})]},S.id)),d.length===0&&w.jsx("p",{className:"empty",children:"No tasks yet."})]}),n==="settings"&&s&&w.jsx(Ly,{settings:s,missing:m,onMessage:v})]})]})}function Ly({settings:t,missing:e,onMessage:n}){const i=async(r,s)=>{await rt.updateSettings(r),n(s)};return w.jsxs(w.Fragment,{children:[w.jsxs("section",{className:"settings-block",children:[w.jsx("h4",{children:"Permissions"}),w.jsxs("label",{className:"row",children:[w.jsx("span",{children:"Mode"}),w.jsxs("select",{value:t.permission_mode,onChange:r=>void i({permission_mode:r.target.value},`Permission mode: ${r.target.value}`),children:[w.jsx("option",{value:"ask",children:"ask — confirm destructive actions"}),w.jsx("option",{value:"auto",children:"auto — run everything, no prompts"}),w.jsx("option",{value:"deny",children:"deny — read-only, block all mutations"})]})]}),w.jsxs("p",{className:"hint",children:["Always confirmed: ",(t.require_confirmation_for??[]).join(", ")||"none"]}),w.jsxs("p",{className:"hint",children:["Filesystem allowlist: ",(t.fs_allowlist??[]).join(" · ")||"home directory"]})]}),w.jsxs("section",{className:"settings-block",children:[w.jsx("h4",{children:"Voice"}),w.jsxs("label",{className:"row",children:[w.jsx("span",{children:"Spoken replies"}),w.jsx("input",{type:"checkbox",checked:t.voice_enabled,onChange:r=>void i({voice_enabled:r.target.checked},`Voice ${r.target.checked?"on":"off"}`)})]}),w.jsxs("label",{className:"row",children:[w.jsx("span",{children:"Engine"}),w.jsxs("select",{value:t.voice_engine,onChange:r=>void i({voice_engine:r.target.value},`Voice engine: ${r.target.value}`),children:[w.jsx("option",{value:"browser",children:"browser (built in, no download)"}),w.jsx("option",{value:"local",children:"local (offline TTS/STT)"}),w.jsx("option",{value:"provider",children:"provider (cloud voice model)"})]})]})]}),w.jsxs("section",{className:"settings-block",children:[w.jsx("h4",{children:"Interface"}),w.jsxs("label",{className:"row",children:[w.jsx("span",{children:"Particles"}),w.jsx("input",{type:"range",min:3e3,max:6e4,step:1e3,value:t.gui_particle_count,onChange:r=>void i({gui_particle_count:Number(r.target.value)},"Particle count set (reload to apply)")}),w.jsx("span",{className:"hint",children:t.gui_particle_count})]}),w.jsxs("label",{className:"row",children:[w.jsx("span",{children:"Wiring graph"}),w.jsx("input",{type:"checkbox",checked:t.gui_show_wiring,onChange:r=>void i({gui_show_wiring:r.target.checked},"Wiring toggled")})]}),w.jsxs("label",{className:"row",children:[w.jsx("span",{children:"Reduced motion"}),w.jsx("input",{type:"checkbox",checked:t.gui_reduced_motion,onChange:r=>void i({gui_reduced_motion:r.target.checked},"Motion setting saved")})]})]}),w.jsxs("section",{className:"settings-block",children:[w.jsx("h4",{children:"Agent limits"}),w.jsxs("label",{className:"row",children:[w.jsx("span",{children:"Max subagents"}),w.jsx("input",{type:"number",min:0,max:32,value:t.max_subagents,onChange:r=>void i({max_subagents:Number(r.target.value)},"Subagent limit saved")})]}),w.jsxs("label",{className:"row",children:[w.jsx("span",{children:"Parallel tools"}),w.jsx("input",{type:"number",min:1,max:16,value:t.max_parallel_tools,onChange:r=>void i({max_parallel_tools:Number(r.target.value)},"Parallelism saved")})]}),w.jsxs("label",{className:"row",children:[w.jsx("span",{children:"Browser channel"}),w.jsx("input",{value:t.browser_channel,onChange:r=>void i({browser_channel:r.target.value},"Browser channel saved")})]})]}),w.jsxs("section",{className:"settings-block",children:[w.jsx("h4",{children:"Hardware thresholds"}),Object.entries(t.hardware??{}).map(([r,s])=>w.jsxs("div",{className:"row",children:[w.jsx("span",{children:r.replace(/_/g," ")}),w.jsx("span",{className:"hint",children:String(s)})]},r)),w.jsx("p",{className:"hint",children:"For fan, voltage and package-temperature telemetry, run LibreHardwareMonitor with its web server enabled and point VYRALIS_LHM_URL at it."})]}),e.length>0&&w.jsxs("section",{className:"settings-block",children:[w.jsx("h4",{children:"Setup still outstanding"}),e.map(r=>w.jsx("p",{className:"hot",children:r},r))]})]})}function Ny({onDone:t}){const[e,n]=xe.useState(!1),[i,r]=xe.useState({id:"",label:"",base_url:"",api_key:"",model:"",audio_model:"",tier:"standard",rpm:0,rpd:0,tpm:0,tpd:0,supports_tools:!0,supports_vision:!1});return e?w.jsxs("form",{className:"provider-form",onSubmit:async s=>{s.preventDefault();try{await rt.addProvider({...i,id:i.id.trim().toLowerCase()}),t(`${i.id} added`),n(!1),r({...i,id:"",label:"",base_url:"",api_key:"",model:""})}catch(a){t(String(a))}},children:[w.jsx("p",{className:"hint",children:"Any OpenAI-compatible endpoint works: OpenAI, Anthropic, OpenRouter, Groq, Together, DeepSeek, LM Studio, Ollama, or your own gateway. Quota limits feed the manager agent, which uses them to pick models and to fail over before things break."}),w.jsxs("div",{className:"form-grid",children:[w.jsx("input",{className:"field",placeholder:"id (e.g. groq)",required:!0,value:i.id,onChange:s=>r({...i,id:s.target.value})}),w.jsx("input",{className:"field",placeholder:"label",value:i.label,onChange:s=>r({...i,label:s.target.value})}),w.jsx("input",{className:"field span-2",placeholder:"base url (https://api.groq.com/openai/v1)",required:!0,value:i.base_url,onChange:s=>r({...i,base_url:s.target.value})}),w.jsx("input",{className:"field span-2",placeholder:"api key",type:"password",value:i.api_key,onChange:s=>r({...i,api_key:s.target.value})}),w.jsx("input",{className:"field",placeholder:"model id",required:!0,value:i.model,onChange:s=>r({...i,model:s.target.value})}),w.jsx("input",{className:"field",placeholder:"realtime/audio model (optional)",value:i.audio_model,onChange:s=>r({...i,audio_model:s.target.value})}),w.jsxs("select",{className:"field",value:i.tier,onChange:s=>r({...i,tier:s.target.value}),children:[w.jsx("option",{value:"local",children:"local"}),w.jsx("option",{value:"economy",children:"economy"}),w.jsx("option",{value:"standard",children:"standard"}),w.jsx("option",{value:"frontier",children:"frontier"})]}),["rpm","rpd","tpm","tpd"].map(s=>w.jsx("input",{className:"field",type:"number",min:0,placeholder:s.toUpperCase(),value:i[s]||"",onChange:a=>r({...i,[s]:Number(a.target.value)})},s))]}),w.jsxs("div",{className:"form-flags",children:[w.jsxs("label",{children:[w.jsx("input",{type:"checkbox",checked:i.supports_tools,onChange:s=>r({...i,supports_tools:s.target.checked})}),"function calling"]}),w.jsxs("label",{children:[w.jsx("input",{type:"checkbox",checked:i.supports_vision,onChange:s=>r({...i,supports_vision:s.target.checked})}),"vision"]})]}),w.jsxs("div",{className:"provider-actions",children:[w.jsx("button",{className:"chip",type:"button",onClick:()=>n(!1),children:"CANCEL"}),w.jsx("button",{className:"chip chip-primary",type:"submit",children:"SAVE PROVIDER"})]})]}):w.jsx("button",{className:"chip chip-primary",onClick:()=>n(!0),children:"ADD PROVIDER"})}function Up(){const t=window;return t.SpeechRecognition??t.webkitSpeechRecognition??null}function Dy(t){const{enabled:e,onTranscript:n,onListeningChange:i}=t,r=xe.useRef(null),s=xe.useRef(""),[a,o]=xe.useState(!1),[l,c]=xe.useState(!1),[d,h]=xe.useState(""),f=typeof window<"u"&&Up()!==null,p=typeof window<"u"&&"speechSynthesis"in window,_=xe.useCallback(()=>{r.current?.stop(),o(!1),i?.(!1)},[i]),y=xe.useCallback(()=>{if(!e||!f)return;r.current&&(r.current.abort(),r.current=null);const g=Up();if(!g)return;const v=new g;v.lang=t.language??navigator.language??"en-US",v.continuous=!1,v.interimResults=!0,v.maxAlternatives=1,s.current="",v.onstart=()=>{o(!0),i?.(!0)},v.onresult=E=>{let b="";for(let S=E.resultIndex;S<E.results.length;S+=1){const C=E.results[S],P=String(C[0]?.transcript??"");C.isFinal?s.current+=P:b+=P}if(h(b),s.current.trim()){const S=s.current.trim();s.current="",h(""),n(S)}},v.onerror=()=>{o(!1),i?.(!1)},v.onend=()=>{if(o(!1),i?.(!1),s.current.trim()){const E=s.current.trim();s.current="",n(E)}},r.current=v;try{v.start()}catch{o(!1)}},[e,f,n,i,t.language]),m=xe.useCallback(()=>{p&&(window.speechSynthesis.cancel(),c(!1),document.body.dataset.speaking="0")},[p]),u=xe.useCallback((g,v)=>{if(!p||!g.trim()){v?.onEnd?.();return}window.speechSynthesis.cancel();const E=new SpeechSynthesisUtterance(g),b=window.localStorage.getItem("vyralis.voice")??"",S=window.speechSynthesis.getVoices(),C=S.find(P=>b&&P.name===b)??S.find(P=>/google uk english male|daniel|alex|en-GB/i.test(P.name))??S.find(P=>P.lang.startsWith("en"));C&&(E.voice=C),E.rate=1.02,E.pitch=.95,E.onstart=()=>{c(!0),document.body.dataset.speaking="1"},E.onend=()=>{c(!1),document.body.dataset.speaking="0",v?.onEnd?.()},E.onerror=()=>{c(!1),document.body.dataset.speaking="0",v?.onEnd?.()},window.speechSynthesis.speak(E)},[p]);return xe.useEffect(()=>{if(!p)return;window.speechSynthesis.getVoices();const g=window.setTimeout(()=>window.speechSynthesis.getVoices(),400);return()=>window.clearTimeout(g)},[p]),xe.useEffect(()=>()=>{r.current?.abort(),p&&window.speechSynthesis.cancel(),document.body.dataset.speaking="0"},[p]),{sttSupported:f,ttsSupported:p,listening:a,speaking:l,interim:d,startListening:y,stopListening:_,speak:u,stopSpeaking:m}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ih="169",Iy=0,Fp=1,Uy=2,Kv=1,Fy=2,fi=3,ir=0,dn=1,ei=2,Qi=0,As=1,ni=2,kp=3,Op=4,ky=5,xr=100,Oy=101,By=102,zy=103,Vy=104,Hy=200,Gy=201,Wy=202,jy=203,md=204,gd=205,Xy=206,$y=207,Yy=208,qy=209,Ky=210,Zy=211,Qy=212,Jy=213,eS=214,vd=0,_d=1,xd=2,Fs=3,yd=4,Sd=5,Md=6,Ed=7,Zv=0,tS=1,nS=2,Ji=0,iS=1,rS=2,sS=3,aS=4,oS=5,lS=6,cS=7,Qv=300,ks=301,Os=302,wd=303,Td=304,oc=306,Ad=1e3,wr=1001,Cd=1002,Ln=1003,uS=1004,yo=1005,Rn=1006,Vc=1007,Tr=1008,Ti=1009,Jv=1010,e_=1011,Ga=1012,rh=1013,Ir=1014,_i=1015,qa=1016,sh=1017,ah=1018,Bs=1020,t_=35902,n_=1021,i_=1022,Gn=1023,r_=1024,s_=1025,Cs=1026,zs=1027,a_=1028,oh=1029,o_=1030,lh=1031,ch=1033,al=33776,ol=33777,ll=33778,cl=33779,Rd=35840,Pd=35841,bd=35842,Ld=35843,Nd=36196,Dd=37492,Id=37496,Ud=37808,Fd=37809,kd=37810,Od=37811,Bd=37812,zd=37813,Vd=37814,Hd=37815,Gd=37816,Wd=37817,jd=37818,Xd=37819,$d=37820,Yd=37821,ul=36492,qd=36494,Kd=36495,l_=36283,Zd=36284,Qd=36285,Jd=36286,dS=3200,fS=3201,hS=0,pS=1,Vi="",Zn="srgb",or="srgb-linear",uh="display-p3",lc="display-p3-linear",kl="linear",pt="srgb",Ol="rec709",Bl="p3",Hr=7680,Bp=519,mS=512,gS=513,vS=514,c_=515,_S=516,xS=517,yS=518,SS=519,ef=35044,zp="300 es",xi=2e3,zl=2001;class js{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const Wt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Hc=Math.PI/180,tf=180/Math.PI;function er(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Wt[t&255]+Wt[t>>8&255]+Wt[t>>16&255]+Wt[t>>24&255]+"-"+Wt[e&255]+Wt[e>>8&255]+"-"+Wt[e>>16&15|64]+Wt[e>>24&255]+"-"+Wt[n&63|128]+Wt[n>>8&255]+"-"+Wt[n>>16&255]+Wt[n>>24&255]+Wt[i&255]+Wt[i>>8&255]+Wt[i>>16&255]+Wt[i>>24&255]).toLowerCase()}function an(t,e,n){return Math.max(e,Math.min(n,t))}function MS(t,e){return(t%e+e)%e}function Gc(t,e,n){return(1-n)*t+n*e}function ti(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("Invalid component type.")}}function ot(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("Invalid component type.")}}class Ve{constructor(e=0,n=0){Ve.prototype.isVector2=!0,this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(an(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*r+e.x,this.y=s*r+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Fe{constructor(e,n,i,r,s,a,o,l,c){Fe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,a,o,l,c)}set(e,n,i,r,s,a,o,l,c){const d=this.elements;return d[0]=e,d[1]=r,d[2]=o,d[3]=n,d[4]=s,d[5]=l,d[6]=i,d[7]=a,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],d=i[4],h=i[7],f=i[2],p=i[5],_=i[8],y=r[0],m=r[3],u=r[6],g=r[1],v=r[4],E=r[7],b=r[2],S=r[5],C=r[8];return s[0]=a*y+o*g+l*b,s[3]=a*m+o*v+l*S,s[6]=a*u+o*E+l*C,s[1]=c*y+d*g+h*b,s[4]=c*m+d*v+h*S,s[7]=c*u+d*E+h*C,s[2]=f*y+p*g+_*b,s[5]=f*m+p*v+_*S,s[8]=f*u+p*E+_*C,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8];return n*a*d-n*o*c-i*s*d+i*o*l+r*s*c-r*a*l}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],h=d*a-o*c,f=o*l-d*s,p=c*s-a*l,_=n*h+i*f+r*p;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/_;return e[0]=h*y,e[1]=(r*c-d*i)*y,e[2]=(o*i-r*a)*y,e[3]=f*y,e[4]=(d*n-r*l)*y,e[5]=(r*s-o*n)*y,e[6]=p*y,e[7]=(i*l-c*n)*y,e[8]=(a*n-i*s)*y,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-r*c,r*l,-r*(-c*a+l*o)+o+n,0,0,1),this}scale(e,n){return this.premultiply(Wc.makeScale(e,n)),this}rotate(e){return this.premultiply(Wc.makeRotation(-e)),this}translate(e,n){return this.premultiply(Wc.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Wc=new Fe;function u_(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function Vl(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function ES(){const t=Vl("canvas");return t.style.display="block",t}const Vp={};function dl(t){t in Vp||(Vp[t]=!0,console.warn(t))}function wS(t,e,n){return new Promise(function(i,r){function s(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:r();break;case t.TIMEOUT_EXPIRED:setTimeout(s,n);break;default:i()}}setTimeout(s,n)})}function TS(t){const e=t.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function AS(t){const e=t.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Hp=new Fe().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Gp=new Fe().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),na={[or]:{transfer:kl,primaries:Ol,luminanceCoefficients:[.2126,.7152,.0722],toReference:t=>t,fromReference:t=>t},[Zn]:{transfer:pt,primaries:Ol,luminanceCoefficients:[.2126,.7152,.0722],toReference:t=>t.convertSRGBToLinear(),fromReference:t=>t.convertLinearToSRGB()},[lc]:{transfer:kl,primaries:Bl,luminanceCoefficients:[.2289,.6917,.0793],toReference:t=>t.applyMatrix3(Gp),fromReference:t=>t.applyMatrix3(Hp)},[uh]:{transfer:pt,primaries:Bl,luminanceCoefficients:[.2289,.6917,.0793],toReference:t=>t.convertSRGBToLinear().applyMatrix3(Gp),fromReference:t=>t.applyMatrix3(Hp).convertLinearToSRGB()}},CS=new Set([or,lc]),tt={enabled:!0,_workingColorSpace:or,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(t){if(!CS.has(t))throw new Error(`Unsupported working color space, "${t}".`);this._workingColorSpace=t},convert:function(t,e,n){if(this.enabled===!1||e===n||!e||!n)return t;const i=na[e].toReference,r=na[n].fromReference;return r(i(t))},fromWorkingColorSpace:function(t,e){return this.convert(t,this._workingColorSpace,e)},toWorkingColorSpace:function(t,e){return this.convert(t,e,this._workingColorSpace)},getPrimaries:function(t){return na[t].primaries},getTransfer:function(t){return t===Vi?kl:na[t].transfer},getLuminanceCoefficients:function(t,e=this._workingColorSpace){return t.fromArray(na[e].luminanceCoefficients)}};function Rs(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function jc(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}let Gr;class RS{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Gr===void 0&&(Gr=Vl("canvas")),Gr.width=e.width,Gr.height=e.height;const i=Gr.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Gr}return n.width>2048||n.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),n.toDataURL("image/jpeg",.6)):n.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=Vl("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=Rs(s[a]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Rs(n[i]/255)*255):n[i]=Rs(n[i]);return{data:n,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let PS=0;class d_{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:PS++}),this.uuid=er(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(Xc(r[a].image)):s.push(Xc(r[a]))}else s=Xc(r);i.url=s}return n||(e.images[this.uuid]=i),i}}function Xc(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?RS.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let bS=0;class Jt extends js{constructor(e=Jt.DEFAULT_IMAGE,n=Jt.DEFAULT_MAPPING,i=wr,r=wr,s=Rn,a=Tr,o=Gn,l=Ti,c=Jt.DEFAULT_ANISOTROPY,d=Vi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:bS++}),this.uuid=er(),this.name="",this.source=new d_(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ve(0,0),this.repeat=new Ve(1,1),this.center=new Ve(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Fe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Qv)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ad:e.x=e.x-Math.floor(e.x);break;case wr:e.x=e.x<0?0:1;break;case Cd:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ad:e.y=e.y-Math.floor(e.y);break;case wr:e.y=e.y<0?0:1;break;case Cd:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Jt.DEFAULT_IMAGE=null;Jt.DEFAULT_MAPPING=Qv;Jt.DEFAULT_ANISOTROPY=1;class At{constructor(e=0,n=0,i=0,r=1){At.prototype.isVector4=!0,this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*n+a[4]*i+a[8]*r+a[12]*s,this.y=a[1]*n+a[5]*i+a[9]*r+a[13]*s,this.z=a[2]*n+a[6]*i+a[10]*r+a[14]*s,this.w=a[3]*n+a[7]*i+a[11]*r+a[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s;const l=e.elements,c=l[0],d=l[4],h=l[8],f=l[1],p=l[5],_=l[9],y=l[2],m=l[6],u=l[10];if(Math.abs(d-f)<.01&&Math.abs(h-y)<.01&&Math.abs(_-m)<.01){if(Math.abs(d+f)<.1&&Math.abs(h+y)<.1&&Math.abs(_+m)<.1&&Math.abs(c+p+u-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const v=(c+1)/2,E=(p+1)/2,b=(u+1)/2,S=(d+f)/4,C=(h+y)/4,P=(_+m)/4;return v>E&&v>b?v<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(v),r=S/i,s=C/i):E>b?E<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(E),i=S/r,s=P/r):b<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(b),i=C/s,r=P/s),this.set(i,r,s,n),this}let g=Math.sqrt((m-_)*(m-_)+(h-y)*(h-y)+(f-d)*(f-d));return Math.abs(g)<.001&&(g=1),this.x=(m-_)/g,this.y=(h-y)/g,this.z=(f-d)/g,this.w=Math.acos((c+p+u-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this.w=Math.max(e.w,Math.min(n.w,this.w)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this.w=Math.max(e,Math.min(n,this.w)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class LS extends js{constructor(e=1,n=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=1,this.scissor=new At(0,0,e,n),this.scissorTest=!1,this.viewport=new At(0,0,e,n);const r={width:e,height:n,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Rn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new Jt(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=n,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const n=Object.assign({},e.texture.image);return this.texture.source=new d_(n),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ur extends LS{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class f_ extends Jt{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Ln,this.minFilter=Ln,this.wrapR=wr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class NS extends Jt{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Ln,this.minFilter=Ln,this.wrapR=wr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ka{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,a,o){let l=i[r+0],c=i[r+1],d=i[r+2],h=i[r+3];const f=s[a+0],p=s[a+1],_=s[a+2],y=s[a+3];if(o===0){e[n+0]=l,e[n+1]=c,e[n+2]=d,e[n+3]=h;return}if(o===1){e[n+0]=f,e[n+1]=p,e[n+2]=_,e[n+3]=y;return}if(h!==y||l!==f||c!==p||d!==_){let m=1-o;const u=l*f+c*p+d*_+h*y,g=u>=0?1:-1,v=1-u*u;if(v>Number.EPSILON){const b=Math.sqrt(v),S=Math.atan2(b,u*g);m=Math.sin(m*S)/b,o=Math.sin(o*S)/b}const E=o*g;if(l=l*m+f*E,c=c*m+p*E,d=d*m+_*E,h=h*m+y*E,m===1-o){const b=1/Math.sqrt(l*l+c*c+d*d+h*h);l*=b,c*=b,d*=b,h*=b}}e[n]=l,e[n+1]=c,e[n+2]=d,e[n+3]=h}static multiplyQuaternionsFlat(e,n,i,r,s,a){const o=i[r],l=i[r+1],c=i[r+2],d=i[r+3],h=s[a],f=s[a+1],p=s[a+2],_=s[a+3];return e[n]=o*_+d*h+l*p-c*f,e[n+1]=l*_+d*f+c*h-o*p,e[n+2]=c*_+d*p+o*f-l*h,e[n+3]=d*_-o*h-l*f-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const i=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),d=o(r/2),h=o(s/2),f=l(i/2),p=l(r/2),_=l(s/2);switch(a){case"XYZ":this._x=f*d*h+c*p*_,this._y=c*p*h-f*d*_,this._z=c*d*_+f*p*h,this._w=c*d*h-f*p*_;break;case"YXZ":this._x=f*d*h+c*p*_,this._y=c*p*h-f*d*_,this._z=c*d*_-f*p*h,this._w=c*d*h+f*p*_;break;case"ZXY":this._x=f*d*h-c*p*_,this._y=c*p*h+f*d*_,this._z=c*d*_+f*p*h,this._w=c*d*h-f*p*_;break;case"ZYX":this._x=f*d*h-c*p*_,this._y=c*p*h+f*d*_,this._z=c*d*_-f*p*h,this._w=c*d*h+f*p*_;break;case"YZX":this._x=f*d*h+c*p*_,this._y=c*p*h+f*d*_,this._z=c*d*_-f*p*h,this._w=c*d*h-f*p*_;break;case"XZY":this._x=f*d*h-c*p*_,this._y=c*p*h-f*d*_,this._z=c*d*_+f*p*h,this._w=c*d*h+f*p*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],r=n[4],s=n[8],a=n[1],o=n[5],l=n[9],c=n[2],d=n[6],h=n[10],f=i+o+h;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(d-l)*p,this._y=(s-c)*p,this._z=(a-r)*p}else if(i>o&&i>h){const p=2*Math.sqrt(1+i-o-h);this._w=(d-l)/p,this._x=.25*p,this._y=(r+a)/p,this._z=(s+c)/p}else if(o>h){const p=2*Math.sqrt(1+o-i-h);this._w=(s-c)/p,this._x=(r+a)/p,this._y=.25*p,this._z=(l+d)/p}else{const p=2*Math.sqrt(1+h-i-o);this._w=(a-r)/p,this._x=(s+c)/p,this._y=(l+d)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(an(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,r=e._y,s=e._z,a=e._w,o=n._x,l=n._y,c=n._z,d=n._w;return this._x=i*d+a*o+r*c-s*l,this._y=r*d+a*l+s*o-i*c,this._z=s*d+a*c+i*l-r*o,this._w=a*d-i*o-r*l-s*c,this._onChangeCallback(),this}slerp(e,n){if(n===0)return this;if(n===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,a=this._w;let o=a*e._w+i*e._x+r*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=r,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const p=1-n;return this._w=p*a+n*this._w,this._x=p*i+n*this._x,this._y=p*r+n*this._y,this._z=p*s+n*this._z,this.normalize(),this}const c=Math.sqrt(l),d=Math.atan2(c,o),h=Math.sin((1-n)*d)/c,f=Math.sin(n*d)/c;return this._w=a*h+this._w*f,this._x=i*h+this._x*f,this._y=r*h+this._y*f,this._z=s*h+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(n),s*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class F{constructor(e=0,n=0,i=0){F.prototype.isVector3=!0,this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(Wp.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(Wp.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=e.elements,a=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*a,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*a,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*a,this}applyQuaternion(e){const n=this.x,i=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*r-o*i),d=2*(o*n-s*r),h=2*(s*i-a*n);return this.x=n+l*c+a*h-o*d,this.y=i+l*d+o*c-s*h,this.z=r+l*h+s*d-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,r=e.y,s=e.z,a=n.x,o=n.y,l=n.z;return this.x=r*l-s*o,this.y=s*a-i*l,this.z=i*o-r*a,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return $c.copy(this).projectOnVector(e),this.sub($c)}reflect(e){return this.sub($c.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(an(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const $c=new F,Wp=new Ka;class Za{constructor(e=new F(1/0,1/0,1/0),n=new F(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(kn.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(kn.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=kn.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(n===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,kn):kn.fromBufferAttribute(s,a),kn.applyMatrix4(e.matrixWorld),this.expandByPoint(kn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),So.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),So.copy(i.boundingBox)),So.applyMatrix4(e.matrixWorld),this.union(So)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,kn),kn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ia),Mo.subVectors(this.max,ia),Wr.subVectors(e.a,ia),jr.subVectors(e.b,ia),Xr.subVectors(e.c,ia),Li.subVectors(jr,Wr),Ni.subVectors(Xr,jr),cr.subVectors(Wr,Xr);let n=[0,-Li.z,Li.y,0,-Ni.z,Ni.y,0,-cr.z,cr.y,Li.z,0,-Li.x,Ni.z,0,-Ni.x,cr.z,0,-cr.x,-Li.y,Li.x,0,-Ni.y,Ni.x,0,-cr.y,cr.x,0];return!Yc(n,Wr,jr,Xr,Mo)||(n=[1,0,0,0,1,0,0,0,1],!Yc(n,Wr,jr,Xr,Mo))?!1:(Eo.crossVectors(Li,Ni),n=[Eo.x,Eo.y,Eo.z],Yc(n,Wr,jr,Xr,Mo))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,kn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(kn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(oi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),oi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),oi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),oi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),oi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),oi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),oi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),oi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(oi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const oi=[new F,new F,new F,new F,new F,new F,new F,new F],kn=new F,So=new Za,Wr=new F,jr=new F,Xr=new F,Li=new F,Ni=new F,cr=new F,ia=new F,Mo=new F,Eo=new F,ur=new F;function Yc(t,e,n,i,r){for(let s=0,a=t.length-3;s<=a;s+=3){ur.fromArray(t,s);const o=r.x*Math.abs(ur.x)+r.y*Math.abs(ur.y)+r.z*Math.abs(ur.z),l=e.dot(ur),c=n.dot(ur),d=i.dot(ur);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>o)return!1}return!0}const DS=new Za,ra=new F,qc=new F;class Qa{constructor(e=new F,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):DS.setFromPoints(e).getCenter(i);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ra.subVectors(e,this.center);const n=ra.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(ra,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(qc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ra.copy(e.center).add(qc)),this.expandByPoint(ra.copy(e.center).sub(qc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const li=new F,Kc=new F,wo=new F,Di=new F,Zc=new F,To=new F,Qc=new F;class dh{constructor(e=new F,n=new F(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,li)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=li.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(li.copy(this.origin).addScaledVector(this.direction,n),li.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){Kc.copy(e).add(n).multiplyScalar(.5),wo.copy(n).sub(e).normalize(),Di.copy(this.origin).sub(Kc);const s=e.distanceTo(n)*.5,a=-this.direction.dot(wo),o=Di.dot(this.direction),l=-Di.dot(wo),c=Di.lengthSq(),d=Math.abs(1-a*a);let h,f,p,_;if(d>0)if(h=a*l-o,f=a*o-l,_=s*d,h>=0)if(f>=-_)if(f<=_){const y=1/d;h*=y,f*=y,p=h*(h+a*f+2*o)+f*(a*h+f+2*l)+c}else f=s,h=Math.max(0,-(a*f+o)),p=-h*h+f*(f+2*l)+c;else f=-s,h=Math.max(0,-(a*f+o)),p=-h*h+f*(f+2*l)+c;else f<=-_?(h=Math.max(0,-(-a*s+o)),f=h>0?-s:Math.min(Math.max(-s,-l),s),p=-h*h+f*(f+2*l)+c):f<=_?(h=0,f=Math.min(Math.max(-s,-l),s),p=f*(f+2*l)+c):(h=Math.max(0,-(a*s+o)),f=h>0?s:Math.min(Math.max(-s,-l),s),p=-h*h+f*(f+2*l)+c);else f=a>0?-s:s,h=Math.max(0,-(a*f+o)),p=-h*h+f*(f+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(Kc).addScaledVector(wo,f),p}intersectSphere(e,n){li.subVectors(e.center,this.origin);const i=li.dot(this.direction),r=li.dot(li)-i*i,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,n):this.at(o,n)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,a,o,l;const c=1/this.direction.x,d=1/this.direction.y,h=1/this.direction.z,f=this.origin;return c>=0?(i=(e.min.x-f.x)*c,r=(e.max.x-f.x)*c):(i=(e.max.x-f.x)*c,r=(e.min.x-f.x)*c),d>=0?(s=(e.min.y-f.y)*d,a=(e.max.y-f.y)*d):(s=(e.max.y-f.y)*d,a=(e.min.y-f.y)*d),i>a||s>r||((s>i||isNaN(i))&&(i=s),(a<r||isNaN(r))&&(r=a),h>=0?(o=(e.min.z-f.z)*h,l=(e.max.z-f.z)*h):(o=(e.max.z-f.z)*h,l=(e.min.z-f.z)*h),i>l||o>r)||((o>i||i!==i)&&(i=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,li)!==null}intersectTriangle(e,n,i,r,s){Zc.subVectors(n,e),To.subVectors(i,e),Qc.crossVectors(Zc,To);let a=this.direction.dot(Qc),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Di.subVectors(this.origin,e);const l=o*this.direction.dot(To.crossVectors(Di,To));if(l<0)return null;const c=o*this.direction.dot(Zc.cross(Di));if(c<0||l+c>a)return null;const d=-o*Di.dot(Qc);return d<0?null:this.at(d/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class yt{constructor(e,n,i,r,s,a,o,l,c,d,h,f,p,_,y,m){yt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,a,o,l,c,d,h,f,p,_,y,m)}set(e,n,i,r,s,a,o,l,c,d,h,f,p,_,y,m){const u=this.elements;return u[0]=e,u[4]=n,u[8]=i,u[12]=r,u[1]=s,u[5]=a,u[9]=o,u[13]=l,u[2]=c,u[6]=d,u[10]=h,u[14]=f,u[3]=p,u[7]=_,u[11]=y,u[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new yt().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){const n=this.elements,i=e.elements,r=1/$r.setFromMatrixColumn(e,0).length(),s=1/$r.setFromMatrixColumn(e,1).length(),a=1/$r.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*a,n[9]=i[9]*a,n[10]=i[10]*a,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,r=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(r),c=Math.sin(r),d=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const f=a*d,p=a*h,_=o*d,y=o*h;n[0]=l*d,n[4]=-l*h,n[8]=c,n[1]=p+_*c,n[5]=f-y*c,n[9]=-o*l,n[2]=y-f*c,n[6]=_+p*c,n[10]=a*l}else if(e.order==="YXZ"){const f=l*d,p=l*h,_=c*d,y=c*h;n[0]=f+y*o,n[4]=_*o-p,n[8]=a*c,n[1]=a*h,n[5]=a*d,n[9]=-o,n[2]=p*o-_,n[6]=y+f*o,n[10]=a*l}else if(e.order==="ZXY"){const f=l*d,p=l*h,_=c*d,y=c*h;n[0]=f-y*o,n[4]=-a*h,n[8]=_+p*o,n[1]=p+_*o,n[5]=a*d,n[9]=y-f*o,n[2]=-a*c,n[6]=o,n[10]=a*l}else if(e.order==="ZYX"){const f=a*d,p=a*h,_=o*d,y=o*h;n[0]=l*d,n[4]=_*c-p,n[8]=f*c+y,n[1]=l*h,n[5]=y*c+f,n[9]=p*c-_,n[2]=-c,n[6]=o*l,n[10]=a*l}else if(e.order==="YZX"){const f=a*l,p=a*c,_=o*l,y=o*c;n[0]=l*d,n[4]=y-f*h,n[8]=_*h+p,n[1]=h,n[5]=a*d,n[9]=-o*d,n[2]=-c*d,n[6]=p*h+_,n[10]=f-y*h}else if(e.order==="XZY"){const f=a*l,p=a*c,_=o*l,y=o*c;n[0]=l*d,n[4]=-h,n[8]=c*d,n[1]=f*h+y,n[5]=a*d,n[9]=p*h-_,n[2]=_*h-p,n[6]=o*d,n[10]=y*h+f}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(IS,e,US)}lookAt(e,n,i){const r=this.elements;return mn.subVectors(e,n),mn.lengthSq()===0&&(mn.z=1),mn.normalize(),Ii.crossVectors(i,mn),Ii.lengthSq()===0&&(Math.abs(i.z)===1?mn.x+=1e-4:mn.z+=1e-4,mn.normalize(),Ii.crossVectors(i,mn)),Ii.normalize(),Ao.crossVectors(mn,Ii),r[0]=Ii.x,r[4]=Ao.x,r[8]=mn.x,r[1]=Ii.y,r[5]=Ao.y,r[9]=mn.y,r[2]=Ii.z,r[6]=Ao.z,r[10]=mn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],d=i[1],h=i[5],f=i[9],p=i[13],_=i[2],y=i[6],m=i[10],u=i[14],g=i[3],v=i[7],E=i[11],b=i[15],S=r[0],C=r[4],P=r[8],X=r[12],x=r[1],A=r[5],G=r[9],z=r[13],W=r[2],Z=r[6],V=r[10],J=r[14],N=r[3],q=r[7],Q=r[11],se=r[15];return s[0]=a*S+o*x+l*W+c*N,s[4]=a*C+o*A+l*Z+c*q,s[8]=a*P+o*G+l*V+c*Q,s[12]=a*X+o*z+l*J+c*se,s[1]=d*S+h*x+f*W+p*N,s[5]=d*C+h*A+f*Z+p*q,s[9]=d*P+h*G+f*V+p*Q,s[13]=d*X+h*z+f*J+p*se,s[2]=_*S+y*x+m*W+u*N,s[6]=_*C+y*A+m*Z+u*q,s[10]=_*P+y*G+m*V+u*Q,s[14]=_*X+y*z+m*J+u*se,s[3]=g*S+v*x+E*W+b*N,s[7]=g*C+v*A+E*Z+b*q,s[11]=g*P+v*G+E*V+b*Q,s[15]=g*X+v*z+E*J+b*se,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],d=e[2],h=e[6],f=e[10],p=e[14],_=e[3],y=e[7],m=e[11],u=e[15];return _*(+s*l*h-r*c*h-s*o*f+i*c*f+r*o*p-i*l*p)+y*(+n*l*p-n*c*f+s*a*f-r*a*p+r*c*d-s*l*d)+m*(+n*c*h-n*o*p-s*a*h+i*a*p+s*o*d-i*c*d)+u*(-r*o*d-n*l*h+n*o*f+r*a*h-i*a*f+i*l*d)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],h=e[9],f=e[10],p=e[11],_=e[12],y=e[13],m=e[14],u=e[15],g=h*m*c-y*f*c+y*l*p-o*m*p-h*l*u+o*f*u,v=_*f*c-d*m*c-_*l*p+a*m*p+d*l*u-a*f*u,E=d*y*c-_*h*c+_*o*p-a*y*p-d*o*u+a*h*u,b=_*h*l-d*y*l-_*o*f+a*y*f+d*o*m-a*h*m,S=n*g+i*v+r*E+s*b;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/S;return e[0]=g*C,e[1]=(y*f*s-h*m*s-y*r*p+i*m*p+h*r*u-i*f*u)*C,e[2]=(o*m*s-y*l*s+y*r*c-i*m*c-o*r*u+i*l*u)*C,e[3]=(h*l*s-o*f*s-h*r*c+i*f*c+o*r*p-i*l*p)*C,e[4]=v*C,e[5]=(d*m*s-_*f*s+_*r*p-n*m*p-d*r*u+n*f*u)*C,e[6]=(_*l*s-a*m*s-_*r*c+n*m*c+a*r*u-n*l*u)*C,e[7]=(a*f*s-d*l*s+d*r*c-n*f*c-a*r*p+n*l*p)*C,e[8]=E*C,e[9]=(_*h*s-d*y*s-_*i*p+n*y*p+d*i*u-n*h*u)*C,e[10]=(a*y*s-_*o*s+_*i*c-n*y*c-a*i*u+n*o*u)*C,e[11]=(d*o*s-a*h*s-d*i*c+n*h*c+a*i*p-n*o*p)*C,e[12]=b*C,e[13]=(d*y*r-_*h*r+_*i*f-n*y*f-d*i*m+n*h*m)*C,e[14]=(_*o*r-a*y*r-_*i*l+n*y*l+a*i*m-n*o*m)*C,e[15]=(a*h*r-d*o*r+d*i*l-n*h*l-a*i*f+n*o*f)*C,this}scale(e){const n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),r=Math.sin(n),s=1-i,a=e.x,o=e.y,l=e.z,c=s*a,d=s*o;return this.set(c*a+i,c*o-r*l,c*l+r*o,0,c*o+r*l,d*o+i,d*l-r*a,0,c*l-r*o,d*l+r*a,s*l*l+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,a){return this.set(1,i,s,0,e,1,a,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){const r=this.elements,s=n._x,a=n._y,o=n._z,l=n._w,c=s+s,d=a+a,h=o+o,f=s*c,p=s*d,_=s*h,y=a*d,m=a*h,u=o*h,g=l*c,v=l*d,E=l*h,b=i.x,S=i.y,C=i.z;return r[0]=(1-(y+u))*b,r[1]=(p+E)*b,r[2]=(_-v)*b,r[3]=0,r[4]=(p-E)*S,r[5]=(1-(f+u))*S,r[6]=(m+g)*S,r[7]=0,r[8]=(_+v)*C,r[9]=(m-g)*C,r[10]=(1-(f+y))*C,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){const r=this.elements;let s=$r.set(r[0],r[1],r[2]).length();const a=$r.set(r[4],r[5],r[6]).length(),o=$r.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],On.copy(this);const c=1/s,d=1/a,h=1/o;return On.elements[0]*=c,On.elements[1]*=c,On.elements[2]*=c,On.elements[4]*=d,On.elements[5]*=d,On.elements[6]*=d,On.elements[8]*=h,On.elements[9]*=h,On.elements[10]*=h,n.setFromRotationMatrix(On),i.x=s,i.y=a,i.z=o,this}makePerspective(e,n,i,r,s,a,o=xi){const l=this.elements,c=2*s/(n-e),d=2*s/(i-r),h=(n+e)/(n-e),f=(i+r)/(i-r);let p,_;if(o===xi)p=-(a+s)/(a-s),_=-2*a*s/(a-s);else if(o===zl)p=-a/(a-s),_=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=d,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,n,i,r,s,a,o=xi){const l=this.elements,c=1/(n-e),d=1/(i-r),h=1/(a-s),f=(n+e)*c,p=(i+r)*d;let _,y;if(o===xi)_=(a+s)*h,y=-2*h;else if(o===zl)_=s*h,y=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*d,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=y,l[14]=-_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}}const $r=new F,On=new yt,IS=new F(0,0,0),US=new F(1,1,1),Ii=new F,Ao=new F,mn=new F,jp=new yt,Xp=new Ka;class Ai{constructor(e=0,n=0,i=0,r=Ai.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],d=r[9],h=r[2],f=r[6],p=r[10];switch(n){case"XYZ":this._y=Math.asin(an(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,p),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-an(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(an(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-an(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(an(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-an(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-d,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return jp.makeRotationFromQuaternion(e),this.setFromRotationMatrix(jp,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return Xp.setFromEuler(this),this.setFromQuaternion(Xp,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ai.DEFAULT_ORDER="XYZ";class h_{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let FS=0;const $p=new F,Yr=new Ka,ci=new yt,Co=new F,sa=new F,kS=new F,OS=new Ka,Yp=new F(1,0,0),qp=new F(0,1,0),Kp=new F(0,0,1),Zp={type:"added"},BS={type:"removed"},qr={type:"childadded",child:null},Jc={type:"childremoved",child:null};class $t extends js{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:FS++}),this.uuid=er(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=$t.DEFAULT_UP.clone();const e=new F,n=new Ai,i=new Ka,r=new F(1,1,1);function s(){i.setFromEuler(n,!1)}function a(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new yt},normalMatrix:{value:new Fe}}),this.matrix=new yt,this.matrixWorld=new yt,this.matrixAutoUpdate=$t.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=$t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new h_,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return Yr.setFromAxisAngle(e,n),this.quaternion.multiply(Yr),this}rotateOnWorldAxis(e,n){return Yr.setFromAxisAngle(e,n),this.quaternion.premultiply(Yr),this}rotateX(e){return this.rotateOnAxis(Yp,e)}rotateY(e){return this.rotateOnAxis(qp,e)}rotateZ(e){return this.rotateOnAxis(Kp,e)}translateOnAxis(e,n){return $p.copy(e).applyQuaternion(this.quaternion),this.position.add($p.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(Yp,e)}translateY(e){return this.translateOnAxis(qp,e)}translateZ(e){return this.translateOnAxis(Kp,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ci.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?Co.copy(e):Co.set(e,n,i);const r=this.parent;this.updateWorldMatrix(!0,!1),sa.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ci.lookAt(sa,Co,this.up):ci.lookAt(Co,sa,this.up),this.quaternion.setFromRotationMatrix(ci),r&&(ci.extractRotation(r.matrixWorld),Yr.setFromRotationMatrix(ci),this.quaternion.premultiply(Yr.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Zp),qr.child=e,this.dispatchEvent(qr),qr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(BS),Jc.child=e,this.dispatchEvent(Jc),Jc.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ci.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ci.multiply(e.parent.matrixWorld)),e.applyMatrix4(ci),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Zp),qr.child=e,this.dispatchEvent(qr),qr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){const a=this.children[i].getObjectByProperty(e,n);if(a!==void 0)return a}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(sa,e,kS),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(sa,OS,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){const h=l[c];s(e.shapes,h)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(s(e.animations,l))}}if(n){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),d=a(e.images),h=a(e.shapes),f=a(e.skeletons),p=a(e.animations),_=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),d.length>0&&(i.images=d),h.length>0&&(i.shapes=h),f.length>0&&(i.skeletons=f),p.length>0&&(i.animations=p),_.length>0&&(i.nodes=_)}return i.object=r,i;function a(o){const l=[];for(const c in o){const d=o[c];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}$t.DEFAULT_UP=new F(0,1,0);$t.DEFAULT_MATRIX_AUTO_UPDATE=!0;$t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Bn=new F,ui=new F,eu=new F,di=new F,Kr=new F,Zr=new F,Qp=new F,tu=new F,nu=new F,iu=new F,ru=new At,su=new At,au=new At;class Pn{constructor(e=new F,n=new F,i=new F){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),Bn.subVectors(e,n),r.cross(Bn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){Bn.subVectors(r,n),ui.subVectors(i,n),eu.subVectors(e,n);const a=Bn.dot(Bn),o=Bn.dot(ui),l=Bn.dot(eu),c=ui.dot(ui),d=ui.dot(eu),h=a*c-o*o;if(h===0)return s.set(0,0,0),null;const f=1/h,p=(c*l-o*d)*f,_=(a*d-o*l)*f;return s.set(1-p-_,_,p)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,di)===null?!1:di.x>=0&&di.y>=0&&di.x+di.y<=1}static getInterpolation(e,n,i,r,s,a,o,l){return this.getBarycoord(e,n,i,r,di)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,di.x),l.addScaledVector(a,di.y),l.addScaledVector(o,di.z),l)}static getInterpolatedAttribute(e,n,i,r,s,a){return ru.setScalar(0),su.setScalar(0),au.setScalar(0),ru.fromBufferAttribute(e,n),su.fromBufferAttribute(e,i),au.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(ru,s.x),a.addScaledVector(su,s.y),a.addScaledVector(au,s.z),a}static isFrontFacing(e,n,i,r){return Bn.subVectors(i,n),ui.subVectors(e,n),Bn.cross(ui).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Bn.subVectors(this.c,this.b),ui.subVectors(this.a,this.b),Bn.cross(ui).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Pn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return Pn.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,r,s){return Pn.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return Pn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Pn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,r=this.b,s=this.c;let a,o;Kr.subVectors(r,i),Zr.subVectors(s,i),tu.subVectors(e,i);const l=Kr.dot(tu),c=Zr.dot(tu);if(l<=0&&c<=0)return n.copy(i);nu.subVectors(e,r);const d=Kr.dot(nu),h=Zr.dot(nu);if(d>=0&&h<=d)return n.copy(r);const f=l*h-d*c;if(f<=0&&l>=0&&d<=0)return a=l/(l-d),n.copy(i).addScaledVector(Kr,a);iu.subVectors(e,s);const p=Kr.dot(iu),_=Zr.dot(iu);if(_>=0&&p<=_)return n.copy(s);const y=p*c-l*_;if(y<=0&&c>=0&&_<=0)return o=c/(c-_),n.copy(i).addScaledVector(Zr,o);const m=d*_-p*h;if(m<=0&&h-d>=0&&p-_>=0)return Qp.subVectors(s,r),o=(h-d)/(h-d+(p-_)),n.copy(r).addScaledVector(Qp,o);const u=1/(m+y+f);return a=y*u,o=f*u,n.copy(i).addScaledVector(Kr,a).addScaledVector(Zr,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const p_={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ui={h:0,s:0,l:0},Ro={h:0,s:0,l:0};function ou(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class Oe{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=Zn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,tt.toWorkingColorSpace(this,n),this}setRGB(e,n,i,r=tt.workingColorSpace){return this.r=e,this.g=n,this.b=i,tt.toWorkingColorSpace(this,r),this}setHSL(e,n,i,r=tt.workingColorSpace){if(e=MS(e,1),n=an(n,0,1),i=an(i,0,1),n===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+n):i+n-i*n,a=2*i-s;this.r=ou(a,s,e+1/3),this.g=ou(a,s,e),this.b=ou(a,s,e-1/3)}return tt.toWorkingColorSpace(this,r),this}setStyle(e,n=Zn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(a===6)return this.setHex(parseInt(s,16),n);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=Zn){const i=p_[e.toLowerCase()];return i!==void 0?this.setHex(i,n):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Rs(e.r),this.g=Rs(e.g),this.b=Rs(e.b),this}copyLinearToSRGB(e){return this.r=jc(e.r),this.g=jc(e.g),this.b=jc(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Zn){return tt.fromWorkingColorSpace(jt.copy(this),e),Math.round(an(jt.r*255,0,255))*65536+Math.round(an(jt.g*255,0,255))*256+Math.round(an(jt.b*255,0,255))}getHexString(e=Zn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=tt.workingColorSpace){tt.fromWorkingColorSpace(jt.copy(this),n);const i=jt.r,r=jt.g,s=jt.b,a=Math.max(i,r,s),o=Math.min(i,r,s);let l,c;const d=(o+a)/2;if(o===a)l=0,c=0;else{const h=a-o;switch(c=d<=.5?h/(a+o):h/(2-a-o),a){case i:l=(r-s)/h+(r<s?6:0);break;case r:l=(s-i)/h+2;break;case s:l=(i-r)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=d,e}getRGB(e,n=tt.workingColorSpace){return tt.fromWorkingColorSpace(jt.copy(this),n),e.r=jt.r,e.g=jt.g,e.b=jt.b,e}getStyle(e=Zn){tt.fromWorkingColorSpace(jt.copy(this),e);const n=jt.r,i=jt.g,r=jt.b;return e!==Zn?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(Ui),this.setHSL(Ui.h+e,Ui.s+n,Ui.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(Ui),e.getHSL(Ro);const i=Gc(Ui.h,Ro.h,n),r=Gc(Ui.s,Ro.s,n),s=Gc(Ui.l,Ro.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const jt=new Oe;Oe.NAMES=p_;let zS=0;class Or extends js{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:zS++}),this.uuid=er(),this.name="",this.type="Material",this.blending=As,this.side=ir,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=md,this.blendDst=gd,this.blendEquation=xr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Oe(0,0,0),this.blendAlpha=0,this.depthFunc=Fs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Bp,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Hr,this.stencilZFail=Hr,this.stencilZPass=Hr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==As&&(i.blending=this.blending),this.side!==ir&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==md&&(i.blendSrc=this.blendSrc),this.blendDst!==gd&&(i.blendDst=this.blendDst),this.blendEquation!==xr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Fs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Bp&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Hr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Hr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Hr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(n){const s=r(e.textures),a=r(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class fh extends Or{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Oe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ai,this.combine=Zv,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Rt=new F,Po=new Ve;class _t{constructor(e,n,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=ef,this.updateRanges=[],this.gpuType=_i,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)Po.fromBufferAttribute(this,n),Po.applyMatrix3(e),this.setXY(n,Po.x,Po.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)Rt.fromBufferAttribute(this,n),Rt.applyMatrix3(e),this.setXYZ(n,Rt.x,Rt.y,Rt.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)Rt.fromBufferAttribute(this,n),Rt.applyMatrix4(e),this.setXYZ(n,Rt.x,Rt.y,Rt.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)Rt.fromBufferAttribute(this,n),Rt.applyNormalMatrix(e),this.setXYZ(n,Rt.x,Rt.y,Rt.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)Rt.fromBufferAttribute(this,n),Rt.transformDirection(e),this.setXYZ(n,Rt.x,Rt.y,Rt.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=ti(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=ot(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=ti(n,this.array)),n}setX(e,n){return this.normalized&&(n=ot(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=ti(n,this.array)),n}setY(e,n){return this.normalized&&(n=ot(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=ti(n,this.array)),n}setZ(e,n){return this.normalized&&(n=ot(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=ti(n,this.array)),n}setW(e,n){return this.normalized&&(n=ot(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=ot(n,this.array),i=ot(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=ot(n,this.array),i=ot(i,this.array),r=ot(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=ot(n,this.array),i=ot(i,this.array),r=ot(r,this.array),s=ot(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==ef&&(e.usage=this.usage),e}}class m_ extends _t{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class g_ extends _t{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class $n extends _t{constructor(e,n,i){super(new Float32Array(e),n,i)}}let VS=0;const wn=new yt,lu=new $t,Qr=new F,gn=new Za,aa=new Za,It=new F;class Ft extends js{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:VS++}),this.uuid=er(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(u_(e)?g_:m_)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Fe().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return wn.makeRotationFromQuaternion(e),this.applyMatrix4(wn),this}rotateX(e){return wn.makeRotationX(e),this.applyMatrix4(wn),this}rotateY(e){return wn.makeRotationY(e),this.applyMatrix4(wn),this}rotateZ(e){return wn.makeRotationZ(e),this.applyMatrix4(wn),this}translate(e,n,i){return wn.makeTranslation(e,n,i),this.applyMatrix4(wn),this}scale(e,n,i){return wn.makeScale(e,n,i),this.applyMatrix4(wn),this}lookAt(e){return lu.lookAt(e),lu.updateMatrix(),this.applyMatrix4(lu.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Qr).negate(),this.translate(Qr.x,Qr.y,Qr.z),this}setFromPoints(e){const n=[];for(let i=0,r=e.length;i<r;i++){const s=e[i];n.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new $n(n,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Za);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new F(-1/0,-1/0,-1/0),new F(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){const s=n[i];gn.setFromBufferAttribute(s),this.morphTargetsRelative?(It.addVectors(this.boundingBox.min,gn.min),this.boundingBox.expandByPoint(It),It.addVectors(this.boundingBox.max,gn.max),this.boundingBox.expandByPoint(It)):(this.boundingBox.expandByPoint(gn.min),this.boundingBox.expandByPoint(gn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Qa);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new F,1/0);return}if(e){const i=this.boundingSphere.center;if(gn.setFromBufferAttribute(e),n)for(let s=0,a=n.length;s<a;s++){const o=n[s];aa.setFromBufferAttribute(o),this.morphTargetsRelative?(It.addVectors(gn.min,aa.min),gn.expandByPoint(It),It.addVectors(gn.max,aa.max),gn.expandByPoint(It)):(gn.expandByPoint(aa.min),gn.expandByPoint(aa.max))}gn.getCenter(i);let r=0;for(let s=0,a=e.count;s<a;s++)It.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(It));if(n)for(let s=0,a=n.length;s<a;s++){const o=n[s],l=this.morphTargetsRelative;for(let c=0,d=o.count;c<d;c++)It.fromBufferAttribute(o,c),l&&(Qr.fromBufferAttribute(e,c),It.add(Qr)),r=Math.max(r,i.distanceToSquared(It))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,r=n.normal,s=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new _t(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let P=0;P<i.count;P++)o[P]=new F,l[P]=new F;const c=new F,d=new F,h=new F,f=new Ve,p=new Ve,_=new Ve,y=new F,m=new F;function u(P,X,x){c.fromBufferAttribute(i,P),d.fromBufferAttribute(i,X),h.fromBufferAttribute(i,x),f.fromBufferAttribute(s,P),p.fromBufferAttribute(s,X),_.fromBufferAttribute(s,x),d.sub(c),h.sub(c),p.sub(f),_.sub(f);const A=1/(p.x*_.y-_.x*p.y);isFinite(A)&&(y.copy(d).multiplyScalar(_.y).addScaledVector(h,-p.y).multiplyScalar(A),m.copy(h).multiplyScalar(p.x).addScaledVector(d,-_.x).multiplyScalar(A),o[P].add(y),o[X].add(y),o[x].add(y),l[P].add(m),l[X].add(m),l[x].add(m))}let g=this.groups;g.length===0&&(g=[{start:0,count:e.count}]);for(let P=0,X=g.length;P<X;++P){const x=g[P],A=x.start,G=x.count;for(let z=A,W=A+G;z<W;z+=3)u(e.getX(z+0),e.getX(z+1),e.getX(z+2))}const v=new F,E=new F,b=new F,S=new F;function C(P){b.fromBufferAttribute(r,P),S.copy(b);const X=o[P];v.copy(X),v.sub(b.multiplyScalar(b.dot(X))).normalize(),E.crossVectors(S,X);const A=E.dot(l[P])<0?-1:1;a.setXYZW(P,v.x,v.y,v.z,A)}for(let P=0,X=g.length;P<X;++P){const x=g[P],A=x.start,G=x.count;for(let z=A,W=A+G;z<W;z+=3)C(e.getX(z+0)),C(e.getX(z+1)),C(e.getX(z+2))}}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new _t(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let f=0,p=i.count;f<p;f++)i.setXYZ(f,0,0,0);const r=new F,s=new F,a=new F,o=new F,l=new F,c=new F,d=new F,h=new F;if(e)for(let f=0,p=e.count;f<p;f+=3){const _=e.getX(f+0),y=e.getX(f+1),m=e.getX(f+2);r.fromBufferAttribute(n,_),s.fromBufferAttribute(n,y),a.fromBufferAttribute(n,m),d.subVectors(a,s),h.subVectors(r,s),d.cross(h),o.fromBufferAttribute(i,_),l.fromBufferAttribute(i,y),c.fromBufferAttribute(i,m),o.add(d),l.add(d),c.add(d),i.setXYZ(_,o.x,o.y,o.z),i.setXYZ(y,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,p=n.count;f<p;f+=3)r.fromBufferAttribute(n,f+0),s.fromBufferAttribute(n,f+1),a.fromBufferAttribute(n,f+2),d.subVectors(a,s),h.subVectors(r,s),d.cross(h),i.setXYZ(f+0,d.x,d.y,d.z),i.setXYZ(f+1,d.x,d.y,d.z),i.setXYZ(f+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)It.fromBufferAttribute(e,n),It.normalize(),e.setXYZ(n,It.x,It.y,It.z)}toNonIndexed(){function e(o,l){const c=o.array,d=o.itemSize,h=o.normalized,f=new c.constructor(l.length*d);let p=0,_=0;for(let y=0,m=l.length;y<m;y++){o.isInterleavedBufferAttribute?p=l[y]*o.data.stride+o.offset:p=l[y]*d;for(let u=0;u<d;u++)f[_++]=c[p++]}return new _t(f,d,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new Ft,i=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=e(l,i);n.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let d=0,h=c.length;d<h;d++){const f=c[d],p=e(f,i);l.push(p)}n.morphAttributes[o]=l}n.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];n.addGroup(c.start,c.count,c.materialIndex)}return n}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],d=[];for(let h=0,f=c.length;h<f;h++){const p=c[h];d.push(p.toJSON(e.data))}d.length>0&&(r[l]=d,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(n));const r=e.attributes;for(const c in r){const d=r[c];this.setAttribute(c,d.clone(n))}const s=e.morphAttributes;for(const c in s){const d=[],h=s[c];for(let f=0,p=h.length;f<p;f++)d.push(h[f].clone(n));this.morphAttributes[c]=d}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,d=a.length;c<d;c++){const h=a[c];this.addGroup(h.start,h.count,h.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Jp=new yt,dr=new dh,bo=new Qa,em=new F,Lo=new F,No=new F,Do=new F,cu=new F,Io=new F,tm=new F,Uo=new F;class Wn extends $t{constructor(e=new Ft,n=new fh){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,n){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;n.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){Io.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const d=o[l],h=s[l];d!==0&&(cu.fromBufferAttribute(h,e),a?Io.addScaledVector(cu,d):Io.addScaledVector(cu.sub(n),d))}n.add(Io)}return n}raycast(e,n){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),bo.copy(i.boundingSphere),bo.applyMatrix4(s),dr.copy(e.ray).recast(e.near),!(bo.containsPoint(dr.origin)===!1&&(dr.intersectSphere(bo,em)===null||dr.origin.distanceToSquared(em)>(e.far-e.near)**2))&&(Jp.copy(s).invert(),dr.copy(e.ray).applyMatrix4(Jp),!(i.boundingBox!==null&&dr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,dr)))}_computeIntersections(e,n,i){let r;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,d=s.attributes.uv1,h=s.attributes.normal,f=s.groups,p=s.drawRange;if(o!==null)if(Array.isArray(a))for(let _=0,y=f.length;_<y;_++){const m=f[_],u=a[m.materialIndex],g=Math.max(m.start,p.start),v=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let E=g,b=v;E<b;E+=3){const S=o.getX(E),C=o.getX(E+1),P=o.getX(E+2);r=Fo(this,u,e,i,c,d,h,S,C,P),r&&(r.faceIndex=Math.floor(E/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const _=Math.max(0,p.start),y=Math.min(o.count,p.start+p.count);for(let m=_,u=y;m<u;m+=3){const g=o.getX(m),v=o.getX(m+1),E=o.getX(m+2);r=Fo(this,a,e,i,c,d,h,g,v,E),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let _=0,y=f.length;_<y;_++){const m=f[_],u=a[m.materialIndex],g=Math.max(m.start,p.start),v=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let E=g,b=v;E<b;E+=3){const S=E,C=E+1,P=E+2;r=Fo(this,u,e,i,c,d,h,S,C,P),r&&(r.faceIndex=Math.floor(E/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const _=Math.max(0,p.start),y=Math.min(l.count,p.start+p.count);for(let m=_,u=y;m<u;m+=3){const g=m,v=m+1,E=m+2;r=Fo(this,a,e,i,c,d,h,g,v,E),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}}}function HS(t,e,n,i,r,s,a,o){let l;if(e.side===dn?l=i.intersectTriangle(a,s,r,!0,o):l=i.intersectTriangle(r,s,a,e.side===ir,o),l===null)return null;Uo.copy(o),Uo.applyMatrix4(t.matrixWorld);const c=n.ray.origin.distanceTo(Uo);return c<n.near||c>n.far?null:{distance:c,point:Uo.clone(),object:t}}function Fo(t,e,n,i,r,s,a,o,l,c){t.getVertexPosition(o,Lo),t.getVertexPosition(l,No),t.getVertexPosition(c,Do);const d=HS(t,e,n,i,Lo,No,Do,tm);if(d){const h=new F;Pn.getBarycoord(tm,Lo,No,Do,h),r&&(d.uv=Pn.getInterpolatedAttribute(r,o,l,c,h,new Ve)),s&&(d.uv1=Pn.getInterpolatedAttribute(s,o,l,c,h,new Ve)),a&&(d.normal=Pn.getInterpolatedAttribute(a,o,l,c,h,new F),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new F,materialIndex:0};Pn.getNormal(Lo,No,Do,f.normal),d.face=f,d.barycoord=h}return d}class Ja extends Ft{constructor(e=1,n=1,i=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],d=[],h=[];let f=0,p=0;_("z","y","x",-1,-1,i,n,e,a,s,0),_("z","y","x",1,-1,i,n,-e,a,s,1),_("x","z","y",1,1,e,i,n,r,a,2),_("x","z","y",1,-1,e,i,-n,r,a,3),_("x","y","z",1,-1,e,n,i,r,s,4),_("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new $n(c,3)),this.setAttribute("normal",new $n(d,3)),this.setAttribute("uv",new $n(h,2));function _(y,m,u,g,v,E,b,S,C,P,X){const x=E/C,A=b/P,G=E/2,z=b/2,W=S/2,Z=C+1,V=P+1;let J=0,N=0;const q=new F;for(let Q=0;Q<V;Q++){const se=Q*A-z;for(let Te=0;Te<Z;Te++){const He=Te*x-G;q[y]=He*g,q[m]=se*v,q[u]=W,c.push(q.x,q.y,q.z),q[y]=0,q[m]=0,q[u]=S>0?1:-1,d.push(q.x,q.y,q.z),h.push(Te/C),h.push(1-Q/P),J+=1}}for(let Q=0;Q<P;Q++)for(let se=0;se<C;se++){const Te=f+se+Z*Q,He=f+se+Z*(Q+1),j=f+(se+1)+Z*(Q+1),ne=f+(se+1)+Z*Q;l.push(Te,He,ne),l.push(He,j,ne),N+=6}o.addGroup(p,N,X),p+=N,f+=J}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ja(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Vs(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const r=t[n][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone():Array.isArray(r)?e[n][i]=r.slice():e[n][i]=r}}return e}function Kt(t){const e={};for(let n=0;n<t.length;n++){const i=Vs(t[n]);for(const r in i)e[r]=i[r]}return e}function GS(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function v_(t){const e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:tt.workingColorSpace}const WS={clone:Vs,merge:Kt};var jS=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,XS=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class si extends Or{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=jS,this.fragmentShader=XS,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Vs(e.uniforms),this.uniformsGroups=GS(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?n.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?n.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?n.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?n.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?n.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?n.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?n.uniforms[r]={type:"m4",value:a.toArray()}:n.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}}class __ extends $t{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new yt,this.projectionMatrix=new yt,this.projectionMatrixInverse=new yt,this.coordinateSystem=xi}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Fi=new F,nm=new Ve,im=new Ve;class Cn extends __{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=tf*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Hc*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return tf*2*Math.atan(Math.tan(Hc*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){Fi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Fi.x,Fi.y).multiplyScalar(-e/Fi.z),Fi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Fi.x,Fi.y).multiplyScalar(-e/Fi.z)}getViewSize(e,n){return this.getViewBounds(e,nm,im),n.subVectors(im,nm)}setViewOffset(e,n,i,r,s,a){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(Hc*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,n-=a.offsetY*i/c,r*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}const Jr=-90,es=1;class $S extends $t{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Cn(Jr,es,e,n);r.layers=this.layers,this.add(r);const s=new Cn(Jr,es,e,n);s.layers=this.layers,this.add(s);const a=new Cn(Jr,es,e,n);a.layers=this.layers,this.add(a);const o=new Cn(Jr,es,e,n);o.layers=this.layers,this.add(o);const l=new Cn(Jr,es,e,n);l.layers=this.layers,this.add(l);const c=new Cn(Jr,es,e,n);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,r,s,a,o,l]=n;for(const c of n)this.remove(c);if(e===xi)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===zl)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of n)this.add(c),c.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,d]=this.children,h=e.getRenderTarget(),f=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const y=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(n,s),e.setRenderTarget(i,1,r),e.render(n,a),e.setRenderTarget(i,2,r),e.render(n,o),e.setRenderTarget(i,3,r),e.render(n,l),e.setRenderTarget(i,4,r),e.render(n,c),i.texture.generateMipmaps=y,e.setRenderTarget(i,5,r),e.render(n,d),e.setRenderTarget(h,f,p),e.xr.enabled=_,i.texture.needsPMREMUpdate=!0}}class x_ extends Jt{constructor(e,n,i,r,s,a,o,l,c,d){e=e!==void 0?e:[],n=n!==void 0?n:ks,super(e,n,i,r,s,a,o,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class YS extends Ur{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new x_(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:Rn}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Ja(5,5,5),s=new si({name:"CubemapFromEquirect",uniforms:Vs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:dn,blending:Qi});s.uniforms.tEquirect.value=n;const a=new Wn(r,s),o=n.minFilter;return n.minFilter===Tr&&(n.minFilter=Rn),new $S(1,10,this).update(e,a),n.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,n,i,r){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(n,i,r);e.setRenderTarget(s)}}const uu=new F,qS=new F,KS=new Fe;class vr{constructor(e=new F(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const r=uu.subVectors(i,n).cross(qS.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n){const i=e.delta(uu),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:n.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||KS.getNormalMatrix(e),r=this.coplanarPoint(uu).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const fr=new Qa,ko=new F;class y_{constructor(e=new vr,n=new vr,i=new vr,r=new vr,s=new vr,a=new vr){this.planes=[e,n,i,r,s,a]}set(e,n,i,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(n),o[2].copy(i),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=xi){const i=this.planes,r=e.elements,s=r[0],a=r[1],o=r[2],l=r[3],c=r[4],d=r[5],h=r[6],f=r[7],p=r[8],_=r[9],y=r[10],m=r[11],u=r[12],g=r[13],v=r[14],E=r[15];if(i[0].setComponents(l-s,f-c,m-p,E-u).normalize(),i[1].setComponents(l+s,f+c,m+p,E+u).normalize(),i[2].setComponents(l+a,f+d,m+_,E+g).normalize(),i[3].setComponents(l-a,f-d,m-_,E-g).normalize(),i[4].setComponents(l-o,f-h,m-y,E-v).normalize(),n===xi)i[5].setComponents(l+o,f+h,m+y,E+v).normalize();else if(n===zl)i[5].setComponents(o,h,y,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),fr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),fr.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(fr)}intersectsSprite(e){return fr.center.set(0,0,0),fr.radius=.7071067811865476,fr.applyMatrix4(e.matrixWorld),this.intersectsSphere(fr)}intersectsSphere(e){const n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const r=n[i];if(ko.x=r.normal.x>0?e.max.x:e.min.x,ko.y=r.normal.y>0?e.max.y:e.min.y,ko.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(ko)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function S_(){let t=null,e=!1,n=null,i=null;function r(s,a){n(s,a),i=t.requestAnimationFrame(r)}return{start:function(){e!==!0&&n!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function ZS(t){const e=new WeakMap;function n(o,l){const c=o.array,d=o.usage,h=c.byteLength,f=t.createBuffer();t.bindBuffer(l,f),t.bufferData(l,c,d),o.onUploadCallback();let p;if(c instanceof Float32Array)p=t.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=t.HALF_FLOAT:p=t.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=t.SHORT;else if(c instanceof Uint32Array)p=t.UNSIGNED_INT;else if(c instanceof Int32Array)p=t.INT;else if(c instanceof Int8Array)p=t.BYTE;else if(c instanceof Uint8Array)p=t.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:h}}function i(o,l,c){const d=l.array,h=l.updateRanges;if(t.bindBuffer(c,o),h.length===0)t.bufferSubData(c,0,d);else{h.sort((p,_)=>p.start-_.start);let f=0;for(let p=1;p<h.length;p++){const _=h[f],y=h[p];y.start<=_.start+_.count+1?_.count=Math.max(_.count,y.start+y.count-_.start):(++f,h[f]=y)}h.length=f+1;for(let p=0,_=h.length;p<_;p++){const y=h[p];t.bufferSubData(c,y.start*d.BYTES_PER_ELEMENT,d,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(t.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,n(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:r,remove:s,update:a}}class cc extends Ft{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};const s=e/2,a=n/2,o=Math.floor(i),l=Math.floor(r),c=o+1,d=l+1,h=e/o,f=n/l,p=[],_=[],y=[],m=[];for(let u=0;u<d;u++){const g=u*f-a;for(let v=0;v<c;v++){const E=v*h-s;_.push(E,-g,0),y.push(0,0,1),m.push(v/o),m.push(1-u/l)}}for(let u=0;u<l;u++)for(let g=0;g<o;g++){const v=g+c*u,E=g+c*(u+1),b=g+1+c*(u+1),S=g+1+c*u;p.push(v,E,S),p.push(E,b,S)}this.setIndex(p),this.setAttribute("position",new $n(_,3)),this.setAttribute("normal",new $n(y,3)),this.setAttribute("uv",new $n(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new cc(e.width,e.height,e.widthSegments,e.heightSegments)}}var QS=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,JS=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,eM=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,tM=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,nM=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,iM=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,rM=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,sM=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,aM=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,oM=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,lM=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,cM=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,uM=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,dM=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,fM=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,hM=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,pM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,mM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,gM=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,vM=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,_M=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,xM=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,yM=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,SM=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,MM=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,EM=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,wM=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,TM=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,AM=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,CM=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,RM="gl_FragColor = linearToOutputTexel( gl_FragColor );",PM=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,bM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,LM=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,NM=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,DM=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,IM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,UM=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,FM=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,kM=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,OM=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,BM=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,zM=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,VM=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,HM=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,GM=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,WM=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,jM=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,XM=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,$M=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,YM=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,qM=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,KM=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,ZM=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,QM=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,JM=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,eE=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,tE=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,nE=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,iE=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,rE=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,sE=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,aE=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,oE=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,lE=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,cE=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,uE=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,dE=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,fE=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,hE=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,pE=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,mE=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,gE=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,vE=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,_E=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,xE=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,yE=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,SE=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,ME=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,EE=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,wE=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,TE=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,AE=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,CE=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,RE=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,PE=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,bE=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,LE=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,NE=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,DE=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,IE=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,UE=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,FE=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,kE=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,OE=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,BE=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,zE=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,VE=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,HE=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,GE=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,WE=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,jE=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,XE=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,$E=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,YE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,qE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,KE=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const ZE=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,QE=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,JE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ew=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,tw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,nw=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,iw=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,rw=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,sw=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,aw=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,ow=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,lw=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cw=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,uw=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,dw=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,fw=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hw=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,pw=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,mw=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,gw=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vw=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,_w=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,xw=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,yw=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Sw=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Mw=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ew=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ww=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Tw=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Aw=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Cw=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Rw=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Pw=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,bw=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ue={alphahash_fragment:QS,alphahash_pars_fragment:JS,alphamap_fragment:eM,alphamap_pars_fragment:tM,alphatest_fragment:nM,alphatest_pars_fragment:iM,aomap_fragment:rM,aomap_pars_fragment:sM,batching_pars_vertex:aM,batching_vertex:oM,begin_vertex:lM,beginnormal_vertex:cM,bsdfs:uM,iridescence_fragment:dM,bumpmap_pars_fragment:fM,clipping_planes_fragment:hM,clipping_planes_pars_fragment:pM,clipping_planes_pars_vertex:mM,clipping_planes_vertex:gM,color_fragment:vM,color_pars_fragment:_M,color_pars_vertex:xM,color_vertex:yM,common:SM,cube_uv_reflection_fragment:MM,defaultnormal_vertex:EM,displacementmap_pars_vertex:wM,displacementmap_vertex:TM,emissivemap_fragment:AM,emissivemap_pars_fragment:CM,colorspace_fragment:RM,colorspace_pars_fragment:PM,envmap_fragment:bM,envmap_common_pars_fragment:LM,envmap_pars_fragment:NM,envmap_pars_vertex:DM,envmap_physical_pars_fragment:WM,envmap_vertex:IM,fog_vertex:UM,fog_pars_vertex:FM,fog_fragment:kM,fog_pars_fragment:OM,gradientmap_pars_fragment:BM,lightmap_pars_fragment:zM,lights_lambert_fragment:VM,lights_lambert_pars_fragment:HM,lights_pars_begin:GM,lights_toon_fragment:jM,lights_toon_pars_fragment:XM,lights_phong_fragment:$M,lights_phong_pars_fragment:YM,lights_physical_fragment:qM,lights_physical_pars_fragment:KM,lights_fragment_begin:ZM,lights_fragment_maps:QM,lights_fragment_end:JM,logdepthbuf_fragment:eE,logdepthbuf_pars_fragment:tE,logdepthbuf_pars_vertex:nE,logdepthbuf_vertex:iE,map_fragment:rE,map_pars_fragment:sE,map_particle_fragment:aE,map_particle_pars_fragment:oE,metalnessmap_fragment:lE,metalnessmap_pars_fragment:cE,morphinstance_vertex:uE,morphcolor_vertex:dE,morphnormal_vertex:fE,morphtarget_pars_vertex:hE,morphtarget_vertex:pE,normal_fragment_begin:mE,normal_fragment_maps:gE,normal_pars_fragment:vE,normal_pars_vertex:_E,normal_vertex:xE,normalmap_pars_fragment:yE,clearcoat_normal_fragment_begin:SE,clearcoat_normal_fragment_maps:ME,clearcoat_pars_fragment:EE,iridescence_pars_fragment:wE,opaque_fragment:TE,packing:AE,premultiplied_alpha_fragment:CE,project_vertex:RE,dithering_fragment:PE,dithering_pars_fragment:bE,roughnessmap_fragment:LE,roughnessmap_pars_fragment:NE,shadowmap_pars_fragment:DE,shadowmap_pars_vertex:IE,shadowmap_vertex:UE,shadowmask_pars_fragment:FE,skinbase_vertex:kE,skinning_pars_vertex:OE,skinning_vertex:BE,skinnormal_vertex:zE,specularmap_fragment:VE,specularmap_pars_fragment:HE,tonemapping_fragment:GE,tonemapping_pars_fragment:WE,transmission_fragment:jE,transmission_pars_fragment:XE,uv_pars_fragment:$E,uv_pars_vertex:YE,uv_vertex:qE,worldpos_vertex:KE,background_vert:ZE,background_frag:QE,backgroundCube_vert:JE,backgroundCube_frag:ew,cube_vert:tw,cube_frag:nw,depth_vert:iw,depth_frag:rw,distanceRGBA_vert:sw,distanceRGBA_frag:aw,equirect_vert:ow,equirect_frag:lw,linedashed_vert:cw,linedashed_frag:uw,meshbasic_vert:dw,meshbasic_frag:fw,meshlambert_vert:hw,meshlambert_frag:pw,meshmatcap_vert:mw,meshmatcap_frag:gw,meshnormal_vert:vw,meshnormal_frag:_w,meshphong_vert:xw,meshphong_frag:yw,meshphysical_vert:Sw,meshphysical_frag:Mw,meshtoon_vert:Ew,meshtoon_frag:ww,points_vert:Tw,points_frag:Aw,shadow_vert:Cw,shadow_frag:Rw,sprite_vert:Pw,sprite_frag:bw},ae={common:{diffuse:{value:new Oe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Fe}},envmap:{envMap:{value:null},envMapRotation:{value:new Fe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Fe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Fe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Fe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Fe},normalScale:{value:new Ve(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Fe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Fe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Fe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Fe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Oe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Oe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0},uvTransform:{value:new Fe}},sprite:{diffuse:{value:new Oe(16777215)},opacity:{value:1},center:{value:new Ve(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}}},Qn={basic:{uniforms:Kt([ae.common,ae.specularmap,ae.envmap,ae.aomap,ae.lightmap,ae.fog]),vertexShader:Ue.meshbasic_vert,fragmentShader:Ue.meshbasic_frag},lambert:{uniforms:Kt([ae.common,ae.specularmap,ae.envmap,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.fog,ae.lights,{emissive:{value:new Oe(0)}}]),vertexShader:Ue.meshlambert_vert,fragmentShader:Ue.meshlambert_frag},phong:{uniforms:Kt([ae.common,ae.specularmap,ae.envmap,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.fog,ae.lights,{emissive:{value:new Oe(0)},specular:{value:new Oe(1118481)},shininess:{value:30}}]),vertexShader:Ue.meshphong_vert,fragmentShader:Ue.meshphong_frag},standard:{uniforms:Kt([ae.common,ae.envmap,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.roughnessmap,ae.metalnessmap,ae.fog,ae.lights,{emissive:{value:new Oe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ue.meshphysical_vert,fragmentShader:Ue.meshphysical_frag},toon:{uniforms:Kt([ae.common,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.gradientmap,ae.fog,ae.lights,{emissive:{value:new Oe(0)}}]),vertexShader:Ue.meshtoon_vert,fragmentShader:Ue.meshtoon_frag},matcap:{uniforms:Kt([ae.common,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.fog,{matcap:{value:null}}]),vertexShader:Ue.meshmatcap_vert,fragmentShader:Ue.meshmatcap_frag},points:{uniforms:Kt([ae.points,ae.fog]),vertexShader:Ue.points_vert,fragmentShader:Ue.points_frag},dashed:{uniforms:Kt([ae.common,ae.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ue.linedashed_vert,fragmentShader:Ue.linedashed_frag},depth:{uniforms:Kt([ae.common,ae.displacementmap]),vertexShader:Ue.depth_vert,fragmentShader:Ue.depth_frag},normal:{uniforms:Kt([ae.common,ae.bumpmap,ae.normalmap,ae.displacementmap,{opacity:{value:1}}]),vertexShader:Ue.meshnormal_vert,fragmentShader:Ue.meshnormal_frag},sprite:{uniforms:Kt([ae.sprite,ae.fog]),vertexShader:Ue.sprite_vert,fragmentShader:Ue.sprite_frag},background:{uniforms:{uvTransform:{value:new Fe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ue.background_vert,fragmentShader:Ue.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Fe}},vertexShader:Ue.backgroundCube_vert,fragmentShader:Ue.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ue.cube_vert,fragmentShader:Ue.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ue.equirect_vert,fragmentShader:Ue.equirect_frag},distanceRGBA:{uniforms:Kt([ae.common,ae.displacementmap,{referencePosition:{value:new F},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ue.distanceRGBA_vert,fragmentShader:Ue.distanceRGBA_frag},shadow:{uniforms:Kt([ae.lights,ae.fog,{color:{value:new Oe(0)},opacity:{value:1}}]),vertexShader:Ue.shadow_vert,fragmentShader:Ue.shadow_frag}};Qn.physical={uniforms:Kt([Qn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Fe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Fe},clearcoatNormalScale:{value:new Ve(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Fe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Fe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Fe},sheen:{value:0},sheenColor:{value:new Oe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Fe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Fe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Fe},transmissionSamplerSize:{value:new Ve},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Fe},attenuationDistance:{value:0},attenuationColor:{value:new Oe(0)},specularColor:{value:new Oe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Fe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Fe},anisotropyVector:{value:new Ve},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Fe}}]),vertexShader:Ue.meshphysical_vert,fragmentShader:Ue.meshphysical_frag};const Oo={r:0,b:0,g:0},hr=new Ai,Lw=new yt;function Nw(t,e,n,i,r,s,a){const o=new Oe(0);let l=s===!0?0:1,c,d,h=null,f=0,p=null;function _(g){let v=g.isScene===!0?g.background:null;return v&&v.isTexture&&(v=(g.backgroundBlurriness>0?n:e).get(v)),v}function y(g){let v=!1;const E=_(g);E===null?u(o,l):E&&E.isColor&&(u(E,1),v=!0);const b=t.xr.getEnvironmentBlendMode();b==="additive"?i.buffers.color.setClear(0,0,0,1,a):b==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(t.autoClear||v)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function m(g,v){const E=_(v);E&&(E.isCubeTexture||E.mapping===oc)?(d===void 0&&(d=new Wn(new Ja(1,1,1),new si({name:"BackgroundCubeMaterial",uniforms:Vs(Qn.backgroundCube.uniforms),vertexShader:Qn.backgroundCube.vertexShader,fragmentShader:Qn.backgroundCube.fragmentShader,side:dn,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(b,S,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(d)),hr.copy(v.backgroundRotation),hr.x*=-1,hr.y*=-1,hr.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(hr.y*=-1,hr.z*=-1),d.material.uniforms.envMap.value=E,d.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(Lw.makeRotationFromEuler(hr)),d.material.toneMapped=tt.getTransfer(E.colorSpace)!==pt,(h!==E||f!==E.version||p!==t.toneMapping)&&(d.material.needsUpdate=!0,h=E,f=E.version,p=t.toneMapping),d.layers.enableAll(),g.unshift(d,d.geometry,d.material,0,0,null)):E&&E.isTexture&&(c===void 0&&(c=new Wn(new cc(2,2),new si({name:"BackgroundMaterial",uniforms:Vs(Qn.background.uniforms),vertexShader:Qn.background.vertexShader,fragmentShader:Qn.background.fragmentShader,side:ir,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=E,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=tt.getTransfer(E.colorSpace)!==pt,E.matrixAutoUpdate===!0&&E.updateMatrix(),c.material.uniforms.uvTransform.value.copy(E.matrix),(h!==E||f!==E.version||p!==t.toneMapping)&&(c.material.needsUpdate=!0,h=E,f=E.version,p=t.toneMapping),c.layers.enableAll(),g.unshift(c,c.geometry,c.material,0,0,null))}function u(g,v){g.getRGB(Oo,v_(t)),i.buffers.color.setClear(Oo.r,Oo.g,Oo.b,v,a)}return{getClearColor:function(){return o},setClearColor:function(g,v=1){o.set(g),l=v,u(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(g){l=g,u(o,l)},render:y,addToRenderList:m}}function Dw(t,e){const n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},r=f(null);let s=r,a=!1;function o(x,A,G,z,W){let Z=!1;const V=h(z,G,A);s!==V&&(s=V,c(s.object)),Z=p(x,z,G,W),Z&&_(x,z,G,W),W!==null&&e.update(W,t.ELEMENT_ARRAY_BUFFER),(Z||a)&&(a=!1,E(x,A,G,z),W!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(W).buffer))}function l(){return t.createVertexArray()}function c(x){return t.bindVertexArray(x)}function d(x){return t.deleteVertexArray(x)}function h(x,A,G){const z=G.wireframe===!0;let W=i[x.id];W===void 0&&(W={},i[x.id]=W);let Z=W[A.id];Z===void 0&&(Z={},W[A.id]=Z);let V=Z[z];return V===void 0&&(V=f(l()),Z[z]=V),V}function f(x){const A=[],G=[],z=[];for(let W=0;W<n;W++)A[W]=0,G[W]=0,z[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:A,enabledAttributes:G,attributeDivisors:z,object:x,attributes:{},index:null}}function p(x,A,G,z){const W=s.attributes,Z=A.attributes;let V=0;const J=G.getAttributes();for(const N in J)if(J[N].location>=0){const Q=W[N];let se=Z[N];if(se===void 0&&(N==="instanceMatrix"&&x.instanceMatrix&&(se=x.instanceMatrix),N==="instanceColor"&&x.instanceColor&&(se=x.instanceColor)),Q===void 0||Q.attribute!==se||se&&Q.data!==se.data)return!0;V++}return s.attributesNum!==V||s.index!==z}function _(x,A,G,z){const W={},Z=A.attributes;let V=0;const J=G.getAttributes();for(const N in J)if(J[N].location>=0){let Q=Z[N];Q===void 0&&(N==="instanceMatrix"&&x.instanceMatrix&&(Q=x.instanceMatrix),N==="instanceColor"&&x.instanceColor&&(Q=x.instanceColor));const se={};se.attribute=Q,Q&&Q.data&&(se.data=Q.data),W[N]=se,V++}s.attributes=W,s.attributesNum=V,s.index=z}function y(){const x=s.newAttributes;for(let A=0,G=x.length;A<G;A++)x[A]=0}function m(x){u(x,0)}function u(x,A){const G=s.newAttributes,z=s.enabledAttributes,W=s.attributeDivisors;G[x]=1,z[x]===0&&(t.enableVertexAttribArray(x),z[x]=1),W[x]!==A&&(t.vertexAttribDivisor(x,A),W[x]=A)}function g(){const x=s.newAttributes,A=s.enabledAttributes;for(let G=0,z=A.length;G<z;G++)A[G]!==x[G]&&(t.disableVertexAttribArray(G),A[G]=0)}function v(x,A,G,z,W,Z,V){V===!0?t.vertexAttribIPointer(x,A,G,W,Z):t.vertexAttribPointer(x,A,G,z,W,Z)}function E(x,A,G,z){y();const W=z.attributes,Z=G.getAttributes(),V=A.defaultAttributeValues;for(const J in Z){const N=Z[J];if(N.location>=0){let q=W[J];if(q===void 0&&(J==="instanceMatrix"&&x.instanceMatrix&&(q=x.instanceMatrix),J==="instanceColor"&&x.instanceColor&&(q=x.instanceColor)),q!==void 0){const Q=q.normalized,se=q.itemSize,Te=e.get(q);if(Te===void 0)continue;const He=Te.buffer,j=Te.type,ne=Te.bytesPerElement,de=j===t.INT||j===t.UNSIGNED_INT||q.gpuType===rh;if(q.isInterleavedBufferAttribute){const le=q.data,De=le.stride,Ce=q.offset;if(le.isInstancedInterleavedBuffer){for(let je=0;je<N.locationSize;je++)u(N.location+je,le.meshPerAttribute);x.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=le.meshPerAttribute*le.count)}else for(let je=0;je<N.locationSize;je++)m(N.location+je);t.bindBuffer(t.ARRAY_BUFFER,He);for(let je=0;je<N.locationSize;je++)v(N.location+je,se/N.locationSize,j,Q,De*ne,(Ce+se/N.locationSize*je)*ne,de)}else{if(q.isInstancedBufferAttribute){for(let le=0;le<N.locationSize;le++)u(N.location+le,q.meshPerAttribute);x.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=q.meshPerAttribute*q.count)}else for(let le=0;le<N.locationSize;le++)m(N.location+le);t.bindBuffer(t.ARRAY_BUFFER,He);for(let le=0;le<N.locationSize;le++)v(N.location+le,se/N.locationSize,j,Q,se*ne,se/N.locationSize*le*ne,de)}}else if(V!==void 0){const Q=V[J];if(Q!==void 0)switch(Q.length){case 2:t.vertexAttrib2fv(N.location,Q);break;case 3:t.vertexAttrib3fv(N.location,Q);break;case 4:t.vertexAttrib4fv(N.location,Q);break;default:t.vertexAttrib1fv(N.location,Q)}}}}g()}function b(){P();for(const x in i){const A=i[x];for(const G in A){const z=A[G];for(const W in z)d(z[W].object),delete z[W];delete A[G]}delete i[x]}}function S(x){if(i[x.id]===void 0)return;const A=i[x.id];for(const G in A){const z=A[G];for(const W in z)d(z[W].object),delete z[W];delete A[G]}delete i[x.id]}function C(x){for(const A in i){const G=i[A];if(G[x.id]===void 0)continue;const z=G[x.id];for(const W in z)d(z[W].object),delete z[W];delete G[x.id]}}function P(){X(),a=!0,s!==r&&(s=r,c(s.object))}function X(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:P,resetDefaultState:X,dispose:b,releaseStatesOfGeometry:S,releaseStatesOfProgram:C,initAttributes:y,enableAttribute:m,disableUnusedAttributes:g}}function Iw(t,e,n){let i;function r(c){i=c}function s(c,d){t.drawArrays(i,c,d),n.update(d,i,1)}function a(c,d,h){h!==0&&(t.drawArraysInstanced(i,c,d,h),n.update(d,i,h))}function o(c,d,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,d,0,h);let p=0;for(let _=0;_<h;_++)p+=d[_];n.update(p,i,1)}function l(c,d,h,f){if(h===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let _=0;_<c.length;_++)a(c[_],d[_],f[_]);else{p.multiDrawArraysInstancedWEBGL(i,c,0,d,0,f,0,h);let _=0;for(let y=0;y<h;y++)_+=d[y];for(let y=0;y<f.length;y++)n.update(_,i,f[y])}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Uw(t,e,n,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");r=t.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(C){return!(C!==Gn&&i.convert(C)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const P=C===qa&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==Ti&&i.convert(C)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==_i&&!P)}function l(C){if(C==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=n.precision!==void 0?n.precision:"highp";const d=l(c);d!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",d,"instead."),c=d);const h=n.logarithmicDepthBuffer===!0,f=n.reverseDepthBuffer===!0&&e.has("EXT_clip_control");if(f===!0){const C=e.get("EXT_clip_control");C.clipControlEXT(C.LOWER_LEFT_EXT,C.ZERO_TO_ONE_EXT)}const p=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),_=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=t.getParameter(t.MAX_TEXTURE_SIZE),m=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),u=t.getParameter(t.MAX_VERTEX_ATTRIBS),g=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),v=t.getParameter(t.MAX_VARYING_VECTORS),E=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),b=_>0,S=t.getParameter(t.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:h,reverseDepthBuffer:f,maxTextures:p,maxVertexTextures:_,maxTextureSize:y,maxCubemapSize:m,maxAttributes:u,maxVertexUniforms:g,maxVaryings:v,maxFragmentUniforms:E,vertexTextures:b,maxSamples:S}}function Fw(t){const e=this;let n=null,i=0,r=!1,s=!1;const a=new vr,o=new Fe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){const p=h.length!==0||f||i!==0||r;return r=f,i=h.length,p},this.beginShadows=function(){s=!0,d(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,f){n=d(h,f,0)},this.setState=function(h,f,p){const _=h.clippingPlanes,y=h.clipIntersection,m=h.clipShadows,u=t.get(h);if(!r||_===null||_.length===0||s&&!m)s?d(null):c();else{const g=s?0:i,v=g*4;let E=u.clippingState||null;l.value=E,E=d(_,f,v,p);for(let b=0;b!==v;++b)E[b]=n[b];u.clippingState=E,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=g}};function c(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(h,f,p,_){const y=h!==null?h.length:0;let m=null;if(y!==0){if(m=l.value,_!==!0||m===null){const u=p+y*4,g=f.matrixWorldInverse;o.getNormalMatrix(g),(m===null||m.length<u)&&(m=new Float32Array(u));for(let v=0,E=p;v!==y;++v,E+=4)a.copy(h[v]).applyMatrix4(g,o),a.normal.toArray(m,E),m[E+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,m}}function kw(t){let e=new WeakMap;function n(a,o){return o===wd?a.mapping=ks:o===Td&&(a.mapping=Os),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===wd||o===Td)if(e.has(a)){const l=e.get(a).texture;return n(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new YS(l.height);return c.fromEquirectangularTexture(t,a),e.set(a,c),a.addEventListener("dispose",r),n(c.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class Ow extends __{constructor(e=-1,n=1,i=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,a=i+e,o=r+n,l=r-n;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=d*this.view.offsetY,l=o-d*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}const xs=4,rm=[.125,.215,.35,.446,.526,.582],yr=20,du=new Ow,sm=new Oe;let fu=null,hu=0,pu=0,mu=!1;const _r=(1+Math.sqrt(5))/2,ts=1/_r,am=[new F(-_r,ts,0),new F(_r,ts,0),new F(-ts,0,_r),new F(ts,0,_r),new F(0,_r,-ts),new F(0,_r,ts),new F(-1,1,-1),new F(1,1,-1),new F(-1,1,1),new F(1,1,1)];class om{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,n=0,i=.1,r=100){fu=this._renderer.getRenderTarget(),hu=this._renderer.getActiveCubeFace(),pu=this._renderer.getActiveMipmapLevel(),mu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),n>0&&this._blur(s,0,0,n),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=um(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=cm(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(fu,hu,pu),this._renderer.xr.enabled=mu,e.scissorTest=!1,Bo(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===ks||e.mapping===Os?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),fu=this._renderer.getRenderTarget(),hu=this._renderer.getActiveCubeFace(),pu=this._renderer.getActiveMipmapLevel(),mu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:Rn,minFilter:Rn,generateMipmaps:!1,type:qa,format:Gn,colorSpace:or,depthBuffer:!1},r=lm(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=lm(e,n,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Bw(s)),this._blurMaterial=zw(s,e,n)}return r}_compileMaterial(e){const n=new Wn(this._lodPlanes[0],e);this._renderer.compile(n,du)}_sceneToCubeUV(e,n,i,r){const o=new Cn(90,1,n,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],d=this._renderer,h=d.autoClear,f=d.toneMapping;d.getClearColor(sm),d.toneMapping=Ji,d.autoClear=!1;const p=new fh({name:"PMREM.Background",side:dn,depthWrite:!1,depthTest:!1}),_=new Wn(new Ja,p);let y=!1;const m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,y=!0):(p.color.copy(sm),y=!0);for(let u=0;u<6;u++){const g=u%3;g===0?(o.up.set(0,l[u],0),o.lookAt(c[u],0,0)):g===1?(o.up.set(0,0,l[u]),o.lookAt(0,c[u],0)):(o.up.set(0,l[u],0),o.lookAt(0,0,c[u]));const v=this._cubeSize;Bo(r,g*v,u>2?v:0,v,v),d.setRenderTarget(r),y&&d.render(_,o),d.render(e,o)}_.geometry.dispose(),_.material.dispose(),d.toneMapping=f,d.autoClear=h,e.background=m}_textureToCubeUV(e,n){const i=this._renderer,r=e.mapping===ks||e.mapping===Os;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=um()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=cm());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new Wn(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;Bo(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(a,du)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=am[(r-s-1)%am.length];this._blur(e,s-1,s,a,o)}n.autoClear=i}_blur(e,n,i,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,n,i,r,"latitudinal",s),this._halfBlur(a,e,i,i,r,"longitudinal",s)}_halfBlur(e,n,i,r,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,h=new Wn(this._lodPlanes[r],c),f=c.uniforms,p=this._sizeLods[i]-1,_=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*yr-1),y=s/_,m=isFinite(s)?1+Math.floor(d*y):yr;m>yr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${yr}`);const u=[];let g=0;for(let C=0;C<yr;++C){const P=C/y,X=Math.exp(-P*P/2);u.push(X),C===0?g+=X:C<m&&(g+=2*X)}for(let C=0;C<u.length;C++)u[C]=u[C]/g;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=u,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:v}=this;f.dTheta.value=_,f.mipInt.value=v-i;const E=this._sizeLods[r],b=3*E*(r>v-xs?r-v+xs:0),S=4*(this._cubeSize-E);Bo(n,b,S,3*E,2*E),l.setRenderTarget(n),l.render(h,du)}}function Bw(t){const e=[],n=[],i=[];let r=t;const s=t-xs+1+rm.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);n.push(o);let l=1/o;a>t-xs?l=rm[a-t+xs-1]:a===0&&(l=0),i.push(l);const c=1/(o-2),d=-c,h=1+c,f=[d,d,h,d,h,h,d,d,h,h,d,h],p=6,_=6,y=3,m=2,u=1,g=new Float32Array(y*_*p),v=new Float32Array(m*_*p),E=new Float32Array(u*_*p);for(let S=0;S<p;S++){const C=S%3*2/3-1,P=S>2?0:-1,X=[C,P,0,C+2/3,P,0,C+2/3,P+1,0,C,P,0,C+2/3,P+1,0,C,P+1,0];g.set(X,y*_*S),v.set(f,m*_*S);const x=[S,S,S,S,S,S];E.set(x,u*_*S)}const b=new Ft;b.setAttribute("position",new _t(g,y)),b.setAttribute("uv",new _t(v,m)),b.setAttribute("faceIndex",new _t(E,u)),e.push(b),r>xs&&r--}return{lodPlanes:e,sizeLods:n,sigmas:i}}function lm(t,e,n){const i=new Ur(t,e,n);return i.texture.mapping=oc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Bo(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function zw(t,e,n){const i=new Float32Array(yr),r=new F(0,1,0);return new si({name:"SphericalGaussianBlur",defines:{n:yr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:hh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Qi,depthTest:!1,depthWrite:!1})}function cm(){return new si({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:hh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Qi,depthTest:!1,depthWrite:!1})}function um(){return new si({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:hh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Qi,depthTest:!1,depthWrite:!1})}function hh(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Vw(t){let e=new WeakMap,n=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===wd||l===Td,d=l===ks||l===Os;if(c||d){let h=e.get(o);const f=h!==void 0?h.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return n===null&&(n=new om(t)),h=c?n.fromEquirectangular(o,h):n.fromCubemap(o,h),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),h.texture;if(h!==void 0)return h.texture;{const p=o.image;return c&&p&&p.height>0||d&&p&&r(p)?(n===null&&(n=new om(t)),h=c?n.fromEquirectangular(o):n.fromCubemap(o),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),o.addEventListener("dispose",s),h.texture):null}}}return o}function r(o){let l=0;const c=6;for(let d=0;d<c;d++)o[d]!==void 0&&l++;return l===c}function s(o){const l=o.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:a}}function Hw(t){const e={};function n(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=t.getExtension("WEBGL_depth_texture")||t.getExtension("MOZ_WEBGL_depth_texture")||t.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=t.getExtension("EXT_texture_filter_anisotropic")||t.getExtension("MOZ_EXT_texture_filter_anisotropic")||t.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=t.getExtension("WEBGL_compressed_texture_s3tc")||t.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=t.getExtension("WEBGL_compressed_texture_pvrtc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=t.getExtension(i)}return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const r=n(i);return r===null&&dl("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function Gw(t,e,n,i){const r={},s=new WeakMap;function a(h){const f=h.target;f.index!==null&&e.remove(f.index);for(const _ in f.attributes)e.remove(f.attributes[_]);for(const _ in f.morphAttributes){const y=f.morphAttributes[_];for(let m=0,u=y.length;m<u;m++)e.remove(y[m])}f.removeEventListener("dispose",a),delete r[f.id];const p=s.get(f);p&&(e.remove(p),s.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,n.memory.geometries--}function o(h,f){return r[f.id]===!0||(f.addEventListener("dispose",a),r[f.id]=!0,n.memory.geometries++),f}function l(h){const f=h.attributes;for(const _ in f)e.update(f[_],t.ARRAY_BUFFER);const p=h.morphAttributes;for(const _ in p){const y=p[_];for(let m=0,u=y.length;m<u;m++)e.update(y[m],t.ARRAY_BUFFER)}}function c(h){const f=[],p=h.index,_=h.attributes.position;let y=0;if(p!==null){const g=p.array;y=p.version;for(let v=0,E=g.length;v<E;v+=3){const b=g[v+0],S=g[v+1],C=g[v+2];f.push(b,S,S,C,C,b)}}else if(_!==void 0){const g=_.array;y=_.version;for(let v=0,E=g.length/3-1;v<E;v+=3){const b=v+0,S=v+1,C=v+2;f.push(b,S,S,C,C,b)}}else return;const m=new(u_(f)?g_:m_)(f,1);m.version=y;const u=s.get(h);u&&e.remove(u),s.set(h,m)}function d(h){const f=s.get(h);if(f){const p=h.index;p!==null&&f.version<p.version&&c(h)}else c(h);return s.get(h)}return{get:o,update:l,getWireframeAttribute:d}}function Ww(t,e,n){let i;function r(f){i=f}let s,a;function o(f){s=f.type,a=f.bytesPerElement}function l(f,p){t.drawElements(i,p,s,f*a),n.update(p,i,1)}function c(f,p,_){_!==0&&(t.drawElementsInstanced(i,p,s,f*a,_),n.update(p,i,_))}function d(f,p,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,s,f,0,_);let m=0;for(let u=0;u<_;u++)m+=p[u];n.update(m,i,1)}function h(f,p,_,y){if(_===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let u=0;u<f.length;u++)c(f[u]/a,p[u],y[u]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,s,f,0,y,0,_);let u=0;for(let g=0;g<_;g++)u+=p[g];for(let g=0;g<y.length;g++)n.update(u,i,y[g])}}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=d,this.renderMultiDrawInstances=h}function jw(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(n.calls++,a){case t.TRIANGLES:n.triangles+=o*(s/3);break;case t.LINES:n.lines+=o*(s/2);break;case t.LINE_STRIP:n.lines+=o*(s-1);break;case t.LINE_LOOP:n.lines+=o*s;break;case t.POINTS:n.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function Xw(t,e,n){const i=new WeakMap,r=new At;function s(a,o,l){const c=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=d!==void 0?d.length:0;let f=i.get(o);if(f===void 0||f.count!==h){let x=function(){P.dispose(),i.delete(o),o.removeEventListener("dispose",x)};var p=x;f!==void 0&&f.texture.dispose();const _=o.morphAttributes.position!==void 0,y=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,u=o.morphAttributes.position||[],g=o.morphAttributes.normal||[],v=o.morphAttributes.color||[];let E=0;_===!0&&(E=1),y===!0&&(E=2),m===!0&&(E=3);let b=o.attributes.position.count*E,S=1;b>e.maxTextureSize&&(S=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);const C=new Float32Array(b*S*4*h),P=new f_(C,b,S,h);P.type=_i,P.needsUpdate=!0;const X=E*4;for(let A=0;A<h;A++){const G=u[A],z=g[A],W=v[A],Z=b*S*4*A;for(let V=0;V<G.count;V++){const J=V*X;_===!0&&(r.fromBufferAttribute(G,V),C[Z+J+0]=r.x,C[Z+J+1]=r.y,C[Z+J+2]=r.z,C[Z+J+3]=0),y===!0&&(r.fromBufferAttribute(z,V),C[Z+J+4]=r.x,C[Z+J+5]=r.y,C[Z+J+6]=r.z,C[Z+J+7]=0),m===!0&&(r.fromBufferAttribute(W,V),C[Z+J+8]=r.x,C[Z+J+9]=r.y,C[Z+J+10]=r.z,C[Z+J+11]=W.itemSize===4?r.w:1)}}f={count:h,texture:P,size:new Ve(b,S)},i.set(o,f),o.addEventListener("dispose",x)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(t,"morphTexture",a.morphTexture,n);else{let _=0;for(let m=0;m<c.length;m++)_+=c[m];const y=o.morphTargetsRelative?1:1-_;l.getUniforms().setValue(t,"morphTargetBaseInfluence",y),l.getUniforms().setValue(t,"morphTargetInfluences",c)}l.getUniforms().setValue(t,"morphTargetsTexture",f.texture,n),l.getUniforms().setValue(t,"morphTargetsTextureSize",f.size)}return{update:s}}function $w(t,e,n,i){let r=new WeakMap;function s(l){const c=i.render.frame,d=l.geometry,h=e.get(l,d);if(r.get(h)!==c&&(e.update(h),r.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),r.get(l)!==c&&(n.update(l.instanceMatrix,t.ARRAY_BUFFER),l.instanceColor!==null&&n.update(l.instanceColor,t.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;r.get(f)!==c&&(f.update(),r.set(f,c))}return h}function a(){r=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),n.remove(c.instanceMatrix),c.instanceColor!==null&&n.remove(c.instanceColor)}return{update:s,dispose:a}}class M_ extends Jt{constructor(e,n,i,r,s,a,o,l,c,d=Cs){if(d!==Cs&&d!==zs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&d===Cs&&(i=Ir),i===void 0&&d===zs&&(i=Bs),super(null,r,s,a,o,l,d,i,c),this.isDepthTexture=!0,this.image={width:e,height:n},this.magFilter=o!==void 0?o:Ln,this.minFilter=l!==void 0?l:Ln,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}const E_=new Jt,dm=new M_(1,1),w_=new f_,T_=new NS,A_=new x_,fm=[],hm=[],pm=new Float32Array(16),mm=new Float32Array(9),gm=new Float32Array(4);function Xs(t,e,n){const i=t[0];if(i<=0||i>0)return t;const r=e*n;let s=fm[r];if(s===void 0&&(s=new Float32Array(r),fm[r]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=n,t[a].toArray(s,o)}return s}function Nt(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function Dt(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function uc(t,e){let n=hm[e];n===void 0&&(n=new Int32Array(e),hm[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function Yw(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function qw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Nt(n,e))return;t.uniform2fv(this.addr,e),Dt(n,e)}}function Kw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(Nt(n,e))return;t.uniform3fv(this.addr,e),Dt(n,e)}}function Zw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Nt(n,e))return;t.uniform4fv(this.addr,e),Dt(n,e)}}function Qw(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Nt(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),Dt(n,e)}else{if(Nt(n,i))return;gm.set(i),t.uniformMatrix2fv(this.addr,!1,gm),Dt(n,i)}}function Jw(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Nt(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),Dt(n,e)}else{if(Nt(n,i))return;mm.set(i),t.uniformMatrix3fv(this.addr,!1,mm),Dt(n,i)}}function eT(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Nt(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),Dt(n,e)}else{if(Nt(n,i))return;pm.set(i),t.uniformMatrix4fv(this.addr,!1,pm),Dt(n,i)}}function tT(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function nT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Nt(n,e))return;t.uniform2iv(this.addr,e),Dt(n,e)}}function iT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Nt(n,e))return;t.uniform3iv(this.addr,e),Dt(n,e)}}function rT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Nt(n,e))return;t.uniform4iv(this.addr,e),Dt(n,e)}}function sT(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function aT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Nt(n,e))return;t.uniform2uiv(this.addr,e),Dt(n,e)}}function oT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Nt(n,e))return;t.uniform3uiv(this.addr,e),Dt(n,e)}}function lT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Nt(n,e))return;t.uniform4uiv(this.addr,e),Dt(n,e)}}function cT(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);let s;this.type===t.SAMPLER_2D_SHADOW?(dm.compareFunction=c_,s=dm):s=E_,n.setTexture2D(e||s,r)}function uT(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||T_,r)}function dT(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||A_,r)}function fT(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||w_,r)}function hT(t){switch(t){case 5126:return Yw;case 35664:return qw;case 35665:return Kw;case 35666:return Zw;case 35674:return Qw;case 35675:return Jw;case 35676:return eT;case 5124:case 35670:return tT;case 35667:case 35671:return nT;case 35668:case 35672:return iT;case 35669:case 35673:return rT;case 5125:return sT;case 36294:return aT;case 36295:return oT;case 36296:return lT;case 35678:case 36198:case 36298:case 36306:case 35682:return cT;case 35679:case 36299:case 36307:return uT;case 35680:case 36300:case 36308:case 36293:return dT;case 36289:case 36303:case 36311:case 36292:return fT}}function pT(t,e){t.uniform1fv(this.addr,e)}function mT(t,e){const n=Xs(e,this.size,2);t.uniform2fv(this.addr,n)}function gT(t,e){const n=Xs(e,this.size,3);t.uniform3fv(this.addr,n)}function vT(t,e){const n=Xs(e,this.size,4);t.uniform4fv(this.addr,n)}function _T(t,e){const n=Xs(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function xT(t,e){const n=Xs(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function yT(t,e){const n=Xs(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function ST(t,e){t.uniform1iv(this.addr,e)}function MT(t,e){t.uniform2iv(this.addr,e)}function ET(t,e){t.uniform3iv(this.addr,e)}function wT(t,e){t.uniform4iv(this.addr,e)}function TT(t,e){t.uniform1uiv(this.addr,e)}function AT(t,e){t.uniform2uiv(this.addr,e)}function CT(t,e){t.uniform3uiv(this.addr,e)}function RT(t,e){t.uniform4uiv(this.addr,e)}function PT(t,e,n){const i=this.cache,r=e.length,s=uc(n,r);Nt(i,s)||(t.uniform1iv(this.addr,s),Dt(i,s));for(let a=0;a!==r;++a)n.setTexture2D(e[a]||E_,s[a])}function bT(t,e,n){const i=this.cache,r=e.length,s=uc(n,r);Nt(i,s)||(t.uniform1iv(this.addr,s),Dt(i,s));for(let a=0;a!==r;++a)n.setTexture3D(e[a]||T_,s[a])}function LT(t,e,n){const i=this.cache,r=e.length,s=uc(n,r);Nt(i,s)||(t.uniform1iv(this.addr,s),Dt(i,s));for(let a=0;a!==r;++a)n.setTextureCube(e[a]||A_,s[a])}function NT(t,e,n){const i=this.cache,r=e.length,s=uc(n,r);Nt(i,s)||(t.uniform1iv(this.addr,s),Dt(i,s));for(let a=0;a!==r;++a)n.setTexture2DArray(e[a]||w_,s[a])}function DT(t){switch(t){case 5126:return pT;case 35664:return mT;case 35665:return gT;case 35666:return vT;case 35674:return _T;case 35675:return xT;case 35676:return yT;case 5124:case 35670:return ST;case 35667:case 35671:return MT;case 35668:case 35672:return ET;case 35669:case 35673:return wT;case 5125:return TT;case 36294:return AT;case 36295:return CT;case 36296:return RT;case 35678:case 36198:case 36298:case 36306:case 35682:return PT;case 35679:case 36299:case 36307:return bT;case 35680:case 36300:case 36308:case 36293:return LT;case 36289:case 36303:case 36311:case 36292:return NT}}class IT{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=hT(n.type)}}class UT{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=DT(n.type)}}class FT{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,n[o.id],i)}}}const gu=/(\w+)(\])?(\[|\.)?/g;function vm(t,e){t.seq.push(e),t.map[e.id]=e}function kT(t,e,n){const i=t.name,r=i.length;for(gu.lastIndex=0;;){const s=gu.exec(i),a=gu.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){vm(n,c===void 0?new IT(o,t,e):new UT(o,t,e));break}else{let h=n.map[o];h===void 0&&(h=new FT(o),vm(n,h)),n=h}}}class fl{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(n,r),a=e.getUniformLocation(n,s.name);kT(s,a,this)}}setValue(e,n,i,r){const s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){const r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,a=n.length;s!==a;++s){const o=n[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,n){const i=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in n&&i.push(a)}return i}}function _m(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const OT=37297;let BT=0;function zT(t,e){const n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let a=r;a<s;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${n[a]}`)}return i.join(`
`)}function VT(t){const e=tt.getPrimaries(tt.workingColorSpace),n=tt.getPrimaries(t);let i;switch(e===n?i="":e===Bl&&n===Ol?i="LinearDisplayP3ToLinearSRGB":e===Ol&&n===Bl&&(i="LinearSRGBToLinearDisplayP3"),t){case or:case lc:return[i,"LinearTransferOETF"];case Zn:case uh:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",t),[i,"LinearTransferOETF"]}}function xm(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),r=t.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const a=parseInt(s[1]);return n.toUpperCase()+`

`+r+`

`+zT(t.getShaderSource(e),a)}else return r}function HT(t,e){const n=VT(e);return`vec4 ${t}( vec4 value ) { return ${n[0]}( ${n[1]}( value ) ); }`}function GT(t,e){let n;switch(e){case iS:n="Linear";break;case rS:n="Reinhard";break;case sS:n="Cineon";break;case aS:n="ACESFilmic";break;case lS:n="AgX";break;case cS:n="Neutral";break;case oS:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),n="Linear"}return"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const zo=new F;function WT(){tt.getLuminanceCoefficients(zo);const t=zo.x.toFixed(4),e=zo.y.toFixed(4),n=zo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function jT(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ma).join(`
`)}function XT(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function $T(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=t.getActiveAttrib(e,r),a=s.name;let o=1;s.type===t.FLOAT_MAT2&&(o=2),s.type===t.FLOAT_MAT3&&(o=3),s.type===t.FLOAT_MAT4&&(o=4),n[a]={type:s.type,location:t.getAttribLocation(e,a),locationSize:o}}return n}function ma(t){return t!==""}function ym(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Sm(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const YT=/^[ \t]*#include +<([\w\d./]+)>/gm;function nf(t){return t.replace(YT,KT)}const qT=new Map;function KT(t,e){let n=Ue[e];if(n===void 0){const i=qT.get(e);if(i!==void 0)n=Ue[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return nf(n)}const ZT=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Mm(t){return t.replace(ZT,QT)}function QT(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Em(t){let e=`precision ${t.precision} float;
	precision ${t.precision} int;
	precision ${t.precision} sampler2D;
	precision ${t.precision} samplerCube;
	precision ${t.precision} sampler3D;
	precision ${t.precision} sampler2DArray;
	precision ${t.precision} sampler2DShadow;
	precision ${t.precision} samplerCubeShadow;
	precision ${t.precision} sampler2DArrayShadow;
	precision ${t.precision} isampler2D;
	precision ${t.precision} isampler3D;
	precision ${t.precision} isamplerCube;
	precision ${t.precision} isampler2DArray;
	precision ${t.precision} usampler2D;
	precision ${t.precision} usampler3D;
	precision ${t.precision} usamplerCube;
	precision ${t.precision} usampler2DArray;
	`;return t.precision==="highp"?e+=`
#define HIGH_PRECISION`:t.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:t.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function JT(t){let e="SHADOWMAP_TYPE_BASIC";return t.shadowMapType===Kv?e="SHADOWMAP_TYPE_PCF":t.shadowMapType===Fy?e="SHADOWMAP_TYPE_PCF_SOFT":t.shadowMapType===fi&&(e="SHADOWMAP_TYPE_VSM"),e}function e1(t){let e="ENVMAP_TYPE_CUBE";if(t.envMap)switch(t.envMapMode){case ks:case Os:e="ENVMAP_TYPE_CUBE";break;case oc:e="ENVMAP_TYPE_CUBE_UV";break}return e}function t1(t){let e="ENVMAP_MODE_REFLECTION";if(t.envMap)switch(t.envMapMode){case Os:e="ENVMAP_MODE_REFRACTION";break}return e}function n1(t){let e="ENVMAP_BLENDING_NONE";if(t.envMap)switch(t.combine){case Zv:e="ENVMAP_BLENDING_MULTIPLY";break;case tS:e="ENVMAP_BLENDING_MIX";break;case nS:e="ENVMAP_BLENDING_ADD";break}return e}function i1(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),7*16)),texelHeight:i,maxMip:n}}function r1(t,e,n,i){const r=t.getContext(),s=n.defines;let a=n.vertexShader,o=n.fragmentShader;const l=JT(n),c=e1(n),d=t1(n),h=n1(n),f=i1(n),p=jT(n),_=XT(s),y=r.createProgram();let m,u,g=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(m=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_].filter(ma).join(`
`),m.length>0&&(m+=`
`),u=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_].filter(ma).join(`
`),u.length>0&&(u+=`
`)):(m=[Em(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+d:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ma).join(`
`),u=[Em(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+d:"",n.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor||n.batchingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==Ji?"#define TONE_MAPPING":"",n.toneMapping!==Ji?Ue.tonemapping_pars_fragment:"",n.toneMapping!==Ji?GT("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",Ue.colorspace_pars_fragment,HT("linearToOutputTexel",n.outputColorSpace),WT(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(ma).join(`
`)),a=nf(a),a=ym(a,n),a=Sm(a,n),o=nf(o),o=ym(o,n),o=Sm(o,n),a=Mm(a),o=Mm(o),n.isRawShaderMaterial!==!0&&(g=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,u=["#define varying in",n.glslVersion===zp?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===zp?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);const v=g+m+a,E=g+u+o,b=_m(r,r.VERTEX_SHADER,v),S=_m(r,r.FRAGMENT_SHADER,E);r.attachShader(y,b),r.attachShader(y,S),n.index0AttributeName!==void 0?r.bindAttribLocation(y,0,n.index0AttributeName):n.morphTargets===!0&&r.bindAttribLocation(y,0,"position"),r.linkProgram(y);function C(A){if(t.debug.checkShaderErrors){const G=r.getProgramInfoLog(y).trim(),z=r.getShaderInfoLog(b).trim(),W=r.getShaderInfoLog(S).trim();let Z=!0,V=!0;if(r.getProgramParameter(y,r.LINK_STATUS)===!1)if(Z=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,y,b,S);else{const J=xm(r,b,"vertex"),N=xm(r,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(y,r.VALIDATE_STATUS)+`

Material Name: `+A.name+`
Material Type: `+A.type+`

Program Info Log: `+G+`
`+J+`
`+N)}else G!==""?console.warn("THREE.WebGLProgram: Program Info Log:",G):(z===""||W==="")&&(V=!1);V&&(A.diagnostics={runnable:Z,programLog:G,vertexShader:{log:z,prefix:m},fragmentShader:{log:W,prefix:u}})}r.deleteShader(b),r.deleteShader(S),P=new fl(r,y),X=$T(r,y)}let P;this.getUniforms=function(){return P===void 0&&C(this),P};let X;this.getAttributes=function(){return X===void 0&&C(this),X};let x=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=r.getProgramParameter(y,OT)),x},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(y),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=BT++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=b,this.fragmentShader=S,this}let s1=0;class a1{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const n=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(n),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new o1(e),n.set(e,i)),i}}class o1{constructor(e){this.id=s1++,this.code=e,this.usedTimes=0}}function l1(t,e,n,i,r,s,a){const o=new h_,l=new a1,c=new Set,d=[],h=r.logarithmicDepthBuffer,f=r.reverseDepthBuffer,p=r.vertexTextures;let _=r.precision;const y={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(x){return c.add(x),x===0?"uv":`uv${x}`}function u(x,A,G,z,W){const Z=z.fog,V=W.geometry,J=x.isMeshStandardMaterial?z.environment:null,N=(x.isMeshStandardMaterial?n:e).get(x.envMap||J),q=N&&N.mapping===oc?N.image.height:null,Q=y[x.type];x.precision!==null&&(_=r.getMaxPrecision(x.precision),_!==x.precision&&console.warn("THREE.WebGLProgram.getParameters:",x.precision,"not supported, using",_,"instead."));const se=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,Te=se!==void 0?se.length:0;let He=0;V.morphAttributes.position!==void 0&&(He=1),V.morphAttributes.normal!==void 0&&(He=2),V.morphAttributes.color!==void 0&&(He=3);let j,ne,de,le;if(Q){const rn=Qn[Q];j=rn.vertexShader,ne=rn.fragmentShader}else j=x.vertexShader,ne=x.fragmentShader,l.update(x),de=l.getVertexShaderID(x),le=l.getFragmentShaderID(x);const De=t.getRenderTarget(),Ce=W.isInstancedMesh===!0,je=W.isBatchedMesh===!0,at=!!x.map,Xe=!!x.matcap,L=!!N,fn=!!x.aoMap,Ge=!!x.lightMap,qe=!!x.bumpMap,Pe=!!x.normalMap,dt=!!x.displacementMap,Ne=!!x.emissiveMap,R=!!x.metalnessMap,M=!!x.roughnessMap,k=x.anisotropy>0,Y=x.clearcoat>0,ee=x.dispersion>0,$=x.iridescence>0,Me=x.sheen>0,oe=x.transmission>0,me=k&&!!x.anisotropyMap,Ke=Y&&!!x.clearcoatMap,ie=Y&&!!x.clearcoatNormalMap,ge=Y&&!!x.clearcoatRoughnessMap,be=$&&!!x.iridescenceMap,Le=$&&!!x.iridescenceThicknessMap,ve=Me&&!!x.sheenColorMap,We=Me&&!!x.sheenRoughnessMap,Ie=!!x.specularMap,ct=!!x.specularColorMap,D=!!x.specularIntensityMap,fe=oe&&!!x.transmissionMap,H=oe&&!!x.thicknessMap,K=!!x.gradientMap,ce=!!x.alphaMap,he=x.alphaTest>0,$e=!!x.alphaHash,Ct=!!x.extensions;let nn=Ji;x.toneMapped&&(De===null||De.isXRRenderTarget===!0)&&(nn=t.toneMapping);const Qe={shaderID:Q,shaderType:x.type,shaderName:x.name,vertexShader:j,fragmentShader:ne,defines:x.defines,customVertexShaderID:de,customFragmentShaderID:le,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:_,batching:je,batchingColor:je&&W._colorsTexture!==null,instancing:Ce,instancingColor:Ce&&W.instanceColor!==null,instancingMorph:Ce&&W.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:De===null?t.outputColorSpace:De.isXRRenderTarget===!0?De.texture.colorSpace:or,alphaToCoverage:!!x.alphaToCoverage,map:at,matcap:Xe,envMap:L,envMapMode:L&&N.mapping,envMapCubeUVHeight:q,aoMap:fn,lightMap:Ge,bumpMap:qe,normalMap:Pe,displacementMap:p&&dt,emissiveMap:Ne,normalMapObjectSpace:Pe&&x.normalMapType===pS,normalMapTangentSpace:Pe&&x.normalMapType===hS,metalnessMap:R,roughnessMap:M,anisotropy:k,anisotropyMap:me,clearcoat:Y,clearcoatMap:Ke,clearcoatNormalMap:ie,clearcoatRoughnessMap:ge,dispersion:ee,iridescence:$,iridescenceMap:be,iridescenceThicknessMap:Le,sheen:Me,sheenColorMap:ve,sheenRoughnessMap:We,specularMap:Ie,specularColorMap:ct,specularIntensityMap:D,transmission:oe,transmissionMap:fe,thicknessMap:H,gradientMap:K,opaque:x.transparent===!1&&x.blending===As&&x.alphaToCoverage===!1,alphaMap:ce,alphaTest:he,alphaHash:$e,combine:x.combine,mapUv:at&&m(x.map.channel),aoMapUv:fn&&m(x.aoMap.channel),lightMapUv:Ge&&m(x.lightMap.channel),bumpMapUv:qe&&m(x.bumpMap.channel),normalMapUv:Pe&&m(x.normalMap.channel),displacementMapUv:dt&&m(x.displacementMap.channel),emissiveMapUv:Ne&&m(x.emissiveMap.channel),metalnessMapUv:R&&m(x.metalnessMap.channel),roughnessMapUv:M&&m(x.roughnessMap.channel),anisotropyMapUv:me&&m(x.anisotropyMap.channel),clearcoatMapUv:Ke&&m(x.clearcoatMap.channel),clearcoatNormalMapUv:ie&&m(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ge&&m(x.clearcoatRoughnessMap.channel),iridescenceMapUv:be&&m(x.iridescenceMap.channel),iridescenceThicknessMapUv:Le&&m(x.iridescenceThicknessMap.channel),sheenColorMapUv:ve&&m(x.sheenColorMap.channel),sheenRoughnessMapUv:We&&m(x.sheenRoughnessMap.channel),specularMapUv:Ie&&m(x.specularMap.channel),specularColorMapUv:ct&&m(x.specularColorMap.channel),specularIntensityMapUv:D&&m(x.specularIntensityMap.channel),transmissionMapUv:fe&&m(x.transmissionMap.channel),thicknessMapUv:H&&m(x.thicknessMap.channel),alphaMapUv:ce&&m(x.alphaMap.channel),vertexTangents:!!V.attributes.tangent&&(Pe||k),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,pointsUvs:W.isPoints===!0&&!!V.attributes.uv&&(at||ce),fog:!!Z,useFog:x.fog===!0,fogExp2:!!Z&&Z.isFogExp2,flatShading:x.flatShading===!0,sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:h,reverseDepthBuffer:f,skinning:W.isSkinnedMesh===!0,morphTargets:V.morphAttributes.position!==void 0,morphNormals:V.morphAttributes.normal!==void 0,morphColors:V.morphAttributes.color!==void 0,morphTargetsCount:Te,morphTextureStride:He,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:x.dithering,shadowMapEnabled:t.shadowMap.enabled&&G.length>0,shadowMapType:t.shadowMap.type,toneMapping:nn,decodeVideoTexture:at&&x.map.isVideoTexture===!0&&tt.getTransfer(x.map.colorSpace)===pt,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===ei,flipSided:x.side===dn,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:Ct&&x.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ct&&x.extensions.multiDraw===!0||je)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return Qe.vertexUv1s=c.has(1),Qe.vertexUv2s=c.has(2),Qe.vertexUv3s=c.has(3),c.clear(),Qe}function g(x){const A=[];if(x.shaderID?A.push(x.shaderID):(A.push(x.customVertexShaderID),A.push(x.customFragmentShaderID)),x.defines!==void 0)for(const G in x.defines)A.push(G),A.push(x.defines[G]);return x.isRawShaderMaterial===!1&&(v(A,x),E(A,x),A.push(t.outputColorSpace)),A.push(x.customProgramCacheKey),A.join()}function v(x,A){x.push(A.precision),x.push(A.outputColorSpace),x.push(A.envMapMode),x.push(A.envMapCubeUVHeight),x.push(A.mapUv),x.push(A.alphaMapUv),x.push(A.lightMapUv),x.push(A.aoMapUv),x.push(A.bumpMapUv),x.push(A.normalMapUv),x.push(A.displacementMapUv),x.push(A.emissiveMapUv),x.push(A.metalnessMapUv),x.push(A.roughnessMapUv),x.push(A.anisotropyMapUv),x.push(A.clearcoatMapUv),x.push(A.clearcoatNormalMapUv),x.push(A.clearcoatRoughnessMapUv),x.push(A.iridescenceMapUv),x.push(A.iridescenceThicknessMapUv),x.push(A.sheenColorMapUv),x.push(A.sheenRoughnessMapUv),x.push(A.specularMapUv),x.push(A.specularColorMapUv),x.push(A.specularIntensityMapUv),x.push(A.transmissionMapUv),x.push(A.thicknessMapUv),x.push(A.combine),x.push(A.fogExp2),x.push(A.sizeAttenuation),x.push(A.morphTargetsCount),x.push(A.morphAttributeCount),x.push(A.numDirLights),x.push(A.numPointLights),x.push(A.numSpotLights),x.push(A.numSpotLightMaps),x.push(A.numHemiLights),x.push(A.numRectAreaLights),x.push(A.numDirLightShadows),x.push(A.numPointLightShadows),x.push(A.numSpotLightShadows),x.push(A.numSpotLightShadowsWithMaps),x.push(A.numLightProbes),x.push(A.shadowMapType),x.push(A.toneMapping),x.push(A.numClippingPlanes),x.push(A.numClipIntersection),x.push(A.depthPacking)}function E(x,A){o.disableAll(),A.supportsVertexTextures&&o.enable(0),A.instancing&&o.enable(1),A.instancingColor&&o.enable(2),A.instancingMorph&&o.enable(3),A.matcap&&o.enable(4),A.envMap&&o.enable(5),A.normalMapObjectSpace&&o.enable(6),A.normalMapTangentSpace&&o.enable(7),A.clearcoat&&o.enable(8),A.iridescence&&o.enable(9),A.alphaTest&&o.enable(10),A.vertexColors&&o.enable(11),A.vertexAlphas&&o.enable(12),A.vertexUv1s&&o.enable(13),A.vertexUv2s&&o.enable(14),A.vertexUv3s&&o.enable(15),A.vertexTangents&&o.enable(16),A.anisotropy&&o.enable(17),A.alphaHash&&o.enable(18),A.batching&&o.enable(19),A.dispersion&&o.enable(20),A.batchingColor&&o.enable(21),x.push(o.mask),o.disableAll(),A.fog&&o.enable(0),A.useFog&&o.enable(1),A.flatShading&&o.enable(2),A.logarithmicDepthBuffer&&o.enable(3),A.reverseDepthBuffer&&o.enable(4),A.skinning&&o.enable(5),A.morphTargets&&o.enable(6),A.morphNormals&&o.enable(7),A.morphColors&&o.enable(8),A.premultipliedAlpha&&o.enable(9),A.shadowMapEnabled&&o.enable(10),A.doubleSided&&o.enable(11),A.flipSided&&o.enable(12),A.useDepthPacking&&o.enable(13),A.dithering&&o.enable(14),A.transmission&&o.enable(15),A.sheen&&o.enable(16),A.opaque&&o.enable(17),A.pointsUvs&&o.enable(18),A.decodeVideoTexture&&o.enable(19),A.alphaToCoverage&&o.enable(20),x.push(o.mask)}function b(x){const A=y[x.type];let G;if(A){const z=Qn[A];G=WS.clone(z.uniforms)}else G=x.uniforms;return G}function S(x,A){let G;for(let z=0,W=d.length;z<W;z++){const Z=d[z];if(Z.cacheKey===A){G=Z,++G.usedTimes;break}}return G===void 0&&(G=new r1(t,A,x,s),d.push(G)),G}function C(x){if(--x.usedTimes===0){const A=d.indexOf(x);d[A]=d[d.length-1],d.pop(),x.destroy()}}function P(x){l.remove(x)}function X(){l.dispose()}return{getParameters:u,getProgramCacheKey:g,getUniforms:b,acquireProgram:S,releaseProgram:C,releaseShaderCache:P,programs:d,dispose:X}}function c1(){let t=new WeakMap;function e(a){return t.has(a)}function n(a){let o=t.get(a);return o===void 0&&(o={},t.set(a,o)),o}function i(a){t.delete(a)}function r(a,o,l){t.get(a)[o]=l}function s(){t=new WeakMap}return{has:e,get:n,remove:i,update:r,dispose:s}}function u1(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.z!==e.z?t.z-e.z:t.id-e.id}function wm(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function Tm(){const t=[];let e=0;const n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function a(h,f,p,_,y,m){let u=t[e];return u===void 0?(u={id:h.id,object:h,geometry:f,material:p,groupOrder:_,renderOrder:h.renderOrder,z:y,group:m},t[e]=u):(u.id=h.id,u.object=h,u.geometry=f,u.material=p,u.groupOrder=_,u.renderOrder=h.renderOrder,u.z=y,u.group=m),e++,u}function o(h,f,p,_,y,m){const u=a(h,f,p,_,y,m);p.transmission>0?i.push(u):p.transparent===!0?r.push(u):n.push(u)}function l(h,f,p,_,y,m){const u=a(h,f,p,_,y,m);p.transmission>0?i.unshift(u):p.transparent===!0?r.unshift(u):n.unshift(u)}function c(h,f){n.length>1&&n.sort(h||u1),i.length>1&&i.sort(f||wm),r.length>1&&r.sort(f||wm)}function d(){for(let h=e,f=t.length;h<f;h++){const p=t[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:o,unshift:l,finish:d,sort:c}}function d1(){let t=new WeakMap;function e(i,r){const s=t.get(i);let a;return s===void 0?(a=new Tm,t.set(i,[a])):r>=s.length?(a=new Tm,s.push(a)):a=s[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}function f1(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new F,color:new Oe};break;case"SpotLight":n={position:new F,direction:new F,color:new Oe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new F,color:new Oe,distance:0,decay:0};break;case"HemisphereLight":n={direction:new F,skyColor:new Oe,groundColor:new Oe};break;case"RectAreaLight":n={color:new Oe,position:new F,halfWidth:new F,halfHeight:new F};break}return t[e.id]=n,n}}}function h1(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ve};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ve};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ve,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let p1=0;function m1(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function g1(t){const e=new f1,n=h1(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new F);const r=new F,s=new yt,a=new yt;function o(c){let d=0,h=0,f=0;for(let X=0;X<9;X++)i.probe[X].set(0,0,0);let p=0,_=0,y=0,m=0,u=0,g=0,v=0,E=0,b=0,S=0,C=0;c.sort(m1);for(let X=0,x=c.length;X<x;X++){const A=c[X],G=A.color,z=A.intensity,W=A.distance,Z=A.shadow&&A.shadow.map?A.shadow.map.texture:null;if(A.isAmbientLight)d+=G.r*z,h+=G.g*z,f+=G.b*z;else if(A.isLightProbe){for(let V=0;V<9;V++)i.probe[V].addScaledVector(A.sh.coefficients[V],z);C++}else if(A.isDirectionalLight){const V=e.get(A);if(V.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){const J=A.shadow,N=n.get(A);N.shadowIntensity=J.intensity,N.shadowBias=J.bias,N.shadowNormalBias=J.normalBias,N.shadowRadius=J.radius,N.shadowMapSize=J.mapSize,i.directionalShadow[p]=N,i.directionalShadowMap[p]=Z,i.directionalShadowMatrix[p]=A.shadow.matrix,g++}i.directional[p]=V,p++}else if(A.isSpotLight){const V=e.get(A);V.position.setFromMatrixPosition(A.matrixWorld),V.color.copy(G).multiplyScalar(z),V.distance=W,V.coneCos=Math.cos(A.angle),V.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),V.decay=A.decay,i.spot[y]=V;const J=A.shadow;if(A.map&&(i.spotLightMap[b]=A.map,b++,J.updateMatrices(A),A.castShadow&&S++),i.spotLightMatrix[y]=J.matrix,A.castShadow){const N=n.get(A);N.shadowIntensity=J.intensity,N.shadowBias=J.bias,N.shadowNormalBias=J.normalBias,N.shadowRadius=J.radius,N.shadowMapSize=J.mapSize,i.spotShadow[y]=N,i.spotShadowMap[y]=Z,E++}y++}else if(A.isRectAreaLight){const V=e.get(A);V.color.copy(G).multiplyScalar(z),V.halfWidth.set(A.width*.5,0,0),V.halfHeight.set(0,A.height*.5,0),i.rectArea[m]=V,m++}else if(A.isPointLight){const V=e.get(A);if(V.color.copy(A.color).multiplyScalar(A.intensity),V.distance=A.distance,V.decay=A.decay,A.castShadow){const J=A.shadow,N=n.get(A);N.shadowIntensity=J.intensity,N.shadowBias=J.bias,N.shadowNormalBias=J.normalBias,N.shadowRadius=J.radius,N.shadowMapSize=J.mapSize,N.shadowCameraNear=J.camera.near,N.shadowCameraFar=J.camera.far,i.pointShadow[_]=N,i.pointShadowMap[_]=Z,i.pointShadowMatrix[_]=A.shadow.matrix,v++}i.point[_]=V,_++}else if(A.isHemisphereLight){const V=e.get(A);V.skyColor.copy(A.color).multiplyScalar(z),V.groundColor.copy(A.groundColor).multiplyScalar(z),i.hemi[u]=V,u++}}m>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ae.LTC_FLOAT_1,i.rectAreaLTC2=ae.LTC_FLOAT_2):(i.rectAreaLTC1=ae.LTC_HALF_1,i.rectAreaLTC2=ae.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=h,i.ambient[2]=f;const P=i.hash;(P.directionalLength!==p||P.pointLength!==_||P.spotLength!==y||P.rectAreaLength!==m||P.hemiLength!==u||P.numDirectionalShadows!==g||P.numPointShadows!==v||P.numSpotShadows!==E||P.numSpotMaps!==b||P.numLightProbes!==C)&&(i.directional.length=p,i.spot.length=y,i.rectArea.length=m,i.point.length=_,i.hemi.length=u,i.directionalShadow.length=g,i.directionalShadowMap.length=g,i.pointShadow.length=v,i.pointShadowMap.length=v,i.spotShadow.length=E,i.spotShadowMap.length=E,i.directionalShadowMatrix.length=g,i.pointShadowMatrix.length=v,i.spotLightMatrix.length=E+b-S,i.spotLightMap.length=b,i.numSpotLightShadowsWithMaps=S,i.numLightProbes=C,P.directionalLength=p,P.pointLength=_,P.spotLength=y,P.rectAreaLength=m,P.hemiLength=u,P.numDirectionalShadows=g,P.numPointShadows=v,P.numSpotShadows=E,P.numSpotMaps=b,P.numLightProbes=C,i.version=p1++)}function l(c,d){let h=0,f=0,p=0,_=0,y=0;const m=d.matrixWorldInverse;for(let u=0,g=c.length;u<g;u++){const v=c[u];if(v.isDirectionalLight){const E=i.directional[h];E.direction.setFromMatrixPosition(v.matrixWorld),r.setFromMatrixPosition(v.target.matrixWorld),E.direction.sub(r),E.direction.transformDirection(m),h++}else if(v.isSpotLight){const E=i.spot[p];E.position.setFromMatrixPosition(v.matrixWorld),E.position.applyMatrix4(m),E.direction.setFromMatrixPosition(v.matrixWorld),r.setFromMatrixPosition(v.target.matrixWorld),E.direction.sub(r),E.direction.transformDirection(m),p++}else if(v.isRectAreaLight){const E=i.rectArea[_];E.position.setFromMatrixPosition(v.matrixWorld),E.position.applyMatrix4(m),a.identity(),s.copy(v.matrixWorld),s.premultiply(m),a.extractRotation(s),E.halfWidth.set(v.width*.5,0,0),E.halfHeight.set(0,v.height*.5,0),E.halfWidth.applyMatrix4(a),E.halfHeight.applyMatrix4(a),_++}else if(v.isPointLight){const E=i.point[f];E.position.setFromMatrixPosition(v.matrixWorld),E.position.applyMatrix4(m),f++}else if(v.isHemisphereLight){const E=i.hemi[y];E.direction.setFromMatrixPosition(v.matrixWorld),E.direction.transformDirection(m),y++}}}return{setup:o,setupView:l,state:i}}function Am(t){const e=new g1(t),n=[],i=[];function r(d){c.camera=d,n.length=0,i.length=0}function s(d){n.push(d)}function a(d){i.push(d)}function o(){e.setup(n)}function l(d){e.setupView(n,d)}const c={lightsArray:n,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:o,setupLightsView:l,pushLight:s,pushShadow:a}}function v1(t){let e=new WeakMap;function n(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new Am(t),e.set(r,[o])):s>=a.length?(o=new Am(t),a.push(o)):o=a[s],o}function i(){e=new WeakMap}return{get:n,dispose:i}}class _1 extends Or{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=dS,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class x1 extends Or{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const y1=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,S1=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function M1(t,e,n){let i=new y_;const r=new Ve,s=new Ve,a=new At,o=new _1({depthPacking:fS}),l=new x1,c={},d=n.maxTextureSize,h={[ir]:dn,[dn]:ir,[ei]:ei},f=new si({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ve},radius:{value:4}},vertexShader:y1,fragmentShader:S1}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const _=new Ft;_.setAttribute("position",new _t(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new Wn(_,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Kv;let u=this.type;this.render=function(S,C,P){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;const X=t.getRenderTarget(),x=t.getActiveCubeFace(),A=t.getActiveMipmapLevel(),G=t.state;G.setBlending(Qi),G.buffers.color.setClear(1,1,1,1),G.buffers.depth.setTest(!0),G.setScissorTest(!1);const z=u!==fi&&this.type===fi,W=u===fi&&this.type!==fi;for(let Z=0,V=S.length;Z<V;Z++){const J=S[Z],N=J.shadow;if(N===void 0){console.warn("THREE.WebGLShadowMap:",J,"has no shadow.");continue}if(N.autoUpdate===!1&&N.needsUpdate===!1)continue;r.copy(N.mapSize);const q=N.getFrameExtents();if(r.multiply(q),s.copy(N.mapSize),(r.x>d||r.y>d)&&(r.x>d&&(s.x=Math.floor(d/q.x),r.x=s.x*q.x,N.mapSize.x=s.x),r.y>d&&(s.y=Math.floor(d/q.y),r.y=s.y*q.y,N.mapSize.y=s.y)),N.map===null||z===!0||W===!0){const se=this.type!==fi?{minFilter:Ln,magFilter:Ln}:{};N.map!==null&&N.map.dispose(),N.map=new Ur(r.x,r.y,se),N.map.texture.name=J.name+".shadowMap",N.camera.updateProjectionMatrix()}t.setRenderTarget(N.map),t.clear();const Q=N.getViewportCount();for(let se=0;se<Q;se++){const Te=N.getViewport(se);a.set(s.x*Te.x,s.y*Te.y,s.x*Te.z,s.y*Te.w),G.viewport(a),N.updateMatrices(J,se),i=N.getFrustum(),E(C,P,N.camera,J,this.type)}N.isPointLightShadow!==!0&&this.type===fi&&g(N,P),N.needsUpdate=!1}u=this.type,m.needsUpdate=!1,t.setRenderTarget(X,x,A)};function g(S,C){const P=e.update(y);f.defines.VSM_SAMPLES!==S.blurSamples&&(f.defines.VSM_SAMPLES=S.blurSamples,p.defines.VSM_SAMPLES=S.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new Ur(r.x,r.y)),f.uniforms.shadow_pass.value=S.map.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,t.setRenderTarget(S.mapPass),t.clear(),t.renderBufferDirect(C,null,P,f,y,null),p.uniforms.shadow_pass.value=S.mapPass.texture,p.uniforms.resolution.value=S.mapSize,p.uniforms.radius.value=S.radius,t.setRenderTarget(S.map),t.clear(),t.renderBufferDirect(C,null,P,p,y,null)}function v(S,C,P,X){let x=null;const A=P.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(A!==void 0)x=A;else if(x=P.isPointLight===!0?l:o,t.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0){const G=x.uuid,z=C.uuid;let W=c[G];W===void 0&&(W={},c[G]=W);let Z=W[z];Z===void 0&&(Z=x.clone(),W[z]=Z,C.addEventListener("dispose",b)),x=Z}if(x.visible=C.visible,x.wireframe=C.wireframe,X===fi?x.side=C.shadowSide!==null?C.shadowSide:C.side:x.side=C.shadowSide!==null?C.shadowSide:h[C.side],x.alphaMap=C.alphaMap,x.alphaTest=C.alphaTest,x.map=C.map,x.clipShadows=C.clipShadows,x.clippingPlanes=C.clippingPlanes,x.clipIntersection=C.clipIntersection,x.displacementMap=C.displacementMap,x.displacementScale=C.displacementScale,x.displacementBias=C.displacementBias,x.wireframeLinewidth=C.wireframeLinewidth,x.linewidth=C.linewidth,P.isPointLight===!0&&x.isMeshDistanceMaterial===!0){const G=t.properties.get(x);G.light=P}return x}function E(S,C,P,X,x){if(S.visible===!1)return;if(S.layers.test(C.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&x===fi)&&(!S.frustumCulled||i.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,S.matrixWorld);const z=e.update(S),W=S.material;if(Array.isArray(W)){const Z=z.groups;for(let V=0,J=Z.length;V<J;V++){const N=Z[V],q=W[N.materialIndex];if(q&&q.visible){const Q=v(S,q,X,x);S.onBeforeShadow(t,S,C,P,z,Q,N),t.renderBufferDirect(P,null,z,Q,S,N),S.onAfterShadow(t,S,C,P,z,Q,N)}}}else if(W.visible){const Z=v(S,W,X,x);S.onBeforeShadow(t,S,C,P,z,Z,null),t.renderBufferDirect(P,null,z,Z,S,null),S.onAfterShadow(t,S,C,P,z,Z,null)}}const G=S.children;for(let z=0,W=G.length;z<W;z++)E(G[z],C,P,X,x)}function b(S){S.target.removeEventListener("dispose",b);for(const P in c){const X=c[P],x=S.target.uuid;x in X&&(X[x].dispose(),delete X[x])}}}const E1={[vd]:_d,[xd]:Md,[yd]:Ed,[Fs]:Sd,[_d]:vd,[Md]:xd,[Ed]:yd,[Sd]:Fs};function w1(t){function e(){let D=!1;const fe=new At;let H=null;const K=new At(0,0,0,0);return{setMask:function(ce){H!==ce&&!D&&(t.colorMask(ce,ce,ce,ce),H=ce)},setLocked:function(ce){D=ce},setClear:function(ce,he,$e,Ct,nn){nn===!0&&(ce*=Ct,he*=Ct,$e*=Ct),fe.set(ce,he,$e,Ct),K.equals(fe)===!1&&(t.clearColor(ce,he,$e,Ct),K.copy(fe))},reset:function(){D=!1,H=null,K.set(-1,0,0,0)}}}function n(){let D=!1,fe=!1,H=null,K=null,ce=null;return{setReversed:function(he){fe=he},setTest:function(he){he?de(t.DEPTH_TEST):le(t.DEPTH_TEST)},setMask:function(he){H!==he&&!D&&(t.depthMask(he),H=he)},setFunc:function(he){if(fe&&(he=E1[he]),K!==he){switch(he){case vd:t.depthFunc(t.NEVER);break;case _d:t.depthFunc(t.ALWAYS);break;case xd:t.depthFunc(t.LESS);break;case Fs:t.depthFunc(t.LEQUAL);break;case yd:t.depthFunc(t.EQUAL);break;case Sd:t.depthFunc(t.GEQUAL);break;case Md:t.depthFunc(t.GREATER);break;case Ed:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}K=he}},setLocked:function(he){D=he},setClear:function(he){ce!==he&&(t.clearDepth(he),ce=he)},reset:function(){D=!1,H=null,K=null,ce=null}}}function i(){let D=!1,fe=null,H=null,K=null,ce=null,he=null,$e=null,Ct=null,nn=null;return{setTest:function(Qe){D||(Qe?de(t.STENCIL_TEST):le(t.STENCIL_TEST))},setMask:function(Qe){fe!==Qe&&!D&&(t.stencilMask(Qe),fe=Qe)},setFunc:function(Qe,rn,ai){(H!==Qe||K!==rn||ce!==ai)&&(t.stencilFunc(Qe,rn,ai),H=Qe,K=rn,ce=ai)},setOp:function(Qe,rn,ai){(he!==Qe||$e!==rn||Ct!==ai)&&(t.stencilOp(Qe,rn,ai),he=Qe,$e=rn,Ct=ai)},setLocked:function(Qe){D=Qe},setClear:function(Qe){nn!==Qe&&(t.clearStencil(Qe),nn=Qe)},reset:function(){D=!1,fe=null,H=null,K=null,ce=null,he=null,$e=null,Ct=null,nn=null}}}const r=new e,s=new n,a=new i,o=new WeakMap,l=new WeakMap;let c={},d={},h=new WeakMap,f=[],p=null,_=!1,y=null,m=null,u=null,g=null,v=null,E=null,b=null,S=new Oe(0,0,0),C=0,P=!1,X=null,x=null,A=null,G=null,z=null;const W=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Z=!1,V=0;const J=t.getParameter(t.VERSION);J.indexOf("WebGL")!==-1?(V=parseFloat(/^WebGL (\d)/.exec(J)[1]),Z=V>=1):J.indexOf("OpenGL ES")!==-1&&(V=parseFloat(/^OpenGL ES (\d)/.exec(J)[1]),Z=V>=2);let N=null,q={};const Q=t.getParameter(t.SCISSOR_BOX),se=t.getParameter(t.VIEWPORT),Te=new At().fromArray(Q),He=new At().fromArray(se);function j(D,fe,H,K){const ce=new Uint8Array(4),he=t.createTexture();t.bindTexture(D,he),t.texParameteri(D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(D,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let $e=0;$e<H;$e++)D===t.TEXTURE_3D||D===t.TEXTURE_2D_ARRAY?t.texImage3D(fe,0,t.RGBA,1,1,K,0,t.RGBA,t.UNSIGNED_BYTE,ce):t.texImage2D(fe+$e,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,ce);return he}const ne={};ne[t.TEXTURE_2D]=j(t.TEXTURE_2D,t.TEXTURE_2D,1),ne[t.TEXTURE_CUBE_MAP]=j(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),ne[t.TEXTURE_2D_ARRAY]=j(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),ne[t.TEXTURE_3D]=j(t.TEXTURE_3D,t.TEXTURE_3D,1,1),r.setClear(0,0,0,1),s.setClear(1),a.setClear(0),de(t.DEPTH_TEST),s.setFunc(Fs),Ge(!1),qe(Fp),de(t.CULL_FACE),L(Qi);function de(D){c[D]!==!0&&(t.enable(D),c[D]=!0)}function le(D){c[D]!==!1&&(t.disable(D),c[D]=!1)}function De(D,fe){return d[D]!==fe?(t.bindFramebuffer(D,fe),d[D]=fe,D===t.DRAW_FRAMEBUFFER&&(d[t.FRAMEBUFFER]=fe),D===t.FRAMEBUFFER&&(d[t.DRAW_FRAMEBUFFER]=fe),!0):!1}function Ce(D,fe){let H=f,K=!1;if(D){H=h.get(fe),H===void 0&&(H=[],h.set(fe,H));const ce=D.textures;if(H.length!==ce.length||H[0]!==t.COLOR_ATTACHMENT0){for(let he=0,$e=ce.length;he<$e;he++)H[he]=t.COLOR_ATTACHMENT0+he;H.length=ce.length,K=!0}}else H[0]!==t.BACK&&(H[0]=t.BACK,K=!0);K&&t.drawBuffers(H)}function je(D){return p!==D?(t.useProgram(D),p=D,!0):!1}const at={[xr]:t.FUNC_ADD,[Oy]:t.FUNC_SUBTRACT,[By]:t.FUNC_REVERSE_SUBTRACT};at[zy]=t.MIN,at[Vy]=t.MAX;const Xe={[Hy]:t.ZERO,[Gy]:t.ONE,[Wy]:t.SRC_COLOR,[md]:t.SRC_ALPHA,[Ky]:t.SRC_ALPHA_SATURATE,[Yy]:t.DST_COLOR,[Xy]:t.DST_ALPHA,[jy]:t.ONE_MINUS_SRC_COLOR,[gd]:t.ONE_MINUS_SRC_ALPHA,[qy]:t.ONE_MINUS_DST_COLOR,[$y]:t.ONE_MINUS_DST_ALPHA,[Zy]:t.CONSTANT_COLOR,[Qy]:t.ONE_MINUS_CONSTANT_COLOR,[Jy]:t.CONSTANT_ALPHA,[eS]:t.ONE_MINUS_CONSTANT_ALPHA};function L(D,fe,H,K,ce,he,$e,Ct,nn,Qe){if(D===Qi){_===!0&&(le(t.BLEND),_=!1);return}if(_===!1&&(de(t.BLEND),_=!0),D!==ky){if(D!==y||Qe!==P){if((m!==xr||v!==xr)&&(t.blendEquation(t.FUNC_ADD),m=xr,v=xr),Qe)switch(D){case As:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case ni:t.blendFunc(t.ONE,t.ONE);break;case kp:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Op:t.blendFuncSeparate(t.ZERO,t.SRC_COLOR,t.ZERO,t.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case As:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case ni:t.blendFunc(t.SRC_ALPHA,t.ONE);break;case kp:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Op:t.blendFunc(t.ZERO,t.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}u=null,g=null,E=null,b=null,S.set(0,0,0),C=0,y=D,P=Qe}return}ce=ce||fe,he=he||H,$e=$e||K,(fe!==m||ce!==v)&&(t.blendEquationSeparate(at[fe],at[ce]),m=fe,v=ce),(H!==u||K!==g||he!==E||$e!==b)&&(t.blendFuncSeparate(Xe[H],Xe[K],Xe[he],Xe[$e]),u=H,g=K,E=he,b=$e),(Ct.equals(S)===!1||nn!==C)&&(t.blendColor(Ct.r,Ct.g,Ct.b,nn),S.copy(Ct),C=nn),y=D,P=!1}function fn(D,fe){D.side===ei?le(t.CULL_FACE):de(t.CULL_FACE);let H=D.side===dn;fe&&(H=!H),Ge(H),D.blending===As&&D.transparent===!1?L(Qi):L(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),s.setFunc(D.depthFunc),s.setTest(D.depthTest),s.setMask(D.depthWrite),r.setMask(D.colorWrite);const K=D.stencilWrite;a.setTest(K),K&&(a.setMask(D.stencilWriteMask),a.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),a.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),dt(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?de(t.SAMPLE_ALPHA_TO_COVERAGE):le(t.SAMPLE_ALPHA_TO_COVERAGE)}function Ge(D){X!==D&&(D?t.frontFace(t.CW):t.frontFace(t.CCW),X=D)}function qe(D){D!==Iy?(de(t.CULL_FACE),D!==x&&(D===Fp?t.cullFace(t.BACK):D===Uy?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):le(t.CULL_FACE),x=D}function Pe(D){D!==A&&(Z&&t.lineWidth(D),A=D)}function dt(D,fe,H){D?(de(t.POLYGON_OFFSET_FILL),(G!==fe||z!==H)&&(t.polygonOffset(fe,H),G=fe,z=H)):le(t.POLYGON_OFFSET_FILL)}function Ne(D){D?de(t.SCISSOR_TEST):le(t.SCISSOR_TEST)}function R(D){D===void 0&&(D=t.TEXTURE0+W-1),N!==D&&(t.activeTexture(D),N=D)}function M(D,fe,H){H===void 0&&(N===null?H=t.TEXTURE0+W-1:H=N);let K=q[H];K===void 0&&(K={type:void 0,texture:void 0},q[H]=K),(K.type!==D||K.texture!==fe)&&(N!==H&&(t.activeTexture(H),N=H),t.bindTexture(D,fe||ne[D]),K.type=D,K.texture=fe)}function k(){const D=q[N];D!==void 0&&D.type!==void 0&&(t.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function Y(){try{t.compressedTexImage2D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ee(){try{t.compressedTexImage3D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function $(){try{t.texSubImage2D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Me(){try{t.texSubImage3D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function oe(){try{t.compressedTexSubImage2D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function me(){try{t.compressedTexSubImage3D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ke(){try{t.texStorage2D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ie(){try{t.texStorage3D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ge(){try{t.texImage2D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function be(){try{t.texImage3D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Le(D){Te.equals(D)===!1&&(t.scissor(D.x,D.y,D.z,D.w),Te.copy(D))}function ve(D){He.equals(D)===!1&&(t.viewport(D.x,D.y,D.z,D.w),He.copy(D))}function We(D,fe){let H=l.get(fe);H===void 0&&(H=new WeakMap,l.set(fe,H));let K=H.get(D);K===void 0&&(K=t.getUniformBlockIndex(fe,D.name),H.set(D,K))}function Ie(D,fe){const K=l.get(fe).get(D);o.get(fe)!==K&&(t.uniformBlockBinding(fe,K,D.__bindingPointIndex),o.set(fe,K))}function ct(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),c={},N=null,q={},d={},h=new WeakMap,f=[],p=null,_=!1,y=null,m=null,u=null,g=null,v=null,E=null,b=null,S=new Oe(0,0,0),C=0,P=!1,X=null,x=null,A=null,G=null,z=null,Te.set(0,0,t.canvas.width,t.canvas.height),He.set(0,0,t.canvas.width,t.canvas.height),r.reset(),s.reset(),a.reset()}return{buffers:{color:r,depth:s,stencil:a},enable:de,disable:le,bindFramebuffer:De,drawBuffers:Ce,useProgram:je,setBlending:L,setMaterial:fn,setFlipSided:Ge,setCullFace:qe,setLineWidth:Pe,setPolygonOffset:dt,setScissorTest:Ne,activeTexture:R,bindTexture:M,unbindTexture:k,compressedTexImage2D:Y,compressedTexImage3D:ee,texImage2D:ge,texImage3D:be,updateUBOMapping:We,uniformBlockBinding:Ie,texStorage2D:Ke,texStorage3D:ie,texSubImage2D:$,texSubImage3D:Me,compressedTexSubImage2D:oe,compressedTexSubImage3D:me,scissor:Le,viewport:ve,reset:ct}}function Cm(t,e,n,i){const r=T1(i);switch(n){case n_:return t*e;case r_:return t*e;case s_:return t*e*2;case a_:return t*e/r.components*r.byteLength;case oh:return t*e/r.components*r.byteLength;case o_:return t*e*2/r.components*r.byteLength;case lh:return t*e*2/r.components*r.byteLength;case i_:return t*e*3/r.components*r.byteLength;case Gn:return t*e*4/r.components*r.byteLength;case ch:return t*e*4/r.components*r.byteLength;case al:case ol:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case ll:case cl:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Pd:case Ld:return Math.max(t,16)*Math.max(e,8)/4;case Rd:case bd:return Math.max(t,8)*Math.max(e,8)/2;case Nd:case Dd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Id:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Ud:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Fd:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case kd:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case Od:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case Bd:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case zd:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case Vd:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case Hd:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case Gd:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case Wd:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case jd:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case Xd:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case $d:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case Yd:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case ul:case qd:case Kd:return Math.ceil(t/4)*Math.ceil(e/4)*16;case l_:case Zd:return Math.ceil(t/4)*Math.ceil(e/4)*8;case Qd:case Jd:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function T1(t){switch(t){case Ti:case Jv:return{byteLength:1,components:1};case Ga:case e_:case qa:return{byteLength:2,components:1};case sh:case ah:return{byteLength:2,components:4};case Ir:case rh:case _i:return{byteLength:4,components:1};case t_:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${t}.`)}function A1(t,e,n,i,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ve,d=new WeakMap;let h;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(R,M){return p?new OffscreenCanvas(R,M):Vl("canvas")}function y(R,M,k){let Y=1;const ee=Ne(R);if((ee.width>k||ee.height>k)&&(Y=k/Math.max(ee.width,ee.height)),Y<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const $=Math.floor(Y*ee.width),Me=Math.floor(Y*ee.height);h===void 0&&(h=_($,Me));const oe=M?_($,Me):h;return oe.width=$,oe.height=Me,oe.getContext("2d").drawImage(R,0,0,$,Me),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ee.width+"x"+ee.height+") to ("+$+"x"+Me+")."),oe}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ee.width+"x"+ee.height+")."),R;return R}function m(R){return R.generateMipmaps&&R.minFilter!==Ln&&R.minFilter!==Rn}function u(R){t.generateMipmap(R)}function g(R,M,k,Y,ee=!1){if(R!==null){if(t[R]!==void 0)return t[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let $=M;if(M===t.RED&&(k===t.FLOAT&&($=t.R32F),k===t.HALF_FLOAT&&($=t.R16F),k===t.UNSIGNED_BYTE&&($=t.R8)),M===t.RED_INTEGER&&(k===t.UNSIGNED_BYTE&&($=t.R8UI),k===t.UNSIGNED_SHORT&&($=t.R16UI),k===t.UNSIGNED_INT&&($=t.R32UI),k===t.BYTE&&($=t.R8I),k===t.SHORT&&($=t.R16I),k===t.INT&&($=t.R32I)),M===t.RG&&(k===t.FLOAT&&($=t.RG32F),k===t.HALF_FLOAT&&($=t.RG16F),k===t.UNSIGNED_BYTE&&($=t.RG8)),M===t.RG_INTEGER&&(k===t.UNSIGNED_BYTE&&($=t.RG8UI),k===t.UNSIGNED_SHORT&&($=t.RG16UI),k===t.UNSIGNED_INT&&($=t.RG32UI),k===t.BYTE&&($=t.RG8I),k===t.SHORT&&($=t.RG16I),k===t.INT&&($=t.RG32I)),M===t.RGB_INTEGER&&(k===t.UNSIGNED_BYTE&&($=t.RGB8UI),k===t.UNSIGNED_SHORT&&($=t.RGB16UI),k===t.UNSIGNED_INT&&($=t.RGB32UI),k===t.BYTE&&($=t.RGB8I),k===t.SHORT&&($=t.RGB16I),k===t.INT&&($=t.RGB32I)),M===t.RGBA_INTEGER&&(k===t.UNSIGNED_BYTE&&($=t.RGBA8UI),k===t.UNSIGNED_SHORT&&($=t.RGBA16UI),k===t.UNSIGNED_INT&&($=t.RGBA32UI),k===t.BYTE&&($=t.RGBA8I),k===t.SHORT&&($=t.RGBA16I),k===t.INT&&($=t.RGBA32I)),M===t.RGB&&k===t.UNSIGNED_INT_5_9_9_9_REV&&($=t.RGB9_E5),M===t.RGBA){const Me=ee?kl:tt.getTransfer(Y);k===t.FLOAT&&($=t.RGBA32F),k===t.HALF_FLOAT&&($=t.RGBA16F),k===t.UNSIGNED_BYTE&&($=Me===pt?t.SRGB8_ALPHA8:t.RGBA8),k===t.UNSIGNED_SHORT_4_4_4_4&&($=t.RGBA4),k===t.UNSIGNED_SHORT_5_5_5_1&&($=t.RGB5_A1)}return($===t.R16F||$===t.R32F||$===t.RG16F||$===t.RG32F||$===t.RGBA16F||$===t.RGBA32F)&&e.get("EXT_color_buffer_float"),$}function v(R,M){let k;return R?M===null||M===Ir||M===Bs?k=t.DEPTH24_STENCIL8:M===_i?k=t.DEPTH32F_STENCIL8:M===Ga&&(k=t.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===Ir||M===Bs?k=t.DEPTH_COMPONENT24:M===_i?k=t.DEPTH_COMPONENT32F:M===Ga&&(k=t.DEPTH_COMPONENT16),k}function E(R,M){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==Ln&&R.minFilter!==Rn?Math.log2(Math.max(M.width,M.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?M.mipmaps.length:1}function b(R){const M=R.target;M.removeEventListener("dispose",b),C(M),M.isVideoTexture&&d.delete(M)}function S(R){const M=R.target;M.removeEventListener("dispose",S),X(M)}function C(R){const M=i.get(R);if(M.__webglInit===void 0)return;const k=R.source,Y=f.get(k);if(Y){const ee=Y[M.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&P(R),Object.keys(Y).length===0&&f.delete(k)}i.remove(R)}function P(R){const M=i.get(R);t.deleteTexture(M.__webglTexture);const k=R.source,Y=f.get(k);delete Y[M.__cacheKey],a.memory.textures--}function X(R){const M=i.get(R);if(R.depthTexture&&R.depthTexture.dispose(),R.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(M.__webglFramebuffer[Y]))for(let ee=0;ee<M.__webglFramebuffer[Y].length;ee++)t.deleteFramebuffer(M.__webglFramebuffer[Y][ee]);else t.deleteFramebuffer(M.__webglFramebuffer[Y]);M.__webglDepthbuffer&&t.deleteRenderbuffer(M.__webglDepthbuffer[Y])}else{if(Array.isArray(M.__webglFramebuffer))for(let Y=0;Y<M.__webglFramebuffer.length;Y++)t.deleteFramebuffer(M.__webglFramebuffer[Y]);else t.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&t.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&t.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let Y=0;Y<M.__webglColorRenderbuffer.length;Y++)M.__webglColorRenderbuffer[Y]&&t.deleteRenderbuffer(M.__webglColorRenderbuffer[Y]);M.__webglDepthRenderbuffer&&t.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const k=R.textures;for(let Y=0,ee=k.length;Y<ee;Y++){const $=i.get(k[Y]);$.__webglTexture&&(t.deleteTexture($.__webglTexture),a.memory.textures--),i.remove(k[Y])}i.remove(R)}let x=0;function A(){x=0}function G(){const R=x;return R>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+r.maxTextures),x+=1,R}function z(R){const M=[];return M.push(R.wrapS),M.push(R.wrapT),M.push(R.wrapR||0),M.push(R.magFilter),M.push(R.minFilter),M.push(R.anisotropy),M.push(R.internalFormat),M.push(R.format),M.push(R.type),M.push(R.generateMipmaps),M.push(R.premultiplyAlpha),M.push(R.flipY),M.push(R.unpackAlignment),M.push(R.colorSpace),M.join()}function W(R,M){const k=i.get(R);if(R.isVideoTexture&&Pe(R),R.isRenderTargetTexture===!1&&R.version>0&&k.__version!==R.version){const Y=R.image;if(Y===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{He(k,R,M);return}}n.bindTexture(t.TEXTURE_2D,k.__webglTexture,t.TEXTURE0+M)}function Z(R,M){const k=i.get(R);if(R.version>0&&k.__version!==R.version){He(k,R,M);return}n.bindTexture(t.TEXTURE_2D_ARRAY,k.__webglTexture,t.TEXTURE0+M)}function V(R,M){const k=i.get(R);if(R.version>0&&k.__version!==R.version){He(k,R,M);return}n.bindTexture(t.TEXTURE_3D,k.__webglTexture,t.TEXTURE0+M)}function J(R,M){const k=i.get(R);if(R.version>0&&k.__version!==R.version){j(k,R,M);return}n.bindTexture(t.TEXTURE_CUBE_MAP,k.__webglTexture,t.TEXTURE0+M)}const N={[Ad]:t.REPEAT,[wr]:t.CLAMP_TO_EDGE,[Cd]:t.MIRRORED_REPEAT},q={[Ln]:t.NEAREST,[uS]:t.NEAREST_MIPMAP_NEAREST,[yo]:t.NEAREST_MIPMAP_LINEAR,[Rn]:t.LINEAR,[Vc]:t.LINEAR_MIPMAP_NEAREST,[Tr]:t.LINEAR_MIPMAP_LINEAR},Q={[mS]:t.NEVER,[SS]:t.ALWAYS,[gS]:t.LESS,[c_]:t.LEQUAL,[vS]:t.EQUAL,[yS]:t.GEQUAL,[_S]:t.GREATER,[xS]:t.NOTEQUAL};function se(R,M){if(M.type===_i&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===Rn||M.magFilter===Vc||M.magFilter===yo||M.magFilter===Tr||M.minFilter===Rn||M.minFilter===Vc||M.minFilter===yo||M.minFilter===Tr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(R,t.TEXTURE_WRAP_S,N[M.wrapS]),t.texParameteri(R,t.TEXTURE_WRAP_T,N[M.wrapT]),(R===t.TEXTURE_3D||R===t.TEXTURE_2D_ARRAY)&&t.texParameteri(R,t.TEXTURE_WRAP_R,N[M.wrapR]),t.texParameteri(R,t.TEXTURE_MAG_FILTER,q[M.magFilter]),t.texParameteri(R,t.TEXTURE_MIN_FILTER,q[M.minFilter]),M.compareFunction&&(t.texParameteri(R,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(R,t.TEXTURE_COMPARE_FUNC,Q[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===Ln||M.minFilter!==yo&&M.minFilter!==Tr||M.type===_i&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||i.get(M).__currentAnisotropy){const k=e.get("EXT_texture_filter_anisotropic");t.texParameterf(R,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,r.getMaxAnisotropy())),i.get(M).__currentAnisotropy=M.anisotropy}}}function Te(R,M){let k=!1;R.__webglInit===void 0&&(R.__webglInit=!0,M.addEventListener("dispose",b));const Y=M.source;let ee=f.get(Y);ee===void 0&&(ee={},f.set(Y,ee));const $=z(M);if($!==R.__cacheKey){ee[$]===void 0&&(ee[$]={texture:t.createTexture(),usedTimes:0},a.memory.textures++,k=!0),ee[$].usedTimes++;const Me=ee[R.__cacheKey];Me!==void 0&&(ee[R.__cacheKey].usedTimes--,Me.usedTimes===0&&P(M)),R.__cacheKey=$,R.__webglTexture=ee[$].texture}return k}function He(R,M,k){let Y=t.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(Y=t.TEXTURE_2D_ARRAY),M.isData3DTexture&&(Y=t.TEXTURE_3D);const ee=Te(R,M),$=M.source;n.bindTexture(Y,R.__webglTexture,t.TEXTURE0+k);const Me=i.get($);if($.version!==Me.__version||ee===!0){n.activeTexture(t.TEXTURE0+k);const oe=tt.getPrimaries(tt.workingColorSpace),me=M.colorSpace===Vi?null:tt.getPrimaries(M.colorSpace),Ke=M.colorSpace===Vi||oe===me?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,M.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ke);let ie=y(M.image,!1,r.maxTextureSize);ie=dt(M,ie);const ge=s.convert(M.format,M.colorSpace),be=s.convert(M.type);let Le=g(M.internalFormat,ge,be,M.colorSpace,M.isVideoTexture);se(Y,M);let ve;const We=M.mipmaps,Ie=M.isVideoTexture!==!0,ct=Me.__version===void 0||ee===!0,D=$.dataReady,fe=E(M,ie);if(M.isDepthTexture)Le=v(M.format===zs,M.type),ct&&(Ie?n.texStorage2D(t.TEXTURE_2D,1,Le,ie.width,ie.height):n.texImage2D(t.TEXTURE_2D,0,Le,ie.width,ie.height,0,ge,be,null));else if(M.isDataTexture)if(We.length>0){Ie&&ct&&n.texStorage2D(t.TEXTURE_2D,fe,Le,We[0].width,We[0].height);for(let H=0,K=We.length;H<K;H++)ve=We[H],Ie?D&&n.texSubImage2D(t.TEXTURE_2D,H,0,0,ve.width,ve.height,ge,be,ve.data):n.texImage2D(t.TEXTURE_2D,H,Le,ve.width,ve.height,0,ge,be,ve.data);M.generateMipmaps=!1}else Ie?(ct&&n.texStorage2D(t.TEXTURE_2D,fe,Le,ie.width,ie.height),D&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,ie.width,ie.height,ge,be,ie.data)):n.texImage2D(t.TEXTURE_2D,0,Le,ie.width,ie.height,0,ge,be,ie.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){Ie&&ct&&n.texStorage3D(t.TEXTURE_2D_ARRAY,fe,Le,We[0].width,We[0].height,ie.depth);for(let H=0,K=We.length;H<K;H++)if(ve=We[H],M.format!==Gn)if(ge!==null)if(Ie){if(D)if(M.layerUpdates.size>0){const ce=Cm(ve.width,ve.height,M.format,M.type);for(const he of M.layerUpdates){const $e=ve.data.subarray(he*ce/ve.data.BYTES_PER_ELEMENT,(he+1)*ce/ve.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,H,0,0,he,ve.width,ve.height,1,ge,$e,0,0)}M.clearLayerUpdates()}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,H,0,0,0,ve.width,ve.height,ie.depth,ge,ve.data,0,0)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,H,Le,ve.width,ve.height,ie.depth,0,ve.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ie?D&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,H,0,0,0,ve.width,ve.height,ie.depth,ge,be,ve.data):n.texImage3D(t.TEXTURE_2D_ARRAY,H,Le,ve.width,ve.height,ie.depth,0,ge,be,ve.data)}else{Ie&&ct&&n.texStorage2D(t.TEXTURE_2D,fe,Le,We[0].width,We[0].height);for(let H=0,K=We.length;H<K;H++)ve=We[H],M.format!==Gn?ge!==null?Ie?D&&n.compressedTexSubImage2D(t.TEXTURE_2D,H,0,0,ve.width,ve.height,ge,ve.data):n.compressedTexImage2D(t.TEXTURE_2D,H,Le,ve.width,ve.height,0,ve.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ie?D&&n.texSubImage2D(t.TEXTURE_2D,H,0,0,ve.width,ve.height,ge,be,ve.data):n.texImage2D(t.TEXTURE_2D,H,Le,ve.width,ve.height,0,ge,be,ve.data)}else if(M.isDataArrayTexture)if(Ie){if(ct&&n.texStorage3D(t.TEXTURE_2D_ARRAY,fe,Le,ie.width,ie.height,ie.depth),D)if(M.layerUpdates.size>0){const H=Cm(ie.width,ie.height,M.format,M.type);for(const K of M.layerUpdates){const ce=ie.data.subarray(K*H/ie.data.BYTES_PER_ELEMENT,(K+1)*H/ie.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,K,ie.width,ie.height,1,ge,be,ce)}M.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,ie.width,ie.height,ie.depth,ge,be,ie.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,Le,ie.width,ie.height,ie.depth,0,ge,be,ie.data);else if(M.isData3DTexture)Ie?(ct&&n.texStorage3D(t.TEXTURE_3D,fe,Le,ie.width,ie.height,ie.depth),D&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,ie.width,ie.height,ie.depth,ge,be,ie.data)):n.texImage3D(t.TEXTURE_3D,0,Le,ie.width,ie.height,ie.depth,0,ge,be,ie.data);else if(M.isFramebufferTexture){if(ct)if(Ie)n.texStorage2D(t.TEXTURE_2D,fe,Le,ie.width,ie.height);else{let H=ie.width,K=ie.height;for(let ce=0;ce<fe;ce++)n.texImage2D(t.TEXTURE_2D,ce,Le,H,K,0,ge,be,null),H>>=1,K>>=1}}else if(We.length>0){if(Ie&&ct){const H=Ne(We[0]);n.texStorage2D(t.TEXTURE_2D,fe,Le,H.width,H.height)}for(let H=0,K=We.length;H<K;H++)ve=We[H],Ie?D&&n.texSubImage2D(t.TEXTURE_2D,H,0,0,ge,be,ve):n.texImage2D(t.TEXTURE_2D,H,Le,ge,be,ve);M.generateMipmaps=!1}else if(Ie){if(ct){const H=Ne(ie);n.texStorage2D(t.TEXTURE_2D,fe,Le,H.width,H.height)}D&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,ge,be,ie)}else n.texImage2D(t.TEXTURE_2D,0,Le,ge,be,ie);m(M)&&u(Y),Me.__version=$.version,M.onUpdate&&M.onUpdate(M)}R.__version=M.version}function j(R,M,k){if(M.image.length!==6)return;const Y=Te(R,M),ee=M.source;n.bindTexture(t.TEXTURE_CUBE_MAP,R.__webglTexture,t.TEXTURE0+k);const $=i.get(ee);if(ee.version!==$.__version||Y===!0){n.activeTexture(t.TEXTURE0+k);const Me=tt.getPrimaries(tt.workingColorSpace),oe=M.colorSpace===Vi?null:tt.getPrimaries(M.colorSpace),me=M.colorSpace===Vi||Me===oe?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,M.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,me);const Ke=M.isCompressedTexture||M.image[0].isCompressedTexture,ie=M.image[0]&&M.image[0].isDataTexture,ge=[];for(let K=0;K<6;K++)!Ke&&!ie?ge[K]=y(M.image[K],!0,r.maxCubemapSize):ge[K]=ie?M.image[K].image:M.image[K],ge[K]=dt(M,ge[K]);const be=ge[0],Le=s.convert(M.format,M.colorSpace),ve=s.convert(M.type),We=g(M.internalFormat,Le,ve,M.colorSpace),Ie=M.isVideoTexture!==!0,ct=$.__version===void 0||Y===!0,D=ee.dataReady;let fe=E(M,be);se(t.TEXTURE_CUBE_MAP,M);let H;if(Ke){Ie&&ct&&n.texStorage2D(t.TEXTURE_CUBE_MAP,fe,We,be.width,be.height);for(let K=0;K<6;K++){H=ge[K].mipmaps;for(let ce=0;ce<H.length;ce++){const he=H[ce];M.format!==Gn?Le!==null?Ie?D&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,ce,0,0,he.width,he.height,Le,he.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,ce,We,he.width,he.height,0,he.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ie?D&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,ce,0,0,he.width,he.height,Le,ve,he.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,ce,We,he.width,he.height,0,Le,ve,he.data)}}}else{if(H=M.mipmaps,Ie&&ct){H.length>0&&fe++;const K=Ne(ge[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,fe,We,K.width,K.height)}for(let K=0;K<6;K++)if(ie){Ie?D&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,ge[K].width,ge[K].height,Le,ve,ge[K].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,We,ge[K].width,ge[K].height,0,Le,ve,ge[K].data);for(let ce=0;ce<H.length;ce++){const $e=H[ce].image[K].image;Ie?D&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,ce+1,0,0,$e.width,$e.height,Le,ve,$e.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,ce+1,We,$e.width,$e.height,0,Le,ve,$e.data)}}else{Ie?D&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,Le,ve,ge[K]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,We,Le,ve,ge[K]);for(let ce=0;ce<H.length;ce++){const he=H[ce];Ie?D&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,ce+1,0,0,Le,ve,he.image[K]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,ce+1,We,Le,ve,he.image[K])}}}m(M)&&u(t.TEXTURE_CUBE_MAP),$.__version=ee.version,M.onUpdate&&M.onUpdate(M)}R.__version=M.version}function ne(R,M,k,Y,ee,$){const Me=s.convert(k.format,k.colorSpace),oe=s.convert(k.type),me=g(k.internalFormat,Me,oe,k.colorSpace);if(!i.get(M).__hasExternalTextures){const ie=Math.max(1,M.width>>$),ge=Math.max(1,M.height>>$);ee===t.TEXTURE_3D||ee===t.TEXTURE_2D_ARRAY?n.texImage3D(ee,$,me,ie,ge,M.depth,0,Me,oe,null):n.texImage2D(ee,$,me,ie,ge,0,Me,oe,null)}n.bindFramebuffer(t.FRAMEBUFFER,R),qe(M)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,Y,ee,i.get(k).__webglTexture,0,Ge(M)):(ee===t.TEXTURE_2D||ee>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,Y,ee,i.get(k).__webglTexture,$),n.bindFramebuffer(t.FRAMEBUFFER,null)}function de(R,M,k){if(t.bindRenderbuffer(t.RENDERBUFFER,R),M.depthBuffer){const Y=M.depthTexture,ee=Y&&Y.isDepthTexture?Y.type:null,$=v(M.stencilBuffer,ee),Me=M.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,oe=Ge(M);qe(M)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,oe,$,M.width,M.height):k?t.renderbufferStorageMultisample(t.RENDERBUFFER,oe,$,M.width,M.height):t.renderbufferStorage(t.RENDERBUFFER,$,M.width,M.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,Me,t.RENDERBUFFER,R)}else{const Y=M.textures;for(let ee=0;ee<Y.length;ee++){const $=Y[ee],Me=s.convert($.format,$.colorSpace),oe=s.convert($.type),me=g($.internalFormat,Me,oe,$.colorSpace),Ke=Ge(M);k&&qe(M)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,Ke,me,M.width,M.height):qe(M)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,Ke,me,M.width,M.height):t.renderbufferStorage(t.RENDERBUFFER,me,M.width,M.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function le(R,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(t.FRAMEBUFFER,R),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(M.depthTexture).__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),W(M.depthTexture,0);const Y=i.get(M.depthTexture).__webglTexture,ee=Ge(M);if(M.depthTexture.format===Cs)qe(M)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,Y,0,ee):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,Y,0);else if(M.depthTexture.format===zs)qe(M)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,Y,0,ee):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,Y,0);else throw new Error("Unknown depthTexture format")}function De(R){const M=i.get(R),k=R.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==R.depthTexture){const Y=R.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),Y){const ee=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,Y.removeEventListener("dispose",ee)};Y.addEventListener("dispose",ee),M.__depthDisposeCallback=ee}M.__boundDepthTexture=Y}if(R.depthTexture&&!M.__autoAllocateDepthBuffer){if(k)throw new Error("target.depthTexture not supported in Cube render targets");le(M.__webglFramebuffer,R)}else if(k){M.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(n.bindFramebuffer(t.FRAMEBUFFER,M.__webglFramebuffer[Y]),M.__webglDepthbuffer[Y]===void 0)M.__webglDepthbuffer[Y]=t.createRenderbuffer(),de(M.__webglDepthbuffer[Y],R,!1);else{const ee=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,$=M.__webglDepthbuffer[Y];t.bindRenderbuffer(t.RENDERBUFFER,$),t.framebufferRenderbuffer(t.FRAMEBUFFER,ee,t.RENDERBUFFER,$)}}else if(n.bindFramebuffer(t.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=t.createRenderbuffer(),de(M.__webglDepthbuffer,R,!1);else{const Y=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,ee=M.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,ee),t.framebufferRenderbuffer(t.FRAMEBUFFER,Y,t.RENDERBUFFER,ee)}n.bindFramebuffer(t.FRAMEBUFFER,null)}function Ce(R,M,k){const Y=i.get(R);M!==void 0&&ne(Y.__webglFramebuffer,R,R.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),k!==void 0&&De(R)}function je(R){const M=R.texture,k=i.get(R),Y=i.get(M);R.addEventListener("dispose",S);const ee=R.textures,$=R.isWebGLCubeRenderTarget===!0,Me=ee.length>1;if(Me||(Y.__webglTexture===void 0&&(Y.__webglTexture=t.createTexture()),Y.__version=M.version,a.memory.textures++),$){k.__webglFramebuffer=[];for(let oe=0;oe<6;oe++)if(M.mipmaps&&M.mipmaps.length>0){k.__webglFramebuffer[oe]=[];for(let me=0;me<M.mipmaps.length;me++)k.__webglFramebuffer[oe][me]=t.createFramebuffer()}else k.__webglFramebuffer[oe]=t.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){k.__webglFramebuffer=[];for(let oe=0;oe<M.mipmaps.length;oe++)k.__webglFramebuffer[oe]=t.createFramebuffer()}else k.__webglFramebuffer=t.createFramebuffer();if(Me)for(let oe=0,me=ee.length;oe<me;oe++){const Ke=i.get(ee[oe]);Ke.__webglTexture===void 0&&(Ke.__webglTexture=t.createTexture(),a.memory.textures++)}if(R.samples>0&&qe(R)===!1){k.__webglMultisampledFramebuffer=t.createFramebuffer(),k.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let oe=0;oe<ee.length;oe++){const me=ee[oe];k.__webglColorRenderbuffer[oe]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,k.__webglColorRenderbuffer[oe]);const Ke=s.convert(me.format,me.colorSpace),ie=s.convert(me.type),ge=g(me.internalFormat,Ke,ie,me.colorSpace,R.isXRRenderTarget===!0),be=Ge(R);t.renderbufferStorageMultisample(t.RENDERBUFFER,be,ge,R.width,R.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+oe,t.RENDERBUFFER,k.__webglColorRenderbuffer[oe])}t.bindRenderbuffer(t.RENDERBUFFER,null),R.depthBuffer&&(k.__webglDepthRenderbuffer=t.createRenderbuffer(),de(k.__webglDepthRenderbuffer,R,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if($){n.bindTexture(t.TEXTURE_CUBE_MAP,Y.__webglTexture),se(t.TEXTURE_CUBE_MAP,M);for(let oe=0;oe<6;oe++)if(M.mipmaps&&M.mipmaps.length>0)for(let me=0;me<M.mipmaps.length;me++)ne(k.__webglFramebuffer[oe][me],R,M,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+oe,me);else ne(k.__webglFramebuffer[oe],R,M,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0);m(M)&&u(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(Me){for(let oe=0,me=ee.length;oe<me;oe++){const Ke=ee[oe],ie=i.get(Ke);n.bindTexture(t.TEXTURE_2D,ie.__webglTexture),se(t.TEXTURE_2D,Ke),ne(k.__webglFramebuffer,R,Ke,t.COLOR_ATTACHMENT0+oe,t.TEXTURE_2D,0),m(Ke)&&u(t.TEXTURE_2D)}n.unbindTexture()}else{let oe=t.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(oe=R.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(oe,Y.__webglTexture),se(oe,M),M.mipmaps&&M.mipmaps.length>0)for(let me=0;me<M.mipmaps.length;me++)ne(k.__webglFramebuffer[me],R,M,t.COLOR_ATTACHMENT0,oe,me);else ne(k.__webglFramebuffer,R,M,t.COLOR_ATTACHMENT0,oe,0);m(M)&&u(oe),n.unbindTexture()}R.depthBuffer&&De(R)}function at(R){const M=R.textures;for(let k=0,Y=M.length;k<Y;k++){const ee=M[k];if(m(ee)){const $=R.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:t.TEXTURE_2D,Me=i.get(ee).__webglTexture;n.bindTexture($,Me),u($),n.unbindTexture()}}}const Xe=[],L=[];function fn(R){if(R.samples>0){if(qe(R)===!1){const M=R.textures,k=R.width,Y=R.height;let ee=t.COLOR_BUFFER_BIT;const $=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Me=i.get(R),oe=M.length>1;if(oe)for(let me=0;me<M.length;me++)n.bindFramebuffer(t.FRAMEBUFFER,Me.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+me,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,Me.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+me,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,Me.__webglMultisampledFramebuffer),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Me.__webglFramebuffer);for(let me=0;me<M.length;me++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(ee|=t.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(ee|=t.STENCIL_BUFFER_BIT)),oe){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,Me.__webglColorRenderbuffer[me]);const Ke=i.get(M[me]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,Ke,0)}t.blitFramebuffer(0,0,k,Y,0,0,k,Y,ee,t.NEAREST),l===!0&&(Xe.length=0,L.length=0,Xe.push(t.COLOR_ATTACHMENT0+me),R.depthBuffer&&R.resolveDepthBuffer===!1&&(Xe.push($),L.push($),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,L)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,Xe))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),oe)for(let me=0;me<M.length;me++){n.bindFramebuffer(t.FRAMEBUFFER,Me.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+me,t.RENDERBUFFER,Me.__webglColorRenderbuffer[me]);const Ke=i.get(M[me]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,Me.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+me,t.TEXTURE_2D,Ke,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Me.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){const M=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[M])}}}function Ge(R){return Math.min(r.maxSamples,R.samples)}function qe(R){const M=i.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function Pe(R){const M=a.render.frame;d.get(R)!==M&&(d.set(R,M),R.update())}function dt(R,M){const k=R.colorSpace,Y=R.format,ee=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||k!==or&&k!==Vi&&(tt.getTransfer(k)===pt?(Y!==Gn||ee!==Ti)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",k)),M}function Ne(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=G,this.resetTextureUnits=A,this.setTexture2D=W,this.setTexture2DArray=Z,this.setTexture3D=V,this.setTextureCube=J,this.rebindTextures=Ce,this.setupRenderTarget=je,this.updateRenderTargetMipmap=at,this.updateMultisampleRenderTarget=fn,this.setupDepthRenderbuffer=De,this.setupFrameBufferTexture=ne,this.useMultisampledRTT=qe}function C1(t,e){function n(i,r=Vi){let s;const a=tt.getTransfer(r);if(i===Ti)return t.UNSIGNED_BYTE;if(i===sh)return t.UNSIGNED_SHORT_4_4_4_4;if(i===ah)return t.UNSIGNED_SHORT_5_5_5_1;if(i===t_)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===Jv)return t.BYTE;if(i===e_)return t.SHORT;if(i===Ga)return t.UNSIGNED_SHORT;if(i===rh)return t.INT;if(i===Ir)return t.UNSIGNED_INT;if(i===_i)return t.FLOAT;if(i===qa)return t.HALF_FLOAT;if(i===n_)return t.ALPHA;if(i===i_)return t.RGB;if(i===Gn)return t.RGBA;if(i===r_)return t.LUMINANCE;if(i===s_)return t.LUMINANCE_ALPHA;if(i===Cs)return t.DEPTH_COMPONENT;if(i===zs)return t.DEPTH_STENCIL;if(i===a_)return t.RED;if(i===oh)return t.RED_INTEGER;if(i===o_)return t.RG;if(i===lh)return t.RG_INTEGER;if(i===ch)return t.RGBA_INTEGER;if(i===al||i===ol||i===ll||i===cl)if(a===pt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===al)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===ol)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ll)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===cl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===al)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===ol)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ll)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===cl)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Rd||i===Pd||i===bd||i===Ld)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Rd)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Pd)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===bd)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Ld)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Nd||i===Dd||i===Id)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Nd||i===Dd)return a===pt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Id)return a===pt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Ud||i===Fd||i===kd||i===Od||i===Bd||i===zd||i===Vd||i===Hd||i===Gd||i===Wd||i===jd||i===Xd||i===$d||i===Yd)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Ud)return a===pt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Fd)return a===pt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===kd)return a===pt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Od)return a===pt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Bd)return a===pt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===zd)return a===pt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Vd)return a===pt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Hd)return a===pt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Gd)return a===pt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Wd)return a===pt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===jd)return a===pt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Xd)return a===pt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===$d)return a===pt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Yd)return a===pt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===ul||i===qd||i===Kd)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===ul)return a===pt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===qd)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Kd)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===l_||i===Zd||i===Qd||i===Jd)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===ul)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Zd)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Qd)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Jd)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Bs?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}class R1 extends Cn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Ar extends $t{constructor(){super(),this.isGroup=!0,this.type="Group"}}const P1={type:"move"};class vu{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ar,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ar,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new F,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new F),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ar,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new F,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new F),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const y of e.hand.values()){const m=n.getJointPose(y,i),u=this._getHandJoint(c,y);m!==null&&(u.matrix.fromArray(m.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=m.radius),u.visible=m!==null}const d=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],f=d.position.distanceTo(h.position),p=.02,_=.005;c.inputState.pinching&&f>p+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=p-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(P1)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new Ar;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}const b1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,L1=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class N1{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n,i){if(this.texture===null){const r=new Jt,s=e.properties.get(r);s.__webglTexture=n.texture,(n.depthNear!=i.depthNear||n.depthFar!=i.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,i=new si({vertexShader:b1,fragmentShader:L1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new Wn(new cc(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class D1 extends js{constructor(e,n){super();const i=this;let r=null,s=1,a=null,o="local-floor",l=1,c=null,d=null,h=null,f=null,p=null,_=null;const y=new N1,m=n.getContextAttributes();let u=null,g=null;const v=[],E=[],b=new Ve;let S=null;const C=new Cn;C.layers.enable(1),C.viewport=new At;const P=new Cn;P.layers.enable(2),P.viewport=new At;const X=[C,P],x=new R1;x.layers.enable(1),x.layers.enable(2);let A=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let ne=v[j];return ne===void 0&&(ne=new vu,v[j]=ne),ne.getTargetRaySpace()},this.getControllerGrip=function(j){let ne=v[j];return ne===void 0&&(ne=new vu,v[j]=ne),ne.getGripSpace()},this.getHand=function(j){let ne=v[j];return ne===void 0&&(ne=new vu,v[j]=ne),ne.getHandSpace()};function z(j){const ne=E.indexOf(j.inputSource);if(ne===-1)return;const de=v[ne];de!==void 0&&(de.update(j.inputSource,j.frame,c||a),de.dispatchEvent({type:j.type,data:j.inputSource}))}function W(){r.removeEventListener("select",z),r.removeEventListener("selectstart",z),r.removeEventListener("selectend",z),r.removeEventListener("squeeze",z),r.removeEventListener("squeezestart",z),r.removeEventListener("squeezeend",z),r.removeEventListener("end",W),r.removeEventListener("inputsourceschange",Z);for(let j=0;j<v.length;j++){const ne=E[j];ne!==null&&(E[j]=null,v[j].disconnect(ne))}A=null,G=null,y.reset(),e.setRenderTarget(u),p=null,f=null,h=null,r=null,g=null,He.stop(),i.isPresenting=!1,e.setPixelRatio(S),e.setSize(b.width,b.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){s=j,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){o=j,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(j){c=j},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return h},this.getFrame=function(){return _},this.getSession=function(){return r},this.setSession=async function(j){if(r=j,r!==null){if(u=e.getRenderTarget(),r.addEventListener("select",z),r.addEventListener("selectstart",z),r.addEventListener("selectend",z),r.addEventListener("squeeze",z),r.addEventListener("squeezestart",z),r.addEventListener("squeezeend",z),r.addEventListener("end",W),r.addEventListener("inputsourceschange",Z),m.xrCompatible!==!0&&await n.makeXRCompatible(),S=e.getPixelRatio(),e.getSize(b),r.renderState.layers===void 0){const ne={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,n,ne),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),g=new Ur(p.framebufferWidth,p.framebufferHeight,{format:Gn,type:Ti,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let ne=null,de=null,le=null;m.depth&&(le=m.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,ne=m.stencil?zs:Cs,de=m.stencil?Bs:Ir);const De={colorFormat:n.RGBA8,depthFormat:le,scaleFactor:s};h=new XRWebGLBinding(r,n),f=h.createProjectionLayer(De),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),g=new Ur(f.textureWidth,f.textureHeight,{format:Gn,type:Ti,depthTexture:new M_(f.textureWidth,f.textureHeight,de,void 0,void 0,void 0,void 0,void 0,void 0,ne),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}g.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await r.requestReferenceSpace(o),He.setContext(r),He.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function Z(j){for(let ne=0;ne<j.removed.length;ne++){const de=j.removed[ne],le=E.indexOf(de);le>=0&&(E[le]=null,v[le].disconnect(de))}for(let ne=0;ne<j.added.length;ne++){const de=j.added[ne];let le=E.indexOf(de);if(le===-1){for(let Ce=0;Ce<v.length;Ce++)if(Ce>=E.length){E.push(de),le=Ce;break}else if(E[Ce]===null){E[Ce]=de,le=Ce;break}if(le===-1)break}const De=v[le];De&&De.connect(de)}}const V=new F,J=new F;function N(j,ne,de){V.setFromMatrixPosition(ne.matrixWorld),J.setFromMatrixPosition(de.matrixWorld);const le=V.distanceTo(J),De=ne.projectionMatrix.elements,Ce=de.projectionMatrix.elements,je=De[14]/(De[10]-1),at=De[14]/(De[10]+1),Xe=(De[9]+1)/De[5],L=(De[9]-1)/De[5],fn=(De[8]-1)/De[0],Ge=(Ce[8]+1)/Ce[0],qe=je*fn,Pe=je*Ge,dt=le/(-fn+Ge),Ne=dt*-fn;if(ne.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(Ne),j.translateZ(dt),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),De[10]===-1)j.projectionMatrix.copy(ne.projectionMatrix),j.projectionMatrixInverse.copy(ne.projectionMatrixInverse);else{const R=je+dt,M=at+dt,k=qe-Ne,Y=Pe+(le-Ne),ee=Xe*at/M*R,$=L*at/M*R;j.projectionMatrix.makePerspective(k,Y,ee,$,R,M),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function q(j,ne){ne===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(ne.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(r===null)return;let ne=j.near,de=j.far;y.texture!==null&&(y.depthNear>0&&(ne=y.depthNear),y.depthFar>0&&(de=y.depthFar)),x.near=P.near=C.near=ne,x.far=P.far=C.far=de,(A!==x.near||G!==x.far)&&(r.updateRenderState({depthNear:x.near,depthFar:x.far}),A=x.near,G=x.far);const le=j.parent,De=x.cameras;q(x,le);for(let Ce=0;Ce<De.length;Ce++)q(De[Ce],le);De.length===2?N(x,C,P):x.projectionMatrix.copy(C.projectionMatrix),Q(j,x,le)};function Q(j,ne,de){de===null?j.matrix.copy(ne.matrixWorld):(j.matrix.copy(de.matrixWorld),j.matrix.invert(),j.matrix.multiply(ne.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(ne.projectionMatrix),j.projectionMatrixInverse.copy(ne.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=tf*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return x},this.getFoveation=function(){if(!(f===null&&p===null))return l},this.setFoveation=function(j){l=j,f!==null&&(f.fixedFoveation=j),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=j)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(x)};let se=null;function Te(j,ne){if(d=ne.getViewerPose(c||a),_=ne,d!==null){const de=d.views;p!==null&&(e.setRenderTargetFramebuffer(g,p.framebuffer),e.setRenderTarget(g));let le=!1;de.length!==x.cameras.length&&(x.cameras.length=0,le=!0);for(let Ce=0;Ce<de.length;Ce++){const je=de[Ce];let at=null;if(p!==null)at=p.getViewport(je);else{const L=h.getViewSubImage(f,je);at=L.viewport,Ce===0&&(e.setRenderTargetTextures(g,L.colorTexture,f.ignoreDepthValues?void 0:L.depthStencilTexture),e.setRenderTarget(g))}let Xe=X[Ce];Xe===void 0&&(Xe=new Cn,Xe.layers.enable(Ce),Xe.viewport=new At,X[Ce]=Xe),Xe.matrix.fromArray(je.transform.matrix),Xe.matrix.decompose(Xe.position,Xe.quaternion,Xe.scale),Xe.projectionMatrix.fromArray(je.projectionMatrix),Xe.projectionMatrixInverse.copy(Xe.projectionMatrix).invert(),Xe.viewport.set(at.x,at.y,at.width,at.height),Ce===0&&(x.matrix.copy(Xe.matrix),x.matrix.decompose(x.position,x.quaternion,x.scale)),le===!0&&x.cameras.push(Xe)}const De=r.enabledFeatures;if(De&&De.includes("depth-sensing")){const Ce=h.getDepthInformation(de[0]);Ce&&Ce.isValid&&Ce.texture&&y.init(e,Ce,r.renderState)}}for(let de=0;de<v.length;de++){const le=E[de],De=v[de];le!==null&&De!==void 0&&De.update(le,ne,c||a)}se&&se(j,ne),ne.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ne}),_=null}const He=new S_;He.setAnimationLoop(Te),this.setAnimationLoop=function(j){se=j},this.dispose=function(){}}}const pr=new Ai,I1=new yt;function U1(t,e){function n(m,u){m.matrixAutoUpdate===!0&&m.updateMatrix(),u.value.copy(m.matrix)}function i(m,u){u.color.getRGB(m.fogColor.value,v_(t)),u.isFog?(m.fogNear.value=u.near,m.fogFar.value=u.far):u.isFogExp2&&(m.fogDensity.value=u.density)}function r(m,u,g,v,E){u.isMeshBasicMaterial||u.isMeshLambertMaterial?s(m,u):u.isMeshToonMaterial?(s(m,u),h(m,u)):u.isMeshPhongMaterial?(s(m,u),d(m,u)):u.isMeshStandardMaterial?(s(m,u),f(m,u),u.isMeshPhysicalMaterial&&p(m,u,E)):u.isMeshMatcapMaterial?(s(m,u),_(m,u)):u.isMeshDepthMaterial?s(m,u):u.isMeshDistanceMaterial?(s(m,u),y(m,u)):u.isMeshNormalMaterial?s(m,u):u.isLineBasicMaterial?(a(m,u),u.isLineDashedMaterial&&o(m,u)):u.isPointsMaterial?l(m,u,g,v):u.isSpriteMaterial?c(m,u):u.isShadowMaterial?(m.color.value.copy(u.color),m.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function s(m,u){m.opacity.value=u.opacity,u.color&&m.diffuse.value.copy(u.color),u.emissive&&m.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(m.map.value=u.map,n(u.map,m.mapTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,n(u.alphaMap,m.alphaMapTransform)),u.bumpMap&&(m.bumpMap.value=u.bumpMap,n(u.bumpMap,m.bumpMapTransform),m.bumpScale.value=u.bumpScale,u.side===dn&&(m.bumpScale.value*=-1)),u.normalMap&&(m.normalMap.value=u.normalMap,n(u.normalMap,m.normalMapTransform),m.normalScale.value.copy(u.normalScale),u.side===dn&&m.normalScale.value.negate()),u.displacementMap&&(m.displacementMap.value=u.displacementMap,n(u.displacementMap,m.displacementMapTransform),m.displacementScale.value=u.displacementScale,m.displacementBias.value=u.displacementBias),u.emissiveMap&&(m.emissiveMap.value=u.emissiveMap,n(u.emissiveMap,m.emissiveMapTransform)),u.specularMap&&(m.specularMap.value=u.specularMap,n(u.specularMap,m.specularMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest);const g=e.get(u),v=g.envMap,E=g.envMapRotation;v&&(m.envMap.value=v,pr.copy(E),pr.x*=-1,pr.y*=-1,pr.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(pr.y*=-1,pr.z*=-1),m.envMapRotation.value.setFromMatrix4(I1.makeRotationFromEuler(pr)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=u.reflectivity,m.ior.value=u.ior,m.refractionRatio.value=u.refractionRatio),u.lightMap&&(m.lightMap.value=u.lightMap,m.lightMapIntensity.value=u.lightMapIntensity,n(u.lightMap,m.lightMapTransform)),u.aoMap&&(m.aoMap.value=u.aoMap,m.aoMapIntensity.value=u.aoMapIntensity,n(u.aoMap,m.aoMapTransform))}function a(m,u){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,u.map&&(m.map.value=u.map,n(u.map,m.mapTransform))}function o(m,u){m.dashSize.value=u.dashSize,m.totalSize.value=u.dashSize+u.gapSize,m.scale.value=u.scale}function l(m,u,g,v){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,m.size.value=u.size*g,m.scale.value=v*.5,u.map&&(m.map.value=u.map,n(u.map,m.uvTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,n(u.alphaMap,m.alphaMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest)}function c(m,u){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,m.rotation.value=u.rotation,u.map&&(m.map.value=u.map,n(u.map,m.mapTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,n(u.alphaMap,m.alphaMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest)}function d(m,u){m.specular.value.copy(u.specular),m.shininess.value=Math.max(u.shininess,1e-4)}function h(m,u){u.gradientMap&&(m.gradientMap.value=u.gradientMap)}function f(m,u){m.metalness.value=u.metalness,u.metalnessMap&&(m.metalnessMap.value=u.metalnessMap,n(u.metalnessMap,m.metalnessMapTransform)),m.roughness.value=u.roughness,u.roughnessMap&&(m.roughnessMap.value=u.roughnessMap,n(u.roughnessMap,m.roughnessMapTransform)),u.envMap&&(m.envMapIntensity.value=u.envMapIntensity)}function p(m,u,g){m.ior.value=u.ior,u.sheen>0&&(m.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),m.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(m.sheenColorMap.value=u.sheenColorMap,n(u.sheenColorMap,m.sheenColorMapTransform)),u.sheenRoughnessMap&&(m.sheenRoughnessMap.value=u.sheenRoughnessMap,n(u.sheenRoughnessMap,m.sheenRoughnessMapTransform))),u.clearcoat>0&&(m.clearcoat.value=u.clearcoat,m.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(m.clearcoatMap.value=u.clearcoatMap,n(u.clearcoatMap,m.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,n(u.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(m.clearcoatNormalMap.value=u.clearcoatNormalMap,n(u.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===dn&&m.clearcoatNormalScale.value.negate())),u.dispersion>0&&(m.dispersion.value=u.dispersion),u.iridescence>0&&(m.iridescence.value=u.iridescence,m.iridescenceIOR.value=u.iridescenceIOR,m.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(m.iridescenceMap.value=u.iridescenceMap,n(u.iridescenceMap,m.iridescenceMapTransform)),u.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=u.iridescenceThicknessMap,n(u.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),u.transmission>0&&(m.transmission.value=u.transmission,m.transmissionSamplerMap.value=g.texture,m.transmissionSamplerSize.value.set(g.width,g.height),u.transmissionMap&&(m.transmissionMap.value=u.transmissionMap,n(u.transmissionMap,m.transmissionMapTransform)),m.thickness.value=u.thickness,u.thicknessMap&&(m.thicknessMap.value=u.thicknessMap,n(u.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=u.attenuationDistance,m.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(m.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(m.anisotropyMap.value=u.anisotropyMap,n(u.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=u.specularIntensity,m.specularColor.value.copy(u.specularColor),u.specularColorMap&&(m.specularColorMap.value=u.specularColorMap,n(u.specularColorMap,m.specularColorMapTransform)),u.specularIntensityMap&&(m.specularIntensityMap.value=u.specularIntensityMap,n(u.specularIntensityMap,m.specularIntensityMapTransform))}function _(m,u){u.matcap&&(m.matcap.value=u.matcap)}function y(m,u){const g=e.get(u).light;m.referencePosition.value.setFromMatrixPosition(g.matrixWorld),m.nearDistance.value=g.shadow.camera.near,m.farDistance.value=g.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function F1(t,e,n,i){let r={},s={},a=[];const o=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function l(g,v){const E=v.program;i.uniformBlockBinding(g,E)}function c(g,v){let E=r[g.id];E===void 0&&(_(g),E=d(g),r[g.id]=E,g.addEventListener("dispose",m));const b=v.program;i.updateUBOMapping(g,b);const S=e.render.frame;s[g.id]!==S&&(f(g),s[g.id]=S)}function d(g){const v=h();g.__bindingPointIndex=v;const E=t.createBuffer(),b=g.__size,S=g.usage;return t.bindBuffer(t.UNIFORM_BUFFER,E),t.bufferData(t.UNIFORM_BUFFER,b,S),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,v,E),E}function h(){for(let g=0;g<o;g++)if(a.indexOf(g)===-1)return a.push(g),g;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(g){const v=r[g.id],E=g.uniforms,b=g.__cache;t.bindBuffer(t.UNIFORM_BUFFER,v);for(let S=0,C=E.length;S<C;S++){const P=Array.isArray(E[S])?E[S]:[E[S]];for(let X=0,x=P.length;X<x;X++){const A=P[X];if(p(A,S,X,b)===!0){const G=A.__offset,z=Array.isArray(A.value)?A.value:[A.value];let W=0;for(let Z=0;Z<z.length;Z++){const V=z[Z],J=y(V);typeof V=="number"||typeof V=="boolean"?(A.__data[0]=V,t.bufferSubData(t.UNIFORM_BUFFER,G+W,A.__data)):V.isMatrix3?(A.__data[0]=V.elements[0],A.__data[1]=V.elements[1],A.__data[2]=V.elements[2],A.__data[3]=0,A.__data[4]=V.elements[3],A.__data[5]=V.elements[4],A.__data[6]=V.elements[5],A.__data[7]=0,A.__data[8]=V.elements[6],A.__data[9]=V.elements[7],A.__data[10]=V.elements[8],A.__data[11]=0):(V.toArray(A.__data,W),W+=J.storage/Float32Array.BYTES_PER_ELEMENT)}t.bufferSubData(t.UNIFORM_BUFFER,G,A.__data)}}}t.bindBuffer(t.UNIFORM_BUFFER,null)}function p(g,v,E,b){const S=g.value,C=v+"_"+E;if(b[C]===void 0)return typeof S=="number"||typeof S=="boolean"?b[C]=S:b[C]=S.clone(),!0;{const P=b[C];if(typeof S=="number"||typeof S=="boolean"){if(P!==S)return b[C]=S,!0}else if(P.equals(S)===!1)return P.copy(S),!0}return!1}function _(g){const v=g.uniforms;let E=0;const b=16;for(let C=0,P=v.length;C<P;C++){const X=Array.isArray(v[C])?v[C]:[v[C]];for(let x=0,A=X.length;x<A;x++){const G=X[x],z=Array.isArray(G.value)?G.value:[G.value];for(let W=0,Z=z.length;W<Z;W++){const V=z[W],J=y(V),N=E%b,q=N%J.boundary,Q=N+q;E+=q,Q!==0&&b-Q<J.storage&&(E+=b-Q),G.__data=new Float32Array(J.storage/Float32Array.BYTES_PER_ELEMENT),G.__offset=E,E+=J.storage}}}const S=E%b;return S>0&&(E+=b-S),g.__size=E,g.__cache={},this}function y(g){const v={boundary:0,storage:0};return typeof g=="number"||typeof g=="boolean"?(v.boundary=4,v.storage=4):g.isVector2?(v.boundary=8,v.storage=8):g.isVector3||g.isColor?(v.boundary=16,v.storage=12):g.isVector4?(v.boundary=16,v.storage=16):g.isMatrix3?(v.boundary=48,v.storage=48):g.isMatrix4?(v.boundary=64,v.storage=64):g.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",g),v}function m(g){const v=g.target;v.removeEventListener("dispose",m);const E=a.indexOf(v.__bindingPointIndex);a.splice(E,1),t.deleteBuffer(r[v.id]),delete r[v.id],delete s[v.id]}function u(){for(const g in r)t.deleteBuffer(r[g]);a=[],r={},s={}}return{bind:l,update:c,dispose:u}}class k1{constructor(e={}){const{canvas:n=ES(),context:i=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:h=!1}=e;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=a;const p=new Uint32Array(4),_=new Int32Array(4);let y=null,m=null;const u=[],g=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Zn,this.toneMapping=Ji,this.toneMappingExposure=1;const v=this;let E=!1,b=0,S=0,C=null,P=-1,X=null;const x=new At,A=new At;let G=null;const z=new Oe(0);let W=0,Z=n.width,V=n.height,J=1,N=null,q=null;const Q=new At(0,0,Z,V),se=new At(0,0,Z,V);let Te=!1;const He=new y_;let j=!1,ne=!1;const de=new yt,le=new yt,De=new F,Ce=new At,je={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let at=!1;function Xe(){return C===null?J:1}let L=i;function fn(T,I){return n.getContext(T,I)}try{const T={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:h};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${ih}`),n.addEventListener("webglcontextlost",K,!1),n.addEventListener("webglcontextrestored",ce,!1),n.addEventListener("webglcontextcreationerror",he,!1),L===null){const I="webgl2";if(L=fn(I,T),L===null)throw fn(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let Ge,qe,Pe,dt,Ne,R,M,k,Y,ee,$,Me,oe,me,Ke,ie,ge,be,Le,ve,We,Ie,ct,D;function fe(){Ge=new Hw(L),Ge.init(),Ie=new C1(L,Ge),qe=new Uw(L,Ge,e,Ie),Pe=new w1(L),qe.reverseDepthBuffer&&Pe.buffers.depth.setReversed(!0),dt=new jw(L),Ne=new c1,R=new A1(L,Ge,Pe,Ne,qe,Ie,dt),M=new kw(v),k=new Vw(v),Y=new ZS(L),ct=new Dw(L,Y),ee=new Gw(L,Y,dt,ct),$=new $w(L,ee,Y,dt),Le=new Xw(L,qe,R),ie=new Fw(Ne),Me=new l1(v,M,k,Ge,qe,ct,ie),oe=new U1(v,Ne),me=new d1,Ke=new v1(Ge),be=new Nw(v,M,k,Pe,$,f,l),ge=new M1(v,$,qe),D=new F1(L,dt,qe,Pe),ve=new Iw(L,Ge,dt),We=new Ww(L,Ge,dt),dt.programs=Me.programs,v.capabilities=qe,v.extensions=Ge,v.properties=Ne,v.renderLists=me,v.shadowMap=ge,v.state=Pe,v.info=dt}fe();const H=new D1(v,L);this.xr=H,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const T=Ge.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=Ge.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return J},this.setPixelRatio=function(T){T!==void 0&&(J=T,this.setSize(Z,V,!1))},this.getSize=function(T){return T.set(Z,V)},this.setSize=function(T,I,O=!0){if(H.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}Z=T,V=I,n.width=Math.floor(T*J),n.height=Math.floor(I*J),O===!0&&(n.style.width=T+"px",n.style.height=I+"px"),this.setViewport(0,0,T,I)},this.getDrawingBufferSize=function(T){return T.set(Z*J,V*J).floor()},this.setDrawingBufferSize=function(T,I,O){Z=T,V=I,J=O,n.width=Math.floor(T*O),n.height=Math.floor(I*O),this.setViewport(0,0,T,I)},this.getCurrentViewport=function(T){return T.copy(x)},this.getViewport=function(T){return T.copy(Q)},this.setViewport=function(T,I,O,B){T.isVector4?Q.set(T.x,T.y,T.z,T.w):Q.set(T,I,O,B),Pe.viewport(x.copy(Q).multiplyScalar(J).round())},this.getScissor=function(T){return T.copy(se)},this.setScissor=function(T,I,O,B){T.isVector4?se.set(T.x,T.y,T.z,T.w):se.set(T,I,O,B),Pe.scissor(A.copy(se).multiplyScalar(J).round())},this.getScissorTest=function(){return Te},this.setScissorTest=function(T){Pe.setScissorTest(Te=T)},this.setOpaqueSort=function(T){N=T},this.setTransparentSort=function(T){q=T},this.getClearColor=function(T){return T.copy(be.getClearColor())},this.setClearColor=function(){be.setClearColor.apply(be,arguments)},this.getClearAlpha=function(){return be.getClearAlpha()},this.setClearAlpha=function(){be.setClearAlpha.apply(be,arguments)},this.clear=function(T=!0,I=!0,O=!0){let B=0;if(T){let U=!1;if(C!==null){const re=C.texture.format;U=re===ch||re===lh||re===oh}if(U){const re=C.texture.type,ue=re===Ti||re===Ir||re===Ga||re===Bs||re===sh||re===ah,ye=be.getClearColor(),Se=be.getClearAlpha(),Ae=ye.r,Re=ye.g,Ee=ye.b;ue?(p[0]=Ae,p[1]=Re,p[2]=Ee,p[3]=Se,L.clearBufferuiv(L.COLOR,0,p)):(_[0]=Ae,_[1]=Re,_[2]=Ee,_[3]=Se,L.clearBufferiv(L.COLOR,0,_))}else B|=L.COLOR_BUFFER_BIT}I&&(B|=L.DEPTH_BUFFER_BIT,L.clearDepth(this.capabilities.reverseDepthBuffer?0:1)),O&&(B|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(B)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",K,!1),n.removeEventListener("webglcontextrestored",ce,!1),n.removeEventListener("webglcontextcreationerror",he,!1),me.dispose(),Ke.dispose(),Ne.dispose(),M.dispose(),k.dispose(),$.dispose(),ct.dispose(),D.dispose(),Me.dispose(),H.dispose(),H.removeEventListener("sessionstart",gh),H.removeEventListener("sessionend",vh),lr.stop()};function K(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function ce(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;const T=dt.autoReset,I=ge.enabled,O=ge.autoUpdate,B=ge.needsUpdate,U=ge.type;fe(),dt.autoReset=T,ge.enabled=I,ge.autoUpdate=O,ge.needsUpdate=B,ge.type=U}function he(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function $e(T){const I=T.target;I.removeEventListener("dispose",$e),Ct(I)}function Ct(T){nn(T),Ne.remove(T)}function nn(T){const I=Ne.get(T).programs;I!==void 0&&(I.forEach(function(O){Me.releaseProgram(O)}),T.isShaderMaterial&&Me.releaseShaderCache(T))}this.renderBufferDirect=function(T,I,O,B,U,re){I===null&&(I=je);const ue=U.isMesh&&U.matrixWorld.determinant()<0,ye=L_(T,I,O,B,U);Pe.setMaterial(B,ue);let Se=O.index,Ae=1;if(B.wireframe===!0){if(Se=ee.getWireframeAttribute(O),Se===void 0)return;Ae=2}const Re=O.drawRange,Ee=O.attributes.position;let nt=Re.start*Ae,ft=(Re.start+Re.count)*Ae;re!==null&&(nt=Math.max(nt,re.start*Ae),ft=Math.min(ft,(re.start+re.count)*Ae)),Se!==null?(nt=Math.max(nt,0),ft=Math.min(ft,Se.count)):Ee!=null&&(nt=Math.max(nt,0),ft=Math.min(ft,Ee.count));const Mt=ft-nt;if(Mt<0||Mt===1/0)return;ct.setup(U,B,ye,O,Se);let hn,Je=ve;if(Se!==null&&(hn=Y.get(Se),Je=We,Je.setIndex(hn)),U.isMesh)B.wireframe===!0?(Pe.setLineWidth(B.wireframeLinewidth*Xe()),Je.setMode(L.LINES)):Je.setMode(L.TRIANGLES);else if(U.isLine){let we=B.linewidth;we===void 0&&(we=1),Pe.setLineWidth(we*Xe()),U.isLineSegments?Je.setMode(L.LINES):U.isLineLoop?Je.setMode(L.LINE_LOOP):Je.setMode(L.LINE_STRIP)}else U.isPoints?Je.setMode(L.POINTS):U.isSprite&&Je.setMode(L.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)Je.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(Ge.get("WEBGL_multi_draw"))Je.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{const we=U._multiDrawStarts,Ot=U._multiDrawCounts,et=U._multiDrawCount,Un=Se?Y.get(Se).bytesPerElement:1,zr=Ne.get(B).currentProgram.getUniforms();for(let pn=0;pn<et;pn++)zr.setValue(L,"_gl_DrawID",pn),Je.render(we[pn]/Un,Ot[pn])}else if(U.isInstancedMesh)Je.renderInstances(nt,Mt,U.count);else if(O.isInstancedBufferGeometry){const we=O._maxInstanceCount!==void 0?O._maxInstanceCount:1/0,Ot=Math.min(O.instanceCount,we);Je.renderInstances(nt,Mt,Ot)}else Je.render(nt,Mt)};function Qe(T,I,O){T.transparent===!0&&T.side===ei&&T.forceSinglePass===!1?(T.side=dn,T.needsUpdate=!0,to(T,I,O),T.side=ir,T.needsUpdate=!0,to(T,I,O),T.side=ei):to(T,I,O)}this.compile=function(T,I,O=null){O===null&&(O=T),m=Ke.get(O),m.init(I),g.push(m),O.traverseVisible(function(U){U.isLight&&U.layers.test(I.layers)&&(m.pushLight(U),U.castShadow&&m.pushShadow(U))}),T!==O&&T.traverseVisible(function(U){U.isLight&&U.layers.test(I.layers)&&(m.pushLight(U),U.castShadow&&m.pushShadow(U))}),m.setupLights();const B=new Set;return T.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;const re=U.material;if(re)if(Array.isArray(re))for(let ue=0;ue<re.length;ue++){const ye=re[ue];Qe(ye,O,U),B.add(ye)}else Qe(re,O,U),B.add(re)}),g.pop(),m=null,B},this.compileAsync=function(T,I,O=null){const B=this.compile(T,I,O);return new Promise(U=>{function re(){if(B.forEach(function(ue){Ne.get(ue).currentProgram.isReady()&&B.delete(ue)}),B.size===0){U(T);return}setTimeout(re,10)}Ge.get("KHR_parallel_shader_compile")!==null?re():setTimeout(re,10)})};let rn=null;function ai(T){rn&&rn(T)}function gh(){lr.stop()}function vh(){lr.start()}const lr=new S_;lr.setAnimationLoop(ai),typeof self<"u"&&lr.setContext(self),this.setAnimationLoop=function(T){rn=T,H.setAnimationLoop(T),T===null?lr.stop():lr.start()},H.addEventListener("sessionstart",gh),H.addEventListener("sessionend",vh),this.render=function(T,I){if(I!==void 0&&I.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),H.enabled===!0&&H.isPresenting===!0&&(H.cameraAutoUpdate===!0&&H.updateCamera(I),I=H.getCamera()),T.isScene===!0&&T.onBeforeRender(v,T,I,C),m=Ke.get(T,g.length),m.init(I),g.push(m),le.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),He.setFromProjectionMatrix(le),ne=this.localClippingEnabled,j=ie.init(this.clippingPlanes,ne),y=me.get(T,u.length),y.init(),u.push(y),H.enabled===!0&&H.isPresenting===!0){const re=v.xr.getDepthSensingMesh();re!==null&&dc(re,I,-1/0,v.sortObjects)}dc(T,I,0,v.sortObjects),y.finish(),v.sortObjects===!0&&y.sort(N,q),at=H.enabled===!1||H.isPresenting===!1||H.hasDepthSensing()===!1,at&&be.addToRenderList(y,T),this.info.render.frame++,j===!0&&ie.beginShadows();const O=m.state.shadowsArray;ge.render(O,T,I),j===!0&&ie.endShadows(),this.info.autoReset===!0&&this.info.reset();const B=y.opaque,U=y.transmissive;if(m.setupLights(),I.isArrayCamera){const re=I.cameras;if(U.length>0)for(let ue=0,ye=re.length;ue<ye;ue++){const Se=re[ue];xh(B,U,T,Se)}at&&be.render(T);for(let ue=0,ye=re.length;ue<ye;ue++){const Se=re[ue];_h(y,T,Se,Se.viewport)}}else U.length>0&&xh(B,U,T,I),at&&be.render(T),_h(y,T,I);C!==null&&(R.updateMultisampleRenderTarget(C),R.updateRenderTargetMipmap(C)),T.isScene===!0&&T.onAfterRender(v,T,I),ct.resetDefaultState(),P=-1,X=null,g.pop(),g.length>0?(m=g[g.length-1],j===!0&&ie.setGlobalState(v.clippingPlanes,m.state.camera)):m=null,u.pop(),u.length>0?y=u[u.length-1]:y=null};function dc(T,I,O,B){if(T.visible===!1)return;if(T.layers.test(I.layers)){if(T.isGroup)O=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(I);else if(T.isLight)m.pushLight(T),T.castShadow&&m.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||He.intersectsSprite(T)){B&&Ce.setFromMatrixPosition(T.matrixWorld).applyMatrix4(le);const ue=$.update(T),ye=T.material;ye.visible&&y.push(T,ue,ye,O,Ce.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||He.intersectsObject(T))){const ue=$.update(T),ye=T.material;if(B&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Ce.copy(T.boundingSphere.center)):(ue.boundingSphere===null&&ue.computeBoundingSphere(),Ce.copy(ue.boundingSphere.center)),Ce.applyMatrix4(T.matrixWorld).applyMatrix4(le)),Array.isArray(ye)){const Se=ue.groups;for(let Ae=0,Re=Se.length;Ae<Re;Ae++){const Ee=Se[Ae],nt=ye[Ee.materialIndex];nt&&nt.visible&&y.push(T,ue,nt,O,Ce.z,Ee)}}else ye.visible&&y.push(T,ue,ye,O,Ce.z,null)}}const re=T.children;for(let ue=0,ye=re.length;ue<ye;ue++)dc(re[ue],I,O,B)}function _h(T,I,O,B){const U=T.opaque,re=T.transmissive,ue=T.transparent;m.setupLightsView(O),j===!0&&ie.setGlobalState(v.clippingPlanes,O),B&&Pe.viewport(x.copy(B)),U.length>0&&eo(U,I,O),re.length>0&&eo(re,I,O),ue.length>0&&eo(ue,I,O),Pe.buffers.depth.setTest(!0),Pe.buffers.depth.setMask(!0),Pe.buffers.color.setMask(!0),Pe.setPolygonOffset(!1)}function xh(T,I,O,B){if((O.isScene===!0?O.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[B.id]===void 0&&(m.state.transmissionRenderTarget[B.id]=new Ur(1,1,{generateMipmaps:!0,type:Ge.has("EXT_color_buffer_half_float")||Ge.has("EXT_color_buffer_float")?qa:Ti,minFilter:Tr,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:tt.workingColorSpace}));const re=m.state.transmissionRenderTarget[B.id],ue=B.viewport||x;re.setSize(ue.z,ue.w);const ye=v.getRenderTarget();v.setRenderTarget(re),v.getClearColor(z),W=v.getClearAlpha(),W<1&&v.setClearColor(16777215,.5),v.clear(),at&&be.render(O);const Se=v.toneMapping;v.toneMapping=Ji;const Ae=B.viewport;if(B.viewport!==void 0&&(B.viewport=void 0),m.setupLightsView(B),j===!0&&ie.setGlobalState(v.clippingPlanes,B),eo(T,O,B),R.updateMultisampleRenderTarget(re),R.updateRenderTargetMipmap(re),Ge.has("WEBGL_multisampled_render_to_texture")===!1){let Re=!1;for(let Ee=0,nt=I.length;Ee<nt;Ee++){const ft=I[Ee],Mt=ft.object,hn=ft.geometry,Je=ft.material,we=ft.group;if(Je.side===ei&&Mt.layers.test(B.layers)){const Ot=Je.side;Je.side=dn,Je.needsUpdate=!0,yh(Mt,O,B,hn,Je,we),Je.side=Ot,Je.needsUpdate=!0,Re=!0}}Re===!0&&(R.updateMultisampleRenderTarget(re),R.updateRenderTargetMipmap(re))}v.setRenderTarget(ye),v.setClearColor(z,W),Ae!==void 0&&(B.viewport=Ae),v.toneMapping=Se}function eo(T,I,O){const B=I.isScene===!0?I.overrideMaterial:null;for(let U=0,re=T.length;U<re;U++){const ue=T[U],ye=ue.object,Se=ue.geometry,Ae=B===null?ue.material:B,Re=ue.group;ye.layers.test(O.layers)&&yh(ye,I,O,Se,Ae,Re)}}function yh(T,I,O,B,U,re){T.onBeforeRender(v,I,O,B,U,re),T.modelViewMatrix.multiplyMatrices(O.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),U.onBeforeRender(v,I,O,B,T,re),U.transparent===!0&&U.side===ei&&U.forceSinglePass===!1?(U.side=dn,U.needsUpdate=!0,v.renderBufferDirect(O,I,B,U,T,re),U.side=ir,U.needsUpdate=!0,v.renderBufferDirect(O,I,B,U,T,re),U.side=ei):v.renderBufferDirect(O,I,B,U,T,re),T.onAfterRender(v,I,O,B,U,re)}function to(T,I,O){I.isScene!==!0&&(I=je);const B=Ne.get(T),U=m.state.lights,re=m.state.shadowsArray,ue=U.state.version,ye=Me.getParameters(T,U.state,re,I,O),Se=Me.getProgramCacheKey(ye);let Ae=B.programs;B.environment=T.isMeshStandardMaterial?I.environment:null,B.fog=I.fog,B.envMap=(T.isMeshStandardMaterial?k:M).get(T.envMap||B.environment),B.envMapRotation=B.environment!==null&&T.envMap===null?I.environmentRotation:T.envMapRotation,Ae===void 0&&(T.addEventListener("dispose",$e),Ae=new Map,B.programs=Ae);let Re=Ae.get(Se);if(Re!==void 0){if(B.currentProgram===Re&&B.lightsStateVersion===ue)return Mh(T,ye),Re}else ye.uniforms=Me.getUniforms(T),T.onBeforeCompile(ye,v),Re=Me.acquireProgram(ye,Se),Ae.set(Se,Re),B.uniforms=ye.uniforms;const Ee=B.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Ee.clippingPlanes=ie.uniform),Mh(T,ye),B.needsLights=D_(T),B.lightsStateVersion=ue,B.needsLights&&(Ee.ambientLightColor.value=U.state.ambient,Ee.lightProbe.value=U.state.probe,Ee.directionalLights.value=U.state.directional,Ee.directionalLightShadows.value=U.state.directionalShadow,Ee.spotLights.value=U.state.spot,Ee.spotLightShadows.value=U.state.spotShadow,Ee.rectAreaLights.value=U.state.rectArea,Ee.ltc_1.value=U.state.rectAreaLTC1,Ee.ltc_2.value=U.state.rectAreaLTC2,Ee.pointLights.value=U.state.point,Ee.pointLightShadows.value=U.state.pointShadow,Ee.hemisphereLights.value=U.state.hemi,Ee.directionalShadowMap.value=U.state.directionalShadowMap,Ee.directionalShadowMatrix.value=U.state.directionalShadowMatrix,Ee.spotShadowMap.value=U.state.spotShadowMap,Ee.spotLightMatrix.value=U.state.spotLightMatrix,Ee.spotLightMap.value=U.state.spotLightMap,Ee.pointShadowMap.value=U.state.pointShadowMap,Ee.pointShadowMatrix.value=U.state.pointShadowMatrix),B.currentProgram=Re,B.uniformsList=null,Re}function Sh(T){if(T.uniformsList===null){const I=T.currentProgram.getUniforms();T.uniformsList=fl.seqWithValue(I.seq,T.uniforms)}return T.uniformsList}function Mh(T,I){const O=Ne.get(T);O.outputColorSpace=I.outputColorSpace,O.batching=I.batching,O.batchingColor=I.batchingColor,O.instancing=I.instancing,O.instancingColor=I.instancingColor,O.instancingMorph=I.instancingMorph,O.skinning=I.skinning,O.morphTargets=I.morphTargets,O.morphNormals=I.morphNormals,O.morphColors=I.morphColors,O.morphTargetsCount=I.morphTargetsCount,O.numClippingPlanes=I.numClippingPlanes,O.numIntersection=I.numClipIntersection,O.vertexAlphas=I.vertexAlphas,O.vertexTangents=I.vertexTangents,O.toneMapping=I.toneMapping}function L_(T,I,O,B,U){I.isScene!==!0&&(I=je),R.resetTextureUnits();const re=I.fog,ue=B.isMeshStandardMaterial?I.environment:null,ye=C===null?v.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:or,Se=(B.isMeshStandardMaterial?k:M).get(B.envMap||ue),Ae=B.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,Re=!!O.attributes.tangent&&(!!B.normalMap||B.anisotropy>0),Ee=!!O.morphAttributes.position,nt=!!O.morphAttributes.normal,ft=!!O.morphAttributes.color;let Mt=Ji;B.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(Mt=v.toneMapping);const hn=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,Je=hn!==void 0?hn.length:0,we=Ne.get(B),Ot=m.state.lights;if(j===!0&&(ne===!0||T!==X)){const En=T===X&&B.id===P;ie.setState(B,T,En)}let et=!1;B.version===we.__version?(we.needsLights&&we.lightsStateVersion!==Ot.state.version||we.outputColorSpace!==ye||U.isBatchedMesh&&we.batching===!1||!U.isBatchedMesh&&we.batching===!0||U.isBatchedMesh&&we.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&we.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&we.instancing===!1||!U.isInstancedMesh&&we.instancing===!0||U.isSkinnedMesh&&we.skinning===!1||!U.isSkinnedMesh&&we.skinning===!0||U.isInstancedMesh&&we.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&we.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&we.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&we.instancingMorph===!1&&U.morphTexture!==null||we.envMap!==Se||B.fog===!0&&we.fog!==re||we.numClippingPlanes!==void 0&&(we.numClippingPlanes!==ie.numPlanes||we.numIntersection!==ie.numIntersection)||we.vertexAlphas!==Ae||we.vertexTangents!==Re||we.morphTargets!==Ee||we.morphNormals!==nt||we.morphColors!==ft||we.toneMapping!==Mt||we.morphTargetsCount!==Je)&&(et=!0):(et=!0,we.__version=B.version);let Un=we.currentProgram;et===!0&&(Un=to(B,I,U));let zr=!1,pn=!1,fc=!1;const wt=Un.getUniforms(),Ri=we.uniforms;if(Pe.useProgram(Un.program)&&(zr=!0,pn=!0,fc=!0),B.id!==P&&(P=B.id,pn=!0),zr||X!==T){qe.reverseDepthBuffer?(de.copy(T.projectionMatrix),TS(de),AS(de),wt.setValue(L,"projectionMatrix",de)):wt.setValue(L,"projectionMatrix",T.projectionMatrix),wt.setValue(L,"viewMatrix",T.matrixWorldInverse);const En=wt.map.cameraPosition;En!==void 0&&En.setValue(L,De.setFromMatrixPosition(T.matrixWorld)),qe.logarithmicDepthBuffer&&wt.setValue(L,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(B.isMeshPhongMaterial||B.isMeshToonMaterial||B.isMeshLambertMaterial||B.isMeshBasicMaterial||B.isMeshStandardMaterial||B.isShaderMaterial)&&wt.setValue(L,"isOrthographic",T.isOrthographicCamera===!0),X!==T&&(X=T,pn=!0,fc=!0)}if(U.isSkinnedMesh){wt.setOptional(L,U,"bindMatrix"),wt.setOptional(L,U,"bindMatrixInverse");const En=U.skeleton;En&&(En.boneTexture===null&&En.computeBoneTexture(),wt.setValue(L,"boneTexture",En.boneTexture,R))}U.isBatchedMesh&&(wt.setOptional(L,U,"batchingTexture"),wt.setValue(L,"batchingTexture",U._matricesTexture,R),wt.setOptional(L,U,"batchingIdTexture"),wt.setValue(L,"batchingIdTexture",U._indirectTexture,R),wt.setOptional(L,U,"batchingColorTexture"),U._colorsTexture!==null&&wt.setValue(L,"batchingColorTexture",U._colorsTexture,R));const hc=O.morphAttributes;if((hc.position!==void 0||hc.normal!==void 0||hc.color!==void 0)&&Le.update(U,O,Un),(pn||we.receiveShadow!==U.receiveShadow)&&(we.receiveShadow=U.receiveShadow,wt.setValue(L,"receiveShadow",U.receiveShadow)),B.isMeshGouraudMaterial&&B.envMap!==null&&(Ri.envMap.value=Se,Ri.flipEnvMap.value=Se.isCubeTexture&&Se.isRenderTargetTexture===!1?-1:1),B.isMeshStandardMaterial&&B.envMap===null&&I.environment!==null&&(Ri.envMapIntensity.value=I.environmentIntensity),pn&&(wt.setValue(L,"toneMappingExposure",v.toneMappingExposure),we.needsLights&&N_(Ri,fc),re&&B.fog===!0&&oe.refreshFogUniforms(Ri,re),oe.refreshMaterialUniforms(Ri,B,J,V,m.state.transmissionRenderTarget[T.id]),fl.upload(L,Sh(we),Ri,R)),B.isShaderMaterial&&B.uniformsNeedUpdate===!0&&(fl.upload(L,Sh(we),Ri,R),B.uniformsNeedUpdate=!1),B.isSpriteMaterial&&wt.setValue(L,"center",U.center),wt.setValue(L,"modelViewMatrix",U.modelViewMatrix),wt.setValue(L,"normalMatrix",U.normalMatrix),wt.setValue(L,"modelMatrix",U.matrixWorld),B.isShaderMaterial||B.isRawShaderMaterial){const En=B.uniformsGroups;for(let pc=0,I_=En.length;pc<I_;pc++){const Eh=En[pc];D.update(Eh,Un),D.bind(Eh,Un)}}return Un}function N_(T,I){T.ambientLightColor.needsUpdate=I,T.lightProbe.needsUpdate=I,T.directionalLights.needsUpdate=I,T.directionalLightShadows.needsUpdate=I,T.pointLights.needsUpdate=I,T.pointLightShadows.needsUpdate=I,T.spotLights.needsUpdate=I,T.spotLightShadows.needsUpdate=I,T.rectAreaLights.needsUpdate=I,T.hemisphereLights.needsUpdate=I}function D_(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(T,I,O){Ne.get(T.texture).__webglTexture=I,Ne.get(T.depthTexture).__webglTexture=O;const B=Ne.get(T);B.__hasExternalTextures=!0,B.__autoAllocateDepthBuffer=O===void 0,B.__autoAllocateDepthBuffer||Ge.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),B.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(T,I){const O=Ne.get(T);O.__webglFramebuffer=I,O.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(T,I=0,O=0){C=T,b=I,S=O;let B=!0,U=null,re=!1,ue=!1;if(T){const Se=Ne.get(T);if(Se.__useDefaultFramebuffer!==void 0)Pe.bindFramebuffer(L.FRAMEBUFFER,null),B=!1;else if(Se.__webglFramebuffer===void 0)R.setupRenderTarget(T);else if(Se.__hasExternalTextures)R.rebindTextures(T,Ne.get(T.texture).__webglTexture,Ne.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const Ee=T.depthTexture;if(Se.__boundDepthTexture!==Ee){if(Ee!==null&&Ne.has(Ee)&&(T.width!==Ee.image.width||T.height!==Ee.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");R.setupDepthRenderbuffer(T)}}const Ae=T.texture;(Ae.isData3DTexture||Ae.isDataArrayTexture||Ae.isCompressedArrayTexture)&&(ue=!0);const Re=Ne.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Re[I])?U=Re[I][O]:U=Re[I],re=!0):T.samples>0&&R.useMultisampledRTT(T)===!1?U=Ne.get(T).__webglMultisampledFramebuffer:Array.isArray(Re)?U=Re[O]:U=Re,x.copy(T.viewport),A.copy(T.scissor),G=T.scissorTest}else x.copy(Q).multiplyScalar(J).floor(),A.copy(se).multiplyScalar(J).floor(),G=Te;if(Pe.bindFramebuffer(L.FRAMEBUFFER,U)&&B&&Pe.drawBuffers(T,U),Pe.viewport(x),Pe.scissor(A),Pe.setScissorTest(G),re){const Se=Ne.get(T.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+I,Se.__webglTexture,O)}else if(ue){const Se=Ne.get(T.texture),Ae=I||0;L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,Se.__webglTexture,O||0,Ae)}P=-1},this.readRenderTargetPixels=function(T,I,O,B,U,re,ue){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ye=Ne.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&ue!==void 0&&(ye=ye[ue]),ye){Pe.bindFramebuffer(L.FRAMEBUFFER,ye);try{const Se=T.texture,Ae=Se.format,Re=Se.type;if(!qe.textureFormatReadable(Ae)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!qe.textureTypeReadable(Re)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=T.width-B&&O>=0&&O<=T.height-U&&L.readPixels(I,O,B,U,Ie.convert(Ae),Ie.convert(Re),re)}finally{const Se=C!==null?Ne.get(C).__webglFramebuffer:null;Pe.bindFramebuffer(L.FRAMEBUFFER,Se)}}},this.readRenderTargetPixelsAsync=async function(T,I,O,B,U,re,ue){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ye=Ne.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&ue!==void 0&&(ye=ye[ue]),ye){const Se=T.texture,Ae=Se.format,Re=Se.type;if(!qe.textureFormatReadable(Ae))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!qe.textureTypeReadable(Re))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(I>=0&&I<=T.width-B&&O>=0&&O<=T.height-U){Pe.bindFramebuffer(L.FRAMEBUFFER,ye);const Ee=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,Ee),L.bufferData(L.PIXEL_PACK_BUFFER,re.byteLength,L.STREAM_READ),L.readPixels(I,O,B,U,Ie.convert(Ae),Ie.convert(Re),0);const nt=C!==null?Ne.get(C).__webglFramebuffer:null;Pe.bindFramebuffer(L.FRAMEBUFFER,nt);const ft=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await wS(L,ft,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,Ee),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,re),L.deleteBuffer(Ee),L.deleteSync(ft),re}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(T,I=null,O=0){T.isTexture!==!0&&(dl("WebGLRenderer: copyFramebufferToTexture function signature has changed."),I=arguments[0]||null,T=arguments[1]);const B=Math.pow(2,-O),U=Math.floor(T.image.width*B),re=Math.floor(T.image.height*B),ue=I!==null?I.x:0,ye=I!==null?I.y:0;R.setTexture2D(T,0),L.copyTexSubImage2D(L.TEXTURE_2D,O,0,0,ue,ye,U,re),Pe.unbindTexture()},this.copyTextureToTexture=function(T,I,O=null,B=null,U=0){T.isTexture!==!0&&(dl("WebGLRenderer: copyTextureToTexture function signature has changed."),B=arguments[0]||null,T=arguments[1],I=arguments[2],U=arguments[3]||0,O=null);let re,ue,ye,Se,Ae,Re;O!==null?(re=O.max.x-O.min.x,ue=O.max.y-O.min.y,ye=O.min.x,Se=O.min.y):(re=T.image.width,ue=T.image.height,ye=0,Se=0),B!==null?(Ae=B.x,Re=B.y):(Ae=0,Re=0);const Ee=Ie.convert(I.format),nt=Ie.convert(I.type);R.setTexture2D(I,0),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,I.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,I.unpackAlignment);const ft=L.getParameter(L.UNPACK_ROW_LENGTH),Mt=L.getParameter(L.UNPACK_IMAGE_HEIGHT),hn=L.getParameter(L.UNPACK_SKIP_PIXELS),Je=L.getParameter(L.UNPACK_SKIP_ROWS),we=L.getParameter(L.UNPACK_SKIP_IMAGES),Ot=T.isCompressedTexture?T.mipmaps[U]:T.image;L.pixelStorei(L.UNPACK_ROW_LENGTH,Ot.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Ot.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,ye),L.pixelStorei(L.UNPACK_SKIP_ROWS,Se),T.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,U,Ae,Re,re,ue,Ee,nt,Ot.data):T.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,U,Ae,Re,Ot.width,Ot.height,Ee,Ot.data):L.texSubImage2D(L.TEXTURE_2D,U,Ae,Re,re,ue,Ee,nt,Ot),L.pixelStorei(L.UNPACK_ROW_LENGTH,ft),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Mt),L.pixelStorei(L.UNPACK_SKIP_PIXELS,hn),L.pixelStorei(L.UNPACK_SKIP_ROWS,Je),L.pixelStorei(L.UNPACK_SKIP_IMAGES,we),U===0&&I.generateMipmaps&&L.generateMipmap(L.TEXTURE_2D),Pe.unbindTexture()},this.copyTextureToTexture3D=function(T,I,O=null,B=null,U=0){T.isTexture!==!0&&(dl("WebGLRenderer: copyTextureToTexture3D function signature has changed."),O=arguments[0]||null,B=arguments[1]||null,T=arguments[2],I=arguments[3],U=arguments[4]||0);let re,ue,ye,Se,Ae,Re,Ee,nt,ft;const Mt=T.isCompressedTexture?T.mipmaps[U]:T.image;O!==null?(re=O.max.x-O.min.x,ue=O.max.y-O.min.y,ye=O.max.z-O.min.z,Se=O.min.x,Ae=O.min.y,Re=O.min.z):(re=Mt.width,ue=Mt.height,ye=Mt.depth,Se=0,Ae=0,Re=0),B!==null?(Ee=B.x,nt=B.y,ft=B.z):(Ee=0,nt=0,ft=0);const hn=Ie.convert(I.format),Je=Ie.convert(I.type);let we;if(I.isData3DTexture)R.setTexture3D(I,0),we=L.TEXTURE_3D;else if(I.isDataArrayTexture||I.isCompressedArrayTexture)R.setTexture2DArray(I,0),we=L.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,I.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,I.unpackAlignment);const Ot=L.getParameter(L.UNPACK_ROW_LENGTH),et=L.getParameter(L.UNPACK_IMAGE_HEIGHT),Un=L.getParameter(L.UNPACK_SKIP_PIXELS),zr=L.getParameter(L.UNPACK_SKIP_ROWS),pn=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,Mt.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Mt.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Se),L.pixelStorei(L.UNPACK_SKIP_ROWS,Ae),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Re),T.isDataTexture||T.isData3DTexture?L.texSubImage3D(we,U,Ee,nt,ft,re,ue,ye,hn,Je,Mt.data):I.isCompressedArrayTexture?L.compressedTexSubImage3D(we,U,Ee,nt,ft,re,ue,ye,hn,Mt.data):L.texSubImage3D(we,U,Ee,nt,ft,re,ue,ye,hn,Je,Mt),L.pixelStorei(L.UNPACK_ROW_LENGTH,Ot),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,et),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Un),L.pixelStorei(L.UNPACK_SKIP_ROWS,zr),L.pixelStorei(L.UNPACK_SKIP_IMAGES,pn),U===0&&I.generateMipmaps&&L.generateMipmap(we),Pe.unbindTexture()},this.initRenderTarget=function(T){Ne.get(T).__webglFramebuffer===void 0&&R.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?R.setTextureCube(T,0):T.isData3DTexture?R.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?R.setTexture2DArray(T,0):R.setTexture2D(T,0),Pe.unbindTexture()},this.resetState=function(){b=0,S=0,C=null,Pe.reset(),ct.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return xi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorSpace=e===uh?"display-p3":"srgb",n.unpackColorSpace=tt.workingColorSpace===lc?"display-p3":"srgb"}}class O1 extends $t{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ai,this.environmentIntensity=1,this.environmentRotation=new Ai,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}}class B1{constructor(e,n){this.isInterleavedBuffer=!0,this.array=e,this.stride=n,this.count=e!==void 0?e.length/n:0,this.usage=ef,this.updateRanges=[],this.version=0,this.uuid=er()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,n,i){e*=this.stride,i*=n.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=n.array[i+r];return this}set(e,n=0){return this.array.set(e,n),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=er()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const n=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(n,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=er()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const qt=new F;class Hl{constructor(e,n,i,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=n,this.offset=i,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let n=0,i=this.data.count;n<i;n++)qt.fromBufferAttribute(this,n),qt.applyMatrix4(e),this.setXYZ(n,qt.x,qt.y,qt.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)qt.fromBufferAttribute(this,n),qt.applyNormalMatrix(e),this.setXYZ(n,qt.x,qt.y,qt.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)qt.fromBufferAttribute(this,n),qt.transformDirection(e),this.setXYZ(n,qt.x,qt.y,qt.z);return this}getComponent(e,n){let i=this.array[e*this.data.stride+this.offset+n];return this.normalized&&(i=ti(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=ot(i,this.array)),this.data.array[e*this.data.stride+this.offset+n]=i,this}setX(e,n){return this.normalized&&(n=ot(n,this.array)),this.data.array[e*this.data.stride+this.offset]=n,this}setY(e,n){return this.normalized&&(n=ot(n,this.array)),this.data.array[e*this.data.stride+this.offset+1]=n,this}setZ(e,n){return this.normalized&&(n=ot(n,this.array)),this.data.array[e*this.data.stride+this.offset+2]=n,this}setW(e,n){return this.normalized&&(n=ot(n,this.array)),this.data.array[e*this.data.stride+this.offset+3]=n,this}getX(e){let n=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(n=ti(n,this.array)),n}getY(e){let n=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(n=ti(n,this.array)),n}getZ(e){let n=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(n=ti(n,this.array)),n}getW(e){let n=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(n=ti(n,this.array)),n}setXY(e,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(n=ot(n,this.array),i=ot(i,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this}setXYZ(e,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(n=ot(n,this.array),i=ot(i,this.array),r=ot(r,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this.data.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(n=ot(n,this.array),i=ot(i,this.array),r=ot(r,this.array),s=ot(s,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const n=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)n.push(this.data.array[r+s])}return new _t(new this.array.constructor(n),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Hl(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const n=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)n.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:n,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class C_ extends Or{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Oe(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let ns;const oa=new F,is=new F,rs=new F,ss=new Ve,la=new Ve,R_=new yt,Vo=new F,ca=new F,Ho=new F,Rm=new Ve,_u=new Ve,Pm=new Ve;class z1 extends $t{constructor(e=new C_){if(super(),this.isSprite=!0,this.type="Sprite",ns===void 0){ns=new Ft;const n=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new B1(n,5);ns.setIndex([0,1,2,0,2,3]),ns.setAttribute("position",new Hl(i,3,0,!1)),ns.setAttribute("uv",new Hl(i,2,3,!1))}this.geometry=ns,this.material=e,this.center=new Ve(.5,.5)}raycast(e,n){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),is.setFromMatrixScale(this.matrixWorld),R_.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),rs.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&is.multiplyScalar(-rs.z);const i=this.material.rotation;let r,s;i!==0&&(s=Math.cos(i),r=Math.sin(i));const a=this.center;Go(Vo.set(-.5,-.5,0),rs,a,is,r,s),Go(ca.set(.5,-.5,0),rs,a,is,r,s),Go(Ho.set(.5,.5,0),rs,a,is,r,s),Rm.set(0,0),_u.set(1,0),Pm.set(1,1);let o=e.ray.intersectTriangle(Vo,ca,Ho,!1,oa);if(o===null&&(Go(ca.set(-.5,.5,0),rs,a,is,r,s),_u.set(0,1),o=e.ray.intersectTriangle(Vo,Ho,ca,!1,oa),o===null))return;const l=e.ray.origin.distanceTo(oa);l<e.near||l>e.far||n.push({distance:l,point:oa.clone(),uv:Pn.getInterpolation(oa,Vo,ca,Ho,Rm,_u,Pm,new Ve),face:null,object:this})}copy(e,n){return super.copy(e,n),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Go(t,e,n,i,r,s){ss.subVectors(t,n).addScalar(.5).multiply(i),r!==void 0?(la.x=s*ss.x-r*ss.y,la.y=r*ss.x+s*ss.y):la.copy(ss),t.copy(e),t.x+=la.x,t.y+=la.y,t.applyMatrix4(R_)}class rf extends Or{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Oe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Gl=new F,Wl=new F,bm=new yt,ua=new dh,Wo=new Qa,xu=new F,Lm=new F;class P_ extends $t{constructor(e=new Ft,n=new rf){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[0];for(let r=1,s=n.count;r<s;r++)Gl.fromBufferAttribute(n,r-1),Wl.fromBufferAttribute(n,r),i[r]=i[r-1],i[r]+=Gl.distanceTo(Wl);e.setAttribute("lineDistance",new $n(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,n){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Wo.copy(i.boundingSphere),Wo.applyMatrix4(r),Wo.radius+=s,e.ray.intersectsSphere(Wo)===!1)return;bm.copy(r).invert(),ua.copy(e.ray).applyMatrix4(bm);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,d=i.index,f=i.attributes.position;if(d!==null){const p=Math.max(0,a.start),_=Math.min(d.count,a.start+a.count);for(let y=p,m=_-1;y<m;y+=c){const u=d.getX(y),g=d.getX(y+1),v=jo(this,e,ua,l,u,g);v&&n.push(v)}if(this.isLineLoop){const y=d.getX(_-1),m=d.getX(p),u=jo(this,e,ua,l,y,m);u&&n.push(u)}}else{const p=Math.max(0,a.start),_=Math.min(f.count,a.start+a.count);for(let y=p,m=_-1;y<m;y+=c){const u=jo(this,e,ua,l,y,y+1);u&&n.push(u)}if(this.isLineLoop){const y=jo(this,e,ua,l,_-1,p);y&&n.push(y)}}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function jo(t,e,n,i,r,s){const a=t.geometry.attributes.position;if(Gl.fromBufferAttribute(a,r),Wl.fromBufferAttribute(a,s),n.distanceSqToSegment(Gl,Wl,xu,Lm)>i)return;xu.applyMatrix4(t.matrixWorld);const l=e.ray.origin.distanceTo(xu);if(!(l<e.near||l>e.far))return{distance:l,point:Lm.clone().applyMatrix4(t.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:t}}class V1 extends P_{constructor(e,n){super(e,n),this.isLineLoop=!0,this.type="LineLoop"}}class ph extends Or{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Oe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Nm=new yt,sf=new dh,Xo=new Qa,$o=new F;class af extends $t{constructor(e=new Ft,n=new ph){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,n){const i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Xo.copy(i.boundingSphere),Xo.applyMatrix4(r),Xo.radius+=s,e.ray.intersectsSphere(Xo)===!1)return;Nm.copy(r).invert(),sf.copy(e.ray).applyMatrix4(Nm);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,h=i.attributes.position;if(c!==null){const f=Math.max(0,a.start),p=Math.min(c.count,a.start+a.count);for(let _=f,y=p;_<y;_++){const m=c.getX(_);$o.fromBufferAttribute(h,m),Dm($o,m,l,r,e,n,this)}}else{const f=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let _=f,y=p;_<y;_++)$o.fromBufferAttribute(h,_),Dm($o,_,l,r,e,n,this)}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function Dm(t,e,n,i,r,s,a){const o=sf.distanceSqToPoint(t);if(o<n){const l=new F;sf.closestPointToPoint(t,l),l.applyMatrix4(i);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class H1 extends Jt{constructor(e,n,i,r,s,a,o,l,c){super(e,n,i,r,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class mh extends Ft{constructor(e=.5,n=1,i=32,r=1,s=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:n,thetaSegments:i,phiSegments:r,thetaStart:s,thetaLength:a},i=Math.max(3,i),r=Math.max(1,r);const o=[],l=[],c=[],d=[];let h=e;const f=(n-e)/r,p=new F,_=new Ve;for(let y=0;y<=r;y++){for(let m=0;m<=i;m++){const u=s+m/i*a;p.x=h*Math.cos(u),p.y=h*Math.sin(u),l.push(p.x,p.y,p.z),c.push(0,0,1),_.x=(p.x/n+1)/2,_.y=(p.y/n+1)/2,d.push(_.x,_.y)}h+=f}for(let y=0;y<r;y++){const m=y*(i+1);for(let u=0;u<i;u++){const g=u+m,v=g,E=g+i+1,b=g+i+2,S=g+1;o.push(v,E,S),o.push(E,b,S)}}this.setIndex(o),this.setAttribute("position",new $n(l,3)),this.setAttribute("normal",new $n(c,3)),this.setAttribute("uv",new $n(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new mh(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class G1{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Im(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const n=Im();e=(n-this.oldTime)/1e3,this.oldTime=n,this.elapsedTime+=e}return e}}function Im(){return performance.now()}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ih}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ih);const W1=`
  attribute vec3 aTarget;
  attribute float aSeed;
  attribute float aBand;

  uniform float uMorph;
  uniform float uTime;
  uniform float uVoice;
  uniform float uThink;
  uniform float uWork;
  uniform float uAlert;
  uniform float uPulse;
  uniform float uPulseRadius;
  uniform vec3  uPulseOrigin;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uSpread;

  varying float vSeed;
  varying float vIntensity;
  varying float vDepth;

  void main() {
    vSeed = aSeed;

    // Morph between the base shell and the requested shape.
    float t = smoothstep(0.0, 1.0, uMorph);
    vec3 p = mix(position, aTarget, t);

    // Slow breathing; deeper while the model is reasoning.
    float breath = sin(uTime * 0.7 + aSeed * 6.2831) * 0.5 + 0.5;
    p *= 1.0 + (0.012 + 0.028 * uThink) * breath;

    // Speech: a travelling ripple that follows the voice envelope.
    if (uVoice > 0.001) {
      float wave = sin(uTime * 5.0 - p.y * 2.2 + aSeed * 0.4);
      p += normalize(p + 0.0001) * wave * 0.10 * uVoice;
    }

    // Work: a faster, tighter swirl, so "acting" reads differently to "thinking".
    if (uWork > 0.001) {
      float angle = uWork * 0.35 * (1.0 + aBand);
      float s = sin(angle);
      float c = cos(angle);
      p.xz = mat2(c, -s, s, c) * p.xz;
    }

    // Pulse: an expanding ring from a point on the shell (a tool call, a spawn).
    if (uPulse > 0.001) {
      float distanceToOrigin = distance(normalize(p + 0.0001), uPulseOrigin);
      float ring = exp(-pow((distanceToOrigin - uPulseRadius) * 5.0, 2.0));
      p += normalize(p + 0.0001) * ring * 0.55 * uPulse;
    }

    p *= 1.0 + uSpread;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float size = uSize * (0.65 + 0.9 * aSeed) * uPixelRatio;
    size *= 1.0 + 0.5 * uVoice + 0.25 * uPulse + 0.35 * uAlert;
    gl_PointSize = size * (1.0 / -mvPosition.z);

    vIntensity = 0.35 + 0.65 * breath + 0.6 * uPulse + 0.5 * uAlert;
    vDepth = clamp((-mvPosition.z - 1.2) / 3.4, 0.0, 1.0);
  }
`,j1=`
  uniform vec3  uColorCore;
  uniform vec3  uColorEdge;
  uniform vec3  uColorAlert;
  uniform float uVoice;
  uniform float uPulse;
  uniform float uAlert;
  uniform float uOpacity;

  varying float vSeed;
  varying float vIntensity;
  varying float vDepth;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float distance = length(coord);
    if (distance > 0.5) discard;

    float falloff = smoothstep(0.5, 0.02, distance);

    // Colour drifts between the core and edge tones, then to red under alert.
    vec3 colour = mix(uColorCore, uColorEdge, clamp(vDepth + vSeed * 0.25, 0.0, 1.0));
    colour = mix(colour, uColorAlert, clamp(uAlert, 0.0, 1.0));
    colour += vec3(0.35, 0.6, 1.0) * uVoice * 0.4;
    colour += vec3(0.9, 0.75, 0.4) * uPulse * 0.35;

    float alpha = falloff * vIntensity * uOpacity;
    gl_FragColor = vec4(colour, alpha);
  }
`;function Br(t=1337){let e=t;return()=>(e=(e*1664525+1013904223)%4294967296,e/4294967296)}function of(t,e,n=.82){const i=Br(t+Math.floor(e*1e3)),r=new Float32Array(t*3),s=Math.PI*(3-Math.sqrt(5));for(let a=0;a<t;a+=1){const o=a+.5,l=1-o/t*2,c=Math.sqrt(Math.max(0,1-l*l)),d=s*o,h=n+(1-n)*i();r[a*3]=Math.cos(d)*c*e*h,r[a*3+1]=l*e*h,r[a*3+2]=Math.sin(d)*c*e*h}return r}function X1(t,e=1,n=.32){const i=Br(t+7),r=new Float32Array(t*3);for(let s=0;s<t;s+=1){const a=i()*Math.PI*2,o=i()*Math.PI*2,l=n*(.55+.45*i());r[s*3]=(e+l*Math.cos(o))*Math.cos(a),r[s*3+1]=l*Math.sin(o),r[s*3+2]=(e+l*Math.cos(o))*Math.sin(a)}return r}function $1(t,e=.85,n=2.1,i=3){const r=Br(t+11),s=new Float32Array(t*3);for(let a=0;a<t;a+=1){const o=a/t,l=o*Math.PI*6,d=a%i/i*Math.PI*2,h=.94+.06*r();s[a*3]=Math.cos(l+d)*e*h,s[a*3+1]=(o-.5)*n*2,s[a*3+2]=Math.sin(l+d)*e*h}return s}function Y1(t,e=1.1){const n=Br(t+13),i=new Float32Array(t*3),r=e/2;for(let s=0;s<t;s+=1){const a=s%6,o=n()*e-r,l=n()*e-r,c=r*(s%2===0?1:-1);a<2?i.set([c,o,l],s*3):a<4?i.set([o,c,l],s*3):i.set([o,l,c],s*3)}return i}function q1(t,e=1.35,n=7){const i=Br(t+17),r=new Float32Array(t*3),s=Math.max(2,Math.ceil(Math.cbrt(t)));for(let a=0;a<t;a+=1){const o=a%s/(s-1)-.5,l=Math.floor(a/s)%s/(s-1)-.5,c=Math.floor(a/(s*s))/Math.max(1,n-1)-.5,d=.02*(i()-.5);r[a*3]=(o+d)*e*2,r[a*3+1]=(l+d)*e*2,r[a*3+2]=(c+d)*e*2}return r}function K1(t,e=4){const n=Br(t+19),i=new Float32Array(t*3);for(let r=0;r<t;r+=1){const s=r%e,a=Math.pow(n(),.65),o=a*Math.PI*5+s/e*Math.PI*2,l=.25+a*1.15,c=.1*(.4+n());i[r*3]=Math.cos(o)*l+(n()-.5)*c,i[r*3+1]=(n()-.5)*.35*(1-a*.6),i[r*3+2]=Math.sin(o)*l+(n()-.5)*c}return i}function Z1(t,e){switch(t){case"torus":return X1(e);case"helix":return $1(e);case"cube":return Y1(e);case"grid":return q1(e);case"vortex":return K1(e);default:return of(e,1)}}class Q1{constructor(e,n,i=!1){ze(this,"group");ze(this,"geometry");ze(this,"material");ze(this,"haloGeometry");ze(this,"haloMaterial");ze(this,"ringGeometry");ze(this,"ringMaterial");ze(this,"halo");ze(this,"count");ze(this,"reducedMotion");ze(this,"phase","idle");ze(this,"morphValue",0);ze(this,"pulseStrength",0);ze(this,"pulseRadius",0);ze(this,"targetAlert",0);ze(this,"targetVoice",0);ze(this,"thinkValue",0);ze(this,"workValue",0);ze(this,"attention",0);this.reducedMotion=i,this.count=Math.max(2e3,Math.floor(n)),this.group=new Ar,this.group.rotation.x=.18,e.add(this.group);const r=new Ft,s=of(this.count,1);r.setAttribute("position",new _t(s,3)),r.setAttribute("aTarget",new _t(s.slice(),3));const a=new Float32Array(this.count),o=new Float32Array(this.count),l=Br(this.count);for(let p=0;p<this.count;p+=1)a[p]=l(),o[p]=l()*2-1;r.setAttribute("aSeed",new _t(a,1)),r.setAttribute("aBand",new _t(o,1)),this.geometry=r;const c={uMorph:{value:0},uTime:{value:0},uVoice:{value:0},uThink:{value:.25},uWork:{value:0},uAlert:{value:0},uPulse:{value:0},uPulseRadius:{value:0},uPulseOrigin:{value:new F(0,1,0)},uSize:{value:2.15},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uSpread:{value:0},uColorCore:{value:new Oe("#5B7CFF")},uColorEdge:{value:new Oe("#31E6FF")},uColorAlert:{value:new Oe("#FF5470")},uOpacity:{value:.86}};this.material=new si({uniforms:c,vertexShader:W1,fragmentShader:j1,transparent:!0,depthWrite:!1,blending:ni});const d=new af(r,this.material);d.frustumCulled=!1,this.group.add(d);const h=Math.max(400,Math.floor(this.count*.12));this.haloGeometry=new Ft,this.haloGeometry.setAttribute("position",new _t(of(h,1.34,.9),3)),this.haloMaterial=new ph({color:2780840,size:.014,sizeAttenuation:!0,transparent:!0,opacity:.5,blending:ni,depthWrite:!1}),this.halo=new af(this.haloGeometry,this.haloMaterial),this.halo.frustumCulled=!1,this.group.add(this.halo),this.ringGeometry=new mh(1.26,1.32,128),this.ringMaterial=new fh({color:2051962,transparent:!0,opacity:.35,side:ei,blending:ni,depthWrite:!1});const f=new Wn(this.ringGeometry,this.ringMaterial);f.rotation.x=-Math.PI/2,f.position.y=-1.3,this.group.add(f)}update(e,n){const i=this.material.uniforms;i.uTime.value=n;const r=this.reducedMotion?1:1-Math.pow(.001,e);if(i.uVoice.value+=(this.targetVoice-i.uVoice.value)*r,i.uThink.value+=(this.thinkValue-i.uThink.value)*r,i.uWork.value+=(this.workValue-i.uWork.value)*r,i.uAlert.value+=(this.targetAlert-i.uAlert.value)*r,this.morphValue>0&&this.morphValue<1&&(this.morphValue=Math.min(1,this.morphValue+e*.9),i.uMorph.value=this.morphValue,this.morphValue>=1)){const o=this.geometry.getAttribute("aTarget"),l=this.geometry.getAttribute("position");l.array.set(o.array),l.needsUpdate=!0,this.morphValue=0,i.uMorph.value=0}this.pulseStrength>.001?(this.pulseStrength*=Math.pow(.12,e),this.pulseRadius+=e*2.6,i.uPulse.value=this.pulseStrength,i.uPulseRadius.value=this.pulseRadius):(this.pulseStrength=0,i.uPulse.value=0);const s=this.phase==="thinking"?.24:this.phase==="working"?.17:.075,a=this.reducedMotion?.25:1;this.group.rotation.y+=e*s*a,this.group.rotation.z=Math.sin(n*.11)*.05,this.group.rotation.x=.18+Math.sin(n*.07)*.04,this.halo.rotation.y-=e*s*.55*a,this.halo.rotation.x+=e*.03*a,i.uSpread.value=Math.min(.12,this.attention*.012),i.uPixelRatio.value=Math.min(window.devicePixelRatio,2),this.ringMaterial.opacity=.22+.28*(i.uVoice.value+i.uWork.value*.5),this.haloMaterial.opacity=.35+.3*i.uThink.value}setPhase(e){this.phase=e,this.thinkValue=e==="thinking"?1:e==="idle"||e==="speaking"?.25:.45,this.workValue=e==="working"?1:0,this.targetAlert=e==="alert"?1:0}setShape(e){const n=this.geometry.getAttribute("aTarget");n.array.set(Z1(e,this.count)),n.needsUpdate=!0,this.morphValue=1e-4,this.material.uniforms.uMorph.value=1e-4}pulse(e,n=1){this.pulseStrength=Math.min(1.6,this.pulseStrength+n*.7),this.pulseRadius=0,this.material.uniforms.uPulseOrigin.value.set(Math.random()*2-1,Math.random()*2-1,Math.random()*2-1).normalize()}setTalking(e){this.targetVoice=Math.max(0,Math.min(1,e))}setAttention(e){this.attention=e}dispose(){this.geometry.dispose(),this.material.dispose(),this.haloGeometry.dispose(),this.haloMaterial.dispose(),this.ringGeometry.dispose(),this.ringMaterial.dispose()}}const Um=1.66,yu=2.46,as=10,J1=2.4,eA=`
  attribute float aT;
  attribute float aAlpha;
  attribute float aSpeed;
  attribute vec3  aColor;

  uniform float uTime;

  varying float vAlpha;
  varying vec3  vColor;

  void main() {
    // A moving dash pattern, plus a brighter head travelling the whole wire.
    float dash = fract(aT * 9.0 - uTime * aSpeed);
    float dashes = smoothstep(0.62, 0.38, dash);
    float head = exp(-pow(fract(aT - uTime * aSpeed * 0.18) * 6.0 - 3.0, 2.0));

    vAlpha = aAlpha * (0.35 + 0.65 * dashes) + aAlpha * head * 0.9;
    vColor = aColor;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 1.0;
  }
`,tA=`
  varying float vAlpha;
  varying vec3  vColor;

  void main() {
    gl_FragColor = vec4(vColor, vAlpha);
  }
`;function Fm(t,e,n=.42){const i=document.createElement("canvas"),r=12,s=42,a=i.getContext("2d");if(a){a.font=`600 ${s}px ui-monospace, SFMono-Regular, Menlo, monospace`;const h=Math.ceil(a.measureText(t).width)+r*2;i.width=Math.max(64,h),i.height=s+r*2;const f=i.getContext("2d");f&&(f.font=`600 ${s}px ui-monospace, SFMono-Regular, Menlo, monospace`,f.fillStyle=e,f.textBaseline="middle",f.fillText(t,r,i.height/2))}const o=new H1(i);o.minFilter=Rn;const l=new C_({map:o,transparent:!0,depthWrite:!1,depthTest:!1,blending:ni,opacity:.9}),c=new z1(l),d=i.width/Math.max(1,i.height);return c.scale.set(n*d*2.2,n*1.2,1),c}class nA{constructor(e){ze(this,"group");ze(this,"lineGeometry",new Ft);ze(this,"lineMaterial");ze(this,"lines");ze(this,"packetGeometry",new Ft);ze(this,"packetMaterial");ze(this,"packets");ze(this,"packetState",[]);ze(this,"links",[]);ze(this,"agentNodes",[]);ze(this,"categoryNodes",[]);ze(this,"sprites",[]);ze(this,"filaments",[]);ze(this,"ringGroup",new Ar);ze(this,"maxPackets",140);ze(this,"dirty",!0);this.group=new Ar,e.add(this.group),this.group.add(this.ringGroup),this.lineMaterial=new si({uniforms:{uTime:{value:0}},vertexShader:eA,fragmentShader:tA,transparent:!0,depthWrite:!1,blending:ni}),this.lines=new Wn(this.lineGeometry,this.lineMaterial),this.lines.frustumCulled=!1,this.group.add(this.lines),this.packetGeometry.setAttribute("position",new _t(new Float32Array(this.maxPackets*3),3)),this.packetMaterial=new ph({color:14677759,size:.05,sizeAttenuation:!0,transparent:!0,opacity:.95,blending:ni,depthWrite:!1}),this.packets=new af(this.packetGeometry,this.packetMaterial),this.packets.frustumCulled=!1,this.group.add(this.packets),this.buildRings()}buildRings(){const e=(n,i,r)=>{const s=[];for(let c=0;c<180;c+=1){const d=c/180*Math.PI*2;s.push(new F(Math.cos(d)*n,0,Math.sin(d)*n))}const o=new Ft().setFromPoints(s),l=new rf({color:i,transparent:!0,opacity:r,blending:ni,depthWrite:!1});return new V1(o,l)};this.ringGroup.add(e(Um,1919595,.5)),this.ringGroup.add(e(yu,1325653,.35)),this.ringGroup.rotation.x=-Math.PI/2}layoutAgents(e){this.agentNodes=e.map((n,i)=>{const r=Math.max(1,e.length),s=i/r*Math.PI*2+Math.PI/2,a=Um+(i%2===0?0:.1);return{id:n.id,key:`${n.name}|${n.id}|${n.role}`,position:new F(Math.cos(s)*a,.16,Math.sin(s)*a),activity:1}})}layoutCategories(e){this.categoryNodes=e.map((n,i)=>{const r=Math.max(1,e.length),s=i/r*Math.PI*2-Math.PI/2;return{key:n,position:new F(Math.cos(s)*yu,-.34,Math.sin(s)*yu),activity:.35}})}rebuild(){this.links=[];const e=new F(0,0,0),n=["#31E6FF","#5B7CFF","#7C5CFF","#2ED573","#F5A524","#FF6B9D","#00C2FF"];this.agentNodes.forEach((i,r)=>{this.links.push(this.makeLink(`${i.key}`,i.key,new Oe(n[r%n.length]),e,i.position,.5))}),this.categoryNodes.forEach((i,r)=>{this.links.push(this.makeLink(i.key,i.key,new Oe(n[(r+3)%n.length]).multiplyScalar(.9),e,i.position,.34))});for(let i=0;i+1<this.agentNodes.length;i+=2){const r=this.agentNodes[i],s=this.agentNodes[i+1];this.links.push(this.makeLink(`${r.key}->${s.key}`,`${r.key}|${s.key}`,new Oe("#3d7ea6"),r.position,s.position,.22))}this.writeLineGeometry(),this.rebuildLabels(),this.dirty=!1}makeLink(e,n,i,r,s,a){const o=r.clone().add(s).multiplyScalar(.5),l=o.clone().normalize().multiplyScalar(.55),c=o.clone().add(l).setY(o.y+.55);return{key:e,owner:n,color:i,start:r,end:s,control:c,tStart:0,tEnd:1,speed:.6+Math.random()*.5,base:a,activity:e.startsWith("quota")?.4:0}}writeLineGeometry(){const e=as*2,n=this.links.length*e,i=new Float32Array(n*3),r=new Float32Array(n*3),s=new Float32Array(n),a=new Float32Array(n),o=new Float32Array(n);let l=0;const c=new F;this.links.forEach(d=>{const h=[];for(let f=0;f<=as;f+=1){const p=f/as;c.copy(this.quadraticAt(d,p)),h.push(c.clone())}d.tStart=l/n;for(let f=0;f<as;f+=1){const p=h[f],_=h[f+1];for(const y of[p,_])i[l*3]=y.x,i[l*3+1]=y.y,i[l*3+2]=y.z,r[l*3]=d.color.r,r[l*3+1]=d.color.g,r[l*3+2]=d.color.b,s[l]=d.base,a[l]=d.speed,o[l]=(f+(y===_?1:0))/as,l+=1}d.tEnd=l/n}),this.lineGeometry.dispose(),this.lineGeometry=new Ft,this.lineGeometry.setAttribute("position",new _t(i,3)),this.lineGeometry.setAttribute("aColor",new _t(r,3)),this.lineGeometry.setAttribute("aAlpha",new _t(s,1)),this.lineGeometry.setAttribute("aSpeed",new _t(a,1)),this.lineGeometry.setAttribute("aT",new _t(o,1)),this.lines.geometry=this.lineGeometry}quadraticAt(e,n){const i=1-n;return new F().addScaledVector(e.start,i*i).addScaledVector(e.control,2*i*n).addScaledVector(e.end,n*n)}rebuildLabels(){for(const e of this.sprites){this.group.remove(e);const n=e.material;n.map?.dispose(),n.dispose()}this.sprites=[],this.agentNodes.forEach(e=>{const[,,n]=e.key.split("|"),i=Fm(e.key.split("|")[0],n==="main"?"#B9A6FF":"#8fd8ff");i.position.copy(e.position).multiplyScalar(1.24).setY(e.position.y+.3),this.sprites.push(i),this.group.add(i)}),this.categoryNodes.forEach(e=>{const n=Fm(e.key,"#5f9fc4",.3);n.position.copy(e.position).multiplyScalar(1.16).setY(e.position.y-.34),this.sprites.push(n),this.group.add(n)})}setAgents(e){const n=e.map(s=>`${s.id}:${s.name}`).join(","),i=this.agentNodes.map(s=>s.key.split("|").slice(1).join(":")).join(",");if(n===i&&this.agentNodes.length===e.length)return;const r=new Map(this.agentNodes.map(s=>[s.id,s.activity]));this.layoutAgents(e),this.agentNodes.forEach(s=>{s.activity=Math.max(s.activity,r.get(s.id)??.6)}),this.dirty=!0}setCategories(e){e.join(",")!==this.categoryNodes.map(n=>n.key).join(",")&&(this.layoutCategories(e),this.dirty=!0)}touch(e){const n=e.toLowerCase();for(const i of this.links)(i.owner.toLowerCase().includes(n)||i.key.toLowerCase().includes(n))&&(i.activity=1);for(const i of this.agentNodes)i.key.toLowerCase().includes(n)&&(i.activity=1);for(const i of this.categoryNodes)i.key.toLowerCase().includes(n)&&(i.activity=1)}send(e,n=1){const i=e.toLowerCase();this.links.forEach((r,s)=>{if(!(!r.owner.toLowerCase().includes(i)&&!r.key.toLowerCase().includes(i))){r.activity=1;for(let a=0;a<n;a+=1)this.packetState.length<this.maxPackets&&this.packetState.push({link:s,progress:-a*.12,speed:.85+Math.random()*.5})}})}memoryFilament(){if(this.filaments.length>12)return;const e=60,n=new Float32Array(e*3),i=new F((Math.random()-.5)*3,(Math.random()-.5)*1.6,(Math.random()-.5)*3),r=i.clone().multiplyScalar(-1);for(let l=0;l<e;l+=1){const c=l/(e-1),d=i.clone().lerp(r,c),h=Math.sin(c*Math.PI)*.35;d.y+=h,n[l*3]=d.x,n[l*3+1]=d.y,n[l*3+2]=d.z}const s=new Ft;s.setAttribute("position",new _t(n,3));const a=new rf({color:10475775,transparent:!0,opacity:.7,blending:ni,depthWrite:!1}),o=new P_(s,a);this.group.add(o),this.filaments.push({geometry:s,material:a,born:performance.now()/1e3})}setVisible(e){this.group.visible=e}update(e,n){this.dirty&&this.rebuild(),this.lineMaterial.uniforms.uTime.value=n;const i=this.lineGeometry.getAttribute("aAlpha"),r=i.array,s=Math.pow(.5,e/J1);this.links.forEach((h,f)=>{h.activity*=s,h.activity<.001&&(h.activity=0);const p=as*2,_=f*p,y=h.base+h.activity*.95;for(let m=0;m<p;m+=1){const u=r[_+m];r[_+m]=u+(y-u)*Math.min(1,e*6)}}),i.needsUpdate=!0,this.agentNodes.forEach((h,f)=>{h.activity*=s;const p=this.sprites[f];p&&(p.material.opacity=.45+.55*Math.min(1,h.activity))});const a=this.agentNodes.length;this.categoryNodes.forEach((h,f)=>{h.activity=Math.max(.18,h.activity*s);const p=this.sprites[a+f];p&&(p.material.opacity=.3+.7*Math.min(1,h.activity))});const o=this.packetGeometry.getAttribute("position"),l=o.array,c=[];for(const h of this.packetState){if(h.progress+=e*h.speed,h.progress>1.05)continue;const f=this.links[h.link];if(!f)continue;const p=Math.max(0,h.progress),_=this.quadraticAt(f,p),y=c.length;l[y*3]=_.x,l[y*3+1]=_.y,l[y*3+2]=_.z,c.push(h)}for(let h=c.length;h<this.maxPackets;h+=1)l[h*3]=0,l[h*3+1]=-9999,l[h*3+2]=0;this.packetState=c,o.needsUpdate=!0;const d=n;this.filaments=this.filaments.filter(h=>{const f=d-h.born;if(f>1.4){const p=this.group.children.filter(_=>_.geometry===h.geometry);return this.group.remove(...p),h.geometry.dispose(),h.material.dispose(),!1}return h.material.opacity=.7*(1-f/1.4),!0}),this.group.rotation.y+=e*.035}dispose(){this.lineGeometry.dispose(),this.lineMaterial.dispose(),this.packetGeometry.dispose(),this.packetMaterial.dispose(),this.rebuildLabels();for(const e of this.filaments)e.geometry.dispose(),e.material.dispose();this.ringGroup.children.forEach(e=>{const n=e;n.geometry?.dispose(),n.material?.dispose()})}}const iA={offline:"sphere",idle:"sphere",listening:"torus",thinking:"vortex",working:"grid",speaking:"sphere",alert:"cube"},rA={tool:"",spawn:"agents",team:"agents",plan:"agents",memory:"",plugin:"plugins",failover:"quota",alert:"hardware"};function sA(){const t=xe.useRef(null),e=xe.useRef(null),n=xe.useRef(null),i=xe.useRef(null),r=ke(u=>u.settings?.gui_particle_count??18e3),s=ke(u=>u.settings?.gui_reduced_motion??!1),a=ke(u=>u.settings?.gui_show_wiring??!0),o=ke(u=>u.phase),l=ke(u=>u.agents),c=ke(u=>Object.keys(u.status?.tools.categories??{}).sort()),d=ke(u=>u.pulses),h=ke(u=>u.memoryPulse),f=ke(u=>u.toolCalls),p=ke(u=>u.routeSwap);xe.useEffect(()=>{const u=t.current;if(!u)return;const g=new k1({canvas:u,antialias:!1,alpha:!0,powerPreference:"high-performance"});g.setPixelRatio(Math.min(window.devicePixelRatio,2)),g.setClearColor(0,0),i.current=g;const v=new O1,E=new Cn(44,1,.1,100);E.position.set(0,.5,4.95);const b=new Q1(v,r,s),S=new nA(v);e.current=b,n.current=S;const C=()=>{const z=u.parentElement;if(!z)return;const W=z.clientWidth,Z=z.clientHeight;!W||!Z||(g.setSize(W,Z,!1),E.aspect=W/Z,E.updateProjectionMatrix())},P=new ResizeObserver(C);u.parentElement&&P.observe(u.parentElement),C();let X=0;const x=new G1;let A=0;const G=()=>{X=requestAnimationFrame(G);const z=Math.min(x.getDelta(),.05),W=x.elapsedTime,V=document.body.dataset.speaking==="1"?.45+.4*Math.abs(Math.sin(W*6.2))*(.6+.4*Math.abs(Math.sin(W*2.1))):0;A+=(V-A)*Math.min(1,z*9),b.setTalking(A),b.update(z,W),S.update(z,W),E.position.x=Math.sin(W*.13)*.2,E.position.y=.5+Math.sin(W*.17)*.12,E.lookAt(0,0,0),g.render(v,E)};return X=requestAnimationFrame(G),()=>{cancelAnimationFrame(X),P.disconnect(),b.dispose(),S.dispose(),g.dispose(),e.current=null,n.current=null,i.current=null}},[]),xe.useEffect(()=>{e.current?.setPhase(o);const u=iA[o]??"sphere";e.current?.setShape(u)},[o]),xe.useEffect(()=>{e.current?.setAttention(l.length),n.current?.setAgents(l);for(const u of l)n.current?.touch(u.name),n.current?.send(u.role==="main"?"main":u.name,1)},[l]),xe.useEffect(()=>{n.current?.setCategories(c)},[c]),xe.useEffect(()=>{n.current?.setVisible(a)},[a]);const _=xe.useRef(0);xe.useEffect(()=>{const u=d.slice(_.current);_.current=d.length;for(const g of u){e.current?.pulse(g.kind,g.strength);const v=g.kind==="tool"?g.label.split(".")[0]:rA[g.kind];v&&n.current?.send(v,g.kind==="alert"?3:1),n.current?.touch(v||g.label)}},[d]);const y=xe.useRef(0);xe.useEffect(()=>{h>y.current&&y.current!==0&&n.current?.memoryFilament(),y.current=h},[h]);const m=xe.useRef(0);return xe.useEffect(()=>{const u=f.slice(m.current);m.current=f.length;for(const g of u)n.current?.send(g.tool.split(".")[0],1)},[f]),xe.useEffect(()=>{p&&n.current?.send("quota",4)},[p]),w.jsx("canvas",{ref:t,className:"stage-canvas","aria-hidden":"true"})}function aA(){const[t,e]=xe.useState(!1),[n,i]=xe.useState(""),[r,s]=xe.useState(!1),a=ke(m=>m.connected),o=ke(m=>m.phase),l=ke(m=>m.settings),c=ke(m=>m.confirmations[0]??null),d=ke(m=>m.speakingText),h=xe.useRef(""),f=l?.voice_enabled??!0;xe.useEffect(()=>{py()||i("No session token. Launch Vyralis with `vyralis run` so the interface is opened with its token.");const m=gy();return(async()=>{try{const g=await rt.status();_e.setStatus(g),_e.setProviders(g.providers??[]);const v=await rt.settings();_e.setSettings(v),s(!0)}catch(g){i(String(g))}})(),()=>m.close()},[]),xe.useEffect(()=>{if(!r)return;const m=window.setInterval(()=>{rt.hardware().then(u=>_e.setHardware(u)).catch(()=>{}),rt.tasks().then(u=>_e.setTasks(u.tasks)).catch(()=>{}),rt.providers().then(u=>_e.setProviders(u.providers)).catch(()=>{})},6e3);return rt.hardware().then(u=>_e.setHardware(u)).catch(()=>{}),()=>window.clearInterval(m)},[r]);const p=xe.useCallback((m,u="voice")=>{rt.sendMessage(m,u).catch(g=>_e.setError(String(g)))},[]),_=Dy({enabled:f,onTranscript:m=>p(m,"voice"),onListeningChange:m=>_e.setPhase(m?"listening":"idle")});xe.useEffect(()=>{!d||!f||h.current!==d&&(h.current=d,_.speak(d,{onEnd:()=>_e.setPhase("idle")}))},[d,f,_]),xe.useEffect(()=>{const m=u=>{u.key==="Escape"&&(t?e(!1):_.speaking&&_.stopSpeaking()),u.key==="Tab"&&u.ctrlKey&&(u.preventDefault(),e(g=>!g))};return window.addEventListener("keydown",m),()=>window.removeEventListener("keydown",m)},[t,_]);const y=xe.useMemo(()=>a?r?"":"loading system state…":"connecting to the runtime…",[a,r]);return n?w.jsxs("div",{className:"boot",children:[w.jsx("h1",{children:"VYRALIS"}),w.jsx("p",{className:"boot-error",children:n}),w.jsxs("p",{className:"hint",children:["Start the backend with ",w.jsx("code",{children:"vyralis run"}),", then open the URL it prints (it includes the session token)."]})]}):w.jsxs("div",{className:"app","data-phase":o,children:[w.jsx(sA,{}),w.jsxs("div",{className:"hud",children:[w.jsx(Sy,{onTogglePanels:()=>e(m=>!m),voiceEnabled:f,onToggleVoice:()=>void rt.updateSettings({voice_enabled:!f})}),y&&w.jsx("div",{className:"boot-progress",children:y}),w.jsxs("main",{className:"hud-body",children:[w.jsx(My,{}),w.jsx("section",{className:"center-column",children:w.jsxs("div",{className:"core-caption",children:[w.jsx("span",{className:"core-caption-name",children:"VYRALIS"}),w.jsx("span",{className:"core-caption-sub",children:o==="idle"?"awaiting instruction":o})]})}),w.jsx(Ey,{})]}),w.jsxs("footer",{className:"hud-foot",children:[w.jsx(Ty,{voice:_}),w.jsx(Ay,{onSend:m=>p(m,f?"voice":"chat"),onMicDown:()=>_.startListening(),onMicUp:()=>_.stopListening(),listening:_.listening,sttSupported:_.sttSupported})]})]}),w.jsx(by,{open:t,onClose:()=>e(!1)}),c&&w.jsx(Cy,{confirmation:c,onDecide:m=>{_e.setConfirmations(_e.get().confirmations.filter(u=>u.id!==c.id)),rt.resolveConfirmation(c.id,m)}}),w.jsx(Ry,{})]})}const b_=document.getElementById("root");if(!b_)throw new Error("Missing #root element");Su.createRoot(b_).render(w.jsx(J_.StrictMode,{children:w.jsx(aA,{})}));
