import type { Metadata } from "next";
import { Clock3, Mail, MapPin } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { ContactForm } from "@/components/contact-form";
import { InnerHeader } from "@/components/inner-header";

export const metadata: Metadata = {
  title: "Contact | DevXStudio",
  description: "Tell DevXStudio about your next Wix Studio, Velo or custom website project.",
};

export default function ContactPage() {
  return <main className="contact-page">
    <InnerHeader active="contact" />

    <section className="contact-hero">
      <div className="container contact-hero-grid">
        <div className="contact-intro">
          <span className="kicker">Start a conversation</span>
          <h1>Have an idea?<br/><em>Let&apos;s build it well.</em></h1>
          <p>Tell us where you are, what you&apos;re building and what success looks like. We&apos;ll come back with a clear next step.</p>
          <div className="contact-direct">
            <a href="mailto:smt.tools24@gmail.com"><Mail size={18}/><span><small>Email us</small>smt.tools24@gmail.com</span></a>
            <div><Clock3 size={18}/><span><small>Typical response</small>Within one business day</span></div>
            <div><MapPin size={18}/><span><small>Working with</small>Clients worldwide</span></div>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>

    <section className="contact-next"><div className="container"><span className="kicker light">What happens next</span><div className="contact-steps"><article><span>01</span><h2>We review</h2><p>We look through your goals, scope and timing before replying.</p></article><article><span>02</span><h2>We connect</h2><p>A focused call helps us understand the project and align on priorities.</p></article><article><span>03</span><h2>We map it out</h2><p>You receive a clear recommendation, timeline and path forward.</p></article></div></div></section>
    <SiteFooter />
  </main>;
}
