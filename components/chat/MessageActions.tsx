import { Copy, RefreshCw, ThumbsUp, ThumbsDown, Share2 } from "lucide-react";

interface MessageActionsProps {
  onCopy?: () => void;
  onRegenerate?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  onShare?: () => void;
  className?: string;
}

export function MessageActions({
  onCopy,
  onRegenerate,
  onLike,
  onDislike,
  onShare,
  className = "",
}: MessageActionsProps) {
  return (
    <div
      className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${className}`}
    >
      {onCopy && (
        <button
          type="button"
          onClick={onCopy}
          className="p-1.5 rounded text-stone-400 dark:text-slate-400 hover:text-stone-700 dark:hover:text-slate-200 hover:bg-stone-200 dark:hover:bg-slate-700/50 transition-colors"
          title="Copy"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
      )}
      {onRegenerate && (
        <button
          type="button"
          onClick={onRegenerate}
          className="p-1.5 rounded text-stone-400 dark:text-slate-400 hover:text-stone-700 dark:hover:text-slate-200 hover:bg-stone-200 dark:hover:bg-slate-700/50 transition-colors"
          title="Regenerate"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      )}
      {onLike && (
        <button
          type="button"
          onClick={onLike}
          className="p-1.5 rounded text-stone-400 dark:text-slate-400 hover:text-stone-700 dark:hover:text-slate-200 hover:bg-stone-200 dark:hover:bg-slate-700/50 transition-colors"
          title="Like"
        >
          <ThumbsUp className="w-3.5 h-3.5" />
        </button>
      )}
      {onDislike && (
        <button
          type="button"
          onClick={onDislike}
          className="p-1.5 rounded text-stone-400 dark:text-slate-400 hover:text-stone-700 dark:hover:text-slate-200 hover:bg-stone-200 dark:hover:bg-slate-700/50 transition-colors"
          title="Dislike"
        >
          <ThumbsDown className="w-3.5 h-3.5" />
        </button>
      )}
      {onShare && (
        <button
          type="button"
          onClick={onShare}
          className="p-1.5 rounded text-stone-400 dark:text-slate-400 hover:text-stone-700 dark:hover:text-slate-200 hover:bg-stone-200 dark:hover:bg-slate-700/50 transition-colors"
          title="Share"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
