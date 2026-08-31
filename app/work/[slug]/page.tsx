import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { projects } from "@/lib/projects";
import { SiteFooter } from "@/components/site-footer";
import { InnerHeader } from "@/components/inner-header";

export function generateStaticParams(){ return projects.map(({slug})=>({slug})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{ const {slug}=await params; const project=projects.find(item=>item.slug===slug); return project?{title:`${project.name} Case Study | DevXStudio`,description:project.desc}:{}; }

export default async function ProjectPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const project=projects.find(item=>item.slug===slug);
  if(!project) notFound();
  const current=projects.indexOf(project);
  const next=projects[(current+1)%projects.length];
  return <main className="case-page">
    <InnerHeader active="work" />
    <section className="case-hero"><div className="container"><Link className="case-back" href="/work"><ArrowLeft size={15}/> All projects</Link><div className="case-title"><div><span className="kicker">{project.type} · {project.year}</span><h1>{project.name}</h1></div><p>{project.headline}</p></div><div className={`case-cover ${project.theme}`}>{project.screenshot?<div className="case-laptop"><div className="case-laptop-lid"><span className="case-camera"/><div className="case-shot"><Image src={project.screenshot} alt={`${project.name} website design`} width={1920} height={6070} priority unoptimized/></div></div><div className="case-laptop-base"><span/></div></div>:<div className="case-art"><small>DevXStudio case study · {project.tag}</small><strong>{project.headline}</strong><span>{project.name}</span><i/><i/></div>}</div></div></section>
    <section className="case-intro"><div className="container case-intro-grid"><aside><span>Services</span>{project.deliverables.map(item=><p key={item}><Check size={14}/>{item}</p>)}</aside><article><span className="kicker">Project overview</span><p>{project.overview}</p></article></div></section>
    <section className="case-story"><div className="container"><div className="case-story-row"><span>01</span><h2>The challenge</h2><p>{project.challenge}</p></div><div className="case-story-row"><span>02</span><h2>Our solution</h2><p>{project.solution}</p></div></div></section>
    <section className="case-results"><div className="container"><span className="kicker">Designed for outcomes</span><h2>Clear experience.<br/><em>Measurable direction.</em></h2><div>{project.results.map(result=><article key={result.label}><strong>{result.value}</strong><span>{result.label}</span></article>)}</div></div></section>
    {project.url&&<section className="case-live"><div className="container"><p>See the experience in action.</p><a href={project.url} target="_blank" rel="noreferrer">Visit live website <ArrowRight size={17}/></a></div></section>}
    <Link className="next-project" href={`/work/${next.slug}`}><div className="container"><span>Next project</span><h2>{next.name}</h2><ArrowRight size={38}/></div></Link><SiteFooter />
  </main>;
}
