import {
  Copy,
  Check,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Trash2,
  Pencil,
} from "lucide-react";

interface MessageActionsProps {
  onCopy?: () => void;
  copied?: boolean;
  onRegenerate?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  feedback?: "like" | "dislike" | null;
  onShare?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  className?: string;
}

export const MessageActions = ({
  onCopy,
  copied = false,
  onRegenerate,
  onLike,
  onDislike,
  feedback = null,
  onShare,
  onDelete,
  onEdit,
  className = "",
}: MessageActionsProps) => {
  const btn =
    "p-1.5 rounded text-stone-400 dark:text-slate-400 hover:text-stone-700 dark:hover:text-slate-200 hover:bg-stone-200 dark:hover:bg-slate-700/50 transition-colors";
  const active =
    "text-violet-600 dark:text-violet-400";

  return (
    <div
      className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${className}`}
    >
      {onCopy && (
        <button
          type="button"
          onClick={onCopy}
          className={btn}
          title={copied ? "Copied!" : "Copy"}
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      )}
      {onRegenerate && (
        <button
          type="button"
          onClick={onRegenerate}
          className={btn}
          title="Regenerate"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      )}
      {onLike && (
        <button
          type="button"
          onClick={onLike}
          className={btn}
          title="Like"
        >
          <ThumbsUp
            className={`w-3.5 h-3.5 ${feedback === "like" ? `fill-current ${active}` : ""}`}
          />
        </button>
      )}
      {onDislike && (
        <button
          type="button"
          onClick={onDislike}
          className={btn}
          title="Dislike"
        >
          <ThumbsDown
            className={`w-3.5 h-3.5 ${feedback === "dislike" ? `fill-current ${active}` : ""}`}
          />
        </button>
      )}
      {onShare && (
        <button type="button" onClick={onShare} className={btn} title="Share">
          <Share2 className="w-3.5 h-3.5" />
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className={btn}
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5 hover:text-red-500" />
        </button>
      )}
      {onEdit && (
        <button type="button" onClick={onEdit} className={btn} title="Edit">
          <Pencil className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
