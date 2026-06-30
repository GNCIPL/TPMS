"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function RegisterPage() {
  const router = useRouter();
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [role, setRole]         = useState<"USER" | "RECRUITER">("USER");
  const [form, setForm]         = useState({
    firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const strength = getStrength(form.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const { firstName, lastName, email, password, confirmPassword } = form;
    if (!firstName || !lastName || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (strength.score < 3) {
      setError("Please use a stronger password.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ firstName, lastName, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed.");
      router.push(role === "RECRUITER" ? "/recruiter" : "/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
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

        <h1 className="auth-heading">Create Account</h1>
        <p className="auth-subheading">Join 50,000+ professionals on TPMS.</p>

        {error && (
          <div className="alert alert-error">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <div className="form-label">First Name</div>
              <input type="text" placeholder="Jane" value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)} autoComplete="given-name" />
            </div>
            <div className="form-group">
              <div className="form-label">Last Name</div>
              <input type="text" placeholder="Smith" value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)} autoComplete="family-name" />
            </div>
          </div>

          <div className="form-group">
            <div className="form-label">Email Address</div>
            <input type="email" placeholder="name@company.com" value={form.email}
              onChange={(e) => set("email", e.target.value)} autoComplete="email" />
          </div>

          {/* Role selector */}
          <div className="form-label" style={{ marginBottom: 8 }}>I am a</div>
          <div className="role-grid">
            <div
              className={`role-card${role === "USER" ? " selected" : ""}`}
              onClick={() => setRole("USER")}
              role="button" tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setRole("USER")}
            >
              <div className="role-card-icon">🎓</div>
              <div className="role-card-title">Candidate</div>
              <div className="role-card-desc">Looking for a job</div>
            </div>
            <div
              className={`role-card${role === "RECRUITER" ? " selected" : ""}`}
              onClick={() => setRole("RECRUITER")}
              role="button" tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setRole("RECRUITER")}
            >
              <div className="role-card-icon">🏢</div>
              <div className="role-card-title">Recruiter</div>
              <div className="role-card-desc">Hiring talent</div>
            </div>
          </div>

          <div className="form-group">
            <div className="form-label">Password</div>
            <div className="input-wrap">
              <input
                type={showPwd ? "text" : "password"}
                placeholder="Create a strong password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                autoComplete="new-password"
                style={{ paddingRight: 40 }}
              />
              <button type="button" className="eye-toggle" onClick={() => setShowPwd(!showPwd)} aria-label="Toggle password">
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
                    <div
                      key={i}
                      className="strength-bar"
                      style={{ background: i <= strength.score ? strength.color : undefined }}
                    />
                  ))}
                </div>
                <div className="strength-label" style={{ color: strength.color }}>
                  {strength.label}
                </div>
              </>
            )}
          </div>

          <div className="form-group">
            <div className="form-label">Confirm Password</div>
            <input
              type="password"
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={(e) => set("confirmPassword", e.target.value)}
              autoComplete="new-password"
              className={
                form.confirmPassword && form.confirmPassword !== form.password ? "is-error" : ""
              }
            />
            {form.confirmPassword && form.confirmPassword !== form.password && (
              <p className="field-error">⚠ Passwords do not match</p>
            )}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <><div className="spinner" /> Creating account…</> : "Create Account →"}
          </button>
        </form>

        <div className="divider">Or sign up with</div>

        <button type="button" className="btn btn-outline" onClick={handleGoogle}>
          <svg width="16" height="16" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-4z"/>
            <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-4z"/>
          </svg>
          Google Sign-up
        </button>

        <p className="auth-footer-link">
          Already have an account? <Link href="/login">Sign in</Link>
        </p>

        <div className="auth-privacy">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>

      <RightPanel
        headline="Build Your Dream Career Pipeline."
        subtext="Candidates and recruiters alike use TPMS to connect smarter, faster, and with better results."
        badges={["📄 Smart Matching", "📊 Real-time Analytics", "🤝 Instant Connect"]}
      />
    </div>
  );
}
