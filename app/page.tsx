"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, BadgeCheck, Blocks, BriefcaseBusiness, Building2, CalendarDays, Check, ChevronRight, Code2, Globe2, HeartPulse, Hotel, Layers3, Menu, MonitorSmartphone, Palette, Rocket, ShoppingBag, Sparkles, Star, Store, Utensils, WandSparkles, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"; 

const services = [
  
  
 
  [ShoppingBag, "E-commerce Website", "Scalable stores with thoughtful product journeys, payments and custom functionality."],
  [Rocket, "Landing Page", "High-converting campaign pages built to turn focused traffic into real enquiries."],
  [Palette, "Portfolio Website", "Distinctive showcases for professionals, agencies, creators and growing brands."],
  [CalendarDays, "Booking Website", "Smooth appointment and booking experiences tailored to how your business works."],
  [WandSparkles, "Website Redesign", "A strategic transformation from dated website to modern, responsive experience."],
  [Layers3, "Wix Studio Website", "Advanced responsive layouts, interactions and modern UI systems in Wix Studio."],
  [MonitorSmartphone, "Responsive Optimization", "Consistent, intentional experiences across mobile, tablet and desktop."],
  [Code2, "Velo Code Development", "Custom APIs, databases, automations, dynamic pages and business logic."],
  [Blocks, "Custom Design & Development", "A fully tailored Wix solution built around your needs—not a generic template."],
];

const projects = [
  { name: "Aster & Co.", type: "Business", tag: "Wix Studio", desc: "A calm, editorial website for a global consulting group.", theme: "project-a" },
  { name: "Noma Table", type: "Restaurant", tag: "Custom Design", desc: "An immersive reservation-first experience for modern dining.", theme: "project-b" },
  { name: "Élan Estates", type: "Real Estate", tag: "Wix Studio · Velo", desc: "A premium property platform with dynamic listing experiences.", theme: "project-c" },
  { name: "Morrow Goods", type: "E-commerce", tag: "Custom Development", desc: "A conversion-led storefront for a considered lifestyle brand.", theme: "project-d" },
  { name: "Northline", type: "Landing Page", tag: "Strategy · Design", desc: "A crisp product launch page built for clarity and action.", theme: "project-e" },
  { name: "Form / Field", type: "Portfolio", tag: "Wix Studio", desc: "A minimal, motion-led showcase for a creative practice.", theme: "project-f" },
];

const faqs = [
  ["What types of Wix websites do you build?", "We build business, restaurant, real estate, e-commerce, portfolio, booking and campaign websites—plus custom digital experiences tailored to specific business needs."],
  ["Do you work with Wix Studio?", "Yes. Wix Studio is at the center of our design and development practice, from advanced responsive layouts to scalable design systems."],
  ["Can you develop custom functionality using Velo?", "Yes. We use Velo for custom forms, APIs, CMS architecture, dynamic pages, dashboards, automations, member systems and business logic."],
  ["Can you redesign an existing Wix website?", "Absolutely. We can retain what is working, improve the structure and visual direction, and rebuild the experience for performance and conversion."],
  ["Can you make websites fully responsive?", "Yes. Every website is intentionally optimized for desktop, tablet and mobile rather than simply scaled down."],
  ["Can you integrate third-party APIs?", "Yes. We can plan and implement appropriate API and third-party integrations using Wix Studio and Velo."],
  ["Do you work with international clients?", "Yes. Our process is designed for clear remote collaboration with businesses and founders worldwide."],
  ["Can you optimize an existing Wix website?", "Yes. We can improve structure, responsiveness, UI consistency, user journeys and performance within the existing website."],
  ["How does the project process work?", "We move through five clear stages: discovery, strategy, design, development, then launch and optimization."],
];
const categories = ["All", "Business", "Restaurant", "Real Estate", "E-commerce", "Landing Page", "Portfolio"];

