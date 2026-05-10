import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { contactEmail, contactName, message, risk, advice } =
      await request.json();

    if (!contactEmail || !message || !risk) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "ScamShield Care <onboarding@resend.dev>",
      to: [contactEmail],
      subject: `ScamShield Alert: ${risk.toUpperCase()} risk detected`,
      html: `
        <h2>ScamShield Care Alert</h2>
        <p>Hello ${contactName || "Trusted Contact"},</p>
        <p>A suspicious message has been checked using ScamShield Care.</p>
        <p><strong>Risk Level:</strong> ${risk.toUpperCase()}</p>
        <p><strong>Message Checked:</strong></p>
        <blockquote>${message}</blockquote>
        <p><strong>Advice:</strong> ${
          advice ||
          "Please contact your loved one before they respond, click any link, or send money."
        }</p>
        <p>ScamShield Care</p>
      `,
    });

    if (error) {
      console.error("RESEND ERROR:", error);
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ success: true, data });
  } catch (error) {
    console.error("SEND ALERT ERROR:", error);

    return Response.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}