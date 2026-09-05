"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Blocks,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  Code2,
  Globe2,
  HeartPulse,
  Hotel,
  Layers3,
  Menu,
  MonitorSmartphone,
  Palette,
  Rocket,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Utensils,
  WandSparkles,
  X,
} from "lucide-react";
import { projects } from "@/lib/projects";
import { SiteFooter } from "@/components/site-footer";

const services = [
  [
    ShoppingBag,
    "E-commerce Website",
    "Scalable stores with thoughtful product journeys, payments and custom functionality.",
  ],
  [
    Rocket,
    "Landing Page",
    "High-converting campaign pages built to turn focused traffic into real enquiries.",
  ],
  [
    Palette,
    "Portfolio Website",
    "Distinctive showcases for professionals, agencies, creators and growing brands.",
  ],
  [
    CalendarDays,
    "Booking Website",
    "Smooth appointment and booking experiences tailored to how your business works.",
  ],
  [
    WandSparkles,
    "Website Redesign",
    "A strategic transformation from dated website to modern, responsive experience.",
  ],
  [
    Layers3,
    "Wix Studio Website",
    "Advanced responsive layouts, interactions and modern UI systems in Wix Studio.",
  ],
  [
    MonitorSmartphone,
    "Responsive Optimization",
    "Consistent, intentional experiences across mobile, tablet and desktop.",
  ],
  [
    Code2,
    "Velo Code Development",
    "Custom APIs, databases, automations, dynamic pages and business logic.",
  ],
  [
    Blocks,
    "Custom Design & Development",
    "A fully tailored Wix solution built around your needs—not a generic template.",
  ],
];

const teamMembers = [
  {
    initials: "01",
    name: "Mubassir Bappi",
    role: "Lead Web Developer",
    focus: "Custom APIs · Velo · Wix Apps",
    photo: "/mubassir-bappi.jpg",
  },
  {
    initials: "02",
    name: "Ashiqur Rahman",
    role: "Velo Developer",
    focus: "Velo code · APIs · Automation",
    photo: "/ashiqur-rahman.jpg",
  },
  {
    initials: "03",
    name: "Raisul Islam",
    role: "Wix Studio Expert",
    focus: "Responsive design · Wix Studio",
    photo: "/raisul-islam.jpg",
  },
  {
    initials: "04",
    name: "Raihan Hasan",
    role: "Wix CMS Expert",
    focus: "CMS architecture · Dynamic content",
    photo: "/raihan-hasan.jpg",
  },
];
const marketplaceServices = [
  {
    title: "Wix Studio Design",
    description:
      "Distinctive, responsive layouts designed around your brand and business goals.",
  },
  {
    title: "Custom Velo Development",
    description:
      "Smart functionality, CMS systems and integrations built for the way you work.",
  },
  {
    title: "Website Redesign",
    description:
      "A thoughtful visual and structural refresh that makes your website feel current.",
  },
  {
    title: "Responsive Optimization",
    description:
      "A polished experience across desktop, tablet and mobile—without compromise.",
  },
];
const clientReviews = [
  {
    name: "A service-business founder",
    role: "Professional Services",
    initials: "SF",
    quote:
      "The process felt clear, collaborative and considered from the first conversation through delivery.",
  },
  {
    name: "An e-commerce team",
    role: "Retail",
    initials: "ET",
    quote:
      "A thoughtful balance of design quality and practical functionality—exactly what the project needed.",
  },
  {
    name: "A growing agency",
    role: "Creative Services",
    initials: "GA",
    quote:
      "Responsive communication, strong attention to detail and a website built around the way our business works.",
  },
  {
    name: "boldprintedtees",
    role: "Verified Client",
    initials: "BT",
    quote:
      "Very good work, great communication, and brought my project to life. Would recommend.",
  },
  {
    name: "jose_eels",
    role: "Verified Client",
    initials: "JE",
    quote:
      "I've worked with Mahedi in the past, and I will again in the future. He's become a trusted resource—dependable and professional.",
  },
  {
    name: "phiman277",
    role: "Verified Client",
    initials: "P2",
    quote:
      "Great delivery of exactly what I wanted. It took a few changes, as some things were lost in translation. However, we worked through the problem areas and got everything corrected. I am overall happy with the result.",
  },
  {
    name: "michaelkandl",
    role: "Verified Client",
    initials: "MK",
    quote:
      "The website is exactly what I wanted. He was patient and responsive. I would recommend him to my friends.",
  },
  {
    name: "bruceastein",
    role: "Verified Client",
    initials: "BA",
    quote:
      "I had an excellent experience working with Jhuma as my website designer. Everyone was honest, transparent and easy to communicate with throughout the entire process. What really stood out was the cooperative attitude—they listened carefully to my ideas and offered helpful suggestions.",
  },
];

