// fix-agora.js — limpa caracteres corrompidos
(function(){
var tot = 0;
var keys = ["explan_oc","explan_projetos","explan_perfil"];
for(var ki = 0; ki < keys.length; ki++){
  var k = keys[ki];
  try {
    var raw = localStorage.getItem(k);
    if(!raw) continue;
    var p = JSON.parse(raw);
    var antes = JSON.stringify(p);
    
    function limpar(obj) {
      if(typeof obj === "string") {
        // Remove qualquer caractere fora do básico: letras, números, espaços, acentos comuns, _, -, /
        return obj.replace(/[^\w\sàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞß,.:;!?@#$%&*()\[\]{}<>\-=\/\\'"]/g, '').replace(/\s+/g, ' ').trim();
      }
      if(obj && typeof obj === "object") {
        for(var key in obj) {
          if(typeof obj[key] === "string") {
            obj[key] = limpar(obj[key]);
          } else if(obj[key] && typeof obj[key] === "object") {
            limpar(obj[key]);
          }
        }
      }
      return obj;
    }
    
    limpar(p);
    var depois = JSON.stringify(p);
    if(antes !== depois) {
      localStorage.setItem(k, depois);
      tot++;
      console.log("✅ " + k + " — limpo");
    }
  } catch(e) {
    console.log("❌ " + k + ": " + e.message);
  }
}
console.log("Total: " + tot + " chave(s) limpa(s). Recarregue a pagina (F5).");
})();
