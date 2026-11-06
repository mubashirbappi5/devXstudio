const RESEND_API_KEY = process.env.RESEND_API_KEY;

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Spam honeypot protection
    if (payload._honey) {
      return Response.json({ success: true });
    }

    const name = payload.name?.trim() || "Anonymous";
    const email = payload.email?.trim() || "";
    const company = payload.company?.trim() || "Not specified";
    const projectType = payload.projectType?.trim() || "Not specified";
    const timeline = payload.timeline?.trim() || "Not specified";
    const message = payload.message?.trim() || "";

    if (!email || !message) {
      return Response.json(
        { success: false, message: "Email and message are required." },
        { status: 400 }
      );
    }

    if (!RESEND_API_KEY) {
      console.error("Missing RESEND_API_KEY environment variable.");
      return Response.json(
        { success: false, message: "Server email configuration is missing." },
        { status: 500 }
      );
    }

    // Default receiver is the registered Resend email address.
    // Can be configured in environment variables once a domain is verified.
    const recipientEmail =
      process.env.CONTACT_RECEIVER_EMAIL || "smt.tools24@gmail.com";

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px; color: #111827;">
        <h2 style="margin-top: 0; color: #111827; font-size: 20px; font-weight: 600; border-bottom: 2px solid #000; padding-bottom: 12px;">New Project Enquiry — DevXStudio</h2>
        <div style="margin: 20px 0; font-size: 15px; line-height: 1.6;">
          <p style="margin: 8px 0;"><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}" style="color: #2563eb; text-decoration: none;">${escapeHtml(email)}</a></p>
          <p style="margin: 8px 0;"><strong>Company:</strong> ${escapeHtml(company)}</p>
          <p style="margin: 8px 0;"><strong>Project Type:</strong> ${escapeHtml(projectType)}</p>
          <p style="margin: 8px 0;"><strong>Timeline:</strong> ${escapeHtml(timeline)}</p>
        </div>
        <div style="margin-top: 24px;">
          <strong style="display: block; margin-bottom: 8px; font-size: 15px;">Project Details / Message:</strong>
          <div style="background-color: #f3f4f6; padding: 16px; border-radius: 6px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: #374151;">${escapeHtml(message)}</div>
        </div>
        <p style="margin-top: 24px; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 12px;">
          Sent from DevXStudio Website (https://devxstudio.agency)
        </p>
      </div>
    `;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "DevXStudio Enquiry <onboarding@resend.dev>",
        to: [recipientEmail],
        reply_to: email,
        subject: `New Project Enquiry from ${name} — DevXStudio`,
        html: emailHtml,
      }),
    });

    const data = await resendResponse.json().catch(() => null);

    if (!resendResponse.ok) {
      console.error("Resend API error:", data);
      return Response.json(
        {
          success: false,
          message: data?.message || "Failed to send email enquiry",
        },
        { status: resendResponse.status || 500 }
      );
    }

    return Response.json({
      success: true,
      message: "Enquiry submitted successfully",
      id: data?.id,
    });
  } catch (error) {
    console.error("Contact API route error:", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error occurred",
      },
      { status: 500 }
    );
  }
}
