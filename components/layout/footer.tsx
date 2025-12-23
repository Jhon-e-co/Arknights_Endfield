export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-900 py-8 text-zinc-400">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm">
          <p>© 2025 Endfield Tools. Unofficial Fan Project.</p>
          <p className="text-xs text-zinc-600 mt-1">Not affiliated with Gryphline or Hypergryph.</p>
        </div>
        <div className="flex gap-4 text-sm font-mono">
          <span>[ STATUS: ONLINE ]</span>
          <span>[ VER: 1.0.0 ]</span>
        </div>
      </div>
    </footer>
  );
}