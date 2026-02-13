"use client";

import { useState } from "react";
import { MessageSquare, Star, Pencil, Trash2 } from "lucide-react";

interface SidebarItemProps {
  id: string;
  title: string;
  isActive: boolean;
  isFavorite?: boolean;
  onSelect: () => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const SidebarItem = ({
  id,
  title,
  isActive,
  isFavorite,
  onSelect,
  onRename,
  onDelete,
  onToggleFavorite,
}: SidebarItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);

  const handleSubmit = () => {
    const trimmed = editValue.trim();
    if (trimmed) {
      onRename(id, trimmed);
    } else {
      setEditValue(title);
    }
    setIsEditing(false);
  };

  return (
    <div
      className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
        isActive
          ? "bg-stone-200 dark:bg-slate-700/60 text-stone-900 dark:text-slate-100"
          : "hover:bg-stone-100 dark:hover:bg-slate-800/50 text-stone-600 dark:text-slate-300 hover:text-stone-800 dark:hover:text-slate-200"
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex-1 flex items-center gap-2 min-w-0 text-left"
      >
        <MessageSquare className="w-4 h-4 shrink-0 text-stone-400 dark:text-slate-500" />
        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
              if (e.key === "Escape") {
                setEditValue(title);
                setIsEditing(false);
              }
            }}
            className="flex-1 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-600 rounded px-2 py-1 text-sm text-stone-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-violet-500"
            autoFocus
          />
        ) : (
          <span className="truncate text-sm">{title}</span>
        )}
      </button>
      {!isEditing && (
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            type="button"
            onClick={() => onToggleFavorite(id)}
            className="p-1 rounded hover:bg-stone-200 dark:hover:bg-slate-700/50 text-stone-400 dark:text-slate-400 hover:text-amber-500"
            title={isFavorite ? "Unfavorite" : "Favorite"}
          >
            <Star
              className={`w-3.5 h-3.5 ${isFavorite ? "fill-amber-400 text-amber-400" : ""}`}
            />
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="p-1 rounded hover:bg-stone-200 dark:hover:bg-slate-700/50 text-stone-400 dark:text-slate-400 hover:text-stone-700 dark:hover:text-slate-200"
            title="Rename"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(id)}
            className="p-1 rounded hover:bg-stone-200 dark:hover:bg-slate-700/50 text-stone-400 dark:text-slate-400 hover:text-red-500"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SidebarItem;
