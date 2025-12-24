"use client"; // Needs to be client-side to handle clicks

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

// Define the shape of the data we expect (Interface)
interface EmployeeProps {
    id: string;
    firstName: string;
    lastName: string;
    department: string;
    isActive: boolean;
}

export default function EmployeeCard({
    id,
    firstName,
    lastName,
    department,
    isActive,
}: EmployeeProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this employee?")) return;

        setIsDeleting(true);
        try {
            // We will need to build this API endpoint next!
            const res = await fetch(`/api/employees?id=${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.refresh(); // Refresh the list after deletion
            }
        } catch (error) {
            console.error("Failed to delete", error);
            setIsDeleting(false);
        }
    };

    if (isDeleting)
        return (
            <div className="p-6 bg-gray-100 rounded text-gray-400">Deleting...</div>
        );

    return (
        <div className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex justify-between items-start">
            <div>
                <h2 className="text-xl font-semibold text-gray-900">
                    {firstName} {lastName}
                </h2>
                <p className="text-gray-500">{department}</p>
                <span
                    className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                        isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                >
                    {isActive ? "Active" : "Inactive"}
                </span>
            </div>

            <div className="flex gap-3">
                {/* The Link component is Next.js's optimized replacement for <a href> */}
                <Link
                    href={`/employees/${id}`}
                    className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                >
                    Edit
                </Link>

                <button
                    onClick={handleDelete}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}