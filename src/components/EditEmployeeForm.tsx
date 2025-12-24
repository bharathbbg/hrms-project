"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditEmployeeForm({ employee }: { employee: any }) {
  const router = useRouter();
  
  // Initialize state with the existing data passed from the Server Component
  const [firstName, setFirstName] = useState(employee.firstName);
  const [lastName, setLastName] = useState(employee.lastName);
  const [department, setDepartment] = useState(employee.department);
  
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/employees/${employee._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, department }),
    });

    if (res.ok) {
      router.refresh(); // Refresh data
      router.push("/"); // Navigate back to the dashboard
    }
  };

  return (
    <form onSubmit={handleUpdate} className="bg-white p-6 rounded shadow">
       <div className="mb-4">
         <label className="block text-gray-700 text-sm font-bold mb-2">First Name</label>
         <input 
           value={firstName} 
           onChange={(e) => setFirstName(e.target.value)}
           className="shadow border rounded w-full py-2 px-3 text-gray-700" 
         />
       </div>
       
       <div className="mb-4">
         <label className="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
         <input 
           value={lastName} 
           onChange={(e) => setLastName(e.target.value)}
           className="shadow border rounded w-full py-2 px-3 text-gray-700" 
         />
       </div>

       <div className="mb-4">
         <label className="block text-gray-700 text-sm font-bold mb-2">Department</label>
         <input 
           value={department} 
           onChange={(e) => setDepartment(e.target.value)}
           className="shadow border rounded w-full py-2 px-3 text-gray-700" 
         />
       </div>

       <div className="flex gap-4">
         <button 
           type="submit" 
           className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
         >
           Save Changes
         </button>
         <button 
           type="button"
           onClick={() => router.push("/")}
           className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
         >
           Cancel
         </button>
       </div>
    </form>
  );
}