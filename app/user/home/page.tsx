"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { RecentParking } from "../_components/recent-parkings";
import ParkingWizardModal from "../_components/parking-wizard-modal";
import { QRData } from "@/types";

export default function UserHomePage() {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [scanning, setScanning] = useState(false);
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, []);

  async function stopScan() {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
      scannerRef.current = null;
    }
    setScanning(false);
    setError(null);
  }

  async function startScan() {
    if (scannerRef.current || scanning) return;

    setError(null);
    setScanning(true);

    try {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          try {
            const data = JSON.parse(decodedText) as QRData;

            if (!data.location?.id || !data.pricing) {
              throw new Error("Invalid QR code format");
            }

            await stopScan();
            setQrData(data);
          } catch (err) {
            console.error("Invalid QR data", err);
            setError("Invalid QR code. Please try again.");
          }
        },
        () => {},
      );
    } catch (err: any) {
      console.error("Scanner error:", err);
      setError(
        err.message || "Failed to start camera. Please check permissions.",
      );
      setScanning(false);
      scannerRef.current = null;
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={startScan}
        disabled={scanning}
        className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center justify-between disabled:opacity-60"
      >
        <div className="text-left">
          <p className="font-medium">Scan to Park</p>
          <p className="text-sm text-gray-600">
            Scan QR code at parking entrance
          </p>
        </div>
        <span className="text-gray-400 text-xl">›</span>
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-3" hidden={!scanning}>
        <div
          id="qr-reader"
          className="w-full max-w-sm mx-auto aspect-square rounded-xl overflow-hidden"
        />
        <button
          onClick={stopScan}
          className="w-full max-w-sm mx-auto block bg-gray-100 text-gray-700 rounded-xl py-2 font-medium"
        >
          Cancel Scan
        </button>
      </div>

      <RecentParking />

      {qrData && (
        <ParkingWizardModal
          qrData={qrData}
          onCloseAction={() => setQrData(null)}
        />
      )}
    </div>
  );
}
