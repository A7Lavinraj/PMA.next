"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QRData, Vehicle } from "@/types";
import TicketConfirmModal from "./ticket-confirm-modal";
import NewVehicleForm from "./new-vehicle-form";

type Step = "vehicle-selection" | "ticket-confirm";

export default function ParkingWizardModal({
  qrData,
  onCloseAction: onClose,
}: {
  qrData: QRData;
  onCloseAction: () => void;
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("vehicle-selection");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingVehicles, setFetchingVehicles] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  async function fetchVehicles() {
    setFetchingVehicles(true);
    setError(null);
    try {
      const res = await fetch("/api/vehicle", {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setVehicles(data.data || []);
      } else {
        throw new Error(data.error || "Failed to fetch vehicles");
      }
    } catch (error: any) {
      console.error("Fetch vehicles error:", error);
      setError(error.message || "Failed to load vehicles");
    } finally {
      setFetchingVehicles(false);
    }
  }

  async function handleRegisterVehicle(vehicle: Omit<Vehicle, "id">) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/vehicle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehicle),
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to register vehicle");
      }

      const newVehicle = data.data;
      setVehicles([...vehicles, newVehicle]);
      setSelectedVehicle(newVehicle);
      setStep("ticket-confirm");
    } catch (error: any) {
      setError(error.message || "Failed to register vehicle");
    } finally {
      setLoading(false);
    }
  }

  function handleTicketSuccess() {
    onClose();
    router.push("/user/tickets");
  }

  function handleBackToVehicles() {
    setStep("vehicle-selection");
    setSelectedVehicle(null);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        {step === "vehicle-selection" && (
          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {fetchingVehicles ? (
              <div className="text-center py-8 text-gray-500">
                Loading vehicles...
              </div>
            ) : vehicles.length > 0 ? (
              <>
                <h3 className="text-lg font-semibold">Select Your Vehicle</h3>
                <ul className="space-y-2 max-h-64 overflow-y-auto">
                  {vehicles.map((v) => (
                    <li key={v.id}>
                      <button
                        className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          setSelectedVehicle(v);
                          setStep("ticket-confirm");
                        }}
                      >
                        <div className="font-medium">
                          {v.brand} {v.model}
                        </div>
                        <div className="text-sm text-gray-600">{v.plate}</div>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-sm text-gray-600 text-center py-4">
                No vehicles registered. Add one below.
              </p>
            )}

            <div className="pt-4">
              <h4 className="font-medium text-sm mb-3">Add New Vehicle</h4>
              <NewVehicleForm
                onSubmitAction={handleRegisterVehicle}
                loading={loading}
              />
            </div>

            <button
              onClick={onClose}
              className="w-full text-gray-500 text-sm mt-2 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        )}

        {step === "ticket-confirm" && selectedVehicle && (
          <TicketConfirmModal
            ticket={{
              location: qrData.location,
              pricing: qrData.pricing,
            }}
            vehicleId={selectedVehicle.id}
            onClose={onClose}
            onBack={handleBackToVehicles}
            onSuccess={handleTicketSuccess}
          />
        )}
      </div>
    </div>
  );
}
