"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import RightPanel from "@/components/auth/RightPanel";
import "@/styles/auth.css";

const getStrength = (pwd: string) => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const colors = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#16a34a"];
  const labels = ["", "Very weak", "Weak", "Fair", "Strong", "Very strong"];
  return { score, color: colors[score], label: labels[score] };
};

function ResetPasswordForm() {
  const router       = useRouter();
  const params       = useSearchParams();
  const token        = params.get("token") || "";
  const email        = params.get("email") || "";

  const [showPwd, setShowPwd]   = useState(false);
  const [showCPwd, setShowCPwd] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [form, setForm]         = useState({ password: "", confirmPassword: "" });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const strength = getStrength(form.password);

  if (!token || !email) {
    return (
      <div className="success-state">
        <div className="success-icon-wrap" style={{ background: "var(--red-50)" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--red-500)" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h2 className="success-title">Invalid Link</h2>
        <p className="success-desc">This password reset link is invalid or has expired. Please request a new one.</p>
        <Link href="/forgot-password" className="btn btn-primary" style={{ display: "inline-flex", maxWidth: 240, margin: "0 auto" }}>
          Request New Link →
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.password || !form.confirmPassword) {
      setError("Please fill in all fields."); return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match."); return;
    }
    if (strength.score < 3) {
      setError("Please use a stronger password."); return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password: form.password, confirmPassword: form.confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed.");
      router.push("/login?reset=success");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ marginBottom: 12 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: "var(--indigo-50)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 16,
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--indigo-600)" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
      </div>

      <h1 className="auth-heading">Set New Password</h1>
      <p className="auth-subheading">
        Create a new secure password for <strong style={{ color: "var(--gray-700)" }}>{email}</strong>.
      </p>

      {error && (
        <div className="alert alert-error">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <div className="form-label">New Password</div>
          <div className="input-wrap">
            <input
              type={showPwd ? "text" : "password"}
              placeholder="Create a strong password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              autoComplete="new-password"
              autoFocus
              style={{ paddingRight: 40 }}
            />
            <button type="button" className="eye-toggle" onClick={() => setShowPwd(!showPwd)} aria-label="Toggle">
              {showPwd
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              }
            </button>
          </div>
          {form.password && (
            <>
              <div className="strength-bars">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="strength-bar"
                    style={{ background: i <= strength.score ? strength.color : undefined }} />
                ))}
              </div>
              <div className="strength-label" style={{ color: strength.color }}>{strength.label}</div>
            </>
          )}
          {!form.password && (
            <p style={{ fontSize: 11, color: "var(--gray-400)", marginTop: 4 }}>
              Min 8 chars with uppercase, lowercase, number &amp; special character
            </p>
          )}
        </div>

        <div className="form-group">
          <div className="form-label">Confirm New Password</div>
          <div className="input-wrap">
            <input
              type={showCPwd ? "text" : "password"}
              placeholder="Repeat your new password"
              value={form.confirmPassword}
              onChange={(e) => set("confirmPassword", e.target.value)}
              autoComplete="new-password"
              className={form.confirmPassword && form.confirmPassword !== form.password ? "is-error" : ""}
              style={{ paddingRight: 40 }}
            />
            <button type="button" className="eye-toggle" onClick={() => setShowCPwd(!showCPwd)} aria-label="Toggle">
              {showCPwd
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              }
            </button>
          </div>
          {form.confirmPassword && form.confirmPassword !== form.password && (
            <p className="field-error">⚠ Passwords do not match</p>
          )}
          {form.confirmPassword && form.confirmPassword === form.password && (
            <p style={{ fontSize: 12, color: "var(--green-500)", marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Passwords match
            </p>
          )}
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <><div className="spinner" /> Resetting password…</> : "Reset Password →"}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="auth-layout">
      <div className="auth-form-panel">
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <span className="auth-brand-name">TPMS</span>
        </div>

        <Suspense fallback={<div style={{ color: "var(--gray-400)", fontSize: 14 }}>Loading…</div>}>
          <ResetPasswordForm />
        </Suspense>

        <p className="auth-footer-link" style={{ marginTop: 20 }}>
          <Link href="/login">← Back to Sign in</Link>
        </p>

        <div className="auth-privacy">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>

      <RightPanel
        headline="Your Security is Our Priority."
        subtext="We use industry-standard encryption to keep your account and data safe at every step."
        badges={["🛡 256-bit Encryption", "🔒 Zero-trust Security", "✅ SOC 2 Compliant"]}
      />
    </div>
  );
}
