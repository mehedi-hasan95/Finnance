import { DataGrid } from "./_components/data-grid";

export default function Home() {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 -mt-10 md:-mt-16 lg:-mt-20">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <DataGrid />
      </div>
    </div>
  );
}
