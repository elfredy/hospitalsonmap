"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import dynamic from "next/dynamic";
import HospitalCard from "./components/HospitalCard";

export interface Hospital {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  is24Hours?: boolean;
}

interface HospitalFilter {
  type: string;
  is24Hours: boolean;
}

// SSR hatasını önlemek için haritayı dinamik yükle
const Map = dynamic(() => import("./components/Map"), { ssr: false });

export default function Home() {
  const [filter, setFilter] = useState<HospitalFilter>({
    type: "all",
    is24Hours: false
  });

  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "hospitals"), (snapshot) => {
      const list: Hospital[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          lat: Number(data.lat),
          lng: Number(data.lng),
          type: data.type,
          is24Hours: data.is24Hours,
        };
      });
      setHospitals(list);
    });

    return () => unsub();
  }, []);

  const filteredHospitals = hospitals.filter((hospital) => {
    const matchType =
      filter.type === "all" || hospital.type === filter.type;
    const matchHours =
      !filter.is24Hours || hospital.is24Hours === true;
    return matchType && matchHours;
  });

  return (
    <main className="min-h-screen px-4 py-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">🏥 Bakı’dakı Xəstəxanalar</h1>
        <a
          href="/admin"
          className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          ➕ Add Hospital
        </a>
      </div>

      {/* 🔎 Filtre Barı */}
      <div className="bg-black/30 backdrop-blur-md border border-gray-600 shadow-lg rounded-xl px-4 py-3 flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <label className="text-sm font-medium text-gray-300">Tür:</label>
          <select
            value={filter.type}
            onChange={(e) =>
              setFilter({ ...filter, type: e.target.value })
            }
            className="px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150"
          >
            <option value="all">Hamısı</option>
            <option value="özəl">Özəl</option>
            <option value="dövlət">Dövlət</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-300">
          <input
            id="check24"
            type="checkbox"
            checked={filter.is24Hours}
            onChange={(e) =>
              setFilter({ ...filter, is24Hours: e.target.checked })
            }
            className="accent-blue-500 w-4 h-4 rounded"
          />
          <label htmlFor="check24">Yalnız 24 Saat Açıq</label>
        </div>
      </div>

      {/* 🗺️ Harita ve Kartlar */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3">
          <Map filter={filter} />
        </div>

        <div className="lg:w-1/3 flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
          {filteredHospitals.map((hospital) => (
            <HospitalCard key={hospital.id} hospital={hospital} />
          ))}
        </div>
      </div>
    </main>
  );
}