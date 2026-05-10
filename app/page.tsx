"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [contactName, setContactName] = useState("");
const [contactEmail, setContactEmail] = useState("");
const [trustedContact, setTrustedContact] = useState<{ name: string; email: string } | null>(null);


const saveTrustedContact = () => {
  if (!contactName.trim() || !contactEmail.trim()) {
    setError("Please enter trusted contact name and email.");
    return;
  }

  setTrustedContact({
    name: contactName,
    email: contactEmail,
  });

  setError("");
  alert("Trusted contact saved.");
};
  const analyze = async () => {
    if (loading) return;

    setError("");
    setResult("");
<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-6">
  <h2 className="text-xl font-bold text-slate-900 mb-2">
    Add Trusted Contact
  </h2>

  <p className="text-slate-600 mb-4">
    Add a family member, friend, or caregiver who should be alerted if a high-risk scam is detected.
  </p>

  <div className="grid gap-4 md:grid-cols-2">
    <input
      value={contactName}
      onChange={(e) => setContactName(e.target.value)}
      placeholder="Trusted contact name"
      className="rounded-xl border border-slate-300 p-4 text-slate-900"
    />npm run dev

    <input
      value={contactEmail}
      onChange={(e) => setContactEmail(e.target.value)}
      placeholder="Trusted contact email"
      className="rounded-xl border border-slate-300 p-4 text-slate-900"
    />
  </div>

  <button
    onClick={saveTrustedContact}
    className="mt-4 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white"
  >
    Save Trusted Contact
  </button>

  {trustedContact && (
    <p className="mt-3 text-green-700">
      Trusted contact saved: {trustedContact.name}
    </p>
  )}
</div>
    if (!message.trim()) {
      setError("Please paste a suspicious message.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setResult(data.result || "");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const sendAlert = async () => {
  if (!trustedContact) {
    setError("Please add a trusted contact first.");
    return;
  }

  if (!message.trim()) {
    setError("No message available to send.");
    return;
  }

  try {
    const response = await fetch("/api/send-alert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contactEmail: trustedContact.email,
        contactName: trustedContact.name,
        message: message,
        risk: result?.risk || "high",
        advice:
          "Please contact your loved one before they respond, click any link, or send money.",
      }),
    });
<button
  onClick={sendAlert}
  className="mt-4 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
>
  Send to Family
</button>
    const data = await response.json();

   if (!response.ok) {
  console.error("SEND ALERT ERROR:", data);

  setError(
    data?.error?.message ||
    data?.error ||
    "Failed to send email alert."
  );

  return;
}

    alert(`Email alert sent to ${trustedContact.name}`);
  } catch (error) {
    console.error(error);
    setError("Something went wrong while sending email.");
  }
};
  const clearAll = () => {
    setMessage("");
    setResult("");
    setError("");
  };
<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-6">
  <h2 className="text-xl font-bold text-slate-900 mb-2">
    Add Trusted Contact
  </h2>

  <p className="text-slate-600 mb-4">
    Add a family member, friend, or caregiver who should be alerted if a high-risk scam is detected.
  </p>

  <div className="grid gap-4 md:grid-cols-2">
    <input
      value={contactName}
      onChange={(e) => setContactName(e.target.value)}
      placeholder="Trusted contact name"
      className="rounded-xl border border-slate-300 p-4 text-slate-900"
    />

    <input
      value={contactEmail}
      onChange={(e) => setContactEmail(e.target.value)}
      placeholder="Trusted contact email"
      className="rounded-xl border border-slate-300 p-4 text-slate-900"
    />
  </div>

  <button
    onClick={saveTrustedContact}
    className="mt-4 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white"
  >
    Save Trusted Contact
  </button>

  {trustedContact && (
    <p className="mt-3 text-green-700">
      Trusted contact saved: {trustedContact.name}
    </p>
  )}
</div>
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-8 text-white sm:px-8">
            <div className="mb-3 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide">
              Safeguarding Support Tool
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              ScamShield Care
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">
              AI Safeguarding Assistant for Scam Risk Detection
            </p>
          </div>

          <div className="grid gap-4 px-6 py-5 sm:grid-cols-3 sm:px-8">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Fast screening</p>
              <p className="mt-1 text-sm text-slate-600">
                Quickly assess suspicious messages, emails, or links.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Plain-language guidance</p>
              <p className="mt-1 text-sm text-slate-600">
                Clear output for care workers, support staff, and vulnerable users.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Privacy aware</p>
              <p className="mt-1 text-sm text-slate-600">
                We do not store pasted content.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <label className="mb-3 block text-sm font-semibold text-slate-800">
<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-6">
  <h2 className="text-xl font-bold text-slate-900 mb-2">
    Add Trusted Contact
  </h2>

  <p className="text-slate-600 mb-4">
    Add a family member, friend, or caregiver who should be alerted if a scam risk is detected.
  </p>

  <div className="grid gap-4 md:grid-cols-2">
    <input
      value={contactName}
      onChange={(e) => setContactName(e.target.value)}
      placeholder="Trusted contact name"
      className="rounded-xl border border-slate-300 p-4 text-slate-900"
    />

    <input
      value={contactEmail}
      onChange={(e) => setContactEmail(e.target.value)}
      placeholder="Trusted contact email"
      className="rounded-xl border border-slate-300 p-4 text-slate-900"
    />
  </div>

  <button
    onClick={saveTrustedContact}
    className="mt-4 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white"
  >
    Save Trusted Contact
  </button>

  {trustedContact && (
    <p className="mt-3 text-green-700">
      Trusted contact saved: {trustedContact.name}
    </p>
  )}
</div>
              Paste suspicious message, email, or link
            </label>

            <textarea
              className="min-h-[280px] w-full rounded-3xl border border-slate-300 bg-slate-50 p-5 text-base outline-none transition focus:border-blue-500 focus:bg-white"
              placeholder="Example: URGENT: Your bank account has been suspended. Click here now."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={analyze}
                disabled={loading}
                className="inline-flex flex-1 items-center justify-center rounded-2xl bg-blue-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Analyzing risk..." : "Analyze Risk"}
              </button>

              <button
                onClick={clearAll}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-4 text-base font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Clear
              </button>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Privacy note: pasted content is processed for assessment and not stored by this interface.
            </p>
          </div>

          <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">Good practice</h2>

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                Be cautious with urgency, threats, or pressure to act quickly.
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                Avoid clicking links until the sender is verified independently.
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                Use official contact channels for banks, healthcare services, and organisations.
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                Escalate where financial abuse or safeguarding concerns may be present.
              </div>
            </div>
          </aside>
        </div>

        {error && (
          <div className="mt-6 rounded-[28px] border border-red-200 bg-red-50 p-5 text-red-700 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide">Error</p>
            <p className="mt-2 text-base">{error}</p>
          </div>
        )}

        {result && (
          <section className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Assessment Result
            </p>
            <div className="mt-3 whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50 p-5 text-base leading-8 text-slate-800">
              {result}
              {result && (
  <button
    onClick={sendAlert}
    className="mt-6 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
  >
    Send to Family
  </button>
)}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}