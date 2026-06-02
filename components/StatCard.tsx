type StatCardProps = {
  title: string;
  value: string | number;
};

export default function StatCard({
  title,
  value,
}: StatCardProps) {
  return (
    <div
      className="
        bg-slate-900
        p-6
        rounded-2xl
        border
        border-slate-800
        hover:border-blue-500
        hover:-translate-y-1
        transition-all
        duration-300
      "
    >
      <p className="text-slate-400 text-sm">
        {title}
      </p>

      <p className="text-4xl font-bold mt-3 tracking-tight">
        {value}
      </p>
    </div>
  );
}
