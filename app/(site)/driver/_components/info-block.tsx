export default function InfoBlock({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl p-4">
      <p className="text-sm text-gray-600">{label}</p>
      <h3 className="font-semibold">{value}</h3>
      {sub && <span className="text-sm text-gray-500">{sub}</span>}
    </div>
  );
}
