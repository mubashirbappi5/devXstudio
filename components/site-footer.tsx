import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const links = [
  ["Home", "/"],
  ["Our Work", "/work"],
  ["Our Team", "/team"],
  ["Services", "/#services"],
  ["Process", "/#process"],
  ["Contact", "/contact"],
];

export function SiteFooter(){return <footer className="site-footer">
  <div className="container footer-main">
    <div className="footer-intro"><Image src="/devx-wordmark.png" alt="DevXStudio" width={205} height={40} unoptimized/><p>Wix Studio design and development for ambitious businesses worldwide.</p></div>
    <div className="footer-links"><h4>Explore</h4>{links.map(([label,href])=><Link href={href} key={label}>{label}</Link>)}</div>
    <div className="footer-contact"><h4>Start a conversation</h4><a className="footer-email" href="mailto:contact@devxstudio.agency">contact@devxstudio.agency</a><p>Have a website idea or a project ready to move?</p><Link className="footer-cta" href="/contact">Get a Quote <ArrowRight size={16}/></Link></div>
  </div>
  <div className="container copyright"><span>© 2026 DevXStudio. All rights reserved.</span><span>Wix Studio · Velo · Custom Development</span></div>
</footer>}
