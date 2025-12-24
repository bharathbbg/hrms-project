"use client"; // <--- This tells Next.js: "Send this JavaScript to the browser"

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddEmployeeForm() {
  const router = useRouter();
  
  // State: This is how we track inputs in the browser memory
  // Analogy: These are like private fields in a Java class, but with a setter that triggers a UI refresh.
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Stop the form from doing a traditional full-page refresh
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, department }),
      });

      if (res.ok) {
        // Reset form
        setFirstName("");
        setLastName("");
        setEmail("");
        setDepartment("");
        
        // The magic: Refresh the server component without a full browser reload
        router.refresh(); 
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-lg shadow-md border border-gray-100">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Employee</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="p-2 border rounded text-gray-800"
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="p-2 border rounded text-gray-800"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded text-gray-800"
          required
        />
        <input
          type="text"
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="p-2 border rounded text-gray-800"
          required
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? "Adding..." : "Add Employee"}
      </button>
    </form>
  );
}