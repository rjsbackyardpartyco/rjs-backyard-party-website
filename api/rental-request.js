export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = req.body || {};

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "RJ's Backyard Party Co. <onboarding@resend.dev>",
        to: ["rjsbackyardpartyco@gmail.com"],
        reply_to: data.email || undefined,
        subject: `New Rental Request - ${data.name || "Website Customer"}`,
        text: `
NEW RENTAL REQUEST

Customer: ${data.name || ""}
Phone: ${data.phone || ""}
Email: ${data.email || ""}
Event Date: ${data.eventDate || ""}
Event Location: ${data.location || ""}
Event Type: ${data.eventType || ""}
Pickup/Delivery: ${data.fulfillment || ""}

PACKAGE / RENTAL DETAILS
${data.summary || ""}

Estimated Total: ${data.total || ""}

Additional Notes:
${data.notes || "None"}

Submitted from RJ's Backyard Party Co. website.
        `,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Resend error:", result);
      return res.status(500).json({
        error: "Unable to send rental request.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Rental request sent successfully!",
    });
  } catch (error) {
    console.error("Rental request error:", error);

    return res.status(500).json({
      error: "Unable to send rental request.",
    });
  }
}
