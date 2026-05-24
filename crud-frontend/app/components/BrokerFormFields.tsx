"use client";

import { Globe, ImageIcon } from "lucide-react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

export type BrokerFormValues = {
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  website?: string;
  broker_type: "cfd" | "bond" | "stock" | "crypto" | "";
};

const BROKER_TYPES = [
  { value: "cfd" as const, label: "CFD" },
  { value: "bond" as const, label: "Bond" },
  { value: "stock" as const, label: "Stock" },
  { value: "crypto" as const, label: "Crypto" },
];

export const formLabelClass =
  "block text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-2";
export const formInputClass =
  "w-full bg-[#0d1528] border border-blue-500/30 rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50";

type BrokerFormFieldsProps = {
  register: UseFormRegister<BrokerFormValues>;
  errors: FieldErrors<BrokerFormValues>;
  onNameChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function BrokerFormFields({
  register,
  errors,
  onNameChange,
}: BrokerFormFieldsProps) {
  const nameField = register("name", { required: "Broker name is required" });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={formLabelClass}>Broker Name *</label>
          <input
            type="text"
            placeholder="e.g. Blackwood Capital"
            className={formInputClass}
            name={nameField.name}
            ref={nameField.ref}
            onBlur={nameField.onBlur}
            onChange={(e) => {
              nameField.onChange(e);
              onNameChange?.(e);
            }}
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1.5">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className={formLabelClass}>Slug *</label>
          <input
            type="text"
            placeholder="blackwood-capital"
            className={formInputClass}
            {...register("slug", {
              required: "Slug is required",
              pattern: {
                value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                message:
                  "Lowercase letters, numbers, and hyphens only",
              },
            })}
          />
          {errors.slug && (
            <p className="text-red-400 text-xs mt-1.5">{errors.slug.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="broker_type" className={formLabelClass}>
          Broker Type *
        </label>
        <select
          id="broker_type"
          className={`${formInputClass} cursor-pointer`}
          {...register("broker_type", { required: "Broker type is required" })}
        >
          <option value="" disabled className="text-slate-500">
            Select type...
          </option>
          {BROKER_TYPES.map((type) => (
            <option key={type.value} value={type.value} className="bg-[#0d1528]">
              {type.label}
            </option>
          ))}
        </select>
        {errors.broker_type && (
          <p className="text-red-400 text-xs mt-1.5">
            {errors.broker_type.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={formLabelClass}>Logo URL</label>
          <div className="relative">
            <ImageIcon
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="url"
              placeholder="https://example.com/logo.png"
              className={`${formInputClass} pl-10`}
              {...register("logo_url")}
            />
          </div>
        </div>

        <div>
          <label className={formLabelClass}>Website</label>
          <div className="relative">
            <Globe
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="url"
              placeholder="https://example.com"
              className={`${formInputClass} pl-10`}
              {...register("website")}
            />
          </div>
        </div>
      </div>

      <div>
        <label className={formLabelClass}>Broker Description</label>
        <textarea
          rows={5}
          placeholder="Brief description of the broker..."
          className={`${formInputClass} resize-none`}
          {...register("description")}
        />
      </div>
    </div>
  );
}
