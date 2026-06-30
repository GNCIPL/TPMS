"use client";

// components/auth/RightPanel.tsx
// The dark indigo visual panel shown on the right side of all auth pages

interface RightPanelProps {
  headline?: string;
  subtext?: string;
  badges?: string[];
}

export default function RightPanel({
  headline = "Empower Your Career with AI-Driven Insights.",
  subtext = "Join over 50,000 professionals using TPMS to navigate their hiring pipeline with precision and intelligence.",
  badges = ["📄 AI Resume Builder", "🎯 ATS Optimization", "🚀 Career Coaching"],
}: RightPanelProps) {
  return (
    <div className="auth-visual-panel">
      {/* Mini dashboard mockup card */}
      <div className="visual-card">
        <div className="visual-card-header">
          <div className="visual-card-dots">
            <div className="dot dot-red" />
            <div className="dot dot-yellow" />
            <div className="dot dot-green" />
          </div>
          <span className="visual-card-title">Talent Pipeline</span>
          <div style={{ width: 48 }} />
        </div>

        {/* Stats */}
        <div className="v-stats">
          <div className="v-stat">
            <div className="v-stat-num">248</div>
            <div className="v-stat-lbl">Applicants</div>
          </div>
          <div className="v-stat">
            <div className="v-stat-num">34</div>
            <div className="v-stat-lbl">Interviews</div>
          </div>
          <div className="v-stat">
            <div className="v-stat-num">6</div>
            <div className="v-stat-lbl">Offers</div>
          </div>
        </div>

        {/* Bar chart */}
        <div className="v-chart">
          {[30, 50, 40, 70, 55, 80, 60, 90, 75, 65].map((h, i) => (
            <div
              key={i}
              className={`v-bar${h >= 75 ? " hi" : ""}`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>

        {/* Pipeline stages */}
        <div className="v-pipeline">
          {[
            { label: "Applied",    pct: 100, color: "#818cf8" },
            { label: "Screened",   pct: 68,  color: "#6366f1" },
            { label: "Interview",  pct: 42,  color: "#4f46e5" },
            { label: "Offer",      pct: 18,  color: "#4338ca" },
          ].map(({ label, pct, color }) => (
            <div className="v-pipe-row" key={label}>
              <span className="v-pipe-label">{label}</span>
              <div className="v-pipe-track">
                <div
                  className="v-pipe-fill"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
              <span className="v-pipe-val">{pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Headline + sub */}
      <p className="visual-headline">{headline}</p>
      <p className="visual-sub">{subtext}</p>

      {/* Feature badges */}
      <div className="visual-badges">
        {badges.map((b) => (
          <span className="v-badge" key={b}>{b}</span>
        ))}
      </div>

      {/* Trust row */}
      <div className="trust-row">
        <div className="trust-avatars">
          {["JD", "AS", "MR"].map((init, i) => (
            <div
              key={init}
              className={`trust-avatar${i === 1 ? " alt" : i === 2 ? " alt2" : ""}`}
            >
              {init}
            </div>
          ))}
        </div>
        <div className="trust-text">
          <strong>Trusted by Experts</strong>
          <br />Rating: 4.9/5 stars
        </div>
      </div>
    </div>
  );
}
