"use client";

import React from "react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  variant?: "danger" | "warning" | "info" | "success";
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  message,
  variant = "info",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  // Configuration mapping based on structural alert severity matrix tags
  const variantStyles = {
    danger: {
      border: "border-red-500/30",
      bg: "bg-red-500/10",
      text: "text-red-400",
      button: "bg-red-600 hover:bg-red-500 shadow-red-600/20",
    },
    warning: {
      border: "border-amber-500/30",
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      button: "bg-amber-600 hover:bg-amber-500 shadow-amber-600/20",
    },
    success: {
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      button: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20",
    },
    info: {
      border: "border-indigo-500/30",
      bg: "bg-indigo-500/10",
      text: "text-indigo-400",
      button: "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20",
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.info;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop blur interception layout */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onCancel}
      />

      {/* Main Structural Dialog Container Panel Element */}
      <div className={`relative w-full max-w-md transform overflow-hidden rounded-2xl border ${currentVariant.border} bg-slate-900/90 p-6 text-left align-middle shadow-2xl backdrop-blur-xl transition-all duration-300 z-10 scale-100`}>
        
        {/* Decorative ambient context background flare glow */}
        <div className={`absolute -top-12 -right-12 w-24 h-24 rounded-full blur-2xl opacity-20 ${currentVariant.bg}`} />

        {/* Heading Layer */}
        <div className="flex items-center gap-3 mb-3">
          <div className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase ${currentVariant.bg} ${currentVariant.text} border ${currentVariant.border}`}>
            {variant}
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            {title}
          </h3>
        </div>

        {/* Informational Message Content Window */}
        <div className="mb-6">
          <p className="text-sm text-slate-300 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Execution Control Action Tray Row */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition-all active:scale-95"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-lg transition-all active:scale-95 ${currentVariant.button}`}
          >
            {confirmLabel}
          </button>
        </div>

      </div>
    </div>
  );
};