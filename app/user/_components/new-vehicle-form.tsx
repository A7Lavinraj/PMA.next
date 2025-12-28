"use client";

import { useState } from "react";

export default function NewVehicleForm({
  onSubmitAction: onSubmit,
  loading,
}: {
  onSubmitAction: (vehicle: {
    brand: string;
    model: string;
    plate: string;
  }) => void;
  loading?: boolean;
}) {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [plate, setPlate] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedBrand = brand.trim();
    const trimmedModel = model.trim();
    const trimmedPlate = plate.trim().toUpperCase();

    if (!trimmedBrand || !trimmedModel || !trimmedPlate) {
      return;
    }

    onSubmit({
      brand: trimmedBrand,
      model: trimmedModel,
      plate: trimmedPlate,
    });
  }

  const isValid = brand.trim() && model.trim() && plate.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          type="text"
          placeholder="Brand (e.g., Honda, Toyota)"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          disabled={loading}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
          required
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Model (e.g., City, Fortuner)"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          disabled={loading}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
          required
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Number Plate (e.g., MH 12 AB 1234)"
          value={plate}
          onChange={(e) => setPlate(e.target.value.toUpperCase())}
          disabled={loading}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500 font-mono"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading || !isValid}
        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium disabled:opacity-60 hover:bg-indigo-700 transition-colors"
      >
        {loading ? "Adding..." : "Add Vehicle"}
      </button>
    </form>
  );
}
