import { TAssignment, TDriverStats } from "@/types";

import InfoBlock from "./_components/info-block";
import StatCard from "./_components/stat-card";

const newAssignment: TAssignment | null = {
  vehicleName: "Maruti Swift",
  vehicleNumber: "MH12CD5678",
  status: "RETRIEVE",
};

const currentAssignment: TAssignment | null = {
  vehicleName: "Honda City",
  vehicleNumber: "MH02AB1234",
  status: "PARK",
  customer: "Amrit Sharma",
  parkAt: "Level 2 - B34",
  location: {
    name: "Phoenix Mall",
    area: "Lower Parel, Mumbai",
  },
  assignedAt: "09:53 am",
};

const driverStats: TDriverStats = {
  today: 12,
  parked: 8,
  retrieved: 4,
};

export default function DriverPage() {
  return (
    <div className="w-screen bg-linear-180 from-[#EFF4FF] flex justify-center">
      <div className="w-full max-w-160 mx-4 p-4 flex flex-col gap-6 text-lg tracking-wide">
        {newAssignment && (
          <div className="flex flex-col gap-2">
            <p className="text-gray-700">New Assignments</p>

            <div className="border-2 border-[#CCD7FF] rounded-xl bg-white p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1 items-start">
                <h3 className="font-semibold">{newAssignment.vehicleName}</h3>
                <p className="text-sm text-gray-600">
                  {newAssignment.vehicleNumber}
                </p>

                <span
                  className="inline-flex px-3 py-1 rounded-full text-sm
                  bg-yellow-100 text-yellow-800 border border-yellow-300"
                >
                  Retrieve Vehicle
                </span>
              </div>

              <button className="px-5 py-2 rounded-xl bg-[#4F39F6] text-white transition hover:opacity-90">
                Accept Assignment
              </button>
            </div>
          </div>
        )}

        {currentAssignment && (
          <div className="flex flex-col gap-2">
            <p className="text-gray-700">Current Assignment</p>

            <div className="border-2 border-[#CCD7FF] rounded-xl bg-white p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1 items-start">
                <h3 className="font-semibold">
                  {currentAssignment.vehicleName}
                </h3>
                <p className="text-sm text-gray-600">
                  {currentAssignment.vehicleNumber}
                </p>

                <span
                  className="inline-flex px-3 py-1 rounded-full text-sm
                  bg-green-100 text-green-800 border border-green-300"
                >
                  Park Vehicle
                </span>
              </div>

              <hr className="border-gray-200" />

              <div className="grid grid-cols-1 gap-4">
                {currentAssignment.customer && (
                  <InfoBlock
                    label="Customer"
                    value={currentAssignment.customer}
                  />
                )}

                {currentAssignment.parkAt && (
                  <InfoBlock label="Park at" value={currentAssignment.parkAt} />
                )}

                {currentAssignment.location && (
                  <InfoBlock
                    label="Location"
                    value={currentAssignment.location.name}
                    sub={currentAssignment.location.area}
                  />
                )}

                {currentAssignment.assignedAt && (
                  <InfoBlock
                    label="Assigned at"
                    value={currentAssignment.assignedAt}
                  />
                )}
              </div>

              <button className="w-full mt-2 py-3 rounded-xl bg-[#4F39F6] text-white transition hover:opacity-90">
                Start Parking
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Today" value={driverStats.today} />
          <StatCard label="Parked" value={driverStats.parked} />
          <StatCard label="Retrieved" value={driverStats.retrieved} />
        </div>
      </div>
    </div>
  );
}
