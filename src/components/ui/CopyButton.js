"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function CopyButton({ text, label = "Copy" }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      alert("Copy failed!");
    }
  }

  return (
    <Button variant="secondary" onClick={handleCopy}>
      {copied ? "Copied ✅" : label}
    </Button>
  );
}
