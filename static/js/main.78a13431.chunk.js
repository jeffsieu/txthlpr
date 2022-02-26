(this.webpackJsonptxthlpr=this.webpackJsonptxthlpr||[]).push([[0],{116:function(e,t,n){},117:function(e,t,n){},129:function(e,t,n){"use strict";n.r(t);var r=n(0),i=n.n(r),a=n(36),c=n.n(a),o=(n(116),n(12)),s=n(15),u=n(34);n(117);function l(e){return e.length>10?e.substring(0,10)+"...":e}var p={name:"Stringify",description:"Converts the given input into a string.",transform:function(e){return Array.isArray(e)?"[\n  "+e.join(",\n  ")+",\n]":"object"===typeof e&&void 0!==e?JSON.stringify(e):e.toString()},inputType:"any",outputType:"string",getHistoryDescription:function(){return"Converted to string"}},d=function(e,t,n,r,i){if(-1===n)return e;var a=e.substring(0,n),c=e.substring(n+r,e.length);switch(i){case"Nothing else":return a+t+c;case"Everything before":return t+c;case"Everything after":return a+t}console.log("gay!")},h=[].concat([{name:"Trim",description:"Remove whitespace from both ends of the input.",transform:function(e){return e.trim()},inputType:"string",outputType:"string",getHistoryDescription:function(){return"Trimmed whitespace"}},p,{name:"Replace",description:"Replaces the input into a string.",transform:function(e){var t=this.params,n=t.findRegex,r=t.replaceRegex,i=t.replaceMode,a=t.includeMode;switch(i.value){case"All occurrences":var c=e,o=void 0,s=0;do{console.log("yo!!!"),console.log(c),console.log(o),console.log(s),void 0!==o&&(c=o);var u=c.indexOf(n.value,s);if(-1===u)return c;s=u+r.value.length,o=d(c,r.value,u,n.value.length,a.value)}while(o!==c);return o;case"First occurrence":case"Last occurrence":var l="First occurrence"===i.value?e.indexOf(n.value):e.lastIndexOf(n.value);return d(e,r.value,l,n.value.length,a.value)}},inputType:"string",outputType:"string",params:{findRegex:{name:"Find expression",value:"",required:!0,valueType:"string",choiceType:"freeResponse"},replaceMode:{name:"Replace mode",value:"All occurrences",required:!0,valueType:"string",choiceType:"multipleChoice",choices:["First occurrence","Last occurrence","All occurrences"]},includeMode:{name:"Include",value:"Nothing else",required:!0,valueType:"string",choiceType:"multipleChoice",choices:["Nothing else","Everything after","Everything before"]},replaceRegex:{name:"Replace expression",value:"",required:!0,valueType:"string",choiceType:"freeResponse"}},getHistoryDescription:function(){return"Replace ".concat(l(this.params.findRegex.value)," with ").concat(l(this.params.findRegex.value))}}],[{name:"Parse JSON",description:"Parse the given string into a JSON.",transform:function(e){return JSON.parse(e)},getHistoryDescription:function(){return"Parsed string to JSON"},inputType:"string",outputType:"json"}],[{name:"Split",description:"Converts the input string into a list, given a delimiter.",transform:function(e){var t=this.params.delimiter.value.replaceAll("\\n","\n");return e.split(t)},params:{delimiter:{name:"Delimiter",value:",",valueType:"string",required:!0,choiceType:"freeResponse"}},inputType:"string",outputType:"list",getHistoryDescription:function(){return'Split text to list using "'.concat(this.params.delimiter.value,'"')}},{name:"Join",description:"Joins the input list into a string, given a delimiter.",transform:function(e){var t=this.params.delimiter.value.replaceAll("\\n","\n");return e.join(t)},params:{delimiter:{name:"Join",value:",",valueType:"string",required:!0,choiceType:"freeResponse"}},inputType:"list",outputType:"string",getHistoryDescription:function(){return'Joined text using "'.concat(this.params.delimiter.value,'"')}},{name:"Filter",description:"Filters the list using a given condition.",transform:function(e){switch(this.params.filterCondition.value){case"Remove empty":return e.filter((function(e){return""!==e}))}return Object(s.a)(e)},params:{filterCondition:{name:"Filter condition",value:"Remove empty",required:!0,choiceType:"multipleChoice",choices:["Remove empty"]}},inputType:"list",outputType:"list",getHistoryDescription:function(){return"Filtered the list using ".concat(this.params.filterCondition.value)}}],[{name:"Parse number",description:"Parse the given string into a number.",transform:function(e){return Number(e)},getHistoryDescription:function(){return"Parsed string to number"},inputType:"string",outputType:"number"},{name:"Arithmetic",description:"Perform arithmetic operations on the given number.",transform:function(e){switch(this.params.operation.value){case"Add":return e+this.params.operand.value;case"Subtract":return e-this.params.operand.value;case"Multiply":return e*this.params.operand.value;case"Divide":return e/this.params.operand.value}},getHistoryDescription:function(){return"Parsed string to number"},inputType:"number",outputType:"number",params:{operation:{name:"Operation",value:"Add",valueType:"string",choiceType:"multipleChoice",choices:["Add","Subtract","Multiply","Divide"],required:!0},operand:{name:"Operand",value:0,valueType:"number",choiceType:"freeResponse",required:!0}}}]),f=n(27),m=n(85),j=n(40),b=n(74);function y(e){return"multipleChoice"===e.choiceType}var v=function(){function e(){Object(u.a)(this,e)}return Object(j.a)(e,null,[{key:"from",value:function(e){return"string"===typeof e?new g(e,"string"):"number"===typeof e?new g(e,"number"):Array.isArray(e)?new O(e):"object"===typeof e&&null!==e?new x(e):new g(e,"any")}}]),e}(),g=function(){function e(t,n){Object(u.a)(this,e),this.data=void 0,this.type=void 0,this.data=t,this.type=n}return Object(j.a)(e,[{key:"get",value:function(){return this.data}},{key:"getType",value:function(){return this.type}},{key:"transformedWith",value:function(e){var t=e.transform(this.get());return v.from(t)}}]),e}(),O=function(){function e(t){Object(u.a)(this,e),this.children=void 0,this.childrenTypes=void 0,this.childrenTypes=new Set;var n,r=[],i=Object(m.a)(t);try{for(i.s();!(n=i.n()).done;){var a=n.value;if(a instanceof g||a instanceof e)this.childrenTypes.add(a.getType()),r.push(a);else{var c=v.from(a);this.childrenTypes.add(c.getType()),r.push(c)}}}catch(o){i.e(o)}finally{i.f()}this.children=r}return Object(j.a)(e,[{key:"get",value:function(){return this.children.map((function(e){return e.get()}))}},{key:"getType",value:function(){return"list"}},{key:"transformedWith",value:function(e){if(e.typePath.length>1)return Object(b.strict)("list"===e.typePath[0]),this.childrenTransformedWith(Object(f.a)(Object(f.a)({},e),{},{typePath:e.typePath.slice(1)}));var t=e.transform(this.get());return v.from(t)}},{key:"childrenTransformedWith",value:function(t){return new e(this.children.map((function(e){return t.typePath[0]===e.getType()?e.transformedWith(t):e})))}}]),e}(),x=function(){function e(t){Object(u.a)(this,e),this.map=void 0,Object(b.strict)(!Array.isArray(t));for(var n=new Map,r=0,i=Object.entries(t);r<i.length;r++){var a=i[r],c=Object(o.a)(a,2),s=c[0],l=c[1];n.set(v.from(s),v.from(l))}this.map=n}return Object(j.a)(e,[{key:"get",value:function(){for(var e=[],t=this.map.entries(),n=t.next();!n.done;){var r=Object(o.a)(n.value,2),i=r[0],a=r[1];e.push([i.get(),a.get()]),n=t.next()}return Object.fromEntries(e)}},{key:"getType",value:function(){return"json"}},{key:"transformedWith",value:function(e){var t=e.transform(this.get());return v.from(t)}}]),e}(),T=n(89),w=n(180),C=n(197),k=n(181),F=n(195),S=n(201),R=n(67),A=n(182),D=n(196),P=n(191),M=n(208),J=n(188),N=n(189),q=n(198),H=n(192),E=n(174),W=n(199),B=n(187),I=n(202),L=n(190),z=n(184),G=n(194),U=n(205),V=n(176),X=n(2),Y=function(e){var t=e.tool,n=e.updateTool,a=e.index,c=e.isFocused,s=e.isError,u=e.onClick,l=e.onDelete,p=Object(r.useState)(function(e){return void 0!==e.params}(t)?t.params:void 0),d=Object(o.a)(p,2),h=d[0],m=d[1],j=function(){var e=Object(f.a)(Object(f.a)({},t),{},{params:h});n(e)};function b(e,t,n){var r=n;y(e)||"number"!==e.valueType||(r=Number(n));var i=Object(f.a)({},h);i[t]=Object(f.a)(Object(f.a)({},e),{},{value:r}),m(i)}return Object(X.jsxs)("div",{style:{opacity:c||s?1:.5},children:[Object(X.jsxs)(N.a,{button:!0,onClick:u,children:[Object(X.jsx)(q.a,{children:Object(X.jsx)(H.a,{children:a+1})}),Object(X.jsx)(E.a,{primary:t.name,secondary:Object(X.jsx)(i.a.Fragment,{children:t.getHistoryDescription()})}),Object(X.jsx)(W.a,{"aria-label":"delete tool from all steps",onClick:function(e){e.stopPropagation(),l()},children:Object(X.jsx)(V.a,{})})]}),s&&Object(X.jsx)(B.a,{severity:"error",children:"This doesn't work!"}),h&&Object(X.jsxs)(S.a,{ml:2,mr:2,children:[Object(X.jsx)(S.a,{mb:1,children:Object(X.jsx)(R.a,{variant:"overline",children:"Parameters"})}),Object(X.jsx)("form",{onSubmit:function(e){return e.preventDefault(),j()},autoComplete:"off",children:Object.keys(h).map((function(e,t){var n=h[e];return y(n)?Object(X.jsx)(S.a,{my:2,children:Object(X.jsxs)(I.a,{children:[Object(X.jsx)(L.a,{id:"".concat(n.name,"-label"),children:n.name}),Object(X.jsx)(z.a,{value:n.value,labelId:"".concat(n.name,"-label"),label:n.name,onChange:function(t){b(n,e,t.target.value)},children:n.choices.map((function(e,t){return Object(X.jsx)(G.a,{value:e,children:e},t)}))})]})}):Object(X.jsx)(P.a,{fullWidth:!0,required:n.required,label:n.name,value:n.value,onChange:function(t){b(n,e,t.target.value)},children:n.name},t)}))}),Object(X.jsx)(U.a,{type:"submit",onClick:function(e){j()},children:"Apply"})]})]})},K=n(183),Q=n(206),Z=n(207),$=function e(t){var n=t.toolMap,r=t.addTool,i=t.typePath;return Object(X.jsxs)("div",{children:[Object(X.jsx)(R.a,{variant:"overline",children:i.join(" > ")}),Array.from(n.self.keys()).map((function(e,t){return Object(X.jsxs)(S.a,{mt:t>0?2:0,children:[Object(X.jsx)(R.a,{variant:"overline",color:"text.secondary",component:"div",children:e}),n.self.get(e).map((function(e){return Object(X.jsx)(K.a,{title:e.description,children:Object(X.jsx)(S.a,{marginRight:1,component:"span",children:Object(X.jsx)(U.a,{onClick:function(){return r(Object(f.a)(Object(f.a)({},e),{},{typePath:i}))},variant:"outlined",children:e.name})})})}))]})})),n.children&&Object(X.jsx)(S.a,{mt:2,children:Object(X.jsx)(Q.a,{variant:"outlined",children:Object(X.jsxs)(Z.a,{children:[Object(X.jsx)(R.a,{gutterBottom:!0,variant:"h6",children:"For each list element"}),Array.from(n.children.values()).map((function(t,n){return Object(X.jsx)(e,{toolMap:t,addTool:r,typePath:[].concat(Object(s.a)(i),[t.type])},n)}))]})})})]})},_=n(87),ee=n.n(_),te=n(88),ne=n.n(te),re=Object(T.a)({palette:{mode:"dark",primary:{main:"#FFFF00"},text:{primary:"#FFFFFF"},background:{default:"#201B2D",paper:"#191622"}},typography:{fontFamily:["Roboto Mono","monospace"].join(",")}}),ie=function e(t,n){Object(u.a)(this,e),this.index=void 0,this.value=void 0,this.index=t,this.value=n},ae=function(e,t){var n=e.filter((function(e){return"any"===e.inputType||e.inputType===t.getType()})).reduce((function(e,t){var n=t.inputType===t.outputType?"".concat(t.inputType," tools"):"Transform";return e.set(n,[].concat(Object(s.a)(e.get(n)||[]),[t]))}),new Map);if("list"===t.getType()){var r=function(e,t){var n=Array.from(t.childrenTypes);return n.map((function(n){var r=t.children.find((function(e){return e.getType()===n}));return ae(e,r)})).reduce((function(e,t,r){return e.set(n[r]+"",t)}),new Map)}(e,t);return{self:n,type:t.getType(),children:r}}return{self:n,type:t.getType()}},ce=function(){var e=Object(r.useState)(void 0),t=Object(o.a)(e,2),n=t[0],i=t[1],a=Object(r.useMemo)((function(){return v.from("")}),[]),c=Object(r.useState)(!1),u=Object(o.a)(c,2),d=u[0],f=u[1],m=Object(r.useState)(!1),j=Object(o.a)(m,2),b=j[0],y=j[1],g=Object(r.useState)([]),O=Object(o.a)(g,2),x=O[0],T=O[1],N=Object(r.useMemo)((function(){try{var e=(void 0!==n?x.slice(0,n+1):x).reduce((function(e,t,n){try{return e.transformedWith(t)}catch(r){throw new ie(n-1,e)}}),a);return[Math.min(null!==n&&void 0!==n?n:1/0,x.length-1),e]}catch(r){var t=r;return[t.index,t.value]}}),[a,x,n]),q=Object(o.a)(N,2),H=q[0],E=q[1],W=Object(r.useMemo)((function(){return"string"===typeof E?null:p}),[E]),B=Object(s.a)(x),I=Object(r.useMemo)((function(){return"json"===E.getType()||"list"===E.getType()?"list"!==E.getType()||b?d?ne.a.stringify(E.get(),{quote:'"',space:2}):JSON.stringify(E.get(),null,2):E.get().join(",\n"):E.get()+""}),[E,b,d]),L=Object(r.useMemo)((function(){return I.trim().split(/\s+/).length}),[I]),z=function(e){var t=x.slice(0,H+1);t.length>0&&"Text input"===t[t.length-1].name&&"Text input"===e.name&&t.pop(),t.push(e),T(t),i(H+1)},G=E.getType(),U=ae(h,E),V=Object(w.a)(re.breakpoints.down("lg"));return Object(X.jsx)(C.a,{theme:re,children:Object(X.jsxs)("div",{className:"App",style:{display:"flex"},children:[Object(X.jsx)(k.a,{}),Object(X.jsx)(F.a,{sx:{width:300,flexShrink:0,"& .MuiDrawer-paper":{width:300,boxSizing:"border-box"}},variant:"permanent",anchor:"left",children:Object(X.jsxs)(S.a,{mt:4,children:[Object(X.jsx)(S.a,{marginX:2,children:Object(X.jsx)(R.a,{variant:"h5",gutterBottom:!0,children:"Operations"})}),0===B.length&&Object(X.jsx)(S.a,{mx:2,children:Object(X.jsx)(R.a,{variant:"body1",color:"text.secondary",children:"Type something to begin"})}),B.map((function(e,t){return Object(X.jsxs)("div",{children:[Object(X.jsx)(Y,{onClick:function(){i(t)},onDelete:function(){!function(e){T(x.slice(0,e))}(t)},tool:e,updateTool:function(e){var n=Object(s.a)(x);n[t]=e,T(n)},index:t,isFocused:t===H,isError:t===H+1&&e!==W&&t-1!==n},t+" "+e.name),Object(X.jsx)(A.a,{})]})}))]})}),Object(X.jsx)(S.a,{component:"main",sx:{flexGrow:1,bgcolor:"background.default",p:3},children:Object(X.jsxs)(D.a,{container:!0,children:[Object(X.jsxs)(D.a,{item:!0,xs:12,lg:6,children:[Object(X.jsx)(R.a,{variant:"h3",color:"text.disabled",gutterBottom:!0,children:"txthlpr"}),Object(X.jsxs)("form",{noValidate:!0,autoComplete:"off",children:[Object(X.jsx)(P.a,{label:"Input",value:I,fullWidth:!0,onChange:function(e){return t=e.target.value,void z({name:"Text input",description:"You typed this value in.",transform:function(e){return t},inputType:"any",outputType:"string",typePath:["string"],getHistoryDescription:function(){return'Entered "'.concat(l(t),'"')}});var t},minRows:20,maxRows:30,multiline:!0}),Object(X.jsx)("div",{children:Object(X.jsx)(R.a,{variant:"overline",color:"text.secondary",component:"span",children:["Type: ".concat(G),"Characters: ".concat(I.length),"Words: ".concat(L)].join(" | ")})}),Object(X.jsx)(M.a,{control:Object(X.jsx)(J.a,{checked:d,onChange:function(){return f(!d)},color:"primary"}),label:"Use JSON5 formatting (for JSONs and lists)"})]}),Object(X.jsx)(M.a,{control:Object(X.jsx)(J.a,{checked:b,onChange:function(){return y(!b)},color:"primary"}),label:"Display list as JSON"}),Object(X.jsxs)(S.a,{mt:4,children:[Object(X.jsx)(R.a,{variant:"h6",color:"text.secondary",children:"Tools"}),Object(X.jsx)($,{toolMap:U,addTool:z,typePath:[E.getType()]})]})]}),Object(X.jsx)(D.a,{item:!0,xs:12,lg:6,children:Object(X.jsxs)(S.a,{mx:V?0:4,my:V?4:0,children:[Object(X.jsx)(R.a,{variant:"h6",color:"text.secondary",gutterBottom:!0,children:"Current data structure"}),Object(X.jsx)(ee.a,{src:{input:E.get()},collapseStringsAfterLength:30,theme:{base00:"1e1e3f",base01:"43d426",base02:"f1d000",base03:"808080",base04:"6871ff",base05:"c7c7c7",base06:"ff77ff",base07:"ffffff",base08:"d90429",base09:"f92a1c",base0A:"ffe700",base0B:"3ad900",base0C:"00c5c7",base0D:"6943ff",base0E:"ff2c70",base0F:"79e8fb"}})]})}),Object(X.jsx)(D.a,{item:!0,xs:12}),Object(X.jsx)(D.a,{item:!0,xs:6})]})})]})})},oe=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,209)).then((function(t){var n=t.getCLS,r=t.getFID,i=t.getFCP,a=t.getLCP,c=t.getTTFB;n(e),r(e),i(e),a(e),c(e)}))};c.a.render(Object(X.jsx)(i.a.StrictMode,{children:Object(X.jsx)(ce,{})}),document.getElementById("root")),oe()}},[[129,1,2]]]);
//# sourceMappingURL=main.78a13431.chunk.js.map