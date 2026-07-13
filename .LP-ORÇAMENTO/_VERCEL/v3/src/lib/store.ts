"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Cliente, Ambiente, Variaveis } from "./tipos";

interface OrcamentoState {
  cliente: Cliente;
  ambientes: Ambiente[];
  variaveis: Variaveis;
  projetosSalvos: ProjetoSalvo[];

  setCliente: (cliente: Partial<Cliente>) => void;
  addAmbiente: (nome: string, materiais?: Ambiente["materiais"]) => void;
  removeAmbiente: (id: string) => void;
  addItem: (envId: string, item: { nome: string; unidade: string; preco: number; qtd: number }) => void;
  removeItem: (envId: string, index: number) => void;
  setMateriais: (envId: string, mat: Partial<Ambiente["materiais"]>) => void;
  setVariaveis: (v: Partial<Variaveis>) => void;
  salvarProjeto: () => void;
  carregarProjeto: (projeto: ProjetoSalvo) => void;
}

interface ProjetoSalvo {
  cliente: Cliente;
  ambientes: Ambiente[];
  total_geral: number;
  data: string;
}

const clientePadrao: Cliente = {
  nome: "", whatsapp: "", email: "", cpf: "",
  pagamento: "50% assinatura + 50% conclusão",
  prazo: "60 dias corridos", instalacao: "7 dias",
  endereco: "", observacoes: "",
  responsavelNome: "", responsavelCpf: "",
};

const variaveisPadrao: Variaveis = {
  frete: 0, comissaoVendedor: 0, comissaoArquiteto: 0, acrescimos: 0,
};

export const useOrcamento = create<OrcamentoState>()(
  persist(
    (set) => ({
      cliente: { ...clientePadrao },
      ambientes: [],
      variaveis: { ...variaveisPadrao },
      projetosSalvos: [],

      setCliente: (c) => set((s) => ({ cliente: { ...s.cliente, ...c } })),
      
      addAmbiente: (nome, materiais) =>
        set((s) => ({
          ambientes: [
            ...s.ambientes,
            {
              id: "env-" + Date.now(),
              nome,
              itens: [],
              total: 0,
              desconto_pct: 0,
              materiais: materiais || { chapa: "18", ferragem: "blum", cor: "cor" },
            },
          ],
        })),

      removeAmbiente: (id) =>
        set((s) => ({ ambientes: s.ambientes.filter((a) => a.id !== id) })),

      addItem: (envId, item) =>
        set((s) => ({
          ambientes: s.ambientes.map((a) =>
            a.id === envId
              ? { ...a, itens: [...a.itens, { ...item, subtotal: item.preco * item.qtd, descricao: item.descricao || "" }], total: a.total + item.preco * item.qtd }
              : a
          ),
        })),

      removeItem: (envId, index) =>
        set((s) => ({
          ambientes: s.ambientes.map((a) => {
            if (a.id !== envId) return a;
            const novos = a.itens.filter((_, i) => i !== index);
            return { ...a, itens: novos, total: novos.reduce((t, i) => t + i.subtotal, 0) };
          }),
        })),

      setMateriais: (envId, mat) =>
        set((s) => ({
          ambientes: s.ambientes.map((a) => (a.id === envId ? { ...a, materiais: { ...a.materiais, ...mat } } : a)),
        })),

      setVariaveis: (v) => set((s) => ({ variaveis: { ...s.variaveis, ...v } })),

      salvarProjeto: () =>
        set((s) => {
          const total = s.ambientes.reduce((t, a) => t + a.total, 0);
          const projeto: ProjetoSalvo = {
            cliente: s.cliente,
            ambientes: s.ambientes,
            total_geral: total,
            data: new Date().toLocaleDateString("pt-BR"),
          };
          const novos = [...s.projetosSalvos, projeto];
          // Persiste no localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('explan-v3-orcamento-projetos', JSON.stringify(novos));
          }
          return { projetosSalvos: novos };
        }),

      carregarProjeto: (projeto) =>
        set(() => ({
          cliente: projeto.cliente,
          ambientes: projeto.ambientes,
        })),
    }),
    { name: "explan-v3-orcamento" }
  )
);

// Server-safe calculation functions (can be imported in server components too)
export function calcularTotal(ambientes: Ambiente[]): number {
  return ambientes.reduce((t, a) => t + a.total, 0);
}

export function calcularDescontoMateriais(ambientes: Ambiente[]): { pct: number; label: string } {
  let totalDesc = 0;
  const labels: string[] = [];
  ambientes.forEach((a) => {
    const m = a.materiais;
    let desc = 0;
    if (m.chapa === "15") { desc += 10; labels.push("Chapa 15"); }
    if (m.ferragem === "hafele") { desc += 5; labels.push("Häfele"); }
    else if (m.ferragem === "fgv") { desc += 15; labels.push("FGV"); }
    if (m.cor === "branco") { desc += 5; labels.push("Branco int."); }
    if (desc > 0) totalDesc = Math.max(totalDesc, desc);
  });
  return { pct: totalDesc, label: labels.join("+") || "Nenhum" };
}

export function calcularPagamento(total: number) {
  const fmt = (v: number) => "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  return {
    avista: fmt(total * 0.93),
    metade: fmt(total / 2),
    cartao: fmt(Math.ceil(total / 10)),
    entrada60: fmt(total * 0.6),
    boleto: fmt((total * 0.4) / 4),
    total: fmt(total),
  };
}
