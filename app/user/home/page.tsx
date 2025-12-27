import { RecentParking } from "../_components/recent-parkings";

export default function UserPageHomeTab() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="font-medium">Scan to Park</p>
          <p className="text-sm text-gray-600">
            Scan QR code at parking entrance
          </p>
        </div>
        <span className="text-gray-400 text-xl">›</span>
      </div>

      <RecentParking />
    </div>
  );
}
