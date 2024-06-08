import { DataChart } from "./_components/data-chart";
import { DataGrid } from "./_components/data-grid";

export default function Home() {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 -mt-10 md:-mt-16 lg:-mt-20 space-y-8">
      <DataGrid />
      <DataChart />
    </div>
  );
}
