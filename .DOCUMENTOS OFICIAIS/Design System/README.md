# 🎨 Design System — Explan Móveis Planejados

**Versão:** 2.0  
**Última atualização:** 11 de Junho de 2026  
**Status:** Alinhado ao Projeto de Marca (Sprint 08)
**Baseado em:** Projeto de Marca - Explan.pdf (Morath Studio)

---

## 📋 Índice

1. [Paleta de Cores](01-PALETA-CORES.md)
2. [Tipografia](02-TIPOGRAFIA.md)
3. [Componentes](03-COMPONENTES.md)
4. [Espaçamento & Sombras](04-ESPACAMENTO-SOMBRAS.md)
5. [Estados & Interação](05-ESTADOS-INTERACAO.md)
6. [Acessibilidade](06-ACESSIBILIDADE.md)
7. [Grid & Responsividade](07-GRID-RESPONSIVIDADE.md)

---

## 🚀 Visão Geral

Este Design System documenta os padrões visuais, componentes reutilizáveis e diretrizes de design para todas as ferramentas internas e públicas da **Explan Móveis Planejados**.

**Principais características:**
- ✓ Paleta de cores harmônica alinhada ao Projeto de Marca (Olive, Cream, Green musgo #6B8E5E, Red)
- ✓ Tipografia única: Archivo (300–700) — reflete identidade visual Explan
- ✓ Componentes modulares e reutilizáveis
- ✓ Espaçamento e sombras consistentes
- ✓ Estados interativos bem definidos (hover, active, disabled, error)
- ✓ Responsividade mobile-first
- ✓ Contraste AAA para acessibilidade

---

## 📱 Breakpoints

| Dispositivo | Largura | Colunas |
|-------------|---------|---------|
| Mobile | ≤ 480px | 1 |
| Tablet | 481px - 860px | 2 |
| Desktop | ≥ 861px | 3+ |

---

## 🎯 Princípios de Design

### 1. **Clareza**
Interfaces limpas, intuitivas e sem poluição visual. Cada elemento tem um propósito claro.

### 2. **Consistência**
Usar sempre as mesmas cores, tipografia, espaçamento e componentes. Nada ad-hoc.

### 3. **Hierarquia Visual**
Tamanhos, pesos, cores e espaçamento guiam a atenção do usuário.

### 4. **Acessibilidade**
Contraste mínimo AA (4.5:1), suporte a teclado, sem dependência de cor.

### 5. **Performance**
Design deve ser rápido. Nada de imagens pesadas ou animações desnecessárias.

---

## 🔧 Implementação

Todos os arquivos HTML devem importar as variáveis CSS do Design System:

```html
<style>
:root {
  /* Importar do 01-PALETA-CORES.md */
  --olive: #41422F;
  --cream: #EBE6DD;
  /* ... etc ... */
}
</style>
```

---

## 📞 Suporte

Para dúvidas sobre o Design System ou para propor novas cores/componentes:
- **Contato:** Thiago Nascimento (TM · Sempre Tecnologia)
- **E-mail:** thiagonascimento.barbosapro@gmail.com
- **Projeto:** Explan Móveis Planejados

---

## 📄 Histórico de Versões

| Versão | Data | Alterações |
|--------|------|-----------|
| 2.0 | 11/06/2026 | Tipografia unificada em Archivo, Verde ajustado (#6B8E5E), Magenta/Cyan removidas, alinhamento ao Projeto de Marca |
| 1.0 | 08/06/2026 | Release inicial com paleta, tipografia, componentes base |

---

**Desenvolvido com ❤️ por TM · Sempre Tecnologia**
