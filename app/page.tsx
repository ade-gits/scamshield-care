"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (loading) return;

    setError("");
    setResult("");

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

  const clearAll = () => {
    setMessage("");
    setResult("");
    setError("");
  };

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
            </div>
          </section>
        )}
      </section>
    </main>
  );
}