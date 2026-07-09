// fix-emoji.js — limpa corrompidos + adiciona 🧺 antes de Lavanderia
(function(){
var tot=0;
var keys=["explan_oc","explan_projetos","explan_perfil"];
var LAVANDERIA_EMOJI = String.fromCodePoint(0x1F9FA); // 🧺

function limpar(s){
  if(typeof s!=="string")return s;
  var r="";
  for(var i=0;i<s.length;i++){
    var c=s.charCodeAt(i);
    var keep=true;
    if(c>=0x80&&c<=0x9F)keep=false;
    if(c===0xF0||c===0x178)keep=false;
    if(c>=0x2013&&c<=0x2027)keep=false;
    if(c===0x20AC||c===0x2122||c===0x02C6||c===0x02DC||c===0x0192||c===0x0160||c===0x0161||c===0x0152||c===0x0153||c===0x017D||c===0x017E)keep=false;
    if(keep)r+=s[i];
  }
  return r.replace(/\s+/g,' ').trim();
}

function fixObj(o,c){
  if(typeof o==="string"){
    var f=limpar(o);
    // Adiciona 🧺 antes de "Lavanderia" se não tiver emoji
    if(f.indexOf("Lavanderia")>=0 && f.indexOf(LAVANDERIA_EMOJI)<0){
      f = LAVANDERIA_EMOJI + " " + f;
    }
    if(f!==o){c.push({b:o,a:f});return f}
    return o
  }
  if(o&&typeof o==="object"){
    for(var k in o){
      var v=o[k];
      if(typeof v==="string"){
        var f=limpar(v);
        if(f.indexOf("Lavanderia")>=0 && f.indexOf(LAVANDERIA_EMOJI)<0){
          f = LAVANDERIA_EMOJI + " " + f;
        }
        if(f!==v){o[k]=f;c.push({k:k,b:v,a:f})}
      } else if(v&&typeof v==="object"){
        fixObj(v,c);
      }
    }
  }
  return o
}

for(var ki=0;ki<keys.length;ki++){var k=keys[ki];
  try{
    var raw=localStorage.getItem(k);
    if(!raw)continue;
    var p=JSON.parse(raw);
    var bf=JSON.stringify(p);
    var ch=[];
    if(k==="explan_projetos"&&Array.isArray(p)){for(var xi=0;xi<p.length;xi++)fixObj(p[xi],ch)}
    else{fixObj(p,ch)}
    var af=JSON.stringify(p);
    if(bf!==af){localStorage.setItem(k,af);tot+=ch.length;
      console.log("✅ "+k+" - "+ch.length+" alteracao(oes)");
      for(var ci=0;ci<ch.length;ci++){var c=ch[ci];console.log('  "'+c.b+'" -> "'+c.a+'"')}
    }
  }catch(e){console.log("❌ "+k+": "+e.message)}
}
console.log("Total: "+tot+" campo(s) alterado(s). F5 para recarregar.");
console.log("🧺 Lavanderia agora tem emoji!");
})();
