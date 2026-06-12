"use client";

import { useEffect } from "react";

export interface ToastMessage {
  id: string;
  text: string;
  type: "success" | "error" | "info";
}

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

export const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Automatically dismount toast notice after 4 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  const typeStyles = {
    success: {
      border: "border-emerald-500/30",
      bg: "bg-emerald-950/40",
      text: "text-emerald-400",
      icon: "✨",
      glow: "shadow-[0_0_20px_rgba(16,185,129,0.15)]",
    },
    error: {
      border: "border-red-500/30",
      bg: "bg-red-950/40",
      text: "text-red-400",
      icon: "❌",
      glow: "shadow-[0_0_20px_rgba(239,68,68,0.15)]",
    },
    info: {
      border: "border-purple-500/30",
      bg: "bg-purple-950/40",
      text: "text-purple-400",
      icon: "🔔",
      glow: "shadow-[0_0_20px_rgba(168,85,247,0.15)]",
    },
  }[type];

  return (
    <div
      className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl backdrop-blur-xl border text-sm font-medium transform transition-all duration-300 animate-[slideInRight_0.25s_ease-out] ${typeStyles.border} ${typeStyles.bg} ${typeStyles.text} ${typeStyles.glow}`}
    >
      <span>{typeStyles.icon}</span>
      <p className="tracking-wide">{message}</p>
      <button
        onClick={onClose}
        className="ml-4 opacity-50 hover:opacity-100 transition-opacity text-xs"
      >
        ✕
      </button>
    </div>
  );
};