(function(){var H=String.fromCodePoint(0x1F3E0);
var P=[String.fromCharCode(0xF0,0x178,0x8F,0xA0),String.fromCharCode(0xF0,0x178,0x8F,32),String.fromCharCode(0xF0,0x9F,0x8F,0xA0),String.fromCharCode(0xF0,0x9F,0x8F,32)];
var W={338:140,339:156,352:138,353:154,376:159,381:142,382:158,402:131,710:136,732:152,8211:150,8212:151,8216:145,8217:146,8218:130,8220:147,8221:148,8222:132,8224:134,8225:135,8226:149,8230:133,8240:137,8249:139,8250:155,8364:128,8482:153};
function b(c){return c<256?c:(W[c]!==undefined?W[c]:-1)}
function d(b){try{return new TextDecoder("utf-8",{fatal:true}).decode(new Uint8Array(b))}catch{return null}}
function f(s){
if(typeof s!=="string"||s.length<2)return s;
for(var p=0;p<P.length;p++)s=s.split(P[p]).join(H);
var R=[];var i=0;
while(i<s.length){var c=s.charCodeAt(i);
if(c<128){R.push(s[i]);i++;continue}
var st=i;while(i<s.length){var cc=s.charCodeAt(i);var bv=b(cc);if(bv<0){i++;break}if(cc<128)break;i++}
var seg=s.slice(st,i);if(seg.length<2){R.push(seg);continue}
var B=[];var ok=true;for(var j=0;j<seg.length;j++){var bv=b(seg.charCodeAt(j));if(bv<0){ok=false;break}B.push(bv)}
if(!ok||B.length<2){R.push(seg);continue}
var dec=d(B);if(dec&&dec!==seg){R.push(dec);continue}
var need=B[0]>=240?4:B[0]>=224?3:B[0]>=192?2:0;
if(need>B.length&&i+(need-B.length)<=s.length){
var ext=s.slice(i,i+need-B.length);var EB=[];var eok=true;
for(var j=0;j<ext.length;j++){var bv=b(ext.charCodeAt(j));if(bv<0){eok=false;break}EB.push(bv)}
if(eok){dec=d(B.concat(EB));if(dec){R.push(dec);i+=ext.length;continue}}
}
if(need>B.length){for(var b2=128;b2<=191;b2++){dec=d(B.concat([b2]));if(dec){R.push(dec);break}}if(dec)continue}
R.push(seg)
}
return R.join("")
}
function g(o,c){
if(typeof o==="string"){var fx=f(o);if(fx!==o)c.push({b:o.slice(0,80),a:fx.slice(0,80)});return fx}
if(o&&typeof o==="object"){for(var k in o){var v=o[k];
if(typeof v==="string"){var fx=f(v);if(fx!==v){o[k]=fx;c.push({k:k,b:v.slice(0,80),a:fx.slice(0,80)})}}
else if(v&&typeof v==="object")g(v,c)
}}return o
}
var tot=0;
var keys=["explan_oc","explan_projetos","explan_perfil"];
for(var ki=0;ki<keys.length;ki++){var k=keys[ki];
try{var raw=localStorage.getItem(k);if(!raw)continue;
var p=JSON.parse(raw);var bf=JSON.stringify(p);var ch=[];
if(k==="explan_projetos"&&Array.isArray(p)){for(var xi=0;xi<p.length;xi++)g(p[xi],ch)}else{g(p,ch)}
var af=JSON.stringify(p);
if(bf!==af){localStorage.setItem(k,af);tot+=ch.length;
console.log("Fixed",k,"-",ch.length,"field(s)");
for(var ci=0;ci<ch.length;ci++){var c=ch[ci];console.log(" "+JSON.stringify(c.b)+" -> "+JSON.stringify(c.a))}
}
}catch(e){console.log("Error",k,":",e.message)}
}
console.log("Total:",tot,"field(s) fixed! Reload the page.");
})();