function ButtonLink({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
}) {
  return (
    <a className={secondary ? "button button-secondary" : "button"} href={href}>
      <span className="button-sizer" aria-hidden="true">
        <span>{children}</span>
        <i />
      </span>
      <span className="button-label">{children}</span>
      <span className="button-icon">
        <ArrowRight size={17} />
      </span>
    </a>
  );
}

function MarketplaceSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % marketplaceServices.length),
      4200,
    );
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <div
      className="capability-slider stack-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Wix services"
    >
      <div className="capability-stack">
        {marketplaceServices.map(({ title, description }, index) => {
          const position =
            (index - active + marketplaceServices.length) %
            marketplaceServices.length;
          return (
            <article
              className={`capability-slide stack-${position}`}
              key={title}
              aria-hidden={position !== 0}
              onClick={() => position !== 0 && setActive(index)}
            >
              <div className="capability-card-head">
                <Image
                  src="/devx-symbol.png"
                  alt="DevXStudio"
                  width={42}
                  height={33}
                  unoptimized
                />
                <div>
                  <small>Built around your goals</small>
                  <strong>Design. Develop. Deliver.</strong>
                </div>
              </div>
              <div className="capability-content">
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </article>
          );
        })}
      </div>
      <div
        className="capability-controls"
        role="group"
        aria-label="Choose service"
      >
        {marketplaceServices.map((service, index) => (
          <button
            type="button"
            key={service.title}
            className={active === index ? "active" : ""}
            onClick={() => setActive(index)}
            aria-label={`Show ${service.title}`}
            aria-pressed={active === index}
          >
            <span />
          </button>
        ))}
      </div>
    </div>
  );
}

function ReviewStack() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % clientReviews.length),
      5000,
    );
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <div
      className="review-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Client reviews"
    >
      <div className="review-stack">
        {clientReviews.map((review, index) => {
          const position =
            (index - active + clientReviews.length) % clientReviews.length;
          return (
            <article
              className={`review-card review-stack-${position}`}
              key={review.name}
              aria-hidden={position !== 0}
              onClick={() => position !== 0 && setActive(index)}
            >
              <div className="stars">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} size={15} fill="currentColor" />
                ))}
              </div>
              <p>“{review.quote}”</p>
              <div className="review-person">
                <span className="quote-avatar">{review.initials}</span>
                <strong>
                  {review.name}
                  <small>{review.role}</small>
                </strong>
              </div>
            </article>
          );
        })}
      </div>
      <div className="review-controls" role="group" aria-label="Choose review">
        {clientReviews.map((review, index) => (
          <button
            type="button"
            key={review.name}
            className={active === index ? "active" : ""}
            onClick={() => setActive(index)}
            aria-label={`Show review from ${review.name}`}
            aria-pressed={active === index}
          />
        ))}
      </div>
    </div>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const numberRef = useRef<HTMLSpanElement>(null);
  const played = useRef(false);
  useEffect(() => {
    const node = numberRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || played.current) return;
        played.current = true;
        const startedAt = performance.now();
        const animate = (now: number) => {
          const progress = Math.min((now - startedAt) / 1600, 1);
          setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 4))));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        observer.disconnect();
      },
      { threshold: 0.45 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);
  return (
    <span ref={numberRef} className="animated-number">
      <span className="number-reel">{display}</span>
      <i>+</i>
    </span>
  );
}

