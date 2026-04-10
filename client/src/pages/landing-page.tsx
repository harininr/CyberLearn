 
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
  useMotionValue,
} from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Shield, Cpu, Key, Hash, Bug, Code, Users, Zap, Lock,
  CheckCircle, Star, Github, ArrowRight, ChevronDown,
  Terminal, Fingerprint, Database, Globe, BarChart3,
  Layers, Radio, Wifi, Activity, Award, BookOpen,
  Target, Rocket, Play, ChevronRight, X, Menu,
  ExternalLink, Mail, Twitter, Linkedin, AlertTriangle,
  Info, Sparkles,
} from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";

/* ─────────────────────────────────────────────
   ANIMATION VARIANTS
───────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.12 },
  }),
};

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.1 },
  }),
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.1 },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1], delay: i * 0.08 },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ─────────────────────────────────────────────
   REUSABLE: GLOW BLOB
───────────────────────────────────────────── */

function GlowBlob({
  color = "cyan",
  size = 600,
  blur = 120,
  opacity = 0.06,
  className = "",
}: {
  color?: string;
  size?: number;
  blur?: number;
  opacity?: number;
  className?: string;
}) {
  const colorMap: Record<string, string> = {
    cyan: "bg-cyan-500",
    violet: "bg-violet-500",
    emerald: "bg-emerald-500",
    rose: "bg-rose-500",
    yellow: "bg-yellow-500",
    sky: "bg-sky-500",
    pink: "bg-pink-500",
  };
  return (
    <div
      aria-hidden="true"
      className={`absolute rounded-full pointer-events-none ${colorMap[color] ?? "bg-cyan-500"} ${className}`}
      style={{ width: size, height: size, filter: `blur(${blur}px)`, opacity }}
    />
  );
}

/* ─────────────────────────────────────────────
   REUSABLE: SECTION LABEL
───────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-xs font-semibold tracking-[0.18em] uppercase mb-4"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <Sparkles className="w-3 h-3" aria-hidden="true" />
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: ANIMATED CURSOR
───────────────────────────────────────────── */

function AnimatedCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 40 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 40 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    const onEnter = () => setHovered(true);
    const onLeave = () => setHovered(false);

    window.addEventListener("mousemove", onMove);
    document.querySelectorAll("button,a,[data-hover]").forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });
    return () => window.removeEventListener("mousemove", onMove);
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          className="rounded-full border border-cyan-400"
          animate={{ width: hovered ? 48 : 28, height: hovered ? 48 : 28, opacity: hovered ? 0.7 : 0.4 }}
          transition={{ duration: 0.18 }}
        />
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
      </motion.div>
    </>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: PARTICLE FIELD
───────────────────────────────────────────── */

const PARTICLE_DATA = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  fontSize: Math.random() * 10 + 7,
  duration: Math.random() * 22 + 14,
  delay: Math.random() * -22,
  char: ["0", "1", "A", "F", "7", "E", "3", "B", "#", "$", "░", "▒", "{", "}"][
    Math.floor(Math.random() * 14)
  ],
  opacity: Math.random() * 0.12 + 0.025,
}));

function ParticleField() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {PARTICLE_DATA.map((p) => (
        <motion.span
          key={p.id}
          className="absolute font-mono text-cyan-400 select-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: p.fontSize,
            opacity: p.opacity,
          }}
          animate={{ y: [0, -90, 0], opacity: [p.opacity, p.opacity * 3.5, p.opacity] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
        >
          {p.char}
        </motion.span>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: TYPEWRITER
───────────────────────────────────────────── */

function Typewriter({ words }: { words: string[] }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[idx];
    const timeout = setTimeout(
      () => {
        if (!deleting && displayed.length < word.length) {
          setDisplayed(word.slice(0, displayed.length + 1));
        } else if (!deleting && displayed.length === word.length) {
          setTimeout(() => setDeleting(true), 2200);
        } else if (deleting && displayed.length > 0) {
          setDisplayed(displayed.slice(0, -1));
        } else {
          setDeleting(false);
          setIdx((idx + 1) % words.length);
        }
      },
      deleting ? 42 : 80
    );
    return () => clearTimeout(timeout);
  }, [displayed, deleting, idx, words]);

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-400">
      {displayed}
      <motion.span
        className="inline-block w-0.5 h-[0.85em] bg-cyan-400 ml-1 align-middle"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.85, repeat: Infinity }}
      />
    </span>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: NAV BAR
───────────────────────────────────────────── */

