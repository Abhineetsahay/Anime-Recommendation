"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const FLOATING_ANIME = [
  { title: "Dandadan", genre: "Supernatural", score: "8.7", color: "#7C3AED" },
  { title: "Frieren", genre: "Fantasy", score: "9.3", color: "#0EA5E9" },
  { title: "Jujutsu Kaisen", genre: "Action", score: "8.6", color: "#DC2626" },
  {
    title: "Vinland Saga",
    genre: "Historical",
    score: "8.8",
    color: "#D97706",
  },
  {
    title: "Mob Psycho",
    genre: "Supernatural",
    score: "8.9",
    color: "#059669",
  },
  { title: "Chainsaw Man", genre: "Action", score: "8.5", color: "#DB2777" },
];

const FEATURES = [
  {
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    title: "Build Your Lists",
    desc: "Track what you're watching, completed, and plan to watch. Rate and add personal notes to every anime.",
  },
  {
    icon: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z",
    title: "Share Instantly",
    desc: "Every list gets a unique link. Share with friends and let them add anime too — no account required.",
  },
  {
    icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    title: "Smart Recommendations",
    desc: "Our ML model analyses your taste using TF-IDF and KNN to surface anime you'll actually love.",
  },
  {
    icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064",
    title: "Discover Anime",
    desc: "Browse trending, seasonal, and top-rated anime. Filter by your favourite genres and find your next obsession.",
  },
];

