import { useState } from "react";
import { TicketPreview } from "@/types";

export default function TicketConfirmModal({
  ticket,
  vehicleId,
  onClose,
  onBack,
  onSuccess,
}: {
  ticket: TicketPreview;
  vehicleId: number;
  onClose: () => void;
  onBack: () => void;
  onSuccess?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total =
    ticket.pricing.base + ticket.pricing.serviceFee + ticket.pricing.gst;

  async function handleConfirm() {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locationId: ticket.location.id,
          vehicleId,
          amount: total,
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ticket creation failed");
      }

      onSuccess?.();
    } catch (error) {
      console.error("Ticket creation error:", error);
      setError(error.message || "Failed to create ticket");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900"
          disabled={loading}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h3 className="font-semibold text-lg">Confirm Parking</h3>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="font-medium text-sm text-gray-600 mb-2">Location</h4>
        <p className="font-medium">{ticket.location.name}</p>
        <p className="text-sm text-gray-600">{ticket.location.address}</p>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-sm text-gray-600">Pricing Breakdown</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Base Rate</span>
            <span className="font-medium">₹{ticket.pricing.base}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Service Fee</span>
            <span className="font-medium">₹{ticket.pricing.serviceFee}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">GST</span>
            <span className="font-medium">₹{ticket.pricing.gst}</span>
          </div>
          <div className="border-t pt-2 flex justify-between text-base">
            <span className="font-semibold">Total Amount</span>
            <span className="font-semibold text-indigo-600">₹{total}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full bg-indigo-600 text-white rounded-xl py-3 font-medium disabled:opacity-60 hover:bg-indigo-700 transition-colors"
        >
          {loading ? "Creating Ticket..." : "Confirm & Park"}
        </button>

        <button
          onClick={onClose}
          disabled={loading}
          className="w-full text-gray-500 text-sm hover:text-gray-700 disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
