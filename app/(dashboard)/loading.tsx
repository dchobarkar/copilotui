import { Spinner } from "@/components/ui/Spinner";

export default function DashboardLoading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-0">
      <Spinner />
    </div>
  );
}
