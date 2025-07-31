"use client";

import { useState,FormEvent } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";  
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [form, setForm] = useState({
    name: "",
    lat: "",
    lng: "",
    type: "özəl",
    is24Hours: false
  });

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newHospital = {
      ...form,
      lat: parseFloat(form.lat),
      lng: parseFloat(form.lng)
    };
    await addDoc(collection(db, "hospitals"), newHospital);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">➕ Yeni Xəstəxana Əlavə Et</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur p-6 rounded-lg border border-gray-700 max-w-md space-y-4"
      >
        <input
          type="text"
          placeholder="Adı"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          required
        />
        <input
          type="text"
          placeholder="Enlem (lat)"
          value={form.lat}
          onChange={(e) => setForm({ ...form, lat: e.target.value })}
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          required
        />
        <input
          type="text"
          placeholder="Boylam (lng)"
          value={form.lng}
          onChange={(e) => setForm({ ...form, lng: e.target.value })}
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          required
        />

        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
        >
          <option value="özəl">Özəl</option>
          <option value="dövlət">Dövlət</option>
        </select>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is24Hours}
            onChange={(e) =>
              setForm({ ...form, is24Hours: e.target.checked })
            }
            className="accent-blue-500 w-4 h-4"
          />
          24 Saat Açıq
        </label>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Kaydet
        </button>
      </form>
    </div>
  );
}