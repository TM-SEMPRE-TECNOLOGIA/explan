"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useOrcamento } from "@/lib/store";
import type { Ambiente } from "@/lib/tipos";

// ── TIPOS ──
interface SlideImage {
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
  naturalW?: number;
  naturalH?: number;
}

interface SlideData {
  id: string;
  type: "cover" | "env" | "extra" | "blank";
  ambientIndex?: number;
  ambientName: string;
  images: SlideImage[];
  coverBg?: string;
}

interface DragState {
  img: HTMLImageElement;
  zone: HTMLElement;
  ox: number;
  oy: number;
}

interface ResizeState {
  img: HTMLImageElement;
  zone: HTMLElement;
  dir: string;
  startX: number;
  startY: number;
  startL: number;
  startT: number;
  startW: number;
  startH: number;
}

// ── HELPERS ──
const SLIDE_W = 1123;
const SLIDE_H = 794;
const IMG_MIN = 80;

function generateId() {
  return "s-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);
}

// ── FOTOS padrão para apresentação ──
const FOTOS_APRESENTACAO: Record<string, string> = {
  cozinha: "/imagens-apresenta/pdf-cozinha.png",
  sala: "/imagens-apresenta/pdf-sala-estar.png",
  quarto: "/imagens-apresenta/pdf-dormitorio-master.png",
  "dormitório": "/imagens-apresenta/pdf-dormitorio-master.png",
  closet: "/imagens-apresenta/pdf-closet.png",
  "escritório": "/imagens-apresenta/pdf-home-office.png",
  "home office": "/imagens-apresenta/pdf-home-office.png",
  banheiro: "/imagens-apresenta/pdf-banheiro.png",
  lavanderia: "/imagens-apresenta/pdf-lavanderia.png",
  gourmet: "/imagens-apresenta/pdf-area-gourmet.png",
  jantar: "/imagens-apresenta/pdf-sala-jantar.png",
  casal: "/imagens-apresenta/pdf-dormitorio-casal.png",
  filho: "/imagens-apresenta/pdf-dormitorio-filho.png",
  lavabo: "/imagens-apresenta/pdf-lavabo-alt.png",
  despensa: "/imagens-apresenta/pdf-despensa-alt.png",
  corredor: "/imagens-apresenta/pdf-corredor-alt.png",
  "suite master": "/imagens-apresenta/pdf-suite-master-alt.png",
  "suíte master": "/imagens-apresenta/pdf-suite-master-alt.png",
  "suíte": "/imagens-apresenta/pdf-suite-master-alt.png",
  "suite": "/imagens-apresenta/pdf-suite-master-alt.png",
};

function fotoApresentacaoParaAmbiente(nome: string): string {
  const n = nome.toLowerCase();
  for (const [key, url] of Object.entries(FOTOS_APRESENTACAO)) {
    if (n.includes(key)) return url;
  }
  return "/imagens-apresenta/pdf-ambiente-variacao.png";
}

function buildInitialSlides(ambientes: Ambiente[], clienteNome: string): SlideData[] {
  const slides: SlideData[] = [];

  // Capa
  slides.push({
    id: "slide-capa",
    type: "cover",
    ambientName: clienteNome || "Cliente",
    images: [],
  });

  // Um slide por ambiente com foto padrão
  ambientes.forEach((amb, idx) => {
    const fotoSrc = fotoApresentacaoParaAmbiente(amb.nome);
    slides.push({
      id: `slide-amb-${amb.id}`,
      type: "env",
      ambientIndex: idx,
      ambientName: amb.nome || `Ambiente ${idx + 1}`,
      images: [
        { src: fotoSrc, x: 0, y: 0, w: 1123, h: 794 },
      ],
    });
  });

  return slides;
}

// ── COMPONENTE ──

