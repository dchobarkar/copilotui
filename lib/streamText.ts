export const streamText = (
  text: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  speedMs: number,
): (() => void) => {
  const words = text.split(/(\s+)/);
  let i = 0;
  const interval = setInterval(() => {
    if (i >= words.length) {
      clearInterval(interval);
      onComplete();
      return;
    }
    onChunk(words[i] ?? "");
    i++;
  }, speedMs);
  return () => clearInterval(interval);
};
