import { NextResponse } from "next/server";

const ipHits = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function checkRateLimit(ip: string, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  const current = ipHits.get(ip);

  if (!current || now > current.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (current.count >= limit) {
    return { allowed: false, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
  }

  current.count += 1;
  ipHits.set(ip, current);
  return { allowed: true };
}

function sanitizeInput(input: string) {
  return input.replace(/\0/g, "").trim();
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rate = checkRateLimit(ip, 10, 60_000);

    if (!rate.allowed) {
      return NextResponse.json(
        { error: `Too many requests. Try again in ${rate.retryAfter} seconds.` },
        { status: 429 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const rawMessage = body?.message;

    if (typeof rawMessage !== "string") {
      return NextResponse.json(
        { error: "Please enter a valid message." },
        { status: 400 }
      );
    }

    const message = sanitizeInput(rawMessage);

    if (!message || message.length < 5) {
      return NextResponse.json(
        { error: "Please enter a longer message to assess." },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: "Message is too long. Please keep it under 2000 characters." },
        { status: 400 }
      );
    }

    const prompt = `
You are ScamShield Care, a safeguarding-focused scam detection assistant.

Assess the message below for scam or financial abuse risk.

Message:
${message}

Respond in plain text only using exactly this structure:

Risk: High Risk, Suspicious, or Lower Risk
Confidence: 0-100%
Reasons:
- bullet 1
- bullet 2
- bullet 3
Advice:
- bullet 1
- bullet 2
- bullet 3

Keep it concise, professional, and under 140 words.
`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        max_tokens: 220,
        messages: [{ role: "user", content: prompt }],
      }),
    }).finally(() => clearTimeout(timeout));

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data?.error?.message || "Analysis service unavailable.",
        },
        { status: response.status }
      );
    }

    const result = data?.choices?.[0]?.message?.content?.trim();

    if (!result) {
      return NextResponse.json(
        { error: "No analysis returned." },
        { status: 502 }
      );
    }

    return NextResponse.json({ result });
  } catch (error: any) {
    if (error?.name === "AbortError") {
      return NextResponse.json(
        { error: "Analysis timed out. Please try again." },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: "Failed to analyze message." },
      { status: 500 }
    );
  }
}