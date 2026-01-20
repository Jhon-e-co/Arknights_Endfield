export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-zinc-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#FCEE21] rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-sm font-medium text-zinc-600">Loading...</p>
      </div>
    </div>
  );
}
