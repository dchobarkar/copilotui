type MaxWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "4xl";

const MAX_WIDTH_CLASS: Record<MaxWidth, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
};

interface PageContentProps {
  children: React.ReactNode;
  maxWidth?: MaxWidth;
  className?: string;
}

const PageContent = ({
  children,
  maxWidth = "xl",
  className = "",
}: PageContentProps) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div
        className={`${MAX_WIDTH_CLASS[maxWidth]} mx-auto py-8 px-4 ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export default PageContent;
