"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";

const links = [["Home","/"],["Our Work","/work"],["Our Team","/team"],["Services","/#services"],["Contact","/contact"]];

export function InnerHeader({ active }: { active?: "work" | "team" | "contact" }) {
  const [open,setOpen]=useState(false);
  const isActive=(href:string)=>(active==="work"&&href==="/work")||(active==="team"&&href==="/team")||(active==="contact"&&href==="/contact");
  return <header className={`inner-header ${open?"menu-open":""}`}>
    <Link className="inner-brand" href="/" aria-label="DevXStudio home"><Image src="/devx-symbol.png" alt="DevXStudio" width={360} height={278} priority unoptimized/></Link>
    <nav aria-label="Main navigation">{links.map(([label,href])=><Link className={isActive(href)?"active":undefined} href={href} key={href} onClick={()=>setOpen(false)}>{label}</Link>)}</nav>
    <Link className="nav-cta" href="/contact">Start a Project <ArrowRight size={16}/></Link>
    <button className="inner-menu" type="button" onClick={()=>setOpen(value=>!value)} aria-label={open?"Close navigation":"Open navigation"} aria-expanded={open}>{open?<X/>:<Menu/>}</button>
  </header>;
}