const veloCode = `import wixData from 'wix-data';

export async function loadProjects() {
  const results = await wixData
    .query('Projects')
    .descending('featured')
    .find();

  return results.items;
}`;

function TypingCode() {
  const [typed, setTyped] = useState("");
  useEffect(() => {
    let index = 0;
    let timer: ReturnType<typeof setTimeout>;
    const typeNext = () => {
      if (index <= veloCode.length) {
        setTyped(veloCode.slice(0, index));
        index += 1;
        timer = setTimeout(typeNext, index === 1 ? 400 : 32);
      } else {
        timer = setTimeout(() => {
          index = 0;
          setTyped("");
          typeNext();
        }, 2200);
      }
    };
    typeNext();
    return () => clearTimeout(timer);
  }, []);
  return (
    <pre className="typing-code" aria-label="Animated Wix Velo code example">
      <code>{typed}</code>
      <span className="code-cursor" aria-hidden="true" />
    </pre>
  );
}

const heroDemoCode = `const site = await createSite({\n  brand: "DevXStudio",\n  responsive: true,\n});\n\nawait site.publish();`;

function LaptopDemo() {
  const [phase, setPhase] = useState<"code" | "publishing" | "live">("code");
  const [typed, setTyped] = useState("");
  const previewRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let typingTimer: ReturnType<typeof setInterval>;
    let publishTimer: ReturnType<typeof setTimeout>;
    let liveTimer: ReturnType<typeof setTimeout>;
    let restartTimer: ReturnType<typeof setTimeout>;

    const runDemo = () => {
      let index = 0;
      setPhase("code");
      setTyped("");
      typingTimer = setInterval(() => {
        index += 1;
        setTyped(heroDemoCode.slice(0, index));
        if (index < heroDemoCode.length) return;
        clearInterval(typingTimer);
        publishTimer = setTimeout(() => setPhase("publishing"), 500);
        liveTimer = setTimeout(() => setPhase("live"), 1500);
        restartTimer = setTimeout(runDemo, 8500);
      }, 27);
    };

    runDemo();
    return () => {
      clearInterval(typingTimer);
      clearTimeout(publishTimer);
      clearTimeout(liveTimer);
      clearTimeout(restartTimer);
    };
  }, []);

  useEffect(() => {
    if (phase !== "live") return;
    const frameWindow = previewRef.current?.contentWindow;
    const frameDocument = previewRef.current?.contentDocument;
    if (!frameWindow || !frameDocument) return;

    frameWindow.scrollTo(0, 0);
    const startedAt = performance.now();
    const duration = 6200;
    let animationFrame = 0;
    const scrollPreview = (now: number) => {
      const maxScroll = Math.max(
        0,
        frameDocument.documentElement.scrollHeight - frameWindow.innerHeight,
      );
      const progress = Math.min((now - startedAt) / duration, 1);
      const downwardProgress = Math.min(progress / 0.68, 1);
      const upwardProgress = Math.max((progress - 0.68) / 0.32, 0);
      const easeInOut = (value: number) =>
        value < 0.5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2;
      const scrollPosition =
        progress <= 0.68
          ? maxScroll * easeInOut(downwardProgress)
          : maxScroll * (1 - easeInOut(upwardProgress));
      frameWindow.scrollTo(0, scrollPosition);
      if (progress < 1) animationFrame = requestAnimationFrame(scrollPreview);
    };
    animationFrame = requestAnimationFrame(scrollPreview);
    return () => cancelAnimationFrame(animationFrame);
  }, [phase]);

  return (
    <div className="hero-laptop" aria-label="Code to live website animation">
      <div className="laptop-screen">
        <div className="laptop-toolbar">
          <div>
            <i />
            <i />
            <i />
          </div>
          <span>
            {phase === "live" ? "devxstudio.com" : "studio.devxstudio.com"}
          </span>
          <b className={phase === "publishing" ? "is-publishing" : ""}>
            {phase === "live" ? (
              <>
                <Check size={11} /> Live
              </>
            ) : phase === "publishing" ? (
              "Publishing…"
            ) : (
              "Publish"
            )}
          </b>
        </div>
        <div
          className={`laptop-stage ${phase === "live" ? "show-live" : "show-code"}`}
          aria-live="polite"
        >
          <div className="laptop-code">
            <div className="code-file">
              <Code2 size={13} /> page.tsx
            </div>
            <pre>
              <code>{typed}</code>
              <span className="code-cursor" aria-hidden="true" />
            </pre>
            <small>
              <span /> Building your experience
            </small>
          </div>
          <div className="laptop-live-site">
            <iframe
              ref={previewRef}
              src="/preview"
              title="DevXStudio full website preview"
              tabIndex={-1}
            />
          </div>
        </div>
      </div>
      <div className="laptop-base">
        <span />
      </div>
      <div className="demo-status">
        <span className={phase} />
        {phase === "code"
          ? "Writing code"
          : phase === "publishing"
            ? "Publishing site"
            : "Live site preview"}
      </div>
    </div>
  );
}

