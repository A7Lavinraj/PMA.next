export function SettingsItem({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 flex justify-between items-center">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      <span className="text-gray-400 text-xl">›</span>
    </div>
  );
}

export default function UserPageSettingsTab() {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="font-medium">John Doe</p>
          <p className="text-sm text-gray-600">+91 98765 43210</p>
        </div>
        <span className="text-indigo-500 text-lg">Edit</span>
      </div>

      <SettingsItem title="Manage Vehicles" subtitle="2 vehicles saved" />
      <SettingsItem title="Transaction History" subtitle="View all payments" />
      <SettingsItem title="Help & Support" subtitle="Get assistance" />
      <SettingsItem title="FAQ" subtitle="Frequently Asked Questions" />
    </div>
  );
}
