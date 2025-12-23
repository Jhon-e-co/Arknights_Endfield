"use client";

import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CopyButtonProps {
  code: string;
}

export function CopyButton({ code }: CopyButtonProps) {
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      alert("Blueprint code copied to clipboard!");
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Button
      className="bg-[#FCEE21] text-black hover:bg-[#FCEE21]/90 rounded-none font-bold flex items-center gap-2"
      onClick={handleCopyCode}
    >
      <Copy className="w-4 h-4" />
      Copy Code
    </Button>
  );
}
