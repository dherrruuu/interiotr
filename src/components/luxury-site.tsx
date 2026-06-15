"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

declare global {
  interface Window {
    ScrollTrigger?: typeof ScrollTrigger;
  }
}
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  LayoutGrid,
  Mail,
  MapPinned,
  Menu,
  MoonStar,
  MoveUpRight,
  Phone,
  Quote,
  ScanSearch,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  SunMedium,
  Hammer,
  Building2,
  Boxes,
  Ruler,
  Send,
} from "lucide-react";


import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "./ui/image";

type IconComponent = React.ComponentType<{ className?: string }>;

type Service = {
  title: string;
  description: string;
  icon: IconComponent;
};

type Project = {
  name: string;
  style: string;
  area: string;
  description: string;
  tone: string;
  accent: string;
};

type GalleryItem = {
  name: string;
  title: string;
  category: "Residential" | "Commercial" | "Materials";
  note: string;
  accent: string;
  image: string;
  layoutCardClass?: string;
  imageClass?: string;
  objectPosition?: string;
  width?: number | null;
  height?: number | null;
  aspectRatio?: number | null;
  orientation?: "portrait" | "landscape" | "square";
  featured?: boolean;
};

type GalleryManifestItem = {
  name: string;
  title?: string;
  objectPosition?: string;
  width?: number | null;
  height?: number | null;
  aspectRatio?: number | null;
  orientation?: "portrait" | "landscape" | "square";
  featured?: boolean;
};

const services: Service[] = [
  {
    title: "Interior Design",
    description:
      "Architectural planning, spatial clarity, and layered material composition tailored to refined living.",
    icon: Sparkles,
  },
  {
    title: "Turnkey Execution",
    description:
      "A single team handling site management, coordination, and handover-ready delivery.",
    icon: ShieldCheck,
  },
  {
    title: "Residential Interiors",
    description:
      "Homes shaped with warm textures, calm palettes, and custom millwork that feels timeless.",
    icon: Building2,
  },
  {
    title: "Commercial Interiors",
    description:
      "Premium environments for offices, hospitality, and showrooms with subtle brand presence.",
    icon: LayoutGrid,
  },
  {
    title: "Modular Solutions",
    description:
      "Precision-built storage, kitchens, and utilities designed to stay elegant and efficient.",
    icon: Boxes,
  },
  {
    title: "Raw Material Supply",
    description:
      "Trusted sourcing for contractors and builders across veneers, tiles, glass, and more.",
    icon: Ruler,
  },
  {
    title: "Site Planning",
    description:
      "A clean execution roadmap with coordination, sequencing, and quality checkpoints.",
    icon: ScanSearch,
  },
  {
    title: "Custom Furniture",
    description:
      "Hand-finished pieces with sculpted proportions, premium detailing, and long-life comfort.",
    icon: Hammer,
  },
];

const projects: Project[] = [
  {
    name: "Aurelia Residence",
    style: "Contemporary Classic",
    area: "4,800 sq ft",
    description: "Warm stone, soft brass, and gallery-like restraint for a private family home.",
    tone: "from-stone-900 via-zinc-700 to-amber-800",
    accent: "Champagne Finish",
  },
  {
    name: "Monolith Penthouse",
    style: "Minimal Luxury",
    area: "3,100 sq ft",
    description: "A high-rise residence with horizon framing, tactile surfaces, and understated drama.",
    tone: "from-zinc-950 via-neutral-700 to-stone-600",
    accent: "Urban Calm",
  },
  {
    name: "The Atelier Office",
    style: "Executive Commercial",
    area: "8,600 sq ft",
    description: "A polished workplace using timber rhythm, linear light, and precise planning.",
    tone: "from-stone-800 via-neutral-700 to-zinc-600",
    accent: "Workplace Prestige",
  },
  {
    name: "Maison Court",
    style: "Resort Modern",
    area: "6,200 sq ft",
    description: "An indoor-outdoor villa concept with calm tonal depth and layered transparency.",
    tone: "from-amber-950 via-stone-700 to-zinc-500",
    accent: "Resort Flow",
  },
];

// Process section removed — timeline and animation handled elsewhere.

const testimonials = [
  {
    name: "Aarav Mehta",
    role: "Private Villa Owner",
    quote:
      "The execution felt calm and controlled from the first meeting to final handover. The finish quality is exceptional.",
  },
  {
    name: "Nandini Rao",
    role: "Hospitality Developer",
    quote:
      "They understood the luxury brief immediately and translated it into a space that feels intentional and enduring.",
  },
  {
    name: "Kabir Shah",
    role: "Builder Partner",
    quote:
      "Their material supply is reliable, and the site coordination saves time without sacrificing quality.",
  },
];

// Default/static items remain as a fallback while manifest loads.
const galleryItems: GalleryItem[] = [];

const stats = [
  { value: "120+", label: "Projects Delivered" },
  { value: "18", label: "Years of Experience" },
  { value: "9", label: "Material Categories" },
];
// Process watch removed.

const galleryFilters = ["All", "Residential", "Commercial", "Materials"] as const;

const galleryCardLayouts = [
  { cardClass: "xl:col-span-2 xl:row-span-2", imageClass: "h-[18rem] sm:h-[19rem] xl:h-[100%]" },
  { cardClass: "", imageClass: "h-[22rem]" },
  { cardClass: "xl:row-span-2", imageClass: "h-[20rem] sm:h-[21rem] xl:h-[100%]" },
  { cardClass: "", imageClass: "h-[23rem]" },
  { cardClass: "xl:col-span-2", imageClass: "h-[19rem] sm:h-[20rem]" },
  { cardClass: "", imageClass: "h-[24rem]" },
] as const;

const galleryCircleLayouts = [
  { cardClass: "sm:col-span-2 sm:row-span-2", imagePosition: "center 100%" },
  { cardClass: "sm:col-span-1 sm:row-span-1", imagePosition: "center center" },
  { cardClass: "sm:col-span-1 sm:row-span-2", imagePosition: "center 72%" },
  { cardClass: "sm:col-span-1 sm:row-span-1", imagePosition: "center 40%" },
  { cardClass: "sm:col-span-2 sm:row-span-1", imagePosition: "center 84%" },
  { cardClass: "sm:col-span-1 sm:row-span-1", imagePosition: "center 56%" },
] as const;

