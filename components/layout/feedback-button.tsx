"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";

export function FeedbackButton() {
  const [copied, setCopied] = useState(false);
  const email = "endfieldlabs@gmail.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    window.location.href = `mailto:${email}`;
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 hover:text-[#FCEE21] transition-colors text-sm text-zinc-500"
      title="Click to copy email"
    >
      {copied ? <Check className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
      <span>{copied ? "Copied!" : "Feedback"}</span>
    </button>
  );
}