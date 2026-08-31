"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { projectCategories, projects } from "@/lib/projects";
import { SiteFooter } from "@/components/site-footer";
import { InnerHeader } from "@/components/inner-header";

export default function WorkPage() {
  const [filter, setFilter] = useState("All");
  const visible = filter === "All" ? projects : projects.filter((project) => project.type === filter);

  return <main className="work-page">
    <InnerHeader active="work" />
    <section className="work-hero"><div className="container"><span className="kicker">Selected work · 2025–2026</span><h1>Purposeful websites.<br/><em>Real business impact.</em></h1><div className="work-hero-bottom"><p>Explore the strategy, design and development behind digital experiences made for ambitious teams and growing brands.</p><span>{projects.length.toString().padStart(2,"0")} projects<br/>across {projectCategories.length - 1} industries</span></div></div></section>
    <section className="work-index"><div className="container"><div className="work-toolbar"><strong>All projects</strong><div className="work-filters" role="group" aria-label="Filter projects">{projectCategories.map((category)=><button key={category} className={filter===category?"active":""} onClick={()=>setFilter(category)} aria-pressed={filter===category}>{category}</button>)}</div></div><div className="work-grid">{visible.map((project,index)=><Link className="work-card" href={`/work/${project.slug}`} key={project.slug}><div className={`work-card-visual ${project.theme}`}>{project.screenshot?<div className="work-shot"><Image src={project.screenshot} alt={`${project.name} website`} width={1920} height={6070} unoptimized/></div>:<div className="work-art"><span>{String(index+1).padStart(2,"0")} / {project.type}</span><strong>{project.name}</strong><i/><i/><small>{project.tag}</small></div>}<span className="work-open">View case study <ArrowRight size={16}/></span></div><div className="work-card-copy"><div><span>{project.type} · {project.year}</span><h2>{project.name}</h2></div><p>{project.desc}</p></div></Link>)}</div></div></section>
    <section className="work-cta"><div className="container"><span className="kicker light">Have a project in mind?</span><h2>Let&apos;s make your next<br/><em>digital experience count.</em></h2><Link className="button ghost-button" href="/contact"><span className="button-sizer" aria-hidden="true"><span>Start Your Project</span><i/></span><span className="button-label">Start Your Project</span><span className="button-icon"><ArrowRight size={17}/></span></Link></div></section>
    <SiteFooter />
  </main>;
}