export default function ApresentacaoContent() {
  const { cliente, ambientes } = useOrcamento();
  const dataOrcamento = new Date().toLocaleDateString("pt-BR");

  const [slides, setSlides] = useState<SlideData[]>(() =>
    buildInitialSlides(ambientes, cliente.nome)
  );

  // Rebuild when ambientes change (but preserve extras/blanks and image state)
  const prevAmbientesLen = useRef(ambientes.length);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => {
    if (ambientes.length !== prevAmbientesLen.current) {
      prevAmbientesLen.current = ambientes.length;
      setSlides((prev) => {
        // Keep cover, extras, blanks. Rebuild env slides.
        const cover = prev.find((s) => s.type === "cover");
        const extras = prev.filter((s) => s.type === "extra" || s.type === "blank");
        const envs: SlideData[] = ambientes.map((amb, idx) => {
          const fotoSrc = fotoApresentacaoParaAmbiente(amb.nome);
          return {
            id: `slide-amb-${amb.id}`,
            type: "env" as const,
            ambientIndex: idx,
            ambientName: amb.nome || `Ambiente ${idx + 1}`,
            images: [
              { src: fotoSrc, x: 0, y: 0, w: 1123, h: 794 },
            ],
          };
        });
        const result: SlideData[] = [];
        if (cover) result.push(cover);
        result.push(...envs, ...extras);
        return result;
      });
    }
  }, [ambientes]);

  // ── DRAG / RESIZE refs ──
  const dragRef = useRef<DragState | null>(null);
  const resizeRef = useRef<ResizeState | null>(null);

  const positionHandle = useCallback(
    (h: HTMLDivElement, img: HTMLImageElement) => {
      const dir = h.dataset.dir!;
      const l = img.offsetLeft,
        t = img.offsetTop,
        w = img.offsetWidth,
        hh = img.offsetHeight;
      if (dir === "nw") { h.style.left = l - 7 + "px"; h.style.top = t - 7 + "px"; }
      if (dir === "ne") { h.style.left = l + w - 7 + "px"; h.style.top = t - 7 + "px"; }
      if (dir === "sw") { h.style.left = l - 7 + "px"; h.style.top = t + hh - 7 + "px"; }
      if (dir === "se") { h.style.left = l + w - 7 + "px"; h.style.top = t + hh - 7 + "px"; }
    },
    []
  );

  const positionAllHandles = useCallback(
    (zone: HTMLElement, img: HTMLImageElement) => {
      zone.querySelectorAll<HTMLDivElement>(".resize-handle").forEach((h) =>
        positionHandle(h, img)
      );
    },
    [positionHandle]
  );

  const moveDrag = useCallback(
    (cx: number, cy: number) => {
      const d = dragRef.current;
      if (!d) return;
      const { img, zone, ox, oy } = d;
      const zw = zone.offsetWidth,
        zh = zone.offsetHeight;
      let nl = cx - ox,
        nt = cy - oy;
      nl = Math.max(-img.offsetWidth * 0.5, Math.min(nl, zw - img.offsetWidth * 0.5));
      nt = Math.max(-img.offsetHeight * 0.5, Math.min(nt, zh - img.offsetHeight * 0.5));
      img.style.left = nl + "px";
      img.style.top = nt + "px";
      positionAllHandles(zone, img);
    },
    [positionAllHandles]
  );

  const doResize = useCallback(
    (cx: number, cy: number) => {
      const r = resizeRef.current;
      if (!r) return;
      const { img, zone, dir, startX, startY, startL, startT, startW, startH } = r;
      const dx = cx - startX,
        dy = cy - startY;
      let nl = startL,
        nt = startT,
        nw = startW,
        nh = startH;

      if (dir === "se") { nw = Math.max(IMG_MIN, startW + dx); nh = Math.max(IMG_MIN, startH + dy); }
      if (dir === "sw") { nw = Math.max(IMG_MIN, startW - dx); nl = startL + startW - nw; nh = Math.max(IMG_MIN, startH + dy); }
      if (dir === "ne") { nw = Math.max(IMG_MIN, startW + dx); nt = startT + startH - Math.max(IMG_MIN, startH - dy); nh = Math.max(IMG_MIN, startH - dy); }
      if (dir === "nw") { nw = Math.max(IMG_MIN, startW - dx); nl = startL + startW - nw; nt = startT + startH - Math.max(IMG_MIN, startH - dy); nh = Math.max(IMG_MIN, startH - dy); }

      img.style.left = nl + "px";
      img.style.top = nt + "px";
      img.style.width = nw + "px";
      img.style.height = nh + "px";
      positionAllHandles(zone, img);
    },
    [positionAllHandles]
  );

  // Global mouse/touch listeners
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (dragRef.current) moveDrag(e.clientX, e.clientY);
      if (resizeRef.current) doResize(e.clientX, e.clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (dragRef.current) moveDrag(t.clientX, t.clientY);
      if (resizeRef.current) doResize(t.clientX, t.clientY);
    };
    const onUp = () => {
      dragRef.current = null;
      resizeRef.current = null;
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchend", onUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchend", onUp);
    };
  }, [moveDrag, doResize]);

  // ── IMAGE HELPERS ──
  const defaultImagePosition = useCallback(
    (
      zone: HTMLElement,
      naturalW: number,
      naturalH: number
    ): { x: number; y: number; w: number; h: number } => {
      const zw = zone.offsetWidth || 1050;
      const zh = zone.offsetHeight || 680;
      const iw = zw * 0.8;
      const ih = iw * (naturalH / naturalW);
      return {
        x: (zw - iw) / 2,
        y: Math.max(0, (zh - ih) / 2),
        w: iw,
        h: ih,
      };
    },
    []
  );

  const applyImageToZone = useCallback(
    (
      zone: HTMLElement,
      src: string,
      naturalW?: number,
      naturalH?: number,
      existingImg?: HTMLImageElement | null
    ) => {
      const img = existingImg || zone.querySelector<HTMLImageElement>("img.slide-photo");
      if (img) {
        img.src = src;
        if (naturalW && naturalH) {
          img.onload = () => {
            const pos = defaultImagePosition(zone, naturalW, naturalH);
            img.style.left = pos.x + "px";
            img.style.top = pos.y + "px";
            img.style.width = pos.w + "px";
            img.style.height = pos.h + "px";
            positionAllHandles(zone, img);
          };
        } else {
          positionAllHandles(zone, img);
        }
        return;
      }
      // Create new image
      const newImg = document.createElement("img");
      newImg.className = "slide-photo";
      newImg.src = src;
      newImg.alt = "";
      newImg.onload = () => {
        const nw = naturalW || newImg.naturalWidth;
        const nh = naturalH || newImg.naturalHeight;
        const pos = defaultImagePosition(zone, nw, nh);
        newImg.style.left = pos.x + "px";
        newImg.style.top = pos.y + "px";
        newImg.style.width = pos.w + "px";
        newImg.style.height = pos.h + "px";
        positionAllHandles(zone, newImg);
      };
      newImg.style.cssText = `position:absolute;cursor:move;user-select:none;touch-action:none;`;

      zone.appendChild(newImg);

      // Attach resize handles
      const corners = ["nw", "ne", "sw", "se"];
      corners.forEach((dir) => {
        const h = document.createElement("div");
        h.className = "resize-handle " + dir;
        h.dataset.dir = dir;
        zone.appendChild(h);
        positionHandle(h, newImg);

        h.addEventListener("mousedown", (e) => {
          e.preventDefault();
          e.stopPropagation();
          resizeRef.current = {
            img: newImg, zone, dir,
            startX: e.clientX, startY: e.clientY,
            startL: newImg.offsetLeft, startT: newImg.offsetTop,
            startW: newImg.offsetWidth, startH: newImg.offsetHeight,
          };
        });
        h.addEventListener("touchstart", (e) => {
          e.stopPropagation();
          const t = e.touches[0];
          resizeRef.current = {
            img: newImg, zone, dir,
            startX: t.clientX, startY: t.clientY,
            startL: newImg.offsetLeft, startT: newImg.offsetTop,
            startW: newImg.offsetWidth, startH: newImg.offsetHeight,
          };
        }, { passive: true });
      });

      // Drag listeners on image
      newImg.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        dragRef.current = {
          img: newImg, zone,
          ox: e.clientX - newImg.offsetLeft,
          oy: e.clientY - newImg.offsetTop,
        };
      });
      newImg.addEventListener("touchstart", (e) => {
        const t = e.touches[0];
        dragRef.current = {
          img: newImg, zone,
          ox: t.clientX - newImg.offsetLeft,
          oy: t.clientY - newImg.offsetTop,
        };
      }, { passive: true });
    },
    [defaultImagePosition, positionHandle, positionAllHandles]
  );

  const handleFileToZone = useCallback(
    (file: File, zone: HTMLElement) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new window.Image();
        img.onload = () => {
          applyImageToZone(zone, reader.result as string, img.naturalWidth, img.naturalHeight);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    },
    [applyImageToZone]
  );

  // ── COVER BG ──
  const handleCoverBg = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        setSlides((prev) =>
          prev.map((s) => (s.id === "slide-capa" ? { ...s, coverBg: src } : s))
        );
      };
      reader.readAsDataURL(file);
    },
    []
  );

  // ── ADD EXTRA SLIDE ──
  const addExtraSlide = useCallback((ambIdx: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      const nomeAmb = ambientes[ambIdx]?.nome || `Ambiente ${ambIdx + 1}`;
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        const slideId = generateId();
        setSlides((prev) => {
          const envSlideId = `slide-amb-${ambientes[ambIdx]?.id}`;
          const idx = prev.findIndex((s) => s.id === envSlideId);
          const newSlide: SlideData = {
            id: slideId,
            type: "extra",
            ambientName: nomeAmb,
            images: [],
          };
          const copy = [...prev];
          copy.splice(idx + 1, 0, newSlide);
          // We'll apply the image via ref callback after render
          return copy;
        });
        // Store the src to apply after render
        setTimeout(() => {
          const zone = document.getElementById(`zone-extra-${slideId}`);
          if (zone) {
            applyImageToZone(zone, src);
          }
        }, 50);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }, [ambientes, applyImageToZone]);

  const addBlankSlide = useCallback(() => {
    const id = generateId();
    setSlides((prev) => [
      ...prev,
      { id, type: "blank", ambientName: "Slide em branco", images: [] },
    ]);
  }, []);

  const removeSlide = useCallback((slideId: string) => {
    setSlides((prev) => prev.filter((s) => s.id !== slideId));
  }, []);

  // ── ZONE REF CALLBACKS ──
  // We use a ref map so env slides can have their zones tracked
  const zoneRefs = useRef<Map<string, HTMLElement>>(new Map());

  const registerZone = useCallback((id: string, el: HTMLElement | null) => {
    if (el) {
      zoneRefs.current.set(id, el);
    } else {
      zoneRefs.current.delete(id);
    }
  }, []);

  // ── HANDLE ENV IMAGE UPLOAD ──
  const handleEnvFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, slide: SlideData) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;
      files.forEach((file, fi) => {
        const reader = new FileReader();
        const zoneId =
          slide.type === "env"
            ? `zone-amb-${slide.ambientIndex}`
            : `zone-${slide.id}`;
        const nomeAmb = slide.ambientName;

        reader.onload = (ev) => {
          const src = ev.target?.result as string;
          if (fi === 0) {
            const zone = document.getElementById(zoneId);
            if (zone) {
              applyImageToZone(zone, src);
            }
          } else {
            // Multiple files → create extra slides
            const newId = generateId();
            setSlides((prev) => {
              const idx = prev.findIndex((s) => s.id === slide.id);
              const newSlide: SlideData = {
                id: newId,
                type: "extra",
                ambientName: nomeAmb,
                images: [],
              };
              const copy = [...prev];
              copy.splice(idx + 1, 0, newSlide);
              return copy;
            });
            setTimeout(() => {
              const zone = document.getElementById(`zone-extra-${newId}`);
              if (zone) {
                applyImageToZone(zone, src);
              }
            }, 50);
          }
        };
        reader.readAsDataURL(file);
      });
      e.target.value = "";
    },
    [ambientes, applyImageToZone, setSlides]
  );

  // ── APPLY IMAGES FROM SLIDE DATA (auto-load padrão) ──
  useEffect(() => {
    slides.forEach((slide) => {
      if (slide.images.length > 0) {
        const zoneId = slide.type === "env"
          ? `zone-amb-${slide.ambientIndex}`
          : `zone-${slide.id}`;
        // Aguarda o DOM renderizar
        const timer = setTimeout(() => {
          const zone = document.getElementById(zoneId);
          if (zone && !zone.querySelector("img.slide-photo")) {
            applyImageToZone(zone, slide.images[0].src, slide.images[0].naturalW, slide.images[0].naturalH);
          }
        }, 100);
        timersRef.current.push(timer);
      }
    });
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [slides, applyImageToZone]);

  // ── RENDER ──
  if (!ambientes.length) {
    return (
      <div className="apresentacao-page">
        <div className="toolbar">
          <div className="toolbar-left">
            <img
              className="toolbar-logo"
              src="/imagens-explan/Explan.png"
              alt="Explan"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <span className="toolbar-title">Editor de Apresentação</span>
          </div>
          <div className="toolbar-right">
            <a href="/painel" className="btn btn-white">
              ← Voltar ao Painel
            </a>
          </div>
        </div>
        <div className="editor-area">
          <div className="empty-editor">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <p>
              Nenhum orçamento encontrado.
              <br />
              Gere uma apresentação a partir do orçamento.
            </p>
          </div>
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  }

  return (
    <div className="apresentacao-page">
      {/* ── TOOLBAR ── */}
      <div className="toolbar">
        <div className="toolbar-left">
          <img
            className="toolbar-logo"
            src="/imagens-explan/Group.png"
            alt="Explan"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <span className="toolbar-title">Editor de Apresentação</span>
        </div>
        <div className="toolbar-right">
          <button className="btn btn-light" onClick={addBlankSlide}>
            + Slide Vazio
          </button>
          <button className="btn btn-green" onClick={() => window.print()}>
            Imprimir / Exportar
          </button>
          <a href="/painel" className="btn btn-white">
            ← Voltar ao Painel
          </a>
        </div>
      </div>

      {/* ── EDITOR AREA ── */}
      <div className="editor-area" id="editor-area">
        {slides.map((slide, slideIdx) => {
          if (slide.type === "cover") {
            return (
              <div key={slide.id} className="slide-wrapper">
                <div className="slide-label">Capa</div>
                <div className="slide-cover" id="slide-capa">
                  <input
                    type="file"
                    className="photo-file-input"
                    id="capa-file"
                    accept="image/*"
                    onChange={handleCoverBg}
                  />
                  {slide.coverBg ? (
                    <img
                      className="slide-cover-bg"
                      id="capa-bg"
                      src={slide.coverBg}
                      alt=""
                    />
                  ) : null}
                  <div className="slide-cover-content">
                    <img
                      className="slide-cover-logo"
                      src="/imagens-explan/Explan.png"
                      alt="Explan"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <div className="slide-cover-title">Apresentação de Projeto</div>
                    <div className="slide-cover-client">
                      {cliente.nome || "Cliente"}
                    </div>
                    <div className="slide-cover-sep" />
                    <div className="slide-cover-date">{dataOrcamento}</div>
                  </div>
                </div>
                <div className="slide-actions">
                  <button
                    className="slide-action-btn"
                    onClick={() => document.getElementById("capa-file")?.click()}
                  >
                    Adicionar foto de fundo
                  </button>
                </div>
              </div>
            );
          }

          // Env / Extra / Blank slides
          const zoneId =
            slide.type === "env"
              ? `zone-amb-${slide.ambientIndex}`
              : `zone-${slide.id}`;
          const fileId =
            slide.type === "env"
              ? `file-amb-${ambientes[slide.ambientIndex!]?.id}`
              : `file-${slide.id}`;

          const isExtra = slide.type === "extra" || slide.type === "blank";
          const label = isExtra
            ? slide.type === "extra"
              ? `${slide.ambientName} (extra)`
              : "Slide em branco"
            : slide.ambientName;

          return (
            <div key={slide.id} className="slide-wrapper">
              <div className="slide-label">{label}</div>
              <div className="slide-actions">
                {slide.type === "env" && (
                  <button
                    className="slide-action-btn"
                    onClick={() => addExtraSlide(slide.ambientIndex!)}
                  >
                    + Slide extra
                  </button>
                )}
                <button
                  className="slide-action-btn"
                  onClick={() => document.getElementById(fileId)?.click()}
                >
                  {slide.type === "env" ? "Trocar imagem" : isExtra ? "Trocar imagem" : "Adicionar"}
                </button>
                {isExtra && (
                  <button
                    className="slide-action-btn"
                    style={{ color: "#ff8080" }}
                    onClick={() => removeSlide(slide.id)}
                  >
                    Remover slide
                  </button>
                )}
              </div>
              <div className="slide" id={slide.id}>
                <div className="slide-img-zone" id={zoneId} ref={(el) => {
                  if (slide.type !== "env") {
                    registerZone(`zone-${slide.id}`, el);
                  }
                }}>
                  <input
                    type="file"
                    className="photo-file-input"
                    id={fileId}
                    accept="image/*"
                    multiple
                    onChange={(e) => handleEnvFile(e, slide)}
                  />
                  <div
                    className="slide-img-placeholder"
                    id={`placeholder-${slide.id}`}
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 12,
                      color: "#797979",
                      cursor: "pointer",
                    }}
                    onClick={() => document.getElementById(fileId)?.click()}
                  >
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>
                      Clique para adicionar foto
                    </p>
                  </div>
                  <div className="slide-img-overlay" />
                  <div className="add-photo-hint">Clique para adicionar foto</div>
                </div>
                <div className="slide-caption">
                  <span className="slide-caption-nome">
                    {slide.type === "blank" ? (
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        style={{
                          outline: "none",
                          borderBottom: "1px solid rgba(255,255,255,.3)",
                          minWidth: 100,
                        }}
                      >
                        Clique para editar
                      </span>
                    ) : (
                      slide.ambientName
                    )}
                  </span>
                  <span className="slide-caption-brand">
                    Explan Móveis Planejados
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{styles}</style>
    </div>
  );
}

// ── ESTILOS ──
const styles = `
  /* ── PAGE WRAPPER ── */
  .apresentacao-page { background: #2D2D2D; min-height: 100vh; }

  /* ── TOOLBAR ── */
  .toolbar {
    background: var(--olive);
    padding: 14px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 50;
  }
  .toolbar-left { display: flex; align-items: center; gap: 16px; }
  .toolbar-logo { height: 28px; filter: brightness(0) invert(1); }
  .toolbar-title { color: var(--cream); font-size: 15px; font-weight: 500; letter-spacing: .04em; }
  .toolbar-right { display: flex; gap: 10px; align-items: center; }

  .btn {
    display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px;
    border-radius: 50px; font-family: 'Archivo', sans-serif; font-size: 13px;
    font-weight: 600; cursor: pointer; border: none; transition: all .2s;
    text-decoration: none;
  }
  .btn-light {
    background: rgba(255,255,255,.15); color: var(--cream);
    border: 1px solid rgba(255,255,255,.2);
  }
  .btn-light:hover { background: rgba(255,255,255,.25); }
  .btn-green { background: var(--green); color: #fff; }
  .btn-green:hover { background: var(--green-dark); }
  .btn-white {
    background: var(--white); color: var(--olive);
  }
  .btn-white:hover { background: var(--cream); }

  /* ── EDITOR AREA ── */
  .editor-area {
    padding: 40px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    min-height: calc(100vh - 60px);
  }

  /* ── SLIDE WRAPPER ── */
  .slide-wrapper { position: relative; width: 1123px; }
  .slide-label {
    color: rgba(255,255,255,.4);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .06em;
    text-transform: uppercase;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .slide-actions { display: flex; gap: 8px; justify-content: flex-end; margin-bottom: 8px; }
  .slide-action-btn {
    background: rgba(255,255,255,.1);
    border: 1px solid rgba(255,255,255,.15);
    color: rgba(255,255,255,.6);
    font-size: 11px;
    padding: 5px 10px;
    border-radius: 6px;
    cursor: pointer;
    font-family: 'Archivo', sans-serif;
    transition: all .15s;
  }
  .slide-action-btn:hover { background: rgba(255,255,255,.2); color: rgba(255,255,255,.9); }

  .slide {
    width: 1123px;
    height: 794px;
    background: var(--white);
    border-radius: 4px;
    box-shadow: 0 8px 40px rgba(0,0,0,.4);
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  /* ── IMAGE ZONE ── */
  .slide-img-zone {
    flex: 1;
    position: relative;
    background: var(--cream);
    overflow: hidden;
  }
  .slide-img-zone img {
    position: absolute;
    cursor: move;
    user-select: none;
    touch-action: none;
  }

  /* ── RESIZE HANDLES ── */
  .resize-handle {
    position: absolute;
    width: 14px;
    height: 14px;
    background: var(--green);
    border: 2px solid #fff;
    border-radius: 3px;
    z-index: 10;
    touch-action: none;
  }
  .resize-handle.nw { top: -7px; left: -7px; cursor: nw-resize; }
  .resize-handle.ne { top: -7px; right: -7px; cursor: ne-resize; }
  .resize-handle.sw { bottom: -7px; left: -7px; cursor: sw-resize; }
  .resize-handle.se { bottom: -7px; right: -7px; cursor: se-resize; }

  .slide-img-overlay {
    position: absolute;
    inset: 0;
    background: rgba(65,66,47,.0);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background .2s;
    pointer-events: none;
  }
  .slide-img-zone:hover .slide-img-overlay { background: rgba(65,66,47,.35); }

  .slide-img-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: var(--text-muted);
    width: 100%;
    height: 100%;
  }
  .slide-img-placeholder svg { opacity: .4; }
  .slide-img-placeholder p { font-size: 14px; font-weight: 500; }

  .add-photo-hint {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(235,230,221,.9);
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    pointer-events: none;
    opacity: 0;
    transition: opacity .2s;
  }
  .slide-img-zone:hover .add-photo-hint { opacity: 1; }

  .photo-file-input { display: none; }

  /* ── CAPTION ── */
  .slide-caption {
    background: var(--olive);
    padding: 28px 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .slide-caption-nome {
    color: var(--cream);
    font-size: 22px;
    font-weight: 300;
    letter-spacing: .12em;
    text-transform: uppercase;
  }
  .slide-caption-brand {
    color: rgba(235,230,221,.5);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .1em;
    text-transform: uppercase;
  }

  /* ── COVER SLIDE ── */
  .slide-cover {
    width: 1123px;
    height: 794px;
    background: var(--olive);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    border-radius: 4px;
    box-shadow: 0 8px 40px rgba(0,0,0,.4);
    position: relative;
    overflow: hidden;
  }
  .slide-cover-bg {
    position: absolute;
    inset: 0;
    object-fit: cover;
    opacity: .55;
    width: 100%;
    height: 100%;
  }
  .slide-cover::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(160deg, rgba(65,66,47,.58) 0%, rgba(20,21,14,.75) 100%);
    z-index: 1;
  }
  .slide-cover-content {
    position: relative;
    z-index: 2;
    text-align: center;
    color: var(--cream);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .slide-cover-logo { height: 60px; filter: brightness(0) invert(1); margin-bottom: 24px; display: block; }
  .slide-cover-title {
    font-size: 36px;
    font-weight: 300;
    letter-spacing: .12em;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .slide-cover-client {
    font-size: 20px;
    font-weight: 600;
    color: rgba(235,230,221,.8);
    margin-bottom: 32px;
  }
  .slide-cover-sep {
    width: 60px;
    height: 2px;
    background: var(--green);
    margin: 0 auto 24px;
  }
  .slide-cover-date {
    font-size: 13px;
    color: rgba(235,230,221,.5);
    letter-spacing: .06em;
  }

  /* ── EMPTY / LOADING ── */
  .empty-editor {
    color: rgba(255,255,255,.4);
    text-align: center;
    padding: 80px 20px;
    font-size: 16px;
  }
  .empty-editor svg { opacity: .2; margin-bottom: 16px; }

  /* ── PRINT ── */
  @page { size: A4 landscape; margin: 0; }

  @media print {
    body { background: white; margin: 0; padding: 0; }
    .apresentacao-page { background: white; min-height: auto; }
    .toolbar, .slide-actions, .slide-label, .add-photo-hint, .slide-img-overlay,
    .resize-handle, input[id^="file-"], .empty-editor, .photo-file-input,
    .slide-img-placeholder { display: none !important; }

    .editor-area { 
      padding: 0 !important; 
      margin: 0 !important;
      gap: 0 !important; 
      background: white; 
      display: block !important; 
      min-height: auto !important;
    }

    .slide-wrapper { 
      page-break-after: always; 
      page-break-inside: avoid;
      width: 297mm; 
      height: 210mm;
      margin: 0; 
      padding: 0;
      position: relative;
      overflow: hidden;
    }

    .slide, .slide-cover {
      width: 297mm !important; 
      height: 210mm !important;
      box-shadow: none !important; 
      border-radius: 0 !important;
      margin: 0 !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
`;
