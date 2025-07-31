import React from "react";

export interface Hospital {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  is24Hours?: boolean;
}

export default function HospitalCard({ hospital }: { hospital: Hospital }) {
   return (
     <div className="border rounded-xl p-4 shadow-md hover:shadow-lg transition duration-200 bg-white">
       <h2 className="text-lg font-bold mb-1 text-gray-800">
         {hospital.name}
       </h2>
       <div className="flex flex-wrap gap-2 text-sm mt-2">
         <span
           className={`px-2 py-1 rounded-full font-medium ${
             hospital.type === "özəl"
               ? "bg-pink-100 text-pink-800"
               : "bg-blue-100 text-blue-800"
           }`}
         >
           {hospital.type}
         </span>
         {hospital.is24Hours && (
           <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
             24 Saat Açıq
           </span>
         )}
       </div>
     </div>
   );
 }