function ButtonLink({ href, children, secondary = false }: { href: string; children: React.ReactNode; secondary?: boolean }) {
  return <a className={secondary ? "button button-secondary" : "button"} href={href}>{children}<ArrowRight size={17} /></a>;
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const numberRef = useRef<HTMLSpanElement>(null);
  const played = useRef(false);
  useEffect(() => {
    const node = numberRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
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
    }, { threshold: 0.45 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);
  return <span ref={numberRef} className="animated-number"><span className="number-reel">{display}</span><i>+</i></span>;
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
  return <pre className="typing-code" aria-label="Animated Wix Velo code example"><code>{typed}</code><span className="code-cursor" aria-hidden="true" /></pre>;
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
      const maxScroll = Math.max(0, frameDocument.documentElement.scrollHeight - frameWindow.innerHeight);
      const progress = Math.min((now - startedAt) / duration, 1);
      const downwardProgress = Math.min(progress / .68, 1);
      const upwardProgress = Math.max((progress - .68) / .32, 0);
      const easeInOut = (value: number) => value < .5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2;
      const scrollPosition = progress <= .68
        ? maxScroll * easeInOut(downwardProgress)
        : maxScroll * (1 - easeInOut(upwardProgress));
      frameWindow.scrollTo(0, scrollPosition);
      if (progress < 1) animationFrame = requestAnimationFrame(scrollPreview);
    };
    animationFrame = requestAnimationFrame(scrollPreview);
    return () => cancelAnimationFrame(animationFrame);
  }, [phase]);

  return <div className="hero-laptop" aria-label="Code to live website animation">
    <div className="laptop-screen">
      <div className="laptop-toolbar"><div><i/><i/><i/></div><span>{phase === "live" ? "devxstudio.com" : "studio.devxstudio.com"}</span><b className={phase === "publishing" ? "is-publishing" : ""}>{phase === "live" ? <><Check size={11}/> Live</> : phase === "publishing" ? "Publishing…" : "Publish"}</b></div>
      <div className={`laptop-stage ${phase === "live" ? "show-live" : "show-code"}`} aria-live="polite">
        <div className="laptop-code"><div className="code-file"><Code2 size={13}/> page.tsx</div><pre><code>{typed}</code><span className="code-cursor" aria-hidden="true"/></pre><small><span/> Building your experience</small></div>
        <div className="laptop-live-site"><iframe ref={previewRef} src="/preview" title="DevXStudio full website preview" tabIndex={-1}/></div>
      </div>
    </div>
    <div className="laptop-base"><span/></div>
    <div className="demo-status"><span className={phase}/>{phase === "code" ? "Writing code" : phase === "publishing" ? "Publishing site" : "Live site preview"}</div>
  </div>;
}

function PreviewHeroVisual() {
  return <div className="hero-visual preview-hero-visual" aria-hidden="true"><div className="browser main-browser"><div className="browser-top"><i/><i/><i/><span>devxstudio.com</span></div><div className="browser-content"><div className="preview-nav"><Image src="/devx-symbol.png" alt="" width={34} height={26} unoptimized/><span/><span/><b/></div><p>Digital experiences for<br/><strong>forward-thinking brands.</strong></p><div className="preview-grid"><span/><span/><span/></div></div></div><div className="status-pill"><span/> Available for new projects</div></div>;
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
    const observer = new IntersectionObserver(([entry]) => {
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
    }, { threshold: 0.35 });
    observer.observe(node);
    return () => {
      observer.disconnect();
      if (interval) clearInterval(interval);
    };
  }, []);
  const progress = activeStep < 0 ? 0 : Math.min(activeStep, processSteps.length - 1) / (processSteps.length - 1) * 100;
  return <div className="process-line animated-process" ref={timelineRef}>
    <div className="process-progress-track"><span style={{ width: `${progress}%`, height: `${progress}%` }} /></div>
    {processSteps.map((step, index) => {
      const complete = activeStep > index;
      const current = activeStep === index;
      return <article className={`${complete ? "complete" : ""} ${current ? "current" : ""}`} key={step[0]}>
        <span className="step-marker">{complete ? <Check size={19} strokeWidth={3}/> : step[0]}</span>
        <h3>{step[1]}</h3><p>{step[2]}</p>
      </article>;
    })}
  </div>;
}

