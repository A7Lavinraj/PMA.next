import { TParkingItem } from "@/types";

const parkingHistory: TParkingItem[] = [
  {
    mall: "Phoenix Mall",
    location: "Lower Parel, Mumbai",
    amount: 180,
    date: "8 Dec 2025",
    plate: "MH 12 AB 1234",
    duration: "4h 15m",
  },
  {
    mall: "Central Plaza",
    location: "Andheri West, Mumbai",
    amount: 120,
    date: "5 Dec 2025",
    plate: "MH 14 CD 5678",
    duration: "2h 50m",
  },
  {
    mall: "City Center Mall",
    location: "Bandra East, Mumbai",
    amount: 200,
    date: "3 Dec 2025",
    plate: "MH 12 AB 1234",
    duration: "4h 30m",
  },
];

export function ParkingHistoryCard({
  mall,
  location,
  amount,
  date,
  plate,
  duration,
}: TParkingItem) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-3">
      <div className="flex justify-between">
        <div>
          <p className="font-medium">{mall}</p>
          <p className="text-sm text-gray-500">{location}</p>
        </div>

        <div className="text-right">
          <p className="font-semibold">₹{amount}</p>
          <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
            completed
          </span>
        </div>
      </div>

      <div className="flex justify-between text-sm text-gray-500">
        <span>{date}</span>
        <span>{plate}</span>
        <span>{duration}</span>
      </div>
    </div>
  );
}

export function RecentParking() {
  return (
    <div className="flex flex-col gap-4">
      {parkingHistory.map((item, index) => (
        <ParkingHistoryCard key={index} {...item} />
      ))}
    </div>
  );
}
