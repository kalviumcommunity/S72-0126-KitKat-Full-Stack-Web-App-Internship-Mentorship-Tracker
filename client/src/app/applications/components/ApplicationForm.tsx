"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";

type ApplicationStatus =
  | "DRAFT"
  | "APPLIED"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "OFFER"
  | "REJECTED";

type ApplicationFormMode = "create" | "edit";

export type ApplicationFormData = {
  id?: string;
  company: string;
  role: string;
  platform: string;
  status: ApplicationStatus;
  resumeUrl: string; // S3/Blob signed URL or stored file link
  notes: string;
  deadline: string; // ISO date string YYYY-MM-DD
};

const statusOptions: { label: string; value: ApplicationStatus }[] = [
  { label: "Draft", value: "DRAFT" },
  { label: "Applied", value: "APPLIED" },
  { label: "Shortlisted", value: "SHORTLISTED" },
  { label: "Interview", value: "INTERVIEW" },
  { label: "Offer", value: "OFFER" },
  { label: "Rejected", value: "REJECTED" },
];

const platformOptions = [
  "LinkedIn",
  "Careers Page",
  "Referral",
  "AngelList",
  "Internshala",
  "Other",
] as const;

const applicationSchema = z.object({
  company: z.string().min(2, "Company name is required"),
  role: z.string().min(2, "Role is required"),
  platform: z.string().min(2, "Platform is required"),
  status: z.enum([
    "DRAFT",
    "APPLIED",
    "SHORTLISTED",
    "INTERVIEW",
    "OFFER",
    "REJECTED",
  ]),
  resumeUrl: z.string().url("Resume URL must be a valid URL").optional().or(z.literal("")),
  notes: z.string().max(1000, "Notes should be under 1000 characters").optional().or(z.literal("")),
  deadline: z.string().min(1, "Deadline is required"),
});

type Props = {
  mode: ApplicationFormMode;
  initialData?: ApplicationFormData; // for edit mode
  onSuccess?: (saved: any) => void;
};

export default function ApplicationForm({ mode, initialData, onSuccess }: Props) {
  const defaultValues: ApplicationFormData = useMemo(
    () => ({
      company: "",
      role: "",
      platform: "LinkedIn",
      status: "DRAFT",
      resumeUrl: "",
      notes: "",
      deadline: "",
    }),
    []
  );

  const [form, setForm] = useState<ApplicationFormData>(defaultValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        ...initialData,
        deadline: initialData.deadline?.slice(0, 10) || "",
      });
    }
  }, [mode, initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const result = applicationSchema.safeParse(form);

    if (!result.success) {
      const formatted: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = String(issue.path[0]);
        formatted[key] = issue.message;
      });
      setErrors(formatted);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      const endpoint =
        mode === "edit" && initialData?.id
          ? `/api/applications/${initialData.id}`
          : `/api/applications`;

      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Something went wrong.");
        return;
      }

      onSuccess?.(data);

      if (mode === "create") setForm(defaultValues);

      alert(mode === "edit" ? "Application updated ✅" : "Application created ✅");
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl">
      <div className="rounded-2xl border bg-white shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">
            {mode === "edit" ? "Edit Internship Application" : "Create Internship Application"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Track your internship pipeline with resume version + deadlines.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Company + Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Company *" error={errors.company}>
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Eg: Amazon"
                className={inputClass(errors.company)}
              />
            </Field>

            <Field label="Role *" error={errors.role}>
              <input
                name="role"
                value={form.role}
                onChange={handleChange}
                placeholder="Eg: SDE Intern"
                className={inputClass(errors.role)}
              />
            </Field>
          </div>

          {/* Platform + Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Platform *" error={errors.platform}>
              <select
                name="platform"
                value={form.platform}
                onChange={handleChange}
                className={inputClass(errors.platform)}
              >
                {platformOptions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Status *" error={errors.status}>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputClass(errors.status)}
              >
                {statusOptions.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* Resume URL + Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Resume URL (PDF link)" error={errors.resumeUrl}>
              <input
                name="resumeUrl"
                value={form.resumeUrl}
                onChange={handleChange}
                placeholder="Eg: https://s3.../resume-v3.pdf"
                className={inputClass(errors.resumeUrl)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Paste a signed S3/Blob URL or stored resume link.
              </p>
            </Field>

            <Field label="Deadline *" error={errors.deadline}>
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                className={inputClass(errors.deadline)}
              />
            </Field>
          </div>

          {/* Notes */}
          <Field label="Notes" error={errors.notes}>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Add referral info, interview rounds, follow-ups..."
              rows={4}
              className={textareaClass(errors.notes)}
            />
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>Max 1000 chars</span>
              <span>{form.notes.length}/1000</span>
            </div>
          </Field>

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-indigo-600 text-white px-5 py-3 font-semibold hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading
                ? "Saving..."
                : mode === "edit"
                ? "Update Application"
                : "Create Application"}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => setForm(mode === "edit" && initialData ? initialData : defaultValues)}
              className="rounded-xl border px-5 py-3 font-semibold hover:bg-gray-50 disabled:opacity-60"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Mini Status Pipeline preview */}
      <div className="mt-4 p-4 rounded-2xl border bg-white shadow-sm">
        <p className="text-sm font-semibold mb-2">Pipeline</p>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((s) => (
            <span
              key={s.value}
              className={`px-3 py-1 rounded-full text-xs border ${
                form.status === s.value ? "bg-indigo-50 border-indigo-400" : "bg-gray-50"
              }`}
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Small UI Helpers ---------- */

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-semibold">{label}</label>
      {children}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

function inputClass(error?: string) {
  return `w-full rounded-xl border px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 ${
    error ? "border-red-400" : "border-gray-200"
  }`;
}

function textareaClass(error?: string) {
  return `w-full rounded-xl border px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
    error ? "border-red-400" : "border-gray-200"
   
    return (
      <div className="p-6">
        <ApplicationForm mode="create" />
      </div>
    );
  }`;
}
