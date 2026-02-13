import { User, Bot } from "lucide-react";

import type { MessageRole } from "@/lib/types";

interface AvatarProps {
  role: MessageRole;
  className?: string;
}

const Avatar = ({ role, className = "" }: AvatarProps) => {
  const isUser = role === "user";

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full w-8 h-8 ${
        isUser
          ? "bg-stone-400 dark:bg-slate-600 text-white dark:text-slate-200"
          : "bg-linear-to-br from-violet-500 to-indigo-600 text-white"
      } ${className}`}
    >
      {isUser ? (
        <User className="w-4 h-4" strokeWidth={2} />
      ) : (
        <Bot className="w-4 h-4" strokeWidth={2} />
      )}
    </div>
  );
};

export default Avatar;
