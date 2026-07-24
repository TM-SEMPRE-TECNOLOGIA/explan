"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginContent() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { window.lucide?.createIcons(); }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const name = email.split("@")[0] || "Usuário";
    localStorage.setItem("explan_user", JSON.stringify({ nome: name, email }));
    setTimeout(() => router.push("/painel"), 600);
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo">
            <img src="/imagens-explan/logo-final.png" alt="Explan"
              style={{ maxHeight: 65, filter: "brightness(0) invert(1)" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
          <div className="auth-features">
            {[
              ["ruler", "Projetos personalizados com renderização 3D"],
              ["calculator", "Cálculo automático de materiais e descontos"],
              ["file-text", "Geração de PDF, contrato e apresentação"],
            ].map(([icon, text]) => (
              <div key={text} className="auth-feature">
                <i data-lucide={icon} style={{ width: 24, height: 24 }} />
                <span className="auth-feature-text">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <form onSubmit={handleLogin} className="auth-form-container">
          <h2 className="auth-form-title">Entrar</h2>
          <p className="auth-form-subtitle">Acesse sua conta para continuar</p>

          <div className="form-group">
            <label>E-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required />
          </div>
          <div className="form-group">
            <label>Senha</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <span className="loading show" /> : "Entrar"}
          </button>
          <div className="auth-links">
            <a href="/ajuda">Esqueci a senha</a>
            <a href="/suporte">Precisa de ajuda?</a>
          </div>
        </form>
      </div>

      <style jsx>{`
        .auth-container { width: 100%; height: 100vh; display: grid; grid-template-columns: 1fr 1fr; }
        .auth-left {
          background: linear-gradient(135deg, var(--olive) 0%, #2d2e20 100%);
          padding: 60px 40px; display: flex; flex-direction: column;
          justify-content: center; align-items: center; color: var(--cream);
          position: relative; overflow: hidden;
        }
        .auth-left-content { position: relative; z-index: 1; text-align: center; max-width: 420px; }
        .auth-features { text-align: left; margin-top: 48px; padding-top: 40px; border-top: 1px solid rgba(235,230,221,0.2); }
        .auth-feature { display: flex; gap: 16px; margin-bottom: 24px; font-size: 16px; align-items: flex-start; }
        .auth-feature-text { color: rgba(235,230,221,0.9); line-height: 1.5; }
        .auth-right { background: var(--cream); padding: 60px 40px; display: flex; flex-direction: column; justify-content: center; align-items: center; }
        .auth-form-container { width: 100%; max-width: 380px; }
        .auth-form-title { font-size: 28px; font-weight: 600; color: var(--text); margin-bottom: 8px; }
        .auth-form-subtitle { font-size: 14px; color: var(--text-muted); margin-bottom: 32px; }
        .form-group { margin-bottom: 20px; }
        label { display: block; font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 8px; }
        input { width: 100%; padding: 12px 16px; border: 2px solid var(--border); border-radius: 8px; font-family: 'Archivo', sans-serif; font-size: 13px; color: var(--text); background: var(--white); outline: none; transition: all 0.2s; }
        input:focus { border-color: var(--green); box-shadow: 0 0 0 3px rgba(107,142,94,0.15); }
        .btn { width: 100%; padding: 14px 24px; border: none; border-radius: 50px; font-family: 'Archivo', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.06em; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-primary { background: var(--olive); color: var(--cream); }
        .btn-primary:hover { background: var(--green); }
        .auth-links { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; font-size: 12px; }
        .auth-links a { color: var(--green); text-decoration: none; font-weight: 600; }
        .auth-links a:hover { color: var(--olive); }
        .loading { display: none; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
        .loading.show { display: inline-block; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 700px) { .auth-container { grid-template-columns: 1fr; } .auth-left { display: none; } }
      `}</style>
    </div>
  );
}