function PreviewHeroVisual() {
  return (
    <div className="hero-visual preview-hero-visual" aria-hidden="true">
      <div className="browser main-browser">
        <div className="browser-top">
          <i />
          <i />
          <i />
          <span>devxstudio.com</span>
        </div>
        <div className="browser-content">
          <div className="preview-nav">
            <Image
              src="/devx-symbol.png"
              alt=""
              width={34}
              height={26}
              unoptimized
            />
            <span />
            <span />
            <b />
          </div>
          <p>
            Digital experiences for
            <br />
            <strong>forward-thinking brands.</strong>
          </p>
          <div className="preview-grid">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
      <div className="status-pill">
        <span /> Available for new projects
      </div>
    </div>
  );
}

const processSteps = [
  ["01", "Discover", "Your business, goals and audience."],
  ["02", "Strategy", "Structure, journey and functionality."],
  ["03", "Design", "Modern, focused visual direction."],
  ["04", "Develop", "Wix Studio, Velo and integrations."],
  ["05", "Launch", "Testing, refinement and optimization."],
];

function ProcessTimeline() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(-1);
  const started = useRef(false);
  useEffect(() => {
    const node = timelineRef.current;
    if (!node) return;
    let interval: ReturnType<typeof setInterval>;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        let step = 0;
        setActiveStep(0);
        interval = setInterval(() => {
          step += 1;
          setActiveStep(step);
          if (step >= processSteps.length) clearInterval(interval);
        }, 850);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      if (interval) clearInterval(interval);
    };
  }, []);
  const progress =
    activeStep < 0
      ? 0
      : (Math.min(activeStep, processSteps.length - 1) /
          (processSteps.length - 1)) *
        100;
  return (
    <div className="process-line animated-process" ref={timelineRef}>
      <div className="process-progress-track">
        <span style={{ width: `${progress}%`, height: `${progress}%` }} />
      </div>
      {processSteps.map((step, index) => {
        const complete = activeStep > index;
        const current = activeStep === index;
        return (
          <article
            className={`${complete ? "complete" : ""} ${current ? "current" : ""}`}
            key={step[0]}
          >
            <span className="step-marker">
              {complete ? <Check size={19} strokeWidth={3} /> : step[0]}
            </span>
            <h3>{step[1]}</h3>
            <p>{step[2]}</p>
          </article>
        );
      })}
    </div>
  );
}

