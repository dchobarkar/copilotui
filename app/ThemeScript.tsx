const themeScript = `
  (function() {
    try {
      const stored = localStorage.getItem('copilotui-theme');
      document.documentElement.classList.toggle('dark', stored === 'dark');
    } catch (e) {}
  })();
`;

export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeScript }}
      suppressHydrationWarning
    />
  );
}
