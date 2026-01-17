import { FeedbackButton } from "./feedback-button";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-900 py-8 text-zinc-400">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm">
          <p>© 2026 ENDFIELD LAB. Unofficial Fan Project.</p>
          <p className="text-xs text-zinc-600 mt-1">Not affiliated with Gryphline or Hypergryph.</p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 text-sm font-mono">
          <a
            href="https://discord.gg/dgdMsSYYxs"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#5865F2] transition-colors"
          >
            Discord Community
          </a>
          <FeedbackButton />
          <span>[ STATUS: ONLINE ]</span>
          <span>[ VER: 1.0.0 ]</span>
        </div>
      </div>
    </footer>
  );
}