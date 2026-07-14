"use client";

import { useState, useEffect } from "react";
import { useOrcamento, calcularTotal, calcularDescontoMateriais, calcularPagamento } from "@/lib/store";
import { CATALOGO_ITENS } from "@/lib/catalogo";

declare global { interface Window { lucide: any; } }

const AMBIENTES_PREDEFINIDOS = [
  "Sala de Estar", "Sala de Jantar", "Cozinha", "Quarto Master", "Quarto 2", "Quarto 3",
  "Banheiro", "Banheiro Suíte", "Closet", "Escritório / Home Office",
  "Área Gourmet", "Churrasqueira", "Lavanderia", "Escada", "Hall de Entrada",
];

export default function PainelContent() {
  const {
    cliente, setCliente, ambientes, addAmbiente, removeAmbiente,
    addItem, removeItem, setMateriais, variaveis, setVariaveis, salvarProjeto,
  } = useOrcamento();

  const [showModal, setShowModal] = useState(false);
  const [novoAmbiente, setNovoAmbiente] = useState("");
  const [customNome, setCustomNome] = useState("");
  const [panelOpen, setPanelOpen] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle"|"saving"|"saved">("idle");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const playSaveSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(523, ctx.currentTime);       // C5
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.08); // E5
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.16); // G5
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    } catch { /* sound not available */ }
  };

  const handleSave = () => {
    if (saveStatus === "saving") return;
    setSaveStatus("saving");
    setTimeout(() => {
      salvarProjeto();
      playSaveSound();
      setSaveStatus("saved");
      showToast("✅ Projeto salvo!");
      setTimeout(() => {
        setSaveStatus("idle");
        setToast(null);
      }, 2200);
    }, 400);
  };
  const [menuOpen, setMenuOpen] = useState(false);
  const [projetos, setProjetos] = useState<any[]>([]);
  const [perfil, setPerfil] = useState({ nome: "", cargo: "", email: "", whatsapp: "" });

  useEffect(() => { window.lucide?.createIcons(); }, [ambientes, menuOpen]);

  // Load projetos from localStorage
  useEffect(() => {
    const p = JSON.parse(localStorage.getItem("explan-v3-orcamento-projetos") || "[]");
    setProjetos(p);
    const savedPerfil = JSON.parse(localStorage.getItem("explan_perfil") || "{}");
    if (savedPerfil.nome) setPerfil(savedPerfil);
  }, []);

  const carregarProjeto = (projeto: any) => {
    useOrcamento.getState().carregarProjeto(projeto);
    setPanelOpen(null);
  };

  const salvarPerfil = () => {
    localStorage.setItem("explan_perfil", JSON.stringify(perfil));
    setPanelOpen(null);
  };

  // Extract clientes from projetos
  const clientes = (() => {
    const map = new Map<string, any>();
    projetos.forEach((p: any) => {
      if (p.cliente?.nome) {
        const nome = p.cliente.nome;
        if (!map.has(nome) || new Date(p.data) > new Date(map.get(nome).data)) {
          map.set(nome, { nome, total: p.total_geral, data: p.data, projeto: p });
        }
      }
    });
    return Array.from(map.values()).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  })();

  const totalGeral = calcularTotal(ambientes);
  const { pct: descPct, label: descLabel } = calcularDescontoMateriais(ambientes);
  const pagto = calcularPagamento(totalGeral);

  const handleAddAmbiente = () => {
    const nome = novoAmbiente === "custom" ? customNome : novoAmbiente;
    if (!nome) return;
    addAmbiente(nome);
    setShowModal(false);
    setNovoAmbiente("");
    setCustomNome("");
  };

  const handleAddItem = (envId: string, form: HTMLFormElement) => {
    const data = new FormData(form);
    const nome = data.get("nome") as string;
    const unidade = data.get("unidade") as string;
    const descricao = (data.get("descricao") as string) || "";
    const rawPreco = (data.get("preco") as string || "").replace(",", ".");
    const rawQtd = (data.get("qtd") as string || "1").replace(",", ".");
    const preco = parseFloat(rawPreco) || 0;
    const qtd = parseFloat(rawQtd) || 0;
    if (!nome || qtd <= 0) return;
    addItem(envId, { nome, unidade, descricao, preco, qtd });
    form.reset();
  };

  return (
    <div className="painel-wrapper">
      {/* Sidebar */}
      <nav className={`nav-sidebar ${menuOpen ? 'mobile-open' : ''}`}>
        <div className="nav-logo">
          <img src="/imagens-explan/X .png" alt="Explan X"
            style={{ width: 44, height: 44, objectFit: "contain" }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
        <button className={`nav-btn active`} title="Orçamento" onClick={() => { setPanelOpen(null); setMenuOpen(false); }}>
          <i data-lucide="clipboard-list" style={{ width: 20, height: 20 }} />
          <span className="nav-tooltip">Orçamento</span>
        </button>
        <button className="nav-btn" title="Perfil" onClick={() => { setPanelOpen("perfil"); setMenuOpen(false); }}>
          <i data-lucide="user" style={{ width: 20, height: 20 }} />
          <span className="nav-tooltip">Perfil</span>
        </button>
        <button className="nav-btn" title="Projetos" onClick={() => { setPanelOpen("projetos"); setMenuOpen(false); }}>
          <i data-lucide="folder" style={{ width: 20, height: 20 }} />
          <span className="nav-tooltip">Projetos</span>
        </button>
        <button className="nav-btn" title="Clientes" onClick={() => { setPanelOpen("clientes"); setMenuOpen(false); }}>
          <i data-lucide="users" style={{ width: 20, height: 20 }} />
          <span className="nav-tooltip">Clientes</span>
        </button>
        <div className="nav-spacer" />
        <a href="/ajuda" className="nav-btn" title="Ajuda" onClick={() => setMenuOpen(false)}>
          <i data-lucide="help-circle" style={{ width: 20, height: 20 }} />
          <span className="nav-tooltip">Central de Ajuda</span>
        </a>
        <a href="/suporte" className="nav-btn" title="Relatar Bug" onClick={() => setMenuOpen(false)}>
          <i data-lucide="bug" style={{ width: 20, height: 20 }} />
          <span className="nav-tooltip">Relatar Bug</span>
        </a>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />}

      {/* Nav overlay — click outside to close panel */}
      <div className="nav-overlay" id="nav-overlay" onClick={() => setPanelOpen(null)}
        style={{ display: panelOpen ? 'block' : 'none', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 89 }} />

      {/* Panel: Projetos */}
      <aside className="nav-panel" style={{ transform: panelOpen === 'projetos' ? 'translateX(0)' : 'translateX(-110%)' }}>
        <div className="nav-panel-header">
          <span className="nav-panel-title">Projetos Salvos</span>
          <button className="nav-panel-close" onClick={() => setPanelOpen(null)}>×</button>
        </div>
        <div className="nav-panel-body">
          <button className="btn btn-green btn-sm" onClick={handleSave} style={{ marginBottom: 16 }}>
            {saveStatus === "saving" ? "⏳ Salvando..." : saveStatus === "saved" ? "✅ Salvo!" : "💾 Salvar Projeto Atual"}
          </button>
          {projetos.map((p: any, i: number) => (
            <div key={i} className="panel-item" onClick={() => carregarProjeto(p)}>
              <div className="pi-title">{p.cliente?.nome || "Sem nome"}</div>
              <div className="pi-sub">R$ {p.total_geral?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} · {p.data}</div>
            </div>
          ))}
          {projetos.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 16 }}>Nenhum projeto salvo.</p>}
        </div>
      </aside>

      {/* Panel: Perfil */}
      <aside className="nav-panel" style={{ transform: panelOpen === 'perfil' ? 'translateX(0)' : 'translateX(-110%)' }}>
        <div className="nav-panel-header">
          <span className="nav-panel-title">Perfil</span>
          <button className="nav-panel-close" onClick={() => setPanelOpen(null)}>×</button>
        </div>
        <div className="nav-panel-body">
          <div className="field" style={{ marginBottom: 12 }}>
            <label>Nome</label>
            <input value={perfil.nome} onChange={(e) => setPerfil({ ...perfil, nome: e.target.value })} placeholder="Seu nome" />
          </div>
          <div className="field" style={{ marginBottom: 12 }}>
            <label>Cargo</label>
            <input value={perfil.cargo} onChange={(e) => setPerfil({ ...perfil, cargo: e.target.value })} placeholder="Seu cargo" />
          </div>
          <div className="field" style={{ marginBottom: 12 }}>
            <label>E-mail</label>
            <input value={perfil.email} onChange={(e) => setPerfil({ ...perfil, email: e.target.value })} placeholder="seu@email.com" />
          </div>
          <div className="field" style={{ marginBottom: 16 }}>
            <label>WhatsApp</label>
            <input value={perfil.whatsapp} onChange={(e) => setPerfil({ ...perfil, whatsapp: e.target.value })} placeholder="(62) 99999-9999" />
          </div>
          <button className="btn btn-primary" onClick={salvarPerfil}>Salvar Perfil</button>
        </div>
      </aside>

      {/* Panel: Clientes */}
      <aside className="nav-panel" style={{ transform: panelOpen === 'clientes' ? 'translateX(0)' : 'translateX(-110%)' }}>
        <div className="nav-panel-header">
          <span className="nav-panel-title">Clientes</span>
          <button className="nav-panel-close" onClick={() => setPanelOpen(null)}>×</button>
        </div>
        <div className="nav-panel-body">
          {clientes.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 16 }}>Nenhum cliente encontrado nos projetos salvos.</p>}
          {clientes.map((c: any, i: number) => (
            <div key={i} className="panel-item" onClick={() => { carregarProjeto(c.projeto); }}>
              <div className="pi-title">{c.nome}</div>
              <div className="pi-sub">R$ {c.total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} · {c.data}</div>
            </div>
          ))}
        </div>
      </aside>
      <header className="app-header">
        <button className="hamburger-btn" onClick={() => setMenuOpen(true)} aria-label="Abrir menu">
          <i data-lucide="menu" style={{ width: 22, height: 22 }} />
        </button>
        <div className="header-logo-center">
          <img src="/imagens-explan/Explan.png" alt="Explan"
            style={{ height: 32, objectFit: "contain" }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
        <div className="hamburger-spacer" />
      </header>

      <div className="layout">
        <div className="main-col">
          {/* Cliente Card */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-header-title">Dados do Cliente</div>
                <div className="card-header-sub">Informações para o orçamento e contrato</div>
              </div>
            </div>
            <div className="card-body">
              <div className="field-row">
                <div className="field">
                  <label>Nome completo</label>
                  <input value={cliente.nome} onChange={(e) => setCliente({ nome: e.target.value })} placeholder="Ex: Alessandro Ferreira" />
                </div>
                <div className="field">
                  <label>WhatsApp</label>
                  <input value={cliente.whatsapp} onChange={(e) => setCliente({ whatsapp: e.target.value })} placeholder="(62) 99999-9999" />
                </div>
              </div>
              <div className="field-row col3">
                <div className="field">
                  <label>E-mail</label>
                  <input type="email" value={cliente.email} onChange={(e) => setCliente({ email: e.target.value })} placeholder="cliente@email.com" />
                </div>
                <div className="field">
                  <label>CPF / CNPJ</label>
                  <input value={cliente.cpf} onChange={(e) => setCliente({ cpf: e.target.value })} placeholder="000.000.000-00" />
                </div>
                <div className="field">
                  <label>Prazo Produção</label>
                  <input value={cliente.prazo} onChange={(e) => setCliente({ prazo: e.target.value })} />
                </div>
                <div className="field">
                  <label>Prazo Instalação</label>
                  <input value={cliente.instalacao} onChange={(e) => setCliente({ instalacao: e.target.value })} />
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Forma de Pagamento</label>
                  <select value={cliente.pagamento} onChange={(e) => setCliente({ pagamento: e.target.value })}>
                    <option>À vista — 7% de desconto (PIX / transferência)</option>
                    <option>50% assinatura + 50% conclusão</option>
                    <option>Cartão de crédito — até 10x sem juros</option>
                    <option>60% entrada + 40% em 4 boletos mensais</option>
                  </select>
                </div>
                <div className="field">
                  <label>Endereço da Obra</label>
                  <input value={cliente.endereco} onChange={(e) => setCliente({ endereco: e.target.value })} placeholder="Rua, nº, cidade — Goiânia/GO" />
                </div>
              </div>
            </div>
          </div>

          {/* Ambientes */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-header-title">Ambientes e Itens</div>
                <div className="card-header-sub">Cada ambiente tem sua configuração própria de materiais</div>
              </div>
            </div>
            <div className="card-body">
              {ambientes.map((amb) => (
                <div key={amb.id} className="env-card">
                  <div className="env-header">
                    <span className="env-name">{amb.nome}</span>
                    <div className="env-actions">
                      <span className="env-total-badge">
                        R$ {amb.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                      <button onClick={() => removeAmbiente(amb.id)} className="btn-del">✕</button>
                    </div>
                  </div>
                  <div className="env-body">
                    {/* Materiais chips */}
                    <div className="mat-row" style={{ marginBottom: 12 }}>
                      <div className="mat-col">
                        <h4>Chapa</h4>
                        <div className="chip-group">
                          <div className={`chip ${amb.materiais.chapa === "18" ? "selected" : ""}`} onClick={() => setMateriais(amb.id, { chapa: "18" })}>
                            <span>Chapa 18</span>
                          </div>
                          <div className={`chip ${amb.materiais.chapa === "15" ? "selected" : ""}`} onClick={() => setMateriais(amb.id, { chapa: "15" })}>
                            <span>Chapa 15</span><small>-10%</small>
                          </div>
                        </div>
                      </div>
                      <div className="mat-col">
                        <h4>Ferragem</h4>
                        <div className="chip-group">
                          {(["blum", "hafele", "fgv"] as const).map((f) => (
                            <div key={f} className={`chip ${amb.materiais.ferragem === f ? "selected" : ""}`} onClick={() => setMateriais(amb.id, { ferragem: f })}>
                              <span>{f === "blum" ? "Blum" : f === "hafele" ? "Häfele" : "FGV"}</span>
                              {f !== "blum" && <small>-{f === "hafele" ? 5 : 15}%</small>}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mat-col">
                        <h4>Cor Interna</h4>
                        <div className="chip-group">
                          {(["cor", "branco"] as const).map((c) => (
                            <div key={c} className={`chip ${amb.materiais.cor === c ? "selected" : ""}`} onClick={() => setMateriais(amb.id, { cor: c })}>
                              <span>{c === "cor" ? "Com cor" : "Branco"}</span>
                              {c === "branco" && <small>-5%</small>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="items-header">
                      <span>Item</span><span>Qtd</span><span>Unitário</span><span>Subtotal</span><span />
                    </div>
                    {amb.itens.map((item, idx) => (
                      <div key={idx} className="item-row">
                        <div className="item-name-cell">
                          <div className="i-name">{item.nome}</div>
                          {item.descricao && <div className="i-desc">{item.descricao}</div>}
                          <div className="i-unit">{item.unidade}</div>
                        </div>
                        <span>{item.qtd}</span>
                        <span>R$ {item.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                        <span className="item-subtotal">R$ {item.subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                        <button onClick={() => removeItem(amb.id, idx)} className="btn-del">×</button>
                      </div>
                    ))}

                    {/* Add item form — catálogo + manual */}
                    <div className="add-row">
                      <select className="item-sel-catalogo" style={{ flex: 2, padding: 8, borderRadius: 7, border: "1px solid var(--border)", fontFamily: "'Archivo', sans-serif", fontSize: 12 }}>
                        <option value="">— Adicionar item do catálogo —</option>
                        {(() => {
                          const grupos: Record<string, typeof CATALOGO_ITENS> = {};
                          CATALOGO_ITENS.forEach(item => { if (!grupos[item.grupo]) grupos[item.grupo] = []; grupos[item.grupo].push(item); });
                          return Object.entries(grupos).map(([grupo, itens]) => (
                            <optgroup key={grupo} label={`${grupo} (${itens[0].unidade})`}>
                              {itens.map((item, i) => (
                                <option key={i} value={`${item.nome}|${item.preco}|${item.unidade}`}>{item.nome} — R$ {item.preco.toLocaleString('pt-BR')}/{item.unidade}</option>
                              ))}
                            </optgroup>
                          ));
                        })()}
                      </select>
                      <input className="item-qty-catalogo" type="number" step="0.1" defaultValue={1} style={{ width: 70 }} placeholder="Qtd" />
                      <button type="button" className="btn btn-sm btn-secondary" onClick={(e) => {
                        const row = (e.target as HTMLElement).closest('.add-row') as HTMLElement;
                        const sel = row.querySelector('.item-sel-catalogo') as HTMLSelectElement;
                        const qty = row.querySelector('.item-qty-catalogo') as HTMLInputElement;
                        if (!sel.value || !qty.value || parseFloat(qty.value) <= 0) return;
                        const [nome, precoStr, unidade] = sel.value.split('|');
                        const preco = parseFloat(precoStr);
                        const qtd = parseFloat(qty.value);
                        addItem(amb.id, { nome, unidade, preco, qtd });
                        sel.value = ''; qty.value = '1';
                      }}>+ Catálogo</button>
                      <button type="button" className="btn btn-sm btn-secondary" onClick={(e) => {
                        const row = (e.target as HTMLElement).closest('.add-row') as HTMLElement;
                        const form = row.nextElementSibling as HTMLElement;
                        form.style.display = form.style.display === 'flex' ? 'none' : 'flex';
                      }}>+ Manual</button>
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); handleAddItem(amb.id, e.currentTarget); }} className="manual-form" style={{ display: 'none', gap: 8, flexWrap: 'wrap', padding: 12, border: '1px dashed var(--green)', borderRadius: 8, background: '#FAFDF8', marginTop: 8 }}>
                      <input name="nome" placeholder="Nome do item" style={{ flex: '1 1 100%', padding: 8, borderRadius: 7, border: "1px solid var(--border)", fontFamily: "'Archivo', sans-serif", fontSize: 12 }} />
                      <textarea name="descricao" placeholder="Descrição técnica (opcional)" rows={2} style={{ flex: '1 1 100%', padding: 8, borderRadius: 7, border: "1px solid var(--border)", fontFamily: "'Archivo', sans-serif", fontSize: 12, resize: 'vertical', minHeight: 50 }} />
                      <select name="unidade" defaultValue="un" style={{ padding: 8, borderRadius: 7, border: "1px solid var(--border)", fontFamily: "'Archivo', sans-serif" }}>
                        <option>un</option><option>m²</option><option>ml</option><option>hr</option>
                      </select>
                      <input name="preco" type="text" inputMode="decimal" placeholder="Preço (ex: 2,52)" style={{ width: 100, padding: 8, borderRadius: 7, border: "1px solid var(--border)", fontFamily: "'Archivo', sans-serif" }} />
                      <input name="qtd" type="text" inputMode="decimal" defaultValue="1" placeholder="Qtd" style={{ width: 70, padding: 8, borderRadius: 7, border: "1px solid var(--border)", fontFamily: "'Archivo', sans-serif" }} />
                      <button type="submit" className="btn btn-sm btn-green">✓ Adicionar</button>
                    </form>
                  </div>
                </div>
              ))}

              <button onClick={() => setShowModal(true)} className="add-env-btn">+ Adicionar Ambiente</button>
            </div>
          </div>
        </div>

        {/* Sidebar Resumo */}
        <aside className="sidebar">
          <div className="sidebar-title">Resumo do Orçamento</div>
          <div className="sidebar-env-row"><span>Cliente:</span><span>{cliente.nome || "—"}</span></div>
          {ambientes.map((a) => (
            <div key={a.id} className="sidebar-env-row">
              <span>{a.nome}</span>
              <span>R$ {a.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
            </div>
          ))}
          <div className="sidebar-total-big">
            <div className="label">Subtotal</div>
            <div className="valor">R$ {totalGeral.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="sidebar-disc">
            Descontos: <strong>{descPct > 0 ? `${descLabel}: -${descPct}%` : "Nenhum aplicado"}</strong>
          </div>
          <div className="sidebar-env-row total-row">
            <span>INVESTIMENTO TOTAL</span>
            <span>R$ {(totalGeral * (1 - descPct / 100)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
          </div>

          <div style={{ margin: "16px 0 8px", borderTop: "1px solid var(--border)", paddingTop: 16 }}>
            <a href="/editor" target="_blank" className="btn btn-primary">Gerar Orçamento</a>
            <a href="/contrato" target="_blank" className="btn btn-green">Gerar Contrato</a>
            <a href="/apresentacao" target="_blank" className="btn btn-olive">Gerar Apresentação</a>
          </div>
          <button className="btn btn-secondary" onClick={handleSave}>
            {saveStatus === "saving" ? "⏳ Salvando..." : saveStatus === "saved" ? "✅ Salvo!" : "💾 Salvar Projeto Atual"}
          </button>

          <button className="btn btn-danger" onClick={() => {
            if (confirm("Tem certeza? Todos os dados do orçamento atual serão perdidos.")) {
              localStorage.removeItem('explan-v3-orcamento');
              location.reload();
            }
          }} style={{ marginTop: 4 }}>
            🗑️ Limpar Orçamento
          </button>

          <div style={{ paddingTop: 14, borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--text-muted)", textAlign: "center", marginTop: 14 }}>
            Produção: <strong>{cliente.prazo}</strong> | Instalação: <strong>{cliente.instalacao}</strong>
          </div>
        </aside>
      </div>

      <footer className="global-footer">
        Desenvolvido por <a href="https://thiagonascimentobarbosapro.com" target="_blank">TM · Sempre Tecnologia</a>
        &nbsp;·&nbsp; Uso exclusivo Explan Móveis Planejados &nbsp;·&nbsp; 2026
      </footer>

      {/* Modal Novo Ambiente */}
      {showModal && (
        <div className="overlay open" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Novo Ambiente</h3>
            <div className="field" style={{ marginBottom: 10 }}>
              <label>Ambiente</label>
              <select value={novoAmbiente} onChange={(e) => setNovoAmbiente(e.target.value === "Outro (digitar)" ? "custom" : e.target.value)}>
                <option value="">Selecione...</option>
                {AMBIENTES_PREDEFINIDOS.map((a) => <option key={a} value={a}>{a}</option>)}
                <option value="custom">Outro (digitar)</option>
              </select>
            </div>
            {novoAmbiente === "custom" && (
              <div className="field" style={{ marginBottom: 10 }}>
                <label>Nome personalizado</label>
                <input value={customNome} onChange={(e) => setCustomNome(e.target.value)} placeholder="Ex: Adega" />
              </div>
            )}
            <div className="modal-btns">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleAddAmbiente}>Adicionar</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}

      <style jsx>{`
        .nav-sidebar {
          position: fixed; top: 0; left: 0; bottom: 0;
          width: var(--nav-w); background: var(--olive); z-index: 100;
          display: flex; flex-direction: column; align-items: center;
          padding: 12px 0; gap: 4px;
        }
        .nav-logo { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; }
        .nav-btn {
          width: 44px; height: 44px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: rgba(235,230,221,.6); font-size: 20px;
          transition: all .2s; background: none; border: none; text-decoration: none;
          position: relative;
        }
        .nav-btn:hover, .nav-btn.active { background: rgba(255,255,255,.12); color: var(--cream); }
        .nav-btn .nav-tooltip {
          position: absolute; left: calc(100% + 10px);
          background: var(--olive); color: var(--cream);
          font-size: 11px; font-weight: 600; padding: 5px 10px;
          border-radius: 6px; white-space: nowrap;
          pointer-events: none; opacity: 0;
          transition: opacity .15s; z-index: 200;
        }
        .nav-btn:hover .nav-tooltip { opacity: 1; }
        .nav-spacer { flex: 1; }
        /* App header */
        .app-header {
          background: var(--olive); padding: 10px 16px;
          display: flex; align-items: center; gap: 12px;
          justify-content: center;
        }
        .hamburger-btn {
          display: none; background: none; border: none; cursor: pointer;
          color: var(--cream); padding: 6px 8px; border-radius: 8px;
          align-items: center; justify-content: center;
          transition: background .2s; flex-shrink: 0;
          position: absolute; left: 16px;
        }
        .hamburger-btn:hover { background: rgba(255,255,255,.12); }
        .hamburger-spacer { display: none; }
        .header-logo-center {
          display: flex; align-items: center; justify-content: center;
          flex: 0 1 auto;
        }
        .painel-wrapper { padding-left: var(--nav-w); }
        .nav-panel {
          position: fixed; top: 0; left: var(--nav-w, 60px); bottom: 0;
          width: 300px; background: var(--white); z-index: 90;
          box-shadow: 2px 0 20px rgba(0,0,0,.1);
          display: flex; flex-direction: column;
          transition: transform .25s ease;
        }
        .nav-panel-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px; border-bottom: 1px solid var(--border);
          background: var(--cream-alt);
        }
        .nav-panel-title { font-weight: 700; font-size: 15px; color: var(--text); }
        .nav-panel-close {
          background: none; border: none; font-size: 22px;
          cursor: pointer; color: var(--text-muted); padding: 0 4px;
          line-height: 1;
        }
        .nav-panel-close:hover { color: var(--text); }
        .nav-panel-body { flex: 1; overflow-y: auto; padding: 16px 20px; }
        .nav-overlay { display: none; }
        .panel-item {
          padding: 12px 14px; border-radius: 8px;
          cursor: pointer; transition: background .15s;
          border: 1px solid var(--cream-dark); margin-bottom: 8px;
        }
        .panel-item:hover { background: var(--cream-alt); border-color: var(--border); }
        .pi-title { font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 3px; }
        .pi-sub { font-size: 11px; color: var(--text-muted); }
        .layout {
          display: grid; grid-template-columns: 1fr 300px; gap: 0;
          max-width: 1100px; margin: 0 auto; padding: 28px 16px 40px; align-items: start;
        }
        .main-col { display: flex; flex-direction: column; gap: 0; }
        .card {
          background: var(--white); border-radius: var(--radius);
          box-shadow: var(--shadow); margin-bottom: 20px; overflow: hidden;
        }
        .card-header {
          background: var(--cream-alt); padding: 16px 20px;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid var(--border);
        }
        .card-header-title { font-size: 16px; font-weight: 600; color: var(--text); }
        .card-header-sub { font-size: 11px; color: var(--text-muted); }
        .card-body { padding: 20px; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
        .field-row.col3 { grid-template-columns: 1fr 1fr 1fr 1fr; }
        .field { display: flex; flex-direction: column; gap: 5px; }
        label { font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: .07em; }
        input, select {
          background: var(--white); border: 1px solid var(--border); border-radius: 7px;
          padding: 10px 12px; font-family: 'Archivo', sans-serif; font-size: 13px;
          color: var(--text); outline: none; transition: border-color .2s;
        }
        input:focus, select:focus { border-color: var(--green); box-shadow: 0 0 0 3px rgba(107,142,94,.15); }
        .btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 11px 18px; border-radius: 50px;
          font-family: 'Archivo', sans-serif; font-size: 13px; font-weight: 600;
          cursor: pointer; border: none; transition: all .2s; justify-content: center;
          text-decoration: none;
        }
        .btn-primary { background: var(--olive); color: var(--cream); width: 100%; margin-bottom: 8px; }
        .btn-primary:hover { background: #2f3020; }
        .btn-green { background: var(--green); color: #fff; width: 100%; margin-bottom: 8px; }
        .btn-green:hover { background: var(--green-dark); }
        .btn-olive { background: var(--olive); color: #fff; width: 100%; margin-bottom: 8px; }
        .btn-secondary { background: var(--cream-alt); color: var(--text); border: 1px solid var(--border); width: 100%; margin-bottom: 8px; }
        .btn-danger { background: transparent; color: var(--red); border: 1px solid var(--red); width: 100%; margin-bottom: 8px; }
        .btn-sm { padding: 7px 13px; font-size: 12px; }
        .env-card { border: 1px solid var(--border); border-radius: 9px; margin-bottom: 12px; overflow: hidden; }
        .env-header {
          background: var(--cream-alt); padding: 14px 20px;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid rgba(212,202,192,.4);
        }
        .env-name { font-weight: 600; font-size: 15px; color: var(--text); }
        .env-actions { display: flex; gap: 8px; align-items: center; }
        .env-total-badge {
          font-size: 13px; color: var(--olive); font-weight: 700;
          background: var(--cream); padding: 5px 12px; border-radius: 20px;
          border: 1.5px solid var(--border);
        }
        .env-body { padding: 16px; }
        .mat-row { display: flex; gap: 28px; flex-wrap: wrap; }
        .mat-col { flex: 1; min-width: 150px; }
        .mat-col h4 { font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: .07em; margin-bottom: 8px; }
        .chip-group { display: flex; gap: 8px; flex-wrap: wrap; }
        .chip {
          padding: 8px 14px; border-radius: 7px; border: 2px solid var(--border);
          font-size: 12px; font-weight: 600; cursor: pointer; transition: all .2s;
          background: var(--white); text-align: center; display: flex; flex-direction: column; gap: 2px;
        }
        .chip:hover { border-color: var(--olive); }
        .chip.selected { border-color: var(--green); background: #EFF3EC; }
        .chip small { font-size: 10px; color: var(--green); }
        .items-header {
          display: grid; grid-template-columns: 1fr 60px 100px 110px 32px; gap: 8px;
          padding: 0 0 8px; border-bottom: 2px solid var(--cream-dark);
          font-size: 10px; font-weight: 700; color: var(--text-muted);
          text-transform: uppercase; letter-spacing: .07em;
        }
        .item-row {
          display: grid; grid-template-columns: 1fr 60px 100px 110px 32px; gap: 8px;
          align-items: center; padding: 9px 0; border-bottom: 1px solid var(--cream-dark);
          font-size: 13px;
        }
        .i-name { font-weight: 500; }
        .i-desc { font-size: 10px; color: var(--text-muted); line-height: 1.3; margin: 2px 0; max-width: 300px; white-space: normal; }
        .i-unit { font-size: 11px; color: var(--text-muted); }
        .item-subtotal { font-weight: 700; color: var(--olive); text-align: right; }
        .btn-del { background: none; border: none; cursor: pointer; color: var(--cream-dark); font-size: 18px; }
        .btn-del:hover { color: var(--red); }
        .add-row { display: flex; gap: 8px; margin-top: 12px; padding-top: 12px; border-top: 1px dashed var(--cream-dark); align-items: center; flex-wrap: wrap; }
        .add-env-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 14px; border: 2px dashed var(--cream-dark);
          border-radius: 9px; background: transparent; color: var(--text-muted);
          font-family: 'Archivo', sans-serif; font-size: 13px; font-weight: 500;
          cursor: pointer; transition: all .2s;
        }
        .add-env-btn:hover { border-color: var(--olive); color: var(--olive); background: #EAEBE3; }
        .sidebar {
          position: sticky; top: 70px; background: var(--white);
          border-radius: var(--radius); box-shadow: var(--shadow); padding: 24px; margin-left: 20px;
        }
        .sidebar-title { font-size: 15px; font-weight: 600; color: var(--text); margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
        .sidebar-env-row { display: flex; justify-content: space-between; font-size: 12px; padding: 5px 0; color: var(--text-muted); border-bottom: 1px solid var(--cream-dark); }
        .sidebar-env-row.total-row { font-size: 14px; font-weight: 700; color: var(--olive); border-bottom: none; margin-top: 8px; padding-top: 8px; border-top: 2px solid var(--cream-dark); }
        .sidebar-total-big {
          background: var(--olive); color: var(--cream); border-radius: 8px;
          padding: 16px; margin: 14px 0; text-align: center;
        }
        .sidebar-total-big .label { font-size: 10px; opacity: .7; text-transform: uppercase; letter-spacing: .08em; }
        .sidebar-total-big .valor { font-size: 26px; font-weight: 700; margin-top: 4px; }
        .sidebar-disc { font-size: 11px; color: var(--text-muted); text-align: center; margin-bottom: 14px; }
        .sidebar-disc strong { color: var(--green); }
        .overlay { display: flex; position: fixed; inset: 0; background: rgba(28,26,23,.5); z-index: 200; align-items: center; justify-content: center; }
        .modal { background: var(--white); border-radius: var(--radius); padding: 28px; width: 420px; box-shadow: 0 8px 40px rgba(0,0,0,.2); }
        .modal h3 { font-size: 20px; font-weight: 700; color: var(--olive); margin-bottom: 18px; }
        .modal-btns { display: flex; gap: 10px; margin-top: 18px; }
        .modal-btns .btn { flex: 1; }
        @media(max-width:900px) {
          .layout { grid-template-columns: 1fr; padding: 12px; }
          .sidebar { margin-left: 0; position: static; margin-top: 16px; }
          .field-row, .field-row.col3 { grid-template-columns: 1fr 1fr; }
        }
        @media(max-width:768px) {
          .painel-wrapper { padding-left: 0; }
          .hamburger-btn { display: flex; }
          .hamburger-spacer { display: block; width: 36px; flex-shrink: 0; }
          .app-header { justify-content: center; }
          .nav-sidebar {
            position: fixed; top: 0; left: 0; bottom: 0;
            transform: translateX(-120%);
            transition: transform .25s ease;
            z-index: 100;
          }
          .nav-sidebar.mobile-open {
            transform: translateX(0);
            box-shadow: 4px 0 24px rgba(0,0,0,.25);
          }
          .mobile-overlay {
            display: block; position: fixed; inset: 0;
            background: rgba(0,0,0,.4); z-index: 95;
          }
          .nav-panel {
            left: 0; width: 85vw; max-width: 320px;
            z-index: 110;
          }
        }
        @media(max-width:640px) {
          .layout { padding: 8px; }
          .field-row, .field-row.col3 { grid-template-columns: 1fr; }
          .card-body { padding: 12px; }
          input, select { font-size: 16px; padding: 12px; }
          .btn { padding: 14px 18px; font-size: 15px; }
          .env-card { border-radius: 8px; }
          .env-body { padding: 12px; }
          .items-header { grid-template-columns: 1fr 50px 80px 90px 28px; font-size: 9px; }
          .item-row { grid-template-columns: 1fr 50px 80px 90px 28px; font-size: 12px; }
          .mat-row { flex-direction: column; gap: 10px; }
          .sidebar { padding: 16px; }
          .sidebar-total-big .valor { font-size: 22px; }
          .modal { width: 90vw; padding: 20px; }
          .add-row { flex-direction: column; }
          .add-row select, .add-row input { width: 100%; }
        }
        /* Toast */
        .toast {
          position: fixed; bottom: 32px; right: 32px; z-index: 9999;
          background: var(--olive); color: var(--cream);
          padding: 14px 24px; border-radius: 10px;
          font-size: 14px; font-weight: 600;
          box-shadow: 0 4px 20px rgba(0,0,0,.25);
          animation: toastIn .3s ease, toastOut .3s ease 2.1s forwards;
        }
        @keyframes toastIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes toastOut { from { opacity: 1; } to { opacity: 0; transform: translateY(-8px); } }
      `}</style>
    </div>
  );
}
