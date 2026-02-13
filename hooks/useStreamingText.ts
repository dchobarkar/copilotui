import { useState, useEffect, useCallback } from "react";

type StreamingMode = "character" | "word" | "chunk";

interface UseStreamingTextOptions {
  text: string;
  onComplete?: () => void;
  mode?: StreamingMode;
  speed?: number;
}

export const useStreamingText = ({
  text,
  onComplete,
  mode = "word",
  speed = 30,
}: UseStreamingTextOptions) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const delay =
    mode === "character" ? speed : mode === "word" ? speed * 2 : speed * 4;

  const start = useCallback(() => {
    if (!text) {
      setIsComplete(true);
      onComplete?.();
      return;
    }

    setDisplayedText("");
    setIsComplete(false);

    const parts =
      mode === "character"
        ? text.split("")
        : mode === "word"
          ? text.split(/(\s+)/)
          : (text.match(/.{1,20}(\s|$)/g) ?? [text]);

    let index = 0;

    const interval = setInterval(() => {
      if (index >= parts.length) {
        clearInterval(interval);
        setIsComplete(true);
        onComplete?.();
        return;
      }

      setDisplayedText((prev) => prev + parts[index]);
      index++;
    }, delay);

    return () => clearInterval(interval);
  }, [text, mode, delay, onComplete]);

  useEffect(() => {
    return () => {};
  }, []);

  return { displayedText, isComplete, start };
}
