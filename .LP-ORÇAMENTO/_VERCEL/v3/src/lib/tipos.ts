export interface Cliente {
  nome: string;
  whatsapp: string;
  email: string;
  cpf: string;
  pagamento: string;
  prazo: string;
  instalacao: string;
  endereco: string;
  observacoes: string;
  responsavelNome: string;
  responsavelCpf: string;
}

export interface Item {
  nome: string;
  unidade: string;
  preco: number;
  qtd: number;
  subtotal: number;
  descricao?: string;
}

export interface Materiais {
  chapa: "18" | "15";
  ferragem: "blum" | "hafele" | "fgv";
  cor: "cor" | "branco";
}

export interface Ambiente {
  id: string;
  nome: string;
  itens: Item[];
  total: number;
  desconto_pct: number;
  materiais: Materiais;
}

export interface Variaveis {
  frete: number;
  comissaoVendedor: number;
  comissaoArquiteto: number;
  acrescimos: number;
}

export interface ProjetoCompleto {
  cliente: Cliente;
  ambientes: Ambiente[];
  variaveis: Variaveis;
  total_geral: number;
  data_orcamento: string;
  ref: string;
}
