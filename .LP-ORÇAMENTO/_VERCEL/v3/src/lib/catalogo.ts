export interface CatalogoItem {
  nome: string;
  preco: number;
  unidade: string;
  grupo: string;
}

export const CATALOGO_ITENS: CatalogoItem[] = [
  // ── Caixotes (m²) ──
  { nome: "Caixote sem porta", preco: 2000, unidade: "m²", grupo: "Caixotes" },
  { nome: "Caixote c/ porta de vidro", preco: 2500, unidade: "m²", grupo: "Caixotes" },
  { nome: "Caixote c/ porta usinada", preco: 2200, unidade: "m²", grupo: "Caixotes" },
  { nome: "Caixote c/ porta palha", preco: 2400, unidade: "m²", grupo: "Caixotes" },
  { nome: "Caixote provençal laqueada", preco: 3000, unidade: "m²", grupo: "Caixotes" },
  { nome: "Caixote provençal madeirada ou lisa", preco: 2350, unidade: "m²", grupo: "Caixotes" },

  // ── Painéis (m²) ──
  { nome: "Painel Liso", preco: 1200, unidade: "m²", grupo: "Painéis" },
  { nome: "Painel Ripado", preco: 1500, unidade: "m²", grupo: "Painéis" },
  { nome: "Painel c/ Palha", preco: 1659, unidade: "m²", grupo: "Painéis" },
  { nome: "Painel Paramétrico", preco: 6000, unidade: "m²", grupo: "Painéis" },
  { nome: "Laqueamento do Painel", preco: 1100, unidade: "m²", grupo: "Painéis" },
  { nome: "Espelho", preco: 1300, unidade: "m²", grupo: "Painéis" },
  { nome: "Mucharabi", preco: 2300, unidade: "m²", grupo: "Painéis" },

  // ── Portas (m²) ──
  { nome: "Porta de Correr 90", preco: 1800, unidade: "m²", grupo: "Portas" },
  { nome: "Porta Pivotante 90", preco: 1600, unidade: "m²", grupo: "Portas" },

  // ── Lineares (ml) ──
  { nome: "Rodapé de Madeira", preco: 70, unidade: "ml", grupo: "Lineares" },
  { nome: "Rodapé de Granito", preco: 150, unidade: "ml", grupo: "Lineares" },
  { nome: "LED", preco: 250, unidade: "ml", grupo: "Lineares" },
  { nome: "Prateleira até 60cm", preco: 600, unidade: "ml", grupo: "Lineares" },
  { nome: "Ferragem Metalon c/ pintura eletrostática", preco: 450, unidade: "ml", grupo: "Lineares" },

  // ── Por unidade ──
  { nome: "Dobradiça", preco: 150, unidade: "un", grupo: "Por unidade" },
  { nome: "Articulador", preco: 390, unidade: "un", grupo: "Por unidade" },
  { nome: "Corrediça Oculta", preco: 190, unidade: "un", grupo: "Por unidade" },
  { nome: "Fechadura Digital", preco: 790, unidade: "un", grupo: "Por unidade" },

  // ── Serviços ──
  { nome: "Mão de obra por técnico", preco: 450, unidade: "hr", grupo: "Serviços" },
];
