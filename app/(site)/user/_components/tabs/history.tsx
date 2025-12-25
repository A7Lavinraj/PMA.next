import { RecentParking } from "../recent-parkings";

export default function UserPageHistoryTab() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-medium text-gray-800">Recent Parking</h2>

      <RecentParking />
    </div>
  );
}
