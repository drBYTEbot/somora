"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { decodeAppFromHash } from "@/lib/ai";

function AppViewer() {
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) {
      setError("No app data found in this link.");
      setLoading(false);
      return;
    }

    const decoded = decodeAppFromHash(hash);
    if (!decoded) {
      setError("Could not load this app. The link may be broken.");
      setLoading(false);
      return;
    }

    setHtml(decoded);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-night-950">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin-slow rounded-full border-2 border-aurora-violet/30 border-t-aurora-violet" />
          <p className="mt-4 font-display text-cloud-muted">Loading app...</p>
        </div>
      </div>
    );
  }

  if (error || !html) {
    return (
      <div className="flex h-screen items-center justify-center bg-night-950">
        <div className="max-w-md text-center">
          <div className="text-5xl opacity-30">{"\u{1F6E0}\u{FE0F}"}</div>
          <h1 className="mt-4 font-display text-2xl font-bold text-cloud">
            {error ?? "App not found"}
          </h1>
          <p className="mt-2 text-sm text-cloud-muted">
            This app link may be expired or broken. Ask the creator for a new
            link.
          </p>
          <Link
            href="/studio"
            className="mt-6 inline-block rounded-full bg-gradient-to-r from-aurora-teal to-aurora-violet px-6 py-3 font-display font-semibold text-night-950"
          >
            Build your own app
          </Link>
        </div>
      </div>
    );
  }

  return (
    <iframe
      srcDoc={html}
      title="Somora Studio App"
      className="h-screen w-full border-0"
      sandbox="allow-scripts allow-popups allow-forms"
    />
  );
}

export default function ViewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-night-950">
          <div className="mx-auto h-10 w-10 animate-spin-slow rounded-full border-2 border-aurora-violet/30 border-t-aurora-violet" />
        </div>
      }
    >
      <AppViewer />
    </Suspense>
  );
}
