"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";

 interface Hospital {
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

// marker ikon fix
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png"
});

const customIcon = new L.Icon({
  iconUrl: "/hospital.png",
  iconSize: [45, 45], // genişlik, yükseklik
  iconAnchor: [17, 42], // ikonun ucu
  popupAnchor: [0, -40], // popup konumu
  shadowUrl: undefined
});

export default function Map({ filter }: { filter: HospitalFilter }) {
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
    <div className="w-full h-[80vh] rounded-xl shadow-lg overflow-hidden">
      <MapContainer
        center={[40.4093, 49.8671]}
        zoom={10}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {filteredHospitals.map((hospital) => (
          <Marker
            key={hospital.id}
            position={[hospital.lat, hospital.lng]}
            icon={customIcon}
          >
            <Popup>
              <strong>{hospital.name}</strong><br />
              Tip: {hospital.type}<br />
              {hospital.is24Hours ? "24 Saat Açıq" : "Məhdud Saatlar"}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
} 