"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  Brain,
  CalendarDays,
  CheckCircle2,
  MessageSquare,
  Mic,
  PenLine,
  TrendingUp,
  Zap,
} from "lucide-react";
import { ROUTES } from "@/config";
import { cn } from "@/lib";

// ─── Count-up hook ────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 2000, shouldStart = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!shouldStart) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [target, duration, shouldStart]);
  return count;
}

// ─── Static data ──────────────────────────────────────────────────────────────
const STATS = [
  { value: 10000, suffix: "+", label: "Active Learners" },
  { value: 95, suffix: "%", label: "Satisfaction Rate" },
  { value: 240, suffix: "+", label: "Lessons Available" },
  { value: 5, suffix: "", label: "CEFR Levels" },
] as const;

const SKILLS = [
  {
    icon: BookOpen,
    label: "Reading",
    accent: "teal",
    accentHex: "#0d9488",
    desc: "Master comprehension with AI-curated articles that match your level and interests precisely.",
  },
  {
    icon: PenLine,
    label: "Writing",
    accent: "violet",
    accentHex: "#7c3aed",
    desc: "Improve grammar and flow with instant feedback designed for Vietnamese linguistic patterns.",
  },
  {
    icon: Mic,
    label: "Speaking",
    accent: "orange",
    accentHex: "#ea580c",
    desc: "Perfect your accent with real-time speech analysis and conversational AI practice partners.",
  },
  
] as const;

const FEATURES = [
  {
    icon: Brain,
    title: "Adaptive Placement Test",
    desc: "Our dynamic testing system finds your exact CEFR level in minutes, adapting difficulty in real-time.",
  },
  {
    icon: CalendarDays,
    title: "Personalized Learning Plan",
    desc: "Curated daily lessons based on your career goals, travel plans, or academic needs.",
  },
  {
    icon: MessageSquare,
    title: "AI-Powered Feedback",
    desc: "Get detailed explanations on why a word choice was unnatural and how a native speaker would say it.",
  },
  {
    icon: BookMarked,
    title: "Smart Dictionary",
    desc: "Context-aware definitions with Vietnamese translations that capture subtle nuances in meaning.",
  },
] as const;

const STEPS = [
  {
    num: "01",
    title: "Quick Test",
    icon: Zap,
    desc: "Take our 5-minute AI-powered adaptive placement test.",
  },
  {
    num: "02",
    title: "Daily Curations",
    icon: BookOpen,
    desc: "Receive personalized articles and exercises every morning.",
  },
  {
    num: "03",
    title: "Live Feedback",
    icon: MessageSquare,
    desc: "Practice writing and speaking with instant AI corrections.",
  },
  {
    num: "04",
    title: "Track Growth",
    icon: TrendingUp,
    desc: "See your CEFR level climb with detailed performance metrics.",
  },
] as const;

const SKILL_BARS = [
  { label: "Reading", pct: 78, color: "bg-teal-500", text: "text-teal-600", icon: BookOpen },
  { label: "Writing", pct: 62, color: "bg-violet-500", text: "text-violet-600", icon: PenLine },
  { label: "Speaking", pct: 55, color: "bg-orange-500", text: "text-orange-500", icon: Mic },
] as const;

function Reveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const initial = {
    up: { opacity: 0, y: 40 },
    left: { opacity: 0, x: -40 },
    right: { opacity: 0, x: 40 },
    none: { opacity: 0 },
  }[direction];

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : initial}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Stats counter item ───────────────────────────────────────────────────────
function StatItem({
  value,
  suffix,
  label,
  shouldStart,
}: {
  value: number;
  suffix: string;
  label: string;
  shouldStart: boolean;
}) {
  const count = useCountUp(value, 2000, shouldStart);
  return (
    <div className="text-center">
      <p className="font-serif text-[48px] font-black leading-none text-white">
        {value >= 1000 ? `${Math.floor(count / 1000)}K` : count}
        {suffix}
      </p>
      <p className="mt-1 text-[14px] font-medium text-white/60">{label}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes shimmer {
          from { transform: translateX(-150%) skewX(-20deg); }
          to   { transform: translateX(250%) skewX(-20deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(24,140,124,0.5); }
          50%       { box-shadow: 0 0 0 16px rgba(24,140,124,0); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes borderGlow {
          0%, 100% { border-color: rgba(255,255,255,0.15); }
          50%       { border-color: rgba(255,255,255,0.4); }
        }
        .float-card { animation: float 4s ease-in-out infinite; }
        .shimmer-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: shimmer 2.5s infinite;
        }
        .gradient-text {
          background: linear-gradient(135deg, #a7f3d0 0%, #5eead4 40%, #a7f3d0 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 4s ease infinite;
        }
        .pulse-btn { animation: pulseGlow 2.5s ease-in-out infinite; }
        .card-hover {
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-8px) scale(1.01);
          box-shadow: 0 24px 48px -12px rgba(0,0,0,0.15);
        }
        .glow-border {
          animation: borderGlow 3s ease-in-out infinite;
        }
        .bar-fill { transition: width 1.4s cubic-bezier(0.22, 1, 0.36, 1); }
      `}</style>

      <div className="w-full overflow-x-hidden bg-white">
        {/* ── NAVBAR ──────────────────────────────────────────────────────── */}
        <motion.header
          className={cn(
            "sticky top-0 z-50 border-b transition-all duration-300",
            scrolled
              ? "border-teal-600/20 bg-white/90 shadow-sm backdrop-blur-md"
              : "border-transparent bg-transparent"
          )}
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <nav className="mx-auto flex h-[80px] max-w-7xl items-center justify-between px-6">
            <div className="flex items-center gap-2">
              <div className="flex h-[41px] w-[41px] items-center justify-center rounded-xl bg-teal-100">
                <Image src="/icons/icon.svg" width={25} height={25} alt="LinguaPanda" />
              </div>
              <span className="font-serif text-[24px] tracking-tight text-[#0d3d38]">
                LinguaPanda
              </span>
            </div>

            <div className="flex items-center gap-10 text-[14px] font-medium text-slate-500">
              {["Features", "How it works"].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="group relative transition-colors hover:text-teal-700"
                >
                  {item}
                  <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 rounded-full bg-teal-500 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={ROUTES.LOGIN}
                className="rounded-xl px-4 py-2 text-[14px] font-bold text-slate-600 transition-all hover:bg-slate-50 hover:text-teal-700"
              >
                Sign in
              </Link>
              <Link
                href={ROUTES.LOGIN}
                className="shimmer-btn relative flex items-center gap-2 overflow-hidden rounded-3xl bg-[#188c7c] px-6 py-3 text-[14px] font-bold text-white shadow-[0_10px_15px_-3px_rgba(24,140,124,0.25)] transition-all hover:scale-105 hover:bg-[#157868] hover:shadow-[0_15px_20px_-3px_rgba(24,140,124,0.35)]"
              >
                Get started free
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </nav>
        </motion.header>

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-[#125f53] px-6 py-28">
          {/* Animated background mesh */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-teal-400/10 blur-3xl"
              animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-32 right-0 h-[400px] w-[400px] rounded-full bg-emerald-300/10 blur-3xl"
              animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
          </div>

          <div className="relative mx-auto flex max-w-7xl items-center gap-16">
            {/* Left */}
            <div className="flex-1 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm"
              >
                <span className="text-yellow-300">✨</span>
                <span className="text-[14px] font-medium text-white">
                  AI-Powered English Learning
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif text-[72px] font-black leading-[1] text-white"
              >
                English that
                <br />
                <span>adapts </span>
                <em className="gradient-text not-italic">to you.</em>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="max-w-lg text-[18px] leading-relaxed text-white/80"
              >
                Personalized paths for Vietnamese learners to master English faster. LinguaPanda
                learns your strengths and weaknesses to guide you toward fluency.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-center gap-4"
              >
                <Link
                  href={ROUTES.LOGIN}
                  className="pulse-btn rounded-3xl bg-white px-8 py-[18px] text-[18px] font-bold text-[#0d3d38] transition-all hover:scale-105 hover:bg-slate-50"
                >
                  Start for free
                </Link>
                <Link
                  href="#how-it-works"
                  className="group flex items-center gap-2 rounded-3xl border border-white/30 px-8 py-[18px] text-[18px] font-bold text-white transition-all hover:border-white/50 hover:bg-white/10"
                >
                  See how it works
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>

              {/* Social proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-3"
              >
                <div className="flex -space-x-2">
                  {["🧑‍💻", "👩‍🎓", "👨‍🏫", "👩‍💼"].map((e, i) => (
                    <div
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-teal-700 bg-teal-600 text-[14px]"
                    >
                      {e}
                    </div>
                  ))}
                </div>
                <p className="text-[14px] text-white/70">
                  <span className="font-bold text-white">10,000+</span> learners already improving
                </p>
              </motion.div>
            </div>

            {/* Right — floating card */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-1 justify-center"
            >
              <div className="float-card relative w-[448px]">
                <div className="glow-border absolute -inset-6 rounded-2xl border-2 border-white/20" />
                <div className="relative rounded-2xl bg-white p-8 shadow-[0_25px_60px_-12px_rgba(0,0,0,0.4)]">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        Your Proficiency
                      </p>
                      <p className="font-sans text-[24px] font-bold text-slate-800">Intermediate</p>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="cursor-default rounded-2xl border border-teal-200 bg-teal-50 px-4 py-2"
                    >
                      <span className="font-bold text-teal-600">CEFR B1</span>
                    </motion.div>
                  </div>

                  {/* Progress dots */}
                  <div className="mb-6 flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
                        className="h-2 flex-1 origin-left rounded-full bg-teal-500"
                      />
                    ))}
                    {[4, 5].map((i) => (
                      <div key={i} className="h-2 flex-1 rounded-full bg-slate-100" />
                    ))}
                  </div>

                  {/* Skill bars */}
                  <div className="space-y-4">
                    {SKILL_BARS.map((s, i) => (
                      <div key={s.label}>
                        <div className="mb-1.5 flex items-center justify-between">
                          <div
                            className={cn("flex items-center gap-2 text-[13px] font-bold", s.text)}
                          >
                            <s.icon className="h-[13px] w-[13px]" />
                            {s.label}
                          </div>
                          <span className="text-[13px] font-bold text-slate-500">{s.pct}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${s.pct}%` }}
                            transition={{
                              delay: 0.7 + i * 0.15,
                              duration: 1,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className={cn("h-full rounded-full", s.color)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Checkmarks */}
                  <div className="mt-5 space-y-1.5 border-t border-slate-100 pt-4">
                    {["Personalized plan generated", "Next lesson ready"].map((t) => (
                      <div key={t} className="flex items-center gap-2 text-[13px] text-slate-500">
                        <CheckCircle2 className="h-4 w-4 text-teal-500" />
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── STATS BAR ───────────────────────────────────────────────────── */}
        <div ref={statsRef} className="bg-[#0d3d38] py-12">
          <div className="mx-auto grid max-w-5xl grid-cols-4 gap-8 px-6">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.1}>
                <StatItem
                  value={s.value}
                  suffix={s.suffix}
                  label={s.label}
                  shouldStart={statsInView}
                />
              </Reveal>
            ))}
          </div>
        </div>

        {/* ── THREE SKILLS ────────────────────────────────────────────────── */}
        <section className="bg-slate-50 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal className="mb-12 text-center">
              <h2 className="font-serif text-[36px] font-bold text-slate-800">
                Three skills. One platform.
              </h2>
            </Reveal>

            <div className="grid grid-cols-3 gap-8">
              {SKILLS.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.15} direction="up">
                  <motion.div
                    whileHover={{ y: -10, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="group cursor-default rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/60"
                  >
                    <motion.div
                      whileHover={{ rotate: [0, -8, 8, 0] }}
                      transition={{ duration: 0.4 }}
                      className={cn(
                        "mb-5 flex h-14 w-14 items-center justify-center rounded-3xl transition-transform",
                        i === 0 ? "bg-teal-100" : i === 1 ? "bg-violet-100" : "bg-orange-100"
                      )}
                    >
                      <s.icon
                        className={cn(
                          "h-6 w-6",
                          i === 0
                            ? "text-teal-600"
                            : i === 1
                              ? "text-violet-600"
                              : "text-orange-500"
                        )}
                      />
                    </motion.div>
                    <h3 className="mb-3 font-sans text-[20px] font-bold text-slate-800">
                      {s.label}
                    </h3>
                    <p className="text-[16px] leading-relaxed text-slate-500">{s.desc}</p>

                    {/* Hover accent line */}
                    <div
                      className={cn(
                        "mt-5 h-0.5 w-0 rounded-full transition-all duration-500 group-hover:w-full",
                        i === 0 ? "bg-teal-400" : i === 1 ? "bg-violet-400" : "bg-orange-400"
                      )}
                    />
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ────────────────────────────────────────────────────── */}
        <section id="features" className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal className="mb-12">
              <h2 className="font-serif text-[36px] font-bold text-slate-800">Our Features</h2>
              <p className="mt-2 text-[18px] text-slate-500">
                Everything you need to reach fluency faster than traditional methods.
              </p>
            </Reveal>

            <div className="grid grid-cols-2 gap-4">
              {FEATURES.map((f, i) => (
                <Reveal key={f.title} delay={i * 0.12} direction={i % 2 === 0 ? "left" : "right"}>
                  <motion.div
                    onHoverStart={() => setHoveredFeature(i)}
                    onHoverEnd={() => setHoveredFeature(null)}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="group relative flex cursor-default gap-6 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 p-6"
                  >
                    {/* Hover bg */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-teal-50 to-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredFeature === i ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />

                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm"
                    >
                      <f.icon className="h-[18px] w-[18px] text-teal-600" />
                    </motion.div>
                    <div className="relative">
                      <h4 className="mb-2 font-sans text-[18px] font-bold text-slate-800">
                        {f.title}
                      </h4>
                      <p className="text-[15px] leading-relaxed text-slate-500">{f.desc}</p>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
        <section
          id="how-it-works"
          className="py-24"
          style={{ background: "linear-gradient(138deg, #0d3d38 0%, #188c7c 100%)" }}
        >
          <div className="mx-auto max-w-7xl px-6">
            <Reveal className="mb-20 text-center">
              <h2 className="font-serif text-[36px] font-bold text-white">How LinguaPanda works</h2>
            </Reveal>

            <div className="relative">
              {/* Connecting line */}
              <div className="absolute left-0 right-0 top-[24px] h-px bg-white/15" />

              <div className="relative grid grid-cols-4 gap-6">
                {STEPS.map((step, i) => (
                  <Reveal key={step.num} delay={i * 0.12} direction="up">
                    <motion.div
                      whileHover={{ y: -8, backgroundColor: "rgba(255,255,255,0.18)" }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="cursor-default rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm"
                    >
                      {/* Number badge */}
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg"
                      >
                        <span className="font-sans text-[20px] font-bold text-[#0d3d38]">
                          {step.num}
                        </span>
                      </motion.div>

                      <h4 className="mb-2 text-center font-sans text-[18px] font-bold text-white">
                        {step.title}
                      </h4>
                      <p className="text-center text-[14px] leading-relaxed text-white/70">
                        {step.desc}
                      </p>

                      {/* Icon */}
                      <div className="mt-5 flex justify-center">
                        <step.icon className="h-5 w-5 text-white/30" />
                      </div>
                    </motion.div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <section className="bg-white py-24">
          <Reveal direction="none">
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 px-6 text-center">
              <motion.span
                animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="inline-block text-[64px]"
              >
                🐼
              </motion.span>

              <h2 className="font-serif text-[48px] font-black leading-tight text-slate-800">
                Ready to start your journey?
              </h2>
              <p className="text-[20px] leading-relaxed text-slate-500">
                Join thousands of learners mastering English with AI that actually understands them.
              </p>

              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href={ROUTES.LOGIN}
                  className="pulse-btn shimmer-btn relative flex items-center gap-3 overflow-hidden rounded-2xl bg-[#188c7c] px-12 py-5 text-[20px] font-bold text-white shadow-[0_25px_50px_-12px_rgba(24,140,124,0.3)]"
                >
                  Get Started for Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>

              <p className="text-[14px] text-slate-400">No credit card required • Cancel anytime</p>
            </div>
          </Reveal>
        </section>

        {/* ── FOOTER ──────────────────────────────────────────────────────── */}
        <footer className="bg-[#111827] py-16">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal className="mb-8 flex items-center justify-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center">
                <Image
                  src="/icons/icon.svg"
                  width={20}
                  height={20}
                  alt="logo"
                  className="brightness-0 invert"
                />
              </div>
              <span className="font-serif text-[24px] tracking-tight text-white">LinguaPanda</span>
            </Reveal>

            <div className="mb-8 flex items-center justify-center gap-8 border-b border-[#1e293b] pb-8 text-[14px] font-medium text-slate-400">
              {["Privacy Policy", "Terms of Service", "Contact Us", "Blog"].map((l) => (
                <motion.a
                  key={l}
                  href="#"
                  whileHover={{ color: "#ffffff", y: -2 }}
                  className="transition-colors"
                >
                  {l}
                </motion.a>
              ))}
            </div>

            <p className="text-center text-[14px] text-slate-500">
              © 2024 LinguaPanda. Designed with ❤️ for Vietnamese learners.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}