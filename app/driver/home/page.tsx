"use client";

import { useEffect, useState } from "react";
import { TAssignment, TDriverStats } from "@/types";
import InfoBlock from "../_components/info-block";
import StatCard from "../_components/stat-card";

export default function DriverPage() {
  const [newAssignment, setNewAssignment] = useState<TAssignment | null>(null);
  const [currentAssignment, setCurrentAssignment] =
    useState<TAssignment | null>(null);
  const [driverStats, setDriverStats] = useState<TDriverStats>({
    today: 0,
    parked: 0,
    retrieved: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    fetchDriverData();
  }, []);

  async function fetchDriverData() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/driver-assignment", {
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch driver data");
      }

      setNewAssignment(data.data.newAssignment);
      setCurrentAssignment(data.data.currentAssignment);
      setDriverStats(data.data.stats);
    } catch (error: any) {
      setError(error.message || "Failed to load driver data");
    } finally {
      setLoading(false);
    }
  }

  async function completeAssignment() {
    console.log(currentAssignment);
    if (!currentAssignment?.id || completing) return;

    setCompleting(true);
    try {
      const res = await fetch("/api/driver-assignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId: currentAssignment.id }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to complete assignment");
      }

      await fetchDriverData();
    } catch (error: any) {
      alert(error.message || "Failed to complete assignment");
    } finally {
      setCompleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-160 mx-4 p-4">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="mt-4 text-gray-600">Loading assignments...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-160 mx-4 p-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={fetchDriverData}
              className="bg-[#4F39F6] text-white px-6 py-2 rounded-xl font-medium hover:opacity-90"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
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

                <span className="inline-flex px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800 border border-yellow-300">
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

                <span className="inline-flex px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 border border-green-300">
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

              <button
                onClick={completeAssignment}
                disabled={completing}
                className="w-full mt-2 py-3 rounded-xl bg-[#4F39F6] text-white transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {completing ? "Completing..." : "Mark as Parked"}
              </button>
            </div>
          </div>
        )}

        {!newAssignment && !currentAssignment && (
          <div className="border-2 border-gray-200 rounded-xl bg-white p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Active Assignments
            </h3>
            <p className="text-gray-600 mb-6">
              You&apos;ll see new assignments here when they&apos;re available
            </p>
            <button
              onClick={fetchDriverData}
              className="bg-[#4F39F6] text-white px-6 py-2 rounded-xl font-medium hover:opacity-90"
            >
              Refresh
            </button>
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
