"use client";

import { useEffect, useRef, useState } from "react";


export default function SuporteContent() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState("Bug/Erro");
  const [showModal, setShowModal] = useState(false);
  const descricaoRef = useRef<HTMLTextAreaElement>(null);

  // Preencher nome automaticamente do perfil localStorage
  useEffect(() => {
    try {
      const perfil = JSON.parse(localStorage.getItem("explan_perfil") || "{}");
      if (perfil && perfil.nome) {
        setNome(perfil.nome);
      }
    } catch (_) {
      /* ignora erros de parse */
    }
  }, []);

  // Inicializar ícones Lucide
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).lucide) {
      (window as any).lucide.createIcons();
    }
  }, [showModal]);

  function enviarWhatsApp() {
    if (!descricao.trim()) {
      alert("Por favor, preencha a descrição do problema ou sugestão.");
      descricaoRef.current?.focus();
      return;
    }

    const nomeEnvio = nome.trim() || "Usuário do Sistema";

    const msg = `*Aviso do Sistema Explan*\n\n*Tipo:* ${tipo}\n*De:* ${nomeEnvio}\n\n*Descrição:*\n${descricao}`;
    const telefone = "5562996046458";
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(msg)}`;

    setShowModal(true);
    window.open(url, "_blank");
  }

  function fecharModal() {
    setShowModal(false);
    setDescricao("");
  }

  return (
    <>
      <style jsx>{`
        .container {
          background: var(--white, #FFFFFF);
          max-width: 500px;
          width: 100%;
          margin: 0 auto;
          border-radius: 12px;
          box-shadow: 0 4px 24px rgba(65, 66, 47, 0.15);
          overflow: hidden;
        }

        .header {
          background: #41422F;
          padding: 32px 24px;
          text-align: center;
          color: #EBE6DD;
        }

        .header h1 {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .header p {
          font-size: 14px;
          color: rgba(235, 230, 221, 0.8);
          line-height: 1.5;
        }

        .form-body {
          padding: 32px 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #41422F;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .form-control {
          width: 100%;
          padding: 14px;
          border: 1.5px solid #CCD6DF;
          border-radius: 8px;
          font-family: "Archivo", sans-serif;
          font-size: 15px;
          color: #212121;
          background: #FAFAFA;
          transition: all 0.2s;
        }

        .form-control:focus {
          outline: none;
          border-color: #6B8E5E;
          background: #FFFFFF;
          box-shadow: 0 0 0 4px rgba(107, 142, 94, 0.1);
        }

        textarea.form-control {
          resize: vertical;
          min-height: 120px;
        }

        .radio-group {
          display: flex;
          gap: 16px;
        }

        .radio-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #212121;
          padding: 10px 16px;
          border: 1.5px solid #CCD6DF;
          border-radius: 8px;
          flex: 1;
          justify-content: center;
          transition: all 0.2s;
          user-select: none;
        }

        .radio-label input {
          display: none;
        }

        .radio-label:has(input:checked) {
          border-color: #41422F;
          background: rgba(65, 66, 47, 0.05);
        }

        .radio-label:has(input[value="Bug/Erro"]:checked) {
          border-color: #C0392B;
          background: rgba(192, 57, 43, 0.08);
        }

        .radio-label:has(input[value="Bug/Erro"]:checked) span {
          color: #C0392B;
        }

        .radio-label:has(input[value="Sugestão"]:checked) {
          border-color: #E6A817;
          background: rgba(230, 168, 23, 0.08);
        }

        .radio-label:has(input[value="Sugestão"]:checked) span {
          color: #E6A817;
        }

        .btn-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 16px;
          background: #25D366;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-family: "Archivo", sans-serif;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 16px rgba(37, 211, 102, 0.3);
          margin-top: 12px;
        }

        .btn-submit:hover {
          background: #1da851;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
        }

        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 20px;
          padding: 10px 20px;
          font-size: 13px;
          font-weight: 600;
          font-family: "Archivo", sans-serif;
          color: #41422F;
          text-decoration: none;
          border: 1.5px solid #CCD6DF;
          border-radius: 50px;
          transition: all 0.2s;
        }

        .btn-back:hover {
          border-color: #41422F;
          background: #EBE6DD;
        }

        /* Modal sucesso */
        .modal-overlay {
          display: flex;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: #fff;
          padding: 32px;
          border-radius: 16px;
          text-align: center;
          max-width: 320px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }

        .modal-icon {
          width: 64px;
          height: 64px;
          background: rgba(37, 211, 102, 0.15);
          color: #25D366;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          margin: 0 auto 16px;
        }

        .modal-content h3 {
          font-size: 18px;
          color: #212121;
          margin-bottom: 8px;
        }

        .modal-content p {
          font-size: 14px;
          color: #4A4A4A;
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .btn-close {
          padding: 10px 24px;
          background: #41422F;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-family: "Archivo", sans-serif;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
        }

        /* ── RESPONSIVO ── */
        @media (max-width: 600px) {
          .header {
            padding: 24px 16px;
          }
          .header h1 {
            font-size: 18px;
          }
          .form-body {
            padding: 24px 16px;
          }
          .btn-submit {
            font-size: 13px;
            padding: 12px 18px;
          }
        }

        @media (max-width: 400px) {
          .header h1 {
            font-size: 16px;
          }
          .form-control {
            font-size: 16px;
          }
        }
      `}</style>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "20px",
        }}
      >
        <div className="container">
          <div className="header">
            <h1>Relatar Bug ou Sugestão</h1>
            <p>
              Encontrou um erro no orçador ou tem uma ideia de melhoria? Envie
              direto para o desenvolvedor.
            </p>
          </div>

          <div className="form-body">
            <div className="form-group">
              <label>O que você deseja enviar?</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="tipo"
                    value="Bug/Erro"
                    checked={tipo === "Bug/Erro"}
                    onChange={(e) => setTipo(e.target.value)}
                  />
                  <span>
                    <i data-lucide="bug"></i> Erro (Bug)
                  </span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="tipo"
                    value="Sugestão"
                    checked={tipo === "Sugestão"}
                    onChange={(e) => setTipo(e.target.value)}
                  />
                  <span>
                    <i data-lucide="lightbulb"></i> Sugestão
                  </span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="nome">Seu Nome</label>
              <input
                type="text"
                id="nome"
                className="form-control"
                placeholder="Ex: João da Silva"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="descricao">Descrição</label>
              <textarea
                ref={descricaoRef}
                id="descricao"
                className="form-control"
                placeholder="Explique o que aconteceu ou a sua ideia de melhoria detalhadamente..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              ></textarea>
            </div>

            <button
              type="button"
              className="btn-submit"
              onClick={enviarWhatsApp}
            >
              <i data-lucide="send" style={{ width: 20, height: 20 }}></i>
              Enviar via WhatsApp
            </button>

            <a href="/painel" className="btn-back">
              <i
                data-lucide="arrow-left"
                style={{ width: 16, height: 16 }}
              ></i>{" "}
              Voltar ao Orçador
            </a>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon">✓</div>
            <h3>Quase lá!</h3>
            <p>
              O WhatsApp será aberto para você enviar a mensagem diretamente
              para o desenvolvedor.
            </p>
            <button className="btn-close" onClick={fecharModal}>
              Entendi, Voltar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