const STATS = [
  { value: "900K+", label: "Anime in database" },
  { value: "Real-time", label: "MAL data via Jikan" },
  { value: "ML-powered", label: "Recommendations" },
  { value: "Free", label: "Always & forever" },
];

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-[#080810] text-white overflow-x-hidden"
      style={{ fontFamily: "'Clash Display', 'Syne', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; }

        :root {
          --purple: #7C3AED;
          --purple-light: #A78BFA;
          --cyan: #06B6D4;
          --bg: #080810;
          --surface: #0f0f1a;
          --border: rgba(255,255,255,0.07);
        }

        /* Film grain overlay */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 100;
          opacity: 0.4;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-12px) rotate(1deg); }
          66% { transform: translateY(-6px) rotate(-1deg); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes scanline {
          from { transform: translateY(-100%); }
          to { transform: translateY(100vh); }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }

        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .animate-fadeUp { animation: fadeUp 0.8s ease forwards; }
        .animate-fadeUp-delay-1 { animation: fadeUp 0.8s ease 0.15s forwards; opacity: 0; }
        .animate-fadeUp-delay-2 { animation: fadeUp 0.8s ease 0.3s forwards; opacity: 0; }
        .animate-fadeUp-delay-3 { animation: fadeUp 0.8s ease 0.45s forwards; opacity: 0; }

        .card-float { animation: float 6s ease-in-out infinite; }
        .card-float-2 { animation: float 7s ease-in-out 1s infinite; }
        .card-float-3 { animation: float 8s ease-in-out 2s infinite; }
        .card-float-4 { animation: float 6.5s ease-in-out 0.5s infinite; }

        .marquee-track { animation: marquee 30s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }

        .feature-card:hover .feature-icon {
          transform: scale(1.1) rotate(-3deg);
          background: rgba(124, 58, 237, 0.3);
        }

        .glow-purple { box-shadow: 0 0 60px rgba(124, 58, 237, 0.15); }
        .glow-cyan { box-shadow: 0 0 60px rgba(6, 182, 212, 0.1); }

        .hero-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          line-height: 0.95;
          letter-spacing: -0.03em;
        }

        .diagonal-accent {
          clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
        }

        .nav-blur {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .btn-primary {
          background: linear-gradient(135deg, #7C3AED, #6D28D9);
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent, rgba(255,255,255,0.1));
          opacity: 0;
          transition: opacity 0.2s;
        }

        .btn-primary:hover::after { opacity: 1; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(124, 58, 237, 0.4); }
        .btn-primary:active { transform: translateY(0); }

        .anime-card {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .anime-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }

        @media (max-width: 768px) {
          .hero-title { font-size: clamp(3rem, 12vw, 5rem); }
          .floating-cards { display: none; }
        }

        @media (min-width: 769px) {
          .hero-title { font-size: clamp(4rem, 8vw, 8rem); }
        }
      `}</style>

      {/* Ambient light that follows mouse */}
      <div
        className="fixed pointer-events-none z-0 rounded-full"
        style={{
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
          left: mousePos.x - 300,
          top: mousePos.y - 300,
          transition: "left 0.5s ease, top 0.5s ease",
        }}
      />

      {/* ── NAV ── */}
      <nav className="nav-blur fixed top-0 left-0 right-0 z-50 border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-purple-800 flex items-center justify-center">
              <span className="text-xs font-black">A</span>
            </div>
            <span
              className="font-bold text-lg tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              AniList
            </span>
            <span className="text-xs text-white/20 font-mono ml-1 hidden sm:block">
              beta
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {["Discover", "Features", "How it works"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm text-white/50 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-white/60 hover:text-white transition-colors px-4 py-2"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="btn-primary text-sm font-semibold px-5 py-2 rounded-xl"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center pt-20 overflow-hidden"
      >
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(124,58,237,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.15) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        />

        {/* Diagonal gradient band */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "linear-gradient(125deg, transparent 40%, rgba(124,58,237,0.15) 60%, transparent 75%)",
          }}
        />

        {/* Scanline effect */}
        <div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"
          style={{ top: "30%", animation: "scanline 8s linear infinite" }}
        />

        <div className="relative max-w-7xl mx-auto px-6 w-full py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — text */}
            <div className="space-y-8">
              <div className="animate-fadeUp">
                <span className="inline-flex items-center gap-2 text-xs font-medium text-purple-400 border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                  ML-powered recommendations
                </span>
              </div>

              <h1 className="hero-title animate-fadeUp-delay-1">
                <span className="block text-white">Your anime</span>
                <span
                  className="block"
                  style={{
                    background:
                      "linear-gradient(135deg, #A78BFA 0%, #7C3AED 40%, #06B6D4 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  universe,
                </span>
                <span className="block text-white">organised.</span>
              </h1>

              <p
                className="animate-fadeUp-delay-2 text-white/50 text-lg leading-relaxed max-w-md"
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
              >
                Track, rate, and share your watchlists. Discover hidden gems
                through smart recommendations. Built for fans, by a fan.
              </p>

              <div className="animate-fadeUp-delay-3 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="btn-primary px-7 py-3.5 rounded-xl font-semibold text-base flex items-center gap-2"
                >
                  Start for free
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <a
                  href="#features"
                  className="px-7 py-3.5 rounded-xl font-semibold text-base border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-all flex items-center gap-2"
                >
                  See features
                </a>
              </div>

              {/* Mini stats */}
              <div className="animate-fadeUp-delay-3 flex flex-wrap gap-6 pt-2">
                {[
                  ["Free", "forever"],
                  ["No ads", "ever"],
                  ["Open", "source"],
                ].map(([v, l]) => (
                  <div key={v}>
                    <p
                      className="text-white font-bold text-lg"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      {v}
                    </p>
                    <p className="text-white/30 text-xs">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — floating anime cards */}
            <div className="floating-cards relative h-[520px] hidden lg:block">
              {/* Main card */}
              <div className="card-float anime-card absolute top-8 left-16 w-52 bg-[#13131f] border border-white/8 rounded-2xl overflow-hidden glow-purple cursor-pointer">
                <div
                  className="h-32 relative"
                  style={{
                    background: `linear-gradient(135deg, ${FLOATING_ANIME[1].color}40, ${FLOATING_ANIME[1].color}10)`,
                  }}
                >
                  <div className="absolute inset-0 flex items-end p-3">
                    <span className="text-xs font-bold text-white/60 uppercase tracking-widest">
                      Fantasy
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 bg-yellow-400 text-black text-xs font-black px-2 py-0.5 rounded-lg">
                    ★ {FLOATING_ANIME[1].score}
                  </div>
                </div>
                <div className="p-4">
                  <p
                    className="font-bold text-sm"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {FLOATING_ANIME[1].title}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-white/30">Completed</span>
                    <span className="w-1 h-1 rounded-full bg-green-400" />
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              </div>

              {/* Second card */}
              <div className="card-float-2 anime-card absolute top-4 right-4 w-44 bg-[#13131f] border border-white/8 rounded-2xl overflow-hidden cursor-pointer">
                <div
                  className="h-24 relative"
                  style={{
                    background: `linear-gradient(135deg, ${FLOATING_ANIME[0].color}40, ${FLOATING_ANIME[0].color}10)`,
                  }}
                >
                  <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-black px-1.5 py-0.5 rounded-lg">
                    ★ {FLOATING_ANIME[0].score}
                  </div>
                </div>
                <div className="p-3">
                  <p
                    className="font-bold text-xs"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {FLOATING_ANIME[0].title}
                  </p>
                  <span className="text-xs text-white/30">
                    Watching · ep 9/12
                  </span>
                  <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: "75%" }}
                    />
                  </div>
                </div>
              </div>

              {/* Third card */}
              <div className="card-float-3 anime-card absolute bottom-16 left-4 w-48 bg-[#13131f] border border-white/8 rounded-2xl overflow-hidden cursor-pointer">
                <div
                  className="h-28 relative"
                  style={{
                    background: `linear-gradient(135deg, ${FLOATING_ANIME[2].color}40, ${FLOATING_ANIME[2].color}10)`,
                  }}
                >
                  <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-black px-1.5 py-0.5 rounded-lg">
                    ★ {FLOATING_ANIME[2].score}
                  </div>
                </div>
                <div className="p-3">
                  <p
                    className="font-bold text-xs"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {FLOATING_ANIME[2].title}
                  </p>
                  <span className="text-xs text-white/30">Plan to watch</span>
                </div>
              </div>

              {/* Fourth card */}
              <div className="card-float-4 anime-card absolute bottom-8 right-8 w-44 bg-[#13131f] border border-white/8 rounded-2xl p-4 cursor-pointer">
                <p className="text-xs text-white/40 mb-3 font-medium">
                  Recommended for you
                </p>
                {FLOATING_ANIME.slice(3, 6).map((a) => (
                  <div
                    key={a.title}
                    className="flex items-center gap-2 py-1.5 border-b border-white/5 last:border-0"
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: a.color }}
                    />
                    <span className="text-xs font-medium truncate">
                      {a.title}
                    </span>
                    <span className="text-xs text-yellow-400 ml-auto flex-shrink-0">
                      {a.score}
                    </span>
                  </div>
                ))}
              </div>

              {/* Decorative orbs */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
                style={{
                  background: "radial-gradient(circle, #7C3AED, transparent)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent, #080810)",
          }}
        />
      </section>

      {/* ── MARQUEE ── */}
      <div className="py-8 border-y border-white/5 overflow-hidden bg-[#0a0a14]">
        <div className="flex marquee-track whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-6">
              {[
                "Watchlist Tracking",
                "ML Recommendations",
                "Shareable Lists",
                "Jikan API",
                "Genre Discovery",
                "Episode Progress",
                "Personal Ratings",
                "Collaborative Lists",
                "Seasonal Anime",
                "Top Rated",
              ].map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-3 text-sm text-white/25 font-medium tracking-wide uppercase"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500/60" />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat) => (
            <div key={stat.value} className="text-center group">
              <p
                className="text-3xl sm:text-4xl font-black text-white group-hover:text-purple-300 transition-colors"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {stat.value}
              </p>
              <p
                className="text-white/30 text-sm mt-1"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-purple-400 text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              Features
            </p>
            <h2
              className="text-4xl sm:text-5xl font-black text-white"
              style={{
                fontFamily: "'Syne', sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              Everything you need.
              <br />
              <span style={{ color: "rgba(255,255,255,0.3)" }}>
                Nothing you do n&lsquo;t.
              </span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="feature-card group bg-[#0f0f1a] border border-white/6 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300 hover:bg-[#13131f] cursor-default"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="feature-icon w-11 h-11 rounded-xl bg-purple-500/15 flex items-center justify-center mb-5 transition-all duration-300">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#A78BFA"
                    strokeWidth="1.8"
                  >
                    <path
                      d={f.icon}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3
                  className="font-bold text-base text-white mb-2"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {f.title}
                </h3>
                <p
                  className="text-white/40 text-sm leading-relaxed"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 300,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        id="how-it-works"
        className="py-20 px-6 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, #7C3AED, transparent 70%)",
          }}
        />

        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-16">
            <p className="text-cyan-400 text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              How it works
            </p>
            <h2
              className="text-4xl sm:text-5xl font-black text-white"
              style={{
                fontFamily: "'Syne', sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              Up and running
              <br />
              in 3 steps.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Pick your genres",
                desc: "On first login, tell us what you love. Action? Romance? Psychological thrillers? We use this to personalise everything.",
                color: "#7C3AED",
              },
              {
                step: "02",
                title: "Build your list",
                desc: "Search or browse discover to add anime. Set watch status, track episodes, rate each entry 1–10, and add personal notes.",
                color: "#06B6D4",
              },
              {
                step: "03",
                title: "Share & explore",
                desc: "Every list gets a unique URL. Share with anyone — they can view and add anime without an account.",
                color: "#10B981",
              },
            ].map((step, i) => (
              <div key={step.step} className="relative group">
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 -right-3 w-6 text-white/10 z-10">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
                <div className="bg-[#0f0f1a] border border-white/6 group-hover:border-white/12 rounded-2xl p-7 transition-all duration-300 h-full">
                  <div className="flex items-start justify-between mb-6">
                    <span
                      className="text-5xl font-black opacity-15 select-none"
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        color: step.color,
                      }}
                    >
                      {step.step}
                    </span>
                    <div
                      className="w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={{
                        borderColor: `${step.color}40`,
                        background: `${step.color}10`,
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: step.color }}
                      />
                    </div>
                  </div>
                  <h3
                    className="font-bold text-lg text-white mb-2"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-white/40 text-sm leading-relaxed"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 300,
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ML SECTION ── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#0d0d1a] border border-purple-500/15 rounded-3xl p-8 sm:p-12 relative overflow-hidden glow-purple">
            {/* BG decoration */}
            <div
              className="absolute top-0 right-0 w-96 h-96 opacity-10 pointer-events-none"
              style={{
                background: "radial-gradient(circle, #7C3AED, transparent 70%)",
              }}
            />
            <div
              className="absolute bottom-0 left-0 w-64 h-64 opacity-5 pointer-events-none"
              style={{
                background: "radial-gradient(circle, #06B6D4, transparent 70%)",
              }}
            />

            <div className="relative grid md:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-block text-xs font-semibold text-purple-400 uppercase tracking-[0.2em] mb-5">
                  ML Recommender
                </span>
                <h2
                  className="text-3xl sm:text-4xl font-black text-white mb-5"
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Not just popular.
                  <br />
                  Perfect for you.
                </h2>
                <p
                  className="text-white/40 leading-relaxed mb-6"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 300,
                  }}
                >
                  Our recommender uses TF-IDF vectorization on anime synopses
                  and genres combined with KNN cosine similarity — the same
                  techniques used in production recommendation engines.
                  It&apos;s trained on thousands of anime and gets smarter with
                  your preferences.
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    "TF-IDF + KNN with cosine similarity",
                    "Weighted by MAL score + personal taste",
                    "Falls back to live Jikan API data",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm text-white/60"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#A78BFA"
                        strokeWidth="2"
                      >
                        <path
                          d="M20 6L9 17l-5-5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Code snippet */}
              <div className="bg-[#080810] border border-white/8 rounded-2xl p-5 font-mono text-sm overflow-hidden">
                <div className="flex items-center gap-1.5 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                  <span className="ml-2 text-white/20 text-xs">
                    recommend.py
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  <p>
                    <span className="text-purple-400">from</span>{" "}
                    <span className="text-cyan-400">sklearn.neighbors</span>{" "}
                    <span className="text-purple-400">import</span>{" "}
                    NearestNeighbors
                  </p>
                  <p className="text-white/20">&nbsp;</p>
                  <p>
                    <span className="text-blue-400">knn</span> =
                    NearestNeighbors(
                  </p>
                  <p>
                    &nbsp;&nbsp;metric=
                    <span className="text-green-400">&apos;cosine&apos;</span>,
                  </p>
                  <p>
                    &nbsp;&nbsp;algorithm=
                    <span className="text-green-400">&apos;brute&apos;</span>
                  </p>
                  <p>)</p>
                  <p className="text-white/20">&nbsp;</p>
                  <p>
                    <span className="text-white/40">
                      # final_score blends similarity + MAL rating
                    </span>
                  </p>
                  <p>
                    <span className="text-blue-400">score</span> = (
                    <span className="text-yellow-400">0.7</span> * similarity
                  </p>
                  <p>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+{" "}
                    <span className="text-yellow-400">0.3</span> * (mal_score /{" "}
                    <span className="text-yellow-400">10</span>))
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-5xl sm:text-6xl font-black text-white mb-6"
            style={{
              fontFamily: "'Syne', sans-serif",
              letterSpacing: "-0.03em",
            }}
          >
            Ready to watch
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #A78BFA, #06B6D4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              smarter?
            </span>
          </h2>
          <p
            className="text-white/40 text-lg mb-10"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
          >
            Join and start building your perfect anime collection today. Free
            forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="btn-primary px-10 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
            >
              Create free account
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/discover"
              className="px-10 py-4 rounded-2xl font-bold text-lg border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2"
            >
              Browse anime first
            </Link>
          </div>
          <p className="text-white/20 text-xs mt-6">
            No credit card required · No ads · Open source
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-purple-800 flex items-center justify-center">
              <span className="text-xs font-black">A</span>
            </div>
            <span
              className="font-bold"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              AniList
            </span>
          </div>
          <p
            className="text-white/20 text-xs"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Built by{" "}
            <a
              href="https://github.com/Abhineetsahay"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Abhineet
            </a>{" "}
            · Powered by Jikan API & a custom ML model
          </p>
          <div className="flex items-center gap-5 text-xs text-white/30">
            <a
              href="https://github.com/Abhineetsahay"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
            <Link href="/login" className="hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/signup" className="hover:text-white transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
