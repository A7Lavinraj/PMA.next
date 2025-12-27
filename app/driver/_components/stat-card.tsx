export default function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="bg-white p-5 flex flex-col gap-1">
      <span className="text-gray-600">{label}</span>
      <pre className="text-[#4F39F6]">{value}</pre>
    </div>
  );
}
