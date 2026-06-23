"use client";

import { useState } from "react";
import Link from "next/link";
import RightPanel from "@/components/auth/RightPanel";
import "@/styles/auth.css";

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) { setError("Please enter your email address."); return; }
    setLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      // Always show success to prevent email enumeration
      setSent(true);
    } catch {
      setSent(true); // Same UX regardless
    } finally {
      setLoading(false);
    }
  };

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

        {!sent ? (
          <>
            <div style={{ marginBottom: 12 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: "var(--indigo-50)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 16,
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--indigo-600)" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
            </div>

            <h1 className="auth-heading">Forgot Password?</h1>
            <p className="auth-subheading">
              No worries! Enter your registered email and we'll send you a secure reset link.
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
                <div className="form-label">Email Address</div>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  autoFocus
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading
                  ? <><div className="spinner" /> Sending link…</>
                  : "Send Reset Link →"}
              </button>
            </form>
          </>
        ) : (
          <div className="success-state">
            <div className="success-icon-wrap">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green-500)" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <h2 className="success-title">Check Your Email</h2>
            <p className="success-desc">
              If an account exists for <strong>{email}</strong>, we've sent a password reset link.
              Please check your inbox and spam folder. The link expires in <strong>1 hour</strong>.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => { setSent(false); setEmail(""); }}
              style={{ maxWidth: 280, margin: "0 auto" }}
            >
              Try a different email
            </button>
          </div>
        )}

        <p className="auth-footer-link" style={{ marginTop: sent ? 16 : 20 }}>
          <Link href="/login">← Back to Sign in</Link>
        </p>

        <div className="auth-privacy">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>

      <RightPanel
        headline="Secure Access, Every Time."
        subtext="Your account is protected with enterprise-grade security. Reset your password safely in seconds."
        badges={["🔐 Encrypted Reset Links", "⏱ 1-Hour Expiry", "✅ Instant Delivery"]}
      />
    </div>
  );
}
