type Props = {
  copied: boolean;
  listShareToken: string;
  onClose: () => void;
  onCopy: () => void;
};

export default function ShareModal({
  copied,
  listShareToken,
  onClose,
  onCopy,
}: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-[#16161f] border border-white/10 rounded-2xl p-6 w-full max-w-sm space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-semibold">Share this list</h3>

        <div>
          <p className="text-xs text-white/40 mb-2">View link - anyone can see this list</p>
          <div className="flex gap-2">
            <input
              readOnly
              value={`${typeof window !== "undefined" ? window.location.origin : ""}/list/${listShareToken}`}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/60 focus:outline-none"
            />
            <button
              onClick={onCopy}
              className={`px-3 py-2 rounded-lg text-xs transition-colors ${
                copied ? "bg-green-600 text-white" : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 text-sm text-white/40 hover:text-white transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
