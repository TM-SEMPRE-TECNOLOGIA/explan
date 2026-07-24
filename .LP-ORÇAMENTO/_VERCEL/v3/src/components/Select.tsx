"use client";

import { useState, useEffect, useRef } from "react";

type SelectProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
};

export default function Select({
  options,
  value,
  onChange,
  label,
  placeholder = "Selecione...",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayText = value || placeholder;

  return (
    <div className="custom-select-wrapper" ref={ref}>
      {label && <label>{label}</label>}
      <button
        type="button"
        className={`custom-select-trigger ${open ? "open" : ""}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={`custom-select-value ${!value ? "placeholder" : ""}`}>
          {displayText}
        </span>
        <svg
          className={`custom-select-arrow ${open ? "open" : ""}`}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <ul className="custom-select-dropdown">
          {options.length === 0 && (
            <li className="custom-select-empty">Nenhuma opção</li>
          )}
          {options.map((opt) => (
            <li
              key={opt}
              className={`custom-select-option ${
                value === opt ? "selected" : ""
              }`}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}

      <style jsx>{`
        .custom-select-wrapper {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .custom-select-wrapper label {
          font-size: 10px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }
        .custom-select-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          width: 100%;
          padding: 10px 12px;
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 7px;
          font-family: "Archivo", sans-serif;
          font-size: 13px;
          color: var(--text);
          cursor: pointer;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          text-align: left;
        }
        .custom-select-trigger:hover {
          border-color: var(--olive);
        }
        .custom-select-trigger.open {
          border-color: var(--green);
          box-shadow: 0 0 0 3px rgba(107, 142, 94, 0.15);
        }
        .custom-select-value {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .custom-select-value.placeholder {
          color: var(--text-muted);
        }
        .custom-select-arrow {
          flex-shrink: 0;
          color: var(--text-muted);
          transition: transform 0.2s;
        }
        .custom-select-arrow.open {
          transform: rotate(180deg);
        }
        .custom-select-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          z-index: 300;
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 7px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
          padding: 4px;
          max-height: 240px;
          overflow-y: auto;
          list-style: none;
          margin: 0;
        }
        .custom-select-option {
          padding: 8px 12px;
          border-radius: 5px;
          font-family: "Archivo", sans-serif;
          font-size: 13px;
          color: var(--text);
          cursor: pointer;
          transition: background 0.15s;
        }
        .custom-select-option:hover {
          background: var(--cream-alt);
          border-color: var(--olive);
        }
        .custom-select-option.selected {
          background: #eff3ec;
          font-weight: 600;
        }
        .custom-select-empty {
          padding: 8px 12px;
          font-size: 12px;
          color: var(--text-muted);
          text-align: center;
        }
      `}</style>
    </div>
  );
}