// Data for a luxury process clock
const processClockData = [
  { zone: "Discovery", steps: ["Consultation", "Site Visit", "Moodboarding"] },
  { zone: "Design", steps: ["Layout Planning", "Material Selection", "3D Visualization"] },
  { zone: "Execution", steps: ["Fabrication", "Site Coordination", "Installation"] },
  { zone: "Delivery", steps: ["Styling", "Quality Check", "Final Handover"] },
];

function ProcessClock({ onOpen, onActive, activeMicro, onMicroHover }: { onOpen: (i: number) => void; onActive?: (i: number) => void; activeMicro?: number | null; onMicroHover?: (i: number | null) => void }) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const handRef = useRef<HTMLDivElement | null>(null);
  const thinRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const allMicro = useMemo(() => processClockData.flatMap((z) => z.steps), []);
  const [activeZone, setActiveZone] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !tlRef.current) {
          const tl = gsap.timeline();
          tl.fromTo(ringRef.current, { rotate: -40, opacity: 0 }, { rotate: 0, opacity: 1, duration: 0.9, ease: 'power3.out' });
          tl.fromTo(handRef.current, { rotate: -720 }, { rotate: 0, duration: 1.2, ease: 'elastic.out(1,0.6)' }, '<0.05');
          tl.fromTo(thinRef.current, { rotate: -540 }, { rotate: 0, duration: 1.4, ease: 'power3.out' }, '<0.02');
          tl.fromTo(el.querySelectorAll('.process-mini'), { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, stagger: 0.05, ease: 'back.out(1.2)' }, '-=0.9');
          tlRef.current = tl;
          obs.disconnect();
        }
      });
    }, { threshold: 0.25 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [prefersReducedMotion]);

  const zoneAngle = (zi: number) => (zi * 90) - 90;

  const hoverZone = (idx: number) => {
    setActiveZone(idx);
    onActive?.(idx * 3); // map zone to micro index roughly
    const angle = zoneAngle(idx);
    if (!prefersReducedMotion && handRef.current) {
      gsap.to(handRef.current, { rotate: angle, duration: 0.6, ease: 'power3.out' });
      gsap.to(thinRef.current, { rotate: angle * 1.02, duration: 0.7, ease: 'power3.out' });
    } else if (handRef.current) {
      handRef.current.style.transform = `rotate(${angle}deg)`;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full flex items-center justify-center">
      <div className="relative z-10">
        <div className="process-frame relative flex items-center justify-center p-6">
          <div ref={ringRef} className="absolute h-[380px] w-[380px] rounded-full">
            <svg className="h-full w-full" viewBox="0 0 380 380" aria-hidden>
              <circle cx={190} cy={190} r={168} stroke="rgba(255,255,255,0.03)" strokeWidth={1} fill="none" />
              {Array.from({ length: 60 }).map((_, i) => {
                const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
                const r1 = 168;
                const r2 = i % 5 === 0 ? 158 : 162;
                const x1 = 190 + Math.cos(a) * r1;
                const y1 = 190 + Math.sin(a) * r1;
                const x2 = 190 + Math.cos(a) * r2;
                const y2 = 190 + Math.sin(a) * r2;
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={i % 5 === 0 ? 'rgba(199,166,110,0.12)' : 'rgba(255,255,255,0.03)'} strokeWidth={i % 5 === 0 ? 1.2 : 0.6} strokeLinecap="round" />;
              })}
            </svg>
          </div>

          <div className="absolute h-[320px] w-[320px] rounded-full">
            {allMicro.map((m, i) => {
              const a = (i / allMicro.length) * Math.PI * 2 - Math.PI / 2;
              const r = 140;
              const x = Math.cos(a) * r;
              const y = Math.sin(a) * r;
              const left = `calc(50% + ${x}px)`;
              const top = `calc(50% + ${y}px)`;
              const isActive = activeMicro === i;
              return (
                <div key={`${m}-${i}`} style={{ left, top }} className="absolute flex items-center justify-center">
                  <div
                    role="button"
                    tabIndex={0}
                    onMouseEnter={() => onMicroHover?.(i)}
                    onFocus={() => onMicroHover?.(i)}
                    onMouseLeave={() => onMicroHover?.(null)}
                    onBlur={() => onMicroHover?.(null)}
                    onClick={() => onOpen(i)}
                    className={"process-mini rounded-full cursor-pointer " + (isActive ? 'scale-125 bg-[rgba(199,166,110,0.95)]' : 'bg-white/10')}
                    style={{ width: isActive ? 12 : 8, height: isActive ? 12 : 8 }}
                  />
                  {isActive ? (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-30 max-w-xs rounded-md bg-[rgba(6,6,6,0.9)] px-2 py-1 text-xs text-[color:var(--muted)]"
                      style={{ left: 18, top: -8 }}
                    >
                      {m}
                    </motion.div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="absolute flex items-center justify-center">
            <div ref={handRef} className="absolute origin-bottom h-[110px] w-[8px] rounded-[6px] bg-gradient-to-b from-[rgba(199,166,110,0.98)] to-[rgba(199,166,110,0.6)] shadow-[0_20px_60px_-30px_rgba(199,166,110,0.35)]" style={{ bottom: '50%', left: '50%', transformOrigin: '50% 100%' }} />
            <div ref={thinRef} className="absolute origin-bottom h-[72px] w-[4px] rounded-[4px] bg-[rgba(255,244,230,0.9)] opacity-90" style={{ bottom: '50%', left: '50%', transformOrigin: '50% 100%' }} />
            <div className="absolute h-6 w-6 rounded-full bg-[rgba(255,244,230,0.02)] border border-white/8" style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }} />
          </div>

        </div>
      </div>

      <div className="absolute left-4 top-4 flex flex-col gap-2 z-20 pointer-events-none">
        {/* ambient particles or small UI elements could be added here */}
      </div>
    </div>
  );
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function SectionShell({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 sm:px-8 lg:px-10">
      <Badge className="w-fit">{eyebrow}</Badge>
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <h2 className="font-display text-4xl leading-[0.95] tracking-tight text-[color:var(--foreground)] sm:text-5xl lg:text-6xl">
          {title}
        </h2>
        <p className="max-w-2xl text-sm leading-7 text-[color:var(--muted)] sm:text-base lg:justify-self-end">
          {description}
        </p>
      </div>
    </div>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 28 }}
      whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function MagneticButton({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <Button
      ref={ref}
      className={className}
      onMouseMove={(event) => {
        const element = ref.current;
        if (!element) return;

        const bounds = element.getBoundingClientRect();
        const x = (event.clientX - bounds.left - bounds.width / 2) * 0.12;
        const y = (event.clientY - bounds.top - bounds.height / 2) * 0.12;
        element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }}
      onMouseLeave={() => {
        if (ref.current) {
          ref.current.style.transform = "translate3d(0, 0, 0)";
        }
      }}
      {...props}
    >
      {children}
    </Button>
  );
}

export function LuxurySite() {
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const lenisRef = useRef<InstanceType<typeof Lenis> | null>(null);
  const [selectedGalleryFilter, setSelectedGalleryFilter] = useState<(typeof galleryFilters)[number]>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [split, setSplit] = useState(56);
  const galleryScrollRef = useRef<HTMLDivElement | null>(null);
  const [showGalleryScrollHint, setShowGalleryScrollHint] = useState(false);
  
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  // replace gallery items with manifest-generated list (all images) when available
  const [manifestItems, setManifestItems] = useState<GalleryItem[] | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch('/dheeraj-images/manifest.json')
      .then((r) => {
        if (!r.ok) throw new Error('manifest not found');
        return r.json();
      })
      .then((files: GalleryManifestItem[]) => {
        if (!mounted) return;
        const items = files.map((f, i) => {
          const title = f.title || f.name.replace(/\.[^.]+$/, '');
          return {
            name: f.name,
            title,
            category: 'Residential',
            note: '',
            accent: '',
            image: `/dheeraj-images/${encodeURIComponent(f.name)}`,
            layoutCardClass: f.featured
              ? 'md:col-span-2 xl:col-span-2 xl:row-span-2'
              : f.orientation === 'portrait'
                ? galleryCardLayouts[(i + 2) % galleryCardLayouts.length].cardClass
                : galleryCardLayouts[i % galleryCardLayouts.length].cardClass,
            imageClass: f.featured
              ? 'h-[28rem] sm:h-[30rem]'
              : f.orientation === 'portrait'
                ? 'h-[29rem] sm:h-[31rem] xl:h-[100%]'
                : f.orientation === 'landscape'
                  ? 'h-[20rem] sm:h-[21rem] xl:h-[100%]'
                  : 'h-[22rem] sm:h-[23rem]',
            objectPosition: f.objectPosition,
            width: f.width,
            height: f.height,
            aspectRatio: f.aspectRatio,
            orientation: f.orientation,
            featured: f.featured,
          } as GalleryItem;
        });
        setManifestItems(items);
      })
      .catch(() => {
        // ignore; fallback will be used
      });
    return () => {
      mounted = false;
    };
  }, []);

  const effectiveGallery = manifestItems ?? galleryItems;

  const gallery = useMemo(() => {
    const source = effectiveGallery;
    return selectedGalleryFilter === "All"
      ? source
      : source.filter((item) => item.category === selectedGalleryFilter);
  }, [selectedGalleryFilter, effectiveGallery]);

  useEffect(() => {
    const updateHintVisibility = () => {
      const el = galleryScrollRef.current;
      if (!el) {
        setShowGalleryScrollHint(false);
        return;
      }

      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const hasOverflow = el.scrollHeight - el.clientHeight > 18;
      setShowGalleryScrollHint(isMobile && hasOverflow && el.scrollTop < 10);
    };

    updateHintVisibility();
    window.addEventListener("resize", updateHintVisibility);
    return () => {
      window.removeEventListener("resize", updateHintVisibility);
    };
  }, [gallery]);

  useEffect(() => {
    if (!gallery.length) return;

    const preloadedImages = gallery.map((item) => {
      const image = new window.Image();
      image.decoding = "async";
      image.src = item.image;
      return image;
    });

    return () => {
      preloadedImages.forEach((image) => {
        image.src = "";
      });
    };
  }, [gallery]);

  useEffect(() => {
    // Toggle this to re-enable smooth scrolling during debugging.
    const enableLenis = true;

    if (!enableLenis) {
      return;
    }

    lenisRef.current = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenisRef.current!.raf(time);
      // ensure ScrollTrigger sees updates when Lenis animates
      if (window.ScrollTrigger) window.ScrollTrigger.update();
      frame = requestAnimationFrame(raf);
    };

    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      try {
        lenisRef.current?.destroy();
      } catch {
        // ignore
      }
    };
  }, []);

  useEffect(() => {
    const ticker = window.setInterval(() => {
      setActiveTestimonial((value) => (value + 1) % testimonials.length);
    }, 6500);
    return () => window.clearInterval(ticker);
  }, []);

  // Process section removed — ScrollTrigger/GSAP logic omitted.

  const themeIsDark = true;

  // debugDisableOverlays: when true, make fixed overlays non-interactive to test scroll blocking.
  const debugDisableOverlays = false;
  // debugVisual: show a small on-screen debug indicator for process scroll progress.
  const debugVisual = true;

  const shellBackdrop = themeIsDark
    ? "bg-[radial-gradient(circle_at_top,rgba(199,166,110,0.12),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.06),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_22%,transparent_82%,rgba(10,10,10,0.1))]"
    : "bg-[radial-gradient(circle_at_top,rgba(145,104,48,0.14),transparent_26%),radial-gradient(circle_at_80%_14%,rgba(255,255,255,0.65),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.18),transparent_80%,rgba(145,104,48,0.06))]";

  const glassPanel = themeIsDark
    ? "bg-[color:var(--background)]/55 shadow-[0_18px_60px_-30px_rgba(10,10,10,0.55)]"
    : "bg-[rgba(255,255,255,0.76)] shadow-[0_18px_60px_-34px_rgba(90,64,35,0.18)]";

  return (
    <div className="relative isolate overflow-hidden bg-[color:var(--background)]">
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 -z-10 ${shellBackdrop}`}
      />
      <motion.div
        aria-hidden
        className={`pointer-events-none fixed left-0 top-0 z-[60] h-1 origin-left bg-[linear-gradient(90deg,transparent,rgba(199,166,110,0.95),rgba(255,255,255,0.95),rgba(199,166,110,0.95),transparent)] ${
          debugDisableOverlays ? "pointer-events-none" : ""
        }`}
        style={{ scaleX: progress }}
      />

      {/* debugVisual removed */}


      <header
        className={`fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8 ${
          debugDisableOverlays ? "pointer-events-none" : ""
        }`}
        aria-hidden={debugDisableOverlays}
      >
        <div className={`mx-auto flex max-w-7xl items-center justify-between rounded-full border border-[color:var(--border)] px-4 py-3 backdrop-blur-2xl ${glassPanel}`}>
          <button
            type="button"
            onClick={() => scrollToSection("home")}
            className="group flex items-center gap-3 text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-white/5 text-sm font-semibold tracking-[0.3em] text-[color:var(--accent)]">
              BWD
            </div>
            <div className="hidden sm:block">
              <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--muted)]">
                Balaji Wood Decor
              </p>
              <p className="text-sm text-[color:var(--foreground)]/90">Luxury Interiors & Execution</p>
            </div>
          </button>

          <nav className="hidden items-center gap-1 lg:flex">
            {[
              ["Home", "home"],
              ["About", "about"],
              ["Services", "services"],
              ["Projects", "projects"],
              ["Contact", "contact"],
            ].map(([label, id]) => (
              <button
                key={label}
                type="button"
                onClick={() => scrollToSection(id)}
                className="rounded-full px-4 py-2 text-sm text-[color:var(--muted)] transition-colors hover:bg-white/6 hover:text-[color:var(--foreground)]"
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 rounded-full border border-[color:var(--border)] lg:hidden"
              aria-label="Open menu"
              onClick={() => setMobileOpen((value) => !value)}
            >
              <Menu className="h-4 w-4" />
            </Button>

            <MagneticButton
              className="hidden border border-[color:var(--accent)]/30 bg-[color:var(--accent)]/12 text-[color:var(--foreground)] lg:inline-flex"
              onClick={() => scrollToSection("contact")}
            >
              Book Consultation
              <ArrowRight className="h-4 w-4" />
            </MagneticButton>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.25 }}
              className={`mx-auto mt-3 max-w-7xl rounded-[2rem] border border-[color:var(--border)] p-4 backdrop-blur-2xl lg:hidden ${themeIsDark ? "bg-[color:var(--background)]/92 shadow-[0_28px_80px_-40px_rgba(10,10,10,0.75)]" : "bg-[rgba(255,255,255,0.84)] shadow-[0_28px_80px_-40px_rgba(90,64,35,0.16)]"}`}
            >
              <div className="grid gap-2">
                {[
                  ["Home", "home"],
                  ["About", "about"],
                  ["Services", "services"],
                  ["Projects", "projects"],
                  ["Contact", "contact"],
                ].map(([label, id]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      scrollToSection(id);
                    }}
                    className="flex items-center justify-between rounded-2xl border border-[color:var(--border)] bg-white/5 px-4 py-3 text-left text-sm text-[color:var(--foreground)]"
                  >
                    {label}
                    <ArrowRight className="h-4 w-4 text-[color:var(--muted)]" />
                  </button>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <main className="relative">
        <section id="home" className="relative min-h-screen overflow-hidden pt-28 sm:pt-32">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-10 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-10 lg:pb-28 lg:pt-16">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge>Luxury Interiors</Badge>
                <div className="max-w-3xl space-y-5">
                  <p
                    data-hero-line
                    className="text-xs uppercase tracking-[0.42em] text-[color:var(--muted)]"
                  >
                    Balaji Wood Decor
                  </p>
                  <h1
                    data-hero-line
                    className="font-display max-w-4xl text-5xl leading-[0.9] tracking-tight text-[color:var(--foreground)] sm:text-7xl lg:text-[5.5rem]"
                  >
                    Crafting timeless luxury spaces with precise execution.
                  </h1>
                  <p
                    data-hero-line
                    className="max-w-2xl text-base leading-8 text-[color:var(--muted)] sm:text-lg"
                  >
                    An elevated interior design and turnkey execution studio
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <MagneticButton onClick={() => scrollToSection("projects")}>
                  View Projects
                  <MoveUpRight className="h-4 w-4" />
                </MagneticButton>
                <MagneticButton
                  variant="outline"
                  onClick={() => scrollToSection("contact")}
                >
                  Book Consultation
                  <ArrowRight className="h-4 w-4" />
                </MagneticButton>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((item, index) => (
                  <Reveal key={item.label} delay={index * 0.08}>
                    <Card className="flex h-full min-h-[8.75rem] aspect-square flex-col bg-white/4 p-4 sm:p-5">
                      <p className="font-display text-2xl leading-none text-[color:var(--foreground)] sm:text-3xl">
                        {item.label === "Material Categories" ? (
                          <span className="hidden md:inline">{item.value}</span>
                        ) : (
                          item.value
                        )}
                      </p>
                      <p className="mt-3 max-w-full [overflow-wrap:anywhere] text-[0.62rem] leading-4 tracking-[0.11em] text-[color:var(--muted)] sm:text-[0.7rem] sm:leading-5 sm:tracking-[0.16em]">
                        {item.label}
                      </p>
                      {item.label === "Material Categories" && (
                        <div className="mt-3 block md:hidden">
                          <picture className="mx-auto h-32 w-full max-w-[12.5rem] overflow-hidden rounded-xl sm:h-36 sm:max-w-[14rem]">
                            <source srcSet="/dheeraj-images/ai.png" type="image/png" />
                            <img
                              src="/dheeraj-images/ai.svg"
                              alt="Material categories"
                              className="h-full w-full object-cover object-center"
                            />
                          </picture>
                        </div>
                      )}
                    </Card>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal>
              <div className="relative mx-auto w-full max-w-[39rem]">
                <div className="absolute -left-8 top-12 h-36 w-36 rounded-full bg-[color:var(--accent)]/18 blur-3xl" />
                <div className="absolute -right-12 bottom-8 h-44 w-44 rounded-full bg-white/8 blur-3xl" />

                <Card className="relative overflow-hidden border-white/10 bg-white/[0.06] p-4 shadow-[0_32px_110px_-50px_rgba(0,0,0,0.85)]">
                  <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="relative min-h-[32rem] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03)),radial-gradient(circle_at_top,rgba(199,166,110,0.35),transparent_45%),linear-gradient(145deg,rgba(20,20,20,0.94),rgba(56,43,28,0.9))]">
                      <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.08),transparent)]" />
                      <div className="absolute inset-x-4 top-4 flex items-center justify-between rounded-full border border-white/10 bg-black/25 px-4 py-3 text-xs uppercase tracking-[0.28em] text-white/75 backdrop-blur-xl">
                        <span>Hero Cinematic View</span>
                        <span>2026</span>
                      </div>
                      <div className="absolute inset-x-4 bottom-4 grid gap-3">
                        {[
                          ["Design-led execution", "From concept to handover"],
                          ["Material partner", "Supplying builders and contractors"],
                          ["Premium detailing", "Stone, wood, brass, and glass"],
                        ].map(([title, subtitle]) => (
                          <div
                            key={title}
                            className="rounded-[1.25rem] border border-white/10 bg-black/25 px-4 py-3 backdrop-blur-xl"
                          >
                            <div className="flex items-center justify-between gap-4">
                              <p className="text-sm font-medium text-white">{title}</p>
                              <ArrowRight className="h-4 w-4 text-[color:var(--accent)]" />
                            </div>
                            <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/55">
                              {subtitle}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4">
                      <Card className="bg-white/[0.05] p-5">
                        <div className="flex items-center justify-between">
                          <p className="text-sm uppercase tracking-[0.28em] text-[color:var(--muted)]">
                            Signature Promise
                          </p>
                          <BadgeCheck className="h-5 w-5 text-[color:var(--accent)]" />
                        </div>
                        <h2 className="mt-6 max-w-xs font-display text-3xl leading-tight text-[color:var(--foreground)]">
                          Luxury interiors with perfect execution.
                        </h2>
                        <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
                          We build tactile, calm, and high-value interiors for clients who want
                          precision, trust, and a refined visual language.
                        </p>
                      </Card>

                      <Card className="grid gap-4 bg-white/[0.04] p-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--accent)]/14 text-[color:var(--accent)]">
                            <Phone className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[color:var(--foreground)]">
                              Fast consultation response
                            </p>
                            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
                              Premium client onboarding
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-white/5 px-4 py-3 text-sm text-[color:var(--muted)]">
                          <Mail className="h-4 w-4 text-[color:var(--accent)]" />
                          hello@interioandtrade.com
                        </div>
                        <div className="flex items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-white/5 px-4 py-3 text-sm text-[color:var(--muted)]">
                          <MapPinned className="h-4 w-4 text-[color:var(--accent)]" />
                          Design studio and supply partner across India
                        </div>
                      </Card>
                    </div>
                  </div>
                </Card>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="about" className="py-10 sm:py-20">
          <SectionShell
            eyebrow="About"
            title="A studio shaped around trust, detail, and quiet confidence."
            description="Balaji Wood Decor blends interior design, turnkey execution, and material sourcing into one disciplined experience for homeowners, developers, and contractors."
          />

          <div className="mx-auto mt-10 grid max-w-7xl gap-6 px-6 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-10">
            <Reveal>
              <Card className="overflow-hidden p-0">
                <div className="grid min-h-[28rem] lg:grid-cols-[1fr_0.9fr]">
                  <div className="p-6 sm:p-8">
                    <Badge>Studio Philosophy</Badge>
                    <p className="mt-5 max-w-xl text-lg leading-8 text-[color:var(--muted)]">
                      Every interior should feel composed, effortless, and durable. We think in
                      light, proportion, material honesty, and the human rituals that define a
                      space.
                    </p>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                      {[
                        ["Minimal language", "We keep the composition calm and architectural."],
                        ["High touch delivery", "Our team remains present through every stage."],
                        ["Material integrity", "Products and finishes are chosen for longevity."],
                        ["Reliable execution", "Design intent survives the realities of site work."],
                      ].map(([title, text]) => (
                        <div
                          key={title}
                          className="rounded-[1.25rem] border border-[color:var(--border)] bg-white/5 p-4"
                        >
                          <p className="font-medium text-[color:var(--foreground)]">{title}</p>
                          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="relative min-h-[36rem] border-t border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(199,166,110,0.14),transparent_35%),radial-gradient(circle_at_top,rgba(255,255,255,0.15),transparent_25%),linear-gradient(135deg,rgba(31,24,18,0.96),rgba(10,10,10,0.94))] lg:min-h-[28rem] lg:border-t-0 lg:border-l">
                    <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.07),transparent)]" />
                    <div className="relative p-6 sm:p-8 lg:absolute lg:inset-0">
                      <div className="flex h-full flex-col justify-between gap-6 rounded-[1.5rem] border border-white/10 bg-black/15 p-5 backdrop-blur-xl">
                        <div>
                          <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                            Company Story
                          </p>
                          <p className="mt-6 max-w-sm font-display text-4xl leading-[0.95] text-white">
                            Luxury is built through restraint.
                          </p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {stats.slice(0, 3).map((item) => (
                            <div key={item.label} className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                              <p className="font-display text-3xl text-white">{item.value}</p>
                              <p className="mt-1 text-xs uppercase tracking-[0.25em] text-white/55">
                                {item.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Reveal>

            <div className="grid gap-6">
              {[
                {
                  title: "Design-first thinking",
                  text: "A design language that feels architectural before it feels decorative.",
                },
                {
                  title: "Execution discipline",
                  text: "A calm workflow that keeps decisions visible and the site under control.",
                },
                {
                  title: "Trade confidence",
                  text: "Reliable sourcing and supply for contractors who value consistency.",
                },
              ].map((item, index) => (
                <Reveal key={item.title} delay={index * 0.08}>
                  <Card className="h-full">
                    <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--muted)]">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-4 font-display text-3xl text-[color:var(--foreground)]">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">{item.text}</p>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="py-10 sm:py-20">
          <SectionShell
            eyebrow="Services"
            title="A refined suite of design, execution, and material capabilities."
            description="Every service is shaped to feel premium, precise, and quietly efficient, from idea to installation."
          />

          <div className="mx-auto mt-10 grid max-w-7xl gap-4 px-6 sm:px-8 md:grid-cols-2 xl:grid-cols-4 lg:px-10">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Reveal key={service.title} delay={index * 0.04}>
                  <Card className="group h-full min-h-[16rem] transition-all duration-500 hover:-translate-y-1 hover:border-[color:var(--accent)]/35 hover:bg-white/[0.08]">
                    <div className="flex h-full flex-col justify-between gap-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-white/5 text-[color:var(--accent)] transition-transform duration-500 group-hover:scale-105">
                          <Icon className="h-5 w-5" />
                        </div>
                        <MoveUpRight className="h-4 w-4 text-[color:var(--muted)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </div>
                      <div>
                        <h3 className="font-display text-2xl text-[color:var(--foreground)]">
                          {service.title}
                        </h3>
                        <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section id="projects" className="py-10 sm:py-20">
          <SectionShell
            eyebrow="Featured Projects"
            title="Immersive project presentations with full-screen presence."
            description="A masonry-like luxury grid, soft hover motion, and a before/after slider for one of the studio's execution stories."
          />

          <div className="mx-auto mt-10 grid max-w-7xl gap-6 px-6 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
            <Reveal>
              <Card className="overflow-hidden p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {projects.map((project, index) => (
                    <motion.article
                      key={project.name}
                      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
                      whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.25 }}
                      transition={{ duration: 0.6, delay: index * 0.08 }}
                      whileHover={{ y: -6 }}
                      className="group relative overflow-hidden rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface)]/60"
                    >
                      <div className={`min-h-80 bg-gradient-to-br ${project.tone}`} />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(10,10,10,0.86))]" />
                      <div className="absolute inset-0 flex flex-col justify-end p-5">
                        <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.28em] text-white/65">
                          <span>{project.style}</span>
                          <span>{project.area}</span>
                        </div>
                        <h3 className="font-display text-3xl text-white">{project.name}</h3>
                        <p className="mt-3 max-w-sm text-sm leading-7 text-white/72">
                          {project.description}
                        </p>
                        <div className="mt-4 flex items-center justify-between rounded-full border border-white/10 bg-white/8 px-4 py-3 text-xs uppercase tracking-[0.24em] text-white/75 backdrop-blur-xl">
                          <span>{project.accent}</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </Card>
            </Reveal>

            <div className="grid gap-6">
              <Reveal>
                <Card className="overflow-hidden p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <Badge>Before / After</Badge>
                      <h3 className="mt-4 font-display text-3xl text-[color:var(--foreground)]">
                        One room, two states.
                      </h3>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-white/5 text-[color:var(--accent)]">
                      <SlidersHorizontal className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-[color:var(--border)] bg-white/5">
                    <div className="relative h-[24rem]">
                      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(10,10,10,0.95),rgba(64,47,30,0.92)),radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_34%)]" />
                      <div
                        className="absolute inset-y-0 left-0 overflow-hidden border-r border-[color:var(--accent)]/45"
                        style={{ width: `${split}%` }}
                      >
                        <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(35,27,20,0.96),rgba(145,118,74,0.82)),radial-gradient(circle_at_top,rgba(255,255,255,0.15),transparent_30%)]" />
                        <div className="absolute inset-x-0 bottom-0 flex items-end p-5 text-white">
                          <div className="max-w-[12rem]">
                            <p className="text-xs uppercase tracking-[0.3em] text-white/55">Before</p>
                            <p className="mt-2 font-display text-xl leading-tight sm:text-2xl">
                              Raw shell with potential
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="absolute inset-0 flex items-end justify-end p-5 text-white">
                        <div className="max-w-[12rem] text-right">
                          <p className="text-xs uppercase tracking-[0.3em] text-white/55">After</p>
                          <p className="mt-2 font-display text-xl leading-tight sm:text-2xl">
                            Polished luxury finish
                          </p>
                        </div>
                      </div>
                      <div
                        className="absolute inset-y-4 z-10 w-1 -translate-x-1/2 rounded-full bg-[color:var(--accent)] shadow-[0_0_30px_rgba(199,166,110,0.7)]"
                        style={{ left: `${split}%` }}
                      />
                    </div>
                    <div className="border-t border-[color:var(--border)] p-4">
                      <input
                        type="range"
                        min={15}
                        max={85}
                        value={split}
                        onChange={(event) => setSplit(Number(event.target.value))}
                        className="w-full accent-[color:var(--accent)]"
                        aria-label="Before after slider"
                      />
                    </div>
                  </div>
                </Card>
              </Reveal>

              <Reveal>
                <Card className="bg-white/[0.05] p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
                    Project Flow
                  </p>
                  <p className="mt-3 font-display text-3xl text-[color:var(--foreground)]">
                    Presentation that feels cinematic.
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                    Hover states, layered light, and a restrained palette keep the portfolio premium
                    without becoming heavy.
                  </p>
                </Card>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="process" className="py-12 sm:py-20">
          <SectionShell
            eyebrow="PROCESS"
            title="A clear six-step process built around timing, coordination, and delivery."
            description="A simple, direct workflow that moves from brief to handover with clear checkpoints at every stage."
          />

          <div className="mx-auto mt-10 max-w-7xl px-6 sm:px-8 lg:px-10">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {[
                { title: "01. Briefing", body: "We align on scope, intent, budget, and expectations before anything starts." },
                { title: "02. Concept Design", body: "Layouts, mood direction, and material ideas are shaped into a clear direction." },
                { title: "03. Material Selection", body: "Finishes, products, and details are reviewed for fit, performance, and timing." },
                { title: "04. Documentation", body: "Drawings, specifications, and coordination details are prepared for production." },
                { title: "05. Execution", body: "Site work, vendor coordination, and quality control are managed through delivery." },
                { title: "06. Handover", body: "Final checks, styling, and walkthroughs complete the project cleanly." },
              ].map((step) => (
                <Card key={step.title} className="p-6">
                  <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">Process step</p>
                  <h3 className="mt-4 font-display text-2xl text-[color:var(--foreground)]">{step.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">{step.body}</p>
                </Card>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <MagneticButton onClick={() => scrollToSection('contact')}>Book Consultation <ArrowRight className="h-4 w-4" /></MagneticButton>
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-10 sm:py-20">
          <SectionShell
            eyebrow="Testimonials"
            title="Quietly confident words from clients and partners."
            description="A restrained slider keeps the focus on trust, craftsmanship, and the experience of delivery."
          />

          <div className="mx-auto mt-10 max-w-7xl px-6 sm:px-8 lg:px-10">
            <Card className="overflow-hidden p-6 sm:p-8">
              <div className="grid gap-6 lg:grid-cols-[1fr_0.35fr] lg:items-end">
                <div className="relative min-h-[18rem] rounded-[1.75rem] border border-[color:var(--border)] bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 sm:p-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={testimonials[activeTestimonial].name}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -18 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className="grid h-full gap-4"
                    >
                      <Quote className="h-8 w-8 text-[color:var(--accent)]" />
                      <p className="max-w-3xl font-display text-3xl leading-tight text-[color:var(--foreground)] sm:text-4xl">
                        {testimonials[activeTestimonial].quote}
                      </p>
                      <div className="mt-auto">
                        <p className="text-sm uppercase tracking-[0.28em] text-[color:var(--muted)]">
                          {testimonials[activeTestimonial].role}
                        </p>
                        <p className="mt-2 text-lg text-[color:var(--foreground)]">
                          {testimonials[activeTestimonial].name}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex items-center justify-between gap-3 lg:flex-col lg:items-stretch">
                  <Button variant="outline" size="sm" onClick={() => setActiveTestimonial((value) => (value - 1 + testimonials.length) % testimonials.length)}>
                    <ChevronLeft className="h-4 w-4" />
                    Prev
                  </Button>
                  <div className="hidden h-px w-full bg-[color:var(--border)] lg:block" />
                  <Button variant="outline" size="sm" onClick={() => setActiveTestimonial((value) => (value + 1) % testimonials.length)}>
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section id="gallery" className="py-10 sm:py-20">
          <SectionShell
            eyebrow="Gallery"
            title="A square showcase of circular image medallions."
            description="The gallery now stays clean and sculptural, with circular cards inside a large rounded square and a lightbox for full detail."
          />

          <div className="mx-auto mt-10 max-w-7xl px-6 sm:px-8 lg:px-10">
            <div className="flex flex-wrap gap-2">
              {galleryFilters.map((filter) => (
                <Button
                  key={filter}
                  variant={selectedGalleryFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedGalleryFilter(filter)}
                >
                  {filter}
                </Button>
              ))}
            </div>

            <div className="mt-6">
              <div className="gallery-square relative mx-auto aspect-square w-full max-w-[min(100vw-1.5rem,72rem)] overflow-hidden rounded-[2.75rem] border border-[color:var(--border)] bg-[radial-gradient(circle_at_top_left,rgba(199,166,110,0.16),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.06),transparent_20%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] p-4 shadow-[0_35px_120px_-55px_rgba(0,0,0,0.75)] sm:p-6 lg:p-8">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <div className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/6" />
                  <div className="absolute left-1/2 top-1/2 h-[52%] w-[52%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/6" />
                  <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-[rgba(199,166,110,0.10)] blur-3xl" />
                  <div className="absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-[rgba(255,255,255,0.06)] blur-3xl" />
                </div>

                <div
                  ref={galleryScrollRef}
                  onScroll={(event) => {
                    if (event.currentTarget.scrollTop > 14) {
                      setShowGalleryScrollHint(false);
                    }
                  }}
                  className="relative grid h-full auto-rows-min grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3 overflow-y-auto pr-2 sm:grid-cols-[repeat(auto-fit,minmax(190px,1fr))] sm:gap-4 lg:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] lg:gap-5"
                >
                  {gallery.map((item, index) => {
                    const slot = galleryCircleLayouts[index % galleryCircleLayouts.length];
                    const isHero = index === 0;

                    return (
                      <Reveal key={item.title} delay={0}>
                        <button
                          type="button"
                          onClick={() => setLightboxIndex(index)}
                          className={`group relative aspect-square overflow-hidden rounded-full border border-[color:var(--border)] bg-[rgba(255,255,255,0.03)] text-left shadow-[0_18px_60px_-30px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.005] ${slot.cardClass} ${isHero ? 'ring-1 ring-[rgba(199,166,110,0.25)]' : ''}`}
                        >
                          <Image
                            src={item.image}
                            alt={item.title}
                            objectPosition={item.objectPosition ?? slot.imagePosition}
                            loading="eager"
                            decoding="async"
                            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08]"
                          />
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,transparent_48%,rgba(0,0,0,0.38))]" />
                          <div className="absolute inset-x-0 bottom-0 p-3 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <p className="text-[0.65rem] uppercase tracking-[0.28em] text-white/80">{item.category}</p>
                          </div>
                        </button>
                      </Reveal>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {showGalleryScrollHint ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.25 }}
                      className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center md:hidden"
                    >
                      <div className="rounded-full border border-white/20 bg-black/45 px-4 py-2 text-[0.65rem] uppercase tracking-[0.22em] text-white/90 backdrop-blur-xl shadow-[0_12px_35px_-18px_rgba(0,0,0,0.85)]">
                        <span className="inline-flex items-center gap-1.5">
                          <ChevronUp className="h-3.5 w-3.5" />
                          Swipe up for more photos
                        </span>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {lightboxIndex !== null ? (
              <motion.div
                className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 px-4 backdrop-blur-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setLightboxIndex(null)}
              >
                <motion.div
                  initial={{ scale: 0.96, y: 24 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.96, y: 24 }}
                  transition={{ duration: 0.35 }}
                  onClick={(event) => event.stopPropagation()}
                  className="w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-[color:var(--background)] shadow-[0_40px_120px_-60px_rgba(0,0,0,0.9)]"
                >
                  <div className="relative bg-black/80 p-6 flex items-center justify-center">
                    <button
                      type="button"
                      aria-label="Previous image"
                      onClick={() => setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length)}
                      className="absolute left-6 top-1/2 -translate-y-1/2 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-black/60 text-white shadow-xl ring-1 ring-white/10"
                      style={{ transform: 'translateY(-50%)' }}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>

                    <Image
                      src={gallery[lightboxIndex].image}
                      alt={gallery[lightboxIndex].note || ''}
                      objectPosition={gallery[lightboxIndex].objectPosition}
                      className="max-h-[70vh] w-auto object-contain"
                    />

                    <button
                      type="button"
                      aria-label="Next image"
                      onClick={() => setLightboxIndex((lightboxIndex + 1) % gallery.length)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-black/60 text-white shadow-xl ring-1 ring-white/10"
                      style={{ transform: 'translateY(-50%)' }}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="grid gap-5 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end">
                    <div>
                      <Badge>{gallery[lightboxIndex].category}</Badge>
                      <p className="mt-4 text-sm text-[color:var(--muted)]">Image {lightboxIndex + 1} of {gallery.length}</p>
                    </div>
                    <Button variant="outline" onClick={() => setLightboxIndex(null)}>
                      Close
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </section>

        <section id="contact" className="py-10 pb-24 sm:py-20 sm:pb-32">
          <SectionShell
            eyebrow="Contact"
            title="A minimal, high-touch contact section ready for new projects."
            description="The form is purely frontend, with clear calls to WhatsApp, phone, and email for immediate follow-up."
          />

          <div className="mx-auto mt-10 grid max-w-7xl gap-6 px-6 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
            <Reveal>
              <Card className="space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">
                    Direct contact
                  </p>
                  <h3 className="mt-4 font-display text-4xl text-[color:var(--foreground)]">
                    Start a project conversation.
                  </h3>
                </div>

                <div className="grid gap-3">
                  {[
                    { icon: Phone, label: "+91 00000 00000", action: "Call" },
                    { icon: Mail, label: "hello@interioandtrade.com", action: "Email" },
                    { icon: MoveUpRight, label: "WhatsApp quick inquiry", action: "WhatsApp" },
                  ].map(({ icon: Icon, label, action }) => (
                    <button
                      key={String(label)}
                      type="button"
                      className="flex items-center justify-between rounded-[1.25rem] border border-[color:var(--border)] bg-white/5 px-4 py-4 text-left transition-colors hover:bg-white/8"
                    >
                      <span className="flex items-center gap-3 text-sm text-[color:var(--foreground)]">
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--accent)]/12 text-[color:var(--accent)]">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span>
                          <span className="block font-medium">{action}</span>
                          <span className="block text-[color:var(--muted)]">{label}</span>
                        </span>
                      </span>
                      <ArrowRight className="h-4 w-4 text-[color:var(--muted)]" />
                    </button>
                  ))}
                </div>

                <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-[linear-gradient(145deg,rgba(199,166,110,0.16),rgba(255,255,255,0.02))] p-5">
                  <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">
                    Map Placeholder
                  </p>
                  <div className="mt-4 flex min-h-64 items-center justify-center rounded-[1.25rem] border border-dashed border-[color:var(--border)] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.09),transparent_35%),linear-gradient(145deg,rgba(10,10,10,0.94),rgba(28,22,17,0.94))] p-6 text-center">
                    <div>
                      <MapPinned className="mx-auto h-10 w-10 text-[color:var(--accent)]" />
                      <p className="mt-4 font-display text-3xl text-[color:var(--foreground)]">
                        Embedded map UI placeholder
                      </p>
                      <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                        Replace this with the preferred location widget when the studio location is finalized.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </Reveal>

            <Reveal>
              <Card className="bg-white/[0.05] p-6 sm:p-8">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">
                      Inquiry form
                    </p>
                    <h3 className="mt-4 font-display text-4xl text-[color:var(--foreground)]">
                      Floating labels, polished spacing, no backend.
                    </h3>
                  </div>
                  <Badge>Frontend Only</Badge>
                </div>

                <form
                  className="mt-8 grid gap-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                  }}
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="relative block">
                      <span className="pointer-events-none absolute left-4 top-4 text-xs uppercase tracking-[0.28em] text-[color:var(--muted)] transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-4 peer-focus:translate-y-0 peer-focus:text-xs">
                        Full Name
                      </span>
                      <Input className="peer pt-6" placeholder=" " />
                    </label>
                    <label className="relative block">
                      <span className="pointer-events-none absolute left-4 top-4 text-xs uppercase tracking-[0.28em] text-[color:var(--muted)] transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-4 peer-focus:translate-y-0 peer-focus:text-xs">
                        Phone Number
                      </span>
                      <Input className="peer pt-6" placeholder=" " />
                    </label>
                  </div>

                  <label className="relative block">
                    <span className="pointer-events-none absolute left-4 top-4 text-xs uppercase tracking-[0.28em] text-[color:var(--muted)] transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-4 peer-focus:translate-y-0 peer-focus:text-xs">
                      Project Type
                    </span>
                    <Input className="peer pt-6" placeholder=" " />
                  </label>

                  <label className="relative block">
                    <span className="pointer-events-none absolute left-4 top-4 text-xs uppercase tracking-[0.28em] text-[color:var(--muted)] transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-4 peer-focus:translate-y-0 peer-focus:text-xs">
                      Requirements
                    </span>
                    <Textarea className="peer pt-6" placeholder=" " />
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <MagneticButton type="submit">
                      Send Inquiry
                      <Send className="h-4 w-4" />
                    </MagneticButton>
                    <MagneticButton variant="outline" type="button" onClick={() => scrollToSection("home")}>
                      Back to Top
                    </MagneticButton>
                  </div>
                </form>
              </Card>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-[color:var(--border)] bg-[color:var(--background)]/75 px-6 py-10 backdrop-blur-xl sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-white/5 text-sm font-semibold tracking-[0.3em] text-[color:var(--accent)]">
                BWD
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--muted)]">
                  Balaji Wood Decor
                </p>
                <p className="text-sm text-[color:var(--foreground)]/90">
                  Luxury Interiors, Execution, and Material Supply
                </p>
              </div>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[color:var(--muted)]">
              A premium frontend experience built for visual presentation, brand identity, and
              smooth conversion-focused storytelling.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Home", "About", "Services"],
              ["Projects", "Contact"],
              ["Instagram", "LinkedIn", "WhatsApp"],
            ].map((group, index) => (
              <div key={String(index)} className="space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
                  {index === 2 ? "Social" : "Links"}
                </p>
                <div className="grid gap-2 text-sm text-[color:var(--foreground)]/88">
                  {group.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => scrollToSection(item.toLowerCase())}
                      className="text-left text-[color:var(--foreground)]/82 transition-colors hover:text-[color:var(--accent)]"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
