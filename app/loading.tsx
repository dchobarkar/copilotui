import Spinner from "@/components/ui/Spinner";

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-slate-950">
      <Spinner />
    </div>
  );
};

export default Loading;