function NavBar({ onScrollTo }: { onScrollTo: (id: string) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const navLinks = [
    { label: "Features", id: "features" },
    { label: "How It Works", id: "how" },
    { label: "Outcomes", id: "outcomes" },
    { label: "Demo", id: "demo" },
    { label: "Pricing", id: "pricing" },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-gray-950/85 backdrop-blur-2xl border-b border-white/8 shadow-2xl shadow-black/40"
          : "bg-transparent"
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" aria-label="CyberLearn home">
          <motion.div
            className="flex items-center gap-2.5 cursor-pointer"
            whileHover={{ scale: 1.03 }}
          >
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 rounded-lg bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center">
                <Lock className="w-[18px] h-[18px] text-cyan-400" aria-hidden="true" />
              </div>
              <motion.div
                className="absolute inset-0 rounded-lg border border-cyan-400/30"
                animate={{ scale: [1, 1.45, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.6, repeat: Infinity }}
                aria-hidden="true"
              />
            </div>
            <div className="leading-none">
              <span className="text-white font-bold text-[15px] tracking-tight block">
                CyberLearn
              </span>
              <span className="hidden sm:block text-cyan-400 text-[9px] font-mono tracking-[0.2em] uppercase mt-px">
                Simulator
              </span>
            </div>
          </motion.div>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden lg:flex items-center gap-0.5"
          aria-label="Primary navigation"
        >
          {navLinks.map((l) => (
            <button
              key={l.id}
              onClick={() => onScrollTo(l.id)}
              className="px-4 py-2 text-[13px] text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200 font-medium"
            >
              {l.label}
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/harininr/CyberLearn"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center text-gray-400 hover:text-white transition-colors"
            aria-label="View source on GitHub"
          >
            <Github className="w-4.5 h-4.5" />
          </a>
          <Link href="/auth">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Button className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-sky-500 text-white text-[13px] px-5 py-2 rounded-xl shadow-lg shadow-cyan-600/20 font-semibold transition-all">
                Launch App
              </Button>
            </motion.div>
          </Link>
          <button
            className="lg:hidden p-1.5 text-gray-400 hover:text-white transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="lg:hidden bg-gray-950/95 backdrop-blur-2xl border-b border-white/8 px-5 py-3 flex flex-col gap-0.5"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  onScrollTo(l.id);
                  setMenuOpen(false);
                }}
                className="text-left px-4 py-2.5 text-sm text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-all font-medium"
              >
                {l.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: HERO SECTION
───────────────────────────────────────────── */

function HeroSection({ onScrollTo }: { onScrollTo: (id: string) => void }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // 3-D tilt on preview card
  const cardRef = useRef<HTMLDivElement>(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRotX = useSpring(rotX, { stiffness: 180, damping: 28 });
  const sRotY = useSpring(rotY, { stiffness: 180, damping: 28 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    rotX.set(((e.clientY - rect.top - rect.height / 2) / rect.height) * -12);
    rotY.set(((e.clientX - rect.left - rect.width / 2) / rect.width) * 12);
  };
  const handleMouseLeave = () => {
    rotX.set(0);
    rotY.set(0);
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-16 px-5 font-sans"
      aria-labelledby="hero-heading"
    >
      {/* Parallax BG photo */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')",
            filter: "blur(3px) brightness(0.12) saturate(0.6)",
          }}
        />
      </motion.div>

      {/* Glow blobs */}
      <GlowBlob color="cyan" size={750} blur={150} opacity={0.07} className="-top-40 left-1/2 -translate-x-1/2" />
      <GlowBlob color="violet" size={500} blur={100} opacity={0.05} className="top-1/3 -left-48" />
      <GlowBlob color="sky" size={400} blur={90} opacity={0.04} className="bottom-0 -right-20" />

      {/* Content */}
      <motion.div
        style={{ opacity: sectionOpacity }}
        className="relative z-10 w-full max-w-6xl mx-auto text-center"
      >
        {/* Status badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/8 text-emerald-400 text-xs font-semibold tracking-wide mb-8"
          variants={scaleIn}
          initial="hidden"
          animate="visible"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          All Labs Online · 8 Security Modules · Zero Setup Required
        </motion.div>

        {/* Main heading */}
        <motion.h1
          id="hero-heading"
          className="text-3xl sm:text-3xl md:text-4xl lg:text-7xl font-black text-white leading-[1.02] tracking-tight mb-6"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.5}
        >
          The Future of
          <br />
          <Typewriter
            words={[
              "Cybersecurity",
              "Encryption Labs",
              "Attack Simulation",
              "Secure Coding",
              "Ethical Hacking",
            ]}
          />
          <br />
        </motion.h1>

        {/* Sub */}
        <motion.p
          className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          CyberLearn Simulator places you inside real-world security scenarios —
          hands-on labs for encryption, RBAC, digital signatures, hashing, and live
          attack simulations.{" "}
          <span className="text-gray-300 font-medium">
            No setup. No risk. No excuses.
          </span>
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1.5}
        >
          <Link href="/auth" aria-label="Get started with CyberLearn — free">
            <motion.div
              whileHover={{ scale: 1.07, boxShadow: "0 0 44px rgba(6,182,212,0.38)" }}
              whileTap={{ scale: 0.95 }}
              className="rounded-xl"
            >
              <Button className="bg-gradient-to-r from-cyan-600 via-cyan-500 to-sky-500 hover:from-cyan-500 hover:to-sky-400 text-white text-base md:text-lg px-10 py-3.5 rounded-xl flex items-center gap-3 font-bold shadow-2xl shadow-cyan-600/30 transition-all">
                <Rocket className="w-5 h-5" aria-hidden="true" />
                Start For Free
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Button>
            </motion.div>
          </Link>

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Button
              variant="outline"
              onClick={() => onScrollTo("features")}
              className="border-white/15 text-gray-300 hover:text-white hover:border-cyan-500/40 bg-white/5 hover:bg-cyan-500/5 text-base md:text-lg px-8 py-3.5 rounded-xl flex items-center gap-2.5 font-medium transition-all backdrop-blur-sm"
              aria-label="Explore security modules"
            >
              <Play className="w-4 h-4 text-cyan-400" aria-hidden="true" />
              Explore Modules
            </Button>
          </motion.div>
        </motion.div>

        {/* 3-D Hero Preview Card */}
        <motion.div
          ref={cardRef}
          className="relative mx-auto max-w-3xl"
          style={{
            rotateX: sRotX,
            rotateY: sRotY,
            transformPerspective: 1000,
            transformStyle: "preserve-3d",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          custom={2}
        >

         </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.button
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-gray-600 hover:text-gray-400 transition-colors"
        onClick={() => onScrollTo("features")}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        aria-label="Scroll down to explore features"
      >
        <ChevronDown className="w-6 h-6" />
      </motion.button>
    </section>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: TRUST STRIP (Infinite marquee)
───────────────────────────────────────────── */

const TRUST_ITEMS = [
  { icon: <Shield className="w-4 h-4" />, label: "OWASP Top 10 Covered" },
  { icon: <Lock className="w-4 h-4" />, label: "AES-256 Encrypted Labs" },
  { icon: <Award className="w-4 h-4" />, label: "Industry-Aligned Curriculum" },
  { icon: <Globe className="w-4 h-4" />, label: "Access From Anywhere" },
  { icon: <Fingerprint className="w-4 h-4" />, label: "Zero Data Collection" },
  { icon: <Database className="w-4 h-4" />, label: "SQLite-Backed Storage" },
  { icon: <Terminal className="w-4 h-4" />, label: "Real CLI Environments" },
  { icon: <BarChart3 className="w-4 h-4" />, label: "Progress Analytics" },
  { icon: <CheckCircle className="w-4 h-4" />, label: "PBKDF2 & bcrypt Labs" },
  { icon: <Activity className="w-4 h-4" />, label: "Instant Feedback Loop" },
];

function TrustStrip() {
  return (
    <div
      className="relative z-10 border-y border-white/5 bg-white/[0.012] py-5 overflow-hidden"
      aria-label="Platform highlights"
    >
      {/* Left / right fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-950 to-transparent z-10 pointer-events-none" aria-hidden="true" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-950 to-transparent z-10 pointer-events-none" aria-hidden="true" />

      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 32, ease: "linear", repeat: Infinity }}
      >
        {[...TRUST_ITEMS, ...TRUST_ITEMS].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 text-gray-500 text-sm font-medium shrink-0"
          >
            <span className="text-cyan-500/55">{item.icon}</span>
            {item.label}
            <span className="text-gray-700 ml-6">·</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DATA: FEATURE MODULES
───────────────────────────────────────────── */

const FEATURES = [
  {
    icon: <Shield className="w-7 h-7" />,
    gradient: "from-cyan-500/14 to-cyan-600/4",
    border: "border-cyan-500/20 hover:border-cyan-400/50",
    iconBg: "bg-cyan-500/15 text-cyan-400",
    title: "Authentication",
    tagline: "Secure every entry point",
    benefit:
      "Build battle-tested login systems with PBKDF2/bcrypt password hashing, TOTP-based MFA, and JWT session management — the exact patterns used at FAANG companies.",
    tags: ["Password Hashing", "MFA / TOTP", "JWT Tokens", "Session Security"],
    demoLines: [
      { label: "Hash Algorithm", value: "bcrypt + salt", color: "text-cyan-300" },
      { label: "Rounds", value: "12", color: "text-emerald-300" },
      { label: "MFA", value: "TOTP Enabled", color: "text-emerald-300" },
    ],
  },
  {
    icon: <Users className="w-7 h-7" />,
    gradient: "from-emerald-500/14 to-emerald-600/4",
    border: "border-emerald-500/20 hover:border-emerald-400/50",
    iconBg: "bg-emerald-500/15 text-emerald-400",
    title: "Access Control",
    tagline: "Define who sees what",
    benefit:
      "Design role hierarchies, write permission policies, and enforce least-privilege principles across multi-tenant architectures with visual policy builders.",
    tags: ["RBAC", "Policies", "Least Privilege", "Multi-tenant"],
    demoLines: [
      { label: "Role", value: "admin > editor > viewer", color: "text-emerald-300" },
      { label: "Permissions", value: "read | write | delete", color: "text-cyan-300" },
      { label: "Policy", value: "DENY by default", color: "text-rose-300" },
    ],
  },
  {
    icon: <Cpu className="w-7 h-7" />,
    gradient: "from-violet-500/14 to-violet-600/4",
    border: "border-violet-500/20 hover:border-violet-400/50",
    iconBg: "bg-violet-500/15 text-violet-400",
    title: "Cryptography",
    tagline: "Encrypt everything",
    benefit:
      "Run AES-256-CBC and RSA-4096 labs interactively — input plaintext, receive ciphertext, inspect IVs and keys. Cryptography becomes tactile, not theoretical.",
    tags: ["AES-256", "RSA-4096", "Key Exchange", "IV Management"],
    demoLines: [
      { label: "Cipher", value: "AES-256-CBC", color: "text-violet-300" },
      { label: "Key size", value: "256 bits", color: "text-cyan-300" },
      { label: "Padding", value: "PKCS7", color: "text-orange-300" },
    ],
  },
  {
    icon: <Hash className="w-7 h-7" />,
    gradient: "from-orange-500/14 to-orange-600/4",
    border: "border-orange-500/20 hover:border-orange-400/50",
    iconBg: "bg-orange-500/15 text-orange-400",
    title: "Hashing",
    tagline: "Prove data integrity",
    benefit:
      "Compare MD5, SHA-1, SHA-256, and BLAKE3 side-by-side. Understand why collision-resistant hashing is the foundation of every secure data pipeline.",
    tags: ["SHA-256", "BLAKE3", "HMAC", "Integrity Checks"],
    demoLines: [
      { label: "Algorithm", value: "SHA-256", color: "text-orange-300" },
      { label: "Output size", value: "256 bits", color: "text-cyan-300" },
      { label: "HMAC", value: "Enabled", color: "text-emerald-300" },
    ],
  },
  {
    icon: <Key className="w-7 h-7" />,
    gradient: "from-rose-500/14 to-rose-600/4",
    border: "border-rose-500/20 hover:border-rose-400/50",
    iconBg: "bg-rose-500/15 text-rose-400",
    title: "Digital Signatures",
    tagline: "Sign with certainty",
    benefit:
      "Create and verify RSA and ECDSA digital signatures, explore non-repudiation guarantees, and use real signing APIs — the backbone of blockchain and secure APIs.",
    tags: ["RSA Signing", "ECDSA", "Non-repudiation", "Signing APIs"],
    demoLines: [
      { label: "Scheme", value: "ECDSA P-256", color: "text-rose-300" },
      { label: "Verified", value: "✓ Authentic", color: "text-emerald-300" },
      { label: "Tampered", value: "✗ INVALID", color: "text-rose-300" },
    ],
  },
  {
    icon: <Code className="w-7 h-7" />,
    gradient: "from-sky-500/14 to-sky-600/4",
    border: "border-sky-500/20 hover:border-sky-400/50",
    iconBg: "bg-sky-500/15 text-sky-400",
    title: "Encoding",
    tagline: "Speak every protocol",
    benefit:
      "Master Base64, Hex, URL, HTML entity, and Unicode encoding/decoding — the glue between every web API, database, and network protocol you'll ever touch.",
    tags: ["Base64", "Hex", "URL Encoding", "Unicode"],
    demoLines: [
      { label: "Input", value: "Hello World!", color: "text-white" },
      { label: "Base64", value: "SGVsbG8gV29ybGQh", color: "text-sky-300" },
      { label: "Hex", value: "48656c6c6f...", color: "text-orange-300" },
    ],
  },
  {
    icon: <Zap className="w-7 h-7" />,
    gradient: "from-yellow-500/14 to-yellow-600/4",
    border: "border-yellow-500/20 hover:border-yellow-400/50",
    iconBg: "bg-yellow-500/15 text-yellow-400",
    title: "Attack Simulator",
    tagline: "Think like an attacker",
    benefit:
      "Launch brute-force, rainbow-table, and dictionary attacks against simulated targets. See exactly why weak passwords fail in seconds — and how to stop it.",
    tags: ["Brute Force", "Rainbow Table", "Dictionary", "Rate Limiting"],
    demoLines: [
      { label: "Mode", value: "Brute Force", color: "text-yellow-300" },
      { label: "Attempts", value: "4,294,967,296", color: "text-rose-300" },
      { label: "ETA (weak pw)", value: "~2.3 seconds", color: "text-rose-300" },
    ],
  },
  {
    icon: <Bug className="w-7 h-7" />,
    gradient: "from-pink-500/14 to-pink-600/4",
    border: "border-pink-500/20 hover:border-pink-400/50",
    iconBg: "bg-pink-500/15 text-pink-400",
    title: "Vulnerability Labs",
    tagline: "Exploit. Understand. Patch.",
    benefit:
      "Get hands-on with SQL injection, XSS, CSRF, broken auth, and insecure deserialization in fully isolated sandboxes — then fix each vulnerability yourself.",
    tags: ["SQL Injection", "XSS", "CSRF", "Broken Auth"],
    demoLines: [
      { label: "CVE Class", value: "SQL Injection", color: "text-pink-300" },
      { label: "Severity", value: "CRITICAL", color: "text-rose-300" },
      { label: "Patched by", value: "You ✓", color: "text-emerald-300" },
    ],
  },
];

/* ─────────────────────────────────────────────
   COMPONENT: FEATURE CARD
───────────────────────────────────────────── */

function FeatureCard({ f, i }: { f: (typeof FEATURES)[0]; i: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.article
      className={`group relative rounded-2xl border bg-gradient-to-br ${f.gradient} ${f.border} p-6 cursor-pointer transition-all duration-300 shadow-xl overflow-hidden`}
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
      custom={i * 0.35}
      whileHover={{ y: -6, scale: 1.015 }}
      onClick={() => setExpanded(!expanded)}
      aria-expanded={expanded}
      role="button"
    >
      {/* Shimmer top edge */}
      <div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        aria-hidden="true"
      />
      {/* Corner sparkle */}
      <motion.div
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        animate={{ rotate: [0, 90, 0] }}
        transition={{ duration: 4.5, repeat: Infinity }}
        aria-hidden="true"
      >
        <Sparkles className="w-4 h-4 text-white/15" />
      </motion.div>

      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-xl ${f.iconBg} flex items-center justify-center mb-5 border border-white/5 transition-transform group-hover:scale-110 duration-300`}
      >
        {f.icon}
      </div>

      <p className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.15em] mb-1">
        {f.tagline}
      </p>
      <h3 className="text-[17px] font-bold text-white mb-3">{f.title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed mb-4">{f.benefit}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {f.tags.map((t) => (
          <span
            key={t}
            className="px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-[11px] text-gray-400 font-mono"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Toggle */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500 group-hover:text-gray-300 transition-colors">
        <span>{expanded ? "Hide" : "Preview"} live output</span>
        <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
        </motion.div>
      </div>

      {/* Expanded mini demo */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28 }}
            className="mt-4 rounded-xl bg-gray-950/75 border border-white/8 p-4 font-mono"
          >
            <p className="text-[10px] text-gray-600 mb-3 uppercase tracking-widest">
              Live Lab Preview
            </p>
            {f.demoLines.map((line, li) => (
              <motion.div
                key={li}
                className="flex justify-between items-center text-xs py-1.5 border-b border-white/5 last:border-0"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: li * 0.1 }}
              >
                <span className="text-gray-600">{line.label}</span>
                <span className={`${line.color} font-bold`}>{line.value}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: FEATURES SECTION
───────────────────────────────────────────── */

function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative z-10 py-28 px-5"
      aria-labelledby="features-heading"
    >
      <GlowBlob color="cyan" size={600} blur={120} opacity={0.035} className="top-0 left-1/2 -translate-x-1/2" />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <SectionLabel>8 Security Modules</SectionLabel>
          <motion.h2
            id="features-heading"
            className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Everything a Security Engineer
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-400">
              Needs to Know
            </span>
          </motion.h2>
          <motion.p
            className="text-gray-400 max-w-xl mx-auto text-lg"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.5}
          >
            Click any card to preview live lab output. Every module ships with
            interactive labs, real code output, and an instant feedback loop.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} f={f} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: HOW IT WORKS
───────────────────────────────────────────── */

const HOW_STEPS = [
  {
    num: "01",
    icon: <BookOpen className="w-7 h-7 text-cyan-400" />,
    title: "Choose Your Module",
    desc: "Pick from 8 curated security modules — each scoped to a single concept so you build genuine expertise, not surface-level familiarity.",
    detail: "Auth · Cryptography · Hashing · RBAC · Digital Signatures · Encoding · Attack Sim · Vuln Labs",
  },
  {
    num: "02",
    icon: <Terminal className="w-7 h-7 text-violet-400" />,
    title: "Run the Lab",
    desc: "Type inputs, click buttons, and watch real outputs appear instantly. Every lab uses the same libraries your production code uses.",
    detail: "Node crypto · OpenSSL · bcrypt · jose · SQLite · Express middleware",
  },
  {
    num: "03",
    icon: <Target className="w-7 h-7 text-emerald-400" />,
    title: "Get Instant Feedback",
    desc: "Colour-coded results, error explanations, and next-step hints keep you unblocked. There's no grading queue — results are immediate.",
    detail: "Real errors · Color-coded output · Embedded hints · Step-by-step breakdowns",
  },
  {
    num: "04",
    icon: <Award className="w-7 h-7 text-yellow-400" />,
    title: "Master & Ship",
    desc: "By the end of each module you've written real security code — code you can reference, reuse, and demo in interviews.",
    detail: "Code snippets you own · Portfolio-ready artefacts · Interview-ready skills",
  },
];

function HowItWorksSection() {
  return (
    <section
      id="how"
      className="relative z-10 py-28 px-5 bg-white/[0.015] border-y border-white/5"
      aria-labelledby="how-heading"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <SectionLabel>The Process</SectionLabel>
          <motion.h2
            id="how-heading"
            className="text-4xl md:text-5xl font-black text-white mb-4"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            From Zero to
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              {" "}Security Hero
            </span>
          </motion.h2>
          <motion.p
            className="text-gray-400 max-w-lg mx-auto"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.5}
          >
            A tight four-step loop that takes you from concept to battle-tested code.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 relative">
          {/* Connector line on XL */}
          <div
            className="hidden xl:block absolute top-16 left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
            aria-hidden="true"
          />

          {HOW_STEPS.map((s, i) => (
            <motion.div
              key={i}
              className="relative flex flex-col items-center text-center p-7 rounded-2xl border border-white/8 bg-white/[0.02] hover:border-cyan-500/30 hover:bg-cyan-500/3 transition-all group"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              whileHover={{ y: -5 }}
            >
              {/* Big step number bg */}
              <div className="text-6xl font-black text-white/4 absolute top-4 right-5 font-mono select-none">
                {s.num}
              </div>

              {/* Icon */}
              <div className="relative w-16 h-16 rounded-2xl bg-gray-900 border border-white/8 flex items-center justify-center mb-5 group-hover:border-white/15 transition-all">
                {s.icon}
                <motion.div
                  className="absolute inset-0 rounded-2xl border border-cyan-500/20"
                  animate={{ scale: [1, 1.28, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.6 }}
                  aria-hidden="true"
                />
              </div>

              <h3 className="text-base font-bold text-white mb-3">{s.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">{s.desc}</p>
              <p className="text-[11px] text-gray-600 font-mono leading-relaxed">{s.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: LEARNING OUTCOMES
───────────────────────────────────────────── */

const OUTCOMES = [
  { skill: "Implement secure password storage with PBKDF2 and bcrypt", level: 95, role: "Backend Engineer" },
  { skill: "Design and enforce enterprise RBAC policy hierarchies", level: 90, role: "Security Architect" },
  { skill: "Encrypt and decrypt data end-to-end using AES-256-CBC", level: 93, role: "Crypto Engineer" },
  { skill: "Generate and verify ECDSA digital signatures via APIs", level: 88, role: "Blockchain / PKI" },
  { skill: "Conduct realistic brute-force attack simulations and patch", level: 91, role: "Penetration Tester" },
  { skill: "Perform integrity verification and HMAC signing at scale", level: 87, role: "DevSecOps" },
  { skill: "Discover and remediate OWASP Top 10 vulnerabilities", level: 94, role: "AppSec Engineer" },
];

const BAR_COLORS = [
  "bg-cyan-500", "bg-emerald-500", "bg-violet-500", "bg-rose-500",
  "bg-yellow-500", "bg-sky-500", "bg-pink-500",
];

function LearningOutcomesSection() {
  return (
    <section
      id="outcomes"
      className="relative z-10 py-28 px-5"
      aria-labelledby="outcomes-heading"
    >
      <GlowBlob color="emerald" size={500} blur={100} opacity={0.04} className="top-0 right-0" />
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left copy */}
        <motion.div
          variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <SectionLabel>Skills You'll Gain</SectionLabel>
          <h2
            id="outcomes-heading"
            className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight"
          >
            Skills That Pay
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Premium Salaries
            </span>
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Security engineering roles are among the fastest-growing and highest-compensated in tech. The average AppSec engineer earns{" "}
            <span className="text-white font-semibold">$155K+/year</span> — and every module in CyberLearn maps directly to a line item on a real job description.
          </p>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            CyberLearn was built by studying 200+ security job postings and distilling the most in-demand skills into hands-on labs. You don't just learn what AES-256 is — you leave with a working implementation.
          </p>
          <div className="flex flex-wrap gap-3">
            {["AppSec", "DevSecOps", "Cloud Security", "Pentesting", "Cryptography"].map((role) => (
              <span
                key={role}
                className="px-3 py-1.5 rounded-xl border border-emerald-500/25 bg-emerald-500/8 text-emerald-300 text-xs font-semibold"
              >
                {role}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Right skill bars */}
        <motion.div
          className="space-y-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {OUTCOMES.map((o, i) => (
            <motion.div key={i} variants={fadeRight} custom={i}>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-sm text-gray-300 font-medium">{o.skill}</p>
                <span className="text-[11px] text-gray-600 font-mono shrink-0 ml-3">{o.role}</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${BAR_COLORS[i]} rounded-full`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${o.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.3, delay: i * 0.11, ease: "easeOut" }}
                />
              </div>
              <p className="text-right text-[10px] text-gray-600 mt-0.5 font-mono">
                {o.level}% mastery coverage
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: WHY CYBERLEARN
───────────────────────────────────────────── */

const WHY_CARDS = [
  {
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    border: "border-yellow-500/20 hover:border-yellow-400/40",
    title: "Instant Feedback Loop",
    body: "Every lab action returns a real computed result — ciphertext, hash digest, signature, or access-denied message. There's no waiting, no grading queue.",
    points: ["Real output on every action", "Color-coded success/failure", "Embedded error explanations"],
  },
  {
    icon: <Shield className="w-6 h-6 text-cyan-400" />,
    border: "border-cyan-500/20 hover:border-cyan-400/40",
    title: "Zero-Risk Sandboxes",
    body: "Every attack, exploit, and test runs inside a fully isolated container. Try SQL injection. Crash the auth service. Break the cipher. Production is never in scope.",
    points: ["Isolated lab environments", "No production exposure", "Reset any lab in 1 click"],
  },
  {
    icon: <Layers className="w-6 h-6 text-violet-400" />,
    border: "border-violet-500/20 hover:border-violet-400/40",
    title: "Premium Tech Stack",
    body: "React + Vite + Framer-Motion, Node/Express, and SQLite — the same modern toolchain used in high-growth startups. Context-switching at work drops to near zero.",
    points: ["React 18 + TypeScript + Vite", "Node.js + Express backend", "Framer-Motion animations"],
  },
  {
    icon: <Radio className="w-6 h-6 text-rose-400" />,
    border: "border-rose-500/20 hover:border-rose-400/40",
    title: "OWASP-Aligned Curriculum",
    body: "Every vulnerability lab maps to the OWASP Top 10 — the industry's gold standard for web application security risks. You learn what the real threat landscape looks like.",
    points: ["OWASP Top 10 coverage", "Real CVE walkthroughs", "Industry-standard methodology"],
  },
  {
    icon: <Wifi className="w-6 h-6 text-sky-400" />,
    border: "border-sky-500/20 hover:border-sky-400/40",
    title: "Access Anywhere",
    body: "CyberLearn runs entirely in the browser. No VMs, no Docker, no `npm install`. Open a module on your phone on the train and you're doing real cryptography in 30 seconds.",
    points: ["100% browser-based", "No installation required", "Mobile-responsive labs"],
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-emerald-400" />,
    border: "border-emerald-500/20 hover:border-emerald-400/40",
    title: "Beautiful Premium UI",
    body: "Glassmorphism, dark mode throughout, subtle parallax, and Framer-Motion micro-animations make CyberLearn feel like a product you'd pay a premium subscription for.",
    points: ["Glassmorphism + dark mode", "Framer-Motion animations", "Custom Tailwind design tokens"],
  },
];

function WhyCyberLearnSection() {
  return (
    <section
      id="why"
      className="relative z-10 py-28 px-5 bg-white/[0.015] border-y border-white/5"
      aria-labelledby="why-heading"
    >
      <GlowBlob color="violet" size={500} blur={100} opacity={0.04} className="top-20 -left-40" />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <SectionLabel>Built Different</SectionLabel>
          <motion.h2
            id="why-heading"
            className="text-4xl md:text-5xl font-black text-white mb-4"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Why CyberLearn
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
              {" "}Beats Every Alternative
            </span>
          </motion.h2>
          <motion.p
            className="text-gray-400 max-w-xl mx-auto"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.5}
          >
            Most cybersecurity courses give you PDFs and multiple-choice quizzes.
            CyberLearn gives you a lab bench.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {WHY_CARDS.map((c, i) => (
            <motion.div
              key={i}
              className={`rounded-2xl border ${c.border} bg-white/[0.02] p-7 hover:bg-white/[0.04] transition-all group`}
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i * 0.3}
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 rounded-xl bg-gray-900 border border-white/8 flex items-center justify-center mb-5 group-hover:border-white/15 transition-all">
                {c.icon}
              </div>
              <h3 className="text-[15px] font-bold text-white mb-3">{c.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-5">{c.body}</p>
              <ul className="space-y-2">
                {c.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Glass callout */}
        <motion.div
          className="mt-10 rounded-2xl border border-cyan-500/20 bg-cyan-500/4 backdrop-blur-sm p-8 text-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="text-gray-300 text-sm leading-relaxed max-w-2xl mx-auto">
            <span className="text-white font-semibold">
              Glassmorphism UI, dark mode throughout, and subtle micro-animations
            </span>{" "}
            — CyberLearn doesn't look like a textbook. It looks like a product you'd pay to use, because security education should be as polished as the systems you're learning to protect.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: INTERACTIVE LIVE DEMO
───────────────────────────────────────────── */

type DemoMode = "base64" | "hex" | "sha256-preview";

function InteractiveDemo() {
  const [input, setInput] = useState("Hello, CyberLearn!");
  const [mode, setMode] = useState<DemoMode>("base64");

  const base64Out =
    typeof btoa !== "undefined"
      ? btoa(unescape(encodeURIComponent(input || "")))
      : "";
  const hexOut = Array.from(new TextEncoder().encode(input || ""))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const sha256Preview =
    "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3".slice(0, 48) + "…";

  const tabs: { key: DemoMode; label: string; icon: React.ReactNode }[] = [
    { key: "base64", label: "Base64", icon: <Code className="w-3.5 h-3.5" /> },
    { key: "hex", label: "Hex Encode", icon: <Hash className="w-3.5 h-3.5" /> },
    { key: "sha256-preview", label: "SHA-256 Preview", icon: <Shield className="w-3.5 h-3.5" /> },
  ];

  const outputMap: Record<DemoMode, string> = {
    base64: base64Out,
    hex: hexOut,
    "sha256-preview": sha256Preview,
  };

  return (
    <section
      id="demo"
      className="relative z-10 py-28 px-5"
      aria-labelledby="demo-heading"
    >
      <GlowBlob color="sky" size={600} blur={120} opacity={0.045} className="top-0 left-1/2 -translate-x-1/2" />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <SectionLabel>Live Demo</SectionLabel>
          <motion.h2
            id="demo-heading"
            className="text-4xl md:text-5xl font-black text-white mb-4"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Try It{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-400">
              Right Now
            </span>
          </motion.h2>
          <motion.p
            className="text-gray-400"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.5}
          >
            No login required. Type anything below and see real cryptographic
            output instantly — 100% client-side.
          </motion.p>
        </div>

        <motion.div
          className="rounded-2xl border border-white/10 bg-gray-900/75 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/65"
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Browser bar */}
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/8 bg-gray-950/70">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/65" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/65" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/65" />
            </div>
            <div className="flex-1 ml-3 bg-gray-800/55 rounded-md px-3 py-1 text-xs text-gray-500 font-mono flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-400" aria-hidden="true" />
              cyberlearn.app/labs/encoding
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Input */}
            <div>
              <label
                htmlFor="demo-input"
                className="block text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-2"
              >
                Your Input
              </label>
              <input
                id="demo-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-gray-950/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-gray-700 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25 transition-all"
                placeholder="Type anything here…"
                maxLength={200}
              />
            </div>

            {/* Mode tabs */}
            <div className="flex flex-wrap gap-2">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setMode(t.key)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mode === t.key
                      ? "bg-cyan-600/20 border border-cyan-500/45 text-cyan-300"
                      : "bg-white/5 border border-white/8 text-gray-400 hover:text-white hover:border-white/15"
                  }`}
                  aria-pressed={mode === t.key}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>

            {/* Output */}
            <div>
              <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-2">
                Output
              </p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode + input}
                  className="bg-gray-950/85 border border-cyan-500/20 rounded-xl p-4 min-h-[64px]"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  {outputMap[mode] ? (
                    <p className="text-sm text-cyan-300 font-mono break-all leading-relaxed">
                      {outputMap[mode]}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-700 italic font-mono">
                      Start typing above…
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Info */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
              <Info className="w-3.5 h-3.5 text-cyan-700 shrink-0" aria-hidden="true" />
              Computed 100% client-side · No data sent to any server ·
              <Link href="/auth">
                <span className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer transition-colors">
                  Open the full lab →
                </span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: TESTIMONIALS
───────────────────────────────────────────── */



/* ─────────────────────────────────────────────
   COMPONENT: PRICING SECTION
───────────────────────────────────────────── */

const PRICING_INCLUDES = [
  "All 8 security modules — forever",
  "Interactive labs with live output",
  "Attack simulator with real feedback",
  "Vulnerability sandbox environments",
  "Full cryptography & hashing labs",
  "Code snippets you own and can reuse",
  "Mobile-responsive, accessible UI",
  "Built by a real security practitioner",
];

function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative z-10 py-28 px-5"
      aria-labelledby="pricing-heading"
    >
      <GlowBlob color="cyan" size={700} blur={140} opacity={0.045} className="top-0 left-1/2 -translate-x-1/2" />
      <div className="max-w-2xl mx-auto text-center">
        <SectionLabel>Simple Pricing</SectionLabel>
        <motion.h2
          id="pricing-heading"
          className="text-4xl md:text-5xl font-black text-white mb-4"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Everything.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-400">
            Free.
          </span>
        </motion.h2>
        <motion.p
          className="text-gray-400 mb-12"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.5}
        >
          No paywalls. No freemium upsells. No credit card. CyberLearn is built to
          maximise learning, not revenue.
        </motion.p>

        <motion.div
          className="relative rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/8 to-sky-500/4 p-10 text-left shadow-2xl shadow-cyan-500/10"
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/55 to-transparent rounded-t-2xl"
            aria-hidden="true"
          />

          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-cyan-600 text-white text-xs font-black tracking-wide shadow-lg shadow-cyan-600/40">
            THE ONLY PLAN
          </div>

          {/* Price */}
          <div className="flex items-end gap-2 mb-8 justify-center">
            <span className="text-8xl font-black text-white leading-none">$0</span>
            <span className="text-gray-400 mb-3 text-lg">/ forever</span>
          </div>

          {/* Includes */}
          <ul
            className="grid sm:grid-cols-2 gap-3 mb-10"
            aria-label="Everything included in CyberLearn"
          >
            {PRICING_INCLUDES.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>

          <Link href="/auth" className="block" aria-label="Get started with CyberLearn for free">
            <motion.div
              whileHover={{ scale: 1.04, boxShadow: "0 0 55px rgba(6,182,212,0.32)" }}
              whileTap={{ scale: 0.97 }}
            >
              <Button className="w-full bg-gradient-to-r from-cyan-600 via-cyan-500 to-sky-500 hover:from-cyan-500 hover:to-sky-400 text-white text-lg py-4 rounded-xl font-bold shadow-xl shadow-cyan-600/25 transition-all flex items-center justify-center gap-3">
                <Rocket className="w-5 h-5" aria-hidden="true" />
                Start All 8 Modules — Free
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Button>
            </motion.div>
          </Link>

          <p className="text-center text-gray-600 text-xs mt-4">
            No account required for the live demo · Full access after signup
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: FINAL CTA
───────────────────────────────────────────── */

function FinalCTA() {
  return (
    <section
      className="relative z-10 overflow-hidden py-36 px-5"
      aria-labelledby="cta-heading"
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-cyan-950/50 via-gray-950 to-violet-950/30 pointer-events-none"
        aria-hidden="true"
      />
      <GlowBlob color="cyan" size={850} blur={170} opacity={0.075} className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <GlowBlob color="violet" size={500} blur={100} opacity={0.045} className="top-0 right-0" />

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/8 text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-8"
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          Ready When You Are
        </motion.div>

        <motion.h2
          id="cta-heading"
          className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.04]"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Start Thinking Like
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-500">
            a Security Engineer
          </span>
        </motion.h2>

        <motion.p
          className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.5}
        >
          Join CyberLearn and open your first hands-on security lab in under 60
          seconds. No setup. No credit card. Just pure, interactive learning.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
        >
          <Link href="/auth" aria-label="Get started with CyberLearn">
            <motion.div
              whileHover={{ scale: 1.08, boxShadow: "0 0 65px rgba(6,182,212,0.42)" }}
              whileTap={{ scale: 0.95 }}
              className="rounded-xl"
            >
              <Button className="bg-gradient-to-r from-cyan-600 via-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-white text-base md:text-lg px-12 py-4 rounded-xl font-black shadow-2xl shadow-cyan-600/30 transition-all flex items-center gap-3">
                <Rocket className="w-5 h-5" aria-hidden="true" />
                Launch CyberLearn
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Button>
            </motion.div>
          </Link>

          <a
            href="https://github.com/harininr/CyberLearn"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View the source code on GitHub"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Button
                variant="outline"
                className="border-white/15 text-gray-300 hover:text-white hover:border-white/25 bg-white/5 hover:bg-white/8 text-base md:text-lg px-8 py-4 rounded-xl flex items-center gap-2 font-semibold transition-all backdrop-blur-sm"
              >
                <Github className="w-5 h-5" aria-hidden="true" />
                View on GitHub
              </Button>
            </motion.div>
          </a>
        </motion.div>

        {/* Social proof numbers */}
        <motion.div
          className="mt-16 flex flex-wrap items-center justify-center gap-12 text-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1.5}
        >
          {[
            { val: "8", label: "Security Modules" },
            { val: "100%", label: "Free Forever" },
            { val: "0ms", label: "Setup Time" },
            { val: "∞", label: "Lab Attempts" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-black text-white mb-0.5">{s.val}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: FOOTER
───────────────────────────────────────────── */

function Footer() {
  const footerLinks: Record<string, string[]> = {
    Modules: [
      "Authentication",
      "Cryptography",
      "Hashing",
      "Access Control",
      "Digital Signatures",
      "Encoding",
      "Attack Simulator",
      "Vulnerability Labs",
    ],
    Learn: [
      "How It Works",
      "Learning Outcomes",
      "Why CyberLearn",
      "Live Demo",
      "Pricing",
    ],
    "Tech Stack": [
      "React + Vite + TypeScript",
      "Framer Motion",
      "Tailwind CSS",
      "Node.js + Express",
      "SQLite",
      "OpenSSL / crypto",
    ],
  };

  return (
    <footer
      className="relative z-10 border-t border-white/5 bg-gray-950/85 backdrop-blur-sm"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-12">
        {/* Brand column */}
        <div className="xl:col-span-2">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <Lock className="w-[18px] h-[18px] text-cyan-400" aria-hidden="true" />
            </div>
            <div>
              <span className="text-white font-bold text-[15px] tracking-tight block leading-none">
                CyberLearn
              </span>
              <span className="text-cyan-400 text-[9px] font-mono tracking-[0.2em] uppercase mt-0.5 block">
                Simulator
              </span>
            </div>
          </div>

          <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
            An ultra-premium, interactive cybersecurity training platform. Learn
            encryption, hashing, RBAC, digital signatures, and attack simulations
            through hands-on labs.
          </p>

          {/* Built by badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-cyan-500/20 bg-cyan-500/4 text-sm mb-5">
            <span className="text-gray-500">Built with</span>
            <span className="text-rose-400">♥</span>
            <span className="text-gray-500">by</span>
            <a
              href="https://github.com/harininr/CyberLearn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors font-semibold"
              aria-label="Visit Harini's GitHub profile"
            >
              <Github className="w-4 h-4" aria-hidden="true" />
              Harini
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          </div>

          {/* Social icons */}
          <div className="flex gap-2.5">
            {[
              { Icon: Github, href: "https://github.com/harininr/CyberLearn", label: "GitHub" },
              { Icon: Twitter, href: "#", label: "Twitter" },
              { Icon: Linkedin, href: "#", label: "LinkedIn" },
              { Icon: Mail, href: "mailto:harini@cyberlearn.app", label: "Email" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg border border-white/8 bg-white/[0.03] flex items-center justify-center text-gray-500 hover:text-white hover:border-white/18 hover:bg-white/7 transition-all"
                aria-label={label}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(footerLinks).map(([cat, items]) => (
          <div key={cat}>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.15em] mb-5">
              {cat}
            </p>
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item}>
                  <span className="text-sm text-gray-600 hover:text-gray-300 transition-colors cursor-default">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 px-6 py-5 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-gray-700">
          © {new Date().getFullYear()} CyberLearn Simulator by Harini. All rights reserved.
        </p>
        <div className="flex items-center gap-1.5 text-xs text-gray-700">
          <AlertTriangle className="w-3 h-3 text-yellow-800" aria-hidden="true" />
          All attack simulations run in isolated sandboxes. No production systems at risk.
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT COMPONENT
═══════════════════════════════════════════════════════════ */

export default function LandingPage() {
  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <>
      {/* Custom cursor — desktop only */}
      <div className="hidden lg:block">
        <AnimatedCursor />
      </div>

      {/* Ambient particle field */}
      <ParticleField />

      {/* Sticky glass nav */}
      <NavBar onScrollTo={scrollTo} />

      <main className="relative bg-[#020617] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_80%)] from-cyan-950/20 overflow-x-hidden">
        {/* 1 ─ Hero */}
        <HeroSection onScrollTo={scrollTo} />

        {/* 2 ─ Trust marquee */}
        <TrustStrip />

        {/* 3 ─ Features grid */}
        <FeaturesSection />

        {/* 4 ─ How it works */}
        <HowItWorksSection />

        {/* 5 ─ Learning outcomes */}
        <LearningOutcomesSection />

        {/* 6 ─ Why CyberLearn */}
        <WhyCyberLearnSection />

        {/* 7 ─ Live interactive demo */}
        <InteractiveDemo />

        {/* 9 ─ Pricing */}
        <PricingSection />

        {/* 10 ─ Final CTA */}
        <FinalCTA />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}