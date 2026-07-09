// fix-limpo.js — remove APENAS caracteres corrompidos
(function(){
var tot=0;
var keys=["explan_oc","explan_projetos","explan_perfil"];
// Lista de caracteres corrompidos para remover
var ruins = [];
for(var i=0x80;i<=0x9F;i++) ruins.push(i);     // C1 control chars
ruins.push(0xF0); // corrupted emoji byte 1
ruins.push(0x178); // Ÿ = corrupted emoji byte 2
ruins.push(0x2018,0x2019,0x201C,0x201D,0x2013,0x2014,0x2020,0x2021,0x2022,0x2026,0x2030,0x2039,0x203A,0x20AC,0x2122,0x02C6,0x02DC,0x0192,0x0160,0x0161,0x0152,0x0153,0x017D,0x017E);

function temRuim(s){
  for(var i=0;i<s.length;i++){
    var c=s.charCodeAt(i);
    if(c>=0x80 && c<=0x9F) return true; // C1 controls
    if(c===0xF0 || c===0x178) return true;
    if(c>=0x2013 && c<=0x2027) return true;
    if(c===0x20AC||c===0x2122||c===0x02C6||c===0x02DC||c===0x0192||c===0x0160||c===0x0161||c===0x0152||c===0x0153||c===0x017D||c===0x017E) return true;
  }
  return false;
}

function limpar(s){
  if(typeof s!=="string") return s;
  if(!temRuim(s)) return s;
  var r="";
  for(var i=0;i<s.length;i++){
    var c=s.charCodeAt(i);
    var keep=true;
    if(c>=0x80&&c<=0x9F) keep=false;
    if(c===0xF0||c===0x178) keep=false;
    if(c>=0x2013&&c<=0x2027) keep=false;
    if(c===0x20AC||c===0x2122||c===0x02C6||c===0x02DC||c===0x0192||c===0x0160||c===0x0161||c===0x0152||c===0x0153||c===0x017D||c===0x017E) keep=false;
    if(keep) r+=s[i];
  }
  return r.replace(/\s+/g,' ').trim();
}

function fixObj(o,c){
  if(typeof o==="string"){var f=limpar(o);if(f!==o){c.push({b:o,a:f});return f}return o}
  if(o&&typeof o==="object"){for(var k in o){
    var v=o[k];
    if(typeof v==="string"){var f=limpar(v);if(f!==v){o[k]=f;c.push({k:k,b:v,a:f})}}
    else if(v&&typeof v==="object") fixObj(v,c)
  }}
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
      console.log("✅ "+k+" - "+ch.length+" campo(s)");
      for(var ci=0;ci<ch.length;ci++){var c=ch[ci];console.log('  "'+c.b+'" -> "'+c.a+'"')}
    }
  }catch(e){console.log("❌ "+k+": "+e.message)}
}
console.log("Total: "+tot+" campo(s) limpo(s). F5 para recarregar.");
})();
