"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";

type SubmitState = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<SubmitState>("idle");

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("https://formsubmit.co/ajax/contact@devxstudio.agency", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...payload, _subject: "New project enquiry — DevXStudio", _template: "table" }),
      });
      if (!response.ok) throw new Error("Submission failed");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return <div className="contact-form-wrap">
    <div className="contact-form-head"><span>Project enquiry</span><strong>01 / 01</strong></div>
    <form className="contact-form" onSubmit={submitForm}>
      <input className="contact-honey" name="_honey" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true"/>
      <div className="contact-fields two-col">
        <label>Your name<input name="name" type="text" placeholder="Full name" required/></label>
        <label>Email address<input name="email" type="email" placeholder="you@company.com" required/></label>
      </div>
      <div className="contact-fields two-col">
        <label>Company<input name="company" type="text" placeholder="Company name"/></label>
        <label>Project type<select name="projectType" defaultValue=""><option value="" disabled>Select a service</option><option>Wix Studio website</option><option>Website redesign</option><option>Velo development</option><option>CMS & dynamic pages</option><option>E-commerce</option><option>Something else</option></select></label>
      </div>
      <div className="contact-fields"><label>Ideal timeline<select name="timeline" defaultValue=""><option value="" disabled>Select timeline</option><option>As soon as possible</option><option>Within 1 month</option><option>1–3 months</option><option>Flexible</option></select></label></div>
      <label>Tell us about your project<textarea name="message" placeholder="A little about your goals, scope and where you need help..." rows={5} required/></label>
      <button className="contact-submit" type="submit" disabled={status === "sending"}><span>{status === "sending" ? "Sending enquiry..." : "Send Project Enquiry"}</span>{status === "sending" ? <LoaderCircle className="contact-spinner" size={18}/> : <ArrowRight size={18}/>}</button>
      <div className="contact-feedback" aria-live="polite">
        {status === "success" && <p className="success"><CheckCircle2 size={16}/>Thank you — your enquiry has been sent successfully.</p>}
        {status === "error" && <p className="error">We couldn&apos;t send your enquiry. Please try again or email us directly.</p>}
      </div>
      <p className="contact-privacy">By sending this form, you agree that we may contact you about your enquiry.</p>
    </form>
  </div>;
}
