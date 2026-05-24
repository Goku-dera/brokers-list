"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

type PasswordInputProps = {
  id: string;
  placeholder?: string;
  registration: UseFormRegisterReturn;
  error?: string;
  showIcon?: boolean;
};

export default function PasswordInput({
  id,
  placeholder = "••••••••",
  registration,
  error,
  showIcon = true,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <div className="relative">
        {showIcon && (
          <Lock
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          />
        )}
        <input
          id={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          className={`w-full bg-[#0d1528] border border-blue-500/30 rounded-lg py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
            showIcon ? "pl-10 pr-11" : "px-4 pr-11"
          }`}
          {...registration}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
    </div>
  );
}