export function SitePage({ preview = false }: { preview?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [scrolled, setScrolled] = useState(false);
  const visibleProjects = filter === "All" ? projects : projects.filter((item) => item.type === filter);
  const nav = [["Services","#services"],["Our Work","#work"],["Why DevXStudio","#why"],["Process","#process"],["Testimonials","#testimonials"],["FAQ","#faq"],["Contact","#contact"]];
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    const groups = [
      ".section-head", ".service-card", ".expertise-grid > div", ".project-card",
      ".why-grid article", ".velo-grid > div", ".testimonial-grid article",
      ".industry-grid > div", ".marketplace-grid > div", ".faq-grid > div",
      ".final-cta .container > *", ".footer-grid > div",
    ];
    const items = document.querySelectorAll<HTMLElement>(groups.join(","));
    items.forEach((item, index) => {
      item.classList.add("reveal-item");
      item.style.setProperty("--reveal-delay", `${(index % 4) * 70}ms`);
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -45px" });
    items.forEach((item) => observer.observe(item));
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);
  return <main className={preview ? "site-preview-mode" : undefined}>
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}><button type="button" className="brand" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><Image src="/devx-symbol.png" alt="DevXStudio" width={360} height={278} priority unoptimized /></button><nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Main navigation">{nav.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}<a className="nav-cta" href="#contact" onClick={() => setMenuOpen(false)}>Start a Project <ArrowRight size={16}/></a></nav><button className="menu-button" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button></header>

    <section className="hero" id="home"><div className="hero-glow"/><div className="container hero-grid"><div className="hero-copy"><div className="eyebrow"><span className="pulse"/> Wix Studio design & development agency</div><h1>We build websites that <em>move business</em> forward.</h1><p>DevXStudio creates modern, conversion-focused and scalable digital experiences with Wix Studio and Velo.</p><div className="hero-actions"><ButtonLink href="#contact">Start a Project</ButtonLink><ButtonLink href="#work" secondary>View Our Work</ButtonLink></div><div className="mini-proof"><div className="avatars"><span>D</span><span>X</span><span>+</span></div><p><strong>Trusted worldwide</strong><br/>by founders, teams and growing brands</p></div></div>{preview ? <PreviewHeroVisual/> : <div className="hero-visual"><LaptopDemo/></div>}</div><div className="hero-strip"><span>WIX STUDIO</span><i/><span>VELO DEVELOPMENT</span><i/><span>CUSTOM DESIGN</span><i/><span>E-COMMERCE</span><i/><span>RESPONSIVE UX</span></div></section>

    <section className="stats-section"><div className="container stats-grid"><div><strong><AnimatedNumber value={1000}/></strong><p>Projects completed</p></div><div><strong><AnimatedNumber value={600}/></strong><p>Unique clients</p></div><div><strong><AnimatedNumber value={400}/></strong><p>Repeat clients</p></div><div className="expert-stat"><BadgeCheck/><strong>Wix Studio</strong><p>Design & development experts</p></div></div><p className="trust-line"><Globe2 size={17}/> Trusted by businesses, entrepreneurs and brands worldwide.</p></section>

    <section className="section" id="services"><div className="container"><div className="section-head split-head"><div><span className="kicker">What we do</span><h2>Everything you need to build a <em>better website.</em></h2></div><p>From strategy and custom design to advanced Wix development and optimization, we provide complete website solutions under one roof.</p></div><div className="service-grid">{services.map(([Icon, title, desc]) => { const I = Icon as typeof BriefcaseBusiness; return <article className="service-card" key={String(title)}><div className="service-icon"><I size={23}/></div><span className="service-arrow"><ArrowRight size={18}/></span><h3>{String(title)}</h3><p>{String(desc)}</p></article>})}</div></div></section>

    <section className="section expertise"><div className="container expertise-grid"><div className="expertise-visual"><div className="code-window"><div className="code-bar"><i/><i/><i/><span>project.cms.js</span></div><TypingCode/></div><div className="design-panel"><span>Responsive canvas</span><div className="design-block big"/><div className="design-row"><div/><div/></div><small><Check size={14}/> All breakpoints optimized</small></div></div><div><span className="kicker">Built beyond the template</span><h2>More than design. We build with <em>Wix Studio.</em></h2><p className="lead">Our team combines creative direction with technical development to build powerful websites that are responsive, scalable and tailored to your business goals.</p><div className="check-grid">{["Advanced Wix Studio Design","Custom Responsive Layouts","Wix Velo Development","CMS & Dynamic Pages","API Integrations","Custom Business Logic","Third-Party Integrations","Performance Optimization","Mobile Optimization","Animations & Interactions"].map(x=><span key={x}><Check size={15}/>{x}</span>)}</div><ButtonLink href="#contact">Explore Our Expertise</ButtonLink></div></div></section>

    <section className="section work-section" id="work"><div className="container"><div className="section-head center"><span className="kicker">Selected portfolio</span><h2>Our work speaks <em>for itself.</em></h2><p>Explore digital experiences we&apos;ve designed and developed across different industries.</p></div><div className="filters" role="group" aria-label="Filter projects">{categories.map(x=><button className={filter === x ? "active" : ""} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div><div className="portfolio-grid">{visibleProjects.map((p,i)=><article className="project-card" key={p.name}><div className={`project-image ${p.theme}`}><div className="mini-site"><div className="mini-site-top"><b>{p.name}</b><span/><span/><button>Explore</button></div><div className="mini-site-body"><small>{p.type}</small><strong>{i % 2 ? "Make the everyday memorable." : "Ideas made visible."}</strong><i/></div></div><a href="#contact" className="view-project">View Project <ArrowRight size={16}/></a></div><div className="project-info"><div><h3>{p.name}</h3><p>{p.desc}</p></div><span>{p.type}<br/>{p.tag}</span></div></article>)}</div><div className="center-action"><ButtonLink href="#contact" secondary>View All Projects</ButtonLink></div></div></section>

    <section className="section" id="why"><div className="container"><div className="section-head split-head"><div><span className="kicker">The DevX difference</span><h2>Why businesses choose <em>DevXStudio.</em></h2></div><p>A rare balance of experience, creative thinking and technical capability—focused on outcomes, not decoration.</p></div><div className="why-grid">{[["01","Proven Experience","1000+ completed projects across different industries and business types."],["02","Long-Term Relationships","400+ repeat clients reflect our focus on quality and lasting partnerships."],["03","Design + Development","Premium UI/UX thinking meets powerful Wix Studio and Velo development."],["04","Business-Focused","We build websites designed to support measurable business goals."],["05","Responsive by Default","Every experience is carefully optimized for desktop, tablet and mobile."],["06","Custom Solutions","Purpose-built solutions shaped around each client’s requirements."]].map(x=><article key={x[0]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></article>)}</div></div></section>

    <section className="section process-section" id="process"><div className="container"><div className="section-head center"><span className="kicker">A clear way forward</span><h2>From idea to <em>launch.</em></h2><p>A collaborative process with clarity at every step.</p></div><ProcessTimeline/></div></section>

    <section className="velo-section"><div className="container velo-grid"><div><span className="kicker light">Custom engineering</span><h2>Need more than a standard Wix website?</h2><p>Our Velo development team builds custom functionality when your business requires more.</p><ButtonLink href="#contact">Discuss Your Custom Project</ButtonLink></div><div className="tech-cloud">{["Custom Forms","CMS Architecture","Dynamic Pages","API Integrations","Custom Dashboards","Automation","Database Development","Booking Logic","Payment Integrations","Member Systems","Business Logic"].map((x,i)=><span key={x} className={i%4===0?"accent":""}>{x}</span>)}</div></div></section>

    <section className="section testimonials" id="testimonials"><div className="container"><div className="section-head split-head"><div><span className="kicker">Client perspective</span><h2>What our clients <em>say.</em></h2></div><div className="repeat"><strong>400+</strong><span>Repeat clients<br/><small>Great projects become long-term partnerships.</small></span></div></div><div className="testimonial-grid">{[["A service-business founder","Professional Services","“The process felt clear, collaborative and considered from the first conversation through delivery.”"],["An e-commerce team","Retail","“A thoughtful balance of design quality and practical functionality—exactly what the project needed.”"],["A growing agency","Creative Services","“Responsive communication, strong attention to detail and a website built around the way our business works.”"]].map((x,i)=><article key={i}><div className="stars">{[1,2,3,4,5].map(n=><Star key={n} size={15} fill="currentColor"/>)}</div><p>{x[2]}</p><div><span className="quote-avatar">{i===0?"SF":i===1?"ET":"GA"}</span><strong>{x[0]}<small>{x[1]}</small></strong></div></article>)}</div><p className="placeholder-note">Representative placeholders — ready to be replaced with verified client reviews.</p></div></section>

    <section className="section industries"><div className="container"><div className="section-head center"><span className="kicker">Industries</span><h2>Websites for every type of <em>business.</em></h2></div><div className="industry-grid">{[[BriefcaseBusiness,"Business"],[Utensils,"Restaurants"],[Building2,"Real Estate"],[ShoppingBag,"E-commerce"],[HeartPulse,"Healthcare"],[BadgeCheck,"Professional Services"],[Palette,"Agencies"],[Sparkles,"Consultants"],[Rocket,"Startups"],[Star,"Personal Brands"],[Hotel,"Hospitality"],[Store,"Local Businesses"]].map(([Icon,label])=>{const I=Icon as typeof Store; return <div key={String(label)}><I size={20}/><span>{String(label)}</span><ChevronRight size={16}/></div>})}</div></div></section>

    <section className="marketplace"><div className="container marketplace-grid"><div><span className="kicker">Wix Marketplace clients</span><h2>Looking for a Wix Studio expert?</h2><p>Whether you need a new website, a complete redesign, advanced Velo development or responsive optimization, DevXStudio can turn your idea into a polished digital experience.</p><ButtonLink href="#contact">Hire DevXStudio</ButtonLink></div><div className="capability-card"><Image src="/devx-symbol.png" alt="DevXStudio mark" width={90} height={67} unoptimized/>{["Wix Studio Design","Custom Development","Velo Development","Responsive Optimization","Website Redesign","API & Automation"].map(x=><span key={x}><Check size={15}/>{x}</span>)}</div></div></section>

    <section className="section faq-section" id="faq"><div className="container faq-grid"><div><span className="kicker">Good to know</span><h2>Your questions, <em>answered.</em></h2><p>Can&apos;t find what you&apos;re looking for? Tell us about your project and we&apos;ll point you in the right direction.</p><ButtonLink href="#contact" secondary>Contact Us</ButtonLink></div><Accordion type="single" collapsible className="faq-list">{faqs.map((x,i)=><AccordionItem value={`item-${i}`} key={x[0]}><AccordionTrigger>{x[0]}</AccordionTrigger><AccordionContent>{x[1]}</AccordionContent></AccordionItem>)}</Accordion></div></section>

    <section className="final-cta" id="contact"><div className="cta-orb one"/><div className="cta-orb two"/><div className="container"><span className="kicker light">Let&apos;s create something exceptional</span><h2>Have a website idea?<br/><em>Let&apos;s build it.</em></h2><p>Tell us what you need and our team will help turn your idea into a modern, high-performing Wix Studio website.</p><div className="hero-actions"><a className="button light-button" href="mailto:hello@devxstudio.com">Start Your Project <ArrowRight size={17}/></a><a className="button ghost-button" href="#work">View Our Work</a></div></div></section>

    <footer><div className="container footer-grid"><div className="footer-brand"><Image src="/devx-wordmark.png" alt="DevXStudio" width={205} height={40} unoptimized/><p>Wix Studio Design & Development Agency</p><span>High-performing digital experiences for ambitious businesses worldwide.</span></div><div><h4>Navigate</h4>{[["Services","#services"],["Portfolio","#work"],["Why us","#why"],["Process","#process"],["FAQ","#faq"],["Contact","#contact"]].map(x=><a key={x[0]} href={x[1]}>{x[0]}</a>)}</div><div><h4>Services</h4>{["Wix Studio","Velo Development","Website Design","Website Redesign","E-commerce","Booking Websites","Responsive Optimization"].map(x=><a key={x} href="#services">{x}</a>)}</div><div><h4>Start a conversation</h4><a className="footer-email" href="mailto:hello@devxstudio.com">hello@devxstudio.com</a><p>Have a project in mind?</p><a className="footer-link" href="#contact">Get a Quote <ArrowRight size={15}/></a></div></div><div className="container copyright"><span>© 2026 DevXStudio. All Rights Reserved.</span><span>Designed for what&apos;s next.</span></div></footer>
  </main>;
}

export default function Home() {
  return <SitePage/>;
}
