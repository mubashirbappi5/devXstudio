export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Spam protection: honeypot check
    if (payload._honey) {
      return Response.json({ success: true });
    }

    // Server-to-server request to FormSubmit (No browser CORS restriction)
    const response = await fetch("https://formsubmit.co/ajax/contact@devxstudio.agency", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        ...payload,
        _subject: payload._subject || "New project enquiry — DevXStudio",
        _template: "table",
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return Response.json(
        {
          success: false,
          message: data?.message || "Failed to submit enquiry",
        },
        { status: response.status || 500 }
      );
    }

    return Response.json({
      success: true,
      message: data?.message || "Enquiry sent successfully",
    });
  } catch (error) {
    console.error("Contact API route error:", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