export function SitePage({ preview = false }: { preview?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [preloaderVisible, setPreloaderVisible] = useState(!preview);
  const [preloaderLeaving, setPreloaderLeaving] = useState(false);
  const featuredProjectSlugs = ["rock-spring-trading", "space-nursing-society", "listo", "northstead-finance"];
  const featuredProjects = projects.filter((project) => featuredProjectSlugs.includes(project.slug));
  const nav = [
    ["Services", "#services"],
    ["Our Work", "/work"],
    ["Our Team", "/team"],
    ["Why DevXStudio", "#why"],
    ["Process", "#process"],
    ["Testimonials", "#testimonials"],
    ["Contact", "/contact"],
  ];
  useLayoutEffect(() => {
    if (preview) return;
    const hasSeenPreloader = window.sessionStorage.getItem("devx-preloader-seen");
    if (hasSeenPreloader) {
      setPreloaderVisible(false);
      setPreloaderLeaving(false);
      return;
    }
    window.sessionStorage.setItem("devx-preloader-seen", "true");
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const revealTimer = window.setTimeout(
      () => setPreloaderLeaving(true),
      3000,
    );
    const removeTimer = window.setTimeout(() => {
      setPreloaderVisible(false);
      document.body.style.overflow = previousOverflow;
    }, 3650);
    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(removeTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [preview]);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    const groups = [
      ".section-head",
      ".service-card",
      ".expertise-grid > div",
      ".project-card",
      ".why-grid article",
      ".velo-grid > div",
      ".testimonial-grid article",
      ".industry-grid > div",
      ".team-card",
      ".marketplace-grid > div",
      ".faq-grid > div",
      ".final-cta .container > *",
      ".footer-grid > div",
    ];
    const items = document.querySelectorAll<HTMLElement>(groups.join(","));
    items.forEach((item, index) => {
      item.classList.add("reveal-item");
      item.style.setProperty("--reveal-delay", `${(index % 4) * 70}ms`);
    });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -45px" },
    );
    items.forEach((item) => observer.observe(item));
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);
  return (
    <main className={preview ? "site-preview-mode" : undefined}>
      {preloaderVisible && (
        <div
          className={`site-preloader ${preloaderLeaving ? "is-leaving" : ""}`}
          role="status"
          aria-label="Loading DevXStudio"
        >
          <Image className="preloader-source-symbol" src="/devx-symbol.png" alt="" width={180} height={139} priority unoptimized />
          <div className="preloader-wordmark" aria-hidden="true">
            <span className="preloader-dev"><b>D</b><i>EV</i></span>
            <span className="preloader-x">X</span>
            <span className="preloader-studio">STUDIO</span>
          </div>
          <div className="preloader-line">
            <i />
          </div>
        </div>
      )}
      <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <button
          type="button"
          className="brand"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <Image
            src="/devx-symbol.png"
            alt="DevXStudio"
            width={360}
            height={278}
            priority
            unoptimized
          />
        </button>
        <nav
          className={menuOpen ? "nav-links open" : "nav-links"}
          aria-label="Main navigation"
        >
          {nav.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
          <a
            className="nav-mobile-cta"
            href="/contact"
            onClick={() => setMenuOpen(false)}
          >
            Start a Project <ArrowRight size={16} />
          </a>
        </nav>
        <a className="nav-cta header-cta" href="/contact">
          <span className="nav-cta-label">Start a Project</span>
          <span className="nav-cta-icon">
            <ArrowRight size={16} />
          </span>
        </a>
        <button
          className="menu-button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <section className="hero" id="home">
        <div className="hero-glow" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="pulse" /> Wix Studio design & development agency
            </div>
            <h1>
              We build websites that <em>move business</em> forward.
            </h1>
            <p>
              DevXStudio creates modern, conversion-focused and scalable digital
              experiences with Wix Studio and Velo.
            </p>
            <div className="hero-actions">
              <ButtonLink href="/contact">Start a Project</ButtonLink>
              <ButtonLink href="#work" secondary>
                View Our Work
              </ButtonLink>
            </div>
          </div>
          {preview ? (
            <PreviewHeroVisual />
          ) : (
            <div className="hero-visual">
              <LaptopDemo />
            </div>
          )}
        </div>
        <div className="hero-strip">
          <span>WIX STUDIO</span>
          <i />
          <span>VELO DEVELOPMENT</span>
          <i />
          <span>CUSTOM DESIGN</span>
          <i />
          <span>E-COMMERCE</span>
          <i />
          <span>RESPONSIVE UX</span>
        </div>
      </section>

      <section className="stats-section">
        <div className="container stats-grid">
          <div>
            <strong>
              <AnimatedNumber value={1000} />
            </strong>
            <p>Projects completed</p>
          </div>
          <div>
            <strong>
              <AnimatedNumber value={600} />
            </strong>
            <p>Unique clients</p>
          </div>
          <div>
            <strong>
              <AnimatedNumber value={400} />
            </strong>
            <p>Repeat clients</p>
          </div>
          <div className="expert-stat">
            <BadgeCheck />
            <strong>Wix Studio</strong>
            <p>Design & development experts</p>
          </div>
        </div>
        <p className="trust-line">
          <Globe2 size={17} /> Trusted by businesses, entrepreneurs and brands
          worldwide.
        </p>
      </section>

      <section className="section" id="services">
        <div className="container">
          <div className="section-head split-head">
            <div>
              <span className="kicker">What we do</span>
              <h2>
                Everything you need to build a <em>better website.</em>
              </h2>
            </div>
            <p>
              From strategy and custom design to advanced Wix development and
              optimization, we provide complete website solutions under one
              roof.
            </p>
          </div>
          <div className="service-grid">
            {services.map(([Icon, title, desc]) => {
              const I = Icon as typeof BriefcaseBusiness;
              return (
                <article className="service-card" key={String(title)}>
                  <div className="service-icon">
                    <I size={23} />
                  </div>
                  <span className="service-arrow">
                    <ArrowRight size={18} />
                  </span>
                  <h3>{String(title)}</h3>
                  <p>{String(desc)}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section expertise">
        <div className="container expertise-grid">
          <div className="expertise-visual">
            <div className="code-window">
              <div className="code-bar">
                <i />
                <i />
                <i />
                <span>project.cms.js</span>
              </div>
              <TypingCode />
            </div>
            <div className="design-panel">
              <span>Responsive canvas</span>
              <div className="design-block big" />
              <div className="design-row">
                <div />
                <div />
              </div>
              <small>
                <Check size={14} /> All breakpoints optimized
              </small>
            </div>
          </div>
          <div>
            <span className="kicker">Built beyond the template</span>
            <h2>
              More than design. We build with <em>Wix Studio.</em>
            </h2>
            <p className="lead">
              Our team combines creative direction with technical development to
              build powerful websites that are responsive, scalable and tailored
              to your business goals.
            </p>
            <div className="check-grid">
              {[
                "Advanced Wix Studio Design",
                "Custom Responsive Layouts",
                "Wix Velo Development",
                "CMS & Dynamic Pages",
                "API Integrations",
                "Custom Business Logic",
                "Third-Party Integrations",
                "Performance Optimization",
                "Mobile Optimization",
                "Animations & Interactions",
              ].map((x) => (
                <span key={x}>
                  <Check size={15} />
                  {x}
                </span>
              ))}
            </div>
            <ButtonLink href="/contact">Explore Our Expertise</ButtonLink>
          </div>
        </div>
      </section>

      <section className="section work-section" id="work">
        <div className="container">
          <div className="section-head center">
            <span className="kicker">Selected portfolio</span>
            <h2>
              Our work speaks <em>for itself.</em>
            </h2>
            <p>
              Explore digital experiences we&apos;ve designed and developed
              across different industries.
            </p>
          </div>
          <div className="portfolio-grid">
            {featuredProjects.map((p, i) => (
              <article className="project-card" key={p.name}>
                <div className={`project-image ${p.theme}`}>
                  {p.screenshot ? (
                    <div className="project-screenshot">
                      <Image
                        src={p.screenshot}
                        alt={`${p.name} full website design`}
                        width={1920}
                        height={6070}
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="mini-site">
                      <div className="mini-site-scroll">
                        <div className="mini-site-top">
                          <b>{p.name}</b>
                          <span />
                          <span />
                          <a className="mini-site-button" href={`/work/${p.slug}`}>Explore</a>
                        </div>
                        <div className="mini-site-body">
                          <small>{p.type}</small>
                          <strong>
                            {i % 2
                              ? "Make the everyday memorable."
                              : "Ideas made visible."}
                          </strong>
                          <p>{p.desc}</p>
                          <i />
                        </div>
                        <div className="mini-site-intro">
                          <small>ABOUT THE PROJECT</small>
                          <strong>
                            Thoughtful design.
                            <br />
                            Measurable impact.
                          </strong>
                          <p>
                            A focused digital experience built around clarity,
                            trust and conversion.
                          </p>
                        </div>
                        <div className="mini-site-stats">
                          <span>
                            <b>2.4×</b> Engagement
                          </span>
                          <span>
                            <b>48%</b> More leads
                          </span>
                          <span>
                            <b>100%</b> Responsive
                          </span>
                        </div>
                        <div className="mini-site-gallery">
                          <small>SELECTED HIGHLIGHTS</small>
                          <div>
                            <i />
                            <i />
                            <i />
                            <i />
                          </div>
                        </div>
                        <div className="mini-site-cta">
                          <small>READY TO MOVE FORWARD?</small>
                          <strong>
                            Let&apos;s build something meaningful.
                          </strong>
                          <a className="mini-site-button" href="/contact">Start a conversation</a>
                        </div>
                        <div className="mini-site-footer">
                          <b>{p.name}</b>
                          <span>
                            {p.type} · {p.tag}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  <a
                    href={`/work/${p.slug}`}
                    className="view-project"
                  >
                    View Project <ArrowRight size={16} />
                  </a>
                </div>
                <div className="project-info">
                  <div>
                    <h3>{p.name}</h3>
                    <p>{p.desc}</p>
                  </div>
                  <span>
                    {p.type}
                    <br />
                    {p.tag}
                  </span>
                </div>
              </article>
            ))}
          </div>
          <div className="center-action">
            <ButtonLink href="/work" secondary>
              View All Projects
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="section" id="why">
        <div className="container">
          <div className="section-head split-head">
            <div>
              <span className="kicker">The DevX difference</span>
              <h2>
                Why businesses choose <em>DevXStudio.</em>
              </h2>
            </div>
            <p>
              A rare balance of experience, creative thinking and technical
              capability—focused on outcomes, not decoration.
            </p>
          </div>
          <div className="why-grid">
            {[
              [
                "01",
                "Proven Experience",
                "1000+ completed projects across different industries and business types.",
              ],
              [
                "02",
                "Long-Term Relationships",
                "400+ repeat clients reflect our focus on quality and lasting partnerships.",
              ],
              [
                "03",
                "Design + Development",
                "Premium UI/UX thinking meets powerful Wix Studio and Velo development.",
              ],
              [
                "04",
                "Business-Focused",
                "We build websites designed to support measurable business goals.",
              ],
              [
                "05",
                "Responsive by Default",
                "Every experience is carefully optimized for desktop, tablet and mobile.",
              ],
              [
                "06",
                "Custom Solutions",
                "Purpose-built solutions shaped around each client’s requirements.",
              ],
            ].map((x) => (
              <article key={x[0]}>
                <span>{x[0]}</span>
                <h3>{x[1]}</h3>
                <p>{x[2]}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section team-section" id="team">
        <div className="container">
          <div className="section-head split-head">
            <div>
              <span className="kicker">The people behind the work</span>
              <h2>
                Small team.
                <br />
                <em>Big capability.</em>
              </h2>
            </div>
            <p>
              Designers, developers and strategists working as one focused
              team—from the first idea to the final launch.
            </p>
          </div>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <article className="team-card" key={`${member.role}-${index}`}>
                <div
                  className={`team-portrait ${member.photo ? "has-photo" : ""}`}
                >
                  {member.photo ? (
                    <Image
                      src={member.photo.replace(".jpg", "-unified.png")}
                      alt={member.name}
                      width={640}
                      height={640}
                      unoptimized
                    />
                  ) : (
                    <>
                      <span>{member.initials}</span>
                      <i />
                      <i />
                    </>
                  )}
                </div>
                <div className="team-details">
                  <span>{member.role}</span>
                  <h3>{member.name}</h3>
                  <p>{member.focus}</p>
                </div>
                <span className="team-number">0{index + 1}</span>
              </article>
            ))}
          </div>
          <div className="center-action">
            <ButtonLink href="/team" secondary>Meet the Whole Team</ButtonLink>
          </div>
        </div>
      </section>

      <section className="section process-section" id="process">
        <div className="container">
          <div className="section-head center">
            <span className="kicker">A clear way forward</span>
            <h2>
              From idea to <em>launch.</em>
            </h2>
            <p>A collaborative process with clarity at every step.</p>
          </div>
          <ProcessTimeline />
        </div>
      </section>

      <section className="section testimonials" id="testimonials">
        <div className="container review-layout">
          <div className="review-copy">
            <span className="kicker">Client perspective</span>
            <h2>
              What our clients <em>say.</em>
            </h2>
            <p>
              Clear communication, thoughtful execution and digital experiences
              built to support real business goals.
            </p>
            <div className="repeat">
              <strong>400+</strong>
              <span>
                Repeat clients
                <br />
                <small>Great projects become long-term partnerships.</small>
              </span>
            </div>
          </div>
          <ReviewStack />
        </div>
      </section>

      <section className="section industries">
        <div className="container">
          <div className="section-head center">
            <span className="kicker">Industries</span>
            <h2>
              Websites for every type of <em>business.</em>
            </h2>
          </div>
          <div className="industry-grid">
            {[
              [BriefcaseBusiness, "Business"],
              [Utensils, "Restaurants"],
              [Building2, "Real Estate"],
              [ShoppingBag, "E-commerce"],
              [HeartPulse, "Healthcare"],
              [BadgeCheck, "Professional Services"],
              [Palette, "Agencies"],
              [Sparkles, "Consultants"],
              [Rocket, "Startups"],
              [Star, "Personal Brands"],
              [Hotel, "Hospitality"],
              [Store, "Local Businesses"],
            ].map(([Icon, label]) => {
              const I = Icon as typeof Store;
              return (
                <div key={String(label)}>
                  <I size={20} />
                  <span>{String(label)}</span>
                  <ChevronRight size={16} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="marketplace">
        <div className="container marketplace-grid">
          <div className="marketplace-copy">
            <span className="kicker">Wix Marketplace clients</span>
            <h2>Looking for a Wix Studio expert?</h2>
            <p>
              From a focused redesign to advanced Velo development, we turn
              ambitious ideas into polished, responsive digital experiences.
            </p>
            <div className="marketplace-action">
              <ButtonLink href="/contact">Hire DevXStudio</ButtonLink>
              <span>
                <BadgeCheck size={17} /> Wix Studio specialists
              </span>
            </div>
          </div>
          <MarketplaceSlider />
        </div>
      </section>

      <section className="final-cta" id="contact">
        <div className="cta-orb one" />
        <div className="cta-orb two" />
        <div className="container">
          <span className="kicker light">
            Let&apos;s create something exceptional
          </span>
          <h2>
            Have a website idea?
            <br />
            <em>Let&apos;s build it.</em>
          </h2>
          <p>
            Tell us what you need and our team will help turn your idea into a
            modern, high-performing Wix Studio website.
          </p>
          <div className="hero-actions">
            <a
              className="button ghost-button"
              href="mailto:contact@devxstudio.agency"
            >
              <span className="button-sizer" aria-hidden="true">
                <span>Start Your Project</span>
                <i />
              </span>
              <span className="button-label">Start Your Project</span>
              <span className="button-icon">
                <ArrowRight size={17} />
              </span>
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

export default function Home() {
  return <SitePage />;
}
