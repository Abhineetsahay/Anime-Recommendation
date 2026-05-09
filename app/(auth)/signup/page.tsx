"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const encode = (obj: unknown) => {
        const str = JSON.stringify(obj);
        if (typeof window !== "undefined") {
          return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
        }
        return Buffer.from(str, "utf-8").toString("base64");
      };

      const res = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: encode(form) }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) return setError(data.error);

      if (data.user.firstLogin) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      setLoading(false);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred. Please try again.",
      );
    }
  }

  const strength =
    form.password.length === 0
      ? 0
      : form.password.length < 6
        ? 1
        : form.password.length < 10
          ? 2
          : 3;

  const strengthLabel = ["", "Weak", "Good", "Strong"];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#10b981"];

  return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up   { animation: fadeUp 0.6s ease forwards; }
        .fade-up-1 { animation: fadeUp 0.6s ease 0.1s forwards; opacity: 0; }
        .fade-up-2 { animation: fadeUp 0.6s ease 0.2s forwards; opacity: 0; }
        .fade-up-3 { animation: fadeUp 0.6s ease 0.3s forwards; opacity: 0; }

        .input-field {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 14px;
          color: white;
          outline: none;
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .input-field::placeholder { color: rgba(255,255,255,0.2); }
        .input-field:focus {
          border-color: rgba(124,58,237,0.6);
          background: rgba(124,58,237,0.05);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
        }

        .btn-signup {
          width: 100%;
          background: linear-gradient(135deg, #7C3AED, #6D28D9);
          color: white;
          padding: 13px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
          font-family: 'Syne', sans-serif;
          letter-spacing: 0.01em;
        }
        .btn-signup:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(124,58,237,0.4);
        }
        .btn-signup:active:not(:disabled) { transform: translateY(0); }
        .btn-signup:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-signup::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent, rgba(255,255,255,0.08));
          opacity: 0;
          transition: opacity 0.2s;
        }
        .btn-signup:hover::after { opacity: 1; }
      `}</style>

      {/* Background orbs */}
      <div
        className="absolute top-1/4 -left-32 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(6,182,212,0.07), transparent 70%)",
        }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(124,58,237,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="fade-up text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-purple-800 flex items-center justify-center shadow-lg">
              <span className="text-sm font-black text-white">A</span>
            </div>
            <span
              className="text-lg font-black text-white tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              AniList
            </span>
          </Link>
        </div>

        {/* Card */}
        <div
          className="fade-up-1 bg-[#0f0f1a] border border-white/8 rounded-2xl p-7"
          style={{
            boxShadow:
              "0 25px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
          }}
        >
          <div className="mb-6">
            <h1
              className="text-2xl font-black text-white"
              style={{
                fontFamily: "'Syne', sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              Create account
            </h1>
            <p
              className="text-white/40 text-sm mt-1"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
            >
              Start building your anime universe
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f87171"
                strokeWidth="2"
                className="flex-shrink-0 mt-0.5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              <p
                className="text-red-400 text-sm"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="fade-up-2">
              <label
                className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Email
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="input-field"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* Username */}
            <div className="fade-up-2">
              <label
                className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Username
              </label>
              <input
                type="text"
                required
                placeholder="coolotakuname"
                className="input-field"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>

            {/* Password */}
            <div className="fade-up-2">
              <label
                className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  placeholder="Min. 8 characters"
                  className="input-field"
                  style={{ paddingRight: "44px" }}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password strength bar */}
              {form.password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                          background:
                            strength >= level
                              ? strengthColor[strength]
                              : "rgba(255,255,255,0.08)",
                        }}
                      />
                    ))}
                  </div>
                  <p
                    className="text-xs"
                    style={{
                      color: strengthColor[strength],
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {strengthLabel[strength]}
                  </p>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="fade-up-3 pt-1">
              <button type="submit" disabled={loading} className="btn-signup">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Create account
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer link */}
        <p
          className="fade-up-3 text-center mt-5 text-white/30 text-sm"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
